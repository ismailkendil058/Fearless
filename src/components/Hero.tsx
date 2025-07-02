import { useLanguage } from "./LanguageContext";
import React, { useRef, useState, useEffect } from "react";

const Hero = () => {
  const { t } = useLanguage();

  // 3D Rotating Logo Logic (from Header)
  const [baseRotation, setBaseRotation] = useState({ x: 0, y: -4 });
  const [userOffset, setUserOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const animationStart = useRef<number | null>(null);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    setUserOffset((r) => ({ x: r.x - dy * 0.5, y: r.y + dx * 0.5 }));
    last.current = { x: e.clientX, y: e.clientY };
  };
  const handleMouseUp = () => {
    dragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (!dragging.current) return;
    const dx = e.touches[0].clientX - last.current.x;
    const dy = e.touches[0].clientY - last.current.y;
    setUserOffset((r) => ({ x: r.x - dy * 0.5, y: r.y + dx * 0.5 }));
    last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = () => {
    dragging.current = false;
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", handleTouchEnd);
  };

  // Auto-rotation
  useEffect(() => {
    let frameId: number;
    const animate = (timestamp: number) => {
      if (animationStart.current === null) animationStart.current = timestamp;
      const elapsed = (timestamp - animationStart.current) / 1000;
      const x = Math.sin(elapsed * 1.2) * 6;
      const y = Math.cos(elapsed * 0.9) * 9 - 2;
      setBaseRotation({ x, y });
      frameId = requestAnimationFrame(animate);
      animationFrame.current = frameId;
    };
    frameId = requestAnimationFrame(animate);
    animationFrame.current = frameId;
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
      animationStart.current = null;
    };
  }, []);

  const rotation = {
    x: baseRotation.x + userOffset.x,
    y: baseRotation.y + userOffset.y,
  };

  const scrollToProduct = () => {
    document.getElementById('product-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section
      className="relative pt-0 pb-0 md:pt-0 md:pb-0"
      style={{
        background: 'linear-gradient(to bottom, #f5f5f5 0%, #eaeaea 100%)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Product Image */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="relative w-full md:max-w-md">
              <img
                src="/Straps-w-background.jpg"
                alt="Fearless Lifting Straps"
                className="w-full object-cover bg-white"
                style={{ background: 'white', borderRadius: '2rem', boxShadow: '0 8px 48px 0 #eaeaea, 0 1.5px 16px 0 #f5f5f5' }}
              />
            </div>
          </div>
          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-8 flex flex-col items-center md:items-start justify-center">
            <h2 className="text-5xl md:text-7xl font-normal leading-tight mb-4" style={{ fontFamily: 'Old London, serif' }}>
              Train harder. Lift Fearlessly.<br />
              <span className="block font-arabic text-3xl md:text-5xl mt-2">قوتك تبدأ من قبضتك.</span>
            </h2>
            <button
              onClick={scrollToProduct}
              className="bg-black text-white px-10 py-4 text-xl font-semibold rounded-lg hover:bg-gray-800 transition-transform duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-black transform hover:scale-105"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
