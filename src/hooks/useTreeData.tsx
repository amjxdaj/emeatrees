
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getTrees, getTree, deleteTree } from '../services/api';
import { Tree, FilterOptions } from '../types';
import { toast } from 'sonner';

export const useTreeData = (initialFilters?: FilterOptions) => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {});

  const fetchTrees = useCallback(async () => {
    setLoading(true);
    const response = await getTrees();
    
    if (response.success && response.data) {
      // Remove duplicate trees by scientific_name
      const uniqueTrees = response.data.reduce((acc: Tree[], current) => {
        const isDuplicate = acc.find((item) => item.scientific_name === current.scientific_name);
        if (!isDuplicate) {
          return [...acc, current];
        }
        return acc;
      }, []);
      
      setTrees(uniqueTrees);
      setError(null);
    } else {
      setError(response.error || 'Failed to fetch trees');
      toast.error('Failed to load trees. Please try again later.');
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  const filteredTrees = useMemo(() => {
    return trees.filter(tree => {
      const matchesSearch = !filters.searchQuery || 
        tree.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        tree.scientific_name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        tree.species.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        tree.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        (tree.common_name_english && tree.common_name_english.toLowerCase().includes(filters.searchQuery.toLowerCase())) ||
        (tree.common_name_malayalam && tree.common_name_malayalam.toLowerCase().includes(filters.searchQuery.toLowerCase()));
      
      const matchesSpecies = !filters.species || 
        tree.species.toLowerCase() === filters.species.toLowerCase();
      
      const matchesLocation = !filters.location || 
        tree.location.toLowerCase() === filters.location.toLowerCase();
        
      const matchesFamily = !filters.family || 
        tree.family.toLowerCase() === filters.family.toLowerCase();
      
      return matchesSearch && matchesSpecies && matchesLocation && matchesFamily;
    });
  }, [trees, filters]);

  const uniqueSpecies = useMemo(() => {
    return Array.from(new Set(trees.map(tree => tree.species))).sort();
  }, [trees]);

  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(trees.map(tree => tree.location))).sort();
  }, [trees]);
  
  const uniqueFamilies = useMemo(() => {
    return Array.from(new Set(trees.map(tree => tree.family))).sort();
  }, [trees]);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const refreshTrees = () => {
    fetchTrees();
  };

  return {
    trees: filteredTrees,
    allTrees: trees,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refreshTrees,
    uniqueSpecies,
    uniqueLocations,
    uniqueFamilies,
  };
};

export const useTreeDetails = (id: string) => {
  const [tree, setTree] = useState<Tree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    const response = await getTree(id);
    
    if (response.success && response.data) {
      setTree(response.data);
      setError(null);
    } else {
      setError(response.error || 'Failed to fetch tree details');
      toast.error('Could not load tree details. Please try again later.');
    }
    
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const refreshTree = () => {
    fetchTree();
  };

  return { tree, loading, error, refreshTree };
};
