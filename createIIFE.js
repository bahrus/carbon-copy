const jiife = require('jiife');
jiife.processFiles(['node_modules/xtal-latx/define.js', 'node_modules/xtal-latx/xtal-latx.js', 'b-c-c.js', 'c-c.js'], 'carbon-copy.js');
jiife.processFiles(['node_modules/xtal-latx/define.js', 'node_modules/xtal-latx/xtal-latx.js', 'b-c-c.js'], 'b-c-c.iife.js');



