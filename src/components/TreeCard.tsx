
import { Link } from 'react-router-dom';
import { Info, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tree } from '@/types';

interface TreeCardProps {
  tree: Tree;
}

const TreeCard = ({ tree }: TreeCardProps) => {
  return (
    <div className="tree-card overflow-hidden">
      <div className="card-image-container">
        <img 
          src={tree.imageUrl} 
          alt={tree.name} 
          className="card-image"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm text-nature-800">
            {tree.species}
          </span>
        </div>
        {tree.pendingImage && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="text-white text-center p-3">
              <Upload className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm font-medium">Image needed</p>
              <p className="text-xs">Click to upload</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">
            {tree.name}
          </h3>
        </div>
        <div className="flex flex-col space-y-1 mb-3">
          <span className="text-sm italic">{tree.scientific_name}</span>
          <span className="text-sm text-muted-foreground">Family: {tree.family}</span>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{tree.location}</span>
            <span className="mx-2">•</span>
            <span>{new Date(tree.addedDate).toLocaleDateString()}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {tree.description || "No description available."}
        </p>
        <Link to={`/tree/${tree.id}`}>
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Info className="h-4 w-4" />
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TreeCard;
