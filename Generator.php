<?php
 
 
/**
 * 
 * Generate DataObjects... and readers in the right places..
 * 
 * note - we write to a temporary directory first...
 * 
 * 
 */
 
require_once 'DB/DataObject/Generator.php';


/** basic thing now works... 
* 
* it needs a bit more intelligence to work out what to do...
* 
* 
* Basically we need to build up all the formats for each db column
* then 
*   - overlay any mapping stuff.
*   
*   - overlay user defined settings
*   = write it out to file..
*   
*  Strucutres:
$this->def['order'][$table][] = $t->name;
$this->def['readers'][$table][$t->name] = $reader;
$this->def['colmodels'][$table][$t->name] = $colmodel;
$this->def['forms'][$table][$t->name] = $form;
* 
*   Readers
*       readersDef[table.col]
* 
* 
* 
* **/



class Pman_Builder_Generator extends DB_DataObject_Generator
{
    

   
    // inherrited..
    // $tablekeys
    // $tables
    // $_definitions
    /**
     * def[order]  
     *      [tablename] => array( list of columns ones with '-' indicate lookup
     *    [readers]
     *       [tablename][colname] -> reader foramt
     *    [forms]
     *        [tablename][colname] => xtype / name etc...
     *    [readerArgs]
     *        [tablename] => data for reader args (eg. id / total prop etc.)
     *  readers =>
     *         [tablename] => array of cols with types
     *  forms =>
     *        [tablename] -> array of cols
     * 
     */ 
    var $def;
    
      
    var $page = false; // page container when run from cli.
    
    // dont do usual stuff!!!
    var $rootDir = '';
    var $tablekeys = array();
    
    var $overwrite = array(); // default dont overwrite any of the files..
    //  array('master', 'corejs', 'corephp', 'index', 'Roo')
    // and ('js-?????' where ??? is the table name) <- for all the generated js classes.
    // we always overwrite the definition!!!
    // set to array('all') to overwrite everything!!!
    
    function start($cli=false, $mods='', $overwrite='')
    {
        
        $ff = HTML_Flexyframework::get();
        $this->scanModules();
        //echo '<PRE>'; print_r($this->modtables); exit;
        
        $options = &PEAR::getStaticProperty('DB_DataObject','options');
        
        
        $proj = 'pman'; //ucfirst(basename($options['database']));
        // we are going to generate all of the code into a temporay foldler..
        $options['rootDir'] = ini_get('session.save_path').'/temp_'. $proj;
        $options['cli'] = $cli;
        $options['mods'] = empty($mods) ? array() : explode('/',$mods);
       
        if (!file_exists($options['rootDir'])) {
            mkdir($options['rootDir'], 0775, true);
        }
        
        $this->rootDir = $options['rootDir'];
        $options['schema_location'] =  $this->rootDir .'/'.$proj.'/DataObjects';
        $options['class_location'] = $this->rootDir .'/'.$proj.'/DataObjects';
        $options['require_prefix'] =    $proj . '/DataObjects/';
        $options['class_prefix'] =    $proj . '_DataObjects_';
       //  print_r($this);exit;
       
       
        $this->importSQL();
       
        $standard_database = $options['database'];
       
       
       
       
       
       
       
       
       
        parent::start();
        
        $this->scanModules();
        require_once 'System.php';
        $diff = System::which('diff');
        // now for each of the directories copy/show diffs..
        echo $cli ? '' : '<PRE>';
        $flist = explode(',', $overwrite);
        foreach($this->modtables as $m=>$ar) {
            if ($options['database'] !=  $standard_database) {
                $options['database'] =  $standard_database ;
                
                parent::start();
            }
            
            $options['database'] =  $standard_database ;
            if (isset($options['database_'. $m])) {
                $options['database'] =  $options['database_'. $m];
                //var_dump($url);exit;
                
                // start again?
                parent::start();
            }
            
            
            if (!empty($options['mods'] ) && !in_array($m,  $options['mods'] )) {
                continue;
            }
            foreach(scandir($options['rootDir'].'/'.$m) as $f) {
                if (!strlen($f) || $f[0] == '.') {
                    continue;
                }
                // does it exist!!!
                $src = $options['rootDir']."/$m/$f";
                $tg = $ff->page->rootDir."/Pman/$m/DataObjects/$f";
                if (preg_match('/\.js$/', $f)) {
                    $tg = $ff->page->rootDir."/Pman/$m/$f";
                }
                
                if (!file_exists($tg) || !filesize($tg) ) {
                  
                    if ($cli && in_array($f, $flist)) {
                       echo "COPY $src $tg" . ($cli ? "\n" : "<BR>");
                        copy($src, $tg);
                        continue;
                    }
                    echo "!!!!MISSING!!! $tg" . ($cli ? "\n" : "<BR>");
                    
                    continue;
                }
                // always copy readers and ini file.=  nope - not on live..
                if ($cli && in_array($f, $flist)) {
                    
                   //|| $f=='pman.ini' || preg_match('/\.js$/', $f))) {
                    echo "COPY $src $tg". ($cli ? "\n" : "<BR>");
                    copy($src, $tg);
                    continue;
                }
                
                // diff the two..
                $cmd = "$diff -u -w ". escapeshellarg($tg) . ' ' . escapeshellarg($src);
                 
                $out = array(); $ret = 0;
                exec($cmd, $out, $ret);
                if ($ret ==0) { // files match..
                    continue;
                }
                // var_dump($ret);
                echo "\n" .implode( "\n" , $out) . "\n";
               
                
            }
            
            
        }
        
        
        
        
    }
    
    
    
    function importSQL()
    {
        $options = &PEAR::getStaticProperty('DB_DataObject','options');
        
        $ff = HTML_Flexyframework::get();
        
        $url = parse_url($options['database']);
        // hide stuff for web..
        $cli = $options['cli'];
        if (!$cli) {
            $url['pass'] = '*****';
            $url['user'] = '*****';
            $url['host'] = '*****';
        }
         
        
        
        require_once 'System.php';
        $cat = System::which('cat');
        $mysql = System::which('mysql');
        print_r($options['mods'] );
        foreach($this->modsql as $m => $fl)
        {
            if ($cli && isset($options['database_'. $m])) {
                $url =parse_url($options['database_'.$m]);
            }
            
            $mysql_cmd = $mysql .
                ' -h ' . $url['host'] .
                ' -u' . escapeshellarg($url['user']) .
                (!empty($url['pass']) ? ' -p' . escapeshellarg($url['pass'])  :  '') .
                ' ' . basename($url['path']);
           
            echo $mysql_cmd . "\n" ;
            
            if (!empty($options['mods'] ) && !in_array($m,  $options['mods'] )) {
                continue;
            }
            
            foreach($fl as $f) {
                $fn = $ff->page->rootDir. "/Pman/$m/DataObjects/$f";
                $cmd = $cat . ' ' . escapeshellarg($fn) . " | $mysql_cmd -f ";
                echo $cmd. ($cli ? "\n" : "<BR>\n");
                if ($cli) {
                    passthru($cmd);
                }
                
            }
        }
        
        
        
    }
    /**
     * Scan the folders for DataObjects
     * - Use the list of php files in DataObjects folders 
     *   to determine which module owns which database table.
     * 
     */
    
    
    function scanModules()
    {
        
        $options = &PEAR::getStaticProperty('DB_DataObject','options');
        if (isset($options['modtables'])) {
            $this->modtables = $options['modtables'];
            $this->modmap = $options['modmap'];
            $this->modsql = $options['modsql'];
            return;
        }
        
        $ff = HTML_Flexyframework::get();
        
        $top = $ff->page->rootDir .'/Pman';
        $this->modtables = array();
        $this->modmap = array();
        $this->modmapsql = array();
        
        foreach(scandir($top) as $m) {
            
            if (!strlen($m) || 
                    $m[0] == '.' || 
                    !is_dir($top .'/'.$m) || 
                    !file_exists($top .'/'.$m.'/DataObjects')
                ) {
                continue;
            }
            $this->modtables[$m] = array();
            $this->modsql[$m] = array();
            foreach(scandir($top .'/'.$m.'/DataObjects') as $f) {
                if (!strlen($f) ||   $m[0] == '.') {
                    continue;
                }
                if (preg_match('/\.sql$/', $f))  {
                    $this->modsql[$m][] = $f;
                }
                                
                if (preg_match('/\.php$/', $f))  {
                    $tn = strtolower(preg_replace('/\.php$/', '', $f));
                    $this->modtables[$m][] = $tn;
                    $this->modmap[$tn] = $m;
                    continue;
                }
            }
        }
        $options['modtables'] = $this->modtables;
        $options['modmap'] = $this->modmap;
        $options['modsql'] = $this->modsql;
       // print_r($options);
        
    }
    /**
     * 
     * this is run first, so picks up any missing dataobject files..
     */
    
    function generateDefinitions()
    {
        if (!$this->tables) {
            $this->debug("-- NO TABLES -- \n");
            return;
        }
        if (!isset($this->modmap)) {
            $this->scanModules();
        }
         $options = &PEAR::getStaticProperty('DB_DataObject','options');
         $mods = $options['mods'];
        $inis = array();
        $this->_newConfig = '';
        foreach($this->tables as $this->table) {
            
            $tn  = strtolower($this->table);
            //print_r($this->modmap);//[$tn]);//
            if (!isset($this->modmap[$tn])) {
                die("No existing DataObject file found for table {$this->table} \n".
                    "- create an empty file in the related Module/DataObjects directory
                    eg. 
                    touch Pman/????/DataObjects/".ucfirst($this->table).".php
                   \n");
                    
            }
            $mod = $this->modmap[$tn];
            $inis[$mod] = isset($inis[$mod]) ? $inis[$mod] : '';
            
            
            $this->_newConfig = '';
            $this->_generateDefinitionsTable();
            
            
            $inis[$mod] .= $this->_newConfig;
        }
        
        //echo '<PRE>';print_r($this->_inis); exit;
        $options = PEAR::getStaticProperty('DB_DataObject','options');
        
        $rd = $options['rootDir'];
        foreach($inis as $m=>$ini) {
            if (!empty($mods) && !in_array($m, $mods)) {
                continue;
            }
            
            if (!file_exists($rd.'/'.$m)) {
                mkdir($rd.'/'.$m, 0775, true);
            }
            $fname = '/pman.ini';
            if (isset($options['database_'. $m])) {
                $url = parse_url($options['database_'.$m]);
                $fname = '/'. basename($url['path']).'.ini';
            }

            
            file_put_contents($rd.'/'.$m.$fname, $ini);
        }
         
         
    }
    
    function generateClasses() 
    {
      // print_R($this->modmap);
       // die("generateClasses");
        $options = &PEAR::getStaticProperty('DB_DataObject','options');
        
        $ff = HTML_Flexyframework::get();
        
        $rd = $options['rootDir'];
        $mods = $options['mods'];
        $this->_extends = 'DB_DataObject';
        $this->_extendsFile = 'DB/DataObject.php';
        $cli = $options['cli'];

        foreach($this->tables as $this->table) {
            $this->table        = trim($this->table);
            $tn  = strtolower($this->table);
            $mod = $this->modmap[$tn];
            
             if (!empty($mods) && !in_array($mod, $mods)) {
                continue;
            }
            
            
            $this->classname    = 'Pman_'.$mod . '_DataObjects_'. ucfirst($this->table); // replace odd chars?
           
           
            $outfilename    = $rd.'/'.$mod.'/'. ucfirst($this->table).'.php';
            $orig           = $ff->page->rootDir .'/Pman/'.$mod.'/DataObjects/'. ucfirst($this->table).'.php';
            
           
                // file_get_contents???
            $oldcontents = file_get_contents($orig);
            
             
            echo "GENERATE: " .   $this->classname  . ($cli ? "\n" : "<BR>");
            
            $out = $this->_generateClassTable($oldcontents);
            
            // get rid of static GET!!!
            $out = preg_replace('/(\n|\r\n)\s*function staticGet[^\n]+(\n|\r\n)/s', '', $out);
            $out = preg_replace('#/\* Static get \*/#s', '', $out);
              

           // $this->debug( "writing $this->classname\n");
            //$tmpname = tempnam(session_save_path(),'DataObject_');
            file_put_contents($outfilename, $out);
            
        }
    }
    
    
        
   // function generateDefinitions() { }
    ////function generateForeignKeys() { }
   // function generateClasses() { }
   
    var $jsHeader = "//<script type=\"text/javascript\">\n";
        
    function generateRoo()
    {
         
        $options = &PEAR::getStaticProperty('DB_DataObject','options');
         $mods = $options['mods'];
        $this->rootDir = $options['rootDir'];
        $this->overwrite = true;
        //$this->parseOld();
        
        require_once 'Pman/Builder/Generator/JSON.php';
        
        $ret = '//<script type="text/javascript">'."\n";
        
      
        foreach($this->tables as $this->table) {
            $this->_generateData($this->table);
        }
        
        
       //echo '<PRE>';print_R($this->def);
        $this->parseConfig();
         
        
        
         
        $ds = $this->_database;
        $ds = ucfirst($this->_database);
       
        // we always write these files....
        foreach($this->modtables as $m=>$ts) {
             if (!empty($mods) && !in_array($m, $mods)) {
                continue;
            }
             
            file_put_contents($this->rootDir."/$m/$m.readers.js", $this->_generateReaders($m));
           
        }
      
    }
    
    
    
    
     
    
    function _generateReaders($m)
    {
         
        $udb = ucfirst($this->_database);
        $ret = $this->jsHeader;
        $j = new Pman_Builder_Generator_JSON();
        $j->indent = 0;
        
        $j2 = new Pman_Builder_Generator_JSON(array('crlf' => '', 'tab' => ''));
        
        
        foreach($this->tables as $this->table) {
            
            
            if ($this->modmap[strtolower($this->table)] != $m) {
                continue;
            }
            
            $utable = ucfirst($this->table);
            
            $r =  $this->def['readers'][$this->table];
            foreach($r as $k=>$tab) {
                if ($tab['type'] == 'string') {
                    $r[$k] = $tab['name'];
                }
            }
            $this->readersArgs[$this->table]['xtype'] = 'JsonReader';
            $ret.="\n$udb.Readers.$utable = ";
            $x = $j->encodeUnsafe($this->readersArgs[$this->table]);
            $ret .=  trim(substr($x, 0, -1)) . ",\n"; // strip of trailing ;};
            $ret .=  $j->tab . "fields : [\n". $j->tab.$j->tab;
            $ar = array();
            foreach($r as $xr) {
                $ar[] = $j2->encodeUnsafe($xr);
            }
            $ret .= implode(",\n". $j->tab.$j->tab, $ar);
            $ret .= "\n".  $j->tab . "]\n};\n";
            
        }
        return $ret;
   
    }
    /**
     * tableToData:
     * Generic covert databse data to readers etc..
     * usage:
     * $x = DB_DataObject::factory('anytable');
     * $def = $x->getDatabaseConnection()->tableInfo($table);
     * $mydata = Generator::tableToData($table, $def);
     * 
     * returns tablekey, args(for reader header), order, readers, colmodels, forms.
     * 
     * 
     * 
     */
     
    function tableToData($table, $def)
    {
        
      
        
        $ret= array(
            'tablekey' => '',   //$this->tablekeys[$this->table] 
            'args' => array(    // was retiun..
                'root' => 'data',
                'totalProperty' => 'total',
                'id' => 'id', // primary key!!?
            ),
            'order' => array(),
            'readers' => array(),
            'colmodels' => array(),
            'forms' => array()
            
        );
         
        $readers = array( );
        $colmodels = array();
        $form  = array();
        $utable = ucfirst($table);
        //$this->tablekeys[$this->table] = '';
        
        foreach($def as $t) {
            if (is_array($t)) {
                $t = (object)$t;
            }
            $reader = array(
                'name' => $t->name,
            );
            
            $colmodel = array(
                'id' => str_replace('_', '-', strtolower($utable.'-'.$t->name)),
                'header' => ucfirst($t->name), // get from somewhere?!!?!?
                'dataIndex' => $t->name,
                'sortable' => true,
                'width' => 150,
                //'editor' => 
            );
            $felement = array(
                'name' => $t->name,
                'fieldLabel' => str_replace(array('_id', '_'), array('', ' '), ucfirst($t->name)),
                'value' => '',
                'allowBlank' =>  preg_match('/not_null/i', $t->flags) ? false : true,
                'qtip' => 'Enter '. $t->name ,
            );

                
            switch (strtoupper($t->type)) {

                case 'INT':
                case 'INT2':    // postgres
                case 'INT4':    // postgres
                case 'INT8':    // postgres
                case 'SERIAL4': // postgres
                case 'SERIAL8': // postgres
                case 'INTEGER':
                case 'TINYINT':
                case 'SMALLINT':
                case 'MEDIUMINT':
                case 'BIGINT':
                    $colmodel['width'] = 100;
                    $reader['type'] = 'int';
                    $felement['xtype'] = 'NumberField';
                     $felement['allowDecimals'] = false;
                    if ($t->len == 1) {
                        $reader['type'] = 'boolean';
                    }
                    break;
               
                case 'REAL':
                case 'DOUBLE':
                case 'DOUBLE PRECISION': // double precision (firebird)
                case 'FLOAT':
                case 'FLOAT4': // real (postgres)
                case 'FLOAT8': // double precision (postgres)
                case 'DECIMAL':
                case 'MONEY':  // mssql and maybe others
                case 'NUMERIC':
                case 'NUMBER': // oci8 
                    $reader['type']  = 'float'; // should really by FLOAT!!! / MONEY...
                    
                    $colmodel['width'] = 100;
                    $felement['xtype'] = 'NumberField';
                    break;
                    
                case 'YEAR':
                    $reader['type']  = 'int'; 
                    $felement['allowDecimals'] = false;
                    $felement['xtype'] = 'NumberField';
                    break;
                    
                case 'BIT':
                case 'BOOL':   
                case 'BOOLEAN':   
                    $colmodel['width'] = 50;
                    $reader['type']  =  'boolean';
                    $felement['xtype'] = 'CheckBox';
                    // postgres needs to quote '0'
                   
                    break;
                    
                case 'STRING':
                case 'CHAR':
                case 'VARCHAR':
                case 'VARCHAR2':
                case 'TINYTEXT':
                
                case 'ENUM':
                case 'SET':         // not really but oh well
                
                case 'POINT':       // mysql geometry stuff - not really string - but will do..
                
                case 'TIMESTAMPTZ': // postgres
                case 'BPCHAR':      // postgres
                case 'INTERVAL':    // postgres (eg. '12 days')
                
                case 'CIDR':        // postgres IP net spec
                case 'INET':        // postgres IP
                case 'MACADDR':     // postgress network Mac address.
                
                case 'INTEGER[]':   // postgres type
                case 'BOOLEAN[]':   // postgres type
                  
                    $colmodel['width'] = isset($t->len) ? max(50, min(floor($t->len * 10), 300)) : 10;
                    // editor - $colmodel['allowBlank'] = preg_match('/not_null/i', $t->flags) ? false, true;
                    $reader['type']  = 'string';
                    $felement['xtype'] = 'TextField';
                    break;
                
                case 'TEXT':
                case 'MEDIUMTEXT':
                case 'LONGTEXT':
                    $colmodel['width'] =  300;
                    $reader['type']  = 'string';
                    $felement['xtype'] = 'TextArea'; // or HtmlEditor
                    $felement['height'] = 100;
                    break;
                
                
                case 'DATE':    
                    $colmodel['width'] =  100;
                    ///$colmodel['renderer'] =  
                    
                    $reader['type']  = 'date';
                    $reader['dateFormat']   = 'Y-m-d';
                    $felement['xtype'] = 'DateField'; 
                    
                    $felement['altFormats'] = 'Y-m-d|d/m/Y';
                    $felement['format'] = 'd/m/Y';
                    $felement['hiddenFormat'] = 'Y-m-d'; // not supported ATM
        
                    break;
                    
                case 'TIME':    
                    $colmodel['width'] = 100;
                    ///$colmodel['renderer'] =  
                    $reader['type']  = 'string';
                    $felement['xtype'] = 'TextField';
                    break;    
                    
                
                case 'DATETIME': 
                     $colmodel['width'] =  100;
                    ///$colmodel['renderer'] =  
                    $reader['type']  = 'date';
                    $reader['dateFormat']   = 'Y-m-d H:i:s';
                    $felement['xtype'] = 'TextField';
                    $felement['readOnly'] = 'true';
                     
        
                    
                    break;    
                    
                case 'TIMESTAMP': // do other databases use this???
                     $colmodel['width'] =  100;
                    ///$colmodel['renderer'] =  
                    $reader['type']  = 'date';
                    $reader['dateFormat']   = 'YmdHis';
                    $felement['xtype'] = 'TextField';
                    $felement['readOnly'] = 'true'; 
                    break;    
                    
                
                case 'BLOB':       /// these should really be ignored!!!???
                case 'TINYBLOB':
                case 'MEDIUMBLOB':
                case 'LONGBLOB':
                
                case 'CLOB': // oracle character lob support
                
                case 'BYTEA':   // postgres blob support..
                    $colmodel['width'] =  300;
                    $reader['type']  = 'string';
                    $felement['xtype'] = 'TextArea'; // or HtmlEditor
                    $felement['height'] = 100;
                    break;
                    
                default:     
                    echo "*****************************************************************\n".
                         "**               WARNING UNKNOWN TYPE                          **\n".
                         "** Found column '{$t->name}', of type  '{$t->type}'            **\n".
                         "** Please submit a bug, describe what type you expect this     **\n".
                         "** column  to be                                               **\n".
                         "** ---------POSSIBLE FIX / WORKAROUND -------------------------**\n".
                         "** Try using MDB2 as the backend - eg set the config option    **\n".
                         "** db_driver = MDB2                                            **\n".
                         "*****************************************************************\n";
                    $write_ini = false;
                    break;
            }
            
            if (preg_match('/(auto_increment|nextval\()/i',rawurldecode($t->flags)) 
                || (isset($t->autoincrement) && ($t->autoincrement === true))) {
                    
                if (empty($ret['tablekeys'])) {
                    $ret['tablekeys'] = $t->name;
                }
                 
            
            }
            
            
            
             
            // form inherits from users' colmodel width..
            $felement['width'] = $colmodel['width'];
            
            //$readers[] = $reader;
            //$colmodels[] = $colmodel;
            if ($ret['tablekey'] == $t->name) {
                // do allow id to be 
                $felement['xtype'] = 'Hidden';
                unset($felement['allowBlank']);
                unset($felement['fieldLabel']);
                
                
                
                
            } else {
                // only put id in the key col.
                unset($colmodel['id']);
            }
            // hidden elemetns do not need any display components..
            if ($felement['xtype'] == 'Hidden') {
                foreach($felement as $k=>$v) {
                    if (!in_array($k , array('name', 'xtype'))) {
                        unset($felement[$k]);
                    }
                }
                 
            }
            
           // $form[] = $felement;
           
            // store the globals
            $ret['order'][] = $t->name;
            $ret['readers'][$t->name] = $reader;
            $ret['colmodels'][$t->name] = $colmodel;
            $ret['forms'][$t->name] = $felement;
            
             
        }
        //$ret['args'] = $args;
        
        return $ret;
        
    }
     
    function _generateData($table)
    {
         
        $args = array(
            'root' => 'data',
            'totalProperty' => 'total',
            'id' => 'id', // primary key!!?
        );
         
        $d = $this->tableToData($this->_definitions[$table]);
        
        $this->tablekeys[$this->table]  = $d['tablekey'];
        
            // $form[] = $felement;
           
            // store the globals
        $this->def['order'][$table] = $d['order'];
        $this->def['readers'][$table]= $d['readers'];
        $this->def['colmodels'][$table] = $d['colmodes'];
        $this->def['forms'][$table] = $d['forms'];
        
        $this->readersArgs[$table]   = $d['args'];
        
        
        
    }
    
     
     
   
    function parseConfig()
    {
         $options = &PEAR::getStaticProperty('DB_DataObject','options');
        
        if (isset($options['modtables'])) {
            $this->modtables = $options['modtables'];
            $this->modmap = $options['modmap'];
            $this->modsql = $options['modsql'];
        }
        
        $ff = HTML_Flexyframework::get();
        $dirs = array($ff->page->rootDir.'/Pman/DataObjects'); // not used anymore!
        foreach($this->modtables as $m=>$ts) {
            $dirs[] = $ff->page->rootDir.'/Pman/'.$m.'/DataObjects';
        }
        $ini = array('database__render' => array());
        foreach($dirs as $d) {
            if (!file_exists($d.'/pman.links.ini')) {
                continue;
            }
            $in = parse_ini_file($d.'/pman.links.ini',true);
            $r = array();
            if (isset($in['database__render'])) {
                $r = $in['database__render'];
                unset($in['database__render']);
            }
            $ini = array_merge($ini, $in);
            $ini['database__render'] = array_merge($ini['database__render'] , $r);
        }
         //echo '<PRE>';print_R($ini);//exit;
        
        
        if (!isset($ini['database__render'])) {
            die("database__render not available in links files.");
            return;
        }
        $this->mapcols = array();
        foreach($ini as $tab=>$conf) {
            if ($tab == 'database__render') {
                continue;
            }
            $this->mergeConfig($tab,$conf,$ini['database__render']);
             
        }
        $this->renderMap = $ini['database__render'];
    }
    function mergeConfig($table, $conf, $render)
    {
        $this->mapcols[$table] = array();
        $options = &PEAR::getStaticProperty('DB_DataObject','options');
        if (isset($options['modtables'])) {
            $this->modtables = $options['modtables'];
            $this->modmap = $options['modmap'];
            $this->modsql = $options['modsql'];
        }
        
        
        foreach($conf as $ocol=>$info) {
            // format col => showval..
            //list($rtc, $rshow) = explode(':', $info);
            list($tab,$col) = explode(':', $info);
            //print_r($render);
            $rshow = $render[$tab];
            
            $this->mapcols[$table][$ocol] = array('table'=>$tab, 'col' => $col);
            
            // for the grid...
            
            // reader:
            //- just add an extra line..
            if (!isset($this->def['readers'][$tab][$rshow])){
                echo "WARNING in links.ini TABLE $tab does not have renderer $rshow <BR>\n";
                continue;
            }
            
            // for the readers.. we need to merge all the columns in the left to the right...
            
            // table => original
            // ocol => column in table
            // tab => remote table
            // col => right col linked to...
            
            $rdef = $this->_definitions[$tab];
            
            
            foreach($rdef as $t) {
                //copy typedata from old coll
                $this->def['readers'][$table][$ocol.'-'. $t->name] = $this->def['readers'][$tab][$t->name];
                $this->def['readers'][$table][$ocol.'-'. $t->name]['name'] = $ocol.'_'. $t->name;
            }
            
            
            
            
            
            // remove the def column from the id one..
            if (isset($this->def['colmodels'][$table][$ocol])) {
                unset($this->def['colmodels'][$table][$ocol]);
            }
            $this->def['colmodels'][$table][$ocol.'-'. $rshow] = 
                    $this->def['colmodels'][$tab][$rshow];
            
            // change the header name (merge of two..)
            list($colname,) = explode('_',$ocol,2);
            
            $this->def['colmodels'][$table][$ocol.'-'. $rshow]['dataIndex'] = $ocol.'_'. $rshow;
            $this->def['colmodels'][$table][$ocol.'-'. $rshow]['id'] = $ocol.'-'. $rshow;
            
            $this->def['colmodels'][$table][$ocol.'-'. $rshow]['header'] = ucwords($colname . ' ' . 
                $this->def['colmodels'][$tab][$rshow]['header']);
            
            // last of all add replace the old $col, with 
            $p = array_search($ocol, empty($this->def['order'][$table]) ? array() : $this->def['order'][$table]);
            $this->def['order'][$table][$p] = $ocol.'-'. $rshow;
            $this->def['order'][$table][] = $ocol;
             
            // --- now for forms!!!!
            
             
        }
        //var_dump($table);
        //print_r( $this->def['readers'][$table]);
       // print_r( $this->def['colmodels'][$table]);
        //print_r($this->def['readers'][$table]); exit;
        
    }
        
       
    function writeFileEx($n, $f, $str) 
    {
        if (file_exists($f)) {
            // all - will not overwrite stuff.. (only being specific willl)
            if (!in_array($n, $this->overwrite)) {
                $this->writeFile($f.'.generated',$str);
                return;
            }
        }
        $this->writeFile($f,$str);
        
        
    }
    function writeFile($f, $str)
    {
        require_once 'System.php';
        System::mkdir(array('-p', dirname($f)));
        // overwrite???
        echo "write: $f\n";
        file_put_contents($f, $str);
    } 
   
}

