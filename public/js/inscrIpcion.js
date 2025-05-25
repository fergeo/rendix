document.addEventListener('DOMContentLoaded', () => {
const selectCurso = document.getElementById('cursoSeleccionado');
const nombreCurso = document.getElementById('nombreCurso');
const carrera = document.getElementById('carrera');
const dia = document.getElementById('dia');
const horario = document.getElementById('horario');

selectCurso.addEventListener('change', () => {
        const value = selectCurso.value;
        if (value) {
            const [id, nombre, carr, d, h] = value.split('|');
            nombreCurso.value = nombre;
            carrera.value = carr;
            dia.value = d;
            horario.value = h;
        } else {
            nombreCurso.value = '';
            carrera.value = '';
            dia.value = '';
            horario.value = '';
        }
    });
});
