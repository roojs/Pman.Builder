//<script type="text/javascript">

// Auto generated file - created by Builder Module - do not edit directly



// register the module first
Pman.on('beforeload', function()
{


    Pman.register({
        modKey : '001-pman_tab_buildertab',
        module : Pman.Tab.BuilderTab,
        region : 'center',
        parent : Pman,
        name : "Builder - Tab"
    });
});
Pman.Tab.BuilderTab = new Roo.util.Observable({

    panel : false,
    disabled : false,
    parentLayout:  false,

    add : function(parentLayout, region)
    {

        var _this = this;
        this.parentLayout = parentLayout;

        this.panel = parentLayout.addxtype({
            xtype : 'NestedLayoutPanel',
            background : true,
            fitToFrame : true,
            region : 'center',
            listeners : {
                activate: function (_self)
                {
                   _self.layout.getRegion('center').showPanel(0)
                }
            },
            title : "Builder Kit",
            layout : {
                xtype : 'BorderLayout',
                center : {
                    titlebar : false,
                    tabPosition : 'top'
                }
            }
        });
       this.layout = this.panel.layout;
    }
});
/*
--SOURCE--
QlpoNDFBWSZTWT8IJ7QAAP4fgFD3YBARD1QOv+/f7jABNtFBlU2k8TSfpTyTTJppoAADEICp5TAE0wTR
gBGTEyYSKJoTT0JMhpsgQA0ZHowIvgMo6DW668foM1kozQlCGZISkIzPfQV4LQXBFwGm2mxDmQYzrZXp
z3X6fnX3pXszsgxuAzydVLqZqkoaQTq+OjVYFz3yB6gxkynGtBEvbyLHYxoT8PY0VYZeu0Z+BTi1ujNu
ilTeKdithB6I5cXRR9VjsKSgVHMOBFtMkvvplYcNRx0hK28J5k3mXLCxVUq6/OSnkE6m5El44jIbaF02
EmDlWQJASN+zm5g2BPb1eiMNsDGUDP4EAZMh+r0CVotWXiBQ24CudmoNZxajG67GKapDCMiECHA6hcbA
3G+4VbrC21GoMjk7b2VKH6QOq7C7kinChIH4QT2g
*/
