
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingActionButton = () => {
  return (
    <Link to="/add-tree" className="fab">
      <Plus className="h-6 w-6" />
    </Link>
  );
};

export default FloatingActionButton;
