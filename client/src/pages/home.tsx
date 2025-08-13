import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { type AssetCategory } from "@shared/schema";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: assetCategories, isLoading } = useQuery<AssetCategory[]>({
    queryKey: ["/api/assets"],
  });

  return (
    <div className="min-h-screen flex bg-secondary" data-testid="home-page">
      <Sidebar 
        categories={assetCategories || []} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLoading={isLoading}
        data-testid="sidebar"
      />
      
      <div className="flex-1 flex flex-col">
        <ChatInterface 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          data-testid="chat-interface"
        />
      </div>
    </div>
  );
}
