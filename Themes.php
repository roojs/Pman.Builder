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
        $dh = opendir(__DIR__.'/themes');
        while ($dh && (false !== ($fn = readdir($dh)))) {
            if (is_link($bd . $fn) || is_dir($bd. $fn)) {
                $ret[] = $fn;
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