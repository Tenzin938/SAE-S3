(function () {
    'use strict';

    var currentUser = null;

    document.addEventListener('DOMContentLoaded', function () {
        var db = window.MarfansDB;
        if (!db) return;

        currentUser = db.getCurrentUser();
        if (!currentUser) {
            currentUser = db.loginByEmail('lucas.dupont@marfans-asso.fr');
        }

        initHeaderBar();
        bindEvents();
        renderAll();
    });

    function initHeaderBar() {
        document.getElementById('user-fullname').textContent = currentUser.prenom + ' ' + currentUser.nom;
        document.getElementById('user-role-badge').textContent = currentUser.profil_acces;

        var adminLink = document.getElementById('nav-admin-link');
        if (adminLink && currentUser.profil_acces !== 'responsable_ateliers' && currentUser.profil_acces !== 'administrateur') {
            adminLink.parentElement.hidden = true;
        }
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

        document.getElementById('filter-categorie').addEventListener('change', renderActivities);
        document.getElementById('filter-participation').addEventListener('change', renderActivities);
    }

    function showFeedback(message, type) {
        var el = document.getElementById('benevole-feedback');
        el.className = 'alert alert-' + (type || 'success');
        el.setAttribute('role', 'status');
        el.textContent = message;
        el.focus();
    }

    function renderAll() {
        renderStats();
        renderActivities();
        renderFormations();
        renderProfile();
    }

    function renderStats() {
        var db = window.MarfansDB;
        var activities = db.getEnrichedActivities();
        var myConfirmes = 0;
        var myDispo = 0;

        activities.forEach(function (item) {
            if (item.raw.statut !== 'planifiée') return;
            var mine = item.interventions.find(function (i) { return i.idBenevole === currentUser.idBenevole; });
            if (mine) {
                if (mine.statut === 'confirmé') myConfirmes++;
                if (mine.statut === 'disponible') myDispo++;
            }
        });

        var formations = db.getVolunteerFormationsStatus(currentUser.idBenevole);
        var aRenouveler = formations.filter(function (f) {
            return f.etat === 'a_renouveler' || f.etat === 'expiree' || (f.etat === 'non_suivie' && f.formation.obligatoire);
        }).length;

        document.getElementById('benevole-stats').innerHTML =
            '<div class="stat-card">' +
            '<div class="stat-value">' + myConfirmes + '</div>' +
            '<div class="stat-label">Activités confirmées</div>' +
            '</div>' +
            '<div class="stat-card">' +
            '<div class="stat-value">' + myDispo + '</div>' +
            '<div class="stat-label">Disponibilités en attente</div>' +
            '</div>' +
            '<div class="stat-card ' + (aRenouveler > 0 ? 'stat-card--alert' : '') + '">' +
            '<div class="stat-value">' + aRenouveler + '</div>' +
            '<div class="stat-label">Formation(s) à renouveler / suivre</div>' +
            '</div>';
    }

    function renderActivities() {
        var db = window.MarfansDB;
        var container = document.getElementById('benevole-activities-list');
        var catFilter = document.getElementById('filter-categorie').value;
        var partFilter = document.getElementById('filter-participation').value;

        var list = db.getEnrichedActivities().filter(function (item) {
            if (catFilter !== 'all' && item.type.categorie !== catFilter) return false;
            var mine = item.interventions.find(function (i) { return i.idBenevole === currentUser.idBenevole; });
            if (partFilter === 'mine') {
                return mine && (mine.statut === 'disponible' || mine.statut === 'confirmé');
            }
            if (partFilter === 'available_slots') {
                return item.manqueBenevoles;
            }
            return true;
        });

        if (list.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Aucune activité ne correspond aux filtres sélectionnés.</div>';
            return;
        }

        container.innerHTML = list.map(function (item) {
            var act = item.raw;
            var mine = item.interventions.find(function (i) { return i.idBenevole === currentUser.idBenevole; });

            var statutHtml = '';
            if (act.statut === 'annulée') {
                statutHtml = '<span class="badge badge-danger">' + db.icons.x + ' Annulée (' + db.escapeHtml(db.formatDateFr(act.date_modification, false)) + ')</span>';
            } else if (mine && mine.statut === 'confirmé') {
                statutHtml = '<span class="badge badge-success">' + db.icons.check + ' Confirmé : ' + db.escapeHtml(mine.role) + '</span>';
            } else if (mine && mine.statut === 'disponible') {
                statutHtml = '<span class="badge badge-info">' + db.icons.clock + ' Disponible (' + db.escapeHtml(mine.role) + ')</span>';
            } else if (mine && mine.statut === 'désisté') {
                statutHtml = '<span class="badge badge-warning">' + db.icons.alert + ' Désisté</span>';
            } else if (item.manqueBenevoles) {
                statutHtml = '<span class="badge badge-warning">' + db.icons.alert + ' Besoin bénévoles (' + item.benevolesAffectesCount + '/' + act.nb_benevoles_requis + ')</span>';
            }

            var roleId = 'role-select-' + act.idAtelier;
            var currentRole = (mine && mine.role) ? mine.role : 'accueil';

            var actionsHtml = '';
            if (act.statut !== 'annulée') {
                actionsHtml =
                    '<div class="form-group" style="margin-bottom: var(--space-2); width: 100%;">' +
                    '<label for="' + roleId + '" class="form-label" style="font-size: var(--text-xs);">Rôle souhaité :</label>' +
                    '<select id="' + roleId + '" class="form-control" style="min-height: 36px; padding: 0.25rem 0.5rem;">' +
                    '<option value="accueil"' + (currentRole === 'accueil' ? ' selected' : '') + '>Accueil</option>' +
                    '<option value="animation"' + (currentRole === 'animation' ? ' selected' : '') + '>Animation</option>' +
                    '<option value="organisation"' + (currentRole === 'organisation' ? ' selected' : '') + '>Organisation</option>' +
                    '</select>' +
                    '</div>' +
                    '<div class="action-group">' +
                    '<button type="button" class="btn btn-secondary btn-sm btn-dispo" data-id="' + act.idAtelier + '" data-statut="disponible">Je suis disponible</button>' +
                    '<button type="button" class="btn btn-success btn-sm btn-dispo" data-id="' + act.idAtelier + '" data-statut="confirmé">Confirmer ma présence</button>' +
                    (mine && mine.statut !== 'désisté'
                        ? '<button type="button" class="btn btn-danger-outline btn-sm btn-dispo" data-id="' + act.idAtelier + '" data-statut="désisté">Me désister</button>'
                        : '') +
                    '</div>';
            } else {
                actionsHtml = '<p class="form-hint" style="margin-bottom: 0;">Activité annulée : aucune action requise.</p>';
            }

            return (
                '<article class="card">' +
                '<div class="card-header">' +
                '<span class="meta-label">' + db.escapeHtml(item.type.categorie || 'Activité') + '</span>' +
                statutHtml +
                '</div>' +
                '<h3 class="card-title">' + db.escapeHtml(act.intitule) + '</h3>' +
                '<p style="margin-bottom: var(--space-2);">' +
                '<strong>Date :</strong> ' + db.escapeHtml(db.formatDateFr(act.date_debut, true)) + '<br>' +
                '<strong>Lieu :</strong> ' + db.escapeHtml(item.lieu.nom || '—') + '<br>' +
                '<strong>Bénévoles mobilisés :</strong> ' + item.benevolesAffectesCount + ' / ' + (act.nb_benevoles_requis || '—') +
                '</p>' +
                '<p>' + db.escapeHtml(act.description) + '</p>' +
                '<div class="card-footer" style="flex-direction: column;">' + actionsHtml + '</div>' +
                '</article>'
            );
        }).join('');

        container.querySelectorAll('.btn-dispo').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var idAtelier = Number(btn.getAttribute('data-id'));
                var statut = btn.getAttribute('data-statut');
                var selectEl = document.getElementById('role-select-' + idAtelier);
                var role = selectEl ? selectEl.value : 'accueil';

                db.setVolunteerAvailability(currentUser.idBenevole, idAtelier, role, statut);
                showFeedback('Statut mis à jour : « ' + statut + ' » (rôle : ' + role + ') sur l\'activité #' + idAtelier + '.', 'success');
                renderStats();
                renderActivities();
            });
        });
    }

    function renderFormations() {
        var db = window.MarfansDB;
        var items = db.getVolunteerFormationsStatus(currentUser.idBenevole);
        var container = document.getElementById('benevole-formations-list');

        container.innerHTML =
            '<div class="table-responsive">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            '<th>Formation</th>' +
            '<th>Caractère</th>' +
            '<th>Statut &amp; Échéance</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            items.map(function (entry) {
                var f = entry.formation;
                var statusHtml = '';
                if (entry.etat === 'valide') {
                    statusHtml = '<span class="badge badge-success">' + db.icons.check + ' Valide' + (entry.dateExpiration ? ' jusqu\'au ' + db.escapeHtml(db.formatDateFr(entry.dateExpiration, false)) : ' (illimitée)') + '</span>';
                } else if (entry.etat === 'a_renouveler') {
                    statusHtml = '<span class="badge badge-warning">' + db.icons.alert + ' À renouveler avant le ' + db.escapeHtml(db.formatDateFr(entry.dateExpiration, false)) + '</span>';
                } else if (entry.etat === 'expiree') {
                    statusHtml = '<span class="badge badge-danger">' + db.icons.x + ' Expirée depuis le ' + db.escapeHtml(db.formatDateFr(entry.dateExpiration, false)) + '</span>';
                } else if (entry.etat === 'inscrit_session') {
                    statusHtml = '<span class="badge badge-info">' + db.icons.clock + ' Inscrit (session du ' + db.escapeHtml(db.formatDateFr(entry.dateSession, false)) + ')</span>';
                } else {
                    statusHtml = '<span class="form-hint">Non suivie</span>';
                }

                return (
                    '<tr>' +
                    '<td><strong>' + db.escapeHtml(f.intitule) + '</strong></td>' +
                    '<td>' + (f.obligatoire ? 'Obligatoire' : 'Recommandée') + '</td>' +
                    '<td>' + statusHtml + '</td>' +
                    '</tr>'
                );
            }).join('') +
            '</tbody>' +
            '</table>' +
            '</div>';
    }

    function renderProfile() {
        var db = window.MarfansDB;
        var compText = (currentUser.competences && currentUser.competences.length > 0)
            ? db.escapeHtml(currentUser.competences.join(' · '))
            : 'Aucune compétence renseignée';

        document.getElementById('benevole-profil-details').innerHTML =
            '<dl style="margin: 0;">' +
            '<dt><strong>Nom complet</strong></dt><dd style="margin: 0 0 0.75rem;">' + db.escapeHtml(currentUser.prenom + ' ' + currentUser.nom) + '</dd>' +
            '<dt><strong>E-mail (identifiant)</strong></dt><dd style="margin: 0 0 0.75rem;">' + db.escapeHtml(currentUser.email) + '</dd>' +
            '<dt><strong>Téléphone</strong></dt><dd style="margin: 0 0 0.75rem;">' + db.escapeHtml(currentUser.telephone || 'Non renseigné') + '</dd>' +
            '<dt><strong>Date d\'arrivée</strong></dt><dd style="margin: 0 0 0.75rem;">' + db.escapeHtml(db.formatDateFr(currentUser.date_arrivee, false)) + '</dd>' +
            '<dt><strong>Compétences déclarées</strong></dt><dd style="margin: 0;">' + compText + '</dd>' +
            '</dl>';
    }
})();