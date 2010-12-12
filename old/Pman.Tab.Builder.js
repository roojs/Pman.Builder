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
            listeners : {
                activate : function (_self)
                {
                    if (_this.keyListener) {
                        return;
                    }
                    _this.keyListener = true;
                    
                    Roo.get(document).on(   'keyup',  function(e) {
                        if (!  _this.panel.active ) {
                            return;
                        }
                         
                        // check..
                        if (!Pman.Tab.BuilderPanel.isMouseOver && !Pman.Tab.BuilderTree.isMouseOver) {
                            return;
                        }
                       // console.log(e);
                        //Roo.EventObject.DELETE,
                        if (e.getCharCode() == Roo.EventObject.DELETE) {
                            //  console.log('delete');
                          
                            var res = Pman.Tab.BuilderTree.deleteCurrent();
                            if (res) {
                                 var bp = Pman.Tab.BuilderPanel;
                                 bp.redraw.defer(100,bp, [ true ]);
                                
                            }
                            e.stopEvent();
                        }
                        
                         
                     });
                 
                }
            },
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
                    split : true,
                    width : 255
                },
                center : {
                    xtype: 'LayoutRegion',
                    xns: Roo
                },
                east : {
                    xtype: 'LayoutRegion',
                    xns: Roo,
                    collapsed : true,
                    collapsible : true,
                    split : true,
                    title : "Palete",
                    titlebar : true,
                    width : 200
                }
            }
        });
        this.layout = this.panel.layout;

    }
});
