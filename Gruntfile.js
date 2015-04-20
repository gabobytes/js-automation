module.exports = function (grunt) {
    'use strict';
    // 1. Get all grunt plugins installed
    require('load-grunt-tasks')(grunt);

    // 2. Configurate Grunt
    grunt.initConfig({
        // Concat files
        concat: {
            dev: {
                options: {
                    sourceMap: true
                },
                src: ['app/popayan.js', 'app/**/*.js'],
                dest: 'scripts/main.js',
            },
            build: {
                options: {
                    sourceMap: false
                },
                src: ['app/popayan.js', 'app/**/*.js'],
                dest: 'scripts/main.js',
            }
        },
        // Compile *.scss files
        sass: {
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    'css/app.css': 'scss/app.scss'
                }
            }
        },
        // Lint JS
        jshint: {
            options: {
                // Use a custom reporter
                reporter: require('jshint-stylish'),
                jshintrc: '.jshintrc'
            },
            // Specific lint tasks for each env
            dev: ['Gruntfile.js', 'app/**/*.js']
        },
        // Lint SCSS
        scsslint: {
            dev: {
                options: {
                    config: '.scss-lint.yml',
                    colorizeOutput: true
                },
                src: 'scss/**/*.scss'
            }
        },
        // Image Minification
        imagemin: {
            build: {
                files: {
                    'build/img/wallpaper.jpg': 'img/wallpaper.jpg'
                }
            }
        },
        // JS - Uglify
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: 'scripts/main.js.map'
            },
            build: {
                files: {
                    'build/scripts/main.js': 'scripts/main.js'
                }
            }
        },
        // CSS Minification
        cssmin: {
            build: {
                files: {
                    'build/css/app.css': 'css/app.css'
                }
            }
        },
        // GRUNT WATCH
        watch: {
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['scsslint:dev', 'sass:dev']
            },
            scripts: {
                files: ['app/**/*.js'],
                tasks: ['jshint', 'concat:dev']
            }
        },
        // Server + Live Reload
        browserSync: {
            dev: {
                bsFiles: {
                    src: ['css/app.css', 'index.html'],
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './'
                    }
                }
            }
        },
        // Clean ./build directory
        clean: {
            build: ['./build']
        },
        // Prepare HTML for the release
        processhtml: {
            build: {
                options: {
                    data: {
                        version: '1.1.1.1'
                    }
                },
                files: {
                    'build/index.html': ['./index.html']
                }
            }
        }
        // BUMP VERSION
        // UNIT TESTS
        // COMMIT
    });

    // 3. Register tasks

    // DEVELOPMENT TASKS
    grunt.registerTask('default', ['quality', 'concat:dev', 'sass:dev']);
    grunt.registerTask('quality', ['jshint:dev', 'scsslint:dev']);
    grunt.registerTask('server', ['browserSync:dev', 'watch']);

    // BUILD TASKS
    grunt.registerTask('prepare', ['scsslint', 'jshint']);
    grunt.registerTask('build', ['clean', 'processhtml:build'], function () {
        console.log('Build completed');
    });
};
