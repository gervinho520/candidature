// =====================================================
// URL GOOGLE APPS SCRIPT
// =====================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyhlj_Qy3BGT2JmudzyzJsZiWpYKVi8FTS5yksOGnJhgsiq7PH4CbKetB4_Jl5q-mQs/exec";


// =====================================================
// CONFIGURATION
// =====================================================

// Liste des pays
const COUNTRIES_JSON_URL =
    "https://raw.githubusercontent.com/mledoze/countries/master/countries.json";

// Liste des universités
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
// VARIABLES GLOBALES
// =====================================================

// Contiendra les pays
let tousLesPays = [];

// Contiendra toutes les universités
let toutesLesUniversites = [];


// =====================================================
// CHARGER LES PAYS
// =====================================================

async function chargerPays() {

    try {

        paysSelect.disabled = true;

        paysSelect.innerHTML =
            '<option value="">Chargement des pays...</option>';


        // Requête vers GitHub

        const response =
            await fetch(COUNTRIES_JSON_URL);


        if (!response.ok) {

            throw new Error(
                "Erreur HTTP : " +
                response.status
            );

        }


        tousLesPays =
            await response.json();


        console.log(
            "Pays chargés :",
            tousLesPays.length
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
        // VIDER LE SELECT
        // =================================================

        paysSelect.innerHTML =
            '<option value="">-- Sélectionnez un pays --</option>';


        // =================================================
        // AJOUTER LES PAYS
        // =================================================

        tousLesPays.forEach(
            function(pays) {

                // Code ISO alpha-2
                const codeISO =
                    pays.cca2;


                // Nom du pays
                const nomPays =
                    pays.name.common;


                // Vérifier que les données existent

                if (
                    !codeISO ||
                    !nomPays
                ) {

                    return;

                }


                const option =
                    document.createElement(
                        "option"
                    );


                // IMPORTANT :
                // La valeur sera le code ISO

                option.value =
                    codeISO;


                // Ce que l'utilisateur voit

                option.textContent =
                    nomPays;


                paysSelect.appendChild(
                    option
                );

            }
        );


        paysSelect.disabled =
            false;


    } catch (error) {

        console.error(
            "Erreur chargement pays :",
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
// CHARGER TOUTES LES UNIVERSITES
// =====================================================

async function chargerToutesLesUniversites() {

    try {

        const response =
            await fetch(
                UNIVERSITIES_JSON_URL
            );


        if (!response.ok) {

            throw new Error(
                "Erreur HTTP : " +
                response.status
            );

        }


        toutesLesUniversites =
            await response.json();


        console.log(
            "Universités chargées :",
            toutesLesUniversites.length
        );


    } catch (error) {

        console.error(
            "Erreur chargement universités :",
            error
        );


        throw error;

    }

}


// =====================================================
// CONVERTIR CODE ISO → NOM DU PAYS
// =====================================================

function obtenirNomPays(codeISO) {

    const pays =
        tousLesPays.find(
            function(pays) {

                return (
                    pays.cca2 ===
                    codeISO
                );

            }
        );


    if (pays) {

        return pays.name.common;

    }


    return "";

}


// =====================================================
// CHARGER LES UNIVERSITES D'UN PAYS
// =====================================================

function chargerUniversites(codeISO) {

    try {

        universiteSelect.disabled =
            true;


        universiteSelect.innerHTML =
            '<option value="">Recherche des universités...</option>';


        // =================================================
        // NOM DU PAYS
        // =================================================

        const nomPays =
            obtenirNomPays(codeISO);


        if (nomPays === "") {

            throw new Error(
                "Pays introuvable."
            );

        }


        console.log(
            "Pays sélectionné :",
            nomPays
        );


        console.log(
            "Code ISO :",
            codeISO
        );


        // =================================================
        // RECHERCHE PAR CODE ISO
        // =================================================

        let universites =
            toutesLesUniversites.filter(
                function(universite) {

                    if (
                        !universite.country
                    ) {

                        return false;

                    }


                    // Certains fichiers utilisent
                    // le nom du pays.
                    //
                    // On compare donc le nom officiel
                    // et le nom commun.

                    const paysUniversite =
                        universite.country
                            .trim()
                            .toLowerCase();


                    const nomPaysMinuscule =
                        nomPays
                            .trim()
                            .toLowerCase();


                    return (
                        paysUniversite ===
                        nomPaysMinuscule
                    );

                }
            );


        // =================================================
        // SI LE NOM NE CORRESPOND PAS
        // =================================================
        // On essaie également avec les noms
        // officiels et les traductions.

        if (universites.length === 0) {

            const paysObjet =
                tousLesPays.find(
                    function(pays) {

                        return (
                            pays.cca2 ===
                            codeISO
                        );

                    }
                );


            if (paysObjet) {

                const nomsPossibles = [];


                // Nom commun

                if (
                    paysObjet.name &&
                    paysObjet.name.common
                ) {

                    nomsPossibles.push(
                        paysObjet.name.common
                            .toLowerCase()
                    );

                }


                // Nom officiel

                if (
                    paysObjet.name &&
                    paysObjet.name.official
                ) {

                    nomsPossibles.push(
                        paysObjet.name.official
                            .toLowerCase()
                    );

                }


                // Noms alternatifs

                if (
                    paysObjet.altSpellings
                ) {

                    paysObjet.altSpellings.forEach(
                        function(nom) {

                            nomsPossibles.push(
                                nom.toLowerCase()
                            );

                        }
                    );

                }


                universites =
                    toutesLesUniversites.filter(
                        function(universite) {

                            if (
                                !universite.country
                            ) {

                                return false;

                            }


                            const paysUniversite =
                                universite.country
                                    .trim()
                                    .toLowerCase();


                            return nomsPossibles.includes(
                                paysUniversite
                            );

                        }
                    );

            }

        }


        // =================================================
        // SUPPRIMER LES DOUBLONS
        // =================================================

        const nomsUniversites =
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


                    if (
                        nomsUniversites.has(
                            nom.toLowerCase()
                        )
                    ) {

                        return false;

                    }


                    nomsUniversites.add(
                        nom.toLowerCase()
                    );


                    return true;

                }
            );


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
        // AFFICHER LES RESULTATS
        // =================================================

        universiteSelect.innerHTML =
            '<option value="">-- Sélectionnez une université --</option>';


        if (
            universites.length === 0
        ) {

            universiteSelect.innerHTML =
                '<option value="">Aucune université trouvée</option>';


            console.warn(
                "Aucune université trouvée pour :",
                nomPays,
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


                // Stocker également le site web
                // s'il existe

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


        universiteSelect.disabled =
            false;


        console.log(
            universites.length +
            " université(s) trouvée(s)."
        );


    } catch (error) {

        console.error(
            "Erreur universités :",
            error
        );


        universiteSelect.innerHTML =
            '<option value="">Erreur de chargement</option>';


        universiteSelect.disabled =
            true;

    }

}


// =====================================================
// CHANGEMENT DU PAYS
// =====================================================

paysSelect.addEventListener(
    "change",
    function() {

        const codeISO =
            this.value;


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
// ENVOI DE LA CANDIDATURE
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


        const codeISO =
            paysSelect.value;


        const universite =
            universiteSelect.value;


        // =================================================
        // NOM DU PAYS
        // =================================================

        const pays =
            obtenirNomPays(
                codeISO
            );


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


        bouton.disabled =
            true;


        bouton.textContent =
            "Envoi en cours...";


        // =================================================
        // DONNEES POUR GOOGLE SHEETS
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
            // ENVOYER VERS GOOGLE APPS SCRIPT
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


            // =================================================
            // RESET
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


            message.textContent =
                "❌ Une erreur est survenue lors de l'envoi.";


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


        // =================================================
        // FAIRE DISPARAITRE LE MESSAGE
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
// INITIALISATION
// =====================================================

async function initialiser() {

    try {

        // Charger les pays

        await chargerPays();


        // Charger les universités

        await chargerToutesLesUniversites();


        console.log(
            "Application initialisée avec succès."
        );


    } catch (error) {

        console.error(
            "Erreur d'initialisation :",
            error
        );

    }

}


// =====================================================
// LANCER L'APPLICATION
// =====================================================

initialiser();
