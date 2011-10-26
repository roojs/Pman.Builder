//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        part :  ["Builder","Database"],
        modKey : '001-Pman.Tab.BuilderDatabase',
        module : Pman.Tab.BuilderDatabase,
        region : 'center',
        parent : false,
        name : "unnamed module",
        disabled : false, 
        permname: '' 
    });
});

Pman.Tab.BuilderDatabase = new Roo.util.Observable({

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
            loadOnce : true
        });
        this.layout = this.panel.layout;

    }
});
