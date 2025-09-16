#version 300 es
precision lowp float;

void main() {
  int id = gl_VertexID;
  gl_Position = vec4(vec2(id & 1, id > 1) * 2.0 - 1.0, 0, 1);
}