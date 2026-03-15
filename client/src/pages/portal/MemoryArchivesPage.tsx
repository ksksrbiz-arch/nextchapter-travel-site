import React, { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import MemoryArchives from "@/components/MemoryArchives";
import RebookingRecommendations from "@/components/RebookingRecommendations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Archive, Compass } from "lucide-react";

export default function MemoryArchivesPage() {
  const [activeTab, setActiveTab] = useState("archives");

  return (
    <PortalLayout
      title="Memory Archives & Rebooking"
      subtitle="Relive your favorite trips and discover your next adventure"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md">
          <TabsTrigger value="archives" className="flex items-center gap-2">
            <Archive className="w-4 h-4" />
            Archives
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="archives" className="mt-6">
          <MemoryArchives userId="user-123" />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <RebookingRecommendations baseMemoryId="mem-orlando-2024" />
        </TabsContent>
      </Tabs>
    </PortalLayout>
  );
}
