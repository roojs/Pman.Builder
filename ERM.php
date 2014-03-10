<?php

require_once 'Pman.php';


class Pman_Builder_ERM extends Pman
{
    function getAuth()
    {
        parent::getAuth(); // load company!
        $au = $this->getAuthUser();
        if (!$au) {
            $this->jerr("Not authenticated", array('authFailure' => true));
        }
        $this->authUser = $au;
        return true;
        
       }
    
    function get($tbl)
    {
        
        
        //echo '<PRE>';
        global $_DB_DATAOBJECT;
        // DB_DataObject::debugLevel(1);
        $tq = DB_DataObject::factory('Person');
        $tq->table();
        $tq->links();
        $tables = $_DB_DATAOBJECT['INI'][$tq->_database];
        
        if (!isset($_GET['table'])) {
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
                $ret[] = array(
                        'name' => $k,
                        'desc' => isset($desc[$k]) ? $desc[$k] : ''
                    );
            }
            $this->jdata($ret);
        }
        // this part is to find the table definition...
        
        $do = DB_DataObject::factory($_GET['table']);
        $links = $do->links();
        $cols = $do->table();
        $dos = array();
       //    echo '<PRE>';print_R($links);
        foreach($links as $k=>$v) {
            $kv = explode(':', $v);
            //print_R($kv);
            $dos[$k]= DB_DataObject::factory($kv[0]);
            if (!is_a($dos[$k], 'DB_DataObject')) {
                echo '<PRE>'; print_r($dos[$k]);
            }
        }
        
      
        $desc =   $this->createRet($do);
       // echo '<PRE>';print_R($desc);
        $ret = array();
        foreach($cols as $c => $ty) {
           
            if (!isset($links[$c]))  {
                 $ret[] = $desc[$c];
                continue;
            }
            // we need to add dependant information to column details so
            // that combo box can determine how to use it..
            
            
            
            // colname_{remotename}_{col}
            $kv = explode(':', $links[$c]);
            //$ar = $this->createRet($dos[$c], $c . '_' . $kv[1] . '_');
            $ar = $this->createRet($dos[$c], $c . '_' , $kv[1]);
            print_r($ar);exit;
            $desc[$c]['maps_to'] = $kv[1];
            $desc[$c]['deps'] = array_values($ar);
            
            $ret[] = $desc[$c];
            foreach($ar as $cn => $r) {
                $ret[] = $r;
            }
            
            
        }
        // echo '<PRE>';print_R($ret);
        
        $this->jdata($ret); 
        
        
        
        
    }
    function createRet($do, $pref='', $skip = '')
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
            
            $defs =  $dd->getDatabaseConnection()->tableInfo($tn);
            print_r($defs);
            $types[$tn] = array();
            foreach($defs as $c) {
                $types[$tn][$c['name']] = $c['type'];
            }
            //echo '<PRE>';print_r($defs);
            
        }
       
       
       
        $ret = array();
        foreach($do->table() as $k=>$ty) {
            if ($k == $skip) {
                continue;
            }
            $ret[$k] = array(
                'table' => $tn,
                'column' => $pref . $k,
                'columnshort' => $k,
                'ctype' => $types[$tn][$k], // should always work!
                'desc' => isset($cache[$tn][$k]) ? $cache[$tn][$k] : '',
            );
        }
        return $ret;
        
        
        
        
        
    }
    
    
    
    
    
}
