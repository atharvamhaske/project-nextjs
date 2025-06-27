"use client"

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import PricingSection from "./components/PricingSection";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import LoadingSpinner from "./components/LoadingSpinner";

interface UploadedFile {
  url: string;
  name: string;
  fileType: "Image" | "Video";
  size: number;
  uploadedAt: string;
  fileId?: string;
  thumbnailUrl?: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleUploadSuccess = (file: UploadedFile) => {
    setUploadedFiles(prev => [file, ...prev]); // Add new files at the beginning
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  // Loading state
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // Landing page for non-authenticated users
  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <Footer />
      </div>
    );
  }

  // Dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        isAuthenticated={true}
        userEmail={session.user?.email}
        onLogout={handleLogout}
      />
      <Dashboard 
        uploadedFiles={uploadedFiles}
        onUploadSuccess={handleUploadSuccess}
        onProgress={(progress) => {
          // Handle progress if needed
        }}
      />
    </div>
  );
}
