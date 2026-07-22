"use client";

import { useApp } from "@/context/AppContext";
import { Phone, Mail, MapPin, CheckCircle, Send, Heart, MessageCircle, HeartHandshake, User, PlusCircle, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PedidoOracao } from "@/lib/mockData";

export default function ContactAndForms() {
  const { pedidosOracao, enviarPedidoOracao, darAmen, adicionarComentario, motivos } = useApp();
  
  // Input da oração rápida
  const [quickMsg, setQuickMsg] = useState("");
  
  // States para Form Modal
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [privado, setPrivado] = useState(false); // false = mural público, true = apenas pastores
  const [motivo, setMotivo] = useState("");
  const [enviado, setEnviado] = useState(false);

  // Inicializa o motivo padrão
  useState(() => {
    if (motivos && motivos.length > 0) {
      setMotivo(motivos[0]);
    }
  });

  // States para Comentários (id da oração ativa)
  const [activeCommentsId, setActiveCommentsId] = useState<string | null>(null);
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Filtra apenas orações públicas para o mural
  const oracoesPublicas = pedidosOracao.filter(x => !x.privado);

  const handleOpenForm = () => {
    if (!quickMsg.trim()) return;
    setIsOpenModal(true);
  };

  const handleFullSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsg.trim()) return;

    enviarPedidoOracao(
      anonimo ? "Anônimo" : nome,
      tel,
      quickMsg,
      anonimo,
      privado,
      motivo || motivos[0] || "Outros"
    );

    setEnviado(true);
    setTimeout(() => {
      setQuickMsg("");
      setNome("");
      setTel("");
      setAnonimo(false);
      setPrivado(false);
      setEnviado(false);
      setIsOpenModal(false);
    }, 3000);
  };

  const handleAddComment = (e: React.FormEvent, poId: string) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    adicionarComentario(poId, newCommentAuthor || "Membro", newCommentText);
    setNewCommentText("");
    setNewCommentAuthor("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      
      {/* Cabeçalho */}
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold text-soft-blue-500 uppercase tracking-widest flex items-center justify-center space-x-1">
          <Heart className="w-4 h-4 text-red-400 fill-red-400" />
          <span>PORTAL DE INTERCESSÃO</span>
        </span>
        <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">
          Mural de Orações
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus." <span className="block mt-1 font-semibold text-gold-500">— Filipenses 4:6</span>
        </p>
      </div>

      {/* Caixa de Texto de Oração Rápida (Estilo Bíblia Online) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex items-center space-x-3">
        <input
          type="text"
          placeholder="Descreva seu pedido de oração..."
          value={quickMsg}
          onChange={(e) => setQuickMsg(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleOpenForm(); }}
          className="flex-1 px-4 py-3.5 rounded-2xl bg-gray-55/50 border border-border-subtle text-sm focus:border-soft-blue-500 focus:outline-none transition-colors"
        />
        <button
          onClick={handleOpenForm}
          className="w-12 h-12 rounded-2xl bg-soft-blue-500 hover:bg-soft-blue-600 text-white flex items-center justify-center transition-all hover:scale-105 duration-300 shadow-sm"
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </div>

      {/* MODAL CONFIGURAÇÃO DO ENVIO */}
      <AnimatePresence>
        {isOpenModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-card-bg border border-border-subtle p-6 rounded-3xl shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h3 className="text-base font-bold font-serif text-gray-800 dark:text-white">
                  Detalhes do Pedido de Oração
                </h3>
                <button
                  onClick={() => setIsOpenModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  ✕
                </button>
              </div>

              <AnimatePresence mode="wait">
                {enviado ? (
                  <motion.div
                    key="modal-success"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-10 text-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-bold text-green-600 font-serif">Pedido Registrado!</h4>
                    <p className="text-xs text-gray-400">
                      {privado 
                        ? "Seu pedido privado foi enviado à liderança e ficará guardado com carinho." 
                        : "Seu pedido de oração agora está disponível no mural de intercessão da comunidade."}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFullSubmit} className="space-y-4 text-xs">
                    
                    {/* Visualização Rápida da Oração */}
                    <div className="p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border border-border-subtle text-[11px] text-gray-600 dark:text-gray-400 italic">
                      "{quickMsg}"
                    </div>

                    {/* Seleção do Motivo */}
                    <div className="space-y-1 bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-2xl border border-border-subtle">
                      <label className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Qual o motivo da oração? *</label>
                      <select
                        value={motivo || (motivos && motivos[0]) || ""}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-card-bg text-gray-700 dark:text-gray-300 focus:outline-none"
                      >
                        {motivos.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>

                    {/* Toggle Anonimato */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-border-subtle">
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Pedir anonimamente?</p>
                        <p className="text-[9px] text-gray-400">Se ativo, seu nome não será exibido no mural.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextVal = !anonimo;
                          setAnonimo(nextVal);
                          if (nextVal) setNome("");
                        }}
                        className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors duration-300 focus:outline-none ${
                          anonimo ? "bg-soft-blue-500 justify-end" : "bg-gray-200 dark:bg-gray-700 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    {/* Toggle Privacidade */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30 border border-border-subtle">
                      <div>
                        <p className="font-semibold text-gray-700 dark:text-gray-300">Pedido Privado?</p>
                        <p className="text-[9px] text-gray-400">Se ativo, apenas os pastores visualizarão no painel admin.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrivado(!privado)}
                        className={`w-10 h-6 rounded-full p-1 flex items-center transition-colors duration-300 focus:outline-none ${
                          privado ? "bg-gold-500 justify-end" : "bg-gray-200 dark:bg-gray-700 justify-start"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>

                    {/* Inputs de Informação (se não for anônimo) */}
                    <AnimatePresence>
                      {!anonimo && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3.5 overflow-hidden"
                        >
                          <div className="space-y-1">
                            <label className="font-semibold text-gray-500">Seu Nome *</label>
                            <input
                              required={!anonimo}
                              type="text"
                              placeholder="Digite seu nome"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-gray-55/50 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-semibold text-gray-500">Telefone / WhatsApp (Opcional)</label>
                            <input
                              type="tel"
                              placeholder="(00) 90000-0000"
                              value={tel}
                              onChange={(e) => setTel(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-border-subtle bg-gray-55/50 focus:outline-none"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-2xl bg-soft-blue-500 text-white font-bold flex items-center justify-center space-x-1 hover:bg-soft-blue-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Confirmar e Enviar Pedido</span>
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ORAÇÕES DA COMUNIDADE (Listagem Pública Estilo Bíblia Online) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-bold font-serif text-gray-800 dark:text-white">
              Orações da Comunidade
            </h3>
            <span className="text-[10px] bg-soft-blue-50 dark:bg-soft-blue-900/25 text-soft-blue-500 font-bold px-2 py-0.5 rounded-full border border-soft-blue-100">
              {oracoesPublicas.length} PEDIDOS NO MURAL
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {oracoesPublicas.length > 0 ? (
            oracoesPublicas.map((po) => {
              const showComments = activeCommentsId === po.id;
              const initials = po.anonimo 
                ? "A" 
                : (po.nome || "M").split(" ").map(w => w.charAt(0)).slice(0, 2).join("").toUpperCase();
              
              return (
                <motion.div
                  key={po.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl bg-card-bg border border-border-subtle shadow-[0_8px_30px_rgb(0,0,0,0.01)] space-y-4"
                >
                  {/* Autor Info */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                      po.anonimo ? "bg-gray-400" : "bg-soft-blue-400"
                    }`}>
                      {initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                        {po.anonimo ? "Membro Anônimo" : po.nome}
                      </h4>
                      <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                        há {po.data === "2026-07-16" ? "1 dia" : po.data === "2026-07-17" ? "algumas horas" : "3 dias"}
                      </p>
                    </div>
                  </div>

                  {/* Mensagem da Oração */}
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 italic font-serif leading-relaxed pl-1">
                    "{po.mensagem}"
                  </p>

                  {/* Ações (Amém e Comentários) */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border-subtle/60 text-xs">
                    
                    {/* Botão Amém */}
                    <div className="flex items-center space-x-3.5">
                      <button
                        onClick={() => darAmen(po.id)}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gray-55/60 border border-border-subtle hover:bg-soft-blue-500 hover:text-white hover:border-soft-blue-500 transition-colors font-bold text-gray-600 dark:text-gray-400 shadow-sm"
                      >
                        <span>🙏</span>
                        <span>Orei por você</span>
                      </button>

                      {po.amens > 0 && (
                        <div className="flex items-center space-x-1 text-[10px] text-gray-400 font-semibold">
                          {/* Avatares Pequenos */}
                          <div className="flex -space-x-1.5 overflow-hidden">
                            <span className="w-4 h-4 rounded-full bg-indigo-200 border border-card-bg flex items-center justify-center text-[7px] text-indigo-700 font-bold">N</span>
                            <span className="w-4 h-4 rounded-full bg-amber-200 border border-card-bg flex items-center justify-center text-[7px] text-amber-700 font-bold">D</span>
                          </div>
                          <span>{po.amens} oraram por você</span>
                        </div>
                      )}
                    </div>

                    {/* Botão Comentários */}
                    <button
                      onClick={() => setActiveCommentsId(showComments ? null : po.id)}
                      className="flex items-center space-x-1.5 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 font-semibold"
                    >
                      <MessageCircle className="w-4 h-4 text-soft-blue-500" />
                      <span>{po.comentarios ? po.comentarios.length : 0} Comentários</span>
                    </button>
                  </div>

                  {/* Expand de Comentários */}
                  <AnimatePresence>
                    {showComments && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border-subtle/60 space-y-4 overflow-hidden"
                      >
                        {/* Listagem de Comentários */}
                        <div className="space-y-3">
                          {po.comentarios && po.comentarios.length > 0 ? (
                            po.comentarios.map((c) => (
                              <div key={c.id} className="p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-800/40 border border-border-subtle text-xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-gray-700 dark:text-gray-300">{c.autor}</span>
                                  <span className="text-[9px] text-gray-400">{c.data}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-serif">
                                  {c.texto}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-gray-400 italic text-center py-2">
                              Nenhum comentário motivacional enviado ainda. Deixe uma palavra de fé!
                            </p>
                          )}
                        </div>

                        {/* Formulário de Comentário */}
                        <form onSubmit={(e) => handleAddComment(e, po.id)} className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-2 text-xs">
                          <input
                            type="text"
                            required
                            placeholder="Deixe uma palavra de fé / encorajamento..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            className="sm:col-span-8 px-3.5 py-2.5 rounded-xl bg-gray-55/40 border border-border-subtle focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Seu nome"
                            value={newCommentAuthor}
                            onChange={(e) => setNewCommentAuthor(e.target.value)}
                            className="sm:col-span-3 px-3.5 py-2.5 rounded-xl bg-gray-55/40 border border-border-subtle focus:outline-none"
                          />
                          <button
                            type="submit"
                            className="sm:col-span-1 py-2.5 rounded-xl bg-soft-blue-500 hover:bg-soft-blue-600 text-white flex items-center justify-center font-bold"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })
          ) : (
            <p className="text-sm text-gray-400 text-center py-10">Nenhum pedido de oração público cadastrado no mural.</p>
          )}
        </div>
      </div>

    </div>
  );
}
