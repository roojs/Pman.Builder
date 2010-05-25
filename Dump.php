<?php

require_once 'Pman.php';

class Pman_Builder_Dump extends Pman
{
  
    // getAuth - everyone allowed in...
    function getAuth() {
        return true;
    }
  
    function get($app) {
        $b = DB_DataObject::Factory('Builder');
        $b->find();
        echo '<PRE>';
        while ($b->fetch()) {
            print_r($b);
            
            
            $data = json_decode($b->json);
            $data->title = $data->name;
            $data->name = $data->{'|module'};
            
            
           // {"id":"roo-file-1","name":"layout test.bjs","parent":"","title":false,"path":"/h
                //ome/alan/buildertest/layout test.bjs"
            
            $fn = "Pman.".$data->app . '/' . $data->name . '.bjs';
            echo "WRITE : " . $fn . "\n";
            echo json_encode($data) . "\n";
            
            
             
        }
        exit;
        
    }
    
}