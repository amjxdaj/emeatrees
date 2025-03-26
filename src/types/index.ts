
export interface Tree {
  id: string;
  name: string;
  species: string;
  location: string;
  description: string;
  imageUrl: string;
  addedDate: string;
}

export interface TreeFormData {
  name: string;
  species: string;
  location: string;
  description: string;
  image?: File | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type FilterOptions = {
  species?: string;
  location?: string;
  searchQuery?: string;
};
