"use client";

import { useApp } from "@/context/AppContext";
import {
  FileText, Calendar, Plus, CheckCircle, Clock, Users, Shield, Compass, BookOpen, AlertCircle, Trash, Award, Trash2, Edit2, X, Image, Upload, TrendingUp, Sparkles, MessageSquare, Heart, Lock, KeyRound, Eye, EyeOff, LogOut
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Evento, Aviso, Noticia, LeituraProgramada, Devocional } from "@/lib/mockData";

const STRONG_ADMIN_PASSWORD = "BiblePortal#2026!Admin";

export default function AdminDashboard() {
  const {
    leituras,
    devocionais,
    eventos,
    avisos,
    noticias,
    pedidosOracao,
    adicionarLeitura,
    adicionarDevocional,
    adicionarEvento,
    adicionarAviso,
    adicionarNoticia,
    atenderPedidoOracao,
    acessos,
    editarEvento,
    excluirEvento,
    editarAviso,
    excluirAviso,
    editarNoticia,
    excluirNoticia,
    excluirLeitura,
    excluirDevocional,
    excluirPedidoOracao,
    excluirComentarioOracao,
    motivos,
    salvarMotivos
  } = useApp();

  // Autenticação por Senha Forte
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("bible_portal_admin_auth") === "true";
    }
    return false;
  });
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === STRONG_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("bible_portal_admin_auth", "true");
      }
      setAuthError("");
      setInputPassword("");
    } else {
      setAuthError("Senha incorreta. Tente novamente.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("bible_portal_admin_auth");
    }
  };

  const [activeAdminTab, setActiveAdminTab] = useState<"resumo" | "leituras" | "conteudo" | "pedidos">("resumo");
  const [successMsg, setSuccessMsg] = useState("");
  const [newMotiveInput, setNewMotiveInput] = useState("");

  const DEFAULT_EVENT_IMAGE = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop";
  const DEFAULT_NEWS_IMAGE = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop";

  // Helper para upload de imagens (File -> Base64)
  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Formulário Leituras
  const [readDate, setReadDate] = useState("");
  const [readTime, setReadTime] = useState(15);
  const [readText, setReadText] = useState(""); // Ex: "Salmos 23, Mateus 1"
  const [readBibleText, setReadBibleText] = useState("");
  const [editingReadDate, setEditingReadDate] = useState<string | null>(null);

  // Formulário Devocional
  const [devDate, setDevDate] = useState("");
  const [devTitle, setDevTitle] = useState("");
  const [devText, setDevText] = useState("");
  const [devApp, setDevApp] = useState("");
  const [devPray, setDevPray] = useState("");
  const [editingDevDate, setEditingDevDate] = useState<string | null>(null);

  // Formulário Evento
  const [evTitle, setEvTitle] = useState("");
  const [evDesc, setEvDesc] = useState("");
  const [evDate, setEvDate] = useState("");
  const [evLocal, setEvLocal] = useState("");
  const [evImg, setEvImg] = useState("");
  const [editingEvId, setEditingEvId] = useState<string | null>(null);

  // Formulário Aviso
  const [avTitle, setAvTitle] = useState("");
  const [avCat, setAvCat] = useState("Estudo Bíblico");
  const [avDate, setAvDate] = useState("Semanal");
  const [editingAvId, setEditingAvId] = useState<string | null>(null);

  // Formulário Notícia
  const [noTitle, setNoTitle] = useState("");
  const [noResume, setNoResume] = useState("");
  const [noContent, setNoContent] = useState("");
  const [noDate, setNoDate] = useState("");
  const [noImg, setNoImg] = useState("");
  const [editingNoId, setEditingNoId] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleCreateLeitura = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readDate || !readText.trim()) return;

    const parts = readText.split(",").map(x => x.trim()).filter(Boolean);
    
    // Se estava editando uma data e ela foi alterada, exclui a anterior antes de salvar a nova
    if (editingReadDate && editingReadDate !== readDate) {
      excluirLeitura(editingReadDate);
    }

    adicionarLeitura({
      data: readDate,
      leituras: parts,
      tempoEstimado: Number(readTime),
      trechoBiblico: readBibleText || undefined
    });

    if (editingReadDate) {
      showSuccess("Programação de Leitura atualizada com sucesso!");
      setEditingReadDate(null);
    } else {
      showSuccess("Programação de Leitura cadastrada com sucesso!");
    }

    setReadDate("");
    setReadText("");
    setReadBibleText("");
  };

  const handleCreateDevocional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devDate || !devTitle.trim() || !devText.trim()) return;

    // Se estava editando uma data e ela foi alterada, exclui a anterior
    if (editingDevDate && editingDevDate !== devDate) {
      excluirDevocional(editingDevDate);
    }

    adicionarDevocional({
      data: devDate,
      titulo: devTitle,
      texto: devText.startsWith("<p>") ? devText : `<p>${devText.replace(/\n/g, "</p><p>")}</p>`,
      aplicacao: devApp,
      oracao: devPray,
    });

    if (editingDevDate) {
      showSuccess("Devocional do dia atualizado com sucesso!");
      setEditingDevDate(null);
    } else {
      showSuccess("Devocional do dia cadastrado com sucesso!");
    }

    setDevDate("");
    setDevTitle("");
    setDevText("");
    setDevApp("");
    setDevPray("");
  };

  const handleCreateEvento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim() || !evDate || !evLocal.trim()) return;

    const imageUrl = evImg.trim() || DEFAULT_EVENT_IMAGE;

    if (editingEvId) {
      editarEvento({
        id: editingEvId,
        titulo: evTitle,
        descricao: evDesc,
        data: evDate,
        local: evLocal,
        imagemUrl: imageUrl,
      });
      showSuccess("Evento atualizado!");
      setEditingEvId(null);
    } else {
      adicionarEvento({
        titulo: evTitle,
        descricao: evDesc,
        data: evDate,
        local: evLocal,
        imagemUrl: imageUrl,
      });
      showSuccess("Evento oficial registrado!");
    }

    setEvTitle("");
    setEvDesc("");
    setEvDate("");
    setEvLocal("");
    setEvImg("");
  };

  const handleCreateAviso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!avTitle.trim()) return;

    if (editingAvId) {
      editarAviso({
        id: editingAvId,
        titulo: avTitle,
        categoria: avCat,
        data: avDate,
      });
      showSuccess("Aviso atualizado!");
      setEditingAvId(null);
    } else {
      adicionarAviso({
        titulo: avTitle,
        categoria: avCat,
        data: avDate,
      });
      showSuccess("Aviso cadastrado com sucesso!");
    }

    setAvTitle("");
  };

  const handleCreateNoticia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noTitle.trim() || !noContent.trim() || !noDate) return;

    const imageUrl = noImg.trim() || DEFAULT_NEWS_IMAGE;

    if (editingNoId) {
      editarNoticia({
        id: editingNoId,
        titulo: noTitle,
        resumo: noResume,
        conteudo: noContent.startsWith("<p>") ? noContent : `<p>${noContent.replace(/\n/g, "</p><p>")}</p>`,
        imagemUrl: imageUrl,
        galeria: [],
        data: noDate,
      });
      showSuccess("Notícia atualizada!");
      setEditingNoId(null);
    } else {
      adicionarNoticia({
        titulo: noTitle,
        resumo: noResume,
        conteudo: `<p>${noContent.replace(/\n/g, "</p><p>")}</p>`,
        imagemUrl: imageUrl,
        galeria: [],
        data: noDate,
      });
      showSuccess("Notícia publicada com sucesso!");
    }

    setNoTitle("");
    setNoResume("");
    setNoContent("");
    setNoDate("");
    setNoImg("");
  };

  const startEditEvento = (ev: Evento) => {
    setEditingEvId(ev.id);
    setEvTitle(ev.titulo);
    setEvDesc(ev.descricao);
    setEvDate(ev.data);
    setEvLocal(ev.local);
    setEvImg(ev.imagemUrl === DEFAULT_EVENT_IMAGE ? "" : ev.imagemUrl);
  };

  const startEditAviso = (av: Aviso) => {
    setEditingAvId(av.id);
    setAvTitle(av.titulo);
    setAvCat(av.categoria);
    setAvDate(av.data || "Semanal");
  };

  const startEditNoticia = (no: Noticia) => {
    setEditingNoId(no.id);
    setNoTitle(no.titulo);
    setNoResume(no.resumo);
    setNoContent(no.conteudo.replace(/<p>/g, "").replace(/<\/p>/g, "\n").trim());
    setNoDate(no.data);
    setNoImg(no.imagemUrl === DEFAULT_NEWS_IMAGE ? "" : no.imagemUrl);
  };

  const startEditLeitura = (l: LeituraProgramada) => {
    setEditingReadDate(l.data);
    setReadDate(l.data);
    setReadTime(l.tempoEstimado);
    setReadText(l.leituras.join(", "));
    setReadBibleText(l.trechoBiblico || "");
    // Rola para o topo do formulário
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const startEditDevocional = (d: Devocional) => {
    setEditingDevDate(d.data);
    setDevDate(d.data);
    setDevTitle(d.titulo);
    setDevText(d.texto.replace(/<p>/g, "").replace(/<\/p>/g, "\n").trim());
    setDevApp(d.aplicacao);
    setDevPray(d.oracao);
    // Rola para o topo do formulário
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Cálculo de Métricas Adicionais
  const oracoesRespondidasCount = pedidosOracao.filter(x => x.atendido).length;
  const oracoesPendentesCount = pedidosOracao.filter(x => !x.atendido).length;
  const taxaResposta = pedidosOracao.length > 0 
    ? Math.round((oracoesRespondidasCount / pedidosOracao.length) * 100) 
    : 0;

  // Cálculo dinâmico da distribuição de motivos
  const totalOracoes = pedidosOracao.length;
  const motivosStats = (motivos || []).map(m => {
    const count = pedidosOracao.filter(x => x.motivo === m).length;
    const percent = totalOracoes > 0 ? Math.round((count / totalOracoes) * 100) : 0;
    return { nome: m, count, percent };
  }).sort((a, b) => b.count - a.count);

  // Tela de Autenticação se não estiver logado
  if (!isAuthenticated) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md bg-card-bg border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-soft-blue-50 dark:bg-soft-blue-600/10 rounded-2xl flex items-center justify-center mx-auto text-soft-blue-500 border border-soft-blue-100 dark:border-soft-blue-500/20 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold font-serif text-gray-800 dark:text-white">
              Painel Administrativo
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Esta área é restrita. Digite a senha forte de acesso para gerenciar os dados da igreja.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Digite a senha..."
                  className="w-full px-4 py-3 text-sm rounded-xl bg-gray-55/60 dark:bg-gray-800/50 border border-border-subtle focus:border-soft-blue-500 focus:outline-none transition-colors pr-10 text-gray-900 dark:text-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-soft-blue-500 hover:bg-soft-blue-600 text-white font-medium text-sm transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Entrar no Painel</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border-subtle">
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              🔒 Rota oculta e protegida por autenticação.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Cabeçalho da Área Administrativa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-soft-blue-500 uppercase tracking-widest flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-gold-500" />
            <span>PAINEL DE CONTROLE</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-gray-800 dark:text-white">
            Painel da Secretaria
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Gerencie o plano de Leitura Bíblica, Devocionais diários e acompanhe as métricas de engajamento.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-red-500/10 hover:text-red-500 text-gray-600 dark:text-gray-300 text-xs font-semibold transition-all self-start sm:self-auto border border-border-subtle shadow-sm cursor-pointer"
          title="Sair e trancar o painel"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Sair / Trancar</span>
        </button>
      </div>

      {/* Alerta de Sucesso */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-green-500/10 border border-green-200 text-green-600 text-xs font-bold"
          >
            ✓ {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Administrador */}
      <div className="flex border-b border-border-subtle/80 overflow-x-auto pb-px">
        <div className="flex space-x-6">
          {(["resumo", "leituras", "conteudo", "pedidos"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveAdminTab(tab)}
              className={`pb-3 text-xs font-bold border-b-2 transition-all uppercase tracking-wider whitespace-nowrap px-1 ${
                activeAdminTab === tab
                  ? "border-soft-blue-500 text-soft-blue-500"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab === "resumo" ? "Resumo / Métricas" : tab === "leituras" ? "Leitura & Devocional" : tab === "conteudo" ? "Gerenciar Mural" : "Pedidos Recebidos"}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: RESUMO */}
          {activeAdminTab === "resumo" && (
            <motion.div
              key="admin-resumo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Grid de Cards de Estatísticas Enriquecido */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                
                {/* Acessos */}
                <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl shadow-inner">
                    📈
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block tracking-wider">Acessos Totais</span>
                    <h4 className="text-2xl font-bold font-serif text-gray-800 dark:text-white mt-0.5">
                      {acessos}
                    </h4>
                    <span className="text-[9px] text-green-500 font-semibold flex items-center mt-0.5">
                      <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +12% esta semana
                    </span>
                  </div>
                </div>

                {/* Leituras */}
                <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-2xl bg-soft-blue-50 dark:bg-soft-blue-900/10 text-soft-blue-500 flex items-center justify-center shadow-inner">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block tracking-wider">Planos Ativos</span>
                    <h4 className="text-2xl font-bold font-serif text-gray-800 dark:text-white mt-0.5">
                      {leituras.length}
                    </h4>
                    <span className="text-[9px] text-gray-400 block mt-0.5">100% de cobertura de dias</span>
                  </div>
                </div>

                {/* Pedidos de Oração */}
                <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-inner">
                    <span>🙏</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block tracking-wider">Intercessões</span>
                    <h4 className="text-2xl font-bold font-serif text-gray-800 dark:text-white mt-0.5">
                      {pedidosOracao.length}
                    </h4>
                    <span className="text-[9px] text-amber-500 font-semibold block mt-0.5">
                      {oracoesPendentesCount} pendentes de intercessão
                    </span>
                  </div>
                </div>

                {/* Taxa de Resposta */}
                <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-inner">
                    <span>✅</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block tracking-wider">Taxa de Apoio</span>
                    <h4 className="text-2xl font-bold font-serif text-gray-800 dark:text-white mt-0.5">
                      {taxaResposta}%
                    </h4>
                    <span className="text-[9px] text-emerald-500 font-semibold block mt-0.5">
                      {oracoesRespondidasCount} pedidos atendidos
                    </span>
                  </div>
                </div>

              </div>

              {/* Informações e Dados Enriquecidos */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Gráfico Semanal (7 Colunas) */}
                <div className="lg:col-span-7 p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <div>
                      <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
                        Engajamento de Leitura Diária dos Membros
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Taxa média de leitura bíblica concluída por dia da semana.</p>
                    </div>
                    <span className="text-xs bg-soft-blue-50 dark:bg-soft-blue-900/20 text-soft-blue-500 font-bold px-2 py-1 rounded-lg">
                      Média: 68%
                    </span>
                  </div>

                  <div className="h-48 flex items-end justify-between px-2 pt-6">
                    {[
                      { dia: "Dom", valor: "75%", color: "bg-soft-blue-500" },
                      { dia: "Seg", valor: "55%", color: "bg-gray-400 dark:bg-gray-600" },
                      { dia: "Ter", valor: "62%", color: "bg-gray-400 dark:bg-gray-600" },
                      { dia: "Qua", valor: "80%", color: "bg-soft-blue-500" },
                      { dia: "Qui", valor: "68%", color: "bg-gray-400 dark:bg-gray-600" },
                      { dia: "Sex", valor: "48%", color: "bg-gray-400 dark:bg-gray-600" },
                      { dia: "Sáb", valor: "90%", color: "bg-gold-500" }
                    ].map((d, i) => (
                      <div key={i} className="flex flex-col items-center space-y-2 flex-1">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">{d.valor}</span>
                        <div className={`w-8 bg-opacity-20 hover:bg-opacity-100 transition-all duration-300 rounded-t-lg relative ${d.color}`} style={{ height: `${parseInt(d.valor) * 1.2}px` }}></div>
                        <span className="text-[10px] text-gray-400 font-semibold">{d.dia}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Métricas do Apoio Espiritual (5 Colunas) */}
                <div className="lg:col-span-5 p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-4">
                  <div>
                    <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
                      Distribuição de Motivos de Oração
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Tipologia principal de mensagens de apoio enviadas pelos membros.</p>
                  </div>
                  <div className="space-y-4 pt-2">
                    {motivosStats.map((stat, idx) => {
                      const colors = ["bg-soft-blue-500", "bg-gold-500", "bg-emerald-500", "bg-indigo-500", "bg-rose-500"];
                      const colorClass = colors[idx % colors.length];
                      return (
                        <div key={stat.nome} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">{stat.nome}</span>
                            <span className="font-bold">{stat.percent}% <span className="text-[10px] text-gray-400 font-normal">({stat.count})</span></span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${stat.percent}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Tabela de Pedidos Recentes Integrada no Dashboard */}
              <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <div>
                    <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
                      Pedidos Recentes de Intercessão
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Últimas solicitações de apoio e intercessão recebidas pelo formulário.</p>
                  </div>
                  <button 
                    onClick={() => setActiveAdminTab("pedidos")}
                    className="text-xs text-soft-blue-500 font-semibold hover:underline"
                  >
                    Ver todos os pedidos
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-subtle text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5 px-2">Data</th>
                        <th className="py-2.5 px-2">Solicitante</th>
                        <th className="py-2.5 px-2">Pedido / Motivo</th>
                        <th className="py-2.5 px-2">Visibilidade</th>
                        <th className="py-2.5 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {pedidosOracao.slice(0, 3).map((p) => (
                        <tr key={p.id} className="hover:bg-gray-55/30">
                          <td className="py-3 px-2 text-gray-500">{p.data}</td>
                          <td className="py-3 px-2 font-semibold text-gray-700 dark:text-gray-300">
                            {p.anonimo ? <span className="italic text-gray-400 font-normal">Anônimo</span> : p.nome}
                          </td>
                          <td className="py-3 px-2 max-w-xs truncate text-gray-600 dark:text-gray-400">{p.mensagem}</td>
                          <td className="py-3 px-2">
                            {p.privado ? (
                              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-bold text-[8px]">
                                Privado
                              </span>
                            ) : (
                              <span className="bg-soft-blue-50 dark:bg-soft-blue-900/20 text-soft-blue-500 px-1.5 py-0.5 rounded-full font-bold text-[8px]">
                                Público
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            {p.atendido ? (
                              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold text-[9px]">
                                Intercedido
                              </span>
                            ) : (
                              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold text-[9px]">
                                Pendente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: CADASTRAR LEITURAS & DEVOCIONAIS */}
          {activeAdminTab === "leituras" && (
            <motion.div
              key="admin-leituras"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Cadastro Leitura Diária */}
              <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-sm">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <h3 className="text-base sm:text-lg font-bold font-serif text-gray-800 dark:text-white">
                    {editingReadDate ? "✍️ Editar Leitura Programada" : "Programar Leitura Bíblica Diária"}
                  </h3>
                  {editingReadDate && (
                    <button
                      onClick={() => {
                        setEditingReadDate(null);
                        setReadDate("");
                        setReadText("");
                        setReadBibleText("");
                      }}
                      className="text-[10px] font-bold text-red-500 flex items-center space-x-0.5 hover:underline"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleCreateLeitura} className="mt-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Data Programada *</label>
                      <input
                        required
                        type="date"
                        value={readDate}
                        onChange={(e) => setReadDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 text-xs focus:border-soft-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Tempo Estimado (Minutos) *</label>
                      <input
                        required
                        type="number"
                        min={1}
                        value={readTime}
                        onChange={(e) => setReadTime(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 text-xs focus:border-soft-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Leituras do Dia *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: 1 Crônicas 19:1–21:30, Salmos 11, Provérbios 19, Romanos 2–3"
                      value={readText}
                      onChange={(e) => setReadText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 text-xs focus:border-soft-blue-500 focus:outline-none"
                    />
                    <span className="text-[9px] text-gray-400">Separe os livros ou trechos por vírgula.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Texto das Escrituras / Trecho Bíblico (Opcional)</label>
                    <textarea
                      rows={4}
                      placeholder="Cole aqui o texto bíblico correspondente para o membro ler diretamente no app. Se deixado em branco, o sistema carregará o simulador automático."
                      value={readBibleText}
                      onChange={(e) => setReadBibleText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 text-xs focus:border-soft-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-soft-blue-500 hover:bg-soft-blue-600 text-white font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    {editingReadDate ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{editingReadDate ? "Atualizar Leitura" : "Salvar Leitura"}</span>
                  </button>
                </form>
              </div>

              {/* Cadastro Devocional (Reflexão) */}
              <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-sm">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <h3 className="text-base sm:text-lg font-bold font-serif text-gray-800 dark:text-white">
                    {editingDevDate ? "✍️ Editar Devocional" : "Cadastrar Devocional do Dia"}
                  </h3>
                  {editingDevDate && (
                    <button
                      onClick={() => {
                        setEditingDevDate(null);
                        setDevDate("");
                        setDevTitle("");
                        setDevText("");
                        setDevApp("");
                        setDevPray("");
                      }}
                      className="text-[10px] font-bold text-red-500 flex items-center space-x-0.5 hover:underline"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleCreateDevocional} className="mt-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Data Programada *</label>
                      <input
                        required
                        type="date"
                        value={devDate}
                        onChange={(e) => setDevDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 text-xs focus:border-soft-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Título do Devocional *</label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: A Confiança no Senhor"
                        value={devTitle}
                        onChange={(e) => setDevTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 text-xs focus:border-soft-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Texto Reflexivo *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Escreva a reflexão pastoral de hoje..."
                      value={devText}
                      onChange={(e) => setDevText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 text-xs focus:border-soft-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Aplicação Prática *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Hoje, perdoe alguém..."
                      value={devApp}
                      onChange={(e) => setDevApp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 text-xs focus:border-soft-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Oração Sugerida *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Senhor, fortalece-me..."
                      value={devPray}
                      onChange={(e) => setDevPray(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 text-xs focus:border-soft-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-soft-blue-500 hover:bg-soft-blue-600 text-white font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    {editingDevDate ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{editingDevDate ? "Atualizar Devocional" : "Salvar Devocional"}</span>
                  </button>
                </form>
              </div>

              {/* Quadro com todos os já cadastrados (Plano de Leitura & Devocional) com suporte a Edição */}
              <div className="pt-6 border-t border-border-subtle mt-8 col-span-1 lg:col-span-2 space-y-6">
                <h3 className="text-base sm:text-lg font-bold font-serif text-gray-800 dark:text-white border-b border-border-subtle pb-3">
                  Conteúdos Ativos Cadastrados
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Leituras Cadastradas */}
                  <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1">
                      <BookOpen className="w-3.5 h-3.5 text-soft-blue-500" />
                      <span>Leituras Bíblicas Programadas</span>
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {leituras.length > 0 ? (
                        leituras.map((l) => (
                          <div key={l.data} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-border-subtle text-xs transition-colors hover:bg-gray-100/50">
                            <div>
                              <p className="font-bold text-gray-800 dark:text-gray-300">{l.data}</p>
                              <p className="text-[10px] text-gray-500 truncate max-w-[200px] mt-0.5">{l.leituras.join(", ")}</p>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <button onClick={() => startEditLeitura(l)} className="p-1.5 rounded-lg hover:bg-soft-blue-500/10 text-soft-blue-500 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => { excluirLeitura(l.data); showSuccess("Leitura programada removida!"); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 text-center py-6">Nenhuma leitura programada.</p>
                      )}
                    </div>
                  </div>

                  {/* Devocionais Cadastrados */}
                  <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                      <span>Devocionais Cadastrados</span>
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {devocionais.length > 0 ? (
                        devocionais.map((d) => (
                          <div key={d.data} className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-border-subtle text-xs transition-colors hover:bg-gray-100/50">
                            <div>
                              <p className="font-bold text-gray-800 dark:text-gray-300">{d.data}</p>
                              <p className="text-[10px] text-gray-500 truncate max-w-[200px] mt-0.5">{d.titulo}</p>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <button onClick={() => startEditDevocional(d)} className="p-1.5 rounded-lg hover:bg-soft-blue-500/10 text-soft-blue-500 transition-colors">
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => { excluirDevocional(d.data); showSuccess("Devocional do dia removido!"); }} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 text-center py-6">Nenhum devocional programado.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: GERENCIAR MURAL (Eventos, Notícias, Avisos) */}
          {activeAdminTab === "conteudo" && (
            <motion.div
              key="admin-conteudo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
            >
              {/* 1. Evento */}
              <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
                    {editingEvId ? "✍️ Editar Evento" : "Criar Evento"}
                  </h4>
                  {editingEvId && (
                    <button
                      onClick={() => {
                        setEditingEvId(null);
                        setEvTitle("");
                        setEvDesc("");
                        setEvDate("");
                        setEvLocal("");
                        setEvImg("");
                      }}
                      className="text-[10px] font-bold text-red-500 flex items-center space-x-0.5 hover:underline"
                    >
                      <X className="w-3 h-3" />
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleCreateEvento} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Título do Evento *</label>
                    <input
                      required
                      type="text"
                      value={evTitle}
                      onChange={(e) => setEvTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Descrição do Evento</label>
                    <textarea
                      rows={2}
                      value={evDesc}
                      onChange={(e) => setEvDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Data e Horário *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: 25 de Julho, às 19h"
                      value={evDate}
                      onChange={(e) => setEvDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Localização *</label>
                    <input
                      required
                      type="text"
                      value={evLocal}
                      onChange={(e) => setEvLocal(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  
                  {/* Imagem Upload & URL */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-500 flex items-center space-x-1">
                      <Image className="w-3.5 h-3.5 text-soft-blue-500" />
                      <span>Imagem do Evento</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2.5">
                        <label className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100/50 cursor-pointer text-gray-500 font-semibold transition-colors w-full justify-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Enviar Arquivo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, setEvImg);
                                showSuccess("Imagem carregada!");
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Ou cole o link da imagem aqui"
                        value={evImg.startsWith("data:") ? "Arquivo enviado localmente" : evImg}
                        onChange={(e) => {
                          if (!evImg.startsWith("data:")) {
                            setEvImg(e.target.value);
                          } else {
                            setEvImg("");
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                      />
                      {evImg && (
                        <div className="w-full h-24 rounded-lg overflow-hidden border border-border-subtle">
                          <img src={evImg} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-soft-blue-500 text-white font-semibold shadow-sm hover:bg-soft-blue-600 transition-colors"
                  >
                    {editingEvId ? "Atualizar Evento" : "Salvar Evento"}
                  </button>
                </form>

                {/* Listagem de Eventos */}
                <div className="pt-4 border-t border-border-subtle">
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Eventos Ativos</h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {eventos.map((ev) => (
                      <div key={ev.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-border-subtle text-xs">
                        <span className="font-semibold truncate max-w-[120px]">{ev.titulo}</span>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => startEditEvento(ev)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-soft-blue-500">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { excluirEvento(ev.id); showSuccess("Evento removido!"); }} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Aviso */}
              <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
                    {editingAvId ? "✍️ Editar Aviso" : "Criar Aviso Curto"}
                  </h4>
                  {editingAvId && (
                    <button
                      onClick={() => {
                        setEditingAvId(null);
                        setAvTitle("");
                      }}
                      className="text-[10px] font-bold text-red-500 flex items-center space-x-0.5 hover:underline"
                    >
                      <X className="w-3 h-3" />
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleCreateAviso} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Título / Texto do Aviso *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ex: Santa Ceia do Senhor às 18h"
                      value={avTitle}
                      onChange={(e) => setAvTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Categoria *</label>
                    <select
                      value={avCat}
                      onChange={(e) => setAvCat(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    >
                      <option>Estudo Bíblico</option>
                      <option>Oração</option>
                      <option>Mural</option>
                      <option>Aviso Geral</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Frequência / Data</label>
                    <input
                      type="text"
                      value={avDate}
                      onChange={(e) => setAvDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-soft-blue-500 text-white font-semibold shadow-sm hover:bg-soft-blue-600 transition-colors"
                  >
                    {editingAvId ? "Atualizar Aviso" : "Salvar Aviso"}
                  </button>
                </form>

                {/* Listagem de Avisos */}
                <div className="pt-4 border-t border-border-subtle">
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Avisos Ativos</h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {avisos.map((av) => (
                      <div key={av.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-border-subtle text-xs">
                        <span className="font-semibold truncate max-w-[120px]">{av.titulo}</span>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => startEditAviso(av)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-soft-blue-500">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { excluirAviso(av.id); showSuccess("Aviso removido!"); }} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Notícia */}
              <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
                    {editingNoId ? "✍️ Editar Notícia" : "Publicar Notícia"}
                  </h4>
                  {editingNoId && (
                    <button
                      onClick={() => {
                        setEditingNoId(null);
                        setNoTitle("");
                        setNoResume("");
                        setNoContent("");
                        setNoDate("");
                        setNoImg("");
                      }}
                      className="text-[10px] font-bold text-red-500 flex items-center space-x-0.5 hover:underline"
                    >
                      <X className="w-3 h-3" />
                      <span>Cancelar</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleCreateNoticia} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Título da Notícia *</label>
                    <input
                      required
                      type="text"
                      value={noTitle}
                      onChange={(e) => setNoTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Resumo da Notícia</label>
                    <input
                      type="text"
                      value={noResume}
                      onChange={(e) => setNoResume(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Conteúdo Completo *</label>
                    <textarea
                      required
                      rows={2}
                      value={noContent}
                      onChange={(e) => setNoContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-500">Data de Publicação *</label>
                    <input
                      required
                      type="date"
                      value={noDate}
                      onChange={(e) => setNoDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                    />
                  </div>
                  
                  {/* Imagem Upload & URL Noticia */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-gray-500 flex items-center space-x-1">
                      <Image className="w-3.5 h-3.5 text-soft-blue-500" />
                      <span>Imagem da Notícia</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2.5">
                        <label className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100/50 cursor-pointer text-gray-500 font-semibold transition-colors w-full justify-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Enviar Arquivo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, setNoImg);
                                showSuccess("Imagem carregada!");
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Ou cole o link da imagem aqui"
                        value={noImg.startsWith("data:") ? "Arquivo enviado localmente" : noImg}
                        onChange={(e) => {
                          if (!noImg.startsWith("data:")) {
                            setNoImg(e.target.value);
                          } else {
                            setNoImg("");
                          }
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none"
                      />
                      {noImg && (
                        <div className="w-full h-24 rounded-lg overflow-hidden border border-border-subtle">
                          <img src={noImg} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-soft-blue-500 text-white font-semibold shadow-sm hover:bg-soft-blue-600 transition-colors"
                  >
                    {editingNoId ? "Atualizar Notícia" : "Publicar Notícia"}
                  </button>
                </form>

                {/* Listagem de Notícias */}
                <div className="pt-4 border-t border-border-subtle">
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Notícias Ativas</h5>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {noticias.map((no) => (
                      <div key={no.id} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-border-subtle text-xs">
                        <span className="font-semibold truncate max-w-[120px]">{no.titulo}</span>
                        <div className="flex items-center space-x-1">
                          <button onClick={() => startEditNoticia(no)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-soft-blue-500">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => { excluirNoticia(no.id); showSuccess("Notícia removida!"); }} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: PEDIDOS RECEBIDOS */}
          {activeAdminTab === "pedidos" && (
            <motion.div
              key="admin-pedidos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Pedidos de Oração */}
              <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-4">
                <h3 className="text-base sm:text-lg font-bold font-serif text-gray-800 dark:text-white pb-2 border-b border-border-subtle">
                  Pedidos de Oração Recebidos
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-subtle text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-2">Data</th>
                        <th className="py-3 px-2">Solicitante</th>
                        <th className="py-3 px-2">Pedido / Motivo</th>
                        <th className="py-3 px-2">Visibilidade</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {pedidosOracao.length > 0 ? (
                        pedidosOracao.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-55/30">
                            <td className="py-4 px-2 whitespace-nowrap">{p.data}</td>
                            <td className="py-4 px-2">
                              {p.anonimo ? (
                                <span className="text-gray-400 font-semibold italic">Anônimo</span>
                              ) : (
                                <div>
                                  <p className="font-semibold text-gray-700 dark:text-gray-300">{p.nome}</p>
                                  <p className="text-[10px] text-gray-400">{p.telefone}</p>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-2 max-w-xs">
                              <div>
                                <p className="text-gray-700 dark:text-gray-300 font-serif italic">"{p.mensagem}"</p>
                                {p.comentarios && p.comentarios.length > 0 && (
                                  <div className="mt-3 space-y-1.5 bg-gray-50/50 dark:bg-gray-800/30 p-2.5 rounded-xl border border-border-subtle max-w-xs">
                                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Moderar Comentários:</p>
                                    {p.comentarios.map(c => (
                                      <div key={c.id} className="flex items-center justify-between text-[9px] text-gray-500 py-1 border-b border-gray-100/50 last:border-0">
                                        <span className="truncate max-w-[170px]"><strong>{c.autor}:</strong> {c.texto}</span>
                                        <button 
                                          onClick={() => { excluirComentarioOracao(p.id, c.id); showSuccess("Comentário removido!"); }} 
                                          className="text-red-500 hover:text-red-700 p-0.5 font-bold"
                                          title="Excluir Comentário"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              {p.privado ? (
                                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  🔒 Privado
                                </span>
                              ) : (
                                <span className="bg-soft-blue-50 dark:bg-soft-blue-900/20 text-soft-blue-500 px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  🌐 Público
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-2">
                              {p.atendido ? (
                                <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">
                                  Intercedido
                                </span>
                              ) : (
                                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                                  Pendente
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-2 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => atenderPedidoOracao(p.id, !p.atendido)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                                    p.atendido
                                      ? "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200"
                                      : "bg-soft-blue-500 text-white hover:bg-soft-blue-600"
                                  }`}
                                >
                                  {p.atendido ? "Marcar Pendente" : "Marcar Intercedido"}
                                </button>
                                <button
                                  onClick={() => { excluirPedidoOracao(p.id); showSuccess("Pedido de oração excluído!"); }}
                                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                                  title="Excluir Pedido"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            Nenhum pedido de oração recebido até o momento.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gerenciamento de Categorias de Oração */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                
                {/* Categorias Ativas */}
                <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-4">
                  <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
                    Motivos de Oração Cadastrados
                  </h4>
                  <p className="text-[10px] text-gray-400">Esta lista é exibida no formulário dos membros para categorizar as orações.</p>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {motivos.map((mot) => (
                      <div key={mot} className="flex items-center justify-between p-3 rounded-xl bg-gray-55/40 border border-border-subtle text-xs">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{mot}</span>
                        <button
                          onClick={() => {
                            const updated = motivos.filter(x => x !== mot);
                            salvarMotivos(updated);
                            showSuccess("Categoria removida!");
                          }}
                          className="p-1 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                          title="Remover Categoria"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Adicionar Nova Categoria */}
                <div className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-4">
                  <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
                    Adicionar Nova Categoria / Motivo
                  </h4>
                  <p className="text-[10px] text-gray-400">Insira um novo tema de oração (ex: "Vida Espiritual", "Estudos").</p>
                  
                  <div className="flex items-center space-x-3 text-xs">
                    <input
                      type="text"
                      placeholder="Ex: Vida Espiritual"
                      value={newMotiveInput}
                      onChange={(e) => setNewMotiveInput(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-border-subtle bg-gray-55/40 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const val = newMotiveInput.trim();
                        if (!val) return;
                        if (motivos.includes(val)) {
                          showSuccess("Esta categoria já existe!");
                          return;
                        }
                        salvarMotivos([...motivos, val]);
                        setNewMotiveInput("");
                        showSuccess("Nova categoria adicionada!");
                      }}
                      className="px-4 py-3 bg-soft-blue-500 hover:bg-soft-blue-600 text-white font-semibold rounded-xl flex items-center space-x-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
