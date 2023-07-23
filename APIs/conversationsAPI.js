const exp = require('express')
const conversationsApp = exp.Router()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const expressAsyncHandler = require('express-async-handler')

conversationsApp.use(exp.json())

conversationsApp.post('/get-messages', expressAsyncHandler( async(req, res) => {
    const conversationsCollectionObj = req.app.get('conversationsCollectionObj')

    let messagesList = await conversationsCollectionObj.find({ $or: [{ $and: [ {senderId: req.body.host}, {receiverId: req.body.person} ] }, 
        { $and: [ {senderId: req.body.person}, {receiverId: req.body.host} ] } ] }).toArray();

    
    res.status(200).send({message: 'Conversation', chat: messagesList})
}))

conversationsApp.post('/send-message', expressAsyncHandler( async(req, res) => {
    const conversationsCollectionObj = req.app.get('conversationsCollectionObj')

    const newMessage = req.body

    let response = await conversationsCollectionObj.insertOne(newMessage)

    res.status(200).send({success: true, message: 'Message Sent'})

}))

module.exports = conversationsApp;