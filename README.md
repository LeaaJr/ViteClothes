# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

This project is a SPA, the backend is built in py, and various libraries were used such as fastapi, fastapi, bcrypt, Flask, psycopg2, python-dotenv, etc.
Additionally, axios was used to connect the backend and frontend through an API, and finally Stripe was used to create a payment gateway.
The frontend is built in React Vite, and various libraries were used such as react-router, lucide-react, mui/material, etc.
Styles components were used.

## In case of cloning the repository

install "npm install" dependencies

modify the file Productos.jsx 

with the database you wish to connect, this is done with PostgreSQL

If you run the DB, it works with "uvicorn main:app --reload"

and on the other hand start the application normally


![image](https://github.com/user-attachments/assets/2299af2f-7761-44d9-a34c-1920ff4586f7)

![image](https://github.com/user-attachments/assets/d1961859-65e9-407b-9def-77c94591e72c)

![image](https://github.com/user-attachments/assets/5fc4f8df-0949-4f1e-a7f8-c36e57589f5c)

![image](https://github.com/user-attachments/assets/fc4f9bc3-58f8-42c4-833e-bb10d9eddb0d)

![image](https://github.com/user-attachments/assets/6c52f1f2-ed9d-4c19-8a8c-970ca53052a7) ![image](https://github.com/user-attachments/assets/86100b34-4a80-474c-b896-20db24b8b972)
![image](https://github.com/user-attachments/assets/63295976-1f17-4200-a552-0d963e9e35cd) ![image](https://github.com/user-attachments/assets/3ee6c518-a43f-46e8-a2a8-30499a0fc550)






## Interface

![image](https://github.com/user-attachments/assets/9dc02369-5aa1-4818-89dc-9d4e603b79f0)

![image](https://github.com/user-attachments/assets/14976f05-be8b-4e3e-9b65-18796ed1577c)

An admin logs in via /admin/login

They navigate to /admin/products-list

They see a list of all products

For any product they want to edit, they click an "Edit" button, which takes them to /admin/edit-product/{{product.id}}
