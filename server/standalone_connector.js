require('dotenv').config(); // Cargar claves del .env
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const QRCode = require('qrcode');
const OpenAI = require('openai');

// Configuración
const SESSION_NAME = 'standalone_session_debug';
const SESSION_DIR = `sessions/${SESSION_NAME}`;

// Inicializar OpenAI
const apiKey = process.env.OPENAI_API_KEY;
console.log('🔑 OpenAI Key loaded:', apiKey ? 'YES (Starts with ' + apiKey.substring(0, 3) + '...)' : '❌ NO - CHECK .ENV FILE');

const openai = new OpenAI({
    apiKey: apiKey || 'dummy_key' // Evita crash inicial, falla al llamar
});

async function startSock() {
    console.log(`\n🤖 INICIANDO BOT INTELIGENTE (Versión Debug)`);
    console.log(`📂 Sesión: ${SESSION_DIR}\n`);

    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'fatal' }),
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
        syncFullHistory: false,
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('\n⚡ ESCANEA EL CÓDIGO QR ABAJO ⚡\n');
            QRCode.toString(qr, { type: 'terminal', small: true }, (err, url) => {
                if (!err) console.log(url);
            });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('🔄 Reconectando...');
                startSock();
            } else {
                console.log('❌ Logout. Borra la carpeta sessions y reinicia.');
            }
        } else if (connection === 'open') {
            console.log('\n✅ ¡CONECTADO Y LISTO! 🧠');
            console.log('🔹 Envia un mensaje desde OTRO celular para probar.');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
            for (const msg of messages) {
                if (!msg.message) continue;
                if (msg.key.remoteJid === 'status@broadcast') continue;

                const sender = msg.key.remoteJid.replace('@s.whatsapp.net', '');

                if (msg.key.fromMe) {
                    // console.log(`⏩ Ignorando mensaje propio de ${sender}`);
                    continue;
                }

                const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

                if (text) {
                    console.log(`\n📩 ${sender} dice: "${text}"`);
                    console.log('🧠 Intentando conectar con OpenAI...');

                    try {
                        if (!apiKey) throw new Error('Falta la API KEY en .env');

                        // Simular "Escribiendo..."
                        await sock.sendPresenceUpdate('composing', msg.key.remoteJid);

                        // Llamada a OpenAI
                        const completion = await openai.chat.completions.create({
                            model: "gpt-4o",
                            messages: [
                                { role: "system", content: "Eres Alex, un asistente útil." },
                                { role: "user", content: text }
                            ],
                            max_tokens: 100
                        });

                        const reply = completion.choices[0].message.content;

                        // Enviar respuesta
                        await sock.sendMessage(msg.key.remoteJid, { text: reply });
                        console.log(`📤 RESPUESTA ENVIADA: "${reply}"`);

                    } catch (err) {
                        console.error('❌ ERROR CRÍTICO IA:', err.message);
                        console.error('   -> Revisa tu clave de OpenAI en el archivo .env');
                        await sock.sendMessage(msg.key.remoteJid, { text: "Error interno del bot: " + err.message });
                    }
                }
            }
        }
    });
}

startSock();
