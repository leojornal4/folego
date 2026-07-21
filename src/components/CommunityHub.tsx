"use client";

import { useApp } from "@/context/AppContext";
import { Calendar, MapPin, Share2, Compass, AlertCircle, Image as ImageIcon, Video, Grid, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CommunityHub() {
  const { eventos, avisos, noticias, galeria } = useApp();
  
  const [activeSubTab, setActiveSubTab] = useState<"eventos" | "avisos" | "noticias" | "galeria">("eventos");
  const [selectedNoticia, setSelectedNoticia] = useState<any | null>(null);
  const [activeGaleriaFilter, setActiveGaleriaFilter] = useState<string>("Todos");
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  // Filtra galeria
  const categoriasGaleria = ["Todos", ...new Set(galeria.map(x => x.categoria))];
  const filteredGaleria = activeGaleriaFilter === "Todos" 
    ? galeria 
    : galeria.filter(x => x.categoria === activeGaleriaFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Cabeçalho da Seção */}
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold text-soft-blue-500 uppercase tracking-widest">
          COMUNICAÇÃO OFICIAL
        </span>
        <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">
          Mural do Mês
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Fique por dentro de todos os eventos, comunicados oficiais, notícias dos projetos sociais e momentos especiais registrados na nossa igreja.
        </p>
      </div>

      {/* Sub-Navegação de Categorias */}
      <div className="flex justify-center border-b border-border-subtle">
        <div className="flex space-x-6 overflow-x-auto pb-px">
          {(["eventos", "avisos", "noticias"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveSubTab(tab);
                setSelectedNoticia(null);
              }}
              className={`pb-3 text-sm font-medium border-b-2 transition-all capitalize whitespace-nowrap px-1 ${
                activeSubTab === tab
                  ? "border-soft-blue-500 text-soft-blue-500 font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab === "noticias" ? "Notícias" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Renderização das Sub-Seções */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* 1. EVENTOS */}
          {activeSubTab === "eventos" && (
            <motion.div
              key="eventos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="rounded-3xl bg-card-bg border border-border-subtle overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.01)] group hover:shadow-[0_15px_40px_rgba(45,90,136,0.04)] transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={evento.imagemUrl}
                      alt={evento.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white font-serif group-hover:text-soft-blue-500 transition-colors">
                        {evento.titulo}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {evento.descricao}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-border-subtle/50 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4.5 h-4.5 text-soft-blue-500/80" />
                        <span>{evento.data}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4.5 h-4.5 text-soft-blue-500/80" />
                        <span>{evento.local}</span>
                      </div>
                    </div>

                    <button className="w-full text-center py-2.5 rounded-xl border border-border-subtle text-xs font-semibold hover:border-soft-blue-500 hover:text-soft-blue-500 transition-colors">
                      Saiba Mais / Inscrever-se
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 2. AVISOS */}
          {activeSubTab === "avisos" && (
            <motion.div
              key="avisos"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4 max-w-3xl mx-auto"
            >
              {avisos.map((aviso) => (
                <div
                  key={aviso.id}
                  className="p-5 rounded-2xl bg-card-bg border border-border-subtle flex items-start space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                >
                  <div className="p-2.5 rounded-xl bg-soft-blue-50 dark:bg-soft-blue-900/10 text-soft-blue-500">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gold-600 dark:text-gold-400 uppercase tracking-widest bg-gold-50 dark:bg-gold-500/10 px-2 py-0.5 rounded-md border border-gold-200/20">
                        {aviso.categoria}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {aviso.data}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white">
                      {aviso.titulo}
                    </h3>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 3. NOTÍCIAS */}
          {activeSubTab === "noticias" && (
            <motion.div
              key="noticias"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              {!selectedNoticia ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {noticias.map((noticia) => (
                    <div
                      key={noticia.id}
                      onClick={() => setSelectedNoticia(noticia)}
                      className="rounded-3xl border border-border-subtle bg-card-bg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col h-full group"
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        <img
                          src={noticia.imagemUrl}
                          alt={noticia.titulo}
                          className="w-full h-full object-cover transition-transform duration-555 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                        <div className="space-y-2">
                          <span className="text-[10px] text-soft-blue-500 font-bold uppercase tracking-wider">
                            {noticia.data}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold font-serif text-gray-800 dark:text-white group-hover:text-soft-blue-500 transition-colors">
                            {noticia.titulo}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">
                            {noticia.resumo}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 text-xs font-bold text-soft-blue-500 pt-2">
                          <span>Ler notícia completa</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Detalhe da Notícia */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 bg-card-bg p-6 sm:p-10 rounded-3xl border border-border-subtle shadow-sm"
                >
                  <button
                    onClick={() => setSelectedNoticia(null)}
                    className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-soft-blue-500 transition-colors font-bold uppercase tracking-wider"
                  >
                    <span>← Voltar para lista de notícias</span>
                  </button>

                  <div className="space-y-3">
                    <span className="text-xs text-soft-blue-500 font-semibold uppercase">
                      Publicado em {selectedNoticia.data}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-800 dark:text-white leading-tight">
                      {selectedNoticia.titulo}
                    </h1>
                  </div>

                  <div className="w-full h-64 sm:h-[400px] overflow-hidden rounded-2xl">
                    <img
                      src={selectedNoticia.imagemUrl}
                      alt={selectedNoticia.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Conteúdo HTML */}
                  <div
                    className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-serif leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: selectedNoticia.conteudo }}
                  />

                  {/* Galeria de Fotos Anexas */}
                  {selectedNoticia.galeria && selectedNoticia.galeria.length > 0 && (
                    <div className="pt-6 border-t border-border-subtle">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                        Galeria de Fotos do Evento
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {selectedNoticia.galeria.map((imgUrl: string, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => setLightboxItem({ url: imgUrl, titulo: `Galeria Notícia - Imagem ${idx + 1}` })}
                            className="h-24 sm:h-32 rounded-xl overflow-hidden cursor-pointer border border-border-subtle hover:scale-[1.03] transition-transform duration-300"
                          >
                            <img
                              src={imgUrl}
                              alt="Galeria"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 4. GALERIA */}
          {activeSubTab === "galeria" && (
            <motion.div
              key="galeria"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Filtros da Galeria */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {categoriasGaleria.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveGaleriaFilter(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      activeGaleriaFilter === cat
                        ? "bg-soft-blue-500 text-white border-soft-blue-500 shadow-sm"
                        : "border-border-subtle text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 bg-card-bg"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid de Imagens/Vídeos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredGaleria.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxItem(item)}
                    className="group relative h-40 sm:h-52 rounded-3xl overflow-hidden border border-border-subtle bg-gray-100 dark:bg-gray-800 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:scale-[1.02] transition-transform duration-300"
                  >
                    <img
                      src={item.url}
                      alt={item.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Overlay Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <span className="text-[9px] font-bold text-gold-300 uppercase tracking-widest">
                        {item.categoria}
                      </span>
                      <h4 className="text-xs font-semibold text-white truncate font-serif mt-0.5">
                        {item.titulo}
                      </h4>
                      {item.tipo === "video" && (
                        <div className="absolute top-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                          <Video className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Lightbox para Imagens da Galeria */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 text-white text-2xl p-2 hover:bg-white/10 rounded-full"
            >
              ✕
            </button>
            <div className="max-w-4xl max-h-[75vh] overflow-hidden rounded-2xl border border-white/10">
              <img
                src={lightboxItem.url}
                alt={lightboxItem.titulo}
                className="max-w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white space-y-1">
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">
                {lightboxItem.categoria || "Galeria"}
              </span>
              <h3 className="text-sm sm:text-base font-serif font-semibold">
                {lightboxItem.titulo}
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
