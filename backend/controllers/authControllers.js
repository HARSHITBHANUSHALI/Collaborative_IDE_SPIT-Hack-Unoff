const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
 try {
   const { name, email, password } = req.body;

   if (!name || !email || !password) {
     return res.status(400).json({ message: 'All fields are required' });
   }


   const existingUser = await User.findOne({ email });
   if (existingUser) {
     return res.status(400).json({ message: 'Email already exists' });
   }

   const hashedPassword = await bcrypt.hash(password, 10);
   const user = await User.create({
     name, email, password: hashedPassword
   });
   await user.save();
   return res.status(201).json({ message: 'Registration successful' });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};

const login = async (req, res) => {
 try {
   const { email, password } = req.body;

   if (!email || !password ) {
     return res.status(400).json({ message: 'All fields required' });
   }


   const user = await User.findOne({ email });
   if (!user || !(await bcrypt.compare(password, user.password))) {
     return res.status(401).json({ message: 'Invalid credentials' });
   }

   const token = jwt.sign({
     id: user._id,
     name: user.name,
     email: user.email
   }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

   res.cookie('jwt', token, {
     httpOnly: true,
     sameSite: 'strict',
     maxAge: 24 * 60 * 60 * 1000 // 1 day
   });

   res.status(200).json({
     user: {
       id: user._id,
       name: user.name,
       email: user.email,
     }
   });

 } catch (error) {
   res.status(500).json({ message: error.message });
 }
};


module.exports = { register, login };