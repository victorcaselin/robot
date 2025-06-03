import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useSimulador } from '../context/SimuladorContext';

/**
 * Componente para la visualización 3D del robot
 */
export const VisualizadorRobot: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { 
    articulaciones, 
    parametros,
    mostrarWorkspace,
    coordenadas
  } = useSimulador();
  
  // Refs para mantener las instancias de Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Refs para los elementos del robot
  const baseRef = useRef<THREE.Mesh | null>(null);
  const columnRef = useRef<THREE.Mesh | null>(null);
  const brazoRef = useRef<THREE.Mesh | null>(null);
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
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Configuración del renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 30;
    controlsRef.current = controls;
    
    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Rejilla y ejes para referencia
    const gridHelper = new THREE.GridHelper(20, 20, 0x555555, 0x888888);
    scene.add(gridHelper);
    
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    
    // Crear las partes iniciales del robot
    crearModeloRobot(scene);
    
    // Espacio de trabajo (invisible inicialmente)
    const workspaceGeometry = new THREE.SphereGeometry(parametros.longitudBrazo, 32, 32);
    const workspaceMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3498db, 
      transparent: true, 
      opacity: 0.2,
      wireframe: true
    });
    const workspace = new THREE.Mesh(workspaceGeometry, workspaceMaterial);
    workspace.position.y = parametros.longitudBase;
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
  
  // Función para crear el modelo del robot
  const crearModeloRobot = (scene: THREE.Scene) => {
    // Base del robot
    const baseGeometry = new THREE.CylinderGeometry(
      parametros.radioBase, 
      parametros.radioBase, 
      0.5, 
      32
    );
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.25;
    base.castShadow = true;
    base.receiveShadow = true;
    scene.add(base);
    baseRef.current = base;
    
    // Columna vertical
    const columnGeometry = new THREE.CylinderGeometry(0.5, 0.5, parametros.longitudBase, 32);
    const columnMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const column = new THREE.Mesh(columnGeometry, columnMaterial);
    column.position.y = parametros.longitudBase / 2 + 0.5;
    column.castShadow = true;
    column.receiveShadow = true;
    scene.add(column);
    columnRef.current = column;
    
    // Brazo extensible
    const brazoGeometry = new THREE.BoxGeometry(0.5, 0.5, 1);
    const brazoMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const brazo = new THREE.Mesh(brazoGeometry, brazoMaterial);
    brazo.position.y = parametros.longitudBase + 0.5;
    brazo.castShadow = true;
    brazo.receiveShadow = true;
    scene.add(brazo);
    brazoRef.current = brazo;
  };
  
  // Actualiza el modelo del robot cuando cambian las articulaciones
  useEffect(() => {
    if (!baseRef.current || !columnRef.current || !brazoRef.current) return;
    
    // Rotación de la base (theta)
    const theta = articulaciones[0].valorActual * Math.PI / 180;
    baseRef.current.rotation.y = theta;
    
    // Posición vertical (z)
    const z = articulaciones[1].valorActual;
    columnRef.current.scale.y = (parametros.longitudBase + z) / parametros.longitudBase;
    columnRef.current.position.y = (parametros.longitudBase + z) / 2;
    
    // Extensión del brazo (r)
    const r = articulaciones[2].valorActual;
    
    // Actualizar posición del brazo
    brazoRef.current.position.y = parametros.longitudBase + z;
    brazoRef.current.scale.z = r;
    brazoRef.current.position.z = r / 2;
    brazoRef.current.rotation.y = theta;
    
  }, [articulaciones, parametros]);
  
  // Actualiza la visualización del espacio de trabajo
  useEffect(() => {
    if (!workspaceRef.current) return;
    
    workspaceRef.current.visible = mostrarWorkspace;
    workspaceRef.current.position.y = parametros.longitudBase;
    (workspaceRef.current.geometry as THREE.SphereGeometry).dispose();
    workspaceRef.current.geometry = new THREE.SphereGeometry(parametros.longitudBrazo, 32, 16);
    
  }, [mostrarWorkspace, parametros]);
  
  // Actualización del tamaño del canvas cuando cambia el tamaño de la ventana
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