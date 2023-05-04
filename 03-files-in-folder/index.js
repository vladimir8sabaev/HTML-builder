const fs = require('fs');
const path = require('path');
fs.promises.readdir(path.join(__dirname, 'secret-folder'),{withFileTypes: true})
  .then(filenames => {
    for (let filename of filenames) {
      if(filename.isFile()){
        fs.stat(path.join(__dirname, 'secret-folder', `${filename.name}`), (err, stats) => {
          const size = stats.size;
          console.log(`${filename.name.split('.')[0]} - ${filename.name.split('.')[1]} - ${size}`);
        });
      }
    }
  })
  .catch(err => {
    console.log(err);
  });