
import React, { useState } from 'react';
import { uploadTreeImage } from '@/services/api';
import { ImageUploader } from '@/components';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface TreeImageProps {
  treeId: string;
  imageUrl?: string;
  onImageUploaded: () => void;
  pendingImage?: boolean;
}

const TreeImage = ({ treeId, imageUrl, onImageUploaded, pendingImage = false }: TreeImageProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelected = (file: File) => {
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemoved = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error('No image selected');
      return;
    }
    
    setUploading(true);
    
    try {
      console.log('Uploading image:', imageFile);
      console.log('For tree ID:', treeId);
      
      const response = await uploadTreeImage({
        treeId,
        image: imageFile
      });
      
      console.log('Upload response:', response);
      
      if (response.success) {
        toast.success('Image uploaded successfully');
        onImageUploaded();
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

  if (pendingImage && !imageFile) {
    return (
      <div className="aspect-video bg-muted/50 flex flex-col items-center justify-center p-6 rounded-xl overflow-hidden border border-border/60 mb-6 shadow-sm">
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
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageSelected(file);
          }}
        />
      </div>
    );
  }

  if (imageFile && imagePreview) {
    return (
      <div className="animate-fade-in mb-6">
        <div className="rounded-xl overflow-hidden border border-border/60 mb-6 shadow-sm">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-auto object-cover aspect-video"
          />
        </div>
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
              onClick={handleImageRemoved}
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
    );
  }

  if (imageUrl) {
    return (
      <div className="rounded-xl overflow-hidden border border-border/60 mb-6 shadow-sm animate-fade-in">
        <img 
          src={imageUrl} 
          alt="Tree" 
          className="w-full h-auto object-cover aspect-video"
        />
      </div>
    );
  }

  return (
    <ImageUploader 
      onImageSelected={handleImageSelected}
      onImageRemoved={handleImageRemoved}
      className="mb-6 rounded-xl overflow-hidden border border-border/60 shadow-sm"
    />
  );
};

export default TreeImage;
