from pydantic import BaseModel

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
