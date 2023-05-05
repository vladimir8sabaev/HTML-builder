const fs = require('fs');
const path = require('path');
const readline = require('readline');
let arrHtml = [];
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
  fs.promises.readdir(path.join(__dirname, 'components'),{withFileTypes: true})
    .then(filenames => {
      for (let filename of filenames) {
        if(filename.isFile() && filename.name.split('.')[1] === 'html'){
          arrHtml.push(`${filename.name.split('.')[0]}`);
        }
      }
    })
    .catch(err => {
      console.log(err);
    });
  async function  processLineByLine() {
    const rl = readline.promises.createInterface({
      input: fs.createReadStream(path.join(__dirname, 'template.html')),
      output: fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'))
    });
    for await (let line of rl) {
      line = line.trim();
      if(arrHtml.indexOf(line.slice(2, line.length-2)) !== -1){
        line = line.slice(2, line.length-2);
        const readableStream = fs.createReadStream(path.join(__dirname, 'components', `${line}.html`), 'utf-8');
        readableStream.on('error', error => console.log('Error', error.message));
        let data = '';
        readableStream.on('data', chunk => data+= chunk);
        // обезопасился от файлов большого размера, которые не влезут в один chunk
        await readableStream.on('end', () => rl.output.write(data + '\n'));
      } else{
        rl.output.write(line + '\n');
      }
    }
  }
  processLineByLine();
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



