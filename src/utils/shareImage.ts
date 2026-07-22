/**
 * Utilitário para gerar imagens de compartilhamento de cartões usando Canvas (Client-side)
 * Permite compartilhar como imagem em dispositivos suportados ou baixar + copiar texto como fallback.
 */

interface ShareCardOptions {
  cardType: string; // Ex: "Versículo do Dia", "Devocional do Dia", "Frase do Dia", "Oração do Dia", "Leitura de Hoje"
  content: string;  // Texto principal
  extra?: string;   // Autor, Referência Bíblica ou rodapé
}

export async function shareCard(options: ShareCardOptions, showSuccess: (msg: string) => void): Promise<boolean> {
  const brandingName = "Fôlego";
  const brandingSlogan = "O sopro da Palavra para sua vida.";

  // 1. Criar elemento Canvas em memória (Tamanho quadrado perfeito 800x800 para posts/compartilhamento)
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    const cleanTextContent = options.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const fallbackText = `"${cleanTextContent}"\n${options.extra ? `— ${options.extra}\n` : ""}\nCompartilhado via ${brandingName} — ${brandingSlogan}`;
    try {
      await navigator.clipboard.writeText(fallbackText);
      showSuccess("Texto copiado para a área de transferência!");
    } catch (e) {
      console.error(e);
    }
    return true;
  }

  // --- Renderizar Imagem Premium no Canvas (Minimalista e Clean) ---

  // A. Fundo Branco Puro (Estilo Clean)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 800, 800);

  // B. Moldura Ultra-Fina e Discreta (Apenas para destacar em fundos brancos)
  ctx.strokeStyle = "#f3f4f6"; // Cinza claro quase imperceptível
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, 740, 740);

  // C. Branding Superior (Fôlego)
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Nome Fôlego (Charcoal Escuro elegante)
  ctx.font = "bold 24px Georgia, serif";
  ctx.fillStyle = "#111827"; 
  ctx.fillText(brandingName.toUpperCase(), 400, 85);

  // Slogan (Cinza bem leve e minimalista)
  ctx.font = "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText(brandingSlogan, 400, 122);

  // D. Tipo do Cartão (Subtítulo do Card em uppercase espaçado)
  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText(options.cardType.toUpperCase(), 400, 210);

  // E. Conteúdo Principal (Texto Envelopado / Quebra de Linha Automática)
  ctx.fillStyle = "#1f2937"; // Charcoal suave
  ctx.font = "italic 23px Georgia, serif";

  // Limpar tags HTML do conteúdo (caso venha do Devocional)
  const cleanContent = options.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  // Função para quebrar texto em linhas
  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const linesArr: string[] = [];
    let currentLine = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        linesArr.push(currentLine.trim());
        currentLine = words[n] + " ";
      } else {
        currentLine = testLine;
      }
    }
    linesArr.push(currentLine.trim());
    return linesArr;
  };

  const lines = wrapText(cleanContent, 580); // Margem interna confortável

  // Formata a primeira e última linhas para terem aspas únicas e corretas de citação
  if (lines.length > 0) {
    lines[0] = `“${lines[0]}`;
    lines[lines.length - 1] = `${lines[lines.length - 1]}”`;
  }

  // Calcular Y inicial para centralizar o bloco de texto verticalmente
  const lineHeight = 42; // Maior espaçamento vertical para melhor legibilidade (respiro)
  const blockHeight = lines.length * lineHeight;
  let startY = 440 - blockHeight / 2; 

  // Renderizar cada linha
  lines.forEach((line) => {
    ctx.fillText(line, 400, startY);
    startY += lineHeight;
  });

  // F. Elemento Extra (Autor, Referência Bíblica)
  if (options.extra) {
    ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "#4b5563"; // Slate Gray
    ctx.fillText(`— ${options.extra}`, 400, startY + 25);
  }

  // G. Rodapé Discreto
  ctx.font = "10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#d1d5db"; // Cinza muito claro e minimalista
  ctx.fillText("folego.app", 400, 715);

  // --- Enviar para Web Share API ou Fallback ---
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const cleanTextContent = options.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const fallbackText = `"${cleanTextContent}"\n${options.extra ? `— ${options.extra}\n` : ""}\nCompartilhado via ${brandingName} — ${brandingSlogan}`;

  try {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Falha ao gerar o blob da imagem");

    const file = new File([blob], `${options.cardType.replace(/\s+/g, "_").toLowerCase()}.png`, { type: "image/png" });

    // Se for dispositivo móvel e suportar compartilhamento de arquivos
    if (isMobile && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `${options.cardType} — ${brandingName}`,
        text: `${options.cardType} do dia. ${brandingSlogan}`
      });
      showSuccess("Compartilhado com sucesso!");
      return true;
    } else {
      // Caso contrário (Desktop ou sem suporte), baixar imagem e copiar texto
      downloadBlob(blob, file.name);
      await navigator.clipboard.writeText(fallbackText);
      showSuccess("Imagem baixada e texto copiado!");
      return true;
    }
  } catch (err) {
    console.error("Erro ao compartilhar imagem, usando fallback:", err);
    try {
      await navigator.clipboard.writeText(fallbackText);
      showSuccess("Texto copiado para a área de transferência!");
    } catch (clipErr) {
      console.error("Falha ao copiar para o clipboard:", clipErr);
    }
    return true;
  }
  return true;
}

// Auxiliar para baixar arquivo Blob no browser
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
