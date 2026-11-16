const TS=16, MW=16, MH=24;
const DOW=['月','火','水','木','金','土','日'];
const GMIN_PER_SEC=10/7;            // ゲームの10分＝7秒
const DAY_START=360, DAY_END=1560;  // 6:00〜26:00(2:00)
const SEASON_DAYS=28;
const CROPS={
  kabu:{name:'カブ',seed:20,days:4,sell:45,regrow:0},
  jaga:{name:'ジャガイモ',seed:50,days:6,sell:110,regrow:0},
  ichigo:{name:'イチゴ',seed:100,days:8,sell:70,regrow:4},
};
const ITEM_NAMES={kabu:'カブ',jaga:'ジャガイモ',ichigo:'イチゴ',stone:'石',flower:'野の花'};
const RENO={cost:1500,stone:30,days:2,rooms:2};
const HEART=100, INVITE_HEARTS=4, MAX_HEARTS=10;
const COST={till:2,water:1,rock:4};
// 道具（レベルは S.tools。あとで強くできるように、いまは全部1）
const TOOLS={hoe:{name:'クワ'},can:{name:'じょうろ'},pick:{name:'ハンマー'}};
const TOOL_LV=['','ふつう'];
const HOTBAR=()=>[...Object.keys(TOOLS),...Object.keys(CROPS)];
const SAVE_KEY='monmusu-farm-proto1';
const DIRS=[[0,1],[0,-1],[-1,0],[1,0]];

