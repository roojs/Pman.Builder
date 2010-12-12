//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        modKey : '001-Pman.Tab.BuilderTab',
        module : Pman.Tab.BuilderTab,
        region : 'center',
        parent : false,
        name : "Builder - Tab",
        disabled : false, 
        permname: '' 
    });
});

Pman.Tab.BuilderTab = new Roo.util.Observable({

    panel : false,
    disabled : false,
    parentLayout:  false,

    add : function(parentLayout, region)
    {

        var _this = this;
        this.parentLayout = parentLayout;

        this.panel = parentLayout.addxtype({
            xtype: 'NestedLayoutPanel',
            xns: Roo,
            listeners : {
                activate : function (_self)
                {
                   _self.layout.getRegion('center').showPanel(0)
                }
            },
            background : true,
            fitToFrame : true,
            region : 'center',
            title : "Customize",
            layout : {
                xtype: 'BorderLayout',
                xns: Roo,
                center : {
                    xtype: 'LayoutRegion',
                    xns: Roo,
                    titlebar : false,
                    tabPosition : 'top'
                }
            }
        });
        this.layout = this.panel.layout;

    }
});
