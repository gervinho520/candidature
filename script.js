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
    "https://countriesnow.space/api/v0.1/countries";

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

        paysSelect.disabled = true;

        paysSelect.innerHTML =
            '<option value="">Chargement des pays...</option>';

        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries"
        );

        if (!response.ok) {
            throw new Error(
                "Erreur HTTP : " + response.status
            );
        }

        const resultat = await response.json();

        console.log("Réponse API :", resultat);

        if (!resultat.data) {
            throw new Error(
                "Aucun pays reçu"
            );
        }

        // Trier les pays
        resultat.data.sort(function(a, b) {

            return a.country.localeCompare(
                b.country,
                "fr"
            );

        });

        // Réinitialiser
        paysSelect.innerHTML =
            '<option value="">-- Sélectionnez un pays --</option>';

        // Ajouter les pays
        resultat.data.forEach(function(pays) {

            const option =
                document.createElement("option");

            option.value = pays.country;

            option.textContent =
                pays.country;

            paysSelect.appendChild(option);

        });

        paysSelect.disabled = false;

    } catch (error) {

        console.error(
            "Erreur chargement des pays :",
            error
        );

        paysSelect.innerHTML =
            '<option value="">Erreur de chargement</option>';

        alert(
            "Impossible de charger les pays."
        );
    }
}


// =====================================================
// CHARGER LES UNIVERSITES DU PAYS SELECTIONNE
// =====================================================

async function chargerUniversites(pays) {

    try {

        universiteSelect.disabled = true;

        universiteSelect.innerHTML =
            '<option value="">Chargement...</option>';

        const url =
            API_UNIVERSITES +
            encodeURIComponent(pays);

        const response =
            await fetch(url);

        if (!response.ok) {
            throw new Error(
                "Erreur HTTP : " + response.status
            );
        }

        const universites =
            await response.json();

        universiteSelect.innerHTML = "";

        if (
            !Array.isArray(universites) ||
            universites.length === 0
        ) {

            universiteSelect.innerHTML =
                '<option value="">Aucune université trouvée</option>';

            return;
        }

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "-- Sélectionnez une université --";

        universiteSelect.appendChild(option);

        universites.forEach(function(universite) {

            const option =
                document.createElement("option");

            option.value =
                universite.name;

            option.textContent =
                universite.name;

            universiteSelect.appendChild(
                option
            );

        });

        universiteSelect.disabled = false;

    } catch (error) {

        console.error(
            "Erreur universités :",
            error
        );

        universiteSelect.innerHTML =
            '<option value="">Erreur de chargement</option>';
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
