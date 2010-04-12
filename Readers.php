<?php

/**
 * list all the readers so they can be loaded..
 * -- called from where?
 * 
 * 
 */
 require_once 'Pman.php';

class Pman_Builder_Readers extends Pman
{
    function getAuth()
    {
        parent::getAuth(); // load company!
        $au = $this->getAuthUser();
        if (!$au) {
            $this->jerr("Not authenticated", array('authFailure' => true));
        }
        $this->authUser = $au;
        return true;
        
    }
    function get()
    {
        $top = dirname(__FILE__).'/../';
        
        
        
        $ret = array();
        foreach(scandir($top) as $m) {
            if ($m == 'Builder') {
                continue;
            }
            $vf = "{$top}{$m}/$m.readers.js";
          //  print_R($vf);
            if (!strlen($m) ||  $m[0] == '.' ||  !file_exists($vf) ) {
                continue;
            }
            
            $ret[] = "Pman/$m/$m.readers.js";
        }
        $this->jdata($ret);
    }
    
}
