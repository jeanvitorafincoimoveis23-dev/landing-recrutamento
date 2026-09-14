# Landing Page de Recrutamento

Landing page responsiva para captar candidatos, com deploy pensado para Vercel e gravação das candidaturas no Supabase.

## Como configurar

1. Crie um projeto no Supabase.
2. Rode o SQL de `supabase/schema.sql` no editor SQL do Supabase.
3. Opcionalmente, na Vercel, cadastre estas variáveis de ambiente para sobrescrever o projeto padrão:
   - `SUPABASE_URL`
   - `SUPABASE_API_KEY`
   - `SUPABASE_CANDIDATES_TABLE` com valor `candidates`
4. Faça o deploy na Vercel apontando para este repositório.

## Scripts

```bash
npm run dev
npm run build
```

O servidor local salva envios de teste em `work/local-submissions.json`. Em produção, a função `api/candidaturas.js` envia para o Supabase usando a chave anon e uma política RLS que permite apenas inserção.

## Trocas rápidas

- Nome da empresa: edite `src/index.html`.
- WhatsApp: edite `WHATSAPP_NUMBER` em `src/app.js`.
- Foto principal: troque a URL da imagem em `src/index.html`.
