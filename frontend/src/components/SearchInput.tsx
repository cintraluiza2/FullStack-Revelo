import { useState, useEffect, useRef } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search candidates",
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const isFirstRun = useRef(true);


  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (localValue === value) return;

    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs]); 

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <svg
          className="w-4 h-4 text-[#909090]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        type="text"
        className="w-full h-[32px] pl-10 pr-3 text-[13.7px] border border-[#cccccc] rounded-[2px]"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  );
};
