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
            var mp = this.parent.globalToLocal( this.stage.mouseX , this.stage.mouseY ) ;
                mp.x += this.offsetX;
                mp.y += this.offsetY;

            this.spring.targetX = mp.x;
            this.spring.targetY = mp.y;
            this.spring.update();

            this.trail.targetX = this.spring.x;
            this.trail.targetY = this.spring.y;
            this.trail.update();
        }

    window.SpringTrail = createjs.promote( SpringTrail, "Container" );
} () );