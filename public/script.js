function showForm(action) {
  const formArea = document.getElementById("formArea");
  if (action === "create") {
    formArea.innerHTML = `
      <h2>Create Account</h2>
      <form onsubmit="createAccount(event)">
        Name: <input id="name"><br>
        Email: <input id="email"><br>
        Address: <input id="address"><br>
        Password: <input type="password" id="password"><br>
        Bank ID: <input id="bankId" type="number"><br>
        <button type="submit">Submit</button>
      </form>
    `;
  }
  // Add other forms similarly...
}

function createAccount(e) {
  e.preventDefault();
  fetch("/api/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      password: document.getElementById("password").value,
      bankId: parseInt(document.getElementById("bankId").value),
    }),
  })
    .then((res) => res.text())
    .then(alert);
}
