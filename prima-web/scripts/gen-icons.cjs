const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

function crc32(buf) {
  let c, t = [];
  for (let n = 0; n < 256; n++) { c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = (t[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)) >>> 0;
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, c]);
}
function makePng(size) {
  const w = size, h = size;
  const px = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const tr = y / h;
    px[i] = Math.round(0x7c * (1 - tr) + 0x0b * tr);
    px[i+1] = Math.round(0x3a * (1 - tr) + 0x0d * tr);
    px[i+2] = Math.round(0xed * (1 - tr) + 0x22 * tr);
    px[i+3] = 255;
  }
  const cx = w/2, cy = h/2;
  const stroke = Math.max(2, Math.round(size*0.09));
  const ph = size*0.5, pw = ph*0.55;
  const bx0 = Math.round(cx - pw*0.7), bx1 = bx0 + stroke;
  const by0 = Math.round(cy - ph/2), by1 = Math.round(cy + ph/2);
  const cbx0 = bx1, cbx1 = Math.round(bx0 + pw*1.05);
  const cby0 = by0, cby1 = Math.round(by0 + ph*0.5);
  const setRect = (x0,y0,x1,y1) => {
    for (let y=y0;y<y1;y++) for (let x=x0;x<x1;x++) {
      if (x<0||x>=w||y<0||y>=h) continue;
      const i=(y*w+x)*4; px[i]=0xFF; px[i+1]=0xD3; px[i+2]=0x4D; px[i+3]=255;
    }
  };
  setRect(bx0,by0,bx1,by1);
  setRect(bx0,by0,cbx1,by0+stroke);
  setRect(bx0,cby1-stroke,cbx1,cby1);
  setRect(cbx1-stroke,cby0,cbx1,cby1);
  const ps=size*0.35, ppt=Math.max(2,Math.round(size*0.07));
  const px0=Math.round(cx+pw*0.45), py0=Math.round(cy-ps/2);
  setRect(px0,py0+ps/2-ppt/2,px0+ps,py0+ps/2+ppt/2);
  setRect(px0+ps/2-ppt/2,py0,px0+ps/2+ppt/2,py0+ps);
  const raw = Buffer.alloc(h*(1+w*4));
  for (let y=0;y<h;y++){ raw[y*(1+w*4)]=0; for(let x=0;x<w*4;x++) raw[y*(1+w*4)+1+x]=px[y*w*4+x]; }
  const idat = zlib.deflateSync(raw);
  const sig = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w,0); ihdr.writeUInt32BE(h,4); ihdr[8]=8; ihdr[9]=6;
  return Buffer.concat([sig, chunk("IHDR",ihdr), chunk("IDAT",idat), chunk("IEND",Buffer.alloc(0))]);
}
const out = path.join(__dirname, "..", "public");
fs.writeFileSync(path.join(out,"icon-192.png"), makePng(192));
fs.writeFileSync(path.join(out,"icon-512.png"), makePng(512));
fs.writeFileSync(path.join(out,"apple-touch-icon.png"), makePng(180));
fs.writeFileSync(path.join(out,"favicon-32.png"), makePng(32));
console.log("icons written");
