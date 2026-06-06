async function ladeBuecher() {
  const res = await fetch("/");
  return res.json();
}

async function tabelleAufbauen() {
  const buecher = await ladeBuecher();
  const tbody = document.querySelector("#statusTabelle tbody");
  tbody.innerHTML = "";

  buecher.forEach(buch => {
    const tr = document.createElement("tr");

    const tdTitel = document.createElement("td");
    tdTitel.textContent = buch.titel;

    const tdStatus = document.createElement("td");
    const select = document.createElement("select");

    ["ja", "nein"].forEach(wert => {
      const opt = document.createElement("option");
      opt.value = wert;
      opt.textContent = wert;
      if (buch.gelesen === wert) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener("change", async () => {
      await fetch("/api/updateStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: buch._id,
          gelesen: select.value
        })
      });
    });

    tdStatus.appendChild(select);
    tr.append(tdTitel, tdStatus);
    tbody.append(tdTitel, tdStatus);
    tbody.appendChild(tr);
  });
}

tabelleAufbauen();