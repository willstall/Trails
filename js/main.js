const lerp = (x, y, a) => x * (1 - a) + y * a;
const fract = (x) => x-floor(x);

var trail;
var spring;

var initialTrail
var trails = [];

var maxSize;

function main()
{	
	// Setup
	setup();

	maxSize = Math.max(this.stage.canvas.width,this.stage.canvas.height);

	// Project
	var range = {x:maxSize*0.0125,y:maxSize*0.0125};
	// var colors = [
	// 	{r : 255, g : 255, b: 255,a: 1},
	// 	{r : 255, g : 255, b: 0,a: 1},
	// 	{r : 0, g : 255, b: 255,a: 1},
	// 	{r : 255, g : 0, b: 255,a: 1}
	// ]

	var tff = 100;	// 255
	var colors = [
		{r : tff, g : tff, b: tff,a: 1},
		{r : tff, g : tff, b: 0,a: 1},
		{r : 0, g : tff, b: tff,a: 1},
		{r : tff, g : 0, b: tff,a: 1}
	]

	initialTrail = new SpringTrail();
	initialTrail.trail.size = 3.0;
	initialTrail.trail.color = colors[0];
	
	container.addChild( initialTrail );
	// container.alpha = .5;

	var target = initialTrail;

	for(var i = 1; i < 4; i ++)
	{
		var springTrail = new SpringTrail();
			springTrail.x = lerp(range.x,range.y,Math.random())*Math.sign(Math.random() - .5);
			springTrail.y = lerp(range.x,range.y,Math.random())*Math.sign(Math.random() - .5);
			springTrail.seed = {x:Math.random(),y:Math.random(),z:Math.random()};
			springTrail.trail.color = colors[i%4];
			springTrail.trail.size = lerp(2,5,Math.random());
			springTrail.spring.k = Math.random();
			springTrail.spring.interia = Math.random();
			springTrail.target = target;

		container.addChild( springTrail );
		target = springTrail;
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



/*****************************************************
 *	SHADER STUFF   
 *****************************************************/

 const src_vert = `attribute vec2 a_position; 
void main() {
  gl_Position = vec4(a_position, 1.0, 1.0);
}`;

let default_opts = {
  img1: 'noise.png',
  img2: 'colors.png'
  // animation_length: 30 * 1000,
  // fps: 37,
};

 const c = document.getElementById("c");
 const gl = c.getContext('webgl');
//  gl.getExtension('OES_standard_derivatives');
 
 let src_frag = () => "";
 
 
 const loc = {}; // locations for our uniforms
 let dirty = true;
 
 const Shader = (typ, src)=>{
   const s=gl.createShader(typ);
   gl.shaderSource(s,src);
   gl.compileShader(s);
   return s;
 }
 
 let program;
 function load_prog(img1,img2) {
   gl.deleteProgram(program);
   program = gl.createProgram();
   const vs = Shader(gl.VERTEX_SHADER, src_vert);
   const fs = Shader(gl.FRAGMENT_SHADER, src_frag);
   gl.attachShader(program, vs);
   gl.attachShader(program, fs);
   gl.linkProgram(program);
 
   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	   // something went wrong with the link
	   console.log("Link failed:\n", gl.getProgramInfoLog(program));
	   console.log("VS LOG:\n", gl.getShaderInfoLog(vs));
	   console.log("FS LOG:\n", gl.getShaderInfoLog(fs));
	   throw ("Program failed to link (see console for error log).");
   }
 
   const uniforms = 'u_resolution u_time u_tex0Resolution u_pixelration'.split(' ');
   for (let uni of uniforms) {
	 loc[uni] = gl.getUniformLocation(program, uni);
   }
   const tex1 = gl.createTexture();
   // gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, tex1); 
   // Set the parameters so we can render any size image.
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
   // Upload the image into the texture.
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, document.getElementById('canvas'));
 
//    const tex2 = gl.createTexture();
//    gl.activeTexture(gl.TEXTURE1);
//    gl.bindTexture(gl.TEXTURE_2D, tex2); 
//    // Set the parameters so we can render any size image.
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
//    // Upload the image into the texture.
//    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img2);
   
   const vertices = Float32Array.of(-1, 1, -1, -1, 1, 1, 1, -1);
   const vertexBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
   const loc_a_position = gl.getAttribLocation(program, 'a_position');
   gl.enableVertexAttribArray(loc_a_position);
   gl.vertexAttribPointer(loc_a_position, 2, gl.FLOAT, false, 0, 0);
 
   gl.useProgram(program);
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   // textures
   var u_image0Location = gl.getUniformLocation(program, "u_tex0");
//    var u_image1Location = gl.getUniformLocation(program, "u_tex1");
 
   // set which texture units to render with.
   gl.uniform1i(u_image0Location, 0);  // texture unit 0
//    gl.uniform1i(u_image1Location, 1);  // texture unit 1
 
   // Set each texture unit to use a particular texture.
   gl.activeTexture(gl.TEXTURE0);
   gl.bindTexture(gl.TEXTURE_2D, tex1);
//    gl.activeTexture(gl.TEXTURE1);
//    gl.bindTexture(gl.TEXTURE_2D, tex2);  
 
   // remove this stuff if you don't want 4x a vec4 uniform filled with 
   // a random number between 0..TAU
 
   dirty = true;
 }
 
 const res = {};
 function shader_resize() { 
   const w = window.innerWidth;
   const h = window.innerHeight;
   const dpr = devicePixelRatio;
   res.x = c.width = w * dpr|0; 
   res.y = c.height = h * dpr|0;
   c.style.width = w+'px';
   c.style.height = h+'px';
   dirty = true;
 }
 window.addEventListener('resize', shader_resize);
 
 let time_start = performance.now();
 function render(time) {
   gl.viewport(0, 0, c.width, c.height);
   gl.uniform2fv(loc.u_resolution, [res.x, res.y]);
   gl.uniform1f(loc.u_time, time * 0.001);
   gl.uniform1f(loc.u_pixelration, devicePixelRatio );
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
 
	// texture

	var canvas = document.getElementById('canvas');
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	const tex1 = gl.createTexture();
	// gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex1); 
	// Set the parameters so we can render any size image.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
	// Upload the image into the texture.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

	var u_image0Location = gl.getUniformLocation(program, "u_tex0");
	gl.uniform1i(u_image0Location, 0);  // texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex1);

	gl.uniform2fv(loc.u_tex0Resolution, [canvas.width, canvas.height]);
	
   requestAnimationFrame(render);
 }
 
 let img1;
 let img2;
 
 function start()
 {
	load_prog(img1,img2);
	// resize();		/// this is the resize for the createjs element
	shader_resize(); 
	render();

//    img1 = new Image();
//    img1.src = opts.img1;
//    img1.decode().then(() => {
// 	 img2 = new Image();
// 	 img2.src = opts.img2;
// 	 img2.decode().then(() => {
// 	   load_prog(img1,img2);
// 	   resize();
// 	   render();  
// 	 })
//    })
 }
 
 fetch('shader.frag')
 .then(response => response.text())
 .then(data => {
	src_frag = data;
	start();
   });