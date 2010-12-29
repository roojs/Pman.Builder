//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)



// register the module first
Pman.on('beforeload', function()
{
    Pman.register({
        modKey : '001-Pman.Tab.BuilderView',
        module : Pman.Tab.BuilderView,
        region : 'center',
        parent : Pman.Tab.BuilderTab,
        name : "Pman.Tab.BuilderView",
        disabled : false, 
        permname: '' 
    });
});

Pman.Tab.BuilderView = new Roo.util.Observable({

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
            listeners : {
                activate : function (_self)
                {
                    _this.panel = _self;
                }
            },
            region : 'center',
            title : "View",
            clearAll : function(isAuto) {
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
            },
            munge : function(cfg, keyname) {
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
                        this.munge(cfg[p], p);
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
                        if (p.charAt(0) == '|' ) {
                            delete cfg[p];
                        }
                            
                        
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
                    this.munge(xi);
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
            redraw : function(isAuto)
                {
                    
                    // top level is not relivant
            
            //          var btop =  Pman.Tab.BuilderTop2;
              //      if (isAuto && btop.redrawBtn  && !btop.redrawBtn.auto) {
                //        return; /// auto redraw is turned off..
                  //  }
                    
                    this.clearAll(isAuto);
                    
                    var cfg =  this.toJS();
                    if (!cfg.items[0]) {
                        return;
                    }
                    
                    
                    this.munge(cfg.items[0]);
                    
                    // we draw either a dialog or a tab..
                    
                    if (cfg.items[0].xtype == 'LayoutDialog') {
                        
                        cfg.items[0].modal = false;
                        var xy  = this.el.getXY();
                        cfg.items[0].x = xy[0];
                        cfg.items[0].y = xy[1];
                        cfg.items[0].constraintoviewport = false;
                    
                        this.dialogroot = Roo.get( document.body).createChild();
                         
                        this.dialog = new Roo[cfg.items[0].xtype](this.dialogroot, cfg.items[0]);
                      //  this.dialog.el.on('click', this.panelClick, this);
                        this.dialog.show();
                        var dlg = this.dialog;
                        (function () {
                            dlg.moveTo(xy[0], xy[1]);
                        }).defer(100);
                        return;
                        
                    }
                    // should we render this into a dialog???
                         // force center region..
                    cfg.items[0].region = 'center';
                    cfg.items[0].background = false;
                    
                    this.panelroot = this.layout.addxtype(cfg.items[0]);
                    
                     
                    //this.highlightElement(Pman.Tab.BuilderTree.currentNode);
                    
                    if (this.panelroot.el) {
                            this.panelroot.el.scrollTo('top', this.scroll.top);
                            this.panelroot.el.scrollTo('left', this.scroll.left);
                        
                    }
                },
            toJS : function(n) {
                var bt = Pman.Tab.BuilderTree.tree;
                if (!n) {
                    return this.toJS(bt.root);
                }
            
                var _this = this;
                var ret = bt.cloneConfig(n.elConfig);
                
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
            layout : {
                xtype: 'BorderLayout',
                xns: Roo,
                center : {
                    xtype: 'LayoutRegion',
                    xns: Roo
                }
            }
        });
        this.layout = this.panel.layout;

    }
});
