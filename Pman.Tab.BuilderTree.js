//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        modKey : '001-Pman.Tab.BuilderTree',
        module : Pman.Tab.BuilderTree,
        region : 'west',
        parent : Pman.Tab.BuilderTab,
        name : "Pman.Tab.BuilderTree",
        disabled : false, 
        permname: '' 
    });
});

Pman.Tab.BuilderTree = new Roo.util.Observable({

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
            region : 'west',
            layout : {
                xtype: 'BorderLayout',
                xns: Roo,
                items : [
                    {
                        xtype: 'ContentPanel',
                        xns: Roo
                    }
                ],
                center : {
                    xtype: 'LayoutRegion',
                    xns: Roo
                },
                south : {
                    xtype: 'LayoutRegion',
                    xns: Roo,
                    height : 300,
                    split : true
                }
            }
        });
        this.layout = this.panel.layout;

    }
});
