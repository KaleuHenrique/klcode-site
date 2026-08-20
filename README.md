# KL Code | Soluções Digitais

Site institucional da **KL Code**, criado para apresentar serviços de desenvolvimento web e receber solicitações de orçamento.

## Funcionalidades

- Catálogo de serviços renderizado dinamicamente.
- Seleção de serviços em um painel de orçamento.
- Persistência do orçamento no `localStorage` do navegador.
- Formulário de solicitação integrado ao Web3Forms e protegido por hCaptcha.
- Tema claro/escuro, com preferência salva no navegador.
- Layout responsivo, animações de rolagem e links de contato/redes sociais.
- Cabeçalhos e orientações de segurança para publicação.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro (sem dependências ou etapa de build)
- [Web3Forms](https://web3forms.com/) para o envio do formulário
- [hCaptcha](https://www.hcaptcha.com/) para proteção contra spam

## Estrutura do projeto

```text
.
├── assets/
│   ├── icons/                  # Ícones das redes sociais
│   └── logo/                   # Logotipo
├── css/
│   └── style.css               # Estilos e responsividade
├── js/
│   ├── script.js               # Serviços, orçamento e formulário
│   └── theme.js                # Controle do tema claro/escuro
├── pages/
│   ├── pagamento-concluido.html
│   └── pagamento-erro.html
├── _headers                    # Cabeçalhos para Netlify/Cloudflare Pages
├── index.html                  # Página principal
└── SEGURANCA.md                # Recomendações de segurança
```

## Como executar localmente

Como o front-end é estático, basta abrir `index.html` em um navegador. Para uma experiência mais próxima da publicação, sirva a pasta com um servidor HTTP local, por exemplo usando a extensão **Live Server** do VS Code.

## Publicação

Publique o conteúdo desta pasta como diretório raiz do site.

- **Netlify ou Cloudflare Pages:** o arquivo `_headers` é lido automaticamente e aplica os cabeçalhos de segurança definidos no projeto.
- **GitHub Pages:** a política CSP presente no HTML continua ativa, mas o GitHub Pages não aplica o arquivo `_headers`. Consulte [SEGURANCA.md](SEGURANCA.md) para os cuidados necessários.

Antes de publicar, confira no Web3Forms se a chave do formulário está restrita ao domínio de produção e se o hCaptcha está habilitado.

## Segurança

As diretrizes de cabeçalhos HTTP, CSP, formulário e futura integração com banco de dados estão em [SEGURANCA.md](SEGURANCA.md).

> A chave do Web3Forms é pública por natureza e pode estar no front-end; nunca inclua senhas, tokens privados ou credenciais de banco de dados no repositório.

## Autor

Desenvolvido por [Kaléu Henrique](https://github.com/KaleuHenrique) — KL Code | Soluções Digitais.
