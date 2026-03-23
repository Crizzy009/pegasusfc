import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="relative min-h-[600px] flex items-center justify-center text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${import.meta.env.BASE_URL}hero-bg.PNG')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-9xl font-bold mb-6 text-primary">404</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Page Not Found</h1>
          <p className="text-xl mb-8 text-gray-200">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
              className="bg-transparent border-white text-white hover:bg-white hover:text-secondary"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
