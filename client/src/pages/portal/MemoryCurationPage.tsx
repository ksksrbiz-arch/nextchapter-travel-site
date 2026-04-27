import React, { lazy, Suspense, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import MemoryAlbums from "@/components/MemoryAlbums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Images, BookOpen } from "lucide-react";
import { GenericSkeleton } from "@/components/ui/skeletons";

const MemoryGallery = lazy(() => import("@/components/MemoryGallery"));

export default function MemoryCurationPage() {
  const tripId = "trip-123"; // In production, get from context
  const [activeTab, setActiveTab] = useState("gallery");

  return (
    <PortalLayout
      title="Memory Curation"
      subtitle="Organize photos, videos, and memories from your journey"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Images className="w-4 h-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="albums" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Albums
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <Suspense fallback={<GenericSkeleton lines={8} className="pt-4" />}>
            <MemoryGallery tripId={tripId} />
          </Suspense>
        </TabsContent>

        <TabsContent value="albums" className="mt-6">
          <MemoryAlbums tripId={tripId} />
        </TabsContent>
      </Tabs>
    </PortalLayout>
  );
}
