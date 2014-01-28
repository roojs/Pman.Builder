<?php 

/**
 *
 *  for themes to work, just create a softlink to them in the themes directory
 */

require_once 'Pman.php';
class Pman_Builder_Themes  extends Pman 
{
    // generic list we do not care who looks at it..
    function getAuth()
    {
        return true;
    }
    
    function get($sub)
    {
        $bd = __DIR__.'/themes';
        $dh = opendir($bd);
        $ret = array();
        while ($dh && (false !== ($fn = readdir($dh)))) {
            if ($fn[0] == '.') {
                continue;
            }
            if (is_link($bd .'/'. $fn) || is_dir($bd.'/'. $fn)) {
                $ret[] = array('name' => $fn);
            }
            
            
        }
        closedir($dh);
         
        $this->jdata($ret);
              
        // 
    }
    function post()
    {
        $this->jerr("no access");
    }
    
}