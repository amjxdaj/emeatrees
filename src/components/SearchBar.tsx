
import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search trees...', 
  initialValue = '' 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <input
        type="text"
        className="input-field pl-10 pr-10"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
      />
      {searchQuery && (
        <button 
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-4"
        >
          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
