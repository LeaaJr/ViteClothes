# database.py
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL") # Esta sería la variable de entorno principal

print(f"DEBUG: DATABASE_URL cargada: {DATABASE_URL}")

def get_connection():
    # psycopg2.connect puede tomar una URL completa
    if DATABASE_URL is None:
        raise ValueError("DATABASE_URL no está configurada. Por favor, verifica tu archivo .env o variables de entorno.")
    return psycopg2.connect(DATABASE_URL)