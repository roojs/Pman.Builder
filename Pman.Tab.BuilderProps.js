//<script type="text/javascript">
  
// tab on left...  
Pman.on('beforeload', function()
{
    
    
    Pman.register({
        modKey : '001-pman-tab-builderprops',
        module : Pman.Tab.BuilderProps,
        region : 'south',
        parent : Pman.Tab.BuilderTree,
        name : "Builder Properties"
    });
     
        
});

Pman.Tab.BuilderProps = {
    grid : false,
    panel : false,
    loaded : false,
    currentNode : false,
    defcache : { }, // depreciated
    propdefs  :{},
    forceString : [ '|module', '|parent', '|xns'],
    add : function(parentLayout, region) {
        
        var _this = this;
        
        Pman.request({
            url: baseURL+ '/Builder/PropList.php',
            method : 'GET',
            params: {
                xtype : '*all'
            },
            success : function(data) {
                
                _this.propdefs = data;
                
            }
        });
        
        
        
        
        if (this.panel) {
            parentLayout.getRegion(region).showPanel(this.panel);
            return;
        }
           

        
       
        parentLayout.beginUpdate();
       

        var frm = parentLayout.getRegion(region).getEl().createChild({tag:'div'});
        //this.grid = new Ext.grid.EditorGrid(frm,  {
        this.grid = new Roo.grid.PropertyGrid(frm,  {
                id: 'grid-builderprops',
                toolbar: true,
                nameText: 'Properties Grid',
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
                        if (v == 'false') {
                            v = false;
                        }
                        if (v == 'true') {
                            v = true;
                        }
                        _this.currentNode.elConfig[id] = v;
                        var bp = Pman.Tab.BuilderPanel;
                        bp.redraw.defer(100,bp, [true]);
                        _this.currentNode.setText(
                            Pman.Tab.BuilderTree.configToText(_this.currentNode.elConfig)
                        );
                    },
                    cellclick :function (g, ri, ci, e)
                    {
                       // console.log('rowclick');
                        //console.log(e);
                        if (ci != 0) {
                            return;
                        }
                        //console.log(e);
                        // click on left col..
                        // show menu..
                        _this.menu.show(e.getTarget(), 'tr');
                    }
                }
                 
        });
        
        
        
        // cell editor....
        this.grid.colModel.getCellEditor = function (ci, ri) {
            var p = this.store.getProperty(ri);
            var n = p.data["name"];
            var val = p.data["value"];
            
            // force string..
            
            if (_this.forceString.indexOf(n) > -1 ) {
                return this.editors["string"];
            }
             
            if (n[0] == '|' || n[0] == '!') {
                return _this.dlgEditor();
            }
            
            var cfg = _this.currentNode.elConfig;
            var data = _this.getPropDef(cfg.xtype, cfg['|xns']);
            switch(data[n] ? data[n].type.toLowerCase() : '') {
                case 'object': return _this.dlgEditor();
                case 'function': return _this.dlgEditor();
                
                case 'mixed': return this.editors["string"];
                case 'string': return this.editors["string"];
                case 'number':  return this.editors["string"];
                case 'boolean':  return this.editors["boolean"];
                default: 
                    return this.editors["string"];
            }
            
        };
        
        
        this.menu =  new Roo.menu.Menu({

            items: [
                {
                    text: 'Delete Property / Event',

                    handler : function() {
                        var rc = _this.grid.getSelectionModel().getSelectedCell();
                        var n = _this.grid.getDataSource().getAt(rc[0]).data.name;
                        if (n == 'xtype') {
                            return;
                        }
                        if (n[0] == '!') {
                                delete _this.currentNode.elConfig.listeners[n.substring(1)];
                        } else {
                            delete _this.currentNode.elConfig[n];
                        }
                        
                        _this.setCurrrentNode(_this.currentNode);
                        var bp = Pman.Tab.BuilderPanel;
                        bp.redraw.defer(100,bp, [true]);
                        _this.currentNode.setText(
                            Pman.Tab.BuilderTree.configToText(_this.currentNode.elConfig)
                        );
                    }
                },
                {
                    text: 'Change Property to Javascript',

                    handler : function() {
                        
                        var rc = _this.grid.getSelectionModel().getSelectedCell();
                        var n = _this.grid.getDataSource().getAt(rc[0]).data.name;
                        if (n == 'xtype') {
                            return;
                        }
                        if (n[0] == '!') { //event
                            return;
                        }
                        
                        var val = _this.currentNode.elConfig[n];
                        
                        delete _this.currentNode.elConfig[n];
                        n = n.replace(/^[|]+/, ''); // dotn multi add..
                        _this.currentNode.elConfig['|'+n] = val;
                        _this.setCurrrentNode(_this.currentNode);
                        var bp = Pman.Tab.BuilderPanel;
                        bp.redraw.defer(100,bp, [true]);
                        _this.currentNode.setText(
                            Pman.Tab.BuilderTree.configToText(_this.currentNode.elConfig)
                        );
                    }
                },{
                    text: 'Change Property to String',

                    handler : function() {
                        var rc = _this.grid.getSelectionModel().getSelectedCell();
                        var n = _this.grid.getDataSource().getAt(rc[0]).data.name;
                        if (n == 'xtype') {
                            return;
                        }
                        if (n[0] == '!') { //event
                            return;
                        }
                        var val = _this.currentNode.elConfig[n];
                        delete _this.currentNode.elConfig[n];
                        
                        n = n.replace(/^[|]+/, '');
                        _this.currentNode.elConfig[n] = val;
                        _this.setCurrrentNode(_this.currentNode);
                        var bp = Pman.Tab.BuilderPanel;
                        bp.redraw.defer(100,bp, [true]);
                        _this.currentNode.setText(
                            Pman.Tab.BuilderTree.configToText(_this.currentNode.elConfig)
                        );
                    }
                }
                
            ]
        });
            
        this.panel  = parentLayout.add(region,  new Roo.GridPanel(this.grid ,
            { fitToframe: true,fitContainer: true, title: "Properties" })
        );
        this.grid.render();
        this.grid.getColumnModel().renderCellDelegate = function(v, p)
        {
            return String.format('<span qtip="{1}">{0}</span>', v , 
                '<pre>'+Roo.util.Format.htmlEncode(''+v).replace(/\n/g,'<br/>')+'</pre>');
        };
        this.grid.getColumnModel().renderPropDelegate = function(v,p) {
            //console.log(v+':'+_this.getDesc(v));
            if (v[0] == '!') {
                    
                    return String.format('<b style="color:blue " qtip="{2}">{1}</b>',
                    Roo.util.Format.htmlEncode(_this.getEvtDesc(v.substring(1))), v.substring(2));
            }
            
            return String.format('<b qtip="{0}">{1}</b>', Roo.util.Format.htmlEncode(_this.getDesc(v)),v );
        };
        
        var gridHead = this.grid.getView().getHeaderPanel(true);
        //this.toolbar = new Roo.Toolbar(gridHead);
        this.toolbar = new Roo.Toolbar(gridHead.createChild({tag: 'span'}));
       
       
       
        this.addsel = new Roo.form.ComboBox({
            
         
            selectOnFocus:true,
           
            allowBlank : true,
            width: 80,
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
                    }
                },
                reader: {
                    root : 'data',
                    totalProperty : 'total',
                    id : 'id',
                    xtype : 'JsonReader',
                    fields : [
                        'name', 'desc', 'type'
                    ]

                }
            },
            emptyText : "Property",
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
                    _this.addProp(rec.data.name, rec.data.type);
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


        this.evtsel = new Roo.form.ComboBox({
            
            emptyText: "Handler",
            selectOnFocus:true,
           
            allowBlank : true,
            width: 70,
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
                    _this.addEvtProp(rec.data.name, rec.data.sig);
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


       
       
        this.toolbar.add( "Add:",  this.addsel, this.evtsel,
        {
            text: "Other",
            menu : {
                items : [
                    {
                        text: "New Property or Method",
                        handler : function()
                        {
                            
                            Roo.MessageBox.prompt("Add Other Property or method", "Enter Name of property to add, prefix with '|' (pipe) to add a JS function/string", function(b,t) {
                                if (b != 'ok') {
                                    return;
                                }
                                 _this.addProp(t, 'String');
                            })
                        }
                    },
                    {
                        text: "New Event Handler",
                        handler : function()
                        {
                            
                            Roo.MessageBox.prompt("Add Other Event Handler", "Enter Name of event to handle", function(b,t) {
                                if (b != 'ok') {
                                    return;
                                }
                                 _this.addEvtProp('|' + t, 'String');
                            })
                        }
                    }
                ]
            }
            
        }); 
        
        
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
            this.currentNode = node;
            this.setSource(this.currentNode.elConfig);
            
            
            // for anything that is a onject - ecode it to set it..
            // probably should dupe the config first..
            
            //p.setSource(ncfg);
           
            
            //if (node.fEl == this.builderPanel) {
        //		p.disable();
        //	}
        }
    },
    
    
    getPropDef : function(xt,xns)
    {
        // phase this out..!
        var xtype = xt && xt[0] == '*' ? xt.substring(1) : xt;
        
        var xpre = xns ? (xns + '.') :  '';
        if (typeof(this.propdefs[xpre + xtype]) != 'undefined') {
            return this.propdefToMap(xpre +  xtype);
        }
        var _this= this;
        var ret = {};
           
        Roo.each([ 'Roo',  'Roo.menu' , 'Roo.form',  'Roo.data',   'Roo.grid',   'Roo.Toolbar' ], function(i) {
            
            if (typeof(_this.propdefs[i +'.' + xtype]) != 'undefined') {
                
                ret = _this.propdefToMap(i +'.' + xtype);
                return false;
            }
        });
        return ret;
        
    },
    // map the props!!
    propdefToMap : function(cls)
    {
        var ret = {};
        if ((typeof(this.propdefs[cls].props) == 'undefined') || !this.propdefs[cls].props.length) {
            return ret; 
        };
        Roo.each(this.propdefs[cls].props, function(c) {
            ret[c.name] = c;
        });
        return ret;
    },
   
    getDesc :function(prop) {
        
       
        if (prop == 'xtype') {
            return 'Element Type';
        }
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
     /* ------------------------ event STUFF ---------------*/
    getEvtDesc :function(prop) {
         
       
        if (typeof(this.currentNode.elConfig) == 'undefined') {
             return '?';
        }
        var cfg = this.currentNode.elConfig;
        
        var data = this.getEvtPropDef(cfg.xtype, cfg['|xns']);
        var pp= prop.replace('|', '');
        
        if ((typeof(data[pp]) == 'undefined') || (typeof(data[pp].desc) == 'undefined')) {
            return '';
        }
        return data[pp].desc;
       
       
    },
    
    
    getEvtPropDef : function(xtype,xns)
    {
        // phase this out..!
        
        
        var xpre = xns ? (xns + '.') :  '';
        if (typeof(this.propdefs[xpre + xtype]) != 'undefined') {
            return this.evtPropdefToMap(xpre +  xtype);
        }
        var _this= this;
        var ret =  {}; 
        Roo.each([ 'Roo',  'Roo.menu' , 'Roo.form',  'Roo.data',   'Roo.grid',   'Roo.Toolbar' ], function(i) {
         
            if (typeof(_this.propdefs[i +'.' + xtype]) != 'undefined') {
                ret =  _this.evtPropdefToMap(i +'.' + xtype);
                return true;
            }
        });
        return ret;
        
    },
    // map the props!!
    evtPropdefToMap : function(cls)
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
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
    dlgEditor : function() {
        
        var _this = this;
        return {
            
            rendered : true,
            on : function() { },
            startEdit: function(c,v) { 
              //  console.log(this.record);
                var ename = this.record.data.name +'';
                
                Pman.Dialog.BuilderSourceEdit.show({
                    title : "Property: " +  ename,
                    value : v
                }, function(d) {
                    if (ename[0] == '!') {
                        _this.currentNode.elConfig.listeners[ename.substring(1)] = d.value;
                    } else {
                        _this.currentNode.elConfig[ename] = d.value;
                    }
                    
                    
                    
                    _this.setCurrrentNode(_this.currentNode);
                    var bp = Pman.Tab.BuilderPanel;
                    bp.redraw.defer(100,bp, [true]);
                });
            
            },
            completeEdit: function() { }
        };
    },
     
    setSource : function(config)
    {
        
        var cfg = {};
        for (var k in config) {
            //if (k.charAt(0) == '*') {
            //    continue; // dont show props..
            //}
            if (k  == 'listeners') {
                for (var kk in config[k]) {
                    cfg['!' + kk ] = config[k][kk];
                }
                
                continue;
            }
            if (k  == 'items') {
                continue;
            }
            if (typeof config[k] == 'object') {
                
                try {
                    var ec = Roo.encode(config[k]);
                    cfg[k] = ec;
                } catch(e) {}
                continue;
            }
            cfg[k] = config[k];
        }
        
        if (!cfg.xtype) {
            return;
        }
    
        this.grid.setSource(cfg);
    
        
        
    },
    addProp:  function (name, type) { // messy but will do..
        var c = this.currentNode.elConfig;
        if (typeof(c[name]) != 'undefined') {
            return;
        }
        var _this = this;
        // some properties involve adding nodes...!!!
             
                // should handle *prop types...
        switch(type.toLowerCase()) {
            case 'function': 
                c['|'+name] = 'function() {'+"\n\n" + '}'; 
                Pman.Dialog.BuilderSourceEdit.show({
                    title : "Property: " + name,
                    value : '{}'
                }, function(d) {
                    _this.currentNode.elConfig['|'+ name] = d.value;
                    _this.setCurrrentNode(_this.currentNode);
                    var bp = Pman.Tab.BuilderPanel;
                    bp.redraw.defer(100,bp);
                });
                return;
            
            
            
            case 'object': 
                // some strings do not fire up editor...
                if (this.forceString.indexOf(name)> -1) {
                    c[name] = '';
                    break;
                }
            
                c['|'+name] = '{}'; 
                Pman.Dialog.BuilderSourceEdit.show({
                    title : "Property: " + name,
                    value : '{}'
                }, function(d) {
                    _this.currentNode.elConfig['|'+ name] = d.value;
                    _this.setCurrrentNode(_this.currentNode);
                    var bp = Pman.Tab.BuilderPanel;
                    bp.redraw.defer(100,bp);
                });
                return;
                 
            case 'number' :  c[name] = 0; break;
            case 'boolean' :  c[name] = false; break;
            //case 'string' :  c[name] = ''; break;
            default : c[name]  = '';break;
        }
        
        this.setSource(c);
        // start editing it?

        
        var bp = Pman.Tab.BuilderPanel;
        bp.redraw.defer(100,bp, [true]);
        // ??? neeed??? -- 
        this.currentNode.setText(
            Pman.Tab.BuilderTree.configToText(this.currentNode.elConfig)
        );
    },
    addNode: function(cfg)
    {
        Pman.Tab.BuilderTree.appendNode(this.currentNode,  cfg, true);
                
    },
    addEvtProp:  function (name, sig) { // messy but will do..
        this.currentNode.elConfig.listeners = this.currentNode.elConfig.listeners || { };
       
        var c = this.currentNode.elConfig.listeners;
        if (typeof(c['|' +name]) != 'undefined') {
            return;
        }
        // get sig..
        c['|' + name] = sig;
        this.setSource(this.currentNode.elConfig);
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

// tab in admin panel...

 