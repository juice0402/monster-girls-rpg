# 麦わら帽子を立体で作って、向きごとにドットにする
#   python3 tools/hat3d.py → hat3d.json → src/data/chars.js の items.straw へ
# 考え方：ふくらみは「頭を少しだけふくらませた形」（頭と同じ中心のだ円体）。つばは水平の輪で、ふちが少したれる
#   頭の絵（主人公の前向き）から決まる数字：頭の中心・髪のてっぺん・目の高さ。ほかは計算で決める
import math,json,sys
W,H=24,36                # 人の絵の枠（体16×32のまわりに横4・上4のゆとり）
P=dict(
  CX=12.0,CY=15.2,       # 頭の中心（枠の中の位置）
  AH=7.1,                # ふくらみの横・奥の半径（頭の半分の幅＋ふちの厚み）
  TOP=9.3,               # ふくらみのてっぺんの高さ（髪のてっぺんの線にぴったり＝帽子の線は髪の1つ上）
  LOW=15.95,             # つばのいちばん下が来る高さ（線は16段目＝目のすぐ上。目は17段目）
  R=9.95,                # つばの外の半径（枠の幅いっぱい・ふくらみの約1.5倍）
  DROOP=1.4,             # つばのふちのたれ
  T=0.8,                 # つばの厚み（真正面から見ると、つばは厚みとたれの帯に見える）
  ELEV=0,                # 見る角度（度）。人は真正面から描いているので、帽子も真正面（0度）から見る
  BAND=1.4,              # リボンの幅
)
def make(**kw):
    p=dict(P,**kw);CX,CY,AH,R,D=p['CX'],p['CY'],p['AH'],p['R'],p['DROOP']
    E=math.radians(p['ELEV']);sE,cE=math.sin(E),math.cos(E)
    # てっぺんの高さから、ふくらみの縦の半径を計算（だ円体を斜め上から見たときの上の端）
    CH=math.sqrt(max(1,((CY-p['TOP'])**2-(AH*sE)**2)/cE**2))
    # つばのいちばん下（手前のふちの下）が LOW に来るように、つばの高さ（頭の中心から）を計算
    T=p['T'];Z0=D+T+(CY+R*sE-p['LOW'])/cE
    RC=AH*math.sqrt(max(0,1-(Z0/CH)**2))     # つばとふくらみのさかいめの半径
    V=(0,cE,sE)
    Lv=(-.55,.25,.8);ll=math.sqrt(sum(a*a for a in Lv));Lv=tuple(a/ll for a in Lv)  # 光は左上手前
    def norm(v):l=math.sqrt(sum(a*a for a in v)) or 1;return tuple(a/l for a in v)
    def turn(p,face):
        x,y,z=p
        if face=='back':return(-x,-y,z)
        if face=='side':return(y,-x,z)       # 顔を東（右）へ
        return(x,y,z)
    def scr(q):return CX+q[0],CY+q[1]*sE-q[2]*cE,q[1]*cE+q[2]*sE
    def render(face):
        buf={}
        def plot(q,n,kind):
            Q=turn(q,face);N=norm(turn(n,face));xs,ys,d=scr(Q);k=(int(math.floor(xs)),int(math.floor(ys)))
            if 0<=k[0]<W and 0<=k[1]<H and(k not in buf or d>buf[k][0]):buf[k]=(d,N,kind)
        st=0.03
        v0=math.asin(min(1,Z0/CH))
        for i in range(int(2*math.pi/st)+1):     # ふくらみ（つばより上だけ）とリボン
            u=i*st;j=0
            while v0+j*st<=math.pi/2:
                v=v0+j*st;x=AH*math.cos(v)*math.cos(u);y=AH*math.cos(v)*math.sin(u);z=CH*math.sin(v)
                plot((x,y,z),(x/AH**2,y/AH**2,z/CH**2),'band' if z<Z0+p['BAND'] else 'crown');j+=1
        r=RC                                    # つば（輪・ふちが少したれる）
        while r<=R:
            t=(r-RC)/(R-RC);z=Z0-D*t*t;dz=-2*D*t/(R-RC)
            for i in range(int(2*math.pi*r/0.2)+1):
                u=i*0.2/r;plot((r*math.cos(u),r*math.sin(u),z),(-dz*math.cos(u),-dz*math.sin(u),1),'brim')
            r+=0.06
        h=0                                     # つばのふち（外の面・厚みのぶん）
        while h<=T:
            for i in range(int(2*math.pi*R/0.2)+1):
                u=i*0.2/R;plot((R*math.cos(u),R*math.sin(u),Z0-D-h),(math.cos(u),math.sin(u),.35),'rim')
            h+=0.1
        grid=[['.']*W for _ in range(H)];kind={}
        for (x,y),(d,N,k) in buf.items():
            lam=max(0,sum(a*b for a,b in zip(N,Lv)))
            if k=='brim':ch='v' if lam>.9 else 'h' if lam>.66 else 'H' if lam>.3 else 'j'
            elif k=='rim':ch='h' if lam>.55 else 'H' if lam>.2 else 'j'
            elif k=='band':ch='b' if lam>.45 else 'B'
            else:ch='u' if lam>.9 else 'q' if lam>.62 else 'Q' if lam>.2 else 'j'
            grid[y][x]=ch;kind[(x,y)]=k
        # ふくらみの手前で、つばに落ちるかげ（さかいめ）
        for (x,y),k in list(kind.items()):
            if k in('brim','rim') and kind.get((x,y-1)) in('crown','band') and buf[(x,y)][0]<buf[(x,y-1)][0]+3:grid[y][x]='H' if x<CX-2 else 'j'
        # リボンのたれ：うしろの結び目から下へ（後ろと横で見える）
        if face in('back','side'):
            ax,ay,_=scr(turn((0,-RC,Z0+1.0),face));ax,ay=int(math.floor(ax)),int(math.floor(ay))   # 結び目はリボンの上
            tl={'back':[(0,0,'B'),(0,1,'b'),(0,2,'b'),(0,3,'b'),(0,4,'b'),(1,1,'B'),(1,2,'B'),(1,3,'B'),(1,4,'B'),(1,5,'B')],
                'side':[(0,0,'B'),(0,1,'b'),(-1,2,'b'),(-1,3,'b'),(-1,4,'b'),(1,1,'B'),(0,2,'B'),(0,3,'B'),(0,4,'B'),(0,5,'B')]}[face]
            for dx,dy,ch in tl:
                if 0<=ax+dx<W and 0<=ay+dy<H:grid[ay+dy][ax+dx]=ch
        out=[(x,y) for y in range(H) for x in range(W) if grid[y][x]=='.' and any(0<=x+a<W and 0<=y+b<H and grid[y+b][x+a]!='.' for a,b in((1,0),(-1,0),(0,1),(0,-1)))]
        for x,y in out:grid[y][x]='o'
        rows=[''.join(r) for r in grid]
        y0=next(i for i,r in enumerate(rows) if r.strip('.'));y1=max(i for i,r in enumerate(rows) if r.strip('.'))
        return {'y':y0,'rows':rows[y0:y1+1],'c':[CX,CY,AH]}
    info=dict(CH=round(CH,2),Z0=round(Z0,2),RC=round(RC,2))
    return {f:render(f) for f in('front','back','side')},info

if __name__=='__main__':
    views,info=make()
    print(info)
    for f,v in views.items():print(f,v['y']);print('\n'.join(v['rows']))
    json.dump(views,open('hat3d.json','w'))
