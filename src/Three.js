import React, { Component } from 'react';
import * as THREE from 'three';
import OBJLoader from './loaders/OBJLoader';
import MTLLoader from './loaders/MTLLoader';
import ColladaLoader from './loaders/MTLLoader';
import GLTFLoader from 'three-gltf-loader';
import { Object3D } from 'three';

// Extend THREE
OBJLoader(THREE);
MTLLoader(THREE);
ColladaLoader(THREE);

const models = [
    {
        obj: process.env.PUBLIC_URL + '/models/sword.obj',
        mtl: process.env.PUBLIC_URL + '/models/sword.mtl',
        json: process.env.PUBLIC_URL + '/models/pump/pump.json',
        gltf: process.env.PUBLIC_URL + '/models/space/space.gltf'
    }
]

export default class Three extends Component {
    constructor(props) {
        super(props)
    
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);

        // Solves some issues
        this.THREE = THREE;
      }
    
      componentDidMount() {
        const scene = new this.THREE.Scene()
        const camera = new this.THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
        const renderer = new this.THREE.WebGLRenderer({ antialias: true })
        const loader = new GLTFLoader();
        const objLoader = new this.THREE.OBJLoader();
        const mtlLoader = new this.THREE.MTLLoader();
        this.clock = new this.THREE.Clock();
        const grid = new this.THREE.GridHelper( 20, 20, 0xffffff, 0xffffff );
        const pointLight = new this.THREE.PointLight( 0xffffff, 1 );

        window.addEventListener('resize', () => this.resizeHandler());

        loader.load(
            models[0].gltf,
            mesh => {
                let container = new this.THREE.Object3D();
                container.position.set(-4,0,8);
                container.add(mesh.scene);

                scene.add(container);

                this.mixer = new THREE.AnimationMixer(mesh.scene);
                this.mixer.clipAction(mesh.animations[0]).play();

                mtlLoader.load(
                    models[0].mtl,
                    materials => {
                        materials.preload();

                        objLoader.setMaterials(materials);
                        objLoader.load(
                            models[0].obj,
                            obj => {
                                
                                let container = new this.THREE.Object3D();
                                container.position.set(4,0,-4);
                                container.add(obj)
                                container.scale.set(.005,.005,.005);
                                scene.add( container );                                
                                
                                this.start();
                            },
                        );
                    }
                );
            }
        )

        camera.position.set( - 5.00, 3.43, 11.31 );
        camera.lookAt( new this.THREE.Vector3( - 1.22, 2.18, 4.58 ) );

        renderer.setClearColor('#0078ff')
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );

        grid.position.set( 0, - 1.1, 0 );

        scene.add( grid );
        scene.add( new this.THREE.AmbientLight( 0x404040 ) );
        
        pointLight.position.copy( camera.position );

        scene.add( pointLight );
    
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
    
        this.mount.appendChild(this.renderer.domElement)
      }
    
      componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
      }
    
      start() {
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.animate)
        }
      }
    
      stop() {
        cancelAnimationFrame(this.frameId)
      }
    
      animate() {
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
      }

      resizeHandler() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
      }
    
      renderScene() {
        this.renderer.render(this.scene, this.camera)
        this.mixer.update( this.clock.getDelta() );
      }
    
      render() {
        return (
          <div
            style={{ width: '100%', height: '100vh'}}
            ref={(mount) => { this.mount = mount }}
          />
        )
      }
}