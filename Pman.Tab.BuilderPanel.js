//<script type="text/javascript">
// tab on left...  

 


Pman.on('beforeload', function()
{
    // this is always shown if Clipping module is enabled!!
    //if (!Pman.hasPerm('Admin.Campaigns', 'E')) {
    //    return;
    //}
    Pman.register({
        modKey : '016-pman-tab-builderpanel',
        module : Pman.Tab.BuilderPanel,
        region : 'center',
        parent : Pman.Tab.Builder,
        name : "Builder Panel"
    });
});
 
   

Pman.Tab.BuilderPanel = {
     
    panel : false,
    isMouseOver : false,
    renderObj: { }, //  the rendered view uses this as _this.
       
    form : false, /// mapped to form, so _this.form works...
    dialog : false,
    panelClick :  function(e) { 
            //console.log(e);
           // e.target
            var ch = false;
            var tg = Roo.get(e.getTarget());
            
            var findNode = function(ftg) {
                if (!ftg) {
                    return;
                }
                if (ftg.id && typeof(ftg.id) == 'string' && ftg.id.match(/builder-form/)) {
                    var nid = ftg.id.replace('builder-', '');
                    var node = Pman.Tab.BuilderTree.tree.getNodeById(nid);
                    if (node) {
                        Pman.Tab.BuilderTree.setCurrentNode(node, true);
                        return true;
                    }
                }
                
                var cmat = ftg.dom.className.match(/x-grid-hd-builder-(form-gen-[0-9]+)/);
                
                if (cmat) {
                    var node = Pman.Tab.BuilderTree.tree.getNodeById(cmat[1]);
                    if (node) {
                        Pman.Tab.BuilderTree.setCurrentNode(node, true);
                        return true;
                    }
                }
                
                return false;
            };
            if (findNode(tg)) {
                e.stopEvent();
                return;
            }
            var dp = Roo.get(tg.up(''));
            if (dp && findNode(dp)) {
                e.stopEvent();
                return;
            }
            
            var ns = Roo.get(tg.getNextSibling());
            if (ns && findNode(ns)) {
                e.stopEvent();
                return;
            }
            if (ns && ns.down('') && findNode(Roo.get(ns.down('')))) {
                e.stopEvent();
                return;
            }
            
            for(var i =0; i < 5; i++) {
                tg = Roo.get(tg.up(''));
                if (findNode(tg)) {
                    e.stopEvent();
                    return;
                }
            }
            
            
            // loop throug parents and try and find it..
            
            /*
            
            if (tg.hasClass('b-hasbuildernode') ) {
                ch = tg;
            }
            if (!ch) {
                ch = tg.child('.b-hasbuildernode', false);
            }
            if (!ch && tg.getNextSibling()) {
                ch = Roo.get(tg.getNextSibling()).child('.b-hasbuildernode', false);
            }
            if (!ch) {
                ch = tg.findParent('.b-hasbuildernode', 0,true);
            }
            
            if (ch) {
                var node = Pman.Tab.BuilderTree.tree.getNodeById(ch.dom.getAttribute('buildernode'));
                Pman.Tab.BuilderTree.setCurrentNode(node, true);
                ///e.stopEvent();
                return;
            }
            // try and find a parent..
            
            */
            
            
    },
    
    
    add : function(parentLayout, region) {
        
        var _this = this;
        
        this.parentLayout = parentLayout;
        
        
        
        
        
        this.panel = parentLayout.addxtype({
            xtype : 'NestedLayoutPanel',
            background : true,
            fitToFrame : true,
            region : 'center',
            title : "Builder Panel",
            
            layout : {
                xtype : 'BorderLayout',
                center : {
                    titlebar : false,
                    autoScroll : true,
                    hideTabs : false,
                    alwaysShowTabs: true,
                    tabPosition: 'top',
                    margins : { // let's have some margines!
                        top: 4,
                        left: 4,
                        bottom: 4,
                        right:4
                    }
                } 
            }
        });
        this.layout = this.panel.layout;
        /*
        this.layout = this.panel.layout;
        
        
        
        
        this.panel = parentLayout.add(region, 
            new Roo.ContentPanel(
                parentLayout.getRegion(region).el.createChild(
                    {tag:'div', style: 'margin:0px;'}), 
                {
                    //autoCreate : true,
                    //toolbar: this.tb,
                    background : false,
                    fitToFrame:true,
                    autoScroll: false
                  //  title : "Summary"
                }
            )
        ); 
        */
        this.el = this.panel.el;
        this.panel.el.on('mouseover', function() { _this.isMouseOver= true; });
        this.panel.el.on('mouseout', function() { _this.isMouseOver = false; });
       
        this.panel.el.on('click', this.panelClick, this);
        /*this.panel.on('resize', function(p, w,h) {
            
            
            if (_this.root) {
                _this.root.setSize(w,h);
                _this.rootPanel.layout.layout();
            }
        });
        */
        
        
        this.panel.dragZone = new Roo.dd.DropZone(this.el, {
            ddGroup         : 'component',
              
            notifyOver : function(dd, e, data){  
                var _builder = Pman.Tab.Builder;
                
                var node = Pman.Tab.BuilderTree.getCurrentContainer(); // get Current container...
                
                // dont alllow dropping of tree nodes here..
                if (dd.tree) {
                    return false;
                }
                
                //var node = _builder.getNodeForEl(e.getTarget()); // should defined here..
                if (node) {
                    data.node = node; 
                    //node.select();
                    
                    //_this.highlightElement(node);
                    var c = data.records[0].json.cfg;
                    if (Pman.Tab.BuilderTree.canAppend( node,c) === true) {
                        return 'x-dd-drop-ok-add';
                    } 
                    data.node = null;
                    return false;
                }
            
                data.node = null;
                return false;
            },  
            notifyDrop : function(dd, e, data){  
                var _builder = Pman.Tab.Builder;
                if (!data.node || !data.records.length) { return; }
                var c = data.records[0].json.cfg;
                //if (typeof c == 'function') {
                //    c.call(_builder,function(config) {
                //        var n = _builder.appendConfig(config, data.node, true, true);
                //        _builder.setCurrentNode(n, true);
                //    }, data.node.elConfig);
                //    return true;
                
                var n = Pman.Tab.BuilderTree.appendNode(data.node, c);
                
                _this.redraw(true);
                
                //var n = _builder.appendConfig(_builder.cloneConfig(c), {
                //    appendTo: data.node,
                //    doUpdate: true,
                //    markUndo : true
                //});
                
                Pman.Tab.BuilderTree.setCurrentNode(n, true);
                
                
                
                
                return true;
                 
                 
                
                  
            },
            notifyOut : function(src,e,data) {
                data.node = null;
            }
        });
         
        //Pman.Tab.BuilderTree.updateTreeEls(false);
        //Pman.Tab.BuilderTree.tree.root.Element = this.panel;
    },
    /**
     * @arg node = tree node.. -> we need to highlight related element in panel.
     */
    highlightElement : function(node) {
        
        var _this = this;
        var highlightEl = function(hel) 
        {
            if (!hel ||  hel == _this.panel.el) {
                return false; // dont highlihght top.
            }
            var elParent = hel.findParent('.x-form-element');
            _this.hideHighlight();
            if (elParent) { 
                Roo.get(elParent).addClass("b-selectedElementParent"); 
            }
            hel.addClass("b-selectedElement");
            return true;
        }
        if (node && node.id && highlightEl(Roo.get('builder-' + node.id))) {
            return;
        }
        // will not work in future...
        if (!node || !node.Element || !node.Element.el) {
            this.hideHighlight();
            return;
        }
       
        highlightEl(node.Element.el);
        
	},
    hideHighlight : function(e) {
		if (e) { e.preventDefault(); }
        if (!this.panel) {
            return;
           }
		this.panel.el.select('.b-selectedElement').removeClass('b-selectedElement');
		this.panel.el.select('.b-selectedElementParent').removeClass('b-selectedElementParent');
        if (this.dialogroot) {
            this.dialogroot.select('.b-selectedElement').removeClass('b-selectedElement');
            this.dialogroot.select('.b-selectedElementParent').removeClass('b-selectedElementParent');
        }
        
	},
     
    redrawClear : function(isAuto)
    {
        this.renderObj = { isBuilder : true };
        var btop =  Pman.Tab.BuilderTop2;
        this.scroll = {
            top:0,
            left:0
        };
        if (isAuto && btop.redrawBtn  && !btop.redrawBtn.auto) {
            return; /// auto redraw is turned off..
        }
        /* -- fix me scrolling!!!
        var cn0 = false;
        var root = Pman.Tab.BuilderTree.tree.root;
     
        try {
            cn0 = root.childNodes.length ? root.childNodes[0] : false;
            
            this.scroll = cn0 && cn0.Element && typeof(cn0.Element.region) == 'object' ?
                cn0.Element.region.bodyEl.getScroll() : scroll;
        } catch(e) {
               
        }
        */
       
        
        if (this.panelroot) {
            this.scroll = this.panelroot.el.getScroll();
            this.layout.remove('center', this.panelroot);
            this.panelroot = false;
        }
        if (this.dialogroot) {
            this.dialogroot.remove();
            this.dialogroot = false;
        }
        
         
        
    },
    
    redraw: function(isAuto)
    {
        
        // top level is not relivant
        this.redrawClear(isAuto);
          var btop =  Pman.Tab.BuilderTop2;
        if (isAuto && btop.redrawBtn  && !btop.redrawBtn.auto) {
            return; /// auto redraw is turned off..
        }
        var cfg =  this.toJS();
        if (!cfg.items[0]) {
            return;
        }
        this.munge(cfg.items[0]);
        
        // we draw either a dialog or a tab..
        
        if (cfg.items[0].xtype == 'LayoutDialog') {
            
            cfg.items[0].modal = false;
            var xy  = Pman.Tab.BuilderPanel.panel.el.getXY();
            cfg.items[0].x = xy[0];
            cfg.items[0].y = xy[1];
            cfg.items[0].constraintoviewport = false;
        
            this.dialogroot = Roo.get( document.body).createChild();
             
            this.dialog = new Roo[cfg.items[0].xtype](this.dialogroot, cfg.items[0]);
            this.dialog.el.on('click', this.panelClick, this);
            this.dialog.show();
            return;
            
        }
        
        
     
        // force center region..
        cfg.items[0].region = 'center';
        cfg.items[0].background = false;
        
        this.panelroot = this.layout.addxtype(cfg.items[0]);
        
         
        this.highlightElement(Pman.Tab.BuilderTree.currentNode);
        
        if (this.panelroot.el) {
                
                this.panelroot.el.scrollTo('top', this.scroll.top);
                this.panelroot.el.scrollTo('left', this.scroll.left);
            
        }
        
        /*
        cn0 = root.childNodes.length ? root.childNodes[0] : false;
            
        try {
            
                var scrollEl = layout.region.bodyEl;
                scrollEl.scrollTo('top', scroll.top);
                scrollEl.scrollTo('left', scroll.left);
            }
        } catch (e) { }
        
        */
        
        
        
        
        
    },
    toJS :function(n) // same code as tree, but add's ids..
    {
        
        var bt = Pman.Tab.BuilderTree;
        if (!n) {
            return this.toJS(bt.tree.root);
        }
        
        var _this = this;
        var ret = bt.cloneConfig(n.elConfig);
        
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
    
    munge :function (cfg)
    {
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
                this.munge(cfg[p]);
                continue;
            }
            // SPECIAL - PIPE
            if (p.charAt(0) == '|') {
                
                if (!cfg[p].length) {
                    delete cfg[p];
                    continue;
                }
                try {
                    var _tmp = false;
                    var _this = this.renderObj; /// fake '_this' object..
                    // stupid IE can not return objects evaluated..
                    /**
                     eval:var:_this  
                     eval:var:_tmp 
                    **/
                    eval('_tmp =(' + cfg[p] + ')');
                    cfg[p.substr(1)] = _tmp;
                    //if (typeof(_tmp) == 'undefined') {
                    //    alert(cfg[p]);
                   // }
                   
                } catch(e) {  console.log('Error evaluating: '  + cfg[p]); };
                delete cfg[p];
                    
                
                continue;
            }
            // skip '*'
            if ((p.charAt(0) == '*') || (p.charAt(0) == '+')) {
                delete cfg[p];
                continue;
            }
            // normal..
              
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
                this.munge(xi);
                // if prop is an array - then it's items are really the value..
                
                if (xi.xtype && xi.xtype  == 'Array') {
                    cfg[pr] = xi.items;
                } else {
                    cfg[pr] = xi;
                }
                
                
                continue;
            }
            this.munge(xi);
            cfg.items.push(xi);
        }
        
        if (cfg.items.length == 0) {
            delete cfg.items;
        }
        
        
        
    }
    
    
    
}