varying vec2 vUv;
uniform float resolution;
uniform float pxNum; // 階段数
uniform vec2 F;
uniform float uTime;

float dt = 0.01; // 時間刻み

// 定数
const float PI = 3.14159265359;
const vec3 CyberColor = vec3(0.0, 1.0, 1.0);

vec3 viscousity(){
	return vec3(0.0, 0.0, 0.0);
}

void main(){
	// 外力項のスカラー値
	float force = length(F);
	// 0~1に正規化
	vec2 uv = vUv;
  uv *= pxNum;
	// resolutionで割って0~1に正規化
	uv.y *= resolution;
	// 時間(sin)で境を滑らかに補間したりくっきりしたりする
  uv = floor(uv) + smoothstep(0.5, 0.5, fract(uv));
  // 再び0~1に正規化
	uv /= pxNum;
  // 任意の色リストを作る
  vec3[4] col4 = vec3[](
    vec3(1.0, 1.0, 0.0),
    vec3(0.0, 0.0, 1.0),
    vec3(1.0, 0.0, 1.0),
    vec3(0.0, 1.0, 1.0)
  );
  vec3 col = mix(
    mix(col4[0], col4[1], uv.x),
    mix(col4[2], col4[3], uv.x),
    uv.y
  );

	// マウス中心ほど強くなる円形
  float intensity = 1.0 - min(length(uv * 2.0 - 1.0), 1.0);
	vec3 fcolor = col + intensity * force;

  // gl_FragColor = vec4(col, 1.0);
	gl_FragColor = vec4(col + intensity * force, 1.0);
}