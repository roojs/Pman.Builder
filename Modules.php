<?php

class Pman_Builder_Modules extends Pman
{
  
    // getAuth - everyone allowed in...
    function getAuth() {
        if (!$this->hasPerm('Builder.Builder', 'S')) {
            $this->jerr("Permission denied");
        }
        
        
    }
    
    function get()
    {
        // should just list the modules..
        
        
    }
  
