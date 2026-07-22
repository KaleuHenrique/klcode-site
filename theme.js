// Mantém o tema visual sincronizado entre as páginas do site.
(() => {
  // Chave usada para persistir a preferência de tema do visitante.
  const chaveTema = "temaKaleu";
  // Consulta a preferência de cor definida no sistema operacional.
  const prefereEscuro = window.matchMedia("(prefers-color-scheme: dark)");

  // Lê a preferência salva sem interromper o site quando o armazenamento não estiver disponível.
  function temaSalvo() {
    try {
      return localStorage.getItem(chaveTema);
    } catch {
      return null;
    }
  }

  // Aplica o tema ao documento e atualiza o ícone e o texto do botão, quando existir.
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

  // Define o tema antes da página aparecer para evitar mudança visual brusca.
  aplicarTema(temaSalvo() || (prefereEscuro.matches ? "escuro" : "claro"));

  // Configura o botão presente no cabeçalho das páginas.
  function configurarBotao() {
    const botao = document.querySelector("#alternar-tema");
    if (!botao) return;

    aplicarTema(document.documentElement.dataset.theme);
    botao.addEventListener("click", () => {
      // Alterna entre os dois temas disponíveis.
      const proximoTema = document.documentElement.dataset.theme === "escuro" ? "claro" : "escuro";

      try {
        localStorage.setItem(chaveTema, proximoTema);
      } catch {
        // A preferência ainda funciona nesta visita.
      }

      aplicarTema(proximoTema);
    });
  }

  // Aguarda o botão existir caso o script seja carregado no cabeçalho.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", configurarBotao);
  } else {
    configurarBotao();
  }

  // Segue mudanças do sistema apenas quando o visitante não escolheu um tema manualmente.
  function acompanharTemaDoSistema(evento) {
    if (!temaSalvo()) aplicarTema(evento.matches ? "escuro" : "claro");
  }

  // Mantém compatibilidade com versões antigas de navegadores.
  if (prefereEscuro.addEventListener) {
    prefereEscuro.addEventListener("change", acompanharTemaDoSistema);
  } else {
    prefereEscuro.addListener(acompanharTemaDoSistema);
  }
})();
