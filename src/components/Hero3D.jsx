// Hero3D — Monsoon Mitra's first-load 3D signature: a monsoon cloud letting
// rain fall on a green field with crop sprouts.
// Three.js r160 UMD via jsDelivr, loaded on demand. Auto-starts on mount;
// if the CDN is unreachable this renders nothing and the page is unchanged.
// Drag to spin. Pauses on prefers-reduced-motion or a hidden tab.
import { useEffect, useRef } from 'react';

const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';

function loadThree() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.THREE) return Promise.resolve(window.THREE);
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = THREE_CDN;
    s.onload = () => resolve(window.THREE || null);
    s.onerror = () => resolve(null); // guarded no-op
    document.head.appendChild(s);
  });
}

function buildScene(THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 2, 0.1, 100);
  camera.position.set(0, 3.4, 9.5);
  camera.lookAt(0, 1.4, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.95));
  const sun = new THREE.DirectionalLight(0xfff8e1, 1.1);
  sun.position.set(5, 8, 6);
  scene.add(sun);

  const rig = new THREE.Group();
  scene.add(rig);

  // Monsoon cloud — clustered puffs
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xe8eef2, roughness: 1, transparent: true, opacity: 0.95 });
  const cloudMatDark = new THREE.MeshStandardMaterial({ color: 0x9fb3c0, roughness: 1, transparent: true, opacity: 0.95 });
  const cloud = new THREE.Group();
  [
    [0, 3.6, 0, 1.5, cloudMat], [-1.4, 3.3, 0.2, 1.1, cloudMatDark],
    [1.4, 3.3, -0.1, 1.15, cloudMat], [-0.7, 4.1, -0.2, 1.0, cloudMat],
    [0.8, 4.05, 0.1, 1.05, cloudMatDark], [0, 3.5, -0.5, 1.2, cloudMat],
  ].forEach(([x, y, z, r, m]) => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), m);
    puff.position.set(x, y, z);
    puff.scale.y = 0.72;
    cloud.add(puff);
  });
  rig.add(cloud);

  // Rain streaks falling from the cloud
  const rainCount = 240;
  const rainPos = new Float32Array(rainCount * 3);
  const rainSpeed = new Float32Array(rainCount);
  for (let i = 0; i < rainCount; i++) {
    rainPos[i * 3] = -3 + Math.random() * 6;
    rainPos[i * 3 + 1] = -0.4 + Math.random() * 3.6;
    rainPos[i * 3 + 2] = -1.2 + Math.random() * 2.4;
    rainSpeed[i] = 0.05 + Math.random() * 0.06;
  }
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rain = new THREE.Points(rainGeo, new THREE.PointsMaterial({ color: 0xbbdefb, size: 0.09, transparent: true, opacity: 0.9 }));
  rig.add(rain);

  // Green field
  const field = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.4, 0.35, 40),
    new THREE.MeshStandardMaterial({ color: 0x33691e, roughness: 1 })
  );
  field.position.y = -0.6;
  rig.add(field);
  const fieldTop = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 40),
    new THREE.MeshStandardMaterial({ color: 0x558b2f, roughness: 1 })
  );
  fieldTop.rotation.x = -Math.PI / 2;
  fieldTop.position.y = -0.42;
  rig.add(fieldTop);

  // Crop rows — sprouts in three lines
  const sprouts = [];
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x1b5e20, roughness: 0.7 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x7cb342, roughness: 0.6 });
  for (let row = -1; row <= 1; row++) {
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group();
      g.position.set(-2.1 + i * 1.4, -0.42, row * 1.1);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.8, 8), stemMat);
      stem.position.y = 0.4;
      g.add(stem);
      [-0.55, 0.55].forEach((tilt) => {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.6, 8), leafMat);
        leaf.position.set(tilt * 0.28, 0.85, 0);
        leaf.rotation.z = -tilt * 0.9;
        g.add(leaf);
      });
      g.userData.phase = row * 1.3 + i * 0.7;
      rig.add(g);
      sprouts.push(g);
    }
  }

  // A small sun peeking beside the cloud
  const sunBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xffd54f })
  );
  sunBall.position.set(3.6, 4.6, -1.5);
  rig.add(sunBall);

  function tick(t) {
    cloud.position.x = Math.sin(t * 0.4) * 0.35;
    cloud.position.y = Math.sin(t * 0.6) * 0.08;
    const pos = rain.geometry.attributes.position;
    for (let i = 0; i < rainCount; i++) {
      let y = pos.getY(i) - rainSpeed[i];
      if (y < -0.4) y = 3.2;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    sprouts.forEach((s) => { s.rotation.z = Math.sin(t * 1.2 + s.userData.phase) * 0.07; });
    sunBall.position.y = 4.6 + Math.sin(t * 0.5) * 0.1;
  }
  return { scene, camera, rig, tick };
}

export default function Hero3D({ className = '', style, label = '3D monsoon cloud over a green field — drag to spin' }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let raf = null;
    let renderer = null;
    let disposeFns = [];
    let clock = null;

    loadThree().then((THREE) => {
      if (cancelled || !THREE || !canvasRef.current || !wrapRef.current) return;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
      } catch (e) { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const { scene, camera, rig, tick } = buildScene(THREE);
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      clock = new THREE.Clock();

      let targetRotY = 0, rotY = 0, dragging = false, lastX = 0, lastY = 0, tiltX = 0, targetTilt = 0;
      const onDown = (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); };
      const onMove = (e) => {
        if (!dragging) return;
        targetRotY += (e.clientX - lastX) * 0.008;
        targetTilt = Math.max(-0.2, Math.min(0.3, targetTilt + (e.clientY - lastY) * 0.004));
        lastX = e.clientX; lastY = e.clientY;
      };
      const onUp = () => { dragging = false; };
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointermove', onMove);
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => canvas.addEventListener(ev, onUp));

      const resize = () => {
        const w = wrap.clientWidth, h = wrap.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
      if (ro) ro.observe(wrap);
      window.addEventListener('resize', resize);

      const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const frame = () => {
        raf = null;
        const t = clock.getElapsedTime();
        if (!reduced()) {
          rotY += (targetRotY - rotY) * 0.06;
          tiltX += (targetTilt - tiltX) * 0.06;
          rig.rotation.y = rotY + Math.sin(t * 0.1) * 0.05;
          rig.rotation.x = tiltX;
          tick(t);
          renderer.render(scene, camera);
          if (!document.hidden) raf = requestAnimationFrame(frame);
        } else {
          renderer.render(scene, camera); // one static frame
        }
      };
      const kick = () => { if (raf === null && !document.hidden) raf = requestAnimationFrame(frame); };
      const onVis = () => { if (!document.hidden) { clock.getDelta(); kick(); } };
      document.addEventListener('visibilitychange', onVis);
      kick();
      if (reduced()) renderer.render(scene, camera);

      disposeFns = [
        () => { if (raf !== null) cancelAnimationFrame(raf); },
        () => canvas.removeEventListener('pointerdown', onDown),
        () => canvas.removeEventListener('pointermove', onMove),
        () => ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => canvas.removeEventListener(ev, onUp)),
        () => { if (ro) ro.disconnect(); },
        () => window.removeEventListener('resize', resize),
        () => document.removeEventListener('visibilitychange', onVis),
        () => { try { renderer.dispose(); } catch (e) {} },
      ];
    });

    return () => {
      cancelled = true;
      disposeFns.forEach((fn) => { try { fn(); } catch (e) {} });
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} style={style} aria-hidden="true">
      <canvas ref={canvasRef} aria-label={label} style={{ display: 'block', width: '100%', height: '100%', touchAction: 'pan-y', cursor: 'grab' }} />
    </div>
  );
}
