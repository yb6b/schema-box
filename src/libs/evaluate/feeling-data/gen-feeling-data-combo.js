import { writeFileSync } from 'node:fs'

import { KEYS } from './combo'

/** 注意，数值都乘了10，为了转整数，好储存。 */
const eq = `
''	14
',	21
'-	20
'.	20
'/	18
'0	22
'1	12
'2	12
'3	12
'4	12
'5	13
'6	23
'7	21
'8	22
'9	24
';	19
'=	19
'[	18
']	17
' 	13
'a	12
'b	12
'c	12
'd	13
'e	12
'f	12
'g	12
'h	18
'i	19
'j	18
'k	20
'l	21
'm	18
'n	18
'o	21
'p	20
'q	11
'r	12
's	12
't	12
'u	19
'v	12
'w	12
'x	12
'y	20
'z	14
,'	20
,,	13
,-	23
,.	16
,/	18
,0	20
,1	13
,2	12
,3	12
,4	12
,5	13
,6	23
,7	22
,8	21
,9	22
,;	20
,=	22
,[	21
,]	21
, 	13
,a	12
,b	12
,c	12
,d	11
,e	12
,f	11
,g	12
,h	19
,i	19
,j	18
,k	16
,l	17
,m	16
,n	17
,o	19
,p	20
,q	12
,r	11
,s	12
,t	12
,u	19
,v	12
,w	12
,x	13
,y	21
,z	13
-'	22
-,	25
--	14
-.	25
-/	22
-0	18
-1	12
-2	12
-3	12
-4	11
-5	13
-6	10
-7	18
-8	21
-9	22
-;	20
-=	16
-[	18
-]	20
- 	13
-a	12
-b	12
-c	13
-d	12
-e	12
-f	12
-g	12
-h	19
-i	21
-j	19
-k	23
-l	24
-m	21
-n	20
-o	20
-p	18
-q	12
-r	12
-s	12
-t	12
-u	17
-v	12
-w	13
-x	12
-y	18
-z	12
.'	19
.,	16
.-	22
..	14
./	17
.0	21
.1	13
.2	11
.3	12
.4	12
.5	13
.6	23
.7	22
.8	22
.9	21
.;	19
.=	22
.[	20
.]	21
. 	13
.a	11
.b	11
.c	12
.d	11
.e	11
.f	11
.g	11
.h	20
.i	19
.j	18
.k	17
.l	18
.m	16
.n	18
.o	20
.p	19
.q	12
.r	12
.s	11
.t	12
.u	19
.v	11
.w	12
.x	12
.y	20
.z	13
/'	18
/,	19
/-	23
/.	19
//	14
/0	23
/1	12
/2	12
/3	12
/4	11
/5	11
/6	23
/7	23
/8	22
/9	21
/;	19
/=	22
/[	20
/]	20
/ 	13
/a	12
/b	12
/c	12
/d	12
/e	11
/f	12
/g	12
/h	20
/i	20
/j	18
/k	19
/l	20
/m	17
/n	19
/o	23
/p	21
/q	12
/r	12
/s	11
/t	12
/u	19
/v	12
/w	13
/x	12
/y	20
/z	13
0'	21
0,	24
0-	17
0.	22
0/	22
00	14
01	14
02	14
03	12
04	12
05	12
06	16
07	16
08	16
09	17
0;	20
0=	17
0[	18
0]	20
0 	14
0a	11
0b	11
0c	11
0d	11
0e	11
0f	11
0g	11
0h	17
0i	19
0j	19
0k	21
0l	20
0m	19
0n	18
0o	18
0p	17
0q	12
0r	11
0s	12
0t	13
0u	16
0v	11
0w	12
0x	13
0y	17
0z	14
1'	11
1,	12
1-	12
1.	10
1/	11
10	12
11	13
12	15
13	17
14	15
15	15
16	12
17	11
18	11
19	11
1;	12
1=	11
1[	12
1]	11
1 	12
1a	22
1b	22
1c	23
1d	22
1e	21
1f	20
1g	19
1h	11
1i	11
1j	11
1k	11
1l	11
1m	11
1n	11
1o	11
1p	11
1q	21
1r	18
1s	24
1t	16
1u	13
1v	22
1w	21
1x	23
1y	13
1z	24
2'	11
2,	13
2-	13
2.	11
2/	10
20	12
21	16
22	14
23	16
24	16
25	15
26	12
27	11
28	10
29	11
2;	12
2=	11
2[	12
2]	11
2 	13
2a	20
2b	22
2c	22
2d	21
2e	18
2f	19
2g	18
2h	11
2i	11
2j	11
2k	11
2l	10
2m	11
2n	11
2o	11
2p	11
2q	19
2r	17
2s	20
2t	17
2u	12
2v	20
2w	19
2x	22
2y	13
2z	23
3'	11
3,	12
3-	13
3.	10
3/	11
30	12
31	15
32	16
33	13
34	14
35	15
36	13
37	11
38	11
39	11
3;	12
3=	11
3[	12
3]	11
3 	13
3a	17
3b	20
3c	21
3d	19
3e	18
3f	19
3g	18
3h	11
3i	11
3j	11
3k	11
3l	11
3m	11
3n	11
3o	11
3p	12
3q	16
3r	17
3s	18
3t	16
3u	12
3v	19
3w	17
3x	21
3y	12
3z	21
4'	11
4,	12
4-	13
4.	11
4/	11
40	11
41	14
42	14
43	15
44	13
45	18
46	12
47	12
48	11
49	11
4;	12
4=	11
4[	12
4]	11
4 	14
4a	16
4b	21
4c	22
4d	21
4e	19
4f	19
4g	19
4h	10
4i	11
4j	11
4k	11
4l	11
4m	10
4n	11
4o	11
4p	12
4q	15
4r	18
4s	18
4t	18
4u	11
4v	19
4w	16
4x	21
4y	11
4z	21
5'	11
5,	13
5-	12
5.	12
5/	11
50	12
51	13
52	14
53	14
54	17
55	13
56	13
57	12
58	11
59	11
5;	12
5=	11
5[	12
5]	11
5 	14
5a	17
5b	20
5c	21
5d	19
5e	18
5f	19
5g	18
5h	11
5i	10
5j	11
5k	11
5l	10
5m	11
5n	11
5o	11
5p	11
5q	15
5r	18
5s	17
5t	17
5u	12
5v	21
5w	16
5x	20
5y	12
5z	20
6'	19
6,	22
6-	15
6.	21
6/	22
60	14
61	12
62	12
63	12
64	13
65	15
66	13
67	14
68	14
69	14
6;	20
6=	18
6[	18
6]	21
6 	14
6a	13
6b	13
6c	11
6d	12
6e	11
6f	12
6g	14
6h	18
6i	17
6j	19
6k	20
6l	19
6m	21
6n	20
6o	17
6p	17
6q	12
6r	12
6s	12
6t	13
6u	17
6v	12
6w	12
6x	12
6y	16
6z	14
7'	20
7,	21
7-	16
7.	22
7/	21
70	14
71	12
72	12
73	11
74	11
75	13
76	17
77	13
78	18
79	14
7;	20
7=	18
7[	19
7]	19
7 	13
7a	12
7b	12
7c	11
7d	11
7e	11
7f	11
7g	12
7h	18
7i	17
7j	18
7k	19
7l	19
7m	20
7n	19
7o	17
7p	17
7q	11
7r	11
7s	12
7t	11
7u	16
7v	12
7w	12
7x	12
7y	16
7z	12
8'	20
8,	21
8-	17
8.	20
8/	21
80	15
81	11
82	11
83	11
84	12
85	12
86	16
87	15
88	13
89	14
8;	20
8=	20
8[	18
8]	21
8 	13
8a	12
8b	12
8c	11
8d	11
8e	11
8f	11
8g	12
8h	16
8i	16
8j	17
8k	18
8l	19
8m	19
8n	18
8o	19
8p	16
8q	12
8r	11
8s	11
8t	12
8u	15
8v	11
8w	12
8x	12
8y	15
8z	12
9'	22
9,	22
9-	18
9.	22
9/	21
90	14
91	12
92	11
93	12
94	13
95	13
96	17
97	15
98	15
99	13
9;	22
9=	20
9[	20
9]	21
9 	14
9a	12
9b	11
9c	11
9d	11
9e	11
9f	12
9g	12
9h	18
9i	18
9j	17
9k	20
9l	19
9m	20
9n	19
9o	18
9p	17
9q	12
9r	11
9s	12
9t	12
9u	16
9v	11
9w	12
9x	12
9y	17
9z	13
;'	17
;,	20
;-	20
;.	20
;/	18
;0	20
;1	12
;2	12
;3	11
;4	11
;5	14
;6	21
;7	21
;8	21
;9	23
;;	14
;=	20
;[	18
;]	20
; 	14
;a	12
;b	12
;c	11
;d	11
;e	12
;f	11
;g	12
;h	17
;i	18
;j	17
;k	18
;l	20
;m	19
;n	18
;o	21
;p	18
;q	12
;r	11
;s	11
;t	12
;u	17
;v	12
;w	12
;x	12
;y	19
;z	13
='	20
=,	26
=-	18
=.	25
=/	23
=0	19
=1	13
=2	12
=3	12
=4	11
=5	14
=6	21
=7	20
=8	22
=9	22
=;	20
==	13
=[	17
=]	18
= 	15
=a	12
=b	12
=c	12
=d	12
=e	11
=f	12
=g	13
=h	21
=i	22
=j	20
=k	24
=l	24
=m	21
=n	21
=o	21
=p	19
=q	12
=r	12
=s	11
=t	12
=u	18
=v	12
=w	12
=x	12
=y	19
=z	13
['	18
[,	25
[-	18
[.	22
[/	20
[0	20
[1	12
[2	12
[3	12
[4	12
[5	13
[6	21
[7	20
[8	21
[9	22
[;	19
[=	17
[[	14
[]	16
[ 	13
[a	12
[b	12
[c	12
[d	11
[e	11
[f	11
[g	12
[h	18
[i	19
[j	18
[k	22
[l	22
[m	20
[n	19
[o	21
[p	18
[q	12
[r	12
[s	12
[t	12
[u	16
[v	12
[w	13
[x	12
[y	18
[z	13
]'	19
],	25
]-	20
].	24
]/	21
]0	23
]1	13
]2	12
]3	12
]4	12
]5	14
]6	24
]7	22
]8	23
]9	25
];	20
]=	18
][	19
]]	14
] 	14
]a	12
]b	12
]c	12
]d	13
]e	12
]f	13
]g	12
]h	21
]i	21
]j	21
]k	23
]l	23
]m	20
]n	21
]o	22
]p	20
]q	12
]r	12
]s	11
]t	12
]u	19
]v	12
]w	12
]x	12
]y	21
]z	13
 '	15
 ,	14
 -	16
 .	15
 /	15
 0	14
 1	17
 2	16
 3	14
 4	14
 5	16
 6	16
 7	16
 8	15
 9	15
 ;	15
 =	16
 [	15
 ]	14
  	13
 a	14
 b	14
 c	15
 d	14
 e	14
 f	14
 g	13
 h	13
 i	14
 j	14
 k	13
 l	13
 m	14
 n	13
 o	14
 p	14
 q	15
 r	14
 s	15
 t	15
 u	15
 v	15
 w	15
 x	14
 y	16
 z	15
a'	12
a,	12
a-	12
a.	10
a/	10
a0	11
a1	22
a2	22
a3	20
a4	17
a5	16
a6	13
a7	11
a8	11
a9	11
a;	13
a=	12
a[	12
a]	11
a 	13
aa	13
ab	18
ac	17
ad	15
ae	15
af	15
ag	15
ah	11
ai	11
aj	11
ak	10
al	10
am	11
an	11
ao	11
ap	12
aq	19
ar	17
as	16
at	15
au	12
av	15
aw	18
ax	19
ay	12
az	19
b'	11
b,	13
b-	12
b.	11
b/	11
b0	12
b1	21
b2	22
b3	20
b4	22
b5	22
b6	14
b7	12
b8	12
b9	11
b;	12
b=	14
b[	12
b]	11
b 	12
ba	16
bb	13
bc	17
bd	16
be	17
bf	19
bg	18
bh	12
bi	11
bj	12
bk	12
bl	11
bm	11
bn	11
bo	11
bp	11
bq	18
br	19
bs	17
bt	19
bu	12
bv	18
bw	18
bx	17
by	13
bz	16
c'	11
c,	12
c-	11
c.	11
c/	11
c0	12
c1	21
c2	22
c3	20
c4	21
c5	21
c6	14
c7	11
c8	12
c9	11
c;	12
c=	11
c[	12
c]	11
c 	12
ca	16
cb	16
cc	13
cd	17
ce	18
cf	17
cg	17
ch	11
ci	11
cj	11
ck	10
cl	10
cm	11
cn	10
co	11
cp	11
cq	18
cr	19
cs	18
ct	19
cu	11
cv	15
cw	15
cx	16
cy	12
cz	14
d'	12
d,	12
d-	12
d.	10
d/	11
d0	12
d1	18
d2	19
d3	19
d4	19
d5	20
d6	12
d7	12
d8	11
d9	12
d;	12
d=	11
d[	12
d]	11
d 	13
da	14
db	17
dc	19
dd	13
de	16
df	15
dg	15
dh	11
di	10
dj	11
dk	11
dl	11
dm	11
dn	11
do	11
dp	11
dq	16
dr	17
ds	14
dt	17
du	11
dv	16
dw	16
dx	17
dy	12
dz	15
e'	11
e,	12
e-	12
e.	11
e/	11
e0	12
e1	17
e2	18
e3	18
e4	17
e5	17
e6	13
e7	12
e8	11
e9	12
e;	12
e=	12
e[	12
e]	11
e 	15
ea	15
eb	18
ec	19
ed	18
ee	13
ef	15
eg	16
eh	11
ei	11
ej	10
ek	10
el	11
em	11
en	11
eo	10
ep	12
eq	14
er	13
es	17
et	16
eu	11
ev	17
ew	14
ex	20
ey	12
ez	18
f'	10
f,	12
f-	12
f.	11
f/	12
f0	12
f1	17
f2	17
f3	18
f4	19
f5	19
f6	13
f7	12
f8	12
f9	11
f;	12
f=	11
f[	12
f]	11
f 	13
fa	13
fb	18
fc	18
fd	15
fe	14
ff	13
fg	18
fh	11
fi	12
fj	11
fk	11
fl	11
fm	12
fn	11
fo	11
fp	11
fq	15
fr	17
fs	15
ft	17
fu	12
fv	18
fw	14
fx	17
fy	12
fz	16
g'	11
g,	12
g-	12
g.	11
g/	11
g0	12
g1	16
g2	18
g3	18
g4	20
g5	19
g6	13
g7	12
g8	12
g9	12
g;	12
g=	12
g[	12
g]	11
g 	14
ga	14
gb	18
gc	18
gd	15
ge	14
gf	16
gg	13
gh	12
gi	11
gj	11
gk	11
gl	11
gm	11
gn	11
go	11
gp	11
gq	14
gr	18
gs	15
gt	17
gu	11
gv	18
gw	15
gx	17
gy	11
gz	16
h'	17
h,	18
h-	17
h.	18
h/	19
h0	15
h1	13
h2	11
h3	12
h4	12
h5	12
h6	17
h7	17
h8	14
h9	15
h;	16
h=	18
h[	16
h]	18
h 	13
ha	12
hb	12
hc	12
hd	11
he	11
hf	12
hg	15
hh	13
hi	13
hj	16
hk	15
hl	14
hm	18
hn	16
ho	14
hp	14
hq	12
hr	11
hs	11
ht	11
hu	15
hv	12
hw	11
hx	12
hy	15
hz	12
i'	18
i,	19
i-	18
i.	19
i/	19
i0	17
i1	14
i2	11
i3	11
i4	12
i5	11
i6	19
i7	18
i8	17
i9	16
i;	18
i=	20
i[	17
i]	19
i 	13
ia	12
ib	12
ic	12
id	11
ie	11
if	11
ig	12
ih	17
ii	13
ij	15
ik	16
il	16
im	17
in	15
io	14
ip	15
iq	12
ir	11
is	11
it	11
iu	14
iv	12
iw	11
ix	12
iy	16
iz	13
j'	16
j,	19
j-	18
j.	17
j/	17
j0	17
j1	13
j2	12
j3	11
j4	12
j5	12
j6	19
j7	18
j8	16
j9	16
j;	16
j=	18
j[	16
j]	18
j 	12
ja	11
jb	12
jc	11
jd	11
je	11
jf	12
jg	12
jh	16
ji	15
jj	13
jk	13
jl	14
jm	18
jn	16
jo	15
jp	14
jq	13
jr	11
js	12
jt	11
ju	16
jv	12
jw	12
jx	12
jy	18
jz	13
k'	17
k,	18
k-	20
k.	16
k/	17
k0	18
k1	13
k2	12
k3	11
k4	12
k5	12
k6	20
k7	19
k8	19
k9	19
k;	17
k=	21
k[	18
k]	19
k 	12
ka	12
kb	11
kc	12
kd	11
ke	11
kf	12
kg	12
kh	16
ki	16
kj	15
kk	13
kl	13
km	16
kn	16
ko	16
kp	18
kq	12
kr	11
ks	11
kt	11
ku	16
kv	12
kw	11
kx	13
ky	17
kz	13
l'	18
l,	19
l-	21
l.	18
l/	18
l0	19
l1	13
l2	12
l3	12
l4	12
l5	12
l6	21
l7	20
l8	19
l9	19
l;	17
l=	21
l[	18
l]	20
l 	12
la	12
lb	12
lc	12
ld	11
le	11
lf	11
lg	13
lh	17
li	15
lj	16
lk	16
ll	14
lm	17
ln	17
lo	17
lp	18
lq	13
lr	11
ls	11
lt	11
lu	16
lv	12
lw	12
lx	12
ly	18
lz	13
m'	17
m,	17
m-	20
m.	16
m/	16
m0	19
m1	14
m2	13
m3	12
m4	12
m5	12
m6	22
m7	21
m8	18
m9	18
m;	18
m=	20
m[	19
m]	19
m 	13
ma	12
mb	11
mc	12
md	11
me	11
mf	12
mg	11
mh	18
mi	16
mj	16
mk	16
ml	15
mm	13
mn	16
mo	17
mp	17
mq	13
mr	11
ms	12
mt	12
mu	18
mv	12
mw	12
mx	13
my	20
mz	13
n'	17
n,	18
n-	19
n.	16
n/	17
n0	18
n1	12
n2	12
n3	12
n4	12
n5	12
n6	20
n7	19
n8	17
n9	16
n;	17
n=	19
n[	18
n]	19
n 	12
na	12
nb	12
nc	12
nd	11
ne	11
nf	12
ng	12
nh	17
ni	15
nj	16
nk	16
nl	15
nm	17
nn	13
no	15
np	16
nq	13
nr	11
ns	12
nt	11
nu	17
nv	12
nw	11
nx	13
ny	18
nz	13
o'	19
o,	20
o-	19
o.	21
o/	20
o0	16
o1	13
o2	12
o3	12
o4	13
o5	13
o6	18
o7	18
o8	17
o9	17
o;	19
o=	19
o[	18
o]	20
o 	13
oa	11
ob	11
oc	12
od	11
oe	11
of	11
og	11
oh	14
oi	15
oj	15
ok	18
ol	17
om	17
on	15
oo	14
op	15
oq	13
or	12
os	11
ot	11
ou	13
ov	13
ow	11
ox	12
oy	15
oz	13
p'	19
p,	24
p-	18
p.	23
p/	22
p0	19
p1	13
p2	12
p3	12
p4	12
p5	12
p6	19
p7	19
p8	20
p9	20
p;	19
p=	19
p[	17
p]	18
p 	13
pa	11
pb	11
pc	11
pd	11
pe	11
pf	10
pg	11
ph	16
pi	16
pj	16
pk	19
pl	19
pm	17
pn	18
po	17
pp	13
pq	13
pr	12
ps	11
pt	13
pu	15
pv	13
pw	13
px	12
py	16
pz	12
q'	11
q,	11
q-	12
q.	10
q/	11
q0	11
q1	18
q2	19
q3	18
q4	16
q5	16
q6	13
q7	11
q8	10
q9	11
q;	12
q=	11
q[	12
q]	10
q 	11
qa	19
qb	19
qc	21
qd	19
qe	17
qf	16
qg	17
qh	11
qi	11
qj	11
qk	11
ql	11
qm	11
qn	11
qo	12
qp	13
qq	13
qr	14
qs	21
qt	16
qu	12
qv	17
qw	17
qx	21
qy	12
qz	20
r'	11
r,	12
r-	13
r.	11
r/	11
r0	12
r1	16
r2	17
r3	16
r4	18
r5	17
r6	12
r7	11
r8	11
r9	11
r;	11
r=	12
r[	12
r]	11
r 	14
ra	15
rb	19
rc	20
rd	17
re	14
rf	17
rg	17
rh	11
ri	11
rj	11
rk	12
rl	11
rm	12
rn	11
ro	12
rp	12
rq	15
rr	13
rs	17
rt	17
ru	11
rv	19
rw	15
rx	20
ry	12
rz	20
s'	11
s,	12
s-	13
s.	11
s/	11
s0	12
s1	21
s2	20
s3	19
s4	18
s5	19
s6	12
s7	12
s8	11
s9	11
s;	12
s=	12
s[	12
s]	11
s 	14
sa	16
sb	17
sc	18
sd	15
se	15
sf	15
sg	15
sh	11
si	11
sj	11
sk	11
sl	11
sm	11
sn	11
so	11
sp	11
sq	17
sr	16
ss	13
st	16
su	11
sv	16
sw	17
sx	18
sy	11
sz	18
t'	11
t,	13
t-	13
t.	11
t/	11
t0	12
t1	16
t2	17
t3	17
t4	18
t5	18
t6	15
t7	12
t8	12
t9	11
t;	12
t=	12
t[	13
t]	11
t 	13
ta	15
tb	19
tc	20
td	17
te	14
tf	17
tg	17
th	11
ti	11
tj	11
tk	11
tl	11
tm	11
tn	11
to	11
tp	11
tq	14
tr	17
ts	15
tt	13
tu	12
tv	20
tw	15
tx	21
ty	12
tz	19
u'	17
u,	20
u-	15
u.	18
u/	17
u0	14
u1	13
u2	10
u3	12
u4	12
u5	12
u6	18
u7	15
u8	15
u9	14
u;	16
u=	16
u[	14
u]	17
u 	13
ua	11
ub	11
uc	11
ud	11
ue	11
uf	11
ug	11
uh	16
ui	14
uj	16
uk	17
ul	16
um	18
un	17
uo	14
up	13
uq	11
ur	11
us	12
ut	13
uu	13
uv	12
uw	12
ux	12
uy	15
uz	13
v'	11
v,	12
v-	12
v.	11
v/	11
v0	12
v1	19
v2	19
v3	19
v4	21
v5	20
v6	12
v7	11
v8	12
v9	11
v;	11
v=	11
v[	11
v]	11
v 	12
va	15
vb	18
vc	16
vd	16
ve	16
vf	17
vg	18
vh	11
vi	11
vj	11
vk	11
vl	12
vm	11
vn	12
vo	12
vp	13
vq	17
vr	19
vs	15
vt	19
vu	14
vv	13
vw	15
vx	15
vy	13
vz	14
w'	11
w,	12
w-	13
w.	11
w/	11
w0	14
w1	18
w2	18
w3	17
w4	17
w5	18
w6	13
w7	12
w8	11
w9	11
w;	12
w=	12
w[	12
w]	11
w 	14
wa	18
wb	19
wc	21
wd	19
we	15
wf	16
wg	16
wh	11
wi	11
wj	11
wk	11
wl	11
wm	12
wn	11
wo	11
wp	12
wq	16
wr	15
ws	18
wt	15
wu	12
wv	19
ww	13
wx	20
wy	12
wz	20
x'	11
x,	12
x-	12
x.	11
x/	11
x0	11
x1	23
x2	22
x3	21
x4	21
x5	22
x6	13
x7	12
x8	11
x9	11
x;	12
x=	12
x[	12
x]	12
x 	13
xa	17
xb	15
xc	15
xd	15
xe	18
xf	17
xg	15
xh	11
xi	11
xj	10
xk	11
xl	10
xm	11
xn	11
xo	11
xp	11
xq	20
xr	17
xs	17
xt	18
xu	11
xv	16
xw	19
xx	13
xy	12
xz	17
y'	17
y,	19
y-	16
y.	19
y/	18
y0	15
y1	13
y2	12
y3	11
y4	12
y5	12
y6	16
y7	15
y8	14
y9	13
y;	17
y=	18
y[	16
y]	19
y 	13
ya	12
yb	11
yc	11
yd	11
ye	11
yf	11
yg	11
yh	16
yi	14
yj	18
yk	17
yl	17
ym	19
yn	17
yo	15
yp	14
yq	12
yr	12
ys	11
yt	13
yu	15
yv	13
yw	13
yx	15
yy	13
yz	13
z'	11
z,	12
z-	12
z.	10
z/	11
z0	12
z1	22
z2	24
z3	21
z4	20
z5	20
z6	13
z7	12
z8	11
z9	10
z;	12
z=	11
z[	12
z]	10
z 	13
za	18
zb	15
zc	16
zd	17
ze	18
zf	17
zg	17
zh	10
zi	11
zj	10
zk	11
zl	11
zm	10
zn	11
zo	12
zp	11
zq	21
zr	18
zs	19
zt	17
zu	12
zv	15
zw	21
zx	15
zy	14
zz	13
`

const dlMap = new Map(eq.split('\n').map(v => v.trimEnd().split('\t')))

const keysUnderFinger = ['1qaz', '2wsx', '3edc', '4rfv5tgb', '6yhn7ujm', '8ik,', '9ol.', '0p;/']

const singleSpan = keysUnderFinger.map((v) => {
  const make3 = v => [v[0] + v[1], v[1] + v[2], v[2] + v[3]]
  if (v.length === 4)
    return make3(v)
  return [
    v,
    v.slice(4),
    v[0] + v[5] + v[2] + v[7],
    v[4] + v[1] + v[6] + v[3],
  ].map(make3)
}) // '1q qa az 2w ws sx 3e ed dc 4r rf fv 5t tg gb 5r tf gv 4t rg fb 6y yh hn 7u uj jm 7y uh jn 6u yj hm 8i ik k, 9o ol l. 0p p; ;/ -[ [\' =]'
singleSpan.push(['-[', '[\'', '=]', '0[', '-]', '-p', '=[', '[;', ']\'', 'p\'', '\'/'])

const multiSpan = keysUnderFinger.map((v) => {
  const make3 = v => [v[0] + v[2], v[1] + v[3], v[0] + v[3]]
  if (v.length === 4)
    return make3(v)
  return [
    v,
    v.slice(4),
    v[0] + v[1] + v[6] + v[7],
    v[4] + v[5] + v[2] + v[3],
  ].map(make3)
}) // = 'br bt ce ec mu my nu ny p/ qz rb rv tb tv um un vr vt wx xw ym yn zq ,i /p '
multiSpan.push(['-\'', '0\'', '-;', '=;', '[/', ']/', '-/', '=/'])

const longFingerDisturb = [['xc', 'rt45', 'we23'], ['sd', '45', '23'], [',.', 'yu67', 'io89'], ['kl', '67', '89']].map(([a, b, c]) => {
  const res = [...a].map(a2 => [...b].map(b2 => a2 + b2))

  res.push(a[0] + c[1])
  res.push(a[1] + c[0])
  if (c.length > 2) {
    res.push(a[0] + c[3])
    res.push(a[1] + c[2])
  }
  return res
}) //  = 'ct ,y tc y, cr ,u rc u, cw ,o wc o, qc ,p cq p, qx p. xq .p xe .i ex i. xr .u rx u. xt .y tx y.'

const littleFingerDisturb = [['1qaz', '2wsx3edc'], ['0p;/-[\'=]', '8ik,9ol.']].map(([little, long]) => [...little].map(k => [...long].map(k2 => k + k2)))
// = 'aa ac ad ae aq as aw ax az ca cq cz da dq dz ea eq ez ip i/ i; kp k/ k; lp l/ l; op o/ o; pi pk pl po pp p; qa qc qd qe qq qs qw qx sa sq sz wa wq wz xa xq xz za zc zd ze zs zw zx zz ,p ,/ ,; /i /k /l /o // /; ;i ;k ;l ;o ;p ;/ ;;'

const ssSet = makeSet(singleSpan)
const msSet = makeSet(multiSpan)
const lfdSet = makeSet(longFingerDisturb)
const sfdSet = makeSet(littleFingerDisturb)

const left = new Set('12345qwertasdfgzxcvb')
const right = new Set('67890-=yuiop[]\\hjkl;\'nm,./')

const result = KEYS.map(v1 => KEYS.map(v2 => keyPairToMagic(v1 + v2)))
const resultJson = JSON.stringify(result)

writeFileSync('feeling-data-combo.js', `export default "${resultJson}"`)

////////////////////

function makeSet(str_arr) {
  const flatarr = str_arr.flat(99)
  const r = new Set()
  for (const i of flatarr) {
    r.add(i)
    r.add(i[1] + i[0])
  }
  return r
}

function _isDifferentHand(k) {
  return (
    (left.has(k[0]) && right.has(k[1])) || (left.has(k[1]) && right.has(k[0]))
  )
}

function keyPairToMagic(pair) {
  return (
    ((msSet.has(pair) | 0) << 8) // 同指大跨排
    | ((lfdSet.has(pair) | 0) << 7) // 错手
    | ((ssSet.has(pair) | 0) << 6) // 同指小跨排
    | ((sfdSet.has(pair) | 0) << 5) // 小指干扰
    // | ((isDifferentHand(pair) | 0) << 5) // 左右互击
    | (Number.parseInt(dlMap.get(pair) ?? 0) << 0) // 当量 空间是 0 ~ 0x1F
  )
}
