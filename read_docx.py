import zipfile
import xml.etree.ElementTree as ET
import sys
import os

def list_docx_content(filename):
    if not os.path.exists(filename):
        print(f"File not found: {filename}")
        return

    try:
        with zipfile.ZipFile(filename) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # XML namespaces
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for p in tree.findall('.//w:p', ns):
                texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            
            with open(filename + ".txt", "w", encoding="utf-8") as f:
                f.write('\n'.join(paragraphs))
            print(f"Successfully wrote to {filename}.txt")
    except Exception as e:
        print(f"Error reading docx: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python read_docx.py <filename>")
    else:
        list_docx_content(sys.argv[1])
