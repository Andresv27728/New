// downloader tiktod
import axios from 'axios';

let handler = async (m, { conn, text }) => {
    if (!text) throw '📌 𝘽𝙪𝙨𝙘𝙖𝙧 𝙐𝙍𝙇 𝙙𝙚 𝙏𝙞𝙠𝙏𝙤𝙠!\n𝙀𝙟𝙚𝙢𝙥𝙡𝙤: .tiktok https://vt.tiktok.com/xxxxxx';

    try {
        const { data } = await axios.get(`https://zennz-api.vercel.app/api/downloader/tiktok?url=${encodeURIComponent(text)}`);

        if (!data.status || !data.data?.no_watermark) throw '❌ 𝙂𝙖𝙜𝙖𝙡 𝙙𝙚𝙨𝙘𝙖𝙧𝙜ó 𝙫𝙞𝙙𝙚𝙤 𝙫𝙞𝙙𝙚𝙤 𝙏𝙞𝙠𝙏𝙤𝙠!';

        const {
            title,
            no_watermark,
            music
        } = data.data;

        const caption = `╭───『 *𝙏𝙄𝙆𝙏𝙊𝙆 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝘿𝙊𝙍* 』
│📝 *𝙏í𝙩𝙪𝙡𝙤:* ${title}
╰────────────⬣`;

        await conn.sendMessage(m.chat, {
            video: { url: no_watermark },
            caption,
            contextInfo: {
                externalAdReply: {
                    title: 'TikTok Downloader',
                    body: title,
                    sourceUrl: text,
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m });

        if (music) {
            await conn.sendMessage(m.chat, {
                audio: { url: music },
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: 'TikTok Downloader',
                        body: title,
                        sourceUrl: text,
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });
        } else {
            m.reply('✅ 𝙀𝙡 𝙫𝙞𝙙𝙚𝙤 𝙚𝙨𝙩á 𝙙𝙞𝙨𝙥𝙤𝙣𝙞𝙗𝙡𝙚, 𝙥𝙚𝙧𝙤 𝙚𝙡 𝙖𝙪𝙙𝙞𝙤 𝙣𝙤 𝙚𝙨 𝙙𝙚 𝙩𝙚𝙧𝙘𝙚𝙧𝙤𝙨..');
        }

    } catch (e) {
        console.error('[TIKTOK ERROR]', e);
        throw `❌ 𝙂𝙖𝙜𝙖𝙡 𝙙𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝙫í𝙙𝙚𝙤 𝙫í𝙙𝙚𝙤 𝙙𝙚 𝙏𝙞𝙠𝙏𝙤𝙠!\n\n𝙍𝙚𝙜𝙞𝙨𝙩𝙧𝙤 error: ${e.message}`;
    }
};

handler.help = ['tiktok <url>'];
handler.tags = ['downloader'];
handler.command = /^(tiktok|tt|ttdl)$/i;
handler.limit = false;

export default handler;