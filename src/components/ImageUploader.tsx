
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  onImageRemoved: () => void;
  className?: string;
  maxSize?: number; // in MB
  imagePreview?: string | null;
}

const ImageUploader = ({
  onImageSelected,
  onImageRemoved,
  className = '',
  maxSize = 5, // default 5MB
  imagePreview = null
}: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(imagePreview);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (limit to maxSize MB)
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`Image size should be less than ${maxSize}MB`);
        return;
      }
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Call the callback
      onImageSelected(file);
    }
  };
  
  const removeImage = () => {
    setPreview(null);
    onImageRemoved();
  };
  
  return (
    <div className={className}>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-border">
          <img 
            src={preview} 
            alt="Image preview" 
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
          <p className="text-sm font-medium mb-1">Upload image</p>
          <p className="text-xs text-muted-foreground mb-4">PNG, JPG or JPEG (max. {maxSize}MB)</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image-uploader-input')?.click()}
          >
            Select Image
          </Button>
          <input
            id="image-uploader-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
