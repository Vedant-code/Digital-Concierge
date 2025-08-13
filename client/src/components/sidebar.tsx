import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AssetItem } from "@/components/asset-item";
import { type AssetCategory, type Asset } from "@shared/schema";
import { cn } from "@/lib/utils";

interface SidebarProps {
  categories: AssetCategory[];
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

export function Sidebar({ categories, isOpen, onClose, isLoading }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading: isSearching } = useQuery<Asset[]>({
    queryKey: ["/api/assets/search", { q: searchQuery }],
    enabled: searchQuery.length > 0,
  });

  const displayCategories = searchQuery ? 
    (searchResults ? [{ name: "Search Results", count: searchResults.length, items: searchResults }] : []) :
    categories;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "w-80 bg-white border-r border-gray-200 flex flex-col fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "hidden lg:flex"
      )}
      data-testid="sidebar-container">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-concierge-bell text-white text-lg"></i>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Digital Concierge</h1>
                <p className="text-sm text-neutral">AI Assistant</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
              data-testid="button-close-sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral" />
            <Input
              type="text"
              placeholder="Search assets..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-assets"
            />
          </div>
        </div>
        
        {/* Asset Categories */}
        <ScrollArea className="flex-1 p-6" data-testid="asset-categories">
          {isLoading || isSearching ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-20 bg-gray-100 rounded animate-pulse" />
                    <div className="h-20 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {displayCategories.map((category) => (
                <div key={category.name} className="space-y-3">
                  <h3 className="font-medium text-gray-900 flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="bg-gray-100 text-neutral text-xs px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </h3>
                  
                  <div className="space-y-2">
                    {category.items.map((asset) => (
                      <AssetItem 
                        key={asset.id} 
                        asset={asset}
                        data-testid={`asset-item-${asset.id}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
              
              {displayCategories.length === 0 && searchQuery && (
                <div className="text-center text-neutral py-8" data-testid="no-search-results">
                  <i className="fas fa-search text-2xl mb-2"></i>
                  <p>No assets found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
