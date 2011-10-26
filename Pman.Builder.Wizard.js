/**
 * Code for wizards
 *
 * properties are
 * [Roo.grid.grid] << convert a cfg into a table.
 * [Roo.grid.grid-edit] << create a config from a tree.
 *
 *
 * My initial idea was to parse the existing nodes, to generate the cfg.
 * -- this is far too complicated..
 * -- let's go back to the idea of storing the config on the relivant nodes.
 * -- 
 * 
 *
 */


Pman.Builder.Wizard = {
 
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
     * // usage:
      - gen config - prior to editing
        -- builds up 'cfg'
     * 
     */
   'Roo.GridPanel' : function(cfg, old)
    {
        
         
        var gi = _t['Roo.grid.Grid'](cfg);
        gi['*prop'] = 'grid';
        
        return {
            '|xns' : 'Roo',
            xtype : "GridPanel",
            '.buildercfg' : Roo.encode(cfg),
            "title": cfg.table,
            "fitToframe": true,
            "fitContainer": true,
            "tableName": cfg.table,
            "background": true,
            "region" : 'center',
            "listeners": {
                "|activate": "function() {\n    _this.panel = this;\n    if (_this.grid) {\n        _this.grid.footer.onClick('first');\n    }\n}"
            },
            "items": [ gi ]
            
        };
    },
    
    'Roo.grid.Grid' : function(cfg, old)
    {
   
        var _t = this;
        old = old || false;
        
        if (old !== false) {
            cfg.cols_ex = [ old.autoExpandColumn ];
            cfg.cols = [];
            var old_cols = [];
            var old_items = [];
            Roo.each(old.items, function(cc) {
                var xt = Pman.Builder.Tree.nodeXtype(cc);
                switch(xt) {
                    case 'Roo.grid.ColumnModel':
                        var ncfg = {};
                        _t['Roo.grid.ColumnModel'](ncfg, cc, true);
                        old_cols.push(cc);
                        cfg.cols.push(cfg);
                        return;
                    
                    case 'Roo.data.Store':
                        _t['Roo.data.Store'](cfg, cc, true);
                        return;
                    
                    default:
                        old_items.push(cc);
                        
                }
            });
            
            if (parse_only) { 
                return false;
            }
        
        
        }
        
        
        
        var colmodel = []
        Roo.each(cfg.cols, function(cc) {
            colmodel.push( _t['Roo.grid.ColumnModel'](cc) );
        })
        
        var dataSource = _t['Roo.data.Store'](cfg);
        dataSource['*prop'] = 'dataSource';
        
        return  {
            "xtype": "Grid",
            "autoExpandColumn": cfg.cols_ex[0],
            "loadMask": true,
            "listeners": {
                "|render": "function() \n" +
                    "{\n" +
                    "    _this.grid = this; \n" +
                    "    //_this.dialog = Pman.Dialog.FILL_IN\n" +
                    "    if (_this.panel.active) {\n" +
                    "       this.footer.onClick('first');\n" +
                    "    }\n" +
                    "}",
                "|rowdblclick": "function (_self, rowIndex, e)\n" + 
                    "{\n" + 
                    "    if (!_this.dialog) return;\n" + 
                    "    _this.dialog.show( this.getDataSource().getAt(rowIndex), function() {\n" + 
                    "        _this.grid.footer.onClick('first');\n" + 
                    "    }); \n" + 
                    "}\n"
            },
            "|xns": "Roo.grid",

            "items": [
                dataSource,
                {
                    "*prop": "footer",
                    "xtype": "PagingToolbar",
                    "pageSize": 25,
                    "displayInfo": true,
                    "displayMsg": "Displaying " + cfg.table + "{0} - {1} of {2}",
                    "emptyMsg": "No " + cfg.table + " found",
                    "|xns": "Roo"
                },
                {
                    "*prop": "toolbar",
                    "xtype": "Toolbar",
                    "|xns": "Roo",
                    "items": [
                        {
                            "text": "Add",
                            "xtype": "Button",
                            "cls": "x-btn-text-icon",
                            "|icon": "Roo.rootURL + 'images/default/dd/drop-add.gif'",
                            "listeners": {
                                "|click": "function()\n"+
                                    "{\n"+
                                    "    if (!_this.dialog) return;\n" +
                                    "    _this.dialog.show( { id : 0 } , function() {\n"+
                                    "        _this.grid.footer.onClick('first');\n"+
                                    "   }); \n"+
                                    "}\n"
                            },
                            "|xns": "Roo.Toolbar"
                        },
                        {
                            "text": "Edit",
                            "xtype": "Button",
                            "cls": "x-btn-text-icon",
                            "|icon": "Roo.rootURL + 'images/default/tree/leaf.gif'",
                            "listeners": {
                                "|click": "function()\n"+
                                    "{\n"+
                                    "    var s = _this.grid.getSelectionModel().getSelections();\n"+
                                    "    if (!s.length || (s.length > 1))  {\n"+
                                    "        Roo.MessageBox.alert(\"Error\", s.length ? \"Select only one Row\" : \"Select a Row\");\n"+
                                    "        return;\n"+
                                    "    }\n"+
                                    "    if (!_this.dialog) return;\n" +
                                    "    _this.dialog.show(s[0].data, function() {\n"+
                                    "        _this.grid.footer.onClick('first');\n"+
                                    "    }); \n"+
                                    "    \n"+
                                    "}\n" 
                                
                            },
                            "|xns": "Roo.Toolbar"
                        },
                        {
                            "text": "Delete",
                            "cls": "x-btn-text-icon",
                            "|icon": "rootURL + '/Pman/templates/images/trash.gif'",
                            "xtype": "Button",
                            "listeners": {
                                "|click": "function()\n"+
                                    "{\n"+
                                    "     Pman.genericDelete(_this, '" + cfg.table + "'); \n"+
                                    "}\n"+
                                    "        "
                            },
                            "|xns": "Roo.Toolbar"
                        }
                    ]
                }, // end toolbar
            ].concat( colmodel)
        };
    },
    
    
    'Roo.data.Store' : function(cfg, old, parse_only)
    {
        var _t = this;
        old = old || false;
        
        if (old !== false) {
            _t['Roo.data.Reader'](cfg, old, true);
             
            if (parse_only) { 
                return false;
            }
        }
        
        
        var jreader = _t['Roo.data.Reader'](cfg);
        return  {
            
            "xtype": "Store",
            "|xns": "Roo.data",             
             remoteSort : true,
            '|sortInfo' : "{ field : '" +  cfg.cols_ex[0]  +  "', direction: 'ASC' }", 
            "items": [
                {
                    "*prop": "proxy",
                    "xtype": "HttpProxy",
                    "method": "GET",
                    "|url": "baseURL + '/Roo/" +cfg.table + ".php'",
                    "|xns": "Roo.data"
                },
                jreader
            ]
        };
    
    },
    
        
    'Roo.data.Reader' : function(cfg)
    {
        // simple version to start with..
        
        
        
       
        var _t = this;
        old = old || false;
        
        if (old !== false) {
            
             
            if (parse_only) { 
                return false;
            }
        }
        
        var fields = [];

        Roo.each(cfg.cols, function(cc) {
            var ty = typeof(_t.typemap[cc.ctype]) == 'undefined' ? 'string' : _t.typemap[cc.ctype];
            if (cc.ctype == 'string' ) {
                fields.push(cc.column);
                return;
            }
            fields.push({ name : cc.column, type : _t.typemap[cc.ctype]} );
        });
        
        
       return { 
        
            '|xns' : 'Roo.data',
            xtype : "JsonReader",
            totalProperty : "total",
            root : "data",
            '*prop' : "reader",
            id : 'id', // maybe no..
         
            '|fields' :  JSON.stringify(fields, null,4).replace(/"/g,"'")
        };
    },
    
    
    
}