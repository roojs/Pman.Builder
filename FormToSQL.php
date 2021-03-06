<?php

// quick way to build SQL based on a form design..
// might have uses later...

require_once 'Pman.php';

class Pman_Builder_FormToSQL extends Pman {
    
    function getAuth(){
        if (!HTML_FlexyFramework::get()->cli) {
            die("not cli");
        }
        return true;
    }
    
    function get()
    {
        //print_R($_SERVER['argv']);exit;
        $file  = $_SERVER['argv'][2];
        if (!file_exists($file)) {
            die("file $file does not exist");
           }
        $o = json_decode(file_get_contents($file));
        $this->walk($o);
        //print_R($this->cols);
        
        $b = explode('.', basename($file));
        array_pop($b);
        $tn = strtolower(preg_replace('/([A-Z])/','_$1', array_pop($b)));
        $tn = preg_replace('/^_+/', '', $tn);
        if (!empty($_SERVER['argv'][3])) {
            $tn= $_SERVER['argv'][3];
        }
        
        
        $this->toSQL($tn);
        $b= basename(dirname($file));
        
        $do = $this->toDO($b, $tn);
        
        $dofile = dirname($file).'/DataObjects/'. ucfirst($tn).'.php';
        if (!file_exists($dofile)) {
            echo "WRITING  $dofile\n";
            file_put_contents($dofile, $do);
        } else {
            // should support AUTOCODE...
            echo "DELETE $dofile IF YOU WANT TO RECREATED IT..\n";
        }
        
        die("DONE");
    }
    
    function walk($o) 
    {
        $this->flattenProps($o);
        $this->parse($o);
        
        
        foreach((array)$o as $k=>$v) {
            if (is_array($v)) {
                foreach($v as $oo) {
                    $this->walk($oo);
                }
                
                continue;
            }
            if (is_object($v)) {
                $this->walk($v);
                continue;
            }
        }
        
    }
    
    function flattenProps($o) {
        if (empty($o->items)) {
            return;
        }
        $items = array();
        foreach($o->items as $oo) {
            if (!isset($oo->{'*prop'})) {
                $items[] = $oo;
                continue;
            }
            $this->flattenProps($oo);
            $o->{$oo->{'*prop'}} = $oo;
            
        }
        $o->items = $items;
    }
    
    function parse($o) 
    {
        require_once 'Services/JSON.php';
        $s = new Services_JSON();
        if (empty($o->xtype) || empty($o->{'|xns'})) {
            return;
        }
        if ($o->{'|xns'} != 'Roo.form') {
            return;
        }
        $f = new StdClass;
        switch ($o->xtype) {
            case 'TextField':
                $f->name = $o->name;
                $f->type = 'VARCHAR';
                $f->default = "''";
                 $f->extra = "NOT NULL";
                $f->size = min(255,max(8, pow(2, strlen(decbin(($o->width/2)-1)))));
                $this->cols[] = $f;
                break;
            
            case 'ComboBox':
              //  print_r($o);exit;
                if ($o->store->xtype == 'SimpleStore') {
                    //print_R($o);exit;
                    
                    $data = $s->decode($o->store->{'|data'}); 
                    
                    $type = 'INT';
                    $len = 0;
                    foreach($data as $row) {
                        if (is_numeric($row[0])) {
                            continue;
                        }
                        $type = 'VARCHAR';
                        $len = strlen($row[0]);
                          
                    }
                    if ($type == 'VARCHAR') {
                        $len = min(255,max(8, pow(2, strlen(decbin(($len))))));
                        $f->default = "''";
                    } else {
                        $len = 11;
                        $f->default = 0;
                    }
                    $f->name = $o->name; // hiddenname?
                    $f->type = $type;
                    $f->size = $len;
                    $this->cols[] = $f;
                    continue;
                }
                // otherwise it's a datasource based one...
                // our 18N fields are a bit odd here...
                if (preg_match('/i18n/i', $o->store->proxy->{'|url'})) {
                    $f->name = isset($o->hiddenName) ? $o->hiddenName : $o->name; 
                    $f->type = 'VARCHAR';
                    $f->size = 8;
                    $f->default = "''";
                    $this->cols[] = $f;
                    continue;
                }
                $f->name = isset($o->hiddenName) ? $o->hiddenName : $o->name; 
                $f->type = 'INT';
                $f->size = 11;
                $f->extra = "NOT NULL";
                $f->default = 0;
                $this->cols[] = $f;
                continue;
            
            case 'TextArea':
                $f->name = $o->name;
                $f->type = 'TEXT';
                
                $this->cols[] = $f;
                continue;
            
            case 'DateField':
            case 'NumberField':
                echo 'FIXME';
                print_r($o);exit;
                
            
            case 'Hidden':
                $f->name = $o->name;
                $f->type = 'INT';
                $f->size = 11;
                if ($o->name == 'id') {
                    $f->extra = "NOT NULL AUTO_INCREMENT ";
                    $this->primary_key = $o->name;
                } else {
                    $f->default = 0;
                }
                
                array_unshift($this->cols, $f); 
                break;
            default:
                continue;
            
        }
         
        
    }
    function toSQL($tn)
    {
        
        $out = "CREATE TABLE  $tn (\n";
        
        foreach($this->cols as $i=> $f) {
            $out .= $i ? ",\n"  : "";
            
            $row = '';
            $sz = $f->type ;
            if (!empty($f->size)) {
                $sz .= "(". $f->size.")";
            }
            $row .= "    ".str_pad($sz, 20);
            if (!empty($f->extra)) {
                $row .= ' ' . $f->extra;
            }
            if (isset($f->default)) {
                $row .= " DEFAULT ". $f->default;
            }
            $this->cols[$i]->def = $row;
            $out.=  "    ".str_pad($f->name, 30) . $row;
        }
        if ($this->primary_key) {
            $out .= ",\n    PRIMARY KEY (". $this->primary_key . ")";
        }
        
        $out .= "\n);";
        echo $out;
    }
    
    function toDO($b,$tn)
    {
        $utn = ucfirst($tn);
        $out = '<?php
/**
 * Table Definition for builder
 */
require_once \'DB/DataObject.php\';

';
        $out.="class Pman_{$b}_DataObjects_$utn extends DB_DataObject 
{
    ###START_AUTOCODE
    /* the code below is auto generated do not remove the above tag */

    public \$__table = '$tn';                         // table name
";
        foreach($this->cols as $f) {
            $out .= '    public $' . str_pad($f->name.';',30 ). '// ' . $f->def . "\n";
                
       }
       $out.="
    
    /* the code above is auto generated do not remove the tag below */
    ###END_AUTOCODE
        
        
}";
        echo "\n\n";
        echo $out;
         echo "\n\n";
         return $out;
    }
}