
import Layout from '@/components/Layout';
import TreesContainer from '@/components/TreesContainer';

const Index = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">
          EMEA College Tree Collection
        </h1>
        <p className="text-muted-foreground">
          Browse all tree species in the EMEA College campus. Click on any tree name to see detailed information.
        </p>
      </div>
      
      <TreesContainer />
    </Layout>
  );
};

export default Index;
