<?php
/**
 * Table Definition for builder_app
 */
require_once 'DB/DataObject.php';

class Pman_Builder_DataObjects_Builder_modules extends DB_DataObject 
{
    ###START_AUTOCODE
    /* the code below is auto generated do not remove the above tag */

    public $__table = 'builder_modules';                     // table name
    public $id;                              // int(11)  not_null primary_key auto_increment
    public $name;                             // string(64)  not_null
    public $path;                          // string(128)  not_null
    public $public;                        // int(2)  not_null

    
    /* the code above is auto generated do not remove the tag below */
    ###END_AUTOCODE
    // * - beforeDelete() -- return false for fail and set DO->err;

    function beforeDelete()
    {
        return;
        // fixme - check builder components.
        $x = DB_DataObject::factory('Builder');
        $x->app = $this->app;
        if ($x->count()) {
            $this->err = "Modules exist with this name!";
            return false;
        }
        return true;
    }
    
    
    function scanDir() // return name => mtime for files in path..
    {
        
        // list of bjs files...
        // or should this be totally database related...
        if (empty($this->path ) || !file_exists($this->path)) {
            return array();
        }
        
        $ret = array();
        foreach(glob($this->path. '/*.bjs') as $bjs) {
            $n = preg_replace('/\.bjs$/', '', basename($bjs));
            
            $ret[$n] = filemtime($this->path. '/'. $bjs);
        }
        return $ret;
         
}
