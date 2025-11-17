function createAccount(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const password = document.getElementById("password").value;
  const bankId = parseInt(document.getElementById("bankId").value);

  fetch("/api/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, address, password, bankId }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.text();
    })
    .then((msg) => {
      alert(msg);
      document.querySelector("form").reset();
    })
    .catch((err) => {
      console.error("[CREATE] Request failed:", err);
      alert("Failed to create account. Please try again.");
    });
}
