const servicos = [
  { id: 1, icone: "◈", nome: "Site institucional", descricao: "Um site profissional para apresentar sua empresa, serviços e contatos.", preco: 0 },
  { id: 2, icone: "▣", nome: "Landing page", descricao: "Página objetiva para campanhas, divulgação de produtos ou captação de clientes.", preco: 0 },
  { id: 3, icone: "⌘", nome: "Loja virtual", descricao: "Catálogo de produtos, carrinho e estrutura pronta para começar a vender online.", preco: 0 },
  { id: 4, icone: "↻", nome: "Manutenção", descricao: "Ajustes, melhorias e correções para manter seu site funcionando bem.", preco: 0 },
  { id: 5, icone: "✦", nome: "Identidade digital", descricao: "Estrutura visual e páginas consistentes para fortalecer sua presença online.", preco: 0 },
  { id: 6, icone: "?", nome: "Projeto personalizado", descricao: "Tem uma ideia diferente? Vamos desenhar a solução ideal para ela.", preco: 0 }
];

let carrinho = JSON.parse(localStorage.getItem("orcamentoKaleu")) || [];
const dinheiro = valor => valor ? valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Sob consulta";
const listaServicos = document.querySelector("#lista-servicos");
const painel = document.querySelector("#painel-carrinho");
const fundo = document.querySelector("#fundo-painel");
const modal = document.querySelector("#modal-contato");

function mostrarServicos() {
  listaServicos.innerHTML = servicos.map(servico => `
    <article class="servico">
      <span class="icone">${servico.icone}</span><h3>${servico.nome}</h3><p>${servico.descricao}</p>
      <div class="preco"><span>${servico.preco ? "A partir de " + dinheiro(servico.preco) : dinheiro(0)}</span><button class="adicionar" data-id="${servico.id}" type="button">Adicionar</button></div>
    </article>`).join("");
}

function atualizarCarrinho() {
  localStorage.setItem("orcamentoKaleu", JSON.stringify(carrinho));
  document.querySelector("#contador-carrinho").textContent = carrinho.length;
  const itens = document.querySelector("#itens-carrinho");
  itens.innerHTML = carrinho.length ? carrinho.map((item, indice) => `<div class="item-carrinho"><div><strong>${item.nome}</strong><br><small>${dinheiro(item.preco)}</small></div><button data-remover="${indice}" type="button">Remover</button></div>`).join("") : '<p class="vazio">Nenhum serviço adicionado ainda.</p>';
  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
  document.querySelector("#total-carrinho").textContent = dinheiro(total);
  document.querySelector("#finalizar-orcamento").disabled = !carrinho.length;
}

function abrirCarrinho() { painel.classList.add("aberto"); fundo.classList.add("visivel"); painel.setAttribute("aria-hidden", "false"); }
function fecharCarrinho() { painel.classList.remove("aberto"); fundo.classList.remove("visivel"); painel.setAttribute("aria-hidden", "true"); }

function prepararFormularioOrcamento() {
  const listaDeServicos = carrinho
    .map(item => `${item.nome} (${dinheiro(item.preco)})`)
    .join(" | ");
  const total = carrinho.reduce((soma, item) => soma + item.preco, 0);

  document.querySelector("#servicos-escolhidos").value = listaDeServicos || "Não informado";
  document.querySelector("#resumo-servicos").textContent = listaDeServicos || "Não informado";
  document.querySelector("#valor-estimado").value = dinheiro(total);
}

listaServicos.addEventListener("click", evento => {
  const id = Number(evento.target.dataset.id);
  if (!id) return;
  const servico = servicos.find(item => item.id === id);
  carrinho.push(servico);
  atualizarCarrinho(); abrirCarrinho();
});
document.querySelector("#itens-carrinho").addEventListener("click", evento => {
  const indice = evento.target.dataset.remover;
  if (indice === undefined) return;
  carrinho.splice(Number(indice), 1); atualizarCarrinho();
});
document.querySelector("#abrir-carrinho").addEventListener("click", abrirCarrinho);
document.querySelector("#fechar-carrinho").addEventListener("click", fecharCarrinho);
fundo.addEventListener("click", fecharCarrinho);
document.querySelector("#finalizar-orcamento").addEventListener("click", () => {
  prepararFormularioOrcamento();
  fecharCarrinho();
  modal.showModal();
});
document.querySelector(".fechar-modal").addEventListener("click", () => modal.close());
document.querySelector("#formulario-orcamento").addEventListener("submit", async evento => {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const nome = new FormData(formulario).get("nome");
  const mensagem = document.querySelector("#mensagem-sucesso");
  const botao = formulario.querySelector('button[type="submit"]');

  botao.disabled = true;
  botao.textContent = "Enviando...";

  try {
    const resposta = await fetch(formulario.action, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(formulario)).toString()
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
    botao.innerHTML = "Enviar solicitação <span>→</span>";
  }
});
document.querySelector("#ano").textContent = new Date().getFullYear();
mostrarServicos(); atualizarCarrinho();

const candidatosParaAnimacao = document.querySelectorAll(`
  .hero .sobretitulo, .hero h1, .texto-hero, .hero .botao-principal,
  .titulo-secao .sobretitulo, .titulo-secao h2, .titulo-secao > p,
  .sobre .sobretitulo, .sobre h2, .sobre p:last-child,
  .contato .sobretitulo, .contato h2, .contato .botao-principal,
  .servico
`);

const textosAnimados = [...candidatosParaAnimacao].filter(texto => {
  return texto.getBoundingClientRect().top >= window.innerHeight;
});

textosAnimados.forEach(texto => texto.classList.add("revelar-scroll"));

let ultimaPosicaoRolagem = window.scrollY;
let direcaoRolagem = "descendo";
let animacaoPendente = false;

function animarTextosNaRolagem(inicial = false) {
  const deslocamento = window.scrollY - ultimaPosicaoRolagem;
  if (!inicial && Math.abs(deslocamento) > 12) {
    direcaoRolagem = deslocamento > 0 ? "descendo" : "subindo";
  }

  const descendo = inicial || direcaoRolagem === "descendo";
  const estaNoFimDaPagina = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
  const limiteDeEntrada = window.innerHeight * 0.84;

  textosAnimados.forEach(texto => {
    const posicao = texto.getBoundingClientRect();
    const estaNaTela = posicao.top < limiteDeEntrada && posicao.bottom > 0;

    if (descendo && estaNaTela) texto.classList.add("visivel");

    if (!descendo && !estaNoFimDaPagina && posicao.top > 0 && posicao.top < window.innerHeight) {
      texto.classList.remove("visivel");
    }
  });

  ultimaPosicaoRolagem = window.scrollY;
  animacaoPendente = false;
}

window.addEventListener("scroll", () => {
  if (animacaoPendente) return;
  animacaoPendente = true;
  requestAnimationFrame(() => animarTextosNaRolagem());
}, { passive: true });

window.addEventListener("resize", () => animarTextosNaRolagem(true));
animarTextosNaRolagem(true);
