
import { Tree } from '@/types';

export const mapDbTreeToTree = (dbTree: any): Tree => {
  return {
    id: dbTree.id,
    name: dbTree.scientific_name,
    scientific_name: dbTree.scientific_name,
    family: dbTree.family,
    common_name_english: dbTree.common_name_english,
    common_name_malayalam: dbTree.common_name_malayalam || undefined,
    native_range: dbTree.native_range || undefined,
    species: dbTree.scientific_name,
    location: dbTree.location,
    description: dbTree.description || '',
    imageUrl: dbTree.image_url || '',
    addedDate: new Date(dbTree.added_date).toISOString().split('T')[0],
    pendingImage: !dbTree.image_url,
  };
};
