
import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { FilterOptions } from '@/types';

interface TreeFilterProps {
  species: string[];
  locations: string[];
  families?: string[];
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
}

const TreeFilter = ({
  species,
  locations,
  families = [],
  filters,
  onFilterChange,
  onClearFilters
}: TreeFilterProps) => {
  const [open, setOpen] = useState(false);
  
  const handleSpeciesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ species: e.target.value });
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ location: e.target.value });
  };

  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ family: e.target.value });
  };
  
  const hasActiveFilters = !!filters.species || !!filters.location || !!filters.family;
  const activeFilterCount = 
    (!!filters.species ? 1 : 0) + 
    (!!filters.location ? 1 : 0) + 
    (!!filters.family ? 1 : 0);
  
  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`gap-2 ${hasActiveFilters ? 'bg-primary/10 border-primary/20' : ''}`}
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Filters</h3>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 gap-1 text-xs"
                  onClick={() => {
                    onClearFilters();
                    setOpen(false);
                  }}
                >
                  <X className="h-3 w-3" />
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Species
              </label>
              <select
                className="input-field"
                value={filters.species || ''}
                onChange={handleSpeciesChange}
              >
                <option value="">All Species</option>
                {species.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            
            {families.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Family
                </label>
                <select
                  className="input-field"
                  value={filters.family || ''}
                  onChange={handleFamilyChange}
                >
                  <option value="">All Families</option>
                  {families.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Location
              </label>
              <select
                className="input-field"
                value={filters.location || ''}
                onChange={handleLocationChange}
              >
                <option value="">All Locations</option>
                {locations.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button onClick={() => setOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TreeFilter;
