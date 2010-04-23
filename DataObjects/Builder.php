<?php
/**
 * Table Definition for builder
 */
require_once 'DB/DataObject.php';

class Pman_Builder_DataObjects_Builder extends DB_DataObject 
{
    ###START_AUTOCODE
    /* the code below is auto generated do not remove the above tag */

    public $__table = 'builder';                         // table name
    public $id;                              // int(11)  not_null primary_key auto_increment
    public $name;                            // string(128)  not_null
    public $json;                            // blob(-1)  not_null blob
    public $btype;                           // string(16)  not_null
    public $app;                             // string(64)  not_null
    public $module;                          // string(128)  not_null

    
    /* the code above is auto generated do not remove the tag below */
    ###END_AUTOCODE
    function applySort($au, $sort, $dir, $cols) 
    {
        // DB_DAtaObject::debugLevel(1);
        $this->orderBy( 'builder.app asc, builder.module asc');
        
        
    }

    
    function onInsert($req,$roo)
    {
        $this->writeCopy($roo);
    }
    function onUpdate($old , $req, $roo)
    {
        if (!empty($req['gitpath']) && !empty($this->app)) {
            $this->writeCopy($req['gitpath'], $roo);
            $this->gitCommit($req['gitpath']);
            
        }
        
        $this->writeCopy($roo);
    }
    
    function writeCopy($roo)
    {
        return;
        // write to file to disk!! - for backup purposes..
        $o = PEAR::getStaticProperty('Pman_Builder', 'options');
        //var_dump($o);
        if (empty($o['writeOnSave']) || 
                empty($this->app) || 
                empty($this->module) || 
                empty($this->json)
                
            ) {
            return;
        }
        if (!file_exists($o['writeOnSave'].'/'. $this->app)) {
            return;
        }
        $apdir = $o['writeOnSave'].'/'. $this->app;
        // write the data - for recovery purposes..
        if (file_exists($apdir.'/src')) {
            file_put_contents($apdir.'/src/'. $this->module.'.json', $this->json);
        }
        require_once 'Pman/Builder/Code.php';
        $x = new Pman_Builder_Code();
        if (!is_writable($apdir.'/'. $this->module.'.js')) {
            $roo->jerr("Can not write to " . $apdir.'/'. $this->module.'.js');
            return;
        }
        file_put_contents($apdir.'/'. $this->module.'.js', 
                $x->toJSFile(json_decode($this->json))) ;
        
    }
    function toRooArray()
    {
        $ret = $this->toArray();
        // update return the code.!!!
        if (isset($_SERVER["REQUEST_METHOD"]) &&  $_SERVER["REQUEST_METHOD"] == 'POST') {
            require_once 'Pman/Builder/Code.php';
            $x = new Pman_Builder_Code();
            $ret['code'] = $x->toJSFile(json_decode($this->json), $this->json);
        }
        
        
        return $ret;
    }
}
