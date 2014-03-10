//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Tab.BuilderProps = new Roo.XComponent({
    part     :  ["Builder","Props"],
    order    : '001-Pman.Tab.BuilderProps',
    region   : 'center',
    parent   : 'Pman.Tab.BuilderTree',
    name     : "Pman.Tab.BuilderProps",
    disabled : false, 
    permname : '', 
    _tree : function()
    {
        var _this = this;
        var MODULE = this;
        return {
            xtype: 'GridPanel',
            xns: Roo,
            region : 'south',
            grid : {
                xtype: 'PropertyGrid',
                xns: Roo.grid,
                listeners : {
                    render : function (grid)
                    {
                        _this.grid = grid;
                    },
                    afteredit : function (e)
                    {
                       // change this..
                       //this.currentNode.elConfig
                       
                       
                    },
                    cellclick : function (_self, rowIndex, ci, e)
                    {
                         if (ci != 0) {
                            return;
                        }
                        //console.log(e);
                        // click on left col..
                        // show menu..
                        // make sure it's initialized..
                        _this.panel.menu = Roo.factory(_this.panel.menu);
                        
                        _this.panel.menu.show(e.getTarget(), 'tr');
                    },
                    beforeedit : function (e)
                    {
                       Roo.log('beforeedit');
                       Roo.log(e.record.data);
                       var key = e.record.data.name;
                       var val = e.record.data.value;
                       // source code edit..
                       if (key.match(/^\|/) || key.match(/^\!/)) {
                            Pman.Dialog.BuilderSourceEdit.show( { value :  val }, function(d) {
                                // perhaps we should eval it..
                            
                                _this.grid.currentNode.elConfig[key] = d.value;
                                _this.grid.setSourceFromNode(_this.grid.currentNode.elConfig);
                                _this.grid.fireEvent('propertychange', 
                                    Pman.Tab.BuilderProps.grid, key, d.value, false
                                );
                            });
                            e.cancel = true;
                            return;
                       }
                    },
                    propertychange : function (grid, id, v, oldval)
                    {
                        if (v == 'false') {
                            v = false;
                        }
                        if (v == 'true') {
                            v = true;
                        }
                        var ec = _this.grid.currentNode.elConfig;
                        
                        if (id[0] == '!') {
                            ec.listeners = ec.listeners || {};
                            ec.listeners[id.substring(1)] = v;
                            if (typeof(ec[id]) != 'undefined') {
                                delete ec[id];
                            }
                        } else { 
                           ec[id] = v;
                        }
                    
                        _this.grid.setSourceFromNode(ec);
                        
                        var bp = Pman.Tab.BuilderView.panel;
                        bp.redraw.defer(100,bp, [true]);
                        _this.grid.currentNode.setText(
                            Pman.Builder.Tree.configToText(ec)
                        );
                    },
                    contextmenu : function (e)
                    {
                        // should we check e..??
                        _this.panel.menu2 = Roo.factory(_this.panel.menu2);
                        
                        _this.panel.menu2.show(e.getTarget());
                        e.stopEvent()
                    
                    }
                },
                setCurrrentNode : function(node) {
                   
                    
                    this.view.el.unmask();
                    
                    if (!node || !node.elConfig) {
                        this.currentNode = false;
                        this.setSourceFromNode({});
                        this.view.el.mask('select a node');
                    } else {
                        this.currentNode = node;
                        this.setSourceFromNode(this.currentNode.elConfig);
                        
                    }
                    
                },
                setSourceFromNode : function(config) {
                   
                        
                    var cfg = {};
                    for (var k in config) {
                        //if (k.charAt(0) == '*') {
                        //    continue; // dont show props..
                        //}
                        
                        if (k  == 'listeners') {
                            for (var kk in config[k]) {
                                cfg['!' + kk ] = config[k][kk];
                            }
                            
                            continue;
                        }
                        if (k  == 'items') {
                            continue;
                        }
                        
                        if (typeof config[k] == 'object') {
                            
                            try {
                                var ec = Roo.encode(config[k]);
                                cfg[k] = ec;
                            } catch(e) {}
                            continue;
                        }
                        cfg[k] = config[k];
                    }
                    
                    if (!cfg.xtype) {
                        return;
                    }
                
                    this.setSource(cfg);
                
                    
                      
                }
            },
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
                             
                                 var rc = _this.grid.getSelectionModel().getSelectedCell();
                                 var n = _this.grid.getDataSource().getAt(rc[0]).data.name;
                                 if (n == 'xtype') {
                                    return;
                                 }
                                  if (n[0] == '!') {
                                    Roo.MesssageBox.alert("Error", "Error, you can not do this to listeners");
                                    return;
                                }
                                 if (n[0] == '|') {
                                    var val =  _this.grid.currentNode.elConfig[n];
                                    delete _this.grid.currentNode.elConfig[n];
                                    _this.grid.currentNode.elConfig[ n.substring(1)] = val;
                                     
                                 } else {
                                    var val =  _this.grid.currentNode.elConfig[n];
                                    delete _this.grid.currentNode.elConfig[n];
                                    _this.grid.currentNode.elConfig['|'+ n] = val;
                                 }
                                // reloads      
                                _this.grid.setCurrrentNode(_this.grid.currentNode);
                                var bp = Pman.Tab.BuilderView.panel;
                                bp.redraw.defer(100,bp, [true]);
                                // update the tree's  text
                                _this.grid.currentNode.setText(
                                    Pman.Builder.Tree.configToText(_this.grid.currentNode.elConfig)
                                );
                            }
                        },
                        text : "Toggle property as Javascript"
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
                             
                                 var rc = _this.grid.getSelectionModel().getSelectedCell();
                                 var n = _this.grid.getDataSource().getAt(rc[0]).data.name;
                                 if (n == 'xtype') {
                                    return;
                                }
                                if (n[0] == '!') {
                                    delete _this.grid.currentNode.elConfig.listeners[n.substring(1)];
                                } else {
                                    delete _this.grid.currentNode.elConfig[n];
                                }
                                // reloads      
                                _this.grid.setCurrrentNode(_this.grid.currentNode);
                                var bp = Pman.Tab.BuilderView.panel;
                                bp.redraw.defer(100,bp, [true]);
                                // update the tree's  text
                                _this.grid.currentNode.setText(
                                    Pman.Builder.Tree.configToText(_this.grid.currentNode.elConfig)
                                );
                            }
                        },
                        text : "Delete Property / Event"
                    }
                ]
            },
            'menu2' : {
                xtype: 'Menu',
                xns: Roo.menu,
                items : [
                    {
                        xtype: 'Item',
                        xns: Roo.menu,
                        listeners : {
                            click : function (_self, e)
                            {
                             
                                // show a dialog to select property??
                                // or should we add a line and get clever with pulldowns..
                                var ec = _this.grid.currentNode.elConfig;
                                Roo.log(ec);
                                Pman.Dialog.BuilderProp.show({
                                        xtype : ec.xtype  || '',
                                        xns: ec['|xns'] || '',
                                        list: 'props'
                                }, function (n,val) {
                                    ec[n] = val || '';
                                    _this.grid.setCurrrentNode(_this.grid.currentNode);
                                    var bp = Pman.Tab.BuilderView.panel;
                                    bp.redraw.defer(100,bp, [true]);
                                    // update the tree's  text
                                    _this.grid.currentNode.setText(
                                        Pman.Builder.Tree.configToText(_this.grid.currentNode.elConfig)
                                    );
                                });
                            }
                        },
                        text : "Add Property"
                    },
                    {
                        xtype: 'Item',
                        xns: Roo.menu,
                        listeners : {
                            click : function (_self, e)
                            {
                             
                                // show a dialog to select property??
                                // or should we add a line and get clever with pulldowns..
                                var ec = _this.grid.currentNode.elConfig;
                                Pman.Dialog.BuilderProp.show({
                                        xtype : ec.xtype  || '',
                                        xns: ec['|xns'] || '',
                                        list: 'events'
                                }, function (n,val) {
                                    n = '!|' + n;
                                    ec[n] = val || "function () {\n\n}";
                                    _this.grid.setCurrrentNode(_this.grid.currentNode);
                                    var bp = Pman.Tab.BuilderView.panel;
                                    bp.redraw.defer(100,bp, [true]);
                                    // update the tree's  text
                                    _this.grid.currentNode.setText(
                                        Pman.Builder.Tree.configToText(_this.grid.currentNode.elConfig)
                                    );
                                });
                            }
                        },
                        text : "Add Event Handler"
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
                             
                                // show a dialog to select property??
                                // or should we add a line and get clever with pulldowns..
                            }
                        },
                        text : "Add User Defined Property"
                    }
                ]
            }
        };
    }
});
