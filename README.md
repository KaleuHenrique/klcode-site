# KL Code | Soluções Digitais

Site institucional da KL Code para apresentar serviços de desenvolvimento web e receber pedidos de orçamento. O projeto é um front-end estático, responsivo e sem etapa de compilação: basta publicar os arquivos desta pasta.

## O que o site oferece

- Catálogo de serviços criado dinamicamente com JavaScript.
- Seleção de serviços em um painel de orçamento.
- Manutenção da seleção e do tema no navegador, por meio do `localStorage`.
- Formulário de solicitação integrado ao [Web3Forms](https://web3forms.com/) e protegido por hCaptcha.
- Alternância entre tema claro e escuro, respeitando inicialmente a preferência do sistema.
- Layout adaptado para celulares e computadores, animações na rolagem e links de contato/redes sociais.
- Cabeçalhos de segurança prontos para Netlify e Cloudflare Pages.

## Como usar o site

Para o visitante:

1. Acesse a seção **Serviços**.
2. Clique em **Adicionar** nos serviços desejados.
3. Abra **Orçamento** no topo da página para revisar ou remover itens.
4. Clique em **Solicitar orçamento**.
5. Preencha nome, e-mail, mensagem e confirme o hCaptcha antes de enviar.

Os valores exibidos atualmente são **“Sob consulta”**. Por isso, o total é apenas uma referência e a definição do preço final acontece no atendimento.

## Estrutura

```text
.
├── index.html                   # Página principal e formulário
├── assets/                      # Logotipo e ícones das redes sociais
├── css/style.css                # Estilos, responsividade e animações
├── js/script.js                 # Serviços, orçamento e envio do formulário
├── js/theme.js                  # Tema claro/escuro
├── pages/                       # Páginas de retorno de pagamento
├── _headers                     # Cabeçalhos para Netlify/Cloudflare Pages
└── SEGURANCA.md                 # Orientações de segurança
```

## Executar localmente

Não há dependências para instalar. Abra `index.html` no navegador.

Para testar mais próximo da publicação, abra esta pasta no VS Code e use a extensão **Live Server**, ou qualquer servidor HTTP estático.

## Personalizar o conteúdo

| O que alterar | Arquivo ou pasta | Como alterar |
| --- | --- | --- |
| Serviços, descrições, ícones e preços | `js/script.js` | Edite a constante `servicos`. Cada item possui `id`, `icone`, `nome`, `descricao` e `preco`. |
| Textos da página, e-mail e links sociais | `index.html` | Atualize os conteúdos das seções e os atributos `href` dos links. |
| Formulário de orçamento | `index.html` | Altere a chave do Web3Forms, o assunto do e-mail e os campos do formulário. |
| Cores, fontes, layout e responsividade | `css/style.css` | Ajuste as variáveis, seletores e regras de mídia. |
| Logotipo e ícones das redes sociais | `assets/logo/` e `assets/icons/` | Substitua os arquivos mantendo os mesmos nomes ou atualize os caminhos em `index.html`. |
| Tema claro e escuro | `js/theme.js` | Altere a chave de armazenamento ou a lógica de troca de tema. As cores ficam em `css/style.css`. |
| Páginas de retorno de pagamento | `pages/` | Edite `pagamento-concluido.html` e `pagamento-erro.html` conforme a integração de pagamento. |
| Cabeçalhos e política de segurança | `_headers` e `SEGURANCA.md` | Atualize as regras apenas quando adicionar serviços, domínios ou recursos externos. |

Ao definir preços, substitua o campo `preco: 0` pelo valor numérico em reais, por exemplo `preco: 1500`. O site formatará o valor automaticamente como moeda brasileira.

## Configurar o formulário

O formulário usa Web3Forms. Antes de publicar:

1. Crie ou confira a chave no painel do Web3Forms.
2. Atualize o campo oculto `access_key` em `index.html`, caso use outra chave.
3. Restrinja a chave ao domínio de produção no painel do serviço.
4. Mantenha o hCaptcha e as proteções antispam ativados.
5. Faça um envio de teste no endereço público do site.

## Publicar

Publique o conteúdo desta pasta como diretório raiz do site.

- **Netlify / Cloudflare Pages:** reconhecem o arquivo `_headers` e aplicam as proteções configuradas.
- **GitHub Pages:** publica o site normalmente, porém não processa `_headers`; a política CSP definida no HTML continua disponível.

Depois da publicação, confirme o formulário, os links de redes sociais, o e-mail de contato e o layout em celular.

## Segurança

Leia [SEGURANCA.md](SEGURANCA.md) antes de publicar. Em especial, nunca coloque senhas, tokens privados ou credenciais de banco no HTML ou JavaScript. A chave do Web3Forms é pública por natureza e deve ser limitada ao domínio correto no painel do serviço.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- Web3Forms
- hCaptcha

## Autor

Desenvolvido por [Kaléu Henrique](https://github.com/KaleuHenrique) — KL Code | Soluções Digitais.
