(function initDrillDefinitions(root, factory) {
  const definitions = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = definitions;
  }
  root.FishKillerDrillDefinitions = definitions;
})(typeof globalThis !== "undefined" ? globalThis : window, function buildDrillDefinitions() {
  const PREFLOP_RANGE_DEFAULT_DRILL_ID = "all-preflop";
  const PREFLOP_RANGE_REVIEW_DRILL_ID = "review-mistakes";
  const PREFLOP_RANGE_DRILL_DEFAULT_VERSION = 2;

  const RFI_SPOT_IDS = [
    "fk_6max_100bb_lj_rfi_unopened_v1",
    "fk_6max_100bb_hj_rfi_unopened_v1",
    "fk_6max_100bb_co_rfi_unopened_v1",
    "fk_6max_100bb_btn_rfi_unopened_v1",
    "fk_6max_100bb_sb_rfi_unopened_v1",
  ];
  const BB_DEFENSE_SPOT_IDS = [
    "fk_6max_100bb_bb_vs_lj_open_v1",
    "fk_6max_100bb_bb_vs_hj_open_v1",
    "fk_6max_100bb_bb_vs_co_open_v1",
    "fk_6max_100bb_bb_vs_btn_open_v1",
    "fk_6max_100bb_bb_vs_sb_open_v1",
  ];
  const FACING_OPEN_RESPONSE_SPOT_IDS = [
    "fk_6max_100bb_hj_vs_lj_open_v1",
    "fk_6max_100bb_co_vs_lj_open_v1",
    "fk_6max_100bb_btn_vs_lj_open_v1",
    "fk_6max_100bb_btn_vs_hj_open_v1",
    "fk_6max_100bb_sb_vs_lj_open_v1",
    "fk_6max_100bb_sb_vs_hj_open_v1",
  ];
  const FACING_OPEN_COVERAGE_SPOT_IDS = [
    "fk_6max_100bb_hj_vs_lj_open_v1",
    "fk_6max_100bb_co_vs_lj_open_v1",
    "fk_6max_100bb_co_vs_hj_open_3bet_v1",
    "fk_6max_100bb_btn_vs_lj_open_v1",
    "fk_6max_100bb_btn_vs_hj_open_v1",
    "fk_6max_100bb_btn_vs_co_open_3bet_v1",
    "fk_6max_100bb_sb_vs_lj_open_v1",
    "fk_6max_100bb_sb_vs_hj_open_v1",
    "fk_6max_100bb_sb_vs_co_open_3bet_v1",
    "fk_6max_100bb_sb_vs_btn_open_3bet_v1",
    ...BB_DEFENSE_SPOT_IDS,
  ];
  const THREE_BET_SPOT_IDS = [
    "fk_6max_100bb_btn_vs_co_open_3bet_v1",
    "fk_6max_100bb_co_vs_hj_open_3bet_v1",
    "fk_6max_100bb_hj_vs_lj_open_3bet_v1",
    "fk_6max_100bb_sb_vs_btn_open_3bet_v1",
    "fk_6max_100bb_sb_vs_co_open_3bet_v1",
  ];
  const FACING_THREE_BET_SPOT_IDS = [
    "fk_6max_100bb_lj_open_vs_hj_3bet_v1",
    "fk_6max_100bb_lj_open_vs_co_3bet_v1",
    "fk_6max_100bb_lj_open_vs_btn_3bet_v1",
    "fk_6max_100bb_lj_open_vs_sb_3bet_v1",
    "fk_6max_100bb_lj_open_vs_bb_3bet_v1",
    "fk_6max_100bb_hj_open_vs_co_3bet_v1",
    "fk_6max_100bb_hj_open_vs_btn_3bet_v1",
    "fk_6max_100bb_hj_open_vs_sb_3bet_v1",
    "fk_6max_100bb_hj_open_vs_bb_3bet_v1",
    "fk_6max_100bb_co_open_vs_btn_3bet_v1",
    "fk_6max_100bb_co_open_vs_sb_3bet_v1",
    "fk_6max_100bb_co_open_vs_bb_3bet_v1",
    "fk_6max_100bb_btn_open_vs_sb_3bet_v1",
    "fk_6max_100bb_btn_open_vs_bb_3bet_v1",
    "fk_6max_100bb_sb_open_vs_bb_3bet_v1",
  ];
  const FACING_FOUR_BET_SPOT_IDS = [
    "fk_6max_100bb_hj_3bet_vs_lj_open_lj_4bet_v1",
    "fk_6max_100bb_co_3bet_vs_hj_open_hj_4bet_v1",
    "fk_6max_100bb_btn_3bet_vs_co_open_co_4bet_v1",
    "fk_6max_100bb_sb_3bet_vs_btn_open_btn_4bet_v1",
    "fk_6max_100bb_bb_3bet_vs_btn_open_btn_4bet_v1",
  ];
  const BVB_LIMP_SPOT_IDS = [
    "fk_6max_100bb_sb_first_in_limp_or_raise_v1",
    "fk_6max_100bb_bb_vs_sb_limp_v1",
    "fk_6max_100bb_sb_limp_vs_bb_raise_v1",
  ];
  const ISO_VS_LIMP_SPOT_IDS = [
    "fk_6max_100bb_hj_vs_lj_limp_v1",
    "fk_6max_100bb_co_vs_lj_limp_v1",
    "fk_6max_100bb_btn_vs_lj_limp_v1",
    "fk_6max_100bb_btn_vs_co_limp_v1",
    "fk_6max_100bb_sb_vs_btn_limp_v1",
    "fk_6max_100bb_bb_vs_btn_limp_v1",
  ];
  const SQUEEZE_SPOT_IDS = [
    "fk_6max_100bb_co_vs_lj_open_hj_call_squeeze_v1",
    "fk_6max_100bb_btn_vs_lj_open_co_call_squeeze_v1",
    "fk_6max_100bb_btn_vs_hj_open_co_call_squeeze_v1",
    "fk_6max_100bb_sb_vs_co_open_btn_call_squeeze_v1",
    "fk_6max_100bb_bb_vs_co_open_btn_call_squeeze_v1",
    "fk_6max_100bb_bb_vs_btn_open_sb_call_squeeze_v1",
  ];
  const TRAINABLE_SPOT_IDS = [
    ...new Set([
      ...RFI_SPOT_IDS,
      ...FACING_OPEN_COVERAGE_SPOT_IDS,
      ...BB_DEFENSE_SPOT_IDS,
      ...THREE_BET_SPOT_IDS,
      ...FACING_THREE_BET_SPOT_IDS,
      ...FACING_FOUR_BET_SPOT_IDS,
      ...BVB_LIMP_SPOT_IDS,
      ...ISO_VS_LIMP_SPOT_IDS,
      ...SQUEEZE_SPOT_IDS,
    ]),
  ];

  const DRILL_OPTIONS = [
    { id: "all-preflop", label: "All Preflop", group: "All", default: true, spotIds: TRAINABLE_SPOT_IDS },
    { id: "all-rfi", label: "All RFI", group: "RFI", spotIds: RFI_SPOT_IDS },
    { id: "lj-rfi", label: "LJ RFI", group: "RFI", spotIds: ["fk_6max_100bb_lj_rfi_unopened_v1"] },
    { id: "hj-rfi", label: "HJ RFI", group: "RFI", spotIds: ["fk_6max_100bb_hj_rfi_unopened_v1"] },
    { id: "co-rfi", label: "CO RFI", group: "RFI", spotIds: ["fk_6max_100bb_co_rfi_unopened_v1"] },
    { id: "btn-rfi", label: "BTN RFI", group: "RFI", spotIds: ["fk_6max_100bb_btn_rfi_unopened_v1"] },
    { id: "sb-rfi", label: "SB RFI", group: "RFI", spotIds: ["fk_6max_100bb_sb_rfi_unopened_v1"] },
    { id: "all-facing-open", label: "All Facing Open", group: "Facing Open", spotIds: FACING_OPEN_COVERAGE_SPOT_IDS },
    { id: "fo-hj-vs-lj", label: "HJ vs LJ", group: "Facing Open", spotIds: ["fk_6max_100bb_hj_vs_lj_open_v1"] },
    { id: "fo-co-vs-lj", label: "CO vs LJ", group: "Facing Open", spotIds: ["fk_6max_100bb_co_vs_lj_open_v1"] },
    { id: "fo-co-vs-hj", label: "CO vs HJ", group: "Facing Open", spotIds: ["fk_6max_100bb_co_vs_hj_open_3bet_v1"] },
    { id: "fo-btn-vs-lj", label: "BTN vs LJ", group: "Facing Open", spotIds: ["fk_6max_100bb_btn_vs_lj_open_v1"] },
    { id: "fo-btn-vs-hj", label: "BTN vs HJ", group: "Facing Open", spotIds: ["fk_6max_100bb_btn_vs_hj_open_v1"] },
    { id: "fo-btn-vs-co", label: "BTN vs CO", group: "Facing Open", spotIds: ["fk_6max_100bb_btn_vs_co_open_3bet_v1"] },
    { id: "fo-sb-vs-lj", label: "SB vs LJ", group: "Facing Open", spotIds: ["fk_6max_100bb_sb_vs_lj_open_v1"] },
    { id: "fo-sb-vs-hj", label: "SB vs HJ", group: "Facing Open", spotIds: ["fk_6max_100bb_sb_vs_hj_open_v1"] },
    { id: "fo-sb-vs-co", label: "SB vs CO", group: "Facing Open", spotIds: ["fk_6max_100bb_sb_vs_co_open_3bet_v1"] },
    { id: "fo-sb-vs-btn", label: "SB vs BTN", group: "Facing Open", spotIds: ["fk_6max_100bb_sb_vs_btn_open_3bet_v1"] },
    { id: "fo-bb-vs-lj", label: "BB vs LJ", group: "Facing Open", spotIds: ["fk_6max_100bb_bb_vs_lj_open_v1"] },
    { id: "fo-bb-vs-hj", label: "BB vs HJ", group: "Facing Open", spotIds: ["fk_6max_100bb_bb_vs_hj_open_v1"] },
    { id: "fo-bb-vs-co", label: "BB vs CO", group: "Facing Open", spotIds: ["fk_6max_100bb_bb_vs_co_open_v1"] },
    { id: "fo-bb-vs-btn", label: "BB vs BTN", group: "Facing Open", spotIds: ["fk_6max_100bb_bb_vs_btn_open_v1"] },
    { id: "fo-bb-vs-sb", label: "BB vs SB", group: "Facing Open", spotIds: ["fk_6max_100bb_bb_vs_sb_open_v1"] },
    { id: "all-bb-defense", label: "All BB Defense", group: "BB Defense", spotIds: BB_DEFENSE_SPOT_IDS },
    { id: "bb-vs-lj", label: "BB vs LJ", group: "BB Defense", spotIds: ["fk_6max_100bb_bb_vs_lj_open_v1"] },
    { id: "bb-vs-hj", label: "BB vs HJ", group: "BB Defense", spotIds: ["fk_6max_100bb_bb_vs_hj_open_v1"] },
    { id: "bb-vs-co", label: "BB vs CO", group: "BB Defense", spotIds: ["fk_6max_100bb_bb_vs_co_open_v1"] },
    { id: "bb-vs-btn", label: "BB vs BTN", group: "BB Defense", spotIds: ["fk_6max_100bb_bb_vs_btn_open_v1"] },
    { id: "bb-vs-sb", label: "BB vs SB", group: "BB Defense", spotIds: ["fk_6max_100bb_bb_vs_sb_open_v1"] },
    { id: "all-three-bet", label: "All 3-bet", group: "3-bet", spotIds: THREE_BET_SPOT_IDS },
    { id: "btn-vs-co-3bet", label: "BTN vs CO", group: "3-bet", spotIds: ["fk_6max_100bb_btn_vs_co_open_3bet_v1"] },
    { id: "co-vs-hj-3bet", label: "CO vs HJ", group: "3-bet", spotIds: ["fk_6max_100bb_co_vs_hj_open_3bet_v1"] },
    { id: "hj-vs-lj-3bet", label: "HJ vs LJ", group: "3-bet", spotIds: ["fk_6max_100bb_hj_vs_lj_open_3bet_v1"] },
    { id: "sb-vs-btn-3bet", label: "SB vs BTN", group: "3-bet", spotIds: ["fk_6max_100bb_sb_vs_btn_open_3bet_v1"] },
    { id: "sb-vs-co-3bet", label: "SB vs CO", group: "3-bet", spotIds: ["fk_6max_100bb_sb_vs_co_open_3bet_v1"] },
    { id: "all-facing-3bet", label: "All Facing 3-bet", group: "Facing 3-bet", spotIds: FACING_THREE_BET_SPOT_IDS },
    { id: "lj-open-vs-hj-3bet", label: "LJ open vs HJ 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_lj_open_vs_hj_3bet_v1"] },
    { id: "lj-open-vs-co-3bet", label: "LJ open vs CO 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_lj_open_vs_co_3bet_v1"] },
    { id: "lj-open-vs-btn-3bet", label: "LJ open vs BTN 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_lj_open_vs_btn_3bet_v1"] },
    { id: "lj-open-vs-sb-3bet", label: "LJ open vs SB 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_lj_open_vs_sb_3bet_v1"] },
    { id: "lj-open-vs-bb-3bet", label: "LJ open vs BB 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_lj_open_vs_bb_3bet_v1"] },
    { id: "hj-open-vs-co-3bet", label: "HJ open vs CO 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_hj_open_vs_co_3bet_v1"] },
    { id: "hj-open-vs-btn-3bet", label: "HJ open vs BTN 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_hj_open_vs_btn_3bet_v1"] },
    { id: "hj-open-vs-sb-3bet", label: "HJ open vs SB 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_hj_open_vs_sb_3bet_v1"] },
    { id: "hj-open-vs-bb-3bet", label: "HJ open vs BB 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_hj_open_vs_bb_3bet_v1"] },
    { id: "co-open-vs-btn-3bet", label: "CO open vs BTN 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_co_open_vs_btn_3bet_v1"] },
    { id: "co-open-vs-sb-3bet", label: "CO open vs SB 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_co_open_vs_sb_3bet_v1"] },
    { id: "co-open-vs-bb-3bet", label: "CO open vs BB 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_co_open_vs_bb_3bet_v1"] },
    { id: "btn-open-vs-sb-3bet", label: "BTN open vs SB 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_btn_open_vs_sb_3bet_v1"] },
    { id: "btn-open-vs-bb-3bet", label: "BTN open vs BB 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_btn_open_vs_bb_3bet_v1"] },
    { id: "sb-open-vs-bb-3bet", label: "SB open vs BB 3-bet", group: "Facing 3-bet", spotIds: ["fk_6max_100bb_sb_open_vs_bb_3bet_v1"] },
    { id: "all-facing-4bet", label: "All Facing 4-bet", group: "Facing 4-bet", spotIds: FACING_FOUR_BET_SPOT_IDS },
    { id: "hj-3bet-vs-lj-open-lj-4bet", label: "HJ 3-bet vs LJ open / LJ 4-bet", group: "Facing 4-bet", spotIds: ["fk_6max_100bb_hj_3bet_vs_lj_open_lj_4bet_v1"] },
    { id: "co-3bet-vs-hj-open-hj-4bet", label: "CO 3-bet vs HJ open / HJ 4-bet", group: "Facing 4-bet", spotIds: ["fk_6max_100bb_co_3bet_vs_hj_open_hj_4bet_v1"] },
    { id: "btn-3bet-vs-co-open-co-4bet", label: "BTN 3-bet vs CO open / CO 4-bet", group: "Facing 4-bet", spotIds: ["fk_6max_100bb_btn_3bet_vs_co_open_co_4bet_v1"] },
    { id: "sb-3bet-vs-btn-open-btn-4bet", label: "SB 3-bet vs BTN open / BTN 4-bet", group: "Facing 4-bet", spotIds: ["fk_6max_100bb_sb_3bet_vs_btn_open_btn_4bet_v1"] },
    { id: "bb-3bet-vs-btn-open-btn-4bet", label: "BB 3-bet vs BTN open / BTN 4-bet", group: "Facing 4-bet", spotIds: ["fk_6max_100bb_bb_3bet_vs_btn_open_btn_4bet_v1"] },
    { id: "all-bvb-limp", label: "All BvB Limp", group: "BvB Limp", spotIds: BVB_LIMP_SPOT_IDS },
    { id: "sb-first-limp-or-raise", label: "SB first in: limp or raise", group: "BvB Limp", spotIds: ["fk_6max_100bb_sb_first_in_limp_or_raise_v1"] },
    { id: "bb-vs-sb-limp", label: "BB vs SB limp", group: "BvB Limp", spotIds: ["fk_6max_100bb_bb_vs_sb_limp_v1"] },
    { id: "sb-limp-vs-bb-raise", label: "SB limp vs BB raise", group: "BvB Limp", spotIds: ["fk_6max_100bb_sb_limp_vs_bb_raise_v1"] },
    { id: "all-iso-vs-limp", label: "All Iso vs Limp", group: "Iso vs Limp", spotIds: ISO_VS_LIMP_SPOT_IDS },
    { id: "iso-hj-vs-lj-limp", label: "HJ vs LJ limp", group: "Iso vs Limp", spotIds: ["fk_6max_100bb_hj_vs_lj_limp_v1"] },
    { id: "iso-co-vs-lj-limp", label: "CO vs LJ limp", group: "Iso vs Limp", spotIds: ["fk_6max_100bb_co_vs_lj_limp_v1"] },
    { id: "iso-btn-vs-lj-limp", label: "BTN vs LJ limp", group: "Iso vs Limp", spotIds: ["fk_6max_100bb_btn_vs_lj_limp_v1"] },
    { id: "iso-btn-vs-co-limp", label: "BTN vs CO limp", group: "Iso vs Limp", spotIds: ["fk_6max_100bb_btn_vs_co_limp_v1"] },
    { id: "iso-sb-vs-btn-limp", label: "SB vs BTN limp", group: "Iso vs Limp", spotIds: ["fk_6max_100bb_sb_vs_btn_limp_v1"] },
    { id: "iso-bb-vs-btn-limp", label: "BB vs BTN limp", group: "Iso vs Limp", spotIds: ["fk_6max_100bb_bb_vs_btn_limp_v1"] },
    { id: "all-squeeze", label: "All Squeeze", group: "Squeeze", spotIds: SQUEEZE_SPOT_IDS },
    { id: "sqz-co-vs-lj-open-hj-call", label: "CO vs LJ open + HJ call", group: "Squeeze", spotIds: ["fk_6max_100bb_co_vs_lj_open_hj_call_squeeze_v1"] },
    { id: "sqz-btn-vs-lj-open-co-call", label: "BTN vs LJ open + CO call", group: "Squeeze", spotIds: ["fk_6max_100bb_btn_vs_lj_open_co_call_squeeze_v1"] },
    { id: "sqz-btn-vs-hj-open-co-call", label: "BTN vs HJ open + CO call", group: "Squeeze", spotIds: ["fk_6max_100bb_btn_vs_hj_open_co_call_squeeze_v1"] },
    { id: "sqz-sb-vs-co-open-btn-call", label: "SB vs CO open + BTN call", group: "Squeeze", spotIds: ["fk_6max_100bb_sb_vs_co_open_btn_call_squeeze_v1"] },
    { id: "sqz-bb-vs-co-open-btn-call", label: "BB vs CO open + BTN call", group: "Squeeze", spotIds: ["fk_6max_100bb_bb_vs_co_open_btn_call_squeeze_v1"] },
    { id: "sqz-bb-vs-btn-open-sb-call", label: "BB vs BTN open + SB call", group: "Squeeze", spotIds: ["fk_6max_100bb_bb_vs_btn_open_sb_call_squeeze_v1"] },
    { id: PREFLOP_RANGE_REVIEW_DRILL_ID, label: "Review mistakes", group: "Review", reviewMode: true, spotIds: [] },
  ];

  const SPOT_IDS = Object.freeze({
    RFI_SPOT_IDS,
    BB_DEFENSE_SPOT_IDS,
    FACING_OPEN_RESPONSE_SPOT_IDS,
    FACING_OPEN_COVERAGE_SPOT_IDS,
    THREE_BET_SPOT_IDS,
    FACING_THREE_BET_SPOT_IDS,
    FACING_FOUR_BET_SPOT_IDS,
    BVB_LIMP_SPOT_IDS,
    ISO_VS_LIMP_SPOT_IDS,
    SQUEEZE_SPOT_IDS,
    TRAINABLE_SPOT_IDS,
  });

  return Object.freeze({
    PREFLOP_RANGE_DEFAULT_DRILL_ID,
    PREFLOP_RANGE_REVIEW_DRILL_ID,
    PREFLOP_RANGE_DRILL_DEFAULT_VERSION,
    SPOT_IDS,
    DRILL_OPTIONS,
    getDrillById(id) {
      return DRILL_OPTIONS.find((drill) => drill.id === id) || null;
    },
  });
});
