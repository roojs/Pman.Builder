/**
 *
 *
 * Core utils for builder..
 *
 */





Pman.Builder = {
 
 
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
 
    'Roo.GridPanel' : function(cfg)
    {
        
        var _t = this;
        var jreader = _t['Roo.data.Reader'](cfg);
        
        var colmodel = []
        Roo.each(cfg.cols, function(cc) {
            colmodel.push( _t['Roo.grid.ColumnModel'](cc) );
        })
        
       return {
            '|xns' : 'Roo',
            xtype : "GridPanel",
            "title": cfg.table,
            "fitToframe": true,
            "fitContainer": true,
            "tableName": cfg.table,
            "background": true,
            "region" : 'center',
            "listeners": {
                "|activate": "function() {\n    _this.panel = this;\n    if (_this.grid) {\n        _this.grid.footer.onClick('first');\n    }\n}"
            },
            "items": [
                {
                    "*prop": "grid",
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
                        {
                            "*prop": "dataSource",
                            "xtype": "Store",
                             remoteSort : true,
                            '|sortInfo' : "{ field : '" +  cfg.cols_ex[0]  +  "', direction: 'ASC' }", 
                            "|xns": "Roo.data",
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
                        },
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
                }
            ]
            
            
        };
    },
    
    'Roo.data.Reader' : function(cfg)
    {
        // simple version to start with..
        
        var fields = [];
        
        
        var map = {
            'date' : 'date',
            'datetime' : 'date',
            'time' : 'string', //bogus
            'int' : 'int',
            'bigint' : 'int',
            'double' : 'float',
            'tinyint' : 'int',
            'smallint' : 'int',
            'decimal' : 'float',
            'float' : 'float',
            'char' : 'string',
            'varchar' : 'string',
            'text' : 'string',
            'longtext' : 'string',
            'tinytext' : 'string',
            'mediumtext' : 'string',
            'enum' : 'string',
            'timestamp' : 'number',
            'blob' : 'text'
        };

         
        Roo.each(cfg.cols, function(cc) {
            if (cc.ctype == 'string' ) {
                fields.push(cc.column);
                return;
            }
            fields.push({ name : cc.column, type : cc.ctype} );
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
    
    
  
    'Roo.grid.ColumnModel' : function(rcfg)
    {
        // simple version to start with..
        
       
        return {
            "xtype": "ColumnModel",
            "header": rcfg.desc.length ? rcfg.desc : rcfg.column,
            "width":  rcfg.ctype == 'string' ? 200 : 75,
            "dataIndex": rcfg.column,
            "|renderer": rcfg.ctype != 'date' ? 
                    "function(v) { return String.format('{0}', v); }" :
                    "function(v) { return String.format('{0}', v ? v.format('d/M/Y') : ''); }" , // special for date
            "|xns": "Roo.grid",
            "*prop": "colModel[]"
        };
    }
 
    
}