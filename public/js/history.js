function getHistory(e) {
  e.preventDefault();

  const accountId = parseInt(document.getElementById("accountId").value);
  const bankId = parseInt(document.getElementById("bankId").value);
  const type = document.getElementById("type").value;

  fetch("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId, bankId, type }),
  })
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("historyResults");
      container.innerHTML = "";

      if (data.length === 0) {
        container.textContent = "No transactions found.";
        return;
      }

      const list = document.createElement("ul");
      data.forEach((tx) => {
        const item = document.createElement("li");
        item.textContent = `${tx.timestamp} — ${tx.type.toUpperCase()} — $${
          tx.amount
        }`;
        list.appendChild(item);
      });
      container.appendChild(list);
    })
    .catch((err) => {
      console.error("[HISTORY] Request failed:", err);
      alert("Failed to retrieve history.");
    });
}
