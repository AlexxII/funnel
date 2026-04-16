window.SettingsCommon = function(data) {
  let root = null;

  function mount() {
    root = document.getElementById("common");
    console.log("common settings mount ")
  }

  function unmount() {
    root.innerHtml = "";
  }

  return { mount, unmount };
}
