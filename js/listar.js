function fetchUsers() {
    const accessToken = localStorage.getItem('accessToken'); // Obtener el token del localStorage
    if (!accessToken) {
        console.error('No access token found');
        return; // Salir si no hay token
    }
    fetch('http://192.168.1.37:3001/api/users/', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(users => {
        console.log("Respuesta recibida:", users);
        displayUsers(users);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al recuperar usuarios: ' + error);
    });
}

function displayUsers(users) {
    console.log("Usuarios recibidos:", users);
    const table = document.getElementById('usersTable');
// Limpia la tabla antes de agregar nuevas filas
table.innerHTML = `
<tr>
    <th>Usuario</th>
    <th>Rol</th>
    <th>Estado</th>
    <th>Fecha de Creación</th>
    <th>Acciones</th>
</tr>
`; // Agrega los encabezados de la tabla

users.forEach(user => {
const row = table.insertRow(-1); // Inserta una nueva fila al final de la tabla
const usernameCell = row.insertCell(0);
const roleCell = row.insertCell(1);
const isActiveCell = row.insertCell(2);
const createdAtCell = row.insertCell(3);
const actionsCell = row.insertCell(4); // Celda para el botón de edición

usernameCell.textContent = user.username;
roleCell.textContent = user.role;
isActiveCell.textContent = user.isActivate ? 'Activo' : 'Inactivo';
createdAtCell.textContent = new Date(user.createdAt).toLocaleDateString(); // Formatea la fecha

// Crear el botón de edición y agregarlo a la celda de acciones
const editButton = document.createElement('button');
editButton.className = 'edit-button'; // Aplica la clase al botón
editButton.innerHTML = '<img src="../images/icono.png" id="icono-edit" alt="Editar"/>'; // Asegúrate de que la ruta sea accesible
editButton.onclick = function() { editUser(user._id); }; // Función de edición pasando el ID del usuario
actionsCell.appendChild(editButton);

// Crear el botón de cambio de estado y agregarlo a la celda de acciones
const toggleStatusButton = document.createElement('button');
toggleStatusButton.textContent = user.isActivate ? 'Inhabilitar' : 'Reactivar';
toggleStatusButton.onclick = () => toggleUserStatus(user, isActiveCell, toggleStatusButton);
actionsCell.appendChild(toggleStatusButton);
});
}

// Llamar a fetchUsers cuando la página cargue
document.addEventListener('DOMContentLoaded', fetchUsers);

document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        window.location.href = 'index.html'; // Redirige si no hay token
    }
});
