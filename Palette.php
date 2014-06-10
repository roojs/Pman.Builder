<?php 

require_once 'Pman.php';
class Pman_Builder_Palette extends Pman 
{
    // generic list we do not care who looks at it..
    function getAuth()
    {
        return true;
    }
    
    function get($sub)
    {
        if (empty($sub)) {
            return $this->roousage();
        }
        // list of properties or events.
        // gets xns+xtype+list
        $ff = HTML_FlexyFramework::get();
        
        $cls = $_REQUEST['xns'] . '.' . $_REQUEST['xtype'];
        
        $data = json_decode(file_get_contents($ff->rootDir . '/roojs1/docs/json/roodata.json'));
        
        //echo '<PRE>'; print_R($data);
        
        $out = $data->data->{ $cls } -> {$_REQUEST['list'] };
        if ($sub == 'Prop') {
            foreach(array(
                array(
                    'name' => "builder.sharedname",
                    'desc'  => "This is a shared part, between different parts (modifying it will change other pages",
                    'memberOf' => "Builder",
                    
                    'type' => "Boolean"
                ),
                
                array(
                    'name' => "flexy:foreach",
                    'desc'  => "Loop foreach (array,key,val|array,val)",
                    'memberOf' => "Flexy",
                    
                    'type' => "String"
                ),
                array(
                    'name' => "flexy:if",
                    'desc'  => "if condition - put 0 to always disable it",
                    'memberOf' => "Flexy",
                    
                    'type' => "String"
                ),
                array(
                    'name' => "flexy:nameuses",
                    'desc'  => "nameuses",
                    'memberOf' => "Flexy",
                    'type' => "String"
                ),
                
            ) as  $add) {
                array_push($out,$add);
            }
  
            
            
         
        }
        $this->jdata($out );
              
        // 
        
    }
    function roousage() // list of what elements, can have what as children..
    {
        
        // use file..
        // this is our hand made file at present.. shared with app.Builders code.
        
        $lines = file(dirname(__FILE__).'/RooUsage.txt');
        $s = -1;
        $res = array();
        $left = array();
        foreach($lines as $l) {
            
            $l = preg_replace('#//.*#', '', $l);
            $l = trim($l);
            if (!strlen(trim($l))){
                continue;
            }
            if (preg_match('/left:$/', $l)) {
                $s = 0;
                $left = array();
                continue;
            }
            if (preg_match('/right:$/', $l)) {
                $s = 1;
                continue;
            }
            switch($s) {
                case 0:
                    $left[] = $l;
                    
                    continue;
                case 1:
                    if (!isset($res[$l])) {
                        $res[$l] = array(); 
                    }
                    foreach($left as $ll) {
                        $res[$l][$ll] = true; 
                    }
                    continue;
                default:
                    continue;
            }
            
            
        }
        $ret = array();
        ksort($res);
        foreach($res as $k=>$v) {
            $ret[] = array( 
                'name' => $k,
                'parents' =>  array_keys($v) 
            );
        }
        
       // echo '<PRE>';print_r($ret);
       
        
        $this->jdata($ret);
        //echo '<PRE>';print_R($ret);exit;
    }
    
}