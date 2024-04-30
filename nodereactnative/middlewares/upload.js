import multer from 'multer'
import path from 'path'
import fs from "fs";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = "./public/uploads";
    fs.readdir(directory, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(directory, file), (err) => {
          if (err) throw err;
        });
      }
    });
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    
    cb(null, path.parse(file.originalname.trim()).name+'-'+Date.now()+path.extname(file.originalname))
  },
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|svg/

    //check extension names
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase())

    const mimeType = fileTypes.test(file.mimetype)

    if (mimeType && extName) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg, gif, svg and .jpeg format allowed!'))
    }
  }
})

// const upload = multer({ dest: path.join(__dirname, 'uploads/') })
export {
  storage
}
