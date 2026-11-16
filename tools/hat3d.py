# 麦わら帽子を立体で作って、向きごとにドットにする
#   python3 tools/hat3d.py → hat3d.json → src/data/chars.js の items.straw へ
# 考え方（しょーくんの決まり）
#   ・麦わら帽子は UFO 型：頭に沿うふくらみ＋平らなつば（つばはたれない）。それを少しうしろへ傾けてかぶる（斜めかぶり）
#   ・前・後ろ・横は、全部この1つの立体を同じ傾きのまま見る（向きごとに形を変えない）
#   ・人は真正面から描いているので、帽子も真正面から見る（上から見下ろさない）
#   ・ふくらみは「頭を少しだけふくらませた形」（頭と同じ中心のだ円体）
#   ・帽子のうしろ側が頭のかげにかくれる所は描かない（頭を立体でおいて、手前・奥をくらべる）
#   ・つばの高さは計算：前向きと横向きで、顔の前のつばのいちばん下が目のすぐ上（LOW）に来るように
import math,json
W,H=24,36                # 人の絵の枠（体16×32のまわりに横4・上4のゆとり）
P=dict(
  CX=12.0,CY=15.2,       # 頭の中心（枠の中の位置）
  HEAD=(6.3,6.0,5.2),    # 頭の半径（横・奥・たて）。帽子のうしろ側をかくすだけに使う（ふくらみより少し小さく）
  AH=7.1,                # ふくらみの横・奥の半径（頭の半分の幅＋ふちの厚み）
  TOP=9.3,               # ふくらみのてっぺんの高さ（髪のてっぺんの線にぴったり＝帽子の線は髪の1つ上）
  LOW=15.95,             # 顔の前で、つばのいちばん下が来る高さ（線は16段目＝目のすぐ上。目は17段目）
  FACE=3.5,              # 前向きで、顔の前とみなす幅（中心から左右）
  SIDEFACE=(1.0,5.5),    # 横向きで、顔の前とみなす幅（中心から前へ。目は中心の3つ前）
  R=10.9,                # つばの外の半径（枠の幅いっぱい）
  T=0.8,                 # つばの厚み
  TILT=12,               # うしろへの傾き（度）＝斜めかぶり。前のつばが上がり、うしろのつばが下がる
  BAND=1.6,              # リボンの幅
)
Lv=(-.55,.25,.8);ll=math.sqrt(sum(a*a for a in Lv));Lv=tuple(a/ll for a in Lv)  # 光は左上手前
def norm(v):l=math.sqrt(sum(a*a for a in v)) or 1;return tuple(a/l for a in v)
def turn(q,face):
    x,y,z=q
    if face=='back':return(-x,-y,z)
    if face=='side':return(y,-x,z)       # 顔を東（右）へ
    return(x,y,z)

def make(**kw):
    p=dict(P,**kw);CX,CY,AH,R,T=p['CX'],p['CY'],p['AH'],p['R'],p['T']
    th=math.radians(p['TILT']);sT,cT=math.sin(th),math.cos(th)
    def tilt(q):x,y,z=q;return(x,y*cT-z*sT,z*cT+y*sT)    # 前（+y）を上げる
    def scr(q):return CX+q[0],CY-q[2],q[1]               # 真正面から見る：横・たて・手前
    # ふくらみのたての半径：傾けたときのいちばん上が TOP に来るように
    CH=math.sqrt(max(1,((CY-p['TOP'])**2-(AH*sT)**2)/cT**2))
    hx,hy,hz=p['HEAD']
    def hidden(Q,face):                  # 頭のうしろにかくれる点か
        a,b=(hy,hx) if face=='side' else (hx,hy);e=1-(Q[0]/a)**2-(Q[2]/hz)**2
        return e>0 and Q[1]<b*math.sqrt(e)
    def rc(Z0):return AH*math.sqrt(max(0,1-(Z0/CH)**2))  # つばとふくらみのさかいめの半径
    def lowest(Z0,face,X0,X1):           # 顔の前（横 X0〜X1）で見えるつばのいちばん下
        m=-99;r=rc(Z0)
        while r<=R+1e-9:
            n=int(2*math.pi*r/0.25)+1
            for i in range(n):
                u=2*math.pi*i/n
                for z in(Z0,Z0-T):
                    Q=turn(tilt((r*math.cos(u),r*math.sin(u),z)),face)
                    if X0<=Q[0]<=X1 and not hidden(Q,face):m=max(m,CY-Q[2])
            r+=0.2
        return m
    F=p['FACE'];lo,hi=-3.0,CH-0.5
    for _ in range(22):
        Z0=(lo+hi)/2
        if max(lowest(Z0,'front',-F,F),lowest(Z0,'side',*p['SIDEFACE']))>p['LOW']:lo=Z0
        else:hi=Z0
    Z0=hi;RC=rc(Z0)
    def render(face):
        buf={}
        def put(Q,N,kind):
            xs,ys,d=scr(Q);k=(int(math.floor(xs)),int(math.floor(ys)))
            if 0<=k[0]<W and 0<=k[1]<H and(k not in buf or d>buf[k][0]):buf[k]=(d,N,kind)
        def plot(q,n,kind):put(turn(tilt(q),face),norm(turn(tilt(n),face)),kind)
        st=0.03
        for i in range(int(2*math.pi/st)+1):     # 頭（帽子をかくすだけ・描かない）
            u=i*st;j=0
            while -math.pi/2+j*st<=math.pi/2:
                v=-math.pi/2+j*st;put(turn((hx*math.cos(v)*math.cos(u),hy*math.cos(v)*math.sin(u),hz*math.sin(v)),face),(0,0,1),'head');j+=1
        v0=math.asin(min(1,Z0/CH))
        for i in range(int(2*math.pi/st)+1):     # ふくらみ（つばより上だけ）とリボン
            u=i*st;j=0
            while v0+j*st<=math.pi/2:
                v=v0+j*st;x=AH*math.cos(v)*math.cos(u);y=AH*math.cos(v)*math.sin(u);z=CH*math.sin(v)
                plot((x,y,z),(x/AH**2,y/AH**2,z/CH**2),'band' if z<Z0+p['BAND'] else 'crown');j+=1
        r=RC                                    # つば：平らな輪（上の面・下の面）
        while r<=R:
            for i in range(int(2*math.pi*r/0.2)+1):
                u=i*0.2/r;c,s=math.cos(u),math.sin(u)
                plot((r*c,r*s,Z0),(0,0,1),'brim');plot((r*c,r*s,Z0-T),(0,0,-1),'under')
            r+=0.06
        h=0                                     # つばのふち（外の面・厚みのぶん）
        while h<=T:
            for i in range(int(2*math.pi*R/0.2)+1):
                u=i*0.2/R;plot((R*math.cos(u),R*math.sin(u),Z0-h),(math.cos(u),math.sin(u),0),'rim')
            h+=0.1
        extra=[]
        if face in('back','side'):              # うしろの結び目（後ろ向きはリボンのたれも）
            ax,ay,_=scr(turn(tilt((0,-RC-.3,Z0+p['BAND']/2)),face));ax,ay=int(math.floor(ax)),int(math.floor(ay))
            extra=[(ax+dx,ay+dy,ch) for dx,dy,ch in ([(0,0,'B'),(0,1,'b'),(0,2,'b'),(0,3,'b'),(0,4,'b'),(1,1,'B'),(1,2,'B'),(1,3,'B'),(1,4,'B'),(1,5,'B')] if face=='back' else [(0,0,'B')])]
        return finish(buf,extra,[CX,CY,AH])
    info=dict(CH=round(CH,2),Z0=round(Z0,2),RC=round(RC,2))
    return {f:render(f) for f in('front','back','side')},info

def finish(buf,extra,c):                 # 色をつけて、さかいめのかげ・リボンの飾り・外の線
    grid=[['.']*W for _ in range(H)];kind={}
    for (x,y),(d,N,k) in buf.items():
        kind[(x,y)]=k
        if k=='head':continue                # 頭が手前＝帽子はかくれる（体の絵がそのまま見える）
        lam=max(0,sum(a*b for a,b in zip(N,Lv)))
        if k=='brim':ch='v' if lam>.9 else 'h' if lam>.66 else 'H' if lam>.3 else 'j'
        elif k=='under':ch='H'               # つばの裏（うしろへ傾けると前から見える）。麦は光を通すので、まっ暗にしない
        elif k=='rim':ch='h' if lam>.4 else 'H' if lam>.12 else 'j'
        elif k=='band':ch='b' if lam>.45 else 'B'
        else:ch='u' if lam>.9 else 'q' if lam>.62 else 'Q' if lam>.2 else 'j'
        grid[y][x]=ch
    S=('brim','under','rim');g=[r[:] for r in grid]   # つばの1ドットだけちがう色（市松）は、左右の色にそろえる
    for (x,y),k in kind.items():
        if k in S and kind.get((x-1,y)) in S and kind.get((x+1,y)) in S and g[y][x-1]==g[y][x+1]!=g[y][x]:grid[y][x]=g[y][x-1]
    dark={'v':'h','h':'H','H':'j','j':'j'}    # ふくらみのすぐ下のつばに落ちるかげ：1段だけ暗く
    for (x,y),k in list(kind.items()):
        if k in('brim','rim') and kind.get((x,y-1)) in('crown','band'):grid[y][x]=dark[grid[y][x]]
    for x,y,ch in extra:
        if 0<=x<W and 0<=y<H:grid[y][x]=ch
    # 外の線（帽子のまわり。顔の上に来るつばのふちの下にも引く）
    out=[(x,y) for y in range(H) for x in range(W) if grid[y][x]=='.' and any(0<=x+a<W and 0<=y+b<H and grid[y+b][x+a]!='.' for a,b in((1,0),(-1,0),(0,1),(0,-1)))]
    for x,y in out:grid[y][x]='o'
    rows=[''.join(r) for r in grid]
    y0=next(i for i,r in enumerate(rows) if r.strip('.'));y1=max(i for i,r in enumerate(rows) if r.strip('.'))
    return {'y':y0,'rows':rows[y0:y1+1],'c':c}

if __name__=='__main__':
    views,info=make()
    print(info)
    for f,v in views.items():print(f,v['y']);print('\n'.join(v['rows']))
    json.dump(views,open('hat3d.json','w'))
