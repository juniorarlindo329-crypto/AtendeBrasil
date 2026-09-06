(function(){
  const C = window.ATENDE_CONFIG;
  const ACCESS = "atendebrasil_access_token";
  const REFRESH = "atendebrasil_refresh_token";
  const USER = "atendebrasil_user";
  const EXPIRES = "atendebrasil_expires_at";

  function saveSession(data){
    if(data.access_token) localStorage.setItem(ACCESS, data.access_token);
    if(data.refresh_token) localStorage.setItem(REFRESH, data.refresh_token);
    if(data.user) localStorage.setItem(USER, JSON.stringify(data.user));
    const seconds = Number(data.expires_in || 3600);
    localStorage.setItem(EXPIRES, String(Date.now() + Math.max(seconds - 60, 60) * 1000));
  }

  function clearSession(){
    [ACCESS, REFRESH, USER, EXPIRES].forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem(ACCESS);
  }

  function getAccessToken(){
    return localStorage.getItem(ACCESS) || sessionStorage.getItem(ACCESS);
  }

  function getUser(){
    try { return JSON.parse(localStorage.getItem(USER) || "null"); }
    catch { return null; }
  }

  async function refreshSession(){
    const refresh = localStorage.getItem(REFRESH);
    if(!refresh){
      clearSession();
      return null;
    }

    try{
      const r = await fetch(`${C.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{
        method:"POST",
        headers:{"Content-Type":"application/json","apikey":C.SUPABASE_KEY},
        body:JSON.stringify({refresh_token:refresh})
      });

      if(!r.ok){
        clearSession();
        return null;
      }

      const data = await r.json();
      saveSession(data);
      return data.access_token;
    }catch(e){
      console.error("Falha ao renovar sessão", e);
      clearSession();
      return null;
    }
  }

  async function validToken(){
    let token = getAccessToken();
    const exp = Number(localStorage.getItem(EXPIRES) || 0);

    if(!token) return await refreshSession();

    if(exp && Date.now() >= exp){
      token = await refreshSession();
    }

    return token;
  }

  async function authFetch(url, options={}){
    let token = await validToken();

    if(!token) return {authExpired:true};

    const headers = {
      "apikey": C.SUPABASE_KEY,
      "Authorization": `Bearer ${token}`,
      ...(options.headers || {})
    };

    let r = await fetch(url,{...options,headers});

    if(r.status === 401){
      token = await refreshSession();

      if(!token){
        clearSession();
        return {authExpired:true};
      }

      r = await fetch(url,{
        ...options,
        headers:{...headers,"Authorization":`Bearer ${token}`}
      });
    }

    return r;
  }

  async function requireAuth(){
    const token = await validToken();

    if(!token){
      clearSession();
      window.location.replace("index.html");
      return false;
    }

    return true;
  }

  window.AtendeSession = {
    saveSession, clearSession, getAccessToken, getUser,
    refreshSession, validToken, authFetch, requireAuth
  };
})();