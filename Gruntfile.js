module.exports = function(grunt) {

  var directoryFocus = [];

  function recruseImports (filename) {
    var str = '',
        filecontents = '',
        matches = [],
  		  imports = /@import\W+?[\"\'](.*?)[\"\']\;/ig,
        processingDirectory = '';

    try {
      str = grunt.file.read(filename + '.scss');
    } catch (err) {
      str = grunt.file.read(directoryFocus.join('/') + '/' + filename.substr((filename.lastIndexOf('/') + 1)) + '.scss');
    }

    matches = str.match(imports);
  	if(matches !== null && matches.length > 0) {

      if (filename.substr(0, filename.lastIndexOf('/')) !== '') {

        processingDirectory = filename.substr(0, filename.lastIndexOf('/'));

        if (directoryFocus.length === 0) {
          processingDirectory = processingDirectory.replace(/^,/, '');
        }

        directoryFocus.push(processingDirectory);
      }

  		for (var i = 0; i < matches.length; i++) {
  			swapOutString = matches[i];

        filecontents = recruseImports(swapOutString.replace(imports, "$1"));

  			str = str.replace(swapOutString, filecontents);
  			filecontents = '';
  		}

      directoryFocus.pop();
	  }

	return str;
  }

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    "sasslint":{
     target: ['bk-sass-framework-dev.scss']
    },
    csslint: {
      options:{
        csslintrc: 'config/.csslintrc'
      }
     }
  });

  grunt.loadNpmTasks('grunt-sass-lint');

  // Default task(s).
  grunt.registerTask('build', function () {
  	var buildStr = recruseImports('bk-sass-precompiled');

    // This is the version that gets linted; includes
    // all the vars so linting doesn't fall over
    grunt.file.write('bk-sass-framework-dev.scss', buildStr);

    // This is the production version of bkb. The
    // one that will get released with BaseKit
    grunt.file.write('bk-sass-framework.scss', buildStr);
    grunt.task.run('sasslint');
  });
};

