//<script type="text/javascript">

Pman.on('beforeload', function()
{
    
    // always loaded by clipping tree
  
    
    Pman.register({
        modKey : '001-pman-tab-buildertree',
        module : Pman.Tab.BuilderTree,
        region : 'west',
        parent : Pman.Tab.Builder,
        name : "Builder Tree",
        finalize : function()
        {
            Pman.Tab.BuilderTree.layout.getRegion('south').showPanel(0);
        }
    });
    
        
});

Pman.Tab.BuilderTree = {
    grid : false,
    panel : false,
    currentNode : false, // current node to add things to.
    isMouseOver :  false,
    add : function(parentLayout, region) 
    {
         
        // there is no way this should be called twice!!?!?
        //if (this.panel) {
        //    parentLayout.getRegion(region).showPanel(this.panel);
        //    return;
        //}
     
        
        this.layout = new Roo.BorderLayout(
            parentLayout.getEl().createChild({tag:'div'}),
            {
               
                center: {
                    autoScroll:false,
                    hideTabs: true
                },
                south : {
                    split : true,
                    height  : 300,
                    titlebar: false
                }
            }
        );



        this.tab = parentLayout.add(region,  new Roo.NestedLayoutPanel(
            this.layout, {title: "Builder Tree"}));
        
        var _this = this;
         
            _this.delayedCreate();
            //_this.paging.onClick('refresh');
       
    },
    delayedCreate : function()
    {
        
        this.layout.beginUpdate();
        
        var _this = this;
        
        
        var treePanelEl = this.layout.getEl().createChild({tag:'div'});
        var tb = new Roo.Toolbar(treePanelEl.createChild({tag:'div'}), [ 
            
        
        
        ]);
        var treeEl = treePanelEl.createChild({tag:'div'});
        
        this.panel  = this.layout.add('center',  new Roo.ContentPanel(treePanelEl, {
               
            fitToFrame: true,
            fitContainer: true ,
            autoScroll:false,
            //autoCreate:true,
            toolbar: tb, //,
            //resizeEl:treeEl,
            listeners : {
                resize : function (cp, w, h) {
                    _this.tree.innerCt.setWidth(w);
                    _this.tree.innerCt.setHeight(h);
                    _this.tree.innerCt.setStyle('overflow-y', 'auto');
                }
            }
        }));

        this.panel.el.on('mouseover', function() { _this.isMouseOver= true; });
        this.panel.el.on('mouseout', function() { _this.isMouseOver = false; });
       

        
        this.tree = new Roo.tree.TreePanel(treeEl , 
            {
                
                containerScroll: true,
            
                    
               /* width: 550,
                height: 300,
                */
                rootVisible : true,
                    
                 
                
                loadMask: true,
                listeners : {
                     
                    rowdblclick : function(g, ri, e) {
                        //var s = g.getDataSource().getAt(ri).data;
                      
                       // _dialog.show(s, refreshPager); 
                    } 

                },
                
                iconCls         : "icon-el",
                collapsible     : true,
                floatable       : false,
                ddScroll        : true,
               
                animate         : false,
                enableDD        : true,
                ddGroup         : 'component',
                containerScroll : true,
                selModel        : new Roo.tree.DefaultSelectionModel(),
                renderer : function(n)
                {
                    return n.text; // unescaped.
                },
                
                
                listeners : {
                    //nodedragover : function(e) {},
                       
                    beforenodedrop : function (e) {
                        
                       
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
                    nodedrop : function(e)
                    {
                        
                        e.dropNode.setText(
                            _this.configToText(e.dropNode.elConfig)
                        );
                        var bp = Pman.Tab.BuilderPanel;
                        bp.redraw.defer(1000, bp, [true]);
                    },
                    click :  function(node, e) {
                        e.preventDefault();
                       // console.log(e.button);
                        _this.setCurrentNode(node);
                    },
                    contextmenu : function(node, e)
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
                }
                
                
                
            
        });
       
        this.tree.getSelectionModel().on('selectionchange', function(sm, n) {
           //  - load invoices? or payment record...
            
           // Pman.Tab.AccountInvoice.show();
            
            
        });
        var root = new Roo.tree.TreeNode({
            text      : 'Module',
            id        : this.getNewId(),
            draggable : false
        });
        this.elConfig = { 
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
            
        }; 
        root.elConfig = Roo.apply({ }, this.elConfig);
        this.tree.setRootNode(root);

        // render the tree
        this.tree.render();
        root.expand();
        
        this.setCurrentNode(root);
         // dont bother with option - projects are managed in project area...
     
        
        //this.toolbar = tb;
        // add stuff to toolbar?
        this.layout.endUpdate();
        
        
    },
    idCounter : 0,
    getNewId : function() {
		return "form-gen-" + (this.idCounter++);
	},
    
    reloadTree: function()
    {
        /*this.tree.root.eachChild(function(n) {
            n.collapse(false,false);
            n.leaf = false;
            while(n.firstChild){
                n.removeChild(n.firstChild);
            }
            n.childrenRendered = false;
            n.loaded = false;
            n.leaf = false;
            n.ui.updateExpandIcon();
            
            //n.reload();
        });
        */
    },
    
    updateTreeEls : function(el) {
        return;
		if (!el) { 
            el = Pman.Tab.BuilderPanel.el; 
            el._node = this.tree.root;
        }
		if (el._node) {
			el._node.fEl = el;
			// workaround for fieldsets
			if (el.xtype == 'fieldset') {
				el.el.dom.id = el.id;
			}
		}
		if (!el.items) { return; } // items????
		try {
			el.items.each(function(i) { this.updateTreeEls(i); }, this);
		} catch (e) {}
	},
    
    
    getCurrentContainer : function()
    {
        var cn = this.currentNode;
        
        while (cn) {
            if (cn == this.tree.root) {
                return cn;
            }
            var xtype = cn.elConfig.xtype;
           // console.log(xtype);
            // needs to be more generic!!!!
            switch (xtype) {
                case 'Array':
                case 'Form':
                case 'FieldSet':
                case 'Row':
                case 'Column':
               // case 'BorderLayout':
                case 'LayoutDialog':
                case 'ContentPanel':
                case 'NestedLayoutPanel':
                case 'Toolbar':
                case 'Menu':
                    return cn;
                    
                default: 
                    break;
            }
            
            
            cn = cn.parentNode;
        }
        return this.tree.root;
    },
    
    setCurrentNode : function(node, select) {
        
        this.currentNode = node || this.tree.root;
        
        Pman.Tab.BuilderPanel.highlightElement(this.currentNode);
		var p = Pman.Tab.BuilderProps.grid;
        if (p) { //may not be ready yet..
            Pman.Tab.BuilderProps.setCurrrentNode(this.currentNode);
        }
        
      
        this.currentNode.setText(this.configToText(this.currentNode.elConfig));
        
		if (select) { //&& node !== this.tree.root) {
			if (this.currentNode !== this.tree.root)  {
                this.currentNode.ensureVisible();
            }
            this.currentNode.expand(false,false);
			this.currentNode.select();
		}
	},
    deleteCurrent: function()
    {
        if (this.currentNode == this.tree.root) {
            return false;
        }
        var cfg = this.currentNode.elConfig;
        // things that can not be deleted...
        if (cfg.xtype == '*LayoutRegion' && cfg.region == 'center') {
            // center regions..
            return false;
        }
        
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
    canAppend: function (parent, config)
    {
        
        //console.log('canAppend');
        //console.log(parent.id);
        //console.log(this.tree.root.id);
        
        if (parent === this.tree.root) {
            //@ the top
            if (this.tree.root.hasChildNodes()) {
                return "Only one element can be directly under the GUI Builder";
            }
            // panels can only be added to top..
            if ([ 'Form', 'ContentPanel', 'NestedLayoutPanel', 'LayoutDialog' ,'GridPanel','TreePanel'].indexOf(config.xtype || '') == -1)  {;
                return "Only container elements can be added to the top level";
            }
		} else {
          
            
           // console.log('add elsewhere');
            // anywhere else
            //if ([ 'Form', 'ContentPanel'].indexOf(config.xtype || '') == -1) || {
            //    return "Can not add that element to ";
           // }
            if (!config.xtype) { // asume it's a *prop
                return true; 
            }
            if (typeof(config['*prop']) != 'undefined') {
                var hasAlready = false;
                parent.eachChild(function(n) {
                    if (typeof(n.elConfig['*prop']) == 'undefined') {
                        return;
                    }
                    if (n.elConfig['*prop'] == config['*prop']) {
                        hasAlready = true;
                    }
                });
                if (hasAlready) {
                    return "Element alreay has that property";
                }
                return true; // always allow property adding.
                
            }
            
           
            var no = "Sorry this element can not be added here: " +
                    parent.elConfig.xtype + '.add('+ config.xtype +')';
                    
                    
            switch (parent.elConfig.xtype) {
                // parents..
                
                //borderlayout->add(nestedlayoutpanel) ** needs region!
                //borderlayout->add(ContentPanel)
                //borderlayout->add(gridpanel)
                
                
                
                case 'ContentPanel':
                    return [ 'Form',].indexOf(config.xtype) > -1 ? true : no;
            
               
                case 'BorderLayout': // border layouts are not added directly..
                    return [ '*LayoutRegion'].indexOf(config.xtype) > -1 ? true : no;
                
                case 'LayoutDialog':
                    return [  '*LayoutRegion',  'NestedLayoutPanel', 'ContentPanel',  'GridPanel', 'BorderLayout' ].indexOf(config.xtype) > -1 ? true : no;
                
                case 'NestedLayoutPanel': // thing really get added to borderlayout when rendering.
                    return [   'NestedLayoutPanel', 'ContentPanel',  'GridPanel', 'BorderLayout' ].indexOf(config.xtype) > -1 ? true : no;
                
                
                case 'Toolbar':
                case 'Form':
                case 'Row':
                case 'Column':
                case 'Fieldset':
                case 'Menu':
                    return true; //everything could be added? except panels etc?
                
                case 'GridPanel':
                    return [ 'Grid', 'EditorGrid', 'PropertyGrid', 'Toolbar' ].indexOf(config.xtype) > -1 ? true : no;
                
                case 'Array':
                    return true;//
                    return [ '*ColumnModel' ,'Button' , ].indexOf(config.xtype) > -1 ? true : no;
                
                
                default : 
                    return true;
                
            }
            
            
            
            
            
            
            
        }
        
        
        
        
		//var xtype = config.xtype
		//if (xtype && ['panel','viewport','form','window','tabpanel','toolbar','fieldset'].indexOf(xtype) == -1) {
        //		return 'You cannot add element under xtype "'+xtype+'"';
        //	}
		return true;
    },
 
 
    appendNode : function(parent, inConfig, markUndo) 
    {
        
        var _this = this;
        var items = [];
        if (inConfig.items) { // loading!
            items = inConfig.items;
            delete inConfig.items;
        }
		var config = this.cloneConfig(inConfig);
        if (!parent) {
			parent = this.tree.root;
		}
        
        
		var canAppend = this.canAppend(parent,config);
		if (canAppend !== true) {
            console.log("Unable to add element " + canAppend);
			Roo.Msg.alert("Unable to add element", canAppend);
			return false;
		}
         
		var id = this.getNewId();
        
		var newNode = new Roo.tree.TreeNode(
            {
                    id:id,
                    text: this.configToText(config)
            });
            
            
         //?? delete stuff ? why??   
		//for(var k in config) {
        //    if (config[k]===null) { 
        //        delete config[k]; 
        //    }
       // }
        
        
        
        //console.log(config);
		newNode.elConfig = config;
        //console.log(newNode);
        
		if (markUndo === true) {
			Pman.Tab.Builder.markUndo("Add " + newNode.text);
		}
        // appends to our tree...
		parent.appendChild(newNode);
        
        
        if (items.length) {
            Roo.each(items, function(i) {
                _this.appendNode(newNode, i);
            });
            
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
  
    cloneConfig : function(config) {
		if (!config) { return null; }
		var newConfig = {};
		for (var i in config) {
			if (typeof config[i] == 'object') {
				newConfig[i] = this.cloneConfig(config[i]);
			} else if (typeof config[i] != 'function') {
				newConfig[i] = config[i];
			}
		}
		return newConfig;
	},
    eachNodes : function(node, fn ,scope ) {
        _this = this;
        if (!node) {
            node = this.tree.root;
        }
        node.eachChild(function(n)
        {
            fn.call(scope, n);
            _this.eachNodes(n,fn,scope);
        });
         
    },
    toJS :function(n)
    {
        if (!n) {
            return this.toJS(this.tree.root);
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
    clearAll: function()
    {
        var rt= this.tree.root;
        if (rt.childNodes.length) {
            rt.removeChild(rt.childNodes[0]);
        }
       
        this.tree.root.elConfig  = Roo.apply({ }, this.elConfig);  
        //var btop = Pman.Tab.BuilderTop;
        //if (btop.modsel && btop.modsel.lastData) {
        //    this.tree.root.elConfig.app = btop.modsel.lastData.app;
        //}
        
        this.setCurrentNode(this.tree.root,true);
    },
    
    loadJSON : function(str)
    {
        var js = Roo.decode(str); // tryt?
        var rt= this.tree.root;
        this.clearAll();
       // console.log(js);return;
       
        if (js.xtype == '*Module') {
            var jsroot = js.items[0];
            delete js.items;
            
            this.tree.root.elConfig = js;
            js = jsroot;
            this.tree.root.setText(this.configToText(this.tree.root.elConfig));
        } else {
            this.tree.root.elConfig  = Roo.apply({ }, this.elConfig);  
        }
       
        this.appendNode(this.tree.root, js);
        rt.expand(true);
        // rebuild panel.
        var bp = Pman.Tab.BuilderPanel;
        bp.redraw.defer(1000, bp);
        
        //if (rt.childNodes.length) {
        this.setCurrentNode(this.tree.root,true);
        //}
        
        
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
    findProp: function(node, pn)
    {
        var ret = false;
        node.eachChild(function(n) {
            if (typeof(n.elConfig['*prop']) == 'undefined') {
                return;
            }
            if (n.elConfig['*prop'] == pn) {
                ret = n;
                return false;
            }
        });
        return ret;
    }
            
            
            
    
};

 
