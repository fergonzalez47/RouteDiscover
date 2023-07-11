const buttonSignIn = document.getElementById('button-sign-in');
const buttonRegister = document.getElementById('button-register');

buttonSignIn.addEventListener('click', function () {
    window.location.href = '/login';
});
buttonRegister.addEventListener('click', function () {
    window.location.href = '/registration';
});