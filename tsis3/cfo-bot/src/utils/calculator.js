/**
 * CFO Bot Cost Calculator
 * All calculations reference pricing config (pricing.json) — no hardcoded prices.
 */

export function validateInput(value, fieldName) {
  if (value === '' || value === null || value === undefined) {
    return { valid: true, value: null };
  }

  const num = Number(value);

  if (isNaN(num) || typeof value === 'boolean') {
    return { valid: false, error: `Invalid input: ${fieldName} must be a valid data type.` };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: `Invalid input: ${fieldName} must be an integer.` };
  }

  if (num < 0) {
    return { valid: false, error: `Invalid input: ${fieldName} must be a positive number.` };
  }

  return { valid: true, value: num };
}

export function validateDatabaseTier(tier, platformPricing) {
  if (!tier || tier === 'none') return { valid: true, value: null };
  const normalized = tier.toLowerCase().trim();
  if (!platformPricing.database[normalized]) {
    return { valid: false, error: `Invalid input: Unknown database tier "${tier}". Choose Basic, Standart, or Premium.` };
  }
  return { valid: true, value: normalized };
}

export function calculateCosts(inputs, platformPricing) {
  const errors = [];

  const compute = validateInput(inputs.compute, 'Compute hours');
  const storage = validateInput(inputs.storage, 'Storage (GB)');
  const bandwidth = validateInput(inputs.bandwidth, 'Bandwidth (GB)');
  const dbTier = validateDatabaseTier(inputs.database, platformPricing);

  if (!compute.valid) errors.push(compute.error);
  if (!storage.valid) errors.push(storage.error);
  if (!bandwidth.valid) errors.push(bandwidth.error);
  if (!dbTier.valid) errors.push(dbTier.error);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  if (compute.value === null && storage.value === null && bandwidth.value === null && dbTier.value === null) {
    return { success: false, errors: ['At least one input must be provided.'] };
  }

  const computeCost = (compute.value || 0) * platformPricing.compute_per_hour;
  const storageCost = (storage.value || 0) * platformPricing.storage_per_gb;
  const bandwidthCost = (bandwidth.value || 0) * platformPricing.bandwidth_per_gb;
  const databaseCost = dbTier.value ? platformPricing.database[dbTier.value] : 0;

  const totalCost = computeCost + storageCost + bandwidthCost + databaseCost;

  return {
    success: true,
    breakdown: {
      compute: roundTo2(computeCost),
      storage: roundTo2(storageCost),
      bandwidth: roundTo2(bandwidthCost),
      database: roundTo2(databaseCost),
    },
    total: roundTo2(totalCost),
    inputs: {
      compute: compute.value || 0,
      storage: storage.value || 0,
      bandwidth: bandwidth.value || 0,
      database: dbTier.value || 'none',
    }
  };
}

function roundTo2(num) {
  return Math.round(num * 100) / 100;
}
