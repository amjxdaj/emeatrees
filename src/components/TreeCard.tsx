
import { Link, useNavigate } from 'react-router-dom';
import { Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tree } from '@/types';
import { useAdmin } from '@/contexts/AdminContext';
import { deleteTree } from '@/services/api';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TreeCardProps {
  tree: Tree;
  onDelete?: () => void;
}

const TreeCard = ({ tree, onDelete }: TreeCardProps) => {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await deleteTree(tree.id);
      if (response.success) {
        toast.success('Tree deleted successfully');
        if (onDelete) {
          onDelete();
        } else {
          navigate('/');
        }
      } else {
        toast.error(response.error || 'Failed to delete tree');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error deleting tree:', error);
    }
  };

  return (
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
      
      <CardFooter className="pt-0 pb-4 flex gap-2">
        <Link to={`/tree/${tree.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Info className="h-4 w-4" />
            View Details
          </Button>
        </Link>
        
        {isAdmin && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="px-3">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the tree
                  "{tree.scientific_name}" from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default TreeCard;
