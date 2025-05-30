import fs from 'fs';
import path from 'path';

const filePath = './personalize.json';
const subBotsFolder = './Alya-SubBot';
const ownerNumber = '50493732693@s.whatsapp.net';

// Función para obtener los sub bots autorizados desde la carpeta
function getSubBots() {
    try {
        const files = fs.readdirSync(subBotsFolder);
        const subBots = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', '') + '@s.whatsapp.net');
        return subBots;
    } catch (error) {
        console.error('❌ Error al leer los sub bots:', error.message);
        return [];
    }
}

let handler = async (m, { text }) => {
    const sender = m.sender;
    const subBots = getSubBots();

    if (sender !== ownerNumber && !subBots.includes(sender)) {
        throw '⛔ Solo el dueño o un sub bot autorizado puede usar este comando.';
    }

    if (!text) throw '❌ Debes proporcionar un nombre para el bot.';

    const data = JSON.parse(fs.readFileSync(filePath));

    if (!data.global) data.global = { botName: null, currency: null, videos: [] };

    data.global.botName = text;

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    m.reply(`✅ Nombre del bot actualizado a: *${text}*`);
};

handler.help = ['setname <nombre>'];
handler.tags = ['config'];
handler.command = /^setname$/i;

export default handler;