//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

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
                   _this.dialog = _self;
                }
            },
            background : true,
            closable : false,
            collapsible : false,
            height : 200,
            modal : true,
            resizable : false,
            title : "Edit / Create Module",
            width : 500,
            items : [
                {
                    xtype: 'ContentPanel',
                    xns: Roo,
                    background : true,
                    fitToFrame : true,
                    region : 'center',
                    items : [
                        {
                            xtype: 'Form',
                            xns: Roo.form,
                            listeners : {
                                actionfailed : function (_self, action)
                                {
                                    _this.dialog.el.unmask();
                                    Pman.standardActionFailed(_self, action);
                                },
                                actioncomplete : function (_self, action)
                                {
                                   if (action.type == 'submit') {
                                      _this.dialog.el.unmask();
                                     _this.dialog.hide();
                                   
                                    if (_this.callback) {
                                       _this.callback.call(_this, _this.form.getValues());
                                    }
                                    _this.form.reset();
                                     }
                                },
                                rendered : function (_self)
                                {
                                    _this.form = _self;
                                }
                            },
                            method : 'POST',
                            style : 'margin: 5px',
                            url : baseURL + '/Roo/Builder_app.php',
                            items : [
                                {
                                    xtype: 'Hidden',
                                    xns: Roo.form,
                                    name : 'id'
                                },
                                {
                                    xtype: 'TextField',
                                    xns: Roo.form,
                                    name : 'app',
                                    fieldLabel : 'Module',
                                    width : 200
                                },
                                {
                                    xtype: 'TextField',
                                    xns: Roo.form,
                                    name : 'davurl',
                                    fieldLabel : 'Webdav URL',
                                    width : 350,
                                    vtype : 'url'
                                },
                                {
                                    xtype: 'Checkbox',
                                    xns: Roo.form,
                                    name : 'davwrite',
                                    fieldLabel : 'Write to WebDav',
                                    allowDecimals : false,
                                    boxLabel : 'Check to enable PUT to Dav after save',
                                    inputValue : '1'
                                },
                                {
                                    xtype: 'TextField',
                                    xns: Roo.form,
                                    name : 'gitpath',
                                    fieldLabel : 'Git Path',
                                    width : 350
                                }
                            ]
                        }
                    ]
                }
            ],
            center : {
                xtype: 'LayoutRegion',
                xns: Roo,
                titlebar : false
            },
            buttons : [
                {
                    xtype: 'Button',
                    xns: Roo,
                    text : "Cancel",
                    listeners : {
                        click : function (_self, e)
                        {
                             _this.form.reset();
                             _this.dialog.hide();
                        }
                    }
                },
                {
                    xtype: 'Button',
                    xns: Roo,
                    text : "OK",
                    listeners : {
                        click : function (_self, e)
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
