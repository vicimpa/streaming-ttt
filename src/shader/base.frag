#version 300 es
precision lowp float;

uniform vec3 iResolution;
uniform float iTime;

out vec4 fragColor;

void main() { fragColor = vec4(iResolution.xy / gl_FragCoord.xy, 0, 1); }