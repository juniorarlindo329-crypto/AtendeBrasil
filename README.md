# AtendeBrasil — versão 1.3.0

Pacote completo de correção de autenticação.

Principais ajustes:
- login refeito e isolado;
- limpa sessão antiga antes de salvar uma nova;
- mantém access_token e refresh_token;
- recuperação de senha refeita;
- erros reais do Supabase passam a ser mostrados na tela;
- sem redirecionamento automático no index, evitando loop;
- painel e clientes continuam protegidos pela validação de sessão.

Substitua TODOS os arquivos antigos pelos arquivos deste pacote.

IMPORTANTE: a chave presente em config.js é a chave pública/publishable do frontend.
Nunca coloque Secret key/service_role, chave OpenAI ou token permanente da Meta em GitHub Pages.
