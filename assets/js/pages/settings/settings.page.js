window.SettingsPage = function() {

  let root = null;
  let activeModule = null;

  async function mount(container) {
    root = container;
    renderLayout();
    bindNavigation();

    try {
      await initDataAndMount("common");
    } catch (e) {
      console.log(e)
    }
  }

  function renderLayout() {
    root.innerHTML = `
      <div class="page-settings">

        <div class="header">
          <h1>Настройки</h1>
          <a href="#/" class="back-btn">← На главную</a>
        </div>

        <div class="settings-layout">

          <nav class="settings-nav">
            <button data-section="common" class="active">Общие</button>
            <button data-section="tests-editor">Редактор</button>
          </nav>

          <main class="settings-content">
            <section id="common" class="common-section active"></section>
            <section id="tests-editor" class="tests-editor-section"></section>
          </main>

        </div>
      </div>
    `;
  }

  async function initDataAndMount(section) {
    await Data.init();

    const testData = await Data.getTestData();

    switchModule(section, { testData });
  }

  function switchModule(section, data) {

    if (activeModule?.unmount) {
      activeModule.unmount();
    }

    if (section === "common") {
      activeModule = window.SettingsCommon(data.testData);
    }

    if (section === "tests-editor") {
      activeModule = window.SettingsEditor(data.testData);
    }

    activeModule.mount();
  }

  function bindNavigation() {
    const buttons = root.querySelectorAll(".settings-nav button");

    buttons.forEach(btn => {
      btn.onclick = async () => {

        const section = btn.dataset.section;

        root.querySelectorAll(".settings-nav button")
          .forEach(b => b.classList.remove("active"));

        root.querySelectorAll(".settings-section")
          .forEach(s => s.classList.remove("active"));

        btn.classList.add("active");
        root.querySelector("#" + section).classList.add("active");

        await initDataAndMount(section);
      };
    });
  }

  function unmount() {
    activeModule?.unmount?.();
    root.innerHTML = "";
  }

  return { mount, unmount };
};
