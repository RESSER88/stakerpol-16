
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/utils/translations';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { user, isAdmin } = useSupabaseAuth();

  // Ensure mobile and desktop have identical navigation content
  const navigationItems = [
    { to: "/", label: t('home') },
    { to: "/products", label: t('electricTrolleys') },
    { to: "/testimonials", label: t('testimonials') },
    { to: "/contact", label: t('contact') },
    { to: "/faq", label: "FAQ" }
  ];

  const adminNavItem = user && isAdmin ? { to: "/admin", label: "Admin" } : null;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-toyota-orange tracking-tight">Stakerpol</span>
          </Link>

          {/* Desktop Navigation - Identical content to mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className="font-medium hover:text-toyota-orange transition-colors"
                onClick={() => {
                  // Auto-scroll to top when FAQ is clicked
                  if (item.to === '/faq') {
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
            {adminNavItem && (
              <Link 
                to={adminNavItem.to} 
                className="font-medium hover:text-toyota-orange transition-colors flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                {adminNavItem.label}
              </Link>
            )}
            <LanguageSwitcher />
            <Button className="cta-button" asChild>
              <a href="tel:+48694133592">
                <Phone className="mr-2 h-4 w-4" />
                +48 694 133 592
              </a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-toyota-orange transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Identical content to desktop */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-slide-in">
            <nav className="flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                className="font-medium py-2 hover:text-toyota-orange transition-colors touch-manipulation"
                onClick={() => {
                  setIsMenuOpen(false);
                  // Auto-scroll to top when FAQ is clicked
                  if (item.to === '/faq') {
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                  }
                }}
              >
                {item.label}
              </Link>
            ))}
              {adminNavItem && (
                <Link 
                  to={adminNavItem.to} 
                  className="font-medium py-2 hover:text-toyota-orange transition-colors flex items-center gap-2 touch-manipulation"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  {adminNavItem.label}
                </Link>
              )}
              <Button className="cta-button w-full touch-manipulation" asChild>
                <a href="tel:+48694133592">
                  <Phone className="mr-2 h-4 w-4" />
                  +48 694 133 592
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
