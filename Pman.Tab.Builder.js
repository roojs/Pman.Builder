//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        modKey : '750-Pman.Tab.Builder',
        module : Pman.Tab.Builder,
        region : 'center',
        parent : Pman,
        name : "Pman.Tab.Builder",
        disabled : false, 
        permname: 'Builder' 
    });
});

Pman.Tab.Builder = new Roo.util.Observable({

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
            title : "Customize",
            layout : {
                xtype: 'BorderLayout',
                xns: Roo,
                north : {
                    xtype: 'LayoutRegion',
                    xns: Roo,
                    height : 26
                },
                west : {
                    xtype: 'LayoutRegion',
                    xns: Roo,
                    width : 255
                },
                center : {
                    xtype: 'LayoutRegion',
                    xns: Roo
                }
            }
        });
        this.layout = this.panel.layout;

    }
});
