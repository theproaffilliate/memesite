"use client";
import React, { useRef, useEffect, useState } from "react";
import { Dropdown } from "./Dropdown";

export default function CustomSelect<T extends string | number>(props: {
  value: T | "All";
  onChange: (v: T | "All") => void;
  options: { value: T; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  const {
    value,
    onChange,
    options,
    placeholder = "Select...",
    className,
  } = props;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lastKeyTime, setLastKeyTime] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, options.length + 1);
  }, [options.length]);

  // Focus container when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.focus();
        }
      }, 0);
    }
  }, [isOpen]);

  function focusItem(index: number) {
    const el = itemRefs.current[index];
    if (el) el.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const now = Date.now();
    const allItems = ["All", ...options.map((o) => o.label)];

    // Reset search string after 500ms of inactivity
    if (now - lastKeyTime > 500) {
      setSearchString("");
    }

    // Check if key is alphanumeric
    if (e.key.match(/^[a-zA-Z0-9]$/)) {
      e.preventDefault();
      const newSearch = searchString + e.key.toLowerCase();
      setSearchString(newSearch);
      setLastKeyTime(now);

      // Find first item starting with the search string
      const matchIndex = allItems.findIndex((item) =>
        item.toLowerCase().startsWith(newSearch)
      );

      if (matchIndex !== -1) {
        focusItem(matchIndex);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const currentIndex = itemRefs.current.findIndex(
        (ref) => ref === document.activeElement
      );
      const nextIndex = Math.min(currentIndex + 1, itemRefs.current.length - 1);
      focusItem(nextIndex);
      setSearchString("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const currentIndex = itemRefs.current.findIndex(
        (ref) => ref === document.activeElement
      );
      const prevIndex = Math.max(currentIndex - 1, 0);
      focusItem(prevIndex);
      setSearchString("");
    } else if (e.key === "Enter") {
      const focused = document.activeElement as HTMLButtonElement;
      if (focused && itemRefs.current.includes(focused)) {
        focused.click();
      }
      setSearchString("");
    }
  }

  return (
    <Dropdown
      fullWidth
      trigger={
        <button
          type="button"
          ref={triggerRef}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
          className={
            className ??
            "w-full text-left rounded-md px-3 py-2 bg-transparent border border-white/6 cursor-pointer"
          }
        >
          <span className="inline-flex items-center justify-between w-full">
            <span className="truncate">
              {options.find((o) => o.value === value)?.label ?? placeholder}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="none"
              className="w-4 h-4 ml-2 text-white/80"
              aria-hidden
            >
              <path
                d="M6 8l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      }
      align="left"
    >
      {({ close }: { close: () => void }) => (
        <div
          ref={containerRef}
          role="listbox"
          tabIndex={0}
          className="max-h-80 overflow-auto p-1 modal-scroll"
          onKeyDown={handleKeyDown}
        >
          <button
            type="button"
            ref={(el) => {
              if (el) itemRefs.current[0] = el;
            }}
            onClick={() => {
              onChange("All");
              setIsOpen(false);
              close();
            }}
            className={`w-full text-left px-3 py-2 rounded cursor-pointer ${
              value === "All" ? "bg-white/5 text-white" : "hover:bg-white/3"
            }`}
          >
            All
          </button>

          {options.map((o, i) => (
            <button
              type="button"
              key={String(o.value)}
              ref={(el) => {
                if (el) itemRefs.current[i + 1] = el;
              }}
              onClick={() => {
                onChange(o.value);
                setIsOpen(false);
                close();
              }}
              className={`w-full text-left px-3 py-2 rounded cursor-pointer ${
                value === o.value ? "bg-white/5 text-white" : "hover:bg-white/3"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
