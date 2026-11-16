# 麦わら帽子を立体で作って、向きごとにドットにする（python3 tools/hat3d.py → hat3d.json → src/data/chars.js の items.straw へ）
import math,json
W,H=24,36
CX,CY=12.0,15.2          # 頭の中心（ゆとりこみの枠）
A,C_=6.6,5.2             # ふくらみ：横の半径・高さ
R=9.6                    # つばの外の半径（ふくらみの約1.5倍）
DROOP=0.6                # つばのふちのたれ
TILT=math.radians(0)     # つばは水平（どの向きでも同じ形になる）
Z0=4.4                   # 帽子の口の高さ（頭の中心から）：つばの手前がちょうど目の上に来る高さ
ELEV=math.radians(20)    # 人は「ほぼ正面から」描いているので、帽子もその角度（20度）で計算する
V=(0,math.cos(ELEV),math.sin(ELEV))         # カメラの向き
Lv=(-.55,.25,.8);ll=math.sqrt(sum(a*a for a in Lv));Lv=tuple(a/ll for a in Lv)  # 光は左上手前
def norm(v):l=math.sqrt(sum(a*a for a in v)) or 1;return tuple(a/l for a in v)
def tf(p,face):
    x,y,z=p
    y,z=y*math.cos(TILT)-z*math.sin(TILT),y*math.sin(TILT)+z*math.cos(TILT)   # 前（+y）を上げる
    z+=Z0
    if face=='back':x,y=-x,-y
    elif face=='side':x,y=y,-x          # 顔を東（右）へ
    return (x,y,z)
def scr(p):return CX+p[0],CY+p[1]*math.sin(ELEV)-p[2]*math.cos(ELEV),p[1]*V[1]+p[2]*V[2]
def render(face):
    buf={}
    def plot(p,n,kind):
        P=tf(p,face);N=norm(tf(n,face)[:2]+(tf(n,face)[2]-Z0,))
        xs,ys,d=scr(P);k=(int(math.floor(xs)),int(math.floor(ys)))
        if not(0<=k[0]<W and 0<=k[1]<H):return
        if k not in buf or d>buf[k][0]:buf[k]=(d,N,kind)
    st=0.04
    # ふくらみ（だ円の上半分）とリボン
    for i in range(int(2*math.pi/st)+1):
        u=i*st
        for j in range(int((math.pi/2)/st)+1):
            v=j*st;x=A*math.cos(v)*math.cos(u);y=A*math.cos(v)*math.sin(u);z=C_*math.sin(v)
            n=(x/A**2,y/A**2,z/C_**2);plot((x,y,z),n,'band' if .2<z<1.9 else 'crown')
    # つば（輪・ふちが少したれる）
    r=A
    while r<=R:
        t=(r-A)/(R-A);z=-DROOP*t*t;dz=-2*DROOP*t/(R-A)
        for i in range(int(2*math.pi*r/0.25)+1):
            u=i*0.25/r;plot((r*math.cos(u),r*math.sin(u),z),(-dz*math.cos(u),-dz*math.sin(u),1),'brim')
        r+=0.08
    # 色の文字へ
    grid=[['.']*W for _ in range(H)];kind={}
    for (x,y),(d,N,k) in buf.items():
        lam=max(0,sum(a*b for a,b in zip(N,Lv)));facing=sum(a*b for a,b in zip(N,V))
        if k=='brim':
            if facing<0:ch='j' if lam<.5 else 'H'          # 裏が見える所
            else:ch='v' if lam>.9 else 'h' if lam>.66 else 'H' if lam>.3 else 'j'
        elif k=='band':ch='b' if lam>.45 else 'B'
        else:ch='u' if lam>.9 else 'q' if lam>.62 else 'Q' if lam>.2 else 'j'
        grid[y][x]=ch;kind[(x,y)]=k
    # ふくらみの手前で、つばに落ちる線（さかいめ）
    for (x,y),k in list(kind.items()):
        if k=='brim' and any(kind.get((x+dx,y+dy)) in('crown','band') for dx,dy in((0,-1),(1,0),(-1,0))):
            if buf[(x,y)][0]<max(buf.get((x+dx,y+dy),(-99,))[0] for dx,dy in((0,-1),(1,0),(-1,0))):grid[y][x]='j'
    tails={'back':[(12,13,'b'),(12,14,'b'),(12,15,'b'),(11,16,'b'),(13,14,'B'),(13,15,'B'),(13,16,'B'),(14,17,'B')],'side':[(5,13,'b'),(4,14,'b'),(4,15,'b'),(3,16,'B'),(5,14,'B'),(5,15,'B')]}
    for x,y,ch in tails.get(face,[]):grid[y][x]=ch
    # 外の線
    out=[]
    for y in range(H):
        for x in range(W):
            if grid[y][x]=='.' and any(0<=x+dx<W and 0<=y+dy<H and grid[y+dy][x+dx]!='.' for dx,dy in((1,0),(-1,0),(0,1),(0,-1))):out.append((x,y))
    for x,y in out:grid[y][x]='o'
    rows=[''.join(r) for r in grid]
    y0=next(i for i,r in enumerate(rows) if r.strip('.'));y1=max(i for i,r in enumerate(rows) if r.strip('.'))
    c=tf((0,0,0),face);cx,cy,_=scr(c)
    return {'y':y0,'rows':rows[y0:y1+1],'c':[round(cx,2),round(cy,2),A]}
views={f:render(f) for f in('front','back','side')}
for f,v in views.items():
    print(f,v['y'],v['c']);print('\n'.join(v['rows']))
json.dump(views,open('hat3d.json','w'))
