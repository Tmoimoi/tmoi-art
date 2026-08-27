import sys, fitz, os

files = [
    "/Users/tmoi/Desktop/TmoiMacbookPro/Document/Tmoi Portfolio.pdf",
    "/Users/tmoi/Desktop/TmoiMacbookPro/Document/ADC/TmoiPortfolio.pdf",
]

for path in files:
    print("="*80)
    print("FILE:", os.path.basename(path))
    doc = fitz.open(path)
    print("PAGES:", doc.page_count)
    total_imgs = 0
    for i, page in enumerate(doc):
        imgs = page.get_images(full=True)
        total_imgs += len(imgs)
        text = page.get_text().strip()
        # print first ~1200 chars of text per page
        print(f"\n--- page {i+1} (images:{len(imgs)}) ---")
        if text:
            print(text[:1500])
        else:
            print("[no text / image-only page]")
    print("\nTOTAL IMAGES in doc:", total_imgs)
    doc.close()
