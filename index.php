<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formulaire de candidature</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

    <div class="container">

        <div class="header">
            <h1>Formulaire de candidature</h1>
            <p>Inscription universitaire en ligne</p>
        </div>

        <form id="candidatureForm">

            <div class="form-group">
                <label for="nom">Nom <span>*</span></label>
                <input
                    type="text"
                    id="nom"
                    name="nom"
                    placeholder="Entrez votre nom"
                    required
                >
            </div>

            <div class="form-group">
                <label for="prenom">Prénom <span>*</span></label>
                <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    placeholder="Entrez votre prénom"
                    required
                >
            </div>

            <div class="form-group">
                <label for="pays">Pays <span>*</span></label>
                <select id="pays" name="pays" required>
                    <option value="">Sélectionnez un pays </option>
                </select>
            </div>

            <div class="form-group">
                <label for="universite">Université <span>*</span></label>
                <select id="universite" name="universite" required disabled>
                    <option value="">Sélectionnez d'abord un pays </option>
                </select>
            </div>

            <button type="submit" class="btn">
                Envoyer la candidature
            </button>

        </form>

        <div id="message" class="message"></div>

        <div class="footer">
            <p>© 2026 - Plateforme de candidature universitaire</p>
        </div>

    </div>

    <script src="script.js"></script>

</body>
</html>