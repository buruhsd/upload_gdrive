const fs = require('fs');
const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const path = require('path');

// Fungsi untuk mendapatkan informasi file
function getFileInfo(filePath) {
  const fileInfo = {
    name: path.basename(filePath), // Mengambil nama file dari path
    mimeType: 'application/octet-stream', // Tipe MIME default, dapat diubah sesuai kebutuhan
  };

  // Mendapatkan tipe MIME berdasarkan ekstensi file
  const fileExt = path.extname(filePath);
  switch (fileExt) {
    case '.txt':
      fileInfo.mimeType = 'text/plain';
      break;
    case '.png':
      fileInfo.mimeType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      fileInfo.mimeType = 'image/jpeg';
      break;
    // Tambahkan case untuk tipe MIME lain sesuai kebutuhan Anda
    default:
      break;
  }

  return fileInfo;
}

// Fungsi untuk mengunggah file ke Google Drive
async function uploadFileToDrive(auth, filePath, folderId) {
  const drive = google.drive({ version: 'v3', auth });
  const fileInfo = getFileInfo(filePath);

  const fileMetadata = {
    name: fileInfo.name,
    parents: [folderId],
  };

  const media = {
    mimeType: fileInfo.mimeType,
    body: fs.createReadStream(filePath),
  };

  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
  });

  console.log('File ID:', res.data.id);
}

async function main() {
  try {
    const credential = path.join(__dirname, 'credentials.json');
    console.log(credential)
    const auth = await authenticate({
      keyfilePath: credential,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    console.log(auth)
    const filePath = '/home/buruhsd/Downloads/Laporan.pdf';
    const folderId = '1PQA47ejS5qmqVAqXjIUfDF6WxyAE6BEe';

    await uploadFileToDrive(auth, filePath, folderId);
  } catch (err) {
    console.error('Error uploading file:', err);
  }
}

main();
