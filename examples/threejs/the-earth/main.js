import * as THREE from "three";
import { getFresnelMat } from "./getFresnelMat.js";

const _t = document.getElementById('demo03'),
	w = _t.offsetWidth,
	h = _t.offsetHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(w, h);

const container = document.getElementById('earth-background');
container.appendChild(renderer.domElement);

THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

const detail = 50;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
	map: loader.load("./assets/textures/00_earthmap1k.jpg"),
	specularMap: loader.load("./assets/textures/02_earthspec1k.jpg"),
	bumpMap: loader.load("./assets/textures/01_earthbump1k.jpg"),
	bumpScale: 0.04,
})
const earthMesh = new THREE.Mesh(geometry,material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
	map: loader.load("./assets/textures/03_earthlights1k.jpg"),
	blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
	map: loader.load("./assets/textures/04_earthcloudmap.jpg"),
	transparent: true,
	opacity: 0.8,
	blending: THREE.AdditiveBlending,
	alphaMap: loader.load('./assets/textures/05_earthcloudmaptrans.jpg'),
	// alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function handleWindowResize() {
	let _w = window.innerWidth;
	let _h = window.innerHeight;
	let aspect = _w / _h;
	if(aspect > 1) {
		container.style.position = 'absolute';
	} else {
		_h = _h * 0.4;
		camera.fov = 25;
		container.style.position = 'relative';
	}
	camera.aspect = _w / _h;
	camera.updateProjectionMatrix();
	renderer.setSize(_w,_h);
}

const resizeObserver = new ResizeObserver(handleWindowResize);
resizeObserver.observe(document.querySelector('#demo03'));

const animation = () => {
	earthMesh.rotation.y += 0.004;
	lightsMesh.rotation.y += 0.004;
	cloudsMesh.rotation.y += 0.004;
	glowMesh.rotation.y += 0.004;
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animation);