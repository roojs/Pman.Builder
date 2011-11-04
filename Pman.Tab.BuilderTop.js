//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        part :  ["Builder","Top"],
        modKey : '001-Pman.Tab.BuilderTop',
        module : Pman.Tab.BuilderTop,
        region : 'center',
        parent : Pman.Tab.BuilderTab,
        name : "Pman.Tab.BuilderTop",
        disabled : false, 
        permname: '' 
    });
});

Pman.Tab.BuilderTop = new Roo.util.Observable({

    panel : false,
    disabled : false,
    parentLayout:  false,

    add : function(parentLayout, region)
    {

        var _this = this;
        this.parentLayout = parentLayout;

        this.panel = parentLayout.addxtype({
            xtype: 'ContentPanel',
            xns: Roo,
            background : true,
            fitToFrame : true,
            region : 'north',
            toolbar : {
                xtype: 'Toolbar',
                xns: Roo,
                items : [
                    {
                        xtype: 'Button',
                        xns: Roo.Toolbar,
                        text : "Manage Modules",
                        menu : {
                            xtype: 'Menu',
                            xns: Roo.menu,
                            items : [
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                            Pman.Dialog.BuilderModule.show({
                                                 id : 0
                                            },function(data) {
                                                if (data) {
                                                   _this.modsel.setFromData(data);
                                                }
                                            });
                                        
                                        }
                                    },
                                    text : "Create",
                                    icon : Roo.rootURL + 'images/default/dd/drop-add.gif'
                                },
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                         
                                            if (!_this.modsel.getValue()) {
                                                Roo.MessageBox.alert("Error", "Select Module");
                                                return false;
                                            }
                                            Pman.Dialog.BuilderModule.show( { id : _this.modsel.getValue() } ,function(data) {
                                                if (data) {
                                                    _this.modsel.setFromData(data);
                                                }
                                            });
                                        
                                        }
                                    },
                                    text : "Edit"
                                },
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                           
                                        
                                        }
                                    },
                                    text : "Delete"
                                },
                                {
                                    xtype: 'Separator',
                                    xns: Roo.menu
                                },
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                            new Pman.Request({
                                                method : 'GET',
                                                url : baseURL + '/Roo/Builder_modules.php',
                                                params : {
                                                    'query[_sync]' : 1
                                                },
                                                success : function() {
                                                    Roo.MessageBox.alert("Done", "Re-syned modules");
                                                }
                                            });
                                        }
                                    },
                                    text : "Sync"
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'ComboBox',
                        xns: Roo.form,
                        listeners : {
                            select : function (combo, record, index)
                            {
                                _this.filesel.reset();
                                _this.filesel.fireEvent('select', false);
                            
                            },
                            render : function (_self)
                            {
                                _this.modsel = this;
                            }
                        },
                        allowBlank : true,
                        alwaysQuery : true,
                        displayField : 'name',
                        editable : false,
                        forceSelection : true,
                        listWidth : 300,
                        loadingText : "Searching...",
                        minChars : 2,
                        pageSize : 40,
                        queryParam : 'query[name]',
                        selectOnFocus : true,
                        tpl : '<div class="x-grid-cell-text x-btn button"><b>{name}</b></div>',
                        triggerAction : 'all',
                        typeAhead : true,
                        valueField : 'id',
                        width : 100,
                        store : {
                            xtype: 'Store',
                            xns: Roo.data,
                            remoteSort : true,
                            sortInfo : { field : 'name' , direction : 'ASC' },
                            proxy : {
                                xtype: 'HttpProxy',
                                xns: Roo.data,
                                method : 'GET',
                                url : baseURL + '/Roo/Builder_modules.php'
                            },
                            reader : {
                                xtype: 'JsonReader',
                                xns: Roo.data,
                                id : 'id',
                                root : 'data',
                                totalProperty : 'total',
                                fields : [
                                 
                                    {
                                        'name': 'name',
                                        'type': 'string'
                                    }
                                    
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'Button',
                        xns: Roo.Toolbar,
                        text : "Manage Parts ",
                        menu : {
                            xtype: 'Menu',
                            xns: Roo.menu,
                            items : [
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                            if (!_this.modsel.getValue()) {
                                                Roo.MessageBox.alert("Error", "Select Module");
                                                return false;
                                            }
                                            
                                            Pman.Dialog.BuilderPart.show( {
                                                     id : 0, 
                                                     module_id: _this.modsel.getValue() 
                                                 } ,
                                                 function(data) {
                                                    _this.filesel.reset();
                                                    if (!data.id) {
                                                        return;
                                                    }
                                                    _this.filesel.setfromdata(data);
                                                    Pman.Builder.Tree.clearAll();
                                                    Pman.Builder.Tree.setCurrentNode(Pman.Tab.BuilderTree.tree.root,true);
                                                     
                                                    Pman.Tab.BuilderPanel.redraw.defer(100,Pman.Tab.BuilderPanel,[true]);
                                            });
                                        
                                        }
                                    },
                                    text : "New Part",
                                    icon : Roo.rootURL + 'images/default/dd/drop-add.gif'
                                },
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                            Roo.MessageBox.confirm("Confirm", "Are you sure you want to delete it?", function(a) {
                                                if (a != 'yes') {
                                                    return;
                                                }
                                                    
                                               
                                               new Pman.Request({
                                                    url : baseURL + '/Roo/Builder_part',
                                                    method : 'POST',
                                                    params : {
                                                        _delete :  _this.filesel.getValue()
                                                    },
                                                    success : function() {
                                                        _this.fileCombo.setValue('');
                                                        // unload stuff..
                                                    
                                                    }
                                               
                                               
                                               });
                                           });
                                        }
                                    },
                                    text : "Delete"
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'ComboBox',
                        xns: Roo.form,
                        listeners : {
                            select : function (combo, rec, index)
                            {
                               //cb.lastData = rec.data;
                                
                                
                                
                                
                                var bt = Pman.Tab.BuilderTree.tree;
                                var pt = Pman.Builder.Tree;
                                
                                if (!rec) {
                                    pt.clearAll();
                                    pt.setCurrentNode(bt.root,true);
                                   // var bv = Pman.Tab.BuilderView;
                                   Pman.Tab.BuilderView.panel.clearAll();
                                   // bv.panel.el.mask("select Module / Part");
                                    return;
                                }
                                //bv.panel.el.unmask();
                                
                                pt.loadBJS(_this.modsel.getValue(), rec.data.id)
                            
                            
                            },
                            render : function (_self)
                            {
                                _this.filesel = this;
                            }
                        },
                        allowBlank : true,
                        alwaysQuery : true,
                        displayField : 'name',
                        editable : false,
                        forceSelection : true,
                        listWidth : 400,
                        loadingText : "Searching...",
                        minChars : 2,
                        pageSize : 40,
                        queryParam : 'query[name]',
                        selectOnFocus : true,
                        tpl : '<div class="x-grid-cell-text x-btn button"><b>{name}</b></div>',
                        triggerAction : 'all',
                        typeAhead : true,
                        valueField : 'id',
                        width : 200,
                        store : {
                            xtype: 'Store',
                            xns: Roo.data,
                            listeners : {
                                beforeload : function (_self, o)
                                {
                                     o.params = o.params || {}; 
                                   // o.params.btype = 'FORM';
                                    if (!_this.modsel.getValue()) {
                                        Roo.MessageBox.alert("Error", "Select Module");
                                        return false;
                                    }
                                    o.params.module_id = _this.modsel.getValue();
                                    o.params._columns = 'id,name';
                                }
                            },
                            remoteSort : true,
                            sortInfo : { field : 'name' , direction : 'ASC' },
                            proxy : {
                                xtype: 'HttpProxy',
                                xns: Roo.data,
                                method : 'GET',
                                url : baseURL + '/Roo/Builder_part.php'
                            },
                            reader : {
                                xtype: 'JsonReader',
                                xns: Roo.data,
                                id : 'id',
                                root : 'data',
                                totalProperty : 'total',
                                fields : [
                                   
                                    {
                                        'name': 'name',
                                        'type': 'string'
                                    } 
                                ]
                            }
                        }
                    },
                    {
                        xtype: 'SplitButton',
                        xns: Roo.Toolbar,
                        listeners : {
                            click : function (_self, e)
                            {
                                Pman.Builder.save();
                            },
                            render : function (_self)
                            {
                               _this.saveBtn = this;
                            }
                        },
                        cls : 'x-btn-text-icon',
                        text : "Save",
                        icon : rootURL + '/Pman/templates/images/save.gif',
                        menu : {
                            xtype: 'Menu',
                            xns: Roo.menu,
                            items : [
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                              Pman.Builder.save(false,0);
                                        }
                                    },
                                    text : "Save a copy as",
                                    icon : rootURL + '/Pman/templates/images/save.gif'
                                },
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                           Pman.Builder.save(
                                             function(data) {
                                             Roo.log("JSON GOT");
                                                  Roo.log(data);
                                                 Pman.Dialog.BuilderViewCode.show(data ); 
                                                    
                                        
                                          } );
                                        }
                                    },
                                    text : "Show JSON"
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'Separator',
                        xns: Roo.Toolbar
                    },
                    {
                        xtype: 'SplitButton',
                        xns: Roo.Toolbar,
                        listeners : {
                            click : function (_self, e)
                            {
                               Pman.Tab.BuilderView.panel.redraw();
                            }
                        },
                        text : "Redraw",
                        menu : {
                            xtype: 'Menu',
                            xns: Roo.menu,
                            items : [
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                         _this.redrawBtn.setText("Redraw (AUTO OFF)");
                                            _this.redrawBtn.auto = 0;
                                        
                                        }
                                    },
                                    text : "Auto redraw - OFF"
                                },
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                         
                                            _this.redrawBtn.setText("Redraw");
                                             _this.redrawBtn.auto = 1;
                                            var bp = Pman.Tab.BuilderPanel;
                                            bp.redraw.defer(100,bp,[true]);
                                            
                                        
                                        }
                                    },
                                    text : "Auto redraw - On"
                                }
                            ]
                        }
                    }
                ]
            }
        });
        this.layout = this.panel.layout;

    }
});
