/**
 * The code that manages the tree...
 *
 * used to be inside the Interface, but has proved to be to difficult to manage.
 *
 * In principle, simple event handling code is put in the interface, and any hard
 * lifting is done in nice files...
 *
 * It might be better to just extend 'tree', and use the extended class..
 * 
 */

Pman.Builder.Tree = {
    
    currentNode: false,
    dragProp: '',
    
    appendNode : function(parent, inConfig, point) {
                                
                                    
        var tree = Pman.Tab.BuilderTree.tree;
        
        if (typeof(inConfig) == 'undefined') {
            return;
        }
        var items = [];
        if (typeof(inConfig) !== 'undefined' && inConfig.items) { // loading!
            items = inConfig.items;
            delete inConfig.items;
        }
        
        var config = this.cloneConfig(inConfig);
        
        var hidden =  config['builder.hidden'] || false;
         
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
                parent.parentNode.expand(true);
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
                parent.parentNode.expand(true);
                break;
            
            case 'append':
            default:    
                parent.appendChild(newNode);
                parent.expand(true);
                break;
        }
        
        newNode.ui.ctNode.style.display = hidden ? 'none' : '';
        
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
            if (i.match(/^builder\./)) {
                continue;
            }
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
    
    replaceCurrentNode : function(cfg)
    {
        var tree = Pman.Tab.BuilderTree.tree;

        if (this.currentNode == tree.root) {
            return false;
        }
        var pn = this.currentNode.parentNode;
        
        var ix = pn.indexOf(this.currentNode);
        pn.removeChild(this.currentNode);
          
        if (!pn.childNodes.length) {
            this.appendNode(pn, cfg, 'append')
            return true;
        }
        if (!ix) {
            // first..
            this.appendNode(pn.childNodes[0], cfg, 'above');
            return true;
        
        }
        
        this.appendNode(pn.childNodes[ix-1], cfg, 'below');
        
        
        return true;
    },
    
    collapseToggle : function()
    {
        var tree = Pman.Tab.BuilderTree.tree;
        
        if (this.currentNode == tree.root) {
            return false;
        }
        var cfg = this.currentNode.elConfig;
        // things that can not be deleted...
        var hidden = cfg['builder.hidden'] || 0;
        if (hidden) {
            delete cfg['builder.hidden'];
        } else {
            cfg['builder.hidden'] = 1;
        }
         
        
        this.currentNode.ui.ctNode.style.display = !hidden ? 'none' : '';
         
         
        //this.setCurrentNode(pn.childNodes.length ? pn.childNodes[ix] : pn  ,true);
        return true;
    },
    
    
    
    
    deleteCurrent : function()
    {
        
        var tree = Pman.Tab.BuilderTree.tree;
        
        if (this.currentNode == tree.root) {
            return false;
        }
        var cfg = this.currentNode.elConfig;
        // things that can not be deleted...
        
        
        var pn = this.currentNode.parentNode;
        
        // work out if we make the next or parent the 'current node'
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
    loadBJS : function(module, part)
    {
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
        Roo.log('oooooooo');
        Roo.log(o);
        var tree = Pman.Tab.BuilderTree.tree;
        this.clearAll();
        tree.root.elConfig = o;
        if (typeof(o.xtype) == 'undefined') {
            o.xtype = '*top';
        }
        tree.root.setText(this.configToText(tree.root.elConfig));
        this.appendNode(tree.root, o.items[0]);
        tree.root.expand(true);
        Pman.Tab.BuilderView.panel.redraw();
        this.setCurrentNode(tree.root,true);
    },
    nodeXtype : function(n)
    {
        var tree = Pman.Tab.BuilderTree.tree;
        if (!n || !n.elConfig) {return ''; }
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
    
    /**
     * handle dropNode
     */
    
    handleDropNode : function (e)
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
        
        var _t = this;
        var np = e.point == 'append' ? e.target : e.target.parentNode ; // new parent
          
        if (!e.tree || !e.dropNode) {
        
            // form palete...
            var data  = e.source.dragData.selections[0].data;
    
            var xar = data.name.split('.');
    
            var cfg = {
                'xtype' : xar.pop(),
                '|xns' : xar.join('.')
                
            };
            if (this.dragProp.length > 1) {
                cfg['*prop'] = this.dragProp;
            }
            // at this point it should of a set of options...
             var cls = cfg['|xns'] + '.' + cfg['xtype'];
                
    
            if (typeof(Pman.Builder.Wizard[cls]) != 'undefined') {
                Pman.Dialog.BuilderAdd.show( cfg , function(fdata ) {
     
                    _t.appendNode(e.target, fdata , e.point);
                     Pman.Tab.BuilderView.panel.redraw();
             
                 });
                 return false;
             }
             this.appendNode(e.target, cfg, e.point);
              Pman.Tab.BuilderView.panel.redraw();
             
            return false; // fixme drop of elements from palete..
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
        if (e.dropNode) {
            var cfg = this.toJS(e.dropNode);
            this.appendNode(e.target, cfg, e.point);
        }
        Roo.log('no e.dropNode?');
        return false; // do not allow movement..
        
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
    handleDragOver : function(e)
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
           this.dragProp = '';
           var _t = this;
           Roo.each(ok_parents, function(n) {
                Roo.log("compare "+n+" ? " + new_parent);
                if (n == new_parent || n.split(':').shift() == new_parent) {
                   Roo.log("got match!");
                   e.cancel = false;
                   _t.dragProp = (n == new_parent) ?  '' : n.split(':').pop();
                   return true;
                }
               return null;
            });
   
           // done all the checks...
           return;
           
        }
        
        
        // have a drop node - hence comming from the same object..
        var drop_xtype = this.nodeXtype(e.dropNode);
        // currently we can not determine validity..
        e.cancel = false;
        return ;
        
        
        
    },
    save : function() 
    {
       // first see if first element has a name.. - we can not save otherwise..
        var t = Pman.Tab.BuilderTree.tree;
        if (!t.root.elConfig.name.length) {
            Roo.MessageBox.alert("Error", "No name set for form");
            return;
        }
     
        var  sid = (typeof(sid) == 'undefined') ? 
             (Pman.Tab.BuilderTop.filesel.lastData ? Pman.Tab.BuilderTop.filesel.lastData.id : 0) : sid;
        

        var js = this.toJS();
        var render = new Pman.Builder.JsRender(js); 
         
        // console.log(js);
        // console.log(json);
        
        // check the select box to see if that has been set... - save it with that id..
        
        //var _this = this;
        
        Pman.request({
            url: baseURL + '/Roo/Builder_part.php',
            method : 'POST',
            params : {
                json : Roo.encode(js, null, 4),
                jsource : render.toSource(),
                name :   js.name,
                module_id : Pman.Tab.BuilderTop.modsel.getValue(),
                id : sid
            }, 
            success : function(data) {
                // set the fileSel!!
                console.log(data);
                //if (data) {
                //    _this.filesel.setFromData(data);
//                    if (cb) {
//                        cb.call(_this,data);
  //                  }
//                    _this.postCode(data);
//                }
            }
        });
}

    
    
}