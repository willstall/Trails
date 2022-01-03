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
        this.target = {x:.5,y:.5};
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
            var d = lerp(100.0,100.15,this.seed);
            var speed = lerp(.1,.5,this.seed);
            var offset_distance = this.TAU;
            var time = createjs.Ticker.getTime()*0.01*speed;
            // var mp = this.parent.globalToLocal( this.stage.mouseX , this.stage.mouseY ) ;
            var mp = {x:0,y:0};
                mp.x = this.target.x;
                mp.y = this.target.y; 
                mp.x += d*Math.sin(this.TAU*time + Math.sin(this.TAU*time + this.TAU*this.seed));
                mp.y += d*Math.cos(this.TAU*time + Math.cos(this.TAU*time + this.TAU*this.seed));
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