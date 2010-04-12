<?php 

// alot of this file needs migrating to the Framework..


ini_set('include_path', 
            dirname(__FILE__). ':' . 
            dirname(__FILE__).'/pearfix:' . 
            dirname(__FILE__).'/pear:' . 
            ini_get('include_path'));

define('DB_DATAOBJECT_NO_OVERLOAD', true);
$bd = dirname(__FILE__).'/Pman';

$cl = array();
$pa = array();
$cp = array();

foreach(scandir($bd) as $d) {
    if (!strlen($d) || $d[0] == '.' || !file_exists("$bd/$d/DataObjects")) {
        continue;
    }
    $pa[] = "$bd/$d/DataObjects/pman.ini";
    $cl[] = "$bd/$d/DataObjects";
    $cp[] = 'Pman_'.$d.'_DataObjects_';
    
}
 
$db =  'mysql://root:@localhost/pman';
$dbp = parse_url($db);

require_once 'HTML/FlexyFramework.php';
$cfg = array(
    'project'=> 'Pman',
    'debug' => 0,
    'version' => '1.3',
    'enable' => 'Core,Builder',
       
    'appNameShort' => "Builder",
    'appName' => "Application Builder",
    'database' => $db,
    //'database' =>  'mysql://root:@localhost/clippingdev',
    'Pman' => array(
        'storedir' => '/home/edoc',
        // need package!
        'eximspool' => '/var/spool/exim4', 
        
        'isDev' => true,  // in future we need to suport non dev versions (which have single DB dir etc. 
        
         
         
    ),
    'DB_DataObject' => array(
        'class_location' => implode(PATH_SEPARATOR, $cl),
        'class_prefix' => implode(PATH_SEPARATOR, $cp),
        // this needs fixing for other
        'ini_' . basename($dbp['path']) => implode(PATH_SEPARATOR, $pa),
       // 'debug' => 5,
    )
    
    
);

new HTML_FlexyFramework( $cfg);