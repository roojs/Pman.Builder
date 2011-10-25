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
                                    // nodedragover handles the allow/disallow..
                                    
                                    /*
                                    tree - The TreePanel
                                    target - The node being targeted for the drop
                                    data - The drag data from the drag source
                                    point - The point of the drop - append, above or below
                                    source - The drag source
                                    rawEvent - Raw mouse event
                                    dropNode - Drop node(s) provided by the source OR you can supply node(s) to be inserted by setting them on this object.
                                    cancel - Set this to true to cancel the drop.
                                    */
                                    var np = e.point == 'append' ? e.target : e.target.parentNode ; // new parent
                                      
                                    if (!e.tree || !e.dropNode) {
                                    
                                        // form palete...
                                        var data  = e.source.dragData.selections[0].data;
                                
                                        var xar = data.name.split('.');
                                
                                        var cfg = {
                                            'xtype' : xar.pop(),
                                            '|xns' : xar.join('.')
                                            
                                        };
                                        if (_this.dragProp.length > 1) {
                                            cfg['*prop'] = _this.dragProp;
                                        }
                                        // at this point it should of a set of options...
                                         var cls = cfg['|ns'] + '.' + cfg['xtype'];
                                            
                                
                                        if (typeof(Pman.Builder[cls]) != 'undefined') {
                                            Pman.Dialog.BuilderAdd.show( cfg , function(fdata ) {
                                
                                            
                                                this.appendNode(e.target, cfg, e.point);
                                                 Pman.Tab.BuilderView.panel.redraw();
                                             })
                                         } else {
                                             this.appendNode(e.target, cfg, e.point);
                                         }
                                        return; // fixme drop of elements from palete..
                                    }
                                
                                    // always drop onto own parent
                                    if (np == e.dropNode.parentNode) {
                                        if (e.rawEvent.ctrlKey) {
                                            e.dropNode = this.dupeNode(e.dropNode);
                                        }
                                        return true;
                                    }
                                    // can append has to use palete...
                                    // this code should be in nodedragover.
                                    
                                    Roo.log("move checks need moving");
                                    return;
                                    
                                    if (_this.canAppend(np, e.dropNode.elConfig)) {
                                        if (e.rawEvent.ctrlKey) {
                                            e.dropNode = _this.dupeNode(e.dropNode);
                                              
                                            if (np.elConfig.xtype == 'GridEditor') {
                                                e.dropNode.elConfig['*prop'] = 'field';
                                            }
                                            
                                        }
                                        return true;
                                    }  
                                    Roo.log('can not drop ' + e.dropNode.elConfig.xtype + ' ontop of ' + np.elConfig.xtype);
                                    
                                    
                                    
                                    return false;
                                                        
                                
                                },
                                nodedrop : function (e)
                                {
                                    
                                    Roo.log("Node Drop");
                                    return;
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
                                         this.setCurrentNode(node);
                                         
                                              _this.menu = Roo.factory(_this.menu);
                                    
                                            _this.menu.show(node.ui.textNode, 'tr');
                                         return;
                                        var xt = node.elConfig.xtype;
                                        var altx= false;
                                        if (typeof(node.elConfig['*prop']) != 'undefined') {
                                            altx = node.parentNode.elConfig.xtype +'.' + node.elConfig['*prop'];
                                        }
                                        var mn = Pman.Tab.BuilderPalete.getMenu(xt,altx);
                                        
                                        
                                        if (mn) {
                                            mn.show(e.getTarget());
                                        }
                                        
                                
                                
                                },
                                nodedragover : function (e)
                                {
                                    Roo.log('nodedragover');
                                     Roo.log(e);
                                     // e.cancel..
                                     // if we have within the same tree:
                                       // dropNode (the node being dragged !!important!!) 
                                       // point: below, append
                                       // target - node 
                                    // for palete
                                        // dropNode = false;
                                        // grid = the grid...
                                        // source.dragData.selections[..] 
                                   
                                    
                                    // we can only check parents... (we in theory can check dupe properties.. but let's ignore that for the time being.)
                                    
                                    // ok off we go.
                                    
                                    if (!e.dropNode) {
                                        // drag from palete..
                                        if (!e.source.dragData.selections.length) {
                                            e.cancel = true;
                                            return;
                                        }
                                        var drop_rec = e.source.dragData.selections[0];
                                        var drop_xtype = drop_rec.data.name;
                                        var ok_parents = drop_rec.json.parents;
                                        
                                        Roo.log("TEST PARENTS: " + ok_parents.join(', '));
                                        var new_parent = this.nodeXtype((e.point == 'append') ? e.target :  e.target.parentNode);
                                        Roo.log("NEW PARENT: " + e.point + " = " + new_parent);
                                        
                                        // see if the new_parent is actually in the list of ok_parents
                                        e.cancel = true;
                                        _this.dragProp = '';
                                        
                                        Roo.each(ok_parents, function(n) {
                                            if (n == new_parent || n.split(':').shift() == new_parent) {
                                                Roo.log("got match!");
                                                e.cancel = false;
                                                _this.dragProp = (n == new_parent) ?  '' : n.split(':').pop();
                                                return true;
                                            }
                                        });
                                
                                        // done all the checks...
                                        return;
                                        
                                    }
                                     
                                   
                                }
                            },
                            animate : false,
                            containerScroll : true,
                            ddGroup : 'component',
                            enableDD : true,
                            rootVisible : true,
                            appendNode : function(parent, inConfig, point) {
                                
                                    
                             
                                var items = [];
                                if (inConfig.items) { // loading!
                                    items = inConfig.items;
                                    delete inConfig.items;
                                }
                                
                                var config = this.cloneConfig(inConfig);
                                
                                if (!parent) {
                            	parent = this.root;
                                }
                                      
                                var newNode = new Roo.tree.TreeNode({
                                        text: this.configToText(config)
                                });
                                        
                                
                                newNode.elConfig = config;
                                //if (markUndo === true) {
                                //Pman.Tab.Builder.markUndo("Add " + newNode.text);
                                //
                                    // appends to our tree...
                                console.log("APPEND NODE: " + point);    
                                switch(point) {
                                    case 'above':
                                        parent.parentNode.insertBefore(newNode, parent);
                                        break;
                                    case 'below':
                                        // if it's the last node.. then we append..
                                        var ix = parent.parentNode.indexOf(parent) + 1;
                                        if (parent.parentNode.childNodes.length == ix) {
                                             parent.parentNode.appendChild(newNode);
                                             break;
                                        }
                                        var bef = parent.parentNode.childNodes[ix];
                                        parent.parentNode.insertBefore(newNode, bef);
                                        break;
                                    
                                    case 'append':
                                    default:    
                                        parent.appendChild(newNode);
                                        break;
                                }
                                    
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
                                return this.nodeXtype(this.currentNode);
                             
                            },
                            defaultElConfig : function() {
                                return {
                                   xtype : '*top',
                                    
                                    module : 'TestApp',
                                    part:   'Partname',
                                    modkey : 0,
                                    region : 'center',
                                    parent : 'Pman',
                                    name : 'Module Name',
                                    items: [] 
                                };
                            },
                            deleteCurrent : function() {
                                if (this.currentNode == this.root) {
                                    return false;
                                }
                                var cfg = this.currentNode.elConfig;
                                // things that can not be deleted...
                               
                                
                                var pn = this.currentNode.parentNode;
                                
                                
                                var ix = pn.indexOf(this.currentNode);
                              //  console.log(ix);
                                pn.removeChild(this.currentNode);
                                if (pn.childNodes.length) {
                                    ix = Math.min(pn.childNodes.length-1, ix);
                                }
                                this.setCurrentNode(pn.childNodes.length ? pn.childNodes[ix] : pn  ,true);
                                return true;
                            },
                            dupeNode : function(node)
                                {
                                    var cfg = this.cloneConfig(node.elConfig);
                                    
                                    var newNode = new Roo.tree.TreeNode(
                                    {
                                            id: Roo.id(),
                                            text: this.configToText(cfg)
                                    });
                                    
                                    newNode.elConfig = cfg;
                                    node.eachChild(function(n) {
                                        newNode.appendChild(this.dupeNode(n));
                                    },this);
                                    
                                    return newNode;
                                        
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
                                        
                                        if (!res.data.json.length) {
                                            var cfg = _t.defaultElConfig();
                                            cfg.name = Pman.Tab.BuilderTop.filesel.lastData.name;
                                            cfg.part = Pman.Tab.BuilderTop.filesel.lastData.name;
                                            cfg.module = '';
                                            _t.loadTree(cfg);
                                            return;
                                        
                                        }
                                        
                                        _t.loadTree(JSON.parse(res.data.json));
                                        
                                     
                                    }
                            
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
                            nodeXtype : function(n) {
                                 if (!n) {return ''; }
                                var xt = n.elConfig.xtype ||  '';
                                var xns= n.elConfig['|xns'] ||   '';
                                xns += xns.length ? '.' : '';
                                return xns + xt;
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
