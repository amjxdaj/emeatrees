
export interface Tree {
  id: string;
  name: string;
  scientific_name: string;
  family: string;
  common_name_english: string;
  common_name_malayalam?: string;
  native_range?: string;
  species: string;
  location: string;
  description: string;
  imageUrl: string;
  addedDate: string;
  pendingImage?: boolean;
}

export interface TreeFormData {
  name: string;
  scientific_name: string;
  family: string;
  common_name_english: string;
  common_name_malayalam?: string;
  native_range?: string;
  species: string;
  location: string;
  description: string;
  image?: File | null;
  skipImageUpload?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type FilterOptions = {
  species?: string;
  location?: string;
  family?: string;
  searchQuery?: string;
};

export interface TreeImageUploadData {
  treeId: string;
  image: File;
}
