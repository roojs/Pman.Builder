<?php

/**
 * 
 * this is technically a cli wrapper for the generator..
 * 
 * we will test it on the web initially..
 * 
 * 
 */
require_once 'Pman.php';
class Pman_Builder_RunGenerator extends Pman
{     
    var $cli = false;
    
    
    static $cli_description  = "Creates Database Tables for modules";
    
    static $cli_opts  = array(
        'module' => array(
            'short' => 'm',
            'min' => 1,
            'max' => 1,
            'default' => '',
            'desc' => 'Module to Generate'  
        ),
        'update-db' => array(
            'short' => 'd',
            'min' => 0,
            'max' => 0,
            'desc' => 'Flag to just run database updates'  
        ),
        
        'update-files' => array(
            'short' => 'f',
            'min' => 1,
            'max' => 99,
            'default' => array(),
            'desc' => 'Files to update, eg. -f pman.ini -f Mtrack_wiki.php ' 
        ),
        
        
    );
    
    
    
    
    
    
    
    
    
    function getAuth() {
        
        $o = PEAR::getStaticProperty('HTML_FlexyFramework', 'options');
        if (!empty($o['cli'])) {
            $this->cli = true;
            return true;
        }
        
        parent::getAuth(); // load company!
        $au = $this->getAuthUser();
        if (!$au || $au->company()->comptype != 'OWNER') {
            $this->jerr("Not authenticated", array('authFailure' => true));
        }
        $this->authUser = $au;
        return true;
    }
     
    function get($args,$opts)
    {
        
        print_R($opts); exit;
        
        require_once 'Pman/Builder/Generator.php';
        ini_set('pcre.backtrack_limit', 2000000);
        ini_set('pcre.recursion_limit', 2000000);
        $this->init();
         
        $lastarg = $this->cli  ? array_pop($_SERVER['argv']) : '';
        if (preg_match('/RunGenerator/', $lastarg)) {
            $lastarg  = '';
        }
        $x = new Pman_Builder_Generator();
       // $x->page = clone($this);
        $x->start($this->cli, $args, $lastarg);
        die("done!");
    }
    
}