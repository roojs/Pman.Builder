//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Dialog.BuilderPart = {

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
            height : 120,
            resizable : false,
            title : "Edit / Create builder_part",
            width : 450,
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
                                        if (!_this.data.id) {   
                                            this.load({ method: 'GET', params: { '_id' : _this.data.id }});
                                            return;
                                        }
                                       return;
                                    }
                                    if (action.type == 'load') {
                                         
                                        return;
                                    }
                                    if (action.type =='submit') {
                                     
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
                            url : baseURL + '/Roo/builder_part.php',
                            items : [
                                {
                                    xtype: 'TextField',
                                    xns: Roo.form,
                                    fieldLabel : 'Part name',
                                    name : 'name',
                                    width : 300
                                },
                                {
                                    xtype: 'Hidden',
                                    xns: Roo.form,
                                    name : 'module_id'
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
                             
                             
                            _this.form.doAction("submit");
                        
                        }
                    },
                    text : "Save"
                }
            ]
        });
    }
};
