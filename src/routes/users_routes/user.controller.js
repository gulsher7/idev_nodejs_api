const UserModel = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async(req, res) =>{
    const {email, userName,password} = req.body
    try {
        let checkUser = await UserModel.findOne({"$or": [{email: email}, {userName: userName}]})

            if(!checkUser){
                const salt = await bcrypt.genSalt()
                const passowrdHash = await bcrypt.hash(password, salt)
                let result = await UserModel.create({
                    ...req.body,
                    password: passowrdHash
                })
                res.send({
                    data: result,
                    message:"User created succesfully...!!!",
                    status: true
                })
            }else{
                res.status(403).json({status: false, message:"user already exist" })
            }

    } catch (error) {
        res.status(403).json({status: false, error:error })
    }
}

const loginUser = async(req, res) =>{
    const {email, password} = req.body

        try {
            const result = await UserModel.findOne({email: email})
            if(!!result){
               let isPasswordValid = await bcrypt.compare(password, result.password) 
                if(!!isPasswordValid){
                const token = jwt.sign({user_id: result?._id, email }, process.env.TOKEN_KEY);
                    result.token = token
                    res.send({
                        data: result,
                        status: true
                    })
                }else{
                    res.status(403).json({status: false, error:"Password/email not correct" }) 
                }
            }else{
                res.status(403).json({status: false, error:"Password/email not correct" })
            }
          
        } catch (error) {
            res.status(403).json({status: false, error:error })
        }
}

module.exports = {
    createUser,
    loginUser
}