(function(){
  const C = window.ATENDE_CONFIG;
  const ACCESS = "atendebrasil_access_token";
  const REFRESH = "atendebrasil_refresh_token";
  const USER = "atendebrasil_user";

  function saveSession(data){
    if(data.access_token) localStorage.setItem(ACCESS, data.access_token);
    if(data.refresh_token) localStorage.setItem(REFRESH, data.refresh_token);
    if(data.user) localStorage.setItem(USER, JSON.stringify(data.user));
  }

  function clearSession(){
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
    localStorage.removeItem(USER);
    sessionStorage.removeItem(ACCESS);
  }

  function getAccessToken(){
    return localStorage.getItem(ACCESS) || sessionStorage.getItem(ACCESS);
  }

  function getUser(){
    try{return JSON.parse(localStorage.getItem(USER)||"null")}catch{return null}
  }

  async function refreshSession(){
    const refresh = localStorage.getItem(REFRESH);
    if(!refresh){ clearSession(); return null; }

    try{
      const r = await fetch(`${C.SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "apikey":C.SUPABASE_KEY
        },
        body:JSON.stringify({refresh_token:refresh})
      });

      if(!r.ok){ clearSession(); return null; }

      const data = await r.json();
      saveSession(data);
      return data.access_token;
    }catch(e){
      console.error(e);
      clearSession();
      return null;
    }
  }

  async function validateAccessToken(token){
    if(!token) return false;
    try{
      const r = await fetch(`${C.SUPABASE_URL}/auth/v1/user`,{
        headers:{
          "apikey":C.SUPABASE_KEY,
          "Authorization":`Bearer ${token}`
        }
      });
      if(!r.ok) return false;
      const user = await r.json();
      if(user?.id) localStorage.setItem(USER, JSON.stringify(user));
      return true;
    }catch(e){
      console.error(e);
      return false;
    }
  }

  async function validToken(){
    let token = getAccessToken();
    if(token && await validateAccessToken(token)) return token;

    token = await refreshSession();
    if(token && await validateAccessToken(token)) return token;

    clearSession();
    return null;
  }

  async function authFetch(url, options={}){
    let token = await validToken();
    if(!token) return {authExpired:true};

    const run = jwt => fetch(url,{
      ...options,
      headers:{
        "apikey":C.SUPABASE_KEY,
        "Authorization":`Bearer ${jwt}`,
        ...(options.headers||{})
      }
    });

    let r = await run(token);

    if(r.status===401){
      token = await refreshSession();
      if(!token) return {authExpired:true};
      r = await run(token);
    }

    return r;
  }

  async function requireAuth(){
    const token = await validToken();
    if(!token){
      window.location.replace("index.html");
      return false;
    }
    return true;
  }

  window.AtendeSession={
    saveSession,clearSession,getAccessToken,getUser,
    refreshSession,validateAccessToken,validToken,authFetch,requireAuth
  };
})();