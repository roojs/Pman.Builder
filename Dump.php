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
        $dir = "/home/gitlive/";
        
        $map = array(
            'Clipping' => 'web.Clipping/Pman/Clipping',
            'Ris' => 'web.Ris/Pman/Ris',
            'TestApp' => false,
            'Pman.Hex' => false,
        );
        while ($b->fetch()) {
          //  print_r($b);
            
            
            $data = json_decode($b->json);
            $data->title = $data->name;
            $data->name = $data->{'|module'};
            if (empty($data->name)) {
                continue;
            }
            
            
           // {"id":"roo-file-1","name":"layout test.bjs","parent":"","title":false,"path":"/h
                //ome/alan/buildertest/layout test.bjs"
            $fn = $dir ."Pman.". trim($data->app) . '/' . $data->name . '.bjs';
            if (isseT($map[$data->app])) {
                if ($map[$data->app] === false) {
                    continue;
                }
                $fn = $dir .$map[$data->app]. '/' . $data->name . '.bjs';
            }
            
            
            
            
            if (!file_exists(dirname($fn))) {
                print "SKIP " . $fn . "\n";
                continue;
            }
            echo "WRITE : " . $fn . "\n";
            echo "                          " .htmlspecialchars(json_encode($data)) . "\n";
            
            
             
        }
        exit;
        
    }
    
}