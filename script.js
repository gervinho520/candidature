formulaire.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const pays = document.getElementById("pays").value;
    const universite = document.getElementById("universite").value;

    if (!nom || !prenom || !pays || !universite) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const bouton = formulaire.querySelector("button");

    bouton.disabled = true;
    bouton.textContent = "Envoi en cours...";

    const donnees = new URLSearchParams();

    donnees.append("nom", nom);
    donnees.append("prenom", prenom);
    donnees.append("pays", pays);
    donnees.append("universite", universite);

    try {

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            body: donnees
        });

        const resultat = await response.text();

        console.log("Réponse Google :", resultat);

        if (resultat.includes("OK")) {

            message.textContent =
                "✅ Candidature enregistrée avec succès !";

            message.classList.add("success");

            formulaire.reset();

            universiteSelect.disabled = true;

            universiteSelect.innerHTML =
                '<option value="">Sélectionnez d’abord un pays</option>';

        } else {

            alert("Google Sheets a retourné : " + resultat);
        }

    } catch (error) {

        console.error("Erreur :", error);

        alert(
            "Impossible d'envoyer les données à Google Sheets."
        );

    } finally {

        bouton.disabled = false;
        bouton.textContent =
            "Envoyer la candidature";
    }

});
