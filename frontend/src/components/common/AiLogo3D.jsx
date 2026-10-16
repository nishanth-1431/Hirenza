import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * 3D Holographic AI Core Logo using Three.js
 * Features:
 * - Geometric dual-layer geodesic core (outer wireframe cage + inner pulsating orb)
 * - Orbital particle cloud with dynamic drift
 * - Mouse parallax and hover velocity acceleration
 * - High-DPI crisp rendering with clean GPU resource disposal
 */
const AiLogo3D = ({ size = 44, isHovered = false, isThinking = false }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const coreRef = useRef(null);
    const wireframeRef = useRef(null);
    const particlesRef = useRef(null);
    const ringsRef = useRef(null);
    const frameIdRef = useRef(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const width = size;
        const height = size;

        // 1. Scene & Camera
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 3.2;

        // 2. WebGL Renderer with Alpha & Antialiasing
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // 3. Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00f2fe, 3, 10);
        pointLight1.position.set(2, 3, 2);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x3aafa9, 2.5, 10);
        pointLight2.position.set(-2, -2, 2);
        scene.add(pointLight2);

        // 4. Central Solid Core
        const coreGeo = new THREE.IcosahedronGeometry(0.65, 2);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x062835,
            emissive: 0x0e4b56,
            emissiveIntensity: 0.6,
            roughness: 0.2,
            metalness: 0.85,
            flatShading: true
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);
        coreRef.current = core;

        // 5. Outer Wireframe Geodesic Cage
        const wireGeo = new THREE.IcosahedronGeometry(0.92, 1);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x00f2fe,
            wireframe: true,
            transparent: true,
            opacity: 0.75
        });
        const wireframe = new THREE.Mesh(wireGeo, wireMat);
        scene.add(wireframe);
        wireframeRef.current = wireframe;

        // 6. Orbital Energy Ring
        const ringGeo = new THREE.TorusGeometry(1.15, 0.02, 16, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x3aafa9,
            transparent: true,
            opacity: 0.55
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3;
        scene.add(ring);
        ringsRef.current = ring;

        // 7. Surrounding Particle Cloud
        const particleCount = 48;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const radius = 1.05 + Math.random() * 0.45;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[i * 3 + 2] = radius * Math.cos(phi);
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: 0x8ef5ea,
            size: 0.05,
            transparent: true,
            opacity: 0.85
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);
        particlesRef.current = particles;

        // 8. Animation Loop
        let clock = new THREE.Clock();
        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            const speedMultiplier = isHovered ? 2.4 : (isThinking ? 3.0 : 1.0);

            // Core harmonic breathing
            const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
            core.scale.set(scale, scale, scale);
            core.rotation.y = elapsedTime * 0.5 * speedMultiplier;
            core.rotation.x = elapsedTime * 0.3 * speedMultiplier;

            // Wireframe counter-rotation
            wireframe.rotation.y = -elapsedTime * 0.65 * speedMultiplier;
            wireframe.rotation.z = elapsedTime * 0.4 * speedMultiplier;

            // Ring rotation
            ring.rotation.z = elapsedTime * 0.8 * speedMultiplier;
            ring.rotation.y = Math.sin(elapsedTime) * 0.2;

            // Particle drift
            particles.rotation.y = elapsedTime * 0.35 * speedMultiplier;
            particles.rotation.x = elapsedTime * 0.2 * speedMultiplier;

            renderer.render(scene, camera);
            frameIdRef.current = requestAnimationFrame(animate);
        };

        animate();

        // 9. Cleanup
        return () => {
            if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
            coreGeo.dispose();
            coreMat.dispose();
            wireGeo.dispose();
            wireMat.dispose();
            ringGeo.dispose();
            ringMat.dispose();
            particleGeo.dispose();
            particleMat.dispose();
            renderer.dispose();
        };
    }, [size]);

    return (
        <div 
            ref={mountRef} 
            style={{ width: size, height: size }} 
            className="flex items-center justify-center pointer-events-none select-none"
        />
    );
};

export default AiLogo3D;
