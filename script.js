let livres = [];
let utilisateurs = [];
let emprunts = [];
let prochainIdLivre = 1;
let prochainIdUtilisateur = 1;
let prochainIdEmprunt = 1;

// --------- Sauvegarde / Chargement LocalStorage ---------
function sauvegarderDonnees() {
    localStorage.setItem("livres", JSON.stringify(livres));
    localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));
    localStorage.setItem("emprunts", JSON.stringify(emprunts));
    localStorage.setItem("prochainIdLivre", prochainIdLivre);
    localStorage.setItem("prochainIdUtilisateur", prochainIdUtilisateur);
    localStorage.setItem("prochainIdEmprunt", prochainIdEmprunt);
}

function chargerDonnees() {
    const dataLivres = localStorage.getItem("livres");
    const dataUtilisateurs = localStorage.getItem("utilisateurs");
    const dataEmprunts = localStorage.getItem("emprunts");

    if (dataLivres) livres = JSON.parse(dataLivres);
    if (dataUtilisateurs) utilisateurs = JSON.parse(dataUtilisateurs);
    if (dataEmprunts) emprunts = JSON.parse(dataEmprunts);

    prochainIdLivre = parseInt(localStorage.getItem("prochainIdLivre")) || 1;
    prochainIdUtilisateur = parseInt(localStorage.getItem("prochainIdUtilisateur")) || 1;
    prochainIdEmprunt = parseInt(localStorage.getItem("prochainIdEmprunt")) || 1;

    afficherLivres();
    afficherUtilisateurs();
    afficherEmprunts();
    remplirSelects();
}

// --------- Livres ---------
function ajouterLivre(titre, auteur, quantite) {
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
    sauvegarderDonnees();
    afficherLivres();
    remplirSelects();
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
        btnSuppr.onclick = () => { supprimerLivre(livre.id); };

        li.appendChild(btnSuppr);
        ul.appendChild(li);
    });
    cont.appendChild(ul);
}

function supprimerLivre(id) {
    livres = livres.filter(l => l.id !== id);
    sauvegarderDonnees();
    afficherLivres();
    remplirSelects();
}

// --------- Utilisateurs ---------
function ajouterUtilisateur(nom, prenom, email) {
    if (!nom || !prenom || !email) {
        alert("Tous les champs sont obligatoires !");
        return { succes: false, message: "Champs invalides" };
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert("Email invalide !");
        return { succes: false, message: "Email invalide" };
    }

    const nouveauUser = {
        id: prochainIdUtilisateur++,
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
    };

    utilisateurs.push(nouveauUser);
    sauvegarderDonnees();
    afficherUtilisateurs();
    remplirSelects();
    document.getElementById("form-utilisateur").reset();
    return { succes: true, message: "Utilisateur ajouté avec succès", utilisateur: nouveauUser };
}

function afficherUtilisateurs() {
    const cont = document.getElementById("liste-utilisateurs");
    cont.innerHTML = "";

    if (utilisateurs.length === 0) {
        cont.textContent = "Aucun utilisateur disponible.";
        return;
    }

    const ul = document.createElement("ul");
    utilisateurs.forEach(utilisateur => {
        const li = document.createElement("li");
        li.textContent = `${utilisateur.nom} | ${utilisateur.prenom} | ${utilisateur.email}`;

        const btnSuppr = document.createElement("button");
        btnSuppr.textContent = "Supprimer";
        btnSuppr.onclick = () => { supprimerUtilisateur(utilisateur.id); };

        li.appendChild(btnSuppr);
        ul.appendChild(li);
    });
    cont.appendChild(ul);
}

function supprimerUtilisateur(id) {
    utilisateurs = utilisateurs.filter(u => u.id !== id);
    sauvegarderDonnees();
    afficherUtilisateurs();
    remplirSelects();
}

// --------- Emprunts ---------
function emprunterLivre() {
    const utilisateurId = parseInt(document.getElementById("utilisateurId").value);
    const livreId = parseInt(document.getElementById("livreId").value);

    if (!utilisateurId || !livreId) {
        alert("Veuillez sélectionner un utilisateur et un livre.");
        return;
    }

    const utilisateur = utilisateurs.find(u => u.id === utilisateurId);
    const livre = livres.find(l => l.id === livreId);

    if (!livre || livre.quantiteDisponible <= 0) {
        alert("Ce livre n'est pas disponible.");
        return;
    }

    // ✅ Vérifier si l’utilisateur a déjà un emprunt actif
    const empruntExistant = emprunts.find(e => e.utilisateurId === utilisateurId && !e.retourne);
    if (empruntExistant) {
        alert(`${utilisateur.nom} ${utilisateur.prenom} a déjà un emprunt en cours.`);
        return;
    }

    const nouvelEmprunt = {
        id: prochainIdEmprunt++,
        utilisateurId: utilisateur.id,
        livreId: livre.id,
        dateEmprunt: new Date(),
        retourne: false
    };

    emprunts.push(nouvelEmprunt);
    livre.quantiteDisponible--;
    sauvegarderDonnees();
    afficherEmprunts();
    afficherLivres();
    remplirSelects();
}

function retournerLivre(empruntId) {
    const emprunt = emprunts.find(e => e.id === empruntId);
    if (!emprunt || emprunt.retourne) return;

    emprunt.retourne = true;
    const livre = livres.find(l => l.id === emprunt.livreId);
    if (livre) livre.quantiteDisponible++;
    sauvegarderDonnees();
    afficherEmprunts();
    remplirSelects();
}

function afficherEmprunts() {
    const cont = document.getElementById("liste-emprunts");
    cont.innerHTML = "";

    const empruntsActifs = emprunts.filter(e => !e.retourne);

    if (empruntsActifs.length === 0) {
        cont.textContent = "Aucun emprunt actif.";
        return;
    }

    const ul = document.createElement("ul");
    empruntsActifs.forEach(e => {
        const utilisateur = utilisateurs.find(u => u.id === e.utilisateurId);
        const livre = livres.find(l => l.id === e.livreId);

        const li = document.createElement("li");
        li.textContent = `${utilisateur.nom} ${utilisateur.prenom} a emprunté "${livre.titre}" le ${new Date(e.dateEmprunt).toLocaleDateString()}`;

        const btnRetour = document.createElement("button");
        btnRetour.textContent = "Retourner";
        btnRetour.onclick = () => { retournerLivre(e.id); };

        li.appendChild(btnRetour);
        ul.appendChild(li);
    });

    cont.appendChild(ul);
}

function remplirSelects() {
    const selUtilisateur = document.getElementById("utilisateurId");
    const selLivre = document.getElementById("livreId");

    selUtilisateur.innerHTML = `<option value="">Sélectionnez un utilisateur</option>`;
    utilisateurs.forEach(u => {
        selUtilisateur.innerHTML += `<option value="${u.id}">${u.nom} ${u.prenom}</option>`;
    });

    selLivre.innerHTML = `<option value="">Sélectionnez un livre</option>`;
    livres.forEach(l => {
        selLivre.innerHTML += `<option value="${l.id}">${l.titre} (${l.quantiteDisponible} disponibles)</option>`;
    });
}

// --------- Charger les données au démarrage ---------
window.onload = () => {
    chargerDonnees();
};
