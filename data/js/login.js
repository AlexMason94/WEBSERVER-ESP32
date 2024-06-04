function login() {
    var username = document.querySelector('[name="username"]').value;
    var password = document.querySelector('[name="password"]').value;

    var usernameRegex = /^[a-zA-Z0-9]+$/;
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameRegex.test(username)) {
        alert('El nombre de usuario debe contener sólo caracteres alfanuméricos.');
        return;
    }

    if (!passwordRegex.test(password)) {
        alert('La contraseña debe tener al menos 8 caracteres e incluir como mínimo una letra mayúscula, una letra minúscula, un número y un carácter especial.');
        return;
    }

    fetch('http://192.168.1.29:3001/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        localStorage.setItem('accessToken', data.token);
        window.location.href = '/home.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Login fallido: ' + error.message);
    });
}
