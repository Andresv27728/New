import fetch from 'node-fetch'

const handler = async (m, { conn, command, text }) => {
  if (!text) throw `❗ Usa: ${command} <URL de YouTube>`

  // Reacción de carga
  await conn.sendMessage(m.chat, { react: { text: '♻️', key: m.key } })

  try {
    const api = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(text)}`
    const response = await fetch(api)
    const data = await response.json()
    
    if (!data.result || !data.result.download.url) throw '❗ No se pudo obtener el audio. ¡Intenta de nuevo!'

    const { metadata, download } = data.result
    const { title, duration, views, author, thumbnail } = metadata
    const audioUrl = download.url

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title,
          body: `⏱ Duración: ${duration.timestamp} | 👁️‍🗨️ Vistas: ${views.toLocaleString()}`,
          thumbnailUrl: thumbnail,
          renderLargerThumbnail: true,
          mediaType: 1,
          mediaUrl: text,
          sourceUrl: text
        }
      }
    }, { quoted: m })

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (error) {
    console.error(error)
    // Reacción de error
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    throw '⚠️ Error al procesar la solicitud. Intenta nuevamente más tarde.'
  }
}

handler.help = ['ytmp3 <url>']
handler.tags = ['downloader']
handler.command = /^(ytmp3|yta|ytaudio)$/i

export default handler