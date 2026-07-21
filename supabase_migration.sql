-- Script SQL de Migração para criar tabelas no Supabase PostgreSQL
-- Copie e cole este script no painel "SQL Editor" do seu projeto no Supabase

-- 1. Tabela de Leituras Diárias
CREATE TABLE IF NOT EXISTS public.leituras_diarias (
    data TEXT PRIMARY KEY, -- Formato YYYY-MM-DD
    leituras JSONB NOT NULL, -- Array de strings ex: ["Salmo 11", "Romanos 2"]
    tempo_estimado INTEGER DEFAULT 15,
    trecho_biblico TEXT -- Campo solicitado: Texto completo das escrituras
);

-- 2. Tabela de Devocionais / Reflexões
CREATE TABLE IF NOT EXISTS public.devocionais (
    data TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    texto TEXT NOT NULL, -- Conteúdo HTML
    aplicacao TEXT,
    oracao TEXT
);

-- 3. Tabela de Eventos
CREATE TABLE IF NOT EXISTS public.eventos (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT,
    data TEXT NOT NULL,
    local TEXT,
    imagem_url TEXT
);

-- 4. Tabela de Avisos
CREATE TABLE IF NOT EXISTS public.avisos (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    data TEXT
);

-- 5. Tabela de Notícias
CREATE TABLE IF NOT EXISTS public.noticias (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    resumo TEXT,
    conteudo TEXT NOT NULL,
    imagem_url TEXT,
    galeria JSONB,
    data TEXT NOT NULL
);

-- 6. Tabela de Pedidos de Oração
CREATE TABLE IF NOT EXISTS public.pedidos_oracao (
    id TEXT PRIMARY KEY,
    nome TEXT,
    telefone TEXT,
    mensagem TEXT NOT NULL,
    data TEXT NOT NULL,
    anonimo BOOLEAN DEFAULT FALSE,
    atendido BOOLEAN DEFAULT FALSE
);

-- 7. Tabela de Pedidos de Visita
CREATE TABLE IF NOT EXISTS public.pedidos_visita (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    endereco TEXT NOT NULL,
    mensagem TEXT,
    data TEXT NOT NULL,
    atendido BOOLEAN DEFAULT FALSE
);

-- 8. Tabela de Controle de Acessos à Página
CREATE TABLE IF NOT EXISTS public.acessos (
    id TEXT PRIMARY KEY DEFAULT 'total_pageviews',
    contador INTEGER DEFAULT 0
);

-- Habilitar acesso público para leitura em todas as tabelas (RLS Bypass Simples para desenvolvimento)
ALTER TABLE public.leituras_diarias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.devocionais DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_oracao DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos_visita DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.acessos DISABLE ROW LEVEL SECURITY;

-- Insere o registro inicial de acessos
INSERT INTO public.acessos (id, contador) VALUES ('total_pageviews', 0) ON CONFLICT (id) DO NOTHING;
