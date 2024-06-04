function logout() {
    localStorage.removeItem('accessToken'); // Elimina el token de acceso
    window.location.href = 'index.html'; // Redirige al usuario al inicio de sesión
}

