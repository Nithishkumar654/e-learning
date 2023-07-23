const exp = require('express')

const app = exp()
const path = require('path')

app.listen(3500, () => console.log('server listening on port 3500...'))

const userApp = require('./APIs/usersAPI')
app.use('/user-api', userApp)

const conversationsApp = require('./APIs/conversationsAPI')
app.use('/conversation-api', conversationsApp)

const mclient = require('mongodb').MongoClient;

mclient.connect('mongodb://127.0.0.1')
.then(dbRef => {
    const dbObj = dbRef.db('chatsdb')
    const usersCollectionObj = dbObj.collection('usersCollection')
    const conversationsCollectionObj = dbObj.collection('conversationsCollection')

    app.set('usersCollectionObj', usersCollectionObj)
    app.set('conversationsCollectionObj', conversationsCollectionObj)

    console.log('DB Connection Success..')
})
.catch(err => console.log('DB error' + err))

const invalidPathMiddleware = (req, res, next) => {
    res.send({message: 'Invalid Path'})
}
app.use(invalidPathMiddleware)

const errhandlingMiddleware = (error, req, res, next) => {
    res.send({message: error.message})
}
app.use(errhandlingMiddleware)