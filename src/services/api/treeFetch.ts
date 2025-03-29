
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, Tree } from '@/types';
import { MOCK_TREES } from './mockData';
import { mapDbTreeToTree } from './utils';

export const getTrees = async (): Promise<ApiResponse<Tree[]>> => {
  try {
    const { data, error } = await supabase
      .from('trees')
      .select('*');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      const formattedTrees = data.map(mapDbTreeToTree);
      
      const uniqueTrees = formattedTrees.reduce((acc: Tree[], current) => {
        const isDuplicate = acc.find((item) => item.scientific_name === current.scientific_name);
        if (!isDuplicate) {
          return [...acc, current];
        }
        return acc;
      }, []);
      
      return { success: true, data: uniqueTrees };
    }
    
    return { success: true, data: MOCK_TREES };
  } catch (error) {
    console.error('Error fetching trees:', error);
    return { success: false, error: 'Failed to fetch trees' };
  }
};

export const getTree = async (id: string): Promise<ApiResponse<Tree>> => {
  try {
    const { data, error } = await supabase
      .from('trees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      const formattedTree = mapDbTreeToTree(data);
      return { success: true, data: formattedTree };
    }
    
    const tree = MOCK_TREES.find(t => t.id === id);
    if (!tree) {
      return { success: false, error: 'Tree not found' };
    }
    return { success: true, data: tree };
  } catch (error) {
    console.error(`Error fetching tree ${id}:`, error);
    return { success: false, error: 'Failed to fetch tree details' };
  }
};
