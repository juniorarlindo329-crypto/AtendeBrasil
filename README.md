# AtendeBrasil 1.2.0

Pacote completo atualizado.

Correções:
- remove redirecionamento automático do index;
- valida o access token diretamente no Supabase;
- tenta refresh somente quando necessário;
- limpa sessão inválida para impedir loop index/painel;
- mantém Painel e Clientes usando a mesma sessão;
- mantém integração com public.clientes e RLS.

Substitua os arquivos antigos pelos arquivos deste pacote e publique pela branch main /(root).
