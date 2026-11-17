/* ==========================================================================
   Formulaires Accessibles (Contact, Adhésion, Don)
   Corrige les défauts de la Mission 1 :
   - Messages d'erreurs explicites et spécifiques à chaque champ
   - Utilisation 100 % au clavier (onglets ARIA + champs natifs)
   ========================================================================== */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initTabs();
        applyQueryParams();
        initContactForm();
        initAdhesionForm();
        initDonForm();
    });

    function initTabs() {
        var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
        if (tabs.length === 0) return;

        function activateTab(tab) {
            tabs.forEach(function (t) {
                var isSelected = t === tab;
                t.setAttribute('aria-selected', String(isSelected));
                t.setAttribute('tabindex', isSelected ? '0' : '-1');
                var panelId = t.getAttribute('aria-controls');
                var panel = document.getElementById(panelId);
                if (panel) panel.hidden = !isSelected;
            });

            // Synchronise l'état actif des boutons « Je donne » / « J'adhère » du menu
            var key = tab.getAttribute('data-tab');
            document.querySelectorAll('[data-nav-tab]').forEach(function (link) {
                if (link.getAttribute('data-nav-tab') === key) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

            // Met à jour l'URL (lien partageable, bouton retour cohérent)
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', '?onglet=' + key);
            }
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () {
                activateTab(tab);
            });

            tab.addEventListener('keydown', function (event) {
                var nextIndex = null;
                if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
                else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
                else if (event.key === 'Home') nextIndex = 0;
                else if (event.key === 'End') nextIndex = tabs.length - 1;

                if (nextIndex !== null) {
                    event.preventDefault();
                    tabs[nextIndex].focus();
                    activateTab(tabs[nextIndex]);
                }
            });
        });

        window._activateMarfansTab = function (key) {
            var target = tabs.find(function (t) { return t.getAttribute('data-tab') === key; });
            if (target) activateTab(target);
        };
    }

    function applyQueryParams() {
        var params = new URLSearchParams(window.location.search);
        var onglet = params.get('onglet');
        if (window._activateMarfansTab) {
            window._activateMarfansTab(onglet === 'don' ? 'don' : 'adhesion');
        }

        var activite = params.get('activite');
        if (activite) {
            var sujet = document.getElementById('contact-sujet');
            var msg = document.getElementById('contact-message');
            if (sujet) sujet.value = 'inscription_activite';
            if (msg && !msg.value) {
                msg.value = 'Bonjour, je souhaite obtenir des informations ou m\'inscrire à l\'activité : « ' + activite + ' ».';
            }
        }
    }

    function isValidEmail(val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
    }

    function setFieldError(inputEl, errorElId, message) {
        var errEl = document.getElementById(errorElId);
        if (inputEl) {
            if (message) inputEl.setAttribute('aria-invalid', 'true');
            else inputEl.removeAttribute('aria-invalid');
        }
        if (errEl) errEl.textContent = message || '';
    }

    function showErrorSummary(feedbackEl, errors) {
        var items = errors.map(function (err) {
            return '<li><a href="#' + err.id + '">' + window.MarfansDB.escapeHtml(err.label) + ' : ' + window.MarfansDB.escapeHtml(err.message) + '</a></li>';
        }).join('');
        feedbackEl.className = 'alert alert-danger';
        feedbackEl.setAttribute('role', 'alert');
        feedbackEl.innerHTML =
            '<strong>Impossible d\'envoyer le formulaire (' + errors.length + ' erreur(s) détectée(s)) :</strong>' +
            '<ul style="margin: 0.5rem 0 0; padding-left: 1.25rem;">' + items + '</ul>';
        feedbackEl.focus();
    }

    function showSuccess(feedbackEl, title, details) {
        feedbackEl.className = 'alert alert-success';
        feedbackEl.setAttribute('role', 'status');
        feedbackEl.innerHTML =
            '<strong>' + window.MarfansDB.escapeHtml(title) + '</strong><br>' +
            window.MarfansDB.escapeHtml(details);
        feedbackEl.focus();
    }

    function initContactForm() {
        var form = document.getElementById('form-contact');
        var feedback = document.getElementById('contact-feedback');
        if (!form || !feedback) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var nom = document.getElementById('contact-nom');
            var email = document.getElementById('contact-email');
            var sujet = document.getElementById('contact-sujet');
            var message = document.getElementById('contact-message');

            var errors = [];

            if (nom.value.trim().length < 2) {
                var m1 = 'Veuillez saisir votre nom et prénom (au moins 2 caractères).';
                setFieldError(nom, 'contact-nom-err', m1);
                errors.push({ id: 'contact-nom', label: 'Nom et prénom', message: m1 });
            } else {
                setFieldError(nom, 'contact-nom-err', '');
            }

            if (!email.value.trim()) {
                var m2 = 'L\'adresse e-mail est obligatoire pour que nous puissions vous répondre.';
                setFieldError(email, 'contact-email-err', m2);
                errors.push({ id: 'contact-email', label: 'Adresse e-mail', message: m2 });
            } else if (!isValidEmail(email.value)) {
                var m2b = 'Le format de l\'adresse e-mail est invalide (exemple attendu : nom@domaine.fr).';
                setFieldError(email, 'contact-email-err', m2b);
                errors.push({ id: 'contact-email', label: 'Adresse e-mail', message: m2b });
            } else {
                setFieldError(email, 'contact-email-err', '');
            }

            if (!sujet.value) {
                var m3 = 'Veuillez sélectionner l\'objet de votre demande dans la liste.';
                setFieldError(sujet, 'contact-sujet-err', m3);
                errors.push({ id: 'contact-sujet', label: 'Objet de votre demande', message: m3 });
            } else {
                setFieldError(sujet, 'contact-sujet-err', '');
            }

            if (message.value.trim().length < 15) {
                var m4 = 'Votre message est trop court (' + message.value.trim().length + '/15 caractères minimum).';
                setFieldError(message, 'contact-message-err', m4);
                errors.push({ id: 'contact-message', label: 'Votre message', message: m4 });
            } else {
                setFieldError(message, 'contact-message-err', '');
            }

            if (errors.length > 0) {
                showErrorSummary(feedback, errors);
                return;
            }

            showSuccess(
                feedback,
                'Votre message a bien été enregistré (simulation Front-End).',
                'Merci ' + nom.value.trim() + '. Une réponse vous sera transmise à l\'adresse ' + email.value.trim() + '.'
            );
            form.reset();
        });
    }

    function initAdhesionForm() {
        var form = document.getElementById('form-adhesion');
        var feedback = document.getElementById('adhesion-feedback');
        if (!form || !feedback) return;

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var nom = document.getElementById('adh-nom');
            var prenom = document.getElementById('adh-prenom');
            var email = document.getElementById('adh-email');
            var tel = document.getElementById('adh-tel');
            var tarif = form.querySelector('input[name="adh-tarif"]:checked');

            var errors = [];

            if (!nom.value.trim()) {
                var m1 = 'Le nom de famille est obligatoire.';
                setFieldError(nom, 'adh-nom-err', m1);
                errors.push({ id: 'adh-nom', label: 'Nom de famille', message: m1 });
            } else {
                setFieldError(nom, 'adh-nom-err', '');
            }

            if (!prenom.value.trim()) {
                var m2 = 'Le prénom est obligatoire.';
                setFieldError(prenom, 'adh-prenom-err', m2);
                errors.push({ id: 'adh-prenom', label: 'Prénom', message: m2 });
            } else {
                setFieldError(prenom, 'adh-prenom-err', '');
            }

            if (!email.value.trim()) {
                var m3 = 'Veuillez indiquer une adresse e-mail valide pour recevoir votre attestation.';
                setFieldError(email, 'adh-email-err', m3);
                errors.push({ id: 'adh-email', label: 'Adresse e-mail', message: m3 });
            } else if (!isValidEmail(email.value)) {
                var m3b = 'L\'adresse e-mail doit contenir un « @ » et un domaine valide (ex : jean@exemple.fr).';
                setFieldError(email, 'adh-email-err', m3b);
                errors.push({ id: 'adh-email', label: 'Adresse e-mail', message: m3b });
            } else {
                setFieldError(email, 'adh-email-err', '');
            }

            var telDigits = tel.value.replace(/[\s.-]/g, '');
            if (tel.value.trim() && !/^0[1-9]\d{8}$/.test(telDigits)) {
                var m4 = 'Si vous renseignez un numéro de téléphone, il doit contenir 10 chiffres commençant par 0 (ex : 06 12 34 56 78).';
                setFieldError(tel, 'adh-tel-err', m4);
                errors.push({ id: 'adh-tel', label: 'Téléphone', message: m4 });
            } else {
                setFieldError(tel, 'adh-tel-err', '');
            }

            var tarifErr = document.getElementById('adh-tarif-err');
            if (!tarif) {
                var m5 = 'Veuillez choisir une formule d\'adhésion (solidaire, individuelle ou famille).';
                if (tarifErr) tarifErr.textContent = m5;
                errors.push({ id: 'form-adhesion', label: 'Type d\'adhésion', message: m5 });
            } else if (tarifErr) {
                tarifErr.textContent = '';
            }

            if (errors.length > 0) {
                showErrorSummary(feedback, errors);
                return;
            }

            var veutBenevole = document.getElementById('adh-benevole').checked;
            showSuccess(
                feedback,
                'Demande d\'adhésion validée pour ' + prenom.value.trim() + ' ' + nom.value.trim() + ' !',
                'Formule choisie : ' + tarif.value + '. ' +
                (veutBenevole ? 'Un responsable vous contactera pour la formation d\'accueil des bénévoles.' : 'Votre confirmation a été préparée.')
            );
            form.reset();
        });
    }

    function initDonForm() {
        var form = document.getElementById('form-don');
        var feedback = document.getElementById('don-feedback');
        if (!form || !feedback) return;

        var montantInput = document.getElementById('don-montant');
        var presets = form.querySelectorAll('input[name="don-preset"]');
        presets.forEach(function (radio) {
            radio.addEventListener('change', function () {
                if (radio.value !== 'libre') {
                    montantInput.value = radio.value;
                } else {
                    montantInput.focus();
                }
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var preset = form.querySelector('input[name="don-preset"]:checked');
            var email = document.getElementById('don-email');
            var errors = [];

            var presetErr = document.getElementById('don-preset-err');
            if (!preset) {
                var m1 = 'Veuillez sélectionner un montant prédéfini ou « Montant libre ».';
                if (presetErr) presetErr.textContent = m1;
                errors.push({ id: 'form-don', label: 'Montant souhaité', message: m1 });
            } else if (presetErr) {
                presetErr.textContent = '';
            }

            var montantVal = preset && preset.value !== 'libre' ? Number(preset.value) : Number(montantInput.value);
            if (!montantVal || isNaN(montantVal) || montantVal < 5) {
                var m2 = 'Le montant du don doit être un nombre supérieur ou égal à 5 €.';
                setFieldError(montantInput, 'don-montant-err', m2);
                errors.push({ id: 'don-montant', label: 'Montant en euros', message: m2 });
            } else {
                setFieldError(montantInput, 'don-montant-err', '');
            }

            if (!email.value.trim() || !isValidEmail(email.value)) {
                var m3 = 'Veuillez saisir une adresse e-mail valide pour l\'envoi de votre reçu fiscal.';
                setFieldError(email, 'don-email-err', m3);
                errors.push({ id: 'don-email', label: 'E-mail reçu fiscal', message: m3 });
            } else {
                setFieldError(email, 'don-email-err', '');
            }

            if (errors.length > 0) {
                showErrorSummary(feedback, errors);
                return;
            }

            showSuccess(
                feedback,
                'Merci pour votre soutien de ' + montantVal + ' € ! (Simulation Front-End)',
                'Un reçu fiscal de démonstration est associé à l\'adresse ' + email.value.trim() + '.'
            );
            form.reset();
        });
    }
})();