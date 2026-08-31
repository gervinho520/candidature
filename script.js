// =====================================================
// URL GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyhlj_Qy3BGT2JmudzyzJsZiWpYKVi8FTS5yksOGnJhgsiq7PH4CbKetB4_Jl5q-mQs/exec";


// =====================================================
// API DES PAYS
// =====================================================

const API_PAYS =
    "https://countries.dev/countries?fields=name";


// =====================================================
// API DES UNIVERSITES
// =====================================================

const API_UNIVERSITES =
    "https://universities.hipolabs.com/search?country=";


// =====================================================
// RECUPERATION DES ELEMENTS HTML
// =====================================================

const paysSelect =
    document.getElementById("pays");

const universiteSelect =
    document.getElementById("universite");

const formulaire =
    document.getElementById("candidatureForm");

const message =
    document.getElementById("message");


// =====================================================
// CHARGER LES PAYS
// =====================================================

async function chargerPays() {

    try {

        paysSelect.disabled = true;

        paysSelect.innerHTML =
            '<option value="">Chargement des pays...</option>';


        const response =
            await fetch(API_PAYS);


        if (!response.ok) {

            throw new Error(
                "Erreur HTTP : " +
                response.status
            );
        }


        const resultat =
            await response.json();


        console.log(
            "Pays reçus :",
            resultat
        );


        // =================================================
        // VERIFIER LA STRUCTURE DES DONNEES
        // =================================================

        let pays = [];


        // Si l'API renvoie directement un tableau
        if (Array.isArray(resultat)) {

            pays = resultat;

        }

        // Si l'API renvoie { data: [...] }
        else if (
            resultat.data &&
            Array.isArray(resultat.data)
        ) {

            pays = resultat.data;

        }

        else {

            throw new Error(
                "Format des données des pays inconnu."
            );
        }


        // =================================================
        // TRIER LES PAYS
        // =================================================

        pays.sort(function(a, b) {

            const nomA =
                typeof a === "string"
                    ? a
                    : a.name;

            const nomB =
                typeof b === "string"
                    ? b
                    : b.name;


            return nomA.localeCompare(
                nomB,
                "fr"
            );

        });


        // =================================================
        // OPTION PAR DEFAUT
        // =================================================

        paysSelect.innerHTML =
            '<option value="">-- Sélectionnez un pays --</option>';


        // =================================================
        // AJOUTER LES PAYS
        // =================================================

        pays.forEach(function(pays) {

            const option =
                document.createElement("option");


            const nomPays =
                typeof pays === "string"
                    ? pays
                    : pays.name;


            option.value =
                nomPays;


            option.textContent =
                nomPays;


            paysSelect.appendChild(
                option
            );

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
            "Impossible de charger la liste des pays."
        );
    }
}


// =====================================================
// CHARGER LES UNIVERSITES
// =====================================================

async function chargerUniversites(
    pays
) {

    try {

        universiteSelect.disabled =
            true;


        universiteSelect.innerHTML =
            '<option value="">Chargement des universités...</option>';


        const url =
            API_UNIVERSITES +
            encodeURIComponent(pays);


        console.log(
            "URL universités :",
            url
        );


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Erreur HTTP : " +
                response.status
            );
        }


        const universites =
            await response.json();


        console.log(
            "Universités reçues :",
            universites
        );


        // =================================================
        // VIDER LA LISTE
        // =================================================

        universiteSelect.innerHTML =
            "";


        // =================================================
        // AUCUNE UNIVERSITE
        // =================================================

        if (
            !Array.isArray(universites) ||
            universites.length === 0
        ) {

            universiteSelect.innerHTML =
                '<option value="">Aucune université trouvée</option>';

            return;
        }


        // =================================================
        // OPTION PAR DEFAUT
        // =================================================

        const optionDefaut =
            document.createElement("option");


        optionDefaut.value = "";


        optionDefaut.textContent =
            "-- Sélectionnez une université --";


        universiteSelect.appendChild(
            optionDefaut
        );


        // =================================================
        // AJOUTER LES UNIVERSITES
        // =================================================

        universites.forEach(
            function(universite) {

                if (!universite.name) {
                    return;
                }


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    universite.name;


                option.textContent =
                    universite.name;


                universiteSelect.appendChild(
                    option
                );

            }
        );


        universiteSelect.disabled =
            false;


    } catch (error) {

        console.error(
            "Erreur chargement universités :",
            error
        );


        universiteSelect.innerHTML =
            '<option value="">Erreur de chargement</option>';


        alert(
            "Impossible de charger les universités."
        );
    }
}


// =====================================================
// QUAND LE PAYS CHANGE
// =====================================================

paysSelect.addEventListener(
    "change",
    function() {

        const pays =
            this.value;


        // Aucun pays
        if (pays === "") {

            universiteSelect.disabled =
                true;


            universiteSelect.innerHTML =
                '<option value="">-- Sélectionnez d\'abord un pays --</option>';


            return;
        }


        // Charger les universités
        chargerUniversites(
            pays
        );

    }
);


// =====================================================
// ENVOYER LA CANDIDATURE
// =====================================================

formulaire.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        // =================================================
        // RECUPERER LES DONNEES
        // =================================================

        const nom =
            document
                .getElementById("nom")
                .value
                .trim();


        const prenom =
            document
                .getElementById("prenom")
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
        // BOUTON
        // =================================================

        const bouton =
            formulaire.querySelector(
                "button"
            );


        bouton.disabled =
            true;


        bouton.textContent =
            "Envoi en cours...";


        // =================================================
        // PREPARER LES DONNEES
        // =================================================

        const donnees =
            new URLSearchParams();


        donnees.append(
            "action",
            "candidature"
        );


        donnees.append(
            "nom",
            nom
        );


        donnees.append(
            "prenom",
            prenom
        );


        donnees.append(
            "pays",
            pays
        );


        donnees.append(
            "universite",
            universite
        );


        try {

            // =================================================
            // ENVOYER VERS GOOGLE APPS SCRIPT
            // =================================================

            await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method: "POST",
                    body: donnees
                }
            );


            // =================================================
            // MESSAGE DE SUCCES
            // =================================================

            message.textContent =
                "✅ Candidature envoyée avec succès !";


            message.classList.remove(
                "error"
            );


            message.classList.add(
                "success"
            );


            // =================================================
            // REINITIALISER
            // =================================================

            formulaire.reset();


            universiteSelect.disabled =
                true;


            universiteSelect.innerHTML =
                '<option value="">-- Sélectionnez d\'abord un pays --</option>';


        } catch (error) {

            console.error(
                "Erreur envoi candidature :",
                error
            );


            message.textContent =
                "❌ Erreur lors de l'envoi de la candidature.";


            message.classList.remove(
                "success"
            );


            message.classList.add(
                "error"
            );

        } finally {

            bouton.disabled =
                false;


            bouton.textContent =
                "Envoyer la candidature";
        }

    }
);


// =====================================================
// DEMARRER LE CHARGEMENT DES PAYS
// =====================================================

chargerPays();
