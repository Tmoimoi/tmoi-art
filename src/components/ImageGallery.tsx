import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lightbox from "./Lightbox";

// 图片画廊：多图网格 + 点击放大（lightbox）
export default function ImageGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIdx(i);
              setOpen(true);
            }}
            className="overflow-hidden rounded-lg bg-ink-soft"
            aria-label={`查看${title}第 ${i + 1} 张`}
          >
            <img
              src={src}
              alt={`${title} 图 ${i + 1}`}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <Lightbox
            images={images}
            index={idx}
            onClose={() => setOpen(false)}
            onIndex={setIdx}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
