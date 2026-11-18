/* ==========================================================================
   Page d'Accueil - Aperçu dynamique des prochaines activités
   Simule GET /api/activités?statut=planifiée&a_venir=true (Mission 3)
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('public-activities-list');
    if (!container || !window.MarfansDB) return;

    var db = window.MarfansDB;
    var planned = db.getEnrichedActivities()
      .filter(function (item) { return item.raw.statut === 'planifiée'; })
      .slice(0, 3);

    if (planned.length === 0) {
      container.innerHTML = '<p>Aucune activité planifiée pour le moment.</p>';
      return;
    }

    container.innerHTML = planned.map(function (item) {
      var act = item.raw;
      var badgeHtml = '';

      if (!act.inscription_requise) {
        badgeHtml = '<span class="badge badge-info">' + db.icons.info + ' Accès libre</span>';
      } else if (item.placesRestantes === 0) {
        badgeHtml = '<span class="badge badge-warning">' + db.icons.clock + ' Complet (attente : ' + item.attenteCount + ')</span>';
      } else {
        badgeHtml = '<span class="badge badge-success">' + db.icons.check + ' ' + item.placesRestantes + ' place(s)</span>';
      }

      return (
        '<article class="card">' +
          '<div class="card-header">' +
            '<span class="meta-label">' + db.escapeHtml(item.type.categorie || 'Activité') + '</span>' +
            badgeHtml +
          '</div>' +
          '<h3 class="card-title">' + db.escapeHtml(act.intitule) + '</h3>' +
          '<p><strong>Date :</strong> ' + db.escapeHtml(db.formatDateFr(act.date_debut, true)) + '<br>' +
          '<strong>Lieu :</strong> ' + db.escapeHtml(item.lieu.nom || 'À préciser') + '</p>' +
          '<p>' + db.escapeHtml(act.description) + '</p>' +
          '<div class="card-footer">' +
            '<a href="contact.html?activite=' + encodeURIComponent(act.intitule) + '" class="btn btn-outline btn-sm">' +
              'Demander des informations' +
            '</a>' +
          '</div>' +
        '</article>'
      );
    }).join('');
  });
})();
