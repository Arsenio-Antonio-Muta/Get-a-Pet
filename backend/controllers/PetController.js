const Pet = require('../models/Pet')

// helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const { isValidObjectId } = require('../db/conn')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class PetController {
  static async create(req, res) {
    const {name, age, weight, color} = req.body

    const images = req.files

    const available = true

    // Validations
    if(!name) {
      res.status(422).json({
        message: "O nome é obrigatório..."
      })
      return
    }

    if(!age) {
      res.status(422).json({
        message: "A idade é obrigatório..."
      })
      return
    }

    if(!weight) {
      res.status(422).json({
        message: "O peso é obrigatório..."
      })
    }

    if(!color) {
      res.status(422).json({
        message: "A cor é obrigatório..."
      })
    }

    if(!images) {
      res.status(422).json({message: "A imagem é obrigatória..."})
    }

    console.log(images)



    // Get owner pet
    const token = getToken(req)
    const user = await getUserByToken(token)
    
    // Create a pet
    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone
      }
    })

    images.map((image) => {
      pet.images.push(image.filename)
    })

    try {
      const newPet = await pet.save()

      res.status(201).json({
        message: "Pet cadastrado com sucesso",
        newPet
      })
    } catch(error) {
      res.status(500).json({
        message: error
      })
    }
  }

  static async getAll(req, res) {
    const pets = await Pet.find().sort('-createdAt')

    res.status(200).json({
      pets: pets
    })
  }

  static async getAllUserPet(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)

    const pets = await Pet.find({'user._id': user._id})

    res.status(200).json({
      pets
    })
  }

  // get all user adoptions
  static async getAllUserAdoptions(req, res) {
    const token = getToken(req)
    const user = await getUserByToken(token)

    const pets = await Pet.find({'adopter._id': user._id})

    res.status(200).json({
      pets
    })
  }

  static async getPetById(req, res) {
    const id = req.params.id

    if(!ObjectId.isValid(id)) {
      res.status(422).json({
        message: "Id Inválido!!!"
      })
      return
    }

    const pet = await Pet.find({_id: id})

    if(!pet) {
      res.status(404).json({
        message: "Pet não encotrado!!!"
      })
    }

    res.status(200).json({
      pet
    })

  }

  static async removePetById(req, res) {
    const id = req.params.id
    // check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido!' })
      return
    }
    // check if pet exists
    const pet = await Pet.findOne({ _id: id })
    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado!' })
      return
    }
    // check if user registered this pet
    const token = getToken(req)
    const user = await getUserByToken(token)
    if (pet.user._id.toString() != user._id.toString()) {
      res.status(404).json({
        message:
          'Houve um problema em processar sua solicitação, tente novamente mais tarde!',
      })
      return
    }
    await Pet.findByIdAndRemove(id)
    res.status(200).json({ message: 'Pet removido com sucesso!' })
  }

  // update a pet
  static async updatePet(req, res) {
    const id = req.params.id

    const {name, age, weight, color, available} = req.body

    const images = req.files

    const updateData = {}

    // check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido!' })
      return
    }

    //Check if pet exist
    const pet = await Pet.findOne({_id: id})

    if(!pet) {
      res.status(404).json({
        message: "Pet não encontrado!"
      })
      return
    }

    // check if user registered this pet
    const token = getToken(req)
    const user = await getUserByToken(token)
    if (pet.user._id.toString() != user._id.toString()) {
      res.status(404).json({
        message:
          'Houve um problema em processar sua solicitação, tente novamente mais tarde!',
      })
      return
    }

    // Validations
      if(!name) {
        res.status(422).json({
          message: "O nome é obrigatório..."
        })
        return
      } else {
          updateData.name = name
        }

      if(!age) {
        res.status(422).json({
          message: "A idade é obrigatório..."
        })
        return
      } else {
        updateData.age = age
      }


      if(!weight) {
        res.status(422).json({
          message: "O peso é obrigatório..."
        })
      } else {
        updateData.weight = weight
      }


      if(!color) {
        res.status(422).json({
          message: "A cor é obrigatório..."
        })
      } else {
        updateData.color = color
      }


      if(!images) {
        res.status(422).json({message: "A imagem é obrigatória..."})
      } else {
        updateData.images = []
        images.map((image) => {
          updateData.images.push(image.filename)
        })
      }

      await Pet.findByIdAndUpdate(id, updateData)

      res.status(200).json({
        message: "Pet atualizado com sucesso"
      })
  }

    // schedule a visit
    static async schedule(req, res) {
      const id = req.params.id
      // check if pet exists
      const pet = await Pet.findOne({ _id: id })

      if(!pet) {
        res.status(404).json({
          message: 'Pet não encontrado'
        })
      }
      // check if user owns this pet
      const token = getToken(req)
      const user = await getUserByToken(token)

      console.log(user)

      if(pet.user._id.equals(user._id)){
        res.status(422).json({
          message: 'Você não pode agendar uma visita com teu própio pet'
        })
      }

      //Check if user already shudele a visit
      if(pet.adopter) {
        if(pet.adopter._id.equals(user._id)) {
          res.status(422).json({
            message: 'Você já agendou uma visita com este pet'
          })
          return
        }
      }

      //Add user to pet
      pet.adopter = {
        _id: user._id,
        name: user.name,
        image: user.image
      }

      await Pet.findByIdAndUpdate(id, pet)

      res.status(200).json({
        message: `A visita foi agendada com sucesso, entre em contacto com ${pet.user.name} pelo telefone ${pet.user.phone}`
      })

    }

    static async concludeAdoption(req, res) {
      const id = req.params.id
      // check if pet exists
      const pet = await Pet.findOne({ _id: id })

      if(!pet) {
        res.status(404).json({
          message: "Pet não encontrado!!!"
        })
      }

      // check if user owns this pet
      const token = getToken(req)
      const user = await getUserByToken(token)

      if (pet.user._id.toString() != user._id.toString()) {
        res.status(404).json({
          message:
            'Houve um problema em processar sua solicitação, tente novamente mais tarde!',
        })
        return
      }

      pet.available = false
      await Pet.findByIdAndUpdate(pet._id, pet)
      res.status(200).json({
        pet: pet,
        message: `Parabéns! O ciclo de adoção foi finalizado com sucesso!`,
      })
    }
}





















































































































































































































































