import { useState } from "react";
import { Home, Upload, Phone, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface SideNavigationProps {
  currentPage: 'home' | 'upload' | 'contact';
  onNavigateToHome: () => void;
  onNavigateToUpload: () => void;
  onNavigateToContact: () => void;
}

export function SideNavigation({ 
  currentPage, 
  onNavigateToHome, 
  onNavigateToUpload, 
  onNavigateToContact 
}: SideNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      onClick: onNavigateToHome,
      active: currentPage === 'home'
    },
    {
      id: 'upload',
      label: 'Image Analysis',
      icon: Upload,
      onClick: onNavigateToUpload,
      active: currentPage === 'upload'
    },
    {
      id: 'contact',
      label: 'Contact Us',
      icon: Phone,
      onClick: onNavigateToContact,
      active: currentPage === 'contact'
    }
  ];

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="fixed top-6 left-6 z-50 rounded-full w-12 h-12 bg-card/80 backdrop-blur-md border-2 border-border hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-foreground" />
        )}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Panel */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-card/95 backdrop-blur-md border-r border-border shadow-2xl z-40 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 pt-20">
          {/* Logo */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">IntelliVision</h2>
            <p className="text-sm text-muted-foreground">AI-Powered Image Insights</p>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  variant={item.active ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 h-12 rounded-2xl transition-all duration-300 hover:scale-105
                    ${item.active 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* Footer Info */}
          <Card className="mt-8 p-4 bg-accent/50 border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Final Year Project</p>
              <p className="text-sm font-medium text-foreground">LTCE - CSE AI & ML</p>
              <p className="text-xs text-muted-foreground mt-1">2024-2025</p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}