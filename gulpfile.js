
var fs = require('fs');
var gulp = require('gulp');
var shell = require('shelljs');
var notify = require('gulp-notify');
var markdown = require('gulp-markdown');

var sourceRename = {
    'ui-bootstrap':  'ui-bootstrap'
};

var sourceObj = {
    'gulp': 'https://github.com/gulpjs/gulp.git',
    'ionic': 'https://github.com/driftyco/ionic.git',
    'shelljs': 'https://github.com/arturadib/shelljs.git',
    'angular.js': 'https://github.com/angular/angular.js.git',
    'ui-router': 'https://github.com/angular-ui/ui-router.git',
    'ui-bootstrap': 'https://github.com/angular-ui/bootstrap.git',
    'angular-strap': 'https://github.com/mgcrea/angular-strap',
    'bootstrap': 'https://github.com/twbs/bootstrap.git'
};

var sources = Object.keys(sourceObj);

gulp.task('default', ['sources']);

gulp.task('sources', sources);

sources.forEach(function(source) {
    gulp.task(source, function() {
        if(!shell.which('git'))
        {
            echo('Sorry, this script requires git');
            shell.exit(1);
        }
        var repo = sourceObj[source];
        var name = sourceRename[source] || '';
        shell.mkdir('-p', __dirname+'/sources');
        shell.cd(__dirname+'/sources');
        shell.rm('-rf', __dirname+'/sources/'+source);
        shell.exec('git clone '+repo+' '+name, function(code) {
            if(code) {
                return;
            }
            var dir = __dirname+'/sources/'+source;
            var npm = dir+'/package.json';
            var bower = dir+'/bower.json';
            shell.cd(dir);
            fs.stat(npm, function(err) {
                if(err) return;
                shell.exec('npm install', {silent:true}, function(code, output) {
                    console.log('npm install ==>>', dir);
                });
            });
            fs.stat(bower, function(err) {
                if(err) return;
                shell.exec('bower install', {silent:true}, function(code, output) {
                    console.log('bower install ==>>', dir);
                });
            });
            gulp.src('**/docs/**/*.md')
                .pipe(markdown())
                .pipe(gulp.dest('./docs-html'))
                .pipe(notify('markdown ==>> '+source));
        });
    }); 
});


