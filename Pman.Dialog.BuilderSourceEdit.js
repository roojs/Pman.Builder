//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Dialog.BuilderSourceEdit = {

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
                show : function (dlg)
                {
                    _this.dialog = dlg;
                    _this.dialog.layout.getRegion('south').collapse();
                    
                    if (!_this.help) {
                       _this.dialog.layout.getRegion('south').showPanel(0);
                       _this.help = _this.dialog.layout.getRegion('south').getPanel(0).el.createChild( {tag: 'iframe',  src : Roo.rootURL + 'docs'});
                       
                    }
                    if (_this.isBuilder) {
                        return;
                    }
                
                    dlg.getLayout().beginUpdate();
                    var w = Roo.lib.Dom.getViewWidth();
                    var h = Roo.lib.Dom.getViewHeight();
                    dlg.resizeTo( w - 70, h - 70);
                    dlg.moveTo(35,35);
                    var val = _this.form.findField('value');
                    val.setSize(w-100, h-170);
                    dlg.getLayout().endUpdate();
                    this.setTitle('Callback for ' + _this.data.title);
                
                }
            },
            background : true,
            closable : false,
            collapsible : false,
            height : 500,
            modal : true,
            title : "Source Code Edit",
            width : 400,
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
                            labelAlign : 'top',
                            listeners : {
                                rendered : function (form)
                                {
                                   _this.form = form;
                                }
                            },
                            items : [
                                {
                                    xtype: 'TextArea',
                                    xns: Roo.form,
                                    name : 'value',
                                    fieldLabel : 'Enter Code for Function or Property',
                                    width : 360,
                                    height : 100,
                                    listeners : {
                                        specialkey : function (f, e)
                                        {
                                            
                                            function addStr(v) {
                                                var fe = f.el.dom;
                                                if (document.selection) { // IE
                                                    fe.focus();
                                                    var sel =document.selection.createRange();
                                                    sel.text = v;
                                                    return;
                                                }
                                                if (fe.selectionStart || fe.selectionStart == '0') {
                                                    var startPos = fe.selectionStart;
                                                    var endPos = fe.selectionEnd;
                                                    var restoreTop = fe.scrollTop;
                                                    fe.value = fe.value.substring(0, startPos) + 
                                                        v + fe.value.substring(endPos, fe.value.length);
                                                    fe.selectionStart = startPos + v.length;
                                                    fe.selectionEnd = startPos + v.length;
                                                    if (restoreTop>0)  {
                                                        fe.scrollTop = restoreTop;
                                                    }
                                                    return;
                                                }
                                                fe.value += "    ";
                                            }
                                            
                                            if (e.getKey() == 9) {
                                                addStr("    ");
                                                e.stopEvent();
                                            }
                                            if (e.getKey() == 13) {
                                                addStr("\n    ");
                                                e.stopEvent();
                                            }
                                        
                                        }
                                    },
                                    style : 'font-family:monospace;'
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'ContentPanel',
                    xns: Roo,
                    background : true,
                    fitToFrame : true,
                    region : 'south',
                    title : "Help / Manual"
                }
            ],
            center : {
                xtype: 'LayoutRegion',
                xns: Roo,
                titlebar : false
            },
            south : {
                xtype: 'LayoutRegion',
                xns: Roo,
                titlebar : true,
                listeners : {
                    resized : function (_self, newSize)
                    {
                        var sz = _this.dialog.size;
                        _this.form.findField('value').setSize(sz.width-30, sz.height- newSize  - 100);
                        if (_this.help && newSize > 21) {
                           _this.help.setSize(sz.width-25, newSize-28);
                        }
                    },
                    collapsed : function (_self)
                    {
                        this.fireEvent('resized', this, 20);
                    },
                    expanded : function (_self)
                    {
                       this.fireEvent('resized', this, this.getBox().height);
                    }
                },
                height : 300,
                collapsible : true,
                split : true,
                collapsedTitle : 'Help / Manual'
            },
            buttons : [
                {
                    xtype: 'Button',
                    xns: Roo,
                    text : "Cancel",
                    listeners : {
                        click : function (_self, e)
                        {
                        
                            _this.dialog.hide();
                        }
                    }
                },
                {
                    xtype: 'Button',
                    xns: Roo,
                    listeners : {
                        click : function (_self, e)
                        {
                            _this.callback.call(_this, {
                               value : _this.form.findField('value').getValue()
                            });
                            _this.dialog.hide();
                        }
                    },
                    text : "OK"
                }
            ]
        });
    }
};
