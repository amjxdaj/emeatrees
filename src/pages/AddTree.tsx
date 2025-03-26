
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTree } from '@/services/api';
import Layout from '@/components/Layout';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { TreeFormData, Tree } from '@/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Upload, X } from 'lucide-react';

const AddTree = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TreeFormData>({
    name: '',
    species: '',
    location: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [newTree, setNewTree] = useState<Tree | null>(null);
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, image: null }));
      setImagePreview(null);
    }
  };
  
  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Please enter the tree name');
      return;
    }
    
    if (!formData.species.trim()) {
      toast.error('Please enter the tree species');
      return;
    }
    
    if (!formData.location.trim()) {
      toast.error('Please enter the tree location');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await addTree(formData);
      
      if (response.success && response.data) {
        setNewTree(response.data);
        toast.success('Tree added successfully!');
      } else {
        toast.error(response.error || 'Failed to add tree');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    // Reset form and go back to tree list
    setNewTree(null);
    navigate('/');
  };
  
  // Get the absolute URL for the new tree
  const treeUrl = newTree ? `${window.location.origin}/tree/${newTree.id}` : '';
  
  return (
    <Layout hideAddButton>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">
          {newTree ? 'Tree Added' : 'Add New Tree'}
        </h1>
        <p className="text-muted-foreground">
          {newTree 
            ? 'Your tree has been added successfully.' 
            : 'Enter details about a tree to add it to the collection.'
          }
        </p>
      </div>
      
      {newTree ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          <div>
            <div className="glass-card p-6 rounded-xl mb-6">
              <h2 className="text-xl font-display font-semibold mb-4">
                Tree Information
              </h2>
              
              <div className="rounded-lg overflow-hidden mb-4 border border-border/60">
                <img 
                  src={newTree.imageUrl} 
                  alt={newTree.name} 
                  className="w-full h-auto object-cover aspect-video"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{newTree.name}</h3>
                  <p className="text-muted-foreground">{newTree.species}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-muted-foreground">{newTree.location}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-muted-foreground whitespace-pre-line">{newTree.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleReset} className="flex-1">
                Back to Trees
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setNewTree(null)} 
                className="flex-1"
              >
                Add Another Tree
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col">
            <QRCodeGenerator 
              url={treeUrl}
              title="Tree QR Code"
            />
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">
                This QR code links directly to your newly added tree's page. Print this QR code and place it near the tree for easy access to information.
              </p>
              <p>
                When scanned, visitors will be taken directly to a page where they can learn more about {newTree.name}.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Tree Name</Label>
              <input
                id="name"
                name="name"
                type="text"
                className="input-field mt-1.5"
                placeholder="e.g., Ancient Oak"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="species">Species</Label>
              <input
                id="species"
                name="species"
                type="text"
                className="input-field mt-1.5"
                placeholder="e.g., Quercus robur"
                value={formData.species}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <input
                id="location"
                name="location"
                type="text"
                className="input-field mt-1.5"
                placeholder="e.g., North Campus"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                className="input-field mt-1.5 min-h-[120px] resize-y"
                placeholder="Describe the tree, its characteristics, history, etc."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label>Tree Image</Label>
              <div className="mt-1.5">
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img 
                      src={imagePreview} 
                      alt="Tree preview" 
                      className="w-full h-auto aspect-video object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">Upload tree image</p>
                    <p className="text-xs text-muted-foreground mb-4">PNG, JPG or JPEG (max. 5MB)</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Select Image
                    </Button>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Adding Tree...' : 'Add Tree'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Layout>
  );
};

export default AddTree;
