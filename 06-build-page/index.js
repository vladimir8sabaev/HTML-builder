const fs = require('fs');
const path = require('path');
fs.rm(path.join(__dirname, 'project-dist'), { recursive: true },()=>{
  fs.promises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true})
    .then(function(){
      const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
      fs.promises.readdir(path.join(__dirname, 'styles'),{withFileTypes: true})
        .then(filenames => {
          for (let filename of filenames) {
            if(filename.isFile() && filename.name.split('.')[1] === 'css'){
              const readableStream = fs.createReadStream(path.join(__dirname, 'styles', `${filename.name}`), 'utf-8');
              readableStream.on('error', error => console.log('Error', error.message));
              let data = '';
              readableStream.on('data', chunk => data+= chunk);
              // обезопасился от файлов большого размера, которые не влезут в один chunk
              readableStream.on('end', () => output.write(data + '\n'));
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  function streamAsPromise(stream) {
    return new Promise((resolve, reject) => {
      let data = '';
      stream.on('data', chunk => data += chunk);
      stream.on('end', () => {
        resolve(data);
      });
      stream.on('error', error => reject(error));
    });
  }

  async function replaceAsPromise(filenames,data){
    for (let filename of filenames) {
      await streamAsPromise(fs.createReadStream(path.join(__dirname, 'components', `${filename.name}`))).then((replace)=>{
        data = data.replace(`{{${filename.name.split('.')[0]}}}`, replace);
      });
    }
    return data;
  }
  streamAsPromise(fs.createReadStream(path.join(__dirname, 'template.html'))).then((data)=>{
    const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
    fs.promises.readdir(path.join(__dirname, 'components'),{withFileTypes: true})
      .then(filenames => {
        replaceAsPromise(filenames,data).then((template)=>{
          output.write(template);
        });
      });
  });

  fs.rm(path.join(__dirname, 'project-dist', 'assets'), { recursive: true },()=>{
    fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true})
      .then(copyFolder());
  });
  function copyFolder(){
    fs.promises.readdir(path.join(__dirname, 'assets')).then(foldernames => {
      for (let foldername of foldernames) {
        fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets', `${foldername}`), {recursive: true})
          .then(function(){
            fs.promises.readdir(path.join(__dirname, 'assets', `${foldername}`)).then(filenames => {
              for (let filename of filenames) {
                fs.promises.copyFile(path.join(__dirname, 'assets', `${foldername}`, `${filename}`), path.join(__dirname, 'project-dist', 'assets', `${foldername}`, `${filename}`));
              }
            });
          });
      }
    });
  }
});




// let input = fs.createReadStream(path.join(__dirname, 'components', `${filename.name}`), 'utf-8');
//             let replace = '';
//             input.on('data', chunk => replace += chunk);
//             input.on('end', (replace) => {
//               console.log(replace);
//               data = data.replace(`{{${filename.name.split('.')[0]}}}`, replace);
//             });