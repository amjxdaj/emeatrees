
import Layout from '@/components/Layout';
import TreesContainer from '@/components/TreesContainer';

const Index = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">
          Tree Collection
        </h1>
        <p className="text-muted-foreground">
          Explore and discover the diverse tree species at EMEA College
        </p>
      </div>
      
      <TreesContainer />
    </Layout>
  );
};

export default Index;
