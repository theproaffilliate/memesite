"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Dropdown } from "./Dropdown";

export default function CustomSelect<T extends string | number>(props: {
  value: T | "All";
  onChange: (v: T | "All") => void;
  options: { value: T; label: string }[];
  placeholder?: string;
  className?: string;
  searchable?: boolean;
}) {
  const {
    value,
    onChange,
    options,
    placeholder = "Select...",
    className,
    searchable = true,
  } = props;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [lastKeyTime, setLastKeyTime] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");

  const filteredOptions = useMemo(() => {
    if (!filterText) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [options, filterText]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, filteredOptions.length + 1);
  }, [filteredOptions.length]);

  // Focus container when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (searchable && searchInputRef.current) {
          searchInputRef.current.focus();
        } else if (containerRef.current) {
          containerRef.current.focus();
        }
      }, 0);
    }
  }, [isOpen, searchable]);

  function focusItem(index: number) {
    const el = itemRefs.current[index];
    if (el) el.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const now = Date.now();
    const allItems = ["All", ...filteredOptions.map((o) => o.label)];

    // Reset search string after 500ms of inactivity
    if (now - lastKeyTime > 500) {
      setSearchString("");
    }

    // Check if key is alphanumeric (only if not using search input)
    if (!searchable && e.key.match(/^[a-zA-Z0-9]$/)) {
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
        <div className="flex flex-col gap-2">
          {searchable && (
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-muted text-sm outline-none focus:ring-1 focus:ring-white/20"
            />
          )}
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
                setFilterText("");
                close();
              }}
              className={`w-full text-left px-3 py-2 rounded cursor-pointer ${
                value === "All" ? "bg-white/5 text-white" : "hover:bg-white/3"
              }`}
            >
              All
            </button>

            {filteredOptions.map((o, i) => (
              <button
                type="button"
                key={String(o.value)}
                ref={(el) => {
                  if (el) itemRefs.current[i + 1] = el;
                }}
                onClick={() => {
                  onChange(o.value);
                  setIsOpen(false);
                  setFilterText("");
                  close();
                }}
                className={`w-full text-left px-3 py-2 rounded cursor-pointer ${
                  value === o.value
                    ? "bg-white/5 text-white"
                    : "hover:bg-white/3"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </Dropdown>
  );
}
