const { Router } = require("express");
//  const multer from 'multer'
const {
  save,
 expressSave,
} = require("../../../controllers/ImageUpload.controller");
//  const { storage, fileFilter, limits } from '../../../middlewares/upload.js'
const { fileUpload } = require("../../../middlewares/fileUpload");

const router = Router();

// const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits,})

const upload = fileUpload();

function uploadMiddleware(req, res, next) {
  try {
    upload.single("filename")(req, res, function (err) {
      if (err) res.status(400).json({ status: "error", message: err.message , data: 'File upload' });
      else next();
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: "fileVaidation Error" });
  }
}

// router.post("/save", uploadMiddleware, save);
router.post("/save", expressSave);
router.post("/expresssave", expressSave);

module.exports = router;
