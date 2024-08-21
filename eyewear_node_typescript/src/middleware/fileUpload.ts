import fs from 'fs';
import path from 'path';
import { fromBuffer } from 'file-type';
import { getRootPath, rand } from '../utils/common';

const fileUploadExpress = async ({
  filename = '',
  data = new ArrayBuffer(24), // default value
  directory = 'users',
  size = 0,
  maxSize = 5,
  allowedExtensions = ['jpeg', 'png', 'gif', 'jpg'],
  allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
  dbFileName = '',
}) => {
  const fileInfo = await fromBuffer(data);
  const ext = fileInfo?.ext.toLowerCase() ?? '';
  const mimetype = fileInfo?.mime.toLowerCase() ?? '';

  const maxFileSize = maxSize * 1024 * 1024;

  if (!allowedMimeTypes.includes(mimetype) || !allowedExtensions.includes(ext)) {
    return {
      status: 'error',
      message: 'Please Select jpg, jpeg, png and gif only.',
    };
  }

  if (size > maxFileSize) {
    return {
      status: 'error',
      message: 'Max file size is allowed ' + maxSize + ' MB',
    };
  }
  // unlink old files
  if (dbFileName !== '') {
    const filePath = `${getRootPath()}/${directory}`;
    if (fs.existsSync(filePath + '/' + dbFileName)) {
      fs.unlink(path.join(filePath, dbFileName), (err) => {
        if (err) throw err;
      });
    }
  }

  return {
    status: 'success',
    imageName: rand(1000000000, 9999999999) + '_' + filename,
  };
};

export default fileUploadExpress;
