from app.db.session import engine
from sqlalchemy import text

with engine.begin() as conn:
    try:
        conn.execute(text("ALTER TABLE messages ADD COLUMN status VARCHAR DEFAULT 'sent'"))
        print("Column 'status' added successfully.")
    except Exception as e:
        print("Error (might already exist):", e)
