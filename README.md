# AtendeBrasil — pacote atualizado

Versão 1.1.0 — Desenvolvido por JNR

Este pacote unifica o login, painel e clientes e corrige a sessão do Supabase usando access token + refresh token, com renovação automática antes de redirecionar para o login.

Arquivos:
- index.html
- painel.html
- clientes.html
- style.css
- config.js
- session.js
- script.js

Segurança:
A Publishable Key do Supabase pode ser usada no navegador com RLS corretamente configurado. Nunca coloque Secret key/service_role, chave da OpenAI ou token permanente do WhatsApp/Meta nesses arquivos públicos.
