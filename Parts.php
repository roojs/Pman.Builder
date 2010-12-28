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
            $n = preg_replace('/\.bjs$/', '', basename($bjs));
            if (!empty($_REQUEST['part']) && $n == $_REQUEST['part']) {
                // we do not really need to parse & send, but it's simpler..
                $this->jok(json_decode(file_get_contents($bjs)));
            }
            $ret[] = array('name' =>$n );
        }
        if (!empty($_REQUEST['part'])) {
            $this->jerr("invalid part");
        }
        
        $this->jdata($ret);
        
    }
  
}