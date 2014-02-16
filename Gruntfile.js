module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            development: {
                options: {
                    sourceMap: true,
                    sourceMapFilename: 'index.css.map',
                    paths: [
                        'asset/stylesheet',
                        'bower_components/lesshat/build'
                    ]
                },
                files: {
                    'index.css': 'asset/stylesheet/index.less'
                }
            }
        },
        watch: {
            index_less: {
                files: 'asset/stylesheet/*.less',
                tasks: ['less']
            },
            index_js: {
                files: [
                    'source/*.js',
                    'build.json'
                ],
                tasks: ['uglify:index_js']
            }
        },
        uglify: {
            index_js: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'index.js.map'
                },
                files: {
                    'index.min.js': grunt.file.readJSON('build.json')
                }
            },
            bower_components: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'bower_components.js.map'
                },
                files: {
                    'bower_components.min.js': (function () {
                        var sources = [
                            'bower_components/gl-matrix/dist/gl-matrix.js'
                        ];
                        ['bower_components/PointerEvents', 'bower_components/PointerGestures'].forEach(function (base) {
                            var path = base + '/build.json';
                            if (grunt.file.exists(path)) {
                                grunt.file.readJSON(path).forEach(function (filename) {
                                    sources.push(base + '/' + filename);
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
                    targetDir: './bower_components'
                }
            }
        }
    });

    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('install', ['bower:install']);
    grunt.registerTask('build', ['uglify', 'less']);
};