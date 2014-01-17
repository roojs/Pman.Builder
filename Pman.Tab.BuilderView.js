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
                  return Pman.Builder.View.redraw(isAuto);
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
