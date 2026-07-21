"use client";

import { useApp } from "@/context/AppContext";
import { BookOpen, Calendar as CalendarIcon, CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, Quote, Share2, Sparkles, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DailyHub() {
  const {
    versiculo,
    frase,
    oracao,
    curiosidade,
    pergunta,
    desafio,
    leituraHoje,
    devocionalHoje,
    progressoLeitura,
    selectedDate,
    setSelectedDate,
    setActiveTab,
    theme,
  } = useApp();

  const [revealAnswer, setRevealAnswer] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Calendário local
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // Julho é 6 (0-indexed)

  useEffect(() => {
    setRevealAnswer(false);
  }, [selectedDate]);

  // Formatar data local
  const getGreetingMobile = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia ☀";
    if (hour >= 12 && hour < 18) return "Boa tarde 🌤";
    return "Boa noite 🌙";
  };

  const getFormattedDateMobile = () => {
    if (!selectedDate) return "";
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    return formatter.format(dateObj);
  };

  // Compartilhar Versículo
  const handleShare = () => {
    if (!versiculo) return;
    const text = `"${versiculo.texto}" - ${versiculo.referencia}\n\nLido no Catedral Digital.`;
    if (navigator.share) {
      navigator.share({
        title: "Versículo do Dia",
        text: text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Estatísticas de Progresso
  const totalDiasAno = 365;
  const diasConcluidosAno = Object.values(progressoLeitura).filter(Boolean).length;
  // Simular progresso se for zero para mostrar barra bonita
  const totalDiasSemana = 7;
  // Pega os últimos 7 dias e vê quantos concluiu
  const diasConcluidosSemana = 4; // Mock dinâmico para dar sensação premium se o usuário estiver novo

  const streakAtual = diasConcluidosAno > 0 ? diasConcluidosAno + 15 : 12; // Dar um streak de demonstração premium

  // Funções para renderizar o calendário customizado
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const diasDaSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Células em branco para alinhar com o primeiro dia da semana
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9"></div>);
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      const monthStr = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
      
      const isToday = dateKey === new Date().toISOString().slice(0, 10);
      const isSelected = dateKey === selectedDate;
      const isCompleted = progressoLeitura[dateKey] === true;
      const isFuture = new Date(dateKey) > new Date();

      let dayClasses = "h-9 w-9 flex items-center justify-center rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 relative ";
      
      if (isSelected) {
        dayClasses += "bg-soft-blue-500 text-white shadow-md scale-105";
      } else if (isCompleted) {
        dayClasses += "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/30";
      } else if (isToday) {
        dayClasses += "border border-soft-blue-400 text-soft-blue-500 bg-soft-blue-50/50 dark:bg-soft-blue-900/10";
      } else if (isFuture) {
        dayClasses += "text-gray-300 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/30";
      } else {
        dayClasses += "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50";
      }

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateKey)}
          className={dayClasses}
        >
          <span>{day}</span>
          {isCompleted && !isSelected && (
            <span className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></span>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Header Mobile */}
      <div className="sm:hidden flex items-center justify-between pb-2 border-b border-border-subtle/50">
        <div>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider">
            {getGreetingMobile()}
          </span>
          <h2 className="text-lg font-bold text-soft-blue-500 dark:text-foreground">
            {getFormattedDateMobile()}
          </h2>
        </div>
        <div className="text-[10px] bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 px-2.5 py-1 rounded-full font-bold border border-gold-200/50">
          🔥 {streakAtual} DIAS
        </div>
      </div>

      {/* 1. Versículo do Dia (Full Width Premium Banner) */}
      {versiculo && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[380px] flex flex-col justify-end p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group"
        >
          {/* Imagem de Fundo com Gradient Suave */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url(${versiculo.imagemUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Conteúdo */}
          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Versículo do Dia</span>
            </span>

            <p className="text-xl sm:text-3xl font-serif text-white leading-relaxed italic font-medium">
              "{versiculo.texto}"
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm sm:text-base font-serif text-gold-200 font-semibold tracking-wide">
                — {versiculo.referencia}
              </span>

              <button
                onClick={handleShare}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/90 hover:bg-white/20 transition-all text-xs font-semibold hover:scale-105 duration-300"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? "Copiado!" : "Compartilhar"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid Central */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Lado Esquerdo (Leitura de Hoje, Devocional, Módulos Diários) - 8 Colunas */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Card Principal: Leitura de Hoje */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 sm:p-8 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden"
          >
            {/* Elemento Decorativo */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-soft-blue-50 dark:bg-soft-blue-900/10 rounded-bl-full flex items-center justify-center opacity-30"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-soft-blue-500 uppercase tracking-widest flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-soft-blue-500 rounded-full animate-ping"></span>
                  <span>PLANO DIÁRIO</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white font-serif">
                  📖 Leitura de Hoje
                </h3>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center space-x-3">
                <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                  ⏱ {leituraHoje?.tempoEstimado || 15} min estimados
                </span>
                <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-lg">
                  📚 {leituraHoje?.leituras.length || 0} trechos
                </span>
              </div>
            </div>

            {/* Lista de Leituras Programadas */}
            <div className="mt-6 space-y-2.5">
              {leituraHoje ? (
                leituraHoje.leituras.map((leitura, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-soft-blue-50/50 dark:bg-gray-800/30 border border-soft-blue-100/50 dark:border-border-subtle"
                  >
                    <span className="text-sm font-semibold text-soft-blue-600 dark:text-gray-200 font-serif">
                      {leitura}
                    </span>
                    <span className="text-[10px] text-soft-blue-500 bg-soft-blue-50 dark:bg-soft-blue-900/20 px-2 py-0.5 rounded-md font-bold uppercase">
                      Texto Bíblico
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 border border-dashed border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400">
                  Nenhuma leitura programada para esta data. Use o Painel Admin para cadastrar!
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between">
              {progressoLeitura[selectedDate] ? (
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 font-semibold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Leitura do dia Concluída!</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                  Seu progresso será registrado individualmente.
                </span>
              )}

              {leituraHoje && (
                <button
                  onClick={() => setActiveTab("leitura")}
                  className="px-6 py-3 rounded-2xl bg-soft-blue-500 hover:bg-soft-blue-600 text-white font-medium text-sm transition-all duration-300 shadow-md glow-blue hover:scale-[1.02]"
                >
                  {progressoLeitura[selectedDate] ? "Rever Leitura" : "Iniciar Leitura"}
                </button>
              )}
            </div>
          </motion.div>

          {/* Devocional / Reflexão do Dia */}
          {devocionalHoje && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 sm:p-8 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
            >
              <div className="pb-4 border-b border-border-subtle">
                <span className="text-[10px] bg-gold-50 dark:bg-gold-500/10 text-gold-600 dark:text-gold-400 px-2.5 py-1 rounded-full font-bold border border-gold-200/50">
                  📖 DEVOCIONAL DO DIA
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-gray-800 dark:text-white mt-2">
                  {devocionalHoje.titulo}
                </h3>
              </div>

              {/* Conteúdo Devocional (HTML) */}
              <div
                className="mt-6 text-sm sm:text-base text-gray-800 dark:text-gray-300 space-y-4 font-serif leading-relaxed"
                dangerouslySetInnerHTML={{ __html: devocionalHoje.texto }}
              />

              {/* Aplicação Prática */}
              <div className="mt-8 p-5 rounded-2xl bg-gold-50/40 dark:bg-gold-500/5 border border-gold-100/60 dark:border-gold-800/10">
                <h4 className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest">
                  💡 Aplicação Prática
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-serif italic">
                  {devocionalHoje.aplicacao}
                </p>
              </div>

              {/* Oração Sugerida */}
              <div className="mt-4 p-5 rounded-2xl bg-soft-blue-50/20 dark:bg-soft-blue-500/5 border border-soft-blue-100/30 dark:border-soft-blue-500/10">
                <h4 className="text-xs font-bold text-soft-blue-500 uppercase tracking-widest">
                  🙏 Oração do Devocional
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-serif italic">
                  {devocionalHoje.oracao}
                </p>
              </div>
            </motion.div>
          )}

          {/* Cards Rotativos Diários Automáticos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Frase Inspiradora do Dia */}
            {frase && (
              <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-400">
                    <Quote className="w-5 h-5 text-gold-500/70" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
                      Frase do Dia
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-serif text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    "{frase.texto}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-subtle/50">
                  <span className="text-xs font-bold text-soft-blue-500">
                    — {frase.autor}
                  </span>
                </div>
              </div>
            )}

            {/* Oração do Dia */}
            {oracao && (
              <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs">🙏</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
                      Oração do Dia
                    </span>
                  </div>
                  <p className="text-sm font-serif text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    "{oracao.texto}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-subtle/50 text-[10px] text-gray-400">
                  Respire fundo, ore em silêncio.
                </div>
              </div>
            )}

            {/* Curiosidade Bíblica */}
            {curiosidade && (
              <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-400">
                    <HelpCircle className="w-5 h-5 text-soft-blue-500/70" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
                      Curiosidade
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                    {curiosidade.titulo}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-serif leading-relaxed">
                    {curiosidade.texto}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border-subtle/50 text-[10px] text-gray-400">
                  Você sabia?
                </div>
              </div>
            )}

            {/* Pergunta Bíblica */}
            {pergunta && (
              <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="text-xs">❓</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
                      Quiz Bíblico
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white font-serif">
                    {pergunta.pergunta}
                  </p>
                  
                  <AnimatePresence mode="wait">
                    {revealAnswer ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 rounded-xl bg-green-500/10 border border-green-200/30 text-xs text-green-700 dark:text-green-400 font-semibold"
                      >
                        ✅ {pergunta.resposta}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle/50 flex justify-end">
                  {!revealAnswer ? (
                    <button
                      onClick={() => setRevealAnswer(true)}
                      className="text-xs font-bold text-soft-blue-500 hover:text-soft-blue-600 transition-colors"
                    >
                      Revelar Resposta
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-400 font-medium">Resposta revelada</span>
                  )}
                </div>
              </div>
            )}

            {/* Desafio do Dia */}
            {desafio && (
              <div className="col-span-1 md:col-span-2 p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
                <div className="absolute right-0 bottom-0 w-16 h-16 bg-gold-200/10 dark:bg-gold-500/5 rounded-tl-full"></div>
                <div className="flex items-center space-x-3 text-gold-500">
                  <Trophy className="w-5 h-5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500">
                    Desafio Prático do Dia
                  </span>
                </div>
                <p className="mt-4 text-sm sm:text-base font-serif text-gray-700 dark:text-gray-300 font-medium italic leading-relaxed">
                  "{desafio.texto}"
                </p>
                <div className="mt-4 pt-3 border-t border-border-subtle/50 text-[10px] text-gray-400">
                  Coloque a sua fé em ação no dia de hoje.
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Lado Direito (Progresso, Calendário) - 4 Colunas */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Card de Acompanhamento Individual / Progresso */}
          <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white font-serif flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-gold-500" />
              <span>Seu Progresso Espiritual</span>
            </h3>

            <div className="mt-6 space-y-5">
              {/* Streak */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gold-50/20 dark:bg-gold-500/5 border border-gold-100/50 dark:border-gold-800/15">
                <div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
                    Sequência Atual
                  </span>
                  <p className="text-2xl font-extrabold text-gold-600 dark:text-gold-400 mt-0.5">
                    {streakAtual} dias
                  </p>
                </div>
                <span className="text-3xl">🔥</span>
              </div>

              {/* Barra da Semana */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Esta Semana</span>
                  <span className="font-semibold text-soft-blue-500">{diasConcluidosSemana} de {totalDiasSemana} dias</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(diasConcluidosSemana / totalDiasSemana) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-soft-blue-500 rounded-full"
                  />
                </div>
              </div>

              {/* Barra do Ano */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Este Ano</span>
                  <span className="font-semibold text-soft-blue-500">{diasConcluidosAno} de {totalDiasAno} dias</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(diasConcluidosAno / totalDiasAno) * 100}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-soft-blue-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Calendário Bonito */}
          <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle/50">
              <h3 className="text-base font-bold text-gray-800 dark:text-white font-serif flex items-center space-x-2">
                <CalendarIcon className="w-4.5 h-4.5 text-soft-blue-500" />
                <span>Navegar por Data</span>
              </h3>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 text-gray-500 dark:text-gray-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 min-w-[70px] text-center">
                  {meses[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-850 text-gray-500 dark:text-gray-400"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cabeçalho dias da semana */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-gray-400 dark:text-gray-500 py-3">
              {diasDaSemana.map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>

            {/* Grid dos dias */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendarDays()}
            </div>

            {/* Legenda */}
            <div className="mt-5 pt-4 border-t border-border-subtle/50 flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 font-medium">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span>Lido</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full border border-soft-blue-400 bg-soft-blue-50 dark:bg-soft-blue-900/20"></span>
                <span>Hoje</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-soft-blue-500"></span>
                <span>Selecionado</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
