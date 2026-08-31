// ==========================================
// LISTE DES PAYS ET UNIVERSITES
// ==========================================
const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyhlj_Qy3BGT2JmudzyzJsZiWpYKVi8FTS5yksOGnJhgsiq7PH4CbKetB4_Jl5q-mQs/exec";
// =====================================================
// CONFIGURATION DES API
// =====================================================

// API pour récupérer les pays
const API_PAYS =
    "https://restcountries.com/v3.1/all?fields=name,cca2";

// API pour rechercher les universités
const API_UNIVERSITES =
    "https://universities.hipolabs.com/search?country=";


// =====================================================
// RECUPERATION DES ELEMENTS HTML
// =====================================================

const paysSelect = document.getElementById("pays");
const universiteSelect = document.getElementById("universite");
const formulaire = document.getElementById("candidatureForm");
const message = document.getElementById("message");


// =====================================================
// CHARGER LES PAYS AUTOMATIQUEMENT
// =====================================================

async function chargerPays() {

    try {

        // Afficher un message pendant le chargement
        paysSelect.innerHTML =
            '<option value="">Chargement des pays...</option>';

        paysSelect.disabled = true;

        // Appel de l'API
        const response = await fetch(API_PAYS);

        // Vérifier la réponse
        if (!response.ok) {
            throw new Error("Impossible de récupérer les pays.");
        }

        // Transformer la réponse en JSON
        const pays = await response.json();

        // Trier les pays par ordre alphabétique
        pays.sort(function(a, b) {

            return a.name.common.localeCompare(
                b.name.common,
                "fr"
            );

        });

        // Vider la liste
        paysSelect.innerHTML =
            '<option value="">-- Sélectionnez un pays --</option>';

        // Ajouter les pays
        pays.forEach(function(pays) {

            const option = document.createElement("option");

            // Nom affiché
            option.textContent = pays.name.common;

            // Valeur envoyée à l'API universités
            option.value = pays.name.common;

            paysSelect.appendChild(option);

        });

        // Réactiver la liste
        paysSelect.disabled = false;

    } catch (error) {

        console.error(error);

        paysSelect.innerHTML =
            '<option value="">Erreur de chargement des pays</option>';

        alert(
            "Impossible de charger la liste des pays."
        );
    }
}


// =====================================================
// CHARGER LES UNIVERSITES DU PAYS SELECTIONNE
// =====================================================

async function chargerUniversites(pays) {

    try {

        // Désactiver pendant le chargement
        universiteSelect.disabled = true;

        universiteSelect.innerHTML =
            '<option value="">Chargement des universités...</option>';

        // Construire l'URL
        const url =
            API_UNIVERSITES + encodeURIComponent(pays);

        // Appel de l'API
        const response = await fetch(url);

        // Vérifier la réponse
        if (!response.ok) {

            throw new Error(
                "Impossible de récupérer les universités."
            );
        }

        // Convertir en JSON
        const universites = await response.json();

        // Vider la liste
        universiteSelect.innerHTML = "";

        // Vérifier s'il y a des résultats
        if (universites.length === 0) {

            universiteSelect.innerHTML =
                '<option value="">Aucune université trouvée</option>';

            return;
        }

        // Option par défaut
        const optionDefaut =
            document.createElement("option");

        optionDefaut.value = "";

        optionDefaut.textContent =
            "-- Sélectionnez une université --";

        universiteSelect.appendChild(optionDefaut);


        // =================================================
        // AJOUTER LES UNIVERSITES
        // =================================================

        universites.forEach(function(universite) {

            const option =
                document.createElement("option");

            option.value = universite.name;

            option.textContent = universite.name;

            universiteSelect.appendChild(option);

        });

        // Activer la liste
        universiteSelect.disabled = false;

    } catch (error) {

        console.error(error);

        universiteSelect.innerHTML =
            '<option value="">Erreur de chargement</option>';

        alert(
            "Impossible de charger les universités de ce pays."
        );
    }
}


// =====================================================
// EVENEMENT : CHANGEMENT DU PAYS
// =====================================================

paysSelect.addEventListener(
    "change",
    function() {

        const paysSelectionne = this.value;

        // Aucun pays
        if (paysSelectionne === "") {

            universiteSelect.disabled = true;

            universiteSelect.innerHTML =
                '<option value="">-- Sélectionnez d\'abord un pays --</option>';

            return;
        }

        // Charger les universités
        chargerUniversites(paysSelectionne);

    }
);


// =====================================================
// ENVOI DU FORMULAIRE
// =====================================================

formulaire.addEventListener(
    "submit",
    function(event) {

        // Empêcher le rechargement
        event.preventDefault();

        // Récupérer les informations
        const nom =
            document.getElementById("nom")
                .value
                .trim();

        const prenom =
            document.getElementById("prenom")
                .value
                .trim();

        const pays =
            paysSelect.value;

        const universite =
            universiteSelect.value;


        // =================================================
        // VERIFICATION
        // =================================================

        if (
            nom === "" ||
            prenom === "" ||
            pays === "" ||
            universite === ""
        ) {

            alert(
                "Veuillez remplir tous les champs."
            );

            return;
        }


        // =================================================
        // AFFICHER LA CONFIRMATION
        // =================================================

        message.textContent =
            "Candidature envoyée avec succès ! " +
            prenom + " " +
            nom +
            ", votre candidature pour " +
            universite +
            " (" +
            pays +
            ") a été enregistrée.";

        message.classList.add("success");


        // =================================================
        // REINITIALISER LE FORMULAIRE
        // =================================================

        formulaire.reset();

        universiteSelect.disabled = true;

        universiteSelect.innerHTML =
            '<option value="">-- Sélectionnez d\'abord un pays --</option>';


        // =================================================
        // CACHER LE MESSAGE
        // =================================================

        setTimeout(function() {

            message.classList.remove("success");

            message.textContent = "";

        }, 5000);

    }
);


// =====================================================
// LANCER LE CHARGEMENT DES PAYS
// =====================================================

chargerPays();
