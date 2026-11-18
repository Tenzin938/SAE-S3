/* ==========================================================================
   Page La Génétique - Transcriptions vidéos & Carte des centres
   ========================================================================== */

(function () {
  'use strict';

  var CENTRES = {
    paris: {
      titre: 'Centre de référence coordonnateur – Hôpital Bichat (Paris)',
      adresse: '46 rue Henri Huchard, 75018 Paris',
      details: 'Prise en charge pluridisciplinaire : cardiologie, génétique, ophtalmologie, rhumatologie.'
    },
    lyon: {
      titre: 'Centre de compétence – Hôpital Louis Pradel (CHU Lyon)',
      adresse: '59 boulevard Pinel, 69500 Bron',
      details: 'Consultations de cardiologie congénitale, chirurgie aortique et conseil génétique.'
    },
    lille: {
      titre: 'Centre de compétence – CHU de Lille',
      adresse: '2 avenue Oscar Lambret, 59000 Lille',
      details: 'Suivi adulte et pédiatrique, génétique clinique et imagerie vasculaire.'
    },
    bordeaux: {
      titre: 'Centre de compétence – Hôpital Pellegrin (CHU Bordeaux)',
      adresse: 'Place Amélie Raba-Léon, 33000 Bordeaux',
      details: 'Coordination régionale des syndromes aortiques rares et suivi ophtalmologique.'
    },
    marseille: {
      titre: 'Centre de compétence – Hôpital de la Timone (AP-HM Marseille)',
      adresse: '264 rue Saint-Pierre, 13005 Marseille',
      details: 'Consultations génétiques, suivi cardiologique et accompagnement pédiatrique.'
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    initTranscriptToggles();
    initCentresSelector();
  });

  function initTranscriptToggles() {
    var buttons = document.querySelectorAll('.transcript-toggle');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('aria-controls');
        var box = document.getElementById(targetId);
        if (!box) return;
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isExpanded));
        box.hidden = isExpanded;
        btn.textContent = isExpanded ? 'Afficher la transcription' : 'Masquer la transcription';
      });
    });
  }

  function initCentresSelector() {
    var buttons = document.querySelectorAll('.centre-btn');
    var panel = document.getElementById('centre-details');
    if (!panel || buttons.length === 0) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-centre');
        var info = CENTRES[key];
        if (!info) return;

        buttons.forEach(function (b) {
          b.classList.remove('btn-secondary');
          b.classList.add('btn-outline');
        });
        btn.classList.remove('btn-outline');
        btn.classList.add('btn-secondary');

        panel.innerHTML =
          '<strong>' + window.MarfansDB.escapeHtml(info.titre) + '</strong><br>' +
          window.MarfansDB.escapeHtml(info.adresse) + '<br>' +
          window.MarfansDB.escapeHtml(info.details);
      });
    });
  }
})();
