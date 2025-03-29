
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, Tree, TreeFormData } from '@/types';
import { mapDbTreeToTree } from './utils';
import { uploadImageToStorage } from './imageUpload';

export const addTree = async (treeData: TreeFormData): Promise<ApiResponse<Tree>> => {
  try {
    let imageUrl = null;
    
    if (treeData.image && !treeData.skipImageUpload) {
      const uploadResponse = await uploadImageToStorage(treeData.image);
      if (uploadResponse.success && uploadResponse.url) {
        imageUrl = uploadResponse.url;
      }
    }
    
    const treeRecord = {
      scientific_name: treeData.scientific_name || '',
      family: treeData.family || '',
      common_name_english: treeData.common_name_english || '',
      common_name_malayalam: treeData.common_name_malayalam || null,
      native_range: treeData.native_range || null,
      location: treeData.location || 'EMEA College',
      description: treeData.description || null,
      image_url: imageUrl
    };
    
    const { data, error } = await supabase
      .from('trees')
      .insert(treeRecord)
      .select()
      .single();
      
    if (error) throw error;
    
    if (data) {
      const newTree = mapDbTreeToTree(data);
      return { success: true, data: newTree };
    }
    
    const newTree: Tree = {
      id: String(Date.now()),
      name: treeData.scientific_name,
      scientific_name: treeData.scientific_name,
      family: treeData.family,
      common_name_english: treeData.common_name_english,
      common_name_malayalam: treeData.common_name_malayalam,
      native_range: treeData.native_range,
      species: treeData.scientific_name,
      location: treeData.location,
      description: treeData.description || '',
      imageUrl: treeData.skipImageUpload ? '' : (treeData.image ? URL.createObjectURL(treeData.image) : ''),
      addedDate: new Date().toISOString().split('T')[0],
      pendingImage: treeData.skipImageUpload || !treeData.image
    };
    
    return { success: true, data: newTree };
  } catch (error) {
    console.error('Error adding tree:', error);
    return { success: false, error: 'Failed to add tree' };
  }
};

export const deleteTree = async (id: string): Promise<ApiResponse<boolean>> => {
  try {
    const { data: treeData, error: fetchError } = await supabase
      .from('trees')
      .select('image_url')
      .eq('id', id)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching tree data for deletion:', fetchError);
      throw fetchError;
    }
    
    if (treeData?.image_url) {
      const urlParts = treeData.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      if (fileName) {
        console.log('Removing tree image:', fileName);
        const { error: removeError } = await supabase.storage
          .from('trees')
          .remove([fileName]);
          
        if (removeError) {
          console.warn('Error removing tree image, continuing with tree deletion:', removeError);
        }
      }
    }
    
    const { error: deleteError } = await supabase
      .from('trees')
      .delete()
      .eq('id', id);
      
    if (deleteError) throw deleteError;
    
    return { success: true, data: true };
  } catch (error) {
    console.error('Error deleting tree:', error);
    return { success: false, error: 'Failed to delete tree' };
  }
};
