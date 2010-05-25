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
            'Clipping' => 'web.MediaOutreach/Pman/Clipping',
            'PressRelease' => 'web.MediaOutreach/Pman/PressRelease',
            'Ris' => 'web.Ris/Pman/Ris',
            'TestApp' => false,
            'Hex' => false,
            'Example' => false,
            'ExampleOld' => false,
            'Deleted' => false,
            'DealFlow' => 'web.Dealflow/Pman/DealFlow',
            'Aviation' => 'web.Aviation/Pman/Aviation',
            
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
            if (isseT($map[trim($data->app)])) {
                if ($map[trim($data->app)] === false) {
                    continue;
                }
                $fn = $dir .$map[$data->app]. '/' . $data->name . '.bjs';
            }
            
            
            
            
            if (!file_exists(dirname($fn))) {
                print "<B>SKIP " . $fn . "</B>\n";
                continue;
            }
            echo "WRITE : " . $fn . "\n";
            echo "                          " .htmlspecialchars(json_encode($data)) . "\n";
            
            
             
        }
        exit;
        
    }
    
}