// Centralized Pricing Configuration (SSOT)
// All calculations MUST reference this config — no hardcoded prices in business logic.

const PRICING = {
  platforms: {
    aws: {
      name: "Amazon Web Services (AWS)",
      currency: "USD",
      compute_per_hour: 0.096,
      storage_per_gb: 0.023,
      bandwidth_per_gb: 0.09,
      database: { basic: 26, standart: 52, premium: 104 }
    },
    azure: {
      name: "Microsoft Azure",
      currency: "USD",
      compute_per_hour: 0.10,
      storage_per_gb: 0.018,
      bandwidth_per_gb: 0.087,
      database: { basic: 25, standart: 50, premium: 100 }
    },
    gcp: {
      name: "Google Cloud Platform (GCP)",
      currency: "USD",
      compute_per_hour: 0.095,
      storage_per_gb: 0.020,
      bandwidth_per_gb: 0.08,
      database: { basic: 24, standart: 48, premium: 96 }
    },
    pscloud: {
      name: "PS Cloud (Kazakhstan)",
      currency: "KZT",
      compute_per_hour: 45,
      storage_per_gb: 10,
      bandwidth_per_gb: 35,
      database: { basic: 12000, standart: 24000, premium: 48000 }
    },
    qaztelecom: {
      name: "QazCloud by Kaztelecom",
      currency: "KZT",
      compute_per_hour: 50,
      storage_per_gb: 12,
      bandwidth_per_gb: 40,
      database: { basic: 14000, standart: 28000, premium: 56000 }
    }
  }
};

export default PRICING;
