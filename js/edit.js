function editUser(userId) {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        alert("No se encontró token de acceso. Por favor, inicie sesión nuevamente.");
        return;
    }

    fetch(`http://192.168.1.37:3001/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    })
    
    .then(response => {
        if (!response.ok) throw new Error(`Falló al obtener los detalles del usuario con estado ${response.status}`);
        return response.json();
    })
    .then(user => {
        document.getElementById('editUserId').value = user._id;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editRole').value = user.role;
        document.getElementById('editUserModal').style.display = 'block';
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
        alert(`Error al cargar la información del usuario: ${error.message}`);
    });
}
function updateUser() {
    const userId = document.getElementById('editUserId').value;
    const username = document.getElementById('editUsername').value;
    const password = document.getElementById('editPassword').value;
    const role = document.getElementById('editRole').value;

    // Validaciones
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (username && !usernameRegex.test(username)) {
        alert('El nombre de usuario debe contener solo caracteres alfanuméricos.');
        return;
    }

    if (password && !passwordRegex.test(password)) {
        alert('La contraseña debe tener al menos 8 caracteres e incluir como mínimo una letra mayúscula, una letra minúscula, un número y un carácter especial.');
        return;
    }

    fetch(`http://192.168.1.37:3001/api/users/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, role })
    })
    .then(response => {
        if (!response.ok) throw new Error('Falló la actualización del usuario');
        return response.json();
    })
    .then(data => {
        alert('Usuario actualizado correctamente');
        closeEditModal();
        location.reload(); // O actualiza la lista sin recargar
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el usuario: ' + error.message);
    });
}

function closeEditModal() {
    document.getElementById('editUserModal').style.display = 'none';
    document.getElementById('editUserId').value = '';
    document.getElementById('editUsername').value = '';
    document.getElementById('editPassword').value = '';
    document.getElementById('editRole').value = '';
}
