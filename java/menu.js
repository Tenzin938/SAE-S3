const menu = document.querySelector('.menu');
const navLiens = document.querySelector('.nav-liens');
menu.addEventListener('click', () => {
    navLiens.classList.toggle('active');
})