'use strict';

const fs = require('fs');

console.log('building .env files...')

let rawData = fs.readFileSync('secrets.json');
let secrets = JSON.parse(rawData).secrets;

secrets.forEach((secret) => {
  let baseFile = fs.readFileSync('./base-env/' + secret.env + '-base.env');
  let output = baseFile + 'AUTH_CLIENT_SECRET=' + secret.secret + '\n'
  fs.writeFileSync('env/' + secret.env + '.env', output);
})

console.log('finished building .env files')




