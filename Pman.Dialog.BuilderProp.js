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
            closable : false,
            collapsible : false,
            height : 170,
            resizable : false,
            title : "Add Property",
            width : 400,
            items : [
                {
                    xtype: 'GridPanel',
                    xns: Roo,
                    title : "AutoAuth",
                    fitToframe : true,
                    fitContainer : true,
                    tableName : 'AutoAuth',
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
                        autoExpandColumn : 'url',
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
                            sortInfo : { field : 'url', direction: 'ASC' },
                            proxy : {
                                xtype: 'HttpProxy',
                                xns: Roo.data,
                                method : 'GET',
                                url : baseURL + '/Builder/Prop.php'
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
                                        'name': 'user_id',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'url',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'ts',
                                        'type': 'date',
                                        'dateFormat': 'Y-m-d'
                                    },
                                    {
                                        'name': 'checksum',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_id',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_name',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_title',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_company',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_address',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_email',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_telephone',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_fax',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_mobile',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_country',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_currency',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_shipping_method',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_shipping_acc',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_terms_agreed',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_passwd',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_is_buyer',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_is_seller',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_is_want_blind_rfq',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_buyer_type',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_is_verified',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_is_disabled',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_is_want_email',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_mail_newprod_freq',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_quotation_by',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_is_want_make_offer',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_mail_inventry_freq',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_max_rfq_per_day',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_is_approved',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_created',
                                        'type': 'date'
                                    },
                                    {
                                        'name': 'user_id_modified',
                                        'type': 'date'
                                    },
                                    {
                                        'name': 'user_id_modified_by',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_is_administrator',
                                        'type': 'int'
                                    },
                                    {
                                        'name': 'user_id_bank_name',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_bank_account',
                                        'type': 'string'
                                    },
                                    {
                                        'name': 'user_id_last_inventory_sent',
                                        'type': 'date'
                                    },
                                    {
                                        'name': 'user_id_last_rfq_report_sent',
                                        'type': 'date'
                                    },
                                    {
                                        'name': 'user_id_last_productlist_sent',
                                        'type': 'date'
                                    },
                                    {
                                        'name': 'user_id_company_id',
                                        'type': 'int'
                                    }
                                ]
                            }
                        },
                        footer : {
                            xtype: 'PagingToolbar',
                            xns: Roo,
                            pageSize : 25,
                            displayInfo : true,
                            displayMsg : 'Displaying AutoAuth{0} - {1} of {2}',
                            emptyMsg : 'No AutoAuth found'
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
                                             Pman.genericDelete(_this, 'AutoAuth'); 
                                        }
                                    }
                                }
                            ]
                        },
                        colModel : [
                            {
                                xtype: 'ColumnModel',
                                xns: Roo.grid,
                                dataIndex : 'name',
                                header : 'name',
                                width : 75,
                                renderer : function(v) { return String.format('{0}', v ? v.format('d/M/Y') : ''); }
                            },
                            {
                                xtype: 'ColumnModel',
                                xns: Roo.grid,
                                dataIndex : 'desc',
                                header : 'Checksum',
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
                             
                            
                            _this.dialog.el.mask("Saving");
                            _this.form.doAction("submit");
                        
                        }
                    },
                    text : "Save"
                }
            ]
        });
    }
};
