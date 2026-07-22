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

  // --- Renderizar Imagem Premium no Canvas ---

  // A. Fundo Creme/Ivory Claro com Gradiente Suave
  const gradient = ctx.createLinearGradient(0, 0, 800, 800);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(1, "#f7f5f0");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 800);

  // B. Moldura Dourada / Azul Suave Decorativa
  ctx.strokeStyle = "#e5c07b"; // Dourado
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, 740, 740);

  ctx.strokeStyle = "#d4af37"; // Dourado interno mais fino
  ctx.lineWidth = 1;
  ctx.strokeRect(38, 38, 724, 724);

  // C. Branding Superior (Fôlego)
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Nome Fôlego
  ctx.font = "bold 38px Georgia, serif";
  ctx.fillStyle = "#2563eb"; // Soft Blue da identidade
  ctx.fillText(brandingName, 400, 75);

  // Slogan
  ctx.font = "italic 16px Georgia, serif";
  ctx.fillStyle = "#6b7280"; // Gray-500
  ctx.fillText(brandingSlogan, 400, 125);

  // Divisor Dourado sob Branding
  ctx.beginPath();
  ctx.moveTo(350, 160);
  ctx.lineTo(450, 160);
  ctx.strokeStyle = "#e5c07b";
  ctx.lineWidth = 2;
  ctx.stroke();

  // D. Tipo do Cartão (Título do Card)
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#b45309"; // Amber-700 / Ouro escuro
  ctx.fillText(options.cardType.toUpperCase(), 400, 200);

  // E. Conteúdo Principal (Texto Envelopado / Quebra de Linha Automática)
  ctx.fillStyle = "#1f2937"; // Gray-800
  ctx.font = "italic 26px Georgia, serif";

  // Limpar tags HTML do conteúdo (caso venha do Devocional)
  const cleanContent = options.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  // Função para quebrar texto em linhas
  const wrapText = (text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(currentLine.trim());
        currentLine = words[n] + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
    return lines;
  };

  const lines = wrapText(cleanContent, 620); // Largura máxima do bloco de texto: 620px

  // Calcular Y inicial para centralizar o bloco de texto verticalmente
  const lineHeight = 38;
  const blockHeight = lines.length * lineHeight;
  let startY = 430 - blockHeight / 2; // Centralizado no meio (cerca de Y=430)

  // Renderizar cada linha
  lines.forEach((line) => {
    ctx.fillText(`"${line}"`, 400, startY);
    startY += lineHeight;
  });

  // F. Elemento Extra (Autor, Referência Bíblica)
  if (options.extra) {
    ctx.font = "bold 18px Georgia, serif";
    ctx.fillStyle = "#b45309"; // Amber-700
    ctx.fillText(`— ${options.extra}`, 400, startY + 25);
  }

  // G. Rodapé Discreto
  ctx.font = "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillStyle = "#9ca3af"; // Gray-400
  ctx.fillText("Compartilhado do Portal de Leitura Bíblica", 400, 725);

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
