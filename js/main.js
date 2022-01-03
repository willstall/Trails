const lerp = (x, y, a) => x * (1 - a) + y * a;

var trail;
var spring;

function main()
{	
	// Setup
	setup();

	// Project
	var range = 50;
	var colors = [
		{r : 255, g : 255, b: 255,a: 1},
		{r : 255, g : 255, b: 0,a: 1},
		{r : 0, g : 255, b: 255,a: 1},
		{r : 255, g : 0, b: 255,a: 1}
	]

	for(var i = 1; i < 4; i ++)
	{
		var springTrail = new SpringTrail();
			springTrail.x = ( Math.random() - .5 ) * range;
			springTrail.y = ( Math.random() - .5 ) * range;
			springTrail.trail.color = colors[i];
			springTrail.trail.size = Math.random() * 5;
			springTrail.spring.k = Math.random();
			springTrail.spring.interia = Math.random();
		
		container.addChild( springTrail );
	}

	var initialTrail = new SpringTrail();
		initialTrail.trail.color = colors[0];
		
	container.addChild( initialTrail );
	container.alpha = .5;
	console.log("hello");
	
	//save
}