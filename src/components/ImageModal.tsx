
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal = ({ imageUrl, isOpen, onClose }: ImageModalProps) => {
  if (!isOpen) return null;
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-full max-h-full overflow-auto">
        <button
          className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        <img 
          src={imageUrl} 
          alt="Enlarged view" 
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
};

export default ImageModal;
