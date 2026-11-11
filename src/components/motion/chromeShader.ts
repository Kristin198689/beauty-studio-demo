// Shared WebGL shaders for the liquid chrome drop (hero and page companion).
export const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
export const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll;
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0); return mix(b, a, h) - k*h*(1.0-h); }
float map(vec3 p){
  // scrolling changes how far the drops drift apart and how strongly they melt together
  float sp = 0.75 + 0.55*sin(uScroll*18.85);
  float k = 0.30 + 0.20*(0.5 + 0.5*sin(uScroll*25.1));
  float d = length(p - vec3(sin(uTime*0.7)*0.45*sp, cos(uTime*0.5)*0.30*sp, 0.0)) - 0.55;
  d = smin(d, length(p - vec3(cos(uTime*0.6)*0.60*sp, sin(uTime*0.8)*0.40*sp, 0.10)) - 0.38, k);
  d = smin(d, length(p - vec3(sin(uTime*0.45+2.0)*0.35*sp, cos(uTime*0.9)*0.55*sp, -0.05)) - 0.30, k);
  d = smin(d, length(p - vec3(uMouse.x*1.1, uMouse.y*0.9, 0.0)) - 0.26, 0.45);
  return d;
}
vec3 normalAt(vec3 p){
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx)));
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*uRes) / min(uRes.x, uRes.y) * 2.0;
  vec3 ro = vec3(0.0, 0.0, 2.25);
  vec3 rd = normalize(vec3(uv, -1.9));
  float t = 0.0; bool hit = false;
  for (int i = 0; i < 56; i++){
    float d = map(ro + rd*t);
    if (d < 0.002){ hit = true; break; }
    t += d;
    if (t > 7.0) break;
  }
  if (!hit){ gl_FragColor = vec4(0.0); return; }
  vec3 p = ro + rd*t;
  vec3 n = normalAt(p);
  vec3 r = reflect(rd, n);
  // studio environment: bright top softbox, dark horizon band, light floor bounce
  float sky = smoothstep(0.05, 0.9, r.y);
  float floorB = smoothstep(-0.2, -0.95, r.y) * 0.55;
  float band = smoothstep(0.0, 0.18, abs(r.y)) ;
  float soft = pow(max(dot(r, normalize(vec3(-0.4, 0.8, 0.5))), 0.0), 18.0) * 1.6;
  float strip = smoothstep(0.55, 0.6, abs(sin(r.x*2.2 + r.y*1.5))) * 0.25;
  float c = 0.06 + sky*0.85 + floorB + soft + strip;
  c *= mix(0.35, 1.0, band);
  float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  c += fres * 0.35;
  c = clamp(c, 0.0, 1.0);
  vec3 col = vec3(c) * vec3(0.96, 0.97, 1.0);
  gl_FragColor = vec4(col, 1.0);
}`;
