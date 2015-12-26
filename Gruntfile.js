"use strict";

var path = require('path');

module.exports = function(grunt) {
  require('jit-grunt')(grunt, {
    //'shell'         : 'grunt-shell-spawn',
    'browserSync'   : 'grunt-browser-sync'
  });

  grunt.initConfig({
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

    watch: {
      buildSystem: {
        files: [
          'Gruntfile.js'
        ],
        options: {
          reload: true
        }
      },

      sass: {
        files: [
          'assets/scss/*.{scss,sass}'
        ],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      }
    },

    sass: {
      dist: {
        options: {
          sourcemap: 'none'
        },
        files: {
          'assets/css/style.css': 'assets/scss/base.scss'
        }
      }
    }
  });

  grunt.registerTask('default', 'Default task', function() {
    grunt.task.run('browserSync');
    grunt.task.run('watch');
  });
};
