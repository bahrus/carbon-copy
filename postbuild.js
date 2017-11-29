const fs = require('fs-extra')
try{
    fs.copySync('build/ES5/src/v0/carbon-copy.js', 'build/ES5/carbon-copy.js')
    fs.copySync('build/ES6/src/v0/carbon-copy.js', 'build/ES6/carbon-copy.js')
}catch(err){
    console.error(err);
}
