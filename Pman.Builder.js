/**
 *
 *
 * Core utils for builder..
 *
 */





Pman.Builder = {
 
    typemap : {
        'bool' : 'boolean',
        
        'date' : 'date',
        'datetime' : 'date',
        'time' : 'string', //bogus
        
        'int' : 'int',
        'int4' : 'int',
        'bigint' : 'int',
        'tinyint' : 'int',
        'smallint' : 'int',
        'timestamp' : 'number',
        
        'double' : 'float',
        'decimal' : 'float',
        'float' : 'float',
        
        'char' : 'string',
        'varchar' : 'string',
        'text' : 'string',
        'longtext' : 'string',
        'tinytext' : 'string',
        'mediumtext' : 'string',
        'enum' : 'string',
        
        'blob' : 'string'
    },
    /**
     * auto builders..
     * @param {Object} cfg the configuration
     * @param {Object} old the previous def...
     *  - table
     *  - cols_ex : [ name, name]
     *  - cols : [ 
     *      { column : name
     *        ctype : ctype,
     *        desc : desc
     *      }
     *   ]
     * 
     */
 
    save : function(cb, sid) 
    {
       // first see if first element has a name.. - we can not save otherwise..
        var t = Pman.Tab.BuilderTree.tree;
        if (!t.root.elConfig.name.length) {
            Roo.MessageBox.alert("Error", "No name set for form");
            return;
        }
     
        sid = (typeof(sid) == 'undefined') ? 
             (Pman.Tab.BuilderTop.filesel.lastData ? Pman.Tab.BuilderTop.filesel.lastData.id : 0) : sid;
        

        var js = Pman.Builder.Tree.toJS();
        var render = new Pman.Builder.JsRender(js); 
         
        // console.log(js);
        // console.log(json);
        
        // check the select box to see if that has been set... - save it with that id..
        
        //var _this = this;
        
        Pman.request({
            url: baseURL + '/Roo/Builder_part.php',
            method : 'POST',
            params : {
                json : Roo.encode(js, null, 4),
                jsource : render.toSource(),
                name :   js.name,
                module_id : Pman.Tab.BuilderTop.modsel.getValue(),
                id : sid
            }, 
            success : function(data) {
                // set the fileSel!!
                console.log(data);
                if (data) {
                    Pman.Tab.BuilderTop.filesel.setFromData(data);
                    
                }
                data.jsource = render.toSource();
                data.json = Roo.encode(js, null, 4);
                
                if (data && cb) {
                     cb.call(Pman.Tab.BuilderTop,data);
                    // ??? _this.postCode(data);
                }

            }
        });
}
 
    
}