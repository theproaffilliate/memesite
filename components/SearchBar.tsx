// components/SearchBar.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import countries from "../data/countries";
import languages from "../data/languages";
import { Dropdown } from "./UI/Dropdown";

interface SearchBarProps {
  onSearch?: (q: string, country: string, language: string) => void;
}

export default function SearchBar({
  onSearch: onSearchCallback,
}: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("All");
  const [language, setLanguage] = useState("All");
  const [section, setSection] = useState<"country" | "language">("country");
  const [lastKeyTime, setLastKeyTime] = useState(0);
  const [searchString, setSearchString] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const countryRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const languageRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const countryContainerRef = useRef<HTMLDivElement | null>(null);
  const languageContainerRef = useRef<HTMLDivElement | null>(null);

  // Focus dropdown container when it opens
  useEffect(() => {
    if (isDropdownOpen) {
      const containerRef =
        section === "country" ? countryContainerRef : languageContainerRef;
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.focus();
        }
      }, 0);
    }
  }, [isDropdownOpen, section]);

  function onSearch(e?: React.FormEvent) {
    e?.preventDefault();

    // Call callback if provided (for component usage)
    if (onSearchCallback) {
      onSearchCallback(q, country, language);
    } else {
      // Use URL params for navigation (when in header)
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (country !== "All") params.set("country", country);
      if (language !== "All") params.set("language", language);

      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : "/");
    }
  }

  const clearAll = () => {
    setQ("");
    setCountry("All");
    setLanguage("All");
    router.push("/");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    isCountry: boolean
  ) => {
    const now = Date.now();
    const items = isCountry ? countries : languages;
    const allItems = ["All", ...items.map((item) => item.name)];

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
        const refs = isCountry ? countryRefs.current : languageRefs.current;
        const button = refs[matchIndex];
        if (button) button.focus();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const refs = isCountry ? countryRefs.current : languageRefs.current;
      const currentIndex = refs.findIndex(
        (ref) => ref === document.activeElement
      );
      const nextIndex = Math.min(currentIndex + 1, refs.length - 1);
      if (refs[nextIndex]) refs[nextIndex].focus();
      setSearchString("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const refs = isCountry ? countryRefs.current : languageRefs.current;
      const currentIndex = refs.findIndex(
        (ref) => ref === document.activeElement
      );
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (refs[prevIndex]) refs[prevIndex].focus();
      setSearchString("");
    } else if (e.key === "Enter") {
      const focused = document.activeElement as HTMLButtonElement;
      if (focused) {
        focused.click();
      }
      setSearchString("");
    }
  };

  return (
    <form onSubmit={onSearch} className="search-input">
      <Dropdown
        trigger={
          <button
            type="button"
            aria-label="filters"
            className="p-1 hover:opacity-80 transition flex items-center gap-1 cursor-pointer"
            onClick={() => setIsDropdownOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 5h18v2H3zM7 11h10v2H7zM10 17h4v2h-4z"
                fill="currentColor"
              />
            </svg>
            {(country !== "All" || language !== "All") && (
              <span className="text-xs bg-green-500 text-black rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {(country !== "All" ? 1 : 0) + (language !== "All" ? 1 : 0)}
              </span>
            )}
          </button>
        }
        align="left"
      >
        {({ close }: { close: () => void }) => {
          const handleClose = () => {
            setIsDropdownOpen(false);
            close();
          };
          return (
            <div className="flex flex-col gap-4 p-4 w-full sm:min-w-80 md:min-w-96">
              <div className="flex gap-2 mb-1 justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSection("country")}
                    className={`px-3 py-2 rounded text-sm font-medium transition ${
                      section === "country"
                        ? "bg-white/5 text-white"
                        : "hover:bg-white/3"
                    }`}
                  >
                    Countries
                  </button>
                  <button
                    type="button"
                    onClick={() => setSection("language")}
                    className={`px-3 py-2 rounded text-sm font-medium transition ${
                      section === "language"
                        ? "bg-white/5 text-white"
                        : "hover:bg-white/3"
                    }`}
                  >
                    Languages
                  </button>
                </div>
                {(country !== "All" || language !== "All" || q) && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 transition font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {section === "country" ? (
                <div>
                  <div className="text-xs text-muted mb-2">
                    Filter by country
                  </div>
                  <div
                    className="max-h-56 overflow-auto bg-transparent border border-white/6 rounded-md p-1 modal-scroll"
                    onKeyDown={(e) => handleKeyDown(e, true)}
                    tabIndex={0}
                    ref={countryContainerRef}
                  >
                    <button
                      ref={(el) => {
                        if (el) countryRefs.current[0] = el;
                      }}
                      onClick={() => {
                        setCountry("All");
                        handleClose();
                      }}
                      className={`w-full text-left px-3 py-2 rounded cursor-pointer ${
                        country === "All"
                          ? "bg-white/5 text-white"
                          : "hover:bg-white/3"
                      }`}
                    >
                      All countries
                    </button>
                    {countries.map((c, i) => (
                      <button
                        key={c.code}
                        ref={(el) => {
                          if (el) countryRefs.current[i + 1] = el;
                        }}
                        onClick={() => {
                          setCountry(c.code);
                          handleClose();
                        }}
                        className={`w-full text-left px-3 py-2 rounded cursor-pointer ${
                          country === c.code
                            ? "bg-white/5 text-white"
                            : "hover:bg-white/3"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-xs text-muted mb-2">
                    Filter by language
                  </div>
                  <div
                    className="max-h-40 overflow-auto bg-transparent border border-white/6 rounded-md p-1 modal-scroll"
                    onKeyDown={(e) => handleKeyDown(e, false)}
                    tabIndex={0}
                    ref={languageContainerRef}
                  >
                    <button
                      ref={(el) => {
                        if (el) languageRefs.current[0] = el;
                      }}
                      onClick={() => {
                        setLanguage("All");
                        handleClose();
                      }}
                      className={`w-full text-left px-3 py-2 rounded cursor-pointer ${
                        language === "All"
                          ? "bg-white/5 text-white"
                          : "hover:bg-white/3"
                      }`}
                    >
                      All languages
                    </button>
                    {languages.map((l, i) => (
                      <button
                        key={l.code}
                        ref={(el) => {
                          if (el) languageRefs.current[i + 1] = el;
                        }}
                        onClick={() => {
                          setLanguage(l.code);
                          handleClose();
                        }}
                        className={`w-full text-left px-3 py-2 rounded cursor-pointer ${
                          language === l.code
                            ? "bg-white/5 text-white"
                            : "hover:bg-white/3"
                        }`}
                      >
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </Dropdown>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search"
        title="Search video reactions"
        className="bg-transparent outline-none flex-1 text-sm sm:text-base sm:placeholder-shown:inline"
      />

      <button
        type="submit"
        className="flex items-center justify-center shrink-0 cursor-pointer"
        style={{
          width: "18px",
          height: "18px",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          style={{
            color: "rgba(255, 255, 255, 0.6)",
            width: "14px",
            height: "14px",
          }}
          className="sm:w-5 sm:h-5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>
    </form>
  );
}
