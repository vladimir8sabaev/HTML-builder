const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
//обезопасился от неправильного пути, названия файла или его расширения
readableStream.on('error', error => console.log('Error', error.message));
let data = '';
readableStream.on('data', chunk => data+= chunk);
// обезопасился от файлов большого размера, которые не влезут в один chunk
readableStream.on('end', () => console.log(data));
