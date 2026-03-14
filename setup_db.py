#!/usr/bin/env python3
"""
Database setup script for Personal Finance Dashboard
This script initializes the SQLite database with schema and seed data.
"""

import sqlite3
import os

def setup_database():
    """Initialize the database with schema and seed data"""

    # Database file path
    db_path = os.path.join(os.path.dirname(__file__), 'finance_dashboard.db')

    # Remove existing database if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print("Removed existing database file")

    # Connect to database (this will create the file)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Read and execute schema
    schema_path = os.path.join(os.path.dirname(__file__), 'database', 'schema.sql')
    with open(schema_path, 'r') as f:
        schema_sql = f.read()

    print("Creating database schema...")
    cursor.executescript(schema_sql)
    conn.commit()

    # Read and execute seed data
    seed_path = os.path.join(os.path.dirname(__file__), 'database', 'seed_data.sql')
    with open(seed_path, 'r') as f:
        seed_sql = f.read()

    print("Seeding database with sample data...")
    cursor.executescript(seed_sql)
    conn.commit()

    # Verify data was inserted
    cursor.execute("SELECT COUNT(*) as count FROM transactions")
    transaction_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) as count FROM users")
    user_count = cursor.fetchone()[0]

    cursor.close()
    conn.close()

    print("✅ Database setup complete!")
    print(f"   - Users: {user_count}")
    print(f"   - Transactions: {transaction_count}")
    print(f"   - Database file: {db_path}")

if __name__ == "__main__":
    setup_database()