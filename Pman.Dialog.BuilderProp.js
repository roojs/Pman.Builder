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
            title : "Edit / Create AutoAuth",
            width : 400,
            items : [
                {
                    xtype: 'ContentPanel',
                    xns: Roo,
                    region : 'center',
                    items : [
                        {
                            xtype: 'Form',
                            xns: Roo.form,
                            listeners : {
                                actioncomplete : function(_self,action)
                                {
                                    if (action.type == 'setdata') {
                                       //_this.dialog.el.mask("Loading");
                                       //this.load({ method: 'GET', params: { '_id' : _this.data.id }});
                                       return;
                                    }
                                    if (action.type == 'load') {
                                        _this.dialog.el.unmask();
                                        return;
                                    }
                                    if (action.type =='submit') {
                                    
                                        _this.dialog.el.unmask();
                                        _this.dialog.hide();
                                    
                                         if (_this.callback) {
                                            _this.callback.call(_this, _this.form.getValues());
                                         }
                                         _this.form.reset();
                                         return;
                                    }
                                },
                                rendered : function (form)
                                {
                                    _this.form= form;
                                }
                            },
                            method : 'POST',
                            style : 'margin:10px;',
                            url : baseURL + '/Roo/AutoAuth.php',
                            items : [
                                {
                                    xtype: 'ComboBox',
                                    xns: Roo.form,
                                    allowBlank : 'false',
                                    editable : 'false',
                                    emptyText : "Select User",
                                    forceSelection : true,
                                    listWidth : 400,
                                    loadingText : "Searching...",
                                    minChars : 2,
                                    pageSize : 20,
                                    qtip : "Select User",
                                    selectOnFocus : true,
                                    triggerAction : 'all',
                                    typeAhead : true,
                                    width : 300,
                                    tpl : '<div class="x-grid-cell-text x-btn button"><b>{name}</b> </div>',
                                    queryParam : 'query[name]',
                                    fieldLabel : 'User',
                                    valueField : 'id',
                                    displayField : 'name',
                                    hiddenName : 'user_id',
                                    name : 'user_id_name',
                                    store : {
                                        xtype: 'Store',
                                        xns: Roo.data,
                                        remoteSort : true,
                                        sortInfo : { direction : 'ASC', field: 'id' },
                                        listeners : {
                                            beforeload : function (_self, o){
                                                o.params = o.params || {};
                                                // set more here
                                            }
                                        },
                                        proxy : {
                                            xtype: 'HttpProxy',
                                            xns: Roo.data,
                                            method : 'GET',
                                            url : baseURL + '/Roo/User.php'
                                        },
                                        reader : {
                                            xtype: 'JsonReader',
                                            xns: Roo.data,
                                            id : 'id',
                                            root : 'data',
                                            totalProperty : 'total',
                                            fields : [{"name":"id","type":"int"},{"name":"name","type":"string"}]
                                        }
                                    }
                                },
                                {
                                    xtype: 'TextField',
                                    xns: Roo.form,
                                    fieldLabel : 'Url',
                                    name : 'url',
                                    width : 200
                                },
                                {
                                    xtype: 'DateField',
                                    xns: Roo.form,
                                    fieldLabel : 'Ts',
                                    name : 'ts',
                                    width : 75
                                },
                                {
                                    xtype: 'TextField',
                                    xns: Roo.form,
                                    fieldLabel : 'Checksum',
                                    name : 'checksum',
                                    width : 200
                                },
                                {
                                    xtype: 'Hidden',
                                    xns: Roo.form,
                                    name : 'id'
                                }
                            ]
                        }
                    ]
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
