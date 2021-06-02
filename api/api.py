import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image as PillowImage
from io import BytesIO
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2
import uuid
import json
import requests
from flask_jwt_extended import create_access_token, JWTManager, jwt_required
import pymongo

channel = ClarifaiChannel.get_grpc_channel()
stub = service_pb2_grpc.V2Stub(channel)
metadata = (("authorization", os.getenv("CLARIFY_KEY")),)

app = Flask(__name__)


'''client = pymongo.MongoClient(os.getenv("MONGO_ADDR"))
db = client["food_search"]
user = db["users"]'''

jwt = JWTManager(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")

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
    "x-rapidapi-key": os.getenv("RAPID_API_KEY"),
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
}


@app.route("/api/autocomplete-ingredient", methods=["POST"])
def auto_complete():
    querystring = {"query": request.json["query"], "number": "5"}
    response = requests.request("GET", spoonacularBaseUrl + autocompleteSuffix, headers=headers, params=querystring)
    parsed_response = json.loads(response.content)
    ingredients = []
    for ingredient in parsed_response:
        ingredients.append(Ingredient(str(uuid.uuid4()), ingredient.get("name")))
    results = [obj.to_dict() for obj in ingredients]
    return json.dumps({"results": results}), 200


@app.route("/api/search-recipes", methods=["POST"])
def search_recipes():
    joined_ingredients: str = ",".join(request.json["ingredients"])
    querystring = {"ingredients": joined_ingredients, "number": "5", "ignorePantry": "true", "ranking": "1"}
    response = requests.request("GET", spoonacularBaseUrl + recipeSearchSuffix, headers=headers, params=querystring)
    parsed_response = json.loads(response.content)
    recipes = []
    for recipe in parsed_response:
        print(recipe)
        recipes.append(
            Recipe(recipe.get("id"), recipe.get("title"), recipe.get("image"), recipe.get("usedIngredientCount"),
                   recipe.get("missedIngredientCount")))
    results = [obj.to_dict() for obj in recipes]
    return json.dumps({"results": results}), 200

'''
@app.route("/register", methods=["POST"])
def register():
    email = request.form["email"]
    test = user.find_one({"email": email})
    if test:
        return jsonify(message="User Already Exist"), 409
    else:
        first_name = request.form["first_name"]
        last_name = request.form["last_name"]
        password = request.form["password"]
        user_info = dict(first_name=first_name, last_name=last_name, email=email, password=password)
        user.insert_one(user_info)
        return jsonify(message="User added sucessfully"), 201


@app.route("/login", methods=["POST"])
def login():
    if request.is_json:
        email = request.json["email"]
        password = request.json["password"]
    else:
        email = request.form["email"]
        password = request.form["password"]

    test = user.find_one({"email": email, "password": password})
    if test:
        access_token = create_access_token(identity=email)
        return jsonify(message="Login Succeeded!", access_token=access_token), 201
    else:
        return jsonify(message="Bad Email or Password"), 401
'''

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
