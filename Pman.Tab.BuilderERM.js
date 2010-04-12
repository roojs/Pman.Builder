//<script type="text/javascript">

// Auto generated file - created by Builder Module - do not edit directly



// register the module first
Pman.on('beforeload', function()
{


    Pman.register({
        modKey : '100-pman_tab_buildererm',
        module : Pman.Tab.BuilderERM,
        region : 'center',
        parent : Pman.Tab.BuilderTab,
        name : "Builder - ERM"
    });
});
Pman.Tab.BuilderERM = new Roo.util.Observable({

    panel : false,
    disabled : false,
    parentLayout:  false,

    add : function(parentLayout, region)
    {

        var _this = this;
        this.parentLayout = parentLayout;

        this.panel = parentLayout.addxtype({
            xtype : 'ContentPanel',
            background : true,
            fitToFrame : true,
            region : 'center',
            listeners : {
                activate: function (_self)
                {
                      
                     Pman.Tab.BuilderErm.init(_self.el);
                    
                    return;
                     var svgns = "http://www.w3.org/2000/svg";
                        //paper.xlink = "http://www.w3.org/1999/xlink";
                       var svg = function(el) {
                          return document.createElementNS(svgns, el);
                       };
                       _self.el.createChild( {
                         ns: 'svg',
                         tag: 'svg', 
                         width: 10000,
                         height: 4000,
                         cn: [
                            {
                               ns:'svg',
                               tag: 'rect', 
                               x:"10.5", 
                               y:"10.5", 
                               width:"288",
                               height:"181.4",
                               r:"0", rx:"0", ry:"0", fill:"none", stroke:"#000", id:"T~Ava_Obstruct", 'class':"b-erm-rect"
                            } 
                         ]
                      });
                    /*
                    
                       var s = svg('svg');
                       s.setAttribute('width', '10000');
                       s.setAttribute('height', '4000');
                       
                      _self.el.dom.appendChild(s);
                      r = svg('rect');
                      Roo.get(r).set({ x:"10.5", y:"10.5", width:"288", height:"181.4", r:"0", rx:"0", ry:"0", fill:"none", stroke:"#000", id:"T~Ava_Obstruct", 'class':"b-erm-rect"});
                      s.appendChild(r);
                    */
                    return;
                      
                    
                }
            },
            title : "ERM",
            autoScroll : true,
            toolbar : {
                xtype : 'Toolbar',
                items : [
                    {
                        xtype : 'Button',
                        xns: Roo.Toolbar,
                        text : "Zoom Out --",
                        listeners : {
                            click: function (_self, e)
                            {
                                  Pman.Tab.BuilderErm.zoom(0.8);
                            }
                        },
                        icon: rootURL + '/Pman/templates/images/search.gif',
                        cls : 'x-btn-text-icon'
                    },
                    {
                        xtype : 'Button',
                        xns: Roo.Toolbar,
                        text : "Zoom In ++",
                        listeners : {
                            click: function (_self, e)
                            {
                                  Pman.Tab.BuilderErm.zoom(1.0/0.8);
                            }
                        },
                        icon: rootURL + '/Pman/templates/images/search.gif',
                        cls : 'x-btn-text-icon'
                    }
                ]
            }
        });
    }
});
/*
--SOURCE--
QlpoNDFBWSZTWdavYXwAA8DfgH9IWP/+ejsn3h6/79//UAOe6qiNYADDREmINAAAaaAAAMgAA0DQ4yZN
GIYmmAgYE0wRgmJppoAMIJTSKnqeTU09TRmoBkek0ADQAaBo0aDQOMmTRiGJpgIGBNMEYJiaaaADCCSQ
QJpkwmg0aUTyj9U81TajaPUQ0wmaQHqfpTTQzJIEfIQi0uDJPXEb6fWB8vr8Yux+hJxOlIZmYggJUJxP
kWvb7iaLjBJ6c2KojRafKXm7tQTAE5/LIwvHOIjsBxGJ4svCuV6JyxIYYawYZwmTOOMIQ4mTWQHGhS05
eMRRr29b3i6RcDNGNwzMVutskGyJFNU0h8HX6y12+p7k/vKS62/0NWZKYgJJSE7gxLOJ2ZJnal2VbLgK
MtxfhsFgtGk/FUiih6P7K5L5msUcSPedcx4myJp5cDRkaj00G5iNw89j0YB54eqAQYOZzecyB5hhgm6h
waK+DykYwIQzgZiknKh9pZs33ZwFDtHB1HaYn2DmZpSY3DPKiYC41dJNeRBJFpiY/iJSwiicckoimuww
sbFbGReXm5x7ZiPJoEcOZXzmK0jiHET1MQMBeKkbiCyRIxkGboqclRMIfwamxwWnj0iF2uYzAVMoDYVN
CPMlRJhQmSWWG1onRjAYh/Q6CcelBsXaqGb6v03SdqwVGVxEYDklhCYTh9GAyESuOSXywRNUQqPjSdBi
4KOTq1MOHJPyniDyFulk4bB7EpmXEeUHtLgOYP31TsSCpmRSMiekd0ObmaLkaylEDkqFOnhXaUiqNQNi
lKaRzFkoMYECeiwZbdmb+v9VgVlZoNxeTHwCU0BtWKXzPQacxaphnI2SVqA+8bIxfnmZDDjcRDaIqnbn
MKU9xSiaYgODAZk860siiebW5HgIROv+ocgqJ0qYE9CJyUkcilRL6ht++QJmKhOXGrT1fw2gkBmCFSkG
LAbWeb3rNIx0PIzLIpHbnSnDH90RNtoy9uHc8HMzDchtn3OR5RNZ2HYech4+svLyg4r7U8zTl3XKiKKw
4Mx95gtqO4wjq7ygHm4+YslqOtFR6hsQYlanCjtNXc1FRAjFPHENpIHDlXQMZyVXonUDE4HYGYHtLcUY
kWCgPcoFh0LVcjFHklUVekMM69mgumKTeeF9wj1mRljlvibzEwIRmjyNgSoaUllvQXFRzZuJkmiXDyQw
QCFCsJ3gwJp8Czj+LuSKcKEhrV7C+A==
*/
