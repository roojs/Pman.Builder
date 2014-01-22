


Roo.onReady(function() {
    Roo.log("Test");
    
    // now let's see if we can build shit..
    
    Pman.Builder.View.draw( 
        
        {
            xtype: 'Body',
            '|xns': 'Roo.bootstrap',
            items: [
                {
                    xtype: 'Navbar',
                    '|xns': 'Roo.bootstrap',
                    position: 'fixed-top',
                    inverse: true,
                    brand: '<img src="http://detail.herokuapp.com/img/logo.png" alt="logo">',
                    collapse: true,
                    items: [
                        {
                            xtype: 'NavGroup',
                            '|xns': 'Roo.bootstrap',
                            align: 'right',
                            items: [
                                {
                                    xtype: 'Item',
                                    '|xns': 'Roo.bootstrap.Navbar',
                                    href: '#',
                                    html: "hello",
                                    badge: 'test',
                                    active: true
                                },
                                {
                                    xtype: 'Item',
                                    '|xns': 'Roo.bootstrap.Navbar',
                                    html: "hello",
                                    menu:  {
                                            xtype: 'Menu',
                                            '|xns': 'Roo.bootstrap',
                                            items : [
                                                {
                                                    xtype: 'MenuItem',
                                                    '|xns': 'Roo.bootstrap',
                                                    html: "hello aaa",
                                                    href : 'http://roojs.com'
                                                },
                                                {
                                                    xtype: 'MenuItem',
                                                    '|xns': 'Roo.bootstrap',
                                                    html: "hello",
                                                    href : 'http://roojs.com'
                                                }
                                            ]
                                        }
                                },
                                {
                                    xtype: 'Item',
                                    '|xns': 'Roo.bootstrap.Navbar',
                                   
                                    html: "dialog",
                                    listeners : {
                                        click : "function() { Roo.ComponentMgr.get('test-modal-1').show() } "
                                    }
                                    
                                },
                                {
                                    xtype: 'Modal',
                                    id: 'test-modal-1',
                                    '|xns': 'Roo.bootstrap',
                                    title : 'test1',
                                    html: "dialog"
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'Container',
                    '|xns': 'Roo.bootstrap',
                    jumbotron : true,
                    style :  'padding: 30px 15px 40px', 
                    html : '<h1> hello world </h1><p>test</p>'
                }
            ]
        }); 
    
})
