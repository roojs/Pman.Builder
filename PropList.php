<?php

/**
 * 
 * Use the Roo data to work out properties..
 * 

 * 
 * 
 */


require_once 'Pman.php';

class Pman_Builder_PropList extends Pman 
{
    
    
    function getAuth() {
       // parent::getAuth(); // load company!
       // $au = $this->getAuthUser();
       // if (!$au) {
       //     $this->jerr("Not authenticated", array('authFailure' => true));
        //}
        //$this->authUser = $au;
        return true;
    }
    function get()
    {
        // should be in the root directory...
        
        $opts = HTML_FlexyFramework::get();
        
        $this->src = isset($opts->Pman_Builder['roojs1_path']) ?
            $opts->Pman_Builder['roojs1_path'] .'/docs/json':
            realpath($opts->rootDir. '/roojs1/docs/json');
        if (!$this->src) {
            $this->jerr("roojs1 directory is not in top level folder, or Builder.roojs1_path is not set");
        }
        
        
        if (empty($_REQUEST['xtype'])) {
            $this->jerr("no xtype");
        }
        if ($_REQUEST['xtype'] == '*all') {
            $this->allProps();
        }
        
        
        if ($_REQUEST['xtype'] == 'Array') {
            $this->jdata(array());
        }
        
        $view = empty($_REQUEST['view']) ? 'props' : 'events';
        
        $ret = array( );
        
        if ($_REQUEST['xtype'] == '*Module' && $view == 'props') {
            $this->jdata($this->defModule()); 
        }
         
         
        // strip non alpha chars == our  dummy xtype use '*'
        $xtype = preg_replace('/[^a-z0-9_.-]+/i', '', $_REQUEST['xtype']);
        //var_dump($xtype);exit;
        
        $guess  = array( 'Roo',  'Roo.menu' , 'Roo.form',  'Roo.data',   'Roo.grid',   'Roo.Toolbar');
        if (!empty($_REQUEST['xns'])) {
            $guess = array( preg_replace('/[^a-z0-9_.-]+/i', '', $_REQUEST['xns']) );
        }
        
        
        foreach( $guess as $p) {
            $fp = $this->src . '/'. $p.'.'.$xtype . '.json';
            if (!file_exists($fp)) {
                continue;
            }
           // var_dump(file_get_contents($fp) );
            // is this needed?? can we just dump it out.. with a bit of kluding?
            $jd = json_decode( file_get_contents($fp) );
            //print_r($jd);
            
            foreach($jd->$view as $n=>$inf) {
                $ret[] = (array)$inf;
            }
            if ($view == 'props') {
                $ret = array_merge($ret, $this->defProps());
            }
            $this->jdata($ret);
            exit;     
        }
        if (isset($_REQUEST['dataonly'])) {
            $this->jerr('Not available');
        }
        return $this->jdata(array());
    
    }
    
    function defModule() {
        return array(
           array( 'name'=>'app', 'type'=>'Object', 'desc'=>'Application (used in perm name) and relates to directory that file is written to..' , 'def'=>'' ),
           // we could get rid of these... and use the disabled function!!!
           array( 'name'=>'perm', 'type'=>'String', 'desc'=>'(Optional) Permision name (eg. ListCompanies)' , 'def'=>'' ),
           array( 'name'=> 'permtype', 'type'=>'String', 'desc'=>'Optional) A,E,S...' , 'def'=>'S' ),
           
           array( 'name'=>'disabled', 'type'=>'Number', 'desc'=>'Disable this panel (turn it into a function to run things at module load time)' , 'def'=>'1' ),
           array( 'name'=>'modkey', 'type'=>'Number', 'desc'=>'Order of item (for tabs)', 'def'=>''  ),
           
           array( 'name'=>'module', 'type'=>'Object', 'desc'=>'Module name (eg. Pman.Tab.XXXX or Pman.Dialog.XXXX' , 'def'=>'Pman.Tab.' ),
           array( 'name'=>'region', 'type'=>'String', 'desc'=>'center|south|east|west|north' , 'def'=>'center' ),
           array( 'name'=>'parent', 'type'=>'Object', 'desc'=>'Name of Module to add this to.' , 'def'=> 'Pman' ),
           array( 'name'=>'name', 'type'=>'String', 'desc'=>'Text to display when loading' , 'def'=>'Un-named Part' ),
           
        );
    }
    
    function defProps() {
        return  array(
               array( 'name'=>'xtype', 'type'=>'String', 'desc'=>'Xtype name of element'),
               array( 'name'=>'|xns', 'type'=>'Object', 'desc'=>'Namespace for xtype'),
               
               array( 'name'=>'style', 'type'=>'String', 'desc'=>'CSS Style'),
               array( 'name'=>'region', 'type'=>'String', 'desc'=>'Region '), // need for panels..
               array( 'name'=>'+buildershow', 'type'=>'Boolean', 'desc'=>'Hide from builder'), // need for panels.
               array( 'name'=>'*prop', 'type'=>'String', 'desc'=>'Change to property'), // need for panels.
            );
    }
    
    
    function jdata($ar)
    {
        if (isset($_REQUEST['dataonly'])) {
            $this->jok($ar);
        }
        parent::jdata($ar);
    }
    function allProps()
    {
        $defprops = $this->defProps();
        $ret = array();
        $ret['*Module'] = array('events' => array(), 'props' => $this->defModule());
        
        foreach(scandir($this->src) as $f) {
            if (empty($f) || $f[0] == '.' || !preg_match('/\.json$/', $f)) {
                continue;
            }
            $cls = preg_replace('/\.json$/', '', $f);
            $fp = $this->src. '/'. $f;
            $jd = json_decode( file_get_contents($fp) );
            if (empty($jd->props) && empty($jd->events)) {
                continue;
            }
            $jd->props = array_merge($jd->props , $defprops);
            $ret[$cls] = $jd;
            
            
        }
        
        $this->jok($ret);
        
        $this->jok("OK");
    }
    
    
}