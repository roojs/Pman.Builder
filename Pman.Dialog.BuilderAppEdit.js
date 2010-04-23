//<script type="text/javascript">
//
// Version 20100423-140831
//
// Auto generated file - do not edit directly
// created by Application Builder (Web version)
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
           this.form.fireEvent('actioncomplete', this.form,  { type: 'setdata', data: data });
        }

    },

    create : function()
    {
        var _this = this;
        this.dialog = Roo.factory({
            xtype : 'LayoutDialog',
            background : true,
            width : 500,
            height : 200,
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
                                   if (action.type == 'submit') {
                                       
                                       _this.dialog.el.unmask();
                                       _this.dialog.hide();
                                       
                                        if (_this.callback) {
                                           _this.callback.call(_this, _this.form.getValues());
                                        }
                                        _this.form.reset();
                                    
                                    }
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
                                },
                                {
                                    name : 'gitpath',
                                    fieldLabel : "Git Path",
                                    width : 350,
                                    xtype : 'TextField'
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
/*
--SOURCE--
QlpoNDFBWSZTWbJJD0AAA8rfgGgAUP36Gj/O346/79/+UANmC282nbrMrCSQqafqmZTwQ000hoGjEAAD
TQAJJJkBD1T1NND1PU0MgAeoANPUaAAk1JBAp5qIZoTNQGgAaANAGmhzAJgJkYARiYmEwmCGmJpgJIk0
1GU2o9TyTJo0GQaBoAAAMjwBeQAwXXC7MurD3edXp4XGG1vk3BlhCDENXPH1xdsxE+qvqPvVq1vgS9L3
/E7a1lqhXY84oRt28V2kpYwGypG30rKoKNY2yjLhb8Wxf/GuIQ4OwGeFnZRhoqrgmqENrDasViIwZFSA
odUGSmFQUVBiKHXsM/ksZb3Lz46t+/ZTVYGxDS2zHHzVzs0uiu/TVwZtV0LE1mFA8lWsygpgsEYUyktF
SktJ3c2rMBzXSoVRr3rGFiTdnlNLNXoc0w9aRo3YCSC+lUyaBewW3DTmcK4fOZ1ssDJhepKmPLQcGIH3
VMzjQzqGd03j5FXU597lDPPnsVccMN3g6DxzxY2lhRtO4SjJlocmMmInRWAx2Ozs+dGLj0bwSWkbJ6X8
f8sGgDnkj6KhWzHrRt3T+6a6rjst3Ncj7mxkgVYS5SXh2bQla2ntidCvuSJEh2LR5BLS9MxSprpyUbDA
HvyUEyjKoYBfCndKDoX7VXpo4TfYVtqUypelrMrSbjhxEVTLqmay8e87XSaubIjGsaVSCtEY0yIU4w9m
VAKMFMdEY10GlbeKCCq5FiK0WuFYBB80bSWkwCzkkw9JUY6b9QyIUEfuw7w5FyBnoxqtWzZZKRPGSkFN
YTI/ry69pnhmM/Z1RjMybMUjrdVoxk4pluVS3zBQmMM6CgqBU42SIUygBqCfMS3DbnSheY59OqH5AKkR
jVBgaKtgS628BVyhLX3DXzUHMbIKhPCrhx2H4DXwMBIltDANwZgrMmVgi8tJH1lpQQcXrglZNWs/mOye
1gPYonfVDJuSDtjRx7qtFYZCukFaFeBlah6wUcQlRyxRq50E5ZU8ysugrPhwxZR5FsFW8zTHDRMQZEAU
dxignMoaolHfQtg2ilYU7mCVS7aFyuwVg34pkUixGEjingYbhl2ERYiOEnnaSvoihTvY4wlZ9hoPJ3YY
4A4w2pQGiQqdNCDinXR675awy+9H/i7kinChIWSSHoA=
*/