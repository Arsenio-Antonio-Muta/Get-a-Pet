const multer = require('multer')
const path = require('path')

// Destination to storage images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {

    let folder = ""

    if (req.baseUrl.includes("users")) {
      folder = "users"
    } else if(req.baseUrl.includes("pets")) {
      folder = "pets"
    }

    cb(null, `public/images/${folder}/`)

  },
  filename: function(req, file, cb) {
    cb(null,Date.now() + String(Math.random()*500) + path.extname(file.originalname))
  }
})

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|IMG)$/)) {
      return cb(new Error('Por favor, envie apenas jpg ou png'))
    }
    cb(undefined, true)

  },
})

module.exports = { imageUpload }