"use client";

import KnowledgeBaseManager from "@/components/KnowledgeBaseManager";
import AppNavigation from "@/components/AppNavigation";

export default function KnowledgePage() {
  return (
    <div className="bg-gray-900">
      <AppNavigation />
      <main className="lg:pl-64">
        <KnowledgeBaseManager />
      </main>
    </div>
  );
} 