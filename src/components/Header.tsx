"use client";

import { useApp } from "@/context/AppContext";
import { Sun, Moon, Compass, BookOpen, Heart, Menu, X, BookMarked } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const { activeTab, setActiveTab, theme, toggleTheme, selectedDate } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("Olá");
  const [formattedDate, setFormattedDate] = useState("");

  // Saudação automática e formatação da data baseada no selectedDate ou data real
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Bom dia ☀");
    else if (hour >= 12 && hour < 18) setGreeting("Boa tarde 🌤");
    else setGreeting("Boa noite 🌙");

    if (selectedDate) {
      const parts = selectedDate.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        const dateObj = new Date(year, month, day);
        
        const formatter = new Intl.DateTimeFormat("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        
        // Capitaliza a primeira letra do dia da semana
        const result = formatter.format(dateObj);
        setFormattedDate(result.charAt(0).toUpperCase() + result.slice(1));
      }
    }
  }, [selectedDate]);

  const menuItems = [
    { id: "diario", label: "Diário", icon: Compass },
    { id: "leitura", label: "Leitura", icon: BookOpen },
    { id: "estudos", label: "Estudos", icon: BookMarked },
    { id: "contato", label: "Pedido de Oração", icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 glass border-b border-border-subtle shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo e Nome da Igreja */}
          <div className="flex flex-col cursor-pointer justify-center" onClick={() => setActiveTab("diario")}>
            <h1 className="text-lg sm:text-xl font-bold font-serif text-soft-blue-500 dark:text-foreground leading-none tracking-tight">
              Fôlego
            </h1>
            <span className="hidden sm:inline text-[9px] text-gray-400 dark:text-gray-500 font-serif leading-none mt-1">
              O sopro da Palavra para sua vida.
            </span>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-soft-blue-50 dark:bg-soft-blue-600/10 text-soft-blue-500 border border-soft-blue-100 dark:border-soft-blue-500/20 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-soft-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/40 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-soft-blue-500" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Botões de Ação Direta */}
          <div className="flex items-center space-x-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-border-subtle transition-all duration-300"
              aria-label="Alternar Tema"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Menu Mobile Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Data e Saudação Sub-Header (apenas na Home/Diário) */}
        {activeTab === "diario" && (
          <div className="pb-4 pt-1 hidden sm:flex items-center justify-between border-t border-border-subtle/50 text-xs">
            <span className="text-gray-400 dark:text-gray-500 font-medium">
              {greeting}, hoje é <span className="text-soft-blue-500 font-semibold">{formattedDate}</span>
            </span>
            <span className="text-gray-300 dark:text-gray-600 font-serif italic">
              "Sua Palavra é verdade"
            </span>
          </div>
        )}
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-border-subtle animate-in fade-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {activeTab === "diario" && (
              <div className="px-3 py-2 text-xs border-b border-border-subtle/50 text-gray-400 dark:text-gray-500 font-medium mb-3">
                {greeting}, hoje é <span className="text-soft-blue-500 font-semibold">{formattedDate}</span>
              </div>
            )}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? "bg-soft-blue-50 dark:bg-soft-blue-600/10 text-soft-blue-500 border border-soft-blue-100 dark:border-soft-blue-500/20"
                      : "text-gray-500 dark:text-gray-400 hover:text-soft-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                  }`}
                >
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
