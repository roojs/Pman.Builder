//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        modKey : '001-Pman.Tab.BuilderTree',
        module : Pman.Tab.BuilderTree,
        region : 'center',
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
                        xtype: 'TreePanel',
                        xns: Roo,
                        listeners : {
                            activate : function (_self)
                            {
                                this.tree = _self.tree;
                                if (_this.hasMouseEvent) {
                                    return;
                                }
                                _this.hasMouseEvent = true;
                                 this.el.on('mouseover', function() { _this.isMouseOver= true; });
                                this.el.on('mouseout', function() { _this.isMouseOver = false; });
                                   
                            
                            }
                        },
                        region : 'center',
                        tree : {
                            xtype: 'TreePanel',
                            xns: Roo.tree,
                            listeners : {
                                beforenodedrop : function (dropEvent)
                                
                                {
                                  /*tree - The TreePanel
                                                        target - The node being targeted for the drop
                                                        data - The drag data from the drag source
                                                        point - The point of the drop - append, above or below
                                                        source - The drag source
                                                        rawEvent - Raw mouse event
                                                        dropNode - Drop node(s) provided by the source OR you can supply node(s) to be inserted by setting them on this object.
                                                        cancel - Set this to true to cancel the drop.*/
                                                        
                                                        if (!e.tree || !e.dropNode) {
                                                            console.log('no tree or dropNode');
                                                            return; // fixme drop of elements from palete..
                                                        }
                                                        var np = false; // new parent
                                                        
                                                        switch (e.point) {
                                                            case 'above':
                                                            case 'below':
                                                                np = e.target.parentNode;
                                                                break;
                                                            case 'append':
                                                                np = e.target;
                                                                break;
                                                        }
                                                        
                                                        // always drop onto own parent
                                                        if (np == e.dropNode.parentNode) {
                                                            if (e.rawEvent.ctrlKey) {
                                                                e.dropNode = _this.dupeNode(e.dropNode);
                                                            }
                                                            return true;
                                                        }
                                   if (_this.canAppend(np, e.dropNode.elConfig)) {
                                                            if (e.rawEvent.ctrlKey) {
                                                                e.dropNode = _this.dupeNode(e.dropNode);
                                                                  
                                                                if (np.elConfig.xtype == 'GridEditor') {
                                                                    e.dropNode.elConfig['*prop'] = 'field';
                                                                }
                                                                
                                                            }
                                                            return true;
                                                        }  
                                                        console.log('can not drop ' + e.dropNode.elConfig.xtype + ' ontop of ' + np.elConfig.xtype);
                                                        
                                                        
                                                        
                                                        return false;
                                                        
                                
                                },
                                nodedrop : function (dropEvent)
                                {
                                    e.dropNode.setText(
                                                            _this.configToText(e.dropNode.elConfig)
                                                        );
                                                        var bp = Pman.Tab.BuilderPanel;
                                                        bp.redraw.defer(1000, bp, [true]);
                                
                                },
                                click : function (node, e)
                                {
                                  e.preventDefault();
                                                       // console.log(e.button);
                                                        _this.setCurrentNode(node);
                                
                                },
                                contextmenu : function (node, e)
                                {
                                    e.stopEvent();
                                                        
                                                        this.getSelectionModel().select(node);
                                                         _this.setCurrentNode(node);
                                                        var xt = node.elConfig.xtype;
                                                        var altx= false;
                                                        if (typeof(node.elConfig['*prop']) != 'undefined') {
                                                            altx = node.parentNode.elConfig.xtype +'.' + node.elConfig['*prop'];
                                                        }
                                                        var mn = Pman.Tab.BuilderPalete.getMenu(xt,altx);
                                                        
                                                        
                                                        if (mn) {
                                                            mn.show(e.getTarget());
                                                        }
                                                        
                                
                                
                                }
                            },
                            animate : false,
                            containerScroll : true,
                            ddGroup : 'component',
                            enableDD : true,
                            rootVisible : true,
                            renderer : function(n) { return n.text; },
                            sm : {
                                xtype: 'DefaultSelectionModel',
                                xns: Roo.tree
                            },
                            root : {
                                xtype: 'TreeNode',
                                xns: Roo.tree,
                                text : "Part",
                                elConfig : function() {
                                    return  {
                                         xtype : '*Module',
                                            
                                            app : 'TestApp',
                                            // perm
                                            // permtype
                                            modkey : 0,
                                            '|module' :  '',
                                            region : 'center',
                                            '|parent' : 'Pman',
                                            name : "Module Name",
                                            items: [] 
                                
                                    
                                    }
                                }
                            }
                        }
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
