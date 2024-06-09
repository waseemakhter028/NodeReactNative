const fs = require("fs");
const path = require("path");
const FileType = require("file-type");

exports.fileUploadExpress = async ({
  filename,
  data,
  directory,
  size,
  maxSize = 2,
  allowedExtensions = ["jpeg", "png", "gif", "jpg"],
  allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"],
}) => {
  const fileInfo = await FileType.fromBuffer(data);
  const ext = fileInfo.ext.toLowerCase();
  const mimetype = fileInfo.mime.toLowerCase();

  const maxFileSize = maxSize * 1024 * 1024;

  if (
    !allowedMimeTypes.includes(mimetype) ||
    !allowedExtensions.includes(ext)
  ) {
    return {
      status: "error",
      message: "Please Select jpg, jpeg, png and gif only.",
    };
  }

  if (size > maxFileSize) {
    return {
      status: "error",
      message: "Max file size is allowed " + maxSize + " MB",
    };
  }
  // unlink old files
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

  return {
    status: "success",
    imageName: Math.floor(Math.random() * 1000000000) + "_" + filename,
  };
};
