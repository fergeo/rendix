# 🎓 Rendix - Plataforma Educativa

**Desarrollo de la API y sistema web para la gestión educativa de Rendix.**

---

## 📋 Descripción General

Rendix es una plataforma educativa diseñada para gestionar cursos, carreras, inscripciones, asistencias y comunicaciones entre estudiantes y personal administrativo.

Este sistema fue desarrollado como parte del segundo parcial de la materia **Desarrollo Web BackEnd**, integrando autenticación segura, conexión a base de datos en la nube, pruebas automáticas y despliegue en servicios como Vercel y Render.

---

## 🚀 Funcionalidades Principales

### 🔐 Autenticación
- Login seguro para administradores y alumnos.
- Contraseñas cifradas con **bcrypt**.
- Autenticación con **JWT** y middleware de protección.

### 🎓 Gestión de Cursos
- Alta, modificación, consulta y baja de cursos y carreras.
- Control de capacidad y cantidad de inscriptos.

### 📝 Gestión de Inscripciones
- Registro completo de estudiantes con datos personales.
- Relación automática entre estudiantes, usuarios e inscripciones.
- Modificación, consulta y baja de inscripciones.
- Sistema de **lista de espera** cuando se supera la capacidad del curso.

### 📅 Control de Asistencias
- Registro de asistencias por alumno y curso.
- Visualización de asistencias por parte del administrador.

### 👨‍🎓 Pantalla del Alumno
- Visualización de cursos en los que está inscripto.
- Botón para dar asistencia desde su sesión.

---

## 🛠️ Tecnologías Utilizadas

| Herramienta       | Propósito                                      |
|-------------------|-----------------------------------------------|
| Node.js           | Entorno de ejecución para JavaScript         |
| Express.js        | Framework web para crear la API REST         |
| MongoDB Atlas     | Base de datos NoSQL en la nube               |
| Mongoose          | ODM para MongoDB                             |
| JWT               | Autenticación basada en tokens               |
| Bcrypt            | Cifrado de contraseñas                       |
| Pug               | Motor de plantillas para el FrontEnd         |
| Jest / Supertest  | Testing automatizado                         |
| Thunder Client    | Pruebas manuales de la API REST              |
| Vercel / Render   | Despliegue del proyecto en la nube           |

---

## 📂 Estructura del Proyecto

/controllers # Lógica de negocio
/models # Modelos de datos (Mongoose)
/routes # Rutas de Express
/views # Vistas dinámicas (Pug)
/middlewares # Autenticación y validaciones
/tests # Pruebas automatizadas con Jest
/public # Recursos estáticos
app.js # Archivo principal


---

## 🧪 Testing

- ✅ Pruebas automáticas con **Jest** y **Supertest** para el módulo de autenticación.
- ✅ Pruebas manuales con **Thunder Client** para cursos, inscripciones y asistencia.
- ⚙️ Scripts para testeo local:  
  ```bash
  npm test

---

🌐 Despliegue
Plataforma	Enlace
🔗 GitHub	Repositorio
🚀 Render	https://rendix.onrender.com
⚡ Vercel	https://rendix-roan.vercel.app

---

📄 Documentación

👉 [https://drive.google.com/drive/u/0/folders/1jvcEFzV-Nv2JHYDEFhy6evM6o2ygj7o5](https://drive.google.com/file/d/1qReoWjhkNLwD4w0AoMLWszqshxwaCLYi/view?usp=drive_link)

---

🎥 Video del Coloquio

👉 https://drive.google.com/file/d/1FWGacRK6xxU4pzQClvNJwizYvMrFKlCa/view?usp=sharing

---
👨‍💻 Autor

    Fernando G. Espindola O.

        Backend, modelado de datos, autenticación y seguridad.

        Testing, documentación, interfaz con Pug y despliegue.
