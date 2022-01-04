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
        this.seed = {x:0,y:0,z:0};
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
            var d = lerp(maxSize*0.1,maxSize*0.2,this.seed.z);
            var speed = lerp(.1,.33,this.seed.z);
            var offset_distance = this.TAU;
            var time = createjs.Ticker.getTime()*0.01*speed;
            var offset = 0.5;
            var jitter = 5.0;
            // var mp = this.parent.globalToLocal( this.stage.mouseX , this.stage.mouseY ) ;
            var mp = {x:0,y:0};
                mp.x = this.target.x;
                mp.y = this.target.y; 
                // mp.x += d*Math.sin(this.TAU*time);
                // mp.y += d*Math.cos(this.TAU*time);

                mp.x += d*Math.sin(this.TAU*time + offset*Math.sin(this.TAU*time + this.TAU*this.seed.x) + this.TAU*this.seed.z);
                mp.y += d*Math.cos(this.TAU*time + offset*Math.cos(this.TAU*time + this.TAU*this.seed.y) + this.TAU*this.seed.z);
                mp.x += Math.random()*jitter;
                mp.y += Math.random()*jitter;
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