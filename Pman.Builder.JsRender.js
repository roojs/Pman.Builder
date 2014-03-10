/**
 * This is baed on the code in the app builder..
 *
 *
 * usage:
 *
<pre><code>
   render = new Pman.Builder.JsRender(
          Pman.Builder.Tree.toJS()
     );
    
    var source = render.toSource();
</code></pre>    
 * 
 * @cfg {Array} items - the array of items..
 * @cfg {String} name - eg. Pman.Tab.XXXXyyyyy
 
 * @cfg {String} path - needs the full path << we only have the class name..
 * @cfg {String} region - ?? needed anymore?
 * @cfg {String} parent
 * @cfg {String}  title
 * @cfg {String}  disable? function call to disable it?
 * @cfg {String} permname
 * @cfg {Number} modOrder
  * @cfg {Number} modkey ???
 * 
 *
 */ 
Pman.Builder.JsRender = function(cfg) {
    Roo.apply(this, cfg);
}

Pman.Builder.JsRender.prototype =  {
    
        
    name : '',
    path : '', // the file path..
    modOrder : '001', /// sequence id that this uses.
    region : 'center',
    parent : '',
    title : '', // the title on displayed when loading.
    disable : '', // use a function to that returns false to disable this..
    permname: '', /// permission name
    
    items: false,
    
    /**
     * @type {Object} the properties that have to be double quoted to enable translation
     */
    doubleStringProps : [ 
        'title',
        'legend',
        'loadingText',
        'emptyText',
        'qtip',
        'value',
        'text',
        'emptyMsg',
        'displayMsg'
    ],
    
  
    /**
     * 
     * munge JSON tree into Javascript code.
     * 
     * FIXME: + or / prefixes to properties hide it from renderer.
     * FIXME: '*props' - not supported by this.. ?? - upto rendering code..
     * FIXME: needs to understand what properties might be translatable (eg. double quotes)
     * 
     * @arg {object} obj the object or array to munge..
     * @arg {boolean} isListener - is the array being sent a listener..
     * @arg {string} pad - the padding to indent with. 
     */
    
    
    mungeToString:  function(obj, isListener, pad)
    {
        
         
        pad = pad || '    ';
        var keys = [];
        var isArray = false;
        isListener = isListener || false;
         
        // am I munging a object or array...
        if (obj.constructor.toString() === Array.toString()) {
            for (var i= 0; i < obj.length; i++) {
                keys.push(i);
            }
            isArray = true;
        } else {
            for (var i in obj) {
                keys.push(i);
            }
        }
        
        
        var els = []; 
        var skip = [];
        if (!isArray && 
                typeof(obj['|xns']) != 'undefined' &&
                typeof(obj['xtype']) != 'undefined'
            ) {
                this.mungeXtype(obj['|xns'] + '.' + obj['xtype'], els);
                //els.push('xtype: '+ obj['|xns'] + '.' + obj['xtype']);
                skip.push('|xns','xtype');
            }
        
        
        if (!isArray && obj.items && obj.items.length) {
            // look for props..
            var newitems = [];
            obj.items.forEach(function(pl) {
                if (typeof(pl['*prop']) == 'undefined') {
                    newitems.push(pl);
                    return;
                }
                
                //print(JSON.stringify(pl,null,4));
                // we have a prop...
                var prop = pl['*prop'] + '';
                delete pl['*prop'];
                if (!prop.match(/\[\]$/)) {
                    // it's a standard prop..
                    
                    // munge property..??
                    
                    obj[prop] = pl;
                    
                    keys.push(prop);
                    return;
                }
                prop  = prop.substring(0, prop.length -2); //strip []
                // it's an array type..
                obj[prop] = obj[prop]  || [];
                obj[prop].push(pl);
              //  print("ADDNG PROP:" + prop + ' ' + keys.indexOf(prop) );
                if (keys.indexOf(prop) < 0) {
                    keys.push(prop);
                }
                
                
                
            });
            obj.items = newitems;
            if (!obj.items.length) {
                delete obj.items;
            }
            
        }
         
        
        //if (isArray) { print(JSON.stringify(keys, null,4)); }
        // keys is just the real keys of the object.
        var _this = this;
        
        var left =  '';
        
        keys.forEach(function(i) {
            
            if (i[0] == '.') { // skip builder data.
                return;
            }
            
            if (typeof(obj[i]) == 'undefined') { // empty or removed.
                return;
            }
            var el = obj[i];
            if (!isArray && skip.indexOf(i) > -1) { // things we do not write..
                return;
            }
            if (!isArray) {
                // set the key to be quoted with singel quotes..
                var leftv = i[0] == '|' ? i.substring(1) : i;
                if (Pman.Builder.Lang.isKeyword(leftv) || Pman.Builder.Lang.isBuiltin(leftv)) {
                    left = "'" + leftv + "'";
                } else if (leftv.match(/[^A-Z_]+/i)) { // not plain a-z... - quoted.
                    var val = JSON.stringify(leftv);
                    left = "'" + val.substring(1, val.length-1).replace(/'/g, "\\'") + "'";
                } else {
                    left = '' + leftv;
                }
                left += ' : ';
                
            }
            
            
            if (isListener) {
                // change the lines...
                var str= ('' + obj[i]).replace(/^\s+|\s+$/g,""); // remove bar.
                var lines = str.split("\n");
                if (lines.length > 1) {
                    str = lines.join("\n" + pad);
                }
                
                els.push(left  + str);
                return;
            }
             
            
            
            //var left = isArray ? '' : (JSON.stringify(i) + " : " )
            
            if (i[0] == '|') {
                // does not hapepnd with arrays..
                if (typeof(el) == 'string' && !obj[i].length) { //skip empty.
                    return;
                }
                // this needs to go...
                //if (typeof(el) == 'string'  && obj[i].match(new RegExp("Gtk.main" + "_quit"))) { // we can not handle this very well..
                //    return;
                //}
                
                var str= ('' + obj[i]).replace(/^\s+|\s+$/g,"");;
                var lines = str.split("\n");
                if (lines.length > 1) {
                    str = lines.join("\n" + pad);
                }
                
                els.push(left + str);
                return;
            }
            
            
            
            
            if (typeof(el) == 'object') {
                
                // we can skip empty items lists and empty listeners..
                //if (!isArray && i == 'items' && !el.length) {
                //    return; 
                //}
               // 
                var right = _this.mungeToString(el, i == 'listeners', pad + '    ');
                
                //if (!left.length && isArray) print(right);
                
                if ((typeof(right) != 'undefined') && right.length){
                    els.push(left + right);
                }
            
                return;
            }
            // standard. .
            if (typeof(obj[i]) != 'string') {
                els.push(left + JSON.stringify(obj[i]));
                return;
            }
            // strings..
            if (!_this.doubleStringProps) {
                els.push(left + JSON.stringify(obj[i]));
                return;
            }
            if (_this.doubleStringProps.indexOf(i) > -1) {
                els.push(left + JSON.stringify(obj[i]));
                return;
            }
            // single quote..
            els.push(left + "'" + obj[i].replace(/'/g, "\\'") + "'");
            

        });
        
        if (!isArray && !els.length) {
            return '';
        }
        //output the thing.
        var spad = pad.substring(0, pad.length-4);
        return (isArray ? '[' : '{') + "\n" +
            pad  + els.join(",\n" + pad ) + 
            "\n" + spad + (isArray ? ']' : '}');
           
        
        
    },
    
    
    setNSID : function(id)
    {
        
        this.items[0]['|module'] = id;
   
        
    },
    
    
    getType: function() {
        return 'Roo';
    },
   
   
    /**
     * old code had broken xtypes and used arrays differently,
     * this code should try and clean it up..
     * 
     * 
     */
    fixItems : function(node, fixthis)
    {
        if (fixthis) {
            // fix xtype.
            var fn = this.guessName(node);
            //print("guessname got " + fn);
            if (fn) {
                var bits = fn.split('.');
                node.xtype = bits.pop();
                node['|xns'] = bits.join('.');
                
            }
            // fix array???
             
            
        }
        if (!node.items || !node.items.length) {
            return;
        }
        var _this = this;
        var aitems = [];
        var nitems = [];
        node.items.forEach(function(i) {
            
            
            
            _this.fixItems(i, true);
            if (i.xtype == 'Array') {
                aitems.push(i);
                return;
            }    
            nitems.push(i);
        });
        node.items = nitems; 
        
        if (!aitems.length) {
            return;
        }
        
        aitems.forEach(function(i) {
            
            if (!i.items || !i.items.length) {
                return;
            }
            var prop = i['*prop'] + '[]';
            // colModel to cm?
            i.items.forEach(function(c) {
                c['*prop']  = prop;
                node.items.push(c);
                
            });
            
            
        });
        
        
        // array handling.. 
        
        
        
        
        
    },
     
     /**
     * convert xtype for munged output..
     * 
     */
    mungeXtype : function(xtype, els)
    {
        var bits = xtype.split('.');
        // assume it has lenght!
        
        els.push("xtype: '"+ bits.pop()+"'");
        els.push('xns: '+ bits.join('.'));
    },
    
    /**
     * This needs to use some options on the project
     * to determine how the file is output..
     * 
     * At present we are hard coding it..
     * 
     * 
     */
    toSource: function()
    {
        // dump the file tree back out to a string.
        
        // we have 2 types = dialogs and components
        // 
        var top = this.guessName(this.items[0]);
        if (!top) {
            return false;
        }
        if (top.match(/Dialog/)) {
            return this.toSourceDialog();
        }
        return this.toSourceLayout();
        
        /*
        eventually support 'classes??'
         return this.toSourceStdClass();
        */
          
    },
   
    outputHeader : function()
    {
        return [
            "//<script type=\"text/javascript\">",
            "",
            "// Auto generated file - created by app.Builder.js- do not edit directly (at present!)",
            ""
        ].join("\n");
        
   
    },
    // a standard dialog module.
    // fixme - this could be alot neater..
    toSourceDialog : function() 
    {
        var items = JSON.parse(JSON.stringify(this.items[0]));
        var o = this.mungeToString(items, false, '            ');
        
        return [
            this.outputHeader(),
            this.name + " = {",
            "",
            "    dialog : false,",
            "    callback:  false,",
            "",   
            "    show : function(data, cb)",
            "    {",
            "        if (!this.dialog) {",
            "            this.create();",
            "        }",
            "",
            "        this.callback = cb;",
            "        this.data = data;",
            "        this.dialog.show(this.data._el);",
            "        if (this.form) {",
            "           this.form.reset();",
            "           this.form.setValues(data);",
            "           this.form.fireEvent('actioncomplete', this.form,  { type: 'setdata', data: data });",
            "        }",
            "",   
            "    },",
            "",
            "    create : function()",
            "    {",
            "        var _this = this;",
            "        this.dialog = Roo.factory(" + o +  ");",
            "    }",
            "};",
            ""
            
         ].join("\n");
         
         
         
    },
    
    /**
     * try to remove Pman.Tab.XXXXXYYYY
     * where XXXX= the project name..
     *
     */
    pathToPart : function()
    {
        
        
        var modname = this.name.split('.').pop();
        
        var ret = modname.match(/([A-Z][a-z]+)/g);
        var mm = ret.shift();
        return [ mm, ret.join('')];
        
        //return [ modname , npart];
        
        
        
        
    },
    
    // a layout compoent 
    toSourceLayout : function() 
    {
        var items = JSON.parse(JSON.stringify(this.items[0]));
        var o = this.mungeToString(items, false, '            ');   
         
        var modkey = this.modkey + '-' + this.name.replace(/[^A-Z.]+/ig, '-');
        
        var name = this.name.replace(/[^a-z_]+/i, '_');
        
    
        return [
            this.outputHeader(),
            
            name  +  " = new Roo.XComponent({",
            "    order    : '" +modkey+"',",
            "    region   : '" + this.region   +"',",
            "    parent   : "+ (this.parent ?  "'" + this.parent + "'" :  'false') + ",",
            "    name     : " + JSON.stringify(this.title  || "unnamed module") + ",",
            "    disabled : " + (this.disabled || 'false') +", ",
            "    tree : function()",
            "    {",
            "        var _this = this;", // bc
            "        var MODULE = this;", /// this looks like a better name.
            "        return " + o + ';',
            "    }",
            "});",
            ""
             
         ].join("\n");
        
    },
        
    guessName : function(ar) // turns the object into full name.
    {
         // eg. xns: Roo, xtype: XXX -> Roo.xxx
        if (!ar) {
            return false;
        }
        var ret = [];
        ret.push(typeof( ar['|xns'] ) == 'undefined' ? 'Roo' : ar['|xns'] );
        
        
        
        if (typeof( ar['xtype'] ) == 'undefined' || !ar['xtype'].length) {
            return false;
        }
        var xtype = ar['xtype'] + '';
        if (xtype[0] == '*') { // prefixes????
            xtype  = xtype.substring(1);
        }
        if (xtype.match(/^Roo/)) {
            // already starts with roo...
            ret = [];
        }
        ret.push(xtype);
        return   ret.join('.');
        
         
                        
                             
    }
   
    
};
  