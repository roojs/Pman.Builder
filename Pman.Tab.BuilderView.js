//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Tab.BuilderView = new Roo.XComponent({
    part     :  ["Builder","View"],
    order    : '001-Pman.Tab.BuilderView',
    region   : 'center',
    parent   : 'Pman.Tab.BuilderTab',
    name     : "Pman.Tab.BuilderView",
    disabled : false, 
    permname : '', 
    _tree : function()
    {
        var _this = this;
        var MODULE = this;
        return {
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
            
                Pman.Builder.View.clearAll(isAuto);
            },
            munge : function(cfg, keyname) {
                 return Pman.Builder.View.munge(cfg,keyname);
                    
                    
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
                        try { 
                            this.dialog = new Roo[cfg.items[0].xtype](this.dialogroot, cfg.items[0]);
                          //  this.dialog.el.on('click', this.panelClick, this);
                            this.dialog.show();
                            var dlg = this.dialog;
                            (function () {
                                dlg.moveTo(xy[0], xy[1]);
                            }).defer(100);
                        } catch(e) {
                            Roo.log("Error rendering: " + e.toString());
                            Roo.log(e);
                        }
                        return;
                        
                        
                    }
                    // should we render this into a dialog???
                         // force center region..
                    cfg.items[0].region = 'center';
                    cfg.items[0].background = false;
                    
                    try {
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
            toJS : function(n) {
             
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
            layout : {
                xtype: 'BorderLayout',
                xns: Roo,
                center : {
                    xtype: 'LayoutRegion',
                    xns: Roo,
                    alwaysShowTabs : true,
                    tabPosition : 'top'
                }
            }
        };
    }
});
