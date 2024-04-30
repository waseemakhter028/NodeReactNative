import mongoose from "mongoose"
const Schema = mongoose.Schema

const imageUploadSchema = Schema(
  {
    image_name: {
      type: String,
    },
    image_folder_name: {
      type: String,
      default: 'uploads'
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true, strict: true }
)

export default mongoose.model('Image_Upload', imageUploadSchema)
