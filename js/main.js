const lerp = (x, y, a) => x * (1 - a) + y * a;
const fract = (x) => x-floor(x);

var trail;
var spring;

var initialTrail
var trails = [];

function main()
{	
	// Setup
	setup();

	// Project
	var range = 50;
	// var colors = [
	// 	{r : 255, g : 255, b: 255,a: 1},
	// 	{r : 255, g : 255, b: 0,a: 1},
	// 	{r : 0, g : 255, b: 255,a: 1},
	// 	{r : 255, g : 0, b: 255,a: 1}
	// ]

	var colors = [
		{r : 255, g : 255, b: 255,a: 1},
		{r : 255, g : 255, b: 0,a: 1},
		{r : 0, g : 255, b: 255,a: 1},
		{r : 255, g : 0, b: 255,a: 1}
	]

	initialTrail = new SpringTrail();
	initialTrail.trail.color = colors[0];
	
	container.addChild( initialTrail );
	// container.alpha = .5;

	var target = initialTrail;

	for(var i = 1; i < 6; i ++)
	{
		var springTrail = new SpringTrail();
			springTrail.x = ( Math.random() - .5 ) * range;
			springTrail.y = ( Math.random() - .5 ) * range;
			springTrail.seed = Math.random();
			springTrail.trail.color = colors[i%4];
			springTrail.trail.size = Math.random() * 10;
			springTrail.spring.k = Math.random();
			springTrail.spring.interia = Math.random();
			springTrail.target = target;

		container.addChild( springTrail );
		// target = springTrail;
		trails[i-1] = springTrail;
	}



	// this.stage.on("tick", update, this );
}

function update( evt )
{
	// console.log("hello");
	let t =  initialTrail.parent.globalToLocal( this.stage.mouseX , this.stage.mouseY );
	for(var i = 0; i < trails.length; i ++)
	{
		var trail = trails[i];
			trail.target = t;
	}
	initialTrail.target = t;
}