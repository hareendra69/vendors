
var fs = require('fs');
var gulp = require('gulp');
var shell = require('shelljs');
var notify = require('gulp-notify');
var markdown = require('gulp-markdown');

var repos = {
    'd3': 'https://github.com/mbostock/d3.git',
    'gulp': 'https://github.com/gulpjs/gulp.git',
    'ionic': 'https://github.com/driftyco/ionic.git',
    'myapp': 'http://github.com/alex-katebi/myapp.git',
    'bootstrap': 'https://github.com/twbs/bootstrap.git',
    'shelljs': 'https://github.com/arturadib/shelljs.git',
    'angular': 'https://github.com/angular/angular.js.git',
    'angular-strap': 'https://github.com/mgcrea/angular-strap',
    'ui-router': 'https://github.com/angular-ui/ui-router.git',
};

var names = Object.keys(repos);

gulp.task('default', names);

names.forEach(function(name) {
    gulp.task(name, function() {
        if(!shell.which('git'))
        {
            echo('Sorry, this script requires git');
            shell.exit(1);
        }
        var repo = repos[name];
        shell.rm('-rf', name);
        shell.exec('git clone '+repo+' '+name, function(code) {
            if(code) {
                return console.error('Failed clone git repo:', repo);
            }
            var dir = __dirname+'/'+name;
            var npm = dir+'/package.json';
            var bower = dir+'/bower.json';
            shell.cd(dir);
            fs.stat(npm, function(err) {
                if(err) return;
                shell.exec('npm install', {silent:true}, function(code, output) {
                    if(code) return;
                    console.log('npm install ==>>', dir);
                });
            });
            fs.stat(bower, function(err) {
                if(err) return;
                shell.exec('bower install', {silent:true}, function(code, output) {
                    if(code) return;
                    console.log('bower install ==>>', dir);
                });
            });
            gulp.src('*.md')
                .pipe(markdown())
                .pipe(gulp.dest('*.html'))
                .pipe(notify('*.md to html ==>> '+name));
            gulp.src('**/docs/**/*.md', {base:'docs'})
                .pipe(markdown())
                .pipe(gulp.dest('docs-html'))
                .pipe(notify('docs to html ==>> '+name));
        });
    }); 
});


