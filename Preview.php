<?php
/**
 * extends the CMS preview  - but should take the template from the builder..
 * intended use is with the bootstrap code HTML generated..
 *
*/

class Pman_Builder_Preview extends Pman_Cms_Preview
{
    
    
    function loadPage($prefix, $name, $default = false)
    {
        //var_dump($name, $default);
        
        parent::loadPage();
        // menus????
        
         
    }
    
    function outputBody()
    {
        // needs to modify the template directory??
        // use the builder_module == app name
        // look for part with same name.
        return parent::outputBody();
        
        
    }
}