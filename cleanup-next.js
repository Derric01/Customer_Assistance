const fs = require('fs'); const path = require('path'); const rimraf = require('rimraf'); rimraf.sync('.next', { force: true }); console.log('.next directory removed successfully');
