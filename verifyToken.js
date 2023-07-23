const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
    const bearerToken = req.body.bearer
    if(bearerToken === undefined){
        res.send({message: 'Unauthorized Access..\nPlz Login first..'})
    }else{
        const token = bearerToken
        try{
            jwt.verify(token, 'abcdef')
            next()
        }catch(err){
            next(new Error('Session Expired. Plz Login Again..'))
        }
    }
}

module.exports = verifyToken