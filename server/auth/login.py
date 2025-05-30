from fastapi import APIRouter, HTTPException
from database import get_connection
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Modelo del cuerpo del request
class SignInModel(BaseModel):
    email: EmailStr
    password: str

@router.post("/signin")
def signin(user: SignInModel):
    conn = get_connection()
    cur = conn.cursor()

    # Modifica esta consulta para obtener más campos del usuario
    cur.execute("""
        SELECT id, email, name, surname, hashed_password 
        FROM usuarios 
        WHERE email = %s
    """, (user.email,))
    result = cur.fetchone()

    if result is None:
        raise HTTPException(status_code=404, detail="User not found")

    user_id, email, name, surname, hashed_password = result

    if not pwd_context.verify(user.password, hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Devuelve todos los datos relevantes del usuario
    return {
        "message": "Login successful",
        "user": {
            "id": user_id,
            "email": email,
            "name": name,
            "surname": surname
        }
    }