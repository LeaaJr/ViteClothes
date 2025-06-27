from pydantic import BaseModel
from fastapi import HTTPException
from typing import Dict, Optional

class Producto(BaseModel):
    nombre: str
    categoria: str
    subcategoria: str
    precio: float
    stock: int
    descripcion: str
    img1: str
    img2: str
    img3: str
    destacado: bool
    tendencia: bool
    talles: Optional[Dict[str, int]] = None  # Campo para los talles