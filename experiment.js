import { ARButton } from 'https://unpkg.com/three/examples/jsm/webxr/ARButton.js';
import { TTFLoader } from 'https://unpkg.com/three/examples/jsm/loaders/TTFLoader.js';

let arDisplay, renderer, scene, arView, camera, arControls;
let arObjects = [];
let previousTime = 0;

function init() {

    console.log("setup scene");
    // setup scene
    scene = new THREE.Scene();

    console.log("add lights");
    // Add some lights
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set( 0, 1, 0 );
    scene.add( light );
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    console.log("add text");
    const text_loader = new TTFLoader();
    text_loader.load("../font/Otsutome_font_ver3/OtsutomeFont_Ver3.ttf", data => {
        const font = new THREE.FontLoader().parse(data)

        let geo = new THREE.TextBufferGeometry("MIW", { //"祝う"
            font: font,
            size: 1,
            height: .25,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.05,
        });

        let mesh = new THREE.Mesh(
            geo,
            new THREE.MeshLambertMaterial({color: 'green'})
        );
        mesh.position.set(0, 1.5, -15);

        console.log("adding font mesh")
        scene.add(mesh);
        arObjects.push(mesh);

        geo = new THREE.TextBufferGeometry("祝う", { //"祝う"
            font: font,
            size: 1,
            height: .25,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.05,
        });

        mesh = new THREE.Mesh(
            geo,
            new THREE.MeshLambertMaterial({color: 'green'})
        );
        mesh.position.set(4, 1.5, -15);

        scene.add(mesh);
        arObjects.push(mesh);
    });

    let cube = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1,1,1),
        new THREE.MeshLambertMaterial({color:'red'})
    );
    cube.position.set(-4, 1.5, -15);
    scene.add(cube);
    arObjects.push(cube);

    console.log("setup renderer");
    // setup ARView with ARPerspectiveCamera
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    console.log("setup view");
    // arView = new THREE.ARView(arDisplay, renderer);
    document.body.appendChild(ARButton.createButton(renderer));
    // camera = new THREE.ARPerspectiveCamera(arDisplay, 60, window.innerWidth / window.innerHeight, arDisplay.depthNear, arDisplay.depthFar);
    console.log("setup camera");
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
    arControls = renderer.xr.getController(0);
    arControls.userData.skipFrames = 0;
    scene.add( arControls );

    console.log("animate!")
    animate();
    console.log("animating?")
}

function animate() {
    renderer.setAnimationLoop( render );
}

function render(time) {
    //arControls.update();

    let elapsed = time - previousTime;
    previousTime = time;
    arObjects.forEach((item, index) => updateHeight(item, elapsed));
    // arView.render();
    // renderer.clearDepth();
    renderer.render(scene, camera);

    if (time % 10 == 0) {
        console.log("adding a cube")
        addCube();
    }
}

init();


function updateHeight(arObject, time) {
    arObject.translateY(-.001 * time);
    arObject.rotateY(0.001 * time);
    let position = arObject.getWorldPosition(new THREE.Vector3());

    if (position.y < -5) {
        arObject.translateY(10);
    }
}

function addCube() {

    var cursor = new THREE.Vector3();
    cursor.set( 0, 0, - 0.2 ).applyMatrix4( arControls.matrixWorld );

    let cube = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1,1,1),
        new THREE.MeshLambertMaterial({color:'blue'})
    );
    let randomX = (Math.random() * 30) - 15;
    cube.position.set(randomX, 1.5, -15);
    scene.add(cube);
    arObjects.push(cube);
}