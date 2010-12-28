<?php
// list of bjs files (or database ones later??)

require_once 'Pman.php';

class Pman_Builder_Parts extends Pman
{
  
    // getAuth - everyone allowed in...
    function getAuth() {
        if (!$this->hasPerm('Builder.Builder', 'S')) {
            $this->jerr("Permission denied");
        }
        
        
    }
    
    function get()
    {
        // should just list the enabled modules.. - in theory we can not create modules???
        
        // or should this be totally database related...
        $mod = empty($_REQUEST['module']) ? '' : $_REQUEST['module'];
        
        
        $this->init();
        $enabled =  array('Core') ;
        $enabled = !empty($this->appModules) ?  array_merge($enabled, explode(',',  $this->appModules)) :  $enabled;
        
        if (empty($mod) || !in_array($mod, $enabled)) {
            $this->jerr("Module not available");
        }
        $ret = array();
        foreach(glob($this->rootDir . '/Pman/'. $mod.'/*.bjs') as $bjs) {
            $ret[] = array('name' => preg_replace('/\.bjs$/', '', $r));
        }
        
        
        $this->jdata($ret);
        
    }
  
}