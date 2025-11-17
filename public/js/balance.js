function checkBalance(e) {
  e.preventDefault();

  const accountId = parseInt(document.getElementById("accountId").value);
  const password = document.getElementById("password").value;

  fetch("/api/balance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.text();
    })
    .then((msg) => alert(msg))
    .catch((err) => {
      console.error("[BALANCE] Request failed:", err);
      alert("Failed to retrieve balance. Please check your credentials.");
    });
}
