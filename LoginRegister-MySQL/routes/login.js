const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { get } = require("./register.js");

router.use(express.urlencoded({extended:true}));

router.post("/login", async (req,res)=>{
    try {
        const {username, password} = req.body;

        if(username && password){
            const getUser = await User.findOne({
                where: {username:username}
            });
            if(!getUser){
                return res.status(401).json({message:"Username tidak terdaftar"});
            }
            bcrypt.compare(req.body.password, getUser.password).then(result=>{
                if(result){
                    return res.status(200).json({message: "Selamat anda berhasil login", username: username});
                }else{
                    return res.status(401).json({message: "Password salah !"});
                }
            });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({message:"server error"});
    }
})

module.exports = router;