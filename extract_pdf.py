import sys
import os

pdf_path = r"C:\Users\User\Cloud\annual-report-2024.pdf"

def extract_text(path):
    print(f"Attempting to read {path}...")
    
    # Try pypdf
    try:
        from pypdf import PdfReader
        print("Using pypdf...")
        reader = PdfReader(path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except ImportError:
        pass
    except Exception as e:
        print(f"pypdf failed: {e}")

    # Try PyPDF2
    try:
        import PyPDF2
        print("Using PyPDF2...")
        with open(path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
    except ImportError:
        pass
    except Exception as e:
        print(f"PyPDF2 failed: {e}")

    return None

text = extract_text(pdf_path)
if text:

    with open("annual_report_utf8.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("SUCCESS: Written to annual_report_utf8.txt")
else:
    print("FAILED: No suitable PDF library found (pypdf, PyPDF2).")
