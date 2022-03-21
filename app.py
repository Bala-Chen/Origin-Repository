from flask import *
from view.api import api
import json

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key = "test123"

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

@app.errorhandler(404)
def resource_not_found(e):
    return json.dumps({"error":True,"message":"404"}), 404

@app.errorhandler(500)
def resource_not_found(e):
    return json.dumps({"error":True,"message":"500"}), 500

if __name__ == "__main__":
    app.register_blueprint(api)
    app.run(host="0.0.0.0",port=3000)