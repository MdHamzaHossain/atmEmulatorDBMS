function resetDatabase(e) {
  e.preventDefault();
  fetch("/api/reset", { method: "POST" })
    .then((res) => res.text())
    .then((msg) => {
      document.getElementById("resetResult").textContent = msg;
    });
}
