const favoriteBtn = document.querySelector('.favorite-btn');

favoriteBtn.addEventListener('click', () => {
    // Obtener el trekking ID almacenado en el atributo de datos
    const trekkingId = favoriteBtn.getAttribute('data-trekking-id');

    // Realizar una solicitud POST al servidor para guardar el trekking como favorito
    fetch('/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ trekkingRoute: trekkingId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Trekking added to favorites:', data);
        // Puedes mostrar un mensaje de éxito o actualizar la vista de alguna manera
        window.location.href = "/favorites";
    })
    .catch(error => {
        console.error('Error adding trekking to favorites:', error);
        // Puedes manejar el error de alguna manera si lo deseas
    });
});
