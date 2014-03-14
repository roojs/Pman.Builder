//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Tab.BuilderView = new Roo.XComponent({
    part     :  ["Builder","View"],
    order    : '001-Pman.Tab.BuilderView',
    region   : 'center',
    parent   : 'Pman.Tab.BuilderTab',
    name     : "Pman.Tab.BuilderView",
    disabled : false, 
    permname : '', 
    _tree : function()
    {
        var _this = this;
        var MODULE = this;
        return {
            xtype: 'NestedLayoutPanel',
            xns: Roo,
            listeners : {
                activate : function (_self)
                {
                    _this.panel = _self;
                    Pman.Builder.View.init(_this);
                }
            },
            region : 'center',
            title : "View",
            clearAll : function(isAuto) {
            
                Pman.Builder.View.clearAll(isAuto);
            },
            munge : function(cfg, keyname) {
                 return Pman.Builder.View.munge(cfg,keyname);
                    
                    
            },
            redraw : function(isAuto)
                {
                    Roo.log('Pman.Tab.BuilderView.redraw');
                  return Pman.Builder.View.redraw(isAuto);
                },
            toJS : function(n) {
                return Pman.View.Builder.toJS(n);
             
            },
            layout : {
                xtype: 'BorderLayout',
                xns: Roo,
                items : [
                    {
                        xtype: 'ContentPanel',
                        xns: Roo,
                        region : 'center'
                    }
                ],
                center : {
                    xtype: 'LayoutRegion',
                    xns: Roo,
                    alwaysShowTabs : false,
                    tabPosition : 'top'
                }
            }
        };
    }
});
