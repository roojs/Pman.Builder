//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Dialog.BuilderProp = {

    dialog : false,
    callback:  false,

    show : function(data, cb)
    {
        if (!this.dialog) {
            this.create();
        }

        this.callback = cb;
        this.data = data;
        this.dialog.show(this.data._el);
        if (this.form) {
           this.form.reset();
           this.form.setValues(data);
           this.form.fireEvent('actioncomplete', this.form,  { type: 'setdata', data: data });
        }

    },

    create : function()
    {
        var _this = this;
        this.dialog = Roo.factory({
            xtype: 'LayoutDialog',
            xns: Roo,
            listeners : {
                show : function (_self)
                {
                   _this.grid.ds.load({});
                }
            },
            closable : false,
            collapsible : false,
            height : 600,
            modal : true,
            resizable : false,
            title : "Add Property",
            width : 600,
            items : [
                {
                    xtype: 'GridPanel',
                    xns: Roo,
                    listeners : {
                        activate : function() {
                            _this.panel = this;
                            //if (_this.grid) {
                            //    _this.grid.ds.load({});
                            //}
                        }
                    },
                    fitContainer : true,
                    fitToframe : true,
                    region : 'center',
                    tableName : 'AutoAuth',
                    title : "AutoAuth",
                    grid : {
                        xtype: 'Grid',
                        xns: Roo.grid,
                        listeners : {
                            render : function() 
                            {
                                _this.grid = this; 
                                //_this.dialog = Pman.Dialog.FILL_IN
                               // if (_this.panel.active) {
                                 //  this.footer.onClick('first');
                               // }
                            },
                            rowdblclick : function (_self, rowIndex, e)
                            {
                                 
                                 _this.callback(this.getDataSource().getAt(rowIndex).data.name);
                                 _this.dialog.hide(); 
                            }
                        },
                        autoExpandColumn : 'desc',
                        loadMask : true,
                        dataSource : {
                            xtype: 'Store',
                            xns: Roo.data,
                            listeners : {
                                beforeload : function (_self, options)
                                {
                                    // we should cache this!!!
                                    options.params = options.params || {};
                                    options.params.xtype = this.data.xtype;
                                    options.params.xns = this.data.xns;
                                    options.params.list = this.data.list;    
                                }
                            },
                            remoteSort : false,
                            sortInfo : { field : 'name', direction: 'ASC' },
                            proxy : {
                                xtype: 'HttpProxy',
                                xns: Roo.data,
                                method : 'GET',
                                url : baseURL + '/Builder/Palette/Prop.php'
                            },
                            reader : {
                                xtype: 'JsonReader',
                                xns: Roo.data,
                                id : 'id',
                                root : 'data',
                                totalProperty : 'total',
                                fields : [
                                    'name',
                                    'desc'
                                ]
                            }
                        },
                        colModel : [
                            {
                                xtype: 'ColumnModel',
                                xns: Roo.grid,
                                dataIndex : 'name',
                                header : 'name',
                                width : 175,
                                renderer : function(v) { return String.format('{0}', v ? v.format('d/M/Y') : ''); }
                            },
                            {
                                xtype: 'ColumnModel',
                                xns: Roo.grid,
                                dataIndex : 'desc',
                                header : 'Description',
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
            },
            buttons : [
                {
                    xtype: 'Button',
                    xns: Roo,
                    listeners : {
                        click : function (_self, e)
                        {
                            _this.dialog.hide();
                        }
                    },
                    text : "Cancel"
                },
                {
                    xtype: 'Button',
                    xns: Roo,
                    listeners : {
                        click : function (_self, e)
                        {
                            // do some checks?
                             var sel = _this.grid.getSelectionModel().getSelected();
                            if (!sel) {
                                Roo.MessageBox.alert("Error", "Select a property");
                            }
                            
                            _this.callback(sel.data.name);
                           _this.dialog.hide();
                         
                        
                        }
                    },
                    text : "Add"
                }
            ]
        });
    }
};
