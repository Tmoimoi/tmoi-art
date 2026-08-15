import { useEffect } from "react";
import { motion } from "framer-motion";

// 图片放大查看：支持键盘 Esc 关闭、左右切换
export default function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft")
        onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onIndex]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 backdrop-blur"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="图片放大查看"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="关闭"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-2xl text-paper hover:border-accent hover:text-accent"
      >
        ×
      </button>

      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index - 1 + images.length) % images.length);
            }}
            aria-label="上一张"
            className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-2xl text-paper hover:border-accent hover:text-accent"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index + 1) % images.length);
            }}
            aria-label="下一张"
            className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-2xl text-paper hover:border-accent hover:text-accent"
          >
            ›
          </button>
          <div className="absolute bottom-5 text-xs tracking-widest2 text-paper-dim">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </motion.div>
  );
}
