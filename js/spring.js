(function() {
    function Spring()
    {
    	this.Container_constructor();

        this.inertia = 0.92 ;
	    this.k = .6 ;

        this.xp = this.x;
		this.yp = this.y;

        this.targetX = this.x;
        this.targetY = this.y;
    }

    var p = createjs.extend( Spring, createjs.Container );

        p.update = function()
        {
            var x = -this.x + this.targetX ;
            var y = -this.y + this.targetY ;

            this.xp = this.xp * this.inertia + x*this.k ;
            this.yp = this.yp * this.inertia + y*this.k ;

            this.x += this.xp ;
            this.y += this.yp ;            
        }

    window.Spring = createjs.promote( Spring, "Container" );
} () );