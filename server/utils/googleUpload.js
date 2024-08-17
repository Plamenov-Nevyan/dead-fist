import path from "path"
const {google} = require('googleapis')
const bufferToStream = require('./bufferToStream')
const serviceAccountPath = path.resolve('src', 'config', 'service-account.json')
const scopes = ['https://www.googleapis.com/auth/drive']
const auth = new google.auth.GoogleAuth({
    keyFilename: serviceAccountPath,
    scopes
})
const driveService = google.drive({version:'v3', auth})
module.exports = (file) => {
    return driveService.files.create({
       media:{
           mimeType: file.mimetype,
           body: bufferToStream(file.buffer)
       },
       resource:{
           'name': file.originalname,
           'parents': ['1vcXGjc-lYsiIxxs3Fww05H3YXa_7PDRJ']
       },
       fields: "id"
   })
}