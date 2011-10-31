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
 * -- The downside is that if you modify the children, then the wizard will
 *    not know about those columns. etc..
 *    
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
    
        var _t = this;
        old = old || {};

        var gi = _t['Roo.grid.Grid'](cfg);
        gi['*prop'] = 'grid';
        
        return {
            '|xns' : 'Roo',
            xtype : "GridPanel",
            '.builderCfg' : Roo.encode(cfg),
            title : cfg.table,
            fitToframe : true,
            fitContainer : true,
            tableName: cfg.table,
            background: true,
            region : 'center',
            listeners : {
                "|activate": "function() {\n    _this.panel = this;\n    if (_this.grid) {\n        _this.grid.footer.onClick('first');\n    }\n}"
            },
            items: [ gi ]
            
        };
    },
    
    'Roo.grid.Grid' : function(cfg, old)
    {
   
        var _t = this;
        old = old || {};
 
        
        
        var colmodel = []
        Roo.each(cfg.cols, function(cc) {
            colmodel.push( _t['Roo.grid.ColumnModel'](cc) );
        })
        
        var dataSource = _t['Roo.data.Store'](cfg);
        dataSource['*prop'] = 'dataSource';
        
        return  {
            "xtype": "Grid",
            '.builderCfg' :  Roo.encode(cfg),
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
    
    
    'Roo.data.Store' : function(cfg, old)
    {
        var _t = this;
        old = old || false;
      
        
        
        var jreader = _t['Roo.data.JsonReader'](cfg);
        return  {
            
            "xtype": "Store",
            "|xns": "Roo.data",
             '.builderCfg' :  Roo.encode(cfg),
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
    
        
    'Roo.data.JsonReader' : function(cfg, old)
    {
        // simple version to start with..
        
        
        
       
        var _t = this;
        old = old || false;
       
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
            '.builderCfg' :  Roo.encode(cfg),
            '*prop' : "reader",
            id : 'id', // maybe no..
         
            '|fields' :  JSON.stringify(fields, null,4).replace(/"/g,"'")
        };
    },
    
    
    'Roo.grid.ColumnModel' : function(rcfg, old)
    {
        // simple version to start with..
        var ty = typeof(this.typemap[rcfg.ctype]) == 'undefined' ? 'string' : this.typemap[rcfg.ctype];
        
        // some special kludges..
        // remove table prefix..
        
        var desc = rcfg.columnshort;
        if (desc.substring(0, rcfg.table.length+1) == rcfg.table+'_') {
            desc = desc.substring(rcfg.table.length+1);
        }
        desc = desc.replace(/_id$/, '');
        
        if (!desc.length) {
            desc = rcfg.column;
        }
        
        
       
        return {
            "xtype": "ColumnModel",
            '.builderCfg' : Roo.encode(rcfg),
            "header": rcfg.desc.length ? rcfg.desc : desc,
            "width":  ty == 'string' ? 200 : 75,
            "dataIndex": rcfg.column,
            "|renderer": ty != 'date' ? 
                    "function(v) { return String.format('{0}', v); }" :
                    "function(v) { return String.format('{0}', v ? v.format('d/M/Y') : ''); }" , // special for date
            "|xns": "Roo.grid",
            "*prop": "colModel[]"
        };
    },
    
    
     
    'Roo.LayoutDialog' : function(rcfg, old)
    {
        // simple version to start with..
        var _t = this;
        
        var frmCfg =    _t['Roo.form.Form'](cfg, old);
        
        // loop through the cols..
        // we need a 'display column' for each of these.
        // we could also have a 'renderer'...
        
     
        
         
        var formHeight = (frmCfg.items.length * 40) + 40; // work out from number of form ites..
       
        return {
            xtype : 'LayoutDialog',
            "|xns": "Roo.grid",
            '.builderCfg' : Roo.encode(rcfg),
            
            closable : false,
            collapsible: false,
            modal : true,
            height : formHeight,
            resizable: false,
            title: "Edit / Create " + rcfg.table,
            width: 400,
            
            
            items  : [
                {
                    "|xns": "Roo",
                    "xtype": "LayoutRegion",
                    "*prop": "center"
                },
                {
                    "region": "center",
                    "xtype": "ContentPanel",
                    "|xns": "Roo",
                    "items": [
                        frmCfg
                    ]
                },
                 {
                    "listeners": {
                        "click": "function (_self, e)\n{\n    _this.dialog.hide();\n}"
                    },
                    "*prop": "buttons[]",
                    "text": "Cancel",
                    "xtype": "Button",
                    "|xns": "Roo"
                },
                {
                    "listeners": {
                        "click": "function (_self, e)\n{\n    // do some checks?\n     \n    \n    _this.dialog.el.mask(\"Saving\");\n    _this.form.doAction(\"submit\");\n\n}"
                    },
                    "*prop": "buttons[]",
                    "text": "Save",
                    "xtype": "Button",
                    "|xns": "Roo"
                }
            ]
        };
    },
    'Roo.form.Form' : function(rcfg, old)
    {
        // simple version to start with..
        var _t = this;
        
        var formElements = [];
          
        var fcombo = function(cn) {
            var cret = '';
            Roo.each(rcfg.cols_ux, function(n) {
                if (n.substring(0,cn.length) == cn) {
                    cret = n;
                    return true;
                }
                return false;
            });
            return cret;
        }
   
        Roo.each(rcfg.cols, function(cc) {
            
            var ty = typeof(_t.typemap[cc.ctype]) == 'undefined' ? 'string' : _t.typemap[cc.ctype];
            
            if (ty == 'string' ) {
                formElements.push( _t['Roo.form.TextField'](cc, {}));
                return;
            }
            if (ty  == 'date' ) {
                formElements.push( _t['Roo.form.DateField'](cc, {}));
                return;
            }
            if (ty  == 'float' ) {
                formElements.push( _t['Roo.form.NumberField'](cc, {}));
                return;
            }
            if (ty  == 'int' ) {
                cc.display = fcombo(cc.column);
                if (cc.length) { 
                    formElements.push( _t['Roo.form.ComboBox'](cc, {}));
                    return;
                }
                formElements.push( _t['Roo.form.NumberField'](cc, {}));
                return;
            }
            
            
        });
        
        
        
        return {
            xtype : "Form",
            '|xns' : 'Roo.form',
            listeners : {
                "|actioncomplete" : "function(_self,action)\n"+
                    "{\n"+
                    "    if (action.type == 'setdata') {\n"+
                    "       //this.load({ method: 'GET', params: { '_id' : _this.data.id }});\n"+
                    "       return;\n"+
                    "    }\n"+
                    "    if (action.type == 'load') {\n"+
                    "        return;\n"+
                    "    }\n"+
                    "    if (action.type =='submit') {\n"+
                    "    \n"+
                    "        _this.dialog.hide();\n"+
                    "    \n"+
                    "         if (_this.callback) {\n"+
                    "            _this.callback.call(_this, _this.form.getValues());\n"+
                    "         }\n"+
                    "         _this.form.reset();\n"+
                    "         return;\n"+
                    "    }\n"+
                    "}\n",
                
                "|rendered" : "function (form)\n"+
                    "{\n"+
                    "    _this.form= form;\n"+
                    "}\n"
            },
            method : "POST",
            style : "margin:10px;",
            "|url" : "baseURL + '/Roo/" + rcfg.table + ".php'",
            items : formElements
        };
        
    }
    
    
    
    
    
    
}