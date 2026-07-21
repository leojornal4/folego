"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getDb,
  LocalDatabase,
  Versiculo,
  Frase,
  Oracao,
  Curiosidade,
  Pergunta,
  Desafio,
  LeituraProgramada,
  Devocional,
  Evento,
  Aviso,
  Noticia,
  GaleriaItem,
  Pastor,
  Ministerio,
  PedidoOracao,
  PedidoVisita,
  getCurrentLocalDateString
} from "@/lib/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export type TabType = "diario" | "leitura" | "comunidade" | "igreja" | "contato" | "admin";

interface AppContextProps {
  // Database instance
  db: LocalDatabase | null;
  
  // Navigation & Theme
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  
  // Daily Rotated Content (based on selectedDate)
  versiculo: Versiculo | null;
  frase: Frase | null;
  oracao: Oracao | null;
  curiosidade: Curiosidade | null;
  pergunta: Pergunta | null;
  desafio: Desafio | null;
  leituraHoje: LeituraProgramada | null;
  devocionalHoje: Devocional | null;
  
  // Lists from DB (to support dynamic updates)
  leituras: LeituraProgramada[];
  devocionais: Devocional[];
  eventos: Evento[];
  avisos: Aviso[];
  noticias: Noticia[];
  galeria: GaleriaItem[];
  pastores: Pastor[];
  ministerios: Ministerio[];
  pedidosOracao: PedidoOracao[];
  pedidosVisita: PedidoVisita[];
  acessos: number;
  motivos: string[];
  
  // User Actions / State
  marcarLeituraConcluida: (date: string, concluida: boolean) => void;
  progressoLeitura: { [date: string]: boolean };
  recarregarDados: () => void;
  
  // Form submissions
  enviarPedidoOracao: (nome: string, telefone: string, mensagem: string, anonimo: boolean, privado: boolean, motivo: string) => void;
  enviarPedidoVisita: (nome: string, telefone: string, endereco: string, mensagem: string) => void;
  darAmen: (id: string) => void;
  adicionarComentario: (pedidoId: string, autor: string, texto: string) => void;
  excluirPedidoOracao: (id: string) => void;
  excluirComentarioOracao: (pedidoId: string, comentarioId: string) => void;
  salvarMotivos: (motivos: string[]) => void;
  
  // Admin Operations
  adicionarLeitura: (l: LeituraProgramada) => void;
  adicionarDevocional: (d: Devocional) => void;
  adicionarEvento: (e: Omit<Evento, "id">) => void;
  adicionarAviso: (a: Omit<Aviso, "id">) => void;
  adicionarNoticia: (n: Omit<Noticia, "id">) => void;
  atenderPedidoOracao: (id: string, atendido: boolean) => void;
  atenderPedidoVisita: (id: string, atendido: boolean) => void;
  editarEvento: (e: Evento) => void;
  excluirEvento: (id: string) => void;
  editarAviso: (a: Aviso) => void;
  excluirAviso: (id: string) => void;
  editarNoticia: (n: Noticia) => void;
  excluirNoticia: (id: string) => void;
  excluirLeitura: (data: string) => void;
  excluirDevocional: (data: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<TabType>("diario");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [db, setDb] = useState<LocalDatabase | null>(null);

  // Lists in state to trigger re-renders
  const [versiculo, setVersiculo] = useState<Versiculo | null>(null);
  const [frase, setFrase] = useState<Frase | null>(null);
  const [oracao, setOracao] = useState<Oracao | null>(null);
  const [curiosidade, setCuriosidade] = useState<Curiosidade | null>(null);
  const [pergunta, setPergunta] = useState<Pergunta | null>(null);
  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [leituraHoje, setLeituraHoje] = useState<LeituraProgramada | null>(null);
  const [devocionalHoje, setDevocionalHoje] = useState<Devocional | null>(null);

  const [leituras, setLeituras] = useState<LeituraProgramada[]>([]);
  const [devocionais, setDevocionais] = useState<Devocional[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [galeria, setGaleria] = useState<GaleriaItem[]>([]);
  const [pastores, setPastores] = useState<Pastor[]>([]);
  const [ministerios, setMinisterios] = useState<Ministerio[]>([]);
  const [pedidosOracao, setPedidosOracao] = useState<PedidoOracao[]>([]);
  const [pedidosVisita, setPedidosVisita] = useState<PedidoVisita[]>([]);
  const [progressoLeitura, setProgressoLeitura] = useState<{ [date: string]: boolean }>({});
  const [acessos, setAcessos] = useState<number>(0);
  const [motivos, setMotivos] = useState<string[]>([]);

  // Sincronização assíncrona do Supabase
  const syncFromSupabase = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      // 1. Leituras Diárias
      const { data: remoteLeituras } = await supabase.from("leituras_diarias").select("*");
      if (remoteLeituras) {
        const formatted: LeituraProgramada[] = remoteLeituras.map(r => ({
          data: r.data,
          leituras: r.leituras,
          tempoEstimado: r.tempo_estimado,
          trechoBiblico: r.trecho_biblico
        }));
        setLeituras(formatted);
        const match = formatted.find(x => x.data === selectedDate);
        if (match) setLeituraHoje(match);
      }

      // 2. Devocionais
      const { data: remoteDevocionais } = await supabase.from("devocionais").select("*");
      if (remoteDevocionais) {
        setDevocionais(remoteDevocionais);
        const match = remoteDevocionais.find(x => x.data === selectedDate);
        if (match) setDevocionalHoje(match);
      }

      // 3. Eventos
      const { data: remoteEventos } = await supabase.from("eventos").select("*");
      if (remoteEventos) setEventos(remoteEventos);

      // 4. Avisos
      const { data: remoteAvisos } = await supabase.from("avisos").select("*");
      if (remoteAvisos) setAvisos(remoteAvisos);

      // 5. Notícias
      const { data: remoteNoticias } = await supabase.from("noticias").select("*");
      if (remoteNoticias) {
        const formattedNoticias: Noticia[] = remoteNoticias.map(n => ({
          id: n.id,
          titulo: n.titulo,
          resumo: n.resumo,
          conteudo: n.conteudo,
          imagemUrl: n.imagem_url,
          galeria: n.galeria || [],
          data: n.data
        }));
        setNoticias(formattedNoticias);
      }

      // 6. Pedidos de Oração
      const { data: remotePedidosOracao } = await supabase.from("pedidos_oracao").select("*").order("data", { ascending: false });
      if (remotePedidosOracao) setPedidosOracao(remotePedidosOracao);

      // 7. Pedidos de Visita
      const { data: remotePedidosVisita } = await supabase.from("pedidos_visita").select("*").order("data", { ascending: false });
      if (remotePedidosVisita) setPedidosVisita(remotePedidosVisita);

      // 8. Acessos
      const { data: remoteAcessos } = await supabase.from("acessos").select("contador").eq("id", "total_pageviews").single();
      if (remoteAcessos) setAcessos(remoteAcessos.contador);
    } catch (err) {
      console.error("Erro Supabase Sync:", err);
    }
  };

  // Incremento do contador de acessos
  const incrementAcessosCount = async (database: LocalDatabase) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from("acessos").select("contador").eq("id", "total_pageviews").single();
        const current = data?.contador || 0;
        const next = current + 1;
        await supabase.from("acessos").update({ contador: next }).eq("id", "total_pageviews");
        setAcessos(next);
      } catch (err) {
        console.error("Erro ao incrementar acessos no Supabase:", err);
      }
    } else {
      const next = database.incrementarAcessos();
      setAcessos(next);
    }
  };

  // Initialize DB and settings on mount
  useEffect(() => {
    const database = getDb();
    setDb(database);
    
    // Theme initialization
    const storedTheme = localStorage.getItem("church_portal_theme");
    if (storedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }

    // Set default date to today
    const today = getCurrentLocalDateString();
    setSelectedDate(today);

    // Contagem de Acesso
    incrementAcessosCount(database);
  }, []);

  // Fetch or update rotated contents when date or DB changes
  useEffect(() => {
    if (!db || !selectedDate) return;
    
    setVersiculo(db.getVersiculoDoDia(selectedDate));
    setFrase(db.getFraseDoDia(selectedDate));
    setOracao(db.getOracaoDoDia(selectedDate));
    setCuriosidade(db.getCuriosidadeDoDia(selectedDate));
    setPergunta(db.getPerguntaDoDia(selectedDate));
    setDesafio(db.getDesafioDoDia(selectedDate));
    
    // Get schedule (Fallback local)
    setLeituraHoje(db.getLeituraDaData(selectedDate));
    setDevocionalHoje(db.getDevocionalDaData(selectedDate));
    
    // Reload local list properties
    setLeituras(db.getLeituras());
    setDevocionais(db.getDevocionais());
    setEventos(db.getEventos());
    setAvisos(db.getAvisos());
    setNoticias(db.getNoticias());
    setGaleria(db.getGaleria());
    setPastores(db.getPastores());
    setMinisterios(db.getMinisterios());
    setPedidosOracao(db.getPedidosOracao());
    setPedidosVisita(db.getPedidosVisita());
    setProgressoLeitura(db.getProgressoLeitura());
    setMotivos(db.getMotivosOracao());

    // Se estiver usando o Supabase, tenta atualizar do remoto
    if (isSupabaseConfigured) {
      syncFromSupabase();
    }
  }, [db, selectedDate]);

  // Recarregar dados manual
  const recarregarDados = () => {
    if (!db || !selectedDate) return;
    setLeituras(db.getLeituras());
    setDevocionais(db.getDevocionais());
    setEventos(db.getEventos());
    setAvisos(db.getAvisos());
    setNoticias(db.getNoticias());
    setGaleria(db.getGaleria());
    setPastores(db.getPastores());
    setMinisterios(db.getMinisterios());
    setPedidosOracao(db.getPedidosOracao());
    setPedidosVisita(db.getPedidosVisita());
    setProgressoLeitura(db.getProgressoLeitura());
    setMotivos(db.getMotivosOracao());
    
    setLeituraHoje(db.getLeituraDaData(selectedDate));
    setDevocionalHoje(db.getDevocionalDaData(selectedDate));

    if (isSupabaseConfigured) {
      syncFromSupabase();
    }
  };

  // Navigation override to scroll up
  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("church_portal_theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("church_portal_theme", "light");
    }
  };

  // User Actions
  const marcarLeituraConcluida = (date: string, concluida: boolean) => {
    if (!db) return;
    db.marcarLeituraConcluida(date, concluida);
    setProgressoLeitura(db.getProgressoLeitura());
  };

  const enviarPedidoOracao = async (nome: string, telefone: string, mensagem: string, anonimo: boolean, privado: boolean, motivo: string) => {
    if (!db) return;
    const newPo = db.addPedidoOracao({ nome, telefone, mensagem, anonimo, privado, motivo });
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("pedidos_oracao").insert(newPo);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Oracao:", err);
      }
    }
  };

  const darAmen = async (id: string) => {
    if (!db) return;
    db.darAmen(id);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        const item = db.getPedidosOracao().find(x => x.id === id);
        if (item) {
          await supabase.from("pedidos_oracao").update({ amens: item.amens }).eq("id", id);
        }
      } catch (err) {
        console.error("Erro Supabase darAmen:", err);
      }
    }
  };

  const adicionarComentario = async (pedidoId: string, autor: string, texto: string) => {
    if (!db) return;
    db.adicionarComentario(pedidoId, autor, texto);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        const item = db.getPedidosOracao().find(x => x.id === pedidoId);
        if (item) {
          await supabase.from("pedidos_oracao").update({ comentarios: item.comentarios }).eq("id", pedidoId);
        }
      } catch (err) {
        console.error("Erro Supabase adicionarComentario:", err);
      }
    }
  };

  const excluirPedidoOracao = async (id: string) => {
    if (!db) return;
    db.deletePedidoOracao(id);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("pedidos_oracao").delete().eq("id", id);
      } catch (err) {
        console.error("Erro Supabase Excluir Pedido Oração:", err);
      }
    }
  };

  const excluirComentarioOracao = async (pedidoId: string, comentarioId: string) => {
    if (!db) return;
    db.deleteComentarioOracao(pedidoId, comentarioId);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        const item = db.getPedidosOracao().find(x => x.id === pedidoId);
        if (item) {
          await supabase.from("pedidos_oracao").update({ comentarios: item.comentarios }).eq("id", pedidoId);
        }
      } catch (err) {
        console.error("Erro Supabase Excluir Comentário Oração:", err);
      }
    }
  };

  const salvarMotivos = (novosMotivos: string[]) => {
    if (!db) return;
    db.setMotivosOracao(novosMotivos);
    setMotivos(novosMotivos);
    recarregarDados();
  };

  const enviarPedidoVisita = async (nome: string, telefone: string, endereco: string, mensagem: string) => {
    if (!db) return;
    const newPv = db.addPedidoVisita({ nome, telefone, endereco, mensagem });
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("pedidos_visita").insert(newPv);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Visita:", err);
      }
    }
  };

  // Admin Actions
  const adicionarLeitura = async (l: LeituraProgramada) => {
    if (!db) return;
    db.addLeitura(l);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("leituras_diarias").upsert({
          data: l.data,
          leituras: l.leituras,
          tempo_estimado: l.tempoEstimado,
          trecho_biblico: l.trechoBiblico
        });
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Leitura:", err);
      }
    }
  };

  const adicionarDevocional = async (d: Devocional) => {
    if (!db) return;
    db.addDevocional(d);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("devocionais").upsert(d);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Devocional:", err);
      }
    }
  };

  const adicionarEvento = async (e: Omit<Evento, "id">) => {
    if (!db) return;
    const newEv = db.addEvento(e);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("eventos").insert(newEv);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Evento:", err);
      }
    }
  };

  const adicionarAviso = async (a: Omit<Aviso, "id">) => {
    if (!db) return;
    const newAv = db.addAviso(a);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("avisos").insert(newAv);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Aviso:", err);
      }
    }
  };

  const adicionarNoticia = async (n: Omit<Noticia, "id">) => {
    if (!db) return;
    const newNo = db.addNoticia(n);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("noticias").insert({
          id: newNo.id,
          titulo: newNo.titulo,
          resumo: newNo.resumo,
          conteudo: newNo.conteudo,
          imagem_url: newNo.imagemUrl,
          galeria: newNo.galeria,
          data: newNo.data
        });
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Noticia:", err);
      }
    }
  };

  const atenderPedidoOracao = async (id: string, atendido: boolean) => {
    if (!db) return;
    db.marcarPedidoOracaoAtendido(id, atendido);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("pedidos_oracao").update({ atendido }).eq("id", id);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Atender Oracao:", err);
      }
    }
  };

  const atenderPedidoVisita = async (id: string, atendido: boolean) => {
    if (!db) return;
    db.marcarPedidoVisitaAtendido(id, atendido);
    recarregarDados();

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("pedidos_visita").update({ atendido }).eq("id", id);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Atender Visita:", err);
      }
    }
  };

  const editarEvento = async (e: Evento) => {
    if (!db) return;
    db.updateEvento(e);
    recarregarDados();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("eventos").upsert(e);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Editar Evento:", err);
      }
    }
  };

  const excluirEvento = async (id: string) => {
    if (!db) return;
    db.deleteEvento(id);
    recarregarDados();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("eventos").delete().eq("id", id);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Excluir Evento:", err);
      }
    }
  };

  const editarAviso = async (a: Aviso) => {
    if (!db) return;
    db.updateAviso(a);
    recarregarDados();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("avisos").upsert(a);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Editar Aviso:", err);
      }
    }
  };

  const excluirAviso = async (id: string) => {
    if (!db) return;
    db.deleteAviso(id);
    recarregarDados();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("avisos").delete().eq("id", id);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Excluir Aviso:", err);
      }
    }
  };

  const editarNoticia = async (n: Noticia) => {
    if (!db) return;
    db.updateNoticia(n);
    recarregarDados();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("noticias").upsert({
          id: n.id,
          titulo: n.titulo,
          resumo: n.resumo,
          conteudo: n.conteudo,
          imagem_url: n.imagemUrl,
          galeria: n.galeria,
          data: n.data
        });
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Editar Noticia:", err);
      }
    }
  };

  const excluirNoticia = async (id: string) => {
    if (!db) return;
    db.deleteNoticia(id);
    recarregarDados();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("noticias").delete().eq("id", id);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Excluir Noticia:", err);
      }
    }
  };

  const excluirLeitura = async (data: string) => {
    if (!db) return;
    db.deleteLeitura(data);
    recarregarDados();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("leituras_programadas").delete().eq("data", data);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Excluir Leitura:", err);
      }
    }
  };

  const excluirDevocional = async (data: string) => {
    if (!db) return;
    db.deleteDevocional(data);
    recarregarDados();
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("devocionais").delete().eq("data", data);
        syncFromSupabase();
      } catch (err) {
        console.error("Erro Supabase Excluir Devocional:", err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        db,
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        theme,
        toggleTheme,
        
        versiculo,
        frase,
        oracao,
        curiosidade,
        pergunta,
        desafio,
        leituraHoje,
        devocionalHoje,
        
        leituras,
        devocionais,
        eventos,
        avisos,
        noticias,
        galeria,
        pastores,
        ministerios,
        pedidosOracao,
        pedidosVisita,
        acessos,
        motivos,
        
        marcarLeituraConcluida,
        progressoLeitura,
        recarregarDados,
        
        enviarPedidoOracao,
        enviarPedidoVisita,
        darAmen,
        adicionarComentario,
        excluirPedidoOracao,
        excluirComentarioOracao,
        salvarMotivos,
        
        adicionarLeitura,
        adicionarDevocional,
        adicionarEvento,
        adicionarAviso,
        adicionarNoticia,
        atenderPedidoOracao,
        atenderPedidoVisita,
        editarEvento,
        excluirEvento,
        editarAviso,
        excluirAviso,
        editarNoticia,
        excluirNoticia,
        excluirLeitura,
        excluirDevocional
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
