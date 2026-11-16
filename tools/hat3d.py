# 麦わら帽子を立体で作って、向きごとにドットにする
#   python3 tools/hat3d.py → hat3d.json → src/data/chars.js の items.straw へ
# 考え方（しょーくんの決まり）
#   ・人は真正面から描いているので、帽子も真正面から見る（上から見下ろさない）
#   ・ふくらみは「頭を少しだけふくらませた形」（頭と同じ中心のだ円体）で、頭に沿う
#   ・つばは外へいくほどたれ、帽子は少しうしろに傾けてかぶる → 前から見ると、つばが顔をかこむアーチ（⌒）になる
#   ・帽子のうしろ側が頭のかげにかくれる所は描かない（頭を立体でおいて、手前・奥をくらべる）
#   頭の絵（主人公の前向き）から決まる数字：頭の中心・髪のてっぺん・目の高さ。つばの高さとふくらみの高さは計算で決める
import math,json
W,H=24,36                # 人の絵の枠（体16×32のまわりに横4・上4のゆとり）
P=dict(
  CX=12.0,CY=15.2,       # 頭の中心（枠の中の位置）
  HEAD=(6.3,6.0,5.8),    # 頭の半径（横・奥・たて）。帽子のうしろ側をかくすのに使う
  AH=7.1,                # ふくらみの横・奥の半径（頭の半分の幅＋ふちの厚み）
  TOP=9.3,               # ふくらみのてっぺんの高さ（髪のてっぺんの線にぴったり＝帽子の線は髪の1つ上）
  LOW=15.95,             # 顔の前で、つばのいちばん下が来る高さ（線は16段目＝目のすぐ上。目は17段目）。前と横の両方で守る
  FACE=3.5,              # 前向きで、顔の前とみなす幅（中心から左右）
  SIDEFACE=(1.0,5.5),    # 横向きで、顔の前とみなす幅（中心から前へ。目は中心の3つ前）
  R=10.9,                # つばの外の半径（枠の幅いっぱい）
  DROOP=2.0,             # つばのたれ（外へいくほど強く）
  T=0.8,                 # つばのふちの厚み
  TILT=10,               # うしろへの傾き（度）。前のつばが上がり、横と後ろが下がる
  FRONT=0.4,             # 前のつばのたれの割合（1＝まわりと同じ）。前だけ少なくして、つばが顔をかこむアーチ（⌒）に
  BAND=1.4,              # リボンの幅
)
def make(**kw):
    p=dict(P,**kw);CX,CY,AH,R,D,T=p['CX'],p['CY'],p['AH'],p['R'],p['DROOP'],p['T']
    th=math.radians(p['TILT']);sT,cT=math.sin(th),math.cos(th)
    # ふくらみのたての半径：傾けたときのいちばん上が TOP に来るように
    CH=math.sqrt(max(1,((CY-p['TOP'])**2-(AH*sT)**2)/cT**2))
    # つばの高さ：顔の前（横 FACE まで）のつばのふちの下が LOW に来るように
    def dr(su):return D*(1-(1-p['FRONT'])*max(0,su)**2)   # 向きごとのたれ（su＝前むきの度合い）
    Lv=(-.55,.25,.8);ll=math.sqrt(sum(a*a for a in Lv));Lv=tuple(a/ll for a in Lv)  # 光は左上手前
    def norm(v):l=math.sqrt(sum(a*a for a in v)) or 1;return tuple(a/l for a in v)
    def tilt(q):x,y,z=q;return(x,y*cT-z*sT,z*cT+y*sT)    # 前（+y）を上げる
    def turn(q,face):
        x,y,z=q
        if face=='back':return(-x,-y,z)
        if face=='side':return(y,-x,z)       # 顔を東（右）へ
        return(x,y,z)
    def scr(q):return CX+q[0],CY-q[2],q[1]   # 真正面から見る：横・たて・手前
    hx,hy,hz=p['HEAD']
    def hidden(Q,face):                      # 頭のうしろにかくれる点か
        a,b=(hy,hx) if face=='side' else (hx,hy);e=1-(Q[0]/a)**2-(Q[2]/hz)**2
        return e>0 and Q[1]<b*math.sqrt(e)
    def lowest(Z0,face,X0,X1):               # 顔の前（横 X0〜X1）で見えるつばのいちばん下
        rc=AH*math.sqrt(max(0,1-(Z0/CH)**2));m=-99;r=rc
        while r<=R+1e-9:
            t=(r-rc)/(R-rc);n=int(2*math.pi*r/0.3)+1
            for i in range(n):
                u=2*math.pi*i/n;z=Z0-dr(math.sin(u))*t*t-(T if r>R-0.2 else 0)
                Q=turn(tilt((r*math.cos(u),r*math.sin(u),z)),face)
                if X0<=Q[0]<=X1 and not hidden(Q,face):m=max(m,CY-Q[2])
            r+=0.25
        return m
    # つばの高さ：前と横の両方で、顔の前のつばのいちばん下が LOW に来るように（いちばん下がる所で合わせる）
    F=p['FACE'];lo,hi=-2.0,CH-0.5
    for _ in range(22):
        Z0=(lo+hi)/2
        if max(lowest(Z0,'front',-F,F),lowest(Z0,'side',*p['SIDEFACE']))>p['LOW']:lo=Z0
        else:hi=Z0
    Z0=hi
    RC=AH*math.sqrt(max(0,1-(Z0/CH)**2))     # つばとふくらみのさかいめの半径
    def render(face):
        buf={}
        def put(Q,N,kind):
            xs,ys,d=scr(Q);k=(int(math.floor(xs)),int(math.floor(ys)))
            if 0<=k[0]<W and 0<=k[1]<H and(k not in buf or d>buf[k][0]):buf[k]=(d,N,kind)
        def plot(q,n,kind):put(turn(tilt(q),face),norm(turn(tilt(n),face)),kind)
        st=0.03
        # 頭（帽子をかくすだけ・描かない）
        for i in range(int(2*math.pi/st)+1):
            u=i*st;j=0
            while -math.pi/2+j*st<=math.pi/2:
                v=-math.pi/2+j*st;q=(hx*math.cos(v)*math.cos(u),hy*math.cos(v)*math.sin(u),hz*math.sin(v))
                put(turn(q,face),(0,0,1),'head');j+=1
        v0=math.asin(min(1,Z0/CH))
        for i in range(int(2*math.pi/st)+1):     # ふくらみ（つばより上だけ）とリボン
            u=i*st;j=0
            while v0+j*st<=math.pi/2:
                v=v0+j*st;x=AH*math.cos(v)*math.cos(u);y=AH*math.cos(v)*math.sin(u);z=CH*math.sin(v)
                plot((x,y,z),(x/AH**2,y/AH**2,z/CH**2),'band' if z<Z0+p['BAND'] else 'crown');j+=1
        r=RC                                    # つば（外へいくほどたれる）
        while r<=R:
            t=(r-RC)/(R-RC)
            for i in range(int(2*math.pi*r/0.2)+1):
                u=i*0.2/r;Du=dr(math.sin(u));z=Z0-Du*t*t;dz=-2*Du*t/(R-RC)
                plot((r*math.cos(u),r*math.sin(u),z),(-dz*math.cos(u),-dz*math.sin(u),1),'brim')
            r+=0.06
        h=0                                     # つばのふち（外の面・厚みのぶん）
        while h<=T:
            for i in range(int(2*math.pi*R/0.2)+1):
                u=i*0.2/R;plot((R*math.cos(u),R*math.sin(u),Z0-dr(math.sin(u))-h),(math.cos(u),math.sin(u),0),'rim')
            h+=0.1
        grid=[['.']*W for _ in range(H)];kind={}
        for (x,y),(d,N,k) in buf.items():
            if k=='head':kind[(x,y)]=k;continue  # 頭が手前＝帽子はかくれる（体の絵がそのまま見える）
            lam=max(0,sum(a*b for a,b in zip(N,Lv)))
            if k=='brim':ch='v' if lam>.9 else 'h' if lam>.66 else 'H' if lam>.3 else 'j'
            elif k=='rim':ch='h' if lam>.4 else 'H' if lam>.12 else 'j'
            elif k=='band':ch='b' if lam>.45 else 'B'
            else:ch='u' if lam>.9 else 'q' if lam>.62 else 'Q' if lam>.2 else 'j'
            grid[y][x]=ch;kind[(x,y)]=k
        # ふくらみのすぐ下のつばに落ちるかげ（さかいめ）：1段だけ暗く
        dark={'v':'h','h':'H','H':'j','j':'j'}
        for (x,y),k in list(kind.items()):
            if k in('brim','rim') and kind.get((x,y-1)) in('crown','band'):grid[y][x]=dark[grid[y][x]]
        # リボンのたれ：うしろの結び目から下へ（後ろと横で見える）
        if face in('back','side'):
            ax,ay,_=scr(turn(tilt((0,-RC,Z0+1.0)),face));ax,ay=int(math.floor(ax)),int(math.floor(ay))   # 結び目はリボンの上
            tl={'back':[(0,0,'B'),(0,1,'b'),(0,2,'b'),(0,3,'b'),(0,4,'b'),(1,1,'B'),(1,2,'B'),(1,3,'B'),(1,4,'B'),(1,5,'B')],
                'side':[(0,0,'B'),(0,1,'b'),(-1,2,'b'),(-1,3,'b'),(-1,4,'b'),(1,1,'B'),(0,2,'B'),(0,3,'B'),(0,4,'B'),(0,5,'B')]}[face]
            for dx,dy,ch in tl:
                if 0<=ax+dx<W and 0<=ay+dy<H:grid[ay+dy][ax+dx]=ch;kind[(ax+dx,ay+dy)]='band'
        # 外の線（帽子のまわり。顔の上に来るつばのふちの下にも引く）
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
