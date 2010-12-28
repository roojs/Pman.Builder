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
            xtype: 'ContentPanel',
            xns: Roo,
            listeners : {
                activate : function (_self)
                {
                    _this.panel = _self;
                }
            },
            region : 'center',
            title : "View",
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
                        var xy  = this.panel.el.getXY();
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
                    
                     
                    //this.highlightElement(Pman.Tab.BuilderTree.currentNode);
                    
                    if (this.panelroot.el) {
                            this.panelroot.el.scrollTo('top', this.scroll.top);
                            this.panelroot.el.scrollTo('left', this.scroll.left);
                        
                    }
                },
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
             : false
        });
        this.layout = this.panel.layout;

    }
});
