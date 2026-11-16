/* 時間ごとの光（日の向き・日の色・空の明るさ・照り返し・霧・ランプ・窓） */
const KEYS=[
 {h:4.5, sun:[.3,.4,.86],  sunCol:[.2,.24,.42], sky:[.2,.24,.4],  bounce:[.04,.04,.07],shA:.4, ray:0,  rayCol:[.6,.7,1],  fog:.22,fogCol:[.3,.36,.55], lamp:1,  win:.8, night:1, bloom:1,  sat:.9, con:1.04,lift:[.03,.04,.08],gain:[.98,1,1.06], vig:.42,sunAmt:0},
 {h:6,   sun:[.9,.18,.4],  sunCol:[.86,.62,.5], sky:[.32,.34,.48],bounce:[.12,.1,.1], shA:.7, ray:.9, rayCol:[1,.85,.7], fog:.45,fogCol:[.84,.88,.96],lamp:.3, win:.35,night:.15,bloom:.6, sat:.98,con:1.03,lift:[.04,.04,.07],gain:[1.02,1,1.02],vig:.32,sunAmt:.45},
 {h:9,   sun:[.62,.32,.72],sunCol:[.8,.76,.66], sky:[.32,.35,.44],bounce:[.17,.15,.12],shA:.8, ray:.5, rayCol:[1,.95,.82],fog:.12,fogCol:[.9,.93,.97], lamp:0,  win:0,  night:0, bloom:.28,sat:1.02,con:1.05,lift:[.02,.03,.04],gain:[1.02,1.01,.99],vig:.24,sunAmt:.85},
 {h:12,  sun:[-.3,.45,.84],sunCol:[.7,.68,.6], sky:[.3,.32,.38],bounce:[.24,.22,.17],shA:.8, ray:.22,rayCol:[1,.97,.86],fog:0,  fogCol:[.9,.93,.97], lamp:0,  win:0,  night:0, bloom:.24,sat:1,  con:1.05,lift:[.01,.01,.02],gain:[1.02,1,.98],  vig:.22,sunAmt:1},
 {h:17,  sun:[-.88,.22,.42],sunCol:[.98,.66,.43],sky:[.27,.24,.33], bounce:[.2,.12,.09],shA:.85,ray:1,  rayCol:[1,.66,.38],fog:.1, fogCol:[1,.74,.6],   lamp:.15,win:.35,night:0, bloom:.55,sat:1,  con:1.07,lift:[.04,.02,.06],gain:[1.02,.99,.95],vig:.34,sunAmt:.7},
 {h:19,  sun:[-.95,.18,.22],sunCol:[.6,.28,.2], sky:[.24,.22,.34],bounce:[.07,.05,.06],shA:.6, ray:.4, rayCol:[1,.45,.35],fog:.14,fogCol:[.6,.45,.6],   lamp:1,  win:.9, night:.5,bloom:1,  sat:1,  con:1.05,lift:[.04,.03,.08],gain:[1,.97,1],    vig:.4, sunAmt:.15},
 {h:21,  sun:[.3,.4,.86],  sunCol:[.2,.24,.42], sky:[.2,.24,.4],  bounce:[.04,.04,.07],shA:.4, ray:0,  rayCol:[.6,.7,1],  fog:.1, fogCol:[.25,.3,.5],   lamp:1,  win:1,  night:1, bloom:1,  sat:.9, con:1.05,lift:[.03,.04,.08],gain:[.98,1,1.06], vig:.42,sunAmt:0},
];
KEYS.push(Object.assign({},KEYS[0],{h:28.5}));
