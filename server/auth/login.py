# login.py
from fastapi import APIRouter, HTTPException
from database import get_connection # Ensure this function correctly provides your psycopg2 connection
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Modelo del cuerpo del request
class SignInModel(BaseModel):
    email: EmailStr
    password: str

@router.post("/users/login")
def signin(user_credentials: SignInModel): # Renamed 'user' to 'user_credentials' for clarity
    conn = get_connection()
    cur = conn.cursor()

    # MODIFIED: Select 'is_admin' column as well
    cur.execute("""
        SELECT id, email, name, surname, hashed_password, is_admin
        FROM usuarios 
        WHERE email = %s
    """, (user_credentials.email,))
    result = cur.fetchone()

    if result is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Unpack the result, including the new is_admin field
    user_id, email, name, surname, hashed_password, is_admin = result 

    if not pwd_context.verify(user_credentials.password, hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # MODIFIED: Include 'is_admin' in the returned user object
    return {
        "message": "Login successful",
        "user": {
            "id": user_id,
            "email": email,
            "name": name,
            "surname": surname,
            "is_admin": is_admin # Include the admin status
        }
    }