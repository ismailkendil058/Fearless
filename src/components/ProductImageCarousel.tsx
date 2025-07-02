import React, { useState, useRef } from "react";

const productImages = [
  "/Straps-w-background.jpg",
  "/Straps-w-background-2.jpg",
  "/Straps-w-background-3.jpg",
];

const SWIPE_THRESHOLD = 40; // px

const ProductImageCarousel = () => {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const dragging = useRef(false);

  // Mouse/touch event handlers
  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
    setIsDragging(true);
    dragging.current = true;
  };
  const handleDragMove = (clientX: number) => {
    if (!dragging.current || startX.current === null) return;
    setDragX(clientX - startX.current);
  };
  const handleDragEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setIsDragging(false);
    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      if (dragX < 0) {
        setIndex((i) => (i === productImages.length - 1 ? 0 : i + 1));
      } else {
        setIndex((i) => (i === 0 ? productImages.length - 1 : i - 1));
      }
    }
    setDragX(0);
    startX.current = null;
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleDragMove(e.clientX);
  };
  const onMouseUp = handleDragEnd;
  const onMouseLeave = handleDragEnd;

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleDragMove(e.touches[0].clientX);
  };
  const onTouchEnd = handleDragEnd;

  const prevImage = () => setIndex((i) => (i === 0 ? productImages.length - 1 : i - 1));
  const nextImage = () => setIndex((i) => (i === productImages.length - 1 ? 0 : i + 1));

  return (
    <div
      className="relative w-full md:max-w-md mx-auto select-none"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div
        className="w-full h-full"
        style={{
          display: "flex",
          transition: isDragging ? "none" : "transform 0.7s cubic-bezier(.33,1.5,.68,1)",
          transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
        }}
      >
        {productImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Fearless Lifting Straps ${i + 1}`}
            className="w-full shadow-xl object-cover bg-white flex-shrink-0"
            style={{ width: "100%", userSelect: "none", pointerEvents: "none", borderRadius: 0 }}
            draggable={false}
          />
        ))}
      </div>
      {/* Carousel Controls */}
      <button
        onClick={prevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center"
        aria-label="Previous"
        style={{ zIndex: 3 }}
        tabIndex={-1}
      >
        &#8592;
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center"
        aria-label="Next"
        style={{ zIndex: 3 }}
        tabIndex={-1}
      >
        &#8594;
      </button>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-3">
        {productImages.map((_, i) => (
          <span
            key={i}
            className={`block w-2 h-2 rounded-full ${i === index ? "bg-black" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel; 