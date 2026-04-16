window.DocsPage = function() {
  let root = null;

  function mount(container) {
    root = container;
    renderLayout();
    bindNavigation();
  }

  function renderLayout() {
    root.innerHTML = `
      <div class="docs-page">

        <div class="header">
          <h1>Документы</h1>
          <a href="#/" class="back-btn">← На главную</a>
        </div>

        <div class="docs-layout">

        </div>
      </div>
    `;
  }

  function bindNavigation() {
    const buttons = root.querySelectorAll(".docs-page button");

    buttons.forEach(btn => {
      btn.onclick = async () => {

      };
    });
  }



  function unmount() {
    root.innerHtml = ""
  }
  return { mount, unmount }
}
