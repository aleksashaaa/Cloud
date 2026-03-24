import { describe, it, expect } from 'vitest';
import { calculateCosts, validateInput } from './calculator';

// Original SSOT pricing (Azure-like)
const azure = {
  compute_per_hour: 0.1,
  storage_per_gb: 0.02,
  bandwidth_per_gb: 0.08,
  database: { basic: 25, standart: 50, premium: 100 }
};

// Kazakh provider
const pscloud = {
  compute_per_hour: 45,
  storage_per_gb: 10,
  bandwidth_per_gb: 35,
  database: { basic: 12000, standart: 24000, premium: 48000 }
};

describe('Individual Component Tests (Azure)', () => {
  it('Compute: 50 hours = $5.00', () => {
    const r = calculateCosts({ compute: 50 }, azure);
    expect(r.breakdown.compute).toBe(5.00);
  });
  it('Storage: 500 GB = $10.00', () => {
    const r = calculateCosts({ storage: 500 }, azure);
    expect(r.breakdown.storage).toBe(10.00);
  });
  it('Bandwidth: 100 GB = $8.00', () => {
    const r = calculateCosts({ bandwidth: 100 }, azure);
    expect(r.breakdown.bandwidth).toBe(8.00);
  });
  it('Database: Basic = $25.00', () => {
    const r = calculateCosts({ database: 'Basic' }, azure);
    expect(r.breakdown.database).toBe(25.00);
  });
});

describe('Full System Integration (Azure)', () => {
  it('All components: total $37.60', () => {
    const r = calculateCosts({ compute: 100, storage: 50, bandwidth: 20, database: 'Basic' }, azure);
    expect(r.total).toBe(37.60);
  });
  it('High workload: total $164.50', () => {
    const r = calculateCosts({ compute: 45, storage: 1000, bandwidth: 500, database: 'Premium' }, azure);
    expect(r.total).toBe(164.50);
  });
  it('Heavy load: total $1023.00', () => {
    const r = calculateCosts({ compute: 730, storage: 5000, bandwidth: 10000, database: 'Standart' }, azure);
    expect(r.total).toBe(1023.00);
  });
});

describe('PS Cloud (Kazakhstan)', () => {
  it('Startup scenario in KZT', () => {
    const r = calculateCosts({ compute: 100, storage: 50, bandwidth: 20, database: 'basic' }, pscloud);
    expect(r.breakdown.compute).toBe(4500);
    expect(r.breakdown.storage).toBe(500);
    expect(r.breakdown.bandwidth).toBe(700);
    expect(r.breakdown.database).toBe(12000);
    expect(r.total).toBe(17700);
  });
});

describe('Edge Cases', () => {
  it('Negative → error', () => {
    const r = calculateCosts({ compute: -10 }, azure);
    expect(r.success).toBe(false);
  });
  it('String → error', () => {
    const r = calculateCosts({ compute: 'abc', storage: 50 }, azure);
    expect(r.success).toBe(false);
  });
  it('No inputs → error', () => {
    const r = calculateCosts({}, azure);
    expect(r.success).toBe(false);
  });
  it('Zero + DB = DB cost only', () => {
    const r = calculateCosts({ compute: 0, storage: 0, bandwidth: 0, database: 'Basic' }, azure);
    expect(r.total).toBe(25.00);
  });
  it('All zeros no DB = $0', () => {
    const r = calculateCosts({ compute: 0, storage: 0, bandwidth: 0 }, azure);
    expect(r.total).toBe(0.00);
  });
  it('Decimal → error', () => {
    const r = calculateCosts({ compute: 5.5 }, azure);
    expect(r.success).toBe(false);
  });
  it('Large value no overflow', () => {
    const r = calculateCosts({ storage: 999999999 }, azure);
    expect(r.breakdown.storage).toBe(19999999.98);
  });
});
