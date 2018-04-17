import React, { Component } from 'react';
import * as THREE from 'three';

const models = [
    {
        json: process.env.PUBLIC_URL + '/models/pump/pump.json',
    }
]

export default class Three extends Component {
    constructor(props) {
        super(props)
    
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
      }
    
      componentDidMount() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        const loader = new THREE.ObjectLoader();
        this.clock = new THREE.Clock();
        const grid = new THREE.GridHelper( 20, 20, 0x888888, 0x888888 );
        const pointLight = new THREE.PointLight( 0xffffff, 1 );

        window.addEventListener('resize', () => this.resizeHandler());
        
        loader.load(
            models[0].json,
            obj => {
                
                let container = new THREE.Object3D();
                container.add(obj)
                container.scale.set(.5,.5,.5);
                scene.add( container );

                this.mixer = new THREE.AnimationMixer( obj );
                this.mixer.clipAction( obj.animations[ 0 ] ).play();
                
                this.start();
            },
        );

        camera.position.set( - 5.00, 3.43, 11.31 );
        camera.lookAt( new THREE.Vector3( - 1.22, 2.18, 4.58 ) );

        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );

        grid.position.set( 0, - 1.1, 0 );

        scene.add( grid );
        scene.add( new THREE.AmbientLight( 0x404040 ) );
        
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