/* ==========================================================================
   Navigation & Composants Globaux - Association Marfans
   Gère le menu mobile accessible, la barre de session SI et les interactions communes.
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initSessionHeaderLink();
  });

  function initMobileNav() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  function initSessionHeaderLink() {
    if (!window.MarfansDB) return;
    var user = window.MarfansDB.getCurrentUser();
    var siLink = document.getElementById('nav-si-link');
    if (!siLink) return;

    if (user) {
      var target = user.profil_acces === 'responsable_ateliers' || user.profil_acces === 'administrateur'
        ? 'responsable-ateliers.html'
        : 'espace-benevole.html';
      siLink.href = target;
      siLink.textContent = 'Mon espace (' + user.prenom + ')';
    }
  }
})();
