"use client";

import { useApp } from "@/context/AppContext";
import { Users, Mail, Bookmark, Compass, Eye, Heart, Calendar } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChurchInfo() {
  const { pastores, ministerios } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<"quem-somos" | "ministerios" | "pastores">("quem-somos");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Cabeçalho da Seção */}
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold text-soft-blue-500 uppercase tracking-widest">
          CONHEÇA NOSSA IGREJA
        </span>
        <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">
          A Catedral da Graça
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Somos uma comunidade cristã acolhedora e bíblica, comprometida em amar a Deus, uns aos outros e servir a nossa cidade.
        </p>
      </div>

      {/* Sub-Navegação de Categorias */}
      <div className="flex justify-center border-b border-border-subtle">
        <div className="flex space-x-6 overflow-x-auto pb-px">
          {(["quem-somos", "ministerios", "pastores"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-3 text-sm font-medium border-b-2 transition-all capitalize whitespace-nowrap px-1 ${
                activeSubTab === tab
                  ? "border-soft-blue-500 text-soft-blue-500 font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab === "quem-somos" ? "Quem Somos" : tab === "ministerios" ? "Ministérios" : "Nossos Pastores"}
            </button>
          ))}
        </div>
      </div>

      {/* Renderização de Conteúdo */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* 1. QUEM SOMOS */}
          {activeSubTab === "quem-somos" && (
            <motion.div
              key="quem-somos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10 max-w-4xl mx-auto"
            >
              {/* História */}
              <div className="space-y-4 text-center sm:text-left bg-card-bg p-6 sm:p-10 rounded-3xl border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-800 dark:text-white border-b border-border-subtle pb-3">
                  Nossa História
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-serif leading-relaxed">
                  Fundada em 1996 por um pequeno grupo de famílias dedicadas à oração e ao estudo da palavra de Deus, a Catedral da Graça nasceu com a missão de ser um farol de luz espiritual e assistência comunitária em nossa cidade. Ao longo das décadas, fomos testemunhas da fidelidade do Senhor em cada passo do nosso caminho. 
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-serif leading-relaxed">
                  Hoje, somos uma comunidade viva, vibrante e multicultural de discípulos que procuram refletir o caráter de Cristo em todas as áreas da vida. Acreditamos que a verdade de Deus liberta e o amor constrói pontes.
                </p>
              </div>

              {/* Visão, Missão, Valores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Missão */}
                <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.01)] text-center space-y-3">
                  <div className="w-12 h-12 bg-soft-blue-50 dark:bg-soft-blue-900/10 rounded-2xl flex items-center justify-center text-soft-blue-500 mx-auto glow-blue">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-gray-800 dark:text-white font-serif">
                    Missão
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-serif">
                    Glorificar a Deus por meio de vidas transformadas pelo evangelho, plantando igrejas e capacitando crentes ao discipulado contínuo.
                  </p>
                </div>

                {/* Visão */}
                <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.01)] text-center space-y-3">
                  <div className="w-12 h-12 bg-gold-50 dark:bg-gold-500/10 rounded-2xl flex items-center justify-center text-gold-500 mx-auto glow-gold">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-gray-800 dark:text-white font-serif">
                    Visão
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-serif">
                    Ser uma igreja relevante na sociedade, acolhedora na comunhão e profunda na fidelidade doutrinária e no amor ao próximo.
                  </p>
                </div>

                {/* Valores */}
                <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.01)] text-center space-y-3">
                  <div className="w-12 h-12 bg-soft-blue-50 dark:bg-soft-blue-900/10 rounded-2xl flex items-center justify-center text-soft-blue-500 mx-auto glow-blue">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-gray-800 dark:text-white font-serif">
                    Valores
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-serif">
                    Centralidade da Palavra de Deus, Oração constante, Amor sacrificial, Transparência, Excelência no servir e Comunhão fraternal.
                  </p>
                </div>

              </div>
            </motion.div>
          )}

          {/* 2. MINISTÉRIOS */}
          {activeSubTab === "ministerios" && (
            <motion.div
              key="ministerios"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {ministerios.map((min) => (
                <div
                  key={min.id}
                  className="rounded-3xl border border-border-subtle bg-card-bg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-md transition-all duration-300 flex flex-col group h-full"
                >
                  <div className="h-36 w-full overflow-hidden relative">
                    <img
                      src={min.imagemUrl}
                      alt={min.nome}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h4 className="text-sm sm:text-base font-bold font-serif text-gray-800 dark:text-white">
                        {min.nome}
                      </h4>
                      <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                        {min.descricao}
                      </p>
                    </div>
                    <button className="mt-4 w-full text-center py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-soft-blue-50 dark:hover:bg-soft-blue-600/10 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-soft-blue-500 transition-colors">
                      Falar com Líder / Envolver-se
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 3. PASTORES */}
          {activeSubTab === "pastores" && (
            <motion.div
              key="pastores"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            >
              {pastores.map((pastor) => (
                <div
                  key={pastor.id}
                  className="p-6 rounded-3xl border border-border-subtle bg-card-bg shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col items-center text-center space-y-4 group"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-soft-blue-100 dark:border-border-subtle group-hover:border-gold-500 transition-colors duration-300 shadow-md">
                    <img
                      src={pastor.imagemUrl}
                      alt={pastor.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-base sm:text-lg font-bold font-serif text-gray-800 dark:text-white">
                      {pastor.nome}
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-gold-500 tracking-wider">
                      {pastor.cargo}
                    </span>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed font-serif italic mt-2.5 px-2">
                      "{pastor.bio}"
                    </p>
                  </div>

                  <a
                    href={`mailto:${pastor.contato}`}
                    className="flex items-center space-x-1.5 text-xs text-soft-blue-500 font-semibold pt-2 hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contatar Líder</span>
                  </a>
                </div>
              ))}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
