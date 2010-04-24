<?php

require_once 'Pman.php';

class Pman_Builder_App extends Pman
{
  
    // getAuth - everyone allowed in...
    function getAuth() {
        return true;
    }
  
    function get($app) {
        if (empty($app)) {
            die("Invalid Application");
        }
        $p = DB_DataObject::factory('Builder');
        $p->app = $app;
        $p->selectAdd();
        $p->selectAdd('module');
        if (!$p->find()) {
            die("Invalid Application (2)");
        }
        $this->builderJs = array();
        
        $ff = HTML_FlexyFramework::get();
        
        while ($p->fetch()) {
            // file exists in file system - dont add it twice!
            // this is a bit questionable..  - we may need to check if the
            // db version is more recent.
            $fl = $ff->rootDir.'/Pman/'. $app .'/'.$p->module.'.js';
            //if (file_exists($fl) && filesize($fl)) {
            //    continue;
            //}
            $this->builderJs[] = $p->module;
        }
        $o  = HTML_FlexyFramework::get();
        //echo '<PRE>';print_r($o);exit;
        $o->enable = 'Core';
        $o->enableArray = array('Core');
        //$o->options = 'Core,'.$o->options;
             
        return parent::get('');
        
        
    }
    
}