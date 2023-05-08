const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
const os = require('os');
const EOL = os.EOL;
fs.promises.readdir(path.join(__dirname, 'styles'),{withFileTypes: true})
  .then(filenames => {
    for (let filename of filenames) {
      if(filename.isFile() && filename.name.split('.')[1] === 'css'){
        const readableStream = fs.createReadStream(path.join(__dirname, 'styles', `${filename.name}`), 'utf-8');
        readableStream.on('error', error => console.log('Error', error.message));
        let data = '';
        readableStream.on('data', chunk => data+= chunk);
        // обезопасился от файлов большого размера, которые не влезут в один chunk
        readableStream.on('end', () => output.write(`${data}${EOL}`));
      }
    }
  })
  .catch(err => {
    console.log(err);
  });