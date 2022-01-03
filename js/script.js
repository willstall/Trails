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

// utility functions
const L = (N, f) => [...Array(N)].map((_, i) => f(i));
const TAU = 6.283185307179586;
const H = .5 + .5 * 5 ** .5; // golden ratio


// init gl
const c = document.getElementById("c");
const gl = c.getContext('webgl');
// gl.getExtension('OES_standard_derivatives');

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

  const uniforms = 'u_resolution RA RB RC RD u_time'.split(' ');
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
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img1);

  const tex2 = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, tex2); 
  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
  // Upload the image into the texture.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img2);
  
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
  var u_image1Location = gl.getUniformLocation(program, "u_tex1");

  // set which texture units to render with.
  gl.uniform1i(u_image0Location, 0);  // texture unit 0
  gl.uniform1i(u_image1Location, 1);  // texture unit 1

  // Set each texture unit to use a particular texture.
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, tex1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, tex2);  

  // remove this stuff if you don't want 4x a vec4 uniform filled with 
  // a random number between 0..TAU

  dirty = true;
}

const res = {};
function resize() { 
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = devicePixelRatio;
  res.x = c.width = w * dpr|0; 
  res.y = c.height = h * dpr|0;
  c.style.width = w+'px';
  c.style.height = h+'px';
  dirty = true;
}
window.addEventListener('resize', resize);

let time_start = performance.now();
function render(time) {
  gl.viewport(0, 0, c.width, c.height);
  gl.uniform2fv(loc.u_resolution, [res.x, res.y]);
  gl.uniform1f(loc.u_time, time * 0.001);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  requestAnimationFrame(render);
}

let img1;
let img2;

function start()
{
  img1 = new Image();
  img1.src = opts.img1;
  img1.decode().then(() => {
    img2 = new Image();
    img2.src = opts.img2;
    img2.decode().then(() => {
      load_prog(img1,img2);
      resize();
      render();  
    })
  })
}

fetch('shader.frag')
.then(response => response.text())
.then(data => {
   src_frag = data;
   start();
  });