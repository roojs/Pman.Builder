//<script type="text/javascript">

// Auto generated file - created by app.Builder.js- do not edit directly (at present!)

Pman.Dialog.BuilderForm = {

    dialog : false,
    callback:  false,

    show : function(data, cb)
    {
        if (!this.dialog) {
            this.create();
        }

        this.callback = cb;
        this.data = data;
        this.dialog.show(this.data._el);
        if (this.form) {
           this.form.reset();
           this.form.setValues(data);
           this.form.fireEvent('actioncomplete', this.form,  { type: 'setdata', data: data });
        }

    },

    create : function()
    {
        var _this = this;
        this.dialog = Roo.factory({
            xtype: 'LayoutDialog',
            xns: Roo,
            closable : true,
            height : 600,
            title : "Edit Form Elements",
            width : 800,
            items : [
                {
                    xtype: 'GridPanel',
                    xns: Roo,
                    region : 'center',
                    grid : {
                        xtype: 'EditorGrid',
                        xns: Roo.grid,
                        ds : {
                            xtype: 'Store',
                            xns: Roo.data
                        },
                        cm : [
                            {
                                xtype: 'ColumnModel',
                                xns: Roo.grid,
                                header : 'Label'
                            },
                            {
                                xtype: 'ColumnModel',
                                xns: Roo.grid,
                                header : 'Source Data'
                            },
                            {
                                xtype: 'ColumnModel',
                                xns: Roo.grid,
                                header : 'Source Data'
                            },
                            {
                                xtype: 'ColumnModel',
                                xns: Roo.grid,
                                header : 'Type'
                            }
                        ]
                    }
                }
            ],
            center : {
                xtype: 'LayoutRegion',
                xns: Roo
            },
            buttons : [
                {
                    xtype: 'Button',
                    xns: Roo,
                    text : "Cancel"
                },
                {
                    xtype: 'Button',
                    xns: Roo,
                    text : "Save"
                }
            ]
        });
    }
};
