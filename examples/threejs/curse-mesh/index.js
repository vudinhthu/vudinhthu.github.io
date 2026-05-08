import * as THREE from 'three';
import {OrbitControls} from 'jsm/controls/OrbitControls.js';
import * as dat from 'dat.GUI';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({antialias: true}); // Khử răng cưa
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.z = 15;

const control = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const geometry = new THREE.PlaneGeometry(4, 4, 16, 16);
const material = new THREE.MeshBasicMaterial( { color: 0x00ffff, side: THREE.DoubleSide } );
const plane = new THREE.Mesh(geometry,material);
scene.add(plane);

renderer.render(scene, camera);

const animation = () => {
    control.update();
    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animation);

const GuiSettings = {
	visible: true,
	color: plane.material.color.getHex(),
	rotateX: plane.rotation.x
};
const gui = new dat.GUI();

const planSettings = gui.addFolder('Plane');
planSettings.addColor(GuiSettings, 'color').name('Color').onChange((value) => plane.material.color.setHex(value));
planSettings.add(GuiSettings, 'visible').name('Visible').onChange((value) => plane.visible = value);
planSettings.add(GuiSettings, 'rotateX', 0, 360).step(1).name('Rotate X').onChange((value) => {
	plane.rotation.x = THREE.MathUtils.degToRad(value)
});
planSettings.open();