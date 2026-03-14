import os
import sqlite3

class Config:
    DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///finance_dashboard.db')
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')