//<script type="text/javascript">

// Auto generated file - created by Builder Module - do not edit directly
Pman.Dialog.BuilderAppEdit = {

    dialog : false,
    callback:  false,

    show : function(data, cb)
    {
        if (!this.dialog) {
            this.create();
        }

        this.callback = cb;
        this.data = data;
        this.dialog.show();
        if (this.form) {
           this.form.reset();
           this.form.setValues(data);
        }

    },

    create : function()
    {
        var _this = this;
        this.dialog = Roo.factory({
            xtype : 'LayoutDialog',
            background : true,
            width : 500,
            height : 165,
            title : "Edit \/ Create Module",
            listeners : {
                show: function (_self)
                {
                   _this.dialog = _self;
                }
            },
            closable : false,
            collapsible : false,
            resizable : false,
            xns: Roo,
            modal : true,
            items : [
                {
                    xtype : 'ContentPanel',
                    background : true,
                    fitToFrame : true,
                    region : 'center',
                    items : [
                        {
                            xtype : 'Form',
                            style : 'margin: 5px',
                            url: baseURL + '/Roo/Builder_app.php',
                            method : 'POST',
                            listeners : {
                                actionfailed: function (_self, action)
                                {
                                    _this.dialog.el.unmask();
                                    Pman.standardActionFailed(_self, action);
                                }
                                ,
                                actioncomplete: function (_self, action)
                                {
                                   _this.dialog.el.unmask();
                                   _this.dialog.hide();
                                   
                                    if (_this.callback) {
                                       _this.callback.call(_this, _this.form.getValues());
                                    }
                                    _this.form.reset();
                                }
                                ,
                                rendered: function (_self)
                                {
                                    _this.form = _self;
                                }
                                
                            },
                            items : [
                                {
                                    name : 'id',
                                    xtype : 'Hidden'
                                },
                                {
                                    name : 'app',
                                    fieldLabel : "Module",
                                    width : 200,
                                    xtype : 'TextField'
                                },
                                {
                                    name : 'davurl',
                                    fieldLabel : "Webdav URL",
                                    width : 350,
                                    xtype : 'TextField',
                                    vtype : 'url'
                                },
                                {
                                    name : 'davwrite',
                                    fieldLabel : "Write to WebDav",
                                    xtype : 'Checkbox',
                                    allowDecimals : false,
                                    boxLabel : 'Check to enable PUT to Dav after save',
                                    inputValue : 1
                                }
                            ]
                        }
                    ]
                }
            ],
            center : {
                titlebar : false
            },
            buttons : [
                {
                    xtype : 'Button',
                    xns: Roo,
                    text : "Cancel",
                    listeners : {
                        click: function (_self, e)
                        {
                             _this.form.reset();
                             _this.dialog.hide();
                        }
                    }
                },
                {
                    xtype : 'Button',
                    xns: Roo,
                    text : "OK",
                    listeners : {
                        click: function (_self, e)
                        {
                            _this.dialog.el.mask("Saving");
                             _this.form.doAction('submit');
                            
                        }
                    }
                }
            ]
        });
    }
};
