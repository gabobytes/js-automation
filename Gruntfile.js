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
                src: [
                    'app/scripts/popayan.js',
                    'app/scripts/**/*.js',
                    '!app/scripts/main.js' // Exclude app.js from concat
                ],
                dest: 'app/scripts/main.js',
            },
            build: {
                src: [
                    'app/scripts/popayan.js',
                    'app/scripts/**/*.js',
                    '!app/scripts/main.js' // Exclude app.js from concat
                ],
                dest: '.tmp/scripts/main.js',
            }
        },
        // Compile *.scss files
        sass: {
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    'app/css/app.css': 'app/scss/app.scss'
                }
            },
            build: {
                options: {
                    sourceMap: false
                },
                files: {
                    '.tmp/css/app.css': 'app/scss/app.scss'
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
            dev: ['Gruntfile.js', 'app/scripts/**/*.js']
        },
        // Lint SCSS
        scsslint: {
            dev: {
                options: {
                    config: '.scss-lint.yml',
                    colorizeOutput: true
                },
                src: 'app/scss/**/*.scss'
            }
        },
        // Image Minification
        imagemin: {
            build: {
                files: {
                    'build/img/wallpaper.jpg': 'app/img/wallpaper.jpg'
                }
            }
        },
        // JS - Uglify
        uglify: {
            options: {
                sourceMap: true,
                sourceMapName: 'app/scripts/main.js.map'
            },
            build: {
                options: {
                    sourceMap: false,
                },
                files: {
                    'build/scripts/app.min.js': '.tmp/scripts/main.js'
                }
            }
        },
        // CSS Minification
        cssmin: {
            build: {
                files: {
                    'build/css/app.min.css': '.tmp/css/app.css'
                }
            }
        },
        // GRUNT WATCH
        watch: {
            sass: {
                files: ['app/scss/**/*.scss'],
                tasks: ['scsslint:dev', 'sass:dev']
            },
            scripts: {
                files: ['app/scripts/**/*.js'],
                tasks: ['jshint', 'concat:dev']
            }
        },
        // Server + Live Reload
        browserSync: {
            dev: {
                bsFiles: {
                    src: ['app/css/*.css', 'app/index.html', 'app/scripts/*.js'],
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './app'
                    }
                }
            },
            build: {
                options: {
                    watchTask: false,
                    server: {
                        baseDir: './build'
                    }
                }
            }
        },
        // Clean directories
        clean: {
            prepare: ['.tmp'],
            build: ['build']
        },
        // Prepare HTML for the release
        processhtml: {
            build: {
                files: {
                    'build/index.html': 'app/index.html'
                }
            }
        },
        // BUMP VERSION + COMMIT
        bump: {
            options: {
                files: ['package.json'],
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'], // Commit all files
                push: false
            }
        }
        // UNIT TESTS
    });

    // 3. Register tasks

    // DEVELOPMENT TASKS
    grunt.registerTask('default', ['quality', 'concat:dev', 'sass:dev']);
    grunt.registerTask('quality', ['jshint:dev', 'scsslint:dev']);
    grunt.registerTask('server', ['browserSync:dev', 'watch']);

    // BUILD TASKS
    grunt.registerTask('prepare', [
        'clean:prepare', // Delete .tmp folder
        'clean:build', // Delete build folder
        'scsslint', // Lint scss
        'jshint', // Lint js
        'sass:build', // Compile sass into ./tpm
        'cssmin:build', // Minify .tmp/css/app.css -> build/css/app.min.css
        'concat:build', // Concat *js files into build/app.min.js
        'uglify:build', // Uglify .tmp/scripts/main.js -> build/scripts/app.min.js
        'processhtml', // Transform HTML to prod
        'clean:prepare'
    ]);

    grunt.registerTask('testBuild', ['browserSync:build']); // Check if the build works fine.

    grunt.registerTask('build', 'Create the build and commit changes', function () {
        grunt.task.run('prepare');
    });
};
