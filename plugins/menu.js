import fs from 'fs';

const filePath = './personalize.json';

let handler = async (m, { conn }) => {
    try {
        const data = JSON.parse(fs.readFileSync(filePath));

        // Cargar datos globales y predeterminados
        const globalConfig = data.global;
        const defaultConfig = data.default;

        const botName = globalConfig.botName || defaultConfig.botName;
        const currency = globalConfig.currency || defaultConfig.currency;
        const videos = globalConfig.videos.length > 0 ? globalConfig.videos : defaultConfig.videos;

        const randomVideoUrl = videos[Math.floor(Math.random() * videos.length)];

        const menuMessage = `
🌸⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆ ${botName} ⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆🌸

🩷 𝑯𝒐𝒍𝒊~! Soy *${botName}*, tu bot mágica ✨
🍡 Versión: ${vs}
🧁 Dev: ${dev}
💴 Monedita: ¥ ${currency}

╭───────────────♡
│ 🌈 𝙿𝙴𝚁𝚂𝙾𝙽𝙰𝙻𝙸𝚉𝙰𝙲𝙸Ó𝙽 🎀
│ 🍓 .setname
│ 🖼️ .setbanner
│ 💰 .setmoneda
│ 🧷 .viewbanner
│ 🗑️ .deletebanner
│ ♻️ .resetpreferences
╰───────────────♡

╭───────────────♡
│ 🛡️ 𝙰𝙳𝙼𝙸𝙽 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 🔧
│ 🚫 .ban ➩ .kick
│ 🔌 .getplugin
│ 📦 .getpack
│ 🛍️ .store
│ 💻 .status
│ ⏳ .ping
╰───────────────♡

╭───────────────♡
│ 🎲 𝚁𝙰𝙽𝙳𝙾𝙼 𝙵𝚄𝙽 ✨
│ 💖 .rw ➩ .rollwaifu
│ 📃 .winfo
│ 📝 .claim ➩ .c
│ 💞 .harem
│ 🖋️ .addrw
│ 🐱 .alya ➩ .bot
│ 🐰 .kaori
╰───────────────♡

╭───────────────♡
│ 🎵 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰𝚂 🎧
│ 🎶 .play ➩ canción (audio)
│ 🎥 .play2 ➩ canción (video)
│ 🎞️ .tt ➩ .tiktok
│ 🎼 .sp ➩ .spotify
│ 📺 .fb ➩ facebook video
╰───────────────♡

╭───────────────♡
│ ⚔️ 𝚁𝙿𝙶 𝙼𝙾𝙳𝙴 🐾
│ 💼 .work ➩ .w
│ 😈 .slut
│ 💸 .robar
│ 🏦 .deposit
│ 🏧 .retirar
│ 🔁 .transferir @user
│ 🆔 .perfil
╰───────────────♡

╭───────────────♡
│ 💕 𝚁𝙴𝙰𝙲𝙲𝙸𝙾𝙽𝙴𝚂 𝙰𝙽𝙸𝙼𝙴 🍥
│ 🤗 .abrazar  😝 .bleh
│ 🛁 .bañarse  😡 .enojado
│ 🍙 .comer   💃 .dance
│ 😊 .feliz    😘 .kiss
│ ❤️ .love    🔪 .matar
│ 🦷 .morder  🍑 .nalguear
│ 👊 .punch   👋 .saludar
│ 🖐️ .bofetada 😴 .dormir
│ 😑 .aburrido
╰───────────────♡

╭───────────────♡
│ 👑 𝙾𝚆𝙽𝙴𝚁 𝚃𝙾𝙾𝙻𝚂 🛠️
│ 🔄 .update
│ 🧹 .dsowner ➩ .purgar
│ 🎎 .join
╰───────────────♡

🫧 Gracias por usar *${botName}*~!
🍓 Hecho con amor por ${dev} 💌
`;

        await conn.sendMessage(
            m.chat,
            {
                video: { url: randomVideoUrl },
                gifPlayback: true,
                caption: menuMessage,
                mentions: [m.sender]
            }
        );
    } catch (error) {
        conn.reply(m.chat, `❌ Error al cargar el menú: ${error.message}`, m);
    }
};

handler.help = ['menu'];
handler.tags = ['info'];
handler.command = ['menu', 'help'];

export default handler;

/* estilos de menu

┎───•✧•───⌬
┃
┖───•✧•  */