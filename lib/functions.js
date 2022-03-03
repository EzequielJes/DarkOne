const fs = require('fs')
const axios = require('axios')

const getBuffer = async (url, options) => {
  try {
    options ? options : {}
    var res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    })
    return res.data
  } catch (e) {
    console.log(e)
  }
}

const getGroupAdmins = (participants) => {
  const admins = []
  for (let i of participants) {
    i.isAdmin ? admins.push(i.jid) : ''
  }
  return admins
}

module.exports = { getBuffer, getGroupAdmins }
