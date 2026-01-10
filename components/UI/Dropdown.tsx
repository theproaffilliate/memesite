// components/UI/Dropdown.tsx
"use client";
import React, { useState, ReactNode, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

export function Dropdown({
  trigger,
  children,
  align = "right",
  fullWidth = false,
  onOpenChange,
}: {
  trigger: ReactNode;
  children: ReactNode | ((opts: { close: () => void }) => ReactNode);
  align?: "left" | "right";
  fullWidth?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width?: number;
  } | null>(null);

  const computePos = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const top = rect.bottom + scrollY + 8; // small gap
    if (fullWidth) {
      setCoords({ top, left: rect.left + scrollX, width: rect.width });
      return;
    }
    // Fixed compact width for dropdown menus
    let popupWidth = 180; // Fixed width: 180px (sm) or 200px (md)
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      popupWidth = 200; // md: fixed 200px
    }

    let left = rect.right + scrollX - popupWidth - 8; // Position right-aligned with small gap
    // Ensure popup doesn't go off-screen
    if (left < 8) left = 8;
    const maxLeft = window.innerWidth - popupWidth - 8;
    if (left > maxLeft) left = maxLeft;

    setCoords({ top, left, width: popupWidth });
  };

  useEffect(() => {
    if (open) {
      computePos();
      const onScroll = () => computePos();
      const onResize = () => computePos();
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onResize);
      const onDocClick = (e: MouseEvent) => {
        const target = e.target as Node | null;
        if (
          popupRef.current &&
          !popupRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          setOpen(false);
          onOpenChange?.(false);
        }
      };
      document.addEventListener("mousedown", onDocClick);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("mousedown", onDocClick);
      };
    }
    return;
  }, [open, align, fullWidth]);

  return (
    <div className={fullWidth ? "relative w-full" : "relative inline-block"}>
      <div
        ref={triggerRef}
        onClick={() => {
          if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
              top: rect.bottom + (window.scrollY || window.pageYOffset) + 8,
              left: rect.left + (window.scrollX || window.pageXOffset),
              width: fullWidth ? rect.width : undefined,
            });
          }
          setOpen((s) => {
            const next = !s;
            onOpenChange?.(next);
            return next;
          });
        }}
      >
        {trigger}
      </div>
      {open && coords
        ? createPortal(
            <div
              ref={popupRef}
              style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                width: coords.width,
                zIndex: 99999,
                willChange: "transform",
              }}
              className={clsx(
                "rounded-md shadow-lg border border-white/6 p-2 z-50"
              )}
            >
              <div
                style={{
                  backgroundColor: "rgba(6,8,12,0.55)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  borderRadius: 8,
                }}
                className="w-full"
              >
                {typeof children === "function"
                  ? children({
                      close: () => {
                        setOpen(false);
                        onOpenChange?.(false);
                      },
                    })
                  : children}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
