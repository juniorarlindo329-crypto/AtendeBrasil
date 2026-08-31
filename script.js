const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha seu e-mail e sua senha.");
    return;
  }

  alert("Login AtendeBrasil pronto para conexão com o banco de dados.");
});
