
import { useState, useEffect } from 'react';
import { useTreeData } from '@/hooks/useTreeData';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import TreeFilter from '@/components/TreeFilter';
import TreeCard from '@/components/TreeCard';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { 
    trees, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    clearFilters,
    uniqueSpecies,
    uniqueLocations
  } = useTreeData();

  const [animatedTrees, setAnimatedTrees] = useState<string[]>([]);

  // Stagger the animation of tree cards
  useEffect(() => {
    if (!loading && trees.length > 0) {
      const ids: string[] = [];
      trees.forEach((tree, index) => {
        setTimeout(() => {
          ids.push(tree.id);
          setAnimatedTrees([...ids]);
        }, index * 100);
      });
    }
  }, [loading, trees]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">
          Tree Collection
        </h1>
        <p className="text-muted-foreground">
          Explore and discover the diverse tree species at EMEA College
        </p>
      </div>
      
      <div className="sticky top-[72px] z-20 -mx-4 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="flex gap-3 items-center" id="filter">
          <div className="flex-1">
            <SearchBar 
              onSearch={(query) => updateFilters({ searchQuery: query })}
              initialValue={filters.searchQuery}
            />
          </div>
          <TreeFilter
            species={uniqueSpecies}
            locations={uniqueLocations}
            filters={filters}
            onFilterChange={updateFilters}
            onClearFilters={clearFilters}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="tree-card">
              <Skeleton className="h-48 w-full rounded-t-2xl" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-destructive mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2 className="text-xl font-medium">Something went wrong</h2>
          </div>
          <p className="text-muted-foreground">{error}</p>
          <button 
            className="btn-primary mt-6"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      ) : trees.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-muted-foreground">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <h2 className="text-xl font-medium">No trees found</h2>
          </div>
          {Object.keys(filters).some(key => !!filters[key as keyof typeof filters]) ? (
            <>
              <p className="text-muted-foreground">Try adjusting your filters</p>
              <button 
                className="btn-primary mt-6"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </>
          ) : (
            <p className="text-muted-foreground">Add your first tree to get started</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {trees.map((tree) => (
            <div 
              key={tree.id} 
              className={`${animatedTrees.includes(tree.id) ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            >
              <TreeCard tree={tree} />
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Index;
