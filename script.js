const plateau = document.getElementById("plateau");
const nombreJoueurs = document.getElementById("nombreJoueurs");
const demarrer = document.getElementById("demarrer");
const joueurs = document.getElementById("joueurs");
const lancerDe = document.getElementById("lancerDe");
const resultatDe = document.getElementById("resultatDe");
const tour = document.getElementById("tour");

const cases = [];

let positions = [];
let joueurActuel = 0;
let nombre = 2;
let nomsEquipes = [];

const couleurs = [
    "🔴", "🔵", "🟢", "🟡", "🟣",
    "🟠", "🩷", "🩵", "🟤", "⚫"
];

// =========================
// CRÉATION DU PLATEAU
// =========================

for (let i = 1; i <= 103; i++) {

    const caseJeu = document.createElement("div");

    caseJeu.classList.add("case");
    caseJeu.textContent = i;

    if (i % 9 === 0) {
        caseJeu.classList.add("oie");
    }

    cases.push(caseJeu);
    plateau.appendChild(caseJeu);
}

// =========================
// CARTES D'ACTION
// =========================

const cartes = [
    {
        nom: "🚀 Super départ !",
        texte: "Avance de 3 cases.",
        action: "avancer",
        valeur: 3
    },
    {
        nom: "🐌 Petit ralentissement",
        texte: "Recule de 2 cases.",
        action: "reculer",
        valeur: 2
    },
    {
        nom: "🎁 Coup de chance !",
        texte: "Avance de 5 cases.",
        action: "avancer",
        valeur: 5
    },
    {
        nom: "💨 Retour en arrière",
        texte: "Recule de 3 cases.",
        action: "reculer",
        valeur: 3
    },
    {
        nom: "⏸️ Pause !",
        texte: "Tu passes ton prochain tour.",
        action: "pause"
    },
    {
        nom: "🍀 Bonne chance !",
        texte: "Avance de 2 cases.",
        action: "avancer",
        valeur: 2
    }
];

let passeTour = [];

// =========================
// ZONE DES CARTES
// =========================

const zoneCartes = document.createElement("div");
zoneCartes.id = "zoneCartes";

const titreCartes = document.createElement("h2");
titreCartes.textContent = "🎴 Carte d'action";

const carteAction = document.createElement("div");
carteAction.id = "carteAction";
carteAction.textContent = "Les cartes apparaîtront ici.";

zoneCartes.appendChild(titreCartes);
zoneCartes.appendChild(carteAction);

document.body.appendChild(zoneCartes);

// =========================
// SONS
// =========================

function jouerSon(note1, note2, duree) {

    const contexte =
        new (window.AudioContext || window.webkitAudioContext)();

    const oscillateur = contexte.createOscillator();
    const gain = contexte.createGain();

    oscillateur.type = "sine";

    oscillateur.frequency.setValueAtTime(
        note1,
        contexte.currentTime
    );

    oscillateur.frequency.linearRampToValueAtTime(
        note2,
        contexte.currentTime + duree
    );

    gain.gain.setValueAtTime(
        0.08,
        contexte.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        contexte.currentTime + duree
    );

    oscillateur.connect(gain);
    gain.connect(contexte.destination);

    oscillateur.start();
    oscillateur.stop(contexte.currentTime + duree);
}

function sonDe() {
    jouerSon(350, 700, 0.25);
}

function sonVictoire() {

    jouerSon(500, 900, 0.5);

    setTimeout(function() {
        jouerSon(700, 1200, 0.5);
    }, 250);
}

// =========================
// DÉMARRER LE JEU
// =========================

demarrer.addEventListener("click", function() {

    nombre = Number(nombreJoueurs.value);

    if (nombre < 2 || nombre > 10) {
        alert("Choisissez entre 2 et 10 équipes.");
        return;
    }

    // Demander le nom de chaque équipe
    nomsEquipes = [];

    for (let i = 0; i < nombre; i++) {

        let nom = prompt(
            "Nom de l'équipe " + (i + 1) + " :"
        );

        if (nom === null || nom.trim() === "") {
            nom = "Équipe " + (i + 1);
        }

        nomsEquipes.push(nom.trim());
    }

    joueurs.innerHTML = "";

    positions = [];
    passeTour = [];

    for (let i = 0; i < nombre; i++) {

        positions.push(1);
        passeTour.push(false);

        const pion = document.createElement("div");

        pion.classList.add("pion");
        pion.id = "pion" + (i + 1);
        pion.textContent = couleurs[i];

        joueurs.appendChild(pion);

        cases[0].appendChild(pion);
    }

    joueurActuel = 0;

    tour.textContent =
        "Tour de " +
        nomsEquipes[joueurActuel] +
        " " +
        couleurs[joueurActuel];

    resultatDe.textContent =
        "🎲 Le jeu commence !";

    carteAction.textContent =
        "Les cartes apparaîtront après les lancers.";

    jouerSon(300, 600, 0.4);
});

// =========================
// TIRER UNE CARTE
// =========================

function tirerCarte() {

    const indice =
        Math.floor(Math.random() * cartes.length);

    const carte = cartes[indice];

    carteAction.innerHTML =
        "<strong>" + carte.nom + "</strong><br>" +
        carte.texte;

    return carte;
}

// =========================
// LANCER LE DÉ
// =========================

lancerDe.addEventListener("click", function() {

    if (positions.length === 0) {
        alert("Commencez d'abord le jeu !");
        return;
    }

    sonDe();

    // Joueur qui passe son tour
    if (passeTour[joueurActuel]) {

        resultatDe.textContent =
            nomsEquipes[joueurActuel] +
            " doit passer son tour ⏸️";

        passeTour[joueurActuel] = false;

        joueurSuivant();
        return;
    }

    const resultat =
        Math.floor(Math.random() * 6) + 1;

    let nouvellePosition =
        positions[joueurActuel] + resultat;

    if (nouvellePosition > 103) {
        nouvellePosition = 103;
    }

    positions[joueurActuel] =
        nouvellePosition;

    const pion =
        document.getElementById(
            "pion" + (joueurActuel + 1)
        );

    cases[nouvellePosition - 1]
        .appendChild(pion);

    resultatDe.textContent =
        nomsEquipes[joueurActuel] +
        " " +
        couleurs[joueurActuel] +
        " a fait " +
        resultat +
        " 🎲 — case " +
        nouvellePosition;

    // =========================
    // CARTE D'ACTION
    // =========================

    const carte = tirerCarte();

    if (carte.action === "avancer") {

        nouvellePosition += carte.valeur;

        if (nouvellePosition > 103) {
            nouvellePosition = 103;
        }

        positions[joueurActuel] =
            nouvellePosition;

        cases[nouvellePosition - 1]
            .appendChild(pion);

        resultatDe.textContent +=
            " → " +
            carte.nom +
            " : case " +
            nouvellePosition;
    }

    else if (carte.action === "reculer") {

        nouvellePosition -= carte.valeur;

        if (nouvellePosition < 1) {
            nouvellePosition = 1;
        }

        positions[joueurActuel] =
            nouvellePosition;

        cases[nouvellePosition - 1]
            .appendChild(pion);

        resultatDe.textContent +=
            " → " +
            carte.nom +
            " : case " +
            nouvellePosition;
    }

    else if (carte.action === "pause") {

        passeTour[joueurActuel] = true;

        resultatDe.textContent +=
            " → " +
            carte.nom;
    }

    // =========================
    // VICTOIRE
    // =========================

    if (positions[joueurActuel] === 103) {

        resultatDe.textContent +=
            " 🏆 " +
            nomsEquipes[joueurActuel] +
            " a gagné !";

        sonVictoire();

        return;
    }

    joueurSuivant();
});

// =========================
// JOUEUR SUIVANT
// =========================

function joueurSuivant() {

    joueurActuel++;

    if (joueurActuel >= nombre) {
        joueurActuel = 0;
    }

    tour.textContent =
        "Tour de " +
        nomsEquipes[joueurActuel] +
        " " +
        couleurs[joueurActuel];
}