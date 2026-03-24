# CFO Bot Test Specification

## 1. Overview
This document outlines the test cases required to verify the correctness, reliability, and precision of the CFO Bot application based on the formulas and variables defined in the system SSOT.

## 2. Pricing Reference Configuration
* **Compute**: $0.1 / hour
* **Storage**: $0.02 / GB
* **Bandwidth (Egress)**: $0.08 / GB
* **Database Tiers**: 
  * Basic: $25
  * Standart: $50
  * Premium: $100

*(Note: "Standart" spelling is maintained as per SSOT requirements)*

## 3. Individual Component Tests

### 3.1 Compute Component
| Input | Expected Output | Description |
| :--- | :--- | :--- |
| Compute: 50 | Compute Cost: $5.00 | Standard compute usage calculation (50 * $0.1) |
| Compute: 1 | Compute Cost: $0.10 | Minimum non-zero positive compute input |
| Compute: 730 | Compute Cost: $73.00 | Full month (24*30.4) continuous VM calculation |

### 3.2 Storage Component
| Input | Expected Output | Description |
| :--- | :--- | :--- |
| Storage: 500 | Storage Cost: $10.00 | Standard storage usage calculation (500 * $0.02) |
| Storage: 1 | Storage Cost: $0.02 | Minimum non-zero positive storage calculation |
| Storage: 10000 | Storage Cost: $200.00 | Large storage volume pricing calculation |

### 3.3 Bandwidth Component
| Input | Expected Output | Description |
| :--- | :--- | :--- |
| Bandwidth: 100 | Bandwidth Cost: $8.00 | Standard bandwidth egress calculation (100 * $0.08) |
| Bandwidth: 1 | Bandwidth Cost: $0.08 | Minimum non-zero positive bandwidth calculation |
| Bandwidth: 5000 | Bandwidth Cost: $400.00 | High usage egress calculation |

### 3.4 Database Component
| Input | Expected Output | Description |
| :--- | :--- | :--- |
| DB Tier: Basic | Database Cost: $25.00 | Fixed database cost for basic tier |
| DB Tier: Standart | Database Cost: $50.00 | Fixed database cost for standard tier |
| DB Tier: Premium | Database Cost: $100.00 | Fixed database cost for premium tier |

## 4. Full System Tests (Integration)

| Input | Expected Output | Description |
| :--- | :--- | :--- |
| Compute: 100<br>Storage: 50<br>Bandwidth: 20<br>DB: Basic | Compute Cost: $10.00<br>Storage Cost: $1.00<br>Bandwidth Cost: $1.60<br>Database Cost: $25.00<br><br>**Total Monthly Cost: $37.60** | Complete system integration covering all 4 components calculated accurately |
| Compute: 45<br>Storage: 1000<br>Bandwidth: 500<br>DB: Premium | Compute Cost: $4.50<br>Storage Cost: $20.00<br>Bandwidth Cost: $40.00<br>Database Cost: $100.00<br><br>**Total Monthly Cost: $164.50** | High-level workload integration combining diverse parameter sets mathematically |
| Compute: 730<br>Storage: 5000<br>Bandwidth: 10000<br>DB: Standart | Compute Cost: $73.00<br>Storage Cost: $100.00<br>Bandwidth Cost: $800.00<br>Database Cost: $50.00<br><br>**Total Monthly Cost: $1023.00**| Heavy user load full system breakdown test |

## 5. Edge Case Tests

| Input | Expected Output | Description |
| :--- | :--- | :--- |
| Compute: -10 | Error: "Invalid input: Compute hours must be a positive number." | Negative input validation check; system must handle incorrect inputs gracefully. |
| Compute: "abc"<br>Storage: 50 | Error: "Invalid input: Compute hours must be a valid data type." | Invalid data type submitted; robust string handling required. |
| DB Tier: (none)<br>Compute: 100 | Compute Cost: $10.00<br>Storage Cost: $0.00<br>Bandwidth Cost: $0.00<br>Database Cost: $0.00<br><br>**Total Monthly Cost: $10.00** | Missing optional fields must be properly treated as zeroes, ignoring blank inputs. |
| Compute: 0<br>Storage: 0<br>Bandwidth: 0<br>DB: Basic | Compute Cost: $0.00<br>Storage Cost: $0.00<br>Bandwidth Cost: $0.00<br>Database Cost: $25.00<br><br>**Total Monthly Cost: $25.00** | Zero usage inputs where baseline fixed DB costs still apply. |
| Compute: 0<br>Storage: 0<br>Bandwidth: 0<br>DB: (none) | Total Monthly Cost: $0.00 | Edge case rule defined in SSOT: "All inputs zero -> Total cost = $0". |
| (No inputs provided) | Error: "At least one input must be provided" | SSOT constraint: All components are OPTIONAL except at least one input must be provided. |
| Storage: 999999999 | Storage Cost: $19999999.98 | Extremely large value scalability check to ensure no numerical overflow happens and precise logic holds up. |
| Compute: 5.5 | Error: "Invalid input: Compute hours must be an integer." | SSOT defines input as "integer >= 0". If decimal provided, must validate correctly and reject it. |
