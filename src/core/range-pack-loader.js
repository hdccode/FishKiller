(function initRangePackLoader(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.FishKillerRangePackLoader = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildRangePackLoaderApi() {
  function loadRangePack({ url, fetchImpl, engine, getTrainableSpots }) {
    if (!fetchImpl || !engine) {
      return Promise.reject(new Error("Preflop range loader requires fetch and FishKillerPreflopEngine."));
    }

    return fetchImpl(url, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((pack) => {
        const normalizedPack = engine.normalizePreflopRangePack(pack);
        const spots = getTrainableSpots(normalizedPack);
        if (!spots.length) {
          throw new Error("Missing complete supported 6-max preflop spots.");
        }
        return { normalizedPack, spots };
      });
  }

  return Object.freeze({ loadRangePack });
});
