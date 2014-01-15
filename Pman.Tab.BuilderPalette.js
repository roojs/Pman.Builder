//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Tab.BuilderPalette = new Roo.XComponent({
    part     :  ["Builder","Palette"],
    order    : '001-Pman.Tab.BuilderPalette',
    region   : 'center',
    parent   : 'Pman.Tab.BuilderTab',
    name     : "Pman.Tab.BuilderPalette",
    disabled : false, 
    permname : '', 
    _tree : function()
    {
        var _this = this;
        var MODULE = this;
        return {
            xtype: 'GridPanel',
            xns: Roo,
            listeners : {
                activate : function() {
                    _this.panel = this;
                    if (_this.grid) {
                       _this.grid.ds.load({})
                    }
                }
            },
            background : true,
            fitContainer : true,
            fitToframe : true,
            region : 'east',
            tableName : 'palette',
            title : "palette",
            grid : {
                xtype: 'Grid',
                xns: Roo.grid,
                listeners : {
                    render : function() 
                    {
                        _this.grid = this; 
                        //_this.dialog = Pman.Dialog.FILL_IN
                        if (_this.panel.active) {
                           this.ds.load({})
                        }
                        if (_this.ss) {
                            return;
                        }
                        _this.ss =   Roo.util.CSS.createStyleSheet(
                    '.pman-builder-palete-hide { display: none; } ' + "\n" 
                    , Roo.id())
                        
                        
                        
                    },
                    rowclass : function (gridview, rowcfg)
                    {
                        var sn = Pman.Builder.Tree.currentNodeType();
                      //  Roo.log(rowcfg);
                        if (!sn) {
                            sn = '*top';
                        }
                        var cls = 'pman-builder-palete-hide';
                       
                     
                        Roo.each(rowcfg.record.json.parents, function(n) {
                            if (n == sn || n.split(':').shift() == sn) 
                                cls = '';
                                return true;
                            }
                         );
                         //Roo.log(cls);
                         rowcfg.rowClass = cls;
                        // what is the currently selected element..
                     
                    }
                },
                autoExpandColumn : 'name',
                ddGroup : 'component',
                enableDrag : true,
                loadMask : true,
                dataSource : {
                    xtype: 'Store',
                    xns: Roo.data,
                    remoteSort : true,
                    sortInfo : { field : 'name', direction: 'ASC' },
                    proxy : {
                        xtype: 'HttpProxy',
                        xns: Roo.data,
                        method : 'GET',
                        url : baseURL + '/Builder/Palette.php'
                    },
                    reader : {
                        xtype: 'JsonReader',
                        xns: Roo.data,
                        id : 'id',
                        root : 'data',
                        totalProperty : 'total',
                        fields : [
                            
                            {
                                'name': 'name',
                                'type': 'string'
                            }
                        ]
                    }
                },
                colModel : [
                    {
                        xtype: 'ColumnModel',
                        xns: Roo.grid,
                        dataIndex : 'name',
                        header : 'Name',
                        width : 200,
                        renderer : function(v) { return String.format('{0}', v); }
                    }
                ],
                sm : {
                    xtype: 'RowSelectionModel',
                    xns: Roo.grid,
                    singleSelect : true
                }
            }
        };
    }
});
