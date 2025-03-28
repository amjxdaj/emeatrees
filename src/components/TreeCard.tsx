
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tree } from '@/types';

interface TreeCardProps {
  tree: Tree;
}

const TreeCard = ({ tree }: TreeCardProps) => {
  return (
    <Link to={`/tree/${tree.id}`} className="block w-full">
      <Card className="tree-card transform transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg">
        <CardContent className="pt-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-xl font-semibold tracking-tight line-clamp-1">
              {tree.scientific_name}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-nature-100 text-nature-800">
              {tree.family}
            </span>
          </div>
          
          <div className="flex flex-col space-y-1 mb-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{tree.location}</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground mt-2">
            {tree.common_name_english && (
              <div><span className="font-medium">Common name:</span> {tree.common_name_english}</div>
            )}
            {tree.common_name_malayalam && (
              <div><span className="font-medium">Malayalam:</span> {tree.common_name_malayalam}</div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Info className="h-4 w-4" />
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TreeCard;
