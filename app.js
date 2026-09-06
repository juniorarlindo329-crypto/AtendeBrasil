(function(){
  function qs(id){return document.getElementById(id)}
  window.AtendeUI = {
    toast(text,type="ok"){
      let el=document.getElementById("toast-global");
      if(!el){
        el=document.createElement("div");
        el.id="toast-global";
        el.className="toast";
        document.body.appendChild(el);
      }
      el.textContent=text;
      el.className=`toast show ${type}`;
      clearTimeout(window.__toastTimer);
      window.__toastTimer=setTimeout(()=>el.className="toast",2600);
    },
    setupLogout(){
      document.querySelectorAll("[data-logout]").forEach(btn=>{
        btn.addEventListener("click",e=>{
          e.preventDefault();
          window.AtendeSession.clearSession();
          window.location.replace("index.html");
        });
      });
    },
    async protect(){
      const ok=await window.AtendeSession.requireAuth();
      if(ok) this.setupLogout();
      return ok;
    },
    userName(){
      const user=window.AtendeSession.getUser();
      const email=user?.email||"";
      return email ? email.split("@")[0] : "empresa";
    }
  };
})();