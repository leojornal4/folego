"use client";

import { AppProvider, useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import DailyHub from "@/components/DailyHub";
import BibleReading from "@/components/BibleReading";
import ContactAndForms from "@/components/ContactAndForms";
import AdminDashboard from "@/components/AdminDashboard";
import ThematicStudies from "@/components/ThematicStudies";
import { BookOpen, Compass, Shield, Heart, BookMarked } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AppContent() {
  const { activeTab, setActiveTab } = useApp();

  // Renderiza a aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case "diario":
        return <DailyHub />;
      case "leitura":
        return <BibleReading />;
      case "estudos":
        return <ThematicStudies />;
      case "contato":
        return <ContactAndForms />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <DailyHub />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Cabeçalho Fixo */}
      <Header />

      {/* Conteúdo Principal com Transições */}
      <main className="flex-1 pb-16 sm:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Rodapé Premium */}
      <footer className="bg-gray-50 dark:bg-card border-t border-border-subtle/80 py-12 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Nome da Plataforma e Versículo */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-lg font-bold font-serif text-gold-500">📖</span>
              <h4 className="font-bold text-sm text-gray-800 dark:text-white font-serif">
                Fôlego
              </h4>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-serif leading-relaxed max-w-md">
              <span className="block italic">O sopro da Palavra para sua vida.</span>
              <span className="block text-[11px] mt-1 italic text-gray-400">"Lâmpada para os meus pés é a tua palavra e luz, para o meu caminho."</span>
              <span className="block mt-0.5 font-semibold text-gold-500">— Salmos 119:105</span>
            </p>
          </div>

          {/* Direitos, Redes Sociais e Acesso ao Painel */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 hover:text-soft-blue-500 transition-colors">
                IG
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 hover:text-soft-blue-500 transition-colors">
                YT
              </a>
            </div>
            <div className="flex items-center space-x-3 text-gray-400 dark:text-gray-500">
              <p className="text-[10px] text-center md:text-right">
                © 2026 Fôlego. Todos os direitos reservados.
              </p>
              <span>•</span>
              <button
                onClick={() => setActiveTab("admin")}
                className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-soft-blue-500 dark:hover:text-soft-blue-400 transition-colors cursor-pointer"
                title="Acesso Reservado ao Painel Administrativo"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Painel</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Navegação Rápida Flutuante / Bottom Navigation (Apenas em Mobile) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#16171d]/90 backdrop-blur-md border-t border-border-subtle/85 px-6 py-2 flex items-center justify-between text-[10px] font-bold">
        {[
          { id: "diario", label: "Diário", icon: Compass },
          { id: "leitura", label: "Leitura", icon: BookOpen },
          { id: "estudos", label: "Estudos", icon: BookMarked },
          { id: "contato", label: "Pedidos", icon: Heart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center space-y-1 ${
                isActive ? "text-soft-blue-500" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function RootPage() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
