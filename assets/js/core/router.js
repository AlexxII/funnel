(function() {
  const routes = {
    "/": window.IndexPage,
    "/settings": window.SettingsPage,
    "/docs": window.DocsPage,
  };

  let currentInstance = null;

  function parseRoute() {
    const hash = location.hash.slice(1) || "/";
    const [path, query] = hash.split("?");
    const params = new URLSearchParams(query || "");
    return { path, params };
  }


  function navigate() {
    const { path, params } = parseRoute();
    if (currentInstance?.unmount) {
      currentInstance.unmount();
    }

    const Page = routes[path];
    if (!Page) {
      document.getElementById("app").innerHTML = "404";
      return;
    }

    currentInstance = Page();
    currentInstance.mount(document.getElementById("app"), params);
  }

  window.addEventListener("hashchange", navigate);
  window.addEventListener("load", navigate);
})();
