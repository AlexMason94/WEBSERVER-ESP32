document.addEventListener('DOMContentLoaded', function() {
  const interruptor = document.getElementById('interruptor');
  interruptor.addEventListener('change', function() {
    console.log(this.checked ? 'Interruptor activado' : 'Interruptor desactivado');
    // Aquí agregar la lógica para interactuar con el ESP
  });
});