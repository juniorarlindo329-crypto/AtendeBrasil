const C=window.ATENDE_CONFIG;
const S=window.AtendeSession;

const loginForm=document.getElementById("loginForm");
const signupForm=document.getElementById("signupForm");
const loginBox=document.getElementById("loginBox");
const signupBox=document.getElementById("signupBox");
const message=document.getElementById("message");

function msg(text,type=""){
  message.textContent=text;
  message.className=`message ${type}`.trim();
}
function clearMsg(){message.className="message hidden"}

document.getElementById("showSignup").onclick=()=>{
  clearMsg();
  loginBox.classList.add("hidden");
  signupBox.classList.remove("hidden");
};

document.getElementById("showLogin").onclick=()=>{
  clearMsg();
  signupBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
};

async function authRequest(path,body){
  const r=await fetch(`${C.SUPABASE_URL}${path}`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "apikey":C.SUPABASE_KEY
    },
    body:JSON.stringify(body)
  });

  let data={};
  try{data=await r.json()}catch{}
  return {r,data};
}

loginForm.onsubmit=async e=>{
  e.preventDefault();
  clearMsg();

  const email=document.getElementById("email").value.trim().toLowerCase();
  const password=document.getElementById("senha").value;

  try{
    const {r,data}=await authRequest("/auth/v1/token?grant_type=password",{email,password});

    if(!r.ok){
      msg(data?.msg||data?.message||data?.error_description||"Não foi possível entrar.","error");
      return;
    }

    S.clearSession();
    S.saveSession(data);
    window.location.replace("painel.html");
  }catch(e){
    console.error(e);
    msg("Falha de conexão com o servidor.","error");
  }
};

signupForm.onsubmit=async e=>{
  e.preventDefault();
  clearMsg();

  const email=document.getElementById("signupEmail").value.trim().toLowerCase();
  const password=document.getElementById("signupSenha").value;

  try{
    const {r,data}=await authRequest("/auth/v1/signup",{email,password});

    if(!r.ok){
      msg(data?.msg||data?.message||"Não foi possível criar a conta.","error");
      return;
    }

    if(data.access_token){
      S.clearSession();
      S.saveSession(data);
      window.location.replace("painel.html");
    }else{
      msg("Conta criada. Confirme seu e-mail e depois faça login.","ok");
    }
  }catch(e){
    console.error(e);
    msg("Falha ao criar a conta.","error");
  }
};

document.getElementById("forgotBtn").onclick=async()=>{
  clearMsg();
  const email=document.getElementById("email").value.trim().toLowerCase();

  if(!email){
    msg("Digite seu e-mail primeiro.","error");
    return;
  }

  try{
    const {r,data}=await authRequest("/auth/v1/recover",{email});

    if(!r.ok){
      msg(data?.msg||data?.message||data?.error_description||"Não foi possível enviar a recuperação.","error");
      return;
    }

    msg("E-mail de recuperação enviado. Confira sua caixa de entrada e spam.","ok");
  }catch(e){
    console.error(e);
    msg("Falha de conexão ao solicitar recuperação.","error");
  }
};