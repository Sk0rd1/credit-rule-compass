
import React from "react";
import { CreditRulesProvider } from "@/contexts/CreditRulesContext";
import { RulesDashboard } from "@/components/credit-rules/RulesDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-gray-900">Система управління кредитними правилами</h1>
        </div>
      </header>
      
      <main className="container py-6">
        <CreditRulesProvider>
          <RulesDashboard />
        </CreditRulesProvider>
      </main>
      
      <footer className="bg-white border-t mt-auto">
        <div className="container py-4 text-center text-gray-500 text-sm">
          Credit Rule Compass © 2025
        </div>
      </footer>
    </div>
  );
};

export default Index;
