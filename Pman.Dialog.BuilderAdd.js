//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Dialog.BuilderAdd = {

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
            height : 170,
            modal : true,
            resizable : false,
            title : "Add Node",
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
                                rendered : function (form)
                                {
                                  _this.form  = form;
                                },
                                actioncomplete : function (_self, action)
                                {
                                     if (action.type == 'setdata') {
                                         // check if element can be templated or databased..
                                         
                                          
                                     }
                                }
                            },
                            items : [
                                {
                                    xtype: 'FieldSet',
                                    xns: Roo.form,
                                    labelWidth : 140,
                                    legend : "Do you want to create the element :",
                                    style : 'width:350px',
                                    items : [
                                        {
                                            xtype: 'ComboBox',
                                            xns: Roo.form,
                                            fieldLabel : 'From Template',
                                            name : 'template',
                                            store : {
                                                xtype: 'Store',
                                                xns: Roo.data
                                            }
                                        },
                                        {
                                            xtype: 'ComboBox',
                                            xns: Roo.form,
                                            allowBlank : true,
                                            alwaysQuery : true,
                                            displayField : 'name',
                                            fieldLabel : 'From Database Table',
                                            listWidth : 400,
                                            name : 'table',
                                            tpl : '<div class="x-grid-cell-text x-btn button"><b>{name}</b> {desc}</div>',
                                            triggerAction : 'all',
                                            store : {
                                                xtype: 'Store',
                                                xns: Roo.data,
                                                proxy : {
                                                    xtype: 'HttpProxy',
                                                    xns: Roo.data,
                                                    method : 'GET',
                                                    url : baseURL + '/Builder/ERM.php'
                                                },
                                                reader : {
                                                    xtype: 'JsonReader',
                                                    xns: Roo.data,
                                                    root : 'data',
                                                    totalProperty : 'total',
                                                    fields : [  'name' , 'desc' ]
                                                }
                                            }
                                        }
                                    ]
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
                            var vals = _this.form.getValues();
                            
                            _this.dialog.hide();
                            
                           if (vals.table.length) {
                              Pman.Dialog.BuilderAddTable.show( 
                               Roo.apply({  table : vals.table } , _this.data),  
                               
                               function(data) {
                                    _this.dialog.hide();
                                    var cls = data['|xns'] + '.' + data['xtype'];
                                    
                                    var res = Pman.Builder.Wizard[cls](data);
                                   _this.callback(res); 
                               });
                                return;
                            }
                           
                            // otherwise, call back with template??
                           
                             
                             _this.callback(_this.data);
                        }
                    },
                    text : "OK"
                },
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
                }
            ]
        });
    }
};
