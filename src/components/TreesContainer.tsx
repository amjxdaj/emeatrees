
import { useEffect } from 'react';
import { useTreeData } from '@/hooks/useTreeData';
import TreeCard from '@/components/TreeCard';
import SearchBar from '@/components/SearchBar';
import TreeFilter from '@/components/TreeFilter';
import AddPredefinedTrees from '@/components/AddPredefinedTrees';
import { FilterOptions } from '@/types';

const TreesContainer = () => {
  const { 
    trees, 
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

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <AddPredefinedTrees onSuccess={refreshTrees} />
      </div>

      <SearchBar 
        onSearch={handleSearch} 
        initialValue={filters.searchQuery} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <aside className="space-y-6">
          <TreeFilter
            species={uniqueSpecies}
            locations={uniqueLocations}
            families={uniqueFamilies}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </aside>
        
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
                {filters.searchQuery || filters.species || filters.location || filters.family
                  ? "No trees match your search criteria. Try adjusting your filters."
                  : "No trees have been added yet. Add your first tree to get started."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trees.map(tree => (
                <TreeCard key={tree.id} tree={tree} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreesContainer;
