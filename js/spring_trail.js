(function() {
    function SpringTrail()
    {
    	this.Container_constructor();

        this.offsetX = 0;
        this.offsetY = 0;

        this.spring = new Spring();
        this.trail = new Trail();
        this.trail.targetX = this.spring.x;
        this.trail.targetY = this.spring.y;
        this.seed = 0;
        this.TAU = Math.PI*2.0;

        this.addChild( this.spring, this.trail );

        this.on("added", this.added,this );
    }   

    var p = createjs.extend( SpringTrail, createjs.Container );

        p.added = function()
        {
            this.stage.on("tick", this.update, this );
        }

        p.update = function( evt )
        {
            var d = 100.15;
            var speed = 0.5;
            var offset_distance = this.TAU*Math.random(this.seed);
            var time = createjs.Ticker.getTime()*0.01*speed;
            var mp = this.parent.globalToLocal( this.stage.mouseX , this.stage.mouseY ) ;
                mp.x = 0.0 + d*Math.sin(this.TAU*time + offset_distance*Math.sin(this.TAU*time + offset_distance*this.TAU*this.seed));//stage.canvas.width*0.5;
                mp.y = 0.0 + d*Math.cos(this.TAU*time + offset_distance*Math.cos(this.TAU*time - offset_distance*this.TAU*this.seed));//stage.canvas.height*0.5;

                // mp.x += this.offsetX;
                // mp.y += this.offsetY;

            this.spring.targetX = mp.x;
            this.spring.targetY = mp.y;
            this.spring.update();

            this.trail.targetX = this.spring.x;
            this.trail.targetY = this.spring.y;
            this.trail.update();
        }

    window.SpringTrail = createjs.promote( SpringTrail, "Container" );
} () );