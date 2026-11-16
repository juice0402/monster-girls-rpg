/* ---------- 台詞（src/data/dialogue.json。ビルドでページに入れる＝window.__DLG。ないときは読みこむ・読めないときの最小版） ---------- */
let DLG={
  player:{name:'わたし'},
  chloe:{name:'クロエ',meet:['…はじめまして。クロエ。工房をやってる。'],daily:{0:['…何か用？'],2:['畑、見たよ。'],4:['今日も来たんだ。…悪くない。']},giftPrefs:{love:['石'],like:['ジャガイモ'],dislike:[]},gift:{love:'…いい石。ありがとう。',like:'もらっておく。',normal:'…どうも。',dislike:'これは…いらない。',already:'今日はもうもらった。'},invite:{lowHearts:'…まだ、そこまでじゃない。',noRoom:'部屋がないでしょ。'},cohabit:[{who:'chloe',text:'…わかった。明日、行く。'}],farm:['岩は任せて。'],work:['…ふっ。'],reno:{offer:'改築なら{cost}Gと石{stone}個。',short:'足りない。',ordered:'受けた。2日でやる。',working:'いま工事中。',done:'できたよ。'}},
  luu:{name:'ルゥ',meet:['はじめまして！ルゥだよ！'],daily:{0:['やっほー！'],2:['また来てくれた！'],4:['だいすきー！']},giftPrefs:{love:['イチゴ'],like:['野の花'],dislike:['石']},gift:{love:'わーい！',like:'ありがと！',normal:'えへへ',dislike:'かたーい…',already:'今日はもうもらったよ！'},invite:{lowHearts:'えっ、まだはずかしいよ〜',noRoom:'お部屋、ある？'},cohabit:[{who:'luu',text:'いっしょに住む！'}],farm:['お水あげたよ！'],work:['ぴゅー！'],},
  shop:{name:'種屋さん',species:'',greet:['いらっしゃい。'],bought:'まいど。',noMoney:'お金が足りないよ。'},
  banter:[[{who:'chloe',text:'…ぬれてる。'},{who:'luu',text:'えへへ、スライムだもん！'}]],
};
async function loadDLG(){
  if(window.__DLG){DLG=Object.assign(DLG,window.__DLG);return;}   // 試すページ（1ファイル）用
  try{const r=await fetch('src/data/dialogue.json',{cache:'no-store'});if(r.ok){const j=await r.json();DLG=Object.assign(DLG,j);}}catch(e){}
}

