"use client";

import { useApp } from "@/context/AppContext";
import {
  FileText, Calendar, Plus, CheckCircle, Clock, Users, Shield, Compass, BookOpen, AlertCircle, Trash, Award, Trash2, Edit2, X, Image, Upload, TrendingUp, Sparkles, MessageSquare, Heart, Lock, KeyRound, Eye, EyeOff, LogOut, BookMarked
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeituraProgramada, Devocional, EstudoTematico, Licao } from "@/lib/mockData";

const STRONG_ADMIN_PASSWORD = "BiblePortal#2026!Admin";

export default function AdminDashboard() {
  const {
    leituras,
    devocionais,
    pedidosOracao,
    adicionarLeitura,
    adicionarDevocional,
    atenderPedidoOracao,
    aprovarPedidoOracao,
    acessos,
    excluirLeitura,
    excluirDevocional,
    excluirPedidoOracao,
    excluirComentarioOracao,
    motivos,
    salvarMotivos,
    
    estudosTematicos,
    adicionarEstudo,
    editarEstudo,
    excluirEstudo
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

  // Estados para Gerenciar Estudos (CRUD)
  const [estudoId, setEstudoId] = useState<string | null>(null);
  const [estudoTitle, setEstudoTitle] = useState("");
  const [estudoDesc, setEstudoDesc] = useState("");
  const [estudoCat, setEstudoCat] = useState("Vida Cristã");
  const [estudoImg, setEstudoImg] = useState("");
  const [estudoIcon, setEstudoIcon] = useState("Compass");

  // Estado para selecionar qual estudo estamos gerenciando as lições
  const [selectedEstudoParaLicoes, setSelectedEstudoParaLicoes] = useState<EstudoTematico | null>(null);

  // Estados para Gerenciar Lições (CRUD)
  const [licaoId, setLicaoId] = useState<string | null>(null);
  const [licaoTitle, setLicaoTitle] = useState("");
  const [licaoIntro, setLicaoIntro] = useState("");
  const [licaoContent, setLicaoContent] = useState("");
  const [licaoPassagens, setLicaoPassagens] = useState("");
  const [licaoReflexao, setLicaoReflexao] = useState("");
  const [licaoOracao, setLicaoOracao] = useState("");

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

  const handleSaveEstudo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!estudoTitle.trim()) return;

    if (estudoId) {
      const existing = estudosTematicos.find(x => x.id === estudoId);
      editarEstudo({
        id: estudoId,
        titulo: estudoTitle,
        descricao: estudoDesc,
        categoria: estudoCat,
        imagemUrl: estudoImg || "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop",
        ico: estudoIcon,
        licoes: existing ? existing.licoes : []
      });
      showSuccess("Estudo Temático atualizado com sucesso!");
      setEstudoId(null);
    } else {
      adicionarEstudo({
        titulo: estudoTitle,
        descricao: estudoDesc,
        categoria: estudoCat,
        imagemUrl: estudoImg || "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=800&auto=format&fit=crop",
        ico: estudoIcon,
        licoes: []
      });
      showSuccess("Novo Estudo Temático cadastrado!");
    }

    setEstudoTitle("");
    setEstudoDesc("");
    setEstudoCat("Vida Cristã");
    setEstudoImg("");
    setEstudoIcon("Compass");
  };

  const startEditEstudo = (estudo: EstudoTematico) => {
    setEstudoId(estudo.id);
    setEstudoTitle(estudo.titulo);
    setEstudoDesc(estudo.descricao);
    setEstudoCat(estudo.categoria);
    setEstudoImg(estudo.imagemUrl);
    setEstudoIcon(estudo.ico);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleSaveLicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEstudoParaLicoes || !licaoTitle.trim()) return;

    const formattedContent = licaoContent.startsWith("<p>") ? licaoContent : `<p>${licaoContent.replace(/\n/g, "</p><p>")}</p>`;
    const formattedPassagens = licaoPassagens.split(",").map(x => x.trim()).filter(Boolean);
    const formattedReflexao = licaoReflexao.split("\n").map(x => x.trim()).filter(Boolean);

    const targetStudy = estudosTematicos.find(x => x.id === selectedEstudoParaLicoes.id);
    if (!targetStudy) return;

    let updatedLicoes = [...targetStudy.licoes];

    if (licaoId) {
      updatedLicoes = updatedLicoes.map(l => l.id === licaoId ? {
        id: licaoId,
        titulo: licaoTitle,
        introducao: licaoIntro,
        conteudo: formattedContent,
        passagens: formattedPassagens,
        reflexao: formattedReflexao,
        oracao: licaoOracao
      } : l);
      showSuccess("Lição atualizada com sucesso!");
      setLicaoId(null);
    } else {
      const newLicao: Licao = {
        id: `licao_${Math.random().toString(36).substr(2, 9)}`,
        titulo: licaoTitle,
        introducao: licaoIntro,
        conteudo: formattedContent,
        passagens: formattedPassagens,
        reflexao: formattedReflexao,
        oracao: licaoOracao
      };
      updatedLicoes.push(newLicao);
      showSuccess("Nova lição adicionada ao tema!");
    }

    const updatedStudy = {
      ...targetStudy,
      licoes: updatedLicoes
    };

    editarEstudo(updatedStudy);
    setSelectedEstudoParaLicoes(updatedStudy);

    setLicaoTitle("");
    setLicaoIntro("");
    setLicaoContent("");
    setLicaoPassagens("");
    setLicaoReflexao("");
    setLicaoOracao("");
  };

  const startEditLicao = (licao: Licao) => {
    setLicaoId(licao.id);
    setLicaoTitle(licao.titulo);
    setLicaoIntro(licao.introducao);
    setLicaoContent(licao.conteudo.replace(/<p>/g, "").replace(/<\/p>/g, "\n").trim());
    setLicaoPassagens(licao.passagens.join(", "));
    setLicaoReflexao(licao.reflexao.join("\n"));
    setLicaoOracao(licao.oracao);
  };

  const handleDeletarLicao = (idLicao: string) => {
    if (!selectedEstudoParaLicoes) return;
    const targetStudy = estudosTematicos.find(x => x.id === selectedEstudoParaLicoes.id);
    if (!targetStudy) return;

    const updatedLicoes = targetStudy.licoes.filter(l => l.id !== idLicao);
    const updatedStudy = {
      ...targetStudy,
      licoes: updatedLicoes
    };

    editarEstudo(updatedStudy);
    setSelectedEstudoParaLicoes(updatedStudy);
    showSuccess("Lição removida com sucesso!");
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
              {tab === "resumo" ? "Resumo / Métricas" : tab === "leituras" ? "Leitura & Devocional" : tab === "conteudo" ? "Gerenciar Estudos" : "Pedidos Recebidos"}
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

          {/* TAB 3: GERENCIAR ESTUDOS TEMÁTICOS */}
          {activeAdminTab === "conteudo" && (
            <motion.div
              key="admin-estudos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                
                {/* 1. Criar/Editar Estudo */}
                <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <h4 className="text-sm font-bold font-serif text-gray-800 dark:text-white">
                      {estudoId ? "✍️ Editar Tema" : "Criar Novo Tema"}
                    </h4>
                    {estudoId && (
                      <button
                        onClick={() => {
                          setEstudoId(null);
                          setEstudoTitle("");
                          setEstudoDesc("");
                          setEstudoCat("Vida Cristã");
                          setEstudoImg("");
                          setEstudoIcon("Compass");
                        }}
                        className="text-[10px] font-bold text-red-500 flex items-center space-x-0.5 hover:underline cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Cancelar</span>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveEstudo} className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-500">Título do Tema *</label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Libertação da Ansiedade"
                        value={estudoTitle}
                        onChange={(e) => setEstudoTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-500">Categoria *</label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Vida Cristã, Doutrina"
                        value={estudoCat}
                        onChange={(e) => setEstudoCat(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-500">Descrição Curta *</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Escreva um resumo para o catálogo..."
                        value={estudoDesc}
                        onChange={(e) => setEstudoDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-500">Ícone Representativo *</label>
                      <select
                        value={estudoIcon}
                        onChange={(e) => setEstudoIcon(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                      >
                        <option value="Compass">Bússola (Compass)</option>
                        <option value="Shield">Escudo (Shield)</option>
                        <option value="BookMarked">Livro (BookMarked)</option>
                        <option value="Heart">Coração (Heart)</option>
                      </select>
                    </div>

                    {/* Capa Upload / URL */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-gray-500 flex items-center space-x-1">
                        <Image className="w-3.5 h-3.5 text-soft-blue-500" />
                        <span>Capa do Tema</span>
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 hover:bg-gray-100/50 cursor-pointer text-gray-500 font-semibold transition-colors w-full justify-center">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Enviar Imagem</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, setEstudoImg);
                                showSuccess("Imagem carregada!");
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Ou cole a URL da imagem"
                          value={estudoImg.startsWith("data:") ? "Imagem local carregada" : estudoImg}
                          onChange={(e) => {
                            if (!estudoImg.startsWith("data:")) {
                              setEstudoImg(e.target.value);
                            } else {
                              setEstudoImg("");
                            }
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                        />
                        {estudoImg && (
                          <div className="w-full h-24 rounded-lg overflow-hidden border border-border-subtle">
                            <img src={estudoImg} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-soft-blue-500 text-white font-semibold shadow-sm hover:bg-soft-blue-600 transition-colors cursor-pointer"
                    >
                      {estudoId ? "Atualizar Tema" : "Salvar Tema"}
                    </button>
                  </form>
                </div>

                {/* 2. Lista de Temas Cadastrados */}
                <div className="p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-sm col-span-2 space-y-4">
                  <h3 className="text-base font-bold font-serif text-gray-800 dark:text-white border-b border-border-subtle pb-3">
                    Estudos Temáticos Cadastrados ({estudosTematicos.length})
                  </h3>

                  <div className="grid gap-3 max-h-[480px] overflow-y-auto pr-1">
                    {estudosTematicos.length > 0 ? (
                      estudosTematicos.map((estudo) => {
                        const hasSelected = selectedEstudoParaLicoes?.id === estudo.id;
                        return (
                          <div
                            key={estudo.id}
                            className={`p-4 rounded-2xl border transition-all flex items-center justify-between text-xs ${
                              hasSelected
                                ? "border-soft-blue-400 bg-soft-blue-500/[0.02]"
                                : "border-border-subtle bg-gray-50/50 dark:bg-gray-800/20 hover:bg-gray-100/50"
                            }`}
                          >
                            <div className="flex items-center space-x-3.5">
                              <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-900 border border-border-subtle flex items-center justify-center shadow-sm">
                                {estudo.ico === "Compass" && <Compass className="w-4 h-4 text-soft-blue-500" />}
                                {estudo.ico === "Shield" && <Shield className="w-4 h-4 text-soft-blue-500" />}
                                {estudo.ico === "BookMarked" && <BookMarked className="w-4 h-4 text-soft-blue-500" />}
                                {estudo.ico === "Heart" && <Heart className="w-4 h-4 text-soft-blue-500" />}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-300">
                                  {estudo.titulo}
                                </h4>
                                <p className="text-[10px] text-gray-400 mt-0.5">
                                  {estudo.categoria} • {estudo.licoes.length} Lições
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => setSelectedEstudoParaLicoes(estudo)}
                                className={`px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                                  hasSelected
                                    ? "bg-soft-blue-500 text-white shadow-sm"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-350 hover:bg-soft-blue-500/10 hover:text-soft-blue-500"
                                }`}
                              >
                                {hasSelected ? "Gerenciando" : "Ver Lições"}
                              </button>
                              <button
                                onClick={() => startEditEstudo(estudo)}
                                className="p-2 rounded-lg hover:bg-soft-blue-500/10 text-soft-blue-500 transition-all cursor-pointer"
                                title="Editar estudo"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Tem certeza que deseja excluir o estudo "${estudo.titulo}"?`)) {
                                    excluirEstudo(estudo.id);
                                    if (hasSelected) setSelectedEstudoParaLicoes(null);
                                    showSuccess("Estudo removido!");
                                  }
                                }}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all cursor-pointer"
                                title="Excluir estudo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-8">
                        Nenhum estudo temático cadastrado.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. SUB-PAINEL: GERENCIAMENTO DE LIÇÕES (Apenas se estudo selecionado) */}
              {selectedEstudoParaLicoes && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-sm space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-soft-blue-500 uppercase tracking-widest block mb-0.5">
                        GERENCIAR LIÇÕES DO TEMA
                      </span>
                      <h4 className="text-lg font-bold font-serif text-gray-800 dark:text-white">
                        {selectedEstudoParaLicoes.titulo}
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedEstudoParaLicoes(null);
                        setLicaoId(null);
                        setLicaoTitle("");
                        setLicaoIntro("");
                        setLicaoContent("");
                        setLicaoPassagens("");
                        setLicaoReflexao("");
                        setLicaoOracao("");
                      }}
                      className="p-1.5 rounded-lg border border-border-subtle hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors flex items-center space-x-1 text-xs cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Fechar</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Formulário de Lição */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border-subtle/80 pb-2">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {licaoId ? "✍️ Editar Lição" : "Adicionar Lição"}
                        </span>
                        {licaoId && (
                          <button
                            onClick={() => {
                              setLicaoId(null);
                              setLicaoTitle("");
                              setLicaoIntro("");
                              setLicaoContent("");
                              setLicaoPassagens("");
                              setLicaoReflexao("");
                              setLicaoOracao("");
                            }}
                            className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleSaveLicao} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="font-semibold text-gray-500">Título da Lição *</label>
                          <input
                            required
                            type="text"
                            placeholder="Ex: O Cuidado de um Pai"
                            value={licaoTitle}
                            onChange={(e) => setLicaoTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-500">Introdução (Frase Curta) *</label>
                          <input
                            required
                            type="text"
                            placeholder="Frase motivadora ou de impacto..."
                            value={licaoIntro}
                            onChange={(e) => setLicaoIntro(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-500">Conteúdo Teológico/Estudo *</label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Escreva a lição completa..."
                            value={licaoContent}
                            onChange={(e) => setLicaoContent(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500 font-serif text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-500">Versículos Chave (Separados por vírgula) *</label>
                          <input
                            required
                            type="text"
                            placeholder="Ex: Mateus 6:25-26, 1 Pedro 5:7"
                            value={licaoPassagens}
                            onChange={(e) => setLicaoPassagens(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-500">Perguntas de Reflexão (Uma por linha) *</label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Escreva cada pergunta em uma linha separada..."
                            value={licaoReflexao}
                            onChange={(e) => setLicaoReflexao(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-500">Guia de Oração Dirigida *</label>
                          <textarea
                            required
                            rows={2}
                            placeholder="Escreva a oração final recomendada..."
                            value={licaoOracao}
                            onChange={(e) => setLicaoOracao(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-gray-50/50 dark:bg-gray-800/40 focus:outline-none focus:border-soft-blue-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-lg bg-soft-blue-500 text-white font-semibold hover:bg-soft-blue-600 transition-colors shadow-sm cursor-pointer"
                        >
                          {licaoId ? "Atualizar Lição" : "Salvar Lição"}
                        </button>
                      </form>
                    </div>

                    {/* Grade de Lições Cadastradas */}
                    <div className="col-span-2 space-y-3">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block border-b border-border-subtle/80 pb-2">
                        Grade de Lições do Tema ({selectedEstudoParaLicoes.licoes.length})
                      </span>

                      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                        {selectedEstudoParaLicoes.licoes.length > 0 ? (
                          selectedEstudoParaLicoes.licoes.map((l, index) => (
                            <div
                              key={l.id}
                              className="p-4 rounded-xl bg-gray-50/50 dark:bg-gray-850/40 border border-border-subtle flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500 text-[10px]">
                                  {index + 1}
                                </div>
                                <div>
                                  <h5 className="font-bold text-gray-800 dark:text-gray-200">
                                    {l.titulo}
                                  </h5>
                                  <p className="text-[10px] text-gray-400 mt-0.5 max-w-sm truncate">
                                    {l.introducao}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={() => startEditLicao(l)}
                                  className="p-1.5 rounded hover:bg-soft-blue-500/10 text-soft-blue-500 cursor-pointer"
                                  title="Editar lição"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Tem certeza que deseja excluir a lição "${l.titulo}"?`)) {
                                      handleDeletarLicao(l.id);
                                    }
                                  }}
                                  className="p-1.5 rounded hover:bg-red-500/10 text-red-500 cursor-pointer"
                                  title="Excluir lição"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-450 text-center py-10 italic">
                            Nenhuma lição adicionada a este tema ainda. Adicione a primeira lição ao lado!
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
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
                                 <div className="flex flex-col space-y-1">
                                   <span className="bg-soft-blue-50 dark:bg-soft-blue-900/20 text-soft-blue-500 px-2 py-0.5 rounded-full font-bold text-[10px] w-max">
                                     🌐 Mural Público
                                   </span>
                                   {p.aprovado ? (
                                     <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold">
                                       ✓ Aprovado
                                     </span>
                                   ) : (
                                     <span className="text-[10px] text-amber-500 dark:text-amber-400 font-semibold animate-pulse">
                                       ⏳ Pendente
                                     </span>
                                   )}
                                 </div>
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
                               <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                 {!p.privado && (
                                   <button
                                     onClick={() => {
                                       aprovarPedidoOracao(p.id, !p.aprovado);
                                       showSuccess(p.aprovado ? "Pedido ocultado do mural!" : "Pedido aprovado e publicado no mural!");
                                     }}
                                     className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                       p.aprovado
                                         ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/25"
                                         : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                                     }`}
                                   >
                                     {p.aprovado ? "Ocultar" : "Aprovar"}
                                   </button>
                                 )}
                                 <button
                                   onClick={() => atenderPedidoOracao(p.id, !p.atendido)}
                                   className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                     p.atendido
                                       ? "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200"
                                       : "bg-soft-blue-500 text-white hover:bg-soft-blue-600"
                                   }`}
                                 >
                                   {p.atendido ? "Pendente" : "Intercedido"}
                                 </button>
                                 <button
                                   onClick={() => { if(confirm("Deseja realmente excluir este pedido?")) { excluirPedidoOracao(p.id); showSuccess("Pedido de oração excluído!"); } }}
                                   className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                                   title="Excluir Pedido"
                                 >
                                   <Trash2 className="w-3.5 h-3.5" />
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
