// Written 2015 by Kevin H. <nehalist.io>
//
// "Doubt kills more dreams than failure ever will" - Suzy Kassem

"use strict";

var path = require('path');

module.exports = function(grunt) {
  // jit-grunt loads all tasks - second parameter is for
  // mapping non-resolvable plugins
  require('jit-grunt')(grunt, {
    'shell'         : 'grunt-shell-spawn',
    'browserSync'   : 'grunt-browser-sync',
    'scsslint'      : 'grunt-scss-lint'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // BrowserSync configuration
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '*.hbs',
            'partials/*.hbs',
            'assets/**/*.*'
          ]
        }
      },
      options: {
        watchTask: true,
        proxy: 'localhost:2368'
      }
    },

    // Watch tasks
    watch: {
      // In case of changes to the Gruntfile reload Grunt
      buildSystem: {
        files: [
          'Gruntfile.js'
        ],
        options: {
          reload: true
        }
      },

      // Compile SASS on changes
      sass: {
        files: [
          'assets/scss/*.{scss,sass}'
        ],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      },

      // Install bower components on changes to the bower.json
      bower_components: {
        files: [
          'bower.json'
        ],
        tasks: ['shell:bower', 'bower_concat']
      }
    },

    // Copies font awesome fonts to the fonts directory
    copy: {
      icons: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'bower_components/font-awesome/fonts',
          src: ['*.*'],
          dest: 'assets/fonts'
        }]
      }
    },

    // Compile SASS
    sass: {
      dist: {
        options: {
          sourcemap: 'none'
        },
        files: {
          'assets/css/style.css': 'assets/scss/base.scss'
        }
      }
    },

    // Execution commands to run bower
    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      bower: {
        command: path.resolve(process.cwd() + '/node_modules/.bin/bower --allow-root install')
      },
      bower_prune: {
        command: path.resolve(process.cwd() + '/node_modules/.bin/bower prune')
      }
    },

    // Concatenate bower components
    // Primer is excluded since it's imported in the assets/scss/base.scss
    bower_concat: {
      all: {
        dest:     'assets/vendor/vendor.js',
        cssDest:  'assets/vendor/vendor.css',
        mainFiles: {
          'bootstrap': [
            'dist/css/bootstrap.min.css',
            'dist/js/bootstrap.min.js'
          ],
          'ghostHunter':  'jquery.ghostHunter.min.js',
          'font-awesome': 'css/font-awesome.min.css'
        },
        dependencies: {
          'ghostHunter': ['jquery']
        },
        exclude: ['primer-css', 'octicons']
      }
    },

    // Clean generated files
    clean: {
      all: {
        src: [
          'assets/vendor/vendor.js',
          'assets/vendor/vendor.css',
          'assets/css/style.css',
          '!assets/fonts/!.gitignore',
          'assets/fonts/*'
        ]
      },
    },

    // JS Validation
    jshint: {
      all: ['assets/js/*.js']
    },

    // SCSS Validation
    scsslint: {
      allFiles: ['assets/scss/*.scss']
    },

    // Generate a compressed / zipped version of the theme
    // The archive doesn't contain any build files (Gruntfile, bower.json, ...)
    compress: {
      dist: {
        options: {
          archive: '<%= pkg.name %>-<%= pkg.version %>.zip'
        },
        expand: true,
        cwd: '.',
        src: [
          'assets/**',
          '!assets/scss/**',
          'partials/**',
          '*.hbs',
          'package.json',
          'screenshot.png'
        ],
        dest: '<%= pkg.name %>'
      }
    }
  });

  // Enable OS notifications
  grunt.loadNpmTasks('grunt-notify');


  // ===========================
  // TASKS
  // ===========================
  //
  // Most of these things are self-explanatory.

  grunt.registerTask('zip', 'Generate theme zip', function() {
    grunt.task.run('build');
    grunt.task.run('compress');
  });

  grunt.registerTask('validate', 'Validate CSS and JS', function() {
    grunt.task.run(['jshint', 'scsslint']);
  });

  grunt.registerTask('build', 'Build the theme', function() {
    grunt.task.run('clean');
    grunt.task.run('validate');
    grunt.task.run(['sass', 'bower_concat', 'copy']);
  });

  grunt.registerTask('default', 'Default task', function() {
    // Just build if necessary
    var build = false;
    var initFiles = [
      'assets/vendor/vendor.js',
      'assets/vendor/vendor.css',
      'assets/css/style.css'
    ];
    for(var i in initFiles) {
      if( ! grunt.file.exists(initFiles[i])) {
        build = true;
        break ;
      }
    }
    if(build) {
      grunt.log.warn('Since some (important) files are missing the build task is run automatically...');
      grunt.task.run('build');
    }

    grunt.task.run('browserSync');
    grunt.task.run('watch');
  });
};
