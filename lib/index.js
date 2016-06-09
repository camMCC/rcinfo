(function() {
    var path, execFile;
    
    path = require('path');
    execFile = require('child_process').execFileSync;

    module.exports = function(winfile) {
        var args, child, executable, options;

        executable = path.resolve(__dirname, '..', 'bin', 'ShowVer.exe');
        options = { cwd: path.resolve(__dirname, '..') };
        args = [winfile];
        
        if (process.platform !== "win32") {
          // replace executable with wine      
          args.unshift(executable); 
          executable = "wine";
        }

        var stdout;
        try {
            stdout = execFile(executable, args, options);
        } catch (err) {
            // The ShowVer app is very confused and successfully exits with a non-zero return code (meaning it fails)
            //  but that is considered to be success, so we deal with it here
            stdout = err.stdout.toString();
        }

        var map, key, value, 
            lines = stdout.split(/\r?\n/),
            info = {};
        
        lines.forEach(function(line, index) {          
          // skip first line          
          if (index > 0 && line) {
            map = line.split(/:(.+)/); // split on : first occurence only
            key = map[0].trim();
            value = map[1].trim();              
            
            // only add new key/value pair (no overwrite)
            if(!info[key]){            
              info[key] = value;
            }
          }                   
        });
        
        return info
    };

}).call(this);
