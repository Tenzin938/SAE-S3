/* ==========================================================================
   Authentification simulée (F10 - POST /api/auth/login)
   Redirige selon le profil_acces défini en Mission 3.
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var form = document.getElementById('form-login');
        var emailInput = document.getElementById('login-email');
        var passwordInput = document.getElementById('login-password');
        var feedback = document.getElementById('login-feedback');
        var demoButtons = document.querySelectorAll('.demo-account-btn');

        demoButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var email = btn.getAttribute('data-email');
                if (emailInput) emailInput.value = email;
                if (passwordInput) passwordInput.value = 'demo2026';
                submitLogin(email, 'demo2026');
            });
        });

        if (!form) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var email = emailInput.value.trim();
            var pass = passwordInput.value;

            var emailErr = document.getElementById('login-email-err');
            var passErr = document.getElementById('login-password-err');
            var hasError = false;

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
                emailInput.setAttribute('aria-invalid', 'true');
                emailErr.textContent = 'Veuillez saisir une adresse e-mail associative valide.';
                hasError = true;
            } else {
                emailInput.removeAttribute('aria-invalid');
                emailErr.textContent = '';
            }

            if (!pass || pass.length < 4) {
                passwordInput.setAttribute('aria-invalid', 'true');
                passErr.textContent = 'Le mot de passe doit contenir au moins 4 caractères.';
                hasError = true;
            } else {
                passwordInput.removeAttribute('aria-invalid');
                passErr.textContent = '';
            }

            if (hasError) {
                feedback.className = 'alert alert-danger';
                feedback.setAttribute('role', 'alert');
                feedback.textContent = 'Veuillez corriger les champs signalés avant de vous connecter.';
                feedback.focus();
                return;
            }

            submitLogin(email, pass);
        });

        function submitLogin(email) {
            var user = window.MarfansDB.loginByEmail(email);
            if (!user) {
                feedback.className = 'alert alert-danger';
                feedback.setAttribute('role', 'alert');
                feedback.textContent = 'Aucun bénévole actif trouvé avec l\'e-mail « ' + email + ' ». Utilisez l\'un des comptes de démonstration.';
                feedback.focus();
                return;
            }

            var target = (user.profil_acces === 'responsable_ateliers' || user.profil_acces === 'administrateur')
                ? 'responsable-ateliers.html'
                : 'espace-benevole.html';

            window.location.href = target;
        }
    });
})();