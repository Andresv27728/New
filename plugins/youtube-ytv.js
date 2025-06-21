import axios from 'axios'

const handler = async (m, { conn, text }) => {
  if (!text) {
    await conn.reply(
      m.chat,
      '❗ Ingresa el enlace del video de YouTube que deseas descargar en formato MP4.\n\n*Ejemplo:* .ytmp4 https://www.youtube.com/watch?v=E7XkLEEYZnE',
      m
    )
    return
  }

  try {
    const encodedQuery = encodeURIComponent(text)
    const apiUrl = `https://zennz-api.vercel.app/api/downloader/ytmp4?url=${encodedQuery}`
    const response = await axios.get(apiUrl)
    const data = response.data

    if (!data.status || !data.data?.status || !data.data?.url) {
      throw new Error('No se pudo obtener el enlace de descarga.')
    }

    const videoData = data.data
    const ytUrl = text
    const videoIdMatch = ytUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
    const videoId = videoIdMatch ? videoIdMatch[1] : null
    const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoData.url },
        mimetype: 'video/mp4',
        fileName: `${videoData.title}.mp4`,
        contextInfo: {
          externalAdReply: {
            title: videoData.title,
            body: 'Descargador de YouTube MP4 - By Duolingo - AI',
            thumbnailUrl,
            sourceUrl: ytUrl,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      },
      { quoted: m }
    )

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  } catch (error) {
    console.error(error)
    await conn.reply(m.chat, `❌ Error al descargar el video.\nDetalles: ${error.message}`, m)

    // Reacción de error
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
  }
}

handler.help = ['ytmp4 <enlace>']
handler.tags = ['downloader']
handler.command = ['ytmp4']

export default handler