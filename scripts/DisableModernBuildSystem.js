var fs = require('fs'), path = require('path');

module.exports = function(context) {

    var buildJSON = path.join(context.opts.projectRoot, 'build.json');
    
    if (fs.existsSync(buildJSON)) {
     
      fs.readFile(buildJSON, 'utf8', function (err,data) {
        
        if (err) {
          throw new Error('>>> Unable to read build.json: ' + err);
        }
        
        var result = data;
        var shouldBeSaved = false;

        if (!data.includes("UseModernBuildSystem")){
          shouldBeSaved = true;
          result = data.replace(/"}/g, '", "buildFlag": ["-UseModernBuildSystem=0"]}');
        } else {
          console.log(">>> build.json already modified <<<");
        }

        if (shouldBeSaved){
          fs.writeFile(buildJSON, result, 'utf8', function (err) {
          if (err) 
            {throw new Error('>>> Unable to write into build.json: ' + err);}
          else 
            {console.log(">>> build.json edited successfuly <<<");}
        });
        }

      });
    } else {
        console.log(">>> WARNING: build.json was not found. The build phase may not finish successfuly");
    }
  }
