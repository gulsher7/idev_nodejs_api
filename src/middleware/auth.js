const jwt = require('jsonwebtoken');

const verifyToken = async(req, res, next) =>{
    const token = !!req?.headers["authorization"] ? req?.headers["authorization"].split(' ')[1] : null
    // console.log("tokentoken",token)
    if(!token){
        return res.status(403).send("A token is required for authentication")
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = decoded
    } catch (error) {
        return res.status(403).send("Invalid token")
    }
    next()
}

module.exports = verifyToken