import fitz, os
src = "/Users/tmoi/Desktop/TmoiMacbookPro/Document/ADC/TmoiPortfolio.pdf"
out = "/tmp/pdf_render/adc"
os.makedirs(out, exist_ok=True)
doc = fitz.open(src)
page = doc[0]
W, H = page.rect.width, page.rect.height
print("page rect:", W, "x", H)
chunks = 6
ch = H / chunks
for i in range(chunks):
    y0 = i * ch
    y1 = (i + 1) * ch
    clip = fitz.Rect(0, y0, W, y1)
    pix = page.get_pixmap(matrix=fitz.Matrix(1.4, 1.4), clip=clip)
    path = os.path.join(out, f"chunk_{i+1}.png")
    pix.save(path)
    print(path, pix.width, "x", pix.height)
doc.close()
