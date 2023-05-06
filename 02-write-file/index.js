const fs = require('fs');
const path = require('path');
const os = require('os');
const {stdin, stdout } = process;
const readline = require('readline');
process.on('exit', () => stdout.write('Bye, you are cool!'));

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface(stdin, stdout);
const EOL = os.EOL;
stdout.write('Hi, username! you can type anything you want!\n');

rl.on('line', (input) => {
  if(input.trim() === 'exit'){
    process.exit();
  }
  output.write(`${input}${EOL}`);
});

process.on('SIGINT', () => process.exit());
