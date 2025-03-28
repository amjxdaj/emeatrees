
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';

const FloatingActionButton = () => {
  const { isAdmin } = useAdmin();
  
  return (
    <Link to={isAdmin ? "/add-tree" : "/admin-login"} className="fab">
      <Plus className="h-6 w-6" />
    </Link>
  );
};

export default FloatingActionButton;
