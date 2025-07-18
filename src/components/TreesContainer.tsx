
import { useEffect } from 'react';
import { useTreeData } from '@/hooks/useTreeData';
import TreeCard from '@/components/TreeCard';
import SearchBar from '@/components/SearchBar';
import TreeFilter from '@/components/TreeFilter';
import { FilterOptions } from '@/types';

const TreesContainer = () => {
  const { 
    trees, 
    allTrees,
    loading, 
    error, 
    filters, 
    updateFilters, 
    clearFilters, 
    refreshTrees,
    uniqueSpecies, 
    uniqueLocations, 
    uniqueFamilies 
  } = useTreeData();

  const handleSearch = (query: string) => {
    updateFilters({ searchQuery: query });
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    updateFilters(newFilters);
  };

  const handleDeleteTree = () => {
    refreshTrees();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-3/4">
          <SearchBar 
            onSearch={handleSearch} 
            initialValue={filters.searchQuery || ''} 
          />
        </div>
        <div className="w-full md:w-auto">
          <TreeFilter
            species={uniqueSpecies}
            locations={uniqueLocations}
            families={uniqueFamilies}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
      
      <div>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nature-600"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 border border-border rounded-lg">
            <p className="text-destructive mb-2">Error loading trees</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        ) : trees.length === 0 ? (
          <div className="text-center p-8 border border-border rounded-lg">
            <h3 className="text-lg font-medium mb-2">No trees found</h3>
            <p className="text-muted-foreground mb-6">
              {allTrees.length > 0 
                ? "No trees match your current filters." 
                : "No trees have been added yet. Add your first tree to get started."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {trees.map((tree) => (
              <TreeCard key={tree.id} tree={tree} onDelete={handleDeleteTree} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreesContainer;
