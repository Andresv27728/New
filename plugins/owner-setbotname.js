import fs from 'fs';
import path from 'path';

const filePath = './personalize.json';
const subBotsFolder = './Alya-SubBot';
const ownerNumber = '50493732693';

// Función para obtener sub bots desde la carpeta
function getSubBots() {
    try {
        const files = fs.readdirSync(subBotsFolder);
        return files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', '')); // Solo número puro
    } catch (error) {
        console.error('❌ Error al leer sub bots:', error.message);
        return [];
    }
}

let handler = async (m, { text }) => {
    const senderNumber = m.sender.replace(/@s\.whatsapp\.net$/, '');
    const subBots = getSubBots();

    // Validación
    if (senderNumber !== ownerNumber && !subBots.includes(senderNumber)) {
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