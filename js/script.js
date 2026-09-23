// Catálogo exibido na seção de serviços.
const servicos = [
  { id: 1, icone: "◈", nome: "Site institucional", descricao: "Um site profissional para apresentar sua empresa, serviços e contatos.", preco: 0, imagem: { srcUrl: "", alt: "Cartão Coverflow 1" } },
  { id: 2, icone: "▣", nome: "Landing page", descricao: "Página objetiva para campanhas, divulgação de produtos ou captação de clientes.", preco: 0, imagem: { srcUrl: "", alt: "Cartão Coverflow 2" } },
  { id: 3, icone: "⌘", nome: "Loja virtual", descricao: "Catálogo de produtos, carrinho e estrutura pronta para começar a vender online.", preco: 0, imagem: { srcUrl: "", alt: "Cartão Coverflow 3" } },
  { id: 4, icone: "↻", nome: "Manutenção", descricao: "Ajustes, melhorias e correções para manter seu site funcionando bem.", preco: 0, imagem: { srcUrl: "", alt: "Cartão Coverflow 4" } },
  { id: 5, icone: "✦", nome: "Identidade digital", descricao: "Estrutura visual e páginas consistentes para fortalecer sua presença online.", preco: 0, imagem: { srcUrl: "", alt: "Cartão Coverflow 5" } },
  { id: 6, icone: "?", nome: "Projeto personalizado", descricao: "Tem uma ideia diferente? Vamos desenhar a solução ideal para ela.", preco: 0, imagem: { srcUrl: "", alt: "Cartão Coverflow 6" } }
];

// Mantém apenas serviços existentes e evita itens repetidos, inclusive em dados salvos.
function normalizarCarrinho(itens) {
  if (!Array.isArray(itens)) return [];

  const idsAdicionados = new Set();

  return itens.reduce((resultado, item) => {
    const servico = servicos.find(candidato => candidato.id === Number(item?.id));

    if (!servico || idsAdicionados.has(servico.id)) return resultado;

    idsAdicionados.add(servico.id);
    resultado.push(servico);
    return resultado;
  }, []);
}

// Recupera somente IDs conhecidos. Dados do localStorage podem ser alterados pelo visitante.
function lerCarrinho() {
  try {
    const salvo = JSON.parse(localStorage.getItem("orcamentoKaleu"));

    return normalizarCarrinho(salvo);
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
const fundoModal = document.querySelector("#fundo-modal");
const botaoFecharModal = document.querySelector(".fechar-modal");
const botaoFinalizarOrcamento = document.querySelector("#finalizar-orcamento");
const botaoAbrirCarrinho = document.querySelector("#abrir-carrinho");
const mensagemCarrinho = document.querySelector("#mensagem-carrinho");
const mensagemFormulario = document.querySelector("#mensagem-sucesso");

function mostrarMensagem(elemento, texto, tipo = "") {
  elemento.textContent = texto;
  elemento.className = elemento.id === "mensagem-carrinho" ? "mensagem-carrinho" : "mensagem-sucesso";
  if (tipo) elemento.classList.add(`mensagem-${tipo}`);
}

// Cria os cartões de serviço a partir da lista acima.
function mostrarServicos() {
  const fragmento = document.createDocumentFragment();

  servicos.forEach(servico => {
    const cartao = document.createElement("article");
    cartao.className = "servico";
    if (servico.imagem?.srcUrl) {
      cartao.classList.add("com-imagem");
      const imagem = document.createElement("img");
      imagem.className = "imagem-servico";
      imagem.src = servico.imagem.srcUrl;
      imagem.alt = servico.imagem.alt;
      imagem.loading = "lazy";
      cartao.append(imagem);
    }
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

// Organiza os serviços como cartas na mão e permite navegação circular.
function configurarCarrosselServicos() {
  const cartoes = [...listaServicos.querySelectorAll(".servico")];
  if (!cartoes.length) return;

  let indiceAtivo = 0;
  let inicioDoGesto = null;
  let ignorarClique = false;

  function selecionarServico(indice) {
    indiceAtivo = (indice + cartoes.length) % cartoes.length;
    const compacto = window.matchMedia("(max-width: 720px)").matches;
    const distanciaBase = compacto ? 92 : 148;
    const abertura = compacto ? 9 : 16;
    const limiteLateral = listaServicos.clientWidth / 2 - 12;
    const ajusteRotacao = Math.min(1, listaServicos.clientWidth / 720);

    cartoes.forEach((cartao, indiceDoCartao) => {
      cartao.classList.toggle("servico-ativo", indiceDoCartao === indiceAtivo);
    });

    const disposicao = cartoes.map((cartao, indiceDoCartao) => {
      let posicao = indiceDoCartao - indiceAtivo;
      const metade = cartoes.length / 2;

      if (posicao > metade) posicao -= cartoes.length;
      if (posicao < -metade) posicao += cartoes.length;

      const distancia = Math.abs(posicao);
      // Com quantidade par, o card oposto aguarda fora do leque para equilibrar os lados.
      const oculto = cartoes.length > 2 && distancia === metade;
      const deslocamento = posicao * distanciaBase + Math.sign(posicao) * distancia * distancia * abertura;
      const rotacao = posicao * 7 * ajusteRotacao;
      const escala = Math.max(0.66, 1 - distancia * 0.1);
      const angulo = Math.abs(rotacao) * Math.PI / 180;
      // A rotação a partir da base também projeta a altura do card para os lados.
      const extensao = escala * (cartao.offsetWidth / 2 * Math.cos(angulo) + cartao.offsetHeight * Math.sin(angulo));
      return { cartao, distancia, oculto, deslocamento, rotacao, escala, extensao };
    });

    const ajusteAbertura = Math.max(0, Math.min(1, ...disposicao
      .filter(({ distancia, oculto }) => distancia > 0 && !oculto)
      .map(({ deslocamento, extensao }) => (limiteLateral - extensao) / Math.abs(deslocamento))));

    disposicao.forEach(({ cartao, distancia, oculto, deslocamento, rotacao, escala }) => {
      cartao.classList.toggle("servico-oculto", oculto);
      cartao.inert = oculto;
      cartao.style.setProperty("--deslocamento", `${oculto ? 0 : deslocamento * ajusteAbertura}px`);
      cartao.style.setProperty("--rotacao", `${oculto ? 0 : rotacao}deg`);
      cartao.style.setProperty("--escala", String(escala));
      cartao.style.setProperty("--opacidade", String(oculto ? 0 : Math.max(0.24, 1 - distancia * 0.2)));
      cartao.style.setProperty("--camada", String(cartoes.length - distancia));
    });
  }

  cartoes.forEach((cartao, indice) => {
    cartao.addEventListener("click", evento => {
      if (ignorarClique || evento.target.closest(".adicionar")) return;
      selecionarServico(indice);
    });
  });

  listaServicos.addEventListener("keydown", evento => {
    if (evento.target !== listaServicos) return;
    if (evento.key !== "ArrowLeft" && evento.key !== "ArrowRight") return;

    evento.preventDefault();
    selecionarServico(indiceAtivo + (evento.key === "ArrowRight" ? 1 : -1));
  });

  listaServicos.addEventListener("pointerdown", evento => {
    if (evento.pointerType === "mouse") return;
    inicioDoGesto = evento.clientX;
    listaServicos.setPointerCapture?.(evento.pointerId);
  });

  listaServicos.addEventListener("pointerup", evento => {
    if (inicioDoGesto === null) return;
    const deslocamento = evento.clientX - inicioDoGesto;
    inicioDoGesto = null;
    if (listaServicos.hasPointerCapture?.(evento.pointerId)) {
      listaServicos.releasePointerCapture(evento.pointerId);
    }

    if (Math.abs(deslocamento) < 36) return;
    ignorarClique = true;
    selecionarServico(indiceAtivo + (deslocamento < 0 ? 1 : -1));
    window.setTimeout(() => { ignorarClique = false; }, 0);
  });

  listaServicos.addEventListener("pointercancel", evento => {
    inicioDoGesto = null;
    if (listaServicos.hasPointerCapture?.(evento.pointerId)) {
      listaServicos.releasePointerCapture(evento.pointerId);
    }
  });
  window.addEventListener("resize", () => selecionarServico(indiceAtivo));
  document.fonts.ready.then(() => selecionarServico(indiceAtivo));
  selecionarServico(0);
}

// Salva o orçamento e atualiza o painel, contador e total exibidos.
function atualizarCarrinho() {
  carrinho = normalizarCarrinho(carrinho);

  try {
    localStorage.setItem("orcamentoKaleu", JSON.stringify(carrinho));
  } catch {
    // O orçamento continua disponível nesta visita quando o armazenamento falhar.
  }
  document.querySelector("#contador-carrinho").textContent = carrinho.length;

  listaServicos.querySelectorAll(".adicionar").forEach(botao => {
    const adicionado = carrinho.some(item => item.id === Number(botao.dataset.id));
    botao.disabled = adicionado;
    botao.textContent = adicionado ? "Adicionado" : "Adicionar";
  });

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
  painel.removeAttribute("inert");
}

function fecharCarrinho() {
  const focoEstavaNoPainel = painel.contains(document.activeElement);

  painel.classList.remove("aberto");
  fundo.classList.remove("visivel");
  painel.setAttribute("aria-hidden", "true");
  painel.setAttribute("inert", "");

  if (focoEstavaNoPainel) botaoAbrirCarrinho.focus();
}

// Usa um diálogo não modal para que o desafio do hCaptcha possa ficar acima do formulário.
function abrirModal() {
  carrinho = normalizarCarrinho(carrinho);

  if (!carrinho.length) {
    atualizarCarrinho();
    mostrarMensagem(mensagemCarrinho, "Adicione ao menos um serviço antes de solicitar o orçamento.", "erro");
    abrirCarrinho();
    return false;
  }

  if (modal.open) return true;

  prepararFormularioOrcamento();
  modal.show();
  fundoModal.classList.add("visivel");
  modal.setAttribute("aria-hidden", "false");
  mostrarMensagem(mensagemFormulario, "");
  botaoFecharModal.focus();
  return true;
}

function fecharModal() {
  if (!modal.open) return;

  modal.close();
  fundoModal.classList.remove("visivel");
  modal.setAttribute("aria-hidden", "true");
  botaoAbrirCarrinho.focus();
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
  if (!servico) return;

  if (carrinho.some(item => item.id === servico.id)) {
    mostrarMensagem(mensagemCarrinho, `${servico.nome} já está no seu orçamento.`, "aviso");
    abrirCarrinho();
    return;
  }

  carrinho.push(servico);
  atualizarCarrinho();
  mostrarMensagem(mensagemCarrinho, `${servico.nome} foi adicionado ao orçamento.`, "sucesso");
  abrirCarrinho();
});

// Remove o item correspondente ao botão acionado no painel.
document.querySelector("#itens-carrinho").addEventListener("click", evento => {
  const indice = evento.target.dataset.remover;
  if (indice === undefined) return;

  const posicao = Number(indice);
  if (!Number.isInteger(posicao) || posicao < 0 || posicao >= carrinho.length) return;

  const [removido] = carrinho.splice(posicao, 1);
  atualizarCarrinho();
  mostrarMensagem(mensagemCarrinho, `${removido.nome} foi removido do orçamento.`, "aviso");
});

// Controles de abertura e fechamento do orçamento.
botaoAbrirCarrinho.addEventListener("click", abrirCarrinho);
document.querySelector("#fechar-carrinho").addEventListener("click", fecharCarrinho);
fundo.addEventListener("click", fecharCarrinho);

// Exibe o formulário somente com ao menos um serviço selecionado.
botaoFinalizarOrcamento.addEventListener("click", () => {
  if (!abrirModal()) return;

  fecharCarrinho();
});

// Fecha o formulário quando o botão de fechar é acionado.
botaoFecharModal.addEventListener("click", fecharModal);
fundoModal.addEventListener("click", fecharModal);
modal.addEventListener("keydown", evento => {
  if (evento.key !== "Escape") return;

  evento.preventDefault();
  fecharModal();
});

// Envia os dados do formulário ao serviço configurado no atributo action.
document.querySelector("#formulario-orcamento").addEventListener("submit", async evento => {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const dadosFormulario = new FormData(formulario);
  const tokenCaptcha = dadosFormulario.get("h-captcha-response");
  const mensagem = mensagemFormulario;
  const botao = formulario.querySelector('button[type="submit"]');

  if (typeof tokenCaptcha !== "string" || !tokenCaptcha) {
    mostrarMensagem(mensagem, "Confirme o hCaptcha antes de enviar a solicitação.", "erro");
    return;
  }

  const nome = dadosFormulario.get("nome");

  botao.disabled = true;
  mostrarMensagem(mensagem, "Enviando sua solicitação...");
  botao.textContent = "Enviando...";

  try {
    const resposta = await fetch(formulario.action, {
      method: "POST",
      // O navegador define o Content-Type correto para FormData e evita redirecionamento/CORS.
      body: dadosFormulario
    });
    const resultado = await resposta.json();

    if (!resposta.ok || !resultado.success) throw new Error("Falha no envio");
    mostrarMensagem(mensagem, `Obrigado, ${nome}! Recebi sua solicitação e retornarei em breve.`, "sucesso");
    formulario.reset();
    carrinho = [];
    atualizarCarrinho();
  } catch {
    mostrarMensagem(mensagem, "Não foi possível enviar agora. Verifique sua conexão e tente novamente.", "erro");
  } finally {
    botao.disabled = false;
    const seta = document.createElement("span");
    seta.textContent = "→";
    botao.replaceChildren("Enviar solicitação ", seta);
  }
});

// Atualiza o ano mostrado no rodapé.
document.querySelector("#ano").textContent = new Date().getFullYear();

// Renderiza os dados iniciais do site.
mostrarServicos();
configurarCarrosselServicos();
atualizarCarrinho();

// Seleciona os elementos que devem aparecer gradualmente durante a rolagem.
const candidatosParaAnimacao = document.querySelectorAll(`
  .hero .sobretitulo, .hero h1, .texto-hero, .hero .botao-principal,
  .titulo-secao .sobretitulo, .titulo-secao h2, .titulo-secao > p,
  .sobre,
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
    const deslocamento = Math.min(36, Math.max(0, (window.innerHeight - posicao.top) * 0.08));
    texto.style.setProperty("--scroll-shift", `${deslocamento}px`);

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

// Cria um fundo de partículas douradas com movimento leve e baixo custo de renderização.
function iniciarParticulasDeFundo() {
  const tela = document.querySelector("#particulas-fundo");
  if (!tela) return;

  const contexto = tela.getContext("2d");
  const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cor = "247, 199, 101";
  let particulas = [];
  let largura = 0;
  let altura = 0;
  let quadro;

  function criarParticula(entradaAleatoria = true) {
    return {
      x: Math.random() * largura,
      y: entradaAleatoria ? Math.random() * altura : -8,
      raio: 0.6 + Math.random() * 1.7,
      opacidade: 0.2 + Math.random() * 0.58,
      velocidade: 0.8 + Math.random() * 1.9,
      deriva: -0.18 + Math.random() * 0.36
    };
  }

  function redimensionar() {
    const densidade = Math.min(window.devicePixelRatio || 1, 2);
    largura = window.innerWidth;
    altura = window.innerHeight;
    tela.width = Math.floor(largura * densidade);
    tela.height = Math.floor(altura * densidade);
    contexto.setTransform(densidade, 0, 0, densidade, 0, 0);

    const quantidade = largura < 700 ? 70 : 150;
    particulas = Array.from({ length: quantidade }, () => criarParticula());
    desenhar();
  }

  function desenhar() {
    contexto.clearRect(0, 0, largura, altura);

    particulas.forEach(particula => {
      contexto.beginPath();
      contexto.fillStyle = `rgba(${cor}, ${particula.opacidade})`;
      contexto.arc(particula.x, particula.y, particula.raio, 0, Math.PI * 2);
      contexto.fill();
    });
  }

  function animar() {
    particulas.forEach(particula => {
      particula.y += particula.velocidade;
      particula.x += particula.deriva;

      if (particula.y > altura + particula.raio || particula.x < -8 || particula.x > largura + 8) {
        Object.assign(particula, criarParticula(false));
      }
    });

    desenhar();
    quadro = requestAnimationFrame(animar);
  }

  function atualizarMovimento() {
    cancelAnimationFrame(quadro);
    desenhar();
    if (!movimentoReduzido.matches) quadro = requestAnimationFrame(animar);
  }

  window.addEventListener("resize", redimensionar, { passive: true });
  movimentoReduzido.addEventListener?.("change", atualizarMovimento);
  redimensionar();
  atualizarMovimento();
}

iniciarParticulasDeFundo();
