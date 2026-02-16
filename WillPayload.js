export function buildWillPdfPayload(overrides = {}) {
  const read = (key, fallback) => {
    if (overrides[key] !== undefined && overrides[key] !== null) return overrides[key];
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const readMulti = (keys, fallback) => {
    for (const key of keys) {
      const val = read(key, undefined);
      if (val !== undefined && val !== null && (Array.isArray(val) ? val.length > 0 : Object.keys(val || {}).length > 0)) {
        return val;
      }
    }
    return fallback;
  };

  return {
    personalDetails: read('personalDetails', {}),
    willDetails: read('willDetails', {}),
    willExecutors: read('willExecutors', {}),

    // Prefer saved versions if present
    beneficiaries: readMulti(['savedBeneficiaries', 'beneficiaries'], []),
    assets: readMulti(['savedAssets', 'assets'], []),

    charities: read('charities', []),
    specialWishes: read('specialWishes', []),
    loanRepaymentAccounts: read('loanRepaymentAccounts', []),
    residuaryClause: read('residuaryClause', {}),

    // Use witnessDetails (app uses this key)
    witnessDetails: readMulti(['witnessDetails', 'witnesses'], {}),

    organDonation: read('organDonation', {}),
  };
}

export function getPdfOptions(payload, baseOptions = {}) {
  return {
    ...baseOptions,
    includeBanyyanReference: Boolean(payload?.willExecutors?.banyyanFallbackExecutorOptIn),
  };
}