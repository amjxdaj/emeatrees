
import axios from 'axios';
import { ApiResponse, Tree, TreeFormData } from '../types';

// This would normally point to your backend API
const API_BASE_URL = 'https://api.example.com';

// Mock data for development
const MOCK_TREES: Tree[] = [
  {
    id: '1',
    name: 'Ancient Oak',
    species: 'Quercus robur',
    location: 'North Campus',
    description: 'A magnificent oak tree estimated to be over 200 years old. It provides shade for students and habitat for local wildlife.',
    imageUrl: 'https://images.unsplash.com/photo-1542202229-7d93c33f5d07',
    addedDate: '2023-10-15'
  },
  {
    id: '2',
    name: 'Japanese Maple',
    species: 'Acer palmatum',
    location: 'East Garden',
    description: 'Known for its stunning red foliage, this Japanese maple adds vibrant color to the garden throughout autumn.',
    imageUrl: 'https://images.unsplash.com/photo-1567641091594-13a9faa0f814',
    addedDate: '2023-11-02'
  },
  {
    id: '3',
    name: 'Weeping Willow',
    species: 'Salix babylonica',
    location: 'Lakeside',
    description: 'This graceful willow with its sweeping branches creates a peaceful atmosphere by the college lake.',
    imageUrl: 'https://images.unsplash.com/photo-1636680271758-1d4c155a6e8d',
    addedDate: '2023-09-28'
  },
  {
    id: '4',
    name: 'Silver Birch',
    species: 'Betula pendula',
    location: 'West Campus',
    description: 'Distinguished by its white bark, this birch tree stands in contrast to the surrounding vegetation.',
    imageUrl: 'https://images.unsplash.com/photo-1516214104703-d870798883c5',
    addedDate: '2024-01-12'
  },
  {
    id: '5',
    name: 'Coastal Redwood',
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
    // For development, return mock data
    // In production, uncomment the line below
    // const response = await api.get('/trees');
    // return { success: true, data: response.data };
    
    return { success: true, data: MOCK_TREES };
  } catch (error) {
    console.error('Error fetching trees:', error);
    return { success: false, error: 'Failed to fetch trees' };
  }
};

export const getTree = async (id: string): Promise<ApiResponse<Tree>> => {
  try {
    // For development, return mock data
    // In production, uncomment the line below
    // const response = await api.get(`/trees/${id}`);
    // return { success: true, data: response.data };
    
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
    // For file uploads, use FormData
    const formData = new FormData();
    Object.entries(treeData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as string | Blob);
      }
    });
    
    // In production, uncomment the line below
    // const response = await api.post('/trees', formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // });
    // return { success: true, data: response.data };
    
    // For development, simulate a successful response
    const newTree: Tree = {
      id: String(Date.now()),
      name: treeData.name,
      species: treeData.species,
      location: treeData.location,
      description: treeData.description,
      imageUrl: treeData.image ? URL.createObjectURL(treeData.image) : 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86',
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    return { success: true, data: newTree };
  } catch (error) {
    console.error('Error adding tree:', error);
    return { success: false, error: 'Failed to add tree' };
  }
};

export default api;
