<?php

require_once 'Pman.php';

class Pman_Builder_Code extends Pman
{
    function getAuth()
    {
        return true; // everyone?
    }
    function get($code)
    {
        
        
        
       //var_dump($_REQUEST);
        if (!empty($_REQUEST['_recover'])) {
            $this->recover($code);
        }
       //DB_DataObject::debugLevel(1);
        $b = DB_DataObject::factory('builder');
      
        if (!empty($_REQUEST['id'])) {
            if (!$b->get($_REQUEST['id'])) {
                die("Invalid URL");
            }
        }
        if (!empty($code)) {
            if (!$b->get('module', $code)) {
                die("Invalid URL");
            }
        }
        if (!$b->id) {
            die("Invalid URL");
        }
        
        
        $json = json_decode($b->json);
        //echo '<PRE>';print_r($b->json);exit;
        $out  = $this->toJSFile($json, $b->json);
     
        if (!empty($code)) {
            header('Content-type: application/javascript');
            echo $out;
            exit;
        }
        
        echo "<PRE>";
        //print_r($json);
        echo htmlspecialchars($out);
        
       
        
        exit; 
        
    }
    
    
    function recover($code)
    {
        if (!$this->getAuthUser()) {
            $this->jerr("invalid");
        }
        // fixme!!!!
        
        $fn = $this->rootDir .'/Pman/' . $code.'.js';
        
        list($app, $mod) = explode('/', $code);
        
        if (!file_exists($fn)) {
            $this->jerr("file does not exist.:" . $fn);
        }
        $data = file_get_contents($fn);
        preg_match("#/*\n--SOURCE--\n([^\*]+)#m", $data,$matches);
       // echo "<PRE>";print_R($matches);
        $base = $matches[1];
        $str = bzdecompress( base64_decode($base));
        $js = json_decode($str);
        //echo "<PRE>";print_R($str);
         $b = DB_DataObject::factory('builder');
        $b->app = $app;
        $b->module = $mod;
        $b->btype = 'FORM';
        $b->name= $js->name;
        if (!$b->find(true)) {
            $b->insert();
        }
        echo "<PRE>" . htmlspecialchars( print_r($b, true));
        $b->json = $str;
        $b->update();
        $this->jok("DONE");
        exit;
        
        
        
        
    }
    
    
    function mungePropsObj($obj)
    {
        if (isset($obj->items)) {
            $items = array();
            
            // look for *prop...
            
            foreach($obj->items as $o) {
                if (!empty($o->{'*prop'})) {
                    $pn = $o->{'*prop'};
                    unset($o->{'*prop'});
                    $this->mungePropsObj($o);
                    
                   
                    
                    $obj->$pn = $o;
                    if (isset($o->xtype) &&  $o->xtype == 'Array') {
                        if (empty($o->items)) {
                            unset($obj->$pn);
                            continue;
                        }
                        $obj->$pn = $o->items;
                    }
                    
                    
                    continue;
                }
                
                // otherwise is a standard item..
                $this->mungePropsObj($o);
                
                 //if ($o->xtype == 'GridField') {
                 //       continue;
                 //   }
                $items[] = $o;
            }
            
            $obj->items = $items;
            if (empty($items)) {
                unset($obj->items);
            }
        }
        if (!empty($obj->xtype) && ($obj->xtype[0] == '*')) {
            unset($obj->xtype);
        }
        
        
    }
    
    function jsHead()
    {
        return array(
            "//<script type=\"text/javascript\">",
            "//",
            "// Version " . date("Ymd-His"),
            "//",
            "// Auto generated file - do not edit directly",
            "// created by Application Builder (Web version)",
            ""
        );
       
    }
    function toJSFileDialog($obj, $json=false)
    {
        $out = implode("\n", $this->jsHead());
       
        $module = $obj->{'|module'};
        $app = $obj->app;
        $out .= implode("\n", array(
            "$module = {",
            "",
            "    dialog : false,",
            "    callback:  false,",
            "",   
            "    show : function(data, cb)",
            "    {",
            "        if (!this.dialog) {",
            "            this.create();",
            "        }",
            "",
            "        this.callback = cb;",
            "        this.data = data;",
            "        this.dialog.show();",
            "        if (this.form) {",
            "           this.form.reset();",
            "           this.form.setValues(data);",
            "           this.form.fireEvent('actioncomplete', this.form,  { type: 'setdata', data: data });",
            "        }",
            "",   
            "    },",
            "",
            "    create : function()",
            "    {",
            "        var _this = this;",
            "        this.dialog = Roo.factory("
        ));
        $this->mungePropsObj($obj->items[0]);
        if (isset($region)) {
            $obj->items[0]->region = $region;
        }
       
        $out .= $this->toJSObj($obj->items[0], 3); // should be first child really...
        
        $out .= ");\n";
        
        if (isset($obj->items[0]->layout)) {
            $out .= implode("\n", array(
                "       this.layout = this.dialog.layout;",
                ""
            ));
           
        }
                
        $out .=  implode("\n", array(
            "    }",
            "};",
            "",
        ));
        $out.=$this->jsonToComment($json);
        
        
      
        return $out;
    
        
       
    }
    function toJSFileLayout($obj, $json=false)
    {
        $out = implode("\n", $this->jsHead());
       
        $module = $obj->{'|module'};
        $app = $obj->app;
        
        
              
           // initially we can get this from $ar
           
           
       
        $perm = !empty($obj->perm) ? $obj->perm : '';
        $permtype = !empty($obj->type) ?  $obj->type : 'S';
        $v = sprintf('%03d', (int) isset($obj->modkey) ? $obj->modkey : 0);
        $modkey = $v.'-' . strtolower(str_replace('.', '_', $module));
        if (isset($obj->region)) {
                
            
            $region = $obj->region;
            $parent = $obj->{'|parent'};
            $name = $obj->name;
            $app_perm = strpos($perm, '.') > 0 ? $perm: "$app.$perm";
            
            
            // I know this is dumb.. but otherwise indenting doesnt really work.
            $out .= implode("\n", array(
                "",
                "",
                "",
                "// register the module first",
                "Pman.on('beforeload', function()",
                "{",
                ""
            ));
            
            if  (!empty($perm)) {
                $out .= implode("\n", array(
               
                    "   if (Pman.Login.authUser.company_id_comptype != 'OWNER') {",
                    "        return;",
                    "    }",
                    "",
                    "    if (!Pman.hasPerm('$app_perm', '$permtype')) {",
                    "        return;",
                    "    }"
                ));
            }
            $dis = empty($obj->disabled) ? 'false' : 'true';
            if (!empty($obj->{'|disabled'})) {
                $dis = implode("\n      ", explode("\n", $obj->{'|disabled'}));
            }
            $out .= implode("\n", array(
                "    var disabled = $dis;",
                "    if (disabled) {",
                "        return; ",
                "    }",
                "    Pman.register({",
                "        modKey : '$modkey',",
                "        module : $module,",
                "        region : '$region',",
                "        parent : $parent,",
                "        name : \"$name\"",
                "    });",
                "});",
                ""
            ));
        }
        $baseprop = 'panel';
        
        
        
        
        
        $out .= implode("\n", array(
            "$module = new Roo.util.Observable({",
            "",
            "    panel : false,",
            "    disabled : false,",
            "    parentLayout:  false,",
            "",
            "    add : function(parentLayout, region)",
            "    {",
            "",
            "        var _this = this;", // standard avaialbe..
            "        this.parentLayout = parentLayout;",
            "",
            "        this.panel = parentLayout.addxtype("
        ));
        
        $this->mungePropsObj($obj->items[0]);
        if (isset($region)) {
            $obj->items[0]->region = $region;
        }
       
        $out .= $this->toJSObj($obj->items[0], 3); // should be first child really...
        
        $out .= ");\n";
        
        if (isset($obj->items[0]->layout)) {
            $out .= implode("\n", array(
                "       this.layout = this.panel.layout;",
                ""
            ));
           
        }
                
        $out .=  implode("\n", array(
            "    }",
            "});",
            "",
        ));
        $out.=$this->jsonToComment($json);
        
      
        return $out;
    }
    
            
            

    function jsonToComment($json)
    {
        if ($json === false) {
            return '';
        } 
        // not sure about \ either...
        return implode("\n", array(
                "/*",
                "--SOURCE--" ,
                wordwrap(str_replace('*/', "*\n/",base64_encode(bzcompress($json))), 80, "\n", true) ,
                "*/",
                ""
            ));
                  
        
    }
         
    
    
    function toJSFile($obj, $json=false)
    {
        
        
        if (empty($obj->{'|module'}) || (!empty($obj->disabled) && strlen($obj->disabled) == 1)) {
           return '';
        }
        if ($obj->items[0]->xtype != 'LayoutDialog') {
           return $this->toJSFileLayout($obj,$json);
        }
        return $this->toJSFileDialog($obj,$json);
        
    }
    
    
    
    
    
    
    
    
    /**
     * simple js dumper..
     * 
     * 
     */
    function toJSObj($obj, $in)
    {
        
        $out =  '';
        $ix = str_repeat("    ", $in);
        $ix1 = str_repeat("    ", $in-1);
        foreach((array)$obj as $k=>$v) {
            if ($k[0] == '+') {
                continue;
            }
            if (is_object($v)) {
                $as_ar = (array)$v;
                if (empty($as_ar)) {
                    continue;
                }
            }
            $out .= strlen($out) ? ",\n" : '';
            switch(true) {
                case is_object($v):
                  
                    $out .= $ix . "$k : " . $this->toJSObj($v, $in+1);
                    continue;
                
                case is_array($v):
                    $out .= $ix . "$k : " . $this->toJSAr($v, $in+1);
                    continue;
            
                case is_string($v) && ($k[0] == '|'):
                    $out .= $ix . substr($k,1). ": " . implode("\n" . $ix, explode("\n", $v));
                    continue;
           
                default :
                    $out .= $ix . "$k : " . $this->toJSPrim($v, isset($obj->xtype) ? $obj->xtype : '', $k);
                    continue;
            }
             
            // property is string/bool/num... 
            // strings can be '|' raw...
            
            
        }
        return  "{\n" . $out . "\n" . $ix1 . "}";
        
    }
    function toJSPrim($v, $xtype, $k)
    {
        if (is_bool($v)) {
            return  ($v ? 'true' : 'false');
        }
        if (is_numeric($v)) {
            return $v;    
        }
        if (!is_string($v)) {
            return  "'??? not string? " . gettype($v) ."'";
        }
        return $this->toString($xtype, $k, $v);
        
        //return json_encode($v);
    }
    
    function toJSAr($ar, $in)
    {
        $isobjar = false;
        foreach($ar as $o) {
            if (!is_object($o) && !is_array($o)) {
                continue;
            }
            $isobjar = true;
        }
        if (!$isobjar) {
            $xa = array();
            foreach($ar as $o) {
                $xa = $this->toJSPrim($o);
            }
            return '['. implode(", ", $xa) .']';
        }
        // array of parts...
        $out =  '';
        $ix = str_repeat("    ", $in);
        foreach($ar as $v) {
            $out .= strlen($out) ? ",\n" : '';
            switch(true) {
                case is_object($v):
                    $out .= $ix . $this->toJSObj($v, $in+1);
                    continue;
                
                case is_array($v):
                    $out .= $ix .  $this->toJSAr($v, $in+1);
                    continue;
            
               // case is_string($v) && ($k[0] == '|'): // can not have raw in an array?
               //     $out .= $ix . . $v;
                //    continue;
           
                default :
                    $out .=  $this->toJSPrim($v); // we can not fix these...!!!!
                    continue;
            }
             
        }
        return "[\n" . $out . "\n" . str_repeat("    ", $in-1) . "]";
        
    }
    
    function toString($xtype, $prop, $str)
    {
             
        
        if (in_array($prop , array(
            'fieldLabel',
            'qtip',
            'emptyText',
            'loadingText',
            'title',
            'legend',
            'text',
            'displayMsg',
            'emptyMsg',
            
            
        ))) {
            return json_encode($str);
        }
        $str = json_encode($str);
        $str= substr($str,1,-1);
        return "'". str_replace("'", "\\'", $str) . "'";
        
        
    }
}