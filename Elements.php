<?php

/**
 * 
 * Supply the palete of elements..
 * 
 * Things it can supply:
 * -> Basic Element information? - 
 *   -- eg. our standard widget set (with all the options?) - grabed from our doc-code.?
 * 
 * -> Database Tables / Fields
 *   == start off with just the table..
 * 
 * 
 */


require_once 'Pman.php';

class Pman_Builder_Elements extends Pman 
{
    function getAuth() {
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
        if (empty($_REQUEST['table'])) {
            $this->getTableList();
        }
        $tb = $_REQUEST['table'];
         
        if ($tb == '*grids') {
            $this->getGridElements();
        }
        if ($tb[0] == '*') {
            $this->readElement(substr($tb,1));
        }
        $this->getTableFormElements($tb);
        
    }
    
    function getTableList() // fro pulldown list
    {
        $d = DB_DataObject::factory('Person');
        $db = $d->getDatabaseConnection();
        
        
        $tables = $db->getListOf('tables');
        $ret= array(
            array('name' => 'Layout Elements', 'table' => '*Layout'),
            array('name' => 'Form Elements', 'table' => '*Form'),
            array('name' => 'Grid Elements', 'table' => '*Grid'),
            array('name' => 'Grids (from database)', 'table' => '*grids')
        );
        foreach($tables as $t) {
            $ret[] = array('name' => 'Table: ' . $t, 'table' => $t);
        }
        //echo'<PRE>';print_r($tables);
        $this->jdata($ret);
        
        //$__DB->tableInfo($quotedTable);
        
    }
    function getTableFormElements($tb) 
    {
        $d = DB_DataObject::factory('Person');
        $db = $d->getDatabaseConnection();
        
        $def=  $db->tableInfo($tb);
        if (is_object($def)) {
            $this->jerr($def->toString());
        }
        $ret = array( 
        
           array(
                'grp' => 'Forms', 
                'name' => 'Form: '. $tb, 
                'description' => "A Form for $tb", 
                
                'cfg' =>  array(
                    'xtype'=>'Form',
                    'style' => 'margin: 5px',
                    '|url' => "baseURL + '/Roo/" . ucfirst($tb) . ".php'",
                    'method' => 'POST',
                    'listeners' => array(
                        '|actionfailed' => 'function (_self, action)
{
    _this.dialog.el.unmask();
    Pman.standardActionFailed(_self, action);
}
',
                        '|actioncomplete' => "function (_self, action)
{
   
   if (action.type =='submit') {
       
       _this.dialog.el.unmask();
       _this.dialog.hide();
       
        if (_this.callback) {
           _this.callback.call(_this, _this.form.getValues());
        }
        _this.form.reset();
        return;
    }
}
",                    
                        '|rendered' => 'function (_self)
{
    _this.form = _self;
}
',
                    ), 
                    'items' => array()

                )
            ),
        );
        
        foreach($def as $r) {
            $el = $this->rowToFormElement((object)$r,$tb);
            if (!$el) {
                continue;
            }
            // next.. cros table detection!?!?!?
            if ( $el['xtype'] == 'NumberField') {
                $el = $this->linkedToFormElement($r['name'], $tb, $el);
            }
            
            /*
            ['Forms','Row', 'A Row of form elements',
				{
                    xtype:'Row' ,
                    autoHeight:true
                }
            ],
            */
            $fn = $el['*fullname'];
            
            unset($el['*fullname']);
            $title = isset($el['fieldLabel']) ?$el['fieldLabel'] : $fn;
            if (isset($el['*title'])) {
                $title = $el['*title'];
                unset($el['*title']);
            }
            $ret[] = array(
                'grp' => $tb, 
                'name' => $title,
                'description' => $fn, 
                'cfg' => $el
                );
            
            $ret[0]['cfg']['items'][] = $el;
            
        }
        $this->jdata($ret);
         
        
    }
    
    function rowToFormElement($t,$tab)
    {
        
        $el['name'] = $t->name;
        $el['*fullname'] = $tab.'.' . $t->name; /// ???
        $fl = preg_replace('/_/', ' ', $t->name);
        $fl = preg_replace('/ id$/', ' ', $fl);
        $el['fieldLabel'] = ucfirst($fl);
        
        
        
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
                    if ($t->name == 'id') {
                        $el['*title'] = 'Hidden: id';
                        $el['xtype'] = 'Hidden';
                        unset($el['fieldLabel']);
                        break;
                    }
                    $el['width'] = 50;
                    $el['xtype'] = 'NumberField';
                    $el['allowDecimals'] = false;
                    
                    //bools???
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
                    $el['xtype'] = 'NumberField';
                    break;
                    
                case 'YEAR':
                    
                    $el['allowDecimals'] = false;
                    $el['xtype'] = 'NumberField'; // YeaR?
                    break;
                    
                case 'BIT':
                case 'BOOL':   
                case 'BOOLEAN':   
                    
                    $el['xtype'] = 'CheckBox'; // fix - I think I've updated the api..
                    
                   
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
                  
                    $el['width'] = isset($t->len) ? max(50, min(floor($t->len * 10), 200)) : 200;
                    $el['xtype'] = 'TextField';
                    break;
                
                case 'TEXT':
                case 'MEDIUMTEXT':
                case 'LONGTEXT':
                    $el['width'] =  300;
                    $el['height'] =  70;
                    $el['xtype'] = 'TextArea'; // or HtmlEditor
                    
                    break;
                
                
                case 'DATE':    
                    
                    $el['xtype'] = 'DateField'; 
                    $el['altFormats'] = 'Y-m-d|d/m/Y';
                    $el['format'] = 'd/m/Y';
                    $el['hiddenFormat'] = 'Y-m-d'; // not supported ATM
        
                    break;
                    
                case 'TIME':    
                    $el['xtype'] = 'TextField'; // time field.?
                    break;    
                    
                
                case 'DATETIME': 
                    $el['xtype'] = 'TextField';
                    $el['readOnly'] = 'true';
                    break;    
                    
                case 'TIMESTAMP': // do other databases use this???
                    $el['xtype'] = 'TextField';
                    $el['readOnly'] = 'true'; 
                    break;    
                    
                
                case 'BLOB':       /// these should really be ignored!!!???
                case 'TINYBLOB':
                case 'MEDIUMBLOB':
                case 'LONGBLOB':
                
                case 'CLOB': // oracle character lob support
                
                case 'BYTEA':   // postgres blob support..
                    
                    $el['xtype'] = 'TextArea'; // or HtmlEditor
                    $el['width'] =  300;
                    $el['height'] = 100;
                    break;
                    
                default:     
                    return false;
                    break;
            }
            return $el;
    }
    
    
    function readElement($fn)
    {
        
        $fn = preg_replace('/[^a-z]+i/', '',$fn);
        $f = dirname(__FILE__)."/Elements/$fn.js";
        if (!file_exists($f)) {
            $this->jerr("no such file");
        }
        
        $lines = file($f);
        $ret = array();
        $atStart = true;
        for ($i = 0; $i< count($lines); $i++) {
            $l = $lines[$i];
            if ($atStart && trim($l) != '[') {
                continue;
            }
            $atStart = false;
            
            if (!preg_match('/function/', $l)) {
                $ret[] = $l;
                continue;
            }
            // got a function def...
            $lt = trim($l);
            $pad = substr($l,0, strpos($l, $lt)) .'}';
            list($k, $func) = explode(':', $l);
            $rem = '';
            while ($i < count($lines)) {
                $i++;
                $l = $lines[$i];
                
                if ($pad  == substr($l, 0, strlen($pad))) {
                    $func.= "\n".$pad;
                    $rem = substr($l, strlen($pad)); //left over..
                    break;
                }
                $func.= "\n".$l;
                
            }
            $ret[] = $k .' : ' . json_encode($func."\n") . $rem;
            
            
            
        }
        require_once 'Services/JSON.php';
        $j = new Services_JSON();
        //echo '<PRE>';
        //print_R($ret);
        $json= $j->decode(implode("\n", $ret));
        
      //  echo '<PRE>';print_r($json);exit;
        $this->jdata($json);
        exit;
        
        
    }
         
       
     

    function links()
    {
        
        static $conf = false;
        if ($conf) {
            return $conf;
        }
        $ff = HTML_FlexyFramework::get();
        $top = $ff->rootDir.'/Pman';
        
        
        $conf = array('database__render'=>array());
        foreach(scandir($top) as $m) {
            $vf = $top .'/'.$m.'/DataObjects/pman.links.ini';
            if (!strlen($m) ||  $m[0] == '.' ||  !file_exists($vf) ) {
                continue;
            }
            $c = parse_ini_file($vf,true);
            if (isset($c['database__render'])) {
                $conf['database__render'] = array_merge($conf['database__render'], $c['database__render']);
                unset($c['database__render']);
            }
            $conf = array_merge($conf , $c);
        }
        
        return $conf;
       }
    
    function linkedToFormElement($r, $tb, $el) // creates combos for for elements.
    {
        // get the links..
        $conf = $this->links();
        //var_dump($conf);
        if (!is_array($conf) || !isset($conf[$tb]) || !isset($conf[$tb][$r])) {
            return $el;
        }
        list($mtb, $mr) = explode(':', $conf[$tb][$r]);
        // work out the display field.
        if (!isset($conf['database__render'][$mtb])) {
            return $el;
        }
        $df = $conf['database__render'][$mtb];
        
        
        $ret = array(
            '*title'=> 'Combo: '. $el['fieldLabel'],
            '*fullname' => $el['*fullname'],
            'fieldLabel' => $el['fieldLabel'],
            'name' => $el['name'] . '_' . $df,
            'hiddenName' => $el['name'],
            
            'qtip' => 'Select ' . $el['fieldLabel'],   
            'emptyText' => 'Select ' . $el['fieldLabel'],   

            'xtype' => 'ComboBox',
            'selectOnFocus' => true,
                   
            'allowBlank' => true,
            'width'=> 300,
            'listWidth' => 300,
            'editable'=> false,
            /*
            'store'=> array(
                'xtype' => 'Store',
                'proxy'=> array(
                    'xtype'=> 'HttpProxy',
                     '|url'=> "baseURL + '/Roo/" . $mtb.".php'",
                    'method'=> 'GET'
                ), 
                //'listeners' =>storeListeners,
                '|reader'=> 'Pman.Readers.'.$mtb,
            ),
            */
            'displayField'=> $df,
            'valueField' => $mr,  
            
            'typeAhead'=> true,
            'forceSelection'=> true,
           
            'triggerAction'=> 'all',
             
            'tpl'=> '<div class="x-grid-cell-text x-btn button">'.
                    '<b>{'.$df.'}</b> '.
                '</div>'
            ,
             
            'queryParam'=> 'query['.$df.']',
            'loadingText'=> "Searching...",
            'listWidth'=> 400,
           
            'minChars'=> 2,
            'pageSize'=>20,
            
            'items' => array(
                array(
                    '*prop' => 'store',
                    'xtype' => 'Store',
                    'items' => array( array(
                    
                        '*prop' => 'proxy',
                        'xtype'=> 'HttpProxy',
                         '|url'=> "baseURL + '/Roo/" . ucfirst($mtb).".php'",
                        'method'=> 'GET'
                    )), 
                
                    //'listeners' =>storeListeners,
                    '|reader'=> 'Pman.Readers.'.ucfirst($mtb),
                )
            )
                
            
            
           // 'listeners' => {
          //      'select' =>  function(cb, rec, ix) {
           //         cb.lastData = rec.data;
           //     }
           // },
            
           
        );
        
        return $ret;
        
        
        
        
    }
    

    
    function getGridElements()
    {
        $d = DB_DataObject::factory('Person');
        $db = $d->getDatabaseConnection();
        
        $ret = array();
        $tables = $db->getListOf('tables');
        foreach($tables as $t) {
            $ret[] = $this->tableToGrid($t);
            
            
        }
        $this->jdata($ret);
        
    }
    
    function tableToGrid($t)
    {
        $d = DB_DataObject::factory('Person');
        $this->db = $d->getDatabaseConnection();
        
        $colmodel = $this->colModel($t);
        $aec = isset($colmodel[0]['dataIndex']) ? $colmodel[0]['dataIndex'] : '';
        $rawReader = $this->readerRaw($t); // usefull if no reader will be generated.
        
        
        return array(
            'grp' => 'Grids', 
            'name' => $t,
            'description' => "Grid for table . $t",
            'cfg' =>  array(
                'xtype'=>'GridPanel',
                'title' => $t,
                'fitToframe' => true,
                'fitContainer' => true,
                'tableName' => $t,
                'background' => true,
                'listeners' => array(
                    '|activate'  => "function() {
    _this.panel = this;
    if (_this.grid) {
        _this.grid.footer.onClick('first');
    }
}",
                ),
                'items' => array(
                    array(
                        '*prop' => 'grid',
                        'xtype' => 'Grid',
                        'autoExpandColumn' => $aec,
                        'loadMask' => true,
                        'listeners' => array(
                            '|render' => 'function() { 
    _this.grid = this; 
    //_this.dialog = Pman.Dialog.FILL_IN
    if (_this.panel.active) {
       this.footer.onClick(\'first\');
    }
}'
                        ),
                        'items' => array(
                            array(
                                '*prop' => 'dataSource',
                                'xtype' => 'Store',
                                'items' => array( array(
            
                                    '*prop' => 'proxy',
                                    'xtype'=> 'HttpProxy',
                                    'method' => 'GET',
                                    '|url'=> "baseURL + '/Roo/$t.php'"
                                )), 
                                '|reader'=> "Pman.Readers." . ucfirst($t),
                                '|readerRaw'=> $rawReader,
                            ),
                            array(
                                '*prop' => 'colModel',
                                'xtype' => 'Array',
                                'items' => $colmodel,
                       
                                
                                
                            ), 
                             array(
                                '*prop' => 'footer',
                                'xtype' => 'PagingToolbar',
                                'pageSize' => 25,
                                'displayInfo' => true,
                                'displayMsg' => "Displaying $t  {0} - {1} of {2}",
                                'emptyMsg' => "No $t found"
                            ),
                                  
                            array(
                                '*prop' => 'toolbar',
                                'xtype' => 'Toolbar',
                                'items' => array(
                                    array(
                                        'text'=> "Add",
                                        'xtype' => 'Button',
                                        'cls' => 'x-btn-text-icon',
                                        '|icon' => "Roo.rootURL + 'images/default/dd/drop-add.gif'",
                                        'listeners' => array(
                                            '|click' => 'function()
        {
            _this.dialog.show( { id : 0 }, function() {
                _this.grid.footer.onClick(\'first\');

            }); 

        }
        '
                                        )
                                    ), 
                                    array(
                                        'text'=> "Edit",
                                        'xtype' => 'Button', 
                                        'cls' => 'x-btn-text-icon',
                                        '|icon' => "Roo.rootURL + 'images/default/tree/leaf.gif'",

                                        'listeners' => array(
                                            '|click' => 'function()
        {
            var s = _this.grid.getSelectionModel().getSelections();
            if (!s.length || (s.length > 1))  {
                Roo.MessageBox.alert("Error", s.length ? "Select only one Row" : "Select a Row");
                return;
            }
            
            _this.dialog.show(s[0].data, function() {
                _this.grid.footer.onClick(\'first\');
               }); 
            
        }
        '
                                        )
                                    ),  
                                    array(
                                        'text'=> "Delete",
                                        'cls' => 'x-btn-text-icon',
                                        '|icon' => "rootURL + '/Pman/templates/images/trash.gif'",
                                        'xtype' => 'Button',
                                        'listeners' => array(
                                            '|click' => 'function()
        {
        Pman.genericDelete(_this, _this.grid.tableName); 
        }
        '
                                        )
                                    )

                                )
                           )   
                        ),
                    
                    ),
                    
                )                
                                    
            )
        );
         
    }
    function colModel($tb)
    {
        // just ouput stuff...
        
        $def=  $this->db->tableInfo($tb);
        $ret = array();
        $conf = $this->links();
        foreach($def as $r) {
            $rn = $r['name'];
            if ($r['name'] == 'id') {
                continue;
            }
            $fl = preg_replace('/_/', ' ', $r['name']);
            $fl = preg_replace('/ id$/', ' ', $fl);
            
            $add =  array(
                'xtype'=> '*ColumnModel',
                'header'=> ucfirst($fl),
                'width' => 100,
                'dataIndex' => $rn,
                '|renderer' => "function(v) { return String.format('{0}', v); }",
            );
             
            
            //var_dump($conf);
            if (!is_array($conf) || !isset($conf[$tb]) || !isset($conf[$tb][$rn])) {
                $ret[] = $add;
                continue;
            }
            list($mtb, $mr) = explode(':', $conf[$tb][$rn]);
            // work out the display field.
            if (!isset($conf['database__render'][$mtb])) {
                $ret[] = $add;
                continue;
            }
            // linkded colum...
            
            $add['dataIndex'] = $rn.'_'. $conf['database__render'][$mtb];
            $ret[] = $add;
        }
        return $ret;
    }
    
    function readerRaw($tb)
    {
        // just ouput stuff...
        require_once 'Pman/Builder/Generator.php';
        require_once 'Pman/Builder/Generator/JSON.php';
        
        $x = DB_DataObject::factory('Builder');
        $basedef = $x->getDatabaseConnection()->tableInfo($tb);
        $def = Pman_Builder_Generator::tableToData($tb, $basedef);
        require_once 'Pman/Builder/Generator/JSON.php';
        $j = new Pman_Builder_Generator_JSON(array('crlf' => "\n", 'tab' => '    '));
        $j2 = new Pman_Builder_Generator_JSON(array('crlf' => '', 'tab' => ''));
        
        $x = 'new Roo.data.JsonReader(' . $j->encodeUnsafe($def['args']);
        $ret =  trim(substr($x, 0, -1)) . ",\n"; // strip of trailing ;};
        $ret .=  $j->tab . "fields : [\n". $j->tab.$j->tab;
        $ar = array();
        foreach($def['readers'] as $xr) {
            $ar[] = $j2->encodeUnsafe($xr);
        }
        $ret .= implode(",\n". $j->tab.$j->tab, $ar);
        $ret .= "\n".  $j->tab . "]\n})\n";
        return $ret;    
        
        
    }
    
    
}