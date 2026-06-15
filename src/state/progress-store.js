(function initProgressStore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerProgressStore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildProgressStoreApi() {
  function loadJson(storage, keys) {
    for (const key of keys) {
      const raw = storage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
    }
    return null;
  }

  function saveJson(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

  return Object.freeze({ loadJson, saveJson });
});
