module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            bower_components: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'bower_components.map'
                },
                files: {
                    'bower_components.min.js': (function () {
                        var sources = [
                            'bower_components/gl-matrix/dist/gl-matrix.js'
                        ];
                        ['bower_components/PointerEvents','bower_components/PointerGestures'].forEach(function (base) {
                            var path = base+'/build.json';
                            if (grunt.file.exists(path)) {
                                grunt.file.readJSON(path).forEach(function (filename) {
                                    sources.push(base+'/'+filename);
                                });
                            }
                        });
                        return sources;
                    })()
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir:'./bower_components'
                }
            }
        }
    });

    grunt.registerTask('default', ['uglify:bower_components']);
    grunt.registerTask('install', ['bower:install']);
    grunt.registerTask('build', ['uglify:bower_components']);
};