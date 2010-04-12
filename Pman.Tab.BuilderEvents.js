//<script type="text/javascript">
  
// tab on left...  
/*
Pman.on('beforeload', function()
{
    
    
    Pman.register({
        modKey : '002-pman-tab-builderevents',
        module : Pman.Tab.BuilderEvents,
        region : 'south',
        parent : Pman.Tab.BuilderTree,
        name : "Builder Events"
    });
     
});

Pman.Tab.BuilderEvents = {
    grid : false,
    panel : false,
    loaded : false,
    currentNode : false, // pointer to edited node.
    add : function(parentLayout, region) {
        
        var _this = this;
        
        
        if (this.panel) {
            parentLayout.getRegion(region).showPanel(this.panel);
            return;
        }
       
       
        parentLayout.beginUpdate();
       
        var frm = parentLayout.getRegion(region).getEl().createChild({tag:'div'});
        //this.grid = new Roo.grid.EditorGrid(frm,  {
        this.grid = new Roo.grid.PropertyGrid(frm,  {
                id: 'grid-builderevents',
                toolbar: true,
                //nameText: 'Properties Grid',
                enableHdMenu: false,
                viewConfig : {
                    forceFit:true//,
                  //  scrollOffset:2 // the grid will never have scrollbars
                },
                clicksToEdit : 1,
                
                loadMask: true,

                listeners : {
                  
                    propertychange : function(s, id, v, ov) {
                        //console.log(id + ':'+ v);
                        _this.currentNode.elConfig.listeners = _this.currentNode.elConfig.listeners || {};
                        _this.currentNode.elConfig.listeners[id] = v;
                        // no need to update view..
                        //var bp = Pman.Tab.BuilderPanel;
                        //bp.redraw.defer(100,bp);
                        //_this.currentNode.setText(
                        //    Pman.Tab.BuilderTree.configToText(_this.currentNode.elConfig)
                        //);
                    },
                    cellclick :function (g, ri, ci, e)
                    {
                       // console.log('rowclick');
                        //console.log(e);
                        if (ci == 0) {
                            _this.menu.show(e.getTarget(), 'tr');
                            return;
                        }
                        // other wise edith it!!!
                        var data = _this.grid.getDataSource().getAt(ri).data;
                        Pman.Dialog.BuilderSourceEdit.show({
                            title : data.name,
                            value : data.value
                        }, function(d) {
                            _this.currentNode.elConfig.listeners[data.name] = d.value;
                            _this.setCurrrentNode(_this.currentNode);
                            // no point in redrawing the panel!!!
                            //var bp = Pman.Tab.BuilderPanel;
                            //bp.redraw.defer(100,bp);
                        });
                        
                        
                        
                        
                        //console.log(e);
                        // click on left col..
                        // show menu..
                       // _this.menu.show(e.getTarget(), 'tr');
                    }
                }
                 
        });
        
        this.menu =  new Roo.menu.Menu({

            items: [
                {
                    text: 'Delete Listener',

                    handler : function() {
                        var rc = _this.grid.getSelectionModel().getSelectedCell();
                        var n = _this.grid.getDataSource().getAt(rc[0]).data.name;
                        
                        delete _this.currentNode.elConfig.listeners[n];
                        _this.setCurrrentNode(_this.currentNode);
                        //var bp = Pman.Tab.BuilderPanel;
                        //bp.redraw.defer(100,bp);
                        //_this.currentNode.setText(
                        //    Pman.Tab.BuilderTree.configToText(_this.currentNode.elConfig)
                        //);
                    }
                } 
                
            ]
        });
            
        this.panel  = parentLayout.add(region,  new Roo.GridPanel(this.grid ,
            { fitToframe: true,fitContainer: true, title: "Events", background: true })
        );
        this.grid.render();
        
        this.grid.getColumnModel().renderPropDelegate = function(v,p) {
            return String.format('<b qtip="{0}">{1}</b>', _this.getDesc(v),v );
        };
        
        var gridHead = this.grid.getView().getHeaderPanel(true);
        //this.toolbar = new Roo.Toolbar(gridHead);
        this.toolbar = new Roo.Toolbar(gridHead.createChild({tag: 'span'}));
       
       
       
        this.addsel = new Roo.form.ComboBox({
            
         
            selectOnFocus:true,
           
            allowBlank : true,
            width: 150,
            editable: false,
            
            store: {
                xtype : 'Store',
                
                  // load using HTTP
                proxy: {
                    xtype: 'HttpProxy',
                    url: baseURL + '/Builder/PropList.php',
                    method: 'GET'
                    
                }, 
                listeners : {
                    beforeload: function(s, o) {
                        o.params = o.params || {}; 
                        if (!_this.currentNode || !_this.currentNode.elConfig) {
                            return false;
                        }
                        o.params.xtype =  _this.currentNode.elConfig.xtype;
                         o.params.xns=  _this.currentNode.elConfig['|xns'] || '';
                        o.params.view = 'listeners'
                    }
                },
                reader: {
                    root : 'data',
                    totalProperty : 'total',
                    id : 'id',
                    xtype : 'JsonReader',
                    fields : [
                        'name', 'desc', 'type', 'sig'
                    ]

                }
            },
            
            displayField:'name',
            valueField : 'name',
            
            typeAhead: true,
            forceSelection: true,
           
            triggerAction: 'all',
             
            tpl: new Roo.Template(
                '<div class="x-grid-cell-text x-btn button" qtip="\{desc\}">',
                    '<b >\{name\}</b> [\{type\}] ',
                '</div>'
            ),
             
            queryParam: 'query[name]',
            loadingText: "Searching...",
            listWidth: 300,
           
            minChars: 2,
            //pageSize:20,
            listeners : {
                select :  function(cb, rec, ix) {
                    cb.lastData = rec.data;
                    _this.addProp(rec.data.name, rec.data.sig);
                    this.reset();
                    // add a field...
                },
                collapse : function()
                {
                    this.lastQuery = '~~~~~~~~'; // force a query!
                }
            },
            lastData : false 
        
             
             
        });



       
       
        this.toolbar.add('Add:', this.addsel); 
        
        
        // add stuff to toolbar?
        //this.innerLayout.endUpdate();
        parentLayout.endUpdate();
        
        
    },
    
    setCurrrentNode : function(node) {
        var p = this.grid;
        p.view.el.unmask();
        
        if (!node || !node.elConfig) {
            this.currentNode = false;
            p.setSource({});
            p.view.el.mask('select a node');
        } else {
            node.elConfig.listeners= node.elConfig.listeners || { };
            if (node.elConfig.listener) { // kludge to fix old bug.
                delete node.elConfig.listener;
            }
            var config = node.elConfig.listeners;
               
            
            // for anything that is a onject - ecode it to set it..
            // probably should dupe the config first..
            ncfg = {};
            for (var k in config) {
                
                ncfg[k] = config[k];
            }
            //p.setSource(ncfg);
            this.currentNode = node;
            this.setSource(ncfg);
            
            //if (node.fEl == this.builderPanel) {
        //		p.disable();
        //	}
        }
    },
     
    
    getDesc :function(prop) {
         
       
        if (typeof(this.currentNode.elConfig) == 'undefined') {
             return '?';
        }
        var cfg = this.currentNode.elConfig;
        
        var data = this.getPropDef(cfg.xtype, cfg['|xns']);
        var pp= prop.replace('|', '');
        
        if ((typeof(data[pp]) == 'undefined') || (typeof(data[pp].desc) == 'undefined')) {
            return '';
        }
        return data[pp].desc;
       
       
    },
    
    
    getPropDef : function(xtype,xns)
    {
        // phase this out..!
        this.propdefs = Pman.Tab.BuilderProps.propdefs;
        
        var xpre = xns ? (xns + '.') :  '';
        if (typeof(this.propdefs[xpre + xtype]) != 'undefined') {
            return this.propdefToMap(xpre +  xtype);
        }
        
        for (var i in [ 'Roo',  'Roo.menu' , 'Roo.form',  'Roo.data',   'Roo.grid',   'Roo.Toolbar' ]) {
            if (typeof(this.propdefs[i +'.' + xtype]) != 'undefined') {
                return this.propdefToMap(i +'.' + xtype);
            }
        }
        return {};
        
    },
    // map the props!!
    propdefToMap : function(cls)
    {
        var ret = {};
        if ((typeof(this.propdefs[cls].events) == 'undefined') || !this.propdefs[cls].events.length) {
            return ret; 
        };
        Roo.each(this.propdefs[cls].events, function(c) {
            ret[c.name] = c;
        });
        return ret;
    },
    
    
    setSource : function(ltns)
    {
        
        var et = {}; // editor type
        var _this =this;   
        for(var k in ltns) {
            et[k] = false; // not really...
        }
        
        _this.grid.customEditors = et;
        _this.grid.setSource(ltns);
        
        
    },
    addProp:  function (name, sig) { // messy but will do..
        this.currentNode.elConfig.listeners = this.currentNode.elConfig.listeners || { };
       
        var c = this.currentNode.elConfig.listeners;
        if (typeof(c['|' +name]) != 'undefined') {
            return;
        }
        // get sig..
        c['|' + name] = sig;
        this.setSource(c);
        var _this = this;
        Pman.Dialog.BuilderSourceEdit.show({
            title : name,
            value : sig
        }, function(d) {
            _this.currentNode.elConfig.listeners['|'+ name] = d.value;
            _this.setCurrrentNode(_this.currentNode);
            //var bp = Pman.Tab.BuilderPanel;
            //bp.redraw.defer(100,bp);
        });
        
        //this.currentNode.setText(
        //    Pman.Tab.BuilderTree.configToText(this.currentNode.elConfig)
        //);
    }
    
};

// tab in admin 

*/