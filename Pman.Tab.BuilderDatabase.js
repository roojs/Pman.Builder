//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        part :  ["Builder","Database"],
        modKey : '999-Pman.Tab.BuilderDatabase',
        module : Pman.Tab.BuilderDatabase,
        region : 'center',
        parent : Pman.Tab.Builder,
        name : "Pman.Tab.BuilderDatabase",
        disabled : false, 
        permname: '' 
    });
});

Pman.Tab.BuilderDatabase = new Roo.util.Observable({

    panel : false,
    disabled : false,
    parentLayout:  false,

    add : function(parentLayout, region)
    {

        var _this = this;
        this.parentLayout = parentLayout;

        this.panel = parentLayout.addxtype({
            xtype: 'NestedLayoutPanel',
            xns: Roo,
            region : 'center',
            title : "Manage Database",
            layout : {
                xtype: 'BorderLayout',
                xns: Roo,
                items : [
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
                                                if (!_this.dialog) return;
                                                _this.dialog.show( { id : 0 } , function() {
                                                    _this.grid.footer.onClick('first');
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
                center : {
                    xtype: 'LayoutRegion',
                    xns: Roo
                }
            }
        });
        this.layout = this.panel.layout;

    }
});
