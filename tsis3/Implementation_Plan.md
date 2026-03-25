# CFO Bot Implementation Plan

## 1. System Overview
The CFO Bot is a web-based chatbot application designed to help users estimate their monthly cloud computing costs accurately. It employs a fully client-side architecture that independently calculates costs for compute, storage, bandwidth, and managed database components using detailed mathematical formulas and a static, version-controlled Centralized Pricing Configuration engine (`pricing.json`).

## 2. Technology Stack
Based on the cloud pricing strategy and architectural justification, the project will be developed using the following technologies:
* **Frontend (Presentation & Calculation Engine)**: React (Vite) — Fast build times, component reusability, and instant responses running purely client-side without server latency.
* **Pricing Config**: Static JSON file (`pricing.json`) — Easy to update, no database dependency, version-controlled.
* **Hosting**: Firebase Hosting — Serves static assets via Google's global CDN on the free Spark plan. Ensures zero operational server costs, global availability, and SSL out of the box.

### Architectural Rationale
- **Cost Efficiency**: Running calculations client-side eliminates the need for backend servers or serverless functions (e.g., Firebase Functions), avoiding per-invocation costs and cold start latency. 
- **Scalability**: Firebase Hosting serves static assets via CDN. Regardless of traffic volume, hosting costs remain near-zero.
- **Simplicity**: A single deployable unit (static React build) reduces operational complexity, deployment risk, and debugging surface area.

## 3. Architecture & Modules
### 3.1 Presentation Layer (Frontend)
*   **Module**: Chat Interface
*   **Responsibilities**: Provide an intuitive, chat-based UI. Collect component metrics interactively (Compute, Storage, Bandwidth, Database Tier), display structural cost breakdowns, and cleanly render intuitive error text for invalid inputs.

### 3.2 Calculation Engine (Client-Side Logic)
*   **Module**: Cost Calculation Engine
*   **Responsibilities**: Validate incoming parameters (enforcing rules such as integer > 0) in the browser, perform linear deterministic mathematical calculations applying `pricing.json` data, restrict precision outputs to 2 decimal places logically, and assemble formatted responses instantly.
*   **Constraint**: Cannot contain any hardcoded operational prices. Must run calculations autonomously per component based on the fetched static JSON configuration.

### 3.3 Data Layer
*   **Module**: Central Configuration (`pricing.json`)
*   **Responsibilities**: Provide an isolated configuration schema containing values per minute/hour/GB for computations. Values to be implemented: Compute ($0.10/hour), Storage ($0.02/GB/month), Bandwidth ($0.08/GB), and standard mapped DB tiers (Basic $25, Standart $50, Premium $100).

## 4. Data Flow
1.  **Application Load**: The static React build is served via Firebase Hosting CDN. Application fetches the static `pricing.json` config.
2.  **User Input Collection**: A user opens the chat framework, responds to sequential prompts, and submits numbers regarding compute hours, storage size, data transferred, and database choice.
3.  **Input Validation**: Client-side logic intercepts the payload to determine variable validity (must be null or integer >= 0). Errors are immediately bounced back to frontend.
4.  **Cost Calculation**: Individual computations define exact monthly pricing models for virtual machines, storage blocks, egress, and DB tiers using the loaded pricing configuration.
5.  **Response Assembly**: Individual calculations are summed into a single "Total Monthly Cost". Both modular and total data are packed chronologically into the application state.
6.  **Result Display**: Frontend unpacks payload and renders a summarized itemized list sequentially mirroring a receipt.

## 5. Constraints and Architectural Rules Highlighted
*   **Mathematical Independence**: All four system components MUST function mathematically uncoupled. Missing options must simply equal zero.
*   **Complete Optionality**: All module tiers are purely optional; however, the request block must possess at least *one* actively parsed input.
*   **Fixed Precision Limit**: Mathematical logic must preserve high precision internally but uniformly round strict final UI prints to EXACTLY two (`.00`) decimal spaces.
*   **Immaculate Zero/Negative Rules**: Negative numbers trigger error validations ("Invalid input"); fully absent data resolves softly to $0 without breaking app progression.
*   **Client-Side Transparency**: As pricing logic operates entirely browser-side, it is acknowledged that calculations are visible. However, as it is an estimation tool with no sensitive business logic, this is an acceptable trade-off.

## 6. Step-by-Step Development Plan

### Phase 1: Project Setup
*   Initialize the React App (Vite) repository for the User Interface.
*   Establish a Firebase project and configure Firebase Hosting for deploying static assets.
*   Outline architectural folder separation.

### Phase 2: Building Pricing Configuration
*   Construct the central static `pricing.json` file. Base it precisely on the provided matrix: Compute ($0.10), Storage ($0.02), Bandwidth ($0.08), and mapped DB tiers (Basic $25, Standart $50, Premium $100).

### Phase 3: Implementing Cost Calculation Logic (Client-Side)
*   Engineer defensive input gating to catch "abc" strings, float points when an integer is strict, and negative volumes.
*   Write modular logic functions dynamically utilizing the fetched `pricing.json` data.

### Phase 4: Constructing the Chat Interface (React Front-End)
*   Design and deploy user experience features reflecting a chatbot window structure.
*   Implement state handling to parse inputs and sequence the bot conversational flow step-by-step.
*   Prepare UI component layouts tailored to render the detailed exact-cost structural breakdown.

### Phase 5: System Testing
*   Deploy unit tests targeting pure client-side calculation algorithms checking mathematical bounds.
*   Initiate edge case simulations (zero entry, missing elements, massive numerical overloads).
*   Conduct End-to-End checks manually interacting with the chat logic.

### Phase 6: Final Deployment
*   Bundle React production artifacts.
*   Deploy static assets to Firebase Hosting.
*   Verify global CDN availability and test the live application performance.
