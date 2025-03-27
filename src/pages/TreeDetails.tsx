import { useParams, Link } from 'react-router-dom';
import { useTreeDetails } from '@/hooks/useTreeData';
import { uploadTreeImage } from '@/services/api';
import Layout from '@/components/Layout';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { ArrowLeft, Calendar, MapPin, Globe, Flower, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { toast } from 'sonner';

const TreeDetails = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { tree, loading, error, refreshTree } = useTreeDetails(id);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Get the absolute URL for this page
  const currentUrl = `${window.location.origin}/tree/${id}`;
  
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
      
      setImageFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };
  
  const handleImageUpload = async () => {
    if (!imageFile || !id) {
      toast.error('No image selected');
      return;
    }
    
    setUploading(true);
    
    try {
      console.log('Uploading image:', imageFile);
      console.log('For tree ID:', id);
      
      const response = await uploadTreeImage({
        treeId: id,
        image: imageFile
      });
      
      console.log('Upload response:', response);
      
      if (response.success) {
        toast.success('Image uploaded successfully');
        refreshTree();
        setImageFile(null);
        setImagePreview(null);
      } else {
        toast.error(response.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };
  
  const needsImageUpload = tree && (tree.pendingImage || !tree.imageUrl || tree.imageUrl.includes('placeholder') || tree.imageUrl.includes('unsplash'));
  
  return (
    <Layout hideAddButton>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to trees
        </Link>
        
        {loading ? (
          <>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2" />
          </>
        ) : error ? (
          <h1 className="text-2xl font-display font-bold tracking-tight">
            Tree not found
          </h1>
        ) : tree ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold tracking-tight">
                  {tree.name}
                </h1>
                <p className="text-xl italic text-muted-foreground">
                  {tree.scientific_name}
                </p>
              </div>
              <Link to="/add-tree">
                <Button size="sm">Add Another Tree</Button>
              </Link>
            </div>
          </>
        ) : null}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-80 w-full rounded-xl mb-6" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-2" />
          </div>
          <div>
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-destructive mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2 className="text-xl font-medium">Something went wrong</h2>
          </div>
          <p className="text-muted-foreground">{error}</p>
          <Link to="/">
            <Button className="mt-6">
              Return to Homepage
            </Button>
          </Link>
        </div>
      ) : tree ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="rounded-xl overflow-hidden border border-border/60 mb-6 shadow-sm animate-fade-in">
              {needsImageUpload && !imagePreview ? (
                <div className="aspect-video bg-muted/50 flex flex-col items-center justify-center p-6">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No image has been uploaded yet</p>
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    Upload an image of this tree to help others identify it.
                  </p>
                  <Button 
                    onClick={() => document.getElementById('tree-image-upload')?.click()}
                    variant="outline"
                    className="mb-2"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Image
                  </Button>
                  <input
                    id="tree-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              ) : (
                <img 
                  src={imagePreview || tree.imageUrl} 
                  alt={tree.name} 
                  className="w-full h-auto object-cover aspect-video"
                />
              )}
            </div>
            
            {imageFile && imagePreview && (
              <div className="animate-fade-in mb-6">
                <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3 mb-3">
                  <div className="flex items-center">
                    <div className="bg-background rounded-md p-1 mr-3">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-12 w-12 object-cover rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{imageFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(imageFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleImageUpload}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mb-6 animate-fade-in delay-100">
              <div className="flex items-center bg-secondary/70 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
                <MapPin className="h-4 w-4 mr-2 text-nature-600" />
                {tree.location}
              </div>
              
              <div className="flex items-center bg-secondary/70 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
                <Flower className="h-4 w-4 mr-2 text-nature-600" />
                {tree.family}
              </div>
              
              {tree.native_range && (
                <div className="flex items-center bg-secondary/70 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
                  <Globe className="h-4 w-4 mr-2 text-nature-600" />
                  {tree.native_range}
                </div>
              )}
              
              <div className="flex items-center bg-secondary/70 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
                <Calendar className="h-4 w-4 mr-2 text-nature-600" />
                Added: {new Date(tree.addedDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="animate-fade-in delay-200 space-y-6">
              <div>
                <h2 className="text-xl font-display font-semibold mb-3">
                  Common Names
                </h2>
                <Separator className="mb-4" />
                <div className="space-y-2">
                  {tree.common_name_english && (
                    <div>
                      <span className="font-medium">English:</span> {tree.common_name_english}
                    </div>
                  )}
                  {tree.common_name_malayalam && (
                    <div>
                      <span className="font-medium">Malayalam:</span> {tree.common_name_malayalam}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-display font-semibold mb-3">
                  About this tree
                </h2>
                <Separator className="mb-4" />
                <p className="text-muted-foreground whitespace-pre-line">
                  {tree.description || "No description available for this tree."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in delay-300">
            <QRCodeGenerator 
              url={currentUrl}
              title="Tree QR Code"
            />
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">
                This QR code links directly to this tree's page. You can print this QR code and place it near the tree for easy access to information.
              </p>
              <p>
                When scanned, visitors will be taken directly to this page where they can learn more about {tree.name}.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </Layout>
  );
};

export default TreeDetails;
