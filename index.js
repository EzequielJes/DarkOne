const fs = require('fs')
const { WAConnection, MessageType, Mimetype, GroupSettingChange } = require('@adiwajshing/baileys')
const ffmpeg = require('fluent-ffmpeg')
const moment = require('moment-timezone')
const yts = require('yt-search')

const antilink = JSON.parse(fs.readFileSync('./database/antilink.json'))

const { fetchJson, getBuffer, getGroupAdmins, getRandom } = require('./lib/functions')
const { text, extendedText, contact, contactsArray, groupInviteMessage, listMessage, buttonsMessage, location, liveLocation, image, video, sticker, document, audio, product } = MessageType

var baterai = {
  battery: "" || "undefined",
  isCharge: "" || false
}
const botName = 'The Dark One'
const prefix = '.'
const time = moment.tz('America/Asuncion').format('HH:mm:ss')

async function starts() {
  const client = new WAConnection()
client.logger.level = 'warn'
client.version = [2, 2143, 3]
client.browserDescription = [ 'The Dark One', '', '3.0' ]

client.on('qr', () => {
console.log('Escanee el codigo qr')
})

fs.existsSync(auth) && client.loadAuthInfo(auth)
client.on('connecting', () => {
console.log('Conectando')
})

client.on('open', () => {
const authInfo = client.base64EncodedAuthInfo()
fs.writeFileSync(auth, JSON.stringify(authInfo, null, '\t'))
console.log('Conectado')
})

await client.connect({timeoutMs: 30 * 1000})

client.on("CB:action,,battery", json => {
const battery = json[2][0][1].value
const persenbat = parseInt(battery)
baterai.battery = `${persenbat}%`
baterai.isCharge = json[2][0][1].live
})

client.on('chat-update', async (mek) => {
try {
if (!mek.hasNewMessage) return
if (!mek.messages) return
if (mek.key && mek.key.remoteJid == 'status@broadcast') return

mek = mek.messages.all()[0]
if (!mek.message) return
global.blocked
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
const from = mek.key.remoteJid
const type = Object.keys(mek.message)[0]
const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
const content = JSON.stringify(mek.message)
const body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
const budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''

const buttonsResponseID = (type == 'buttonsResponseMessage') ? mek.message.buttonsResponseMessage.selectedButtonId : ''

if (prefix != "") {
if (!body.startsWith(prefix)) {
cmd = false
comm = ""
} else {
cmd = true
comm = body.slice(1).trim().split(" ").shift().toLowerCase()
}
} else {
cmd = false
comm = body.trim().split(" ").shift().toLowerCase()
}

const command = comm

const args = budy.trim().split(/ +/).slice(1)
const isCmd = budy.startsWith(prefix)
const q = args.join(' ')
const client_user = client.user.jid
const botNumber = client.user.jid.split('@')[0]
const ownerNumber = ['595995660558', '595994230885']
const isGroup = from.endsWith('@g.us')
const typeMessage = body.substr(0, 50).replace(/\n/g, '')
const sender = mek.key.fromMe ? client.user.jid : isGroup ? mek.participant : mek.key.remoteJid
const senderNumber = sender.split('@')[0]
const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
const groupName = isGroup ? groupMetadata.subject : ''
const conts = mek.key.fromMe ? client.user.jid : client.contacts[sender] || { notify: jid.replace(/@.+/, '') }
const pushname = mek.key.fromMe ? client.user.name : conts.notify || conts.vname || conts.name || '-'
const groupMembers = isGroup ? groupMetadata.participants : ''
const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''

const itsMe = senderNumber == botNumber
const isBotAdmin = groupAdmins.includes(client.user.jid)
const isGroupAdmins = groupAdmins.includes(sender) || false

const isAntiLink = isGroup ? antilink.includes(from) : false

const isOwner = ownerNumber.includes(senderNumber)

const isQuotedMsg = type === 'extendedTextMessage' && content.includes('textMessage')
const isMedia = (type === 'imageMessage' || type === 'videoMessage')
const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')

const mess = {
only: {
group: 'Comando solo para grupos',
botadmin: `${botName} necesita ser admin`,
admins: 'Comando solo para administradores'
}
}

const fakeBot = {
title: `${botName} | ℳℛ. ᎶᎾℒⅅ`,
body: '',
mediaUrl: 'https://chat.whatsapp.com/Ej8KP1fAZOiIf5M5JkXbLp',
thumbnail: fs.readFileSync('./media/image/reply.jpg')
}

const reply = async(teks) => {
await client.sendMessage(from, teks, text, {quoted: mek, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
}

if (isAntiLink && budy.includes('chat.whatsapp.com/') && !isGroupAdmins && isBotAdmin){
client.groupRemove(from, [sender])
}

const botMenu = `✿👋🏻ꜱᴀʟᴜᴅᴏꜱ @${senderNumber}✿

❂ᴛʜᴇ ᴅᴀʀᴋ ᴏɴᴇ ᴇꜱ ᴜɴ ᴀꜱɪꜱᴛᴇɴᴛᴇ ᴠɪʀᴛᴜᴀʟ ᴅᴇ ᴡʜᴀᴛꜱᴀᴘᴘ Qᴜᴇ ᴛᴇ ꜰᴀᴄɪʟɪᴛᴀʀᴀ ᴍᴜᴄʜᴀꜱ ᴄᴏꜱᴀꜱ❂

"𝙽𝚊𝚍𝚊 𝚝𝚒𝚎𝚗𝚎 𝚟𝚒𝚍𝚊 𝚖á𝚜 𝚊𝚕𝚕á 𝚍𝚎 𝚕𝚘𝚜 𝙾𝚛í𝚐𝚎𝚗𝚎𝚜"

⚜️★𝐂𝐑𝐄𝐃𝐈𝐓𝐎𝐒★⚜️
©️InkyGod

⊰᯽⊱𝙼𝚎𝚗𝚞 𝚍𝚎 𝚃𝚑𝚎 𝙳𝚊𝚛𝚔 𝙾𝚗𝚎⊰᯽⊱

📂᯽𝐆𝐑𝐔𝐏𝐎𝐒᯽
■ ${prefix}antilink (0/1)

🌄᯽𝐌𝐄𝐃𝐈𝐀᯽
■ ${prefix}sticker
■ ${prefix}tts (idioma)(texto)

📥᯽𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒᯽
■ ${prefix}play

           🔱
"𝚂𝚊𝚗𝚝𝚒𝚏𝚒𝚌𝚊𝚍𝚘 𝚜𝚎𝚊𝚗 𝚕𝚘𝚜 𝙾𝚛𝚊𝚒𝚜"`

if (buttonsResponseID.includes('Botton 1')){
reply('')
}

switch (command) {

case 'menu':
var none = await client.prepareMessage(from, fs.readFileSync('./media/image/reply.jpg'), image)
var buttonMessage = {
imageMessage: none.message.imageMessage,
contentText: botMenu,
footerText: `Hora: *${time}*
Bateria: *${baterai.battery}*`,
buttons: [
{buttonId: 'Botton 1', buttonText: {displayText: 'Botton 1'}, type: 1}
],
headerType: 4
}
client.sendMessage(from, buttonMessage, buttonsMessage, {quoted: mek, contextInfo: {mentionedJid: [sender]}})
break

case 'antilink':
if (!isGroup) return reply(mess.only.group)
if (!isBotAdmin) return reply(mess.only.botadmin)
if (!isGroupAdmins) return reply(mess.only.admins)
if (!q) return reply(`Use ${prefix + command} 1 para activar y/o ${prefix + command} 0 para desactivarlo`)
if (Number(args[0]) === 1) {
if (isAntiLink) return reply('El antilink ya estaba activo')
antilink.push(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
reply('Se ha activado el antilink')
} else if (Number(args[0]) === 0) {
if (!isAntiLink) return reply('El antilink ya estaba desactivado')
antilink.splice(from)
fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
reply('Se ha desactivado el antilink')
} else {
reply(`Use ${prefix + command} 1 para activar y/o ${prefix + command} 0 para desactivarlo`)
}
break

case 's':
case 'sticker':
if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
var encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
var media = await client.downloadAndSaveMediaMessage(encmedia)
var ran = '666.webp'
await ffmpeg(`./${media}`)
.input(media)
.on('start', function (cmd) {
})
.on('error', function (err) {
fs.unlinkSync(media)
reply('Hubo un error al crear su sticker')
})
.on('end', function () {
client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek, contextInfo: {externalAdReply: fakeBot}})
fs.unlinkSync(media)
fs.unlinkSync(ran)
})
.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
.toFormat('webp')
.save(ran)
} else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
var encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
var media = await client.downloadAndSaveMediaMessage(encmedia)
var ran = '666.webp'
reply(mess.wait)
await ffmpeg(`./${media}`)
.inputFormat(media.split('.')[1])
.on('start', function (cmd) {
})
.on('error', function (err) {
fs.unlinkSync(media)
reply('Hubo un error al crear su sticker')
})
.on('end', function () {
client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek, contextInfo: {externalAdReply: fakeBot}})
fs.unlinkSync(media)
fs.unlinkSync(ran)
})
.addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
.toFormat('webp')
.save(ran)
}
break

case 'tts':
if (!q) return reply(`Usa ${prefix + command} <idioma> <texto>`)
const gtts = require('./lib/gtts')(args[0])
var dtt = body.slice(8)
var ranm = getRandom('.mp3')
var rano = getRandom('.ogg')
dtt.length > 300
? reply('Texto demaciado largo')
: gtts.save(ranm, dtt, function() {
client.sendMessage(from, fs.readFileSync(ranm), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {externalAdReply: fakeBot}})
fs.unlinkSync(ranm)
})
break

case 'play':
var playSearch = await yts(q)
var playTeks = `${botName} Play

*Titulo:* ${playSearch.all[0].title}
*Duracion:* ${playSearch.all[0].timestamp}
*Link:* ${playSearch.all[0].url}

Su archivo esta siendo enviado`
var play = await fetchJson(`https://api.zeks.me/api/ytmp3?apikey=apivinz&url=${playSearch.all[0].url}`)
var buffer = await getBuffer(play.result.thumbnail)
var aud = await getBuffer(play.result.url_audio)
client.sendMessage(from, buffer, image, {quoted: mek, caption: playTeks})
client.sendMessage(from, aud, audio, {quoted: mek, mimetype: 'audio/mp4', contextInfo: {externalAdReply: fakeBot}})
client.sendMessage(from, aud, audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {externalAdReply: fakeBot}})
break

default:

if (budy.startsWith('x')){
if (!isOwner) return
if (!q) return
return await reply(JSON.stringify(eval(args.join(' ')), null, 2))
}

if (budy.startsWith('>')){
if (!isOwner) return
const util = require("util");
konsol = budy.slice(1)
Return = (sul) => {
sat = JSON.stringify(sul, null, 2)
bang = util.format(sat)
if (sat == undefined){
bang = util.format(sul)
}
return reply(bang)
}
try {
reply(`${util.format(eval(`;(async () => {
${konsol}
})()`))}`)
} catch(e){
reply(`${String(e)}`)
}}

}

} catch (e) {
const emror = String(e)
if (emror.includes('this.isZero')){
return
}
if (emror.includes('jid')){
return
}
console.log(e)
client.sendMessage('595994230885@s.whatsapp.net', e, MessageType.text, {quoted: mek})
}

})
}

starts()
