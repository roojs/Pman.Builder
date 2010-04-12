//<script type="text/javascript">

// Auto generated file - created by Builder Module - do not edit directly
Pman.Dialog.BuilderSaveAs = {

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
           this.form.fireEvent('actioncomplete', this.form,  { type: 'setdata', data: data });
        }

    },

    create : function()
    {
        var _this = this;
        this.dialog = Roo.factory({
            xtype : 'LayoutDialog',
            xns: Roo,
            background : true,
            width : 400,
            height : 180,
            title : "Save As",
            modal : true,
            resizable : false,
            collapsible : false,
            closable : false,
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
                            url: baseURL + '/Roo/Builder.php',
                            method : 'POST',
                            listeners : {
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
                                    name : 'name',
                                    fieldLabel : "Descriptive name",
                                    width : 250,
                                    xtype : 'TextField',
                                    allowBlank : false
                                },
                                {
                                    name : 'app',
                                    fieldLabel : "Part Of Module",
                                    width : 150,
                                    xtype : 'TextField',
                                    allowBlank : false
                                },
                                {
                                    name : 'module',
                                    fieldLabel : "JS Class Name",
                                    width : 250,
                                    xtype : 'TextField',
                                    allowBlank : false
                                },
                                {
                                    name : 'json',
                                    xtype : 'Hidden'
                                },
                                {
                                    name : 'btype',
                                    xtype : 'Hidden',
                                    value : 'FORM'
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
                    text : "Cancel",
                    xtype : 'Button',
                    xns: Roo,
                    listeners : {
                        click:  function() {
                        
                                                            _this.form.reset();
                        
                                                            _this.dialog.hide();
                        
                                                        }
                        
                    }
                },
                {
                    text : "OK",
                    xtype : 'Button',
                    xns: Roo,
                    listeners : {
                        click: function() {
                           if (!_this.form.isValid()) {
                                Roo.MessageBox.alert("Error", "Correct the errors in red");
                                return;
                             }
                            
                            var tp = Pman.Tab.BuilderTop2;
                            var tr = Pman.Tab.BuilderTree; 
                            var data = _this.form.getValues();
                            tr.tree.root.elConfig.app = data.app;
                            tr.tree.root.elConfig['|module'] = data.module;
                            tr.tree.root.elConfig.name = data.name;
                            tr.setCurrentNode(tr.tree.root, true);
                            tp.filesel.setFromData(data);
                            tp.saveBtn.fireEvent('click', tp.saveBtn, false, false);
                        
                            
                            
                            _this.dialog.hide();
                        
                        }
                        
                    }
                }
            ]
        });
    }
};
/*
--SOURCE--
QlpoNDFBWSZTWQY3ueYAA9J/gGQAAARw//ZaP1/fDr//3/5QA4mM0WsWxowkUQCYmImE8ppR7JT9RPUa
aPeqmn6k9TRhqGIGQSYpqYJmoHqNGgAABoAxBo0DNU1DVPJqeoGgAAAAAAAANDjJkyYjEwAmTBMgBowj
AEMBxkyZMRiYATJgmQA0YRgCGCQBB7gQwbVfsjy9/X74f1+sc/avXV8PjyMceUcG7YKqUakJvo2JRRKz
XexIHC5pTy/CiqywxextPIYVGs8zY7FjKGbG4+aALSCpLCEIizZtAoQqQikIuRlkhkQxd3qorlS2r7eQ
AmlfYMaExANA2gQj9TGIbGIQwYgEsNdorrc23M9Ixpq66dAU60Z9blEtCJPUhKooszq6FgY6UM4ogYnA
2Igi1FoimiIE+/5FPazKS24rWuaIcJhzQeUdITkcmGi+/PNZ8ApeZn1PDaIQaesbdE8siN9CU7J/0oWH
d3FTC+VGrpKsFijFKlUD3ybRbE0lpEYeuR2dkD41SSLpd8JZ5e3OwiqZC/jHj2I1TVc8enof45imjAi5
VCVRUH2uTnKiigoH5O0XidF9cPUO/Z57V/oc0H1k1L/GlufNfLl6VXWOFS0zzQkt82H2q8s1HiWHc4LW
yBdQMWH8MDicYmyZcruGcs9eBDAhrZoBjUIAQBv5K7ycCFyJA8A1CHCUhDCx0XJAO5qmmPAgqi6gDoSm
3n1jG6boKjbIuGakjQVZB1CA3rBRZfjCg8tCvwk0HFShp8KSw8EutaVqIMGSbyhjOyWFm88jSimYgljh
rNhheqH9FiZh4r0LW1diKEbNLGYSUivrSI2ImVsMjamrEVbIB81VziLcK8K8mEsGnCgUlrJIrUlqSpIs
kPwmhyCh3xemRjIaneIQlEhSVuEymylqdeWNync1ZIbVjkzycKDKFBHdu4+HfBtag13XnXqILcoPmiUV
by4NSxq0hAxIrKripjCKhGZJbtodB3fxupkUE3BDVN1s7kymDDLsmsj0r3cLUO2cMCk7j5zz/S+LSNDu
RlTypTOAhiRRUTONoPWRSucI4cC439QsyRVTf3RsXIwtghrmUJSNMahQRckSrQekMcBUWqUupO02Kj2N
t+trYEfUF6ru+/UJbtiHYLULvW0+y/viTFXVgt51NcJ1KG2GhYIkEpq2NJUeZ5tNv2wIG1dm9QApXQNe
DBK2sUS/I/q8BRVVJzhf4u5IpwoSAMb3PMA=
*/
