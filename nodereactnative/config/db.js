import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost/bags-ecommerce'
    await mongoose
      .connect(uri)
      .catch((error) => console.log('Mongo Connection Error: ' + error))
    // const connection = mongoose.connection
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
    console.log('MONGODB CONNECTED SUCCESSFULLY!')
  } catch (error) {
    console.log(error)
    return error
  }
}

export default connectDB
