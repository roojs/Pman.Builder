//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Tab.BuilderDatabase = new Roo.XComponent({
    part     :  ["Builder","Database"],
    order    : '999-Pman.Tab.BuilderDatabase',
    region   : 'center',
    parent   : 'Pman.Tab.Builder',
    name     : "Pman.Tab.BuilderDatabase",
    disabled : false, 
    permname : '', 
    _tree : function()
    {
        var _this = this;
        var MODULE = this;
        return {
            xtype: 'NestedLayoutPanel',
            xns: Roo,
            listeners : {
                activate : function (_self)
                {
                 _this.treepanel.tree.root.reload();
                }
            },
            background : true,
            region : 'center',
            title : "Manage Database",
            layout : {
                xtype: 'BorderLayout',
                xns: Roo,
                items : [
                    {
                        xtype: 'TreePanel',
                        xns: Roo,
                        listeners : {
                            render : function (_self)
                            {
                               _this.treepanel = _self;
                            }
                        },
                        region : 'west',
                        toolbar : {
                            xtype: 'Toolbar',
                            xns: Roo,
                            items : [
                                {
                                    xtype: 'SplitButton',
                                    xns: Roo.Toolbar,
                                    listeners : {
                                        click : function (_self, e)
                                        {
                                         _this.treepanel.tree.root.reload();
                                        }
                                    },
                                    text : "Refresh/Manage Tables",
                                    menu : {
                                        xtype: 'Menu',
                                        xns: Roo.menu,
                                        items : [
                                            {
                                                xtype: 'Item',
                                                xns: Roo.menu,
                                                text : "Add Table/Container"
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
                                                            method: 'GET',
                                                            url: baseURL + '/Roo/Builder_tables.php',
                                                            params : {
                                                                 _sync : 1
                                                            }
                                                        });
                                                            
                                                    }
                                                },
                                                text : "Sync Tables"
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
                                                        var node = _this.treepanel.tree.getSelectionModel().getSelectedNode();    
                                                    }
                                                },
                                                text : "Export Data"
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        tree : {
                            xtype: 'TreePanel',
                            xns: Roo.tree,
                            listeners : {
                                beforeload : function (node)
                                {
                                    if (!_this.panel.active) {
                                        return false;
                                    }
                                },
                                contextmenu : function (node, e)
                                {
                                    if (!node.expanded || node.leaf) {
                                        return;
                                    }
                                
                                   _this.treepanel.menu = Roo.factory(_this.treepanel.menu);
                                   _this.treepanel.menu.show(node.ui.anchor,'tr');
                                   _this.cxnode = node;
                                },
                                beforenodedrop : function (dropEvent)
                                {
                                    Roo.log(dropEvent);
                                    var node = dropEvent.dropNode;
                                    var targ = dropEvent.target;
                                    var parent = dropEvent.target;
                                    switch(dropEvent.point) {
                                        case 'below': 
                                         case 'above':  
                                            parent = dropEvent.target.parentNode;
                                            break;
                                        default:
                                            break;
                                    }
                                    // technically you should not be able to drag tables into other modules..
                                    if (parent.attributes.id < 1) {
                                        dropEvent.cancel = 1;
                                    }
                                    new Pman.Request({
                                        url : baseURL + '/Roo/Builder_tables',
                                        params : {
                                            id : node.attributes.id,
                                            parent_id : parent.attributes.id
                                        }
                                    });
                                    
                                    
                                }
                            },
                            containerScroll : true,
                            ddGroup : 'dbtree',
                            enableDD : true,
                            rootVisible : false,
                            loader : {
                                xtype: 'TreeLoader',
                                xns: Roo.tree,
                                listeners : {
                                    create : function (_self, attr)
                                    {
                                        Roo.log("CREATE");
                                        try {
                                            attr.text = attr.name.length ? attr.name : attr.descrip;
                                            
                                            attr.leaf = attr.name.length ? true : false;
                                            attr.html = String.format('<B>{0}</B><i>{1}</i>',
                                                attr.name,
                                                attr.descrip
                                            );
                                        } catch(e) {
                                            Roo.log(e);
                                        }
                                        Roo.log(attr);
                                    
                                    }
                                },
                                queryParam : 'parent_id',
                                requestMethod : 'GET',
                                root : 'data',
                                baseParams : { _tree: 1, 'sort': 'name', dir: 'ASC', limit : 9999 },
                                dataUrl : baseURL + '/Roo/Builder_tables.php'
                            },
                            sm : {
                                xtype: 'MultiSelectionModel',
                                xns: Roo.tree
                            },
                            root : {
                                xtype: 'AsyncTreeNode',
                                xns: Roo.tree,
                                text : "TOP LEVEL"
                            },
                            editor : {
                                xtype: 'TreeEditor',
                                xns: Roo.tree,
                                listeners : {
                                    beforenodeedit : function (_self,node)
                                    {
                                        Roo.log('before start edit');
                                        Roo.log(this.editNode);
                                        if (node.attributes.name.length) {
                                            return false;
                                        }
                                        return true;
                                        
                                    },
                                    complete : function (_self, value, startValue)
                                    {
                                        Roo.log(this.editNode);
                                    
                                        var attr = this.editNode.attributes;
                                        
                                        var pa = this.editNode.parentNode.attributes;
                                        Roo.log(pa);
                                        var pr =  {
                                     
                                            parent_id : pa.id,
                                            descrip : value,
                                            name : '',
                                            dbschema : ''
                                        };
                                            
                                        if (attr.id > 0) {
                                            pr.id = attr.id;
                                        }
                                        
                                        new Pman.Request({
                                            url : baseURL + '/Roo/Builder_tables',
                                            method : 'POST',
                                            params : pr
                                        });
                                        
                                        
                                        
                                    }
                                }
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
                                            _this.nIndex =     _this.nIndex || 0;
                                            
                                            var m = _this.cxnode.firstChild ? 'insertBefore' : 'appendChild';
                                            var tree =  _this.treepanel.tree;
                                            
                                            var n = tree.loader.createNode({
                                                id : -1,
                                                descrip :'New Group ' + (++_this.nIndex), 
                                                name : ''
                                            }); 
                                            
                                            var node = _this.cxnode[m]( n , _this.cxnode.firstChild);
                                            setTimeout(function(){
                                                    tree.editor.editNode = node;
                                                    tree.editor.startEdit(node.ui.textNode);
                                                }, 10);
                                        }
                                    },
                                    text : "Add Group"
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
                                            _this.nIndex =     _this.nIndex || 0;
                                            
                                            _this.cxnode;
                                            // try and delete it..
                                            new Pman.Request({
                                                url : baseURL + '/Roo/Builder_tables',
                                                params : {
                                                    _delete : _this.cxnode.attributes.id
                                                },
                                                success : function() {
                                                    _this.cxnode.parentNode.removeChild(_this.cxnode);
                                                    _this.cxnode = false;
                                                
                                                }
                                            });
                                            
                                        }
                                    },
                                    text : "Remove Group"
                                }
                            ]
                        }
                    },
                    {
                        xtype: 'GridPanel',
                        xns: Roo,
                        listeners : {
                            activate : function() {
                                _this.panel = this;
                                if (_this.grid) {
                                    _this.grid.footer.onClick('first');
                                }
                            }
                        },
                        background : true,
                        fitContainer : true,
                        fitToframe : true,
                        region : 'center',
                        tableName : 'Tables',
                        title : "Tables",
                        grid : {
                            xtype: 'Grid',
                            xns: Roo.grid,
                            listeners : {
                                render : function() 
                                {
                                    _this.grid = this; 
                                    //_this.dialog = Pman.Dialog.FILL_IN
                                    if (_this.panel.active) {
                                       this.footer.onClick('first');
                                    }
                                },
                                rowdblclick : function (_self, rowIndex, e)
                                {
                                    if (!_this.dialog) return;
                                    _this.dialog.show( this.getDataSource().getAt(rowIndex), function() {
                                        _this.grid.footer.onClick('first');
                                    }); 
                                }
                            },
                            autoExpandColumn : 'table',
                            loadMask : true,
                            dataSource : {
                                xtype: 'Store',
                                xns: Roo.data,
                                remoteSort : true,
                                sortInfo : { field : 'filename', direction: 'ASC' },
                                proxy : {
                                    xtype: 'HttpProxy',
                                    xns: Roo.data,
                                    method : 'GET',
                                    url : baseURL + '/Builder/ERM.php'
                                },
                                reader : {
                                    xtype: 'JsonReader',
                                    xns: Roo.data,
                                    totalProperty : 'total',
                                    root : 'data',
                                    id : 'id',
                                    fields : [
                                        {
                                            'name': 'id',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'filename',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'ontable',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'onid',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'mimetype',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'width',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'height',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'filesize',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'displayorder',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'language',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'created',
                                            'type': 'date',
                                            'dateFormat': 'Y-m-d'
                                        },
                                        {
                                            'name': 'imgtype',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'linkurl',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'descript',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'title',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'credit',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'source',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_id',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'parent_image_id_filename',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_ontable',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_onid',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'parent_image_id_mimetype',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_width',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'parent_image_id_height',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'parent_image_id_filesize',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'parent_image_id_displayorder',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'parent_image_id_language',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_parent_image_id',
                                            'type': 'int'
                                        },
                                        {
                                            'name': 'parent_image_id_created',
                                            'type': 'date'
                                        },
                                        {
                                            'name': 'parent_image_id_imgtype',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_linkurl',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_descript',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_title',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_credit',
                                            'type': 'string'
                                        },
                                        {
                                            'name': 'parent_image_id_source',
                                            'type': 'string'
                                        }
                                    ]
                                }
                            },
                            footer : {
                                xtype: 'PagingToolbar',
                                xns: Roo,
                                pageSize : 25,
                                displayInfo : true,
                                displayMsg : "Displaying Images{0} - {1} of {2}",
                                emptyMsg : "No Images found"
                            },
                            toolbar : {
                                xtype: 'Toolbar',
                                xns: Roo,
                                items : [
                                    {
                                        xtype: 'Button',
                                        xns: Roo.Toolbar,
                                        listeners : {
                                            click : function()
                                            {
                                                Roo.MessageBox.alert("Updating", "Updating the cache");
                                                new Pman.Request({
                                                    url : baseURL + '/Core/RefreshDatabaseCache',
                                                    method : 'GET',
                                                    success : function() {
                                                        Roo.MessageBox.hide();
                                                    }
                                                });
                                            }
                                        },
                                        cls : 'x-btn-text-icon',
                                        text : "Refresh Schema",
                                        icon : Roo.rootURL + 'images/default/dd/drop-add.gif'
                                    }
                                ]
                            },
                            colModel : [
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    dataIndex : 'table',
                                    header : 'Table',
                                    width : 200,
                                    renderer : function(v) { return String.format('{0}', v); }
                                }
                            ]
                        }
                    }
                ],
                west : {
                    xtype: 'LayoutRegion',
                    xns: Roo,
                    split : true,
                    width : 150
                },
                center : {
                    xtype: 'LayoutRegion',
                    xns: Roo
                }
            }
        };
    }
});
