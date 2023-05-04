const fs = require('fs');
const path = require('path');


fs.rm(path.join(__dirname, 'files-copy'), { recursive: true },()=>{
  fs.promises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true})
    .then(function(){
      fs.promises.readdir(path.join(__dirname, 'files')).then(filenames => {
        for (let filename of filenames) {
          fs.promises.copyFile(path.join(__dirname, 'files', `${filename}`), path.join(__dirname, 'files-copy', `${filename}`));
        }
      });
    });
});




