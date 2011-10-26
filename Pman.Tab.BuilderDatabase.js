//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        part :  ["Builder","Database"],
        modKey : '001-Pman.Tab.BuilderDatabase',
        module : Pman.Tab.BuilderDatabase,
        region : 'center',
        parent : false,
        name : "unnamed module",
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
                        title : "Images",
                        fitToframe : true,
                        fitContainer : true,
                        tableName : 'Images',
                        background : true,
                        region : 'center',
                        listeners : {
                            activate : function() {
                                _this.panel = this;
                                if (_this.grid) {
                                    _this.grid.footer.onClick('first');
                                }
                            }
                        },
                        grid : {
                            xtype: 'Grid',
                            xns: Roo.grid,
                            autoExpandColumn : 'filename',
                            loadMask : true,
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
                            dataSource : {
                                xtype: 'Store',
                                xns: Roo.data,
                                remoteSort : true,
                                sortInfo : { field : 'filename', direction: 'ASC' },
                                proxy : {
                                    xtype: 'HttpProxy',
                                    xns: Roo.data,
                                    method : 'GET',
                                    url : baseURL + '/Roo/Images.php'
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
                                        text : "Add",
                                        cls : 'x-btn-text-icon',
                                        icon : Roo.rootURL + 'images/default/dd/drop-add.gif',
                                        listeners : {
                                            click : function()
                                            {
                                                if (!_this.dialog) return;
                                                _this.dialog.show( { id : 0 } , function() {
                                                    _this.grid.footer.onClick('first');
                                               }); 
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'Button',
                                        xns: Roo.Toolbar,
                                        text : "Edit",
                                        cls : 'x-btn-text-icon',
                                        icon : Roo.rootURL + 'images/default/tree/leaf.gif',
                                        listeners : {
                                            click : function()
                                            {
                                                var s = _this.grid.getSelectionModel().getSelections();
                                                if (!s.length || (s.length > 1))  {
                                                    Roo.MessageBox.alert("Error", s.length ? "Select only one Row" : "Select a Row");
                                                    return;
                                                }
                                                if (!_this.dialog) return;
                                                _this.dialog.show(s[0].data, function() {
                                                    _this.grid.footer.onClick('first');
                                                }); 
                                                
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'Button',
                                        xns: Roo.Toolbar,
                                        text : "Delete",
                                        cls : 'x-btn-text-icon',
                                        icon : rootURL + '/Pman/templates/images/trash.gif',
                                        listeners : {
                                            click : function()
                                            {
                                                 Pman.genericDelete(_this, 'Images'); 
                                            }
                                        }
                                    }
                                ]
                            },
                            colModel : [
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Filename',
                                    width : 200,
                                    dataIndex : 'filename',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Onid',
                                    width : 75,
                                    dataIndex : 'onid',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Mimetype',
                                    width : 200,
                                    dataIndex : 'mimetype',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Width',
                                    width : 75,
                                    dataIndex : 'width',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Height',
                                    width : 75,
                                    dataIndex : 'height',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Filesize',
                                    width : 75,
                                    dataIndex : 'filesize',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Displayorder',
                                    width : 75,
                                    dataIndex : 'displayorder',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Language',
                                    width : 200,
                                    dataIndex : 'language',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Parent image',
                                    width : 75,
                                    dataIndex : 'parent_image_id',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Created',
                                    width : 75,
                                    dataIndex : 'created',
                                    renderer : function(v) { return String.format('{0}', v ? v.format('d/M/Y') : ''); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Imgtype',
                                    width : 200,
                                    dataIndex : 'imgtype',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Linkurl',
                                    width : 200,
                                    dataIndex : 'linkurl',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Descript',
                                    width : 200,
                                    dataIndex : 'descript',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Title',
                                    width : 200,
                                    dataIndex : 'title',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Credit',
                                    width : 200,
                                    dataIndex : 'credit',
                                    renderer : function(v) { return String.format('{0}', v); }
                                },
                                {
                                    xtype: 'ColumnModel',
                                    xns: Roo.grid,
                                    header : 'Source',
                                    width : 200,
                                    dataIndex : 'source',
                                    renderer : function(v) { return String.format('{0}', v); }
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
