const { fileUploadExpress }  =  require("../middlewares/fileUploadExpress");
const ImageUploadModel  = require("../models/imageUpload");

exports.save = async (req, res) => {
  if (!req.file) {
    res.json({ status: 200, data: "Please select file" });
  }
  try {
    await ImageUploadModel.deleteMany({});
    const save = await ImageUploadModel.create({
      image_name: req.file.filename,
      image_folder_name: "uploads",
    });
    if (!save) res.json({ status: 200, data: "Something is wrong" });
    res.json({ status: 200, message: "File Save Successfully", data: save });
  } catch (e) {
    res.json({ status: 500, data: e.message });
  }
};

exports.expressSave = async (req, res) => {
  if (!req.files) {
    res.status(400).json({ status: "error", message: "Please Select File." });
  }
  try {
    const file = req.files.filename;
    const directory = "./public/uploads";

    const isValidFile = await fileUploadExpress({filename: file.name, data: file.data, directory:directory, size: file.size});
    if (isValidFile.status !=='success') {
      res.status(400).json(isValidFile);
    }

    const imageName =  isValidFile.imageName

    file.mv(`${directory}/` + imageName);

    await ImageUploadModel.deleteMany({});
    const save = await ImageUploadModel.create({
      image_name: imageName,
      image_folder_name: "uploads",
    });
    if (!save) res.json({ status: 200, data: "Something is wrong" });
    res.json({ status: 200, message: "File Save Successfully", data: save });
  } catch (e) {
    res.json({ status: 500, data: e.message });
  }
};
