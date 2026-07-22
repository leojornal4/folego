"use client";

import { useApp } from "@/context/AppContext";
import { EstudoTematico, Licao } from "@/lib/mockData";
import { getAuthenticBibleText } from "@/lib/bibleTexts";
import { ArrowLeft, BookOpen, Check, Compass, Shield, Award, Heart, MessageSquare, BookMarked, HelpCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThematicStudies() {
  const { estudosTematicos, progressoEstudos, marcarLicaoConcluida, setActiveTab } = useApp();
  const [selectedTheme, setSelectedTheme] = useState<EstudoTematico | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Licao | null>(null);

  // Mapeamento dinâmico de ícones Lucide por nome
  const getIcon = (name: string) => {
    switch (name) {
      case "Compass":
        return <Compass className="w-6 h-6 text-soft-blue-500" />;
      case "Shield":
        return <Shield className="w-6 h-6 text-soft-blue-500" />;
      default:
        return <BookMarked className="w-6 h-6 text-soft-blue-500" />;
    }
  };

  // Calcula o progresso de um tema específico (porcentagem de lições concluídas)
  const getThemeProgress = (theme: EstudoTematico) => {
    if (theme.licoes.length === 0) return 0;
    const completedCount = theme.licoes.filter(l => progressoEstudos[l.id] === true).length;
    return Math.round((completedCount / theme.licoes.length) * 100);
  };

  const handleBackToThemes = () => {
    setSelectedTheme(null);
    setSelectedLesson(null);
  };

  const handleBackToThemeDetail = () => {
    setSelectedLesson(null);
  };

  // Se uma lição específica estiver aberta
  if (selectedLesson && selectedTheme) {
    const isLessonCompleted = progressoEstudos[selectedLesson.id] === true;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative">
        {/* Botão Voltar */}
        <button
          onClick={handleBackToThemeDetail}
          className="flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-soft-blue-500 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Tema</span>
        </button>

        {/* Cabeçalho da Lição */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-gold-500 uppercase tracking-widest bg-gold-500/10 px-3 py-1 rounded-full">
            Lição — {selectedTheme.titulo}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-800 dark:text-white">
            {selectedLesson.titulo}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 italic border-l-2 border-soft-blue-500 pl-4 font-serif">
            "{selectedLesson.introducao}"
          </p>
        </div>

        {/* Conteúdo Principal (Tipografia Premium) */}
        <div 
          className="font-serif text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 space-y-6"
          dangerouslySetInnerHTML={{ __html: selectedLesson.conteudo }}
        />

        {/* Passagens Bíblicas Chave (Totalmente Integradas) */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-serif text-gray-800 dark:text-white flex items-center space-x-2 border-b border-border-subtle/60 pb-2">
            <BookOpen className="w-5 h-5 text-soft-blue-500" />
            <span>Versículos para Meditação</span>
          </h3>
          <div className="grid gap-4">
            {selectedLesson.passagens.map((ref) => {
              const verses = getAuthenticBibleText(ref);
              return (
                <div key={ref} className="p-5 rounded-2xl bg-gray-50 dark:bg-card border border-border-subtle/80 space-y-3">
                  <span className="text-xs font-bold text-soft-blue-500 uppercase tracking-wider">
                    {ref}
                  </span>
                  <div className="space-y-2 font-serif text-sm sm:text-base text-gray-600 dark:text-gray-400 italic">
                    {verses.map((chapterData) => 
                      chapterData.verses.map((v) => (
                        <p key={v.v} className="indent-2">
                          <sup className="text-[9px] font-bold text-soft-blue-400 mr-1.5 font-sans vertical-super">
                            {v.v}
                          </sup>
                          {v.text}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Perguntas de Reflexão */}
        {selectedLesson.reflexao && selectedLesson.reflexao.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold font-serif text-gray-800 dark:text-white flex items-center space-x-2 border-b border-border-subtle/60 pb-2">
              <HelpCircle className="w-5 h-5 text-soft-blue-500" />
              <span>Perguntas para Reflexão</span>
            </h3>
            <div className="space-y-4">
              {selectedLesson.reflexao.map((pergunta, pIdx) => (
                <div key={pIdx} className="p-5 rounded-2xl bg-card-bg border border-border-subtle shadow-sm space-y-3">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {pIdx + 1}. {pergunta}
                  </p>
                  <textarea
                    placeholder="Escreva suas reflexões pessoais aqui (salvo apenas no seu dispositivo)..."
                    className="w-full p-3.5 text-xs rounded-xl bg-gray-50/40 dark:bg-gray-800/40 border border-border-subtle focus:border-soft-blue-500 focus:outline-none transition-colors text-gray-900 dark:text-white resize-y min-h-[80px]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Guia de Oração Temática */}
        <div className="p-6 rounded-2xl bg-gold-500/[0.03] dark:bg-gold-500/[0.01] border border-gold-500/20 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-gold-500 text-6xl font-serif">
            🙏
          </div>
          <span className="text-xs font-bold text-gold-500 uppercase tracking-widest flex items-center space-x-1">
            <span>Oração Dirigida</span>
          </span>
          <p className="font-serif text-sm sm:text-base text-gray-700 dark:text-gray-300 italic leading-relaxed">
            "{selectedLesson.oracao}"
          </p>
        </div>

        {/* Botão de Conclusão da Lição */}
        <div className="pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
            Conclua a lição para registrar seu progresso no tema.
          </span>
          <button
            onClick={() => marcarLicaoConcluida(selectedLesson.id, !isLessonCompleted)}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              isLessonCompleted
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-soft-blue-500 hover:bg-soft-blue-600 text-white"
            }`}
          >
            {isLessonCompleted ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Lição Concluída!</span>
              </>
            ) : (
              <span>Marcar como Concluída</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Se um tema específico estiver aberto (Listagem de lições do tema)
  if (selectedTheme) {
    const progress = getThemeProgress(selectedTheme);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Botão Voltar */}
        <button
          onClick={handleBackToThemes}
          className="flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-soft-blue-500 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos Estudos</span>
        </button>

        {/* Hero do Tema */}
        <div className="relative rounded-3xl overflow-hidden border border-border-subtle/80 shadow-lg min-h-[220px] flex flex-col justify-end p-6 sm:p-8">
          {/* Background Image overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${selectedTheme.imagemUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/20" />

          {/* Info */}
          <div className="relative z-10 space-y-3">
            <span className="text-[10px] font-bold text-soft-blue-400 uppercase tracking-widest bg-soft-blue-500/10 px-3 py-1 rounded-full border border-soft-blue-500/20">
              {selectedTheme.categoria}
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white leading-tight">
              {selectedTheme.titulo}
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 max-w-xl">
              {selectedTheme.descricao}
            </p>

            {/* Barra de Progresso do Tema */}
            <div className="pt-2 max-w-md">
              <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-wider mb-1">
                <span>Progresso</span>
                <span>{progress}% Concluído</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-soft-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Listagem das Lições */}
        <div className="space-y-4">
          <h3 className="text-base font-bold font-serif text-gray-800 dark:text-white uppercase tracking-wider">
            Grade de Lições ({selectedTheme.licoes.length})
          </h3>
          <div className="grid gap-4">
            {selectedTheme.licoes.map((licao, index) => {
              const isCompleted = progressoEstudos[licao.id] === true;
              return (
                <motion.div
                  key={licao.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedLesson(licao)}
                  className={`p-5 rounded-2xl bg-card-bg border transition-all duration-300 flex items-center justify-between cursor-pointer shadow-sm ${
                    isCompleted
                      ? "border-green-200 dark:border-green-950/40 bg-green-500/[0.01]"
                      : "border-border-subtle hover:border-soft-blue-200 dark:hover:border-border-subtle/85"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {/* Indicador de Status */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                      isCompleted 
                        ? "bg-green-500 text-white" 
                        : "bg-gray-150 dark:bg-gray-800 text-gray-500 border border-border-subtle"
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold font-serif text-gray-800 dark:text-white">
                        {licao.titulo}
                      </h4>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 max-w-lg truncate">
                        {licao.introducao}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-soft-blue-500 uppercase tracking-widest bg-soft-blue-50 dark:bg-soft-blue-950/30 px-3 py-1 rounded-lg">
                      Iniciar
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Principal (Catálogo de Estudos Temáticos)
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Cabeçalho */}
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold text-soft-blue-500 uppercase tracking-widest flex items-center justify-center space-x-1">
          <BookOpen className="w-4 h-4" />
          <span>JORNADA DE ESTUDOS</span>
        </span>
        <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">
          Estudos Temáticos
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Participe de estudos bíblicos focados em temas essenciais para sua caminhada cristã diária. Desenvolva sua fé no seu próprio ritmo.
        </p>
      </div>

      {/* Grid de Cards de Estudo */}
      <div className="grid sm:grid-cols-2 gap-6 pt-4">
        {estudosTematicos.map((theme) => {
          const progress = getThemeProgress(theme);
          return (
            <motion.div
              key={theme.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedTheme(theme)}
              className="group rounded-3xl bg-card-bg border border-border-subtle shadow-sm overflow-hidden flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-md"
            >
              {/* Imagem de Capa */}
              <div className="h-44 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${theme.imagemUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Ícone Flutuante */}
                <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 dark:bg-gray-900/90 rounded-2xl flex items-center justify-center shadow-md">
                  {getIcon(theme.ico)}
                </div>

                {/* Categoria */}
                <span className="absolute bottom-4 right-4 text-[10px] font-bold text-white uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  {theme.categoria}
                </span>
              </div>

              {/* Informações e Progresso */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-card-bg">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-serif text-gray-800 dark:text-white group-hover:text-soft-blue-500 transition-colors">
                    {theme.titulo}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {theme.descricao}
                  </p>
                </div>

                {/* Progresso */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    <span>{theme.licoes.length} Lições</span>
                    <span>{progress}% Concluído</span>
                  </div>

                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 rounded-full ${
                        progress === 100 ? "bg-green-500" : "bg-soft-blue-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Banner de Incentivo */}
      <div className="p-6 rounded-3xl bg-gray-55/40 dark:bg-gray-800/10 border border-border-subtle/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
            📖 Procurando mais temas?
          </h4>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Pastores e líderes podem cadastrar novas leituras e devocionais dinâmicos no Painel de Controle.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("diario")}
          className="px-5 py-2.5 rounded-xl bg-soft-blue-50 dark:bg-soft-blue-900/10 text-soft-blue-500 font-semibold text-xs border border-soft-blue-100 dark:border-soft-blue-500/20 hover:bg-soft-blue-100 transition-all cursor-pointer"
        >
          Ir para a Leitura Diária
        </button>
      </div>
    </div>
  );
}
