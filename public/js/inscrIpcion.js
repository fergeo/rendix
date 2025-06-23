document.addEventListener('DOMContentLoaded', () => {
  const selectCurso = document.getElementById('cursoSeleccionado');
  const nombreCursoInput = document.getElementById('nombreCurso');
  const carreraInput = document.getElementById('carrera');
  const diaInput = document.getElementById('dia');
  const horarioInput = document.getElementById('horario');

  selectCurso.addEventListener('change', () => {
    const cursoId = selectCurso.value;

    if (!cursoId) {
      nombreCursoInput.value = '';
      carreraInput.value = '';
      diaInput.value = '';
      horarioInput.value = '';
      return;
    }

    const curso = cursos.find(c => c._id === cursoId);

    if (curso) {
      nombreCursoInput.value = curso.nombre || '';
      carreraInput.value = curso.carrera || '';
      diaInput.value = curso.dia || '';
      horarioInput.value = curso.horario || '';
    } else {
      nombreCursoInput.value = '';
      carreraInput.value = '';
      diaInput.value = '';
      horarioInput.value = '';
    }
  });
});
