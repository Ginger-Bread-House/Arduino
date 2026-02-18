document.getElementById("test").addEventListener("click", function() {
  this.style.color = "#87fe2c";
});

document.getElementById("speelKnop").addEventListener("click", function() {

  fetch("http://localhost:3000/
  .catch(error => console.error("Fout:", error));

});start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: "play"
    })
  })
  .then(response => response.text())
  .then(data => console.log("Server zegt:", data))
