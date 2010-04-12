
             
[    
    {
	    
        "grp" : "Panels", 
        "name" : "LayoutDialog", 
        
        "description" : "A Dialog with regions..", 
        "cfg" :  {
            "xtype":"LayoutDialog",
            "|xns" : "Roo",
            "background" : true,
            "width": 400,
            "height": 400,
            "title" : "Fill in title",
            "modal" : true,
            "resizable" : false,
            "collapsible" : false,
            "closable" : false,
           
            "items"  : [      
                {  
                    "xtype" : "*LayoutRegion",
                    "*prop" : "center",
                    "titlebar" : false,
                },
                {  
                    "xtype" : "*LayoutRegion",
                    "*prop" : "north",
                    "titlebar" : false,
                    "split" : "true",
                    "fitToFrame" : "true",
                    "height" : 100
                },
                {  
                    "xtype" : "*LayoutRegion",
                    "*prop" : "south",
                    "titlebar" : false,
                    "split" : "true",
                    "fitToFrame" : "true",
                    "height" : 100
                },
                    {  
                    "xtype" : "*LayoutRegion",
                    "*prop" : "east",
                    "titlebar" : false,
                    "split" : "true",
                    "fitToFrame" : "true",
                    "width" : 100
                },
                    {  
                    "xtype" : "*LayoutRegion",
                    "*prop" : "west",
                    "titlebar" : false,
                    "split" : "true",
                    "fitToFrame" : "true",
                    "width" : 100
                },
                {
                    "xtype":"ContentPanel",
                    "background" : true,
                    "fitToFrame":true,
                    "region" : "center"
                },
                {
                    "xtype" : "Array",
                    "*prop" : "buttons",
                    "items" : [
                        {
                            "text" : "Cancel",
                            "xtype" : "Button",
                            "|xns" : "Roo",
                            "listeners" : {
                                "|click" : function() {
                                    _this.form.reset();
                                    _this.dialog.hide();
                                }
                            },
                        },
                        {
                            "text" : "OK",
                            "xtype" : "Button",
                            "|xns" : "Roo",
                            "listeners" : {
                                "|click" : function() {
                                    _this.dialog.el.mask("Saving");
                                    _this.form.doAction("submit");
                                }
                            }
                        }
                            
                    ]
                
                }
            
            ]
            
        }
           
    },
    
    {
        "grp" : "Panels", 
        "name" : "ContentPanel", 
        "description" : "A ContentPanel - you can put forms / grids? onto this (Can be added to Root)", 
        "cfg" :  {
            
            "xtype":"ContentPanel",
            "background" : true,
            "fitToFrame":true,
            "region" : "center"
        }
    },
   {
	"grp" : "Panels", 
        "name" : "NestedLayoutPanel", 
        "description" : "A Panel that can have a Layout added to it. (Can be added to Root)", 
        "cfg" :  {
             
            "xtype":"NestedLayoutPanel",
            "background" : true,
            "fitToFrame":true,
            "region" : "center",
            "items" : [
            
                {
                   
                    "*prop" : "layout",
                    "xtype":"BorderLayout",
                    "items"  : [      
                        {
                            "xtype" : "*LayoutRegion",
                            "*prop" : "center",
                            "titlebar" : false
                        },
                        {  
                            "xtype" : "*LayoutRegion",
                            "*prop" : "north",
                            "titlebar" : false,
                            "split" : "true",
                            "fitToFrame" : "true",
                            "height" : 100
                        },
                        {  
                            "xtype" : "*LayoutRegion",
                            "*prop" : "south",
                            "titlebar" : false,
                            "split" : "true",
                            "fitToFrame" : "true",
                            "height" : 100
                        },
                            {  
                            "xtype" : "*LayoutRegion",
                            "*prop" : "east",
                            "titlebar" : false,
                            "split" : "true",
                            "fitToFrame" : "true",
                            "width" : 100
                        },
                        {  
                            "xtype" : "*LayoutRegion",
                            "*prop" : "west",
                            "titlebar" : false,
                            "split" : "true",
                            "fitToFrame" : "true",
                            "width" : 100
                        }
                    ]   
                }
            ]
            
            
            
        }
    },
    {
        "grp" : "Panels", 
        "name" : "TreePanel", 
        "description" : "A TreePanel", 
        "cfg" :  {
            "xtype":"TreePanel",
            "|xns" : "Roo",
            "background" : "true",
            "fitToFrame": "true",
            "region" : "center",
            "items" : [
                {
                    "*prop" : "tree", 
                    "xtype" : "TreePanel",
                    "|xns" : "Roo.tree",
                    "containerScroll": "true",
                    "width": 550,
                    "height": 300,
                        
                    "rootVisible" : true,
                            
                         
                        
                    "loadMask": true,
                    "iconCls"         : "icon-el",
                    "collapsible"     : true,
                    "floatable"      : false,
                    "ddScroll"        : true,
                   
                    "animate"         : false,
                    "enableDD"        : true,
                    "ddGroup"         : "component",
                    "containerScroll" : true,
                    "items" : [
                        {
                            "*prop" : "root", 
                            "xtype" : "TreeNode",
                            "text", "root",
                            "|id"  : "Roo.id()",
                            "|xns" : "Roo.tree",
                         
                            "draggable" : false
                        }
                    ]
                            
                  
                }
            ]
        }
    }
]