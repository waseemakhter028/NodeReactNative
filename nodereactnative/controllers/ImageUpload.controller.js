import ImageUploadModel from "../models/imageUpload.js";
export const save = async (req, res) => {
  console.log("waseen con")
   if(!req.file) {
    res.json({ status: 200, data: "Please select file"})
   }
  try {


    await ImageUploadModel.deleteMany({})
    const save = await ImageUploadModel.create({
      image_name: req.file.filename,
      image_folder_name: 'uploads'
      
    });
    if(!save)
    res.json({ status: 200, data: "Something is wrong"})
    res.json({ status: 200, message: "File Save Successfully", data: save});
  } catch (e) {
    res.json({ status: 500, data: e.message });
  }
};
