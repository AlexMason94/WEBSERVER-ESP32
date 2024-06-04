function toggleUserStatus(user, isActiveCell, toggleButton) {
    const userId = user._id;
    const newState = !user.isActivate;
    const actionUrl = `http://192.168.1.37:3001/api/users/${newState ? 'reactivar' : 'inhabilitar'}/${userId}`;

    fetch(actionUrl, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Falló al cambiar el estado del usuario con estado ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        isActiveCell.textContent = newState ? 'Activo' : 'Desactivado';
        user.isActivate = newState; // Actualiza el estado en el objeto de usuario

        // Actualiza el texto y la función del botón
        toggleButton.textContent = newState ? 'Inhabilitar' : 'Reactivar';
        toggleButton.onclick = () => toggleUserStatus(user, isActiveCell, toggleButton); // Actualiza la función onclick
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error al cambiar el estado del usuario: ${error.message}`);
    });
}
