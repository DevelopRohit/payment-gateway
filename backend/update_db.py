import mysql.connector

# Connect to database
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Rohit@789",
    database="payment_system"
)

cursor = db.cursor()

try:
    # Update password column to VARCHAR(255)
    cursor.execute("ALTER TABLE users MODIFY password VARCHAR(255)")
    print("OK - Updated password column to VARCHAR(255)")
except mysql.connector.Error as e:
    print(f"Error modifying password: {e}")

try:
    # Try to add phone column
    cursor.execute("ALTER TABLE users ADD COLUMN phone VARCHAR(10)")
    print("OK - Added phone column")
except mysql.connector.Error as e:
    if "Duplicate column" in str(e):
        print("Phone column already exists")
    else:
        print(f"Error adding phone: {e}")

try:
    # Try to add created_at column
    cursor.execute("ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    print("OK - Added created_at column")
except mysql.connector.Error as e:
    if "Duplicate column" in str(e):
        print("created_at column already exists")
    else:
        print(f"Error adding created_at: {e}")

db.commit()

# Verify table structure
cursor.execute("DESCRIBE users")
columns = cursor.fetchall()
print("\nCurrent table structure:")
for col in columns:
    print(f"  {col[0]}: {col[1]}")

cursor.close()
db.close()
print("\nOK - Database schema update complete!")
