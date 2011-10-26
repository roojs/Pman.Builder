//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        part :  ["Builder","Tree"],
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
                                
                                _this.tree = _self.tree;
                                _this.menu = _self.menu;
                            
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
                                beforenodedrop : function (e)
                                {
                                    
                                    return Pman.Builder.Tree.handleDropNode(e);      
                                
                                },
                                click : function (node, e)
                                {
                                      e.preventDefault();
                                                       // console.log(e.button);
                                        Pman.BuilderTree.setCurrentNode(node);
                                        
                                    
                                        
                                
                                },
                                contextmenu : function (node, e)
                                {
                                    e.stopEvent();
                                        
                                    this.getSelectionModel().select(node);
                                     Pman.Builder.Tree.setCurrentNode(node);
                                     
                                          _this.menu = Roo.factory(_this.menu);
                                
                                        _this.menu.show(node.ui.textNode, 'tr');
                                     return;
                                     
                                     /*
                                    var xt = node.elConfig.xtype;
                                    var altx= false;
                                    if (typeof(node.elConfig['*prop']) != 'undefined') {
                                        altx = node.parentNode.elConfig.xtype +'.' + node.elConfig['*prop'];
                                    }
                                    var mn = Pman.Tab.BuilderPalete.getMenu(xt,altx);
                                    
                                    
                                    if (mn) {
                                        mn.show(e.getTarget());
                                    }
                                    
                                 */
                                
                                },
                                nodedragover : function (e)
                                {
                                    
                                        return Pman.Builder.Tree.handleDragOver(e);      
                                 
                                     
                                   
                                }
                            },
                            animate : false,
                            containerScroll : true,
                            ddGroup : 'component',
                            enableDD : true,
                            rootVisible : true,
                            renderer : function(n) { return n.text; },
                            setCurrentNode : function(node,select) {
                                    this.currentNode = node || this.root;
                                    
                                    //Pman.Tab.BuilderView.highlightElement(this.currentNode);
                            
                                    var p = Pman.Tab.BuilderProps.grid;
                                    if (p) { //may not be ready yet..
                                        p.setCurrrentNode(this.currentNode);
                                    }
                                    
                                  
                                    this.currentNode.setText(this.configToText(this.currentNode.elConfig));
                                    
                                    if (select) { //&& node !== this.tree.root) {
                                        if (this.currentNode !== this.root)  {
                                                 this.currentNode.ensureVisible();
                                          }   
                                         this.currentNode.expand(false,false);
                                        this.currentNode.select();
                            	}
                            	// update palete..
                            	Pman.Tab.BuilderPalette.grid.getSelectionModel().clearSelections();
                            	Pman.Tab.BuilderPalette.grid.view.refresh();
                            
                            },
                            toJS : function(n)
                            {
                                if (!n) {
                                    return this.toJS(this.root);
                                }
                                var _this = this;
                                var ret = this.cloneConfig(n.elConfig);
                                if (n.childNodes.length) {
                                    ret.items = [];
                                    n.eachChild(function(cn) {
                                        ret.items.push(_this.toJS(cn));
                                    });
                                        
                                }
                                return ret;
                                  
                                 
                            },
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
                                         xtype : '*top',
                                            
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
                        },
                        menu : {
                            xtype: 'Menu',
                            xns: Roo.menu,
                            items : [
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    listeners : {
                                        click : function (_self)
                                        {
                                            Roo.MessageBox.confirm("Confirm", "Are you sure you want to delete that node?",
                                                function(r) {
                                                    if (r!='yes') {
                                                        return;
                                                    }
                                                    _this.tree.deleteCurrent();
                                                }
                                            );
                                                
                                        }
                                    },
                                    text : "Delete Node"
                                },
                                {
                                    xtype: 'Item',
                                    xns: Roo.menu,
                                    text : "Save as template"
                                }
                            ]
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
