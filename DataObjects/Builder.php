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
        if (!empty($req['gitpath']) && !empty($this->module)) {
            $file = $this->writeCopy($req['gitpath'], $roo);
            $this->gitCommit($file );
        }
        
        
    }
    function gitCommit($file )
    {
        $n = basename($file);
        $dir = dirname($file);
        chdir($dir);
        if ($this->_new_file) {
            $cmd = "git add " . escapeshellarg($n);
            `$cmd`;
        }
        
        $cmd = "git commit -m 'commit by builder' " . escapeshellarg($n);
        `$cmd`;
        $cmd = "git push";
        `$cmd`;
    }
    
    
    function writeCopy($roo, $path)
    {
        
        if (!file_exists($path)) {
            return;
        }
        
       
        require_once 'Pman/Builder/Code.php';
        $x = new Pman_Builder_Code();
        if (!is_writable($path.'/'. $this->module.'.js')) {
            $roo->jerr("Can not write to " . $path.'/'. $this->module.'.js');
            return;
        }
        $this->_new_file = false;
        if (!file_exists($path.'/'. $this->module.'.js')) {
            $this->_new_file = true;
        }
        file_put_contents($path.'/'. $this->module.'.js', 
                $x->toJSFile(json_decode($this->json))) ;
        return $path.'/'. $this->module.'.js';
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
