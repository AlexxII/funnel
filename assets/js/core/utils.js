window.utils = {
  hotkeyLabel(code) {
    if (!code) return;
    if (code.startsWith("Key")) return code.slice(3);
    if (code.startsWith("Digit")) return code.slice(5);
    const map = {
      Escape: "Esc",
      Enter: "Enter",
      Space: "Space"
    };
    return map[code] || code;
  },

  showFatalError(text) {
    const app = document.getElementById("duty-app");
    app.innerHTML = `
      <div class="fatal-error">
        ${text}
      </div>
    `
  },

  formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('ru-RU');
  },

  getTime(date) {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }
};
