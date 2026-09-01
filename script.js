const SUPABASE_URL = "https://akpxaidlraaaqnyfpxch.supabase.co";
const SUPABASE_KEY = "sb_publishable_OgG5QKCtNgdK2JPsYbgk8A_korwv297"

const form = document.querySelector("form");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (!email || !senha) {
    alert("Preencha seu e-mail e sua senha.");
    return;
  }

  try {
    const resposta = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY
        },
        body: JSON.stringify({
          email: email,
          password: senha
        })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert("E-mail ou senha incorretos.");
      console.log(dados);
      return;
    }

    localStorage.setItem("atendebrasil_access_token", dados.access_token);
    localStorage.setItem("atendebrasil_user", JSON.stringify(dados.user));

    alert("Login realizado com sucesso!");
  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar. Tente novamente.");
  }
});
