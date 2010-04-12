//<script type="text/javascript">


/**
* http://tof2k.com/ext/formbuilder/main.js?v2
*/

 
Pman.on('beforeload', function()
{
    if (!Pman.hasPerm('Builder.Builder', 'S')) {
        return;
    }
    
    
    Pman.register({
        modKey : '015-pman-tab-builder',
        module : Pman.Tab.Builder,
        region : 'center',
        parent : Pman.Tab.BuilderTab,
        name : "Builder Tab",
        finalize : function() {
            
            
            
            var _this = Pman.Tab.Builder;
            
            _this.builderPanel = Pman.Tab.BuilderPanel;
            _this.treePanel = Pman.Tab.BuilderTree;
            if (!_this.layout) {
                return;
            }
            _this.layout.getRegion('center').showPanel(0);
            _this.layout.endUpdate(); 
            //_p.refreshPager.defer(1000, _p);
            
        }
    });
    
    
        
          
    
});




Pman.Tab.Builder = {
    FIELDS : { }, 
    tab : false,
    layout : false,
    
    
    autoUpdate : true,
    undoHistory : [],
    undoHistoryMax : 20,
    
    
    
    builderPanel : false, //???
    treePanel : false, //??
    
    add : function(parentLayout, region)
    {
        
         
        this.layout = new Ext.BorderLayout(
            parentLayout.getEl().createChild({tag:'div'}),
            {
                north : {
                    height  : 26,
                    titlebar: false
                },
                west : {
                    border: false,
					width : 255,
					split : true
                },
                center :{
					region:'center',
					//layout:'fit',
					border:false,
					bodyBorder:false
					//style:'padding:3px 5px;background:black',

				},
                east : {
                    collapsible : true,
                    collapsed : false,
                    split : true,
					width : 200,
                    titlebar: true,
                    title : "Palate"
                }
                  
            }
        );
        
        //throw 'done';
        
        this.tab = parentLayout.add(region,  
            new Ext.NestedLayoutPanel(
                this.layout, 
                { 
                    title: "Builder",
                    listeners : {
                        deactivate : function() {
                           // console.log('deactivate');
                            if (Pman.Tab.BuilderPanel.dialog) {
                                Pman.Tab.BuilderPanel.dialog.hide();
                            }
                        },
                        activate : function() {
                            if (Pman.Tab.BuilderPanel.dialog) {
                                Pman.Tab.BuilderPanel.dialog.show();
                            }
                        }
                    }
                //, toolbar: mainTb 
                }
            )
        );
        
        // global delete. - bit messy if 
        Roo.get(document).on(   'keyup',
              function(e) {
                if (!  Pman.Tab.Builder.tab.active ) {
                    return;
                }
                 
                
                if (!Pman.Tab.BuilderPanel.isMouseOver && !Pman.Tab.BuilderTree.isMouseOver) {
                    
                    return;
                }
               // console.log(e);
                //Roo.EventObject.DELETE,
                if (e.getCharCode() == Roo.EventObject.DELETE) {
                  //  console.log('delete');
                    var res = Pman.Tab.BuilderTree.deleteCurrent();
                    if (res) {
                         var bp = Pman.Tab.BuilderPanel;
                        bp.redraw.defer(100,bp, [ true ]);
                        
                    }
                    e.stopEvent();
                }
                
                
                
                
            },
             this
        );
        
       
        this.layout.beginUpdate(); 
        
        
        
        Pman.request({
            method: 'GET',
            url: baseURL + '/Builder/Readers.php',
            success : function(data)
            {
                Roo.each(data, function(d) {
                    Roo.get(document.body).createChild(
                    {
                        tag:'script',
                        ns: 'html',
                        src : rootURL + '/' + d,
                        'type': 'text/javascript'
                    }
                    );
                });
            }
        })
      
        //this.adminLayout.beginUpdate();
    },
    // draw the 
    
    //--------------------___ UNDO STUFF
    initUndoHistory : function() {
		this.undoHistoryMax = 20;
		this.undoHistory = [];
	},               
    
    markUndo : function(text) {
		this.undoHistory.push(
            {
                    text:text,
                    config:Pman.Tab.BuilderTree.toJS(Pman.Tab.BuilderTree.tree.root)
            });
		if (this.undoHistory.length > this.undoHistoryMax) {
			this.undoHistory.remove(this.undoHistory[0]);
		}
		this.updateUndoBtn();
	},
    updateUndoBtn : function() {
        /*
        var btn = Ext.ComponentMgr.get('FBUndoBtn');
        
		if (this.undoHistory.length == 0) {
			btn.disable();
            btn.setText('Undo');
            return;
		} 
        btn.enable()
        btn.setText('<b>Undo</b> : ' + this.undoHistory[this.undoHistory.length-1].text);
        */
		
	},
    undo : function() {
		var undo = this.undoHistory.pop();
		this.updateUndoBtn();
		if (!undo || !undo.config) { return false; }
		this.setConfig(undo.config);
		return true;
	},
    markUndo : function(text) {
		this.undoHistory.push({text:text,config:Pman.Tab.BuilderTree.toJS(Pman.Tab.BuilderTree.tree.root)});
		if (this.undoHistory.length > this.undoHistoryMax) {
			this.undoHistory.remove(this.undoHistory[0]);
		}
		this.updateUndoBtn();
	},

    
    
    
    
    resetAll : function() {
		
		var node = this.setConfig({items:[]});
		this.setCurrentNode(node, true);
	}
    /*
    setConfig : function(config) {
		if (!config || !config.items) { return false; }
		// delete all items
		this.removeAll();
		// add all items
		var root = this.treePanel.tree.root;
		var node = null;
		for (var i = 0; i < config.items.length; i++) {
			try {
				node = this.appendConfig(config.items[i], {
                    appendTo: root,
                    doUpdate: false,
                    markUndo : false
                });
                    
                
			} catch(e) {
				Ext.Msg.alert("Error", "Error while adding : " + e.name + "<br/>" + e.message);
			}
		}
		this.updateForm(true, root);
		return node || root;
	},
    
    
     
    
    getNodeForEl : function(el) {
         
		var search = 0;
		var target = null;
		while (search < 10) {
			target = Roo.get(el);
			if (target && target._node) {
				return target._node;
			}
			el = el.parentNode;
			if (!el) { break; }
			search++;
		}
		return null;
	},
     */

};
        
    