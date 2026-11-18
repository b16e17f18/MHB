document.addEventListener("DOMContentLoaded", () => {
  const battleCard = document.querySelector("#battleView .battle-card");
  const actionArea = document.querySelector("#battleView .battle-action-area");
  const battleConsole = document.querySelector("#battleView .battle-console");
  const battleMessage = document.querySelector("#battleView #battleLog");
  if (!battleCard || !actionArea || !battleConsole || !battleMessage) return;

  const topbar = document.createElement("div");
  topbar.className = "battle-mobile-topbar";
  topbar.innerHTML = '<strong>バトル</strong><span id="battleMobileTurn">1ターン</span>';
  battleCard.prepend(topbar);

  const actionHeading = document.createElement("div");
  actionHeading.className = "battle-mobile-action-heading";
  actionHeading.textContent = "自分の行動を選択";
  actionArea.prepend(actionHeading);

  const history = document.createElement("details");
  history.className = "battle-mobile-history";
  history.innerHTML = `
    <summary>戦闘ログ</summary>
    <ol class="battle-mobile-history-list" aria-live="polite"></ol>
  `;
  battleConsole.append(history);

  const historyList = history.querySelector(".battle-mobile-history-list");
  const turnLabel = topbar.querySelector("#battleMobileTurn");

  const renderHistory = () => {
    try {
      const entries = Array.isArray(state.log) ? state.log : [];
      historyList.replaceChildren(...entries.map((entry) => {
        const item = document.createElement("li");
        item.textContent = entry;
        return item;
      }));
      turnLabel.textContent = `${state.turn ?? 1}ターン`;
    } catch {
      historyList.replaceChildren();
      turnLabel.textContent = "バトル";
    }
  };

  history.addEventListener("toggle", () => {
    if (history.open) renderHistory();
  });

  const observer = new MutationObserver(renderHistory);
  observer.observe(battleMessage, { childList: true, subtree: true, characterData: true });
  renderHistory();
});
