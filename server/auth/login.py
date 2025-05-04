from fastapi import APIRouter, HTTPException
from database import get_connection  # ✅ asegurate que 'database.py' esté en el mismo nivel que main.py
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

    cur.execute("SELECT hashed_password FROM usuarios WHERE email = %s", (user.email,))
    result = cur.fetchone()

    if result is None:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_password = result[0]

    if not pwd_context.verify(user.password, hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {"message": "Login successful", "user": user.email}
