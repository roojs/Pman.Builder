<?php
/**
 * extends the CMS preview  - but should take the template from the builder..
 * intended use is with the bootstrap code HTML generated..
 *
*/
require_once 'Pman/Cms/Preview.php';

class Pman_Builder_Preview extends Pman_Cms_Preview
{
    
    
    function loadPage($prefix, $name, $default = false)
    {
        //var_dump($name, $default);
        //DB_DataObject::debugLevel(5);
        parent::loadPage($prefix, $name, $default );
        
        
        // template...
        
        // menus????
        
         
    }
    
    function outputBody()
    {
        
        $proj = HTML_FlexyFramework::get()->project;
        // DB_DataObject::debugLevel(1);
        $m = DB_DAtaObject::factory('Builder_modules');
        $m->get('name', $proj );
        
        // needs to modify the template directory??
        // use the builder_module == app name
        // look for part with same name.
        $template_engine = new HTML_Template_Flexy(array(
            'templateDir' => $m->path
        ));
        $template_engine->compile($this->template);
        if ($this->elements) { /* BC crap! */
            $this->elements = HTML_Template_Flexy_Factory::setErrors($this->elements,$this->errors);
        }
        $template_engine->elements = $this->elements;
        $template_engine->outputObject($this,$this->elements);
        
        
        
    }
}