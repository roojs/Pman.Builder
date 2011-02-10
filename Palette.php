<?php 


class Pman_Builder_Palette extends Pman 
{
    // generic list we do not care who looks at it..
    function getAuth(
    {
        return true;
    }
    
    function get()
    {
        // use file..
        $lines = file(dirname(__FILE__).'/RooUsage.txt');
        foreach($lines as $l) {
            
            $l = preg_replace('#//.*#', '', $l);
            $l = trim($l);
            if (!strlen(trim($l))){
                continue;
            }
            
            
        }
    }
    
}