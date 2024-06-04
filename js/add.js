function openModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('addUserModal').style.display = 'none';
}

function addUser() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    
    // Validación del Username
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        alert('El nombre de usuario debe contener solo caracteres alfanuméricos.');
        return;
    }

    // Validación del Password
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        alert('La contraseña debe tener al menos 8 caracteres e incluir como mínimo una letra mayúscula, una letra minúscula, un número y un carácter especial.');
        return;
    }

    // Validación del Role
    if (!['admin', 'operator'].includes(role)) {
        alert('Rol seleccionado no es válido.');
        return;
    }

    // Datos a enviar
    const formData = { username, password, role };
    fetch('http://192.168.1.37:3001/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken') // Asumiendo que el token está guardado
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Error al registrar el usuario');
        }
    })
    .then(data => {
        alert(data);
        closeModal();
        fetchUsers(); // Actualiza la lista de usuarios
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
}