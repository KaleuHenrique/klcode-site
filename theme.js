// Mantém o tema visual sincronizado entre as páginas do site.
(() => {
  const chaveTema = "temaKaleu";
  const temasValidos = new Set(["claro", "escuro"]);
  const consultaTemaSistema = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  // Lê somente preferências válidas e trata armazenamento bloqueado ou corrompido.
  function lerTemaSalvo() {
    try {
      const tema = localStorage.getItem(chaveTema);

      if (temasValidos.has(tema)) return tema;
      if (tema !== null) localStorage.removeItem(chaveTema);
    } catch {
      // O tema ainda funciona nesta visita quando o armazenamento não estiver disponível.
    }

    return null;
  }

  function temaDoSistema() {
    return consultaTemaSistema?.matches ? "escuro" : "claro";
  }

  let temaManual = lerTemaSalvo();

  // Aplica o tema antes da folha de estilos ser carregada, reduzindo o flash inicial.
  function aplicarTema(tema) {
    const temaSeguro = temasValidos.has(tema) ? tema : temaDoSistema();
    const raiz = document.documentElement;

    raiz.dataset.theme = temaSeguro;

    const botao = document.querySelector("#alternar-tema");
    const icone = botao?.querySelector(".icone-tema");

    if (botao && icone) {
      const escuro = temaSeguro === "escuro";
      icone.textContent = escuro ? "☀" : "☾";
      botao.setAttribute("aria-label", escuro ? "Ativar tema claro" : "Ativar tema escuro");
      botao.title = escuro ? "Ativar tema claro" : "Ativar tema escuro";
    }
  }

  function salvarTema(tema) {
    temaManual = tema;

    try {
      localStorage.setItem(chaveTema, tema);
    } catch {
      // Mantém a escolha em memória até o fim desta visita.
    }
  }

  aplicarTema(temaManual || temaDoSistema());

  function configurarBotao() {
    const botao = document.querySelector("#alternar-tema");
    if (!botao) return;

    aplicarTema(document.documentElement.dataset.theme);
    botao.addEventListener("click", () => {
      const temaAtual = document.documentElement.dataset.theme;
      const proximoTema = temaAtual === "escuro" ? "claro" : "escuro";

      salvarTema(proximoTema);
      aplicarTema(proximoTema);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", configurarBotao, { once: true });
  } else {
    configurarBotao();
  }

  // Só acompanha o sistema enquanto o visitante não tiver escolhido um tema.
  function acompanharTemaDoSistema(evento) {
    if (!temaManual) aplicarTema(evento.matches ? "escuro" : "claro");
  }

  if (consultaTemaSistema?.addEventListener) {
    consultaTemaSistema.addEventListener("change", acompanharTemaDoSistema);
  } else if (consultaTemaSistema?.addListener) {
    consultaTemaSistema.addListener(acompanharTemaDoSistema);
  }
})();
