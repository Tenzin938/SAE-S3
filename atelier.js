(function () {
  'use strict';

  var currentUser = null;
  var activeAtelierForInscriptions = null;
  var lastFocusedElement = null;

  document.addEventListener('DOMContentLoaded', function () {
    var db = window.MarfansDB;
    if (!db) return;

    currentUser = db.getCurrentUser();
    if (!currentUser) {
      // Connexion de démonstration par défaut sur Sophie Bernard (responsable_ateliers)
      currentUser = db.loginByEmail('sophie.bernard@marfans-asso.fr');
    }

    initHeaderBar();
    populateSelects();
    bindEvents();
    renderAll();
  });

  function initHeaderBar() {
    document.getElementById('user-fullname').textContent = currentUser.prenom + ' ' + currentUser.nom;
    document.getElementById('user-role-badge').textContent = currentUser.profil_acces;
  }

  function populateSelects() {
    var data = window.MarfansDB.loadData();
    var typeSelect = document.getElementById('act-type');
    var lieuSelect = document.getElementById('act-lieu');

    typeSelect.innerHTML = data.types_activites.map(function (t) {
      return '<option value="' + t.idType_Activite + '">' + window.MarfansDB.escapeHtml(t.libelle + ' (' + t.categorie + ')') + '</option>';
    }).join('');

    lieuSelect.innerHTML = data.lieux.map(function (l) {
      return '<option value="' + l.idLieu + '">' + window.MarfansDB.escapeHtml(l.nom) + '</option>';
    }).join('');
  }

  function bindEvents() {
    var db = window.MarfansDB;

    document.getElementById('btn-logout').addEventListener('click', function () {
      db.logout();
      window.location.href = 'login.html';
    });

    document.getElementById('btn-reset-demo').addEventListener('click', function () {
      db.resetData();
      showFeedback('Données de démonstration réinitialisées.', 'info');
      renderAll();
    });

    document.getElementById('admin-filter-statut').addEventListener('change', renderTable);
    document.getElementById('admin-search').addEventListener('input', renderTable);

    document.getElementById('btn-new-activity').addEventListener('click', function () {
      openActivityModal(null);
    });

    document.querySelectorAll('.modal-close').forEach(function (btn) {
      btn.addEventListener('click', function () {
        closeModal(btn.getAttribute('data-close'));
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeModal('modal-activity');
        closeModal('modal-inscriptions');
      }
    });

    document.getElementById('form-activity').addEventListener('submit', handleActivitySubmit);
  }

  function openModal(modalId, focusSelector) {
    lastFocusedElement = document.activeElement;
    var modal = document.getElementById(modalId);
    if (!modal) return;
    modal.hidden = false;
    var target = focusSelector ? modal.querySelector(focusSelector) : modal.querySelector('input, button');
    if (target) target.focus();
  }

  function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function showFeedback(message, type) {
    var el = document.getElementById('admin-feedback');
    el.className = 'alert alert-' + (type || 'success');
    el.setAttribute('role', 'status');
    el.textContent = message;
    el.focus();
  }

  function renderAll() {
    renderStats();
    renderTable();
  }

  function renderStats() {
    var list = window.MarfansDB.getEnrichedActivities();
    var planifiees = list.filter(function (i) { return i.raw.statut === 'planifiée'; });
    var avecManque = planifiees.filter(function (i) { return i.manqueBenevoles; }).length;
    var totalAttente = planifiees.reduce(function (acc, i) { return acc + i.attenteCount; }, 0);
    var totalInscrits = planifiees.reduce(function (acc, i) { return acc + i.inscritsCount; }, 0);

    document.getElementById('admin-stats').innerHTML =
      '<div class="stat-card">' +
        '<div class="stat-value">' + planifiees.length + '</div>' +
        '<div class="stat-label">Activités planifiées</div>' +
      '</div>' +
      '<div class="stat-card">' +
        '<div class="stat-value">' + totalInscrits + '</div>' +
        '<div class="stat-label">Participants inscrits</div>' +
      '</div>' +
      '<div class="stat-card ' + (totalAttente > 0 ? 'stat-card--alert' : '') + '">' +
        '<div class="stat-value">' + totalAttente + '</div>' +
        '<div class="stat-label">Personne(s) en liste d\'attente</div>' +
      '</div>' +
      '<div class="stat-card ' + (avecManque > 0 ? 'stat-card--alert' : '') + '">' +
        '<div class="stat-value">' + avecManque + '</div>' +
        '<div class="stat-label">Activité(s) avec bénévoles manquants</div>' +
      '</div>';
  }

  function renderTable() {
    var db = window.MarfansDB;
    var tbody = document.getElementById('admin-activities-tbody');
    var filterStatut = document.getElementById('admin-filter-statut').value;
    var search = document.getElementById('admin-search').value.trim().toLowerCase();

    var list = db.getEnrichedActivities().filter(function (item) {
      if (filterStatut === 'planifiée' && item.raw.statut !== 'planifiée') return false;
      if (filterStatut === 'annulée' && item.raw.statut !== 'annulée') return false;
      if (filterStatut === 'alertes' && !(item.manqueBenevoles || item.attenteCount > 0)) return false;
      if (search && item.raw.intitule.toLowerCase().indexOf(search) === -1) return false;
      return true;
    });

    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">Aucune activité trouvée pour ces critères.</td></tr>';
      return;
    }

    tbody.innerHTML = list.map(function (item) {
      var act = item.raw;

      var partInfo = act.inscription_requise
        ? '<strong>' + item.inscritsCount + '</strong> / ' + (act.capacite_max || '∞') + ' inscrit(s)' +
          (item.placesRestantes !== null ? '<br><span class="form-hint">' + item.placesRestantes + ' place(s) restante(s)</span>' : '')
        : 'Accès libre<br><span class="form-hint">Fréquentation : ' + (act.frequentation_libre || 0) + '</span>';

      var benevInfo = '<strong>' + item.benevolesAffectesCount + '</strong> / ' + (act.nb_benevoles_requis || 0);

      var badges = [];
      if (act.statut === 'annulée') {
        badges.push('<span class="badge badge-danger">' + db.icons.x + ' Annulée</span>');
      }
      if (item.manqueBenevoles) {
        var manquant = act.nb_benevoles_requis - item.benevolesAffectesCount;
        badges.push('<span class="badge badge-warning">' + db.icons.alert + ' Manque ' + manquant + ' bénévole(s)</span>');
      }
      if (item.attenteCount > 0) {
        badges.push('<span class="badge badge-info">' + db.icons.clock + ' Attente : ' + item.attenteCount + '</span>');
      }
      var statusCellHtml = badges.length > 0
        ? '<div class="action-group">' + badges.join('') + '</div>'
        : '<span class="form-hint">Planifiée · Complet OK</span>';

      return (
        '<tr>' +
          '<td>' +
            '<strong>' + db.escapeHtml(act.intitule) + '</strong><br>' +
            '<span class="form-hint">' + db.escapeHtml(item.type.categorie || '—') + '</span>' +
          '</td>' +
          '<td>' +
            db.escapeHtml(db.formatDateFr(act.date_debut, true)) + '<br>' +
            '<span class="form-hint">' + db.escapeHtml(item.lieu.nom || '—') + '</span>' +
          '</td>' +
          '<td>' + partInfo + '</td>' +
          '<td>' + benevInfo + '</td>' +
          '<td>' + statusCellHtml + '</td>' +
          '<td>' +
            '<div class="action-group">' +
              '<button type="button" class="btn btn-secondary btn-sm btn-inscriptions" data-id="' + act.idAtelier + '">Inscriptions</button>' +
              '<button type="button" class="btn btn-outline btn-sm btn-edit" data-id="' + act.idAtelier + '">Modifier</button>' +
              (act.statut !== 'annulée'
                ? '<button type="button" class="btn btn-danger-outline btn-sm btn-cancel" data-id="' + act.idAtelier + '">Annuler</button>'
                : '') +
            '</div>' +
          '</td>' +
        '</tr>'
      );
    }).join('');

    tbody.querySelectorAll('.btn-edit').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openActivityModal(Number(btn.getAttribute('data-id')));
      });
    });

    tbody.querySelectorAll('.btn-cancel').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = Number(btn.getAttribute('data-id'));
        db.cancelActivity(id);
        showFeedback('L\'activité #' + id + ' a été marquée comme annulée (historique conservé).', 'warning');
        renderAll();
      });
    });

    tbody.querySelectorAll('.btn-inscriptions').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openInscriptionsModal(Number(btn.getAttribute('data-id')));
      });
    });
  }

  function openActivityModal(idAtelier) {
    var db = window.MarfansDB;
    var errBox = document.getElementById('modal-activity-error');
    errBox.hidden = true;
    errBox.textContent = '';

    var title = document.getElementById('modal-activity-title');
    if (idAtelier) {
      var data = db.loadData();
      var act = data.activites.find(function (a) { return a.idAtelier === idAtelier; });
      if (!act) return;
      title.textContent = 'Modifier l\'activité #' + idAtelier;
      document.getElementById('act-id').value = act.idAtelier;
      document.getElementById('act-intitule').value = act.intitule;
      document.getElementById('act-type').value = act.idType_Activite;
      document.getElementById('act-lieu').value = act.idLieu;
      document.getElementById('act-debut').value = act.date_debut;
      document.getElementById('act-fin').value = act.date_fin;
      document.getElementById('act-capacite').value = act.capacite_max !== null ? act.capacite_max : '';
      document.getElementById('act-benevoles').value = act.nb_benevoles_requis !== null ? act.nb_benevoles_requis : 0;
      document.getElementById('act-inscription').checked = !!act.inscription_requise;
      document.getElementById('act-description').value = act.description || '';
    } else {
      title.textContent = 'Créer une nouvelle activité';
      document.getElementById('form-activity').reset();
      document.getElementById('act-id').value = '';
      document.getElementById('act-debut').value = '2026-12-15T14:00';
      document.getElementById('act-fin').value = '2026-12-15T16:30';
    }

    openModal('modal-activity', '#act-intitule');
  }

  function handleActivitySubmit(event) {
    event.preventDefault();
    var intitule = document.getElementById('act-intitule').value.trim();
    var debut = document.getElementById('act-debut').value;
    var fin = document.getElementById('act-fin').value;
    var errBox = document.getElementById('modal-activity-error');

    if (intitule.length < 3 || !debut || !fin || fin <= debut) {
      errBox.hidden = false;
      errBox.textContent = 'Veuillez renseigner un intitulé (3 caractères min.) et vérifier que la date de fin est postérieure à la date de début.';
      return;
    }

    var capRaw = document.getElementById('act-capacite').value;
    var benRaw = document.getElementById('act-benevoles').value;
    var idVal = document.getElementById('act-id').value;

    window.MarfansDB.saveActivity({
      idAtelier: idVal ? Number(idVal) : null,
      intitule: intitule,
      idType_Activite: Number(document.getElementById('act-type').value),
      idLieu: Number(document.getElementById('act-lieu').value),
      date_debut: debut,
      date_fin: fin,
      capacite_max: capRaw ? Number(capRaw) : null,
      nb_benevoles_requis: benRaw !== '' ? Number(benRaw) : 0,
      inscription_requise: document.getElementById('act-inscription').checked,
      frequentation_libre: document.getElementById('act-inscription').checked ? null : 0,
      statut: 'planifiée',
      description: document.getElementById('act-description').value.trim()
    });

    closeModal('modal-activity');
    showFeedback(idVal ? 'Activité modifiée et horodatée.' : 'Nouvelle activité créée avec succès.', 'success');
    renderAll();
  }

  function openInscriptionsModal(idAtelier) {
    activeAtelierForInscriptions = idAtelier;
    renderInscriptionsModalBody();
    openModal('modal-inscriptions');
  }

  function renderInscriptionsModalBody() {
    var db = window.MarfansDB;
    var data = db.loadData();
    var enriched = db.getEnrichedActivities().find(function (i) { return i.raw.idAtelier === activeAtelierForInscriptions; });
    if (!enriched) return;

    var act = enriched.raw;
    var body = document.getElementById('inscriptions-modal-body');
    document.getElementById('modal-inscriptions-title').textContent = 'Gestion participants – ' + act.intitule;

    if (!act.inscription_requise) {
      body.innerHTML =
        '<p>Cette activité est en <strong>accès libre sans inscription</strong> (Hypothèse H4).</p>' +
        '<form id="form-freq-libre">' +
          '<div class="form-group">' +
            '<label for="input-freq-libre" class="form-label">Nombre de présents constaté (frequentation_libre)</label>' +
            '<input type="number" id="input-freq-libre" class="form-control" min="0" value="' + (act.frequentation_libre || 0) + '">' +
          '</div>' +
          '<button type="submit" class="btn btn-primary">Enregistrer la fréquentation</button>' +
        '</form>';

      document.getElementById('form-freq-libre').addEventListener('submit', function (e) {
        e.preventDefault();
        var val = Number(document.getElementById('input-freq-libre').value) || 0;
        db.saveActivity({ idAtelier: act.idAtelier, frequentation_libre: val });
        closeModal('modal-inscriptions');
        showFeedback('Fréquentation libre enregistrée (' + val + ' personnes).', 'success');
        renderAll();
      });
      return;
    }

    var rowsHtml = enriched.inscriptions
      .slice()
      .sort(function (a, b) { return a.date_inscription.localeCompare(b.date_inscription); })
      .map(function (ins) {
        var part = data.participants.find(function (p) { return p.idParticipant === ins.idParticipant; }) || {};
        var badgeClass = ins.statut === 'inscrit' || ins.statut === 'présent'
          ? 'badge-success'
          : (ins.statut === 'liste_attente' ? 'badge-warning' : 'badge-danger');
        var badgeIcon = ins.statut === 'inscrit' || ins.statut === 'présent'
          ? db.icons.check
          : (ins.statut === 'liste_attente' ? db.icons.clock : db.icons.x);

        return (
          '<tr>' +
            '<td><strong>' + db.escapeHtml((part.prenom || '') + ' ' + (part.nom || '')) + '</strong><br><span class="form-hint">' + db.escapeHtml(part.email || part.telephone || '') + '</span></td>' +
            '<td>' + db.escapeHtml(db.formatDateFr(ins.date_inscription, true)) + '</td>' +
            '<td><span class="badge ' + badgeClass + '">' + badgeIcon + ' ' + db.escapeHtml(ins.statut) + '</span></td>' +
            '<td>' +
              '<div class="action-group">' +
                '<button type="button" class="btn btn-success btn-sm btn-part-status" data-pid="' + ins.idParticipant + '" data-statut="présent">Présent</button>' +
                '<button type="button" class="btn btn-danger-outline btn-sm btn-part-status" data-pid="' + ins.idParticipant + '" data-statut="annulé">Annuler</button>' +
              '</div>' +
            '</td>' +
          '</tr>'
        );
      }).join('');

    body.innerHTML =
      '<p><strong>Capacité :</strong> ' + enriched.inscritsCount + ' / ' + (act.capacite_max || '∞') + ' inscrit(s) · <strong>Liste d\'attente :</strong> ' + enriched.attenteCount + '</p>' +
      '<div class="table-responsive table-responsive--flat" style="margin-bottom: var(--space-5);">' +
        '<table>' +
          '<thead><tr><th>Participant</th><th>Date inscription</th><th>Statut</th><th>Actions</th></tr></thead>' +
          '<tbody>' + (rowsHtml || '<tr><td colspan="4">Aucun participant inscrit pour le moment.</td></tr>') + '</tbody>' +
        '</table>' +
      '</div>' +
      '<h3>Inscrire un nouveau participant (saisie responsable - H1)</h3>' +
      '<form id="form-add-participant">' +
        '<div class="grid grid-2">' +
          '<div class="form-group"><label for="part-nom" class="form-label">Nom <span class="required-mark">*</span></label><input type="text" id="part-nom" class="form-control" required></div>' +
          '<div class="form-group"><label for="part-prenom" class="form-label">Prénom <span class="required-mark">*</span></label><input type="text" id="part-prenom" class="form-control" required></div>' +
        '</div>' +
        '<div class="grid grid-2">' +
          '<div class="form-group"><label for="part-email" class="form-label">E-mail</label><input type="email" id="part-email" class="form-control"></div>' +
          '<div class="form-group"><label for="part-tel" class="form-label">Téléphone</label><input type="tel" id="part-tel" class="form-control"></div>' +
        '</div>' +
        '<button type="submit" class="btn btn-primary">Ajouter le participant</button>' +
      '</form>';

    body.querySelectorAll('.btn-part-status').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pid = Number(btn.getAttribute('data-pid'));
        var st = btn.getAttribute('data-statut');
        db.updateParticipantInscription(activeAtelierForInscriptions, pid, st);
        renderInscriptionsModalBody();
        renderAll();
      });
    });

    document.getElementById('form-add-participant').addEventListener('submit', function (e) {
      e.preventDefault();
      var nom = document.getElementById('part-nom').value.trim();
      var prenom = document.getElementById('part-prenom').value.trim();
      if (!nom || !prenom) return;
      var res = db.registerParticipantToActivity(activeAtelierForInscriptions, {
        nom: nom,
        prenom: prenom,
        email: document.getElementById('part-email').value,
        telephone: document.getElementById('part-tel').value
      });
      if (res.ok) {
        renderInscriptionsModalBody();
        renderAll();
      }
    });
  }
})();
