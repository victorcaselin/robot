import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useSimulador } from '../context/SimuladorContext';

/**
 * Componente para la visualización 3D del robot cilíndrico
 */
export const VisualizadorRobot: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { 
    articulaciones, 
    parametros,
    mostrarWorkspace,
  } = useSimulador();
  
  // Referencias para mantener las instancias de Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Referencias para los grupos y elementos del robot
  const robotRef = useRef<THREE.Group | null>(null);
  const baseGiratoriaRef = useRef<THREE.Group | null>(null);
  const ejeVerticalRef = useRef<THREE.Group | null>(null);
  const brazoExtensibleRef = useRef<THREE.Group | null>(null);
  const workspaceRef = useRef<THREE.Mesh | null>(null);
  
  // Inicialización de Three.js
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Configuración de la escena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Configuración de la cámara
    const camera = new THREE.PerspectiveCamera(
      60, 
      canvasRef.current.clientWidth / canvasRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Configuración del renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controlsRef.current = controls;
    
    // Iluminación
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);
    
    // Plano del suelo
    const planoGeometria = new THREE.PlaneGeometry(10, 10);
    const planoMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.2
    });
    const plano = new THREE.Mesh(planoGeometria, planoMaterial);
    plano.rotation.x = -Math.PI / 2;
    plano.receiveShadow = true;
    scene.add(plano);
    
    // Rejilla y ejes para referencia
    const gridHelper = new THREE.GridHelper(10, 10, 0x555555, 0x888888);
    scene.add(gridHelper);
    
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
    
    // Crear el modelo del robot
    crearModeloRobot(scene);
    
    // Espacio de trabajo (invisible inicialmente)
    const workspaceGeometry = new THREE.CylinderGeometry(
      parametros.longitudBrazo,
      parametros.longitudBrazo,
      parametros.alturaMaxima - parametros.longitudBase,
      32,
      1,
      true
    );
    const workspaceMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3498db, 
      transparent: true, 
      opacity: 0.15,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const workspace = new THREE.Mesh(workspaceGeometry, workspaceMaterial);
    workspace.position.y = (parametros.alturaMaxima - parametros.longitudBase) / 2 + parametros.longitudBase;
    workspace.visible = false;
    scene.add(workspace);
    workspaceRef.current = workspace;
    
    // Función de animación
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.render(scene, cameraRef.current);
      }
    };
    animate();
    
    // Cleanup
    return () => {
      if (rendererRef.current && canvasRef.current) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);
  
  /**
   * Crea el modelo 3D del robot cilíndrico
   */
  const crearModeloRobot = (scene: THREE.Scene) => {
    // Grupo principal del robot
    const robotGrupo = new THREE.Group();
    robotRef.current = robotGrupo;
    scene.add(robotGrupo);
    
    // Base fija
    const baseGeometria = new THREE.CylinderGeometry(
      parametros.radioBase * 1.2,
      parametros.radioBase * 1.4,
      0.1,
      32
    );
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c3e50,
      roughness: 0.7,
      metalness: 0.3
    });
    const baseFija = new THREE.Mesh(baseGeometria, baseMaterial);
    baseFija.position.y = 0.05;
    baseFija.castShadow = true;
    baseFija.receiveShadow = true;
    robotGrupo.add(baseFija);
    
    // Base giratoria
    const baseGiratoriaGrupo = new THREE.Group();
    robotGrupo.add(baseGiratoriaGrupo);
    baseGiratoriaRef.current = baseGiratoriaGrupo;
    
    const baseGiratoriaGeometria = new THREE.CylinderGeometry(
      parametros.radioBase,
      parametros.radioBase,
      0.2,
      32
    );
    const baseGiratoriaMaterial = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.5,
      metalness: 0.5
    });
    const baseGiratoriaCilindro = new THREE.Mesh(
      baseGiratoriaGeometria,
      baseGiratoriaMaterial
    );
    baseGiratoriaCilindro.position.y = 0.2;
    baseGiratoriaCilindro.castShadow = true;
    baseGiratoriaCilindro.receiveShadow = true;
    baseGiratoriaGrupo.add(baseGiratoriaCilindro);
    
    // Eje vertical (columna)
    const ejeVerticalGrupo = new THREE.Group();
    ejeVerticalGrupo.position.y = 0.3;
    baseGiratoriaGrupo.add(ejeVerticalGrupo);
    ejeVerticalRef.current = ejeVerticalGrupo;
    
    const columnaGeometria = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const columnaMaterial = new THREE.MeshStandardMaterial({
      color: 0x95a5a6,
      roughness: 0.4,
      metalness: 0.6
    });
    const columna = new THREE.Mesh(columnaGeometria, columnaMaterial);
    columna.position.y = 0.5;
    columna.castShadow = true;
    columna.receiveShadow = true;
    ejeVerticalGrupo.add(columna);
    
    // Brazo extensible
    const brazoGrupo = new THREE.Group();
    brazoGrupo.position.y = 1;
    ejeVerticalGrupo.add(brazoGrupo);
    brazoExtensibleRef.current = brazoGrupo;
    
    // Articulación del brazo
    const articulacionGeometria = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const articulacionMaterial = new THREE.MeshStandardMaterial({
      color: 0xe74c3c,
      roughness: 0.5,
      metalness: 0.5
    });
    const articulacion = new THREE.Mesh(articulacionGeometria, articulacionMaterial);
    articulacion.castShadow = true;
    articulacion.receiveShadow = true;
    brazoGrupo.add(articulacion);
    
    // Brazo extensible
    const brazoGeometria = new THREE.BoxGeometry(0.1, 0.1, 1);
    const brazoMaterial = new THREE.MeshStandardMaterial({
      color: 0x3498db,
      roughness: 0.4,
      metalness: 0.6
    });
    const brazo = new THREE.Mesh(brazoGeometria, brazoMaterial);
    brazo.position.z = 0.5;
    brazo.castShadow = true;
    brazo.receiveShadow = true;
    brazoGrupo.add(brazo);
    
    // Efector final
    const efectorGeometria = new THREE.SphereGeometry(0.05, 16, 16);
    const efectorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1c40f,
      roughness: 0.3,
      metalness: 0.7
    });
    const efector = new THREE.Mesh(efectorGeometria, efectorMaterial);
    efector.position.z = 1;
    efector.castShadow = true;
    efector.receiveShadow = true;
    brazoGrupo.add(efector);
  };
  
  // Actualiza el modelo del robot cuando cambian las articulaciones
  useEffect(() => {
    if (!baseGiratoriaRef.current || !ejeVerticalRef.current || !brazoExtensibleRef.current) return;
    
    // Rotación de la base (theta)
    const theta = articulaciones[0].valorActual * Math.PI / 180;
    baseGiratoriaRef.current.rotation.y = theta;
    
    // Elevación vertical (z)
    const z = articulaciones[1].valorActual;
    if (ejeVerticalRef.current) {
      const alturaColumna = z;
      ejeVerticalRef.current.children[0].scale.y = alturaColumna;
      ejeVerticalRef.current.children[0].position.y = alturaColumna / 2;
      
      if (brazoExtensibleRef.current) {
        brazoExtensibleRef.current.position.y = alturaColumna;
      }
    }
    
    // Extensión del brazo (r)
    const r = articulaciones[2].valorActual;
    if (brazoExtensibleRef.current) {
      brazoExtensibleRef.current.children[1].scale.z = r;
      brazoExtensibleRef.current.children[1].position.z = r / 2;
      brazoExtensibleRef.current.children[2].position.z = r;
    }
  }, [articulaciones]);
  
  // Actualiza la visualización del espacio de trabajo
  useEffect(() => {
    if (!workspaceRef.current) return;
    
    workspaceRef.current.visible = mostrarWorkspace;
    const newGeometry = new THREE.CylinderGeometry(
      parametros.longitudBrazo,
      parametros.longitudBrazo,
      parametros.alturaMaxima - parametros.longitudBase,
      32,
      1,
      true
    );
    workspaceRef.current.geometry.dispose();
    workspaceRef.current.geometry = newGeometry;
    workspaceRef.current.position.y = (parametros.alturaMaxima - parametros.longitudBase) / 2 + parametros.longitudBase;
    
  }, [mostrarWorkspace, parametros]);
  
  // Actualización del tamaño del canvas
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div ref={canvasRef} className="w-full h-full" />
  );
};