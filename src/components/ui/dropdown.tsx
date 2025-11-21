"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  name?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select an option",
  value,
  onChange,
  name,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Detect available space for dropdown direction
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = Math.min(48 * options.length, 240); // estimate height

      // open upward if not enough space below
      setOpenUpwards(spaceBelow < dropdownHeight);
    }
  }, [isOpen, options.length]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className={`w-full flex justify-between items-center px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition-all focus:ring-2 focus:ring-[#FF9E0C]`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          width={18}
          height={18}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown list */}
      {isOpen && (
        <ul
          className={`absolute w-full bg-white border border-gray-300 rounded-xl shadow-md z-[9999] overflow-hidden max-h-56 overflow-y-auto ${
            openUpwards ? "bottom-full mb-1" : "mt-1"
          }`}
        >
          {options.map((option, idx) => (
            <li key={idx}>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Hidden input for form compatibility */}
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
};

export default Dropdown;
