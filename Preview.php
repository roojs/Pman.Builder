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
        
        if (preg_match('/^BuilderJS/', $name)) {
            $this->outputJS(preg_replace('#^BuilderJS/#','', $name));
            
        }
        //var_dump($name, $default);
        //DB_DataObject::debugLevel(5);
        parent::loadPage($prefix, $name, $default );
        
        
        // template...
        
        // menus????
        
         
    }
    
    function outputJS($name)
    {
        $proj = HTML_FlexyFramework::get()->project;
        // DB_DataObject::debugLevel(1);
        $m = DB_DAtaObject::factory('Builder_modules');
        $m->get('name', $proj );
        $p = DB_DAtaObject::factory('Builder_part');
        $p->module_id = $m->pid();
        if (!$p->get('name', $name )) {
           die("invalid url");
        }
        header('Content-type: text/javascript');
        // this should outpt the file if it's found.
        if (file_exists($m->path . '/'. $p->name .'.js')) {
            $fh = fopen($m->path . '/'. $p->name .'.js', 'r');
            fpassthru($fh);
            exit;
        }
        
        echo $p->jsource;
        exit;
    }
    
    function outputBody()
    {
        $ff = HTML_FlexyFramework::get();
        
        
        $proj = $ff->project;
        // DB_DataObject::debugLevel(1);
        $m = DB_DAtaObject::factory('Builder_modules');
        $m->get('name', $proj );
        
        //var_dump($m->path);exit;
        // needs to modify the template directory??
        // use the builder_module == app name
        // look for part with same name.
        if (empty($ff->Pman_Builder['from_filesystem'])) {
        
            $template_engine = new HTML_Template_Flexy(array(
                'templateDir' => $m->path
            ));
        }
        $template_engine->compile($this->template);
        if ($this->elements) { /* BC crap! */
            $this->elements = HTML_Template_Flexy_Factory::setErrors($this->elements,$this->errors);
        }
        $template_engine->elements = $this->elements;
        $template_engine->outputObject($this,$this->elements);
        
        
        
    }
}