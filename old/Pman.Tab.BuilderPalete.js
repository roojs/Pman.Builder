//<script type="text/javascript">
// tab on left...  

Pman.on('beforeload', function()
{
    // this is always shown if Clipping module is enabled!!
    //if (!Pman.hasPerm('Admin.Campaigns', 'E')) {
    //    return;
    //}
    Pman.register({
        modKey : '016-pman-tab-builderpalete',
        module : Pman.Tab.BuilderPalete,
        region : 'east',
        parent : Pman.Tab.Builder,
        name : "Builder Palete"
    });
});
 

 
// - our name needs to avaiable at load time.

// our definition has to be wrapped so it's created after load time...

// it would be nice if we could extend existing objects..!?!? 

//our module load could do 'new' on the module to create it..
// but our naming called from elsewhere would break!?!?




Pman.Tab.BuilderPalete = {
    
    panel : false,
    
    
    add : function(parentLayout, region) {
        
         var _this= this;
        if (this.panel) {
            parentLayout.getRegion(region).showPanel(this.panel);
            return;
        }
        var regel = parentLayout.getRegion(region).el.createChild({tag:'div', style: 'margin:0px;'});
        var tb = new Roo.Toolbar(regel.createChild());
        var be = regel.createChild();
        
        this.panel = parentLayout.add(region, 
            new Roo.ContentPanel(
                regel, 
                {
                    autoScroll: true,
                    toolbar: tb,
                    background : false,
                    fitToFrame:true,
                    resizeEl: be,
                    fitContainer: true
                  //  title : "Summary"
                }
            )
        ); 
         
        //var data = this.getComponents();
      
        //var rzel = this.panel.el.createChild({tag:'div', style: 'margin:0px;'})
        //this.panel.resizeEl = rzel;
        var view = new Roo.DDView(be,
            '<div class="b-component" qtip="{description}">{name}</div>',
            {
               name:'subComponents',
               copy: true,
                dragGroup : 'component',
                
                singleSelect: true,
                multiSelect: false,
                selectedClass: "selected",
                store:  new Roo.data.Store({
                    proxy: {
                        xtype: 'HttpProxy',
                        url: baseURL + '/Builder/Elements.php',
                        method: 'GET'
                    }, 
                    listeners : {
                        beforeload: function(s, o) {
                            o.params = o.params || {}; 
                            o.params.table = _this.viewsel.getValue();
                            o.params.table = o.params.table.length ? o.params.table  : '*form';
                            //if (!_this.currentNode || !_this.currentNode.elConfig) {
                            //    return false;
                            //}
                           // o.params.xtype =  _this.currentNode.elConfig.xtype;
                        }
                    },
                    reader: {
                        root : 'data',
                        totalProperty : 'total',
                        id : 'id',
                        xtype : 'JsonReader',
                        fields : [
                            'grp', 'name', 'description', 'cfg'
                        ]

                    }
                })
            }
		);
         
        this.view = view;
       
         
        this.viewsel = new Roo.form.ComboBox({
            
         
            selectOnFocus:true,
           
            allowBlank : true,
            width: 150,
            editable: false,
            
            store: {
                xtype : 'Store',
                
                  // load using HTTP
                proxy: {
                    xtype: 'HttpProxy',
                    url: baseURL + '/Builder/Elements.php',
                    method: 'GET'
                }, 
                listeners : {
                    beforeload: function(s, o) {
                        o.params = o.params || {}; 
                        //if (!_this.currentNode || !_this.currentNode.elConfig) {
                        //    return false;
                        //}
                       // o.params.xtype =  _this.currentNode.elConfig.xtype;
                    }
                },
                reader: {
                    root : 'data',
                    totalProperty : 'total',
                    id : 'id',
                    xtype : 'JsonReader',
                    fields : [
                        'name', 'table'
                    ]

                }
            },
            
            displayField:'name',
            valueField : 'table',
            
            typeAhead: true,
            forceSelection: true,
           
            triggerAction: 'all',
             
            tpl: new Roo.Template(
                '<div class="x-grid-cell-text x-btn button">{name}</div>'
            ),
             
            //queryParam: 'query[name]',
            loadingText: "Searching...",
            listWidth: 300,
           
            minChars: 2,
            //pageSize:20,
            listeners : {
                select :  function(cb, rec, ix) {
                    cb.lastData = rec.data;
                    _this.view.store.load({});
                },
                collapse : function()
                {
                    this.lastQuery = '~~~~~~~~'; // force a query!
                }
            },
            lastData : false
             
        });
        
        tb.add(this.viewsel);



         
         
    },
    /*
    getComponents : function()
    {
        var data = [];
		// Form elements
		data.push(
			['Forms','Field Set', 'A Fieldset, containing other form elements',
				{
                    xtype:'FieldSet' ,
                    legend :'Legend',
                    autoHeight:true
                }
            ],
            ['Forms','Row', 'A Row of form elements',
				{
                    xtype:'Row' ,
                    autoHeight:true
                }
            ],
            ['Forms','Column', 'A Column of form elements',
				{
                    xtype:'Column' ,
                    autoHeight:true
                }
            ],
			['Forms','Combo Box', 'A combo box',
				{
                    xtype:'ComboBox',
                    fieldLabel:'Text',
                    name:'combovalue',
                    hiddenName:'combovalue',
                    store : {
                        xtype : 'SimpleStore',
                        fields : [ 'display' ],
                        value : [ [ 'list of data' ]]
                    }
                }
            ],
			['Forms','Text Field', 'A Text Field',
				{   
                    xtype:'TextField',
                    fieldLabel:'Text',
                    name:'textvalue'
                }
            ],
			['Forms','Number Field', 'A Text Field where you can only enter numbers',
				{
                        xtype:'NumberField',
                        fieldLabel:'Number',
                        name:'numbervalue'
                }
            ],
			 
			['Forms','Check Box', 'A checkbox',
				{ 
                    xtype:'Checkbox',
                    fieldLabel:'Label',
                    boxLabel:'Box label',
                    name:'checkbox',
                    inputValue:'cbvalue'
                }
            ],
			['Forms','Radio Box', 'A radio form element',
				{   
                    xtype:'Radio',
                    fieldLabel:'Label',
                    boxLabel:'Box label',
                    name:'radio',
                    inputValue:'radiovalue'
                }
            ],
            ['Forms,Panels', 'Form Panel', 'A panel containing form elements',
				{
                        xtype:'Form',
                        name:'Form'
                }
            ]
			
        );
        return data;

    }
    */
    // menu's - right clicks to add stuff...
    // put here, as they are really a palete option
    // used by tree / (panel?)
    
    getMenu : function(xtype, altx)
    {
        if (!this.menus) {
            this.menus = this.getMenus();
        }
        
        if (altx && typeof(this.menus[xtype]) == 'undefined') {
            xtype = altx;
        }
        if (typeof(this.menus[xtype]) == 'undefined') {
            this.menus[xtype] = new Roo.menu.Menu({ items : this.menus['_delete'] });
            return this.menus[xtype];
        }
        if (typeof(this.menus[xtype].items) == 'undefined') {
            var cfg = this.menus[xtype];
            cfg.push(this.menus['_delete'][0]);
            this.menus[xtype] = new Roo.menu.Menu({ items : cfg });
        }
        return this.menus[xtype];
    },
    getHandler : function(x) {
        if (!this.handlers) {
            this.handlers = this.getHandlers();
        }
        return this.handlers[x];
    },
    getHandlers :function () {
        var _this = this;
        var addGen = function(cfg, redraw, after)
        {  
            var _bt = Pman.Tab.BuilderTree;
            var nbt = _bt.appendNode(_bt.currentNode, cfg, true) ;
            _bt.setCurrentNode(nbt,true);
            if (redraw) {
                var bp = Pman.Tab.BuilderPanel;
                bp.redraw.defer(100,bp, [true]);
            }
     
            if (after) {
                 _this.getHandler(after)();
            }
        };
        
        return  {
            '_delete' :function () {
                 var _bt = Pman.Tab.BuilderTree;
                 _bt.deleteCurrent();
            },
            
            'LayoutDialog.buttons' :function () {
                addGen({ xtype : 'Array', '*prop' : 'buttons' }, false,'Button') ;
                 
            },
             
            'ContentPanel.toolbar' :function () {
                addGen({ xtype : 'Toolbar', '*prop' : 'toolbar' }, false) ;
                 
            },
            
            'Grid.menu' :function () {
                addGen({ xtype : 'Menu',  '|xns' : 'Roo.menu', '*prop': 'menu' }, true) ;
            },
            'Grid.footer' :function () {
                addGen({ xtype : 'PagingToolbar',  '|xns' : 'Roo', '*prop': 'footer' }, true) ;
            },
            'Grid.RowSelectionModel' :function () {
                addGen({ xtype : 'RowSelectionModel',  '|xns' : 'Roo.grid', '*prop': 'selModel' }, true) ;
            },
            'Grid.CellSelectionModel' :function () {
                addGen({ xtype : 'CellSelectionModel',  '|xns' : 'Roo.grid', '*prop': 'selModel' }, true) ;
            },
            
            'Button.Menu': function () { 
                    addGen({xtype: 'Array',  '*prop': 'menu'  },true); 
            },
            
            'Menu.Item': function () { addGen({xtype: 'Item', '|xns' : 'Roo.menu', text: 'btn' },true); },
            'Menu.CheckItem': function () { addGen({xtype: 'CheckItem', text: 'btn' },true); },
            'Menu.ColorMenu': function () { 
                addGen({xtype: 'Item', text : 'clr', items : [{
                    '*prop': 'menu', xtype : 'ColorMenu', '|xns' : 'Roo.menu'
                }]},true) },
            
            'Menu.DateMenu': function () { 
                addGen({xtype: 'Item', text : 'dt', items : [{
                    '*prop': 'menu', xtype : 'DateMenu', '|xns' : 'Roo.menu'
                }]},true) },
            'Menu.SubMenu': function () { 
                addGen({xtype: 'Item', text : 'submenu', items : [{
                    '*prop': 'menu', xtype : 'Menu', '|xns' : 'Roo.menu'
                }]},true) 
            },
            
            
            'editor.GridEditor' : function() {
                addGen({xtype: 'GridEditor' , '*prop': 'editor', '|xns' : 'Roo.grid' },true);
            },
            'GridEditor.TextField' : function () { 
                addGen({xtype: 'TextField' , '*prop': 'field', '|xns' : 'Roo.form' },true);
            },
            'GridEditor.DateField' : function () { 
                addGen({xtype: 'DateField' , '*prop': 'field', '|xns' : 'Roo.form' },true);
            }, 
            'GridEditor.Checkbox' : function () { 
                addGen({xtype: 'Checkbox' , '*prop': 'field', '|xns' : 'Roo.form' },true);
            }, 
            'GridEditor.NumberField' : function () { 
                addGen({xtype: 'NumberField' , '*prop': 'field', '|xns' : 'Roo.form' },true);
            }, 
         
             
            'Button' :function () {
                addGen({ xtype : 'Button',  '|xns' : 'Roo', text: 'button' }, true) ;
            },
            
            'Toolbar.Button' : function () { 
                addGen({xtype: 'Button' ,  '|xns' : 'Roo.Toolbar', text: 'btn' },true);
            }, 
            'Toolbar.Fill' : function () { 
                addGen({xtype: 'Fill' ,  '|xns' : 'Roo.Toolbar' },true);
            }, 
            
            'Toolbar.Separator' : function () { 
                addGen({xtype: 'Separator' ,  '|xns' : 'Roo.Toolbar' },true);
            }, 
            'Toolbar.Spacer' : function () { 
                addGen({xtype: 'Spacer' ,  '|xns' : 'Roo.Toolbar', text: 'btn'  },true);
            }, 
            'Toolbar.TextItem' : function () { 
                addGen({xtype: 'TextItem' ,  '|xns' : 'Roo.Toolbar', text: 'btn'  },true);
            }, 
            'Toolbar.SplitButton' : function () { 
                addGen({xtype: 'SplitButton' ,  '|xns' : 'Roo.Toolbar', text: 'btn',  items : [{
                '*prop': 'menu', xtype : 'Menu', '|xns' : 'Roo.menu'
               }]} ,true);
            },
            
            'Form.Row' :   function () {  
                addGen({xtype: 'Row' , labelWidth:100, width: 400 }, true); 
            },
            'Form.Column' :   function () {  
                addGen({xtype: 'Column' ,  labelWidth:100,width: 400 }, true); 
            },
            'Form.FieldSet' :   function () {  
                addGen({ xtype: 'Column' ,  labelWidth: 100, legend: "Legend", width: 400  }, true); 
            }, 
            'Form.Button' :   function () {  
                addGen({ xtype: 'Column' , '|xns' : 'Roo', text : 'btn' }, true); 
            },
            'store.SimpleStore' :   function () {  
                addGen({ xtype: 'SimpleStore' , '|xns' : 'Roo.data', '*prop': 'store' }, true); 
            },
            'reader.JsonReader' :   function () {  
                addGen({ xtype: 'JsonReader' , '|xns' : 'Roo.data', '*prop': 'reader',   root: 'data',
                    totalProperty: 'total', id: 'id' , '|fields' : '[]'}, true); 
            },
            
            'TreePanel.loader' : function () { 
                addGen({
                    '*prop' : 'loader',
                    xtype: 'TreeLoader' , 
                    '|xns' : 'Roo.tree',
                    '|dataUrl': 'baseURL + \'/Roo/Unknown.php\'',
                    requestMethod: 'GET',
                    root: 'data',
                    queryParam : 'name',
                    '|baseParams' : '{start: 0,limit : 9999}'
                    
                    
                },true);
            }
            
            
        };
    },
    getMenus: function() {
         
        var  _this =  this;
        
        var _bt = Pman.Tab.BuilderTree;
        var _bp = Pman.Tab.BuilderPanel;
        var iconPman = function(img) { return  { 
                text: "Set Icon",  
                handler : function () {
                    _bt.currentNode.elConfig['|icon'] = 'rootURL + \'' + img + '\'';
                    _bt.currentNode.elConfig['cls'] = 'x-btn-text-icon';
                    _bt.setCurrentNode(_bt.currentNode);
                    _bp.redraw.defer(100,_bp,[true]);
                },
                icon : rootURL +  img
            };
        };
         var iconRoo = function(img) { return  { 
                text: "Set Icon",  
                handler : function  (){
                    _bt.currentNode.elConfig['|icon'] = 'Roo.rootURL + \'' + img + '\'';
                    _bt.currentNode.elConfig['cls'] = 'x-btn-text-icon';
                    _bt.setCurrentNode(_bt.currentNode);
                    _bp.redraw.defer(100,_bp,[true]);
                },
                icon : Roo.rootURL +  img
            };
        };       
        
        var ret =  {
            '_delete' : [
                {
                    text: "Delete Element",
                    handler : this.getHandler('_delete')
                }
            
            ],
            'LayoutDialog.buttons' :   [ 
                {
                    text: "Add Button",
                    handler : this.getHandler('Button')
                }
            ],
                
            LayoutDialog :  [ 
                {
                    text: "Add Button",
                    handler : this.getHandler('LayoutDialog.buttons')
                }
            ],
               
            ContentPanel :   [  
                { text: "Add Toolbar",  handler : this.getHandler('ContentPanel.toolbar') }
            ],
            
            Grid :   [  
                { text: "Add Row Selection Model",  handler : this.getHandler('Grid.RowSelectionModel') },
                { text: "Add Cell Selection Model",  handler : this.getHandler('Grid.CellSelectionModel') },
                '-',
                { text: "Add Menu (popup Menu)",  handler : this.getHandler('Grid.menu') },
                { text: "Add Toolbar",  handler : this.getHandler('ContentPanel.toolbar') },
                { text: "Add Pager",  handler : this.getHandler('Grid.footer') }
            ],
            
            ComboBox:   [  
                { text: "Add SimpleStore",  handler : this.getHandler('store.SimpleStore') }
                
            ],
            
            // this is the GridEditor component of a *ColumnModel
            GridEditor : [
                { text: "Add TextField",  handler : this.getHandler('GridEditor.TextField') },
                { text: "Add NumberField",  handler : this.getHandler('GridEditor.NumberField') },

                { text: "Add DateField",  handler : this.getHandler('GridEditor.DateField') },
                { text: "Add Checkbox",  handler : this.getHandler('GridEditor.Checkbox') }
            
            ],
            '*ColumnModel' : [
                { text: "Add Editor",  handler : this.getHandler('editor.GridEditor') }
            ],
            
            
            
            Menu :  [
                { text: "Add Item",  handler : this.getHandler('Menu.Item') },
                { text: "Add CheckItem",  handler : this.getHandler('Menu.CheckItem') },
                { text: "Add ColorMenu",  handler : this.getHandler('Menu.ColorMenu') },
                { text: "Add DateMenu",  handler : this.getHandler('Menu.DateMenu') },
                { text: "Add SubMenu",  handler : this.getHandler('Menu.Menu') }
            ],
            
            Toolbar : [
            
                { text: "Add Button",  handler : this.getHandler('Toolbar.Button') },
                { text: "Add Fill",  handler : this.getHandler('Toolbar.Fill') },
                
                { text: "Add Separator",  handler : this.getHandler('Toolbar.Separator') },
                { text: "Add Spacer",  handler : this.getHandler('Toolbar.Spacer') },
                { text: "Add TextItem",  handler : this.getHandler('Toolbar.TextItem') },
                { text: "Add SplitButton",  handler : this.getHandler('Toolbar.SplitButton') }
            ],
            Button : [
            // maybe not the right place...
                { text: "Add Menu",  handler : this.getHandler('Button.Menu') },
               '-',
                iconPman('/Pman/templates/images/comment.gif'),
                iconPman('/Pman/templates/images/save.gif'),
                iconPman('/Pman/templates/images/refresh.gif'),
                iconPman('/Pman/templates/images/search.gif'),
                iconPman('/Pman/templates/images/edit-clear.gif'),  
                iconPman('/Pman/templates/images/trash.gif'),
                iconPman('/Pman/templates/images/mail-close.gif'),
                iconPman('/Pman/templates/images/mail-reply-sender.gif'),
                
                iconRoo('images/default/dd/drop-add.gif'),  
                iconRoo('images/default/tree/leaf.gif')
            ],
            'Form.Layout' :  [  // generic form elements
                { text: "Add Row",  handler : this.getHandler('Form.Row') },
                { text: "Add Column",  handler : this.getHandler('Form.Column') },
                { text: "Add FieldSet",  handler : this.getHandler('Form.FieldSet') },
                '-',
                { text: "Add Button",  handler : this.getHandler('Button') }
            ],
            'Store' : [
                { text: "Add JsonReader",  handler : this.getHandler('reader.JsonReader') }
            
            ],
            'TreePanel' : [
                { text: "Add loader",  handler : this.getHandler('TreePanel.loader') },
                { text: "Add Toolbar",  handler : this.getHandler('ContentPanel.toolbar') }
                
            ]
            
            
            
        };
        
        ret['Roo.TreePanel'] = ret['ContentPanel'];
        // inherited??
        ret['EditorGrid'] = ret['Grid'];
        ret['Row'] = ret['Form.Layout'];
        ret['Column'] = ret['Form.Layout'];
        ret['Fieldset'] = ret['Form.Layout'];
        ret['Form'] = ret['Form.Layout'];
        ret['Button.menu'] = ret['Menu'];
        
        return ret;
        
   } 
    
}