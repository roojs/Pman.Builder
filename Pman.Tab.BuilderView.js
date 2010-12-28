//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        modKey : '001-Pman.Tab.BuilderView',
        module : Pman.Tab.BuilderView,
        region : 'center',
        parent : Pman.Tab.BuilderTab,
        name : "Pman.Tab.BuilderView",
        disabled : false, 
        permname: '' 
    });
});

Pman.Tab.BuilderView = new Roo.util.Observable({

    panel : false,
    disabled : false,
    parentLayout:  false,

    add : function(parentLayout, region)
    {

        var _this = this;
        this.parentLayout = parentLayout;

        this.panel = parentLayout.addxtype({
            xtype: 'ContentPanel',
            xns: Roo,
            listeners : {
                activate : function (_self)
                {
                    _this.panel = _self;
                }
            },
            region : 'center',
            title : "View",
             : function() {
            //        this.renderObj = { isBuilder : true };
            
                    if (isAuto && btop.redrawBtn  && !btop.redrawBtn.auto) {
                        return; /// auto redraw is turned off..
                    }
                   
                    
                    if (this.panelroot) {
                        this.scroll = this.panelroot.el.getScroll();
                        this.layout.remove('center', this.panelroot);
                        this.panelroot = false;
                    }
                    if (this.dialogroot) {
                        this.dialogroot.remove();
                        this.dialogroot = false;
                    }
            }
        });
        this.layout = this.panel.layout;

    }
});
