import os

import mysql.connector
from dotenv import load_dotenv

load_dotenv()

db = mysql.connector.connect(
    host=os.getenv("DB_HOST", "localhost"),
    user=os.getenv("DB_USER", "root"),
    password=os.getenv("DB_PASSWORD", ""),
    database=os.getenv("DB_NAME", "payment_system"),
)

cursor = db.cursor()

try:
    cursor.execute("ALTER TABLE users MODIFY password VARCHAR(255)")
    print("Updated password column to VARCHAR(255)")
except mysql.connector.Error as error:
    print(f"Password column update skipped: {error}")

try:
    cursor.execute("ALTER TABLE users ADD COLUMN phone VARCHAR(10)")
    print("Added phone column")
except mysql.connector.Error as error:
    if "Duplicate column" in str(error):
        print("Phone column already exists")
    else:
        print(f"Phone column update skipped: {error}")

try:
    cursor.execute(
        "ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
    )
    print("Added created_at column")
except mysql.connector.Error as error:
    if "Duplicate column" in str(error):
        print("created_at column already exists")
    else:
        print(f"created_at update skipped: {error}")

try:
    cursor.execute(
        "ALTER TABLE users ADD COLUMN balance DECIMAL(10,2) NOT NULL DEFAULT 5000.00"
    )
    print("Added balance column")
except mysql.connector.Error as error:
    if "Duplicate column" in str(error):
        print("Balance column already exists")
    else:
        print(f"Balance update skipped: {error}")

db.commit()

cursor.execute("DESCRIBE users")
columns = cursor.fetchall()
print("\nCurrent table structure:")

for column in columns:
    print(f"  {column[0]}: {column[1]}")

cursor.close()
db.close()
print("\nDatabase schema update complete")
