//<script type="text/javascript">

// Auto generated file - created by Builder Module - do not edit directly
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
            xns: Roo,
            background : true,
            width : 400,
            height : 400,
            title : "View Generated Code",
            modal : true,
            resizable : false,
            collapsible : false,
            closable : false,
            listeners : {
                show: function (_self)
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
                            
                            _this.previewContentPanel.load({
                                url: baseURL + '/Builder/Code.php',
                                method: 'GET',
                                params: {
                                    id: _this.data.id
                                    
                                }
                            });
                            
                }
            },
            items : [
                {
                    xtype : 'ContentPanel',
                    background : false,
                    fitToFrame : true,
                    region : 'center',
                    listeners : {
                        activate: function (_self)
                        {
                        _this.previewContentPanel = _self;
                        }
                    },
                    autoScroll : true
                }
            ],
            center : {
                titlebar : false
            },
            buttons : [
                {
                    text : "OK",
                    xtype : 'Button',
                    xns: Roo,
                    listeners : {
                        click: function() {
                            _this.dialog.hide();
                        
                        }
                    }
                }
            ]
        });
    }
};
