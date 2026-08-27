// ==========================================
// LISTE DES PAYS ET UNIVERSITES
// ==========================================
const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxq5e1Bc1agSup5Ol0Uh2qF7Wa9YyFRWDY1Ts0NCSV0Cc8tm72bVUTsOLze0zZEsCaI/exec";
const universitesParPays = {

    "Burundi": [
        "Université du Burundi",
        "Université du Lac Tanganyika",
        "Université Lumière de Bujumbura",
        "Université Espoir d'Afrique",
        "Université Martin Luther King",
        "Université du Grand Lac",
        "Université Sagesse d'Afrique"
    ],

    "Rwanda": [
        "University of Rwanda",
        "Kigali Independent University",
        "University of Kigali",
        "Adventist University of Central Africa",
        "Rwanda Polytechnic",
        "Mount Kigali University"
    ],

    "République démocratique du Congo": [
        "Université de Kinshasa",
        "Université de Lubumbashi",
        "Université de Kisangani",
        "Université Catholique du Congo",
        "Université Protestante au Congo",
        "Université de Goma"
    ],

    "Tanzanie": [
        "University of Dar es Salaam",
        "Sokoine University of Agriculture",
        "Ardhi University",
        "Open University of Tanzania",
        "Mzumbe University"
    ],

    "Kenya": [
        "University of Nairobi",
        "Kenyatta University",
        "Moi University",
        "Strathmore University",
        "Jomo Kenyatta University of Agriculture and Technology"
    ],

    "Ouganda": [
        "Makerere University",
        "Kyambogo University",
        "Mbarara University of Science and Technology",
        "Uganda Christian University",
        "Gulu University"
    ],

    "France": [
        "Sorbonne Université",
        "Université Paris Cité",
        "Université Paris-Saclay",
        "Université de Strasbourg",
        "Université de Bordeaux",
        "Université de Lille"
    ],

    "Belgique": [
        "Université libre de Bruxelles",
        "Université catholique de Louvain",
        "Université de Liège",
        "Université de Namur",
        "Université de Mons"
    ],

    "Canada": [
        "Université de Montréal",
        "Université Laval",
        "Université de Sherbrooke",
        "Université d'Ottawa",
        "Université du Québec à Montréal"
    ],

    "États-Unis": [
        "Harvard University",
        "Stanford University",
        "Massachusetts Institute of Technology",
        "Yale University",
        "Princeton University",
        "Columbia University"
    ],

    "Allemagne": [
        "Technical University of Munich",
        "Heidelberg University",
        "Humboldt University of Berlin",
        "Free University of Berlin",
        "University of Hamburg"
    ],

    "Suisse": [
        "University of Zurich",
        "University of Geneva",
        "University of Lausanne",
        "ETH Zurich",
        "EPFL"
    ],

    "Royaume-Uni": [
        "University of Oxford",
        "University of Cambridge",
        "Imperial College London",
        "University College London",
        "University of Edinburgh"
    ],

    "Afrique du Sud": [
        "University of Cape Town",
        "University of Johannesburg",
        "University of Pretoria",
        "Stellenbosch University",
        "University of South Africa"
    ]

};


// ==========================================
// RECUPERATION DES ELEMENTS HTML
// ==========================================

const paysSelect = document.getElementById("pays");
const universiteSelect = document.getElementById("universite");
const formulaire = document.getElementById("candidatureForm");
const message = document.getElementById("message");

// ==========================================
// AJOUT AUTOMATIQUE DES PAYS
// ==========================================

for (const pays in universitesParPays) {

    const option = document.createElement("option");

    option.value = pays;
    option.textContent = pays;

    paysSelect.appendChild(option);
}


// ==========================================
// CHANGEMENT DU PAYS
// ==========================================

paysSelect.addEventListener("change", function () {

    const paysSelectionne = this.value;

    // Supprimer les anciennes universités
    universiteSelect.innerHTML = "";

    // Aucun pays sélectionné
    if (paysSelectionne === "") {

        universiteSelect.disabled = true;

        const option = document.createElement("option");

        option.value = "";
        option.textContent = "-- Sélectionnez d'abord un pays --";

        universiteSelect.appendChild(option);

        return;
    }


    // Activer la liste des universités
    universiteSelect.disabled = false;


    // Option par défaut
    const optionDefaut = document.createElement("option");

    optionDefaut.value = "";
    optionDefaut.textContent = "-- Sélectionnez une université --";

    universiteSelect.appendChild(optionDefaut);


    // Récupérer les universités du pays
    const universites = universitesParPays[paysSelectionne];


    // Ajouter chaque université
    universites.forEach(function (universite) {

        const option = document.createElement("option");

        option.value = universite;
        option.textContent = universite;

        universiteSelect.appendChild(option);

    });

});


// ==========================================
// ENVOI DU FORMULAIRE
// ==========================================

formulaire.addEventListener("submit", function (event) {

    // Empêcher le rechargement de la page
    event.preventDefault();


    // Récupérer les valeurs
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const pays = paysSelect.value;
    const universite = universiteSelect.value;


    // Vérification
    if (
        nom === "" ||
        prenom === "" ||
        pays === "" ||
        universite === ""
    ) {

        alert("Veuillez remplir tous les champs.");

        return;
    }


    // Afficher le message
    message.textContent =
        "Candidature envoyée avec succès ! " +
        prenom + " " + nom +
        ", votre candidature pour " +
        universite +
        " (" + pays + ") a été enregistrée.";

    message.classList.add("success");


    // Réinitialiser le formulaire
    formulaire.reset();


    // Désactiver à nouveau université
    universiteSelect.disabled = true;

    universiteSelect.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";
    option.textContent = "-- Sélectionnez d'abord un pays --";

    universiteSelect.appendChild(option);


    // Faire disparaître le message après 5 secondes
    setTimeout(function () {

        message.classList.remove("success");
        message.textContent = "";

    }, 5000);

});
