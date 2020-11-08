const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");

router.use(express.urlencoded({extended:true}));

router.route("/register")
    //show all user
    .get(async (req,res)=>{
        try {
            const getAllUser = res.json(await User.findAll({}));

        } catch (err) {
            console.error(err.message);
            res.status(500).json(err);
        }
    })
    //insert new user
    .post(async (req,res)=>{
        try {
            const {username, email, password} = req.body;

            bcrypt.hash(req.body.password, 10).then(async (hash)=>{
                const newUser =  new User({
                    username, email, password: hash
                })
                await newUser.save();
                const message = "User successfully inserted!";
                res.json({newUser, message:message});
            })
        } catch (err) {
            console.error(err.message);
            res.status(500).json(err);
        }
    });

router.route("/register/:id")
    //search user by id
    .get(async (req,res)=>{
        try {
            const id = req.params.id;
            const getUser = res.json(await User.findOne({
                where: {id:id}
            }));

        } catch (err) {
            console.error(err.message);
            res.status(500).json(err);
        }
    })
    //edit user
    .put(async (req,res)=>{
        try {
            const {username, email, password} = req.body;
            const id = req.params.id;
            
            bcrypt.hash(req.body.password, 10).then(async (hash)=>{
                const editUser = await User.update({
                    username, email, password:hash
                },{where: {id:id}});
                await editUser; 
                return res.json('User successfully edited!');
            })

        } catch (err) {
            console.error(err.message);
            return res.status(500).json({message:"server error"});
            }
    })
    //delete user
    .delete(async (req,res)=>{
        try {
            const id= req.params.id;
            const deleteUser = await User.destroy({
                where: {id:id}
            });
            await deleteUser; 
            res.json("User successfully deleted!")
        } catch (err) {
            console.error(err.message);
            res.status(500).send("server error");
        }
    });

module.exports = router;