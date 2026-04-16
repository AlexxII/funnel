window.IndexPage = function() {
  let root;
  let hotkeyHandler = null;

  async function mount(container) {
    root = container;
    renderLayout();

    try {
      Clock.start();
      const tests = await Data.getIndex();
      // if (!tests || !tests.length) {
      //   showImportUI();
      //   return;
      // }
      renderGrid(tests);
    } catch (e) {
      console.error(e);
      renderFatal(e);
    }
  }

  function renderLayout() {
    root.innerHTML = `
      <div class="page-index">
        <div class="header">
          <div class="no-gap">
            <img src="assets/icons/duty.png" alt="logo" class="logo"/>
            <h1>Ку</h1>
          </div>
          <div>
            <a class="nav" href="#/settings" data-tooltip="Настройки системы">
              <img src="assets/icons/config.svg" alt="Настройки" class="icon">
            </a>
            <a class="nav" href="#/docs" data-tooltip="Перечень документов">
              <img src="assets/icons/docs.svg" alt="Доки" class="icon">
            </a>
            <p id="clock"></p>
          </div>
        </div>
        <div class="grid" id="grid"></div>

      </div>
    `;
  }

  function showImportUI() {
    const app = document.getElementById("app");
    app.style.display = "none";

    const overlay = document.createElement("div");
    overlay.id = "import-overlay";
    overlay.innerHTML = `
    <div class="import-card">
      <h1>Импорт данных</h1>
      <p class="import-hint">
        Выберите корневую папку носителя.<br>
        Внутри должны быть каталоги <b>data</b> и <b>scenarios</b>.
      </p>

      <label class="button button--primary">
        Выбрать папку
        <input type="file" id="import-input" webkitdirectory>
      </label>

      <div class="import-status" id="import-status"></div>
    </div>
  `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector("#import-input");
    const status = overlay.querySelector("#import-status");

    input.addEventListener("change", async () => {
      if (!input.files.length) return;

      status.textContent = "Чтение данных…";
      status.className = "import-status loading";

      try {
        await Data.importPolls(input.files);

        status.textContent = "Данные успешно импортированы";
        status.className = "import-status success";

        setTimeout(async () => {
          overlay.remove();
          app.style.display = "";

          const scenarios = await Data.getIndex();

          if (scenarios && scenarios.length) {
            renderGrid(scenarios);
          }
        }, 600);

      } catch (e) {
        console.error(e);
        status.textContent = e.message || "Ошибка импорта данных";
        status.className = "import-status error";
      }
    });
  }

  function renderGrid(scenarios) {
    const grid = root.querySelector("#grid");
    grid.innerHTML = "";

    scenarios
      .sort((a, b) => a.order - b.order)
      .forEach(s => {
        const a = document.createElement("a");
        a.className = "tile ";
        a.href = `#/run-test?id=${s.id}`;

        a.innerHTML = `
          <div class="title">${s.title}</div>
        `;
        grid.appendChild(a);
      });
  }

  function renderFatal(error) {
    Clock.stop();

    root.innerHTML = `
      <div class="fatal-error">
        <h2>Ошибка приложения</h2>
        <pre>${escapeHtml(error?.message || error)}</pre>
        <a href="#/" class="back-btn">На главную</a>
      </div>
    `;
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function unmount() {
    Clock.stop();
    if (hotkeyHandler) {
      document.removeEventListener("keyup", hotkeyHandler);
      hotkeyHandler = null;
    }
    root.innerHTML = "";
  }

  return { mount, unmount };
};
