# register.py
import psycopg2
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from typing import Optional # Keep if needed elsewhere, but not directly for this change
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Assuming 'app' is defined and imported in your main.py and register_router is included there.
# If this line is actually in register.py, it's incorrect. It should be in your main FastAPI app file.
# app.include_router(register_router, prefix="/api") 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SignUpModel(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    confirm_password: str
    name: str = Field(..., min_length=2)
    surname: str = Field(..., min_length=2)
    privacyPolicy: bool = Field(..., alias="acceptTerms")

    class Config:
        allow_population_by_field_name = True

@router.post("/signup")
def signup(user: SignUpModel):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if not user.privacyPolicy:
        raise HTTPException(status_code=400, detail="You must accept the privacy policy")

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

        # Agrega un nuevo usuario, ahora incluyendo is_admin con valor por defecto FALSE
        cursor.execute("""
            INSERT INTO usuarios (email, hashed_password, name, surname, is_admin)
            VALUES (%s, %s, %s, %s, FALSE) -- Explicitly set is_admin to FALSE for new registrations
        """, (user.email, hashed_password, user.name, user.surname))
        
        conn.commit()
        cursor.close()
        conn.close()

        return {"message": "User registered successfully", "user": user.name}

    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")