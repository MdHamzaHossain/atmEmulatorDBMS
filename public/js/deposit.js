function depositFunds(e) {
  e.preventDefault();

  const accountId = parseInt(document.getElementById("accountId").value);
  const amount = parseInt(document.getElementById("amount").value);

  fetch("/api/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId, amount }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return res.text();
    })
    .then((msg) => {
      alert(msg); // Shows "Deposited $X. New balance: $Y"
      document.querySelector("form").reset();
    })
    .catch((err) => {
      console.error("[DEPOSIT] Request failed:", err);
      alert("Deposit failed. Please try again.");
    });
}
