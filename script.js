// =====================================================
// URL GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbymXC0eSew3Kctk5v5a6BBvcH9M8SyTC9IGjNgvdM71OE9w-cqDVrnq1k4m4Yhyn4okCQ/exec";


// =====================================================
// CONFIGURATION
// =====================================================


// -----------------------------------------------------
// Fichier JSON des pays
// -----------------------------------------------------

const COUNTRIES_JSON_URL =
    "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";


// -----------------------------------------------------
// Fichier JSON des universités
// -----------------------------------------------------

const UNIVERSITIES_JSON_URL =
    "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";


// -----------------------------------------------------
// GOOGLE APPS SCRIPT
// -----------------------------------------------------
//
// IMPORTANT : remplace cette URL par TON URL
// Google Apps Script qui se termine par /exec
//





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

const bouton =
    document.getElementById("btnEnvoyer");



// =====================================================
// VARIABLES
// =====================================================

// Tous les pays
let tousLesPays = [];

// Toutes les universités
let toutesLesUniversites = [];



// =====================================================
// CHARGEMENT DES DONNEES
// =====================================================

async function chargerDonnees() {

    try {

        console.log(
            "Chargement des données..."
        );


        // Désactiver les listes

        paysSelect.disabled = true;

        universiteSelect.disabled = true;


        // Message de chargement

        paysSelect.innerHTML =
            '<option value="">Chargement des pays...</option>';

        universiteSelect.innerHTML =
            '<option value="">Chargement des universités...</option>';


        // =================================================
        // CHARGER LES DEUX FICHIERS
        // =================================================

        const resultats =
            await Promise.all([

                fetch(COUNTRIES_JSON_URL),

                fetch(UNIVERSITIES_JSON_URL)

            ]);


        const responsePays =
            resultats[0];

        const responseUniversites =
            resultats[1];


        // =================================================
        // VERIFICATION PAYS
        // =================================================

        if (!responsePays.ok) {

            throw new Error(
                "Erreur lors du chargement des pays : HTTP " +
                responsePays.status
            );

        }


        // =================================================
        // VERIFICATION UNIVERSITES
        // =================================================

        if (!responseUniversites.ok) {

            throw new Error(
                "Erreur lors du chargement des universités : HTTP " +
                responseUniversites.status
            );

        }


        // =================================================
        // CONVERSION JSON
        // =================================================

        tousLesPays =
            await responsePays.json();

        toutesLesUniversites =
            await responseUniversites.json();


        console.log(
            "Pays chargés :",
            tousLesPays.length
        );


        console.log(
            "Universités chargées :",
            toutesLesUniversites.length
        );


        // =================================================
        // TRIER LES PAYS
        // =================================================

        tousLesPays.sort(
            function(a, b) {

                return a.name.common.localeCompare(
                    b.name.common,
                    "fr"
                );

            }
        );


        // =================================================
        // AFFICHER LES PAYS
        // =================================================

        paysSelect.innerHTML =
            '<option value="">-- Sélectionnez un pays --</option>';


        tousLesPays.forEach(
            function(pays) {

                // Vérifier le code ISO

                if (!pays.cca2) {

                    return;

                }


                // Vérifier le nom

                if (
                    !pays.name ||
                    !pays.name.common
                ) {

                    return;

                }


                const option =
                    document.createElement(
                        "option"
                    );


                // =================================================
                // VALUE = CODE ISO
                // =================================================

                option.value =
                    pays.cca2.toUpperCase();


                // =================================================
                // TEXTE AFFICHÉ
                // =================================================

                option.textContent =
                    pays.name.common;


                paysSelect.appendChild(
                    option
                );

            }
        );


        // Activer le pays

        paysSelect.disabled = false;


        // Réinitialiser université

        universiteSelect.disabled = true;

        universiteSelect.innerHTML =
            '<option value="">-- Sélectionnez d\'abord un pays --</option>';


        console.log(
            "Application prête."
        );


    } catch (error) {

        console.error(
            "Erreur générale :",
            error
        );


        paysSelect.disabled = true;

        universiteSelect.disabled = true;


        paysSelect.innerHTML =
            '<option value="">Impossible de charger les pays</option>';


        universiteSelect.innerHTML =
            '<option value="">Impossible de charger les universités</option>';


        afficherMessage(
            "❌ Impossible de charger les données. Vérifiez votre connexion Internet.",
            "error"
        );

    }

}



// =====================================================
// TROUVER LE NOM D'UN PAYS AVEC SON CODE ISO
// =====================================================

function trouverPays(codeISO) {

    return tousLesPays.find(
        function(pays) {

            return (
                pays.cca2 &&
                pays.cca2.toUpperCase() ===
                codeISO.toUpperCase()
            );

        }
    );

}



// =====================================================
// CHARGER LES UNIVERSITES
// =====================================================

function chargerUniversites(codeISO) {

    console.log(
        "Recherche des universités pour :",
        codeISO
    );


    // Désactiver pendant la recherche

    universiteSelect.disabled = true;


    universiteSelect.innerHTML =
        '<option value="">Recherche des universités...</option>';


    try {

        // =================================================
        // RECHERCHE DIRECTE PAR CODE ISO
        // =================================================
        //
        // Le fichier Hipo contient :
        //
        // alpha_two_code
        // country
        // name
        //
        // Exemple :
        //
        // alpha_two_code : "BI"
        // country        : "Burundi"
        //
        // =================================================

        let universites =
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
            "Universités trouvées :",
            universites.length
        );


        // =================================================
        // TRIER
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
        // NETTOYER LES DOUBLONS
        // =================================================

        const nomsDejaAjoutes =
            new Set();


        universites =
            universites.filter(
                function(universite) {

                    if (
                        !universite.name
                    ) {

                        return false;

                    }


                    const nom =
                        universite.name.trim();


                    const cle =
                        nom.toLowerCase();


                    if (
                        nomsDejaAjoutes.has(
                            cle
                        )
                    ) {

                        return false;

                    }


                    nomsDejaAjoutes.add(
                        cle
                    );


                    return true;

                }
            );


        // =================================================
        // SELECT UNIVERSITE
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
                '<option value="">Aucune université trouvée</option>';


            console.warn(
                "Aucune université trouvée pour :",
                codeISO
            );


            return;

        }


        // =================================================
        // AJOUTER LES UNIVERSITES
        // =================================================

        universites.forEach(
            function(universite) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    universite.name;


                option.textContent =
                    universite.name;


                // Si le site web existe

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


        // Activer

        universiteSelect.disabled =
            false;


        console.log(
            universites.length +
            " université(s) affichée(s)."
        );


    } catch (error) {

        console.error(
            "Erreur chargement universités :",
            error
        );


        universiteSelect.disabled =
            true;


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
            "Code ISO choisi :",
            codeISO
        );


        // Aucun pays

        if (
            codeISO === ""
        ) {

            universiteSelect.disabled =
                true;


            universiteSelect.innerHTML =
                '<option value="">-- Sélectionnez d\'abord un pays --</option>';


            return;

        }


        // Charger les universités

        chargerUniversites(
            codeISO
        );

    }
);



// =====================================================
// AFFICHER UN MESSAGE
// =====================================================

function afficherMessage(
    texte,
    type
) {

    message.textContent =
        texte;


    message.classList.remove(
        "success",
        "error"
    );


    message.classList.add(
        type
    );

}



// =====================================================
// ENVOI DU FORMULAIRE
// =====================================================

formulaire.addEventListener(
    "submit",
    async function(event) {

        // Empêcher le rechargement

        event.preventDefault();


        // =================================================
        // RECUPERER LES VALEURS
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


        const codeISO =
            paysSelect.value;


        const universite =
            universiteSelect.value;


        // =================================================
        // TROUVER LE PAYS
        // =================================================

        const paysObjet =
            trouverPays(
                codeISO
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

            afficherMessage(
                "❌ Veuillez remplir tous les champs.",
                "error"
            );

            return;

        }


        // =================================================
        // VERIFICATION GOOGLE SCRIPT
        // =================================================

        if (
            GOOGLE_SCRIPT_URL ===
            "COLLE_ICI_TON_URL_GOOGLE_APPS_SCRIPT"
        ) {

            afficherMessage(
                "⚠️ L'URL Google Apps Script n'a pas encore été configurée.",
                "error"
            );

            return;

        }


        // =================================================
        // DESACTIVER LE BOUTON
        // =================================================

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
            "codeISO",
            codeISO
        );


        donnees.append(
            "universite",
            universite
        );


        // =================================================
        // ENVOYER GOOGLE SHEETS
        // =================================================

        try {

            await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method: "POST",

                    body: donnees,

                    mode: "no-cors"
                }
            );


            // =================================================
            // MESSAGE DE SUCCES
            // =================================================

            afficherMessage(
                "✅ Candidature envoyée avec succès !",
                "success"
            );


            // =================================================
            // VIDER LE FORMULAIRE
            // =================================================

            formulaire.reset();


            universiteSelect.disabled =
                true;


            universiteSelect.innerHTML =
                '<option value="">-- Sélectionnez d\'abord un pays --</option>';


        } catch (error) {

            console.error(
                "Erreur d'envoi :",
                error
            );


            afficherMessage(
                "❌ Une erreur est survenue lors de l'envoi.",
                "error"
            );

        } finally {

            bouton.disabled =
                false;


            bouton.textContent =
                "Envoyer la candidature";

        }


        // =================================================
        // CACHER LE MESSAGE
        // =================================================

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
// DEMARRAGE
// =====================================================

chargerDonnees();


