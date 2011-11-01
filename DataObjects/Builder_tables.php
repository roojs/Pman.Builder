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
        }
       
    }
    
    function syncDatabase()
    {
        global $_DB_DATAOBJECT;
        $x = DB_DataObject::factory('builder_tables');
        $x->whereAdD("name != ''"); // real tables only..
        $mine = $this->fetchAll('name','id');
        
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
       // DB_DataObjecT::DebugLevel(1);
        $tq = DB_DataObject::factory('Person');
        $tq->query( "
            select relname, obj_description( oid) as desc FROM pg_catalog.pg_class");
        while ($tq->fetch()) {
            $desc[$tq->relname] = $tq->desc;
        }

            
            
        
        
        
        foreach( $t as $k) {
            if (preg_match('/__keys$/', $k)) {
                continue;
            }
            $do = DB_DataObject::factory($k);
            if (!is_a($do,'DB_DataObject')) {
                continue;
            }
            $ret[$k]= array(
                'id' => isset($mime[$k]) ? $mime[$k] : 0,
                'name' => $k,
                'desc' => isset($desc[$k]) ? $desc[$k] : ''
            );
            
        }
            
        
        
    }
    
    
    function tableSchema($tn)
    {
        static  $desc = array();
        static  $types= array();
        $tn = $do->tableName();





        // get a description if available..
        if (!isset($desc[$tn])) {
             
            $desc[$tn] = array();
            $dd = clone($do);
            
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
                $desc[$tn][$dd->name] = $dd->desc;
            }
        }
    
    
}
