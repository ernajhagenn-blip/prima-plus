"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { gameAudio } from "@/lib/gameAudio";

function makeCheckerTex(c1: string, c2: string, rep: number) {
  const cv = document.createElement("canvas");
  cv.width = 128; cv.height = 8;
  const x = cv.getContext("2d")!;
  for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 === 0 ? c1 : c2; x.fillRect(i * 8, 0, 8, 8); }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.set(rep, 1);
  return t;
}

function makeTextTex(text: string, bg: string, fg: string) {
  const cv = document.createElement("canvas");
  cv.width = 512; cv.height = 96;
  const x = cv.getContext("2d")!;
  x.fillStyle = bg; x.fillRect(0, 0, 512, 96);
  for (let i = 0; i < 32; i++) { x.fillStyle = i % 2 === 0 ? "#ffffff" : "#1c1f2b"; x.fillRect(i * 16, 0, 16, 14); x.fillRect(i * 16, 82, 16, 14); }
  x.font = "900 56px Arial Black, sans-serif";
  x.textAlign = "center"; x.textBaseline = "middle";
  x.fillStyle = fg; x.fillText(text, 256, 50);
  return new THREE.CanvasTexture(cv);
}

function buildKart(body: string, accent: string, suit: string): THREE.Group {
  const g = new THREE.Group();
  const mBody = new THREE.MeshStandardMaterial({ color: new THREE.Color(body), roughness: 0.4, metalness: 0.15 });
  const mAcc = new THREE.MeshStandardMaterial({ color: new THREE.Color(accent), roughness: 0.35, metalness: 0.2 });
  const mDark = new THREE.MeshStandardMaterial({ color: 0x14161f, roughness: 0.7 });
  const mSkin = new THREE.MeshStandardMaterial({ color: 0xf1c9a5, roughness: 0.6 });
  const chassis = new THREE.Mesh(new RoundedBoxGeometry(13, 7, 24, 3, 2.4), mBody);
  chassis.position.y = 8; g.add(chassis);
  const noseGeo = new THREE.CylinderGeometry(2.8, 4.4, 7, 18);
  noseGeo.rotateX(Math.PI / 2);
  const nose = new THREE.Mesh(noseGeo, mAcc);
  nose.position.set(0, 7.5, 14.5); g.add(nose);
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(16, 1.6, 5), mAcc);
  spoiler.position.set(0, 16, -11); g.add(spoiler);
  const sL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 5, 1.5), mDark);
  sL.position.set(-6, 12.5, -11); g.add(sL);
  const sR = sL.clone(); sR.position.x = 6; g.add(sR);
  const wGeo = new THREE.CylinderGeometry(4.6, 4.6, 5, 20);
  wGeo.rotateZ(Math.PI / 2);
  const wheels: THREE.Mesh[] = [];
  [[-10.5, 8], [10.5, 8], [-10.5, -9], [10.5, -9]].forEach(([wx, wz]) => {
    const w = new THREE.Mesh(wGeo, mDark);
    w.position.set(wx, 4.6, wz); g.add(w); wheels.push(w);
  });
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(4.6, 4.5, 6, 16), new THREE.MeshStandardMaterial({ color: new THREE.Color(suit), roughness: 0.5 }));
  torso.position.set(0, 14.5, -2); g.add(torso);
  const armGeo = new THREE.CapsuleGeometry(1.8, 7, 4, 8);
  const armL = new THREE.Mesh(armGeo, torso.material as THREE.Material);
  armL.position.set(-6.5, 13, 4); armL.rotation.z = 0.3; armL.rotation.x = -0.5; g.add(armL);
  const armR = new THREE.Mesh(armGeo, torso.material as THREE.Material);
  armR.position.set(6.5, 13, 4); armR.rotation.z = -0.3; armR.rotation.x = -0.5; g.add(armR);
  const handGeo = new THREE.SphereGeometry(2, 10, 8);
  const handL = new THREE.Mesh(handGeo, mSkin); handL.position.set(-8, 10.5, 8); g.add(handL);
  const handR = new THREE.Mesh(handGeo, mSkin); handR.position.set(8, 10.5, 8); g.add(handR);
  const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.6, 8, 24), new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.3, metalness: 0.5 }));
  steeringWheel.position.set(0, 11, 10); steeringWheel.rotation.x = -0.4; g.add(steeringWheel);
  const head = new THREE.Mesh(new THREE.SphereGeometry(6.4, 24, 18), mSkin);
  head.position.set(0, 23, -2); head.scale.set(1, 1.06, 1); g.add(head);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(7.4, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), new THREE.MeshStandardMaterial({ color: new THREE.Color(body), roughness: 0.35 }));
  helmet.position.set(0, 23.5, -2); g.add(helmet);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(8.5, 3.6, 2), new THREE.MeshStandardMaterial({ color: 0x1c1f2b, roughness: 0.2, metalness: 0.4 }));
  visor.position.set(0, 22.5, 3.6); g.add(visor);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(13, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.06; g.add(shadow);
  g.userData.wheels = wheels;
  return g;
}

function buildTree(big: boolean): THREE.Group {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2, 3, big ? 14 : 10, 8), new THREE.MeshStandardMaterial({ color: 0x6b4423, roughness: 0.9 }));
  trunk.position.y = (big ? 14 : 10) / 2; g.add(trunk);
  const leafM = new THREE.MeshStandardMaterial({ color: big ? 0x2e8b47 : 0x3aa35a, roughness: 0.85 });
  const f1 = new THREE.Mesh(new THREE.SphereGeometry(big ? 11 : 8, 12, 10), leafM);
  f1.position.y = big ? 20 : 15; g.add(f1);
  const f2 = new THREE.Mesh(new THREE.SphereGeometry(big ? 7 : 5.5, 10, 8), leafM);
  f2.position.set(-4, big ? 14 : 10.5, 2); g.add(f2);
  return g;
}

function buildTireStack(): THREE.Group {
  const g = new THREE.Group();
  for (let st = 0; st < 3; st++) {
    const tire = new THREE.Mesh(new THREE.TorusGeometry(5 - st * 0.4, 2.2 - st * 0.25, 10, 20), new THREE.MeshStandardMaterial({ color: st % 2 === 0 ? 0x23262f : 0x3a3f4d, roughness: 0.85 }));
    tire.rotation.x = Math.PI / 2;
    tire.position.y = 2.2 + st * 3.6;
    g.add(tire);
  }
  return g;
}

const CROWD_COLS = [0xffd34d, 0xef4444, 0x3b82f6, 0x22c55e, 0xec4899, 0xf8fafc, 0xf97316, 0x14b8a6];

function buildGrandstand(crowdOut: { m: THREE.Mesh; baseY: number; ph: number }[]): THREE.Group {
  const g = new THREE.Group();
  const structM = new THREE.MeshStandardMaterial({ color: 0x2a2e3d, roughness: 0.8 });
  for (let i = 0; i < 4; i++) {
    const tier = new THREE.Mesh(new THREE.BoxGeometry(52, 5, 9), structM);
    tier.position.set(0, 2.5 + i * 5.5, -i * 7);
    g.add(tier);
    for (let c = 0; c < 13; c++) {
      if ((c * 7 + i * 3) % 4 === 3) continue;
      const bodyCol = CROWD_COLS[Math.floor(Math.random() * CROWD_COLS.length)];
      const px = -22 + c * 3.7 + Math.random() * 1.2;
      const py = 7 + i * 5.5;
      const pz = -i * 7 + 1.2;
      const person = new THREE.Mesh(new THREE.CapsuleGeometry(1.05, 1.5, 4, 8), new THREE.MeshStandardMaterial({ color: bodyCol, roughness: 0.7 }));
      person.position.set(px, py, pz);
      g.add(person);
      crowdOut.push({ m: person, baseY: py, ph: Math.random() * Math.PI * 2 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 8, 8), new THREE.MeshStandardMaterial({ color: 0xf1c9a5, roughness: 0.7 }));
      head.position.set(px, py + 1.9, pz);
      g.add(head);
      crowdOut.push({ m: head, baseY: py + 1.9, ph: Math.random() * Math.PI * 2 });
    }
  }
  const roof = new THREE.Mesh(new THREE.BoxGeometry(58, 2, 30), new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.6 }));
  roof.position.set(0, 26.5, -11);
  g.add(roof);
  const roofFront = new THREE.Mesh(new THREE.BoxGeometry(58, 2.6, 2.2), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }));
  roofFront.position.set(0, 26.5, 4.5);
  g.add(roofFront);
  for (const sx of [-26, 0, 26]) {
    const support = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 24, 8), new THREE.MeshStandardMaterial({ color: 0xc8ccd8, roughness: 0.5 }));
    support.position.set(sx, 13.5, -22);
    g.add(support);
  }
  const back = new THREE.Mesh(new THREE.BoxGeometry(52, 24, 2), structM);
  back.position.set(0, 12, -24);
  g.add(back);
  return g;
}

function buildBalloon(color: number): THREE.Group {
  const g = new THREE.Group();
  const env = new THREE.Mesh(new THREE.SphereGeometry(9, 16, 14), new THREE.MeshStandardMaterial({ color, roughness: 0.5 }));
  env.scale.set(1, 1.18, 1); g.add(env);
  const stripe = new THREE.Mesh(new THREE.SphereGeometry(9.15, 16, 14, 0, Math.PI / 3), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }));
  stripe.scale.set(1, 1.18, 1); g.add(stripe);
  const basket = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.6, 3.4), new THREE.MeshStandardMaterial({ color: 0x8b5e34, roughness: 0.9 }));
  basket.position.y = -13.5; g.add(basket);
  return g;
}

function buildCloud(): THREE.Group {
  const g = new THREE.Group();
  const m = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
  const s1 = new THREE.Mesh(new THREE.SphereGeometry(7, 12, 10), m); s1.scale.set(1.4, 0.75, 1); g.add(s1);
  const s2 = new THREE.Mesh(new THREE.SphereGeometry(5, 12, 10), m); s2.position.set(7, 1.5, 1); s2.scale.set(1.3, 0.7, 1); g.add(s2);
  const s3 = new THREE.Mesh(new THREE.SphereGeometry(4.4, 12, 10), m); s3.position.set(-7, 1, -1); s3.scale.set(1.25, 0.68, 1); g.add(s3);
  return g;
}

export default function CinematicOpening() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const kick = () => {
      gameAudio.startMusic("chill");
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      gameAudio.stopMusic();
    };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x5db8ff);
    scene.fog = new THREE.Fog(0xbfe3ff, 220, 760);
    const camera = new THREE.PerspectiveCamera(58, mount.clientWidth / mount.clientHeight, 0.1, 1500);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xcfeaff, 0x3f7d52, 1.1));
    const sunL = new THREE.DirectionalLight(0xfff2d0, 1.7);
    sunL.position.set(90, 160, 60);
    scene.add(sunL);

    const grass = new THREE.Mesh(new THREE.CircleGeometry(700, 48), new THREE.MeshStandardMaterial({ color: 0x4dbd68, roughness: 1 }));
    grass.rotation.x = -Math.PI / 2; grass.position.y = -0.05;
    scene.add(grass);

    const ROADW = 64;
    const road = new THREE.Mesh(new THREE.PlaneGeometry(ROADW, 1000), new THREE.MeshStandardMaterial({ color: 0x414658, roughness: 0.9 }));
    road.rotation.x = -Math.PI / 2; road.position.set(0, 0.01, -440);
    scene.add(road);
    const curbMat = new THREE.MeshStandardMaterial({ map: makeCheckerTex("#e74c3c", "#f8f8f8", 110), roughness: 0.7 });
    const curbL = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 1000), curbMat);
    curbL.rotation.x = -Math.PI / 2; curbL.position.set(-ROADW / 2 - 2.2, 0.05, -440);
    scene.add(curbL);
    const curbR = curbL.clone(); curbR.position.x = ROADW / 2 + 2.2;
    scene.add(curbR);
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1000), new THREE.MeshBasicMaterial({ map: makeCheckerTex("#e8e8f0", "#414658", 90) }));
    dash.rotation.x = -Math.PI / 2; dash.position.set(0, 0.04, -440);
    scene.add(dash);
    const startLine = new THREE.Mesh(new THREE.PlaneGeometry(ROADW * 0.96, 9), new THREE.MeshBasicMaterial({ map: makeCheckerTex("#ffffff", "#1f2430", 12) }));
    startLine.rotation.x = -Math.PI / 2; startLine.position.set(0, 0.06, -46);
    scene.add(startLine);

    const arch = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(1.9, 1.9, 30, 12);
    const pillarM = new THREE.MeshStandardMaterial({ color: 0xc8ccd8, roughness: 0.5 });
    const halfSpan = ROADW / 2 + 10;
    const pilL = new THREE.Mesh(pillarGeo, pillarM); pilL.position.set(-halfSpan, 15, 0); arch.add(pilL);
    const pilR = new THREE.Mesh(pillarGeo, pillarM); pilR.position.set(halfSpan, 15, 0); arch.add(pilR);
    const bannerDark = new THREE.MeshStandardMaterial({ color: 0x1c1f2b, roughness: 0.6 });
    const bannerTex = new THREE.MeshStandardMaterial({ map: makeTextTex("PRIMA CIRCUIT", "#1c1f2b", "#FFD34D"), roughness: 0.6 });
    const banner = new THREE.Mesh(new THREE.BoxGeometry(ROADW + 36, 8, 2.5), [bannerDark, bannerDark, bannerDark, bannerDark, bannerTex, bannerTex]);
    banner.position.set(0, 29, 0); arch.add(banner);
    arch.position.set(0, 0, -52);
    scene.add(arch);

    const crowd: { m: THREE.Mesh; baseY: number; ph: number }[] = [];
    const standSpots: [number, number, number][] = [
      [-(ROADW / 2 + 36), 0, -150,],
      [-(ROADW / 2 + 36), 0, -320],
      [ROADW / 2 + 36, 0, -235],
      [ROADW / 2 + 36, 0, -405],
    ];
    standSpots.forEach(([sx, sy, sz], i) => {
      const stand = buildGrandstand(crowd);
      stand.position.set(sx, sy, sz);
      stand.rotation.y = sx < 0 ? Math.PI / 2 : -Math.PI / 2;
      stand.scale.setScalar(0.9);
      scene.add(stand);
      void i;
    });

    const kartCols: [string, string, string][] = [
      ["#ef4444", "#facc15", "#b91c1c"],
      ["#a855f7", "#f8fafc", "#7c3aed"],
      ["#0ea5e9", "#f8fafc", "#0369a1"],
    ];
    const lanes = [-13, 0, 13];
    const speeds = [62, 58, 55];
    const offs = [0, 130, 260];
    const karts: THREE.Group[] = [];
    kartCols.forEach((c, i) => {
      const k = buildKart(c[0], c[1], c[2]);
      k.scale.setScalar(0.58);
      scene.add(k); karts.push(k);
      void lanes[i]; void speeds[i]; void offs[i];
    });

    const trees: THREE.Group[] = [];
    for (let i = 0; i < 26; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const tr = buildTree(i % 3 === 0);
      tr.position.set(side * (55 + Math.random() * 90), 0, 30 - Math.random() * 620);
      tr.rotation.y = Math.random() * Math.PI * 2;
      scene.add(tr); trees.push(tr);
    }
    const tires: THREE.Group[] = [];
    for (let i = 0; i < 8; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const ts = buildTireStack();
      ts.position.set(side * (ROADW / 2 + 12 + (i % 3) * 6), 0, -20 - i * 70 - Math.random() * 30);
      scene.add(ts); tires.push(ts);
    }

    const flagCols = [0xef4444, 0xfacc15, 0x3b82f6, 0x22c55e, 0xec4899];
    const flags: { pole: THREE.Mesh; cloth: THREE.Mesh }[] = [];
    for (let i = 0; i < 6; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 26, 8), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }));
      pole.position.set(side * (ROADW / 2 + 9), 13, -10 - i * 85);
      scene.add(pole);
      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(9, 5.5), new THREE.MeshStandardMaterial({ color: flagCols[i % 5], roughness: 0.6, side: THREE.DoubleSide }));
      cloth.position.set(side * (ROADW / 2 + 9) + side * 4.8, 22, -10 - i * 85);
      scene.add(cloth);
      flags.push({ pole, cloth });
    }

    const balloons: THREE.Group[] = [];
    const balloonCols = [0xef4444, 0xa855f7, 0x0ea5e9, 0xf97316];
    for (let i = 0; i < 4; i++) {
      const b = buildBalloon(balloonCols[i]);
      b.position.set(-140 + i * 90, 55 + (i % 2) * 22, -160 - i * 110);
      b.scale.setScalar(1.5);
      scene.add(b); balloons.push(b);
    }

    const clouds: THREE.Group[] = [];
    for (let i = 0; i < 7; i++) {
      const cl = buildCloud();
      cl.position.set(-220 + Math.random() * 440, 62 + Math.random() * 45, -120 - Math.random() * 420);
      cl.scale.setScalar(1.6 + Math.random() * 1.4);
      scene.add(cl); clouds.push(cl);
    }

    const sun = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 16), new THREE.MeshBasicMaterial({ color: 0xffd34d }));
    sun.position.set(210, 150, -420);
    scene.add(sun);

    const confettiCols = [0xffd34d, 0xef4444, 0x22c55e, 0x3b82f6, 0xa855f7, 0xec4899];
    const confetti: { m: THREE.Mesh; vy: number; vr: number }[] = [];
    const cfGeo = new THREE.PlaneGeometry(2.2, 1.1);
    for (let i = 0; i < 90; i++) {
      const cf = new THREE.Mesh(cfGeo, new THREE.MeshBasicMaterial({ color: confettiCols[i % 6], side: THREE.DoubleSide }));
      cf.position.set((Math.random() - 0.5) * 170, Math.random() * 90, 30 - Math.random() * 240);
      cf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(cf);
      confetti.push({ m: cf, vy: 5 + Math.random() * 7, vr: 1 + Math.random() * 2.4 });
    }

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = (now - t0) / 1000;

      karts.forEach((k, i) => {
        const travel = 520;
        const z = 14 - ((t * speeds[i] + offs[i]) % travel);
        const hopWin = z > -95 && z < -45;
        const hop = hopWin ? Math.sin(((z + 95) / 50) * Math.PI) : 0;
        k.position.set(lanes[i] + Math.sin(t * 0.8 + i * 2.1) * 2.6, hop * 9, z);
        k.rotation.y = 0;
        k.rotation.z = Math.sin(t * 0.8 + i * 2.1) * 0.05;
        const wheels = k.userData.wheels as THREE.Mesh[] | undefined;
        if (wheels) wheels.forEach((w) => { w.rotation.x += speeds[i] * 0.02; });
        k.scale.setScalar(0.58 + hop * 0.04);
      });

      crowd.forEach((c) => {
        c.m.position.y = c.baseY + Math.abs(Math.sin(now * 0.0035 + c.ph)) * 0.8;
      });

      const intro = Math.min(1, t / 3.2);
      const ease = 1 - Math.pow(1 - intro, 3);
      const camBaseY = 23 - ease * 7;
      const camBaseZ = 74 - ease * 30;
      camera.position.set(Math.sin(t * 0.28) * 2.6, camBaseY + Math.sin(t * 0.5) * 0.7, camBaseZ);
      camera.lookAt(0, 5, -110);

      clouds.forEach((cl, i) => {
        cl.position.x += (0.9 + (i % 3) * 0.35) * 0.06;
        if (cl.position.x > 260) cl.position.x = -260;
      });
      balloons.forEach((b, i) => {
        b.position.y += Math.sin(now * 0.0006 + i * 1.8) * 0.03;
        b.rotation.y = Math.sin(now * 0.0004 + i) * 0.2;
      });
      flags.forEach((f, i) => {
        f.cloth.rotation.y = Math.sin(now * 0.003 + i) * 0.35;
      });
      confetti.forEach((cf) => {
        cf.m.position.y -= cf.vy * 0.016;
        cf.m.rotation.x += cf.vr * 0.016;
        cf.m.rotation.y += cf.vr * 0.012;
        if (cf.m.position.y < 0) {
          cf.m.position.y = 85 + Math.random() * 15;
          cf.m.position.x = (Math.random() - 0.5) * 170;
        }
      });

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    const readyTimer = setTimeout(() => setReady(true), 1700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(readyTimer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  const go = () => router.push("/intro");

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", background: "#5db8ff" }}>
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />

      <div style={{
        position: "absolute", top: "4%", left: 0, right: 0, textAlign: "center", zIndex: 10,
        animation: "titleFloat 3.4s ease-in-out infinite", pointerEvents: "none",
      }}>
        <div style={{ display: "inline-block", marginBottom: -2 }}>
          <div style={{ width: "min(56vw, 420px)", height: 10, borderRadius: 4, background: "repeating-conic-gradient(#1c1f2b 0% 25%, #ffffff 0% 50%) 0 0 / 12px 12px", border: "2px solid #1c1f2b", boxShadow: "0 3px 0 rgba(0,0,0,0.25)" }} />
        </div>
        <div style={{ position: "relative", display: "block", lineHeight: 1 }}>
          <h1 aria-hidden style={{
            fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(42px, 12vmin, 130px)", margin: 0, lineHeight: 1.05,
            position: "absolute", inset: 0, color: "#241505", WebkitTextStroke: "clamp(4px,1.2vmin,7px) #241505",
            textShadow: "0 5px 0 #8a6205, 0 10px 0 #6b4a04, 0 15px 0 #4d3503, 0 22px 34px rgba(20,10,0,0.55)",
          }}>
            PRIMA+
          </h1>
          <h1 style={{
            fontFamily: "'Righteous','Arial Black',sans-serif", fontSize: "clamp(42px, 12vmin, 130px)", margin: 0, lineHeight: 1.05,
            position: "relative", color: "transparent",
            background: "linear-gradient(180deg, #ffffff 0%, #fff3b8 30%, #ffd34d 55%, #ffb824 78%, #ff9d00 100%)",
            WebkitBackgroundClip: "text", backgroundClip: "text",
          }}>
            PRIMA+
          </h1>
        </div>
        <div style={{ display: "inline-block", marginTop: 8, background: "linear-gradient(180deg,#2a2e3d,#1c1f2b)", color: "#FFD34D", fontFamily: "'Righteous',sans-serif", fontSize: "clamp(10px,2vmin,15px)", letterSpacing: "0.3em", padding: "clamp(4px,1vmin,7px) clamp(16px,4vw,26px)", borderRadius: 999, border: "2px solid #FFD34D", boxShadow: "0 4px 0 rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.15)" }}>
          ✦ PRIMA CIRCUIT ✦
        </div>
      </div>

      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", zIndex: 10,
        opacity: ready ? 1 : 0, transform: ready ? "translateY(0) scale(1)" : "translateY(26px) scale(0.94)",
        transition: "opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)", padding: "0 14px",
      }}>
        <div style={{
          display: "inline-block", background: "rgba(22,16,48,0.72)", backdropFilter: "blur(10px)",
          borderRadius: 20, padding: "clamp(12px,3vw,20px) clamp(14px,4vw,34px) clamp(14px,3vw,22px)", border: "2px solid rgba(255,255,255,0.2)",
          boxShadow: "0 10px 0 rgba(12,8,32,0.4), 0 20px 40px rgba(10,8,30,0.35)", maxWidth: "92vw",
        }}>
          <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(14px, 3.2vmin, 24px)", color: "#ffffff", margin: "0 0 6px", fontStyle: "italic", textShadow: "0 2px 8px rgba(0,0,0,0.6)", lineHeight: 1.3 }}>
            Berakar pada Aksara, Setia pada Nusantara.
          </p>
          <p style={{ fontFamily: "'Righteous', sans-serif", fontSize: "clamp(15px, 3.6vmin, 28px)", color: "#FFD34D", margin: "0 0 18px", fontWeight: 700, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
            Bahasa Kita, Identitas Kita!
          </p>
          <button
            onClick={go}
            style={{
              padding: "clamp(12px,2.5vmin,18px) clamp(28px,8vw,60px)", borderRadius: 999, border: "3px solid rgba(255,255,255,0.9)",
              background: "linear-gradient(180deg, #a855f7 0%, #7c3aed 55%, #6d28d9 100%)",
              color: "white", fontFamily: "'Righteous', 'Arial Black', sans-serif",
              fontSize: "clamp(16px, 3.5vmin, 26px)", fontWeight: 900, letterSpacing: "0.06em",
              cursor: "pointer",
              boxShadow: "0 8px 0 #4c1d95, 0 16px 30px rgba(124,58,237,0.5), inset 0 2px 0 rgba(255,255,255,0.45)",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
            }}
            onPointerDown={(e) => { e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = "0 2px 0 #4c1d95, 0 6px 14px rgba(124,58,237,0.5)"; }}
            onPointerUp={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 0 #4c1d95, 0 16px 30px rgba(124,58,237,0.5), inset 0 2px 0 rgba(255,255,255,0.45)"; }}
          >
            MULAI PETUALANGAN ▶
          </button>
        </div>
      </div>

      {!ready && (
        <div style={{ position: "absolute", right: 22, bottom: 20, zIndex: 15 }}>
          <button
            onClick={go}
            style={{ background: "rgba(22,16,48,0.6)", border: "2px solid rgba(255,255,255,0.35)", borderRadius: 999, padding: "9px 22px", cursor: "pointer", fontFamily: "'Righteous', sans-serif", fontSize: 13, color: "#ffffff", letterSpacing: "0.2em", boxShadow: "0 4px 0 rgba(12,8,32,0.4)" }}
          >
            LEWATI ▸
          </button>
        </div>
      )}

      <div style={{
        position: "absolute", inset: 0, zIndex: 30, background: "#080a18", pointerEvents: "none",
        opacity: leaving ? 1 : 0, transition: "opacity 0.5s ease",
      }} />

      <style>{`
        @keyframes titleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
