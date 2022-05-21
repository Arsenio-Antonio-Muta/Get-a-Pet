const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {
  static async register(req, res) {
    const {name, email, phone, password, confirmpassword} = req.body

    // Validations

    if (!name) {
      res.status(422).json({message: 'O nome é obrigatório'})

      return
    }

    if (!email) {
      res.status(422).json({message: 'O email é obrigatório'})

      return
    }

    if (!phone) {
      res.status(422).json({message: 'O phone é obrigatório'})

      return
    }

    if (!password) {
      res.status(422).json({message: 'A senha é obrigatório'})

      return
    }

    if (!confirmpassword) {
      res.status(422).json({message: 'Confirm password é obrigatório'})

      return
    }

    if (password !== confirmpassword) {
      res.status(422).json({message: 'A senha e a confirm senha precisam ser iguais'})

      return
    }

    // Check if user exist
    const userExist = await User.findOne({email: email})

    if (userExist) {
      res.status(422).json({message: 'Este email já esta em uso'})

      return
    }

    // Create a password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
      name: name,
      email: email,
      password: passwordHash,
      phone: phone,
    })

    try {
      const newUser = await user.save()

        const token = await createUserToken(newUser, req, res)
        console.log(token)
    }catch (err) {
      res.status(500).json({ message: err})
    }

  }

  static async login(req, res) {
    const { email, password } = req.body

    if (!email) {
      res.status(422).json({message: 'O email é obrigatório'})

      return
    }

    if (!password) {
      res.status(422).json({message: 'A senha é obrigatório'})

      return
    }

    // check if user exist
    const user = await User.findOne({ email: email})

    if (!user) {
      res.status(422).json({message: 'Este usuário não existe'})

      return
    }

    // check if password match with db password
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
      res.status(422).json({message: 'Passworde Inválida'})

      return
    }

    await createUserToken(user, req, res)
  }

  static async checkUser(req, res) {

    let currentUser

    console.log(req.headers.authorization)

    if(req.headers.authorization) {
      
      const token = getToken(req)
      const decoded = jwt.verify(token, 'nossosecret')

      currentUser = await User.findById(decoded.id)

      currentUser.password = undefined

    } else {
      currentUser = null
    }

    res.status(200).send(currentUser)
    
  }

  static async getUserById(req, res) {

    const id = req.params.id

    const user = await User.findById(id).select('-password')

    if(!user) {
      res.status(422).json({ 
        message: 'Usuário não encontrado!', 
      })
      return
    }

    res.status(200).json({ user })
  }

  static async editUser(req, res) {
    
    // check if user exist
    const token = getToken(req)
    const user = await getUserByToken(token)

    const {name, email, phone, password, confirmpassword} = req.body

    let image = ''

    if(req.file) {
      image = req.file.filename
    }

    // Validations
    if(!name){
      res.status(422).json({message: 'O nome é obrigatório!'})
      return
    }

    user.name = name

    if(!email) {
      res.status(422).json({message: 'O email é '})
    }

    // Check if user exis
    const userExists = await User.findOne({email: email})

    if(user.email !== email && userExists){
      res.status(422).json({message: 'O email já está em uso, usa outro email'})
      return
    }

    user.email = email

    if (image) {
      const imageName = req.file.filename
      user.image = imageName
    }

    if(!phone) {
      res.status(422).json({message: 'O número de telefone é obrigatório'})
      return
    }

    user.phone = phone

    //check if password match

    if(password != confirmpassword){
      res.status(422).json({message: 'As senhas não conferem!!!'})
      return
    } else if(password === confirmpassword && password != null) {
      // creating password
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      user.password = passwordHash
    }

    try {

        // return user update data
        await User.findByIdAndUpdate(
          {_id: user._id},
          {$set: user},
          {new: true}
        )  
          res.status(200).json({message: 'Usuário atualizado com sucesso'})
      } catch(err) {
        res.status(500).json({message: err})
        return
      }

  }

}