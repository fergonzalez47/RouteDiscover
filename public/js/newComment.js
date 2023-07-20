// Obtener elementos del DOM
const newCommentBtn = document.getElementById('new-comment-btn');
const commentPopup = document.getElementById('comment-popup');
const closePopup = document.getElementById('close-popup');
const publishBtn = document.getElementById('publish-btn');
const commentForm = document.getElementById('comment-form');
const cancelBtn = document.getElementById('cancel-btn');
const errorMessage = document.querySelector(".error-comment");


// Mostrar la ventana emergente al hacer clic en "New Comment"
newCommentBtn.addEventListener('click', function () {
    commentPopup.style.display = 'block';
    comment.value = ''; // Limpiar el contenido del textarea al cerrar la ventana emergente
});

// Cerrar la ventana emergente al hacer clic en la "X"
closePopup.addEventListener('click', function () {
    commentPopup.style.display = 'none';
});

// Cerrar la ventana emergente al hacer clic en "Cancelar"
cancelBtn.addEventListener('click', function () {
    commentPopup.style.display = 'none';
});

// Manejar el envío del formulario al hacer clic en "Publicar"
commentForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Obtener los valores del formulario
    const trekkingRouteID = document.getElementById('trekkingRouteID').value;
    const comment = document.getElementById('comment').value;
    if (comment != "") {

        // Enviar los datos al controlador en Node.js
        fetch('/trails/comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ trekkingRouteID, comment })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Comment posted:', data);
                commentPopup.style.display = 'none';
                comment.value = '';
                errorMessage.style.display = 'none';
                // Aquí puedes realizar alguna acción adicional después de publicar el comentario
            })
            .catch(error => {
                console.error('Error posting comment:', error);
                // Aquí puedes manejar el error de alguna manera si lo deseas
            });

        commentPopup.style.display = 'none';
        comment.value = ''; // Limpiar el contenido del textarea al cerrar la ventana emergente
        errorMessage.style.display = 'none';
    } else {
        errorMessage.style.display = 'block';
    }
});


//code to show all comments


// Obtener el ID del sendero del elemento oculto en la plantilla
const trailId = document.getElementById("trekkingRouteID").value;

// Realizar una solicitud GET para obtener los comentarios del sendero
fetch(`/trails/comments/${trailId}`)
    .then((response) => response.json())
    .then((data) => {
        const commentsSection = document.querySelector(".comments");
        commentsSection.innerHTML = "";
        data.comments.forEach((comment) => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            // Format the date
            const createdAt = new Date(comment.createdAt);
            const formattedDate = createdAt.toLocaleDateString();
            const formattedTime = createdAt.toLocaleTimeString();
            commentElement.innerHTML = `
        <span class="comment-username">${comment.user}</span>
        <hr>
        <span class="comment-text">${comment.comment}</span>
        <br>
        <span class="comment-date">${formattedDate} ${formattedTime}</span>


      `;
            commentsSection.appendChild(commentElement);
        });
    })
    .catch((error) => console.error(error));
