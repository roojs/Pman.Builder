<?php
/**
 * Table Definition for builder_app
 */
require_once 'DB/DataObject.php';

class Pman_Builder_DataObjects_Builder_modules extends DB_DataObject 
{
    ###START_AUTOCODE
    /* the code below is auto generated do not remove the above tag */

    public $__table = 'builder_modules';                     // table name
    public $id;                              // int(11)  not_null primary_key auto_increment
    public $name;                             // string(64)  not_null
    public $path;                          // string(128)  not_null
    public $public;                        // int(2)  not_null

    
    /* the code above is auto generated do not remove the tag below */
    ###END_AUTOCODE
    // * - beforeDelete() -- return false for fail and set DO->err;

    function beforeDelete()
    {
        return;
        // fixme - check builder components.
        
    }
    
    
    function applyFilters($q, $au)
    {
        if (!empty($q['query']['_sync'])) {
            
            // use the basic builder modules for this project based on configurion.
            // what do we have..
            //DB_DataObject::DebugLevel(1);
            $x = DB_DataObject::factory('builder_modules');
            $modpaths = $x->fetchAll('name', 'path');
            
            $ff = HTML_FlexyFramework::get();
            
            
            foreach($ff->enableArray as $m) {
                if (isset($modpaths[$m])) {
                    continue;
                }
                if (file_exists($ff->baseDir .'/'. $m)) {
                    $x = DB_DataObject::factory('builder_modules');
                    $x->setFrom(array(
                        'name' =>$m,
                        'path' => $ff->baseDir .'/'. $m,
                        'public' => 0,
                    ));
                    $x->insert();
                    
                    
                }
               
                
                
                
            }
             $ff->page->jok("Synced");
            //$mods = $ff->enableArray;
            echo '<PRE>';print_R($ff);exit;
            
            
            
        }
    }
      
    function scanDir() // return name => mtime for files in path..
    {
        $gd = $this->gitDir();
        if (!$gd) {
            return false;
        }
        $working = $this->gitWorking($gd['url']);
        $path = strlen($gd['path']) ? $gd['path'] . '/' : '';
        
        // list of bjs files...
        // or should this be totally database related...
        
        $ret = array();
        foreach(glob($working . '/'. $path .'*.bjs') as $bjs) {
            $js = preg_replace('/\.bjs$/', '.js', $bjs);
            if (!file_exists($js)) {
                continue;
            }
            $n = preg_replace('/\.bjs$/', '', basename($bjs));
            
            $ret[$n] = filemtime( $bjs);
        }
        return $ret;
    }
    /**
     * This updates the contents of a DataObjects with the file contents if they are newer..
     * 
     * 
     */
    function syncParts()
    {
        
        
        $files = $this->scanDir();
        
        $gd = $this->gitDir();
        if (!$gd) {
            return false;
        }
        $working = $this->gitWorking($gd['url']);
        $path = strlen($gd['path']) ? $gd['path'] . '/' : '';
        
        
        $d = DB_DataObject::factory('builder_part');
        $d->module_id = $this->id;
       // DB_DataObject::debugLevel(1);
        $cur = $d->fetchAll();
        foreach($cur  as $d) {
            if (isset($files[$d->name]) && strtotime($d->updated) < $files[$d->name]) {
                //file mtime is greater than db. -- replace!
                $d->json = file_get_contents($working . '/'. $path . $d->name . '.bjs');
                $d->jsource = file_get_contents($working . '/'. $path . $d->name . '.js');
                $d->update();
                // do not need to create it...
                unset($files[$d->name]);
            }
            if (isset($files[$d->name])) {
                unset($files[$d->name]); 
            }
        }
        // we do not delete anything...
        // next create stuff..
        foreach($files as $f=>$mt) {
            $d = DB_DataObject::factory('builder_part');
            $d->name = $f;
            $d->json = file_get_contents($working . '/'. $path . $f . '.bjs');
            $d->jsource = file_get_contents($working . '/'. $path . $f . '.js');
            $d->updated = date('Y-m-d H:i:s', $mt);
            $d->module_id = $this->id;
            $d->insert();
        }
        
        
    }
    /**
     * get the git configuration...
     * @return {Array|false} false if it can not find path..
     */
    function gitDir()
    {
        
        static $paths= array();
        if (isset($paths[$this->path])) {
            return $paths[$this->path]; 
        }
        // using the path determine 
        $path = $this->path;
        
        
        
        //var_dump($path);
        //var_dump(file_exists($path.'/.git'));
        
        while (!file_exists($path.'/.git')) {
            $path = dirname($path);
            //var_dump($path);
            if (empty($path) || $path == '/') {
                return false;
            }
        }
        //$gpath = $path.'/.git';
        
        $sub = substr($this->path, strlen($path) + 1);
        
        require_once 'System.php';
        $git = System::which('git');
        
        @chdir($this->path);
        
        $url = trim(`$git config --get remote.origin.url`);
        
        $ret=  array(
            'url' => $url,
            'path' => $sub
        );
        
        $paths[$this->path] = $ret;
        //var_Dump($ret); //exit;
        return $ret;
        
    }
    
    function gitWorking($url)
    {
        
        
        $pg = HTML_FlexyFramework::get()->page;
        $working = ini_get('session.save_path'). '/' .
                urlencode($pg->authUser->email) . '-' .
                urlencode($url);
        
        require_once 'System.php';
        $git = System::which('git');
        
        
        if (!$this->checkURL($url)) {
            $pg->jerr("netrc authentication not set up for www-data to access  $url");
        }
        // var_dump($working);exit;
        if (file_exists($working)) {
            chdir($working);
            
            `$git pull`;
            return $working;
                
        }
        // might take some time..
        chdir (ini_get('session.save_path'));
        
        $cmd = "$git clone ". escapeshellarg($url) ." " . basename($working);
        
        `$cmd`;
        return $working;
    }
    /**
     * dumb http check to see if we are authenticated..
     */
    function checkURL($u)
    {
        if (!preg_match('#^(http|https):/#i', $u)) {
            //var_dump($u);exit;
            return true;
        }
         $curl = System::which('curl');
         $cmd = "$curl -n -I " . escapeshellarg($u);
        $res = `$cmd`;
        //var_dump($res);exit;
        $lines = explode("\n", $res);
        if (!preg_match('/401/', $lines[0])) {
            return true;
        }
        return false;

    }
    
    function gitCommit($file,$data)
    {
        $gd = $this->gitDir();
        if (!$gd) {
            
            // directory is not git..
            if (empty($this->path)) {
                return false;
            }
            if (!file_exists($this->path)) {
                HTML_FlexyFramework::get()->page->jerr("configured url is not git or writable");
                
            }
            HTML_FlexyFramework::get()->page->jerr("fixme - can write?");
            return false;
        }
        $working = $this->gitWorking($gd['url']);
        chdir($working);
        $path = strlen($gd['path']) ? $gd['path'] . '/' : '';
        $target = $working.'/'.$path . $file;
        $exist = file_exists($target);
        file_put_contents($working.'/'.$path . $file, $data);
        
        require_once 'System.php';
        $git = System::which('git');
       
        chdir($working);
        if (!$exist) {
            $cmd = "$git add {$path}{$file}";
            `$cmd`;
        }
        
        $cmd = "$git commit -m '{$path}{$file} - Commit from online editor' {$path}{$file}";
        `$cmd`;
        `git push`;
        
        
        
    }
    
    function gitCommitDelete($file)
    {
        $gd = $this->gitDir();
        if (!$gd) {
            return false;
        }
        $working = $this->gitWorking($gd['url']);
        
        
        $path = strlen($gd['path']) ? $gd['path'] . '/' : '';
        $target = $working.'/'.$path . $file;
        //var_dump($target);exit;
        if (!file_exists($target)) {
            return; // no need to do anything..
        }
       
        
        require_once 'System.php';
        $git = System::which('git');
        chdir($working);
        
        `$git rm {$path}{$file}`;
        
        $cmd = "$git commit -m '{$path}{$file} - Commit (DELETE) from online editor' ";
        `$cmd`;
        `git push`;
         
    }
    
    
    
}
