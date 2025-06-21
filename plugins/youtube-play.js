import { createCanvas, loadImage } from 'canvas'
import fetch from 'node-fetch'

async function fetchConTimeout(recurso, opciones = {}) {
  const { timeout = 10000 } = opciones
  const controlador = new AbortController()
  const id = setTimeout(() => controlador.abort(), timeout)
  const respuesta = await fetch(recurso, { ...opciones, signal: controlador.signal })
  clearTimeout(id)
  return respuesta
}

const handler = async (m, { conn, args }) => {
  if (!args[0]) return m.reply(`❗ Ingresa el nombre de una canción.\nEjemplo: *.play ojos color sol*`)
  const query = args.join(' ')

  let json
  try {
    const res = await fetchConTimeout(`https://zenzzx-api.vercel.app/search/youtube?q=${encodeURIComponent(query)}`)
    json = await res.json()
  } catch (err) {
    return m.reply('❗ Error al conectar con el servidor principal. Intenta más tarde.')
  }

  if (!json?.result?.length) return m.reply('❗ No se pudo obtener información del video.')

  const top = json.result[0]
  const { title, channel, duration, imageUrl, link } = top
  const resImg = await fetch(imageUrl)
  const img = await loadImage(Buffer.from(await resImg.arrayBuffer()))

  const canvas = createCanvas(800, 400)
  const ctx = canvas.getContext('2d')

  const gradiente = ctx.createLinearGradient(0, 0, 0, 400)
  gradiente.addColorStop(0, '#121212')
  gradiente.addColorStop(1, '#1f1f1f')
  ctx.fillStyle = gradiente
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.drawImage(img, 40, 80, 240, 240)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 32px Sans'
  const lineas = []
  const palabras = title.split(' ')
  let linea = ''
  for (let i = 0; i < palabras.length; i++) {
    const testLinea = linea + palabras[i] + ' '
    const metrica = ctx.measureText(testLinea)
    if (metrica.width > 400 && i > 0) {
      lineas.push(linea)
      linea = palabras[i] + ' '
    } else {
      linea = testLinea
    }
  }
  lineas.push(linea)
  lineas.forEach((l, i) => {
    ctx.fillText(l.trim(), 310, 150 + i * 35)
  })

  ctx.fillStyle = '#b3b3b3'
  ctx.font = '24px Sans'
  ctx.fillText(channel, 310, 240)
  ctx.fillText(duration, 310, 270)

  ctx.fillStyle = '#555'
  ctx.fillRect(310, 300, 400, 6)

  ctx.fillStyle = '#1db954'
  ctx.fillRect(310, 300, 150, 6)

  const buffer = canvas.toBuffer('image/png')

  await conn.sendMessage(m.chat, {
    image: buffer,
    caption: `📌 *YouTube Play* \n\n🎵 *Título:* ${title}\n🎤 *Canal:* ${channel}\n⏱️ *Duración:* ${duration}`,
    contextInfo: {
      externalAdReply: {
        title,
        body: `${channel} • ${duration}`,
        thumbnailUrl: imageUrl,
        mediaType: 1,
        renderLargerThumbnail: true,
        sourceUrl: link
      },
      businessMessageForwardInfo: {
        businessOwnerJid: conn.decodeJid(conn.user.id)
      },
      forwardedNewsletterMessageInfo: {
        newsletterName: "Descargador de Música",
        newsletterJid: "120363410793796223@newsletter"
      },
      forwardingScore: 9999,
      isForwarded: true
    },
    buttons: [
      { buttonId: `.ytmp3 ${link}`, buttonText: { displayText: 'Descargar MP3' }, type: 1 },
      { buttonId: `.ytmp4 ${link}`, buttonText: { displayText: 'Descargar MP4' }, type: 1 }
    ],
    headerType: 4
  }, { quoted: m })
}

handler.command = ['play']
handler.tags = ['downloader']
handler.help = ['play <nombre de canción>']

export default handler