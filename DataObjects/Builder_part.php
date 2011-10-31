<?php
/**
CREATE TABLE `builder`.`builder_part` (
  `id` int(11)  NOT NULL AUTO_INCREMENT,
  `module_id` int(11)  NOT NULL,
  `name` varchar(254)  NOT NULL,
  `json` longtext  NOT NULL,
  PRIMARY KEY (`id`)
)
ENGINE = MyISAM;
*/
/**
 * Table Definition for builder_app
 */
require_once 'DB/DataObject.php';


class Pman_Builder_DataObjects_Builder_part extends DB_DataObject 
{
    ###START_AUTOCODE
    /* the code below is auto generated do not remove the above tag */

    public $__table = 'builder_part';                         // table name
    public $id;                              // int(11)  not_null primary_key auto_increment
    public $name;                            // string(128)  not_null
    public $json;                            // blob(-1)  not_null blob
    public $jsource;                            // blob(-1)  not_null blob

    public $module_id;                           // string(16)  not_null
    public $updated;                           // string(16)  not_null
 
    
    /* the code above is auto generated do not remove the tag below */
    ###END_AUTOCODE
    /*function applySort($au, $sort, $dir, $cols) 
    {
        // DB_DAtaObject::debugLevel(1);
        $this->orderBy( 'builder.app asc, builder.module asc');
        
        
    }
    */
    function applyFilters($q, $au)
    {
        //DB_DataObject::debugLEvel(1);
        if (!empty($q['module_id'])) {
            // we should only do this on a menu calll to sync. really..
            $m = DB_DataObject::factory('builder_modules');
            $m->get($q['module_id']);
            $m->syncParts();
        }
       
    }
    
    function module()
    {
        DB_DataObject::debugLevel(1);
        $m = DB_DataObject::Factory('builder_modules');
        $m->get($this->module_id);
        return $m;
        
        
    }
    

    
    function onInsert($req,$roo)
    {
        // write it to a file... use date time...  - which should hopefully be the same as the
        //event that was created..
        $this->writeEventFile($roo);
        
    }
    function onUpdate($old , $req, $roo)
    {
         $this->writeEventFile($roo);
        
        
    }
    function  writeEventFile($roo) 
    {
        
        // try and commit it..
        
        $m  = $this->module();
        $m->gitCommit($this->name . '.bjs', $this->bjs());
        $m->gitCommit($this->name . '.js', $this->jsource);
        
        
        $sp = ini_get('session.save_path').'/Builder/'.date('Y/m');
        if (!file_exists($sp)) {
            mkdir($sp, 0755, true);
        }
        $fn = $sp .'/'. $this->id . '-'. $this->name . '-'. date('d-H-i-s') . '.bjs';
        require_once 'Services/JSON.php';
        $json = Services_JSON::stringify(json_decode($this->json), null, 4);
        
        file_put_contents($fn , $json);
    }
    function bjs()
    {
        return $this->json;
        $data = json_decode($this->json);
       
        
        
        
        
        
    }
    
    function writeCopy($path,$roo)
    {
        die("needs fixing");
        if (!file_exists($path)) {
            return;
        }
        
       
        require_once 'Pman/Builder/Code.php';
        $x = new Pman_Builder_Code();
        $this->_new_file = false;
        if (!file_exists($path.'/'. $this->module.'.js')) {
            $this->_new_file = true;
        }
        if (!$this->_new_file && !is_writable($path.'/'. $this->module.'.js')) {
            $roo->jerr("Can not write to " . $path.'/'. $this->module.'.js');
            return;
        }
        if ($this->_new_file && !is_writable($path)) {
            $roo->jerr("Can not write to " . $path);
            return;
        }
       
        file_put_contents($path.'/'. $this->module.'.js', 
                $x->toJSFile(json_decode($this->json))) ;
        return $path.'/'. $this->module.'.js';
    }
    
    function toRooArray()
    {
        $ret = $this->toArray();
        
    
        //$m  = $this->module();
        //$m->gitCommit($this->name . '.bjs', $this->bjs());
        
        
        return $ret;
        /*
        // update return the code.!!!
        if (isset($_SERVER["REQUEST_METHOD"]) &&  $_SERVER["REQUEST_METHOD"] == 'POST') {
            require_once 'Pman/Builder/Code.php';
            $x = new Pman_Builder_Code();
            $ret['code'] = $x->toJSFile(json_decode($this->json), $this->json);
        }
         
        return $ret;
        */
    }
}
