function submitTransfer(e) {
  e.preventDefault();
  fetch("/api/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fromId: parseInt(document.getElementById("fromId").value),
      toId: parseInt(document.getElementById("toId").value),
      bankId: parseInt(document.getElementById("bankId").value),
      amount: parseFloat(document.getElementById("amount").value),
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("transferResult").textContent = data;
    });
}
