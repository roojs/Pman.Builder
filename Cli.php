<?php
/*

Help file for cli in this directory.
*/


class Pman_Builder_Cli
{
    
    function getAuth()
    {
        return false;
    }
    function help($cli)
    {
        echo "
 
    $cli Builder/RunGenerator/PROJECT

    Runs the generator for a project (NOTE - runs all the SQL updates)
    - does not change files, just shows you want would happen

    
    $cli Builder/RunGenerator/PROJECT pman.ini,PROJECT.readers.js,...

    Runs the generator for a project (NOTE - runs all the SQL updates)
    - Changes the files.

================================    

    $cli Builder/JsCompiler  build PROJECT
    $cli Builder/JsCompiler  install PROJECT
    
    Runs the javascript compiler - merging all the JS files so the load faster.
    Note: cfg option Pman_Builder['jstoolkit'] must be set to location of jstoolkit code 
    SVN Support: if .svn files are found, it will try and commit the changes
";


    }
    
    
}