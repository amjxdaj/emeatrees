
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { addPredefinedTrees } from '@/services/api';
import { toast } from 'sonner';
import { Trees, Check } from 'lucide-react';

interface AddPredefinedTreesProps {
  onSuccess?: () => void;
}

const AddPredefinedTrees = ({ onSuccess }: AddPredefinedTreesProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleAddPredefinedTrees = async () => {
    setLoading(true);
    
    try {
      const response = await addPredefinedTrees();
      
      if (response.success) {
        toast.success(`Added ${response.data?.length || 0} predefined trees successfully`);
        setSuccess(true);
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.error || 'Failed to add predefined trees');
      }
    } catch (error) {
      console.error('Error adding predefined trees:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="border border-border rounded-lg p-4 mb-6 bg-background">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Trees className="h-5 w-5 mr-2 text-nature-600" />
          <h3 className="font-medium">Add Predefined Trees</h3>
        </div>
        {success && (
          <span className="text-sm text-green-600 flex items-center">
            <Check className="h-4 w-4 mr-1" /> Added
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Add the list of predefined trees to your database. These trees include botanical information 
        like scientific names, families, and common names.
      </p>
      <Button 
        onClick={handleAddPredefinedTrees} 
        disabled={loading || success}
        variant={success ? "outline" : "default"}
        className="w-full"
      >
        {loading ? 'Adding Trees...' : success ? 'Trees Added' : 'Add All Predefined Trees'}
      </Button>
    </div>
  );
};

export default AddPredefinedTrees;
