precision mediump float;

// ----------------------------------------------------
//
// CREATED BY @WILLSTALL
//
// ----------------------------------------------------

#define BACKGROUND vec3(0.1412, 0.1451, 0.1216)
#define SECONDS 60.0

#define REFLECT_POWER 2.10533
#define NUM_REFLECTIONS 3
#define EPSILON .001

// #define REFLECTIONS_ON

#define FAR 100.0
#define NEAR 0.001

#ifdef GLSLVIEWER
    #define AA 4
    #define BLUR 30.0
#else
    // #define AA 2
    // #define BLUR 30.0
    // #define MOBILE_ADJUST
#endif


// ----------------------------------------------------
// 
// DEFINITIONS
// 
// ----------------------------------------------------

#define PI 3.14159265359
#define HALF_PI 1.57079632675
#define QUARTER_PI 0.78539816339
#define TWO_PI 6.283185307

// ----------------------------------------------------
// 
// UNIFORMS
// 
// ----------------------------------------------------

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform sampler2D u_tex0;           // noise3.png

// ----------------------------------------------------
// 
// UTILITIES
// 
// ----------------------------------------------------

mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
}

float repeat(float x)
{
    return 2.0*abs(fract(x)-0.5);
}

mat2 rotate(float angle)
{
    return mat2( cos(angle),-sin(angle),sin(angle),cos(angle) );
}

vec2 center(vec2 st,vec2 res)
{
    float aspect = res.x/res.y;
    st.x = st.x * aspect - aspect * 0.5 + 0.5;
    return st;
}

// ----------------------------------------------------
// 
// SHADER
// 
// ----------------------------------------------------

vec3 sCurve(vec3 c)
{
    c = clamp(c,vec3(0.0),vec3(1.0));
    return c*c*(3.0-2.0*c);
}

vec4 blur(vec2 st,vec2 res)
{
    const float Pi = 6.28318530718; // Pi*2
    
    // GAUSSIAN BLUR SETTINGS {{{
    const float Directions = 16.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
    const float Quality = 3.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
    float Size = 8.0; // BLUR SIZE (Radius)
    // GAUSSIAN BLUR SETTINGS }}}
    const float inverseQuality = 1.0/Quality;
    vec2 Radius = Size/res.xy;

    // Pixel colour
    vec4 Color = texture2D( u_tex0, st);
    
    const float sa = Pi/Directions;
    // Blur calculations
    for( float d=0.0; d<6.28318530718; d+=sa)
    {
		for( float i=inverseQuality; i<=1.0; i+=inverseQuality)
        {
			Color += texture2D( u_tex0, st+vec2(cos(d),sin(d))*Radius*i);
        }
    }
    
    // Output to screen
    Color /= Quality * Directions;// - 15.0;
    return Color;    
}

vec3 render(vec2 st,vec2 res, float t)
{
    // t = fract(t);
    st /= res;
    // st = clamp(st,0.0,1.0);
    // st = center(st,res);

    vec4 blur = blur(st,res);
    vec4 col = texture2D(u_tex0,fract(st),-10.0).rgba;

    vec3 bg = vec3(60.0, 60.0, 60.0)/255.0;

    vec3 c1 = mix(bg,blur.rgb,blur.a);
    vec3 c2 = mix(bg,col.rgb,col.a);

    // vec3 c3 = mix(c1,c2,0.5);
    // vec3 c3 = c2;
    // c3 += c1;
    // col = vec3(1.0);
    
    vec3 c = mix(c2,c1,blur.a);
         c = sCurve(c);

    return mix(c2,c1,max(blur.a,col.a));
    // return vec3(1.0);
}

// ----------------------------------------------------
// 
// POST PROCESS STACK
// 
// ----------------------------------------------------

vec3 aa(vec2 st, vec2 res)
{
    vec3 color = vec3(0.0);
    float time = u_time;

    #ifdef AA
        for( int j=0; j<AA; j++ )
        for( int i=0; i<AA; i++ )
        {
            // time coordinate (motion blurred, shutter=0.5)
            #ifdef BLUR
                float d = 0.5+0.5*sin(gl_FragCoord.x*147.0)*sin(gl_FragCoord.y*131.0);
                float time = u_time - 0.5*(1.0/BLUR)*(float(j*AA+i)+d)/float(AA*AA);  
            #endif

            time = time/SECONDS;
            color += render( (st + (vec2(i,j)/float(AA))) , res, time );
        }
        color /= float(AA*AA);        
    #else
        color = render( st , res, time/SECONDS );
    #endif 

    return color;
}

void main()
{
    vec3 color = BACKGROUND;

    #ifdef MOBILE_ADJUST
        vec2 res = vec2(min(u_resolution.x,u_resolution.y));
        float offset = max(res.x,u_resolution.y)-res.x;
        
        if(u_resolution.x > res.x )
            res = u_resolution.xy;
        
        if ( gl_FragCoord.y < offset )
            color = BACKGROUND;
        else{
            color = aa(gl_FragCoord.xy - vec2(0.0,offset),res);
        }
    #else
        color = aa(gl_FragCoord.xy,u_resolution.xy);
    #endif
    // vec3 dit = fract(555.*sin(777.*hash(gl_FragCoord.xyy)))/256.;

    // gl_FragColor = vec4(pow(color,vec3(1./2.2))+dit, 1.0);
    gl_FragColor = vec4(color, 1.0);
}