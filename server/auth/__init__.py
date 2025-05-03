from fastapi import FastAPI
from auth.register import router as register_router

app = FastAPI()
app.include_router(register_router)
