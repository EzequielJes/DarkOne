const { WAConnection, MessageType } = require('@adiwajshing/baileys')
const fs = require('fs')
const util = require('util')

const prefix = '.'

const iniciar = async(auth) => {
        const client = new WAConnection
        
        client.logger.level = 'warn'
	client.version = [2, 2143, 3]
	
	client.on('qr', () => console.log('Escanee el codigo qr'))
	
	fs.existsSync(auth) && client.loadAuthInfo(auth)
	client.on('connecting', () => console.log('Conectando...'))
	
	client.on('open', () => console.log('Conectado exitosamente'))
	
	await client.connect({timeoutMs: 30 * 1000})
	fs.writeFileSync(auth, JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))
	
	client.on('chat-update', (mek) => {
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
                        const { text, extendedText, contact, listMessage, buttonsMessage, location, image, video, sticker, document, audio } = MessageType
                        
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
                        const ownerNumber = ['595985902159']
                        const isGroup = from.endsWith('120363022044493444@g.us')
                        const sender = mek.key.fromMe ? client.user.jid : isGroup ? mek.participant : mek.key.remoteJid
                        const senderNumber = sender.split('@')[0]
                        const conts = mek.key.fromMe ? client.user.jid : client.contacts[sender] || { notify: jid.replace(/@.+/, '') }
                        const pushname = mek.key.fromMe ? client.user.name : conts.notify || conts.vname || conts.name || '-'
                        
                        const isMe = botNumber.includes(senderNumber)
                        const isOwner = ownerNumber.includes(senderNumber)
                        
                        switch (command) {



                                default:
                                        if (body.startsWith('>')){
                                          if (!isOwner) return
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
                                            reply(util.format(eval(`;(async () => {${konsol}})()`)))
                                          } catch(e){
                                            reply(String(e))
                                          }
                                        }
                        }
                } catch (e) {
                        const emror = String(e)
                        console.log(emror)
                }
        })
}

iniciar('./session.json')
