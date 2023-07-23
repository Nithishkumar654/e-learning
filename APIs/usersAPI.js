const exp = require('express')
const userApp = exp.Router()
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const expressAsyncHandler = require('express-async-handler')

userApp.get('/get-users', expressAsyncHandler( async(req, res) => {
    const usersCollectionObj = req.app.get('usersCollectionObj')

    let usersList = await usersCollectionObj.find().toArray()

    res.status(200).send({message: 'Users List', users: usersList})
})
);

userApp.use(exp.json())

userApp.post('/register', expressAsyncHandler( async(req, res) => {
    const usersCollectionObj = req.app.get('usersCollectionObj')

    const newUser = req.body;

    let userObj = await usersCollectionObj.findOne({userid: newUser.userid})

    if(userObj === null){

        if(newUser.password !== newUser.repeatPassword){
            res.status(200).send({message: "Password and Repeat Password must be Same..!!"})
        }else{

            const hashedPassword = await bcryptjs.hash(newUser.password, 9)
            
            newUser.password = hashedPassword
            delete newUser.repeatPassword

            await usersCollectionObj.insertOne(newUser)
            res.status(201).send({message: 'User Added', success: true})
        }

    }else{
        res.status(200).send({message: 'UserID already exists'})
    }
})
);


userApp.post('/login', expressAsyncHandler( async(req, res) => {

    const usersCollectionObj = req.app.get('usersCollectionObj')

    const user = req.body;

    let userObj = await usersCollectionObj.findOne({userid: user.userid});

    if(userObj === null){
        res.status(200).send({message: 'Invalid UserID'})
    }else{

        let isEqual = await bcryptjs.compare(user.password, userObj.password)

        if(isEqual === false){
            res.status(200).send({message: 'Incorrect Password'})
        }else{

            let jwtToken = jwt.sign({userid: user.userid}, 'abcdef', {expiresIn: '2m'})

            res.status(201).send({message: 'Login Success', success: true, token: jwtToken, user: userObj.userid})
        }
    }
}))

module.exports = userApp;