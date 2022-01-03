(function() {
    function Trail()
    {
    	this.Shape_constructor();

        this.targetX = 0;
        this.targetY = 0;
        
        this.size = 1;
        
        this.lastTargetX = 0;
        this.lastTargetY = 0;

        this.deletionThreshold = 0.015 ;
        this.accel = .98;
        this.color = {
            r : 255,
            g : 0,
            b: 0,
            a: 1
        };
    
        this.points = [];
        // this.on("tick", update).bind(this);
    }

    var p = createjs.extend( Trail, createjs.Shape );
    
        p.update = function()
        {
            this.createPoint();                       
            this.drawPoints();
            this.updatePoints();
        //    console.log(this.points.length);
        }

        p.updatePoints = function()
        {
            for (var i = this.points.length - 1; i >= 0; i--) {
                var pt = this.points[i];
                    pt.alpha *= this.accel;

                if( pt.alpha <= this.deletionThreshold)
                    this.points.splice(i, 1);
            } 
        }

        p.drawPoints = function()
        {
            this.graphics.clear();
            this.graphics.setStrokeStyle(this.size);
            this.graphics.beginStroke( this.color );

            if( this.points < 1)
                return;

            // this.graphics.moveTo( this.points[0].x,this.points[0].y);

            for( var i = 1; i < this.points.length-2; i++)
            {
                var lastPt = this.points[i-1];
                var pt = this.points[i];
                var nextPt = this.points[i+1];
                
                var xc = (pt.x + nextPt.x) * .5;// >> 1;
                var yc = (pt.y + nextPt.y) * .5;// >> 1;

                var xc2 = (pt.x + lastPt.x) * .5;// >> 1;
                var yc2 = (pt.y + lastPt.y) * .5;// >> 1;

                var localColor = this.color;
                    localColor.a = pt.alpha;

                this.graphics.beginStroke(
                    "rgba(" +
                            localColor.r + "," +
                            localColor.g + "," +
                            localColor.b + "," +
                            localColor.a + 
                            ")" );

                this.graphics.moveTo( xc, yc );
                //this.graphics.lineTo( pt.x,pt.y);
                this.graphics.curveTo( pt.x, pt.y, xc2 , yc2 );
                this.graphics.endStroke();
            }
            // need to add last point
        }
/*

app.midPt = new createjs.Point(app.oldPt.x + app.stage.mouseX - app.stage.canvas.width/2>>1, app.oldPt.y+app.stage.mouseY - app.stage.canvas.height/2>>1);

    // move to the first point
   ctx.moveTo(points[0].x, points[0].y);


   for (i = 1; i < points.length - 2; i ++)
   {
      var xc = (points[i].x + points[i + 1].x) / 2;
      var yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
   }
 // curve through the last two points
 ctx.quadraticCurveTo(points[i].x, points[i].y, points[i+1].x,points[i+1].y);
 */

        p.createPoint = function()
        {
            if( this.targetX != this.lastTargetX || this.targetY != this.lastTargetY)
            {
                var pt = {
                    x : this.targetX,
                    y : this.targetY,
                    alpha : 1
                }

                this.points[this.points.length ] = pt;
            }

            this.lastTargetX = this.targetX;
            this.lastTargetY = this.targetY;
        }

    window.Trail = createjs.promote( Trail, "Shape" );
} () );