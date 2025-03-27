import axios from 'axios';
import { ApiResponse, Tree, TreeFormData, TreeImageUploadData } from '../types';
import { supabase } from '@/integrations/supabase/client';

// This would normally point to your backend API
const API_BASE_URL = 'https://api.example.com';

// Mock data for development
const MOCK_TREES: Tree[] = [
  {
    id: '1',
    name: 'Ancient Oak',
    scientific_name: 'Quercus robur',
    family: 'Fagaceae',
    common_name_english: 'English Oak',
    common_name_malayalam: 'ഓക്ക്',
    native_range: 'Europe, Western Asia',
    species: 'Quercus robur',
    location: 'North Campus',
    description: 'A magnificent oak tree estimated to be over 200 years old. It provides shade for students and habitat for local wildlife.',
    imageUrl: 'https://images.unsplash.com/photo-1542202229-7d93c33f5d07',
    addedDate: '2023-10-15'
  },
  {
    id: '2',
    name: 'Japanese Maple',
    scientific_name: 'Acer palmatum',
    family: 'Sapindaceae',
    common_name_english: 'Japanese Maple',
    common_name_malayalam: 'ജാപ്പനീസ് മേപ്പിൾ',
    native_range: 'Japan, Korea, China',
    species: 'Acer palmatum',
    location: 'East Garden',
    description: 'Known for its stunning red foliage, this Japanese maple adds vibrant color to the garden throughout autumn.',
    imageUrl: 'https://images.unsplash.com/photo-1567641091594-13a9faa0f814',
    addedDate: '2023-11-02'
  },
  {
    id: '3',
    name: 'Weeping Willow',
    scientific_name: 'Salix babylonica',
    family: 'Salicaceae',
    common_name_english: 'Weeping Willow',
    common_name_malayalam: 'വില്ലോ മരം',
    native_range: 'Northern China',
    species: 'Salix babylonica',
    location: 'Lakeside',
    description: 'This graceful willow with its sweeping branches creates a peaceful atmosphere by the college lake.',
    imageUrl: 'https://images.unsplash.com/photo-1636680271758-1d4c155a6e8d',
    addedDate: '2023-09-28'
  },
  {
    id: '4',
    name: 'Silver Birch',
    scientific_name: 'Betula pendula',
    family: 'Betulaceae',
    common_name_english: 'Silver Birch',
    common_name_malayalam: 'വെള്ളി ബിർച്ച്',
    native_range: 'Europe, Asia',
    species: 'Betula pendula',
    location: 'West Campus',
    description: 'Distinguished by its white bark, this birch tree stands in contrast to the surrounding vegetation.',
    imageUrl: 'https://images.unsplash.com/photo-1516214104703-d870798883c5',
    addedDate: '2024-01-12'
  },
  {
    id: '5',
    name: 'Coastal Redwood',
    scientific_name: 'Sequoia sempervirens',
    family: 'Cupressaceae',
    common_name_english: 'Coast Redwood',
    common_name_malayalam: 'തീരദേശ റെഡ്‌വുഡ്',
    native_range: 'California, Oregon',
    species: 'Sequoia sempervirens',
    location: 'Central Plaza',
    description: 'A young coastal redwood planted as part of the college\'s commitment to growing future heritage trees.',
    imageUrl: 'https://images.unsplash.com/photo-1503785640985-f62e3aeee448',
    addedDate: '2023-12-08'
  }
];

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Functions
export const getTrees = async (): Promise<ApiResponse<Tree[]>> => {
  try {
    // Get trees from Supabase
    const { data, error } = await supabase
      .from('trees')
      .select('*');
    
    if (error) throw error;
    
    // If data is available from Supabase, use it
    if (data && data.length > 0) {
      const formattedTrees = data.map(tree => ({
        ...tree,
        id: tree.id,
        name: tree.name,
        scientific_name: tree.scientific_name,
        family: tree.family,
        common_name_english: tree.common_name_english,
        common_name_malayalam: tree.common_name_malayalam || undefined,
        native_range: tree.native_range || undefined,
        species: tree.species,
        location: tree.location,
        description: tree.description || '',
        imageUrl: tree.image_url || 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
        addedDate: new Date(tree.added_date).toISOString().split('T')[0],
        pendingImage: !tree.image_url || tree.image_url.includes('placeholder') || tree.image_url.includes('unsplash'),
      }));
      return { success: true, data: formattedTrees };
    }
    
    // Fall back to mock data if no data in Supabase
    return { success: true, data: MOCK_TREES };
  } catch (error) {
    console.error('Error fetching trees:', error);
    return { success: false, error: 'Failed to fetch trees' };
  }
};

export const getTree = async (id: string): Promise<ApiResponse<Tree>> => {
  try {
    // Try to get tree from Supabase
    const { data, error } = await supabase
      .from('trees')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    // If found in Supabase, return it
    if (data) {
      const formattedTree = {
        id: data.id,
        name: data.name,
        scientific_name: data.scientific_name,
        family: data.family,
        common_name_english: data.common_name_english,
        common_name_malayalam: data.common_name_malayalam || undefined,
        native_range: data.native_range || undefined,
        species: data.species,
        location: data.location,
        description: data.description || '',
        imageUrl: data.image_url || 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
        addedDate: new Date(data.added_date).toISOString().split('T')[0],
        pendingImage: !data.image_url || data.image_url.includes('placeholder') || data.image_url.includes('unsplash'),
      };
      return { success: true, data: formattedTree };
    }
    
    // Fall back to mock data
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

export const addTree = async (treeData: TreeFormData): Promise<ApiResponse<Tree>> => {
  try {
    // Handle image upload if provided
    let imageUrl = null;
    
    if (treeData.image && !treeData.skipImageUpload) {
      const fileExt = treeData.image.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('trees')
        .upload(filePath, treeData.image);
      
      if (uploadError) {
        console.error('Image upload error:', uploadError);
        // Continue with adding the tree, but without an image
      } else if (uploadData) {
        // Get the public URL
        const { data } = supabase.storage.from('trees').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    }
    
    // Prepare the data for Supabase
    const treeRecord = {
      name: treeData.name || '',
      scientific_name: treeData.scientific_name || '',
      family: treeData.family || '',
      common_name_english: treeData.common_name_english || '',
      common_name_malayalam: treeData.common_name_malayalam || null,
      native_range: treeData.native_range || null,
      species: treeData.species || '',
      location: treeData.location || 'EMEA College',
      description: treeData.description || null,
      image_url: imageUrl
    };
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('trees')
      .insert(treeRecord)
      .select()
      .single();
      
    if (error) throw error;
    
    if (data) {
      const newTree: Tree = {
        id: data.id,
        name: data.name,
        scientific_name: data.scientific_name,
        family: data.family,
        common_name_english: data.common_name_english,
        common_name_malayalam: data.common_name_malayalam,
        native_range: data.native_range,
        species: data.species,
        location: data.location,
        description: data.description || '',
        imageUrl: data.image_url || 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
        addedDate: new Date(data.added_date).toISOString().split('T')[0],
        pendingImage: !data.image_url
      };
      
      return { success: true, data: newTree };
    }
    
    // Fallback to mock implementation
    const newTree: Tree = {
      id: String(Date.now()),
      name: treeData.name,
      scientific_name: treeData.scientific_name,
      family: treeData.family,
      common_name_english: treeData.common_name_english,
      common_name_malayalam: treeData.common_name_malayalam,
      native_range: treeData.native_range,
      species: treeData.species,
      location: treeData.location,
      description: treeData.description || '',
      imageUrl: treeData.skipImageUpload ? 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86' : (treeData.image ? URL.createObjectURL(treeData.image) : 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86'),
      addedDate: new Date().toISOString().split('T')[0],
      pendingImage: treeData.skipImageUpload || !treeData.image
    };
    
    return { success: true, data: newTree };
  } catch (error) {
    console.error('Error adding tree:', error);
    return { success: false, error: 'Failed to add tree' };
  }
};

export const uploadTreeImage = async (data: TreeImageUploadData): Promise<ApiResponse<Tree>> => {
  try {
    const { treeId, image } = data;
    
    console.log('Starting image upload for tree ID:', treeId);
    
    // Get the current tree data
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
    
    // Upload the image to Supabase Storage
    const fileExt = image.name.split('.').pop() || 'jpg';
    const fileName = `tree_${treeId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    console.log('Uploading file:', fileName, 'to path:', filePath);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('trees')
      .upload(filePath, image);
    
    if (uploadError) {
      console.error('Image upload error:', uploadError);
      return { success: false, error: `Image upload failed: ${uploadError.message}` };
    }
    
    console.log('Upload successful, upload data:', uploadData);
    
    // Get the public URL for the uploaded image
    const { data: urlData } = supabase.storage.from('trees').getPublicUrl(filePath);
    const imageUrl = urlData.publicUrl;
    
    console.log('Image URL:', imageUrl);
    
    // Update the tree with the new image URL
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
      const tree: Tree = {
        id: updatedTree.id,
        name: updatedTree.name,
        scientific_name: updatedTree.scientific_name,
        family: updatedTree.family,
        common_name_english: updatedTree.common_name_english,
        common_name_malayalam: updatedTree.common_name_malayalam,
        native_range: updatedTree.native_range,
        species: updatedTree.species,
        location: updatedTree.location,
        description: updatedTree.description || '',
        imageUrl: updatedTree.image_url || imageUrl,
        addedDate: new Date(updatedTree.added_date).toISOString().split('T')[0],
        pendingImage: false
      };
      
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

export default api;
