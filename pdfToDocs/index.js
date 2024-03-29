
const express = require('express');
const multer = require('multer');
const { PythonShell } = require('python-shell');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3005;

const uploadDestination = 'uploads';

if (!fs.existsSync(uploadDestination)) {
  fs.mkdirSync(uploadDestination);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDestination);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
 
const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.post('/pdftodocx', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const pyshell = new PythonShell('convert_pdf_to_docx.py', {
    mode: 'text',
    pythonPath: 'python', // Use the correct path to the Python executable
    scriptPath: __dirname,
    args: [req.file.path],
  });

  pyshell.on('message', (message) => {
    console.log(message);
  });

  pyshell.on('error', (error) => {
    console.error(error);
    res.status(500).send('An error occurred.');
  });

  pyshell.end((err) => {
    if (err) {
      return res.send(err);
    }

    const docxFilePath = req.file.path.replace('.pdf',".doc");
console.log(docxFilePath)
 
 return   res.download(docxFilePath, "converted.doc", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred during download.');
      }
    });
  });
});
 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 