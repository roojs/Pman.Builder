/**
 * Usage:
 * 
 *  To be called from the PHP wrapper.
 *
 *  Aim - generate compiled version in tmp dir location.
 *
 * 
 * 
 * roolite PATH/TO/build.js -L/home/svn/svn/rooscript/examples/jstoolkit2 \ 
 *                 --   SOURCEDIR TARGET
  
 * or on live system
 * roolite install/jsbuilder/bundle_build.js -L/usr/src/rooscript/examples/jstoolkit2 
 
 * later we will have additional sections in the dep builder for adding/removeing files from list 
 * for smaller builds..
 * <script type="text/javascript">
 */
// pack needs to be in the include path!!

 
 
include 'lib/Array.js';
include 'lib/JSDOC.js';
include 'lib/JSDOC/Identifier.js';
include 'lib/JSDOC/TokenReader.js';
include 'lib/JSDOC/TokenStream.js';
include 'lib/JSDOC/Token.js';
include 'lib/JSDOC/CompressWhite.js';
include 'lib/JSDOC/Scope.js';
include 'lib/JSDOC/ScopeParser.js';
include 'lib/JSDOC/Packer.js';



var argv = new Array();
var gotsep = false;
for (var i = 0 ; i < arguments.length; i++) {
    if (arguments[i] == '--') {
        gotsep = true;
        continue;
    }
    if (!gotsep) {
        continue;
    }
    argv.push(arguments[i]);
}

function main() {
     
    var modname = Path.getBaseName(argv[0]);
    var srcpath = argv[0];
    
    var targetdir = argv[1] ;
    if (!File.exists(targetdir)) {
        File.mkdir(targetdir);
    }
    if (!File.exists(targetdir  + '/' + modname )) {
        File.mkdir(targetdir  + '/' + modname );
    }
   //println(files.toSource()); return;
    var bpath = targetdir + '/' + modname + '/build';
    if (!File.exists(bpath)) {
        File.mkdir(bpath);
    }
  
    var files = [];
    
    collect_files(files, srcpath, modname);
    // build it..
     
    
    var debugfile = "/dev/null";
     
    var pk = new JSDOC.Packer(files, srcpath);
    var allfile = targetdir + '/' + modname +'.js';
    pk.packFiles(bpath, allfile, debugfile);
     
    
    println("Finished:" + allfile);
}

function collect_files(files, spath, mod)
{
 
    //println(spath);
     // get a list of files..
    var flist = File.listdir(spath);
    for(var i = 0; i < flist.length;i++) {
        var f = flist[i];
        if (!/\.js$/.test(f)) {
            continue;
        }
        if (/generated/.test(f)) {
            continue;
        }
        //if (/\.forms\.js/.test(f) || /\.colmodels\.js/.test(f)) {
        //    continue;
        //}
        //if (f == 'Pman.Tab.Translation.js') { // not in build!
        //    continue;
        //}
        
        if (files.indexOf(spath + '/'+f) > -1) {
            continue;
        }
        if (f == mod + '.js') {
            continue;
        }
        
        files.push(spath + '/'+f);
    }
    files.sort(function(a,b) {
        return a.length > b.length ? 1: -1;
    });
    //println(files.toSource());
     
}

 
main();

    