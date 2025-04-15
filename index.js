import express from "express";
import fs from "fs";
import cursos from "/controller/cursos.js";

const app = express();

readDataCursos();

app.get("/", (req,res) => {
    res.send("Bienvenido a Rendix");
});

app.listen(3000, () => {
    console.log("Servidor escuchando");
});