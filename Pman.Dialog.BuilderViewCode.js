//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Dialog.BuilderViewCode = {

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
                    if (_this.isBuilder) {
                       return;
                    }
                    _this.dialog = _self;        
                    _this.dialog.getLayout().beginUpdate();
                     
                    _this.dialog.resizeTo( Roo.lib.Dom.getViewWidth() - 70, Roo.lib.Dom.getViewHeight() - 70);
                    _this.dialog.getLayout().getRegion('center').resizeTo(Roo.lib.Dom.getViewWidth() - ( 70 + 50 ));
                 
                    
                    _this.dialog.moveTo(35,35);
                    
                    _this.dialog.getLayout().endUpdate();
                    
                    _this.previewContentPanel.setContent(
                        '<PRE>' + Roo.util.Format.htmlEncode(_this.data.jsource) + '</PRE>'
                    );
                        
                    
                    _this.previewContentPanel.load({
                        url: baseURL + '/Roo/Code.php',
                        method: 'GET',
                        params: {
                            id: _this.data.id
                            
                        }
                    });
                            
                }
            },
            background : true,
            closable : false,
            collapsible : false,
            height : 400,
            modal : true,
            resizable : false,
            title : "View Generated Code",
            width : 400,
            items : [
                {
                    xtype: 'ContentPanel',
                    xns: Roo,
                    listeners : {
                        activate : function (_self)
                        {
                        _this.previewContentPanel = _self;
                        }
                    },
                    autoScroll : true,
                    background : false,
                    fitToFrame : true,
                    region : 'center'
                },
                {
                    xtype: 'ContentPanel',
                    xns: Roo
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
                    text : "OK",
                    listeners : {
                        click : function() {
                            _this.dialog.hide();
                        
                        }
                    }
                }
            ]
        });
    }
};
