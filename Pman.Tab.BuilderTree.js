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
                                
                                _this.tree = _self.tree;
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
                                        this.setCurrentNode(node);
                                
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
                            appendNode : function(parent, inConfig, markUndo) {
                                
                                    
                             
                                var items = [];
                                if (inConfig.items) { // loading!
                                    items = inConfig.items;
                                    delete inConfig.items;
                                }
                                var config = this.cloneConfig(inConfig);
                                
                                if (!parent) {
                            	parent = this.root;
                                }
                                    
                                    
                                //var canAppend = this.canAppend(parent,config);
                                //if (canAppend !== true) {
                                //    console.log("Unable to add element " + canAppend);
                                //	Roo.Msg.alert("Unable to add element", canAppend);
                                //		return false;
                               //		}
                                     
                                var newNode = new Roo.tree.TreeNode({
                                        text: this.configToText(config)
                                });
                                        
                                
                                newNode.elConfig = config;
                                //if (markUndo === true) {
                                //Pman.Tab.Builder.markUndo("Add " + newNode.text);
                                //
                                    // appends to our tree...
                                parent.appendChild(newNode);
                                
                                    
                                if (items.length) {
                                    Roo.each(items, function(i) {
                                        this.appendNode(newNode, i);
                                    },this);
                                    
                                }
                                    
                                    
                                    /*
                                    -- panels with panes...
                            		if (items && items.length) {
                            			for (var i = 0; i < items.length; i++) {
                            					this.appendConfig(items[i], newNode, false);
                            			}
                            		}
                            		if (opts.doUpdate !== false) {
                            			this.updateForm(false, newNode);
                            		}
                                    */
                                return newNode;
                            
                            	 
                            },
                            clearAll : function() {
                                var rt = this.root;
                                 if (rt.childNodes.length) {
                                    rt.removeChild(rt.childNodes[0]);
                                }
                               
                                this.root.elConfig  = Roo.apply({ }, this.defaultElConfig());  
                                //var btop = Pman.Tab.BuilderTop;
                                //if (btop.modsel && btop.modsel.lastData) {
                                //    this.tree.root.elConfig.app = btop.modsel.lastData.app;
                                //}
                                
                                this.setCurrentNode(this.root,true);
                            
                            },
                            cloneConfig : function(config) {
                                if (!config) { return null; }
                                var newConfig = {};
                                
                                for (var i in config) {
                                    if (typeof config[i] == 'object') {
                                         newConfig[i] = this.cloneConfig(config[i]);
                                    } else if (typeof config[i] != 'function') { // should this happen?
                                         newConfig[i] = config[i];
                                    }
                                }
                                return newConfig;
                            },
                            configToText : function(c) {
                                 
                            	var txt = [];
                            	c = c || {};
                                      var sr = (typeof(c['+buildershow']) != 'undefined') &&  !c['+buildershow'] ? true : false;
                                    if (sr) txt.push('<s>');
                                    if (typeof(c['*prop']) != 'undefined')   { txt.push(c['*prop']+ ':'); }
                            	if (c.xtype)      { txt.push(c.xtype); }
                            	if (c.fieldLabel) { txt.push('[' + c.fieldLabel + ']'); }
                            	if (c.boxLabel)   { txt.push('[' + c.boxLabel + ']'); }
                                
                                
                            	if (c.layout)     { txt.push('<i>' + c.layout + '</i>'); }
                            	if (c.title)      { txt.push('<b>' + c.title + '</b>'); }
                                    if (c.header)    { txt.push('<b>' + c.header + '</b>'); }
                                    if (c.legend)      { txt.push('<b>' + c.legend + '</b>'); }
                            	if (c.text)       { txt.push('<b>' + c.text + '</b>'); }
                                    if (c.name)       { txt.push('<b>' + c.name+ '</b>'); }
                            	if (c.region)     { txt.push('<i>(' + c.region + ')</i>'); }
                                    if (c.dataIndex) { txt.push('[' + c.dataIndex+ ']'); }
                                    if (sr) txt.push('</s>');
                            	return (txt.length == 0 ? "Element" : txt.join(" "));
                             
                              
                            },
                            currentNodeType : function() {
                                if (!this.currentNode) {return ''; }
                                var xt = this.currentNode.xtype ||  '';
                                var xns= this.currentNode['|xns'] ||   '';
                                xns += xns.length ? '.' : '';
                                return xns + xt;
                             
                            },
                            defaultElConfig : function() {
                                return {
                                   xtype : '*Module',
                                    
                                    module : 'TestApp',
                                    part:   'Partname',
                                    modkey : 0,
                                    region : 'center',
                                    parent : 'Pman',
                                    name : 'Module Name',
                                    items: [] 
                                };
                            },
                            loadBJS : function(module, part) {
                                var _t = this;
                                new Pman.Request({
                                    url : baseURL + '/Roo/Builder_part.php',
                                    method : 'GET',
                                    params : {
                                       _id : part
                                    },
                                    success : function(res)         
                                    {
                                        // data is in.. 
                                        Roo.log(res);
                                        _t.loadTree(JSON.parse(res.data.json));
                                        
                                     
                                    },
                            
                                 })  
                                    
                                
                                
                            },
                            loadTree : function(o) {
                                this.clearAll();
                                this.root.elConfig = o;
                                this.root.setText(this.configToText(this.root.elConfig));
                                this.appendNode(this.root, o.items[0]);
                                this.root.expand(true);
                                Pman.Tab.BuilderView.panel.redraw();
                                this.setCurrentNode(this.root,true);
                            },
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
                            	Pman.Tab.BuilderPalette.grid.view.refresh();
                            
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
