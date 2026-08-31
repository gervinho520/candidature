// =====================================================
// URL GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyhlj_Qy3BGT2JmudzyzJsZiWpYKVi8FTS5yksOGnJhgsiq7PH4CbKetB4_Jl5q-mQs/exec";


// =====================================================
// URL DES FICHIERS JSON
// =====================================================

const COUNTRIES_JSON_URL =
    "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

const UNIVERSITIES_JSON_URL =
    "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";


// =====================================================
// ELEMENTS HTML
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
// VARIABLES
// =====================================================

let tousLesPays = [];
let toutesLesUniversites = [];


// =====================================================
// CHARGER LES DONNEES
// =====================================================

async function chargerDonnees() {

    try {

        paysSelect.disabled = true;

        universiteSelect.disabled = true;

        paysSelect.innerHTML =
            '<option value="">Chargement des pays...</option>';

        universiteSelect.innerHTML =
            '<option value="">Chargement...</option>';


        // Charger les deux fichiers en même temps

        const [responsePays, responseUniversites] =
            await Promise.all([

                fetch(COUNTRIES_JSON_URL),

                fetch(UNIVERSITIES_JSON_URL)

            ]);


        // Vérifier les pays

        if (!responsePays.ok) {

            throw new Error(
                "Impossible de charger les pays. HTTP " +
                responsePays.status
            );

        }


        // Vérifier les universités

        if (!responseUniversites.ok) {

            throw new Error(
                "Impossible de charger les universités. HTTP " +
                responseUniversites.status
            );

        }


        // Convertir en JSON

        tousLesPays =
            await responsePays.json();

        toutesLesUniversites =
            await responseUniversites.json();


        console.log(
            "Nombre de pays :",
            tousLesPays.length
        );

        console.log(
            "Nombre d'universités :",
            toutesLesUniversites.length
        );


        // =================================================
        // TRIER LES PAYS
        // =================================================

        tousLesPays.sort(function(a, b) {

            return a.name.common.localeCompare(
                b.name.common,
                "fr"
            );

        });


        // =================================================
        // REMPLIR LE SELECT DES PAYS
        // =================================================

        paysSelect.innerHTML =
            '<option value="">-- Sélectionnez un pays --</option>';


        tousLesPays.forEach(function(pays) {

            if (!pays.cca2) {
                return;
            }


            const option =
                document.createElement("option");


            // IMPORTANT :
            // value = code ISO

            option.value =
                pays.cca2.toUpperCase();


            // Texte affiché

            option.textContent =
                pays.name.common;


            paysSelect.appendChild(option);

        });


        paysSelect.disabled = false;


        universiteSelect.innerHTML =
            '<option value="">-- Sélectionnez d\'abord un pays --</option>';


        console.log(
            "Données chargées correctement."
        );


    } catch (error) {

        console.error(
            "Erreur de chargement :",
            error
        );


        paysSelect.innerHTML =
            '<option value="">Erreur de chargement</option>';


        universiteSelect.innerHTML =
            '<option value="">Erreur de chargement</option>';


        alert(
            "Impossible de charger les données. Vérifiez votre connexion Internet."
        );

    }

}


// =====================================================
// CHARGER LES UNIVERSITES DU PAYS
// =====================================================

function chargerUniversites(codeISO) {

    console.log(
        "Code ISO sélectionné :",
        codeISO
    );


    universiteSelect.disabled = true;

    universiteSelect.innerHTML =
        '<option value="">Recherche des universités...</option>';


    try {

        // =================================================
        // FILTRER PAR CODE ISO
        // =================================================

        const universites =
            toutesLesUniversites.filter(
                function(universite) {

                    if (
                        !universite.alpha_two_code
                    ) {

                        return false;

                    }


                    return (
                        universite.alpha_two_code
                            .toUpperCase() ===
                        codeISO.toUpperCase()
                    );

                }
            );


        console.log(
            "Universités trouvées pour",
            codeISO,
            ":",
            universites.length
        );


        // =================================================
        // VIDER LE SELECT
        // =================================================

        universiteSelect.innerHTML =
            '<option value="">-- Sélectionnez une université --</option>';


        // =================================================
        // AUCUNE UNIVERSITE
        // =================================================

        if (
            universites.length === 0
        ) {

            universiteSelect.innerHTML =
                '<option value="">Aucune université trouvée pour ce pays</option>';


            console.warn(
                "Aucune université pour le code ISO :",
                codeISO
            );


            return;

        }


        // =================================================
        // TRIER LES UNIVERSITES
        // =================================================

        universites.sort(
            function(a, b) {

                return a.name.localeCompare(
                    b.name,
                    "fr"
                );

            }
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


                // Garder le site web si disponible

                if (
                    universite.web_pages &&
                    universite.web_pages.length > 0
                ) {

                    option.dataset.website =
                        universite.web_pages[0];

                }


                universiteSelect.appendChild(
                    option
                );

            }
        );


        universiteSelect.disabled = false;


    } catch (error) {

        console.error(
            "Erreur chargement universités :",
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

        const codeISO =
            this.value;


        console.log(
            "Pays sélectionné :",
            codeISO
        );


        if (codeISO === "") {

            universiteSelect.disabled =
                true;


            universiteSelect.innerHTML =
                '<option value="">-- Sélectionnez d\'abord un pays --</option>';


            return;

        }


        chargerUniversites(
            codeISO
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


        const codeISO =
            paysSelect.value;


        const universite =
            universiteSelect.value;


        // Trouver le pays à partir du code ISO

        const paysObjet =
            tousLesPays.find(
                function(pays) {

                    return (
                        pays.cca2 &&
                        pays.cca2.toUpperCase() ===
                        codeISO.toUpperCase()
                    );

                }
            );


        const pays =
            paysObjet
                ? paysObjet.name.common
                : "";


        // =================================================
        // VERIFICATION
        // =================================================

        if (
            nom === "" ||
            prenom === "" ||
            codeISO === "" ||
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


        bouton.disabled = true;

        bouton.textContent =
            "Envoi en cours...";


        // =================================================
        // DONNEES
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
            "codeISO",
            codeISO
        );


        donnees.append(
            "universite",
            universite
        );


        try {

            // =================================================
            // GOOGLE APPS SCRIPT
            // =================================================

            await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method: "POST",
                    body: donnees,
                    mode: "no-cors"
                }
            );


            // =================================================
            // SUCCES
            // =================================================

            message.textContent =
                "✅ Candidature envoyée avec succès !";


            message.classList.remove(
                "error"
            );


            message.classList.add(
                "success"
            );


            // Réinitialiser

            formulaire.reset();


            universiteSelect.disabled =
                true;


            universiteSelect.innerHTML =
                '<option value="">-- Sélectionnez d\'abord un pays --</option>';


        } catch (error) {

            console.error(
                "Erreur envoi :",
                error
            );


            message.textContent =
                "❌ Erreur lors de l'envoi.";


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


        setTimeout(
            function() {

                message.textContent =
                    "";

                message.classList.remove(
                    "success",
                    "error"
                );

            },
            5000
        );

    }
);


// =====================================================
// DEMARRER
// =====================================================

chargerDonnees();
