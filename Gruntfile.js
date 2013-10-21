
module.exports = function(grunt) {


	grunt.initConfig({

		concat: {
			main: {
				src: [
					'js/**/*.js' 
				],
				dest: 'build/scripts.js'
			}
		},

		uglify: {
			main: {
				files: {
					'build/scripts.min.js': '<%= concat.main.dest %>'
				}
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			files: 'js/*.js'
		},

		watch: {
			concat: {
				files: '<%= concat.main.src %>',
				tasks: 'concat' 
			}
		},

		connect: {
			test: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		}
	});
	

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};