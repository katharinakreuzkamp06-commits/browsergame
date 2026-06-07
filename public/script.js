document.addEventListener("DOMContentLoaded", async () => {
  await updateRegal();
});

const popupHinzufuegen = document.getElementById("hinzufügen");
const popupLoeschen = document.getElementById("loeschen");

const inputTitel = document.getElementById("buchTitel");
const inputGelesen = document.getElementById("buchGelesen");
const inputLoeschTitel = document.getElementById("buchTitelLoeschen");

const fach1 = document.getElementById("fach1");
const fach2 = document.getElementById("fach2");
const fach3 = document.getElementById("fach3");
const formHinzufuegen = document.getElementById("hinzufuegenForm");
const loeschenForm = document.getElementById("loeschenForm");

const btnStatus = document.querySelector(".status");

// Status-Button Weiterleitung
if (btnStatus) {
  btnStatus.addEventListener("click", () => {
    window.location.href = "status.html";
  });
}

// Popups öffnen und schließen
document.querySelector(".neuesBuch").onclick = () => {
  popupHinzufuegen.style.display = "block";
};

document.getElementById("btnSchliessen").addEventListener("click", () => {
  popupHinzufuegen.style.display = "none";
});

document.querySelector(".buchLoeschen").onclick = () => {
  popupLoeschen.style.display = "block";
};

document.getElementById("btnLoeschenSchliessen").addEventListener("click", () => {
  popupLoeschen.style.display = "none";
});

// BÜCHER VOM SERVER LADEN (Korrigerte Route)
async function getBuecher() {
  try {
    // WICHTIG: Nicht "/" abfragen, da das HTML liefert. 
    // Hier nutzen wir nun die korrekte API-Route deiner server.js
    const res = await fetch("/api/books");
    
    if (!res.ok) {
      throw new Error("Server-Antwort war nicht ok");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Fehler beim Abrufen der Bücher vom Server:", error);
    return []; // Gibt ein leeres Array zurück, damit das restliche Skript nicht abstürzt
  }
}

// BÜCHERREGAL IM BACKEND UND FRONTEND UPDATEN
async function updateRegal() {
  const buecher = await getBuecher();

  // Altes Regal leeren
  while (regalDiv.firstChild) {
    regalDiv.removeChild(regalDiv.firstChild);
  }

  // Bücher neu zeichnen
  buecher.forEach(buch, index) => {
    const div = document.createElement("div");
    div.classList.add("buchIcon");

    if (buch.gelesen === "ja") {
      div.classList.add("gelesen");
    } else {
      div.classList.add("ungelesen");
    }

    div.textContent = buch.titel;

    // Mongo-ID speichern
    div.dataset.id = buch._id;

    // Klick auf Buch = Direktes Löschen über ID
    div.addEventListener("click", async () => {
      try {
        await fetch("/api/deleteBook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: div.dataset.id })
        });
        await updateRegal();
      } catch (error) {
        console.error("Fehler beim Löschen des Buches via Klick:", error);
      }
    });

    if (index < 20) {
    fach1.appendChild(div);
} else if (index < 40) {
    fach2.appendChild(div);
} else {
    fach3.appendChild(div);
}
  });

  updateZaehler(buecher);
}

// ZÄHLER UPDATEN
function updateZaehler(buecher) {
  const score = document.querySelector(".scores");
  if (!score) return;
  
  score.innerHTML = "";
  const gelesen = buecher.filter(b => b.gelesen === "ja").length;

  score.innerHTML = `
    <p>Bücheranzahl: ${buecher.length}</p>
    <p>Gelesene Bücher: ${gelesen}</p>
    <p>Zu lesende Bücher: ${buecher.length - gelesen}</p>
  `;
}

// FORMULAR: BUCH HINZUFÜGEN
formHinzufuegen.addEventListener("submit", async e => {
  e.preventDefault();

  const titel = inputTitel.value.trim();
  const gelesen = inputGelesen.value;
  if (!titel) return alert("Titel fehlt");

  try {
    await fetch("/api/addBook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titel, gelesen })
    });

    formHinzufuegen.reset();
    popupHinzufuegen.style.display = "none";
    await updateRegal();
  } catch (error) {
    console.error("Fehler beim Hinzufügen des Buches:", error);
  }
});

// FORMULAR: BUCH ÜBER TITEL LÖSCHEN
loeschenForm.addEventListener("submit", async e => {
  e.preventDefault();

  const titel = inputLoeschTitel.value.trim();
  if (!titel) {
    alert("Bitte Titel eingeben");
    return;
  }

  try {
    const res = await fetch("/api/deleteByTitle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titel })
    });

    if (!res.ok) {
      alert("Buch nicht gefunden");
      return;
    }

    loeschenForm.reset();
    popupLoeschen.style.display = "none";
    await updateRegal();
  } catch (error) {
    console.error("Fehler beim Löschen des Buches via Formular:", error);
  }
});

