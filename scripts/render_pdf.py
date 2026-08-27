import fitz, os

jobs = [
    ("/Users/tmoi/Desktop/TmoiMacbookPro/Document/Tmoi Portfolio.pdf", "/tmp/pdf_render/portfolio"),
    ("/Users/tmoi/Desktop/TmoiMacbookPro/Document/ADC/TmoiPortfolio.pdf", "/tmp/pdf_render/adc"),
]

for path, outdir in jobs:
    os.makedirs(outdir, exist_ok=True)
    doc = fitz.open(path)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6))
        out = os.path.join(outdir, f"page_{i+1:02d}.png")
        pix.save(out)
        print("saved", out, pix.width, "x", pix.height)
    doc.close()
print("DONE")
