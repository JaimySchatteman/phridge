from flask import Flask, request
from flask_cors import CORS
from PIL import Image as PillowImage
from io import BytesIO
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2
import uuid
import json
import requests

channel = ClarifaiChannel.get_grpc_channel()
stub = service_pb2_grpc.V2Stub(channel)
metadata = (("authorization", "Key c26806a710ac48f9a74e357cdbec5c90"),)

app = Flask(__name__)
CORS(app)


class Prediction:
    def __init__(self, id, name, accuracy, is_checked):
        self.id: str = id
        self.name: name = name
        self.accuracy: float = accuracy
        self.isChecked: bool = is_checked

    def to_dict(self):
        return {"id": self.id, "name": self.name, "accuracy": round(self.accuracy, 2) * 100,
                "isChecked": self.accuracy > 0.85}


class Ingredient:
    def __init__(self, id, name):
        self.id: int = id
        self.name: str = name

    def to_dict(self):
        return {"id": self.id, "name": self.name.lower(), "isChecked": True}


class Recipe:
    def __init__(self, id, title, image, used_ingredient_count, missed_ingredient_count):
        self.id: int = id
        self.title: str = title
        self.image: str = image
        self.used_ingredient_count: int = used_ingredient_count
        self.missed_ingredient_count: int = missed_ingredient_count

    def to_dict(self):
        return {"id": self.id, "title": self.title, "image": self.image,
                "usedIngredientCount": self.used_ingredient_count,
                "missedIngredientCount": self.missed_ingredient_count}


@app.route("/api/search-ingredients", methods=["POST"])
def search():
    image = request.files["image"]
    with PillowImage.open(image.stream) as i:
        buffer = BytesIO()
        i.save(buffer, format="JPEG")
        file_bytes = buffer.getvalue()

    response = stub.PostModelOutputs(
        service_pb2.PostModelOutputsRequest(
            model_id="bd367be194cf45149e75f01d59f77ba7",
            inputs=[
                resources_pb2.Input(
                    data=resources_pb2.Data(
                        image=resources_pb2.Image(
                            base64=file_bytes
                        )
                    )
                )
            ]
        ),
        metadata=metadata
    )
    if response.status.code != status_code_pb2.SUCCESS:
        raise Exception("Post model outputs failed, status: " + response.status.description)
    output = response.outputs[0]
    predictions = []
    for concept in output.data.concepts:
        predictions.append(Prediction(concept.id, concept.name, concept.value, False))
    results = [obj.to_dict() for obj in predictions]

    return json.dumps({"results": results}), 200


spoonacularBaseUrl: str = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/"
autocompleteSuffix: str = "food/ingredients/autocomplete"
recipeSearchSuffix: str = "recipes/findByIngredients"

headers = {
    "x-rapidapi-key": "b620394a8emshf08053c74d069b7p12fb7cjsne38c5e470d00",
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
}


@app.route("/api/autocomplete-ingredient", methods=["POST"])
def auto_complete():
    querystring = {"query": request.json["query"], "number": "5"}
    response = requests.request("GET", spoonacularBaseUrl + autocompleteSuffix, headers=headers, params=querystring)
    parsed_response = json.loads(response.content)

    ingredients = []
    for ingredient in parsed_response:
        print(ingredient)
        ingredients.append(Ingredient(str(uuid.uuid4()), ingredient.get("name")))

    results = [obj.to_dict() for obj in ingredients]

    return json.dumps({"results": results}), 200


@app.route("/api/search-recipes", methods=["POST"])
def search_recipes():
    print(request.json["ingredients"])
    joined_ingredients: str = ",".join(request.json["ingredients"])
    querystring = {"ingredients": joined_ingredients, "number": "5", "ignorePantry": "true", "ranking": "1"}
    print(querystring)
    response = requests.request("GET", spoonacularBaseUrl + recipeSearchSuffix, headers=headers, params=querystring)
    parsed_response = json.loads(response.content)
    print(parsed_response)
    recipes = []
    for recipe in parsed_response:
        print(recipe)
        recipes.append(
            Recipe(recipe.get("id"), recipe.get("title"), recipe.get("image"), recipe.get("usedIngredientCount"),
                   recipe.get("missedIngredientCount")))

    results = [obj.to_dict() for obj in recipes]

    return json.dumps({"results": results}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0")
