import { useState } from "react";
import { LanguageProvider } from "@/components/LanguageContext";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
// import FeedbackCarousel from "@/components/FeedbackCarousel";
import PurchaseForm from "@/components/PurchaseForm";
import Footer from "@/components/Footer";
import AdminDashboard from "@/components/AdminDashboard";

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);

  // Check if admin mode should be shown (you can add URL parameter check here)
  const isAdminMode = window.location.pathname === '/admin' || showAdmin;

  if (isAdminMode) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white text-black font-inter">
        <Header onAdminClick={() => setShowAdmin(true)} />
        <div className="py-12">
          <Hero />
        </div>
        <div className="py-12">
          <ProductSection />
        </div>
        {/* <div className="py-12">
          <FeedbackCarousel />
        </div> */}
        <div className="py-12">
          <PurchaseForm />
        </div>
        <div className="pt-16">
          <Footer />
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
