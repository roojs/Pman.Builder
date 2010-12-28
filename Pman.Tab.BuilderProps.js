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
                    }
                },
                setSource : function() {
                    
                },
                setCurrrentNode : function(node) {
                   
                    
                    this.view.el.unmask();
                    
                    if (!node || !node.elConfig) {
                        this.currentNode = false;
                        this.setSource({});
                        this.view.el.mask('select a node');
                    } else {
                        this.currentNode = node;
                        this.setSource(this.currentNode.elConfig);
                        
                    }
                    
                }
            }
        });
        this.layout = this.panel.layout;

    }
});
