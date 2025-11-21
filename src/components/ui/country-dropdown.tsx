// src/components/ui/CountryDropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { countries } from "@/lib/useCountry"; // your full list

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CountryDropdown: React.FC<CountryDropdownProps> = ({
  value,
  onChange,
  placeholder = "Select your country",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCountry = countries.find((c) => c.label === value);

  const filteredCountries = countries.filter((country) =>
    country.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-[#FF9E0C] transition"
      >
        <div className="flex items-center gap-3 truncate">
          {selectedCountry ? (
            <>
              <ReactCountryFlag
                countryCode={selectedCountry.code}
                svg
                style={{ width: "24px", height: "18px" }}
              />
              <span className="truncate">{selectedCountry.label}</span>
            </>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown with Search */}
      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-[9999] overflow-hidden">
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#FF9E0C]"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-52 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                No country found
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onChange(country.label);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition"
                >
                  <ReactCountryFlag
                    countryCode={country.code}
                    svg
                    style={{ width: "26px", height: "20px" }}
                  />
                  <span className="text-gray-700">{country.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
