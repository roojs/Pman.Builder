// sudo js -- it has to be pre-processed
// stripping commets at top, then joining stuff..
// Form related elements..
// <script type="text/javascript">
[
    {
        "grp" : "Forms", 
        "name" : "Form", 
        "description" : "A panel containing form elements", 
        "cfg" :  {
            
            "xtype":"Form",
            "listeners" : {
                 
                "|actionfailed" : function (_self, action) 
                {
                   _this.dialog.el.unmask();
                    Pman.standardActionFailed(_self, action);
                },
                
                "|actioncomplete" :  function (_self, action)
                {
                    //_this.dialog.el.unmask();
                    //_this.dialog.hide();

                    if (_this.callback) {
                        _this.callback.call(_this, _this.form.getValues());
                    }
                    _this.form.reset();
                },

                "|rendered" : function (_self)
                {
                    _this.form = _self;
                }

                }

            
        }
    },

    {
        "grp" : "Forms", 
        "name" : "Field Set", 
        "description" : "A Fieldset, containing other form elements", 
        "cfg" :  {
            
                "xtype":"FieldSet",
                "legend":"Legend"
       }
    },

     {
        "grp" : "Forms", 
        "name" : "Row", 
        "description" : "A Row, containing other form elements", 
        "cfg" : {
                "xtype":"Row",
                "width":400
         }
    },
      {
        "grp" : "Forms", 
        "name" : "Column", 
        "description" : "A Column, containing other form elements", 
        "cfg" :  {
            
                "xtype":"Column",
                "width":"400"
        }
    },
    
     {
        "grp" : "Forms", 
        "name" : "TextField", 
        "description" : "Text Field", 
        "cfg" :  {
            
                "xtype":"TextField",
                "width":"200",
                "fieldLabel": "",
                "name" : "",
                "allowBlank": true
        }
    },
     {
        "grp" : "Forms", 
        "name" : "TextArea (Multiline)", 
        "description" : "Text Area", 
        "cfg" :  {
            
                "xtype":"TextArea",
                "width": 200,
                "height": 100,
                "fieldLabel": "",
                "name" : "",
                "allowBlank": true
        }
    },
    
     {
        "grp" : "Forms", 
        "name" : "Checkbox", 
        "description" : "Check Box", 
        "cfg" :  {
            
                "xtype":"CheckBox",
                "width":"200",
                "fieldLabel": "",
                "boxLabel": "",
                "name" : "",
                "checked" : false,
                "inputValue" : 1,
                "valueOff" : 0
        }
    },
    {
        
        "grp" : "Forms", 
        "name" : "Combo: Simple select - key/value", 
        "description" : "Check Box", 
        "cfg" :  {
            name : '',
            fieldLabel : "",
            width : 200,
            xtype : 'ComboBox',
            displayField : 'key',
            valueField : 'value',
            hiddenName : '',
            mode : 'local',
            triggerAction : 'all',
            editable : false,
            listWidth : 200,
            allowBlank : false,
            items : [
                {
                    
                    '*prop': 'store',
                    xtype : 'SimpleStore',
                    '|xns': 'Roo.data',
                    '|fields': "[ 'key', 'value']",
                    '|data':  "[ 'a', 'b' ]"
                }
            ]
        }
    },
    
        {
        
        "grp" : "Forms", 
        "name" : "Combo: Simple select - value only", 
        "description" : "Check Box", 
        "cfg" :  {
            name : '',
            fieldLabel : "",
            width : 200,
            xtype : 'ComboBox',
            displayField : 'value',
            valueField : 'value',
            hiddenName : '',
            mode : 'local',
            triggerAction : 'all',
            editable : false,
            listWidth : 200,
            allowBlank : false,
            items : [
                {
                    
                    '*prop': 'store',
                    xtype : 'SimpleStore',
                    '|xns': 'Roo.data',
                    '|fields': "[  'value']",
                    '|data':  "[  'a' ]"
                }
            ]
        }
    },         
    {
        "grp" : "Forms", 
        "name" : "GridField (Editable)", 
        "description" : "A Editable Grid inside a form", 
        "cfg" :  {
            "xtype":"GridField",
            "name" : "gfield",
            "value" : "[ {},{},{},{} ]",
            "items" : [
                {
                    
                    "*prop" : "xgrid",
                    "xtype" : "EditorGrid",
                    "width" : 300,
                    "height" : 150,
                    "items" : [
                        {
                            "*prop" : "dataSource",
                            "xtype" : "Store",
                            "items" : [ {
                                
        
                                "*prop" : "proxy",
                                "xtype": "MemoryProxy",
                                "|data": "[]"
                            }], 
                            "|reader": "Pman.Readers.Person",
                        },
                        {
                            "*prop" : "colModel",
                            "xtype" : "Array",
                            "items" : [
                                {
                                    "xtype": "*ColumnModel",
                                    "header": "Col1",
                                    "dataIndex" : "c1",
                                    "|renderer" : function() { 
                                    },
                                    "items" : [ 
                                    {
                                        
                                        "*prop" : "editor",
                                        "xtype" : "GridEditor"
                                    }]
                                },
                                {
                                    "xtype": "*ColumnModel",
                                    "header": "Col1",
                                    "dataIndex" : "c1",
                                    "|renderer" : function() { 
                                    },
                                    "items" : [ {
                                        
                                        "*prop" : "editor",
                                        "xtype" : "GridEditor"
                                    }]
                                }
                                    
                                    
                            ]
                        }
                            
                    ]
      
                        
                }
            ]               
                                
        }
    },
    
    
    
    
    {
          
        "grp" : "Form", 
        "name" : "Combo: Country", 
        "description" : "Combo: Country (using I18n code)", 
        "cfg" :  {
           
            "name"  :  "country_title",
            "xtype"  :  "ComboBox",   
            
            "hiddenName"  :  "country",
            "width"  :  290,
            "listWidth"  :  300,
            "fieldLabel"  :  "Country",
            "allowBlank"  :  false,
            
            
            "qtip"  :  "Select Country",
            
            "value"  :  "",
       
            "|store" :  "Pman.I18n.countryStore()",
            "displayField" : "title",
           "valueField"  :  "code",
            "typeAhead" :  false,
            "editable" :  false,
            
            "triggerAction" :  "all",
            
            "selectOnFocus" : true
        }     
    },
    
            
    {
        "grp" : "Form", 
        "name" : "Combo: Language", 
        "description" : "Combo: Language (using I18n code)", 
        "cfg" :  { 
    
                "name" : "language_title",
                "hiddenName" :"language",
                "width" : 290,
                "listWidth" :  300,
                "fieldLabel" :  "Language",
                "allowBlank" :  false,
                
                 
                "qtip" :  "Select Language",
                
                "value" :  "",
           
                "xtype" :  "ComboBox",   
                "|store" :  "Pman.I18n.languageStore()",
                "displayField" : "title",
                "valueField" :  "code",
                
                "typeAhead" :  false,
                "editable" :  false,
                
                "triggerAction" :   "all",
                
                "selectOnFocus" :  true
               

        }    
    },
        
            
    {
        "grp" : "Form", 
        "name" : "Combo: Currency", 
        "description" : "Combo: Currency (using I18n code)", 
        "cfg" :  { 
    
                "name" : "currency_title",
                "hiddenName" :"currency",
                "width" : 290,
                "listWidth" :  300,
                "fieldLabel" :  "Currency",
                "allowBlank" :  false,
                
                 
                "qtip" :  "Select Currency",
                
                "value" :  "",
           
                "xtype" :  "ComboBox",   
                "|store" :  "Pman.I18n.currencyStore()",
                "displayField" : "title",
                "valueField" :  "code",
                
                "typeAhead" :  false,
                "editable" :  false,
                
                "triggerAction" :   "all",
                
                "selectOnFocus" :  true
               

        }    
    },
     {
        "grp" : "Forms", 
        "name" : "Button", 
        "description" : "Button", 
        "cfg" :  {
            
                "xtype":"Button",
                'xns' : 'Roo',
                'text' : '??'
        }
    }
    
    
              
    
    
    
    
    
    
    
]
    
