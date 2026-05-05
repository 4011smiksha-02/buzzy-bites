import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search restaurants, cuisines, neighbourhoods…",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative group ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-11 pr-10 h-12 rounded-xl bg-card border-border text-base shadow-warm focus-visible:ring-ring focus-visible:border-primary transition-smooth"
        data-ocid="search.input"
        aria-label="Search restaurants"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full"
          aria-label="Clear search"
          data-ocid="search.clear_button"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
