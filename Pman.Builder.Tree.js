/**
 * The code that manages the tree...
 *
 * used to be inside the Interface, but has proved to be to difficult to manage.
 *
 * In principle, simple event handling code is put in the interface, and any hard
 * lifting is done in nice files...
 *
 *
 *
 */

Pman.Builder.Tree = {
    
    currentNode: false,

    
    appendNode : function(parent, inConfig, point) {
                                
                                    
        var tree = Pman.Tab.BuilderTree.tree;
        
        
        var items = [];
        if (inConfig.items) { // loading!
            items = inConfig.items;
            delete inConfig.items;
        }
        
        var config = this.cloneConfig(inConfig);
        
        if (!parent) {
            parent = tree.root;
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
        var tree = Pman.Tab.BuilderTree.tree;
        
        var rt = tree.root;
         if (rt.childNodes.length) {
            rt.removeChild(rt.childNodes[0]);
        }
        
        tree.root.elConfig  = Roo.apply({ }, this.defaultElConfig());  
        //var btop = Pman.Tab.BuilderTop;
        //if (btop.modsel && btop.modsel.lastData) {
        //    this.tree.root.elConfig.app = btop.modsel.lastData.app;
        //}
        
        this.setCurrentNode(tree.root,true);
        
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
    deleteCurrent : function()
    {
        if (this.currentNode == tree.root) {
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
    loadTree : function(o)
    {
        var tree = Pman.Tab.BuilderTree.tree;
        tree.clearAll();
        tree.root.elConfig = o;
        tree.root.setText(this.configToText(tree.root.elConfig));
        this.appendNode(tree.root, o.items[0]);
        tree.root.expand(true);
        Pman.Tab.BuilderView.panel.redraw();
        this.setCurrentNode(tree.root,true);
    },
    nodeXtype : function(n)
    {
        var tree = Pman.Tab.BuilderTree.tree;
        if (!n) {return ''; }
        var xt = n.elConfig.xtype ||  '';
        var xns= n.elConfig['|xns'] ||   '';
        xns += xns.length ? '.' : '';
        return xns + xt;
    },
    setCurrentNode : function(node,select)
    {
        var tree = Pman.Tab.BuilderTree.tree;
        
        this.currentNode = node || tree.root;
            
        //Pman.Tab.BuilderView.highlightElement(this.currentNode);
    
        var p = Pman.Tab.BuilderProps.grid;
        if (p) { //may not be ready yet..
            p.setCurrrentNode(this.currentNode);
        }
        
      
        this.currentNode.setText(this.configToText(this.currentNode.elConfig));
        
        if (select) { //&& node !== this.tree.root) {
            if (this.currentNode !== tree.root)  {
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
            var tree = Pman.Tab.BuilderTree.tree;
            return this.toJS(tree.root);
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
    
    
}