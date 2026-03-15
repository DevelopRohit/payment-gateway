import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Rohit@789",
    database="payment_system"
)
# pip install -r requirements.txt
cursor = db.cursor()