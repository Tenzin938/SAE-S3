/* ==========================================================================
   Couche Données & Règles Métier simulées (Alignée sur le MCD Mission 3)
   Prépare le dialogue Front-End / Back-End (API REST Mission 4).
   Persiste les modifications dans localStorage pour la démonstration.
   ========================================================================== */

(function (global) {
  'use strict';

  var STORAGE_KEY = 'marfans_si_prototype_v1';
  var SESSION_KEY = 'marfans_current_user_v1';

  var INITIAL_DATA = {
    benevoles: [
      {
        idBenevole: 1,
        nom: 'Martin',
        prenom: 'Claire',
        email: 'claire.martin@marfans-asso.fr',
        telephone: '06 12 34 56 78',
        date_arrivee: '2022-03-15',
        date_depart: null,
        profil_acces: 'administrateur',
        competences: ['Coordination partenariats', 'Prise de parole publique', 'Animation groupe']
      },
      {
        idBenevole: 2,
        nom: 'Dupont',
        prenom: 'Lucas',
        email: 'lucas.dupont@marfans-asso.fr',
        telephone: '06 23 45 67 89',
        date_arrivee: '2024-09-10',
        date_depart: null,
        profil_acces: 'benevole',
        competences: ['Accueil familles', 'Soutien administratif', 'Écoute bienveillante']
      },
      {
        idBenevole: 3,
        nom: 'Bernard',
        prenom: 'Sophie',
        email: 'sophie.bernard@marfans-asso.fr',
        telephone: '06 34 56 78 90',
        date_arrivee: '2021-11-02',
        date_depart: null,
        profil_acces: 'responsable_ateliers',
        competences: ['Animation groupe', 'Gestion logistique', 'Éducation thérapeutique']
      },
      {
        idBenevole: 4,
        nom: 'Lefevre',
        prenom: 'Thomas',
        email: 'thomas.lefevre@marfans-asso.fr',
        telephone: '06 45 67 89 01',
        date_arrivee: '2020-05-20',
        date_depart: null,
        profil_acces: 'tresorier',
        competences: ['Comptabilité associative', 'Bilans financeurs']
      },
      {
        idBenevole: 5,
        nom: 'Rousseau',
        prenom: 'Amélie',
        email: 'amelie.rousseau@marfans-asso.fr',
        telephone: '06 56 78 90 12',
        date_arrivee: '2023-01-18',
        date_depart: null,
        profil_acces: 'responsable_formations',
        competences: ['Ingénierie pédagogique', 'Écoute bienveillante']
      }
    ],
    lieux: [
      { idLieu: 1, nom: 'Maison des Associations Paris 13', adresse: '11 rue Caillaux, 75013 Paris' },
      { idLieu: 2, nom: 'Hôpital Bichat - Espace Patients', adresse: '46 rue Henri Huchard, 75018 Paris' },
      { idLieu: 3, nom: 'Visioconférence (En ligne)', adresse: 'Lien sécurisé envoyé après inscription' },
      { idLieu: 4, nom: 'CHU Lyon - Salle Conférences', adresse: '59 boulevard Pinel, 69500 Bron' }
    ],
    types_activites: [
      { idType_Activite: 1, libelle: 'Gestion du stress et quotidien', categorie: 'atelier', formations_requises: [1, 2] },
      { idType_Activite: 2, libelle: 'Droits des patients et MDPH', categorie: 'conférence', formations_requises: [1] },
      { idType_Activite: 3, libelle: 'Parole entre patients et proches', categorie: 'groupe de parole', formations_requises: [1, 2] },
      { idType_Activite: 4, libelle: 'Journée nationale de sensibilisation', categorie: 'événement de sensibilisation', formations_requises: [1] },
      { idType_Activite: 5, libelle: 'Permanence d\'accueil téléphonique', categorie: 'permanence', formations_requises: [1, 3] }
    ],
    activites: [
      {
        idAtelier: 101,
        intitule: 'Atelier : Mieux vivre avec la fatigue chronique',
        description: 'Échanges pratiques et techniques de respiration adaptées. Salle équipée d\'un vidéoprojecteur.',
        date_debut: '2026-11-24T14:00',
        date_fin: '2026-11-24T16:30',
        capacite_max: 3,
        nb_benevoles_requis: 2,
        inscription_requise: true,
        frequentation_libre: null,
        statut: 'planifiée',
        date_modification: '2026-11-10T09:15',
        idType_Activite: 1,
        idLieu: 1
      },
      {
        idAtelier: 102,
        intitule: 'Conférence : Démarches MDPH et suivi cardiologique',
        description: 'Intervention d\'une assistante sociale et d\'un médecin du centre de référence.',
        date_debut: '2026-11-28T18:00',
        date_fin: '2026-11-28T20:00',
        capacite_max: 40,
        nb_benevoles_requis: 2,
        inscription_requise: true,
        frequentation_libre: null,
        statut: 'planifiée',
        date_modification: '2026-11-12T16:40',
        idType_Activite: 2,
        idLieu: 3
      },
      {
        idAtelier: 103,
        intitule: 'Groupe de parole : Parents d\'enfants atteints de Marfan',
        description: 'Temps d\'écoute confidentiel entre parents et bénévoles formés.',
        date_debut: '2026-12-03T18:30',
        date_fin: '2026-12-03T20:00',
        capacite_max: 12,
        nb_benevoles_requis: 2,
        inscription_requise: true,
        frequentation_libre: null,
        statut: 'planifiée',
        date_modification: '2026-11-14T11:20',
        idType_Activite: 3,
        idLieu: 2
      },
      {
        idAtelier: 104,
        intitule: 'Stand d\'information : Journée Maladies Rares',
        description: 'Accueil libre du grand public et distribution de brochures vulgarisées (accès libre).',
        date_debut: '2026-12-12T10:00',
        date_fin: '2026-12-12T17:00',
        capacite_max: null,
        nb_benevoles_requis: 3,
        inscription_requise: false,
        frequentation_libre: 0,
        statut: 'planifiée',
        date_modification: '2026-11-15T14:00',
        idType_Activite: 4,
        idLieu: 4
      },
      {
        idAtelier: 105,
        intitule: 'Atelier nutrition et protection vasculaire',
        description: 'Reporté suite à l\'indisponibilité de l\'intervenante diététicienne.',
        date_debut: '2026-11-19T14:00',
        date_fin: '2026-11-19T16:00',
        capacite_max: 15,
        nb_benevoles_requis: 1,
        inscription_requise: true,
        frequentation_libre: null,
        statut: 'annulée',
        date_modification: '2026-11-15T17:30',
        idType_Activite: 1,
        idLieu: 1
      }
    ],
    intervenir: [
      { idBenevole: 2, idAtelier: 101, role: 'accueil', statut: 'disponible' },
      { idBenevole: 3, idAtelier: 102, role: 'organisation', statut: 'confirmé' },
      { idBenevole: 2, idAtelier: 102, role: 'accueil', statut: 'confirmé' },
      { idBenevole: 5, idAtelier: 103, role: 'animation', statut: 'confirmé' }
    ],
    participants: [
      { idParticipant: 1, nom: 'Moreau', prenom: 'Julie', email: 'julie.moreau@exemple.fr', telephone: '06 11 22 33 44' },
      { idParticipant: 2, nom: 'Garnier', prenom: 'Antoine', email: 'antoine.garnier@exemple.fr', telephone: '06 22 33 44 55' },
      { idParticipant: 3, nom: 'Petit', prenom: 'Camille', email: 'camille.petit@exemple.fr', telephone: '06 33 44 55 66' },
      { idParticipant: 4, nom: 'Laurent', prenom: 'Nadia', email: 'nadia.laurent@exemple.fr', telephone: '06 44 55 66 77' },
      { idParticipant: 5, nom: 'Simon', prenom: 'Marc', email: 'marc.simon@exemple.fr', telephone: '06 55 66 77 88' }
    ],
    s_inscrire: [
      { idParticipant: 1, idAtelier: 101, date_inscription: '2026-11-05T10:00', statut: 'inscrit', date_annulation: null },
      { idParticipant: 2, idAtelier: 101, date_inscription: '2026-11-06T14:20', statut: 'inscrit', date_annulation: null },
      { idParticipant: 3, idAtelier: 101, date_inscription: '2026-11-08T09:10', statut: 'inscrit', date_annulation: null },
      { idParticipant: 4, idAtelier: 101, date_inscription: '2026-11-11T18:45', statut: 'liste_attente', date_annulation: null },
      { idParticipant: 5, idAtelier: 102, date_inscription: '2026-11-12T12:00', statut: 'inscrit', date_annulation: null }
    ],
    formations: [
      {
        idFormation: 1,
        intitule: 'Accueil des nouveaux adhérents et connaissance du syndrome de Marfan',
        description: 'Bases médicales vulgarisées, posture associative et confidentialité.',
        obligatoire: true,
        duree_validite_mois: null
      },
      {
        idFormation: 2,
        intitule: 'Écoute active et animation de groupe de parole',
        description: 'Accompagner les patients et proches aidants dans un cadre bienveillant.',
        obligatoire: true,
        duree_validite_mois: 24
      },
      {
        idFormation: 3,
        intitule: 'Premiers secours en santé mentale (PSSM)',
        description: 'Repérer et orienter une personne en situation de détresse.',
        obligatoire: false,
        duree_validite_mois: 36
      }
    ],
    sessions_formation: [
      { idSession_Formation: 201, idFormation: 1, idLieu: 3, date_debut: '2024-10-12T09:30', date_fin: '2024-10-12T12:30', capacite_max: 20, statut: 'réalisée' },
      { idSession_Formation: 202, idFormation: 2, idLieu: 1, date_debut: '2024-12-05T09:30', date_fin: '2024-12-05T17:00', capacite_max: 12, statut: 'réalisée' },
      { idSession_Formation: 203, idFormation: 3, idLieu: 2, date_debut: '2026-12-10T09:00', date_fin: '2026-12-10T17:00', capacite_max: 15, statut: 'planifiée' }
    ],
    suivre: [
      { idBenevole: 2, idSession_Formation: 201, statut: 'présent', validation: 'acquise' },
      { idBenevole: 2, idSession_Formation: 202, statut: 'présent', validation: 'acquise' },
      { idBenevole: 2, idSession_Formation: 203, statut: 'inscrit', validation: 'sans_objet' },
      { idBenevole: 3, idSession_Formation: 201, statut: 'présent', validation: 'acquise' },
      { idBenevole: 3, idSession_Formation: 202, statut: 'présent', validation: 'acquise' },
      { idBenevole: 5, idSession_Formation: 201, statut: 'présent', validation: 'acquise' },
      { idBenevole: 5, idSession_Formation: 202, statut: 'présent', validation: 'acquise' }
    ]
  };

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      // Fallback en mémoire si localStorage bloqué
    }
    var fresh = clone(INITIAL_DATA);
    saveData(fresh);
    return fresh;
  }

  function saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // Ignore si navigation privée stricte
    }
  }

  function resetData() {
    var fresh = clone(INITIAL_DATA);
    saveData(fresh);
    return fresh;
  }

  function nowIsoMinute() {
    var d = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDateFr(isoStr, withTime) {
    if (!isoStr) return '—';
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    var datePart = d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    if (!withTime) return datePart;
    var timePart = d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return datePart + ' à ' + timePart;
  }

  // --- Authentification simulée (F10) ---
  function getCurrentUser() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  function loginByEmail(email) {
    var db = loadData();
    var normalized = String(email || '').trim().toLowerCase();
    var found = db.benevoles.find(function (b) {
      return b.email.toLowerCase() === normalized && !b.date_depart;
    });
    if (!found) return null;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(found));
    } catch (e) {}
    return found;
  }

  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  // --- Activités & Synthèse (F3, F5, F8) ---
  function getEnrichedActivities() {
    var db = loadData();
    return db.activites
      .slice()
      .sort(function (a, b) {
        return a.date_debut.localeCompare(b.date_debut);
      })
      .map(function (act) {
        var type = db.types_activites.find(function (t) { return t.idType_Activite === act.idType_Activite; }) || {};
        var lieu = db.lieux.find(function (l) { return l.idLieu === act.idLieu; }) || {};
        var interventions = db.intervenir.filter(function (i) { return i.idAtelier === act.idAtelier; });
        var inscriptions = db.s_inscrire.filter(function (s) { return s.idAtelier === act.idAtelier; });

        var inscritsCount = inscriptions.filter(function (s) {
          return s.statut === 'inscrit' || s.statut === 'présent';
        }).length;
        var attenteList = inscriptions
          .filter(function (s) { return s.statut === 'liste_attente'; })
          .sort(function (a, b) { return a.date_inscription.localeCompare(b.date_inscription); });

        var benevolesActifs = interventions.filter(function (i) {
          return i.statut === 'disponible' || i.statut === 'confirmé' || i.statut === 'présent';
        });

        var placesRestantes = act.inscription_requise && act.capacite_max !== null
          ? Math.max(0, act.capacite_max - inscritsCount)
          : null;

        var manqueBenevoles = act.statut === 'planifiée' &&
          act.nb_benevoles_requis !== null &&
          benevolesActifs.length < act.nb_benevoles_requis;

        return {
          raw: act,
          type: type,
          lieu: lieu,
          interventions: interventions,
          inscriptions: inscriptions,
          inscritsCount: inscritsCount,
          attenteCount: attenteList.length,
          placesRestantes: placesRestantes,
          benevolesAffectesCount: benevolesActifs.length,
          manqueBenevoles: manqueBenevoles
        };
      });
  }

  function setVolunteerAvailability(idBenevole, idAtelier, role, statut) {
    var db = loadData();
    var idx = db.intervenir.findIndex(function (i) {
      return i.idBenevole === idBenevole && i.idAtelier === idAtelier;
    });
    if (idx >= 0) {
      db.intervenir[idx].role = role || db.intervenir[idx].role || 'accueil';
      db.intervenir[idx].statut = statut;
    } else {
      db.intervenir.push({
        idBenevole: idBenevole,
        idAtelier: idAtelier,
        role: role || 'accueil',
        statut: statut
      });
    }
    saveData(db);
  }

  function getVolunteerFormationsStatus(idBenevole) {
    var db = loadData();
    var suivis = db.suivre.filter(function (s) { return s.idBenevole === idBenevole; });
    var now = new Date();

    return db.formations.map(function (formation) {
      var sessions = db.sessions_formation.filter(function (sf) {
        return sf.idFormation === formation.idFormation;
      });

      var matchingSuivis = suivis.filter(function (su) {
        return sessions.some(function (sf) { return sf.idSession_Formation === su.idSession_Formation; });
      });

      var etat = 'non_suivie';
      var dateSession = null;
      var dateExpiration = null;

      matchingSuivis.forEach(function (su) {
        var sf = sessions.find(function (s) { return s.idSession_Formation === su.idSession_Formation; });
        if (!sf) return;
        if (su.validation === 'acquise' || su.validation === 'sans_objet') {
          if (su.statut === 'présent') {
            dateSession = sf.date_fin;
            if (formation.duree_validite_mois) {
              var exp = new Date(sf.date_fin);
              exp.setMonth(exp.getMonth() + formation.duree_validite_mois);
              dateExpiration = exp.toISOString().slice(0, 10);
              var diffDays = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
              if (diffDays < 0) {
                etat = 'expiree';
              } else if (diffDays <= 45) {
                etat = 'a_renouveler';
              } else {
                etat = 'valide';
              }
            } else {
              etat = 'valide';
            }
          } else if (su.statut === 'inscrit' && etat === 'non_suivie') {
            etat = 'inscrit_session';
            dateSession = sf.date_debut;
          }
        }
      });

      return {
        formation: formation,
        etat: etat,
        dateSession: dateSession,
        dateExpiration: dateExpiration
      };
    });
  }

  function saveActivity(payload) {
    var db = loadData();
    var now = nowIsoMinute();
    if (payload.idAtelier) {
      var idx = db.activites.findIndex(function (a) { return a.idAtelier === Number(payload.idAtelier); });
      if (idx >= 0) {
        db.activites[idx] = Object.assign({}, db.activites[idx], payload, {
          idAtelier: Number(payload.idAtelier),
          date_modification: now
        });
      }
    } else {
      var maxId = db.activites.reduce(function (m, a) { return Math.max(m, a.idAtelier); }, 100);
      db.activites.push(Object.assign({}, payload, {
        idAtelier: maxId + 1,
        date_modification: now
      }));
    }
    saveData(db);
  }

  function cancelActivity(idAtelier) {
    var db = loadData();
    var act = db.activites.find(function (a) { return a.idAtelier === Number(idAtelier); });
    if (act) {
      act.statut = 'annulée';
      act.date_modification = nowIsoMinute();
      saveData(db);
    }
  }

  function registerParticipantToActivity(idAtelier, participantInput) {
    var db = loadData();
    var act = db.activites.find(function (a) { return a.idAtelier === Number(idAtelier); });
    if (!act) return { ok: false, message: 'Activité introuvable.' };

    var maxPId = db.participants.reduce(function (m, p) { return Math.max(m, p.idParticipant); }, 0);
    var newParticipant = {
      idParticipant: maxPId + 1,
      nom: participantInput.nom.trim(),
      prenom: participantInput.prenom.trim(),
      email: participantInput.email.trim(),
      telephone: participantInput.telephone.trim()
    };
    db.participants.push(newParticipant);

    var inscritsActuels = db.s_inscrire.filter(function (s) {
      return s.idAtelier === act.idAtelier && (s.statut === 'inscrit' || s.statut === 'présent');
    }).length;

    var statut = 'inscrit';
    if (act.capacite_max !== null && inscritsActuels >= act.capacite_max) {
      statut = 'liste_attente';
    }

    db.s_inscrire.push({
      idParticipant: newParticipant.idParticipant,
      idAtelier: act.idAtelier,
      date_inscription: nowIsoMinute(),
      statut: statut,
      date_annulation: null
    });

    saveData(db);
    return { ok: true, statut: statut, participant: newParticipant };
  }

  function updateParticipantInscription(idAtelier, idParticipant, newStatut) {
    var db = loadData();
    var record = db.s_inscrire.find(function (s) {
      return s.idAtelier === Number(idAtelier) && s.idParticipant === Number(idParticipant);
    });
    if (!record) return;

    var wasRegistered = record.statut === 'inscrit';
    record.statut = newStatut;
    record.date_annulation = newStatut === 'annulé' ? nowIsoMinute() : null;

    // Si une place se libère, promouvoir le premier en liste d'attente par date_inscription
    if (wasRegistered && newStatut === 'annulé') {
      var waiting = db.s_inscrire
        .filter(function (s) { return s.idAtelier === Number(idAtelier) && s.statut === 'liste_attente'; })
        .sort(function (a, b) { return a.date_inscription.localeCompare(b.date_inscription); });
      if (waiting.length > 0) {
        waiting[0].statut = 'inscrit';
      }
    }
    saveData(db);
  }

  var ICONS = {
    check: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    alert: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    clock: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    x: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info: '<svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };

  global.MarfansDB = {
    icons: ICONS,
    loadData: loadData,
    saveData: saveData,
    resetData: resetData,
    escapeHtml: escapeHtml,
    formatDateFr: formatDateFr,
    getCurrentUser: getCurrentUser,
    loginByEmail: loginByEmail,
    logout: logout,
    getEnrichedActivities: getEnrichedActivities,
    setVolunteerAvailability: setVolunteerAvailability,
    getVolunteerFormationsStatus: getVolunteerFormationsStatus,
    saveActivity: saveActivity,
    cancelActivity: cancelActivity,
    registerParticipantToActivity: registerParticipantToActivity,
    updateParticipantInscription: updateParticipantInscription
  };
})(window);
