function submitWithdraw(e) {
  e.preventDefault();
  fetch("/api/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      accountId: parseInt(document.getElementById("accountId").value),
      bankId: parseInt(document.getElementById("bankId").value),
      amount: parseFloat(document.getElementById("amount").value),
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("withdrawResult").textContent = data;
    });
}
