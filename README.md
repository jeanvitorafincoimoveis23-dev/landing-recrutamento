# Landing Page de Recrutamento

Landing page responsiva para captar candidatos, com deploy pensado para Vercel e gravação das candidaturas no Supabase.

## Como configurar

1. Crie um projeto no Supabase.
2. Rode o SQL de `supabase/schema.sql` no editor SQL do Supabase.
3. Opcionalmente, na Vercel, cadastre estas variáveis de ambiente para sobrescrever o projeto padrão:
   - `SUPABASE_URL`
   - `SUPABASE_API_KEY`
   - `SUPABASE_CANDIDATES_TABLE` com valor `candidates`
4. Para enviar os cadastros também para uma planilha do Google:
   - Crie uma planilha no Google Sheets.
   - Abra `Extensões > Apps Script`.
   - Cole o conteúdo de `google-sheets/apps-script.js`.
   - Publique em `Implantar > Nova implantação > App da Web`.
   - Em "Quem pode acessar", selecione "Qualquer pessoa".
   - Copie a URL terminada em `/exec`.
   - Cadastre essa URL na Vercel como variável `GOOGLE_SHEETS_WEBHOOK_URL`.
5. Faça o deploy na Vercel apontando para este repositório.

## Scripts

```bash
npm run dev
npm run build
```

O servidor local salva envios de teste em `work/local-submissions.json`. Em produção, a função `api/candidaturas.js` envia para o Supabase usando a chave anon e uma política RLS que permite apenas inserção. Se `GOOGLE_SHEETS_WEBHOOK_URL` estiver configurado, a função também envia uma cópia de cada cadastro para a planilha.

## Trocas rápidas

- Nome da empresa: edite `src/index.html`.
- WhatsApp: edite `WHATSAPP_NUMBER` em `src/app.js`.
- Foto principal: troque a URL da imagem em `src/index.html`.
