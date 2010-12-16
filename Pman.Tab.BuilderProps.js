//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        modKey : '001-Pman.Tab.BuilderProps',
        module : Pman.Tab.BuilderProps,
        region : 'south',
        parent : Pman.Tab.BuilderTree,
        name : "Pman.Tab.BuilderProps",
        disabled : false, 
        permname: '' 
    });
});

Pman.Tab.BuilderProps = new Roo.util.Observable({

    panel : false,
    disabled : false,
    parentLayout:  false,

    add : function(parentLayout, region)
    {

        var _this = this;
        this.parentLayout = parentLayout;

        this.panel = parentLayout.addxtype({
            xtype: 'GridPanel',
            xns: Roo,
            region : '',
            grid : {
                xtype: 'PropertyGrid',
                xns: Roo.grid
            }
        });
        this.layout = this.panel.layout;

    }
});
