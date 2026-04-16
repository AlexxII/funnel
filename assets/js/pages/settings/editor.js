window.SettingsEditor = function(data) {
  let root = null;

  function mount() {
    root = document.getElementById("tests-editor");
    console.log("tests editor init");
  }

  function unmount() {
  }

  return { mount, unmount }
}
