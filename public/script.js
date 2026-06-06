async function getBuecher() {
  const res = await fetch("/"); // ❗ wichtig
  return res.json();
}

async function addBook(data) {
  return fetch("/addBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function deleteBook(id) {
  return fetch("/deleteBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
}

async function deleteByTitle(titel) {
  return fetch("/deleteByTitle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titel })
  });
}

async function updateStatus(id, gelesen) {
  return fetch("/updateStatus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, gelesen })
  });
}