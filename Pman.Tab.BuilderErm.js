//<script type="text/javascript">


/* 






Pman.Tab.BuilderErm = {
    
    
    init: function(el) 
    {
        
        if (this.svg) {
            
            return;
        }
        this.el = el;
        this.wrapper = el;
        
        var _this = this;
        if (Roo.isIE) {
                
            this.embed = el.createChild({
                
                tag : 'embed',
                codebase: 'http://www.adobe.com/svg/viewer/install/',
                classid: 'clsid:78156a80-c6a1-4bbf-8e6a-3cd390eeb4e2',
                pluginspage: 'http://www.adobe.com/svg/viewer/install/',
                src: 'about:blank',
                width: 10000,
                height: 4000,
                type: 'image/svg+xml'
            });
            this.wrapper = this.embed;
            
        } 
                
        
    
    
        this.svg =  this.wrapper.createChild( {
             ns: 'svg',
             xmlns: 'http://www.w3.org/2000/svg',
             tag: 'svg', 
             width: 100,
             height: 400
             
       });
       this.grp = this.svg.createChild( {
             ns: 'svg',
             tag: 'g'
       });
          //this.paper.circle(320, 240, 60).animate({fill: "#223fa3", stroke: "#000", "stroke-width": 80, "stroke-opacity": 0.5}, 2000);
   
        this.currentX = this.START_X;
		this.currentY = this.START_Y;
		
   
        Pman.request({
            url: baseURL+'/Builder/ERM.php',
            method: 'GET',
            success: function (data) {
                _this.tables = data.tables;
                _this.links = data.links;
                _this.drawTables();
                _this.svg.set({
                    width: _this.maxX,
                    height: _this.maxY
                });
                
            }
        });
       // el.dom.addEventListener("DOMMouseScroll", function(e) { _this.mouseScroll(e); }, false);
       // el.dom.addEventListener("mousewheel", function(e) { _this.mouseScroll(e); }, false);
        el.dom.addEventListener("scroll", function(e) { _this.redrawTables(); }, false);
        //document.addEventListener("keypress", function(e) { _this.keyPress(e); }, false);
        //this.grp.on("mousedown", function(e) { _this.mouseDown(e); }, false);
    
	    this.svg.on("mouseup", function(e) { _this.mouseUp(e); } , false);
	    this.svg.on("mousemove", function(e) { _this.mouseMove(e); }, false);
	    //document.addEventListener("mouseout", mouseUp, false);
	
	},
        
    
         
    
    
    paper : false,
    
    FONT_SIZE : 12,
    TEXT_PAD : 4,
    START_X : 10,
    START_Y : 10,
    maxTableHeight : 0,
    currentX : 0,
    currentY : 0,
    maxX : 0,
    maxY : 0,
    positions : false,
    lpositions : false,
    currentScale: 1.0,
    groupId : 0,
    tableLocations : [],
    tableMap : { },
    widthLimit: 3000,
    
    drawTables : function() {
		this.el.mask("Drawing");
		this.tableLocations = [];
		for (var i in this.tables) {
            var data = this.drawTable( i, this.tables[i], this.groupId++ );
			this.tableLocations.push(data);
            this.tableMap[data.name] = data;
            //if (this.groupId > 10) { break; }
             
           // return;
		}
		this.el.unmask();
		return ;
	},
    
    redrawTables : function()
    {
        console.log('redraw');
        Roo.each(this.tableLocations , this.renderTable , this);
        
    },
    
    renderTable : function ( data)
    {
        
        var _this = this;
        if (!data.grp) { // always make the group..
            data.grp = this.grp.createChild({
                ns: 'svg', 
                tag: 'g'
            });
        }
        //
        data.grp.dom.tdata = data;
        
        
        
        if (!this.canSee({
                top: data.rectX,
                left:  data.rectY,
                right: data.rectX + data.rectW,
                bottom: data.rectY + data.rectH
            })
        ) {
            
            //console.log('can Not see : ' + data.name);
            
            if (!data.rect) { // already deleted!!!            
                return;
            }
            // delete everythting..
            while (data.grp.dom.childNodes.length) {
                data.grp.dom.removeChild(data.grp.dom.firstChild);
            }
            data.rect = false;
            data.rectHead = false;
            data.rectText = false;
                    
            for (var i =0; i <  data.cols.length; i++) {
                data.cols[i].textH = false;
                data.cols[i].textD = false;
            }
            return;
        }
        
        
        
        
        if (!data.rect) {
            data.rect = data.grp.createChild({
                ns: 'svg',
                tag: 'rect',
                x:      0,
                y:      0,
                width:  data.rectW,
                height: data.rectH,
                 r:"0", rx:"0", ry:"0", 
                 fill:"none", stroke:"#000",
                //id : tableId,
                'class' : 'b-erm-rect'
            });
            data.rect.on("mousedown", function(e) { _this.mouseDown(e); }, false);
        }
        
        if (!data.rectHead) {
            data.rectHead =  data.grp.createChild({
                ns: 'svg',
                tag: 'rect',
                x: 0,
                y: 0,
                width: data.rectW,
                height: this.TEXT_PAD + this.FONT_SIZE+ 8,
                //id : 'r2-tableId',
                'class' : 'b-erm-recthead'
            });
        }
        
        
        if (!data.rectText) {
		//add the table name
            data.rectText =  data.grp.createChild({
                ns: 'svg',
                tag: 'text',
                x:  this.TEXT_PAD + 10, 
                y:   this.TEXT_PAD + this.FONT_SIZE+4,
                'class' : 'b-erm-tblname',
                cn : [  data.name  ]
            });
        }
        
        
        
        var drawHowMuch = this.drawHowMuch(); 
        // sc = 0  (nothing)
        // sc = 1 (name)
        // sc = 2 (both)
        
        
        for (var i =0; i <  data.cols.length; i++) {
            var c = data.cols[i];
            if (drawHowMuch < 1 && c.textH) {
                c.textH.remove();
                c.textH = false;
            }
            if (drawHowMuch < 2 && c.textD) {
                c.textD.remove();
                c.textD = false;
            }
            
            if (drawHowMuch < 1) {
                continue;  // dont draw..
            }
            
            
            if (!c.textH) {
                c.textH = data.grp.createChild({
                    ns: 'svg',
                    tag: 'text',
                    x:  c.textX,
                    y: c.textY,
                    'class' : 'b-erm-colname',
                    cn : [
                        {
                            ns: 'svg',
                            tag: 'tspan', 
                            cn : [ c.name ]
                        }
                    ]
                });
            }
            
            if (drawHowMuch < 2) {
                continue;
            }
            if (!c.textD) {
                c.textD = c.textH.createChild({ 
                    ns: 'svg',
                    tag: 'tspan', 
                    'class' : 'b-erm-coltype',
                    cn : [ '\u00a0' + c.desc ]
                    
                });
            }
            
            
            
        }
        console.log('translate(' + data.rectX + "," + data.rectY + ')');
        data.grp.dom.setAttribute('transform', 'translate(' + data.rectX + "," + data.rectY + ')');
      
    },
    
    
    drawHowMuch : function ()
    {
        if (this.currentScale > 0.9) {
            return 2;        
        }
        if (this.currentScale > 0.5) {
            return 1;
        }
        return 0;
    },
    
    canSee: function (box)
    {
        // work out limits of screen!!!
        var scroll = this.el.getScroll(); // perhasp we should cache these!!!!
        var outersize = this.el.getSize();
        // get width / height from svg element..
        // diviede by the scale to calc position?
        var scale = 1.0/this.currentScale;
        
        var vbox = {
            top:   scale * scroll.top,
            left:  scale * scroll.left,
            bottom:  scale * (scroll.top +  outersize.height),
            right: scale * (scroll.left +  outersize.width)
        };
        
        //console.log('check See: ---');
        //console.log('window: ' + vbox.toSource());
        //console.log('tablebox: ' + box.toSource());
        //console.log('---');
        /// option a) - any of the points are inside the box..
        
        // box.top/box.left
        if (
            (vbox.bottom > box.top && box.top > vbox.top ) &&
            (vbox.right > box.left && box.left > vbox.left )
        ) {
            return true;
        }
        // box.bottom / box right
        if (
            (vbox.bottom > box.bottom && box.bottom  > vbox.top ) &&
            (vbox.right > box.right && box.right > vbox.left )
        ) {
            return true;
        }
        // points outside!, but body inside..
        if (
            (box.right > vbox.left && box.left < vbox.right) &&
            (box.bottome > vbox.top && box.top < vbox.bottom )
        ) {
            return true;
        }
        return false;
        
        
        
    },
    
    
    
    
    drawTable : function ( name, cols, groupId ) 
    {
		//alert(table.toSource());
		// create a group
        
        
        var ret = { links: [] };
           
        
	 
		
		//tabGrp.node.setAttribute("id", "G" + tableId);
		//draw the box - attempt some layout
		
		var maxWidth = 0;
		var length = 0;
		for (var i in cols ) {
			var sl = i.length + cols[i].length + 1;
			maxWidth = maxWidth > sl ? maxWidth : sl;
			length++;
		}
		
		
		var tableWidth = (maxWidth*this.FONT_SIZE *0.5) + (2*this.TEXT_PAD) + 10;
		//height of the box is table name+num columns*font height + padding
		
		var  tableHeight = ((length+1)*(this.FONT_SIZE*1.2)) + 
				((length +1)*this.TEXT_PAD) + 5;
							
		this.maxTableHeight = (tableHeight > this.maxTableHeight)? tableHeight : this.maxTableHeight;
		
		// preserve the existing position of the table
		// obviously this will look rubbish if there are new tables and
		 // existing ones 
		var box = null; 
		
		if (typeof(this.positions[name]) == "undefined") {
			box = {
				x: this.currentX,
				y: this.currentY,
				width: tableWidth,
				height: tableHeight
			};
			//store position, may be handy later
			this.positions[name] = box;
		} else {
			box = this.positions[name];
			this.currentX = box.x;
			this.currentY = box.y;
		}
		
        ret.rectX = this.currentX;
        ret.rectY = this.currentY;
        ret.rectW = tableWidth;
        ret.rectH = tableHeight;
              
          
		var textY =  this.TEXT_PAD + this.FONT_SIZE+4;	
		
        ret.name = name;
        
         
		
		textY += (this.TEXT_PAD*2) + this.FONT_SIZE;
		
		//add the column name and type	text
		
        ret.cols = [];
        ret.linkPos = { };
           
		for (var i in  cols) {
			//String[] colAndType : ) {
                
                
            ret.cols.push( {
                textX : this.TEXT_PAD + 10,
                textY : textY,
                name : i,
                desc:  cols[i]
            })
             
            ret.linkPos[i] = {
				l: 0,
				r: tableWidth,
				y: textY - 4
			};
		 
			this.lpositions[name + '.' + i] = {
				l: 0,
				r:   tableWidth,
				y: textY - 4
			};
			
			 
			textY += this.TEXT_PAD + this.FONT_SIZE;
		}
        
		
		this.currentX += tableWidth + 10;
		this.maxX = (this.maxX<this.currentX) ? this.currentX : this.maxX; 
		if (this.currentX > this.widthLimit) {
			this.currentX = this.START_X;
			this.currentY += this.maxTableHeight + 10;
		}
		//alert(this.currentY);
		this.maxY = ((this.currentY + tableHeight) > this.maxY) ? this.currentY + tableHeight : this.maxY;
		//close the group
     
		//tabGrp.node.setAttribute("tableName", name);
        var _this = this;
        
       
        this.renderTable(ret);
		return ret;
	},
    zoom : function(factor)
    {
            var outersize = this.el.getSize();
            var de = this.grp.dom;
            this.currentScale = this.currentScale || 1.0; 
           // var oldTranslate = { x: de.currentTranslate.x, y: de.currentTranslate.y }; 
            var s = 1.3; 
        
            this.currentScale *=  factor; 
            
            de.setAttribute('transform','scale('+this.currentScale+')');
            
		        // correct currentTranslate so zooming is to the center of the viewport: 
			//sessionStorage.zoom = "" + de.currentScale ;
            this.svg.set({
                    width: Math.max(this.maxX * this.currentScale, outersize.width),
                    height: Math.max(this.maxY * this.currentScale, outersize.height)
             });
            
            this.redrawTables();
	                 
            return;
            
            
            
            var vp_width, vp_height; 
            try { 
                vp_width = de.viewport.width; 
                vp_height = de.viewport.height; 
            } 
            catch (e) { 
                // work around difficiency in moz ('viewport' property not implemented) 
                vp_width = window.innerWidth; 
                vp_height = window.innerHeight; 
            } 
            //de.currentTranslate.x = mouseX - (de.currentScale/oldScale) * (mouseX - oldTranslate.x); 
            //de.currentTranslate.y = mouseY - (de.currentScale/oldScale) * (mouseY - oldTranslate.y); 
             
            //de.currentTranslate.x = vp_width/2 - (de.currentScale/oldScale) * (vp_width/2 - oldTranslate.x + (mouseX - vp_width/2)); 
            //de.currentTranslate.y = vp_height/2 - (de.currentScale/oldScale) * (vp_height/2 - oldTranslate.y + (mouseY - vp_height/2)); 
		  
     
	},
    
    
    // mouse down applied to elements (other mouse events are handled by doc)
    mouseDown : function (e) { 
        this.draggingElement = e.getTarget().parentNode;
        
        //var tdata = this.draggingElement.tdata;
        var xy = e.getXY();
        this.startX = xy[0];
        this.startY = xy[0];
        return;
        
     //   console.log('set drag element');
        var p = this.svg.dom.createSVGPoint();
        p.x = e.getXY()[0];
        p.y = e.getXY()[1];

        //var m = this.getScreenCTM(this.svg.dom);

        //p = p.matrixTransform(m.inverse());
        this.nMouseOffsetX = p.x - parseInt(this.draggingElement.getAttribute("dragx") || 0);
        this.nMouseOffsetY = p.y - parseInt(this.draggingElement.getAttribute("dragy") || 0);

    },
    mouseUp : function (evt) { 
        //console.log(evt);
        
        if (!this.draggingElement ) {
            return;
        }
        var tdata = this.draggingElement.tdata;
        tdata.rectX = this.lastX;
        tdata.rectY = this.lastY; 
        
        this.nMouseOffsetX = 0;
        this.nMouseOffsetY = 0;
        this.draggingElement = null;
       
        
        this.redrawTables();
        
       //console.log('unset drag element');
        
    },
    mouseMove : function (e) { 
        if(!this.draggingElement ) {
            return;
        }
        
        var xy = e.getXY();
        var tdata = this.draggingElement.tdata;
        var x = this.currentScale * (xy[0] - this.startX);
        var y = this.currentScale * (xy[1] - this.startY);
        this.lastX = (tdata.rectX + x);
        this.lastY = (tdata.rectY + y);
        
        
        
        this.draggingElement.setAttribute("transform", 
            "translate(" + this.lastX + "," + this.lastY + ")");
        return;
        
        
        
        var p = this.svg.dom.createSVGPoint();
        p.x = e.getXY()[0];
        p.y = e.getXY()[1];
        
        var m = this.getScreenCTM(this.svg.dom);
        
        p = p.matrixTransform(m.inverse());
        p.x -= this.nMouseOffsetX;
        p.y -= this.nMouseOffsetY;
      //  console.log(' drag ' + p.x + ',' + p.y );    
        
        this.draggingElement.setAttribute("dragx", p.x);
        this.draggingElement.setAttribute("dragy", p.y);
        this.draggingElement.setAttribute("transform", "translate(" + p.x + "," + p.y + ")");
        //this.draggingElement.moveCallback(
          //  Pman.Tab.BuilderErm.Movable.draggingElement.obj);
      
       
    },
    
    
    
    
     getScreenCTM : function (doc){
        if(doc.getScreenCTM) { 
            return doc.getScreenCTM(); 
        }
        
        var root=doc
        var sCTM= root.createSVGMatrix()

        var tr= root.createSVGMatrix()
        var par=root.getAttribute("preserveAspectRatio")
        if (par==null || par=="") par="xMidYMid meet"//setting to default value
        parX=par.substring(0,4) //xMin;xMid;xMax
        parY=par.substring(4,8)//YMin;YMid;YMax;
        ma=par.split(" ")
        mos=ma[1] //meet;slice

        //get dimensions of the viewport
        sCTM.a= 1
        sCTM.d=1
        sCTM.e= 0
        sCTM.f=0


        w=root.getAttribute("width")
        if (w==null || w=="") w=innerWidth

        h=root.getAttribute("height")
        if (h==null || h=="") h=innerHeight

        // Jeff Schiller:  Modified to account for percentages - I'm not 
        // absolutely certain this is correct but it works for 100%/100%
        if(w.substr(w.length-1, 1) == "%") {
            w = (parseFloat(w.substr(0,w.length-1)) / 100.0) * innerWidth;
        }
        if(h.substr(h.length-1, 1) == "%") {
            h = (parseFloat(h.substr(0,h.length-1)) / 100.0) * innerHeight;
        }

        // get the ViewBox
        vba=root.getAttribute("viewBox")
        if(vba==null) vba="0 0 "+w+" "+h
        var vb=vba.split(" ")//get the viewBox into an array

        //--------------------------------------------------------------------------
        //create a matrix with current user transformation
        tr.a= this.currentScale;
        tr.d=this.currentScale;
        tr.e= root.currentTranslate.x;
        tr.f=root.currentTranslate.y;


        //scale factors
        sx=w/vb[2]
        sy=h/vb[3]


        //meetOrSlice
        if(mos=="slice"){
        s=(sx>sy ? sx:sy)
        }else{
        s=(sx<sy ? sx:sy)
        }

        //preserveAspectRatio="none"
        if (par=="none"){
            sCTM.a=sx//scaleX
            sCTM.d=sy//scaleY
            sCTM.e=- vb[0]*sx //translateX
            sCTM.f=- vb[0]*sy //translateY
            sCTM=tr.multiply(sCTM)//taking user transformations into acount

            return sCTM
        }


        sCTM.a=s //scaleX
        sCTM.d=s//scaleY
        //-------------------------------------------------------
        switch(parX){
            case "xMid":
                sCTM.e=((w-vb[2]*s)/2) - vb[0]*s //translateX
                break;
                
            case "xMin":
                sCTM.e=- vb[0]*s//translateX
                break;
                
            case "xMax":
                sCTM.e=(w-vb[2]*s)- vb[0]*s //translateX
                break;
                
        }
        //------------------------------------------------------------
        switch(parY){
            case "YMid":
                sCTM.f=(h-vb[3]*s)/2 - vb[1]*s //translateY
                break;
                
            case "YMin":
                sCTM.f=- vb[1]*s//translateY
                break;
                
            case "YMax":
                sCTM.f=(h-vb[3]*s) - vb[1]*s //translateY
                break;
                
        }
        sCTM=tr.multiply(sCTM)//taking user transformations into acount

        return sCTM
    },
    
    
    
    
    
    
    
    
    
     
    
    
    
	keyPress: function (evt) {
		//alert(evt.charCode);
        return;
		if (evt.charCode != 115) { // s = save!
			return;
		}
		var w = window.open("about:blank", "default.js");
		w.document.write("<H1> Save this as default.js</H1><code>");
		w.document.write("var positions = " + sessionStorage.positions + ";");
		w.document.write("</code>");
		w.document.close();
		//w.close();
		
		
	},
    
    
    drawConnections  : function()
    {
        //alert(this.positions.toSource());
        for(var tn in this.links) {
            
            for (var linkfrom in this.links[tn]) {
                
                var link = {
                    ontable : this.tableMap[tn],
                    oncol : linkfrom,
                    totable: this.tableMap[this.links[tn][0]],
                    tocol: this.links[tn][1]
                };
                link.fromtable.links.push(link);
                link.totable.links.push(link);
            }
        }
        
    },
    
    

};
*/
/*
 
Pman.Tab.BuilderErm.Movable = function(obj, eobj, moveCallback)
{
    var _this =this;
    this.nMouseOffsetX = 0;
    this.nMouseOffsetY = 0; 
    
    if (!eobj) {
	    eobj = obj;
    }
    eobj.addEventListener("mousedown", function(e) { _this.mouseDown(e); }, false);
    if (!Pman.Tab.BuilderErm.Movable.loaded) {
	    document.addEventListener("mouseup", function(e) { _this.mouseUp(e); } , false);
	    document.addEventListener("mousemove", function(e) { _this.mouseMove(e); }, false);
	    //document.addEventListener("mouseout", mouseUp, false);
	    Pman.Tab.BuilderErm.Movable.loaded = true;
	}
    
    obj.setAttribute('dragx', '0');
    obj.setAttribute('dragy', '0');
	this.obj = obj;
	this.moveCallback = moveCallback;
	var _this = this;
}
Pman.Tab.BuilderErm.Movable.draggingElement = false;
Pman.Tab.BuilderErm.Movable.loaded = false;

Roo.apply(Pman.Tab.BuilderErm.Movable.prototype, {
    
     
    // Following is from Holger Will since ASV3 and O9 do not support getScreenTCM()
    // See http://groups.yahoo.com/group/svg-developers/message/50789
    getScreenCTM : function (doc){
        if(doc.getScreenCTM) { 
            return doc.getScreenCTM(); 
        }
        
        var root=doc
        var sCTM= root.createSVGMatrix()

        var tr= root.createSVGMatrix()
        var par=root.getAttribute("preserveAspectRatio")
        if (par==null || par=="") par="xMidYMid meet"//setting to default value
        parX=par.substring(0,4) //xMin;xMid;xMax
        parY=par.substring(4,8)//YMin;YMid;YMax;
        ma=par.split(" ")
        mos=ma[1] //meet;slice

        //get dimensions of the viewport
        sCTM.a= 1
        sCTM.d=1
        sCTM.e= 0
        sCTM.f=0


        w=root.getAttribute("width")
        if (w==null || w=="") w=innerWidth

        h=root.getAttribute("height")
        if (h==null || h=="") h=innerHeight

        // Jeff Schiller:  Modified to account for percentages - I'm not 
        // absolutely certain this is correct but it works for 100%/100%
        if(w.substr(w.length-1, 1) == "%") {
            w = (parseFloat(w.substr(0,w.length-1)) / 100.0) * innerWidth;
        }
        if(h.substr(h.length-1, 1) == "%") {
            h = (parseFloat(h.substr(0,h.length-1)) / 100.0) * innerHeight;
        }

        // get the ViewBox
        vba=root.getAttribute("viewBox")
        if(vba==null) vba="0 0 "+w+" "+h
        var vb=vba.split(" ")//get the viewBox into an array

        //--------------------------------------------------------------------------
        //create a matrix with current user transformation
        tr.a= root.currentScale
        tr.d=root.currentScale
        tr.e= root.currentTranslate.x
        tr.f=root.currentTranslate.y


        //scale factors
        sx=w/vb[2]
        sy=h/vb[3]


        //meetOrSlice
        if(mos=="slice"){
        s=(sx>sy ? sx:sy)
        }else{
        s=(sx<sy ? sx:sy)
        }

        //preserveAspectRatio="none"
        if (par=="none"){
            sCTM.a=sx//scaleX
            sCTM.d=sy//scaleY
            sCTM.e=- vb[0]*sx //translateX
            sCTM.f=- vb[0]*sy //translateY
            sCTM=tr.multiply(sCTM)//taking user transformations into acount

            return sCTM
        }


        sCTM.a=s //scaleX
        sCTM.d=s//scaleY
        //-------------------------------------------------------
        switch(parX){
            case "xMid":
                sCTM.e=((w-vb[2]*s)/2) - vb[0]*s //translateX
                break;
                
            case "xMin":
                sCTM.e=- vb[0]*s//translateX
                break;
                
            case "xMax":
                sCTM.e=(w-vb[2]*s)- vb[0]*s //translateX
                break;
                
        }
        //------------------------------------------------------------
        switch(parY){
            case "YMid":
                sCTM.f=(h-vb[3]*s)/2 - vb[1]*s //translateY
                break;
                
            case "YMin":
                sCTM.f=- vb[1]*s//translateY
                break;
                
            case "YMax":
                sCTM.f=(h-vb[3]*s) - vb[1]*s //translateY
                break;
                
        }
        sCTM=tr.multiply(sCTM)//taking user transformations into acount

        return sCTM
    },
    
    
    
    mouseDown : function (evt) { 
        
        Pman.Tab.BuilderErm.Movable.draggingElement = _this;
	 
        var p = document.documentElement.createSVGPoint();
        p.x = evt.clientX;
        p.y = evt.clientY;

        var m = getScreenCTM(document.documentElement);

        p = p.matrixTransform(m.inverse());
        _this.nMouseOffsetX = p.x - parseInt(Pman.Tab.BuilderErm.Movable.draggingElement.obj.getAttribute("dragx"));
        _this.nMouseOffsetY = p.y - parseInt(Pman.Tab.BuilderErm.Movable.draggingElement.obj.getAttribute("dragy"));

    },
    mouseUp : function (evt) { 
    
        if (!Pman.Tab.BuilderErm.Movable.draggingElement ) {
            return;
        }
        Pman.Tab.BuilderErm.Movable.draggingElement.nMouseOffsetX = 0;
        Pman.Tab.BuilderErm.Movable.draggingElement.nMouseOffsetY = 0;
        Pman.Tab.BuilderErm.Movable.draggingElement = null;
        
    },
    mouseMove : function (evt) { 
        var p = document.documentElement.createSVGPoint();
        p.x = evt.clientX;
        p.y = evt.clientY;
        
        var m = getScreenCTM(document.documentElement);
        if(Pman.Tab.BuilderErm.Movable.draggingElement ) {
            p = p.matrixTransform(m.inverse());
            p.x -= Pman.Tab.BuilderErm.Movable.draggingElement.nMouseOffsetX;
            p.y -= Pman.Tab.BuilderErm.Movable.draggingElement.nMouseOffsetY;
            
       
            Pman.Tab.BuilderErm.Movable.draggingElement.obj.setAttribute("dragx", p.x);
            Pman.Tab.BuilderErm.Movable.draggingElement.obj.setAttribute("dragy", p.y);
            Pman.Tab.BuilderErm.Movable.draggingElement.obj.setAttribute("transform", "translate(" + p.x + "," + p.y + ")");
            Pman.Tab.BuilderErm.Movable.draggingElement.moveCallback(Pman.Tab.BuilderErm.Movable.draggingElement.obj);
        }
         
       
    }
    
	
});



// Rectangle ??

Pman.Tab.BuilderErm.SVGDiagram = function() 
{
    
    this.positions = {};
    this.lpositions = {};
	
    
    
}
Roo.apply(Pman.Tab.BuilderErm.SVGDiagram.Prototype, {
    
    
    
	FONT_SIZE : 12,
    TEXT_PAD : 4,
    START_X : 10,
    START_Y : 10,
    maxTableHeight : 0,
    currentX : 0,
    currentY : 0,
    maxX : 0,
    maxY : 0,
    positions : false,
    lpositions : false,
    
    
    savePositions :function() {
	    //alert('save');
	    sessionStorage.positions = this.positions.toSource();
	},
    
    
	loadPositions : function () {
		 if (sessionStorage.getItem("positions")) {
			eval ("this.positions = " + sessionStorage.positions);
		}   
	},
     
		
		this.currentX += tableWidth + 10;
		this.maxX = (this.maxX<this.currentX) ? this.currentX : this.maxX; 
		if (this.currentX > this.widthLimit) {
			this.currentX = this.START_X;
			this.currentY += this.maxTableHeight + 10;
		}
		//alert(this.currentY);
		this.maxY = ((this.currentY + tableHeight) > this.maxY) ? this.currentY + tableHeight : this.maxY;
		//close the group
		var _t = this;
		var _cb = function(e) {
			_t.positions[name].x = parseInt(rect.getAttribute("x")) + parseInt(tabGrp.getAttribute("dragx"));
			_t.positions[name].y = parseInt(rect.getAttribute("y")) + parseInt(tabGrp.getAttribute("dragy"));
			_t.savePositions();
			_t.drawConnections(e.getAttribute("tableName"));
			
		}
		new Pman.Tab.BuilderErm.Movable(tabGrp, rect, _cb);
		//new Pman.Tab.BuilderErm.Movable(tabGrp, rect2, _cb);
		tabGrp.setAttribute("tableName", name);
		return tabGrp;
	},
	
	drawConnections  : function(tablematch)
	{
		//alert(this.positions.toSource());
		for(var tn in this.links) {
			for (var linkfrom in this.links[tn]) {
				if (typeof(tablematch) != "undefined") {
					if ((tn != tablematch) && (this.links[tn][linkfrom][0] != tablematch)) {
						continue;
					}
					
				}
				
				
				this.drawConnection(tn, linkfrom, this.links[tn][linkfrom][0], this.links[tn][linkfrom][1]);
			}
		}
		
	},
	drawConnections  : function(tablematch)
    {
        //alert(this.positions.toSource());
        for(var tn in this.links) {
            for (var linkfrom in this.links[tn]) {
                if (typeof(tablematch) != "undefined") {
                    if ((tn != tablematch) && (this.links[tn][linkfrom][0] != tablematch)) {
                        continue;
                    }
                    
                }
                
                
                this.drawConnection(tn, linkfrom, this.links[tn][linkfrom][0], this.links[tn][linkfrom][1]);
            }
        }
        
    },
    drawConnection : function( tablefrom, colfrom, tableto, colto )
    {
        var doffset = 6;
        var id = 'LINK-' + tablefrom +'-' + colfrom +'-' + tableto +'-' +  colto;
        //alert(id);
        var pfrom = this.lpositions[tablefrom + '.' + colfrom];
        var pto = this.lpositions[tableto+ '.' + colto];
        if (!pfrom || !pto) {
            // should be alert!
            return;
        }
        //alert(pfrom.toSource());
        //alert(pto.toSource());
        // decide how to join. 
        
        fobj = document.getElementById('GT~' + tablefrom);
        tobj = document.getElementById('GT~' + tableto);
        
        froml = pfrom.l + parseInt(fobj.getAttribute("dragx"));
        fromr = pfrom.r + parseInt(fobj.getAttribute("dragx"));
        
        tol = pto.l + parseInt(tobj.getAttribute("dragx"));
        tor = pto.r + parseInt(tobj.getAttribute("dragx"));
        
        
        fx = froml > tol ? froml  : fromr;
        tx = froml > tol ? tor : tol;
        
        var line = document.getElementById(id);
        var create = false;
        if (!line) {
            create = true;
            line = document.createElementNS(SVGNS, 'line'); 
        }
        
        line.setAttribute('id', id); 
        line.setAttribute('x1', fx); 
        line.setAttribute('y1', doffset  + pfrom.y + parseInt(fobj.getAttribute("dragy"))); 
        line.setAttribute('x2', tx);
        line.setAttribute('y2', doffset  + pto.y + parseInt(tobj.getAttribute("dragy"))); 
        line.setAttribute('stroke', 'red'); 
        if (create) {
            document.rootElement.appendChild(line);
            
        }
        // draw a line on the target!
        
        var id = 'LINKL-' + tablefrom +'-' + colfrom;
        if (!document.getElementById(id)) {
            var line = document.createElementNS(SVGNS, 'line'); 
            line.setAttribute('id', id); 
            line.setAttribute('x1', pfrom.l); 
            line.setAttribute('y1', pfrom.y+doffset ); 
            line.setAttribute('x2', pfrom.r);
            line.setAttribute('y2', pfrom.y+doffset ); 
            line.setAttribute('stroke', 'red'); 
            var tb = document.getElementById("GT~" + tablefrom);
            tb.insertBefore(line, tb.getElementsByTagName('text')[0]);
             
        }
        var id = 'LINKL-' + tableto +'-' + colto;
        if (!document.getElementById(id)) {
            var line = document.createElementNS(SVGNS, 'line'); 
            line.setAttribute('id', id); 
            line.setAttribute('x1', pto.l); 
            line.setAttribute('y1', pto.y+doffset ); 
            line.setAttribute('x2', pto.r);
            line.setAttribute('y2', pto.y+doffset ); 
            var tb = document.getElementById("GT~" + tableto);
            tb.insertBefore(line, tb.getElementsByTagName('text')[0]);
            line.setAttribute('stroke', 'red'); 
        }
        
        
        
        
        
    }
        
     
    
    
})
    












*/
