from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
from typing import Optional
from models import Producto
from fastapi import Request


app = FastAPI()

# Configurar CORS para permitir conexión con tu frontend
origins = [
    "http://localhost:3000",  # React en Vite suele correr en este puerto
]

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # o ["*"] para permitir todo (no recomendado en producción)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint real para obtener productos


@app.get("/productos")
def obtener_productos(categoria: str = None, subcategoria: str = None):
    conn = get_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM productos"
    params = []

    if categoria and subcategoria:
        query += " WHERE categoria = %s AND subcategoria = %s"
        params = [categoria, subcategoria]
    elif categoria:
        query += " WHERE categoria = %s"
        params = [categoria]
    elif subcategoria:
        query += " WHERE subcategoria = %s"
        params = [subcategoria]

    cursor.execute(query, params)
    rows = cursor.fetchall()
    productos = []
    for row in rows:
        productos.append({
            "id": row[0],
            "nombre": row[1],
            "categoria": row[2],
            "subcategoria": row[3],
            "precio": row[4],
            "stock": row[5],
            "descripcion": row[6],
            "img1": row[7],
            "img2": row[8],
            "img3": row[9],
            "destacado": row[10],
        })
    conn.close()
    return productos


# Endpoint de productos destacados
@app.get("/productos/destacados")
def obtener_productos_destacados():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM productos WHERE destacado = TRUE;")
    rows = cursor.fetchall()
    productos = []
    for row in rows:
        productos.append({
            "id": row[0],
            "nombre": row[1],
            "categoria": row[2],
            "subcategoria": row[3],
            "precio": row[4],
            "stock": row[5],
            "descripcion": row[6],
            "img1": row[7],
            "img2": row[8],
            "img3": row[9],
            "destacado": row[10],
        })
    conn.close()
    return productos


# Para hacer un put:

@app.post("/productos")
def agregar_producto(producto: Producto):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO productos (nombre, categoria, subcategoria, precio, stock, descripcion, img1, img2, img3, destacado)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            producto.nombre,
            producto.categoria,
            producto.subcategoria,
            producto.precio,
            producto.stock,
            producto.descripcion,
            producto.img1,
            producto.img2,
            producto.img3,
            producto.destacado
        ))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al agregar producto: {e}")
    finally:
        cur.close()
        conn.close()

    return {"message": "Producto agregado correctamente"}

# Endopint para hacer el put (edit):

@app.put("/productos/{id}")
def actualizar_producto(id: int, producto: Producto):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE productos
            SET nombre = %s, categoria = %s, subcategoria = %s, precio = %s,
                stock = %s, descripcion = %s, img1 = %s, img2 = %s, img3 = %s, destacado = %s
            WHERE id = %s
        """, (
            producto.nombre,
            producto.categoria,
            producto.subcategoria,
            producto.precio,
            producto.stock,
            producto.descripcion,
            producto.img1,
            producto.img2,
            producto.img3,
            producto.destacado,
            id
        ))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar producto: {e}")
    finally:
        cur.close()
        conn.close()

    return {"message": "Producto actualizado correctamente"}

# Endpoint DELETE:

@app.delete("/productos/{id}")
def eliminar_producto(id: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM productos WHERE id = %s", (id,))
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar producto: {e}")
    finally:
        cur.close()
        conn.close()

    return {"message": "Producto eliminado correctamente"}
