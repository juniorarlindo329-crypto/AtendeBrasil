const C = window.ATENDE_CONFIG;
const S = window.AtendeSession;

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");
const message = document.getElementById("message");

function showMessage(text,type=""){
  message.textContent=text;
  message.className=`message ${type}`.trim();
}
function hideMessage(){ message.className="message hidden"; }

document.getElementById("showSignup").addEventListener("click",()=>{
  hideMessage();
  loginBox.classList.add("hidden");
  signupBox.classList.remove("hidden");
});
document.getElementById("showLogin").addEventListener("click",()=>{
  hideMessage();
  signupBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

async function authRequest(path, body){
  const r = await fetch(`${C.SUPABASE_URL}${path}`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "apikey":C.SUPABASE_KEY,
      "Authorization":`Bearer ${C.SUPABASE_KEY}`
    },
    body:JSON.stringify(body)
  });
  let data={};
  try{ data=await r.json(); }catch{}
  return {r,data};
}

loginForm.addEventListener("submit",async e=>{
  e.preventDefault(); hideMessage();
  const email=document.getElementById("email").value.trim().toLowerCase();
  const password=document.getElementById("senha").value;
  if(!email||!password){showMessage("Preencha e-mail e senha.","error");return;}

  try{
    const {r,data}=await authRequest("/auth/v1/token?grant_type=password",{email,password});
    if(!r.ok){
      console.error("LOGIN:",data);
      showMessage(data?.msg || data?.message || data?.error_description || "Não foi possível entrar.","error");
      return;
    }
    S.clearSession();
    S.saveSession(data);
    window.location.replace("painel.html");
  }catch(err){
    console.error(err);
    showMessage("Falha de conexão com o servidor.","error");
  }
});

signupForm.addEventListener("submit",async e=>{
  e.preventDefault(); hideMessage();
  const email=document.getElementById("signupEmail").value.trim().toLowerCase();
  const password=document.getElementById("signupSenha").value;

  try{
    const {r,data}=await authRequest("/auth/v1/signup",{email,password});
    if(!r.ok){
      showMessage(data?.msg || data?.message || "Não foi possível criar a conta.","error");
      return;
    }
    if(data.access_token){
      S.clearSession(); S.saveSession(data);
      window.location.replace("painel.html");
    }else{
      showMessage("Conta criada. Confirme seu e-mail e faça login.","ok");
    }
  }catch(err){
    showMessage("Falha de conexão com o servidor.","error");
  }
});

document.getElementById("forgotBtn").addEventListener("click",async()=>{
  hideMessage();
  const email=document.getElementById("email").value.trim().toLowerCase();
  if(!email){showMessage("Digite seu e-mail primeiro.","error");return;}

  try{
    const {r,data}=await authRequest("/auth/v1/recover",{email});
    if(!r.ok){
      console.error("RECOVERY:",data);
      showMessage(data?.msg || data?.message || data?.error_description || "Não foi possível enviar a recuperação.","error");
      return;
    }
    showMessage("E-mail de recuperação enviado. Confira também a caixa de spam.","ok");
  }catch(err){
    showMessage("Falha de conexão ao solicitar recuperação.","error");
  }
});

// Não redirecionar automaticamente a partir do login.
// Painel e Clientes fazem sua própria validação de sessão.
