module.exports = function(grunt) {
/*JS*/
  grunt.initConfig({
  concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/src/*.js'],
        dest: 'js/dist/script.js'
      }
    },
      uglify: {
          dist: {
              src: ['js/dist/script.js'],
              dest: 'js/dist/script.min.js'
          }
      },
      /*Css*/
      concat_css: {
      options: {
      // Task-specific options go here. 
      },
      all: {
        src: ["css/src/*.css"],
        dest: "css/dist/main_style.css"
      },
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
        'css/dist/main_style.min.css': ['css/dist/main_style.css']
        }
      }
    } ,
       watch: {
      watch_css: {
      
      files: ['css/src/*.css'],
      tasks: ['concat_css', 'cssmin'],
          options: {
            livereload: true
        },
      }
    }     
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat' , 'uglify' , 'concat_css', 'cssmin']);

};