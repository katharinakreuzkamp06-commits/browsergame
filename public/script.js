async function getBuecher() {
  const res = await fetch("/api/books"); // ❗ wichtig
  return res.json();
}

async function addBook(data) {
  return fetch("/api/addBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function deleteBook(id) {
  return fetch("/api/deleteBook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
}

async function deleteByTitle(titel) {
  return fetch("/api/deleteByTitle", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titel })
  });
}

async function updateStatus(id, gelesen) {
  return fetch("/api/updateStatus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, gelesen })
  });
}