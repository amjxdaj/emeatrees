
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, Tree, TreeImageUploadData } from '@/types';
import { mapDbTreeToTree } from './utils';

type ImageUploadResponse = {
  success: boolean;
  url?: string;
  error?: string;
};

export const uploadImageToStorage = async (image: File): Promise<ImageUploadResponse> => {
  try {
    const fileExt = image.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('trees')
      .upload(filePath, image);
    
    if (uploadError) {
      console.error('Image upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }
    
    if (uploadData) {
      const { data } = supabase.storage.from('trees').getPublicUrl(filePath);
      return { success: true, url: data.publicUrl };
    }
    
    return { success: false, error: 'Failed to upload image' };
  } catch (error) {
    console.error('Error in uploadImageToStorage:', error);
    return { success: false, error: 'Failed to upload image to storage' };
  }
};

export const uploadTreeImage = async (data: TreeImageUploadData): Promise<ApiResponse<Tree>> => {
  try {
    const { treeId, image } = data;
    
    console.log('Starting image upload for tree ID:', treeId);
    
    const { data: treeData, error: fetchError } = await supabase
      .from('trees')
      .select('*')
      .eq('id', treeId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching tree data:', fetchError);
      throw fetchError;
    }
    
    if (!treeData) {
      console.error('Tree not found for ID:', treeId);
      return { success: false, error: 'Tree not found' };
    }
    
    if (treeData.image_url) {
      const urlParts = treeData.image_url.split('/');
      const oldFileName = urlParts[urlParts.length - 1];
      
      if (oldFileName) {
        console.log('Removing old image:', oldFileName);
        const { error: removeError } = await supabase.storage
          .from('trees')
          .remove([oldFileName]);
          
        if (removeError) {
          console.warn('Error removing old image, continuing anyway:', removeError);
        }
      }
    }
    
    const uploadResponse = await uploadImageToStorage(image);
    
    if (!uploadResponse.success) {
      return { success: false, error: `Image upload failed: ${uploadResponse.error}` };
    }
    
    const imageUrl = uploadResponse.url;
    
    console.log('Image URL:', imageUrl);
    
    const { data: updatedTree, error: updateError } = await supabase
      .from('trees')
      .update({ image_url: imageUrl })
      .eq('id', treeId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating tree with new image URL:', updateError);
      throw updateError;
    }
    
    console.log('Tree updated successfully with new image URL');
    
    if (updatedTree) {
      const tree = mapDbTreeToTree(updatedTree);
      return { success: true, data: tree };
    }
    
    return { 
      success: false, 
      error: 'Failed to update tree with new image' 
    };
  } catch (error) {
    console.error('Error uploading tree image:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};
