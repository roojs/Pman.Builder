<?php
/**
 * Table Definition for builder_tables
 */
require_once 'DB/DataObject.php';

class Pman_Builder_DataObjects_Builder_tables extends DB_DataObject 
{
    ###START_AUTOCODE
    /* the code below is auto generated do not remove the above tag */

    public $__table = 'builder_tables';      // table name
    public $id;                              // int(11)  not_null primary_key auto_increment
    public $name;                            // string(128)  not_null
    public $descrip;                         // string(254)  not_null
    public $parent_id;                       // int(11)  not_null multiple_key
    public $dbschema;                        // blob(65535)  not_null blob

    
    /* the code above is auto generated do not remove the tag below */
    ###END_AUTOCODE
    
    
    function applyFilters($q, $au)
    {
        //DB_DataObject::debugLEvel(1);
        if (!empty($q['_sync'])) {
            $this->syncDatabase();
            HTML_FlexyFramework::get()->page->jok("DONE");
        }
        
        if(!empty($q['_dumpDatabase'])){
            $this->dumpDatabase();
        }
        
//        if(!empty($q['_dumpTable'])){
//            $this->dumpTable($q['_dumpTable']);
//        }
       
    }
    
    function syncDatabase()
    {
        //DB_DataObject::debugLevel(1);
        global $_DB_DATAOBJECT;
        $x = DB_DataObject::factory('builder_tables');
        $x->whereAdd("name != ''"); // real tables only..
        $mine = $this->fetchAll('name', 'id');
        
        // ensure everything is loaded...
        $tq = DB_DataObject::factory('builder_tables');
        $tq->table();
        $tq->links();
        $tables = $_DB_DATAOBJECT['INI'][$tq->_database];
        
         
        $ret = array();
        $t = array_keys($tables);
        sort($t);
        
        
        // for postgres we can get descriptions - this should just fail in Mysql..
        $desc= array();
        $dsn = HTML_FlexyFramework::get()->database;
        
        if (preg_match('/^pgsql:/', $dsn )) {
            $tq = DB_DataObject::factory('builder_tables');
            $tq->query( "
                select relname, obj_description( oid) as desc FROM pg_catalog.pg_class
                ");
            while ($tq->fetch()) {
                $desc[$tq->relname] = $tq->desc;
            }
        }
        //   DB_DataObjecT::DebugLevel(1);
        $tq = DB_DataObject::factory('builder_tables');
        
        require_once 'Services/JSON.php';
        
        $modids = array();
        
        
        foreach( $t as $k) {
            if (preg_match('/__keys$/', $k)) {
                continue;
            }
            // check it can be constructed..
            // this might be problematic for 'new' tables...
            $do = DB_DataObject::factory($k);
            if (!is_a($do,'DB_DataObject')) {
                continue;
            }
            
            // get's the module part out of the dataobject class name
            // assumes '_' is not used in module name.
            $mod = array_pop(
                    explode('_',
                        substr(get_class($do), 0, -1 * (strlen('_DataObject_') + strlen($k)+ 1))
                    ));
             
            // should get 'ZZZ' part.. : XXX_ZZZZ_DataObject_xx_Builder
            if (!isset($modids[$mod])) {
                $x = DB_DataObject::factory('builder_tables');
                $x->parent_id =0;
                $x->name = '';
                $x->descrip = $mod;
                $x->dbschema = '';
                if (!$x->find(true)) {
                    $x->insert();
                } 
                 $modids[$mod] = $x->id; 
                
            }
            
            
            
            $set = array(
                'name' => $k,
                'descrip' => isset($desc[$k]) ? $desc[$k] : '',
                'dbschema' => Services_JSON::stringify($this->tableSchema($k),null,4),
               // 'parent_id' =>  $modids[$mod],
            );
            
            $do = clone($tq);
            if (isset($mine[$k])) { 
                $do->get($mine[$k]);
                $dd = clone($do);
                $do->setFrom($set);
                if (empty($do->parent_id) || $do->parent_id < 1) {
                    // allow user to modify this..
                    $do->parent_id = $modids[$mod];
                }
                $do->update($dd);
                continue;
            }
            
            $do->setFrom($set);
            $do->parent_id = $modids[$mod];
            $do->insert();
        
        }
            
        
        
    }
    
    
    function tableSchema($tn)
    {
        static  $cache = array();
        static  $types= array();
        $do = DB_DataObject::factory($tn);
        $tn = $do->tableName(); // cleaned up!


        if (isset($cache[$tn])) {
            return $cache[$tn];
        }

        // get a description if available..
       
             
        $desc = array();
        $dd = clone($do);
        $dsn = HTML_FlexyFramework::get()->database;
        if (preg_match('/^pgsql:/', $dsn)) {
            
            
           // DB_DataObject::DebugLevel(1);
            $dd->query("SELECT
                    c.column_name as name,
                    pgd.description as desc
                FROM pg_catalog.pg_statio_all_tables as st
                    inner join pg_catalog.pg_description pgd on (pgd.objoid=st.relid)
                    inner join information_schema.columns c on (pgd.objsubid=c.ordinal_position and c.table_schema=st.schemaname and c.table_name=st.relname)
                WHERE
                    c.table_schema = 'public' and c.table_name = '{$tn}'
            ");
            while($dd->fetch()) {
                $desc[$dd->name] = $dd->desc;
            }
        }
        $defs =  $dd->getDatabaseConnection()->tableInfo($tn);
        // add descriptions?
        foreach($defs as $i=>$c) {
            $defs[$i]['desc'] = isset($desc[$c['name']]) ? $desc[$c['name']] : '';
        }
        $cache[$tn]= $defs;
     
        return $cache[$tn];
    }
    
//    function dumpTable($tn)
//    {
//        $roo = HTML_FlexyFramework::get()->page;
//        
//        if(empty($tn)){
//            return;
//        }
//        
//        $do = DB_DataObject::factory($tn);
//        if (!is_a($do,'DB_DataObject')) {
//            return;
//        }
//        
//        $dsn = HTML_FlexyFramework::get()->database;
//        
//        $database = explode('@', $dsn);
//        
//        $ui = str_replace('mysql://', '', $database[0]);
//        
//        $user = array_shift(explode(':', $ui));
//        $pw = array_pop(explode(':', $ui));
//        
//        $host = array_shift(explode('/', $database[1]));
//        $dn = array_pop(explode('/', $database[1]));
//        
//        $cmd = "mysqldump -u{$user} ";
//        if(!empty($pw)){
//            $cmd .= "-p{$pw} ";
//        }
//        
//        $cmd .= "--no-create-info summit {$tn}";
//        
//        require_once 'System.php';
//            
//        $tmpdir  = System::mktemp("-d dump");
//
//        $path = $tmpdir . '/' . $tn . '.sql';
//        
//        ob_start();
//        
//        passthru($cmd);
//        
//        $data = ob_get_contents();
//        
//        ob_end_clean();
//        
//        file_put_contents($path, $data);
//        
//        header('Content-Description: File Transfer');
//        header ('Content-Type: application/octet-stream');
//        header("Content-Disposition: attachment; filename=\"".basename($path)."\";" );
//        header("Expires: 0");
//        header("Cache-Control: must-revalidate, post-check=0,pre-check=0");
//        header("Pragma: public");
//        header('Content-Length: ' . filesize($path));
//        
//        @ob_clean();
//        flush();
//        readfile($path);
//        
//        exit;
//    }
    
    function dumpDatabase()
    {
        $ff = HTML_FlexyFramework::get();
        
        $dsn = HTML_FlexyFramework::get()->database;
        
        $database = explode('@', $dsn);
        
        $ui = str_replace('mysql://', '', $database[0]);
        
        $user = array_shift(explode(':', $ui));
        $pw = array_pop(explode(':', $ui));
        
        $host = array_shift(explode('/', $database[1]));
        $dn = array_pop(explode('/', $database[1]));
        
        $cmd = "mysqldump -u{$user} ";
        if(!empty($pw)){
            $cmd .= "-p{$pw} ";
        }
        
        if(!empty($ff->Pman_Ignore_Table)){
            print_r($ff->Pman_Ignore_Table);exit;
        }
        
        $cmd .= "--extended-insert=FALSE --no-create-info {$dn}";
        
//        --ignore-table=summit.core_geoip_network_mapping
//        --ignore-table=summit.core_geoip_location
        require_once 'System.php';
            
        $tmpdir  = System::mktemp("-d dump");

        $path = $tmpdir . '/' . $dn . '.sql';
        
        ob_start();
        
        passthru($cmd);
        
        $data = ob_get_contents();
        
        ob_end_clean();
        
        file_put_contents($path, $data);
        
        header('Content-Description: File Transfer');
        header ('Content-Type: application/octet-stream');
        header("Content-Disposition: attachment; filename=\"".basename($path)."\";" );
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0,pre-check=0");
        header("Pragma: public");
        header('Content-Length: ' . filesize($path));
        
        @ob_clean();
        flush();
        readfile($path);
        
        exit;
    }
    
}
