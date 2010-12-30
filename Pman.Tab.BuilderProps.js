//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        modKey : '001-Pman.Tab.BuilderProps',
        module : Pman.Tab.BuilderProps,
        region : 'center',
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
            region : 'south',
            grid : {
                xtype: 'PropertyGrid',
                xns: Roo.grid,
                listeners : {
                    render : function (grid)
                    {
                        _this.grid = grid;
                    },
                    afteredit : function (e)
                    {
                       // change this..
                       //this.currentNode.elConfig
                       
                       
                    },
                    cellclick : function (_self, rowIndex, ci, e)
                    {
                         if (ci != 0) {
                            return;
                        }
                        //console.log(e);
                        // click on left col..
                        // show menu..
                        _this.panel.menu.show(e.getTarget(), 'tr');
                    }
                },
                setCurrrentNode : function(node) {
                   
                    
                    this.view.el.unmask();
                    
                    if (!node || !node.elConfig) {
                        this.currentNode = false;
                        this.setSourceFromNode({});
                        this.view.el.mask('select a node');
                    } else {
                        this.currentNode = node;
                        this.setSourceFromNode(this.currentNode.elConfig);
                        
                    }
                    
                },
                setSourceFromNode : function(config) {
                   
                        
                    var cfg = {};
                    for (var k in config) {
                        //if (k.charAt(0) == '*') {
                        //    continue; // dont show props..
                        //}
                        
                        if (k  == 'listeners') {
                            for (var kk in config[k]) {
                                cfg['!' + kk ] = config[k][kk];
                            }
                            
                            continue;
                        }
                        if (k  == 'items') {
                            continue;
                        }
                        
                        if (typeof config[k] == 'object') {
                            
                            try {
                                var ec = Roo.encode(config[k]);
                                cfg[k] = ec;
                            } catch(e) {}
                            continue;
                        }
                        cfg[k] = config[k];
                    }
                    
                    if (!cfg.xtype) {
                        return;
                    }
                
                    this.setSource(cfg);
                
                    
                      
                }
            },
            menu : {
                xtype: 'Menu',
                xns: Roo.menu,
                items : [
                    {
                        xtype: 'Item',
                        xns: Roo.menu,
                        text : "Delete Property / Event'"
                    }
                ]
            }
        });
        this.layout = this.panel.layout;

    }
});
