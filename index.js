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
const botName = 'πππ π|π΄ π΅πππππππππ'
const prefix = '.'
const time = moment.tz('America/Asuncion').format('HH:mm:ss')

const iniciar = async(auth) => {
        const client = new WAConnection
        
        client.logger.level = 'warn'
	client.version = [2, 2143, 3]
	client.browserDescription = [ 'The S|E Foundation', '', '3.0' ]
	
	client.on('qr', () => console.log('Escanee el codigo qr'))
	
	fs.existsSync(auth) && client.loadAuthInfo(auth)
	client.on('connecting', () => console.log('Espere un momento, Estamos estableciendo la conexion...'))
	
	client.on('open', () => console.log('Β©The S.E Foundation, Derechos reservados, Conexion Establecida'))
	
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
                        
                        const command = body.startsWith(prefix) ? body.slice(1).trim().split(' ').shift().toLowerCase() : ''
                        
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
				title: `${botName} | β³β. αΆαΎββ`,
				body: '',
				mediaUrl: 'https://hentaila.com/',
				thumbnail: fs.readFileSync('./media/image/reply.jpg')
			}
			
			const titoBot = {
				title: `α΄ΚΙͺα΄Ι΄α΄α΄α΄Ιͺα΄Ι΄ | Β©α΄Κα΄ s|α΄ ?α΄α΄Ι΄α΄α΄α΄Ιͺα΄Ι΄`,
				body: '',
				mediaUrl: 'https://hentaila.com/',
				thumbnail: fs.readFileSync('./media/image/Ezekiel.jpg')
			}
			
			const reply = async(teks) => {
				await client.sendMessage(from, teks, text, {quoted: mek, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
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
			
			const audioMenu = `π€ππ?ππ’π¨π¬ 
			bot
			bella 
			estup
			colorado 
			viva 
			purga 
			ameno 
			turbio 
			vitta 
			vladi 
			wha 
Β©πππ π|π΄ π΅πππππππππ, π°ππ πππππππ ππππππππ   
"πππππππππππ ππππ πππ πΎππππ"`
			
		
			
			
			
			const botMenu = `βΏππ»κ±α΄Κα΄α΄α΄κ± @${senderNumber}βΏ

Β©πππ π|π΄ π΅πππππππππ

"π½πππ πππππ ππππ πΓ‘π πππΓ‘ ππ πππ πΎπΓ­πππππ"

βοΈβππππππππββοΈ
Β©οΈInkyGod
β  ${prefix}Orientacion

β°α―½β±πΌπππβ°α―½β±

πα―½ππππππα―½
β  ${prefix}antilink <0/1>
 
πα―½πππππα―½
β  ${prefix}sticker
β  ${prefix}tts <idioma> <texto>
β  ${prefix}audios


π₯α―½πππππππππα―½
β  ${prefix}play

           π±
Β©πππ π|π΄ π΅πππππππππ, π°ππ πππππππ ππππππππ   
"πππππππππππ ππππ πππ πΎππππ"`

if (buttonsResponseID.includes('πππ π|π΄ π΅πππππππππ')){
reply('Numero del dueΓ±o wa.me/+595986573958 ATENCION AL CLIENTE')
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
{buttonId: 'πππ π|π΄ π΅πππππππππ', buttonText: {displayText: 'πππ π|π΄ π΅πππππππππ'}, type: 1}
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
	
case 'tag':
var jids = []
groupMembers.map(v => jids.push(v.jid))
client.sendMessage(from, { text:'', contextInfo: {mentionedJid: jids}})
break
	case 'audios':
		return reply(audioMenu)
		

	break
		
		
	
		
		
		
	

case 'orientacion':
client.sendMessage(from, fs.readFileSync('./media/Cinta.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: titoBot}})
break
		
case 'bella':
client.sendMessage(from, fs.readFileSync('./media/audio/Bella.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break
		
		case 'colorado':
client.sendMessage(from, fs.readFileSync('./media/audio/Colorado.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break
		
		
case 'viva':
client.sendMessage(from, fs.readFileSync('./media/audio/Pum.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break
		
case 'purga':
client.sendMessage(from, fs.readFileSync('./media/audio/Purga.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break
		
	case 'ameno':
client.sendMessage(from, fs.readFileSync('./media/audio/Torime.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break	
		
	case 'turbio':
client.sendMessage(from, fs.readFileSync('./media/audio/Turbio.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break
		
	case 'vitta':
client.sendMessage(from, fs.readFileSync('./media/audio/Vita.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break	
		
	case 'vladi':
client.sendMessage(from, fs.readFileSync('./media/audio/Vladimir.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break	
		
	case 'wha':
client.sendMessage(from, fs.readFileSync('./media/audio/What.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break	
		
		case 'estup':
client.sendMessage(from, fs.readFileSync('./media/audio/Estupida.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break	
		
		case 'bot':
client.sendMessage(from, fs.readFileSync('./media/audio/Bot.mp3'), audio, {quoted: mek, mimetype: 'audio/mp4', ptt: true, contextInfo: {mentionedJid: [sender], externalAdReply: fakeBot}})
break
		
		case 'kick':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admins)
if (!isBotAdmin) return reply(mess.only.badmin)
if (fs.mentionedJid === undefined) return reply('Mencione a un usuario')
if (sender === fs.mentionedJid) return reply('No puede eliminar usted mismo')
if (owner.includes(fs.mentionedJid.split('@')[0])) return reply('No es posible eliminar a un owner del bot')
if (groupAdmins.includes(fs.mentionedJid)) return reply('No es posible eliminar a un administrador')
client.groupParticipantsUpdate(from, [fs.mentionedJid], 'remove')
	.then(x => reply(`Ha sido eliminado @${fs.mentionedJid.split('@')[0]} del grupo por @${senderNumber}`, {mentions: [fs.mentionedJid, sender]}))
	.catch(e => reply(e))
break
		
		
		
		case 'bay':
if (!isGroup) return reply(mess.only.group)
if (!isGroupAdmins) return reply(mess.only.admins)
if (!isBotAdmin) return reply(mess.only.badmin)
		client.groupParticipantsUpdate(from, [fs.mentionedJid], 'remove')
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
			
			if (emror.includes('this.isZero')) return
			if (emror.includes('jid')) return
			
                        console.log(emror)
			client.sendMessage('595994230885@s.whatsapp.net', e, MessageType.text, {quoted: mek})
                }
        })
}

iniciar('./session.json')
