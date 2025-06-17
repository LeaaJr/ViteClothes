from models import Producto
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
from typing import Optional, Dict
from pydantic import BaseModel
from fastapi import Request
from auth.register import router as register_router
from auth.login import router as login_router
from psycopg2.extras import Json


app = FastAPI()


# Modelo para los talles (otros modelos o en models.py)
class Talle(BaseModel):
    talle: str
    stock: int

# =========================================================================
# CONFIGURACIÓN CRÍTICA DE CORS (ACA)
# =========================================================================
origins = [
    "http://localhost:5173",          #frontend Vite en desarrollo
    "https://vite-clothes.vercel.app", 
    "http://localhost:8000"           #se sirve desde 8000
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# =========================================================================
# FIN DE LA CONFIGURACIÓN CRÍTICA DE CORS
# =========================================================================


# =========================================================================
# INCLUSIÓN DE ROUTERS (UNA SOLA VEZ Y CON PREFIJOS CLAROS)
# =========================================================================
app.include_router(register_router, prefix="/api/auth") # este es el prefijo correcto
app.include_router(login_router)
# =========================================================================
# FIN DE INCLUSIÓN DE ROUTERS
# =========================================================================


# Endpoint real para obtener productos (filtrado por categoría/subcategoría)
@app.get("/productos")
def obtener_productos(categoria: str = None, subcategoria: str = None):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        query = "SELECT id, nombre, categoria, subcategoria, precio, stock, descripcion, img1, img2, img3, destacado, tendencia, talles FROM productos"
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
                "precio": float(row[4]), # Asegúrate de que el tipo de precio sea compatible en tu frontend (float)
                "stock": row[5],
                "descripcion": row[6],
                "img1": row[7],
                "img2": row[8],
                "img3": row[9],
                "destacado": row[10],
                "tendencia": row[11],
                "talles": row[12] if row[12] is not None else {}
            })
        return productos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Endpoint de productos destacados
@app.get("/productos/destacados")
def obtener_productos_destacados():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, nombre, categoria, subcategoria, precio, stock, descripcion, img1, img2, img3, destacado, tendencia, talles FROM productos WHERE destacado = TRUE;")
        rows = cursor.fetchall()
        productos = []
        for row in rows:
            productos.append({
                "id": row[0],
                "nombre": row[1],
                "categoria": row[2],
                "subcategoria": row[3],
                "precio": float(row[4]),
                "stock": row[5],
                "descripcion": row[6],
                "img1": row[7],
                "img2": row[8],
                "img3": row[9],
                "destacado": row[10],
                "tendencia": row[11],
                "talles": row[12] if row[12] is not None else {}
            })
        return productos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos destacados: {str(e)}")
    finally:
        cursor.close()
        conn.close()

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

# Endpoint para agregar un producto
@app.post("/productos")
def agregar_producto(producto: Producto):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            INSERT INTO productos (nombre, categoria, subcategoria, precio, stock, descripcion, img1, img2, img3, destacado, tendencia, talles)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
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
            producto.tendencia,
            Json(producto.talles)
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
            SET nombre = %s,
                categoria = %s,
                subcategoria = %s,
                precio = %s,
                stock = %s,
                descripcion = %s,
                img1 = %s,
                img2 = %s,
                img3 = %s,
                destacado = %s,
                tendencia = %s,
                talles = %s
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
            producto.tendencia,
            Json(producto.talles),
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


# Endpoint para obtener un producto específico por ID (GET /productos/{id})
@app.get("/productos/{id}") # ¡Esta es la que debes mantener
def obtener_producto_por_id(id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT
                id, nombre, categoria, subcategoria, precio, stock,
                descripcion, img1, img2, img3, destacado, tendencia,
                talles
            FROM productos
            WHERE id = %s
        """, (id,))

        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        producto = {
            "id": row[0],
            "nombre": row[1],
            "categoria": row[2],
            "subcategoria": row[3],
            "precio": float(row[4]),
            "stock": row[5],
            "descripcion": row[6],
            "img1": row[7],
            "img2": row[8],
            "img3": row[9],
            "destacado": row[10],
            "tendencia": row[11],
            "talles": row[12] if row[12] is not None else {}
        }
        return producto
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener producto: {str(e)}")
    finally:
        cursor.close()
        conn.close()

# Endpoint de tendencia
@app.get("/productos/tendencia")
def obtener_productos_tendencia():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, nombre, categoria, subcategoria, precio, stock, descripcion, img1, img2, img3, destacado, tendencia, talles FROM productos WHERE tendencia = TRUE;")
        rows = cursor.fetchall()
        productos = []
        for row in rows:
            productos.append({
                "id": row[0],
                "nombre": row[1],
                "categoria": row[2],
                "subcategoria": row[3],
                "precio": float(row[4]),
                "stock": row[5],
                "descripcion": row[6],
                "img1": row[7],
                "img2": row[8],
                "img3": row[9],
                "destacado": row[10],
                "tendencia": row[11],
                "talles": row[12] if row[12] is not None else {}
            })
        return productos
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener productos en tendencia: {str(e)}")
    finally:
        cursor.close()
        conn.close()


# =========================================================================
# NUEVOS ENDPOINTS PARA TALLES
# =========================================================================

@app.post("/productos/{producto_id}/talles")
def agregar_talle(producto_id: int, talle: Talle):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id FROM productos WHERE id = %s", (producto_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        cur.execute("""
            UPDATE productos
            SET talles = COALESCE(talles, '{}'::jsonb) || jsonb_build_object(%s, %s)
            WHERE id = %s
            RETURNING talles
        """, (talle.talle, talle.stock, producto_id))

        updated_talles = cur.fetchone()[0]
        conn.commit()
        return {"talles": updated_talles}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al agregar talle: {e}")
    finally:
        cur.close()
        conn.close()

@app.get("/productos/{producto_id}/talles")
def obtener_talles(producto_id: int):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT talles FROM productos WHERE id = %s", (producto_id,))
        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        talles = result[0] if result[0] is not None else {}
        return {"talles": talles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener talles: {e}")
    finally:
        cur.close()
        conn.close()

@app.delete("/productos/{producto_id}/talles/{talle}")
def eliminar_talle(producto_id: int, talle: str):
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("""
            UPDATE productos
            SET talles = talles - %s
            WHERE id = %s
            RETURNING talles
        """, (talle, producto_id))

        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Producto no encontrado")

        conn.commit()
        return {"talles": result[0]}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar talle: {e}")
    finally:
        cur.close()
        conn.close()