let livres = [];
let utilisateurs = [];
let emprunts = [];
let prochainIdLivre = 1;
let prochainIdUtilisateur = 1;
let prochainIdEmprunt = 1;

// --------- Livres ---------
function ajouterLivre(titre,auteur,quantite) {
    titre = titre;
    auteur = auteur;
    quantite = parseInt(quantite);

    if (!titre || !auteur || !quantite || quantite <= 0) {
        alert("Tous les champs sont obligatoires et la quantité doit être > 0 !");
        return { succes: false, message: "Champs invalides" };
    }

    const nouveauLivre = {
        id: prochainIdLivre++,
        titre: titre,
        auteur: auteur,
        quantite: quantite,
        quantiteDisponible: quantite
    };

    livres.push(nouveauLivre);
    afficherLivres();
    document.getElementById("form-livre").reset();
    return { succes: true, message: "Livre ajouté avec succès", livre: nouveauLivre };
}

function afficherLivres() {
    const cont = document.getElementById("liste-livres");
    cont.innerHTML = "";

    if (livres.length === 0) {
        cont.textContent = "Aucun livre disponible.";
        return;
    }

    const ul = document.createElement("ul");
    livres.forEach(livre => {
        const li = document.createElement("li");
        li.textContent = `${livre.titre} | ${livre.auteur} | ${livre.quantiteDisponible}/${livre.quantite}`;

        const btnSuppr = document.createElement("button");
        btnSuppr.textContent = "Supprimer";
        btnSuppr.onclick = () => supprimerLivre(livre.id);

        li.appendChild(btnSuppr);
        ul.appendChild(li);
    });
    cont.appendChild(ul);
}

function supprimerLivre(id) {
    const ind = livres.findIndex(livre => livre.id === id);
    if (ind === -1) {
        return { succes: false, message: "Le livre n'existe pas" };
    }
    livres.splice(ind, 1);
    afficherLivres();
    return { succes: true, message: "Livre supprimé avec succès" };
}

// --------- Utilisateurs ---------
function ajouterUtilisateur(nom, prenom, email) {
    // Créer et ajouter un utilisateur
    nom = nom;
    prenom = prenom;
    email = email;
    if(!nom || !prenom || !email){
        return{ succes : false, message : "tous champs sont obligatoires"}
    }
    if(!email.includes('@') || !email.includes('.'))
    nouveauUser = {
        id : prochainIdUtilisateur,
        nom : nom,
        prenom : prenom,
        email : email,
    }
    utilisateurs.push(nouveauUser);
    afficherUtilisateurs();
    document.getElementById("form-utilisateur").reset();
    return { succes: true, message: "utilisateur est ajouté avec succès", livre: nouveauUser };

}

function afficherUtilisateurs() {
    // Afficher la liste des utilisateurs dans le DOM
}

function supprimerUtilisateur(id) {
    // Supprimer un utilisateur par son ID
}
