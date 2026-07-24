# Segurança antes da publicação

## Cabeçalhos HTTP

O arquivo `_headers` deve ser publicado na raiz do site. Netlify e Cloudflare Pages o leem automaticamente. Em outra hospedagem, cadastre exatamente os mesmos cabeçalhos no painel ou no servidor e confirme-os no endereço público com o DevTools, na aba **Network**.

`Strict-Transport-Security` só deve ser enviado pelo domínio final, já atendido exclusivamente por HTTPS. A política CSP foi escrita para os recursos atuais: arquivos locais, Google Fonts e a API do Web3Forms. Ao adicionar um domínio, uma biblioteca ou uma imagem externa, atualize a CSP de modo específico; não use `*`, `unsafe-inline` ou `unsafe-eval`.

As páginas também têm uma CSP em `<meta>` como defesa adicional para hospedagens estáticas que ignoram `_headers`, como o GitHub Pages. Essa alternativa não substitui cabeçalhos HTTP: ela não consegue aplicar `X-Frame-Options`, `Permissions-Policy` ou HSTS. Para obter todas as proteções, publique em Netlify/Cloudflare Pages ou configure esses cabeçalhos em um proxy/CDN.

## Formulário

O `access_key` do Web3Forms é uma chave pública de formulário e fica visível no navegador. No painel do serviço, restrinja-a ao domínio de produção, mantenha o anti-spam/hCaptcha habilitado e acompanhe limites de envio. Nunca coloque senha, token privado, credencial de banco ou chave secreta em HTML ou JavaScript.

## Quando o banco de dados for criado

O navegador não é uma fronteira de segurança. Crie um backend e faça nele, para toda requisição:

1. Autenticação e autorização no servidor; não confie em IDs, preços, cargos ou totais recebidos do cliente.
2. Validação por lista de campos permitidos, tipo, tamanho e formato. Rejeite entradas inesperadas.
3. Consultas parametrizadas/ORM; nunca concatene texto de usuário em SQL.
4. Senhas com Argon2id ou bcrypt, sessões em cookies `HttpOnly`, `Secure` e `SameSite`, e proteção CSRF para ações autenticadas.
5. Segredos em variáveis de ambiente/gerenciador de segredos, rotação de chaves, acesso mínimo ao banco e backup testado.
6. Rate limiting, logs sem dados sensíveis e mensagens de erro genéricas para o usuário.

As validações de interface deste site melhoram a experiência, mas devem ser repetidas e reforçadas no backend.
