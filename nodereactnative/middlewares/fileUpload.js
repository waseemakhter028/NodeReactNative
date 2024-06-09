const multer = require("multer");
const fs = require("fs");
const path = require("path");



exports.fileUpload = (errorMessage="Only .png, .jpg, gif, svg and .jpeg format allowed!", uploadPath = "./public/uploads",  limits = { fileSize: 10000000 }, fileValidExt = 'jpeg|jpg|png|gif|svg') => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          const directory = uploadPath
          fs.readdir(directory, (err, files) => {
            if (err) {
              throw err;
            }
      
            for (const file of files) {
              fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err;
              });
            }
          });
          cb(null, uploadPath);
        },
        filename: function (req, file, cb) {
          cb(
            null,
            path.parse(file.originalname.trim()).name +
              "-" +
              Date.now() +
              path.extname(file.originalname)
          );
        },
      });

      const  fileFilter = (req, file, cb) => {
        
        const fileTypes  = new RegExp(String.raw`/${fileValidExt}/`);
    
        //check extension names
        const extName = fileTypes.test(
          path.extname(file.originalname).toLowerCase()
        );
    
        const mimeType = fileTypes.test(file.mimetype);
    
        if (mimeType && extName) {
          cb(null, true);
        } else {
          cb(new Error(errorMessage));
        }
      }

 
      const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits,})


      return upload
}
