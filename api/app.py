import io
from flask import Flask, request
from imageClassification import predict
from waitress import serve

app = Flask("Flask Server")


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/test", methods=["GET", "POST"])
def image_classification():
    file = request.files["file"]
    fileBytes = io.BytesIO(file.read())
    return predict(fileBytes, app.logger)


if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=8080)
    serve(app, host="0.0.0.0", port=8080)
