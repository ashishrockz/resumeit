import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center min-h-[70vh] py-20 text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-6">Page Not Found</h2>
        <p className="text-muted-foreground mt-4 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-8">
          <Button size="lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;