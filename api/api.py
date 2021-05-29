import json
from PIL import Image as PillowImage
from io import BytesIO
from clarifai_grpc.channel.clarifai_channel import ClarifaiChannel
from clarifai_grpc.grpc.api import resources_pb2, service_pb2, service_pb2_grpc
from clarifai_grpc.grpc.api.status import status_code_pb2
from flask import Flask, request
from flask_cors import CORS

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


@app.route('/api/search-ingredients', methods=['POST'])
def search():
    print('wattaaafaaaakkkk')
    image = request.files['image']
    print('hallo')
    with PillowImage.open(image.stream) as i:
        buffer = BytesIO()
        i.save(buffer, format='JPEG')
        file_bytes = buffer.getvalue()

    print('image extracted')

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
    print(response)

    if response.status.code != status_code_pb2.SUCCESS:
        raise Exception("Post model outputs failed, status: " + response.status.description)

    output = response.outputs[0]

    predictions = []
    for concept in output.data.concepts:
        predictions.append(Prediction(concept.name, concept.value))

    results = [obj.to_dict() for obj in predictions]

    return json.dumps({"results": results})


if __name__ == '__main__':
    app.run(host='0.0.0.0')
