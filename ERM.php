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
    
    function get()
    {
        //echo '<PRE>';
        $tq = DB_DataObject::factory('Person');
        $tq->query('SHOW TABLES');
         
        $table = array();
        while ($tq->fetch()) {
            $v = array_values($tq->toArray());
            $tables[$v[0]] = array();
        }
        //print_r($tables);
        //DB_DataObject::debugLevel(1);
        foreach($tables as $t=>$a) {
            $tq = DB_DataObject::factory('Person');
            $tq->query('DESCRIBE  `' . $t . '`');
            while ($tq->fetch()) {
                $av = $tq->toArray();
                $av['Null'] = ($av['Null'] == "NO") ? "NOT NULL" : ""; 
                $av['Key'] = strlen($av['Key'] ) ?  "KEYS(". $av['Key'] . ")" : "";
                $v = array_values($av);
                
                $n  =  array_shift($v);
                $tables[$t][$n] = trim(implode(" " , $v));
                
            }
            
        
        
        }
        //print_r($tables);
        
        // load links..
        $tq = DB_DataObject::factory('Person');
        $tq->links();
        //print_r($GLOBALS['_DB_DATAOBJECT']['LINKS'][$tq->_database]);
        $links = $GLOBALS['_DB_DATAOBJECT']['LINKS'][$tq->_database];
        foreach($links as $t=>$ar) {
            foreach($ar as $k=>$ex) {
                $links[$t][$k] = explode(":", $ex);
            }
        }
        $this->jdata(array(
            'tables' =>$tables,
            'links' => $links
        ));
            
       // print_r($links);
        require_once 'Services/JSON.php';
        $json = new Services_JSON();
        echo "var tables = " .$json->encode( $tables) . "\n";
        echo "var links = " .$json->encode( $links) . "\n";
        
        
        
        exit;
        
        
        
        
    }
    
    
    
    
    
}
