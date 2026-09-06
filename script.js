const C=window.ATENDE_CONFIG,S=window.AtendeSession;
const loginForm=document.getElementById("loginForm"),signupForm=document.getElementById("signupForm");
const loginBox=document.getElementById("loginBox"),signupBox=document.getElementById("signupBox"),message=document.getElementById("message");
function showMessage(text,type=""){message.textContent=text;message.className=`message ${type}`.trim()}
function hideMessage(){message.className="message hidden"}
document.getElementById("showSignup").addEventListener("click",()=>{hideMessage();loginBox.classList.add("hidden");signupBox.classList.remove("hidden")});
document.getElementById("showLogin").addEventListener("click",()=>{hideMessage();signupBox.classList.add("hidden");loginBox.classList.remove("hidden")});
loginForm.addEventListener("submit",async e=>{
  e.preventDefault();hideMessage();
  const email=document.getElementById("email").value.trim(),password=document.getElementById("senha").value;
  try{
    const r=await fetch(`${C.SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json","apikey":C.SUPABASE_KEY},body:JSON.stringify({email,password})});
    const data=await r.json();
    if(!r.ok){showMessage(data?.msg||data?.error_description||"E-mail ou senha incorretos.","error");return}
    S.saveSession(data);window.location.replace("painel.html");
  }catch(err){console.error(err);showMessage("Erro ao conectar. Tente novamente.","error")}
});
signupForm.addEventListener("submit",async e=>{
  e.preventDefault();hideMessage();
  const email=document.getElementById("signupEmail").value.trim(),password=document.getElementById("signupSenha").value;
  try{
    const r=await fetch(`${C.SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json","apikey":C.SUPABASE_KEY},body:JSON.stringify({email,password})});
    const data=await r.json();
    if(!r.ok){showMessage(data?.msg||"Não foi possível criar a conta.","error");return}
    if(data.access_token){S.saveSession(data);window.location.replace("painel.html")}
    else showMessage("Conta criada. Confira seu e-mail para confirmar o cadastro e depois faça login.","ok");
  }catch(err){console.error(err);showMessage("Erro ao criar a conta. Tente novamente.","error")}
});
document.getElementById("forgotBtn").addEventListener("click",async()=>{
  const email=document.getElementById("email").value.trim();
  if(!email){showMessage("Digite seu e-mail primeiro.","error");return}
  try{
    const r=await fetch(`${C.SUPABASE_URL}/auth/v1/recover`,{method:"POST",headers:{"Content-Type":"application/json","apikey":C.SUPABASE_KEY},body:JSON.stringify({email})});
    if(!r.ok){showMessage("Não foi possível enviar a recuperação.","error");return}
    showMessage("Se esse e-mail estiver cadastrado, enviaremos as instruções de recuperação.","ok");
  }catch{showMessage("Erro ao solicitar recuperação.","error")}
});
(async()=>{const token=await S.validToken();if(token)window.location.replace("painel.html")})();