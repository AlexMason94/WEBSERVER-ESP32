function login() {
    var username = document.querySelector('[name="username"]').value;
    var password = document.querySelector('[name="password"]').value;



    if (!/^[a-zA-Z0-9]+$/.test(username) || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        alert('Validaciones fallidas para el nombre de usuario o contraseña.');
        return;
    }

    // Si todo está correcto, procede a enviar los datos
    fetch('http://192.168.1.37:3001/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json()) 
        .then(data => {
            localStorage.setItem('accessToken', data.token);

            console.log(data);
    
            if (data.role === 'admin') {
                window.location.href = 'C:/Users/mason/OneDrive/Documentos/Trabajo pasantias/Admin-ESP-01/home.html'; // Página del administrador
            } else {
                document.getElementById('alertModal').style.display = 'block'; // Muestra el modal de alerta
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login fallido: ' + error.message);
        });
    }
    function closeAlertModal() {
        document.getElementById('alertModal').style.display = 'none';
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem('accessToken')) {
            window.location.href = 'home.html'; // Si ya está logueado, redirige al panel
        }
    });
    