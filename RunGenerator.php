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
    
    
    static $cli_description  = "Creates Database Tables for modules"
    
    static $cli_opts  = array(
        'test' => array(
            'short' => 't',
            'min' => 1,
            'max' => 1,
            //'default' => 0, -- no default if it is required..
            'desc' => 'A test argument that has to be set..'  
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
     
    function get($args)
    {
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