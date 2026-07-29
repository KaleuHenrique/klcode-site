// Catálogo exibido na seção de serviços.
const banco = window.supabase.createClient(
  "https://imbjoxybquirigtqgwju.supabase.co",
  "sb_publishable_wj9eAwcOFwwA1EX7mdITdQ_2sVUWI6h"
);

let usuarioAtual = null;
let modoConta = "cadastro";

const servicos = [
  { id: 1, icone: "◈", nome: "Site institucional", descricao: "Um site profissional para apresentar sua empresa, serviços e contatos.", preco: 0 },
  { id: 2, icone: "▣", nome: "Landing page", descricao: "Página objetiva para campanhas, divulgação de produtos ou captação de clientes.", preco: 0 },
  { id: 3, icone: "⌘", nome: "Loja virtual", descricao: "Catálogo de produtos, carrinho e estrutura pronta para começar a vender online.", preco: 0 },
  { id: 4, icone: "↻", nome: "Manutenção", descricao: "Ajustes, melhorias e correções para manter seu site funcionando bem.", preco: 0 },
  { id: 5, icone: "✦", nome: "Identidade digital", descricao: "Estrutura visual e páginas consistentes para fortalecer sua presença online.", preco: 0 },
  { id: 6, icone: "?", nome: "Projeto personalizado", descricao: "Tem uma ideia diferente? Vamos desenhar a solução ideal para ela.", preco: 0 }
];

// Recupera somente IDs conhecidos. Dados do localStorage podem ser alterados pelo visitante.
function lerCarrinho() {
  try {
    const salvo = JSON.parse(localStorage.getItem("orcamentoKaleu"));

    if (!Array.isArray(salvo)) return [];

    return salvo
      .map(item => servicos.find(servico => servico.id === Number(item?.id)))
      .filter(Boolean);
  } catch {
    return [];
  }
}

let carrinho = lerCarrinho();

// Converte valores numéricos para moeda brasileira; preço zero é sob consulta.
const dinheiro = valor => valor
  ? valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  : "Sob consulta";

// Referências aos elementos usados em mais de uma interação.
const listaServicos = document.querySelector("#lista-servicos");
const painel = document.querySelector("#painel-carrinho");
const fundo = document.querySelector("#fundo-painel");
const modal = document.querySelector("#modal-contato");
const modalConta = document.querySelector("#modal-conta");
const fundoModal = document.querySelector("#fundo-modal");
const botaoFecharModal = document.querySelector(".fechar-modal");
const botaoFecharConta = document.querySelector(".fechar-conta");
const botaoFinalizarOrcamento = document.querySelector("#finalizar-orcamento");
const botaoAbrirConta = document.querySelector("#abrir-conta");
const formularioConta = document.querySelector("#formulario-conta");

// Cria os cartões de serviço a partir da lista acima.
function mostrarServicos() {
  const fragmento = document.createDocumentFragment();

  servicos.forEach(servico => {
    const cartao = document.createElement("article");
    cartao.className = "servico";
    const icone = document.createElement("span");
    icone.className = "icone";
    icone.textContent = servico.icone;
    const titulo = document.createElement("h3");
    titulo.textContent = servico.nome;
    const descricao = document.createElement("p");
    descricao.textContent = servico.descricao;
    const preco = document.createElement("div");
    preco.className = "preco";
    const valor = document.createElement("span");
    valor.textContent = servico.preco ? `A partir de ${dinheiro(servico.preco)}` : dinheiro(0);
    const botao = document.createElement("button");
    botao.className = "adicionar";
    botao.type = "button";
    botao.dataset.id = String(servico.id);
    botao.textContent = "Adicionar";

    preco.append(valor, botao);
    cartao.append(icone, titulo, descricao, preco);
    fragmento.append(cartao);
  });

  listaServicos.replaceChildren(fragmento);
}

// Salva o orçamento e atualiza o painel, contador e total exibidos.
function atualizarCarrinho() {
  try {
    localStorage.setItem("orcamentoKaleu", JSON.stringify(carrinho));
  } catch {
    // O orçamento continua disponível nesta visita quando o armazenamento falhar.
  }
  document.querySelector("#contador-carrinho").textContent = carrinho.length;

  const itens = document.querySelector("#itens-carrinho");
  const fragmento = document.createDocumentFragment();

  if (carrinho.length) {
    carrinho.forEach((item, indice) => {
      const linha = document.createElement("div");
      linha.className = "item-carrinho";
      const detalhes = document.createElement("div");
      const nome = document.createElement("strong");
      nome.textContent = item.nome;
      const quebra = document.createElement("br");
      const valor = document.createElement("small");
      valor.textContent = dinheiro(item.preco);
      const remover = document.createElement("button");
      remover.type = "button";
      remover.dataset.remover = String(indice);
      remover.textContent = "Remover";

      detalhes.append(nome, quebra, valor);
      linha.append(detalhes, remover);
      fragmento.append(linha);
    });
  } else {
    const vazio = document.createElement("p");
    vazio.className = "vazio";
    vazio.textContent = "Nenhum serviço adicionado ainda.";
    fragmento.append(vazio);
  }

  itens.replaceChildren(fragmento);

  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
  document.querySelector("#total-carrinho").textContent = dinheiro(total);
  document.querySelector("#finalizar-orcamento").disabled = !carrinho.length;
}

// Abre e fecha o painel lateral de orçamento, atualizando sua acessibilidade.
function abrirCarrinho() {
  painel.classList.add("aberto");
  fundo.classList.add("visivel");
  painel.setAttribute("aria-hidden", "false");
}

function fecharCarrinho() {
  painel.classList.remove("aberto");
  fundo.classList.remove("visivel");
  painel.setAttribute("aria-hidden", "true");
}

// Usa um diálogo não modal para que o desafio do hCaptcha possa ficar acima do formulário.
function abrirModal() {
  modal.show();
  fundoModal.classList.add("visivel");
  modal.setAttribute("aria-hidden", "false");
  botaoFecharModal.focus();
}

function fecharModal() {
  modal.close();
  fundoModal.classList.remove("visivel");
  modal.setAttribute("aria-hidden", "true");
  botaoFinalizarOrcamento.focus();
}

function atualizarInterfaceConta() {
  botaoAbrirConta.textContent = usuarioAtual ? "Conta ativa" : "Entrar";
}

function definirModoConta(modo) {
  modoConta = modo;
  const entrar = modo === "entrar";
  document.querySelector("#titulo-conta").textContent = entrar ? "Entre na sua conta" : "Crie sua conta";
  document.querySelector("#texto-conta").textContent = entrar
    ? "Entre para continuar e enviar seu pedido de orçamento."
    : "Para enviar um pedido de orçamento, faça um cadastro rápido. Assim consigo acompanhar seu pedido com mais segurança.";
  document.querySelector("#enviar-conta").replaceChildren(entrar ? "Entrar" : "Criar conta", document.createTextNode(" →"));
  document.querySelector("#alternar-conta").textContent = entrar ? "Ainda não tenho uma conta" : "Já tenho uma conta";
  document.querySelector("#senha-conta").autocomplete = entrar ? "current-password" : "new-password";
  document.querySelector("#mensagem-conta").textContent = "";
}

function abrirModalConta() {
  definirModoConta(modoConta);
  modalConta.show();
  fundoModal.classList.add("visivel");
  modalConta.setAttribute("aria-hidden", "false");
  document.querySelector("#email-conta").focus();
}

function fecharModalConta() {
  modalConta.close();
  fundoModal.classList.remove("visivel");
  modalConta.setAttribute("aria-hidden", "true");
}

function abrirFormularioOrcamento() {
  prepararFormularioOrcamento();
  const campoEmail = document.querySelector('#formulario-orcamento input[name="email"]');
  campoEmail.value = usuarioAtual?.email || "";
  campoEmail.readOnly = true;
  fecharCarrinho();
  abrirModal();
}

async function obterUsuarioAtual() {
  const { data, error } = await banco.auth.getUser();
  usuarioAtual = error ? null : data.user;
  atualizarInterfaceConta();
  return usuarioAtual;
}

// Preenche os campos enviados pelo formulário com o resumo do orçamento.
function prepararFormularioOrcamento() {
  const listaDeServicos = carrinho
    .map(item => `${item.nome} (${dinheiro(item.preco)})`)
    .join(" | ");
  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);

  document.querySelector("#servicos-escolhidos").value = listaDeServicos || "Não informado";
  document.querySelector("#resumo-servicos").textContent = listaDeServicos || "Não informado";
  document.querySelector("#valor-estimado").value = dinheiro(total);
}

// Adiciona um serviço quando o botão de seu cartão é clicado.
listaServicos.addEventListener("click", evento => {
  const id = Number(evento.target.dataset.id);
  if (!id) return;

  const servico = servicos.find(item => item.id === id);
  carrinho.push(servico);
  atualizarCarrinho();
  abrirCarrinho();
});

// Remove o item correspondente ao botão acionado no painel.
document.querySelector("#itens-carrinho").addEventListener("click", evento => {
  const indice = evento.target.dataset.remover;
  if (indice === undefined) return;

  carrinho.splice(Number(indice), 1);
  atualizarCarrinho();
});

// Controles de abertura e fechamento do orçamento.
document.querySelector("#abrir-carrinho").addEventListener("click", abrirCarrinho);
document.querySelector("#fechar-carrinho").addEventListener("click", fecharCarrinho);
fundo.addEventListener("click", fecharCarrinho);

// Exibe o formulário somente com ao menos um serviço selecionado.
botaoFinalizarOrcamento.addEventListener("click", async () => {
  const usuario = await obterUsuarioAtual();

  if (!usuario) {
    fecharCarrinho();
    abrirModalConta();
    return;
  }

  abrirFormularioOrcamento();
});

// Fecha o formulário quando o botão de fechar é acionado.
botaoFecharModal.addEventListener("click", fecharModal);
botaoFecharConta.addEventListener("click", fecharModalConta);
fundoModal.addEventListener("click", () => {
  if (modal.open) fecharModal();
  if (modalConta.open) fecharModalConta();
});
modal.addEventListener("keydown", evento => {
  if (evento.key !== "Escape") return;

  evento.preventDefault();
  fecharModal();
});

modalConta.addEventListener("keydown", evento => {
  if (evento.key !== "Escape") return;

  evento.preventDefault();
  fecharModalConta();
});

botaoAbrirConta.addEventListener("click", async () => {
  if (await obterUsuarioAtual()) return;

  abrirModalConta();
});

document.querySelector("#alternar-conta").addEventListener("click", () => {
  definirModoConta(modoConta === "cadastro" ? "entrar" : "cadastro");
});

formularioConta.addEventListener("submit", async evento => {
  evento.preventDefault();

  const email = document.querySelector("#email-conta").value.trim();
  const senha = document.querySelector("#senha-conta").value;
  const mensagemConta = document.querySelector("#mensagem-conta");
  const botao = document.querySelector("#enviar-conta");

  botao.disabled = true;
  botao.textContent = modoConta === "entrar" ? "Entrando..." : "Criando conta...";

  try {
    const resultado = modoConta === "entrar"
      ? await banco.auth.signInWithPassword({ email, password: senha })
      : await banco.auth.signUp({
        email,
        password: senha,
        options: { emailRedirectTo: `${window.location.origin}${window.location.pathname}` }
      });

    if (resultado.error) throw resultado.error;

    usuarioAtual = resultado.data.session ? resultado.data.user : null;
    atualizarInterfaceConta();

    if (!resultado.data.session) {
      definirModoConta("entrar");
      mensagemConta.textContent = "Conta criada. Confirme o e-mail enviado para entrar e concluir seu orçamento.";
      return;
    }

    formularioConta.reset();
    fecharModalConta();
    abrirFormularioOrcamento();
  } catch {
    mensagemConta.textContent = "Não foi possível concluir agora. Confira seu e-mail e senha e tente novamente.";
  } finally {
    botao.disabled = false;
    botao.replaceChildren(modoConta === "entrar" ? "Entrar" : "Criar conta", document.createTextNode(" →"));
  }
});

// Envia os dados do formulário ao serviço configurado no atributo action.
document.querySelector("#formulario-orcamento").addEventListener("submit", async evento => {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const dadosFormulario = new FormData(formulario);
  const tokenCaptcha = dadosFormulario.get("h-captcha-response");
  const mensagem = document.querySelector("#mensagem-sucesso");
  const botao = formulario.querySelector('button[type="submit"]');

  if (!await obterUsuarioAtual()) {
    fecharModal();
    abrirModalConta();
    return;
  }

  if (typeof tokenCaptcha !== "string" || !tokenCaptcha) {
    mensagem.textContent = "Confirme o hCaptcha antes de enviar a solicitação.";
    return;
  }

  const nome = dadosFormulario.get("nome");

  botao.disabled = true;
  botao.textContent = "Enviando...";

  try {
    const { error: erroBanco } = await banco
      .from("orcamentos")
      .insert({
        usuario_id: usuarioAtual?.id,
        nome,
        email: dadosFormulario.get("email"),
        mensagem: dadosFormulario.get("mensagem"),
        servicos: dadosFormulario.get("detalhes_do_orcamento"),
        valor_estimado: dadosFormulario.get("valor_estimado")
      });

    if (erroBanco) throw new Error("Falha ao salvar o orcamento");

    const resposta = await fetch(formulario.action, {
      method: "POST",
      // O navegador define o Content-Type correto para FormData e evita redirecionamento/CORS.
      body: dadosFormulario
    });
    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.success) throw new Error("Falha no envio");

    mensagem.textContent = `Obrigado, ${nome}! Recebi sua solicitação e retornarei em breve.`;
    formulario.reset();
    carrinho = [];
    atualizarCarrinho();
  } catch {
    mensagem.textContent = "Não foi possível enviar agora. Tente novamente em alguns instantes.";
  } finally {
    botao.disabled = false;
    const seta = document.createElement("span");
    seta.textContent = "→";
    botao.replaceChildren("Enviar solicitação ", seta);
  }
});

banco.auth.onAuthStateChange((_evento, sessao) => {
  usuarioAtual = sessao?.user || null;
  atualizarInterfaceConta();
});

obterUsuarioAtual();

// Atualiza o ano mostrado no rodapé.
document.querySelector("#ano").textContent = new Date().getFullYear();

// Renderiza os dados iniciais do site.
mostrarServicos();
atualizarCarrinho();

// Seleciona os elementos que devem aparecer gradualmente durante a rolagem.
const candidatosParaAnimacao = document.querySelectorAll(`
  .hero .sobretitulo, .hero h1, .texto-hero, .hero .botao-principal,
  .titulo-secao .sobretitulo, .titulo-secao h2, .titulo-secao > p,
  .sobre .sobretitulo, .sobre h2, .sobre p:last-child,
  .contato .sobretitulo, .contato h2, .contato .botao-principal,
  .servico
`);

// Apenas elementos inicialmente abaixo da tela precisam começar ocultos.
const textosAnimados = [...candidatosParaAnimacao].filter(texto => (
  texto.getBoundingClientRect().top >= window.innerHeight
));

textosAnimados.forEach(texto => texto.classList.add("revelar-scroll"));

// Impede múltiplas atualizações de animação no mesmo quadro de renderização.
let animacaoPendente = false;

// Controla a entrada e saída dos textos conforme a posição deles na janela.
function animarTextosNaRolagem() {
  const limiteDeEntrada = window.innerHeight * 0.84;

  textosAnimados.forEach(texto => {
    const posicao = texto.getBoundingClientRect();
    const estaNaTela = posicao.top < limiteDeEntrada && posicao.bottom > 0;
    const estaForaDaTela = posicao.bottom <= 0 || posicao.top >= window.innerHeight;

    // O elemento fica visível enquanto houver qualquer parte dele na tela.
    if (estaNaTela) texto.classList.add("visivel");
    if (estaForaDaTela) texto.classList.remove("visivel");
  });

  animacaoPendente = false;
}

// Executa a animação com requestAnimationFrame para preservar o desempenho.
window.addEventListener("scroll", () => {
  if (animacaoPendente) return;

  animacaoPendente = true;
  requestAnimationFrame(animarTextosNaRolagem);
}, { passive: true });

// Recalcula a posição dos elementos quando o tamanho da janela mudar.
window.addEventListener("resize", animarTextosNaRolagem);
animarTextosNaRolagem();
