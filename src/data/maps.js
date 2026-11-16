/* ---------- 地図 ---------- */
const MAPS={
farm:{name:'牧場',rows:[
'TTTTTTTTTTTTTTTT',
'TggggggggggggggT',
'THHHHHHAAAAggggT',
'THHHHHHAAAAggggT',
'THHHHHHAAAAggggT',
'THHHHHHAAAAgXggT',
'TggpgggggggggggT',
'TggppppppggggggT',
'TgFFFFFppFFFFFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFffffffffffFgT',
'TgFFFFFFFFFFFFgT',
'TggggggggggwwwgT',
'TggggggggggwwwgT',
'TTTTTTTTTTTTTTTT']},
town:{name:'街',rows:[
'TTTTTTTTTTTTTTTT',
'TggggggggggggggT',
'TWWWWWggggSSSSST',
'TWWWWWggggSSSSST',
'TWWWWWggggSSSSST',
'TWWWWWzgggSSSSST',
'TggpgkggggggpzzT',
'TgglsssssssslggT',
'TggssssssssssggT',
'TggsbssssssbsggT',
'TggssssOOssssggT',
'TggssssOOssssggT',
'TggssssssssssggT',
'TggssssssssssggT',
'TggssssssssssggT',
'TgglsssssssslggT',
'TggggpggggpggggT',
'TaaaapLLLLpccccT',
'TaaaapLLLLpccccT',
'TaaaapLLLLpccccT',
'TaaaapLLLLpccccT',
'TgppppppppppppgT',
'TggggggggggggggT',
'TTTTTTTTTTTTTTTT'
]},
};
const BLOCK=new Set(['T','H','X','F','w','W','S','O','b','k','a','L','c','l','z']);
function tile(m,x,y){if(x<0||y<0||x>=MW||y>=MH)return 'T';return MAPS[m].rows[y][x];}
const I=(x,y)=>y*MW+x;
function blocked(m,x,y){
  const t=tile(m,x,y);
  if(t==='A')return S.reno.state>0;
  if(BLOCK.has(t))return true;
  if(m==='farm'&&S.farm.rock[I(x,y)])return true;
  return false;
}
const SPOTS={
  farmHome:['farm',3,6],town:['town',7,14],workshop:['town',3,6],shop:['town',12,6],
};

