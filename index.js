const { WAConnection, MessageType, MimeType } = require('@adiwajshing/baileys')
const { exec } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const util = require('util')
const ytdl = require('ytdl-core')
const yts = require('yt-search')
const moment = require('moment-timezone')

const antilink = JSON.parse(fs.readFileSync('./lib/antilink.json'))
const { getBuffer, getGroupAdmins } = require('./lib/functions')

var baterai = {
	battery: '' || 'undefined',
	isCharge: '' || false
}
const botName = 'The Dark One'
const prefix = '.'
const time = moment.tz('America/Asuncion').format('HH:mm:ss')

const iniciar = async(auth) => {
        const client = new WAConnection
        
        client.logger.level = 'warn'
	client.version = [2, 2143, 3]
	client.browserDescription = [ 'The Dark One', '', '3.0' ]
	
	client.on('qr', () => console.log('Escanee el codigo qr'))
	
	fs.existsSync(auth) && client.loadAuthInfo(auth)
	client.on('connecting', () => console.log('Conectando...'))
	
	client.on('open', () => console.log('Conectado exitosamente'))
	
	await client.connect({timeoutMs: 30 * 1000})
	fs.writeFileSync(auth, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
	
	client.on('CB:action,,battery', json => {
		const battery = json[2][0][1].value
		const persenbat = parseInt(battery)
		baterai.battery = `${persenbat}%`
		baterai.isCharge = json[2][0][1].live
	})
	
	client.on('chat-update', async(mek) => {
		try {
                        if (!mek.hasNewMessage) return
                        if (!mek.messages) return
                        if (mek.key && mek.key.remoteJid == 'status@broadcast') return
                        
                        mek = mek.messages.all()[0]
                        if (!mek.message) return
                        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                        const type = Object.keys(mek.message)[0]
                        const content = JSON.stringify(mek.message)
                        const from = mek.key.remoteJid
                        const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
                        const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type == 'imageMessage') && mek.message.imageMessage.caption ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption ? mek.message.videoMessage.caption : ''
                        const { text, extendedText, contact, listMessage, buttonsMessage, location, image, video, sticker, document, audio, gif } = MessageType
                        
			const buttonsResponseID = (type == 'buttonsResponseMessage') ? mek.message.buttonsResponseMessage.selectedButtonId : ''
			
			
       

                        if (prefix != '') {
                                if (!body.startsWith(prefix)) {
                                        cmd = false
                                        comm = ''
                                } else {
                                        cmd = true
                                        comm = body.slice(1).trim().split(' ').shift().toLowerCase()
                                }
                        } else {
                                cmd = false
                                comm = body.trim().split(' ').shift().toLowerCase()
                        }
                        
                        const command = comm
                        
			       
	
                        const args = body.trim().split(/ +/).slice(1)
                        const isCmd = body.startsWith(prefix)
                        const q = args.join(' ')
                        const soyYo = client.user.jid
                        const botNumber = client.user.jid.split('@')[0]
                        const ownerNumber = ['595995660558', '595994230885']
                        const isGroup = from.endsWith('@g.us')
                        const sender = mek.key.fromMe ? client.user.jid : mek.participant
			const senderNumber = sender.split('@')[0]
                        const conts = mek.key.fromMe ? client.user.jid : client.contacts[sender] || { notify: jid.replace(/@.+/, '') }
                        const pushname = mek.key.fromMe ? client.user.name : conts.notify || conts.vname || conts.name || '-'
			const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
			const groupName = isGroup ? groupMetadata.subject : ''
			const groupMembers = isGroup ? groupMetadata.participants : ''
			const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
			
                        const isMe = botNumber.includes(senderNumber)
                        const isOwner = ownerNumber.includes(senderNumber)
			const isBotAdmin = groupAdmins.includes(client.user.jid)
			const isGroupAdmins = groupAdmins.includes(sender) || false
			
			const isAntiLink = isGroup ? antilink.includes(from) : false
			
			const isQuotedMsg = type === 'extendedTextMessage' && content.includes('textMessage')
			const isMedia = (type === 'imageMessage' || type === 'videoMessage')
			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
			const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
			const isQuotedGif = type === 'extendedTextMessage' && content.includes('gifMessage')
			
			
			const fakeBot = {
				title: `${botName} | ℳℛ. ᎶᎾℒⅅ`,
				body: '',
				mediaUrl: 'https://hentaila.com/',
				thumbnail: fs.readFileSync('./media/image/reply.jpg')
			}
			
			const reply = async(teks) => {
				await client.sendMessage(from, teks, text, {quoted: mek, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
			}
		const replyMent = (teks, mention) => {
			client.sendMessage(from, { text: teks, mentions: mention }, { quoted: mek })
		}
			
			const ytmp3 = (link) => {
				var dl = ytdl(link)
				var nameMp3 = '666.mp3'
				var nameMp4 = '666.mp4'
				var wS = fs.createWriteStream(`./${nameMp4}`)
				dl.pipe(wS)
				dl.on('end', function() {
					exec(`ffmpeg -i "./${nameMp4}" "./${nameMp3}"`, (err) => {
						fs.unlinkSync(`./${nameMp4}`)
						if (err) return
						client.sendMessage(from, fs.readFileSync(`./${nameMp3}`), audio, {quoted: mek, mimetype: 'audio/mp4', contextInfo: {externalAdReply: fakeBot}})
						fs.unlinkSync(`./${nameMp3}`)
					})
				})
			}
			
			if (isAntiLink && body.includes('chat.whatsapp.com/') && !isGroupAdmins && isBotAdmin){
				client.groupRemove(from, [sender])
			}
			
			const botMenu = `✿👋🏻ꜱᴀʟᴜᴅᴏꜱ @${senderNumber}✿

❂ᴛʜᴇ ᴅᴀʀᴋ ᴏɴᴇ❂

"𝙽𝚊𝚍𝚊 𝚝𝚒𝚎𝚗𝚎 𝚟𝚒𝚍𝚊 𝚖á𝚜 𝚊𝚕𝚕á 𝚍𝚎 𝚕𝚘𝚜 𝙾𝚛í𝚐𝚎𝚗𝚎𝚜"

⚜️★𝐂𝐑𝐄𝐃𝐈𝐓𝐎𝐒★⚜️
©️InkyGod

⊰᯽⊱𝙼𝚎𝚗𝚞 𝚍𝚎 𝚃𝚑𝚎 𝙳𝚊𝚛𝚔 𝙾𝚗𝚎⊰᯽⊱

📂᯽𝐆𝐑𝐔𝐏𝐎𝐒᯽
■ ${prefix}antilink <0/1>
 
🌄᯽𝐌𝐄𝐃𝐈𝐀᯽
■ ${prefix}sticker
■ ${prefix}tts <idioma> <texto>

📥᯽𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒᯽
■ ${prefix}play

           🔱
"𝚂𝚊𝚗𝚝𝚒𝚏𝚒𝚌𝚊𝚍𝚘 𝚜𝚎𝚊𝚗 𝚕𝚘𝚜 𝙾𝚛𝚊𝚒𝚜"`

if (buttonsResponseID.includes('TheDarkOne')){
reply('AUN NO ESTABLECIDO')
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
{buttonId: 'TheDarkOne', buttonText: {displayText: 'TheDarkOne'}, type: 1}
],
headerType: 4
}
client.sendMessage(from, buttonMessage, buttonsMessage, {quoted: mek, contextInfo: {mentionedJid: [sender]}})
break
			
case 'antilink':
if (!isGroup) return reply('Comando solo para grupos')
if (!isBotAdmin) return reply('El bot necesita ser admin')
if (!isGroupAdmins) return reply('Necesitas ser admin')
if (!q) return reply(`Use ${prefix + command} 1 para activar y/o ${prefix + command} 0 para desactivarlo`)
if (Number(args[0]) === 1) {
	if (isAntiLink) return reply('El antilink ya estaba activo')
	antilink.push(from)
	fs.writeFileSync('./lib/antilink.json', JSON.stringify(antilink))
	reply('Se ha activado el antilink')
} else if (Number(args[0]) === 0) {
	if (!isAntiLink) return reply('El antilink ya estaba desactivado')
	antilink.splice(from)
	fs.writeFileSync('./lib/antilink.json', JSON.stringify(antilink))
	reply('Se ha desactivado el antilink')
} else {
	reply(`Use ${prefix + command} 1 para activar y/o ${prefix + command} 0 para desactivarlo`)
}
break

case 's':
case 'stiker':
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
} else {
	reply(`Usa ${prefix + command} tageando un archivo media`)
}
break

case 'tts':
if (!q) return reply(`Usa ${prefix + command} <idioma> <texto>`)
const gtts = require('./lib/gtts')(args[0])
var dtt = body.slice(8)
var ranm = '666.mp3'
var rano = '666.ogg'
dtt.length > 300
? reply('Texto demaciado largo')
: gtts.save(ranm, dtt, function() {
client.sendMessage(from, fs.readFileSync(ranm), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
fs.unlinkSync(ranm)
})
break

case 'play':
if (!q) return reply(`Usa ${prefix + command} <text>`)
var play = await yts(q)
var buffer = await getBuffer(play.all[0].image)
var teks = `${botName} Youtube

Titulo: ${play.all[0].title}
Duracion: ${play.all[0].timestamp}
Link: ${play.all[0].url}`
client.sendMessage(from, buffer, image, {quoted: mek, caption: teks, contextInfo: {externalAdReply: fakeBot}})
ytmp3(play.all[0].url)
break

//case 'dark':
//client.sendMessage(from, fs.readFileSync('./media/Nimue/Dark.gif'), video, {quoted: mek, mimetype: Mimetipe.gif,})
//break
		
case 'tag':
var jids = []
groupMembers.map(v => jids.push(v.id))
if (q) {
	replyMent(q, jids)
} else if (isQuotedMsg) {
	replyMent(quoted.conversation, jids)
} else {
	reply(`Use:\n${prefix + command} <texto>`)
}
break
		
case 'SanEzekiel'
client.sendMessage(from, fs.readFileSync('./media/image/Ezekiel.jpg'), image)
break

		
		
		
             default:
		if (isOwner) {
			if (body.startsWith('>')){
				const konsol = body.slice(1)
				const Return = (sul) => {
					var sat = JSON.stringify(sul, null, 2)
					let bang = util.format(sat)
					if (sat == undefined){
						bang = util.format(sul)
					}
					return reply(bang)
				}
				try {
					reply(`${util.format(eval(`;(async () => {${konsol}})()`))}`)
				} catch(e){
					reply(`${String(e)}`)
				}
			}
			if (body.startsWith('$')){
				exec(body.slice(1), (err, stdout) => {
					if (err) return reply(err)
					if (stdout) reply(stdout)
				})
			}
		}
			}
                } catch (e) {
                        const emror = String(e)
			if (emror.includes('this.isZero')){
				return
			}
			if (emror.includes('jid')){
				return
			}
                        console.log(emror)
			client.sendMessage('595994230885@s.whatsapp.net', e, MessageType.text, {quoted: mek})
                }
        })
}

iniciar('./session.json')
