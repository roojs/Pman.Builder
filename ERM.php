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
        
        if (empty($tbl)) {
            $this->jdata(array_keys($tables));
        }
        
        
        $tq = DB_DataObject::factory('Person');
        
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
