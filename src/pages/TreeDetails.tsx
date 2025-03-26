
import { useParams, Link } from 'react-router-dom';
import { useTreeDetails } from '@/hooks/useTreeData';
import Layout from '@/components/Layout';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const TreeDetails = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { tree, loading, error } = useTreeDetails(id);
  
  // Get the absolute URL for this page
  const currentUrl = `${window.location.origin}/tree/${id}`;
  
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
                <p className="text-xl text-muted-foreground">
                  {tree.species}
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
              <img 
                src={tree.imageUrl} 
                alt={tree.name} 
                className="w-full h-auto object-cover aspect-video"
              />
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6 animate-fade-in delay-100">
              <div className="flex items-center bg-secondary/70 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
                <MapPin className="h-4 w-4 mr-2 text-nature-600" />
                {tree.location}
              </div>
              
              <div className="flex items-center bg-secondary/70 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
                <Calendar className="h-4 w-4 mr-2 text-nature-600" />
                Added: {new Date(tree.addedDate).toLocaleDateString()}
              </div>
            </div>
            
            <div className="animate-fade-in delay-200">
              <h2 className="text-xl font-display font-semibold mb-3">
                About this tree
              </h2>
              <Separator className="mb-4" />
              <p className="text-muted-foreground whitespace-pre-line">
                {tree.description}
              </p>
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
