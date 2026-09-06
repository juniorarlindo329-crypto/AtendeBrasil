const C = window.ATENDE_CONFIG;
const S = window.AtendeSession;

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");
const message = document.getElementById("message");

function showMessage(text, type=""){
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function hideMessage(){
  message.className = "message hidden";
}

document.getElementById("showSignup").addEventListener("click", ()=>{
  hideMessage();
  loginBox.classList.add("hidden");
  signupBox.classList.remove("hidden");
});

document.getElementById("showLogin").addEventListener("click", ()=>{
  hideMessage();
  signupBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

loginForm.addEventListener("submit", async (event)=>{
  event.preventDefault();
  hideMessage();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("senha").value;

  try{
    const r = await fetch(`${C.SUPABASE_URL}/auth/v1/token?grant_type=password`,{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":C.SUPABASE_KEY},
      body:JSON.stringify({email,password})
    });

    const data = await r.json();

    if(!r.ok){
      showMessage(data?.msg || data?.error_description || "E-mail ou senha incorretos.","error");
      return;
    }

    S.saveSession(data);
    window.location.href = "painel.html";
  }catch(e){
    console.error(e);
    showMessage("Erro ao conectar. Tente novamente.","error");
  }
});

signupForm.addEventListener("submit", async (event)=>{
  event.preventDefault();
  hideMessage();

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupSenha").value;

  try{
    const r = await fetch(`${C.SUPABASE_URL}/auth/v1/signup`,{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":C.SUPABASE_KEY},
      body:JSON.stringify({email,password})
    });

    const data = await r.json();

    if(!r.ok){
      showMessage(data?.msg || "Não foi possível criar a conta.","error");
      return;
    }

    if(data.access_token){
      S.saveSession(data);
      window.location.href = "painel.html";
    }else{
      showMessage("Conta criada. Confirme seu e-mail e depois faça login.","ok");
    }
  }catch(e){
    console.error(e);
    showMessage("Erro ao criar a conta.","error");
  }
});

document.getElementById("forgotBtn").addEventListener("click", async ()=>{
  const email = document.getElementById("email").value.trim();

  if(!email){
    showMessage("Digite seu e-mail primeiro.","error");
    return;
  }

  try{
    const r = await fetch(`${C.SUPABASE_URL}/auth/v1/recover`,{
      method:"POST",
      headers:{"Content-Type":"application/json","apikey":C.SUPABASE_KEY},
      body:JSON.stringify({email})
    });

    if(!r.ok){
      showMessage("Não foi possível enviar a recuperação.","error");
      return;
    }

    showMessage("Se esse e-mail estiver cadastrado, enviaremos as instruções.","ok");
  }catch(e){
    showMessage("Erro ao solicitar recuperação.","error");
  }
});

// Sem redirecionamento automático no index.
// Isso evita o loop entre index.html e painel.html.
