import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-20"
      data-ocid="not_found.page"
    >
      <div className="animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Compass className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
          404
        </h1>
        <p className="font-display text-xl text-primary mb-2">
          Table Not Found
        </p>
        <p className="text-muted-foreground font-body max-w-sm mb-8">
          The page you're looking for has moved or doesn't exist. Let's get you
          back to discovering great restaurants.
        </p>
        <Button
          asChild
          size="lg"
          className="font-body font-medium"
          data-ocid="not_found.home_button"
        >
          <Link to="/">Back to Explore</Link>
        </Button>
      </div>
    </div>
  );
}
