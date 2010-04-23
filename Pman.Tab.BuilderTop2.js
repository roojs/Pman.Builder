//<script type="text/javascript">
//
// Version 20100322-153655
//
// Auto generated file - do not edit directly
// created by Application Builder (Web version)



// register the module first
Pman.on('beforeload', function()
{
    var disabled = false;
    if (disabled) {
        return; 
    }
    Pman.register({
        modKey : '444-pman_tab_buildertop2',
        module : Pman.Tab.BuilderTop2,
        region : 'north',
        parent : Pman.Tab.Builder,
        name : "Builder - Top Toolbar"
    });
});
Pman.Tab.BuilderTop2 = new Roo.util.Observable({

    panel : false,
    disabled : false,
    parentLayout:  false,

    add : function(parentLayout, region)
    {

        var _this = this;
        this.parentLayout = parentLayout;

        this.panel = parentLayout.addxtype({
            xtype : 'ContentPanel',
            background : true,
            fitToFrame : true,
            region : 'north',
            listeners : {
                activate: function (_self)
                {
                   this.panel=_self;
                }
            },
            toolbar : {
                xtype : 'Toolbar',
                items : [
                    {
                        xtype : 'Button',
                        xns: Roo.Toolbar,
                        text : "Module:",
                        menu : [
                            {
                                xtype : 'Item',
                                xns: Roo.menu,
                                text : "Create  Module",
                                listeners : {
                                    click: function (_self, e)
                                    {
                                       Pman.Dialog.BuilderAppEdit.show({
                                               id : 0
                                           },function(data) {
                                               if (data) {
                                                  _this.modsel.setFromData(data);
                                               }
                                           });
                                    }
                                },
                                icon:  Ext.rootURL + 'images/default/dd/drop-add.gif'
                            },
                            {
                                xtype : 'Item',
                                xns: Roo.menu,
                                text : "Edit Module",
                                listeners : {
                                    click: function (_self, e)
                                    {
                                     if (!_this.modsel.lastData || !_this.modsel.lastData.id) {
                                             Roo.MessageBox.alert("Error", "Select Module");
                                              return false;
                                      }
                                      Pman.Dialog.BuilderAppEdit.show( _this.modsel.lastData ,function(data) {
                                            if (data) {
                                                     _this.modsel.setFromData(data);
                                              }
                                          });
                                    }
                                }
                            },
                            {
                                xtype : 'Item',
                                xns: Roo.menu,
                                text : "Delete Module",
                                listeners : {
                                    click: function (_self, e)
                                    {
                                    ;
                                        Pman.request({
                                              url : baseURL + '/Roo/Builder_app.php',
                                              params : { 
                                                  _delete :    _this.modsel.getValue(),
                                             },
                                             method : 'GET',
                                            success : function() {
                                                _this.filesel.reset();
                                                _this.filesel.fireEvent('select', false);
                                          }
                                         });
                                        
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'ComboBox',
                        xns: Roo.form,
                        listeners : {
                            select: function (combo, record, index)
                            {
                             _this.filesel.reset();
                                                         _this.filesel.fireEvent('select', false);
                            },
                            collapse: function (combo)
                            {
                             this.lastQuery = '~~~~~~~~'; // force a query!
                            },
                            render: function (_self)
                            {
                            _this.modsel = this;
                            }
                        },
                        selectOnFocus : true,
                        width : 100,
                        editable : false,
                        displayField : 'app',
                        valueField : 'id',
                        typeAhead : false,
                        forceSelection : true,
                        triggerAction : 'all',
                        tpl : '<div class=\"x-grid-cell-text x-btn button\"><b>{app}<\/b> <\/div>',
                        loadingText : "Searching....",
                        listWidth : 300,
                        pageSize : 25,
                        store : {
                            xtype : 'Store',
                            xns: Roo.data,
                            remoteSort : true,
                            sortInfo:  { field : 'app' , direction : 'ASC' },
                            reader: Pman.Readers.Builder_app,
                            proxy : {
                                xtype : 'HttpProxy',
                                url: baseURL + '/Roo/Builder_app.php',
                                method : 'GET'
                            }
                        }
                    },
                    {
                        xtype : 'Button',
                        xns: Roo.Toolbar,
                        text : "Component:",
                        menu : [
                            {
                                xtype : 'Item',
                                xns: Roo.menu,
                                text : "New  Component",
                                listeners : {
                                    click: function (_self, e)
                                    {
                                        if (!_this.modsel.lastData || !_this.modsel.lastData.id) {
                                            Roo.MessageBox.alert("Error", "Select Application");
                                            return false;
                                        }
                                                                        
                                        _this.filesel.setFromData({
                                            id : 0,
                                            name : ''
                                        });
                                        Pman.Tab.BuilderTree.clearAll();
                                        Pman.Tab.BuilderTree.tree.root.elConfig.app = _this.modsel.lastData.app;
                                        Pman.Tab.BuilderTree.setCurrentNode(Pman.Tab.BuilderTree.tree.root,true);
                                                                        
                                        var bp = Pman.Tab.BuilderPanel;
                                        bp.redraw.defer(100,bp,[true]);
                                    }
                                },
                                icon:  Ext.rootURL + 'images/default/dd/drop-add.gif'
                            },
                            {
                                xtype : 'Item',
                                xns: Roo.menu,
                                text : "Delete Component",
                                icon: rootURL + '/Pman/templates/images/trash.gif'
                            }
                        ]
                    },
                    {
                        xtype : 'ComboBox',
                        xns: Roo.form,
                        listeners : {
                            select: function(cb, rec, ix) {
                                 var bt = Pman.Tab.BuilderTree;
                                                        if (!rec) {
                                                            bt.clearAll();
                                                            bt.setCurrentNode(bt.tree.root,true);
                                                            var bp = Pman.Tab.BuilderPanel;
                                                            bp.redraw.defer(100,bp,[true]);
                                                            return;
                                                        }
                                                        
                                                        bt.loadJSON.defer(10, bt, [rec.data.json]);
                                },
                            collapse: function (combo)
                            {
                             this.lastQuery = '~~~~~~~~'; // force a query!
                            },
                            render: function (_self)
                            {
                            _this.filesel = this;
                            }
                        },
                        selectOnFocus : true,
                        width : 200,
                        editable : false,
                        displayField : 'name',
                        valueField : 'id',
                        typeAhead : false,
                        forceSelection : true,
                        triggerAction : 'all',
                        tpl : '<div class=\"x-grid-cell-text x-btn button\"> <B>[{module}]<\/B> {name} <\/div>',
                        loadingText : "Searching....",
                        listWidth : 400,
                        pageSize : 25,
                        store : {
                            xtype : 'Store',
                            xns: Roo.data,
                            listeners : {
                                beforeload: function (_self, o)
                                {
                                 o.params = o.params || {}; 
                                                                o.params.btype = 'FORM';
                                                                if (!_this.modsel.lastData || !_this.modsel.lastData.id) {
                                                                    Roo.MessageBox.alert("Error", "Select Application");
                                                                    return false;
                                                                }
                                                                o.params.app = _this.modsel.lastData.app;
                                }
                            },
                            remoteSort : true,
                            sortInfo:  { field : 'app' , direction : 'ASC' },
                            reader: Pman.Readers.Builder,
                            proxy : {
                                xtype : 'HttpProxy',
                                url: baseURL + '/Roo/Builder.php',
                                method : 'GET'
                            }
                        }
                    },
                    {
                        xtype : 'SplitButton',
                        xns: Roo.Toolbar,
                        text : "Save",
                        listeners : {
                            render: function (_self)
                            {
                              _this.saveBtn = _self;
                            },
                            click: function (_self, e, afterclick)
                            {
                            
                                var t = Pman.Tab.BuilderTree.tree;
                                if (!t.root.elConfig.name.length) {
                                        Roo.MessageBox.alert("Error", "No name set for form");
                                        return;
                                }
                                var sid =  _this.filesel.lastData ? _this.filesel.lastData.id : 0;
                                var js = Pman.Tab.BuilderTree.toJS();
                                var json = Roo.encode(js);
                                   
                                    
                                   
                                var postCode = function(data)
                                {
                                    // this needs more thought..
                                   // Pman.
                                    if ((data.app.length < 2) || (data.code.length < 50)) {
                                       _this.statusBtn.setText("Data to short");
                                        return;
                                    }
                                    
                                    if (!_this.modsel.lastData || !_this.modsel.lastData.davwrite || !_this.modsel.lastData.davurl.length) {
                                         _this.statusBtn.setText("Dav Off / Not set");
                                        return;
                                    }
                                    var durl = _this.modsel.lastData.davurl.replace(/\/$/, '');
                                     _this.statusBtn.setText("Saving to DAV");
                                    Pman.request({
                                        url: durl + '/' + data.module + '.js',
                                        method : 'PUT',
                                        params: data.code,
                                        success : function(data) {
                                           // console.log('put data');
                                         _this.statusBtn.setText("Saved to DAV");
                                        }, 
                                        failure : function(resp, o) {
                                            if (resp.status == 204) {
                                             _this.statusBtn.setText("Saved to DAV");
                                                return true; // saved - updated
                                            }
                                             if (resp.status == 201) {
                                             _this.statusBtn.setText("Saved to DAV");
                                                return true; // saved - new
                                            }
                                             _this.statusBtn.setText("Dav Error - see console");
                                            console.log(resp);
                                            console.log(o);
                                            //return true; // we handle it!!!
                                        }
                                    });
                                    
                                };
                            
                                
                               _this.statusBtn.setText("Saving");
                                
                                 Pman.request({
                                        url: baseURL + '/Roo/Builder.php',
                                        method : 'POST',
                                        params : {
                                            json : json,
                                            name : t.root.elConfig.name,
                                            module : t.root.elConfig['|module'],
                                            app : t.root.elConfig.app,
                                            btype : 'FORM',
                                            id : sid,
                                            giturl : _this.modsel.lastData.giturl
                                        }, 
                                        success : function(data) {
                                            // set the fileSel!!
                                            console.log(data);
                                            if (data) {
                                                _this.filesel.setFromData(data);
                                                if (afterclick) {
                                                    // shows view code if nec.
                                                    afterclick.call(_this,data);
                                                    
                                                }
                                                postCode(data);
                                            }
                                            
                                        }
                                        
                                    });
                            
                            
                                
                                
                            }
                        },
                        cls : 'x-btn-text-icon',
                        icon: rootURL + '/Pman/templates/images/save.gif',
                        menu : [
                            {
                                xtype : 'Item',
                                xns: Roo.menu,
                                text : "Save a Copy",
                                listeners : {
                                    click: function (_self, e)
                                    {
                                       Pman.Dialog.BuilderSaveAs.show({
                                           id : 0,
                                           app: _this.filesel.lastData.app
                                       });
                                           
                                    }
                                },
                                icon: rootURL + '/Pman/templates/images/save.gif'
                            }
                        ]
                    },
                    {
                        xtype : 'Button',
                        xns: Roo.Toolbar,
                        text : "View Javascript",
                        listeners : {
                            click: function (_self, e)
                            {
                            
                                _this.saveBtn.fireEvent('click', _this.saveBtn, e, function()
                                {
                                    Pman.Dialog.BuilderViewCode.show( {
                                       id: _this.filesel.getValue()
                                    });
                                    
                                });
                            }
                        },
                        icon: Roo.rootURL + 'images/default/tree/leaf.gif',
                        cls : 'x-btn-text-icon'
                    },
                    {
                        xtype : 'SplitButton',
                        xns: Roo.Toolbar,
                        text : "Redraw",
                        listeners : {
                            click: function (_self, e)
                            {
                             var bp = Pman.Tab.BuilderPanel;
                                                        bp.redraw.defer(100,bp,[true]);
                            
                            },
                            render: function (_self)
                            {
                                _this.redrawBtn = _self;
                                _this.redrawBtn.auto = 1;
                            
                            }
                        },
                        icon: rootURL + '/Pman/templates/images/refresh.gif',
                        cls : 'x-btn-text-icon',
                        menu : [
                            {
                                xtype : 'Item',
                                xns: Roo.menu,
                                text : "Auto Redraw - OFF",
                                listeners : {
                                    click: function (_self, e)
                                    {
                                       _this.redrawBtn.setText("Redraw (AUTO OFF)");
                                                                            _this.redrawBtn.auto = 0
                                    }
                                }
                            },
                            {
                                xtype : 'Item',
                                xns: Roo.menu,
                                text : "Auto Redraw - ON",
                                listeners : {
                                    click: function (_self, e)
                                    {
                                      
                                          _this.redrawBtn.setText("Redraw");
                                                                            _this.redrawBtn.auto = 1;
                                                                            var bp = Pman.Tab.BuilderPanel;
                                                                            bp.redraw.defer(100,bp,[true]);
                                    
                                        
                                       
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'Button',
                        xns: Roo.Toolbar,
                        text : "Status",
                        listeners : {
                            render: function (_self)
                            {
                              _this.statusBtn = _self;
                            }
                        },
                        disabled : true
                    }
                ]
            }
        });
    }
});
/*
--SOURCE--
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
i1a22TKgPxFwn/xdyRThQkBC4AnI
*/
