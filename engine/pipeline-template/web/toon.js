export const INK = "#241726";
export const SKIN = "#ffe2c2";
const WHITE = "#ffffff";
const MOUTH = "#5a1e28";
const TONGUE = "#e86e78";
const SH_SKIN = [
    0.96,
    0.86,
    0.84
];
const SH_CLOTH = [
    0.64,
    0.66,
    0.74
];
const SH_FELT = [
    0.62,
    0.62,
    0.7
];
const rad = (d)=>d * Math.PI / 180;
const clamp = (x, a, b)=>Math.max(a, Math.min(b, x));
export const mul = (c, m)=>{
    const n = parseInt(c.slice(1), 16);
    const ch = (v, k)=>Math.min(255, Math.round(v * k)).toString(16).padStart(2, "0");
    return `#${ch(n >> 16 & 255, m[0])}${ch(n >> 8 & 255, m[1])}${ch(n & 255, m[2])}`;
};
export const shade = (c, k)=>mul(c, [
        k,
        k,
        k
    ]);
export const mix = (a, b, t)=>{
    const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
    const ch = (s)=>Math.round((A >> s & 255) * (1 - t) + (B >> s & 255) * t).toString(16).padStart(2, "0");
    return `#${ch(16)}${ch(8)}${ch(0)}`;
};
const rnd = (seed, k)=>{
    const x = Math.sin(seed * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
};
const rotPts = (pts, a, cx, cy)=>pts.map(([x, y])=>[
            cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a),
            cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)
        ]);
const rotAbout = (q, a, c)=>rotPts([
        q
    ], a, c[0], c[1])[0];
const lerp2 = (a, b, t)=>[
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t
    ];
const curve = (a, k, b, n = 10)=>{
    const c = [
        2 * k[0] - (a[0] + b[0]) / 2,
        2 * k[1] - (a[1] + b[1]) / 2
    ], out = [];
    for(let i = 0; i <= n; i++){
        const t = i / n, s = 1 - t;
        out.push([
            s * s * a[0] + 2 * s * t * c[0] + t * t * b[0],
            s * s * a[1] + 2 * s * t * c[1] + t * t * b[1]
        ]);
    }
    return out;
};
export const RIFLEMAN = {
    jacket: "#357650",
    pants: "#3d4440",
    boots: INK,
    hat: "shako",
    belt: "#f1efe6",
    buttons: "#d9dde0",
    rifle: true
};
export const OFFICER = {
    ...RIFLEMAN,
    hat: "shako_tall",
    buttons: "#e8c45a",
    sash: "#c0353a",
    sword: true,
    moustache: "#4a3020",
    rifle: false,
    belt: null,
    build: "stout"
};
export const KID = {
    jacket: "#f08a2c",
    pants: "#3b5b9a",
    boots: "#f4f1ea",
    hat: "cap",
    cap: "#e2453c",
    build: "kid"
};
export const PARENT = {
    jacket: "#7b5ac9",
    pants: "#3b3f52",
    boots: "#5a3b2a",
    hat: "hair",
    hair: "#5a3b2a"
};
export const SKINS = [
    SKIN,
    "#f5c9a0",
    "#ecd0b6",
    "#c99067"
];
export const soldier = (v = 0, extra = {})=>{
    const o = {
        ...RIFLEMAN,
        skin: SKINS[v % 4]
    };
    if (v % 4 === 1) o.moustache = "#4a3426";
    if (v % 4 === 3) o.moustache = "#2a201a";
    return {
        ...o,
        ...extra
    };
};
export const townsfolk = (v = 0)=>{
    const coats = [
        "#3f6fb5",
        "#8c3b4a",
        "#5d7a3a",
        "#b5653f",
        "#2f5f6a",
        "#7b5ac9"
    ];
    const o = {
        jacket: coats[v % 6],
        pants: "#3b3f52",
        boots: "#4a3426",
        skin: SKINS[v % 4]
    };
    return v % 2 ? {
        ...o,
        hat: "bonnet",
        dress: [
            "#d9a441",
            "#c25a7a",
            "#5a8fc2"
        ][v % 3]
    } : {
        ...o,
        hat: "tophat"
    };
};
export class Pen {
    g;
    ol = 12;
    rot = null;
    constructor(g){
        this.g = g;
    }
    P(x, y) {
        if (!this.rot) return [
            x,
            y
        ];
        const r = this.rot, a = r[0], cx = r[1], cy = r[2], dx = r.length > 3 ? r[3] : 0, dy = r.length > 4 ? r[4] : 0, c = Math.cos(a), s = Math.sin(a);
        return [
            cx + (x - cx) * c - (y - cy) * s + dx,
            cy + (x - cx) * s + (y - cy) * c + dy
        ];
    }
    path(pts, close) {
        const g = this.g;
        g.beginPath();
        pts.forEach((p, i)=>{
            const [x, y] = this.P(p[0], p[1]);
            if (i) g.lineTo(x, y);
            else g.moveTo(x, y);
        });
        if (close) g.closePath();
    }
    poly(pts, fill, ol) {
        const g = this.g, w = ol ?? this.ol;
        this.path(pts, true);
        if (fill) {
            g.fillStyle = fill;
            g.fill();
        }
        if (w) {
            g.lineWidth = w;
            g.strokeStyle = INK;
            g.lineJoin = "round";
            g.stroke();
        }
    }
    ell(cx, cy, rx, ry, fill, ol, a0 = 0, a1 = 360, rot = 0) {
        this.poly(ellPts(cx, cy, rx, ry, a0, a1, rot), fill, ol);
    }
    line(pts, fill, w, ink = true) {
        const g = this.g;
        g.lineCap = "round";
        g.lineJoin = "round";
        if (ink) {
            this.path(pts, false);
            g.strokeStyle = INK;
            g.lineWidth = w + 2 * this.ol * 0.9;
            g.stroke();
        }
        this.path(pts, false);
        g.strokeStyle = fill;
        g.lineWidth = w;
        g.stroke();
    }
    stroke(pts, w, fill = INK) {
        const g = this.g;
        g.lineCap = "round";
        g.lineJoin = "round";
        this.path(pts, false);
        g.strokeStyle = fill;
        g.lineWidth = w;
        g.stroke();
    }
    arc(cx, cy, rx, ry, a0, a1, w, fill = INK) {
        const pts = [];
        for(let i = 0; i <= 24; i++)pts.push([
            cx + rx * Math.cos(rad(a0 + (a1 - a0) * i / 24)),
            cy + ry * Math.sin(rad(a0 + (a1 - a0) * i / 24))
        ]);
        this.stroke(pts, w, fill);
    }
    dot(cx, cy, r, fill = INK) {
        const [x, y] = this.P(cx, cy);
        this.g.beginPath();
        this.g.arc(x, y, r, 0, Math.PI * 2);
        this.g.fillStyle = fill;
        this.g.fill();
    }
    clip(pts, fn) {
        const g = this.g;
        g.save();
        this.path(pts, true);
        g.clip();
        fn();
        g.restore();
    }
    shadedFill(pts, base, shadow, light, R, shift = 0.45, r0 = 1.05, r1 = 1.25) {
        const g = this.g, n = pts.length;
        let cx = 0, cy = 0;
        for (const [x, y] of pts){
            cx += x / n;
            cy += y / n;
        }
        const [gx, gy] = this.P(cx + Math.cos(light) * shift * R, cy + Math.sin(light) * shift * R);
        const gr = g.createRadialGradient(gx, gy, 0, gx, gy, r1 * R);
        gr.addColorStop(0, base);
        gr.addColorStop(r0 / r1, base);
        gr.addColorStop(1, shadow);
        this.path(pts, true);
        g.fillStyle = gr;
        g.fill();
    }
    gradFill(pts, base, shadow, light, flat = 0.22) {
        const g = this.g, dx = Math.cos(light), dy = Math.sin(light), n = pts.length;
        let cx = 0, cy = 0, lo = Infinity, hi = -Infinity;
        for (const [x, y] of pts){
            cx += x / n;
            cy += y / n;
            const d = x * dx + y * dy;
            lo = Math.min(lo, d);
            hi = Math.max(hi, d);
        }
        const dc = cx * dx + cy * dy;
        const [ax, ay] = this.P(cx + dx * (hi - dc), cy + dy * (hi - dc)), [bx, by] = this.P(cx + dx * (lo - dc), cy + dy * (lo - dc));
        const gr = g.createLinearGradient(ax, ay, bx, by);
        gr.addColorStop(0, base);
        gr.addColorStop(flat, base);
        gr.addColorStop(1, shadow);
        this.path(pts, true);
        g.fillStyle = gr;
        g.fill();
    }
    inkRing(pts, w0, thick, k = 0.45, col = INK) {
        const n = pts.length;
        let cx = 0, cy = 0;
        for (const [x, y] of pts){
            cx += x / n;
            cy += y / n;
        }
        const out = [], inn = [];
        pts.forEach((q, i)=>{
            const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
            let nx = b[1] - a[1], ny = a[0] - b[0];
            const l = Math.hypot(nx, ny) || 1;
            nx /= l;
            ny /= l;
            const h = 0.5 * w0 * (1 + k * Math.cos(Math.atan2(q[1] - cy, q[0] - cx) - thick));
            out.push([
                q[0] + nx * h,
                q[1] + ny * h
            ]);
            inn.push([
                q[0] - nx * h,
                q[1] - ny * h
            ]);
        });
        const g = this.g;
        const trace = (r)=>{
            r.forEach(([x0, y0], i)=>{
                const [x, y] = this.P(x0, y0);
                if (i) g.lineTo(x, y);
                else g.moveTo(x, y);
            });
            g.closePath();
        };
        g.beginPath();
        trace(out);
        trace(inn.reverse());
        g.fillStyle = col;
        g.fill("evenodd");
    }
    band(pts, fill, w, rim, cap = "butt") {
        const g = this.g;
        g.lineCap = cap;
        g.lineJoin = "round";
        this.path(pts, false);
        g.strokeStyle = INK;
        g.lineWidth = w + 2 * rim;
        g.stroke();
        this.path(pts, false);
        g.strokeStyle = fill;
        g.lineWidth = w;
        g.stroke();
        g.lineCap = "round";
    }
}
const ellPts = (cx, cy, rx, ry, a0 = 0, a1 = 360, rot = 0, n = 48)=>{
    const r = rad(rot), pts = [];
    for(let i = 0; i <= n; i++){
        const a = rad(a0 + (a1 - a0) * i / n), x = rx * Math.cos(a), y = ry * Math.sin(a);
        pts.push([
            cx + x * Math.cos(r) - y * Math.sin(r),
            cy + x * Math.sin(r) + y * Math.cos(r)
        ]);
    }
    return pts;
};
const rrect = (x0, y0, x1, y1, r, n = 8)=>{
    const pts = [];
    for (const [cx, cy, a] of [
        [
            x1 - r,
            y0 + r,
            -90
        ],
        [
            x1 - r,
            y1 - r,
            0
        ],
        [
            x0 + r,
            y1 - r,
            90
        ],
        [
            x0 + r,
            y0 + r,
            180
        ]
    ])for(let i = 0; i <= n; i++)pts.push([
        cx + r * Math.cos(rad(a + 90 * i / n)),
        cy + r * Math.sin(rad(a + 90 * i / n))
    ]);
    return pts;
};
const taper = (p, a, b, wa, wb, col = INK)=>{
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    p.poly([
        [
            a[0] + nx * wa / 2,
            a[1] + ny * wa / 2
        ],
        [
            b[0] + nx * wb / 2,
            b[1] + ny * wb / 2
        ],
        [
            b[0] - nx * wb / 2,
            b[1] - ny * wb / 2
        ],
        [
            a[0] - nx * wa / 2,
            a[1] - ny * wa / 2
        ]
    ], col, 0);
    p.dot(a[0], a[1], wa / 2, col);
    p.dot(b[0], b[1], wb / 2, col);
};
export const blobPts = (cx, cy, B, n = 72)=>{
    const ph = [
        rnd(B.seed, 11),
        rnd(B.seed, 12),
        rnd(B.seed, 13)
    ].map((v)=>v * Math.PI * 2);
    const pts = [];
    for(let i = 0; i < n; i++){
        const t = i / n * Math.PI * 2, c = Math.cos(t), s = Math.sin(t), e = 2 / (s < 0 ? B.nTop : B.nBot);
        let X = Math.sign(c) * Math.abs(c) ** e;
        const Y = Math.sign(s) * Math.abs(s) ** e;
        X *= (1 + B.egg * Y) * (1 + B.asym * Math.sign(X));
        const r = 1 + B.noise * (Math.cos(2 * t + ph[0]) + 0.7 * Math.cos(3 * t + ph[1]) + 0.5 * Math.cos(4 * t + ph[2]));
        const x = B.a * X * r, y = B.b * Y * r;
        pts.push([
            cx + x * Math.cos(B.rot) - y * Math.sin(B.rot),
            cy + x * Math.sin(B.rot) + y * Math.cos(B.rot)
        ]);
    }
    return pts;
};
export const headBlob = (seed, a = 118, facing = 0)=>({
        a,
        b: a * (0.94 + 0.08 * (rnd(seed, 1) - 0.5)),
        nTop: 1.75 + 0.3 * (rnd(seed, 2) - 0.5),
        nBot: 2.3 + 0.3 * (rnd(seed, 3) - 0.5),
        egg: -0.12 + 0.06 * (rnd(seed, 4) - 0.5),
        asym: (0.06 + 0.04 * rnd(seed, 5)) * (facing || (rnd(seed, 6) < 0.5 ? -1 : 1)),
        rot: rad(8 * (rnd(seed, 7) - 0.5)),
        noise: 0.008,
        seed
    });
export const thickAngle = (light)=>Math.atan2(-Math.sin(light) + 0.8, -Math.cos(light));
const DEF_LIGHT = rad(-120);
const FACE = {
    neutral: {
        eye: [
            "lid",
            "lid"
        ],
        brow: [
            0,
            -1
        ],
        mouth: "dash"
    },
    stern: {
        eye: [
            "lid",
            "lid"
        ],
        brow: [
            3,
            -2
        ],
        mouth: "frown"
    },
    grin: {
        eye: [
            "happy",
            "happy"
        ],
        brow: [
            -3,
            -3
        ],
        mouth: "grin"
    },
    laugh: {
        eye: [
            "squeeze",
            "squeeze"
        ],
        brow: [
            -4,
            -4
        ],
        mouth: "laugh"
    },
    whistle: {
        eye: [
            "dash",
            "dash"
        ],
        brow: [
            -2,
            -4
        ],
        mouth: "o"
    },
    nervous: {
        eye: [
            "small",
            "small"
        ],
        brow: [
            -3,
            2
        ],
        mouth: "wave"
    },
    shock: {
        eye: [
            "shock",
            "shock"
        ],
        brow: [
            -7,
            -6
        ],
        mouth: "O"
    },
    relief: {
        eye: [
            "happy",
            "happy"
        ],
        brow: [
            -2,
            1
        ],
        mouth: "smileWide"
    },
    relief_open: {
        eye: [
            "happy",
            "happy"
        ],
        brow: [
            -2,
            1
        ],
        mouth: "grin"
    },
    dazed: {
        eye: [
            "spiral",
            "spiral"
        ],
        brow: [
            -3,
            2
        ],
        mouth: "wave"
    },
    pained: {
        eye: [
            "squeeze",
            "lid"
        ],
        brow: [
            -3,
            2
        ],
        mouth: "teeth"
    },
    smile: {
        eye: [
            "dot",
            "dot"
        ],
        brow: [
            0,
            -1
        ],
        mouth: "smirk"
    },
    smile_closed: {
        eye: [
            "happy",
            "happy"
        ],
        brow: [
            0,
            -1
        ],
        mouth: "smile"
    },
    lick: {
        eye: [
            "dot",
            "dot"
        ],
        brow: [
            0,
            -1
        ],
        mouth: "lick"
    }
};
const halfLid = (k)=>k === "dot" || k === "small" ? "lid" : k === "lid" ? "slit" : k === "shock" ? "shockHalf" : k;
const eyeKind = (k, lid)=>lid >= 1 && k !== "happy" && k !== "squeeze" && k !== "spiral" ? "dash" : lid > 0 ? halfLid(k) : k;
const lidOf = (b)=>b === true ? 1 : Number(b) || 0;
const eye = (p, kind, x, ey, u, side, look, skin)=>{
    const lx = x + look * 3 * u, lw = 3.8 * u;
    switch(kind){
        case "dot":
            p.ell(lx, ey, 3.8 * u, 5.5 * u, INK, 0);
            break;
        case "small":
            p.ell(lx, ey, 3 * u, 4.4 * u, INK, 0);
            break;
        case "lid":
            p.ell(lx, ey - u, 7 * u, 6 * u, INK, 0, 0, 180);
            p.stroke([
                [
                    x - 9 * u,
                    ey - u
                ],
                [
                    x + 9 * u,
                    ey - u
                ]
            ], lw);
            break;
        case "slit":
            p.ell(lx, ey, 7 * u, 2.6 * u, INK, 0, 0, 180);
            p.stroke([
                [
                    x - 9 * u,
                    ey
                ],
                [
                    x + 9 * u,
                    ey
                ]
            ], lw);
            break;
        case "happy":
            p.arc(x, ey + 3 * u, 8 * u, 6 * u, 200, 340, lw);
            break;
        case "dash":
            p.stroke([
                [
                    x - 8.5 * u,
                    ey
                ],
                [
                    x + 8.5 * u,
                    ey
                ]
            ], lw);
            break;
        case "squeeze":
            p.stroke([
                [
                    x + 6 * u * side,
                    ey - 5 * u
                ],
                [
                    x - 6 * u * side,
                    ey
                ],
                [
                    x + 6 * u * side,
                    ey + 5 * u
                ]
            ], lw);
            break;
        case "shock":
        case "shockHalf":
            p.ell(x, ey, 11 * u, 11 * u, WHITE, 2.6 * u);
            p.dot(lx - side * 1.5 * u, ey + 1.5 * u, 3 * u);
            if (kind === "shockHalf") {
                p.ell(x, ey, 11 * u, 11 * u, skin, 0, 180, 360);
                p.stroke([
                    [
                        x - 11 * u,
                        ey
                    ],
                    [
                        x + 11 * u,
                        ey
                    ]
                ], 2.6 * u);
            }
            break;
        default:
            {
                const s = [];
                for(let t = 1; t < 15; t++)s.push([
                    x + Math.cos(t * 0.9) * t * 0.55 * u,
                    ey + Math.sin(t * 0.9) * t * 0.55 * u
                ]);
                p.stroke(s, 2.4 * u);
            }
    }
};
const dmouth = (p, mx, y, rx, ry, u, tongue = false)=>{
    p.ell(mx, y, rx, ry, MOUTH, 0, 0, 180);
    p.clip([
        [
            mx - rx,
            y
        ],
        [
            mx + rx,
            y
        ],
        [
            mx + rx,
            y + 3 * u
        ],
        [
            mx - rx,
            y + 3 * u
        ]
    ], ()=>p.ell(mx, y, rx, ry, WHITE, 0, 0, 180));
    if (tongue) p.ell(mx + 2 * u, y + 0.62 * ry, 0.4 * rx, 0.28 * ry, TONGUE, 0);
    p.ell(mx, y, rx, ry, null, 3 * u, 0, 180);
};
const mouth = (p, kind, mx, my, u, k = 1)=>{
    const mw = 4 * u;
    if (kind.startsWith("talk")) { // lip-sync: talk1 (slightly open) .. talk3 (wide open)
        const lv = +kind.slice(4), rx = (7 + lv * 1.2) * u * k, ry = (1.6 + lv * 2.6) * u;
        p.ell(mx, my + ry * 0.4, rx, ry, MOUTH, 3 * u);
        if (lv >= 2) p.clip(ellPts(mx, my + ry * 0.4, rx, ry, 0, 360, 0, 32), ()=>p.ell(mx, my + ry * 0.4 - ry * 0.95, rx * 0.8, ry * 0.45, WHITE, 0));
        if (lv >= 3) p.clip(ellPts(mx, my + ry * 0.4, rx, ry, 0, 360, 0, 32), ()=>p.ell(mx + u, my + ry * 1.05, rx * 0.5, ry * 0.4, TONGUE, 0));
        return;
    }
    switch(kind){
        case "dash":
            p.stroke([
                [
                    mx - 5.5 * u * k,
                    my
                ],
                [
                    mx + 5.5 * u * k,
                    my - 0.8 * u
                ]
            ], mw);
            break;
        case "frown":
            p.arc(mx, my + 3 * u, 6.5 * u * k, 3.5 * u, 200, 340, mw);
            break;
        case "smirk":
            p.arc(mx + u, my - 3 * u, 7 * u * k, 4 * u, 10, 150, mw);
            break;
        case "smile":
            p.arc(mx, my - 3 * u, 8 * u * k, 4.5 * u, 20, 160, mw);
            break;
        case "smileWide":
            p.arc(mx, my - 4 * u, 11 * u * k, 6 * u, 15, 165, mw);
            break;
        case "grin":
            dmouth(p, mx, my - u, 12 * u * k, 8 * u, u);
            break;
        case "laugh":
            dmouth(p, mx, my, 16 * u * k, 11 * u, u, true);
            break;
        case "o":
            p.ell(mx + 4 * u, my, 3.5 * u, 4 * u, MOUTH, 2.8 * u);
            break;
        case "O":
            p.ell(mx, my + 2 * u, 9 * u * k, 11 * u, MOUTH, 3.2 * u);
            break;
        case "wave":
            {
                const s = [];
                for(let i = 0; i <= 12; i++)s.push([
                    mx - 9 * u * k + i * 1.5 * u * k,
                    my + 1.5 * u * Math.sin(i * 1.3)
                ]);
                p.stroke(s, 3 * u);
                break;
            }
        case "teeth":
            p.poly([
                [
                    mx - 12 * u * k,
                    my - 4 * u
                ],
                [
                    mx + 12 * u * k,
                    my - 4 * u
                ],
                [
                    mx + 11 * u * k,
                    my + 4 * u
                ],
                [
                    mx - 11 * u * k,
                    my + 4 * u
                ]
            ], WHITE, 3 * u);
            for (const j of [
                -1,
                0,
                1
            ])p.stroke([
                [
                    mx + j * 6 * u * k,
                    my - 4 * u
                ],
                [
                    mx + j * 6 * u * k,
                    my + 4 * u
                ]
            ], 1.5 * u);
            break;
        case "lick":
            p.arc(mx, my - 3 * u, 8 * u * k, 4.5 * u, 20, 160, mw);
            p.ell(mx + 6 * u * k, my + 3 * u, 3.6 * u, 4.6 * u, TONGUE, 2.4 * u);
            break;
    }
};
const faceFront = (p, cx, cy, W, expr, facing, look, lid, brim, skin, moustache, stout = false)=>{
    const u = W / 100, F = FACE[expr], fx = cx + 7 * u * facing;
    const ex = (F.eye[0] === "shock" ? 12 : 13) * u, ey = cy;
    for (const side of [
        -1,
        1
    ]){
        const x = fx + side * ex;
        const kind = eyeKind(F.eye[(facing ? side === facing : side > 0) ? 1 : 0], lid);
        eye(p, kind, x, ey, u, side, look, skin);
        const [dI, dO] = F.brow, by = ey - (brim ? 17 : 20) * u;
        if (kind === "shock" || kind === "shockHalf") p.arc(x, by - 6 * u, 9 * u, 3 * u, 200, 340, 4 * u);
        else taper(p, [
            x - side * 8.5 * u,
            by + dI * u
        ], [
            x + side * 8.5 * u,
            by + dO * u
        ], 5 * u, 2.5 * u);
    }
    const mx = cx + 8 * u * facing, my = cy + 20 * u;
    mouth(p, F.mouth, mx, my, u);
    if (moustache) for (const s of [
        -1,
        1
    ])taper(p, [
        mx + s * 1.5 * u,
        cy + 12.5 * u
    ], [
        mx + s * (stout ? 19 : 15) * u,
        cy + (stout ? 10.5 : 15) * u
    ], stout ? 5.5 * u : 4.5 * u, 1.6 * u, moustache);
    if (expr === "nervous") p.ell(cx + 40 * u * (facing || 1), cy - 22 * u, 3 * u, 5 * u, "#9fd4ff", 2 * u);
    if (/^(cry|sob)/.test(expr)) for (const side of [-1, 1]) { const x = fx + side * ex;
        p.band([[x, ey + 5 * u], [x + side * 1.5 * u, ey + 30 * u]], "#8fd0ff", 4.5 * u, 1.2 * u, "round");
        p.ell(x + side * 1.5 * u, ey + 33 * u, 3.2 * u, 4.2 * u, "#8fd0ff", 1.2 * u); }
};
const faceSide = (p, hx, hy, W, expr, lid, brim, skin, moustache, stout = false)=>{
    const u = W / 100, F = FACE[expr], ex = hx + 27 * u, ey = hy;
    const kind = eyeKind(F.eye[1], lid);
    eye(p, kind, ex, ey, u, 1, 0.6, skin);
    const by = ey - (brim ? 17 : 20) * u, [dI, dO] = F.brow;
    if (kind === "shock" || kind === "shockHalf") p.arc(ex, by - 6 * u, 9 * u, 3 * u, 200, 340, 4 * u);
    else taper(p, [
        ex + 8 * u,
        by + dI * u
    ], [
        ex - 7 * u,
        by - u + dO * u
    ], 5 * u, 2.5 * u);
    p.stroke([
        [
            hx + 44 * u,
            hy + 4 * u
        ],
        [
            hx + 47.5 * u,
            hy + 9 * u
        ],
        [
            hx + 43 * u,
            hy + 10 * u
        ]
    ], 3 * u);
    mouth(p, F.mouth, hx + 33 * u, hy + 21 * u, u, 0.62);
    if (moustache) taper(p, [
        hx + 41 * u,
        hy + 13.5 * u
    ], [
        hx + 25 * u,
        hy + (stout ? 11.5 : 16) * u
    ], stout ? 5.5 * u : 4.5 * u, 1.6 * u, moustache);
    if (expr === "nervous") p.ell(hx - 30 * u, hy - 24 * u, 3 * u, 5 * u, "#9fd4ff", 2 * u);
};
const BONNET = "#e9cf8f", BONNET_BRIM = "#d6b46a";
const hatBehind = (p, o, H, cx, hc, light, thick, ow, side)=>{
    if (o.hat !== "bonnet") return;
    const bb = blobPts(cx - (side ? 12 : 0) * (H.a / 50), hc - 0.07 * 2 * H.b, {
        ...H,
        a: H.a * 1.17,
        b: H.b * 1.13,
        asym: 0,
        egg: 0.04,
        seed: H.seed + 3
    });
    p.shadedFill(bb, BONNET, mul(BONNET, SH_CLOTH), light, H.a * 1.17);
    p.inkRing(bb, ow * 0.85, thick);
};
const hatOn = (p, o, hp, H, cx, hc, light, seed, facing, side)=>{
    const W = 2 * H.a, HH = 2 * H.b, u = W / 100, crown = hc - H.b, ow = 0.85 * 5 * u;
    const a = H.rot + rad(4 * (rnd(seed, 20) - 0.5));
    const R = (pts)=>rotPts(pts, a, cx, hc);
    const sag = (yb, wb)=>{
        const base = [];
        for(let i = 0; i <= 12; i++){
            const t = i / 12;
            base.push([
                cx + wb * (2 * t - 1),
                yb + 3 * u * (1 - (2 * t - 1) ** 2)
            ]);
        }
        return base;
    };
    if (o.hat === "shako" || o.hat === "shako_tall") {
        const tall = o.hat === "shako_tall", yb = crown + 0.25 * HH, ht = (tall ? 0.66 : 0.56) * HH, wb = 46 * u, wt = 52 * u;
        const body = R([
            ...sag(yb, wb).reverse(),
            [
                cx - wt,
                yb - ht
            ],
            [
                cx + wt,
                yb - ht
            ]
        ]);
        p.shadedFill(body, "#3a3d47", "#24262d", light, wt, 0.4);
        if (tall) p.clip(body, ()=>p.band(R([
                [
                    cx - wt - 5 * u,
                    yb - ht + 0.07 * HH
                ],
                [
                    cx + wt + 5 * u,
                    yb - ht + 0.07 * HH
                ]
            ]), "#e8c45a", 0.06 * HH, 1.5 * u));
        p.poly(body, null, ow);
        const deg = a * 180 / Math.PI;
        if (side) {
            p.poly(R([
                [
                    cx + 36 * u,
                    yb - 1 * u
                ],
                [
                    cx + 60 * u,
                    yb + 8 * u
                ],
                [
                    cx + 34 * u,
                    yb + 6 * u
                ]
            ]), "#16171b", 2.5 * u);
            const [tx, ty] = R([
                [
                    cx + 24 * u,
                    yb - ht - 6 * u
                ]
            ])[0];
            p.ell(tx, ty, 7 * u, 7 * u, "#2b7a4b", 2.5 * u);
        } else {
            const [px, py] = R([
                [
                    cx + 3 * u * facing,
                    yb + 3 * u
                ]
            ])[0];
            p.ell(px, py, 34 * u, 0.045 * HH, "#16171b", 2.5 * u, 0, 180, deg);
            const [bx, by] = R([
                [
                    cx,
                    yb - 0.45 * ht
                ]
            ])[0];
            p.ell(bx, by, 7 * u, 6 * u, tall ? "#e8c45a" : "#c9ccd2", 2 * u, 0, 360, deg);
            p.arc(bx, by, 3.5 * u, 2.8 * u, 200, 500, 1.6 * u);
            const [tx, ty] = R([
                [
                    cx,
                    yb - ht - 6 * u
                ]
            ])[0];
            p.ell(tx, ty, 7 * u, 7 * u, "#2b7a4b", 2.5 * u);
        }
    } else if (o.hat === "cap" || o.hat === "hair") {
        const cut = crown + (o.hat === "cap" ? 0.3 : 0.42) * HH;
        const keep = (x, y)=>y < cut || side && o.hat === "hair" && x < cx - 6 * u && y < hc + 0.42 * H.b;
        const n = hp.length, startIdx = Math.max(0, hp.findIndex(([x, y], i)=>keep(x, y) && !keep(hp[(i + n - 1) % n][0], hp[(i + n - 1) % n][1])));
        const arc = [
            ...hp.slice(startIdx),
            ...hp.slice(0, startIdx)
        ].filter(([x, y])=>keep(x, y)).map(([x, y])=>[
                cx + (x - cx) * 1.03,
                hc + (y - hc) * 1.03
            ]);
        if (arc.length < 3) return;
        if (o.hat === "hair") {
            const [x0, y0] = arc[arc.length - 1], [x1, y1] = arc[0];
            for(let i = 1; i < 6; i++)arc.push([
                x0 + (x1 - x0) * i / 6,
                y0 + (y1 - y0) * i / 6 + (i % 2 ? 4 * u : 0)
            ]);
        }
        const col = o.hat === "cap" ? o.cap : o.hair;
        p.shadedFill(arc, col, mul(col, SH_FELT), light, H.a, 0.35);
        p.poly(arc, null, ow);
        if (o.hat === "hair") {
            const s = side ? -1 : facing || 1;
            p.stroke([
                [
                    cx + s * 10 * u,
                    cut - 30 * u
                ],
                [
                    cx + s * 2 * u,
                    cut - 12 * u
                ]
            ], 1.2 * u);
        }
        if (o.hat === "cap") {
            const deg = a * 180 / Math.PI;
            if (side) p.poly(R([
                [
                    cx + 40 * u,
                    cut - 2 * u
                ],
                [
                    cx + 74 * u,
                    cut + 4 * u
                ],
                [
                    cx + 40 * u,
                    cut + 6 * u
                ]
            ]), shade(col, 0.8), ow);
            else {
                const s = facing || (rnd(seed, 21) < 0.5 ? -1 : 1), [px, py] = R([
                    [
                        cx + s * 4 * u,
                        cut + 1.5 * u
                    ]
                ])[0];
                p.ell(px, py, 32 * u, 0.06 * HH, shade(col, 0.8), ow, 0, 180, deg);
            }
        }
    } else if (o.hat === "tophat") {
        const yb = crown + 0.22 * HH, ht = 0.8 * HH, wb = 0.31 * W, wt = 0.33 * W, col = "#2e2a36";
        const body = R([
            ...sag(yb, wb).reverse(),
            [
                cx - wt,
                yb - ht
            ],
            [
                cx + wt,
                yb - ht
            ]
        ]);
        p.shadedFill(body, col, mul(col, SH_FELT), light, wt, 0.4);
        p.clip(body, ()=>p.band(R([
                [
                    cx - wt - 4 * u,
                    yb - 0.13 * HH
                ],
                [
                    cx + wt + 4 * u,
                    yb - 0.13 * HH
                ]
            ]), shade(o.jacket, 0.9), 0.14 * HH, 0.8 * u));
        p.poly(body, null, ow);
        const [bx, by] = R([
            [
                cx,
                yb + 1 * u
            ]
        ])[0];
        p.ell(bx, by, 0.45 * W, 0.05 * HH, "#1d1b22", ow, 0, 360, a * 180 / Math.PI);
    } else if (o.hat === "bonnet") {
        const [bx, by] = R([
            [
                cx + (side ? 6 * u : 0),
                crown + 0.16 * HH
            ]
        ])[0];
        p.arc(bx, by, 0.5 * W, 0.2 * HH, 200, 340, 7 * u, BONNET_BRIM);
        p.arc(bx, by, 0.5 * W + 3.5 * u, 0.2 * HH + 3.5 * u, 200, 340, 1.2 * u);
        const cy = hc + H.b * 0.98;
        p.stroke([
            [
                cx - 14 * u,
                cy - 4 * u
            ],
            [
                cx,
                cy + 2 * u
            ],
            [
                cx + 14 * u,
                cy - 4 * u
            ]
        ], 2 * u, BONNET_BRIM);
    }
};
const BUILD = {
    adult: {
        a: 118,
        torso: 1.1,
        legs: 1.4,
        tw: 0.8
    },
    stout: {
        a: 118,
        torso: 1.15,
        legs: 1.32,
        tw: 0.92
    },
    kid: {
        a: 112,
        torso: 0.85,
        legs: 1.0,
        tw: 0.72
    }
};
const footStroke = (p, a, b, w, col)=>{
    if (col !== INK) p.stroke([
        a,
        b
    ], w + 3, INK);
    p.stroke([
        a,
        b
    ], w, col);
};
export const bodyFront = (p, o, opts)=>{
    const { phase = 0, expr = "neutral", mode = "march", look = 0, blink = false, lift = 60, prop = null, tilt = 0, headTilt = 0, wave, light = DEF_LIGHT, facing = 0, seed = 1 } = opts;
    const Bd = BUILD[o.build ?? "adult"], skin = o.skin ?? SKIN, two = Math.PI * 2, lid = lidOf(blink);
    const H = headBlob(seed, Bd.a, facing), W = 2 * H.a, HH = 2 * H.b, u = W / 100;
    const tall = (1 + Bd.torso + Bd.legs) * HH, sole = 975;
    const bob = mode === "march" ? 0.025 * tall * Math.cos(2 * two * phase) : mode === "stroll" ? 0.015 * tall * Math.cos(2 * two * phase) : 0;
    const torsoBot = mode === "sit" ? sole - 0.2 * HH : sole - Bd.legs * HH + bob;
    const chin = torsoBot - Bd.torso * HH, hc = chin - H.b, crown = hc - H.b, hipY = torsoBot - 0.12 * HH;
    const thick = thickAngle(light), ow = 5 * u;
    const legCol = mix(o.pants, INK, 0.55), armCol = mix(o.jacket, INK, 0.5), footCol = o.boots;
    const legW = 5.8 * u, footW = 7.5 * u;
    p.rot = null;
    if (mode === "sit") {
        for (const side of [
            -1,
            1
        ]){
            const h = [
                300 + side * 15 * u,
                hipY
            ], k = [
                300 + side * 36 * u,
                hipY + 0.2 * HH
            ], f = [
                300 + side * 44 * u,
                sole - 8 * u
            ];
            p.stroke(curve(h, k, f), legW, legCol);
            footStroke(p, [
                f[0] - side * 2 * u,
                f[1]
            ], [
                f[0] + side * 12 * u,
                f[1] - 5 * u
            ], footW, footCol);
        }
    } else if (mode === "fall") {
        const legs = [
            [
                [
                    300 - 15 * u,
                    hipY
                ],
                [
                    300 - 46 * u,
                    hipY + 0.5 * HH
                ],
                [
                    300 - 70 * u,
                    hipY + 0.72 * HH
                ]
            ],
            [
                [
                    300 + 15 * u,
                    hipY
                ],
                [
                    300 + 50 * u,
                    hipY + 0.45 * HH
                ],
                [
                    300 + 76 * u,
                    hipY + 0.22 * HH
                ]
            ]
        ];
        legs.forEach(([h, k, f], i)=>{
            p.stroke(curve(h, k, f), legW, legCol);
            footStroke(p, f, [
                f[0] + (i ? 14 : -14) * u,
                f[1] + (i ? -6 : 4) * u
            ], footW, footCol);
        });
    } else if (o.dress) {
        for (const side of [
            -1,
            1
        ]){
            const fx = 300 + side * 12 * u, fy = sole - 4 * u;
            p.stroke([
                [
                    fx,
                    sole - 0.4 * HH
                ],
                [
                    fx + side * u,
                    fy
                ]
            ], legW, legCol);
            footStroke(p, [
                fx - side * 3 * u,
                fy
            ], [
                fx + side * 12 * u,
                fy + u
            ], footW, footCol);
        }
    } else {
        const L = mode === "march" ? lift * 1.25 : mode === "stroll" ? lift * 0.55 : 0;
        for (const [side, ph] of [
            [
                -1,
                0
            ],
            [
                1,
                0.5
            ]
        ]){
            const up = Math.max(0, Math.sin(two * (phase + ph))) * L;
            const hx = 300 + side * 15 * u, fx = 300 + side * 22 * u, fy = sole - 4 * u - up;
            const k = [
                (hx + fx) / 2 + side * (1.5 * u + up * 0.16),
                (hipY + fy) / 2 - up * 0.08
            ];
            p.stroke(curve([
                hx,
                hipY
            ], k, [
                fx,
                fy
            ]), legW, legCol);
            footStroke(p, [
                fx - side * 3 * u,
                fy
            ], [
                fx + side * 13 * u,
                fy + 0.5 * u
            ], footW, footCol);
        }
    }
    const sway = mode === "march" ? 1.6 * Math.sin(two * phase) : mode === "stroll" ? 1.0 * Math.sin(two * phase) : 0;
    const A = tilt + sway;
    p.rot = A ? [
        rad(A),
        300,
        hipY
    ] : null;
    const dress = !!o.dress && mode !== "sit" && mode !== "fall";
    const T = {
        a: Bd.tw / 2 * W / 1.06,
        b: 0.5 * (torsoBot - (chin - 0.25 * HH)),
        nTop: 2.2,
        nBot: 2.6,
        egg: o.build === "stout" ? 0.17 : 0.12,
        asym: 0.04 * facing,
        rot: 0,
        noise: 0.006,
        seed: seed + 7
    };
    const tcx = 300 + 3 * u * facing, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
    const sh = (side)=>[
            tcx + side * 0.85 * T.a,
            chin + 0.12 * HH
        ];
    const hang = (side, fwd)=>{
        const S = sh(side), ex = tcx + side * (1.12 * T.a + 4 * u);
        const hx = ex + side * 3 * u - side * 6 * u * Math.max(0, fwd) + side * 4 * u * Math.max(0, -fwd);
        return [
            S,
            [
                ex,
                S[1] + 0.48 * HH
            ],
            [
                hx,
                chin + 1.04 * HH - Math.abs(fwd) * 9 * u
            ]
        ];
    };
    const sw = mode === "march" || mode === "stroll" ? Math.sin(two * phase) : 0;
    const R0 = [
        300 + 47 * u,
        torsoBot + 0.12 * HH
    ], R1 = [
        300 + 64 * u,
        crown - 0.32 * HH
    ];
    const rifle = !!o.rifle && (mode === "march" || mode === "stand" || mode === "stroll");
    const arms = [];
    if (mode === "sit") for (const side of [
        -1,
        1
    ])arms.push({
        pts: [
            sh(side),
            [
                tcx + side * (1.1 * T.a + 6 * u),
                sh(side)[1] + 0.4 * HH
            ],
            [
                tcx + side * (1.2 * T.a + 10 * u),
                torsoBot + 0.04 * HH
            ]
        ],
        front: false
    });
    else if (mode === "fall") for (const side of [
        -1,
        1
    ])arms.push({
        pts: [
            sh(side),
            [
                tcx + side * (1.15 * T.a + 12 * u),
                sh(side)[1] - 0.25 * HH
            ],
            [
                tcx + side * (1.3 * T.a + 24 * u),
                sh(side)[1] - 0.68 * HH
            ]
        ],
        front: false
    });
    else {
        arms.push({
            pts: prop === "shako" ? hang(-1, 0) : hang(-1, -sw),
            front: false
        });
        if (rifle) {
            const G = lerp2(R0, R1, 0.1);
            arms.push({
                pts: [
                    sh(1),
                    [
                        tcx + 1.12 * T.a + 5 * u,
                        sh(1)[1] + 0.45 * HH
                    ],
                    G
                ],
                front: false
            });
        } else if (wave !== undefined) {
            const S = sh(1);
            arms.push({
                pts: [
                    S,
                    [
                        tcx + 1.1 * T.a + 10 * u + 3 * u * wave,
                        S[1] - 0.22 * HH
                    ],
                    [
                        tcx + 1.18 * T.a + 16 * u + 12 * u * wave,
                        S[1] - 0.6 * HH
                    ]
                ],
                front: false
            });
        } else if (prop === "icecream") {
            const S = sh(1);
            arms.push({
                pts: [
                    S,
                    [
                        tcx + 1.05 * T.a + 4 * u,
                        S[1] + 0.45 * HH
                    ],
                    [
                        tcx + 0.5 * T.a,
                        S[1] + 0.4 * HH
                    ]
                ],
                front: true
            });
        } else if (Array.isArray(prop)) {
            const S = sh(1), k = clamp(prop[1], 0, 1);
            const E = lerp2([
                tcx + 1.1 * T.a + 10 * u,
                S[1] - 0.15 * HH
            ], [
                tcx + 1.2 * T.a + 10 * u,
                S[1] + 0.3 * HH
            ], k);
            const Hd = lerp2([
                tcx + 1.15 * T.a + 14 * u,
                S[1] - 0.55 * HH
            ], [
                tcx + 1.45 * T.a + 22 * u,
                S[1] + 0.35 * HH
            ], k);
            arms.push({
                pts: [
                    S,
                    E,
                    Hd
                ],
                front: true
            });
        } else arms.push({
            pts: hang(1, sw),
            front: false
        });
    }
    const drawArm = (a)=>{
        p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 5.2 * u, armCol);
        p.dot(a.pts[2][0], a.pts[2][1], 5.5 * u);
    };
    if (rifle) {
        p.band([
            R0,
            R1
        ], "#7a4b2a", 5 * u, 1.5 * u, "round");
        p.band([
            lerp2(R0, R1, 0.6),
            R1
        ], "#8d949c", 2.4 * u, 1.2 * u, "round");
    }
    if (o.sword && mode !== "sit") {
        const s0 = [
            tcx - 0.75 * T.a,
            torsoBot - 0.2 * HH
        ];
        p.band([
            s0,
            [
                s0[0] - Math.sin(rad(25)) * 0.8 * HH,
                s0[1] + Math.cos(rad(25)) * 0.8 * HH
            ]
        ], "#c9ccd2", 3 * u, 1.2 * u, "round");
    }
    for (const a of arms)if (!a.front) drawArm(a);
    if (dress) {
        const D = {
            a: 0.5 * W * 0.98,
            b: 0.5 * (sole - 0.35 * HH - (chin - 0.2 * HH)),
            nTop: 2.0,
            nBot: 3.0,
            egg: 0.35,
            asym: 0.03 * facing,
            rot: 0,
            noise: 0.006,
            seed: seed + 9
        };
        const dp = blobPts(300, sole - 0.35 * HH - D.b, D);
        p.gradFill(dp, o.dress, mul(o.dress, SH_CLOTH), light);
        p.inkRing(dp, ow, thick);
        const Sw = {
            a: 0.37 * W,
            b: 0.3 * HH,
            nTop: 2.2,
            nBot: 2.4,
            egg: 0.1,
            asym: 0,
            rot: 0,
            noise: 0.006,
            seed: seed + 8
        };
        const sp = blobPts(300, chin + 0.12 * HH, Sw);
        p.gradFill(sp, o.jacket, mul(o.jacket, SH_CLOTH), light);
        p.inkRing(sp, ow * 0.9, thick);
    } else {
        p.gradFill(tp, o.jacket, mul(o.jacket, SH_CLOTH), light);
        p.clip(tp, ()=>{
            if (o.belt) {
                for (const s of [
                    -1,
                    1
                ])p.band([
                    [
                        tcx - s * 0.75 * T.a,
                        chin - 0.05 * HH
                    ],
                    [
                        tcx + s * 0.8 * T.a,
                        torsoBot - 0.1 * HH
                    ]
                ], o.belt, 5.5 * u, 1.8 * u);
                const xc = tcx + 0.025 * T.a, yc = chin - 0.05 * HH + (torsoBot - 0.1 * HH - (chin - 0.05 * HH)) * (0.75 / 1.55);
                p.poly([
                    [
                        xc - 3.5 * u,
                        yc - 3.5 * u
                    ],
                    [
                        xc + 3.5 * u,
                        yc - 3.5 * u
                    ],
                    [
                        xc + 3.5 * u,
                        yc + 3.5 * u
                    ],
                    [
                        xc - 3.5 * u,
                        yc + 3.5 * u
                    ]
                ], "#d9dde0", 1.5 * u);
            }
            if (o.sash) p.band([
                [
                    tcx - 1.3 * T.a,
                    torsoBot - 0.32 * HH
                ],
                [
                    tcx + 1.3 * T.a,
                    torsoBot - 0.32 * HH
                ]
            ], o.sash, 0.13 * HH, 1.8 * u);
            for(let i = 0; i < 4; i++){
                const y = chin + 0.12 * HH + i * 0.2 * HH;
                if (o.sash && Math.abs(y - (torsoBot - 0.32 * HH)) < 0.08 * HH) continue;
                p.dot(tcx + 2 * u * facing, y, 2.2 * u + 0.8 * u, INK);
                p.dot(tcx + 2 * u * facing, y, 2.2 * u, o.buttons ?? shade(o.jacket, 0.7));
            }
        });
        if (o.sash) {
            const s = facing || 1;
            p.poly([
                [
                    tcx + s * 0.55 * T.a,
                    torsoBot - 0.3 * HH
                ],
                [
                    tcx + s * 0.75 * T.a,
                    torsoBot + 0.05 * HH
                ],
                [
                    tcx + s * 0.45 * T.a,
                    torsoBot + 0.02 * HH
                ]
            ], o.sash, 1.6 * u);
        }
        p.inkRing(tp, ow, thick);
    }
    for (const a of arms)if (a.front) {
        drawArm(a);
        const [hx, hy] = a.pts[2];
        if (prop === "icecream") {
            p.poly([
                [
                    hx - 8 * u,
                    hy - 12 * u
                ],
                [
                    hx + 8 * u,
                    hy - 12 * u
                ],
                [
                    hx,
                    hy + 7 * u
                ]
            ], "#e0a35a", 1.8 * u);
            p.ell(hx, hy - 19 * u, 11 * u, 10 * u, "#f7c6d9", 2.2 * u);
            p.dot(hx, hy, 5.5 * u);
        } else if (Array.isArray(prop)) {
            const ang = rad(-70 + 105 * clamp(prop[1], 0, 1));
            const Rh = (pts)=>rotPts(pts, ang, hx, hy);
            p.band(Rh([
                [
                    hx,
                    hy + 12 * u
                ],
                [
                    hx,
                    hy - 44 * u
                ]
            ]), "#8a5a34", 5 * u, 1.5 * u, "round");
            p.poly(Rh([
                [
                    hx - 12 * u,
                    hy - 58 * u
                ],
                [
                    hx + 20 * u,
                    hy - 58 * u
                ],
                [
                    hx + 20 * u,
                    hy - 42 * u
                ],
                [
                    hx - 12 * u,
                    hy - 42 * u
                ]
            ]), "#7d848c", 2.2 * u);
            p.dot(hx, hy, 5.5 * u);
        }
    }
    if (prop === "shako") {
        const [hx, hy] = arms[0].pts[2];
        p.poly([
            [
                hx - 14 * u,
                hy + 3 * u
            ],
            [
                hx + 14 * u,
                hy + 3 * u
            ],
            [
                hx + 16 * u,
                hy + 30 * u
            ],
            [
                hx - 16 * u,
                hy + 30 * u
            ]
        ], "#3a3d47", 2.2 * u);
        p.ell(hx, hy + 31 * u, 3.5 * u, 3.5 * u, "#2b7a4b", 1.5 * u);
        p.dot(hx, hy, 5.5 * u);
    }
    const Ah = A + headTilt, [cpx, cpy] = rotAbout([
        300,
        chin
    ], rad(A), [
        300,
        hipY
    ]);
    p.rot = Ah ? [
        rad(Ah),
        300,
        chin,
        cpx - 300,
        cpy - chin
    ] : null;
    hatBehind(p, o, H, 300, hc, light, thick, ow, false);
    const hp = blobPts(300, hc, H);
    p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
    p.inkRing(hp, ow, thick);
    hatOn(p, o, hp, H, 300, hc, light, seed, facing, false);
    const brim = !!o.hat && o.hat !== "hair" && o.hat !== "bonnet" && o.hat !== "cap";
    faceFront(p, 300, hc, W, expr, facing, look, lid, brim, skin, o.moustache, o.build === "stout");
    p.rot = null;
};
const ik = (hip, ank, l1, l2)=>{
    const dx = ank[0] - hip[0], dy = ank[1] - hip[1], d = clamp(Math.hypot(dx, dy), 1, l1 + l2 - 0.01);
    const A = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), k = Math.atan2(dy, dx) - A;
    return [
        hip[0] + l1 * Math.cos(k),
        hip[1] + l1 * Math.sin(k)
    ];
};
const SWING_HIP = 733;
export const bodySide = (p, o, opts)=>{
    const { phase = 0, expr = "neutral", mode = "march", blink = false, stomp = 1, pose = 0, stride = 1, light = DEF_LIGHT, seed = 1 } = opts;
    const Bd = BUILD[o.build ?? "adult"], skin = o.skin ?? SKIN, two = Math.PI * 2, lid = lidOf(blink);
    const H = {
        ...headBlob(seed, Bd.a, 1),
        asym: 0.12,
        rot: rad(3 + 3 * (rnd(seed, 7) - 0.5))
    };
    const W = 2 * H.a, HH = 2 * H.b, u = W / 100, sole = 975, ankY = sole - 4 * u;
    const thick = thickAngle(light), ow = 5 * u;
    const legLen = (Bd.legs + 0.12) * HH - 4 * u, l1 = legLen / 2, l2 = legLen / 2;
    const nearCol = mix(o.pants, INK, 0.55), farCol = mix(o.pants, INK, 0.75), footCol = o.boots;
    const legs = [];
    let hipY = ankY - legLen * 0.995, lean = 0, nearFwd = 0;
    if (mode === "march") {
        const S = 370 * stride, liftH = Math.max(22, 40 + 70 * (stomp - 1));
        const st = (ph)=>{
            const c = ((phase + ph) % 1 + 1) % 1;
            if (c < 0.5) {
                const s = c / 0.5;
                return {
                    x: S / 2 - S * s,
                    h: 0,
                    stance: true,
                    s
                };
            }
            const s = (c - 0.5) / 0.5;
            return {
                x: -S / 2 + S * s - S / Math.PI * Math.sin(2 * Math.PI * s),
                h: liftH * Math.sin(Math.PI * s),
                stance: false,
                s
            };
        };
        const nL = st(0), fL = st(0.5), stance = nL.stance ? nL : fL;
        const Leff = legLen * (1 - 0.035 * Math.sin(Math.PI * stance.s));
        hipY = ankY - Math.sqrt(Math.max(1, Leff * Leff - stance.x * stance.x));
        for (const [L, near] of [
            [
                fL,
                false
            ],
            [
                nL,
                true
            ]
        ])legs.push({
            ank: [
                300 + L.x,
                ankY - L.h
            ],
            pitch: L.stance ? 0 : rad(35 * Math.sin(Math.PI * L.s) * (1 - 1.6 * L.s)),
            near
        });
        lean = 4 + 3 * Math.cos(2 * two * phase);
        nearFwd = nL.x / (S / 2);
    } else if (mode === "push") {
        hipY = ankY - 0.87 * legLen;
        legs.push({
            ank: [
                300 - 0.5 * legLen,
                ankY
            ],
            pitch: rad(-8),
            near: false
        }, {
            ank: [
                300 + 0.32 * legLen,
                ankY
            ],
            pitch: 0,
            near: true
        });
        lean = 14 * pose;
    } else if (mode === "swing") {
        hipY = SWING_HIP;
        const a = rad(60 * pose);
        for (const [dx, near] of [
            [
                -6,
                false
            ],
            [
                0,
                true
            ]
        ]){
            const knee = [
                300 + l1 * 0.98 + dx * u,
                hipY + 6 * u
            ];
            legs.push({
                ank: [
                    knee[0] + l2 * Math.sin(a),
                    knee[1] + l2 * Math.cos(a)
                ],
                pitch: -a * 0.5,
                near
            });
        }
    } else {
        legs.push({
            ank: [
                300 - 4 * u,
                ankY
            ],
            pitch: 0,
            near: false
        }, {
            ank: [
                300 + 4 * u,
                ankY
            ],
            pitch: 0,
            near: true
        });
    }
    const torsoBot = hipY + 0.12 * HH, chin = torsoBot - Bd.torso * HH, hc = chin - H.b, crown = hc - H.b, hip = [
        300,
        hipY
    ];
    p.rot = null;
    for (const L of legs){
        const knee = mode === "swing" ? [
            300 + l1 * 0.98 + (L.near ? 0 : -6 * u),
            hipY + 6 * u
        ] : ik(hip, L.ank, l1, l2);
        const hp0 = [
            300 + (L.near ? 0 : -5 * u),
            hipY
        ];
        p.stroke([
            hp0,
            knee,
            L.ank
        ], 5.8 * u, L.near ? nearCol : farCol);
        const c = Math.cos(L.pitch), s = Math.sin(L.pitch);
        footStroke(p, [
            L.ank[0] - 3 * u * c,
            L.ank[1] - 3 * u * s
        ], [
            L.ank[0] + 13 * u * c,
            L.ank[1] + 13 * u * s + 0.5 * u
        ], 7.5 * u, L.near ? footCol : footCol === INK ? INK : shade(footCol, 0.82));
    }
    p.rot = lean ? [
        rad(lean),
        300,
        hipY
    ] : null;
    const T = {
        a: (o.build === "stout" ? 0.36 : 0.31) * W,
        b: 0.5 * (torsoBot - (chin - 0.25 * HH)),
        nTop: 2.2,
        nBot: 2.5,
        egg: 0.1,
        asym: 0.06,
        rot: 0,
        noise: 0.006,
        seed: seed + 7
    };
    const tcx = 300 + 2 * u, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
    const armCol = mix(o.jacket, INK, 0.5), farArm = mix(o.jacket, INK, 0.68);
    const S = [
        tcx + 0.05 * T.a,
        chin + 0.14 * HH
    ], aLen = 0.95 * HH;
    const swingArm = (ang)=>{
        const e = [
            S[0] + Math.sin(ang) * aLen * 0.5,
            S[1] + Math.cos(ang) * aLen * 0.5
        ], a2 = ang + rad(16) * Math.sign(ang || 1);
        return [
            S,
            e,
            [
                e[0] + Math.sin(a2) * aLen * 0.5,
                e[1] + Math.cos(a2) * aLen * 0.5
            ]
        ];
    };
    const rifle = !!o.rifle && (mode === "march" || mode === "stand");
    const B0 = [
        tcx + 0.72 * T.a,
        chin + 0.58 * HH
    ], B1 = [
        tcx - 0.95 * T.a - 22 * u,
        crown - 0.4 * HH
    ];
    let near, far;
    if (mode === "swing") {
        near = [
            S,
            [
                S[0] + 12 * u,
                S[1] - 0.16 * HH
            ],
            [
                300 + 6 * u,
                chin - 0.3 * HH
            ]
        ];
        far = [
            S,
            [
                S[0] + 8 * u,
                S[1] - 0.18 * HH
            ],
            [
                300 + 2 * u,
                chin - 0.36 * HH
            ]
        ];
    } else if (mode === "push") {
        const reach = 0.55 * HH + 0.45 * HH * pose;
        let hN = [
            S[0] + reach,
            S[1] + 0.06 * HH
        ];
        if (opts.hand) {
            const th = -rad(lean), dx = opts.hand[0] - 300, dy = opts.hand[1] - hipY;
            const tg = [
                300 + dx * Math.cos(th) - dy * Math.sin(th),
                hipY + dx * Math.sin(th) + dy * Math.cos(th)
            ];
            hN = [
                hN[0] + (tg[0] - hN[0]) * pose,
                hN[1] + (tg[1] - hN[1]) * pose
            ];
        }
        near = [
            S,
            [
                (S[0] + hN[0]) / 2,
                (S[1] + hN[1]) / 2 + 0.06 * HH
            ],
            hN
        ];
        far = [
            S,
            [
                (S[0] + hN[0]) / 2 - 4 * u,
                (S[1] + hN[1]) / 2 - 0.02 * HH
            ],
            [
                hN[0] - 6 * u,
                hN[1] - 0.08 * HH
            ]
        ];
    } else if (rifle) {
        near = [
            S,
            [
                S[0] - 4 * u,
                S[1] + 0.42 * HH
            ],
            B0
        ];
        far = mode === "march" ? swingArm(rad(30) * nearFwd) : swingArm(0);
    } else {
        near = swingArm(rad(-30) * nearFwd);
        far = mode === "march" ? swingArm(rad(30) * nearFwd) : null;
    }
    if (far) {
        p.stroke(curve(far[0], far[1], far[2]), 5.2 * u, farArm);
        p.dot(far[2][0], far[2][1], 5.5 * u);
    }
    p.gradFill(tp, o.jacket, mul(o.jacket, SH_CLOTH), light);
    p.clip(tp, ()=>{
        if (o.belt) p.band([
            [
                tcx - 0.65 * T.a,
                chin - 0.05 * HH
            ],
            [
                tcx + 0.75 * T.a,
                torsoBot - 0.1 * HH
            ]
        ], o.belt, 5.5 * u, 1.8 * u);
        if (o.sash) p.band([
            [
                tcx - 1.3 * T.a,
                torsoBot - 0.32 * HH
            ],
            [
                tcx + 1.3 * T.a,
                torsoBot - 0.32 * HH
            ]
        ], o.sash, 0.13 * HH, 1.8 * u);
        if (!o.dress) for(let i = 0; i < 3; i++){
            const y = chin + 0.16 * HH + i * 0.24 * HH;
            p.dot(tcx + 0.8 * T.a, y, 3 * u, INK);
            p.dot(tcx + 0.8 * T.a, y, 2.2 * u, o.buttons ?? shade(o.jacket, 0.7));
        }
    });
    p.inkRing(tp, ow, thick);
    if (rifle) {
        p.band([
            B0,
            B1
        ], "#7a4b2a", 5 * u, 1.5 * u, "round");
        p.band([
            lerp2(B0, B1, 0.6),
            B1
        ], "#8d949c", 2.4 * u, 1.2 * u, "round");
    }
    p.stroke(curve(near[0], near[1], near[2]), 5.2 * u, armCol);
    p.dot(near[2][0], near[2][1], 5.5 * u);
    const hx = 300 + 4 * u;
    hatBehind(p, o, H, hx, hc, light, thick, ow, true);
    const hp = blobPts(hx, hc, H);
    p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
    p.inkRing(hp, ow, thick);
    hatOn(p, o, hp, H, hx, hc, light, seed, 1, true);
    const brim = !!o.hat && o.hat !== "hair" && o.hat !== "bonnet" && o.hat !== "cap";
    faceSide(p, hx, hc, W, expr, lid, brim, skin, o.moustache, o.build === "stout");
    p.rot = null;
};
export const swingKid = (p, o, kick, expr, light = DEF_LIGHT, blink = 0)=>{
    const rope = 1830, k = 1.1, HH = 2 * headBlob(5, BUILD[o.build ?? "adult"].a, 1).b;
    const seat = rope + 18, x0 = 150, x1 = 550;
    p.line([
        [
            350,
            20
        ],
        [
            x0 + 16,
            seat + 4
        ]
    ], "#a07a4c", 10);
    p.poly(rrect(x0, seat, x1, seat + 36, 10), "#b5653f", 9);
    const g = p.g;
    g.save();
    g.translate(350 - 300 * k, rope + 18 - (SWING_HIP + 0.12 * HH) * k);
    g.scale(k, k);
    bodySide(new Pen(g), o, {
        expr,
        mode: "swing",
        pose: kick,
        light,
        seed: 5,
        blink
    });
    g.restore();
    p.line([
        [
            350,
            20
        ],
        [
            x1 - 16,
            seat + 4
        ]
    ], "#a07a4c", 10);
};
export const fxNote = (p, kind, col = "#1f2a44")=>{
    p.ell(70, 200, 46, 34, col, 8, 0, 360, -20);
    p.stroke([
        [
            110,
            190
        ],
        [
            110,
            40
        ]
    ], 14);
    if (kind === 0) p.poly([
        [
            110,
            40
        ],
        [
            170,
            70
        ],
        [
            170,
            110
        ],
        [
            110,
            82
        ]
    ], col, 8);
    else {
        p.ell(150, 170, 40, 30, col, 8, 0, 360, -20);
        p.stroke([
            [
                186,
                160
            ],
            [
                186,
                20
            ]
        ], 14);
        p.poly([
            [
                110,
                40
            ],
            [
                186,
                20
            ],
            [
                186,
                50
            ],
            [
                110,
                70
            ]
        ], col, 8);
    }
};
export const fxBurst = (p, t, col = "#fff3b0", rays = 10, r0 = 40, r1 = 230)=>{
    const c = 250, e = 1 - (1 - t) ** 3;
    for(let i = 0; i < rays; i++){
        const a = rad(i * 360 / rays + 7 * (i % 2)), ra = r0 + (r1 - r0) * e * (0.75 + 0.25 * (i % 2));
        p.poly([
            [
                c + r0 * 0.5 * Math.cos(a + 0.18),
                c + r0 * 0.5 * Math.sin(a + 0.18)
            ],
            [
                c + ra * Math.cos(a),
                c + ra * Math.sin(a)
            ],
            [
                c + r0 * 0.5 * Math.cos(a - 0.18),
                c + r0 * 0.5 * Math.sin(a - 0.18)
            ]
        ], col, Math.max(3, 8 * (1 - t)));
    }
    if (t < 0.5) p.ell(c, c, r0 * (1.4 - t), r0 * (1.4 - t), WHITE, 8);
};
export const fxSplash = (p, t)=>{
    const c = 400, size = 800, rise = Math.sin(Math.min(1, t * 1.3) * Math.PI);
    const blue = "#bfe8ff", deep = "#6cc0f0";
    if (rise > 0.02) {
        const pts = [];
        for(let i = 0; i < 19; i++){
            const h = (i % 2 ? 260 : 130) * rise * (0.7 + 0.3 * Math.sin(i * 1.7));
            pts.push([
                c - 330 + 660 * i / 18,
                size - 120 - h
            ]);
        }
        p.poly([
            ...pts,
            [
                c + 330,
                size - 90
            ],
            [
                c - 330,
                size - 90
            ]
        ], blue, 10);
        p.ell(c, size - 100, 360, 46, deep, 10);
    }
    for(let i = 0; i < 8; i++){
        const a = rad(200 + i * 18), d = 120 + 380 * t, y = size - 160 + d * Math.sin(a) + 520 * t * t, r = 26 * (1 - t) + 6;
        if (t > 0.08 && y < size - 40) p.ell(c + d * Math.cos(a), y, r, r * 1.25, blue, 7);
    }
};
export const fxPuff = (p, t)=>{
    for(let i = 0; i < 5; i++){
        const a = rad(160 + i * 55), d = 40 + 70 * t, r = (34 + 20 * (i % 2)) * (1 - 0.6 * t);
        p.ell(150 + d * Math.cos(a), 180 + d * 0.45 * Math.sin(a), r, r * 0.8, `rgba(238,225,205,${(1 - t).toFixed(3)})`, 0);
    }
};
export const fxStars = (p, t)=>{
    for(let i = 0; i < 4; i++){
        const a = t * Math.PI * 2 + i * Math.PI / 2, x = 210 + 150 * Math.cos(a), y = 110 + 40 * Math.sin(a), pts = [];
        for(let k = 0; k < 10; k++){
            const r = k % 2 ? 14 : 34, b = rad(k * 36 - 90);
            pts.push([
                x + r * Math.cos(b),
                y + r * Math.sin(b)
            ]);
        }
        p.poly(pts, "#ffd84a", 6);
    }
};
export const fxCreak = (p, t)=>{
    const j = 6 * Math.sin(t * 40);
    for (const a of [
        -30,
        0,
        30
    ]){
        const b = rad(a - 90);
        p.stroke([
            [
                150 + 70 * Math.cos(b) + j,
                230 + 70 * Math.sin(b)
            ],
            [
                150 + 100 * Math.cos(b) + 10 + j,
                230 + 100 * Math.sin(b)
            ],
            [
                150 + 130 * Math.cos(b) + j,
                230 + 130 * Math.sin(b)
            ]
        ], 10);
    }
};
export const fxRing = (p, t)=>{
    const g = p.g;
    for(let k = 0; k < 3; k++){
        const u = t - k * 0.22;
        if (u <= 0 || u >= 1) continue;
        g.beginPath();
        g.ellipse(300, 300, 60 + 230 * u, 60 + 230 * u, 0, 0, Math.PI * 2);
        g.strokeStyle = k === 0 ? "#f6fcff" : "#cfe8fa";
        g.lineWidth = 9 * (1 - u) + 3;
        g.stroke();
    }
};
export const fxSign = (p)=>{
    const g = p.g, RED = "#d42f2f";
    p.poly(rrect(14, 14, 686, 506, 40), "#f6ecd2", 0);
    p.poly(rrect(14, 14, 686, 506, 40), null, 14);
    p.poly(rrect(70, 352, 630, 384, 8), "#8a5a3a", 9);
    g.beginPath();
    g.moveTo(112, 470);
    g.quadraticCurveTo(350, 300, 588, 470);
    g.strokeStyle = INK;
    g.lineWidth = 16;
    g.lineCap = "round";
    g.stroke();
    for (const x of [
        88,
        612
    ])p.poly(rrect(x - 16, 384, x + 16, 470, 4), "#8a5a3a", 9);
    for (const x of [
        150,
        278,
        406,
        534
    ]){
        p.poly(rrect(x - 30, 150, x + 30, 214, 14), "#357650", 9);
        p.stroke([
            [
                x - 8,
                210
            ],
            [
                x + 34,
                262
            ],
            [
                x + 46,
                338
            ]
        ], 15, INK);
        p.stroke([
            [
                x + 6,
                210
            ],
            [
                x - 12,
                274
            ],
            [
                x - 36,
                336
            ]
        ], 15, INK);
        p.poly(rrect(x + 30, 330, x + 74, 350, 9), INK, 0);
        p.poly(rrect(x - 52, 328, x - 8, 348, 9), INK, 0);
    }
    for (const [a, b] of [
        [
            [
                96,
                70
            ],
            [
                604,
                452
            ]
        ],
        [
            [
                604,
                70
            ],
            [
                96,
                452
            ]
        ]
    ]){
        p.stroke([
            a,
            b
        ], 58, "#ffffff");
        p.stroke([
            a,
            b
        ], 42, RED);
    }
};
export const fxCloud = (p, seed)=>{
    const blobs = [
        [
            150,
            190,
            80
        ],
        [
            250,
            150,
            105
        ],
        [
            360,
            160,
            95
        ],
        [
            450,
            195,
            70
        ],
        [
            300,
            210,
            90
        ]
    ];
    for (const [x, y, r] of blobs)p.ell(x + seed * 37 % 20 - 10, y, r, r * 0.8, "#ffffff", 0);
    p.ell(300, 235, 230, 40, "#ffffff", 0);
};
export const fxShadow = (p, col)=>{
    const g = p.g;
    g.fillStyle = WHITE;
    g.fillRect(0, 0, 128, 256);
    g.save();
    g.filter = "blur(9px)";
    const lg = g.createLinearGradient(0, 205, 0, 22);
    lg.addColorStop(0, mix(col, WHITE, 0.08));
    lg.addColorStop(0.55, mix(col, WHITE, 0.3));
    lg.addColorStop(1, mix(col, WHITE, 0.85));
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(40, 205);
    g.bezierCurveTo(36, 120, 46, 50, 64, 30);
    g.bezierCurveTo(82, 50, 92, 120, 88, 205);
    g.closePath();
    g.fill();
    g.fillStyle = col;
    g.beginPath();
    g.ellipse(64, 205, 30, 17, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
};
export const fxContact = (p, col)=>{
    const g = p.g;
    g.fillStyle = WHITE;
    g.fillRect(0, 0, 128, 128);
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const [r, k] of [
        [
            0,
            0
        ],
        [
            0.32,
            0.02
        ],
        [
            0.5,
            0.22
        ],
        [
            0.66,
            0.58
        ],
        [
            0.82,
            0.88
        ],
        [
            1,
            1
        ]
    ])gr.addColorStop(r, mix(col, WHITE, k));
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
};
export const fxPlank = (p)=>{
    p.poly(rrect(14, 30, 306, 78, 10), "#a8744a", 9);
    p.line([
        [
            40,
            46
        ],
        [
            150,
            44
        ],
        [
            270,
            50
        ]
    ], "#7d5234", 4);
    p.line([
        [
            60,
            62
        ],
        [
            200,
            64
        ],
        [
            284,
            60
        ]
    ], "#7d5234", 4);
    p.dot(36, 54, 5, INK);
    p.dot(284, 54, 5, INK);
};
export const fxDrum = (p)=>{
    p.poly(rrect(40, 70, 220, 190, 16), "#f1ece0", 9);
    p.poly(rrect(32, 58, 228, 86, 12), "#c9373a", 8);
    p.poly(rrect(32, 176, 228, 204, 12), "#c9373a", 8);
    p.line([
        [
            52,
            88
        ],
        [
            82,
            172
        ],
        [
            112,
            88
        ],
        [
            142,
            172
        ],
        [
            172,
            88
        ],
        [
            202,
            172
        ]
    ], INK, 6);
    p.ell(130, 58, 98, 18, "#f7f3ea", 8);
};
export const fxBlob = (p, col)=>{
    const g = p.g;
    g.fillStyle = WHITE;
    g.fillRect(0, 0, 128, 128);
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    for (const [r, k] of [
        [
            0,
            0
        ],
        [
            0.5,
            0.04
        ],
        [
            0.64,
            0.18
        ],
        [
            0.76,
            0.42
        ],
        [
            0.87,
            0.72
        ],
        [
            0.95,
            0.92
        ],
        [
            1,
            1
        ]
    ])gr.addColorStop(r, mix(col, WHITE, k));
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
};
FACE.sad = { eye: ["lid", "lid"], brow: [-6, 3], mouth: "frown" };
FACE.cry = { eye: ["squeeze", "squeeze"], brow: [-6, 3], mouth: "wave" };
FACE.sob = { eye: ["squeeze", "squeeze"], brow: [-6, 3], mouth: "O" };
FACE.snore = { eye: ["dash", "dash"], brow: [0, -1], mouth: "o" };
FACE.stubborn = { eye: ["lid", "lid"], brow: [4, -3], mouth: "frown" };
FACE.squint = { eye: ["slit", "slit"], brow: [3, -2], mouth: "dash" };
// lip-sync variants: expr_t1..expr_t3 keep eyes/brows, replace the mouth
for (const k of Object.keys(FACE)) for (const lv of [1, 2, 3]) FACE[k + "_t" + lv] = { ...FACE[k], mouth: "talk" + lv };

// ---------------- Roman-era cast (our own designs), built on the Pen / blob / face helpers above ----------------
const STEEL = "#aeb6bf", BRASS = "#d9a845", LEATHER = "#7a4a2a";
export const OUTFITS = {
  legion: { tunic: "#b8322f", cape: "#8f2228", skin: SKIN, helmet: true, armor: true, spear: true, shield: true },
  old: { tunic: "#9c4a3c", cape: "#6e3330", skin: "#f3d6bb", helmet: "old", armor: true, spear: true, shield: false, beard: "#f4f1ea", brows: "#f4f1ea" },
  toga: { tunic: "#f1ead8", skin: "#f5c9a0", toga: "#6b3c8f", hair: "#3b2a20", stout: true },
  civA: { tunic: "#4f7fb8", skin: "#f5c9a0", hair: "#5a3b2a" },
  civB: { tunic: "#d9a441", skin: SKIN, hair: "#2b211c", dress: "#c25a7a" },
  civC: { tunic: "#5d8a3a", skin: "#c99067", hair: "#1e1714", stout: true },
  workA: { tunic: "#8a5d3b", skin: "#f5c9a0", cap: "#c2733a", apron: "#d8c9a6" },
  workB: { tunic: "#3f6a6f", skin: "#ecd0b6", cap: "#5b4a8a", moustache: "#4a3020" },
  // ---- "Otw" cast ----
  komik: { tunic: "#f2b632", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#2f3d63", pants: "#2f3d63" },
  handuk: { tunic: "#e8b48a", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#e8b48a", towel: "#7fc7d9", bare: true, wet: true },
  rapi: { tunic: "#d8453b", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#3a3a46", pants: "#3a3a46", sweat: true },
  batik: { tunic: "#8a4b22", skin: "#e8b48a", hair: "#2a1d18", arms: "#8a4b22", legs: "#2b2f3a", pants: "#2b2f3a", batik: "#e2b04a" },
  batikRun: { tunic: "#8a4b22", skin: "#e8b48a", hair: "#2a1d18", arms: "#8a4b22", legs: "#2b2f3a", pants: "#2b2f3a", batik: "#e2b04a", sweat: true },
  pengantin: { tunic: "#f4f1ea", skin: "#e8b48a", hair: "#2a1d18", arms: "#f4f1ea", legs: "#f4f1ea", pants: "#f4f1ea", peci: true, gold: true },
  tante: { tunic: "#b83a7a", skin: "#f0c49c", hair: "#2b211c", arms: "#b83a7a", dress: "#b83a7a", bun: true, glasses: true, kebaya: "#f2c14e" },
  istri: { tunic: "#f3e6c8", skin: "#f0c8a0", hair: "#2b211c", arms: "#f3e6c8", dress: "#f3e6c8", bun: true, crown: true },
  pejuang: { tunic: "#efe9d8", skin: "#d9a07a", hair: "#2a1d18", arms: "#efe9d8", legs: "#6b5a3a", pants: "#6b5a3a", peci: true, ikat: true },
  kartini: { tunic: "#f6f1e6", skin: "#dfa984", hair: "#1c1410", arms: "#f6f1e6", dress: "#7a4f2c", bun: true, kebaya: "#e3d6bd" },
  bayi: { tunic: "#bfe3ff", skin: "#f2c6a0", hair: "#2a1d18", arms: "#bfe3ff", legs: "#bfe3ff" },
  galau: { tunic: "#7d8496", skin: "#e8b48a", hair: "#2a1d18", arms: "#7d8496", legs: "#2b2f3a", pants: "#2b2f3a" },
  santai: { tunic: "#e2574c", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#e8b48a", pants: "#3a5a8a" },
  zainuddin: { tunic: "#efe6d2", skin: "#e8b48a", hair: "#2a1d18", arms: "#efe6d2", legs: "#3a3a46", pants: "#3a3a46", peci: true },
  santaiSweat: { tunic: "#e2574c", skin: "#e8b48a", hair: "#2a1d18", arms: "#e8b48a", legs: "#e8b48a", pants: "#3a5a8a", sweat: true },
  hrd: { tunic: "#3a3f52", skin: "#f0c49c", hair: "#2b211c", arms: "#3a3f52", dress: "#3a3f52", bun: true, glasses: true },
  genit: { tunic: "#ff7ab8", skin: "#f2c6a0", hair: "#3a2418", arms: "#f2c6a0", dress: "#ff7ab8", bun: true },
  bule: { tunic: "#3a8fd5", skin: "#f6d8c4", hair: "#f2c94c", arms: "#f6d8c4", dress: "#3a8fd5", bun: true },
  darman: { tunic: "#6a3418", skin: "#dca27a", hair: "#4e4844", arms: "#6a3418", legs: "#2b2f3a", pants: "#2b2f3a", batik: "#e2b04a", moustache: "#3a2a20" },
  flanel: { tunic: "#b0303a", skin: "#e8b48a", hair: "#1c1410", arms: "#b0303a", legs: "#2b3a5a", pants: "#2b3a5a", plaid: "#5a1420" },
  sarung: { tunic: "#f4f1ea", skin: "#d9a07a", hair: "#3a2418", arms: "#d9a07a", legs: "#d9a07a", sarung: "#2f6a8a", plaid: "#173e58", peci: true },
  gunungA: { tunic: "#2f6a4a", skin: "#d9a07a", hair: "#3a2418", arms: "#2f6a4a", legs: "#3a3f52", pants: "#3a3f52", jacket: "#f2b632", peci: true },
  gunungU: { tunic: "#d8453b", skin: "#d9a07a", hair: "#3a2418", arms: "#d8453b", legs: "#7a6040", pants: "#7a6040", jacket: "#2b2f3a", bedhead: true },
  ujang: { tunic: "#d8743a", skin: "#c99067", hair: "#1e1714", arms: "#d8743a", legs: "#3a3f52", pants: "#3a3f52", cap: "#2f6a8a", moustache: "#2a1d18", apron: "#2f6a4a", neckTowel: "#f4f1ea" },
  ibuPasar: { tunic: "#b83a7a", skin: "#f0c49c", hair: "#2b211c", arms: "#b83a7a", dress: "#b83a7a", bun: true, glasses: true, kebaya: "#f2c14e", sash: "#8a4b22" },
  darmanJeans: { tunic: "#3a5f95", skin: "#dca27a", hair: "#4e4844", arms: "#3a5f95", legs: "#2b2f3a", pants: "#2b2f3a", moustache: "#3a2a20", zipJacket: true, motoHelm: "#f4f1ea" },
  ibuGamis: { tunic: "#2f6a4a", skin: "#f0c49c", hair: "#2b211c", arms: "#2f6a4a", dress: "#2f6a4a", bun: true, glasses: true, kebaya: "#e2c27a", motoHelm: "#ff8ac0" },
  asepMartabak: { tunic: "#d8322f", skin: "#d9a07a", hair: "#3a2418", arms: "#d9a07a", legs: "#3a3f52", pants: "#3a3f52", apron: "#f4f1ea", headband: "#f4f1ea" },
  darmanKoko: { tunic: "#f4f1ea", skin: "#dca27a", hair: "#4e4844", arms: "#f4f1ea", legs: "#2b2f3a", pants: "#2b2f3a", moustache: "#3a2a20", koko: "#b08a3a", glassesUp: true },
  asepHoodie: { tunic: "#8a8f98", skin: "#d9a07a", hair: "#3a2418", arms: "#8a8f98", legs: "#2b3a5a", pants: "#2b3a5a", hoodie: "#f4f1ea" },
  ibuDasterUngu: { tunic: "#8a4fc0", skin: "#f0c49c", hair: "#2b211c", arms: "#f0c49c", dress: "#8a4fc0", bun: true, glasses: true, kebaya: "#ffffff", floral: "#f7c6e8" },
  asepParkir: { tunic: "#3a5a8a", skin: "#d9a07a", hair: "#3a2418", arms: "#d9a07a", legs: "#3a3f52", pants: "#3a3f52", cap: "#22304a", vest: "#ff7a1a", whistle: "#d8322f" },
  darmanMotor: { tunic: "#6a4128", skin: "#dca27a", hair: "#4e4844", arms: "#6a4128", legs: "#2b2f3a", pants: "#2b2f3a", moustache: "#3a2a20", zipJacket: true, motoHelm: "#c0302c" },
  ujangGorengan: { tunic: "#f0ece2", skin: "#c99067", hair: "#1e1714", arms: "#c99067", legs: "#3a3f52", pants: "#3a3f52", moustache: "#2a1d18", apron: "#8a5a2a", neckTowel: "#e8742c" },
  asepKoki: { tunic: "#f4f1ea", skin: "#d9a07a", hair: "#3a2418", arms: "#d9a07a", legs: "#3a3f52", pants: "#3a3f52", apron: "#e8742c", chefHat: true },
  ibuDaster: { tunic: "#3a8fd5", skin: "#f0c49c", hair: "#2b211c", arms: "#f0c49c", dress: "#3a8fd5", bun: true, glasses: true, kebaya: "#ffffff" },
  codyCowboy: { tunic: "#7fa8d0", skin: "#d9a07a", hair: "#3a2418", arms: "#7fa8d0", legs: "#2b3a5a", pants: "#2b3a5a", neckTowel: "#c0302c", cowboy: "#8a5a2a" },
  frankLawn: { tunic: "#3f8a4a", skin: "#dca27a", hair: "#4e4844", arms: "#dca27a", legs: "#dca27a", pants: "#d8c9a6", moustache: "#3a2a20", koko: "#2a5a32", cap: "#c0302c" },
  frankLawnBare: { tunic: "#3f8a4a", skin: "#dca27a", hair: "#4e4844", arms: "#dca27a", legs: "#dca27a", pants: "#d8c9a6", moustache: "#3a2a20", koko: "#2a5a32" },
  lindaRobe: { tunic: "#9fc8e8", skin: "#f0c49c", hair: "#2b211c", arms: "#9fc8e8", dress: "#9fc8e8", glasses: true, kebaya: "#f4f1ea", curlers: "#ff8ac0" },
  teman: { tunic: "#8fa8d8", skin: "#d9a07a", hair: "#3a2418", arms: "#8fa8d8", legs: "#8fa8d8", stripes: "#5f7bb5", bedhead: true },
};

/** galea: iron bowl, brass brow band, cheek guards, transverse red crest */
const galea = (p, H, cx, hc, light, thick, ow, old, u) => {
  const crest = old ? "#8d4b3f" : "#d2372f", bowl = old ? "#8f8a7e" : STEEL;
  // crest (behind the bowl top)
  const cy0 = hc - H.b * 0.98;
  const cr = ellPts(cx, cy0, 0.66 * 2 * H.a, 0.42 * 2 * H.b, 180, 360, 0, 40);
  cr.push([cx + 0.66 * 2 * H.a * 0.98, cy0 + 4 * u], [cx - 0.66 * 2 * H.a * 0.98, cy0 + 4 * u]);
  const crP = [...ellPts(cx, cy0 + 2 * u, 0.62 * 2 * H.a, 0.36 * 2 * H.b, 180, 360, 0, 40)];
  p.shadedFill(crP, crest, mul(crest, [0.7, 0.62, 0.7]), light, 0.62 * 2 * H.a, 0.3);
  p.clip(crP, () => { for (let i = -9; i <= 9; i++) p.stroke([[cx + i * 7.4 * u, cy0], [cx + i * 9.4 * u, cy0 - 0.62 * H.b * Math.cos(i / 11)]], 1.4 * u, mul(crest, [0.62, 0.55, 0.62])); });
  if (old) p.clip(crP, () => { for (let i = 0; i < 6; i++) p.ell(cx + (i - 3) * 22 * u, cy0 - 18 * u - (i % 2) * 10 * u, 9 * u, 5 * u, "#6f6a5e", 0); });
  p.inkRing(crP, ow * 0.85, thick);
  p.poly(rrect(cx - 10 * u, cy0 - 6 * u, cx + 10 * u, cy0 + 6 * u, 3 * u), BRASS, 2 * u);
  // bowl: upper head cap
  const bandY = hc - H.b * 0.42;
  const bp = ellPts(cx, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
  p.shadedFill(bp, bowl, mul(bowl, [0.62, 0.64, 0.72]), light, H.a, 0.4);
  p.clip(bp, () => {
    p.stroke(ellPts(cx - 20 * u, bandY - 0.3 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 300, 0, 16), 4 * u, "#ffffff55");
    if (old) for (let i = 0; i < 9; i++) p.ell(cx + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (3 + (i % 3) * 2) * u, (2 + (i % 2)) * u, "#8a4b22", 0);
  });
  p.inkRing(bp, ow * 0.9, thick);
  p.band([[cx - H.a * 1.04, bandY], [cx + H.a * 1.04, bandY]], old ? "#a88a4a" : BRASS, 7 * u, 1.8 * u, "round");
  for (const s of [-1, 1]) p.dot(cx + s * 0.55 * H.a, bandY, 2.2 * u, "#fff3c4");
};
const cheeks = (p, H, cx, hc, light, ow, old, u) => {
  const bowl = old ? "#8f8a7e" : STEEL;
  for (const s of [-1, 1]) {
    const x0 = cx + s * 0.78 * H.a, x1 = cx + s * 1.07 * H.a, y0 = hc - H.b * 0.42, y1 = hc + H.b * 0.48;
    const pts = [[x0, y0], [x1, y0], [x1 - s * 0.04 * H.a, y1 - 0.1 * H.b], [x0 + s * 0.06 * H.a, y1], [x0 - s * 0.05 * H.a, (y0 + y1) / 2]];
    p.shadedFill(pts, bowl, mul(bowl, [0.62, 0.64, 0.72]), light, 0.2 * H.a, 0.3);
    p.poly(pts, null, ow * 0.8);
    p.dot((x0 + x1) / 2, (y0 + y1) / 2 - 0.05 * H.b, 2.2 * u, BRASS);
  }
};
const cobweb = (p, cx, cy, r, u) => {
  const g = p.g; g.save(); g.globalAlpha = 0.8;
  for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 6); p.stroke([[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], 1.1 * u, "#f2f2f2"); }
  for (let k = 1; k <= 4; k++) { const rr = r * k / 4.3, pts = []; for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.05 + 0.9 * i / 6); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } p.stroke(pts, 1 * u, "#f2f2f2"); }
  g.restore();
};

/** front-facing Roman-era character. opts: expr, blink, look, facing, seed, L/R arm poses, tilt, headTilt, bob, nohelmet, light */
export const romanFront = (p, key, opts = {}) => {
  const O = typeof key === "string" ? OUTFITS[key] : key;
  const { expr = "neutral", blink = 0, look = 0, facing = 0, seed = 3, L = "hang", R = O.spear ? "spear" : "hang", tilt = 0, headTilt = 0,
    bob = 0, nohelmet = false, light = rad(-120), web = false, step = 0 } = opts;
  const lid = lidOf(blink), skin = O.skin ?? SKIN;
  const H = headBlob(seed, 118, facing), W = 2 * H.a, HH = 2 * H.b, u = W / 100;
  const torsoL = O.stout ? 1.12 : 1.08, legsL = 1.38, sole = 975;
  const torsoBot = sole - legsL * HH - bob * HH, chin = torsoBot - torsoL * HH, hc = chin - H.b, hipY = torsoBot - 0.12 * HH;
  const thick = thickAngle(light), ow = 5 * u, cx = 300;
  const legCol = O.legs ?? mix(O.tunic, INK, 0.62), armCol = O.arms ?? mix(O.tunic, INK, 0.5);
  const helmet = !!O.helmet && !nohelmet, old = O.helmet === "old";
  p.rot = null;
  // ---- cape behind everything ----
  if (O.cape) {
    const cp = [[cx - 0.48 * W, chin + 0.08 * HH], [cx + 0.48 * W, chin + 0.08 * HH], [cx + 0.62 * W, sole - 0.55 * HH], [cx + 0.2 * W, sole - 0.45 * HH], [cx - 0.2 * W, sole - 0.5 * HH], [cx - 0.62 * W, sole - 0.55 * HH]];
    p.gradFill(cp, O.cape, mul(O.cape, [0.6, 0.6, 0.7]), light); p.inkRing(cp, ow * 0.8, thick);
  }
  // ---- legs ----
  const dress = !!O.dress;
  for (const side of [-1, 1]) {
    const up = Math.max(0, Math.sin(Math.PI * 2 * (step + (side > 0 ? 0.5 : 0)))) * 30 * (step ? 1 : 0);
    const hx = cx + side * 16 * u, fx = cx + side * 22 * u, fy = sole - 4 * u - up;
    p.stroke(curve([hx, hipY], [(hx + fx) / 2 + side * 2 * u, (hipY + fy) / 2], [fx, fy]), 5.8 * u, legCol);
    const sandal = O.helmet ? LEATHER : "#5a3b2a";
    p.stroke([[fx - side * 3 * u, fy], [fx + side * 13 * u, fy + 0.5 * u]], 7.5 * u + 3, INK);
    p.stroke([[fx - side * 3 * u, fy], [fx + side * 13 * u, fy + 0.5 * u]], 7.5 * u, sandal);
    if (O.helmet) for (let k = 1; k <= 3; k++) p.stroke([[fx - 4 * u, fy - k * 0.07 * HH], [fx + 4 * u, fy - k * 0.07 * HH - 2 * u]], 2 * u, LEATHER);
  }
  // ---- upper body ----
  p.rot = tilt ? [rad(tilt), cx, hipY] : null;
  const T = { a: (0.4 * W) / 1.06 * (O.stout ? 1.12 : 1), b: 0.5 * (torsoBot - (chin - 0.25 * HH)), nTop: 2.2, nBot: 2.6, egg: O.stout ? 0.17 : 0.12, asym: 0.04 * facing, rot: 0, noise: 0.006, seed: seed + 7 };
  const tcx = cx + 3 * u * facing, tcy = torsoBot - T.b, tp = blobPts(tcx, tcy, T);
  const S = (side) => [tcx + side * 0.85 * T.a, chin + 0.12 * HH];
  const arm = (side, pose) => {
    const s = S(side), X = (k) => tcx + side * (T.a * 1.1 + k * u);
    switch (pose) {
      case "spear": return { pts: [s, [X(6), s[1] + 0.42 * HH], [X(10), s[1] + 0.2 * HH]], front: false };
      case "point": return { pts: [s, [X(28), s[1] - 0.02 * HH], [X(62), s[1] - 0.1 * HH]], front: false, finger: true };
      case "up": return { pts: [s, [X(14), s[1] - 0.3 * HH], [X(22), s[1] - 0.75 * HH]], front: false };
      case "wave": return { pts: [s, [X(16), s[1] - 0.2 * HH], [X(30 + 10 * Math.sin(opts.wv || 0)), s[1] - 0.62 * HH]], front: false };
      case "hip": return { pts: [s, [X(22), s[1] + 0.3 * HH], [tcx + side * T.a * 0.95, torsoBot - 0.3 * HH]], front: false };
      case "belly": return { pts: [s, [X(8), s[1] + 0.45 * HH], [tcx + side * 0.25 * T.a, torsoBot - 0.35 * HH]], front: true };
      case "temple": return { pts: [s, [X(26), s[1] + 0.05 * HH], [cx + side * (H.a + 16 * u), hc - 0.1 * HH]], front: false, swirl: true };
      case "lift": return { pts: [s, [X(20), s[1] - 0.25 * HH], [X(4), s[1] - 0.82 * HH]], front: false };
      case "shield": return { pts: [s, [X(4), s[1] + 0.4 * HH], [tcx + side * 0.6 * T.a, torsoBot - 0.1 * HH]], front: true };
      case "cross": return { pts: [s, [X(2), s[1] + 0.38 * HH], [tcx - side * 0.45 * T.a, s[1] + 0.32 * HH]], front: true };
      case "reach": { const lf = (opts.lift || 0) * 0.62 * HH; return { pts: [s, [X(42), s[1] - 0.12 * HH - lf * 0.6], [X(82), s[1] - 0.5 * HH - lf]], front: false }; }
      case "cheek": return { pts: [s, [X(16), s[1] + 0.05 * HH], [cx + side * (H.a + 2 * u), hc + 0.25 * H.b]], front: false };
      case "mic": return { pts: [s, [X(8), s[1] + 0.4 * HH], [cx + side * 0.25 * H.a + 6 * u * facing, hc + 1.05 * H.b]], front: true, mic: true };
      case "phone": return { pts: [s, [X(18), s[1] + 0.1 * HH], [cx + side * (H.a + 4 * u), hc + 0.15 * H.b]], front: false, phone: true };
      case "text": return { pts: [s, [X(2), s[1] + 0.4 * HH], [tcx + side * 0.22 * T.a, chin + 0.42 * HH]], front: true, text: true };
      case "pray": return { pts: [s, [X(0), s[1] + 0.38 * HH], [tcx + side * 0.05 * T.a, chin + 0.3 * HH]], front: true };
      case "shrug": return { pts: [s, [X(18), s[1] + 0.3 * HH], [X(40), s[1] + 0.02 * HH]], front: false, palm: true };
      case "sock": return { pts: [s, [X(20), s[1] - 0.25 * HH], [X(10), s[1] - 0.7 * HH]], front: false, sock: true };
      case "salute": return { pts: [s, [X(26), s[1] - 0.05 * HH], [cx + side * (H.a * 0.55), hc - 0.45 * H.b]], front: false, palm: true };
      case "wallet": return { pts: [s, [X(6), s[1] + 0.36 * HH], [tcx + side * 0.15 * T.a, chin + 0.4 * HH]], front: true, wallet: true };
      case "violin": return { pts: [s, [X(26), s[1] + 0.06 * HH], [X(50), s[1] - 0.2 * HH]], front: true, violin: true };
      case "bow": { const b = Math.sin(opts.bw || 0); return { pts: [s, [X(26), s[1] + 0.34 * HH], [X(4 + 30 * b), s[1] + 0.2 * HH - b * 0.04 * HH]], front: true, bow: true }; }
      case "violinDown": return { pts: [s, [X(6), s[1] + 0.42 * HH], [X(6), chin + 0.98 * HH]], front: false, fiddleDown: true };
      case "thumb": return { pts: [s, [X(20), s[1] + 0.12 * HH], [X(44), s[1] - 0.12 * HH]], front: false, thumb: true };
      default: return { pts: [s, [X(4), s[1] + 0.48 * HH], [X(3), chin + 1.04 * HH]], front: false };
    }
  };
  const arms = [arm(-1, L), arm(1, R)];
  const drawArm = (a) => {
    p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 5.2 * u, armCol);
    const [hx, hy] = a.pts[2];
    p.dot(hx, hy, 5.5 * u);
    if (a.finger) { const dx = a.pts[2][0] - a.pts[1][0], dy = a.pts[2][1] - a.pts[1][1], l = Math.hypot(dx, dy); p.stroke([[hx, hy], [hx + dx / l * 14 * u, hy + dy / l * 14 * u]], 2.6 * u); }
    if (a.thumb) p.stroke([[hx, hy], [hx + Math.sign(hx - cx) * 6 * u, hy - 12 * u]], 2.6 * u);
    if (a.wallet) { p.poly(rrect(hx - 20 * u, hy - 12 * u, hx + 20 * u, hy + 14 * u, 4 * u), "#6b3f22", 2.2 * u); p.stroke([[hx - 20 * u, hy], [hx + 20 * u, hy]], 1.4 * u, "#3a2414"); }
    if (a.violin) { const B = [cx - 0.42 * H.a, chin + 0.17 * HH], ang = Math.atan2(hy - B[1], hx - B[0]), L = Math.hypot(hx - B[0], hy - B[1]), g = p.g;
      g.save(); g.translate(B[0], B[1]); g.rotate(ang);
      p.band([[24 * u, 0], [L + 6 * u, 0]], "#2a1a12", 8 * u, 1.6 * u);
      p.ell(L + 10 * u, 0, 7 * u, 6 * u, "#5a3018", 1.8 * u);
      p.poly([...ellPts(-20 * u, 0, 24 * u, 26 * u, 0, 360, 0, 28)], "#b0561f", 2.2 * u); p.poly([...ellPts(16 * u, 0, 19 * u, 20 * u, 0, 360, 0, 24)], "#b0561f", 2.2 * u);
      p.poly(rrect(-22 * u, -15 * u, 18 * u, 15 * u, 4 * u), "#b0561f", 0);
      p.ell(-26 * u, -6 * u, 8 * u, 6 * u, "#d98a4a", 0);
      for (const sy of [-1, 1]) p.stroke([[-6 * u, sy * 11 * u], [-12 * u, sy * 7 * u], [-4 * u, sy * 3 * u]], 1.6 * u);
      p.band([[-36 * u, 0], [-24 * u, 0]], "#2a1a12", 6 * u, 0);
      for (let i = -1.5; i <= 1.5; i++) p.stroke([[-36 * u, i * 1.6 * u], [L + 2 * u, i * 1.3 * u]], 0.6 * u, "#f4e6c0");
      g.restore(); p.dot(hx, hy, 5.5 * u, armCol); }
    if (a.bow) { const B = [cx - 0.42 * H.a + 6 * u, chin + 0.17 * HH], dx = B[0] - hx, dy = B[1] - hy, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, e = [hx + ux * 150 * u, hy + uy * 150 * u], s0 = [hx - ux * 14 * u, hy - uy * 14 * u];
      p.stroke([s0, e], 3 * u, "#4a2a16"); p.stroke([[s0[0] + uy * 4 * u, s0[1] - ux * 4 * u], [e[0] + uy * 1.5 * u, e[1] - ux * 1.5 * u]], 1.4 * u, "#f4f1ea"); p.dot(hx, hy, 5.5 * u, armCol); }
    if (a.fiddleDown) { const g = p.g; g.save(); g.translate(hx, hy); g.rotate(-1.35);
      p.band([[16 * u, 0], [70 * u, 0]], "#2a1a12", 7 * u, 1.4 * u); p.ell(-14 * u, 0, 20 * u, 22 * u, "#b0561f", 2 * u); p.ell(16 * u, 0, 16 * u, 17 * u, "#b0561f", 2 * u); p.poly(rrect(-14 * u, -13 * u, 14 * u, 13 * u, 3 * u), "#b0561f", 0); g.restore(); p.dot(hx, hy, 5.5 * u, armCol); }
    if (a.palm) { const sd = Math.sign(hx - cx); p.ell(hx + sd * 4 * u, hy - 4 * u, 7 * u, 5 * u, armCol, 2 * u); }
    if (a.phone) { p.poly(rrect(hx - 7 * u, hy - 20 * u, hx + 7 * u, hy + 14 * u, 3 * u), "#2b2f3a", 2.2 * u); p.poly(rrect(hx - 4.5 * u, hy - 17 * u, hx + 4.5 * u, hy + 10 * u, 2 * u), "#8fd3ff", 0); p.dot(hx, hy, 5 * u, armCol); }
    if (a.sock) { const sk = [[hx - 6 * u, hy - 4 * u], [hx + 6 * u, hy - 4 * u], [hx + 7 * u, hy + 34 * u], [hx + 24 * u, hy + 40 * u], [hx + 24 * u, hy + 52 * u], [hx - 4 * u, hy + 50 * u], [hx - 7 * u, hy + 40 * u]];
      p.poly(sk, "#f4f1ea", 2.2 * u); p.band([[hx - 6 * u, hy + 4 * u], [hx + 6 * u, hy + 4 * u]], "#d8453b", 4 * u, 0); p.band([[hx - 6.5 * u, hy + 12 * u], [hx + 6.5 * u, hy + 12 * u]], "#d8453b", 4 * u, 0); p.dot(hx, hy, 5.5 * u, armCol); }
  };
  // spear behind
  if (O.spear && R === "spear") {
    const [hx, hy] = arms[1].pts[2], s0 = [hx + 2 * u, sole - 2 * u], s1 = [hx - 3 * u, 70];
    p.band([s0, s1], old ? "#6d5236" : "#8a5a34", 4.2 * u, 1.4 * u, "round");
    const tip = [[s1[0] - 7 * u, s1[1] + 6 * u], [s1[0], s1[1] - 34 * u], [s1[0] + 7 * u, s1[1] + 6 * u], [s1[0], s1[1] + 14 * u]];
    p.poly(tip, old ? "#8b7c6a" : "#c9cfd6", 2 * u);
    if (web) cobweb(p, s1[0] - 2 * u, s1[1] + 60 * u, 70 * u, u);
  }
  for (const a of arms) if (!a.front) drawArm(a);
  // torso
  if (dress) {
    const D = { a: 0.5 * W * 0.98, b: 0.5 * ((sole - 0.35 * HH) - (chin - 0.2 * HH)), nTop: 2.0, nBot: 3.0, egg: 0.35, asym: 0, rot: 0, noise: 0.006, seed: seed + 9 };
    const dp = blobPts(cx, sole - 0.35 * HH - D.b, D);
    p.gradFill(dp, O.dress, mul(O.dress, SH_CLOTH), light); p.inkRing(dp, ow, thick);
  }
  // skirt / pteruges below the torso
  if (O.pants) { // shorts / trousers top part
    const sk = [[tcx - 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 0.95 * T.a, torsoBot + 0.34 * HH], [tcx + 0.06 * T.a, torsoBot + 0.34 * HH], [tcx, torsoBot + 0.12 * HH], [tcx - 0.06 * T.a, torsoBot + 0.34 * HH], [tcx - 0.95 * T.a, torsoBot + 0.34 * HH]];
    p.gradFill(sk, O.pants, mul(O.pants, SH_CLOTH), light); p.poly(sk, null, ow * 0.8);
  } else if (O.towel) {
    const sk = [[tcx - 0.98 * T.a, torsoBot - 0.24 * HH], [tcx + 0.98 * T.a, torsoBot - 0.24 * HH], [tcx + 1.1 * T.a, torsoBot + 0.62 * HH], [tcx - 1.1 * T.a, torsoBot + 0.62 * HH]];
    p.gradFill(sk, O.towel, mul(O.towel, SH_CLOTH), light);
    p.clip(sk, () => { for (let i = 0; i < 3; i++) p.band([[tcx - 1.2 * T.a, torsoBot + (0.12 + i * 0.18) * HH], [tcx + 1.2 * T.a, torsoBot + (0.12 + i * 0.18) * HH]], "#ffffff88", 3 * u, 0);
      p.stroke([[tcx + 0.45 * T.a, torsoBot - 0.24 * HH], [tcx + 0.3 * T.a, torsoBot + 0.6 * HH]], 2 * u, mul(O.towel, [0.7, 0.7, 0.8])); });
    p.poly(sk, null, ow * 0.8);
  } else if (O.sarung) {
    const sk = [[tcx - 0.98 * T.a, torsoBot - 0.24 * HH], [tcx + 0.98 * T.a, torsoBot - 0.24 * HH], [tcx + 1.12 * T.a, sole - 0.3 * HH], [tcx - 1.12 * T.a, sole - 0.3 * HH]];
    p.gradFill(sk, O.sarung, mul(O.sarung, SH_CLOTH), light);
    p.clip(sk, () => { for (let i = -5; i <= 5; i++) p.band([[tcx + i * 0.32 * T.a, torsoBot - 0.3 * HH], [tcx + i * 0.32 * T.a, sole]], O.plaid, 4 * u, 0);
      for (let k = 0; k < 7; k++) p.band([[tcx - 1.3 * T.a, torsoBot + (k * 0.2) * HH], [tcx + 1.3 * T.a, torsoBot + (k * 0.2) * HH]], O.plaid, 4 * u, 0);
      p.band([[tcx - 1.3 * T.a, torsoBot - 0.12 * HH], [tcx + 1.3 * T.a, torsoBot - 0.12 * HH]], "#e2b04a", 6 * u, 0); });
    p.poly(sk, null, ow * 0.8);
  } else if (!dress) {
    const sk = [[tcx - 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 0.92 * T.a, torsoBot - 0.2 * HH], [tcx + 1.0 * T.a, torsoBot + 0.3 * HH], [tcx - 1.0 * T.a, torsoBot + 0.3 * HH]];
    p.gradFill(sk, O.tunic, mul(O.tunic, SH_CLOTH), light); p.poly(sk, null, ow * 0.8);
    if (O.armor) for (let i = -3; i <= 3; i++) { const x = tcx + i * 0.27 * T.a, st = [[x - 9 * u, torsoBot - 0.05 * HH], [x + 9 * u, torsoBot - 0.05 * HH], [x + 9 * u, torsoBot + 0.22 * HH], [x - 9 * u, torsoBot + 0.22 * HH]]; p.poly(st, old ? "#5e4632" : LEATHER, 1.6 * u); }
  }
  p.gradFill(tp, O.tunic, mul(O.tunic, O.bare ? SH_SKIN : SH_CLOTH), light);
  p.clip(tp, () => {
    if (O.armor) {
      const top = chin - 0.1 * HH, bot = torsoBot - 0.25 * HH, n = 5;
      for (let i = 0; i < n; i++) {
        const y0 = top + (bot - top) * i / n, y1 = top + (bot - top) * (i + 1) / n;
        const c = old ? (i % 2 ? "#8d8679" : "#9a9384") : (i % 2 ? "#a7b0ba" : "#bcc4cc");
        p.poly([[tcx - 1.5 * T.a, y0], [tcx + 1.5 * T.a, y0 + 3 * u], [tcx + 1.5 * T.a, y1 + 3 * u], [tcx - 1.5 * T.a, y1]], c, 1.8 * u);
      }
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.2 * HH], [tcx + 1.4 * T.a, torsoBot - 0.2 * HH]], LEATHER, 0.08 * HH, 1.5 * u);
      for (let i = -2; i <= 2; i++) p.dot(tcx + i * 0.3 * T.a, torsoBot - 0.2 * HH, 2.4 * u, BRASS);
      if (old) for (let i = 0; i < 5; i++) p.ell(tcx + Math.sin(i * 1.7) * 0.7 * T.a, top + (bot - top) * ((i * 0.31) % 1), 6 * u, 3 * u, "#8a4b22", 0);
    } else if (O.jacket) {
      p.band([[tcx - 1.4 * T.a, chin + 0.1 * HH], [tcx + 1.4 * T.a, chin + 0.1 * HH]], O.jacket, 0.17 * HH, 0);          // contrast shoulder yoke
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.05 * HH], [tcx + 1.4 * T.a, torsoBot - 0.05 * HH]], O.jacket, 0.07 * HH, 1.2 * u); // hem
      p.band([[tcx, chin + 0.02 * HH], [tcx, torsoBot + 0.02 * HH]], "#1e1a18", 3.2 * u, 0);                             // zipper
      for (let i = 0; i < 9; i++) { const y = chin + (0.08 + i * 0.1) * HH; p.band([[tcx - 4 * u, y], [tcx + 4 * u, y]], "#8a8a8a", 1.4 * u, 0); }
      p.dot(tcx + 5 * u, chin + 0.3 * HH, 3.4 * u, "#d8d8d8");                                                          // zipper pull
      for (const sd of [-1, 1]) p.poly([[tcx + sd * 0.04 * T.a, chin - 0.12 * HH], [tcx + sd * 0.5 * T.a, chin - 0.06 * HH], [tcx + sd * 0.42 * T.a, chin + 0.12 * HH], [tcx + sd * 0.04 * T.a, chin + 0.08 * HH]], O.tunic, 1.6 * u); // stand collar
      p.stroke([[tcx + 0.32 * T.a, chin + 0.46 * HH], [tcx + 0.85 * T.a, chin + 0.46 * HH]], 2 * u);                     // chest pocket
      p.stroke([[tcx - 0.85 * T.a, chin + 0.62 * HH], [tcx - 0.35 * T.a, chin + 0.62 * HH]], 2 * u);
    } else if (O.bare) {
      p.stroke(ellPts(tcx - 0.32 * T.a, chin + 0.38 * HH, 0.22 * T.a, 0.08 * HH, 20, 160, 0, 10), 1.6 * u, mul(skin, [0.7, 0.6, 0.6]));
      p.stroke(ellPts(tcx + 0.32 * T.a, chin + 0.38 * HH, 0.22 * T.a, 0.08 * HH, 20, 160, 0, 10), 1.6 * u, mul(skin, [0.7, 0.6, 0.6]));
      p.dot(tcx, torsoBot - 0.42 * HH, 2 * u, mul(skin, [0.6, 0.5, 0.5]));
    } else if (O.batik || O.gold) {
      if (O.batik) for (let i = -4; i <= 4; i++) for (let j = 0; j < 6; j++) { const x = tcx + i * 0.32 * T.a + (j % 2) * 0.16 * T.a, y = chin + (0.05 + j * 0.2) * HH;
        p.ell(x, y, 7 * u, 5 * u, O.batik, 1.4 * u); p.dot(x, y, 1.8 * u, INK); }
      if (O.gold) { p.band([[tcx - 0.5 * T.a, chin + 0.02 * HH], [tcx, chin + 0.3 * HH], [tcx + 0.5 * T.a, chin + 0.02 * HH]], "#e2b04a", 6 * u, 1.4 * u);
        for (let i = 0; i < 4; i++) p.dot(tcx, chin + (0.4 + i * 0.18) * HH, 2.6 * u, "#e2b04a"); }
      p.stroke([[tcx - 0.2 * T.a, chin + 0.02 * HH], [tcx, chin + 0.16 * HH], [tcx + 0.2 * T.a, chin + 0.02 * HH]], 2 * u);
    } else if (O.kebaya) {
      for (let i = -3; i <= 3; i++) p.ell(tcx + i * 0.3 * T.a, chin + (0.3 + (i % 2) * 0.25) * HH, 6 * u, 6 * u, O.kebaya, 1.2 * u);
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], O.kebaya, 0.05 * HH, 1.2 * u);
    } else if (O.plaid && !O.sarung) {
      for (let i = -6; i <= 6; i++) p.band([[tcx + i * 0.34 * T.a, chin - 0.2 * HH], [tcx + i * 0.34 * T.a, torsoBot + 0.1 * HH]], O.plaid, 4 * u, 0);
      for (let k = 0; k < 7; k++) p.band([[tcx - 1.4 * T.a, chin + (k * 0.2) * HH], [tcx + 1.4 * T.a, chin + (k * 0.2) * HH]], O.plaid, 4 * u, 0);
      p.stroke([[tcx - 0.22 * T.a, chin + 0.02 * HH], [tcx, chin + 0.2 * HH], [tcx + 0.22 * T.a, chin + 0.02 * HH]], 2 * u);
      for (let i = 0; i < 4; i++) p.dot(tcx, chin + (0.25 + i * 0.2) * HH, 2.4 * u, "#f4f1ea");
    } else if (O.stripes) {
      for (let i = -6; i <= 6; i++) p.band([[tcx + i * 0.3 * T.a, chin - 0.2 * HH], [tcx + i * 0.3 * T.a, torsoBot + 0.1 * HH]], O.stripes, 5 * u, 0);
      for (let i = 0; i < 3; i++) p.dot(tcx, chin + (0.2 + i * 0.22) * HH, 2.4 * u, "#f4f1ea");
    } else {
      p.band([[tcx - 1.4 * T.a, torsoBot - 0.24 * HH], [tcx + 1.4 * T.a, torsoBot - 0.24 * HH]], O.apron ? "#5a3b2a" : "#e2c27a", 0.05 * HH, 1.2 * u);
      if (O.toga) p.band([[tcx - 1.0 * T.a, chin - 0.1 * HH], [tcx + 1.1 * T.a, torsoBot - 0.1 * HH]], O.toga, 0.16 * HH, 1.6 * u);
      if (O.apron) p.poly([[tcx - 0.55 * T.a, torsoBot - 0.2 * HH], [tcx + 0.55 * T.a, torsoBot - 0.2 * HH], [tcx + 0.6 * T.a, torsoBot + 0.2 * HH], [tcx - 0.6 * T.a, torsoBot + 0.2 * HH]], O.apron, 1.6 * u);
      p.stroke([[tcx - 0.2 * T.a, chin + 0.02 * HH], [tcx, chin + 0.16 * HH], [tcx + 0.2 * T.a, chin + 0.02 * HH]], 2 * u);
    }
  });
  p.inkRing(tp, ow, thick);
  if (O.sash) { // selendang batik: diagonal band shoulder -> hip with dots
    p.band([[tcx - 1.05 * T.a, chin + 0.02 * HH], [tcx + 0.95 * T.a, torsoBot - 0.05 * HH]], O.sash, 0.22 * HH, 1.6 * u);
    for (let i = 0; i < 7; i++) { const k = (i + 0.5) / 7; p.dot(tcx - 1.05 * T.a + k * 2.0 * T.a, chin + 0.02 * HH + k * (torsoBot - 0.07 * HH - chin), 2.6 * u, "#e2b04a"); } }
  if (O.neckTowel) { // small striped towel over the shoulders, ends hanging on the chest
    p.band([[tcx - 0.75 * T.a, chin + 0.06 * HH], [tcx, chin + 0.16 * HH], [tcx + 0.75 * T.a, chin + 0.06 * HH]], O.neckTowel, 0.11 * HH, 1.4 * u);
    for (const sd of [-1, 1]) { p.band([[tcx + sd * 0.42 * T.a, chin + 0.1 * HH], [tcx + sd * 0.48 * T.a, chin + 0.62 * HH]], O.neckTowel, 0.12 * HH, 1.4 * u);
      p.band([[tcx + sd * 0.39 * T.a, chin + 0.5 * HH], [tcx + sd * 0.54 * T.a, chin + 0.5 * HH]], "#3a6ab8", 0.025 * HH, 0); } }
  if (O.vest) { // safety vest: open front + reflective stripes
    for (const sd of [-1, 1]) { const vp = [[tcx + sd * 0.18 * T.a, chin + 0.04 * HH], [tcx + sd * 0.92 * T.a, chin + 0.1 * HH], [tcx + sd * 1.02 * T.a, torsoBot + 0.02 * HH], [tcx + sd * 0.2 * T.a, torsoBot + 0.06 * HH]];
      p.poly(vp, O.vest, 1.8 * u);
      for (const k of [0.42, 0.7]) { const y = chin + k * (torsoBot - chin); p.band([[tcx + sd * 0.22 * T.a, y], [tcx + sd * 0.98 * T.a, y]], "#e8eef4", 0.055 * HH, 0.8 * u); } } }
  if (O.zipJacket) { // jaket kulit: collar + zipper + pockets
    p.stroke([[tcx, chin + 0.12 * HH], [tcx, torsoBot + 0.04 * HH]], 2.4 * u, "#c9c4bb");
    for (const sd of [-1, 1]) { p.poly([[tcx + sd * 0.05 * T.a, chin + 0.02 * HH], [tcx + sd * 0.62 * T.a, chin - 0.02 * HH], [tcx + sd * 0.42 * T.a, chin + 0.24 * HH]], mul(O.tunic, [0.75, 0.75, 0.75]), 1.6 * u);
      p.stroke([[tcx + sd * 0.35 * T.a, chin + 0.62 * HH], [tcx + sd * 0.75 * T.a, chin + 0.58 * HH]], 1.8 * u, "#2a1a10"); } }
  if (O.whistle) { // peluit on a cord
    p.stroke([[tcx - 0.3 * T.a, chin + 0.02 * HH], [tcx + 0.05 * T.a, chin + 0.42 * HH], [tcx + 0.32 * T.a, chin + 0.02 * HH]], 1.6 * u, O.whistle);
    p.poly(rrect(tcx - 2 * u, chin + 0.4 * HH, tcx + 16 * u, chin + 0.4 * HH + 9 * u, 3 * u), "#d8dde4", 1.6 * u); p.dot(tcx + 3 * u, chin + 0.4 * HH + 4.5 * u, 3 * u, "#5a6070"); }
  if (O.koko) { // baju koko: mandarin collar + placket buttons + embroidery
    p.band([[tcx - 0.42 * T.a, chin + 0.03 * HH], [tcx + 0.42 * T.a, chin + 0.03 * HH]], O.koko, 0.06 * HH, 1.2 * u);
    p.stroke([[tcx, chin + 0.06 * HH], [tcx, chin + 0.55 * HH]], 2 * u, O.koko);
    for (let i = 0; i < 4; i++) p.dot(tcx, chin + (0.14 + i * 0.12) * HH, 2.4 * u, O.koko);
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) p.dot(tcx + sd * 0.16 * T.a, chin + (0.14 + i * 0.14) * HH, 1.6 * u, O.koko); }
  if (O.hoodie) { // hood bunched at the neck + drawstrings + kangaroo pocket
    p.band([[tcx - 0.62 * T.a, chin + 0.02 * HH], [tcx, chin + 0.12 * HH], [tcx + 0.62 * T.a, chin + 0.02 * HH]], mul(O.tunic, [0.82, 0.82, 0.82]), 0.12 * HH, 1.6 * u);
    for (const sd of [-1, 1]) { p.stroke([[tcx + sd * 0.12 * T.a, chin + 0.1 * HH], [tcx + sd * 0.14 * T.a, chin + 0.42 * HH]], 1.6 * u, O.hoodie); p.dot(tcx + sd * 0.14 * T.a, chin + 0.44 * HH, 2.4 * u, O.hoodie); }
    p.poly([[tcx - 0.5 * T.a, torsoBot - 0.36 * HH], [tcx + 0.5 * T.a, torsoBot - 0.36 * HH], [tcx + 0.62 * T.a, torsoBot - 0.08 * HH], [tcx - 0.62 * T.a, torsoBot - 0.08 * HH]], mul(O.tunic, [0.88, 0.88, 0.88]), 1.4 * u); }
  if (O.floral) for (let i = 0; i < 14; i++) { const x = tcx + ((i * 0.37) % 1 - 0.5) * 1.7 * T.a, y = chin + (0.15 + ((i * 0.61) % 1) * 0.85) * (torsoBot - chin + 0.3 * HH);
    for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283; p.dot(x + Math.cos(a) * 3.2 * u, y + Math.sin(a) * 3.2 * u, 2.2 * u, O.floral); } p.dot(x, y, 1.6 * u, "#ffe14a"); }
  if (O.armor) for (const s of [-1, 1]) { // shoulder plates
    const sp = ellPts(tcx + s * 0.72 * T.a, chin + 0.1 * HH, 0.42 * T.a, 0.13 * HH, 180, 360, s * 8, 20);
    p.poly(sp, old ? "#9a9384" : "#c5ccd3", 1.8 * u);
  }
  if (O.moss) {/* reserved */}
  for (const a of arms) if (a.front) drawArm(a);
  if (arms.some((a) => a.text)) { const ax = (arms[0].pts[2][0] + arms[1].pts[2][0]) / 2, ay = (arms[0].pts[2][1] + arms[1].pts[2][1]) / 2;
    p.poly(rrect(ax - 15 * u, ay - 26 * u, ax + 15 * u, ay + 18 * u, 4 * u), "#2b2f3a", 2.2 * u); p.poly(rrect(ax - 11.5 * u, ay - 22 * u, ax + 11.5 * u, ay + 13 * u, 2.5 * u), "#8fd3ff", 0);
    p.poly(rrect(ax - 9 * u, ay - 18 * u, ax + 2 * u, ay - 12 * u, 2 * u), "#ffffff", 0); p.poly(rrect(ax - 2 * u, ay - 8 * u, ax + 9 * u, ay - 2 * u, 2 * u), "#b9f5a0", 0);
    for (const a of arms) p.dot(a.pts[2][0], a.pts[2][1] + 4 * u, 5.5 * u, armCol); }
  // shield in front, held by the left hand
  if (O.shield && L === "shield") {
    const sx = tcx - 0.55 * T.a, sy = torsoBot + 0.05 * HH, sw = 0.36 * W, sh = 0.78 * HH;
    const sp = rrect(sx - sw, sy - sh, sx + sw, sy + sh, 8 * u);
    p.gradFill(sp, "#c0302c", "#7d1d22", light);
    p.clip(sp, () => {
      p.band([[sx - sw, sy], [sx + sw, sy]], BRASS, 6 * u, 1.2 * u);
      p.band([[sx, sy - sh], [sx, sy + sh]], BRASS, 6 * u, 1.2 * u);
      for (const s of [-1, 1]) { p.stroke([[sx + s * 12 * u, sy - 14 * u], [sx + s * 34 * u, sy - 46 * u], [sx + s * 22 * u, sy - 44 * u], [sx + s * 46 * u, sy - 74 * u]], 3.5 * u, BRASS); p.stroke([[sx + s * 12 * u, sy + 14 * u], [sx + s * 34 * u, sy + 46 * u], [sx + s * 22 * u, sy + 44 * u], [sx + s * 46 * u, sy + 74 * u]], 3.5 * u, BRASS); }
      p.stroke(ellPts(sx - sw * 0.5, sy - sh * 0.7, sw * 0.3, sh * 0.1, 200, 320, 0, 10), 3 * u, "#ffffff44");
    });
    p.ell(sx, sy, 13 * u, 13 * u, "#e6c068", 2.2 * u);
    p.inkRing(sp, ow, thick);
  }
  // ---- head ----
  const [cpx, cpy] = rotAbout([cx, chin], rad(tilt), [cx, hipY]);
  const Ah = tilt + headTilt;
  p.rot = Ah ? [rad(Ah), cx, chin, cpx - cx, cpy - chin] : null;
  if (helmet) galea(p, H, cx, hc, light, thick, ow, old, u);
  const hp = blobPts(cx, hc, H);
  if (O.hair && !helmet) { const hb = blobPts(cx, hc - 0.03 * HH, { ...H, a: H.a * 1.04, b: H.b * 1.05 }); p.poly(hb, O.hair, 0); }
  p.shadedFill(hp, skin, mul(skin, SH_SKIN), light, H.a);
  p.inkRing(hp, ow, thick);
  if (helmet) {
    const bandY = hc - H.b * 0.42, bp = ellPts(cx, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
    p.shadedFill(bp, old ? "#8f8a7e" : STEEL, mul(old ? "#8f8a7e" : STEEL, [0.62, 0.64, 0.72]), light, H.a, 0.4);
    p.clip(bp, () => { p.stroke(ellPts(cx - 20 * u, bandY - 0.3 * H.b, 0.25 * H.a, 0.18 * H.b, 200, 300, 0, 16), 5 * u, "#ffffff66");
      if (old) for (let i = 0; i < 9; i++) p.ell(cx + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (4 + (i % 3) * 2) * u, (2.5 + (i % 2)) * u, "#8a4b22", 0); });
    p.poly(bp, null, ow * 0.9);
    p.band([[cx - H.a * 1.05, bandY], [cx + H.a * 1.05, bandY]], old ? "#a88a4a" : BRASS, 7 * u, 1.8 * u, "round");
    p.poly(rrect(cx - 4 * u, bandY - 0.55 * H.b, cx + 4 * u, bandY - 3 * u, 2 * u), old ? "#a88a4a" : BRASS, 1.5 * u);
    cheeks(p, H, cx, hc, light, ow, old, u);
  } else if (O.cap) hatOn(p, { hat: "cap", cap: O.cap, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false);
  else if (O.hair) hatOn(p, { hat: "hair", hair: O.hair, jacket: O.tunic }, hp, H, cx, hc, light, seed, facing, false);
  else if (O.helmet && nohelmet) { // bald old head with white side tufts
    for (const s of [-1, 1]) p.ell(cx + s * 0.9 * H.a, hc - 0.1 * H.b, 0.22 * H.a, 0.3 * H.b, "#f4f1ea", 3 * u);
  }
  if (O.beard) {
    const bd = blobPts(cx + 6 * u * facing, hc + 0.85 * H.b, { a: 0.62 * H.a, b: 0.75 * H.b, nTop: 2.4, nBot: 1.6, egg: -0.35, asym: 0, rot: 0, noise: 0.02, seed: seed + 4 });
    p.shadedFill(bd, O.beard, mul(O.beard, [0.86, 0.86, 0.92]), light, 0.6 * H.a, 0.3);
    p.clip(bd, () => { for (let i = -3; i <= 3; i++) p.stroke([[cx + i * 9 * u, hc + 0.45 * H.b], [cx + i * 7 * u, hc + 1.35 * H.b]], 1.2 * u, "#c9c4bb"); });
    p.inkRing(bd, ow * 0.8, thick);
  }
  faceFront(p, cx, hc, W, expr, facing, look, lid, helmet, skin, O.beard ? O.beard : O.moustache, !!O.stout);
  if (O.ikat) { p.band([[cx - 1.0 * H.a, hc - 0.55 * H.b], [cx + 1.0 * H.a, hc - 0.55 * H.b]], "#d8322f", 7 * u, 1.4 * u); p.band([[cx - 1.0 * H.a, hc - 0.42 * H.b], [cx + 1.0 * H.a, hc - 0.42 * H.b]], "#f4f1ea", 6 * u, 1.4 * u); }
  if (opts.medal) { p.stroke([[cx - 14 * u, chin + 4 * u], [cx, chin + 40 * u], [cx + 14 * u, chin + 4 * u]], 3 * u, "#d8322f"); p.ell(cx, chin + 50 * u, 12 * u, 12 * u, "#b8bec6", 2.4 * u); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; p.dot(cx + Math.cos(a) * 12 * u, chin + 50 * u + Math.sin(a) * 12 * u, 2.2 * u, "#8a9098"); } }
  if (O.bun) { p.ell(cx, hc - 1.02 * H.b, 0.42 * H.a, 0.3 * H.b, O.hair, ow * 0.7); if (O.crown) for (let i = -3; i <= 3; i++) p.dot(cx + i * 0.2 * H.a, hc - 0.92 * H.b - Math.cos(i / 3) * 0.12 * H.b, 4.5 * u, "#e2b04a"); }
  if (O.glasses) for (const sd of [-1, 1]) { p.g.save(); p.g.fillStyle = "rgba(220,240,255,.25)"; p.ell(cx + 7 * u * facing + sd * 15 * u, hc - 6 * u, 13 * u, 11 * u, "rgba(220,240,255,.25)", 2.6 * u); p.g.restore();
    if (sd < 0) p.stroke([[cx + 7 * u * facing - 2 * u, hc - 8 * u], [cx + 7 * u * facing + 2 * u, hc - 8 * u]], 2.4 * u); if (opts.glint) p.dot(cx + 7 * u * facing + sd * 15 * u, hc - 6 * u, 9 * u, "#fff6a8"); }
  if (O.chefHat) { const top = hc - 1.05 * H.b; // tall puffy chef hat
    p.poly(rrect(cx - 0.62 * H.a, top - 0.5 * H.b, cx + 0.62 * H.a, top + 0.12 * H.b, 6 * u), "#ffffff", 2.4 * u);
    for (const [dx, dy, r_] of [[-0.42, -0.62, 0.36], [0, -0.78, 0.42], [0.42, -0.62, 0.36]]) p.ell(cx + dx * H.a, top + dy * H.b, r_ * H.a, r_ * 0.8 * H.b, "#ffffff", 2.4 * u);
    p.band([[cx - 0.64 * H.a, top + 0.06 * H.b], [cx + 0.64 * H.a, top + 0.06 * H.b]], "#e6e2d8", 0.08 * H.b, 1.2 * u); }
  if (O.glassesUp) for (const sd of [-1, 1]) { p.ell(cx + sd * 15 * u, hc - 0.62 * H.b, 12 * u, 9 * u, "rgba(220,240,255,.35)", 2.4 * u); if (sd < 0) p.stroke([[cx - 3 * u, hc - 0.64 * H.b], [cx + 3 * u, hc - 0.64 * H.b]], 2.2 * u); }
  if (O.headband) { p.band([[cx - 1.02 * H.a, hc - 0.5 * H.b], [cx + 1.02 * H.a, hc - 0.5 * H.b]], O.headband, 9 * u, 1.6 * u); p.poly([[cx + 1.0 * H.a, hc - 0.5 * H.b], [cx + 1.25 * H.a, hc - 0.3 * H.b], [cx + 1.18 * H.a, hc - 0.55 * H.b]], O.headband, 1.4 * u); }
  if (O.motoHelm) { // half helmet + visor
    const hp2 = ellPts(cx, hc - 0.18 * H.b, H.a * 1.12, H.b * 1.02, 180, 360, 0, 40);
    p.shadedFill(hp2, O.motoHelm, mul(O.motoHelm, [0.62, 0.62, 0.7]), light, H.a, 0.4); p.poly(hp2, null, ow * 0.8);
    p.band([[cx - H.a * 1.1, hc - 0.2 * H.b], [cx + H.a * 1.1, hc - 0.2 * H.b]], "#1a1a22", 7 * u, 1.4 * u, "round");
    p.stroke(ellPts(cx - 18 * u, hc - 0.75 * H.b, 0.3 * H.a, 0.15 * H.b, 200, 300, 0, 12), 5 * u, "#ffffff77");
    for (const sd of [-1, 1]) p.stroke([[cx + sd * H.a * 0.98, hc - 0.15 * H.b], [cx + sd * H.a * 0.7, hc + 0.75 * H.b]], 1.8 * u, "#1a1a22"); }
  if (O.peci) { const top = hc - 1.2 * H.b; p.poly(rrect(cx - 0.66 * H.a, top - 0.02 * H.b, cx + 0.66 * H.a, top + 0.5 * H.b, 6 * u), "#101018", ow * 0.6); p.band([[cx - 0.64 * H.a, top + 0.4 * H.b], [cx + 0.64 * H.a, top + 0.4 * H.b]], "#e2b04a", 3 * u, 0); }
  if (O.cowboy) { const by = hc - 0.9 * H.b; // cowboy hat: wide curled brim + dented crown
    p.poly(rrect(cx - 0.62 * H.a, by - 0.78 * H.b, cx + 0.62 * H.a, by + 0.05 * H.b, 14 * u), O.cowboy, ow * 0.8);
    p.stroke([[cx, by - 0.74 * H.b], [cx, by - 0.5 * H.b]], 3 * u, mul(O.cowboy, [0.6, 0.6, 0.6]));
    p.band([[cx - 0.62 * H.a, by - 0.12 * H.b], [cx + 0.62 * H.a, by - 0.12 * H.b]], "#3a2418", 0.12 * H.b, 1.2 * u);
    p.poly([[cx - 1.55 * H.a, by - 0.22 * H.b], [cx - 1.1 * H.a, by + 0.1 * H.b], [cx + 1.1 * H.a, by + 0.1 * H.b], [cx + 1.55 * H.a, by - 0.22 * H.b], [cx + 1.2 * H.a, by + 0.2 * H.b], [cx - 1.2 * H.a, by + 0.2 * H.b]], O.cowboy, ow * 0.8); }
  if (O.curlers) for (let i = -2; i <= 2; i++) p.poly(rrect(cx + i * 0.36 * H.a - 0.15 * H.a, hc - (1.08 - Math.abs(i) * 0.12) * H.b, cx + i * 0.36 * H.a + 0.15 * H.a, hc - (0.82 - Math.abs(i) * 0.12) * H.b, 5 * u), O.curlers, 2 * u);
  if (O.bedhead) for (let i = 0; i < 7; i++) { const a = rad(-160 + i * 23), x0 = cx + Math.cos(a) * H.a * 0.85, y0 = hc + Math.sin(a) * H.b * 0.88, x1 = cx + Math.cos(a + (i % 2 ? 0.25 : -0.2)) * H.a * 1.28, y1 = hc + Math.sin(a + (i % 2 ? 0.25 : -0.2)) * H.b * 1.3;
    p.poly([[x0 - 9 * u, y0], [x1, y1], [x0 + 9 * u, y0]], O.hair, 2.4 * u); }
  if (O.wet) for (let i = 0; i < 4; i++) p.ell(cx + (i - 1.5) * 26 * u, hc - 0.7 * H.b + (i % 2) * 12 * u, 3.5 * u, 6 * u, "#9fd4ff", 1.6 * u);
  if (O.sweat || opts.sweat) for (const s of [-1, 1]) p.ell(cx + s * 0.95 * H.a, hc - 0.3 * H.b, 4.5 * u, 8 * u, "#9fd4ff", 1.8 * u);
  if (O.brows) for (const s of [-1, 1]) p.ell(cx + 7 * u * facing + s * 14 * u, hc - 20 * u, 11 * u, 5 * u, O.brows, 2 * u);
  if (O.beard) { // re-draw the mouth over the beard for open mouths
    if (expr === "shock" || expr === "snore") p.ell(cx + 8 * u * facing, hc + 22 * u, 6 * u, 7 * u, "#5a1e28", 2 * u);
  }
  p.rot = null;
  { const a = arms.find((x) => x.mic); if (a) { const [hx, hy] = a.pts[2]; p.band([[hx, hy + 8 * u], [hx, hy - 10 * u]], "#2b2f3a", 6 * u, 1.6 * u, "round"); p.ell(hx, hy - 16 * u, 9 * u, 10 * u, "#5d6470", 2.4 * u);
    p.clip(ellPts(hx, hy - 16 * u, 9 * u, 10 * u, 0, 360, 0, 24), () => { for (let i = -2; i <= 2; i++) { p.stroke([[hx + i * 4 * u, hy - 27 * u], [hx + i * 4 * u, hy - 5 * u]], 1 * u, "#2b2f3a"); p.stroke([[hx - 10 * u, hy - 16 * u + i * 4 * u], [hx + 10 * u, hy - 16 * u + i * 4 * u]], 1 * u, "#2b2f3a"); } });
    p.dot(hx, hy + 2 * u, 5.5 * u, armCol); } }
  if (arms.some((a) => a.swirl)) { // cuckoo swirl next to the temple
    const a = arms.find((x) => x.swirl), [hx, hy] = a.pts[2], ph = opts.swirl || 0, pts = [];
    for (let i = 0; i < 40; i++) { const t = i / 40 * Math.PI * 4 + ph, r = (4 + i * 0.7) * u; pts.push([hx + Math.cos(t) * r, hy - 40 * u + Math.sin(t) * r]); }
    p.stroke(pts, 3 * u, "#ffffff"); p.stroke(pts, 1.4 * u, INK);
  }
};

/** loose helmet prop card (lifted off the old soldier) */
export const helmetCard = (p) => {
  const H = headBlob(3, 118, 0), u = 2 * H.a / 100, hc = 560, light = rad(-120), thick = thickAngle(light), ow = 5 * u;
  galea(p, H, 300, hc, light, thick, ow, true, u);
  const bandY = hc - H.b * 0.42, bp = ellPts(300, bandY, H.a * 1.05, H.b * 0.66, 180, 360, 0, 48);
  // dark inside visible from below
  p.ell(300, bandY, H.a * 1.05, 0.12 * H.b, "#2a221e", 0);
  p.shadedFill(bp, "#8f8a7e", mul("#8f8a7e", [0.62, 0.64, 0.72]), light, H.a, 0.4);
  p.clip(bp, () => { for (let i = 0; i < 9; i++) p.ell(300 + Math.sin(i * 2.3) * 0.8 * H.a, bandY - (0.08 + 0.5 * ((i * 0.37) % 1)) * H.b, (4 + (i % 3) * 2) * u, (2.5 + (i % 2)) * u, "#8a4b22", 0); });
  p.poly(bp, null, ow * 0.9);
  p.band([[300 - H.a * 1.05, bandY], [300 + H.a * 1.05, bandY]], "#a88a4a", 7 * u, 1.8 * u, "round");
  cheeks(p, H, 300, hc, light, ow, true, u);
};

/** ZZZ for the sleeping guard */
export const fxZ = (p, t) => {
  const g = p.g; g.save(); g.font = "900 120px Arial Black, Arial"; g.lineJoin = "round";
  for (let i = 0; i < 3; i++) {
    const k = (t + i / 3) % 1, x = 220 + i * 70 + Math.sin(k * 6) * 20, y = 700 - k * 500, s = 0.5 + k * 0.7;
    g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = Math.min(1, (1 - k) * 2.5);
    g.lineWidth = 16; g.strokeStyle = INK; g.strokeText("Z", 0, 0); g.fillStyle = "#ffffff"; g.fillText("Z", 0, 0); g.restore();
  }
  g.restore();
};
/** falling leaf */
export const fxLeaf = (p, col) => { p.poly([[300, 380], [420, 470], [300, 620], [180, 470]], col, 14); p.stroke([[300, 400], [300, 600]], 8); };
/** dust cloud puff (k 0..1 growth) */
export const fxDust = (p, k, col = "#e8dcc4") => {
  const g = p.g; g.save(); g.globalAlpha = Math.max(0, 1 - k * k);
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, r = 90 + 150 * k; p.ell(300 + Math.cos(a) * r, 520 + Math.sin(a) * r * 0.6, 120 + 60 * k, 100 + 50 * k, col, 12); }
  p.ell(300, 520, 170 + 110 * k, 140 + 80 * k, col, 0);
  g.restore();
};
export const fxDrip = (p) => p.ell(300, 500, 40, 64, "#9fd4ff", 10);
export const fxWood = (p, seed) => { p.poly([[200, 420], [400, 400], [420, 560], [230, 600]], "#5b3d22", 14); p.stroke([[240, 450], [380, 440]], 6, "#3a2614"); p.ell(330, 520, 26, 18, "#4d7a32", 0); };

export const headCenter = (seed = 3) => { const H = headBlob(seed, 118, 0), HH = 2 * H.b; return 975 - 1.38 * HH - 1.08 * HH - H.b; };

// ---------------- "Otw" props / fx ----------------
/** chat bubble: text, me=true (green, tail right) or friend (white, tail left) */
export const fxBubble = (p, text, me = false, k = 1) => {
  const g = p.g; g.save();
  const fs = text.length > 16 ? 50 : text.length > 9 ? 62 : 78;
  g.font = `900 ${fs}px "DejaVu Sans", Arial, sans-serif`;
  const lines = []; { const words = text.split(" "); let cur = ""; for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > 470 && cur) { lines.push(cur); cur = w; } else cur = t; } lines.push(cur); }
  const tw = Math.max(...lines.map((l) => g.measureText(l).width)), lh = fs * 1.18, bw = tw + 70, bh = lines.length * lh + 50;
  const cx = 300, cy = 500; g.translate(cx, cy); g.scale(k, k); g.translate(-cx, -cy);
  const x0 = cx - bw / 2, y0 = cy - bh / 2, x1 = cx + bw / 2, y1 = cy + bh / 2;
  const tail = me ? [[x1 - 70, y1 - 4], [x1 - 10, y1 + 50], [x1 - 30, y1 - 4]] : [[x0 + 30, y1 - 4], [x0 + 10, y1 + 50], [x0 + 70, y1 - 4]];
  const col = me ? "#c9f7b0" : "#ffffff";
  p.poly(tail, col, 9); p.poly(rrect(x0, y0, x1, y1, 34), col, 9); p.poly(tail.map(([x, y]) => [x, y - 9]), col, 0);
  g.fillStyle = INK; g.textAlign = "center"; g.textBaseline = "middle";
  lines.forEach((l, i) => g.fillText(l, cx, y0 + 25 + lh * (i + 0.5)));
  g.restore();
};
/** audience member seen from behind (dark silhouette with a warm rim) */
export const fxCrowd = (p, seed = 1, hue = 0) => {
  const r = (n) => (Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1, a = Math.abs;
  const body = ["#2a1f3a", "#33233f", "#2b2440", "#3a2638"][seed % 4];
  const sh = [[120, 1000], [130, 760], [190, 690], [410, 690], [470, 760], [480, 1000]];
  p.poly(sh, body, 0);
  const hr = 95 + a(r(1)) * 25; p.ell(300, 590, hr, hr * 1.08, body, 0);
  if (a(r(2)) > 0.5) p.ell(300, 520, hr * 0.9, hr * 0.6, "#1c1428", 0);
  p.stroke(ellPts(300, 590, hr, hr * 1.08, 200, 330, 0, 20), 9, "#ffb35c88");
  p.stroke([[190, 690], [130, 760]], 9, "#ffb35c66");
};
/** big question mark */
export const fxQ = (p) => { const g = p.g; g.save(); g.font = '900 380px "DejaVu Sans", Arial'; g.textAlign = "center"; g.lineJoin = "round"; g.lineWidth = 26; g.strokeStyle = INK; g.strokeText("?", 300, 640); g.fillStyle = "#ffd84a"; g.fillText("?", 300, 640); g.restore(); };
/** flying sock */
export const fxSock = (p, col = "#f4f1ea") => { p.poly([[250, 300], [330, 300], [335, 560], [430, 600], [430, 680], [250, 670]], col, 14); p.band([[250, 340], [330, 340]], "#3a7bd5", 20, 0); };
/** flying shirt */
export const fxShirt = (p, col = "#4fa36b") => { p.poly([[200, 380], [260, 350], [340, 350], [400, 380], [450, 470], [395, 500], [380, 460], [380, 650], [220, 650], [220, 460], [205, 500], [150, 470]], col, 14); };
/** laugh text burst "HAHA" (sound-effect lettering) */
export const fxHaha = (p, t) => { const g = p.g; g.save(); g.font = '900 120px "DejaVu Sans", Arial'; g.textAlign = "center"; g.lineJoin = "round";
  ["HA", "HA", "HA"].forEach((w, i) => { const k = Math.max(0, Math.min(1, t * 3 - i * 0.5)); if (!k) return; g.save(); g.translate(150 + i * 150, 560 - i * 60 - k * 40); g.rotate((i - 1) * 0.15); g.scale(k, k);
    g.lineWidth = 22; g.strokeStyle = INK; g.strokeText(w, 0, 0); g.fillStyle = "#ffd84a"; g.fillText(w, 0, 0); g.restore(); }); g.restore(); };
/** sweat drops / speed lines for running */
export const fxSpeed = (p) => { for (let i = 0; i < 5; i++) p.band([[100, 300 + i * 90], [500 - (i % 2) * 120, 300 + i * 90]], "#ffffff", 14, 6); };

// ---------------- intro / outro graphics ----------------
const bigText = (g, txt, x, y, size, fill, stroke = INK, lw = 26) => { g.font = `900 ${size}px "DejaVu Sans", Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  g.lineWidth = lw; g.strokeStyle = stroke; g.strokeText(txt, x, y); g.fillStyle = fill; g.fillText(txt, x, y); };
/** show title "MALAM KOMEDI" with a star burst; t = spin phase */
export const fxTitle = (p, t = 0) => {
  const g = p.g; g.save();
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2 + t; g.fillStyle = i % 2 ? "#ffd84a55" : "#ff5fa244"; g.beginPath(); g.moveTo(300, 500); g.arc(300, 500, 420, a, a + Math.PI / 16); g.closePath(); g.fill(); }
  p.poly(rrect(20, 360, 580, 660, 40), "#241726", 0); p.poly(rrect(34, 374, 566, 646, 32), "#3a2350", 10);
  for (let i = 0; i < 14; i++) { const x = 50 + i * 38.5; p.ell(x, 386, 7, 7, i % 2 ? "#ffd84a" : "#fff3c4", 0); p.ell(x, 634, 7, 7, i % 2 ? "#fff3c4" : "#ffd84a", 0); }
  bigText(g, "MALAM", 300, 455, 118, "#ffd84a", INK, 22);
  bigText(g, "KOMEDI", 300, 565, 112, "#ff5fa2", INK, 22);
  for (const [x, y, r] of [[60, 300, 30], [540, 300, 26], [560, 720, 32], [50, 720, 24]]) { const pts = []; for (let k = 0; k < 10; k++) { const rr = k % 2 ? r * 0.42 : r, b = k * Math.PI / 5 - Math.PI / 2 + t * 0.5; pts.push([x + rr * Math.cos(b), y + rr * Math.sin(b)]); } p.poly(pts, "#ffd84a", 6); }
  g.restore();
};
const thumb = (p, cx, cy, s, col) => { const P = (x, y) => [cx + x * s, cy + y * s];
  p.poly([P(-30, -5), P(-10, -5), P(-10, 40), P(-30, 40)], col, 0);
  p.poly([P(-6, -5), P(8, -40), P(14, -48), P(22, -44), P(20, -12), P(44, -12), P(48, -4), P(42, 40), P(-6, 40)], col, 0); };
export const fxLike = (p, pressed = false) => {
  const bg = pressed ? "#1f5fb8" : "#3a7bd5";
  p.poly(rrect(70, 400, 530, 600, 100), bg, 12); thumb(p, 175, 505, 1.5, "#ffffff");
  bigText(p.g, "LIKE", 365, 503, 92, "#ffffff", INK, 16);
};
export const fxSub = (p, pressed = false) => {
  p.poly(rrect(20, 410, 580, 590, 40), pressed ? "#8a8a8a" : "#e0352b", 12);
  bigText(p.g, pressed ? "SUBSCRIBED" : "SUBSCRIBE", 300, 502, pressed ? 70 : 78, "#ffffff", INK, 14);
};
export const fxBell = (p, swing = 0) => {
  const g = p.g; g.save(); g.translate(300, 380); g.rotate(swing); g.translate(-300, -380);
  p.poly([[300, 380], [372, 420], [390, 560], [430, 610], [170, 610], [210, 560], [228, 420]], "#ffd84a", 12);
  p.ell(300, 380, 22, 22, "#ffd84a", 10); p.ell(300, 636, 34, 26, "#ffd84a", 10);
  p.stroke([[250, 450], [242, 540]], 10, "#fff3c4"); g.restore();
  if (Math.abs(swing) > 0.05) for (const s of [-1, 1]) { p.stroke([[300 + s * 150, 430], [300 + s * 190, 400]], 12); p.stroke([[300 + s * 160, 500], [300 + s * 210, 500]], 12); }
};
export const fxCursor = (p, click = false) => {
  const s = click ? 0.85 : 1, P = (x, y) => [300 + x * s, 420 + y * s];
  p.poly([P(-40, -10), P(-40, -70), P(-20, -70), P(-20, -20), P(0, -30), P(20, -26), P(40, -20), P(52, 10), P(46, 80), P(-20, 80), P(-56, 20)], "#ffffff", 10);
  if (click) for (let i = 0; i < 5; i++) { const a = -Math.PI * (0.15 + i * 0.17); p.stroke([[300 - 30 + Math.cos(a) * 110, 350 + Math.sin(a) * 110], [300 - 30 + Math.cos(a) * 150, 350 + Math.sin(a) * 150]], 12, "#ffd84a"); }
};

// ---------------- "Kondangan" fx ----------------
export const fxRadar = (p, t) => { const g = p.g; g.save();
  p.ell(300, 500, 230, 230, "rgba(40,180,90,.25)", 10); p.ell(300, 500, 150, 150, null, 4); p.ell(300, 500, 70, 70, null, 4);
  g.strokeStyle = "#7dff9a"; g.lineWidth = 6; for (const r of [70, 150, 230]) { g.beginPath(); g.arc(300, 500, r, 0, 7); g.stroke(); }
  const a = t * Math.PI * 2; g.fillStyle = "rgba(125,255,154,.45)"; g.beginPath(); g.moveTo(300, 500); g.arc(300, 500, 230, a - 0.7, a); g.closePath(); g.fill();
  g.strokeStyle = "#d9ffe0"; g.lineWidth = 8; g.beginPath(); g.moveTo(300, 500); g.lineTo(300 + Math.cos(a) * 230, 500 + Math.sin(a) * 230); g.stroke();
  p.dot(300 + Math.cos(2.2) * 120, 500 + Math.sin(2.2) * 120, 16, "#ff5f5f"); g.restore(); };
export const fxCalendar = (p, year) => { p.poly(rrect(130, 280, 470, 720, 30), "#ffffff", 12); p.poly(rrect(130, 280, 470, 400, 30), "#d8453b", 0); p.poly([[130, 380], [470, 380], [470, 400], [130, 400]], "#d8453b", 0);
  for (const x of [200, 400]) p.poly(rrect(x - 12, 250, x + 12, 320, 10), "#5d6470", 6);
  const g = p.g; g.save(); g.font = '900 64px "DejaVu Sans", Arial'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffffff"; g.fillText("KONDANGAN", 300, 345 - 5 + 0, 320);
  g.font = '900 150px "DejaVu Sans", Arial'; g.fillStyle = INK; g.fillText(String(year), 300, 560); g.restore(); p.poly(rrect(130, 280, 470, 720, 30), null, 12); };
export const fxPlate = (p, full = 1) => { p.ell(300, 600, 200, 60, "#ffffff", 10); p.ell(300, 590, 150, 40, "#f1ece2", 0);
  for (let i = 0; i < Math.round(9 * full); i++) p.ell(230 + (i % 4) * 45 + (i > 3 ? 20 : 0), 575 - Math.floor(i / 4) * 32, 34, 24, i % 3 ? "#6b3a1f" : "#8a4b22", 6); };
export const fxConfetti = (p, t, seed = 1) => { for (let i = 0; i < 26; i++) { const x = (Math.sin(i * 12.9 + seed) * 0.5 + 0.5) * 560 + 20, y = ((i * 37 + t * 900) % 900) + 50;
  p.g.save(); p.g.translate(x, y); p.g.rotate(i + t * 8); p.poly([[-14, -7], [14, -7], [14, 7], [-14, 7]], ["#ffd84a", "#ff5fa2", "#7dd3ff", "#8be08b"][i % 4], 3); p.g.restore(); } };
export const fxGlow = (p) => { for (const s of [-1, 1]) { p.ell(300 + s * 70, 500, 60, 40, "rgba(255,40,40,.45)", 0); p.ell(300 + s * 70, 500, 24, 16, "#ff3b3b", 0); } };
export const fxHeart = (p) => { p.poly([[300, 640], [160, 500], [170, 410], [240, 380], [300, 430], [360, 380], [430, 410], [440, 500]], "#ff5f8a", 12); };
// ---------------- "Hayati Minta Balikan" fx cards (600x1000 design canvas) ----------------
const PF = '"DejaVu Sans", Arial, sans-serif', SERIF = '"DejaVu Serif", Georgia, serif';
const ptxt = (g, t, x, y, size, fill, lw = 0, stroke = INK, align = "center", font = PF) => { g.font = `900 ${size}px ${font}`; g.textAlign = align; g.textBaseline = "middle"; g.lineJoin = "round";
  if (lw) { g.lineWidth = lw; g.strokeStyle = stroke; g.strokeText(t, x, y); } g.fillStyle = fill; g.fillText(t, x, y); };
const heartPts = (cx, cy, r, half = 0) => { const pts = []; for (let i = 0; i <= 60; i++) { const t = (i / 60) * Math.PI * 2;
  const x = 16 * Math.sin(t) ** 3, y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  if (half === -1 && x > 0.01) continue; if (half === 1 && x < -0.01) continue; pts.push([cx + x * r / 16, cy + y * r / 16]); } return pts; };
const wrap = (g, text, maxW) => { const words = text.split(" "), lines = []; let cur = "";
  for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; };

/** heart; split 0..1 cracks it apart */
export const fxLove = (p, split = 0) => {
  const g = p.g, dx = split * 70, rot = split * 0.25;
  if (split < 0.01) { p.poly(heartPts(300, 500, 230), "#e8455a", 12); p.stroke([[220, 400], [190, 450]], 16, "#ff8a9a"); return; }
  for (const s of [-1, 1]) { g.save(); g.translate(300 + s * dx, 520); g.rotate(s * rot); g.translate(-300, -520);
    const pts = heartPts(300, 500, 230, s);
    const zig = [[300, 440], [270, 500], [320, 560], [280, 620], [300, 700]];
    const poly = s < 0 ? [...pts.filter((q) => q[0] <= 300), ...zig.slice().reverse()] : [...pts.filter((q) => q[0] >= 300), ...zig];
    p.poly(poly, "#e8455a", 12); g.restore(); }
};

/** phone chat. msgs = [{me, text, k}] (k = pop 0..1); typing = dots on the other side */
export const fxChat = (p, msgs, typing = 0, name = "Mantan", cat = false) => {
  const g = p.g;
  p.poly(rrect(110, 120, 490, 900, 46), "#2b2f3a", 12);
  p.poly(rrect(132, 160, 468, 860, 26), "#efe7dc", 0);
  const hc = cat ? "#1877f2" : "#3a8f6a"; p.poly(rrect(132, 160, 468, 250, 26), hc, 0); p.poly([[132, 220], [468, 220], [468, 250], [132, 250]], hc, 0);
  if (cat) { for (const sx of [-1, 1]) p.poly([[180 + sx * 8, 184], [180 + sx * 24, 168], [180 + sx * 24, 194]], "#3a2a22", 2); p.ell(180, 205, 26, 26, "#f2c6a0", 4); p.ell(180, 192, 26, 14, "#3a2a22", 0); }
  else { p.ell(180, 205, 26, 26, "#f2c6a0", 4); p.poly(heartPts(180, 207, 14), "#e8455a", 0); }
  ptxt(g, name, 222, 196, 30, "#ffffff", 0, INK, "left"); ptxt(g, typing ? "mengetik..." : "online", 222, 228, 20, "#d8f2e4", 0, INK, "left");
  let y = 280;
  for (const m of msgs) {
    if (!(m.k > 0.01)) continue;
    g.font = `800 30px ${PF}`; const lines = wrap(g, m.text, 230), w = Math.max(...lines.map((l) => g.measureText(l).width)) + 40, h = lines.length * 40 + 26;
    const x0 = m.me ? 448 - w : 152;
    g.save(); g.translate(m.me ? 448 : 152, y + h / 2); g.scale(m.k, m.k); g.translate(-(m.me ? 448 : 152), -(y + h / 2));
    p.poly(rrect(x0, y, x0 + w, y + h, 20), m.me ? "#c9f2b0" : "#ffffff", 5);
    lines.forEach((l, i) => ptxt(g, l, x0 + 20, y + 33 + i * 40, 30, m.big ? "#c0302c" : INK, 0, INK, "left"));
    g.restore(); y += h + 18;
  }
  if (typing) { p.poly(rrect(152, y, 262, y + 56, 20), "#ffffff", 5); for (let i = 0; i < 3; i++) p.dot(184 + i * 24, y + 28 - (Math.floor(typing * 6 + i) % 3 === 0 ? 6 : 0), 8, "#8a90a0"); }
};

/** old-film subtitle: black bar, cream serif text, auto-fit up to 2 lines */
export const fxSubtitle = (p, text, prog = 1) => {
  const g = p.g; let fs = 46; g.font = `900 ${fs}px ${SERIF}`; let lines = wrap(g, text, 500);
  while (lines.length > 2 && fs > 30) { fs -= 2; g.font = `900 ${fs}px ${SERIF}`; lines = wrap(g, text, 500); }
  const h = lines.length * fs * 1.2 + 40;
  g.save(); g.globalAlpha = 0.82; p.poly(rrect(20, 500 - h / 2, 580, 500 + h / 2, 10), "#120c06", 0); g.restore();
  lines.forEach((l, i) => ptxt(g, l, 300, 500 - (lines.length - 1) * fs * 0.6 + i * fs * 1.2, fs, "#f6e7c4", 0, INK, "center", SERIF));
};

/** title stamp "MODE ZAINUDDIN: ON" */
export const fxMode = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.08);
  p.poly(rrect(-250, -90, 250, 90, 18), "#f6e7c4", 10); p.poly(rrect(-232, -72, 232, 72, 12), null, 5);
  ptxt(g, "MODE ZAINUDDIN", 0, -22, 44, "#7a3b1c", 0, INK, "center", SERIF); ptxt(g, "ON", 0, 38, 50, "#c0302c", 0, INK, "center", SERIF); g.restore();
};

/** vintage car with "MOBIL" money sparkle */
export const fxCar = (p) => {
  const g = p.g;
  p.poly([[90, 600], [110, 520], [200, 510], [250, 430], [400, 430], [450, 510], [510, 530], [520, 600]], "#2e5f8a", 10);
  p.poly([[265, 445], [320, 445], [320, 510], [225, 510]], "#bfe6ff", 6); p.poly([[335, 445], [390, 445], [430, 510], [335, 510]], "#bfe6ff", 6);
  for (const x of [190, 420]) { p.ell(x, 610, 52, 52, "#2b2522", 9); p.ell(x, 610, 22, 22, "#c9cfd6", 5); }
  p.ell(505, 560, 14, 12, "#ffe08a", 4);
  ptxt(g, "KAYA", 300, 760, 70, "#ffd84a", 12);
  for (const [x, y] of [[120, 420], [480, 400], [420, 330]]) p.stroke([[x - 18, y], [x + 18, y]], 6, "#ffd84a"), p.stroke([[x, y - 18], [x, y + 18]], 6, "#ffd84a");
};

/** phone charger with cable */
export const fxCharger = (p) => {
  const g = p.g;
  p.stroke([[300, 600], [300, 700], [220, 760], [380, 820], [300, 880]], 14, "#f4f1ea"); p.stroke([[300, 600], [300, 700], [220, 760], [380, 820], [300, 880]], 0.01);
  p.poly(rrect(200, 330, 400, 600, 34), "#f4f1ea", 10);
  p.poly(rrect(250, 260, 275, 335, 6), "#c9cfd6", 6); p.poly(rrect(325, 260, 350, 335, 6), "#c9cfd6", 6);
  p.poly([[310, 400], [270, 480], [305, 480], [285, 550], [340, 455], [305, 455], [325, 400]], "#ffd84a", 5);
};

/** ship sinking: sink 0..1 */
export const fxShip = (p, sink = 0, t = 0) => {
  const g = p.g;
  g.save(); g.beginPath(); g.rect(40, 200, 520, 440); g.clip();
  g.save(); g.translate(300, 520 + sink * 230); g.rotate(-0.08 - sink * 0.45);
  p.poly([[-220, -40], [220, -40], [180, 50], [-170, 50]], "#3a3330", 9);
  p.poly([[-150, -40], [140, -40], [140, -110], [-150, -110]], "#f4efe2", 8);
  for (const x of [-60, 50]) { p.poly(rrect(x - 26, -230, x + 26, -110, 6), "#f4efe2", 8); p.poly(rrect(x - 26, -230, x + 26, -195, 6), "#2b2522", 0); }
  for (let i = 0; i < 5; i++) p.dot(-110 + i * 55, -75, 10, "#7fb0c8");
  g.restore(); g.restore();
  // waves over the hull
  const pts = [[40, 900]]; for (let x = 40; x <= 560; x += 20) pts.push([x, 600 + 16 * Math.sin(x * 0.05 + t * 6)]); pts.push([560, 900]);
  p.poly(pts, "#3f7896", 9);
  ptxt(g, "BLUP...", 300, 740, 64, "#ffffff", 10);
};

/** water rising over the screen; lvl 0..1, t phase */
export const fxWater = (p, lvl, t = 0) => {
  const g = p.g, top = 1040 - lvl * 1100;
  const pts = [[-40, 1100]]; for (let x = -40; x <= 640; x += 20) pts.push([x, top + 18 * Math.sin(x * 0.03 + t * 5)]); pts.push([640, 1100]);
  g.save(); g.globalAlpha = 0.72; p.poly(pts, "#3a8fc0", 0); g.restore();
  p.stroke(pts.slice(1, -1), 8, "#bfe6ff");
  for (let i = 0; i < 14; i++) { const x = 40 + ((i * 97) % 520), y = top + 60 + ((i * 131 + t * 600) % Math.max(60, 1040 - top));
    if (y > top + 20) { g.save(); g.globalAlpha = 0.85; p.ell(x, y, 10 + (i % 3) * 5, 10 + (i % 3) * 5, null, 4); g.restore(); } }
};

/** film overlay: grain, scratches, vignette (whole 600x1000 canvas) */
export const fxFilm = (p, f) => {
  const g = p.g, r = (k) => Math.abs(Math.sin(f * 12.9898 + k * 78.233) * 43758.5453) % 1;
  g.save();
  const vg = g.createRadialGradient(300, 500, 260, 300, 500, 640); vg.addColorStop(0, "rgba(40,24,8,0)"); vg.addColorStop(1, "rgba(40,24,8,0.75)"); g.fillStyle = vg; g.fillRect(-50, -50, 700, 1100);
  g.globalAlpha = 0.5; g.strokeStyle = "#f6e7c4"; g.lineWidth = 2;
  for (let k = 0; k < 2; k++) if (r(k) > 0.4) { const x = r(k + 5) * 600; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (r(k + 9) - 0.5) * 30, 1000); g.stroke(); }
  g.fillStyle = "#1a1008"; for (let k = 0; k < 40; k++) { const s = 1 + r(k + 20) * 3; g.fillRect(r(k + 40) * 600, r(k + 60) * 1000, s, s); }
  g.restore();
};

/** intro poster */
export const fxPoster = (p, t = 0) => {
  const g = p.g;
  p.poly(rrect(70, 160, 530, 840, 18), "#f1dfb8", 12); p.poly(rrect(96, 186, 504, 814, 10), null, 5);
  for (let i = 0; i < 10; i++) { const a = -Math.PI + i * Math.PI / 9 + t * 0.2; p.stroke([[300, 560], [300 + Math.cos(a) * 260, 560 + Math.sin(a) * 260]], 14, "#e8c890"); }
  p.ell(300, 560, 90, 90, "#e0a050", 0);
  p.poly([[160, 600], [440, 600], [410, 650], [185, 650]], "#3a3330", 7); p.poly([[210, 600], [380, 600], [380, 560], [210, 560]], "#f4efe2", 6);
  p.poly(rrect(255, 500, 285, 560, 4), "#2b2522", 5);
  const wv = [[96, 680]]; for (let x = 96; x <= 504; x += 17) wv.push([x, 660 + 8 * Math.sin(x * 0.08 + t * 3)]); wv.push([504, 680]); p.poly([...wv, [504, 814], [96, 814]], "#3f7896", 0);
  ptxt(g, "HAYATI", 300, 270, 92, "#7a3b1c", 0, INK, "center", SERIF);
  ptxt(g, "MINTA BALIKAN", 300, 370, 54, "#c0302c", 0, INK, "center", SERIF);
  ptxt(g, "~ sebuah tragedi chat ~", 300, 430, 26, "#5a4030", 0, INK, "center", SERIF);
  ptxt(g, "MALAM KOMEDI", 300, 760, 30, "#f6e7c4", 0, INK, "center", SERIF);
};

export const fxShout = (p, text, fill = "#ffd84a", size = 120) => ptxt(p.g, text, 300, 500, size, fill, Math.round(size * 0.2));

/** DSLR camera */
export const fxCamera = (p) => {
  p.poly(rrect(110, 380, 490, 640, 30), "#2b2f3a", 10);
  p.poly(rrect(180, 330, 300, 390, 12), "#2b2f3a", 9);
  p.poly(rrect(400, 350, 460, 385, 8), "#e0352b", 6);
  p.ell(300, 515, 110, 110, "#3a3f4a", 10); p.ell(300, 515, 75, 75, "#1a1d24", 7); p.ell(300, 515, 40, 40, "#4a6a9a", 5);
  p.ell(282, 495, 14, 14, "#ffffff", 0);
  p.poly(rrect(130, 400, 200, 440, 8), "#8a90a0", 0);
};
/** camera viewfinder overlay (whole canvas); rec = blinking dot */
export const fxViewfinder = (p, rec = true) => {
  const g = p.g; g.save();
  g.strokeStyle = "#ffffff"; g.lineWidth = 10; g.lineCap = "round";
  for (const [x, y, dx, dy] of [[90, 190, 1, 1], [510, 190, -1, 1], [90, 810, 1, -1], [510, 810, -1, -1]]) { g.beginPath(); g.moveTo(x, y + dy * 70); g.lineTo(x, y); g.lineTo(x + dx * 70, y); g.stroke(); }
  g.lineWidth = 4; g.beginPath(); g.moveTo(280, 500); g.lineTo(320, 500); g.moveTo(300, 480); g.lineTo(300, 520); g.stroke();
  if (rec) { g.fillStyle = "#e0352b"; g.beginPath(); g.arc(130, 245, 14, 0, 7); g.fill(); }
  ptxt(g, "REC", 158, 246, 30, "#ffffff", 0, INK, "left");
  ptxt(g, "ISO 800  1/125  f2.8", 300, 770, 24, "#ffffff", 0, INK, "center");
  g.restore();
};
/** price tag "FREELANCE" */
export const fxTag = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.12);
  p.poly([[-230, -120], [170, -120], [250, 0], [170, 120], [-230, 120]], "#ffd84a", 10); p.ell(160, 0, 20, 20, "#ffffff", 6);
  ptxt(g, "FREELANCE", -40, -38, 58, "#241726"); ptxt(g, "Rp150rb/jam", -40, 48, 50, "#c0302c");
  g.restore();
};
/** first-frame hook text: two big lines */
export const fxHook = (p, a, b) => {
  const g = p.g;
  g.font = `900 80px ${PF}`; const s1 = Math.min(80, Math.floor(80 * 560 / g.measureText(a).width)); g.font = `900 80px ${PF}`; const s2 = Math.min(80, Math.floor(80 * 560 / g.measureText(b).width));
  ptxt(g, a, 300, 440, s1, "#ffffff", 16); ptxt(g, b, 300, 545, s2, "#ffd84a", 16);
};
/** "besok" teaser card */
export const fxNext = (p) => {
  const g = p.g;
  p.poly(rrect(70, 330, 530, 670, 30), "#241726", 10);
  ptxt(g, "BESOK:", 300, 400, 54, "#ffd84a");
  ptxt(g, "BALIKIN", 300, 480, 66, "#ffffff"); ptxt(g, "CHARGER", 300, 560, 66, "#ff8ac8");
  ptxt(g, "SERI MANTAN #4", 300, 630, 30, "#bfe6ff");
};


// ---------- "Kenalan Cewek di Facebook" ----------
const girlFace = (p, cx, cy, r, ears) => {
  if (ears > 0.01) for (const sx of [-1, 1]) { const e = ears; p.poly([[cx + sx * r * 0.35, cy - r * 0.75], [cx + sx * r * 0.95 * e + sx * r * 0.3 * (1 - e), cy - r * (0.75 + 0.75 * e)], [cx + sx * r * 0.95, cy - r * 0.3]], "#3a2a22", 6);
    p.poly([[cx + sx * r * 0.5, cy - r * 0.78], [cx + sx * r * 0.85 * e + sx * r * 0.4 * (1 - e), cy - r * (0.78 + 0.5 * e)], [cx + sx * r * 0.82, cy - r * 0.45]], "#f6a6c6", 0); }
  p.ell(cx, cy + r * 0.15, r * 1.05, r * 1.15, "#3a2a22", 6);
  p.ell(cx, cy + r * 0.05, r * 0.8, r * 0.85, "#f5cfa8", 5);
  p.ell(cx, cy - r * 0.55, r * 0.85, r * 0.35, "#3a2a22", 0);
  for (const sx of [-1, 1]) { p.ell(cx + sx * r * 0.3, cy + r * 0.02, r * 0.09, r * 0.13, INK, 0); p.ell(cx + sx * r * 0.48, cy + r * 0.25, r * 0.13, r * 0.08, "#f6a6c6", 0); }
  p.stroke([[cx - r * 0.22, cy + r * 0.35], [cx, cy + r * 0.47], [cx + r * 0.22, cy + r * 0.35]], 5, INK);
  if (ears > 0.01) for (const sx of [-1, 1]) for (const k of [-1, 1]) p.stroke([[cx + sx * r * 0.55, cy + r * 0.3 + k * 6], [cx + sx * r * 0.95, cy + r * 0.25 + k * 14]], 3, INK);
};
/** Facebook profile in a phone; ears 0..1 = cat filter */
export const fxProfile = (p, ears = 1) => {
  const g = p.g;
  p.poly(rrect(110, 120, 490, 900, 46), "#2b2f3a", 12);
  p.poly(rrect(132, 160, 468, 860, 26), "#ffffff", 0);
  p.poly(rrect(132, 160, 468, 330, 26), "#f6c6dc", 0); p.poly([[132, 300], [468, 300], [468, 330], [132, 330]], "#f6c6dc", 0);
  for (let i = 0; i < 6; i++) p.poly(heartPts(170 + i * 60, 220 + (i % 2) * 40, 14), "#ffffff", 0);
  p.ell(300, 360, 92, 92, "#ffffff", 0); p.ell(300, 360, 84, 84, "#ffe8f2", 4);
  girlFace(p, 300, 365, 62, ears);
  ptxt(g, "Putri Manis", 300, 495, 40, INK);
  ptxt(g, "Tinggal di hatimu", 300, 540, 24, "#65676b");
  p.poly(rrect(160, 590, 440, 650, 14), "#1877f2", 0); ptxt(g, "+ Tambah Teman", 300, 621, 28, "#ffffff");
  p.poly(rrect(160, 665, 440, 725, 14), "#e4e6eb", 0); ptxt(g, "Kirim Pesan", 300, 696, 28, INK);
  ptxt(g, "1.248 teman", 300, 770, 24, "#65676b");
};
/** promo card */
export const fxPromo = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.06);
  p.poly(rrect(-230, -170, 230, 170, 30), "#ff5fa2", 10);
  ptxt(g, "PROMO!", 0, -110, 60, "#ffd84a", 10);
  ptxt(g, "BELI 2", 0, -25, 76, "#ffffff", 10); ptxt(g, "GRATIS 1", 0, 60, 70, "#ffffff", 10);
  ptxt(g, "skincare glowing", 0, 130, 30, "#241726");
  g.restore();
};
/** cardboard parcel */
export const fxParcel = (p) => {
  const g = p.g;
  p.poly([[120, 420], [480, 420], [480, 760], [120, 760]], "#c8925a", 10);
  p.poly([[120, 420], [200, 340], [560, 340], [480, 420]], "#d9a46a", 10); p.poly([[480, 420], [560, 340], [560, 680], [480, 760]], "#b07a48", 10);
  p.band([[300, 420], [300, 760]], "#e8d4a0", 40, 0);
  p.poly(rrect(160, 560, 440, 700, 12), "#ffffff", 6);
  ptxt(g, "SKINCARE", 300, 605, 40, "#ff5fa2"); ptxt(g, "COD - FRAGILE", 300, 660, 24, INK);
};
/** sparkles around a glowing face; t phase */
export const fxSparkle = (p, t) => {
  for (let i = 0; i < 9; i++) { const a = i * 0.7 + t * 2, r = 200 + 40 * Math.sin(i * 1.9 + t * 4), x = 300 + Math.cos(a) * r * 1.1, y = 500 + Math.sin(a) * r, s = 18 + 12 * Math.abs(Math.sin(t * 6 + i));
    p.poly([[x, y - s * 2], [x + s * 0.5, y - s * 0.5], [x + s * 2, y], [x + s * 0.5, y + s * 0.5], [x, y + s * 2], [x - s * 0.5, y + s * 0.5], [x - s * 2, y], [x - s * 0.5, y - s * 0.5]], i % 2 ? "#fff3b0" : "#ffffff", 4); }
};
/** teaser: besok kenalan lewat game */
export const fxNextGame = (p) => {
  const g = p.g;
  p.poly(rrect(70, 330, 530, 670, 30), "#241726", 10);
  ptxt(g, "BESOK:", 300, 400, 54, "#ffd84a");
  ptxt(g, "KENALAN", 300, 480, 66, "#ffffff"); ptxt(g, "LEWAT GAME", 300, 560, 60, "#ff8ac8");
  ptxt(g, "SERI KENALAN #2", 300, 630, 30, "#bfe6ff");
};


// ---------- "Heboh Soal Ijazah" ----------
/** TV breaking-news card (no faces) */
export const fxNews = (p, t = 0, label = "IJAZAH") => {
  const g = p.g;
  p.poly(rrect(70, 250, 530, 640, 26), "#2b2f3a", 12); p.poly(rrect(95, 275, 505, 590, 10), "#1d4f9a", 0);
  p.poly([[95, 470], [505, 470], [505, 540], [95, 540]], "#e0352b", 0);
  ptxt(g, "BREAKING NEWS", 300, 505, 40, "#ffffff");
  p.poly(rrect(160, 320, 440, 450, 12), "#f4efe2", 6);
  ptxt(g, label, 300, 365, 48, "#7a3b1c"); for (let i = 0; i < 3; i++) p.band([[200, 400 + i * 14], [400, 400 + i * 14]], "#c8b48a", 5, 0);
  const off = (t * 220) % 520; g.save(); g.beginPath(); g.rect(95, 545, 410, 40); g.clip();
  ptxt(g, "HEBOH SE-INDONESIA  •  HEBOH SE-INDONESIA  •", 505 - off, 566, 24, "#ffd84a", 0, INK, "left"); g.restore();
  p.poly([[250, 640], [350, 640], [380, 700], [220, 700]], "#2b2f3a", 8);
};
/** wardrobe with the diploma wedged under one leg */
export const fxLemari = (p) => {
  const g = p.g;
  p.poly(rrect(150, 230, 450, 760, 10), "#9a6a42", 10); p.stroke([[300, 240], [300, 750]], 6, "#5e3c26");
  p.dot(285, 490, 9, "#e2b04a"); p.dot(315, 490, 9, "#e2b04a");
  p.poly(rrect(165, 760, 205, 800, 4), "#5e3c26", 6); p.poly(rrect(395, 780, 435, 820, 4), "#5e3c26", 6);
  g.save(); g.translate(205, 806); g.rotate(-0.04); p.poly(rrect(-80, -20, 120, 20, 4), "#f4efe2", 6); ptxt(g, "IJAZAH", 20, 1, 30, "#7a3b1c"); g.restore();
  p.band([[120, 822], [480, 822]], "#c9a07a", 10, 0);
};
/** report card: MATEMATIKA 5 */
export const fxRapor = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.05);
  p.poly(rrect(-200, -230, 200, 230, 14), "#ffffff", 10);
  ptxt(g, "NILAI", 0, -180, 40, "#241726");
  const rows = [["B. INDO", "7"], ["IPA", "6"], ["MATEMATIKA", "5"], ["OLAHRAGA", "9"]];
  rows.forEach(([a, b], i) => { const y = -100 + i * 75, hot = a === "MATEMATIKA";
    if (hot) p.ell(140, y, 46, 36, null, 7);
    ptxt(g, a, -170, y, 30, hot ? "#c0302c" : "#241726", 0, INK, "left"); ptxt(g, b, 140, y, 42, hot ? "#c0302c" : "#241726"); });
  g.restore();
};
/** diploma with old photo; edited 0..1 smooths the face and adds a stamp */
export const fxIjazah = (p, edited = 0) => {
  const g = p.g;
  p.poly(rrect(70, 230, 530, 770, 14), "#f4efe2", 10); p.poly(rrect(90, 250, 510, 750, 8), null, 4);
  ptxt(g, "IJAZAH", 300, 300, 56, "#7a3b1c");
  for (let i = 0; i < 6; i++) p.band([[250, 400 + i * 40], [480, 400 + i * 40]], "#c8b48a", 6, 0);
  p.poly(rrect(110, 380, 230, 540, 4), "#d8453b", 4);
  const cx = 170, cy = 465;
  p.ell(cx, cy + 6, 44, 50, edited > 0.5 ? "#f2c8a4" : "#e8b48a", 4);
  p.poly([[cx - 46, cy - 6], [cx - 40, cy - 46], [cx, cy - 56], [cx + 40, cy - 46], [cx + 46, cy - 6], [cx + 4, cy - 40], [cx - 4, cy - 40]], "#2a1d18", 0);
  p.stroke([[cx, cy - 52], [cx, cy - 38]], 3, "#e8b48a");
  p.dot(cx - 14, cy + 2, 4, INK); p.dot(cx + 14, cy + 2, 4, INK); p.stroke([[cx - 10, cy + 26], [cx + 10, cy + 26]], 3, INK);
  if (edited < 0.5) for (const [dx, dy] of [[-22, 18], [24, 14], [6, -16]]) p.dot(cx + dx, cy + dy, 5, "#c0302c");
  ptxt(g, "Nama: GUE", 370, 610, 30, "#241726"); ptxt(g, "Lulus: pas-pasan", 370, 655, 26, "#241726");
  if (edited > 0.01) { g.save(); g.translate(330, 700); g.scale(edited, edited); g.rotate(-0.15);
    p.poly(rrect(-140, -40, 140, 40, 10), "#ffffff", 6); ptxt(g, "DI-EDIT ✓", 0, 3, 40, "#1f7a3a"); g.restore();
    for (const [x, y] of [[110, 370], [235, 400], [120, 550]]) { p.stroke([[x - 16, y], [x + 16, y]], 5, "#ffd84a"); p.stroke([[x, y - 16], [x, y + 16]], 5, "#ffd84a"); } }
};
/** job ad: satpam needs a diploma */
export const fxLowongan = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.04);
  p.poly(rrect(-230, -230, 230, 230, 18), "#fff8d8", 10);
  p.poly(rrect(-230, -230, 230, -130, 18), "#2b3a6a", 0); p.poly([[-230, -150], [230, -150], [230, -130], [-230, -130]], "#2b3a6a", 0);
  ptxt(g, "LOWONGAN", 0, -180, 50, "#ffd84a");
  ptxt(g, "SATPAM", 0, -75, 64, "#241726");
  ptxt(g, "Syarat:", -180, 10, 34, "#241726", 0, INK, "left");
  ptxt(g, "- IJAZAH ASLI", -180, 70, 36, "#c0302c", 0, INK, "left");
  ptxt(g, "- Legalisir 3x", -180, 125, 30, "#241726", 0, INK, "left");
  ptxt(g, "- Siap begadang", -180, 175, 30, "#241726", 0, INK, "left");
  g.restore();
};

// ---------- "Janji 19 Juta Lapangan Kerja" ----------
export const fxBillboard = (p) => {
  const g = p.g;
  p.poly(rrect(60, 300, 540, 620, 20), "#1d4f9a", 12); p.poly(rrect(80, 320, 520, 600, 12), "#ffffff", 0);
  ptxt(g, "DIBUKA!", 300, 365, 44, "#c0302c");
  ptxt(g, "19.000.000", 300, 450, 84, "#1d4f9a", 10, "#ffffff");
  ptxt(g, "LAPANGAN KERJA", 300, 540, 46, "#241726");
  for (const x of [170, 430]) p.poly(rrect(x - 12, 620, x + 12, 780, 4), "#5e3c26", 6);
};
export const fxMap = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.06);
  p.poly(rrect(-210, -260, 210, 260, 12), "#c8925a", 10); p.poly(rrect(-60, -280, 60, -250, 8), "#a8743e", 6);
  p.poly(rrect(-170, -190, 30, -60, 6), "#ffffff", 6); ptxt(g, "KTP", -70, -150, 34, "#1d4f9a"); for (let i = 0; i < 3; i++) p.band([[-150, -110 + i * 18], [10, -110 + i * 18]], "#9aa0b0", 5, 0);
  p.poly(rrect(60, -190, 170, -50, 4), "#d8453b", 6); p.ell(115, -135, 30, 34, "#e8b48a", 4); p.ell(115, -165, 32, 14, "#2a1d18", 0); p.ell(115, -70, 40, 22, "#ffffff", 0);
  p.poly(rrect(-170, 0, 170, 200, 6), "#fff8d8", 6); ptxt(g, "LAMARAN", 0, 50, 44, "#241726"); ptxt(g, "dari 2024", 0, 120, 36, "#c0302c");
  g.restore();
};
export const fxBursa = (p) => {
  const g = p.g;
  p.poly([[40, 330], [560, 330], [530, 430], [560, 530], [40, 530], [70, 430]], "#e0352b", 10);
  ptxt(g, "BURSA KERJA", 300, 400, 64, "#ffffff"); ptxt(g, "antrean: 19 juta orang", 300, 475, 30, "#ffd84a");
};
/** CV card; star = funny highlight */
export const fxCV = (p, who, exp, star = false) => {
  const g = p.g;
  p.poly(rrect(110, 230, 490, 770, 14), "#ffffff", 10);
  p.poly(rrect(110, 230, 490, 320, 14), star ? "#ffd84a" : "#9aa0b0", 0); p.poly([[110, 300], [490, 300], [490, 320], [110, 320]], star ? "#ffd84a" : "#9aa0b0", 0);
  ptxt(g, "CV", 300, 275, 56, "#241726");
  p.ell(300, 400, 55, 55, "#e8e8ee", 5); ptxt(g, "?", 300, 404, 60, "#9aa0b0");
  ptxt(g, who, 300, 500, 40, "#241726");
  ptxt(g, "Pengalaman:", 300, 565, 30, "#65676b");
  g.font = `900 40px ${PF}`; const lines = wrap(g, exp, 340); lines.forEach((l, i) => ptxt(g, l, 300, 625 + i * 48, 40, star ? "#c0302c" : "#1d4f9a"));
  if (star) for (const [x, y] of [[150, 560], [450, 520], [440, 720]]) { p.stroke([[x - 18, y], [x + 18, y]], 6, "#ffd84a"); p.stroke([[x, y - 18], [x, y + 18]], 6, "#ffd84a"); }
};
/** "nggak enak" meter: k = 1..3 */
export const fxMeter = (p, k) => {
  const g = p.g;
  p.poly(rrect(60, 340, 540, 660, 24), "#241726", 10);
  ptxt(g, "RASA NGANGGUR", 300, 395, 40, "#ffd84a");
  ["AWAL", "TENGAH", "AKHIR"].forEach((t, i) => { const x = 140 + i * 160, on = k > i;
    p.poly(rrect(x - 70, 440, x + 70, 560, 14), on ? ["#ff9a3c", "#e0352b", "#8a1020"][i] : "#3a3f52", 6);
    ptxt(g, t, x, 500, 30, "#ffffff"); });
  ptxt(g, "NGGAK ENAK", 300, 615, 40, "#ffffff");
};
export const fxRec = (p, blink = true) => {
  const g = p.g;
  p.poly(rrect(130, 200, 470, 800, 40), "#2b2f3a", 12); p.poly(rrect(152, 240, 448, 760, 20), "#3a8f6a", 0);
  if (blink) p.dot(200, 290, 18, "#e0352b"); ptxt(g, "REC", 230, 291, 34, "#ffffff", 0, INK, "left");
  ptxt(g, "KONTEN", 300, 470, 60, "#ffffff", 8); ptxt(g, "NGANGGUR", 300, 540, 52, "#ffd84a", 8); ptxt(g, "1 JT VIEWS", 300, 650, 40, "#ffffff");
};
/** job ad: komika; lulus 0..1 stamp */
export const fxKomika = (p, syarat = 0, lulus = 0) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.03);
  p.poly(rrect(-230, -240, 230, 240, 18), "#fff8d8", 10);
  p.poly(rrect(-230, -240, 230, -140, 18), "#7a3fa0", 0); p.poly([[-230, -160], [230, -160], [230, -140], [-230, -140]], "#7a3fa0", 0);
  ptxt(g, "LOWONGAN", 0, -190, 50, "#ffd84a");
  ptxt(g, "KOMIKA", 0, -85, 66, "#241726");
  ptxt(g, "Syarat:", -180, 0, 34, "#241726", 0, INK, "left");
  if (syarat > 0.01) { ptxt(g, "KUAT DIHUJAT", 0, 70, 50, "#c0302c"); ptxt(g, "NETIZEN", 0, 130, 50, "#c0302c"); }
  if (lulus > 0.01) { g.save(); g.translate(60, 190); g.scale(lulus, lulus); g.rotate(-0.2); p.poly(rrect(-140, -45, 140, 45, 12), null, 8);
    ptxt(g, "LULUS ✓", 0, 3, 54, "#1f7a3a"); g.restore(); }
  g.restore();
};

// ---------- "Tunggu Kena Karma" ----------
export const fxComments = (p, n = 4) => {
  const g = p.g, names = ["netizen1", "warga62", "akunbaru", "mak_ijah"];
  for (let i = 0; i < n; i++) { const y = 300 + i * 115, x = 90 + (i % 2) * 30;
    p.ell(x + 30, y + 40, 30, 30, ["#ff9a3c", "#3a7bd5", "#7a3fa0", "#2b6a3a"][i], 4);
    p.poly(rrect(x + 75, y, x + 470, y + 90, 22), "#ffffff", 5);
    ptxt(g, names[i], x + 95, y + 25, 22, "#65676b", 0, INK, "left"); ptxt(g, "TUNGGU KENA KARMA!", x + 95, y + 60, 32, "#c0302c", 0, INK, "left"); }
};
export const fxLoket = (p, k = 3) => {
  const g = p.g;
  p.poly(rrect(70, 250, 530, 760, 16), "#f4efe2", 10); p.poly(rrect(70, 250, 530, 360, 16), "#1d4f9a", 0); p.poly([[70, 330], [530, 330], [530, 360], [70, 360]], "#1d4f9a", 0);
  ptxt(g, "LOKET KARMA", 300, 305, 54, "#ffffff");
  ptxt(g, "Syarat:", 110, 410, 36, "#241726", 0, INK, "left");
  ["Surat pengantar RT", "Legalisir 3x", "Antre 3 bulan"].forEach((t, i) => { if (k > i) { p.poly(rrect(110, 450 + i * 95, 160, 500 + i * 95, 8), "#ffffff", 5); p.stroke([[118, 475 + i * 95], [132, 490 + i * 95], [152, 460 + i * 95]], 7, "#1f7a3a"); ptxt(g, t, 180, 476 + i * 95, 36, "#241726", 0, INK, "left"); } });
};
export const fxPensiun = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.05);
  p.poly(rrect(-220, -150, 220, 150, 20), "#1f7a3a", 10);
  ptxt(g, "PENSIUN ✓", 0, -70, 60, "#ffffff"); ptxt(g, "+ TUNJANGAN", 0, 10, 50, "#ffd84a");
  for (let i = 0; i < 5; i++) p.poly(rrect(-150 + i * 60, 60, -100 + i * 60, 120, 6), "#7fd0a0", 5);
  g.restore();
};
/** orange vest on a hanger; medal 0..1 */
export const fxRompi = (p, medal = 0) => {
  const g = p.g;
  p.stroke([[300, 230], [300, 270]], 8, "#4a4f5a"); p.arc(300, 225, 22, 22, 180, 360, 8);
  p.stroke([[150, 330], [300, 270], [450, 330]], 10, "#4a4f5a");
  p.poly([[160, 330], [250, 290], [300, 380], [350, 290], [440, 330], [470, 760], [130, 760]], "#ff7a1a", 10);
  p.stroke([[300, 380], [300, 760]], 6, INK);
  ptxt(g, "TAHANAN", 300, 560, 46, "#ffffff", 8);
  if (medal > 0.01) { g.save(); g.translate(390, 450); g.scale(medal, medal); g.rotate(0.15);
    p.poly([[-30, -120], [0, -40], [30, -120]], "#e0352b", 5); p.ell(0, 0, 60, 60, "#ffd84a", 7); ptxt(g, "JUARA 1", 0, -8, 24, INK); ptxt(g, "17-AN", 0, 20, 22, INK); g.restore(); }
};
export const fxKursiRoda = (p, empty = true) => {
  const g = p.g;
  p.ell(230, 650, 120, 120, null, 12); p.ell(230, 650, 20, 20, "#4a4f5a", 5);
  p.ell(420, 720, 45, 45, null, 9);
  p.poly(rrect(200, 520, 420, 570, 10), "#3a7bd5", 7); p.poly(rrect(380, 330, 420, 570, 10), "#3a7bd5", 7);
  p.stroke([[420, 340], [470, 330]], 10, INK); p.stroke([[220, 570], [420, 690]], 8, INK);
  if (empty) ptxt(g, "MENDADAK SAKIT", 300, 250, 48, "#ffffff", 9);
};
export const fxCaleg = (p) => {
  const g = p.g;
  p.poly(rrect(110, 220, 490, 780, 14), "#e0352b", 10); p.poly(rrect(130, 240, 470, 760, 8), "#ffffff", 0);
  p.ell(300, 400, 90, 100, "#3a3f4a", 0); p.poly([[170, 600], [200, 500], [400, 500], [430, 600]], "#3a3f4a", 0);
  ptxt(g, "PILIH SAYA", 300, 660, 50, "#c0302c"); ptxt(g, "LAGI!", 300, 720, 54, "#c0302c");
  ptxt(g, "(baru keluar)", 300, 265, 26, "#65676b");
};
export const fxDiskon = (p) => {
  const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.12);
  p.poly([[-230, -130], [170, -130], [250, 0], [170, 130], [-230, 130]], "#ffd84a", 10); p.ell(160, 0, 20, 20, "#ffffff", 6);
  ptxt(g, "KARMA", -40, -55, 60, "#241726"); ptxt(g, "DISKON 90%", -40, 45, 58, "#c0302c");
  g.restore();
};
export const fxJanji = (p) => {
  const g = p.g;
  p.poly(rrect(120, 260, 480, 740, 26), "#ffffff", 12); p.poly(rrect(120, 260, 480, 380, 26), "#d8453b", 0); p.poly([[120, 360], [480, 360], [480, 380], [120, 380]], "#d8453b", 0);
  ptxt(g, "JANJI", 300, 320, 56, "#ffffff");
  ptxt(g, "5", 300, 520, 170, "#241726"); ptxt(g, "TAHUN LAGI", 300, 660, 48, "#c0302c");
};
/** two queues: prioritas (short) vs reguler (long) */
export const fxJalur = (p) => {
  const g = p.g;
  p.poly(rrect(40, 260, 290, 740, 18), "#ffd84a", 8); p.poly(rrect(310, 260, 560, 740, 18), "#9aa0b0", 8);
  ptxt(g, "PRIORITAS", 165, 310, 36, "#241726"); ptxt(g, "(pejabat)", 165, 352, 26, "#241726");
  ptxt(g, "REGULER", 435, 310, 40, "#ffffff"); ptxt(g, "(rakyat)", 435, 352, 26, "#ffffff");
  p.ell(165, 450, 30, 30, "#3a3f4a", 4); ptxt(g, "→ 1 orang", 165, 520, 28, "#241726");
  for (let i = 0; i < 12; i++) p.ell(360 + (i % 4) * 50, 420 + Math.floor(i / 4) * 70, 20, 20, "#5a6070", 3);
  ptxt(g, "→ 270 juta", 435, 680, 30, "#ffffff");
};


// ---------- "Gombalin Cewek Genit" ----------
export const fxZap = (p, t = 0) => {
  const g = p.g;
  p.poly(heartPts(300, 500, 200), "#ff5f8a", 12);
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4 + Math.sin(t * 9 + i) * 0.1, x = 300 + Math.cos(a) * 260, y = 500 + Math.sin(a) * 260;
    g.save(); g.translate(x, y); g.rotate(a); p.poly([[-20, -70], [20, -10], [0, -10], [25, 70], [-15, 5], [5, 5]], "#ffd84a", 6); g.restore(); }
};
export const fxUduk = (p) => {
  const g = p.g;
  p.ell(300, 560, 230, 80, "#ffffff", 10); p.ell(300, 545, 190, 55, "#f4efe2", 0);
  p.ell(260, 520, 110, 55, "#f7f2e6", 6); for (let i = 0; i < 6; i++) p.dot(220 + i * 18, 500 + (i % 2) * 14, 6, "#e8dcc4");
  p.poly([[350, 480], [450, 470], [440, 540], [360, 545]], "#c8803a", 6); p.ell(400, 560, 40, 20, "#e8a040", 5); p.ell(200, 470, 30, 18, "#d8453b", 5);
  ptxt(g, "NASI UDUK", 300, 700, 56, "#241726", 0);
};
export const fxHearts = (p, t = 0) => {
  for (let i = 0; i < 6; i++) { const ph = (t * 0.6 + i / 6) % 1, x = 300 + Math.sin(i * 2.1 + ph * 6) * 150, y = 820 - ph * 600, r = 30 + (i % 3) * 12;
    const g = p.g; g.save(); g.globalAlpha = 1 - ph * 0.8; p.poly(heartPts(x, y, r), i % 2 ? "#ff5f8a" : "#ff8ac8", 4); g.restore(); }
};
export const fxNikah = (p) => {
  const g = p.g;
  p.poly(rrect(110, 250, 490, 760, 26), "#ffffff", 12); p.poly(rrect(110, 250, 490, 370, 26), "#ff5f8a", 0); p.poly([[110, 350], [490, 350], [490, 370], [110, 370]], "#ff5f8a", 0);
  ptxt(g, "NIKAH", 300, 310, 60, "#ffffff");
  ptxt(g, "SEKARANG", 300, 520, 64, "#c0302c"); ptxt(g, "?!", 300, 640, 110, "#c0302c");
  p.poly(heartPts(430, 700, 30), "#ff5f8a", 4);
};
export const fxRecK = (p, blink = true) => {
  const g = p.g;
  p.poly(rrect(130, 200, 470, 800, 40), "#2b2f3a", 12); p.poly(rrect(152, 240, 448, 760, 20), "#3a3f52", 0);
  if (blink) p.dot(200, 290, 18, "#e0352b"); ptxt(g, "REC", 230, 291, 34, "#ffffff", 0, INK, "left");
  ptxt(g, "LATIHAN", 300, 470, 56, "#ffffff", 8); ptxt(g, "GOMBAL", 300, 540, 56, "#ffd84a", 8); ptxt(g, "#konten", 300, 650, 40, "#bfe6ff");
};
export const fxBakso = (p) => {
  const g = p.g;
  p.poly(rrect(120, 380, 480, 640, 14), "#3a7bd5", 10); p.poly(rrect(140, 300, 460, 380, 10), "#f4f1ea", 8);
  ptxt(g, "BAKSO", 300, 340, 56, "#c0302c");
  p.poly(rrect(160, 420, 300, 600, 10), "#cfe8f0", 6); for (let i = 0; i < 4; i++) p.ell(200 + (i % 2) * 50, 470 + Math.floor(i / 2) * 60, 22, 22, "#b08a6a", 4);
  p.ell(380, 500, 55, 45, "#c9cfd6", 6); p.stroke([[380, 450], [380, 400], [395, 380]], 6, "#e8e8ee");
  for (const x of [170, 430]) { p.ell(x, 670, 40, 40, null, 9); p.dot(x, 670, 8, INK); }
  p.stroke([[480, 500], [560, 470]], 10, "#5e3c26");
  ptxt(g, "Ting! Ting!", 300, 760, 40, "#ffffff", 8);
};


// ---------- "Kena Prank Bule Bandung" ----------
export const fxNoteCard = (p, text, col = "#fff8d8") => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.04);
  p.poly(rrect(-250, -90, 250, 90, 18), col, 10); g.font = `900 64px ${PF}`; let sz = Math.min(64, Math.floor(64 * 440 / g.measureText(text).width));
  if (sz < 46 && text.includes(" ")) { const w = text.split(" "); let best = null; for (let i = 1; i < w.length; i++) { const a = w.slice(0, i).join(" "), b = w.slice(i).join(" "), m = Math.max(g.measureText(a).width, g.measureText(b).width); if (!best || m < best[2]) best = [a, b, m]; }
    const s2 = Math.min(56, Math.floor(64 * 440 / best[2])); ptxt(g, best[0], 0, -30, s2, "#241726"); ptxt(g, best[1], 0, 36, s2, "#241726"); }
  else ptxt(g, text, 0, 4, sz, "#241726"); g.restore(); };
export const fxStamp = (p, a, b) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.12);
  p.poly(rrect(-260, -110, 260, 110, 16), null, 12); p.poly(rrect(-240, -90, 240, 90, 10), null, 5);
  ptxt(g, a, 0, -30, 72, "#c0302c"); ptxt(g, b, 0, 50, 54, "#c0302c"); g.restore(); };
export const fxKamus = (p) => { const g = p.g;
  p.poly([[60, 300], [300, 340], [300, 740], [60, 700]], "#ffffff", 9); p.poly([[540, 300], [300, 340], [300, 740], [540, 700]], "#f4efe2", 9);
  p.poly(rrect(60, 230, 540, 300, 12), "#c0302c", 8); ptxt(g, "KAMUS INGGRIS-INDONESIA", 300, 266, 30, "#ffffff");
  ptxt(g, "mouth", 180, 470, 52, "#1d4f9a"); ptxt(g, "=", 300, 520, 60, "#241726"); ptxt(g, "mulut", 420, 570, 52, "#c0302c");
  for (let i = 0; i < 3; i++) { p.band([[100, 620 + i * 26], [270, 640 + i * 26]], "#c8c8d0", 5, 0); p.band([[330, 620 + i * 26], [500, 600 + i * 26]], "#c8c8d0", 5, 0); } };
export const fxKTP = (p) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.04);
  p.poly(rrect(-260, -170, 260, 170, 18), "#7fb8e0", 10);
  ptxt(g, "PROVINSI JAWA BARAT", 0, -130, 28, "#241726"); ptxt(g, "KOTA CIMAHI", 0, -90, 34, "#241726");
  p.poly(rrect(100, -60, 220, 100, 6), "#d8453b", 5); p.ell(160, 10, 40, 46, "#f6d8c4", 4); p.ell(160, -28, 44, 22, "#f2c94c", 0);
  ptxt(g, "Nama: NENG", -230, -30, 30, "#241726", 0, INK, "left"); ptxt(g, "Asal: Bandung", -230, 20, 30, "#241726", 0, INK, "left");
  ptxt(g, "Bahasa: Sunda", -230, 70, 30, "#241726", 0, INK, "left"); ptxt(g, "Muka: BULE", -230, 120, 30, "#c0302c", 0, INK, "left");
  g.restore(); };
export const fxStampC = (p, a, b, col = "#2f9a4a") => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.1);
  p.poly(rrect(-260, -110, 260, 110, 16), "#ffffffdd", 12); p.poly(rrect(-240, -90, 240, 90, 10), null, 5);
  ptxt(g, a, 0, -30, 70, col); ptxt(g, b, 0, 50, 54, col); g.restore(); };
export const fxPhoneMsg = (p, a, b, ring = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(0.05 * Math.sin(ring * 2.5));
  p.poly(rrect(-150, -270, 150, 270, 36), "#2b2f3a", 12); p.poly(rrect(-125, -230, 125, 220, 16), "#bfe6ff", 0);
  p.poly(rrect(-110, -110, 110, 60, 18), "#ffffff", 6); ptxt(g, a, 0, -62, 30, "#2f9a4a"); ptxt(g, b, 0, 0, 24, "#241726");
  p.dot(0, 245, 12, "#5d6470"); if (ring) for (const sd of [-1, 1]) for (let k = 1; k <= 2; k++) p.stroke([[sd * (175 + k * 26), -60 - k * 14], [sd * (190 + k * 30), 0], [sd * (175 + k * 26), 60 + k * 14]], 9, "#ffd84a");
  g.restore(); };
export const fxRain = (p, t) => { const g = p.g; g.save(); g.lineCap = "round";
  for (let i = 0; i < 70; i++) { const x = (i * 97 + t * 13) % 640 - 20, y = ((i * 211) % 1000 + t * 90) % 1060 - 60, l = 30 + (i % 4) * 12;
    g.strokeStyle = i % 3 ? "rgba(200,220,255,0.38)" : "rgba(235,245,255,0.45)"; g.lineWidth = 2 + (i % 2); g.beginPath(); g.moveTo(x, y); g.lineTo(x - 6, y + l); g.stroke(); }
  g.restore(); };
/** big, high-contrast pop-up card: shadow + thick border + auto-fit title (1-2 lines) + optional ribbon */
export const fxPop = (p, title, sub = "", bg = "#ffd84a", fg = "#1a1220", rib = "#c0302c", rot = -0.03) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(rot);
  g.font = `900 92px ${PF}`; let lines = [title], sz = Math.min(92, Math.floor(92 * 500 / g.measureText(title).width));
  if (sz < 62 && title.includes(" ")) { const w = title.split(" "); let best = null; for (let i = 1; i < w.length; i++) { const a = w.slice(0, i).join(" "), b = w.slice(i).join(" "), m = Math.max(g.measureText(a).width, g.measureText(b).width); if (!best || m < best[2]) best = [a, b, m]; }
    lines = [best[0], best[1]]; sz = Math.min(84, Math.floor(92 * 500 / best[2])); }
  const hT = lines.length * sz * 1.08 + 56, hS = sub ? 78 : 0, top = -(hT + hS) / 2;
  p.poly(rrect(-276 + 14, top + 16, 276 + 14, top + hT + 16, 26), "#000000aa", 0);
  p.poly(rrect(-276, top, 276, top + hT, 26), bg, 12);
  lines.forEach((t, i) => ptxt(g, t, 0, top + 28 + sz * 0.54 + i * sz * 1.08, sz, fg, 0));
  if (sub) { g.font = `900 46px ${PF}`; const sw = Math.min(46, Math.floor(46 * 470 / g.measureText(sub).width));
    p.poly(rrect(-250, top + hT - 10, 250, top + hT + 64, 16), rib, 10); ptxt(g, sub, 0, top + hT + 27, sw, "#ffffff", 0); }
  g.restore(); };

// ---------- "Pacaran Sama AI": Vira hologram ----------
/** mouth 0..3, mood: 'love' | 'flat' | 'error'; t = frame for flicker */
export const fxVira = (p, mouth = 0, mood = "love", t = 0, blink = 0) => {
  const g = p.g, err = mood === "error", C = err ? "#ff4a5a" : "#5ff2ff", C2 = err ? "#ff9a4a" : "#ff7ad9";
  g.save(); g.globalAlpha = 0.28; g.fillStyle = C; g.beginPath(); g.moveTo(140, 800); g.lineTo(460, 800); g.lineTo(312, 990); g.lineTo(288, 990); g.closePath(); g.fill(); g.restore();
  p.poly(rrect(78, 168, 522, 812, 40), C2 + "88", 0);
  p.poly(rrect(92, 182, 508, 798, 34), "#141a3acc", 10);
  g.save(); g.globalAlpha = 0.12; g.fillStyle = C; for (let y = 190 + (t * 3) % 12; y < 795; y += 12) g.fillRect(100, y, 400, 4); g.restore();
  const cx = 300, cy = 470;
  // hair back + face + bangs
  p.ell(cx, cy - 10, 165, 175, "#8a5cf0", 8);
  p.ell(cx, cy + 20, 128, 135, err ? "#ffd0d0" : "#d9f8ff", 7);
  p.poly([[cx - 140, cy - 40], [cx - 120, cy - 130], [cx - 40, cy - 170], [cx + 60, cy - 165], [cx + 135, cy - 110], [cx + 145, cy - 40], [cx + 70, cy - 85], [cx + 10, cy - 60], [cx - 50, cy - 90]], "#8a5cf0", 6);
  // headset
  for (const sx of [-1, 1]) p.ell(cx + sx * 150, cy + 10, 26, 42, C, 6);
  p.stroke([[cx + 150, cy + 40], [cx + 110, cy + 120], [cx + 55, cy + 130]], 7, C);
  if (err) { for (const sx of [-1, 1]) { p.stroke([[cx + sx * 50 - 22, cy - 2], [cx + sx * 50 + 22, cy + 38]], 12, "#c0102c"); p.stroke([[cx + sx * 50 + 22, cy - 2], [cx + sx * 50 - 22, cy + 38]], 12, "#c0102c"); } }
  else for (const sx of [-1, 1]) {
    if (blink) p.stroke([[cx + sx * 50 - 26, cy + 20], [cx + sx * 50, cy + 28], [cx + sx * 50 + 26, cy + 20]], 9, "#1a1240");
    else { p.ell(cx + sx * 50, cy + 18, 30, 40, "#1a1240", 0); p.ell(cx + sx * 50, cy + 22, 20, 28, mood === "flat" ? "#3a8ad0" : "#c03aa0", 0); p.ell(cx + sx * 50 - 8, cy + 6, 9, 11, "#ffffff", 0); p.ell(cx + sx * 50 + 9, cy + 34, 5, 5, "#ffffff", 0); }
    p.ell(cx + sx * 85, cy + 70, 22, 12, "#ff9ac8", 0); }
  const my = cy + 95;
  if (err) p.stroke([[cx - 34, my + 6], [cx - 12, my - 6], [cx + 12, my + 6], [cx + 34, my - 6]], 8, "#1a1240");
  else if (mouth > 0) p.ell(cx, my, 16 + mouth * 4, 6 + mouth * 7, "#1a1240", 0);
  else if (mood === "flat") p.stroke([[cx - 26, my], [cx + 26, my]], 8, "#1a1240");
  else p.stroke([[cx - 30, my - 6], [cx, my + 10], [cx + 30, my - 6]], 8, "#1a1240");
  // name tag
  p.poly(rrect(170, 690, 430, 770, 22), err ? "#c0102c" : "#ff4fb4", 7);
  ptxt(g, err ? "OFFLINE" : "VIRA  AI", 300, 731, 44, "#ffffff", 0);
  if (!err) p.poly(heartPts(470, 230, 30), "#ff4fb4", 5);
};

/* ---- Jemuran (clothesline) + tumpukan baju for "Sep, Angkat Jemuran!" ---- */
const shade_ = (hex, k) => { const n = parseInt(hex.slice(1), 16); const c = (v) => Math.max(0, Math.min(255, Math.round(v * k))); return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`; };
const cloth_ = (g, kind, x, y, col, wet, s = 1) => {
  const c = wet ? shade_(col, 0.68) : col; g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = "#2a1e1a"; g.lineJoin = "round"; g.fillStyle = c; g.beginPath();
  if (kind === "shirt") { g.moveTo(-50, 0); g.lineTo(50, 0); g.lineTo(78, 34); g.lineTo(56, 50); g.lineTo(46, 36); g.lineTo(46, 130); g.lineTo(-46, 130); g.lineTo(-46, 36); g.lineTo(-56, 50); g.lineTo(-78, 34); g.closePath(); }
  else if (kind === "pants") { g.moveTo(-42, 0); g.lineTo(42, 0); g.lineTo(46, 150); g.lineTo(10, 150); g.lineTo(0, 40); g.lineTo(-10, 150); g.lineTo(-46, 150); g.closePath(); }
  else if (kind === "towel") { g.rect(-40, 0, 80, 120); }
  else if (kind === "dress") { g.moveTo(-34, 0); g.lineTo(34, 0); g.lineTo(62, 175); g.lineTo(-62, 175); g.closePath(); }
  else { g.rect(-52, 0, 104, 150); }
  g.fill(); g.stroke();
  if (kind === "sarung") { g.save(); g.clip(); g.strokeStyle = wet ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.35)"; g.lineWidth = 7; for (let k = -60; k < 60; k += 22) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k, 150); g.stroke(); } for (let k = 10; k < 150; k += 22) { g.beginPath(); g.moveTo(-52, k); g.lineTo(52, k); g.stroke(); } g.restore(); }
  if (kind === "towel") { g.fillStyle = wet ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.45)"; g.fillRect(-40, 92, 80, 10); }
  g.fillStyle = "#e9e2d0"; g.fillRect(-6, -10, 12, 18);                       // jepitan
  if (wet) { g.strokeStyle = "rgba(190,215,255,0.9)"; g.lineWidth = 4; for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(k * 26, kind === "dress" ? 182 : 158); g.lineTo(k * 26, (kind === "dress" ? 200 : 176)); g.stroke(); } }
  g.restore(); };
export const fxJemuran = (p, wet = 0, t = 0) => { const g = p.g; g.save();
  g.fillStyle = "#6e5a46"; g.strokeStyle = "#2a1e1a"; g.lineWidth = 6;
  for (const x of [40, 560]) { g.fillRect(x - 9, 330, 18, 670); g.strokeRect(x - 9, 330, 18, 670); }
  g.strokeStyle = "#f2efe6"; g.lineWidth = 5; g.beginPath(); g.moveTo(40, 344); g.quadraticCurveTo(300, 384, 560, 344); g.stroke();
  const sw = wet ? 0 : Math.sin(t * 0.5) * 2;
  const Y = (x) => 344 + 40 * (1 - ((x - 300) / 260) ** 2);
  for (const [k, x, col] of [["shirt", 108, "#d9483b"], ["sarung", 210, "#3c6fb8"], ["towel", 300, "#f2c14e"], ["pants", 384, "#3a3f55"], ["shirt", 480, "#f4f1ea"]]) {
    g.save(); g.translate(x, Y(x)); g.rotate((sw * Math.PI) / 180); cloth_(g, k, 0, 0, col, wet); g.restore(); }
  g.restore(); };
export const fxPile = (p) => { const g = p.g; g.save(); g.translate(300, 540); g.scale(0.9, 1.55); g.lineWidth = 5; g.strokeStyle = "#2a1e1a"; g.lineJoin = "round";
  const blob = (x, y, w, h, col, r = 0) => { g.save(); g.translate(x, y); g.rotate(r); g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, w, h, 0, 0, 7); g.fill(); g.stroke(); g.restore(); };
  g.fillStyle = "#3c6fb8"; g.beginPath(); g.moveTo(-170, 40); g.lineTo(-120, 40); g.lineTo(-135, 130); g.lineTo(-185, 120); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#f4f1ea"; g.beginPath(); g.moveTo(150, 50); g.lineTo(190, 60); g.lineTo(175, 125); g.lineTo(140, 115); g.closePath(); g.fill(); g.stroke();
  blob(-80, 40, 120, 60, "#3c6fb8", 0.1); blob(90, 50, 110, 55, "#f4f1ea", -0.1); blob(0, 70, 160, 60, "#d9483b"); blob(-30, 0, 120, 55, "#2f8a5a", -0.15);
  // daster motif macan on top
  g.save(); g.translate(30, -30); g.rotate(0.12); g.fillStyle = "#f0a23a"; g.beginPath(); g.ellipse(0, 0, 140, 62, 0, 0, 7); g.fill(); g.stroke(); g.clip();
  g.fillStyle = "#2a1e1a"; for (let i = 0; i < 26; i++) { const x = ((i * 53) % 280) - 140, y = ((i * 37) % 120) - 60; g.beginPath(); g.ellipse(x, y, 11, 7, i, 0, 7); g.fill(); g.fillStyle = "#8a4a14"; g.beginPath(); g.ellipse(x, y, 5, 3, i, 0, 7); g.fill(); g.fillStyle = "#2a1e1a"; }
  g.restore();
  g.strokeStyle = "rgba(190,215,255,0.9)"; g.lineWidth = 4; for (const x of [-150, -60, 40, 140]) { g.beginPath(); g.moveTo(x, 110); g.lineTo(x, 132); g.stroke(); }
  g.restore(); };

/* ---- Pocong (cute-comedic), api unggun, subtitle per kata: "Asep & Ucup Naik Gunung" ---- */
export const fxPocong = (p, mouth = 0, blink = 0, mood = "calm") => { const g = p.g; g.save(); g.lineJoin = "round"; g.lineCap = "round";
  const W = "#f1ece0", S = "#d8d0bc", O = "#2a2420";
  // body shroud
  g.fillStyle = W; g.strokeStyle = O; g.lineWidth = 9; g.beginPath();
  g.moveTo(300, 150); g.bezierCurveTo(410, 150, 418, 260, 410, 360); g.bezierCurveTo(404, 600, 420, 820, 392, 960); g.quadraticCurveTo(300, 1000, 208, 960);
  g.bezierCurveTo(180, 820, 196, 600, 190, 360); g.bezierCurveTo(182, 260, 190, 150, 300, 150); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = S; g.lineWidth = 6; for (const [x0, y0, x1, y1] of [[240, 420, 255, 900], [355, 430, 345, 900], [300, 500, 300, 940]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  // top knot (ikatan kepala)
  g.fillStyle = W; g.strokeStyle = O; g.lineWidth = 8;
  g.beginPath(); g.moveTo(300, 160); g.quadraticCurveTo(250, 70, 268, 40); g.quadraticCurveTo(300, 90, 300, 160); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(300, 160); g.quadraticCurveTo(350, 70, 334, 44); g.quadraticCurveTo(300, 92, 300, 160); g.fill(); g.stroke();
  // rope ties: neck, knees, feet
  g.strokeStyle = "#b8a684"; g.lineWidth = 12; for (const y of [352, 760, 935]) { g.beginPath(); g.moveTo(198, y); g.quadraticCurveTo(300, y + 14, 404, y); g.stroke(); }
  g.fillStyle = "#b8a684"; g.beginPath(); g.ellipse(300, 366, 16, 12, 0, 0, 7); g.fill();
  // face opening
  g.fillStyle = "#c6d4c0"; g.strokeStyle = O; g.lineWidth = 7; g.beginPath(); g.ellipse(300, 258, 78, 86, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = "rgba(90,110,90,0.35)"; for (const x of [268, 332]) { g.beginPath(); g.ellipse(x, 246, 26, 22, 0, 0, 7); g.fill(); }
  if (blink) { g.strokeStyle = O; g.lineWidth = 7; for (const x of [268, 332]) { g.beginPath(); g.moveTo(x - 14, 246); g.lineTo(x + 14, 246); g.stroke(); } }
  else { const big = mood === "shock" ? 1.3 : 1; for (const x of [268, 332]) { g.fillStyle = "#fff"; g.beginPath(); g.ellipse(x, 244, 15 * big, 17 * big, 0, 0, 7); g.fill(); g.strokeStyle = O; g.lineWidth = 5; g.stroke();
    g.fillStyle = O; g.beginPath(); g.ellipse(x + 3, 247, 7, 8, 0, 0, 7); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.ellipse(x + 6, 243, 2.5, 2.5, 0, 0, 7); g.fill(); } }
  g.strokeStyle = O; g.lineWidth = 6; g.beginPath(); g.moveTo(250, 214); g.lineTo(282, 220); g.moveTo(350, 214); g.lineTo(318, 220); g.stroke();
  if (mouth > 0) { g.fillStyle = "#5a2a2a"; g.beginPath(); g.ellipse(300, 298, 16 + mouth * 2, 5 + mouth * 7, 0, 0, 7); g.fill(); g.strokeStyle = O; g.lineWidth = 5; g.stroke(); }
  else { g.strokeStyle = O; g.lineWidth = 6; g.beginPath(); if (mood === "smug") { g.moveTo(276, 296); g.quadraticCurveTo(300, 312, 326, 292); } else { g.moveTo(282, 300); g.quadraticCurveTo(300, 306, 318, 300); } g.stroke(); }
  g.restore(); };
export const fxFire = (p, t = 0) => { const g = p.g; g.save(); g.translate(300, 985);
  const fl = (w, h, col, ph) => { const k = 1 + 0.12 * Math.sin(t * 0.9 + ph), sw = 10 * Math.sin(t * 0.7 + ph * 2); g.fillStyle = col; g.beginPath(); g.moveTo(-w, 0);
    g.bezierCurveTo(-w * 1.05, -h * 0.45 * k, -w * 0.2 + sw, -h * 0.7 * k, sw * 1.5, -h * k); g.bezierCurveTo(w * 0.2 + sw, -h * 0.7 * k, w * 1.05, -h * 0.45 * k, w, 0); g.closePath(); g.fill(); };
  fl(130, 330, "#e8452c", 0); fl(100, 260, "#f2862e", 1.3); fl(70, 190, "#ffc23a", 2.1); fl(38, 120, "#fff2a8", 3.0);
  for (let i = 0; i < 5; i++) { const y = -((t * 14 + i * 70) % 420) - 120, x = 40 * Math.sin(i * 2.1 + t * 0.2); g.fillStyle = `rgba(255,${180 + i * 10},80,${0.9 - (-y) / 600})`; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); }
  g.restore(); };
export const fxCaption = (p, words, idx) => { const g = p.g; g.save(); const size = 74; g.font = `900 ${size}px ${PF}`; g.textBaseline = "middle"; g.lineJoin = "round";
  const sp = 18, ws = words.map((w) => g.measureText(w).width); let total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  const k = total > 560 ? 560 / total : 1; g.translate(300, 500); g.scale(k, k); let x = -total / 2;
  words.forEach((w, i) => { const on = i === idx; g.lineWidth = 16; g.strokeStyle = "#120c10"; g.strokeText(w, x, on ? -6 : 0);
    g.fillStyle = on ? "#ffd84a" : "#ffffff"; g.fillText(w, x, on ? -6 : 0); x += ws[i] + sp; });
  g.restore(); };
/** motion-graphic caption: rounded dark pill, pop-in, active word yellow + bump */
export const fxCaption2 = (p, words, idx, k = 1, bump = 0) => { const g = p.g; g.save(); const size = 70; g.font = `900 ${size}px ${PF}`; g.textBaseline = "middle"; g.lineJoin = "round";
  const sp = 22, ws = words.map((w) => g.measureText(w).width), total = ws.reduce((a, b) => a + b, 0) + sp * (words.length - 1);
  const fit = total > 500 ? 500 / total : 1; g.translate(300, 500); g.scale(k * fit, k * fit);
  const bw = total + 64, bh = 118, r = 30; g.fillStyle = "rgba(14,10,22,0.78)"; g.beginPath(); g.roundRect(-bw / 2, -bh / 2, bw, bh, r); g.fill();
  g.strokeStyle = "rgba(255,216,74,0.9)"; g.lineWidth = 5; g.stroke();
  let x = -total / 2;
  words.forEach((w, i) => { const on = i === idx, s = on ? 1 + 0.14 * bump : 1; g.save(); g.translate(x + ws[i] / 2, 2); g.scale(s, s); g.textAlign = "center";
    g.lineWidth = 9; g.strokeStyle = "#0c0810"; g.strokeText(w, 0, 0); g.fillStyle = on ? "#ffd84a" : "#ffffff"; g.fillText(w, 0, 0); g.restore(); x += ws[i] + sp; });
  g.restore(); };

/* ===== Telop kit (game-show style from the Lemo-Opuscar library): flat fills, one ink outline,
   hard offset shadows, Fredoka 700, ink stroke ~14% of size under the fill, back-ease pops ===== */
const GINK = "#14101a", GF = '"Fredoka", "DejaVu Sans", sans-serif';
const gText = (g, t, x, y, size, fill, sh = 0.07) => { g.font = `700 ${size}px ${GF}`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  const d = size * sh; g.lineWidth = size * 0.28; g.strokeStyle = GINK; g.strokeText(t, x + d, y + d * 1.2); g.fillStyle = GINK; g.fillText(t, x + d, y + d * 1.2);
  g.strokeText(t, x, y); g.fillStyle = fill; g.fillText(t, x, y); };
const gPlate = (g, x, y, w, h, r, fill, sh = 12, bw = 7) => { g.fillStyle = GINK; g.beginPath(); g.roundRect(x + sh, y + sh, w, h, r); g.fill();
  g.fillStyle = fill; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); g.lineWidth = bw; g.strokeStyle = GINK; g.stroke(); };
/** dialogue telop: speaker-coloured plate, whole line in up to 2 rows, active word yellow; name sticker on the corner */
export const fxTelop = (p, rows, active, hue, name, k = 1) => { const g = p.g; g.save(); g.translate(300, 500); g.scale(k, k); g.rotate(-0.012);
  const size = 54, sp = 30; g.font = `700 ${size}px ${GF}`;
  const rw = rows.map((r) => r.reduce((a, w) => a + g.measureText(w).width, 0) + sp * (r.length - 1)), W = Math.max(...rw) + 70, H = rows.length * 68 + 40;
  const fit = W > 560 ? 560 / W : 1; g.scale(fit, fit);
  gPlate(g, -W / 2, -H / 2, W, H, 26, hue);
  let n = 0; rows.forEach((r, ri) => { let x = -rw[ri] / 2, y = -H / 2 + 20 + 34 + ri * 68;
    r.forEach((w) => { const ww = g.measureText(w).width, on = n === active; g.save(); g.translate(x + ww / 2, y); if (on) g.scale(1.06, 1.06); gText(g, w, 0, 0, size, on ? "#ffe14a" : "#ffffff", 0.05); g.restore(); x += ww + sp; n++; }); });
  if (name) { g.save(); g.translate(-W / 2 + 18, -H / 2 - 6); g.rotate(-0.07); g.font = `700 30px ${GF}`; const nw = g.measureText(name).width + 34;
    gPlate(g, 0, -26, nw, 46, 14, "#fff4d6", 6, 5); g.fillStyle = GINK; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText(name, 17, -3); g.restore(); }
  g.restore(); };
/** burst: star + ring + speed lines (behind judgement words / cards) */
const gBurst = (g, r, t, col) => { g.save(); g.rotate(t * 0.04); g.lineCap = "round";
  g.strokeStyle = GINK; g.lineWidth = 10; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; g.beginPath(); g.moveTo(Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.05); g.lineTo(Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45); g.stroke(); }
  const star = (rr, fill) => { g.beginPath(); for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, q_ = i % 2 ? rr * 0.72 : rr; g.lineTo(Math.cos(a) * q_, Math.sin(a) * q_); } g.closePath(); g.fillStyle = fill; g.fill(); };
  g.save(); g.translate(10, 12); star(r, GINK); g.restore(); star(r, col); g.lineWidth = 7; g.strokeStyle = GINK; g.stroke();
  g.beginPath(); g.arc(0, 0, r * 0.6, 0, 7); g.lineWidth = 6; g.strokeStyle = "rgba(255,255,255,0.85)"; g.stroke(); g.restore(); };
/** judgement word: big outlined word at an angle over a burst */
export const fxJudge = (p, text, fill = "#ff5d8f", burst = "#ffe14a", t = 0) => { const g = p.g; g.save(); g.translate(300, 500);
  gBurst(g, 210, t, burst); g.rotate(-0.12); g.font = `700 150px ${GF}`; const w = g.measureText(text).width, fit = w > 540 ? 540 / w : 1; g.scale(fit, fit);
  gText(g, text, 0, 0, 150, fill, 0.06); g.restore(); };
/** corner sticker banner */
export const fxBanner = (p, text, hue = "#ffb03a", fg = "#ffffff", dot = false, t = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.05);
  g.font = `700 64px ${GF}`; const tw = g.measureText(text).width, W = tw + 80 + (dot ? 60 : 0), H = 112, fit = W > 580 ? 580 / W : 1; g.scale(fit, fit);
  gPlate(g, -W / 2, -H / 2, W, H, 30, hue, 10, 7);
  let x = 0; if (dot) { const s = 0.8 + 0.2 * Math.sin(t * 0.5); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(-W / 2 + 56, 0, 20 * s, 0, 7); g.fill(); g.lineWidth = 5; g.strokeStyle = GINK; g.stroke(); x = 30; }
  gText(g, text, x, 4, 64, fg, 0.05); g.restore(); };
/** round card: title pops glyph by glyph, optional sub line, on a burst */
export const fxRoundCard = (p, title, sub, hue = "#ffd23a", t = 99) => { const g = p.g; g.save(); g.translate(300, 500);
  gBurst(g, 250, t, "#ffffff"); g.rotate(-0.04);
  const words = title.split(" "); const rows = []; let cur = ""; words.forEach((w) => { if ((cur + " " + w).trim().length > 11 && cur) { rows.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }); rows.push(cur);
  const size = 78; g.font = `700 ${size}px ${GF}`; const mw = Math.max(...rows.map((r) => g.measureText(r).width)); g.font = `700 36px ${GF}`; const sw0 = sub ? g.measureText(sub).width + 70 : 0;
  const W = Math.max(mw + 80, sw0 + 40), H = rows.length * 88 + (sub ? 70 : 0) + 50, fit = W > 570 ? 570 / W : 1; g.scale(fit, fit); gPlate(g, -W / 2, -H / 2, W, H, 34, hue, 14, 8);
  let ci = 0; rows.forEach((r, ri) => { g.font = `700 ${size}px ${GF}`; const rw = g.measureText(r).width; let x = -rw / 2; const y = -H / 2 + 25 + 44 + ri * 88;
    for (const ch of r) { const cw = g.measureText(ch).width, k = Math.max(0, Math.min(1, (t - ci * 0.8) / 4)), s = k < 1 ? k * 1.25 : 1; if (s > 0.01) { g.save(); g.translate(x + cw / 2, y); g.scale(s, s); gText(g, ch, 0, 0, size, "#ffffff", 0.05); g.restore(); } x += cw; ci++; } });
  if (sub) { g.font = `700 36px ${GF}`; const sw = g.measureText(sub).width + 40, y = H / 2 - 50; gPlate(g, -sw / 2, y - 22, sw, 50, 16, "#14101a", 0, 0); g.fillStyle = "#ffe14a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(sub, 0, y + 3); }
  g.restore(); };

/* ---- TV bola + Zzz: "Adik Nggak Mau Tidur" ---- */
export const fxTV = (p, t = 0, goal = 0, score = "0 - 0") => { const g = p.g; g.save(); g.lineJoin = "round";
  g.fillStyle = "#2a2a30"; g.fillRect(250, 900, 100, 70); g.fillRect(170, 960, 260, 30);                       // stand
  g.fillStyle = "#1a1a20"; g.beginPath(); g.roundRect(20, 520, 560, 390, 26); g.fill(); g.lineWidth = 8; g.strokeStyle = "#0c0c10"; g.stroke();
  g.save(); g.beginPath(); g.roundRect(44, 544, 512, 342, 10); g.clip();
  for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#3f9a4a" : "#46a852"; g.fillRect(44 + i * 64, 544, 64, 342); }
  g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 4; g.strokeRect(70, 580, 460, 280); g.beginPath(); g.moveTo(300, 580); g.lineTo(300, 860); g.stroke(); g.beginPath(); g.arc(300, 720, 46, 0, 7); g.stroke();
  g.strokeRect(470, 660, 60, 120);
  const pl = (x, y, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill(); g.lineWidth = 3; g.strokeStyle = "#111"; g.stroke(); };
  for (let i = 0; i < 5; i++) { pl(170 + i * 60 + 30 * Math.sin(t * 0.08 + i), 620 + i * 48 + 18 * Math.cos(t * 0.07 + i * 2), "#2f6ae8"); pl(230 + i * 55 + 26 * Math.cos(t * 0.09 + i), 640 + i * 45 + 16 * Math.sin(t * 0.06 + i), "#e83a3a"); }
  const bx = goal ? 505 : 300 + 150 * Math.sin(t * 0.05), by = goal ? 720 : 720 + 80 * Math.sin(t * 0.11); g.fillStyle = "#fff"; g.beginPath(); g.arc(bx, by, 8, 0, 7); g.fill(); g.strokeStyle = "#111"; g.lineWidth = 2; g.stroke();
  g.fillStyle = "rgba(10,10,20,0.85)"; g.fillRect(56, 556, 250, 46); g.fillStyle = "#fff"; g.font = '700 30px "Fredoka", sans-serif'; g.textBaseline = "middle"; g.textAlign = "left";
  g.fillText("BIRU " + score + " MERAH", 68, 580);
  if (goal && (t % 10) < 7) { g.font = '700 120px "Fredoka", sans-serif'; g.textAlign = "center"; g.lineWidth = 16; g.strokeStyle = "#14101a"; g.strokeText("GOL!", 300, 740); g.fillStyle = "#ffe14a"; g.fillText("GOL!", 300, 740); }
  g.restore(); g.fillStyle = "rgba(255,255,255,0.08)"; g.beginPath(); g.moveTo(44, 544); g.lineTo(300, 544); g.lineTo(140, 886); g.lineTo(44, 886); g.fill();
  g.restore(); };
export const fxZzz = (p, t = 0) => { const g = p.g; g.save(); g.font = '700 90px "Fredoka", sans-serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
  for (let i = 0; i < 3; i++) { const k = ((t * 0.02 + i / 3) % 1), x = 260 + i * 70 + 20 * Math.sin(t * 0.1 + i), y = 700 - k * 400, s = 0.5 + 0.7 * k;
    g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = Math.min(1, (1 - k) * 2); g.lineWidth = 14; g.strokeStyle = "#14101a"; g.strokeText("Z", 0, 0); g.fillStyle = "#bfe3ff"; g.fillText("Z", 0, 0); g.restore(); }
  g.restore(); };

/* ---- Pasar props: papan harga berkain, cabai berpita ---- */
export const fxPriceBoard = (p, reveal = 0) => { const g = p.g; g.save(); g.lineJoin = "round";
  g.fillStyle = "#6a4428"; g.fillRect(270, 760, 60, 240);
  g.fillStyle = "#2a3a30"; g.strokeStyle = "#8a5a32"; g.lineWidth = 22; g.beginPath(); g.roundRect(70, 430, 460, 340, 16); g.fill(); g.stroke();
  g.fillStyle = "#f4f1e0"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = '700 54px "Fredoka", sans-serif'; g.fillText("CABAI MERAH", 300, 520);
  g.font = '700 92px "Fredoka", sans-serif'; g.fillStyle = "#ffe14a"; g.fillText("80.000", 300, 630); g.font = '700 40px "Fredoka", sans-serif'; g.fillStyle = "#f4f1e0"; g.fillText("/ KG", 300, 712);
  if (reveal < 1) { const k = reveal, y = 400 - k * 520, rot = -k * 0.5; g.save(); g.translate(300 + k * 260, y + 200); g.rotate(rot);
    g.fillStyle = "#b8282b"; g.beginPath(); g.moveTo(-250, -200); g.lineTo(250, -200); g.quadraticCurveTo(270, 40, 240, 210); g.lineTo(-240, 210); g.quadraticCurveTo(-270, 40, -250, -200); g.fill();
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 6; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 70, -195); g.quadraticCurveTo(i * 70 + 12, 0, i * 70, 205); g.stroke(); } g.restore(); }
  g.restore(); };
export const fxCabaiPita = (p) => { const g = p.g; g.save(); g.translate(300, 560); g.lineJoin = "round"; g.lineCap = "round";
  g.fillStyle = "rgba(220,235,255,0.45)"; g.strokeStyle = "#14101a"; g.lineWidth = 6; g.beginPath(); g.moveTo(-90, -40); g.quadraticCurveTo(-110, 120, -60, 160); g.lineTo(60, 160); g.quadraticCurveTo(110, 120, 90, -40); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#d42a1e"; g.beginPath(); g.moveTo(-40, 40); g.quadraticCurveTo(10, 30, 60, 120); g.quadraticCurveTo(0, 90, -45, 70); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = "#3f8a2a"; g.lineWidth = 10; g.beginPath(); g.moveTo(-42, 55); g.lineTo(-62, 40); g.stroke();
  g.fillStyle = "#ff5d8f"; g.strokeStyle = "#14101a"; g.lineWidth = 5; g.fillRect(-70, -52, 140, 20); g.strokeRect(-70, -52, 140, 20);
  for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(0, -42); g.quadraticCurveTo(sd * 60, -110, sd * 70, -50); g.quadraticCurveTo(sd * 40, -40, 0, -42); g.fill(); g.stroke(); }
  g.beginPath(); g.arc(0, -42, 14, 0, 7); g.fill(); g.stroke(); g.restore(); };

/** woven shopping basket (keranjang belanja) */
export const fxKeranjang = (p) => { const g = p.g; g.save(); g.translate(300, 600); g.lineJoin = "round";
  g.strokeStyle = "#14101a"; g.lineWidth = 9; g.beginPath(); g.moveTo(-110, -40); g.quadraticCurveTo(0, -230, 110, -40); g.stroke(); g.strokeStyle = "#b8864a"; g.lineWidth = 5; g.stroke();
  g.fillStyle = "#c8945a"; g.beginPath(); g.moveTo(-150, -40); g.lineTo(150, -40); g.lineTo(115, 150); g.lineTo(-115, 150); g.closePath(); g.fill();
  g.save(); g.clip(); g.strokeStyle = "rgba(90,50,20,0.55)"; g.lineWidth = 6; for (let y = -30; y < 160; y += 22) { g.beginPath(); g.moveTo(-160, y); g.lineTo(160, y); g.stroke(); }
  for (let x = -150; x < 160; x += 26) { g.beginPath(); g.moveTo(x, -40); g.lineTo(x * 0.78, 150); g.stroke(); } g.restore();
  g.strokeStyle = "#14101a"; g.lineWidth = 9; g.beginPath(); g.moveTo(-150, -40); g.lineTo(150, -40); g.lineTo(115, 150); g.lineTo(-115, 150); g.closePath(); g.stroke();
  g.fillStyle = "#3f9a4a"; for (const [x, y, r] of [[-60, -55, 30], [-10, -70, 26], [50, -55, 30]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.lineWidth = 6; g.stroke(); }
  g.restore(); };

/* ---- Dapur props: telur, tepung, kenop oven, asap, loyang brownies, tetesan ---- */
export const fxEgg = (p, k = 1) => { const g = p.g; g.save(); g.translate(300, 820); g.lineJoin = "round";
  g.fillStyle = "#fbfaf4"; g.strokeStyle = "#14101a"; g.lineWidth = 7; g.beginPath(); for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2, r = (i % 2 ? 110 : 150) * k; g.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.45); } g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#ffc23a"; g.beginPath(); g.ellipse(10, -6, 50 * k, 32 * k, 0, 0, 7); g.fill(); g.stroke();
  g.fillStyle = "#f4ecd8"; for (const [x, y, r] of [[-170, -40, 30], [180, -20, 26]]) { g.beginPath(); g.moveTo(x - r, y); g.lineTo(x, y - r * 1.4); g.lineTo(x + r, y); g.closePath(); g.fill(); g.stroke(); }
  g.restore(); };
export const fxFlour = (p, t = 0) => { const g = p.g; g.save(); const k = Math.min(1, t / 8), a = Math.max(0, 1 - Math.max(0, t - 14) / 14);
  g.globalAlpha = a; for (let i = 0; i < 16; i++) { const ang = i * 2.4, r = (60 + (i * 37) % 160) * k; g.fillStyle = i % 3 ? "#ffffff" : "#efe8dc"; g.beginPath(); g.arc(300 + Math.cos(ang) * r, 420 + Math.sin(ang) * r * 0.8, (70 + (i * 13) % 60) * (0.5 + k * 0.6), 0, 7); g.fill(); }
  g.restore(); };
export const fxKnob = (p, ang = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.lineJoin = "round";
  g.fillStyle = "#b8bcc4"; g.strokeStyle = "#14101a"; g.lineWidth = 10; g.beginPath(); g.roundRect(-250, -250, 500, 500, 40); g.fill(); g.stroke();
  g.font = '700 54px "Fredoka", sans-serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#14101a";
  for (const [t, a] of [["0", -2.4], ["100", -1.2], ["200", 0], ["MAX", 1.2]]) g.fillText(t, Math.cos(a - Math.PI / 2) * 190, Math.sin(a - Math.PI / 2) * 190);
  g.fillStyle = "#c8382c"; g.fillText("MAX", Math.cos(1.2 - Math.PI / 2) * 190, Math.sin(1.2 - Math.PI / 2) * 190);
  g.rotate(ang); g.fillStyle = "#2a2a30"; g.beginPath(); g.arc(0, 0, 120, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#f4f1ea"; g.fillRect(-14, -115, 28, 80); g.restore(); };
export const fxSmoke = (p, t = 0) => { const g = p.g; g.save();
  for (let i = 0; i < 12; i++) { const k = ((t * 0.025 + i / 12) % 1), x = 300 + Math.sin(i * 1.7 + t * 0.05) * 90 * k, y = 900 - k * 850, r = 50 + k * 160;
    g.globalAlpha = Math.min(0.85, (1 - k) * 1.2); g.fillStyle = i % 2 ? "#2a2826" : "#3e3a36"; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.restore(); };
export const fxTray = (p, bite = 0, hold = 1) => { const g = p.g; g.save(); g.translate(300, 520); g.lineJoin = "round";
  if (hold) { g.fillStyle = "#b8bcc4"; g.strokeStyle = "#14101a"; g.lineWidth = 8; g.beginPath(); g.roundRect(-230, -40, 460, 120, 16); g.fill(); g.stroke(); }
  g.fillStyle = "#1e1a18"; g.strokeStyle = "#14101a"; g.lineWidth = 8; g.beginPath(); g.roundRect(-200, -70, 400, 110, 10); g.fill(); g.stroke();
  if (bite) { g.fillStyle = hold ? "#b8bcc4" : "rgba(0,0,0,0)"; g.save(); g.globalCompositeOperation = "destination-out"; for (const dx of [-30, 0, 30]) { g.beginPath(); g.arc(170 + dx * 0.2, -70 + Math.abs(dx) * 0.3, 34, 0, 7); g.fill(); } g.restore(); }
  g.strokeStyle = "#5a4a3a"; g.lineWidth = 4; for (const [x0, y0, x1, y1] of [[-150, -50, -90, 10], [-40, -60, 10, 0], [60, -30, 130, 20], [-120, 0, -60, 30]]) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  g.restore(); };
export const fxLeak = (p, t = 0) => { const g = p.g; g.save(); g.fillStyle = "#9fd4ee"; g.strokeStyle = "#14101a"; g.lineWidth = 5;
  for (let i = 0; i < 2; i++) { const k = ((t * 0.04 + i * 0.5) % 1), y = 80 + k * 860; g.beginPath(); g.moveTo(300, y - 34); g.quadraticCurveTo(318, y, 300, y + 14); g.quadraticCurveTo(282, y, 300, y - 34); g.fill(); g.stroke(); }
  g.restore(); };

/* ---- Live jualan: tripod + ring light, layar live HP ---- */
export const fxTripod = (p, t = 0) => { const g = p.g; g.save(); g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = "#2a2a30"; g.lineWidth = 12; for (const dx of [-150, 0, 150]) { g.beginPath(); g.moveTo(300, 700); g.lineTo(300 + dx, 995); g.stroke(); }
  g.lineWidth = 16; g.beginPath(); g.moveTo(300, 700); g.lineTo(300, 330); g.stroke();
  const gl = 0.85 + 0.15 * Math.sin(t * 0.3); g.strokeStyle = `rgba(255,248,220,${gl})`; g.lineWidth = 34; g.beginPath(); g.arc(300, 230, 150, 0, 7); g.stroke();
  g.strokeStyle = "#14101a"; g.lineWidth = 6; g.beginPath(); g.arc(300, 230, 170, 0, 7); g.stroke(); g.beginPath(); g.arc(300, 230, 130, 0, 7); g.stroke();
  g.fillStyle = "#1a1a20"; g.beginPath(); g.roundRect(240, 130, 120, 210, 18); g.fill(); g.lineWidth = 6; g.stroke();
  g.fillStyle = "#3a4a6a"; g.beginPath(); g.arc(300, 160, 12, 0, 7); g.fill(); g.restore(); };
export const fxPhoneLive = (p, mode = "live", t = 0, n = 0, hi = 0) => { const g = p.g; g.save(); g.lineJoin = "round";
  g.fillStyle = "#14101a"; g.beginPath(); g.roundRect(40, 20, 520, 960, 56); g.fill();
  g.save(); g.beginPath(); g.roundRect(62, 44, 476, 912, 40); g.clip();
  if (mode === "ceiling") { g.fillStyle = "#e8dcc4"; g.fillRect(62, 44, 476, 912); g.strokeStyle = "rgba(120,100,70,0.25)"; g.lineWidth = 3; for (let y = 120; y < 950; y += 90) { g.beginPath(); g.moveTo(62, y); g.lineTo(538, y); g.stroke(); }
    g.fillStyle = "rgba(255,240,180,0.9)"; g.beginPath(); g.arc(300, 420, 70, 0, 7); g.fill(); g.fillStyle = "rgba(255,240,180,0.25)"; g.beginPath(); g.arc(300, 420, 160, 0, 7); g.fill();
    g.fillStyle = "#6a7a5a"; g.save(); g.translate(400, 600 + Math.sin(t * 0.2) * 10); g.rotate(0.5); g.beginPath(); g.ellipse(0, 0, 26, 9, 0, 0, 7); g.fill(); g.fillRect(-46, -3, 24, 6); g.restore(); }
  else { const gr = g.createLinearGradient(0, 44, 0, 956); gr.addColorStop(0, "#3a2a40"); gr.addColorStop(1, "#1a1424"); g.fillStyle = gr; g.fillRect(62, 44, 476, 912);
    g.fillStyle = "#3f9a4a"; for (const [x, y, r] of [[230, 420, 70], [310, 380, 80], [380, 430, 66], [270, 480, 60], [350, 490, 62]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.fillStyle = "#e8742c"; g.fillRect(250, 520, 26, 120); g.fillRect(320, 530, 26, 110);
    g.font = '700 46px "Fredoka", sans-serif'; g.textAlign = "center"; g.fillStyle = "#ffe14a"; g.fillText("SAYUR SEGAR!", 300, 700); }
  // top bar: LIVE + viewers
  g.fillStyle = "#e8344a"; g.beginPath(); g.roundRect(84, 70, 140, 56, 14); g.fill(); g.fillStyle = "#fff"; g.font = '700 36px "Fredoka", sans-serif'; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("LIVE", 120, 99);
  g.fillStyle = "#fff"; g.beginPath(); g.arc(106, 99, 7, 0, 7); g.fill();
  g.fillStyle = "rgba(0,0,0,0.45)"; g.beginPath(); g.roundRect(236, 70, 150, 56, 14); g.fill(); g.fillStyle = "#fff"; g.fillText("1 nonton", 252, 99);
  // comments
  const C = mode === "ceiling" ? [["cicak_rumah", "ckck ckck"]] : [["pocong_lowbat", "halo bu"], ["pocong_lowbat", "BORONG SEMUA, BU"]].slice(0, n);
  C.forEach(([u, m], i) => { const y = 780 + i * 82, on = hi && i === C.length - 1; g.fillStyle = on ? "rgba(255,225,74,0.95)" : "rgba(0,0,0,0.5)"; g.beginPath(); g.roundRect(84, y - 34, 430, 68, 22); g.fill();
    g.font = '700 28px "Fredoka", sans-serif'; g.fillStyle = on ? "#14101a" : "#bfe3ff"; g.fillText(u, 104, y - 10); g.font = '700 32px "Fredoka", sans-serif'; g.fillStyle = on ? "#14101a" : "#fff"; g.fillText(m, 104, y + 18); });
  g.restore(); g.strokeStyle = "#2a2a34"; g.lineWidth = 10; g.beginPath(); g.roundRect(40, 20, 520, 960, 56); g.stroke();
  g.restore(); };

/** scooter, side view (facing right). wheels sit on y~960 */
export const fxSkuter = (p, col = "#2f7ac8") => {
  for (const x of [150, 450]) { p.ell(x, 900, 62, 62, "#22201e", 10); p.ell(x, 900, 26, 26, "#c9cfd6", 6); }
  p.poly([[120, 860], [130, 760], [250, 730], [380, 760], [470, 700], [500, 760], [520, 860], [400, 870], [360, 820], [220, 820], [200, 870]], col, 9);
  p.poly([[150, 735], [330, 735], [340, 700], [160, 690]], "#2a2a32", 8);        // seat
  p.stroke([[470, 700], [430, 560]], 16, "#3a3a44"); p.stroke([[390, 560], [470, 560]], 14, "#2a2a32"); // stem + handlebar
  p.ell(500, 640, 26, 20, "#ffe08a", 6); p.poly([[60, 790], [130, 790], [130, 820], [60, 830]], "#d8322f", 6); // lamp + tail
  p.stroke([[240, 780], [360, 790]], 6, "#ffffff88");
};
/** tiang listrik + kabel */
export const fxTiang = (p) => {
  p.poly([[275, 990], [285, 20], [315, 20], [325, 990]], "#9aa2aa", 9);
  p.poly([[170, 120], [430, 120], [430, 150], [170, 150]], "#7a828a", 8);
  for (const x of [190, 300, 410]) p.ell(x, 112, 12, 16, "#f4f1ea", 5);
  p.stroke([[0, 160], [190, 118]], 4, "#2a2a32"); p.stroke([[410, 118], [600, 170]], 4, "#2a2a32");
  p.poly([[262, 560], [338, 560], [338, 640], [262, 640]], "#e8e2d0", 6); p.stroke([[270, 590], [330, 590]], 6, "#c0302c");
};
/** gerobak gorengan */
export const fxGerobak = (p, label = "GORENGAN") => {
  for (const x of [140, 460]) p.ell(x, 930, 48, 48, "#3a2a20", 9);
  p.poly([[60, 560], [540, 560], [540, 900], [60, 900]], "#c86a2a", 10);
  p.poly([[80, 380], [520, 380], [520, 560], [80, 560]], "#d8eef4", 8);
  const gx = [[130, 520], [200, 525], [270, 518], [340, 524], [410, 520], [470, 526], [170, 480], [250, 485], [330, 480], [410, 486]];
  for (const [x, y] of gx) p.ell(x, y, 36, 22, x % 3 ? "#e0a040" : "#c8862a", 4);
  p.poly([[40, 340], [560, 340], [560, 380], [40, 380]], "#3a8f6a", 8);
  ptxt(p.g, label, 300, 740, 64, "#ffe14a", 10);
};

/** lampu jalan */
export const fxLampuJalan = (p) => {
  p.poly([[285, 990], [292, 120], [308, 120], [315, 990]], "#5a626a", 8);
  p.stroke([[300, 130], [420, 100]], 14, "#5a626a"); p.poly([[380, 90], [470, 90], [455, 125], [395, 125]], "#3a3f48", 6);
  p.ell(425, 128, 30, 10, "#fff2b0", 0);
};
// ---- YouTube end card (restored from git history; en=true -> English labels) ----
const iconBell = (g, x, y, s, ring) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#ffe14a"; g.strokeStyle = GINK; g.lineWidth = 6; g.lineJoin = "round";
  g.beginPath(); g.moveTo(-26, 18); g.quadraticCurveTo(-24, -26, 0, -30); g.quadraticCurveTo(24, -26, 26, 18); g.lineTo(32, 26); g.lineTo(-32, 26); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.arc(0, 32, 8, 0, 7); g.fill(); g.stroke();
  if (ring) { g.lineWidth = 6; g.strokeStyle = "#ffffff"; for (const sd of [-1, 1]) { g.beginPath(); g.arc(0, -4, 44, sd > 0 ? -0.5 : Math.PI - 0.1, sd > 0 ? 0.1 : Math.PI + 0.5); g.stroke(); } }
  g.restore(); };
const iconThumb = (g, x, y, s, fill) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = fill; g.strokeStyle = GINK; g.lineWidth = 6; g.lineJoin = "round";
  g.beginPath(); g.roundRect(-34, -6, 16, 40, 4); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-14, -4); g.lineTo(0, -30); g.quadraticCurveTo(12, -34, 10, -16); g.lineTo(6, -6); g.lineTo(28, -6); g.quadraticCurveTo(38, -4, 34, 8); g.lineTo(28, 30); g.quadraticCurveTo(26, 36, 16, 36); g.lineTo(-14, 36); g.closePath(); g.fill(); g.stroke();
  g.restore(); };
const iconChat = (g, x, y, s, fill, dots) => { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = fill; g.strokeStyle = GINK; g.lineWidth = 6; g.lineJoin = "round";
  g.beginPath(); g.roundRect(-34, -28, 68, 48, 14); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-14, 18); g.lineTo(-22, 34); g.lineTo(2, 20); g.fill(); g.stroke();
  if (dots) { g.fillStyle = GINK; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-16 + i * 16, -4 - (dots === i + 1 ? 6 : 0), 6, 0, 7); g.fill(); } }
  g.restore(); };
export const fxYtBtn = (p, kind, on = 0, t = 0, en = false) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.02);
  const W = 520, H = 130, x = -W / 2, y = -H / 2;
  if (kind === "sub") { gPlate(g, x, y, W, H, 65, on ? "#3a3a44" : "#e8282e", 12, 8); iconBell(g, x + 78, 2, 1.0, on && t % 8 < 5);
    gText(g, on ? (en ? "SUBSCRIBED" : "DISUBSCRIBE") : "SUBSCRIBE", 52, 4, on ? 48 : 56, "#ffffff", 0.05); }
  else if (kind === "like") { gPlate(g, x, y, W, H, 65, on ? "#2f6ae8" : "#ffffff", 12, 8); iconThumb(g, x + 80, 0, 1.0, on ? "#ffe14a" : "#ffffff");
    gText(g, on ? "LIKE +1" : "LIKE", 40, 4, 62, on ? "#ffffff" : "#ffffff", 0.05); }
  else { gPlate(g, x, y, W, H, 65, on ? "#2f9a5a" : "#ffffff", 12, 8); iconChat(g, x + 80, 0, 1.0, "#ffffff", on ? 1 + (Math.floor(t / 4) % 3) : 0);
    gText(g, en ? "COMMENT" : "KOMEN", 40, 4, 62, "#ffffff", 0.05); }
  g.restore(); };
export const fxHand = (p, press = 0) => { const g = p.g; g.save(); g.translate(300, 500); const s = 1 - 0.15 * press; g.scale(s, s); g.lineJoin = "round";
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 120); g.lineTo(30, 92); g.lineTo(52, 140); g.lineTo(72, 130); g.lineTo(50, 84); g.lineTo(90, 84); g.closePath();
  g.fillStyle = "#ffffff"; g.fill(); g.lineWidth = 9; g.strokeStyle = GINK; g.stroke();
  if (press) { g.strokeStyle = "#ffe14a"; g.lineWidth = 7; for (let i = 0; i < 6; i++) { const a = -2.4 + i * 0.5; g.beginPath(); g.moveTo(Math.cos(a) * 30, Math.sin(a) * 30); g.lineTo(Math.cos(a) * 58, Math.sin(a) * 58); g.stroke(); } }
  g.restore(); };
/** channel banner: big name plate + "YouTube: @handle" pill (no platform logo) */
export const fxChannel = (p, name, handle, t = 0) => { const g = p.g; g.save(); g.translate(300, 500); g.rotate(-0.025);
  g.font = `700 92px ${GF}`; const tw = g.measureText(name).width, W = Math.min(580, tw + 90), H = 210, fit = tw + 90 > 580 ? 580 / (tw + 90) : 1;
  gPlate(g, -W / 2, -H / 2, W, H, 40, "#e8282e", 14, 8);
  g.save(); g.beginPath(); g.roundRect(-W / 2, -H / 2, W, H, 40); g.clip(); g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 22;
  for (let x = -W; x < W; x += 60) { g.beginPath(); g.moveTo(x + (t * 1.5) % 60, -H / 2); g.lineTo(x + (t * 1.5) % 60 + 120, H / 2); g.stroke(); } g.restore();
  g.save(); g.scale(fit, fit); gText(g, name, 0, -26, 92, "#ffffff", 0.05); g.restore();
  g.font = `700 40px ${GF}`; const hw = g.measureText(handle).width + 60; gPlate(g, -hw / 2, 30, hw, 62, 31, "#14101a", 0, 0);
  g.fillStyle = "#ffe14a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(handle, 0, 63);
  g.restore(); };
