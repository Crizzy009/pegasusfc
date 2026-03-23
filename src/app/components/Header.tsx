import { Link, useLocation } from "react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinksPrimary = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/programs", label: "Programs" },
  ];

  const navLinksSecondary = [
    { path: "/squad", label: "Squad" },
    { path: "/hall-of-fame", label: "Hall of Fame" },
    { path: "/media", label: "Media" },
    { path: "/stars-partners", label: "Stars & Partners" },
    { path: "/recruitment", label: "Trials" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white text-secondary shadow-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={`${import.meta.env.BASE_URL}pegasus-logo.jpeg`}
              alt="Pegasus Football Academy Logo"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src.endsWith("/pegasus-logo.jpeg")) {
                  img.src = `${import.meta.env.BASE_URL}pegasus-logo.jpg`;
                } else {
                  img.src = `${import.meta.env.BASE_URL}pegasus-logo.svg`;
                }
              }}
              className="w-12 h-12 object-contain"
            />
            <div className="md:hidden">
              <div className="font-bold text-lg leading-none">Pegasus</div>
              <div className="text-[10px] text-primary italic leading-none mt-1">Sports Academy</div>
            </div>
            <div className="hidden md:block">
              <div className="font-bold text-lg xl:text-xl leading-tight">Pegasus Sports Academy</div>
              <div className="text-xs text-primary italic">Conquer Our Opponents</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 whitespace-nowrap">
            {navLinksPrimary.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2 py-2 rounded transition-colors text-sm whitespace-nowrap ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`px-2 py-2 h-auto rounded text-sm whitespace-nowrap ${
                    ["/basketball", "/tennis", "/swimming"].includes(location.pathname)
                      ? "bg-primary text-white hover:bg-primary/90 hover:text-white"
                      : "hover:bg-primary/20"
                  }`}
                >
                  Sports
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/basketball" className="w-full">
                    Basketball
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tennis" className="w-full">
                    Lawn Tennis
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/swimming" className="w-full">
                    Swimming
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {navLinksSecondary.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2 py-2 rounded transition-colors text-sm whitespace-nowrap ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/programs">
              <Button className="bg-primary hover:bg-primary/90">
                Register Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-2">
            {[...navLinksPrimary, ...navLinksSecondary].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Sports
            </div>
            {[
              { path: "/basketball", label: "Basketball" },
              { path: "/tennis", label: "Lawn Tennis" },
              { path: "/swimming", label: "Swimming" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded transition-colors ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/programs" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90 mt-2">
                Register Now
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
