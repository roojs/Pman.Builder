//<script type="text/javascript">
// tab on left...  

Pman.on('beforeload', function()
{
    return;
    // this is always shown if Clipping module is enabled!!
    //if (!Pman.hasPerm('Admin.Campaigns', 'E')) {
    //    return;
    //}
    Pman.register({
        modKey : '016-pman-tab-buildertop',
        module : Pman.Tab.BuilderTop,
        region : 'north',
        parent : Pman.Tab.Builder,
        name : "Builder Top Bar"
    });
});
 
   

Pman.Tab.BuilderTop = {
    
    panel : false,
    redrawBtn : false,
    
    add : function(parentLayout, region) {
        
         var _this= this;
        if (this.panel) {
            parentLayout.getRegion(region).showPanel(this.panel);
            return;
        }
        
        this.panel = parentLayout.add(region, 
            new Roo.ContentPanel(
                parentLayout.getRegion(region).el.createChild({tag:'div', style: 'margin:0px;'}), 
                {
                //autoCreate : true,
                //toolbar: this.tb,
                    background : true,
                    fitToFrame:true
                  //  title : "Summary"
                }
            )
        ); 
        
     
        
        
        
        
        
        
        
        var tb = new Roo.Toolbar(this.panel.el.createChild({tag:'div', style: 'margin:0px;'}));
        // add a toolbar..
        tb.add( 
                 
                {
                    //cls:'x-btn-text-icon',
                    //icon: rootURL + '/Pman/templates/images/refresh.gif',
                    text    : 'Module:',
                    tooltip : 'Manage Modules',
                    xtype: 'Button',
                    xns : Roo.Toolbar,
                    
                    menu : {
                        items : [
                            {
                                text: 'Create Module',
                                  icon : Ext.rootURL + 'images/default/dd/drop-add.gif',
                                handler : function()
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
                            {
                                text: 'Edit Module',
                                handler : function()
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
                            },
                            {
                                text: 'Delete Module',
                                handler : function()
                                {
                                    
                                }
                            }
                        ]
                    }
                },        
                
                  {
            
                    xtype:  'ComboBox',
                    xns : Roo.form,
                    selectOnFocus:true,
                   
                    allowBlank : true,
                    width: 100,
                    editable: false,
                    
                    store: {
                        xtype : 'Store',
                        
                          // load using HTTP
                        proxy: {
                            xtype: 'HttpProxy',
                            url: baseURL + '/Roo/Builder_app.php',
                            method: 'GET'
                        }, 
                        listeners : {
                            beforeload: function(s, o) {
                                o.params = o.params || {}; 
                              //  o.params.btype = 'FORM';
                              //  o.params['query[apps_only'] = 1;
                                
                            }
                        },
                        reader: Pman.Readers.Builder_app,
                        remoteSort : true,
                        sortInfo : { field : 'app' , direction : 'asc' }
                    },
                    
                    displayField:'app',
                    valueField : 'id',
                    
                    typeAhead: true,
                    forceSelection: true,
                   
                    triggerAction: 'all',
                     
                    tpl: new Roo.Template(
                        '<div class="x-grid-cell-text x-btn button">',
                            '<b>{app}</b> ',
                        '</div>'
                    ),
                     
                    queryParam: 'query[name]',
                    loadingText: "Searching...",
                    listWidth: 100,
                   
                    minChars: 2,
                    pageSize:20,
                    listeners : {
                        select :  function(cb, rec, ix) {
                            //cb.lastData = rec.data;
                          //  var bt = Pman.Tab.BuilderTree;
                          //  bt.loadJSON.defer(10, bt, [rec.data.json]);
                             _this.filesel.reset();
                             _this.filesel.fireEvent('select', false);
                            
                        },
                        collapse : function()
                        {
                            this.lastQuery = '~~~~~~~~'; // force a query!
                        },
                        render : function()
                        {
                            _this.modsel = this;
                        }
                    }
                    //lastData : false 
                
                     
                     
                },
                {
                    //cls:'x-btn-text-icon',
                    //icon: rootURL + '/Pman/templates/images/refresh.gif',
                    text    : 'Component:',
                    tooltip : 'Manage Component',
                    xtype: 'Button',
                    xns : Roo.Toolbar,
                    
                    menu : {
                        items : [
                            {
                                text: 'New Component',
                                  icon : Ext.rootURL + 'images/default/dd/drop-add.gif',
                                handler : function()
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
                                    Pman.Tab.BuilderTree.setCurrentNode(Pman.Tab.BuilderTree.tree.root,true);
                                    
                                    var bp = Pman.Tab.BuilderPanel;
                                    bp.redraw.defer(100,bp,[true]);
                                }
                            },
                            {
                                text: 'Delete Component',
                                handler : function()
                                {
                                    
                                }
                            }
                        ]
                    }
                            
                            
                },
                {
            
                    xtype:  'ComboBox',
                    xns : Roo.form,
                    selectOnFocus:true,
                   
                    allowBlank : true,
                    width: 200,
                    editable: false,
                    
                    store: {
                        xtype : 'Store',
                        
                          // load using HTTP
                        proxy: {
                            xtype: 'HttpProxy',
                            url: baseURL + '/Roo/Builder.php',
                            method: 'GET'
                        }, 
                        listeners : {
                            beforeload: function(s, o) {
                                o.params = o.params || {}; 
                                o.params.btype = 'FORM';
                                if (!_this.modsel.lastData || !_this.modsel.lastData.id) {
                                    Roo.MessageBox.alert("Error", "Select Application");
                                    return false;
                                }
                                o.params.app = _this.modsel.lastData.app;
                            }
                        },
                        reader: Pman.Readers.Builder,
                        remoteSort : true,
                        sortInfo : { field : 'module' , direction : 'asc' }
                    },
                    
                    displayField:'name',
                    valueField : 'id',
                    
                    typeAhead: true,
                    forceSelection: true,
                   
                    triggerAction: 'all',
                     
                    tpl: new Roo.Template(
                        '<div class="x-grid-cell-text x-btn button">',
                            '<B>[{module}]</B> {name}',
                        '</div>'
                    ),
                     
                    queryParam: 'query[name]',
                    loadingText: "Searching...",
                    listWidth: 400,
                   
                    minChars: 2,
                    pageSize:20,
                    listeners : {
                        select :  function(cb, rec, ix) {
                            //cb.lastData = rec.data;
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
                        collapse : function()
                        {
                            this.lastQuery = '~~~~~~~~'; // force a query!
                        },
                        render : function()
                        {
                            _this.filesel = this;
                        }
                    }
                    //lastData : false 
                
                     
                     
                },
                {
                    
                    text : 'Save',
                    cls:'x-btn-text-icon',
                    icon: rootURL + '/Pman/templates/images/save.gif',
                      xtype: 'SplitButton',
                    handler: function() {
                        _this.save();
                    },
                    menu : {
                        items : [
                           {
                    
                                text : 'Save a copy',
                                cls:'x-btn-text-icon',
                                icon: rootURL + '/Pman/templates/images/save.gif',
                                
                                handler: function() {
                                    _this.save(false, 0);
                                }
                            }
                        ]
                    }
                },
               /*
               {
                    text : 'Reset All',
                    iconCls:'icon-reset',
                    scope: this,
                    handler:function() {
                       // Pman.Tab.Builder.markUndo("Reset All");
                       // Pman.Tab.Builder.resetAll();
                    }
                },
                */
                {
                    text:'Show/Edit JSON',
                    cls:'x-btn-text-icon',
                    icon: Ext.rootURL + 'images/default/tree/leaf.gif',
              
                    handler : function()
                    {
                        _this.save(_this.showCode);
                    }
                    //handler:this.editConfig
                },'-',{
                    cls:'x-btn-text-icon',
                    icon: rootURL + '/Pman/templates/images/refresh.gif',
                    text    : 'Redraw',
                    tooltip : 'Apply changes',
                    xtype: 'SplitButton',
                    xns : Roo.Toolbar,
                    listeners : {
                        click : function() {
                            var bp = Pman.Tab.BuilderPanel;
                            bp.redraw.defer(100,bp,[true]);
                        },
                        render : function(btn) {
                            _this.redrawBtn = btn;
                            _this.redrawBtn.auto = 1;
                        }
                    },
                    menu : {
                        items : [
                            {
                                text : "Auto redraw - OFF ",
                                listeners : {
                                    click : function() {
                                        _this.redrawBtn.setText("Redraw (AUTO OFF)");
                                        _this.redrawBtn.auto = 0;
                                    }
                                }
                            },
                            {
                                text : "Auto redraw- On",
                                listeners : {
                                    click : function() {
                                        _this.redrawBtn.setText("Redraw");
                                        _this.redrawBtn.auto = 1;
                                        var bp = Pman.Tab.BuilderPanel;
                                        bp.redraw.defer(100,bp,[true]);
                                        
                                    }
                                }
                            }
                        
                        ]
                    }
                     
                },/* ,{
                    iconCls : 'icon-time',
                    text    : 'Rendering time : <i>unknown</i>',
                  
                    id      : 'FBRenderingTimeBtn',
                    tooltip : 'Click to update form and display rendering time',
                    handler : function() {
                        Pman.Tab.Builder.updateForm(true);
                    }
                },'-',{
                    id      : 'FBUndoBtn',
                    iconCls : 'icon-undo',
                    text    : 'Undo',
                    disabled: true,
                    tooltip : "Undo last change",
                    handler : function() {
                        Pman.Tab.Builder.undo();
                    }
                    
                },*/
                '->',{
                    text    : 'Help',
                    iconCls : 'icon-help',
                    handler : function() {
                        Roo.Msg.alert('Informations',
                            "<i>Author : Christophe Badoit (extjs a t tof2k d o t com)</i><br/>" +
                            'Source : <a href="formbuilder.zip">Zip File</a><br/>' +
                            'Forum Thread <a href="http://extjs.com/forum/showthread.php?t=14702">here</a>.');
                    }
                }
           );
        
            
        
        
    },
    save :  function(cb,sid)
    {
        // first see if first element has a name.. - we can not save otherwise..
        var t = Pman.Tab.BuilderTree.tree;
        if (!t.root.elConfig.name.length) {
            Roo.MessageBox.alert("Error", "No name set for form");
            return;
        }
     
        sid = (typeof(sid) == 'undefined') ?  (this.filesel.lastData ? this.filesel.lastData.id : 0) : sid;
        
        var js = Pman.Tab.BuilderTree.toJS();
        var json = Roo.encode(js);
       // console.log(js);
       // console.log(json);
        
        // check the select box to see if that has been set... - save it with that id..
        
        var _this = this;
        
        Pman.request({
            url: baseURL + '/Roo/Builder.php',
            method : 'POST',
            params : {
                json : json,
                name : t.root.elConfig.name,
                module : t.root.elConfig['|module'],
                app : t.root.elConfig.app,
                btype : 'FORM',
                id : sid
            }, 
            success : function(data) {
                // set the fileSel!!
                console.log(data);
                if (data) {
                    _this.filesel.setFromData(data);
                    if (cb) {
                        cb.call(_this,data);
                    }
                    _this.postCode(data);
                }
                
            }
            
        })
        
    },
    
    
    postCode : function(data)
    {
        // this needs more thought..
       // Pman.
        if ((data.app.length < 3) || (data.code.length < 50)) {
            return;
        }
        
        if (!this.modsel.lastData || !this.modsel.lastData.davwrite || !this.modsel.lastData.davurl.length) {
            return;
        }
        var durl = this.modsel.lastData.davurl.replace(/\/$/, '');
        
        Pman.request({
            url: durl + '/' + data.module + '.js',
            method : 'PUT',
            params: data.code,
            success : function(data) {
               // console.log('put data');
            }, 
            failure : function(resp, o) {
                if (resp.status == 204) {
                    return true; // saved - updated
                }
                 if (resp.status == 201) {
                    return true; // saved - new
                }
                console.log(resp);
                console.log(o);
                //return true; // we handle it!!!
            }
        });
        
    }, 
    
    showCode : function() {
        var _this = this;
        if (this.dialog) {
            // load it..
            this.dialog.show();
        
            
            this.dialog.getLayout().beginUpdate();
             
            this.dialog.resizeTo( Roo.lib.Dom.getViewWidth() - 70, Roo.lib.Dom.getViewHeight() - 70);
            this.dialog.getLayout().getRegion('center').resizeTo(Roo.lib.Dom.getViewWidth() - ( 70 + 50 ));
         
            
            this.dialog.moveTo(35,35);
            
            this.dialog.getLayout().endUpdate();
            
            this.previewContentPanel.load({
                url: baseURL + '/Builder/Code.php',
                method: 'GET',
                params: {
                    id: _this.filesel.getValue()
                    
                }
            });
            
            
            return;
        }
        
        
        
        this.dialog = new Roo.LayoutDialog(Roo.get(document.body).createChild({tag:'div'}),  { 
            autoCreated: true,
            title: "Code View",
            modal: true,
            width:  500,
            height: 450,
            shadow:true,
            minWidth:200,
            minHeight:180,
            resizable: false,
            //proxyDrag: true,
            closable: false,
            draggable: false,
            center: {
                autoScroll:true,
                titlebar: false,
               // tabPosition: 'top',
                hideTabs: true,
              //  closeOnTab: true,
                alwaysShowTabs: false
            }
             
            
            
        });
        var dgcloser = function() {
            
            _this.dialog.hide();
            if (_this.callback) {
                _this.callback.call(this, false);
            }
        };
         
        this.dialog.addKeyListener(27, dgcloser,this);
          
        this.dialog.addButton("Close",dgcloser,this);
       
        
        
        layout = this.dialog.getLayout();
        layout.beginUpdate();
         
        // we have a hoder for it...
       
        this.previewContentPanel = new Roo.ContentPanel(
            layout.getEl().createChild({ tag: 'div' }), 
            {
                //title: 'Preview', 	
                fitContainer: true
              
            }
        );
        layout.add('center',  this.previewContentPanel);
        
         
        
        layout.endUpdate();
        this.showCode();
    }
}
    