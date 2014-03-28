/**
 * The code that renders the view  - used to be in the Builder.View etc...
 *
 * used to be inside the Interface, but has proved to be to difficult to manage.
 *
 * In principle, simple event handling code is put in the interface, and any hard
 * lifting is done in nice files...
 *
 * It might be better to just extend 'tree', and use the extended class..
 * 
 */

Pman.Builder.View = {
    
    panel : false,
    
    panelroot : false,
    dialogroot : false,
    
    
    renderObj : false,
    
    doc : function() {
        var iframe = this.container.el.select('iframe',true).first().dom;
        
        return iframe.contentDocument || iframe.contentWindow.document;
    },
    win : function() {
        var iframe = this.container.el.select('iframe',true).first().dom;
        return iframe.contentWindow;
    },
    
    init : function (comp) {
        if (this.panel || !comp.layout) {
            return;
        }
        this.panel = comp.panel;
        this.layout  = comp.panel.layout;
        // see if we can render a iframe..
        
        var app = 'test';
        
        this.container = comp.layout.getRegion('center').getPanel(0);
        this.container.setContent(
                '<iframe width="100%" height="100%" src="'+baseURL+'/Builder/App/' + app + '?no_parts=1"></iframe>'
        );
        var iframe = this.container.el.select('iframe',true).first()
        
        iframe.setSize( this.panel.el.getSize());
        
        //this.doc = iframe.contentDocument || iframe.contentWindow.document;
        
        
    },
    
    clearAll : function(isAuto) {
        try {
            this.win().Pman.Builder.View.frameClearAll(isAuto);
        } catch(e) {
            //alert(e);
        }
        
       
    },
    
    frameToHTML : function()
    {
        return this.win().Pman.Builder.View.toHTML();  
        
        
        
    },
    toHTML : function ()  {
        var ret = '';
        Roo.select('body > div',true).each(function(el) {
            this.traverseDOMTree(function(s) { ret+=s; }, el.dom, 1);
            ret+="\n";
        }, this);
        return ret;
        
    },
    traverseDOMTree : function(cb, currentElement, depth) {
        if (currentElement) {
            
            if (currentElement.className.match(/roo-dynamic/)) {
                return;
            }
            //Roo.log(currentElement);
            var j;
            var nodeName = currentElement.nodeName;
            var tagName = currentElement.tagName;
            
            if  (nodeName == '#text') {
                cb(currentElement.nodeValue);
                return;
            
            }
            var i = 0;
          // Prints the node tagName, such as <A>, <IMG>, etc
            if (tagName) {
                var attr = [];
                for(i = 0; i < currentElement.attributes.length;i++) {
                    var aname = currentElement.attributes.item(i).name;
                    if (aname=='id') {
                        aname= 'xbuilderid';
                    }
                    attr.push(aname + '="' + currentElement.attributes.item(i).value + '"' );
                }
                
                
                cb("<"+currentElement.tagName+ ( attr.length ? (' ' + attr.join(' ') ) : '') + ">");
            } 
            else {
              cb("[unknown tag]");
            }
            // Traverse the tree
            i = 0;
            var currentElementChild = currentElement.childNodes[i];
            var allText = true;
            while (currentElementChild) {
                // Formatting code (indent the tree so it looks nice on the screen)
                
                if  (currentElementChild.nodeName == '#text') {
                    cb(currentElementChild.nodeValue);
                    i++;
                    currentElementChild=currentElement.childNodes[i];
                    continue;
                }   
                allText = false;
                cb("\n");
                for (j = 0; j < depth; j++) {
                  // &#166 is just a vertical line
                  cb("  ");
                }               
                
                    
                // Recursively traverse the tree structure of the child node
                this.traverseDOMTree(cb, currentElementChild, depth+1);
                i++;
                currentElementChild=currentElement.childNodes[i];
            }
            if (!allText) {
                // The remaining code is mostly for formatting the tree
                cb("\n");
                for (j = 0; j < depth - 1; j++) {
                  cb("  ");
                }     
            }
            if (tagName) {
                cb("</"+tagName+">");
            }
        }
    },

     
    
    frameClearAll : function(isAuto) {
//        this.renderObj = { isBuilder : true };

        
        if (this.panelroot) {
            this.scroll = this.panelroot.el.getScroll();
            this.layout.remove('center', this.panelroot);
            this.panelroot = false;
        }
        if (this.dialogroot) {
            this.dialogroot.remove();
            this.dialogroot = false;
        }
        Roo.select('body > div').remove();
        
    },
    munge : function(cfg, keyname, add_xattr) {
        keyname = keyname || false;
        
        this.renderObj = this.renderObj || {};
        
        var xitems = false;
        if (cfg.items) {
            xitems = cfg.items;
            delete cfg.items;
        }
        
        if (typeof(cfg.background) != 'undefined') {
            cfg.background = false;
        }
        
        
        for(var p in cfg){
            // key is not string?!?!?!!?
            if (typeof(p) != 'string') {
                continue;
            }
            
            if (typeof(cfg[p]) == 'object') { // listeners!!!
                this.munge(cfg[p], p, add_xattr);
                continue;
            }
            // SPECIAL - PIPE
            if (p.charAt(0) == '|' || keyname=='listeners') {
                
                if (!cfg[p].length) {
                    delete cfg[p];
                    continue;
                }
                var str = cfg[p];
                if (str.match(/\s*function/)) {
                    var btz = str.split('{');
                    str = btz.shift()  +'{ try {' + btz.join('{') + 
                        ' catch (e) { Roo.log(e) } }';
                }
                try {
                    Roo.log("interpret? " + str);
                    var _tmp = false;
                    var _this = this.renderObj; /// fake '_this' object..
                    // stupid IE can not return objects evaluated..
                    /**
                     eval:var:_this  
                     eval:var:_tmp 
                    **/
                    
                    
                    eval('_tmp =(' + str + ')');
                    cfg[p.replace(/^\|/, '')] = _tmp;
                    if (typeof(_tmp) == 'undefined') {
                        alert(cfg[p]);
                    }
                   
                } catch(e) {  console.log('Error evaluating: '  + str); };
                //if (p.charAt(0) == '|' ) {
                //    delete cfg[p];
                //}
                    
                
                continue;
            }
            // skip '*'
            if ((p.charAt(0) == '*') || (p.charAt(0) == '+')) {
                delete cfg[p];
                continue;
            }
            // normal..
              
        }
        
        // add xattr data?
        if (add_xattr) {
            if(typeof(cfg.xattr) != 'undefined'){
                cfg.xattr.xtype = cfg['|xns'] + '.' + cfg.xtype;
            }else{
                cfg.xattr = {
                    xtype : cfg['|xns'] + '.' + cfg.xtype 
                };
            }
            
        }
        
        
        
        // now for all the children.. (items)
        if (xitems === false) {
            return;
        }
        cfg.items = [];
        for (var i = 0; i < xitems.length; i++) {
            // if +builderhide set !!!! drop it!!
            
            
            var xi = xitems[i];
            if (typeof(xi['*prop']) != 'undefined') {
                var pr = xi['*prop'];
                this.munge(xi, false, add_xattr);
                // if prop is an array - then it's items are really the value..
                if (pr.match(/\[\]$/)) {
                    pr = pr.replace(/\[\]$/, '');
                    if (typeof(cfg[pr]) == 'undefined') {
                        cfg[pr] = [];
                    }
                    cfg[pr].push(xi);
                    continue;
                }
                if (xi.xtype && xi.xtype  == 'Array') {
                    cfg[pr] = xi.items;
                } else {
                    cfg[pr] = xi;
                }
                
                
                continue;
            }
            this.munge(xi, false, add_xattr);
            cfg.items.push(xi);
        }
        
        if (cfg.items.length == 0) {
            delete cfg.items;
        }
        // remove listeners if there are none..
        if (typeof(cfg['listeners']) != 'undefined') {
            var n =0;
            for (var i in cfg.listeners) { n++; }
            if (!n) {
                delete cfg['listeners'];
            }
            
        }
        
        if (typeof(cfg.id) != 'undefined') {
            cfg.id = 'pman-dyn-' + cfg.id;
        }
            
            
    },
    toJS : function(n)
    {
    
        if (!n) {
            return Pman.Builder.Tree.toJS(Pman.Tab.BuilderTree.tree.root);
        }
   
        var _this = this;
        var ret = Pman.Builder.Tree.cloneConfig(n.elConfig);
        
        // flag to prevent rendering..
        if ((typeof(ret['+buildershow']) != 'undefined') && !ret['+buildershow']) {
            return false;
        }
    
        ret.id = typeof(ret.id) == 'undefined' ? 'builder-' + n.id : ret.id;
    
        if (n.childNodes.length) {
            ret.items = [];
            n.eachChild(function(cn) {
                var add = _this.toJS(cn);
                if (add === false) {
                    return;
                }
                
                
                ret.items.push(add);
            });
                
        }
        return ret;
    },

    redraw : function(isAuto)
    {
        this.container.el.select('iframe',true).first().setSize(this.panel.el.getSize());
 
       // return;
        // top level is not relivant

//          var btop =  Pman.Tab.BuilderTop2;
  //      if (isAuto && btop.redrawBtn  && !btop.redrawBtn.auto) {
    //        return; /// auto redraw is turned off..
      //  }
        
        this.clearAll(isAuto);
        
        var cfg =  this.toJS();
        
        this.win().Pman.Builder.View.draw( cfg );
        
    },
    draw :function(cfg)
    {
        Roo.log(cfg);
        
        if (!cfg.items[0]) {
            return;
        }
        
        
        this.munge(cfg.items[0],false , true );
        
        Roo.log(cfg);
        //  return;
        // we draw either a dialog or a tab..
        
        if (cfg.items[0].xtype == 'LayoutDialog') {
            
            cfg.items[0].modal = false;
            var xy  = this.el.getXY();
            cfg.items[0].x = xy[0];
            cfg.items[0].y = xy[1];
            cfg.items[0].constraintoviewport = false;
            
            this.dialogroot = Roo.get( this.doc).createChild();
            try { 
                this.dialog = new Roo[cfg.items[0].xtype](this.dialogroot, cfg.items[0]);
              //  this.dialog.el.on('click', this.panelClick, this);
                this.dialog.show();
                var dlg = this.dialog;
                (function () {
                    dlg.moveTo(xy[0], xy[1]);
                }).defer(100);
            } catch(e) {
                Roo.log("Error rendering dialog: " + e.toString());
                Roo.log(e);
            }
            return;
            
            
        }
        if (cfg.items[0]['|xns'] == 'Roo.bootstrap') {
            
            if (cfg.items[0].xtype =='Modal' ) {
                this.bootstrapModal = Roo.factory(cfg.items[0]);
                this.bootstrapModal.show();
                return;
            }
            Roo.log("bootstrap build!?");
            var top = new Roo.bootstrap.Body({});
            top.onRender(false,false);
            
            this.bootstrapModal = top.addxtype(cfg.items[0]);
            
            this.applyFlexy(top);
            
            
            
            return;
        }
        
        
        
        // should we render this into a dialog???
             // force center region..
        cfg.items[0].region = 'center';
        cfg.items[0].background = false;
        
        try {
            
            cfg.parent = '#';
            
            
            this.panelroot = this.layout.addxtype(cfg.items[0]);
        
        } catch(e) {
            Roo.log("Error rendering: " + e.toString());
            Roo.log(e);
        }
        //this.highlightElement(Pman.Tab.BuilderTree.currentNode);
        
        if (this.panelroot && this.panelroot.el) {
                this.panelroot.el.scrollTo('top', 0);
                this.panelroot.el.scrollTo('left', 0);
            
        }
    },
    frameUpdateTheme: function(name)
    {
         return this.win().Pman.Builder.View.updateTheme(name);  
    },
    updateTheme : function(name)
    {
       Roo.select('head link[rel=stylesheet]').each(function(e) {
            if (!e.dom.href.match(/bootstrap\.\min.css$/)) {
                return;
            }
            e.dom.setAttribute('href', rootURL +'/bootswatch/' + name + '/bootstrap.min.css' );
            
        
       });
    },
    
    applyFlexy: function(tree)
    {
        if (typeof(tree['flexy:foreach']) != 'undefined') {
            tree.el.attr('flexy:foreach', tree['flexy:foreach']);
        }
        if (typeof(tree['flexy:if']) != 'undefined') {
            tree.el.attr('flexy:if', tree['flexy:if']);
        }
        if (!tree.items || !tree.items.length) { return; }
        
        for (var i = 0; i < tree.items.length; i++){
            this.applyFlexy(tree.items[i]);
        }
    }
    
    
    
}