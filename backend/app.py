from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Rohit@789",
    database="payment_system"
)

cursor = db.cursor()

@app.route("/")
def home():
    return jsonify({"message":"Backend Running"})


@app.route("/send-money", methods=["POST"])
def send_money():

    data = request.json

    mobile = data["mobile"]
    amount = data["amount"]

    sql = "INSERT INTO transactions(sender,amount) VALUES(%s,%s)"

    cursor.execute(sql,(mobile,amount))
    db.commit()

    return jsonify({"message":"Payment Successful"})

@app.route("/recharge", methods=["POST"])
def recharge():

    data = request.json

    mobile = data["mobile"]
    amount = data["amount"]

    sql = "INSERT INTO recharge(mobile,amount) VALUES(%s,%s)"

    cursor.execute(sql,(mobile,amount))
    db.commit()

    return jsonify({"message":"Recharge Successful"})

if __name__ == "__main__":
    app.run(port=5000,debug=True)