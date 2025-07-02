import { useLanguage } from "./LanguageContext";
import React, { useRef, useState, useEffect } from "react";

interface HeaderProps {
  onAdminClick: () => void;
}

const Header = ({ onAdminClick }: HeaderProps) => {
  const { t } = useLanguage();
  // Store base rotation (from animation) and user offset (from drag)
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

  // Faster automatic 3D rotation animation
  useEffect(() => {
    let frameId: number;
    const animate = (timestamp: number) => {
      if (animationStart.current === null) animationStart.current = timestamp;
      const elapsed = (timestamp - animationStart.current) / 1000; // seconds
      // Faster elliptical path
      const x = Math.sin(elapsed * 0.5) * 8; // up/down, faster
      const y = Math.cos(elapsed * 0.35) * 12 - 4; // left/right, faster
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

  // Combine base rotation and user offset
  const rotation = {
    x: baseRotation.x + userOffset.x,
    y: baseRotation.y + userOffset.y,
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white text-center py-2 text-sm w-full">
        <p>NEW ARRIVAL - Free shipping on orders over 3,000 DA</p>
      </div>
    </>
  );
};

export default Header;
