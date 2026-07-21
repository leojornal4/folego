"use client";

import { useApp } from "@/context/AppContext";
import { CheckCircle2, ChevronLeft, ArrowLeft, Check, Award, Compass, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAuthenticBibleText } from "@/lib/bibleTexts";

export default function BibleReading() {
  const { leituraHoje, progressoLeitura, marcarLeituraConcluida, selectedDate, setActiveTab } = useApp();
  
  const [completedItems, setCompletedItems] = useState<{ [index: number]: boolean }>({});
  const [readerOpen, setReaderOpen] = useState(false);
  const [currentReadingText, setCurrentReadingText] = useState<string>("");
  const [currentReadingIndex, setCurrentReadingIndex] = useState<number>(-1);
  const [showCelebration, setShowCelebration] = useState(false);

  // Sincroniza com o progresso geral ao mudar a data ou carregar
  useEffect(() => {
    if (leituraHoje) {
      const initial: { [index: number]: boolean } = {};
      const dateCompleted = progressoLeitura[selectedDate] === true;
      
      leituraHoje.leituras.forEach((_, idx) => {
        initial[idx] = dateCompleted; // Se o dia todo está concluído, marca todos como concluídos
      });
      setCompletedItems(initial);
      setShowCelebration(dateCompleted);
    } else {
      setCompletedItems({});
      setShowCelebration(false);
    }
  }, [leituraHoje, selectedDate, progressoLeitura]);

  if (!leituraHoje) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-2xl text-gray-400">
          📖
        </div>
        <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-white">
          Nenhuma Leitura Programada
        </h3>
        <p className="text-sm text-gray-500">
          Não há plano de leitura cadastrado para o dia {selectedDate}. Escolha outra data no calendário ou cadastre no painel administrativo.
        </p>
        <button
          onClick={() => setActiveTab("diario")}
          className="mt-4 px-6 py-2.5 rounded-xl bg-soft-blue-500 text-white font-medium text-sm transition-all hover:bg-soft-blue-600"
        >
          Voltar para o Diário
        </button>
      </div>
    );
  }

  const handleToggleCheck = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita abrir o reader ao clicar no checkbox
    const updated = { ...completedItems, [idx]: !completedItems[idx] };
    setCompletedItems(updated);

    // Verifica se todos estão concluídos
    const allDone = leituraHoje.leituras.every((_, i) => updated[i] === true);
    if (allDone) {
      marcarLeituraConcluida(selectedDate, true);
      setShowCelebration(true);
    } else {
      marcarLeituraConcluida(selectedDate, false);
      setShowCelebration(false);
    }
  };

  const handleOpenReader = (leitura: string, idx: number) => {
    setCurrentReadingText(leitura);
    setCurrentReadingIndex(idx);
    setReaderOpen(true);
  };

  const handleCloseReader = () => {
    setReaderOpen(false);
  };

  const handleMarkCurrentAsReadAndClose = () => {
    if (currentReadingIndex !== -1) {
      const updated = { ...completedItems, [currentReadingIndex]: true };
      setCompletedItems(updated);
      
      const allDone = leituraHoje.leituras.every((_, i) => updated[i] === true);
      if (allDone) {
        marcarLeituraConcluida(selectedDate, true);
        setShowCelebration(true);
      }
      
      setReaderOpen(false);
    }
  };

  const readingData = getAuthenticBibleText(currentReadingText);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 relative">
      
      {/* Botão Voltar */}
      <button
        onClick={() => setActiveTab("diario")}
        className="flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-soft-blue-500 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao painel diário</span>
      </button>

      {/* Título e Progresso */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-soft-blue-500 uppercase tracking-widest">
          LEITURA DIÁRIA DO DIA
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-800 dark:text-white">
          Plano de Leitura
        </h2>
        <p className="text-sm text-gray-500">
          Complete os trechos propostos abaixo. Clique em cada card para ler o texto bíblico com tipografia focada em meditação.
        </p>
      </div>

      {/* Cards de Leitura */}
      <div className="space-y-4">
        {leituraHoje.leituras.map((leitura, idx) => {
          const isDone = completedItems[idx] === true;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleOpenReader(leitura, idx)}
              className={`p-5 rounded-2xl bg-card-bg border transition-all duration-300 flex items-center justify-between cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.01)] ${
                isDone
                  ? "border-green-200 dark:border-green-900/30 bg-green-500/[0.01] dark:bg-green-500/[0.005]"
                  : "border-border-subtle hover:border-soft-blue-200 dark:hover:border-border-subtle/80"
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Botão de Checkbox Interativo */}
                <button
                  onClick={(e) => handleToggleCheck(idx, e)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isDone
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 dark:border-gray-700 hover:border-soft-blue-500 text-transparent"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-serif text-gray-800 dark:text-white">
                    {leitura}
                  </h4>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                    {leituraHoje.trechoBiblico ? "Texto personalizado cadastrado" : "Texto Bíblico Completo"}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-soft-blue-500 font-semibold bg-soft-blue-50 dark:bg-soft-blue-900/20 px-3 py-1 rounded-xl">
                  Ler texto
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Banner de Parabéns com Animação */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 rounded-3xl bg-green-500/10 dark:bg-green-500/5 border border-green-200/50 dark:border-green-800/20 shadow-md text-center space-y-4 glow-green"
          >
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold font-serif text-green-700 dark:text-green-400">
                ✅ Parabéns!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Você concluiu toda a leitura programada para o dia de hoje.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab("diario")}
                className="px-6 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-xs transition-all shadow-sm"
              >
                Voltar ao Painel Diário
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leitor de Texto Bíblico Integrado (Slide-up / Modal Premium) */}
      <AnimatePresence>
        {readerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full sm:max-w-2xl bg-card-bg rounded-t-3xl sm:rounded-3xl border-t sm:border border-border-subtle shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] overflow-hidden"
            >
              {/* Reader Header */}
              <div className="p-5 border-b border-border-subtle/80 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📖</span>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-gray-800 dark:text-white">
                    {currentReadingText}
                  </h3>
                </div>
                <button
                  onClick={handleCloseReader}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Reader Body (Scripture text) */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 font-serif text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {leituraHoje.trechoBiblico ? (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-gold-500 border-b border-gold-200/25 pb-1 mb-2">
                      Leitura do Dia - Texto Bíblico
                    </h4>
                    {leituraHoje.trechoBiblico.split("\n").map((para, pIdx) => (
                      <p key={pIdx} className="indent-4 mb-3">
                        {para}
                      </p>
                    ))}
                  </div>
                ) : (
                  readingData.map((chapterData, cIdx) => (
                    <div key={cIdx} className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-gold-500 border-b border-gold-200/25 pb-1">
                        {chapterData.chapter}
                      </h4>
                      <div className="space-y-3">
                        {chapterData.verses.map((verse, vIdx) => (
                          <p key={vIdx} className="indent-4">
                            <sup className="text-[10px] font-bold text-soft-blue-500 mr-1.5 font-sans vertical-super">
                              {verse.v}
                            </sup>
                            {verse.text}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reader Footer */}
              <div className="p-5 border-t border-border-subtle bg-gray-50/50 dark:bg-gray-800/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                  Tipografia otimizada para leitura meditativa
                </span>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={handleCloseReader}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={handleMarkCurrentAsReadAndClose}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-soft-blue-500 hover:bg-soft-blue-600 text-white text-xs font-semibold transition-all hover:scale-[1.01]"
                  >
                    Marcar como lido
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
