const menuButton = document.querySelector('.menu');
const navMenu = document.querySelector('header nav');
menuButton.addEventListener('click', function (){
    navMenu.classList.toggle('active');
});
