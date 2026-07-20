(() => {
  const chaveTema = "temaKaleu";
  const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)");

  function temaSalvo() {
    try { return localStorage.getItem(chaveTema); }
    catch { return null; }
  }

  function aplicarTema(tema) {
    document.documentElement.dataset.theme = tema;
    const botao = document.querySelector("#alternar-tema");

    if (botao) {
      const escuro = tema === "escuro";
      botao.querySelector(".icone-tema").textContent = escuro ? "☀" : "☾";
      botao.setAttribute("aria-label", escuro ? "Ativar tema claro" : "Ativar tema escuro");
      botao.title = escuro ? "Ativar tema claro" : "Ativar tema escuro";
    }
  }

  aplicarTema(temaSalvo() || (prefereEscuro.matches ? "escuro" : "claro"));

  function configurarBotao() {
    const botao = document.querySelector("#alternar-tema");
    if (!botao) return;

    aplicarTema(document.documentElement.dataset.theme);
    botao.addEventListener("click", () => {
      const proximoTema = document.documentElement.dataset.theme === "escuro" ? "claro" : "escuro";
      try { localStorage.setItem(chaveTema, proximoTema); }
      catch { /* A preferência ainda funciona nesta visita. */ }
      aplicarTema(proximoTema);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", configurarBotao);
  else configurarBotao();

  function acompanharTemaDoSistema(evento) {
    if (!temaSalvo()) aplicarTema(evento.matches ? "escuro" : "claro");
  }

  if (prefereEscuro.addEventListener) prefereEscuro.addEventListener("change", acompanharTemaDoSistema);
  else prefereEscuro.addListener(acompanharTemaDoSistema);
})();
