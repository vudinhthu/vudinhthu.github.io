import * as THREE from 'three';
import {OrbitControls} from 'jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Setup lights
var lightColor = parseInt ( '0xffffff', 16 );
const aLight = new THREE.AmbientLight(lightColor, 5);
scene.add(aLight);
const dLight = new THREE.DirectionalLight(lightColor, 5);
dLight.position.set(5,0,20);
dLight.rotation.set(1,0,0);

// Setup helpers
const axesHelper = new THREE.AxesHelper(16);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(50, 50);
scene.add(gridHelper);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
const circleGroup = new THREE.Group();
const frontGroup = new THREE.Group();
const backGroup = new THREE.Group();
scene.add( circleGroup );
var time = 0, speed = 0.1;
var radius = 9, radius2 = radius - 0.001, n = 10, geoW = 4, geoH = 6, segments = 100;
var FrontSide = [];
var BackSide = [];

for ( var i = 0; i < n; i ++ ) {
    const geometry = new THREE.PlaneGeometry( geoW, geoH, segments, segments );
    //shear
    var matrix = new THREE.Matrix4();
    var Syx = 1, Syz = 0;
    matrix.set(   1,   Syx,   0,   0,
                0,     1,   0,   0,
                0,   Syz,   1,   0,
                0,     0,   0,   1  );
    geometry.applyMatrix4( matrix );

    //curse
    const positions = geometry.attributes.position;
    const axis = new THREE.Vector3(0, 1, 0);
    const axisPosition = new THREE.Vector3(0, -2, 8);
    const vTemp = new THREE.Vector3(0, 0, 0);
    let lengthOfArc;
    let angleOfArc;
    for (let i = 0; i < positions.count; i++){
        vTemp.fromBufferAttribute(positions, i);
        lengthOfArc = (vTemp.x - axisPosition.x);
        angleOfArc = (lengthOfArc / axisPosition.z);
        vTemp.setX(0).setZ(-axisPosition.z).applyAxisAngle(axis, angleOfArc).add(axisPosition);
        positions.setXYZ(i, vTemp.x, vTemp.y, vTemp.z);
    }

    //create mesh
    let front = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x00ffff , side: THREE.DoubleSide } ));
    frontGroup.add(front);
    let back = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x99B3D3 , side: THREE.DoubleSide } ));
    backGroup.add(back);
    circleGroup.add(frontGroup);
    circleGroup.add(backGroup);
    let theta = (2 * Math.PI / n) * i;
    FrontSide.push({"mesh": front, "theta": theta});
    BackSide.push({"mesh": back, "theta": theta});
}

FrontSide.forEach((c, i) => {
    c.mesh.position.set(
        Math.cos(c.theta) * radius,
        0,
        Math.sin(c.theta) * radius,
    )
    c.mesh.lookAt(0, 0, 0);
});
BackSide.forEach((c, i) => {
    c.mesh.position.set(
        Math.cos(c.theta) * radius2,
        0,
        Math.sin(c.theta) * radius2,
    )
    c.mesh.lookAt(0, 0, 0);
});

circleGroup.position.y = geoH / 2;
camera.position.set(0,5,18);

const animation = () => {
    time = clock.getElapsedTime() * 0.5 * Math.PI;
    circleGroup.rotation.y = time * speed;
    controls.update();
    renderer.render(scene, camera);
};
renderer.setAnimationLoop(animation);
