import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠️ Formato no soportado. Usa uno válido de audio o video.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    };

    try {
      const response = await axios.request(config);
      if (response.data && response.data.success) {
        const { id, title, info } = response.data;
        const { image } = info;
        const downloadUrl = await ddownr.cekProgress(id);

        return {
          id,
          image,
          title,
          downloadUrl,
        };
      } else {
        throw new Error("❌ No se pudo obtener los detalles del video.");
      }
    } catch (error) {
      console.error("Error:", error.message || error);
      throw error;
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    };

    try {
      while (true) {
        const response = await axios.request(config);
        if (response.data && response.data.success && response.data.progress === 1000) {
          return response.data.download_url;
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error("Error:", error.message || error);
      throw error;
    }
  },
};

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text || !text.trim()) {
      return conn.reply(m.chat, `⚠️ *Ingresa el nombre de la música a buscar.*\n\nEjemplo:\n${usedPrefix + command} Shakira - Acróstico`, m);
    }

    await m.react('💥');
    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply("❌ No se encontraron resultados para tu búsqueda.");
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;

    const vistas = formatViews(views);
    const infoMessage = `
╭━━〔 *➮ ${wm}* 〕━━⬣
┃ 💿 *Título :* ${title}
┃ 📺 *Canal :* ${videoInfo.author.name || "Desconocido"}
┃ 📊 *Vistas :* ${vistas}
┃ ⏱️ *Duración :* ${timestamp}
┃ 🔗 *Enlace :* ${url}
╰━━━━━━━━━━━━━━━━⬣`.trim();

    const thumb = (await conn.getFile(thumbnail))?.data;

    const JT = {
      contextInfo: {
        externalAdReply: {
          title: wm,
          body: textbot,
          mediaType: 1,
          previewType: 0,
          mediaUrl: url,
          sourceUrl: null,
          thumbnail: thumb,
          renderLargerThumbnail: true,
        },
      },
    };

    await conn.reply(m.chat, infoMessage, m, JT);

    if (["play", "yta", "mp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");
      const result = api.downloadUrl;

      await conn.sendMessage(
        m.chat,
        { audio: { url: result }, mimetype: "audio/mpeg", ptt: true },
        { quoted: m }
      );
    } else if (["play2", "ytv", "mp42"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`,
      ];

      let success = false;
      for (const source of sources) {
        try {
          const res = await fetch(source);
          const json = await res.json();

          let downloadUrl =
            json.data?.dl ||
            json.result?.download?.url ||
            json.downloads?.url ||
            json.data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(
              m.chat,
              {
                video: { url: downloadUrl },
                fileName: `${title}.mp4`,
                mimetype: "video/mp4",
                caption: `🎬 *${title}*`,
                thumbnail: thumb,
              },
              { quoted: m }
            );
            break;
          }
        } catch (e) {
          console.error(`Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) {
        return m.reply(`❌ *No se pudo descargar el video.*\nNo se encontró un enlace válido.`);
      }
    } else {
      throw new Error("Comando no reconocido.");
    }
  } catch (error) {
    return m.reply(`🚫 *Ocurrió un error:*\n\`\`\`${error.message || error}\`\`\``);
  }
};

handler.command = handler.help = ["play", "mp3"];
handler.tags = ["downloader"];
export default handler;

function formatViews(views) {
  if (!views || isNaN(views)) return "Desconocidas";
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")";
  } else {
    return views.toString();
  }
                          }
