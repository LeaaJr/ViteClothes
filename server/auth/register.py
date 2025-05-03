import psycopg2
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()  # para leer variables del .env

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SignUpModel(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str
    day: int
    month: int
    year: int
    acceptTerms: bool

@router.post("/signup")
def signup(user: SignUpModel):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if not user.acceptTerms:
        raise HTTPException(status_code=400, detail="You must accept the terms")

    hashed_password = pwd_context.hash(user.password)

    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )
        cursor = conn.cursor()

        # Verificar si el usuario ya existe
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")

        # Insertar el nuevo usuario
        cursor.execute("""
            INSERT INTO usuarios (email, hashed_password, birth_day, birth_month, birth_year)
            VALUES (%s, %s, %s, %s, %s)
        """, (user.email, hashed_password, user.day, user.month, user.year))
        
        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "User registered successfully", "user": user.email}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
