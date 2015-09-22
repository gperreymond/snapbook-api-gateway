'use strict';

module.exports = function(grunt) {
	var banner = '/*n<%= pkg.name %> <%= pkg.version %>';
	banner += '- <%= pkg.description %>n<%= pkg.repository.url %>n';
	banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>n*/n';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		env: {
			tests_suite: {
				IP: 'localhost',
      	PORT: 3000
    	},
		},
		run: {
    	server: {
				options: {
					wait: false,
					quiet: true
				},
				cmd: 'node',
				args: ['src/index.js']
    	}
  	},
		jshint: {
			files: ['src/*.js'],
			options: {
			  node: true,
				maxlen: 80,
				quotmark: 'single'
			}
		},
		simplemocha: {
			options: {
				timeout: 3000,
				ignoreLeaks: false,
				ui: 'bdd',
				reporter: 'spec'
			},
			all: { src: ['test/*.js'] }
		}
	});
	
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-run');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');
	
	grunt.registerTask('test', [
		'jshint',
		'env:tests_suite', 
		'run:server', 
		'simplemocha',
		'stop:server'
	]);
	
};