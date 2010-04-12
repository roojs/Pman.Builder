

[
    {
        "grp" : "Form", 
        "name" : "Column (for Grid)", 
        "description" : "A Column to add to a Column Model", 
        "cfg" :  {
            
                "xtype": "*ColumnModel",
                "header": "Col1",
                "dataIndex" : "c1",
                "width" : 100,
                "|renderer" : function() { 
                },
                "items" : [ {
                    
                    "*prop" : "editor",
                    "xtype" : "GridEditor"
                }]
        }
    }
]