
import re

TEXT_FILE = "annual_report_utf8.txt"

KEYWORDS = {
    "MERCENARY_SIGNALS": ["requirement", "deliverable", "sign-off", "business request", "on time", "on budget", "specification"],
    "MISSIONARY_SIGNALS": ["customer problem", "outcome", "user needs", "solving", "empowered", "discovery", "product team"],
    "PROJECT_FUNDING": ["annual budget", "project funding", "capital expenditure", "capex", "project budget", "cost center"],
    "PRODUCT_FUNDING": ["continuous funding", "product budget", "investment stream", "stable team"],
    "IT_MINDSET": ["IT department", "information technology", "support function", "business and IT", "alignment"],
    "PRODUCT_MINDSET": ["product division", "product organization", "tech product", "engineering and product"],
    "OUTPUT_METRICS": ["number of features", "velocity", "shipped", "deployed"],
    "OUTCOME_METRICS": ["retention", "engagement", "revenue per user", "customer satisfaction", "NPS", "net promoter score", "conversion"]
}

def analyze():
    try:
        with open(TEXT_FILE, "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError:
        print("File not found.")
        return


    with open("analysis_results.txt", "w", encoding="utf-8") as out:
        out.write(f"--- Analysis of {TEXT_FILE} ---\n")
        
        for category, terms in KEYWORDS.items():
            out.write(f"\n### {category} ###\n")
            found_any = False
            for term in terms:
                matches = [m.start() for m in re.finditer(re.escape(term), text, re.IGNORECASE)]
                count = len(matches)
                if count > 0:
                    out.write(f"  '{term}': {count} matches\n")
                    found_any = True
                    # Print context for first few matches
                    for i in range(min(5, count)):
                        start = max(0, matches[i] - 100)
                        end = min(len(text), matches[i] + 100)
                        snippet = text[start:end].replace("\n", " ")
                        out.write(f"    Context: \"...{snippet}...\"\n")
            
            if not found_any:
                out.write("  (No matches found)\n")
    print("Analysis complete. Results written to analysis_results.txt")

if __name__ == "__main__":
    analyze()
