from pydantic import BaseModel

class Producto(BaseModel):
    id: int
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
