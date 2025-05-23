import React, { useRef, useEffect, useState } from "react";
import DayplanEventBox from "./event-box";

export default function DayplanEventDraggableBox({
  topPercent,
  heightPercent,
  resizing,
  onDragStart,
  onResizeStart,
  previewStartDate,
  previewEndDate,
  title,
  description,
}: {
  topPercent: number;
  heightPercent: number;
  resizing: boolean;
  onDragStart: (e: React.MouseEvent) => void;
  onResizeStart: (e: React.MouseEvent) => void;
  previewStartDate: Date;
  previewEndDate: Date;
  title: string;
  description: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isTiny, setIsTiny] = useState(false);

  useEffect(() => {
    const checkHeight = () => {
      if (boxRef.current) {
        setIsTiny(boxRef.current.offsetHeight < 22);
      }
    };
    checkHeight();
    if (boxRef.current && "ResizeObserver" in window) {
      const observer = new ResizeObserver(checkHeight);
      observer.observe(boxRef.current);
      return () => observer.disconnect();
    } else {
      window.addEventListener("resize", checkHeight);
      return () => window.removeEventListener("resize", checkHeight);
    }
  }, [heightPercent]);

  return (
    <div
      ref={boxRef}
      className="absolute left-1/2 z-10 w-[300px] -translate-x-1/2 group"
      style={{
        top: `${topPercent}%`,
        height: `${heightPercent}%`,
        cursor: resizing ? "ns-resize" : "grab",
        transition: "top 0.2s cubic-bezier(0.4,0,0.2,1)",
        userSelect: resizing ? "none" : undefined,
      }}
      onMouseDown={onDragStart}
    >
      <DayplanEventBox
        title={title}
        description={description}
        start={previewStartDate}
        end={previewEndDate}
        top="0"
        height="100%"
        hideResizeGradient={isTiny}
      />
      {/* Resize handle - always interactive, just invisible if tiny */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-1 w-28 h-1 flex items-end justify-center z-20"
        style={{
          touchAction: "none",
          cursor: "ns-resize",
          opacity: isTiny ? 0 : 1,
          pointerEvents: "auto",
        }}
        onMouseDown={onResizeStart}
      >
        <div className="w-20 h-0.5 bg-green-800 rounded-full opacity-90 group-hover:opacity-100 mb-0.5" />
      </div>
    </div>
  );
}
