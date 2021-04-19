import json
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_pb2, status_code_pb2
from flask import Flask, request, render_template
from flask_cors import CORS, cross_origin

channel = ClarifaiChannel.get_grpc_channel()
stub = service_pb2_grpc.V2Stub(channel)
metadata = (('authorization', 'Key 6c48b3b707844ce0898a00ef7ff57ee1'),)

app = Flask(__name__)
CORS(app)

class Prediction:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def to_dict(self):
        return {"name": self.name, "score": self.score}


@app.route('/api/test', methods=['GET'])
def test():
    return 'test'

@app.route('/api/search-ingredients', methods=['POST'])
def search():
    img = Image.open(request.files['image'])
    print(img)
    response = stub.PostModelOutputs(
        service_pb2.PostModelOutputsRequest(
            model_id="bd367be194cf45149e75f01d59f77ba7",
            inputs=[
                resources_pb2.Input(
                    data=resources_pb2.Data(
                        image=resources_pb2.Image(
                            url="https://www.efsa.europa.eu/sites/default/files/styles/share_opengraph/public/2021-03/food-ingredients-packaging.jpg"
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
        predictions.append(Prediction(concept.name, concept.value))

    results = [obj.to_dict() for obj in predictions]

    return json.dumps({"results": results})


if __name__ == '__main__':
    app.run(host='127.0.0.1')
