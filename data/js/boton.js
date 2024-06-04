document.addEventListener('DOMContentLoaded', function () {
    const switchElement = document.querySelector('#interruptor');

    switchElement.addEventListener('change', function() {
        const state = this.checked ? "1" : "0"; // Si está checked envía 1, sino 0
        fetch(`http://192.168.1.35/toggleLED?state=${state}`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to toggle LED');
            return response.text();
        })
        .then(data => {
            console.log(data);
            if (state == "1") {
                // Inicia un temporizador para apagar el LED automáticamente
                setTimeout(() => {
                    switchElement.checked = false;  // Cambia el estado del interruptor a "cerrado"
                    console.log("LED auto-turned off");
                }, 3000);  // 5 segundos
            }
        })
        .catch(error => console.error('Error:', error));
    });
});