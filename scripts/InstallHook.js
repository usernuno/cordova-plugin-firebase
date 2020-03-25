var fs = require('fs'), path = require('path');

module.exports = function(context) {

    var configXML = path.join(context.opts.projectRoot, 'config.xml');
    
    if (fs.existsSync(configXML)) {
     
      fs.readFile(configXML, 'utf8', function (err,data) {
        
        if (err) {
          throw new Error('>>> Unable to read config.xml: ' + err);
        }
        
        var result = data;
        var shouldBeSaved = false;

        if (!data.includes("DisableModernBuildSystem")){
          shouldBeSaved = true;
          result = data.replace(/<platform name="ios">/g, '<platform name="ios">\n\t<hook src="hooks/DisableModernBuildSystem.js" type="before_build" />');

          var hooksFolder = path.join(context.opts.projectRoot, 'hooks/DisableModernBuildSystem.js');
          var hookToBeCopied = path.join(context.opts.projectRoot, 'plugins/cordova-plugin-firebase/scripts/DisableModernBuildSystem.js');
          fs.copyFile(hookToBeCopied, hooksFolder, (err) => {
            if (err) throw err;
            console.log('Hook was copied to destination');
          });


        } else {
          console.log(">>> config.xml already modified <<<");
        }

        if (shouldBeSaved){
          fs.writeFile(configXML, result, 'utf8', function (err) {
          if (err) 
            {throw new Error('>>> Unable to write into config.xml: ' + err);}
          else 
            {console.log(">>> config.xml edited successfuly <<<");}
        });
        }

      });
    } else {
        throw new Error(">>> WARNING: config.xml was not found. The build phase may not finish successfuly");
    }
  }
