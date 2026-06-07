document.addEventListener("DOMContentLoaded", async () => {
  await updateRegal();
});

const popupHinzufuegen = document.getElementById("hinzufügen");
const popupLoeschen = document.getElementById("loeschen");

const inputTitel = document.getElementById("buchTitel");
const inputGelesen = document.getElementById("buchGelesen");
const inputLoeschTitel = document.getElementById("buchTitelLoeschen");

const regalDiv = document.getElementById("regalBuecher");
const formHinzufuegen = document.getElementById("hinzufuegenForm");
const loeschenForm =document.getElementById("loeschenForm");

const btnStatus = document.querySelector(".status");

btnStatus.addEventListener("click",() =>
  {window.location.href = "status.html";});

document.querySelector(".neuesBuch").onclick = () =>
  popupHinzufuegen.style.display = "block";

document.getElementById("btnSchliessen").addEventListener("click", () => {
  popupHinzufuegen.style.display = "none";
});

document.querySelector(".buchLoeschen").onclick = () =>
  popupLoeschen.style.display = "block";

document.getElementById("btnLoeschenSchliessen").addEventListener("click", () => {
  popupLoeschen.style.display = "none";
});

async function getBuecher() {
  const res = await fetch("/");
  return res.json();
}

async function updateRegal() {
  const buecher = await getBuecher();

  while (regalDiv.firstChild) {
    regalDiv.removeChild(regalDiv.firstChild);
  }

  buecher.forEach(buch => {
    const div = document.createElement("div");
    div.classList.add("buchIcon");

    if (buch.gelesen === "ja") {
      div.classList.add("gelesen");
    } else {
      div.classList.add("ungelesen");
    }

    div.textContent = buch.titel;

    //Mongo-ID speichern
    div.dataset.id = buch._id;

    //Klick = Löschen
    div.addEventListener("click", async () => {
      await fetch("/api/deleteBook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: div.dataset.id })
      });
      updateRegal();
    });

    regalDiv.appendChild(div);
  });

  updateZaehler(buecher);
}


function updateZaehler(buecher) {
  const score = document.querySelector(".scores");
  score.innerHTML = "";

  const gelesen = buecher.filter(b => b.gelesen === "ja").length;

  score.innerHTML = `
    <p>Bücheranzahl: ${buecher.length}</p>
    <p>Gelesene Bücher: ${gelesen}</p>
    <p>Zu lesende Bücher: ${buecher.length - gelesen}</p>
  `;
}

formHinzufuegen.addEventListener("submit", async e => {
  e.preventDefault();

  const titel = inputTitel.value.trim();
  const gelesen = inputGelesen.value;
  if (!titel) return alert("Titel fehlt");

  await fetch("/api/addBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titel, gelesen })
  });

  formHinzufuegen.reset();
  popupHinzufuegen.style.display = "none";
  updateRegal();
});

loeschenForm.addEventListener("submit", async (e) => {
  e.preventDefault(); //verhindert den Seiten-Reload

  const titel = inputLoeschTitel.value.trim();
  if (!titel) {
    alert("Bitte Titel eingeben");
    return;
  }

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

  await updateRegal(); //Regal, Scores neu laden
});

