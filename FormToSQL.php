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
        print_R($this->cols);
        die("DONE");
    }
    
    function walk($o) 
    {
        
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
    function parse($o) 
    {
        
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
                $f->size = min(255,max(8, pow(2, strlen(decbin(($o->width/2)-1)))));
                $this->cols[] = $f;
                break;
             case 'Hidden':
                $f->name = $o->name;
                $f->type = 'INT';
                
                $f->size = 11
                if ($o->name == 'id') {
                    $f->extra = "AUTO_INCREMENT PRIMARY KEY",
                }
                $this->cols[] = $f;
                break;
            default:
                continue;
            
        }
        
        
        
        
    }
    
}