!function(I){"use strict";function O(n,r,t){return t.a=n,t.f=r,t}function F2(t){return O(2,t,function(r){return function(n){return t(r,n)}})}function F3(u){return O(3,u,function(t){return function(r){return function(n){return u(t,r,n)}}})}function F4(e){return O(4,e,function(u){return function(t){return function(r){return function(n){return e(u,t,r,n)}}}})}function F5(c){return O(5,c,function(e){return function(u){return function(t){return function(r){return function(n){return c(e,u,t,r,n)}}}}})}function F6(i){return O(6,i,function(c){return function(e){return function(u){return function(t){return function(r){return function(n){return i(c,e,u,t,r,n)}}}}}})}function F7(o){return O(7,o,function(i){return function(c){return function(e){return function(u){return function(t){return function(r){return function(n){return o(i,c,e,u,t,r,n)}}}}}}})}function F8(f){return O(8,f,function(o){return function(i){return function(c){return function(e){return function(u){return function(t){return function(r){return function(n){return f(o,i,c,e,u,t,r,n)}}}}}}}})}function A2(n,r,t){return 2===n.a?n.f(r,t):n(r)(t)}function A3(n,r,t,u){return 3===n.a?n.f(r,t,u):n(r)(t)(u)}function A4(n,r,t,u,e){return 4===n.a?n.f(r,t,u,e):n(r)(t)(u)(e)}function A5(n,r,t,u,e,c){return 5===n.a?n.f(r,t,u,e,c):n(r)(t)(u)(e)(c)}function A6(n,r,t,u,e,c,i){return 6===n.a?n.f(r,t,u,e,c,i):n(r)(t)(u)(e)(c)(i)}function A8(n,r,t,u,e,c,i,o,f){return 8===n.a?n.f(r,t,u,e,c,i,o,f):n(r)(t)(u)(e)(c)(i)(o)(f)}var d={$:0};function x(n,r){return{$:1,a:n,b:r}}var U=F2(x);function b(n){for(var r=d,t=n.length;t--;)r=x(n[t],r);return r}var M=F3(function(n,r,t){for(var u=Array(n),e=0;e<n;e++)u[e]=t(r+e);return u}),N=F2(function(n,r){for(var t=Array(n),u=0;u<n&&r.b;u++)t[u]=r.a,r=r.b;return t.length=u,$(t,r)}),G=F2(function(n,r){return r[n]}),F=F3(function(n,r,t){for(var u=t.length,e=Array(u),c=0;c<u;c++)e[c]=t[c];return e[n]=r,e}),j=F3(function(n,r,t){for(var u=t.length,e=0;e<u;e++)r=A2(n,t[e],r);return r}),H=F3(function(n,r,t){for(var u=t.length,e=Array(u),c=0;c<u;c++)e[c]=A2(n,r+c,t[c]);return e});function W(n){throw Error("https://github.com/elm/core/blob/1.0.0/hints/"+n+".md")}function B(n,r){for(var t,u=[],e=Q(n,r,0,u);e&&(t=u.pop());e=Q(t.a,t.b,0,u));return e}function Q(n,r,t,u){if(n!==r){if("object"!=typeof n||null===n||null===r)return"function"==typeof n&&W(5),!1;if(100<t)u.push($(n,r));else for(var e in n.$<0&&(n=Zr(n),r=Zr(r)),n)if(!Q(n[e],r[e],t+1,u))return!1}return!0}function l(n,r,t){if("object"!=typeof n)return n===r?0:n<r?-1:1;if(void 0===n.$)return(t=l(n.a,r.a))||(t=l(n.b,r.b))?t:l(n.c,r.c);for(;n.b&&r.b&&!(t=l(n.a,r.a));n=n.b,r=r.b);return t||(n.b?1:r.b?-1:0)}var _=F2(function(n,r){n=l(n,r);return n<0?Vr:n?zr:Kr});function $(n,r){return{a:n,b:r}}function J(n,r,t){return{a:n,b:r,c:t}}function L(n,r){var t,u={};for(t in n)u[t]=n[t];for(t in r)u[t]=r[t];return u}function q(n,r){if("string"==typeof n)return n+r;if(!n.b)return r;var t=x(n.a,r);n=n.b;for(var u=t;n.b;n=n.b)u=u.b=x(n.a,r);return t}function Y(n){return{$:0,a:n}}function K(n){return{$:1,a:n}}function V(n){return{$:2,b:n,c:null}}var P=F2(function(n,r){return{$:3,b:n,d:r}}),n=F2(function(n,r){return{$:4,b:n,d:r}}),Z=0;function z(n){n={$:0,e:Z++,f:n,g:null,h:[]};return rn(n),n}var X=!1,nn=[];function rn(n){if(nn.push(n),!X){for(X=!0;n=nn.shift();)!function(r){for(;r.f;){var n=r.f.$;if(0===n||1===n){for(;r.g&&r.g.$!==n;)r.g=r.g.i;if(!r.g)return;r.f=r.g.b(r.f.a),r.g=r.g.i}else{if(2===n)return r.f.c=r.f.b(function(n){r.f=n,rn(r)});if(5===n){if(0===r.h.length)return;r.f=r.f.b(r.h.shift())}else r.g={$:3===n?0:1,b:r.f.b,i:r.g},r.f=r.f.d}}}(n);X=!1}}var tn=F2(function(n,r){r%=n;return 0===n?W(11):0<r&&n<0||r<0&&0<n?r+n:r}),un=Math.ceil,en=Math.floor,cn=Math.round,on=Math.log,fn=F2(function(n,r){return n+r}),an=F2(function(n,r){return n+r}),sn=F2(function(n,r){return r.split(n)}),bn=F2(function(n,r){return r.join(n)}),dn=F3(function(n,r,t){return t.slice(n,r)}),ln=F2(function(n,r){return!!~r.indexOf(n)});function $n(n){return n+""}function vn(n){return{$:2,b:n}}var gn=vn(function(n){return"number"==typeof n&&(-2147483647<n&&n<2147483647&&(0|n)===n||isFinite(n)&&!(n%1))?h(n):xn("an INT",n)}),hn=vn(function(n){return"number"==typeof n?h(n):xn("a FLOAT",n)}),pn=vn(function(n){return h(n)}),mn=vn(function(n){return"string"==typeof n?h(n):n instanceof String?h(n+""):xn("a STRING",n)}),An=F2(function(n,r){return{$:6,d:n,b:r}}),yn=F2(function(n,r){return{$:7,e:n,b:r}});function wn(n,r){return{$:9,f:n,g:r}}var r=F2(function(n,r){return{$:10,b:r,h:n}}),Cn=F2(function(n,r){return wn(n,[r])}),Tn=F3(function(n,r,t){return wn(n,[r,t])}),En=F8(function(n,r,t,u,e,c,i,o){return wn(n,[r,t,u,e,c,i,o])}),Dn=F2(function(n,r){try{return Sn(n,JSON.parse(r))}catch(n){return Xr(A2(ot,"This is not valid JSON! "+n.message,r))}}),Rn=F2(Sn);function Sn(n,r){switch(n.$){case 2:return n.b(r);case 5:return null===r?h(n.c):xn("null",r);case 3:return In(r)?kn(n.b,r,b):xn("a LIST",r);case 4:return In(r)?kn(n.b,r,On):xn("an ARRAY",r);case 6:var t=n.d;if("object"!=typeof r||null===r||!(t in r))return xn("an OBJECT with a field named `"+t+"`",r);var u=Sn(n.b,r[t]);return Ot(u)?u:Xr(A2(ft,t,u.a));case 7:t=n.e;return In(r)?t<r.length?(u=Sn(n.b,r[t]),Ot(u)?u:Xr(A2(at,t,u.a))):xn("a LONGER array. Need index "+t+" but only see "+r.length+" entries",r):xn("an ARRAY",r);case 8:if("object"!=typeof r||null===r||In(r))return xn("an OBJECT",r);var e,c=d;for(e in r)if(r.hasOwnProperty(e)){if(u=Sn(n.b,r[e]),!Ot(u))return Xr(A2(ft,e,u.a));c=x($(e,u.a),c)}return h(rt(c));case 9:for(var i=n.f,o=n.g,f=0;f<o.length;f++){if(u=Sn(o[f],r),!Ot(u))return u;i=i(u.a)}return h(i);case 10:return u=Sn(n.b,r),Ot(u)?Sn(n.h(u.a),r):u;case 11:for(var a=d,s=n.g;s.b;s=s.b){if(u=Sn(s.a,r),Ot(u))return u;a=x(u.a,a)}return Xr(st(rt(a)));case 1:return Xr(A2(ot,n.a,r));case 0:return h(n.a)}}function kn(n,r,t){for(var u=r.length,e=Array(u),c=0;c<u;c++){var i=Sn(n,r[c]);if(!Ot(i))return Xr(A2(at,c,i.a));e[c]=i.a}return h(t(e))}function In(n){return Array.isArray(n)||"undefined"!=typeof FileList&&n instanceof FileList}function On(r){return A2(It,r.length,function(n){return r[n]})}function xn(n,r){return Xr(A2(ot,"Expecting "+n,r))}var Un=F2(function(n,r){return JSON.stringify(r,null,n)+""});function Mn(n){return n}function Nn(t){return F2(function(n,r){return r.push(t(n)),r})}var Gn=F4(function(n,r,t,u){return s=n.c5,c=n.ec,i=n.dR,n=function(){return function(){}},Ot(r=A2(Rn,r,u?u.flags:void 0))||W(2),o={},u=s(r.a),a=n(f=u.a),s=function(n,r){var t,u;for(u in Fn){var f=Fn[u];f.a&&((t=t||{})[u]=f.a(u,r)),n[u]=function(){var u={g:r,h:void 0},e=f.c,c=f.d,i=f.e,o=f.f;function n(t){return A2(P,n,{$:5,b:function(n){var r=n.a;return 0===n.$?A3(c,u,r,t):i&&o?A4(e,u,r.i,r.j,t):A3(e,u,i?r.i:r.j,t)}})}return u.h=z(A2(P,n,f.b))}()}return t}(o,e),I.ports=s,Qn(o,u.b,i(f)),s?{ports:s}:{};function e(n,r){n=A2(c,n,f);a(f=n.a,r),Qn(o,n.b,i(f))}var c,i,o,f,a,s}),Fn={},jn=F2(function(r,t){return V(function(n){r.g(t),n(Y(0))})});function Hn(n){return{$:2,m:n}}var Wn=[],Bn=!1;function Qn(n,r,t){if(Wn.push({p:n,q:r,r:t}),!Bn){Bn=!0;for(var u;u=Wn.shift();){var e,c,i=u.p,o=u.r;for(e in _n(!(e=void 0),u.q,c={},null),_n(!1,o,c,null),i)f=i[e],a={$:"fx",a:c[e]||{i:d,j:d}},f.h.push(a),rn(f)}Bn=!1}var f,a}function _n(n,r,t,u){switch(r.$){case 1:var e=r.k,c=u;return t[e]=(o=A2(n?Fn[e].e:Fn[e].f,f,r.l),e=(e=t[e])||{i:d,j:d},n?e.i=x(o,e.i):e.j=x(o,e.j),e);case 2:for(var i=r.m;i.b;i=i.b)_n(n,i.a,t,u);return;case 3:_n(n,r.o,t,{s:r.n,t:u})}var o,c;function f(n){for(var r=c;r;r=r.t)n=r.s(n);return n}}var Jn=F5(function(n,r,t,u,e){for(var c=n.length,i=r+c<=e.length,o=0;i&&o<c;)var f=e.charCodeAt(r),i=n[o++]===e[r++]&&(10==f?(t++,u=1):(u++,55296==(63488&f)?n[o++]===e[r++]:1));return J(i?r:-1,t,u)}),t=F3(function(n,r,t){return r<t.length?55296==(63488&t.charCodeAt(r))?n(t.substr(r,2))?r+2:-1:n(t[r])?"\n"===t[r]?-2:r+1:-1:-1});function c(n){return n}function Ln(n){return A3(ut,it(g),m(d),n)}function qn(n){var r=(r=(n=n).charCodeAt(0))<55296||56319<r?r:1024*(r-55296)+n.charCodeAt(1)-56320+65536;return r<=57&&48<=r}function Yn(n){return{$:1,a:n}}function Kn(n){return{$:0,a:n}}function Vn(n){return A3(Ht,A2(Qt,"",A2(Wt,A2(w,"name",C),n)),A2(Qt,"",A2(Wt,A2(w,"code",kr(b([C,A2(s,dt,Bt)]))),n)),A2(Qt,"",A2(Wt,kr(b([C,A2(w,"message",C)])),n)))}function Pn(n){var t=n;return{d:A2(Vt,function(n){var r=A2(Zt,n,t.d);return 1===r.$?Ir("Unknown variant "+dt(n)+"."):r.a},A2(zt,0,Bt)),e:function(n){return t.e(n)}}}function Zn(n){return{d:nu,e:n,b:0}}function zn(n){return n.e}function Xn(n){return{$:3,a:n}}function nr(n){return{$:2,a:n}}function v(n){return{$:0,a:n}}function rr(n){return{$:1,a:n}}function tr(n){return A3(T,function(n,r){return n.getValues()},n,au(au(bu)))}function ur(r){return function(){var n=r.dt;switch(n.$){case 0:return"Expecting "+n.a+".";case 1:return"Expecting integer.";case 2:return"Expecting hex.";case 3:return"Expecting octal.";case 4:return"Expecting binary.";case 5:return"Expecting float.";case 6:return"Expecting number.";case 7:return"Expecting variable.";case 8:return"Expecting symbol "+n.a+".";case 9:return"Expecting keyword "+n.a+".";case 10:return"Expecting end.";case 11:return"Unexpected character.";case 12:return n.a;default:return"Bad repeat."}}()+("\nCheck row "+dt(r.dy)+" column "+dt(r.cG))+"."}function er(n){switch(n.$){case 0:return qt(n.a);case 1:return cu(n.a);case 2:return lu(n.a);default:return new Date(n.a)}}function cr(n){return{$:1,a:n}}function ir(n){return{$:0,a:n}}function or(n){return B(xr(n.a),n.c)?A3(hu,!1,0,n):A2(gu,!1,A2(yu,n,Jr))}function fr(n){return n.$?{$:1,a:n.a}:{$:0,a:n.a}}function ar(n){return{$:0,a:n}}function sr(n){return{$:1,a:n}}function br(n){var e=n.a,c=n.b,i=!(""===e);return function(n){var r=A5(Nu,e,n.c,n.dy,n.cG,n.a),t=r.a,u=r.b,r=r.c;return B(t,-1)?A2(gu,!1,A2(yu,n,c)):A3(hu,i,0,{cG:r,g:n.g,h:n.h,c:t,dy:u,a:n.a})}}function u(n){return Gu(A2(Mu,n,{$:8,a:n}))}function dr(n){return br(A2(Mu,n,{$:0,a:n}))}function lr(n){switch(Fr(n)){case"account":return A(0);case"id":return A(1);case"type":return A(2);case"amount":return A(3);case"currency":return A(4);case"original amount":return A(5);case"original currency":return A(6);case"date":return A(7);case"account name":return A(8);case"account number":return A(9);case"bank name":return A(10);case"bank number":return A(11);case"bank bic":return A(12);case"constant symbol":return A(13);case"variable symbol":return A(14);case"specific symbol":return A(15);case"reference":return A(16);case"description":return A(17);case"message":return A(18);case"note":return A(19);case"author":return A(20);case"order id":return A(21);case"account name and number":return A(22);case"month":return A(23);case"year":return A(24);case"category":return A(25);case"subcategory":return A(26);case"fulfillment date":return A(27);case"fulfillment month":return A(28);case"fulfillment year":return A(29);case"user note":return A(30);default:return y}}function $r(n){return A2(lt,"\t",A2(et,Qu,n))}function vr(n){return A3(_u,n.dy,n.cG,n.dt)}function gr(n){var n=A2(zu,n,1440)+719468,r=(n<0?n-146096:n)/146097|0,n=n-146097*r,t=(n-(n/1460|0)+(n/36524|0)-(n/146096|0))/365|0,n=n-(365*t+(t/4|0)-(t/100|0)),u=(5*n+2)/153|0,e=u+(u<10?3:-9);return{a9:n-((153*u+2)/5|0)+1,bu:e,b2:t+400*r+(2<e?0:1)}}function hr(n){return A2(be,4,A2(le,$e,n))+("-"+A2(be,2,function(){switch(A2(ie,$e,n)){case 0:return 1;case 1:return 2;case 2:return 3;case 3:return 4;case 4:return 5;case 5:return 6;case 6:return 7;case 7:return 8;case 8:return 9;case 9:return 10;case 10:return 11;default:return 12}}()))+"-"+A2(be,2,A2(re,$e,n))+"T"+A2(be,2,A2(ue,$e,n))+":"+A2(be,2,A2(ce,$e,n))+":"+A2(be,2,A2(de,$e,n))+"."+A2(be,3,A2(ee,$e,n))+"Z"}function pr(n){return A2(w,"value",n)}function e(n){return kr(b([Sr(y),A2(w,"value",A2(s,A,n))]))}function i(t){return A2(Tu,"",function(r){var n;return B(xr(r),t)?(n=function(n){for(var r=0,t=n.charCodeAt(0),u=43==t||45==t?1:0,e=u;e<n.length;++e){var c=n.charCodeAt(e);if(c<48||57<c)return y;r=10*r+c-48}return e==u?y:A(45==t?-r:r)}(r)).$?Gr('Invalid integer: "'+r+'"'):A2(D,cr,a(n.a)):A2(D,function(n){return ir(A2(Ce,r,n))},Nr(A2(Ee,qn,Te)))})}function o(n){return Gr("Invalid day: "+dt(n))}function mr(n){return!(A2(te,4,n)||!A2(te,100,n)&&A2(te,400,n))}function Ar(n){n-=1;return(n/4|0)-(n/100|0)+(n/400|0)}function yr(n){var r=n;return{d:r.d,e:function(n){return A2(E,c,rt(r.e(n)))}}}function f(n){return Pn(A2(iu,y,A3(Ie,A,n,Zn(F3(function(n,r,t){return t.$?r:n(t.a)})))))}function wr(n){return{d:Yt(n),e:function(n){return d},b:0}}function Cr(n){return A3(nt,F2(function(n,r){return A3(eu,n.a,n.b,r)}),nu,n)}function Tr(n){return Zu(n.d)}function Er(n){return n>>>5<<5}function Dr(n){return n.length}function Rr(n){return{$:2,a:n}}function Sr(n){return{$:5,c:n}}function kr(n){return{$:11,g:n}}function Ir(n){return{$:1,a:n}}function Or(n){return n}function xr(n){return n.length}function Ur(r){return function(n){return A3(Du,n,Au,r)}}function Mr(r){return function(n){return A5(Su,r,n.c,n.dy,n.cG,n)}}function Nr(n){return A2(Ou,ku,n)}function a(r){return function(n){return A3(hu,!1,r,n)}}function Gr(n){return r={$:12,a:n},function(n){return A2(gu,!1,A2(yu,n,r))};var r}function Fr(n){return n.toLowerCase()}function jr(n){return encodeURIComponent(n)}function Hr(n){return 0!==n.length&&!/[\sxbo]/.test(n)&&(n=+n)==n?A(n):y}function Wr(n){return{$:4,b:n}}function Br(u){return A2(p,function(n){var r=n.a;return A2(p,function(n){n=A2(qu,Wu,"\n"+A2(lt,"\n",A2(et,$r,n)));return n.$?A2(Kt,"Invalid Config",A2(lt,"\n",A2(et,ur,n.a))):A2(lc,r,n.a)},A2(p,tr,A2(fu,n.b,"A2:E")))},A2(p,function(r){return A2(ct,function(n){return $(r,n)},(t=A2(p,function(r){return A2(ct,function(n){return r},A2(p,function(n){return A2($u,n,v("Config"))},A2(fu,r,"A1")))},A2(du,n=u,"Config")),A2(p,function(n){return n.$?t:m(n.a)},A2(vu,n,"Config"))));var n,t},(r=A2(p,function(r){return A2(ct,function(n){return r},A2(p,function(n){return A2($u,n,v("Data"))},A2(fu,r,"A1")))},A2(du,n=u,"Transactions")),A2(p,function(n){return n.$?r:m(n.a)},A2(vu,n,"Transactions")))));var n,r}function Qr(n){return A3(T,function(n,r){return SpreadsheetApp.getUi().createMenu("Finance v Tabulce").addItem("Update","onUpdateAction").addToUi()},null,Yt(0))}function _r(n){return A2(ct,function(n){return 0},Ln(b([(t=A3(T,function(n,r){return ScriptApp.newTrigger("onOpenTrigger").forSpreadsheet(n).onOpen().create()},r=n,Yt(0)),u=A3(T,function(n,r){return ScriptApp.newTrigger("onDailyTrigger").timeBased().atHour(6).everyDays(1).create()},r,Yt(0)),e=A2(ct,function(n){return 0},Ln(b([t,u]))),A2(p,function(n){return n.b?m(0):e},A3(T,function(n,r){return ScriptApp.getUserTriggers(n)},r,au(A2(s,c,Jt))))),Qr(),Br(n)])));var r,t,u,e}var Jr,Lr,qr,Yr,Kr=1,Vr=0,g=U,Pr=F3(function(n,r,t){for(;;){if(-2===t.$)return r;var u=t.d,e=n,c=A3(n,t.b,t.c,A3(Pr,n,r,t.e));n=e,r=c,t=u}}),Zr=function(n){return A3(Pr,F3(function(n,r,t){return A2(g,$(n,r),t)}),d,n)},zr=2,Xr=function(n){return{$:1,a:n}},h=function(n){return{$:0,a:n}},p=P,m=Y,U=m(0),nt=F3(function(n,r,t){for(;;){if(!t.b)return r;var u=t.b,e=n,c=A2(n,t.a,r);n=e,r=c,t=u}}),rt=function(n){return A3(nt,g,d,n)},tt=F4(function(n,r,t,u){var e,c,i,o;return u.b?(e=u.a,(u=u.b).b?(c=u.a,(u=u.b).b?(i=u.a,(u=u.b).b?(o=u.b,A2(n,e,A2(n,c,A2(n,i,A2(n,u.a,500<t?A3(nt,n,r,rt(o)):A4(tt,n,r,t+1,o)))))):A2(n,e,A2(n,c,A2(n,i,r)))):A2(n,e,A2(n,c,r))):A2(n,e,r)):r}),ut=F3(function(n,r,t){return A4(tt,n,r,0,t)}),et=F2(function(t,n){return A3(ut,F2(function(n,r){return A2(g,t(n),r)}),d,n)}),ct=F2(function(r,n){return A2(p,function(n){return m(r(n))},n)}),it=F3(function(t,n,u){return A2(p,function(r){return A2(p,function(n){return m(A2(t,r,n))},u)},n)}),ot=F2(function(n,r){return{$:3,a:n,b:r}}),ft=F2(function(n,r){return{$:0,a:n,b:r}}),at=F2(function(n,r){return{$:1,a:n,b:r}}),st=function(n){return{$:2,a:n}},A=function(n){return{$:0,a:n}},y={$:1},bt=Un,dt=$n,lt=F2(function(n,r){return A2(bn,n,function(n){for(var r=[];n.b;n=n.b)r.push(n.a);return r}(r))}),$t=F2(function(n,r){return b(A2(sn,n,r))}),vt=F4(function(n,r,t,u){return{$:0,a:n,b:r,c:t,d:u}}),gt=[],ht=un,pt=F2(function(n,r){return on(r)/on(n)}),mt=ht(A2(pt,2,32)),At=A4(vt,0,mt,gt,gt),yt=M,wt=F2(function(n,r){return n(r)}),Ct=en,Tt=F2(function(n,r){return 0<l(n,r)?n:r}),Et=N,Dt=F2(function(n,r){for(;;){var t=A2(Et,32,n),u=t.b,t=A2(g,Kn(t.a),r);if(!u.b)return rt(t);n=u,r=t}}),Rt=F2(function(n,r){for(;;){var t=ht(r/32);if(1===t)return A2(Et,32,n).a;n=A2(Dt,n,d),r=t}}),St=F2(function(n,r){var t,u;return r.k?(u=Ct(A2(pt,32,(t=32*r.k)-1)),n=n?rt(r.o):r.o,n=A2(Rt,n,r.k),A4(vt,Dr(r.n)+t,A2(Tt,5,u*mt),n,r.n)):A4(vt,Dr(r.n),mt,gt,r.n)}),kt=F5(function(n,r,t,u,e){for(;;){if(r<0)return A2(St,!1,{o:u,k:t/32|0,n:e});var c=Yn(A3(yt,32,r,n));r-=32,u=A2(g,c,u)}}),It=F2(function(n,r){var t;return 0<n?A5(kt,r,n-(t=n%32)-32,n,d,A3(yt,t,n-t,r)):At}),Ot=function(n){return!n.$},xt=jn,Ut=F2(function(n,r){var t=A2(p,xt(n),r);return V(function(n){n(Y(z(t)))})}),Un=F3(function(n,r,t){return A2(ct,function(n){return 0},Ln(A2(et,Ut(n),r)))}),Mt=(Fn.Task={b:U,c:Un,d:F3(function(n,r,t){return m(0)}),e:F2(function(n,r){return A2(ct,n,r)}),f:void 0},Yr="Task",function(n){return{$:1,k:Yr,l:n}}),Nt=F3(function(n,r,t){return n(r(t))}),Gt=n,Ft=F2(function(n,r){return Mt(A2(Gt,A2(Nt,A2(Nt,m,n),Xr),A2(p,A2(Nt,A2(Nt,m,n),h),r)))}),jt=F3(function(n,r,t){return r(n(t))}),s=Cn,Ht=F3(function(n,r,t){return{$:1,a:n,b:r,c:t}}),Wt=Rn,w=An,Bt=gn,C=mn,Qt=F2(function(n,r){return r.$?n:r.a}),_t=K,T=F3(function(f,n,r){var a,s=Vn;return A2(p,function(n){n=A2(Wt,r,n);return n.$?_t(Rr(n.a)):m(n.a)},(a=n,V(function(r){var t=!1,u=void 0;function n(n){u=n}function e(n){try{return{$:0,a:n()}}catch(n){return{$:1,a:n}}}function c(n){!1===t&&r(Y(n))}function i(n){!1===t&&r(K(s(n)))}var o=e(function(){return f(a,n)});return 0===o.$?"undefined"!=typeof Promise&&o.a instanceof Promise?o.a.then(c).catch(i):c(o.a):i(o.a),function(){var n;u&&1===(n=e(u)).$&&i(n.a),t=!0}})))}),Jt=pn,Lt=A3(T,function(n,r){return SpreadsheetApp.getActiveSpreadsheet()},null,kr(b([Sr(y),A2(s,A2(jt,c,A),Jt)]))),E=F2(function(n,r){return A3(nt,Nn(n),[],r)}),qt=Mn,Yt=function(n){return{$:0,a:n}},Kt=F2(function(n,r){return A3(T,function(n,r){return SpreadsheetApp.getUi().alert(n[0],n[1],SpreadsheetApp.getUi().ButtonSet.OK)},A2(E,qt,b([n,r])),Yt(0))}),Vt=r,Pt=_,Zt=F2(function(n,r){for(;;){if(-2===r.$)return y;var t=r.c,u=r.d,e=r.e;switch(A2(Pt,n,r.b)){case 0:r=u;continue;case 1:return A(t);default:r=e;continue}}}),zt=yn,Xt={$:-2},nu=Xt,ru=F5(function(n,r,t,u,e){return{$:-1,a:n,b:r,c:t,d:u,e:e}}),tu=F5(function(n,r,t,u,e){var c,i,o,f;return-1!==e.$||e.a?-1!==u.$||u.a||-1!==u.d.$||u.d.a?A5(ru,n,r,t,u,e):(f=u.e,A5(ru,0,u.b,u.c,A5(ru,1,(c=u.d).b,c.c,c.d,c.e),A5(ru,1,r,t,f,e))):(c=e.b,i=e.c,o=e.d,e=e.e,-1!==u.$||u.a?A5(ru,n,c,i,A5(ru,0,r,t,u,o),e):A5(ru,0,r,t,A5(ru,1,u.b,u.c,u.d,f=u.e),A5(ru,1,c,i,o,e)))}),uu=F3(function(n,r,t){if(-2===t.$)return A5(ru,0,n,r,Xt,Xt);var u=t.a,e=t.b,c=t.c,i=t.d,o=t.e;switch(A2(Pt,n,e)){case 0:return A5(tu,u,e,c,A3(uu,n,r,i),o);case 1:return A5(ru,u,e,r,i,o);default:return A5(tu,u,e,c,i,A3(uu,n,r,o))}}),eu=F3(function(n,r,t){n=A3(uu,n,r,t);return-1!==n.$||n.a?n:A5(ru,1,n.b,n.c,n.d,n.e)}),cu=Mn,iu=F2(function(n,r){var t=A2(E,c,b([cu(r.b)])),n=Yt(n);return{d:A3(eu,r.b,n,r.d),e:r.e(t),b:r.b+1}}),un=F2(function(r,t){return{d:A2(Vt,function(n){return B(n,r)?A2(zt,1,t.d):Ir("Unknown version.")},A2(zt,0,C)),e:function(n){return A2(E,c,b([qt(r),A2(zn,t,n)]))}}}),ou=A2(un,"v1",Pn(A2(iu,3,A2(iu,2,A2(iu,1,A2(iu,0,Zn(F5(function(n,r,t,u,e){switch(e){case 0:return n;case 1:return r;case 2:return t;default:return u}})))))))),fu=F2(function(n,r){return A3(T,function(n,r){return n[0].getRange(n[1])},A2(E,c,b([n,qt(r)])),A2(s,c,Jt))}),au=function(n){return{$:3,b:n}},M=hn,su=c,en=vn(function(n){return n instanceof Date?h(su(n.valueOf())):__Json_expecting("a Date",n)}),bu=kr(b([A2(s,v,C),A2(s,rr,Bt),A2(s,nr,M),A2(s,Xn,en)])),du=F2(function(n,r){return A3(T,function(n,r){return n[0].insertSheet(n[1])},A2(E,c,b([n,qt(r)])),A2(s,c,Jt))}),lu=Mn,$u=F2(function(n,r){return A3(T,function(n,r){return n[0].setValue(n[1])},A2(E,c,b([n,er(r)])),Yt(0))}),vu=F2(function(n,r){return A3(T,function(n,r){return n[0].getSheetByName(n[1])},A2(E,c,b([n,qt(r)])),kr(b([Sr(y),A2(s,A2(jt,c,A),Jt)])))}),gu=F2(function(n,r){return{$:1,a:n,b:r}}),hu=F3(function(n,r,t){return{$:0,a:n,b:r,c:t}}),pu=F2(function(n,r){return{$:1,a:n,b:r}}),mu=F4(function(n,r,t,u){return{cG:r,cL:u,dt:t,dy:n}}),Au={$:0},yu=F2(function(n,r){return A2(pu,Au,A4(mu,n.dy,n.cG,r,n.g))}),wu=(Jr={$:10},F4(function(n,r,t,u){for(;;){var e=t(r)(u);if(e.$)return c=e.a,A2(gu,n||c,e.b);var c=e.a,i=e.b,e=e.c;if(i.$)return A3(hu,n||c,i.a,e);n=n||c,r=i.a,u=e}})),Cu=F2(function(r,t){return function(n){return A4(wu,!1,r,t,n)}}),D=F2(function(t,n){var u=n;return function(n){var r,n=u(n);return n.$?A2(gu,n.a,n.b):(r=n.c,A3(hu,n.a,t(n.b),r))}}),Tu=F2(function(n,r){return A2(Cu,n,function(n){return A2(D,fr,r(n))})}),Eu=F2(function(n,r){return{$:2,a:n,b:r}}),Du=F3(function(n,r,t){for(;;){if(!t.b)return A2(gu,!1,r);var u=t.a,e=t.b,u=u(n);if(!u.$)return u;if((u=u).a)return u;r=A2(Eu,r,u.b),t=e}}),R=F2(function(e,n){var c=n;return function(n){var r,t,u,n=c(n);return 1===n.$?A2(gu,n.a,n.b):(r=n.a,t=n.c,1===(n=e(n.b)(t)).$?(u=n.a,A2(gu,r||u,n.b)):(u=n.a,A3(hu,r||u,n.b,n.c)))}}),Ru=t,Su=F5(function(n,r,t,u,e){for(;;){var c=A3(Ru,n,r,e.a);if(B(c,-1))return A3(hu,l(e.c,r)<0,0,{cG:u,g:e.g,h:e.h,c:r,dy:t,a:e.a});u=B(c,-2)?(r+=1,t+=1,1):(r=c,u+1)}}),ku=F2(function(n,r){return n}),Iu=dn,Ou=F2(function(u,n){var e=n;return function(n){var r,t=e(n);return 1===t.$?A2(gu,t.a,t.b):(r=t.b,A3(hu,t.a,A2(u,A3(Iu,n.c,(t=t.c).c,n.a),r),t))}}),xu=Nr(Mr(function(n){return"\t"!==n&&"\n"!==n})),Uu=F2(function(n,r){return{$:0,a:n,b:r}}),N=F2(function(n,r){return A2(Uu,n,r)}),Mu=F2(function(n,r){return{$:0,a:n,b:r}}),Nu=Jn,Gu=br,Fu=A2(R,function(r){return A2(D,function(n){return r},dr("\t"))},A2(R,function(r){return A2(D,function(n){return r(n)},xu)},A2(R,function(r){return A2(D,function(n){return r},dr("\t"))},A2(R,function(r){return A2(D,function(n){return r(n)},xu)},A2(R,function(r){return A2(D,function(n){return r},dr("\t"))},A2(R,function(r){return A2(D,function(n){return r},u("fio"))},a(N))))))),jn=F4(function(n,r,t,u){return{cA:n,cH:t,cJ:u,dQ:r}}),ju=(Lr=A2(R,function(n){var r=lr(n);return r.$?Gr("Unknown column "+n+"."):a(r.a)},xu),A2(R,function(r){return A2(D,function(n){return r(n)},xu)},A2(R,function(r){return A2(D,function(n){return r},dr("\t"))},A2(R,function(r){return A2(D,function(n){return r(n)},Lr)},A2(R,function(r){return A2(D,function(n){return r},dr("\t"))},A2(R,function(r){return A2(D,function(n){return r(n)},xu)},A2(R,function(r){return A2(D,function(n){return r},dr("\t"))},A2(R,function(r){return A2(D,function(n){return r(n)},xu)},a(jn))))))))),Hu=A2(R,function(n){switch(Fr(n)){case"account":return A2(D,ar,A2(R,function(n){return Fu},dr("\t")));case"rule":return A2(D,sr,A2(R,function(n){return ju},dr("\t")));default:return Gr("Unknown config "+n+".")}},xu),Wu=A2(Tu,d,function(r){return Ur(b([A2(D,function(n){return cr(rt(r))},or),A2(D,function(n){return ir(r)},u("\n")),A2(D,function(n){return ir(r)},u("\t\t\t\t")),A2(D,function(n){return ir(A2(g,n,r))},Hu)]))}),Bu=$n,Qu=function(n){switch(n.$){case 0:return n.a;case 1:return dt(n.a);case 2:return Bu(n.a);default:return dt(n.a)}},_u=F3(function(n,r,t){return{cG:r,dt:t,dy:n}}),Ju=F2(function(n,r){for(;;)switch(n.$){case 0:return r;case 1:var t=n.a,u=n.b;n=t,r=A2(g,u,r);continue;default:t=n.a,u=n.b;n=t,r=A2(Ju,u,r);continue}}),Lu=F2(function(n,r){n=n({cG:1,g:d,h:1,c:0,dy:1,a:r});return n.$?Xr(A2(Ju,n.b,d)):h(n.b)}),qu=F2(function(n,r){n=A2(Lu,n,r);return n.$?Xr(A2(et,vr,n.a)):h(n.a)}),Yu=F3(function(n,r,t){n=n(r);return n.$?t:A2(g,n.a,t)}),Ku=F2(function(n,r){return A3(ut,Yu(n),d,r)}),Vu=F2(function(n,r){return r.b?A3(ut,g,r,n):n}),Pu=F2(function(n,r){return{aC:n,i:r}}),Zu=Dn,zu=F2(function(n,r){return Ct(n/r)}),Xu=F3(function(n,r,t){for(;;){if(!t.b)return r+n;var u=t.a,e=t.b;if(l(u.aU,r)<0)return r+u.c;t=e}}),ne=F2(function(n,r){var t=n.b;return A3(Xu,n.a,A2(zu,r,6e4),t)}),re=F2(function(n,r){return gr(A2(ne,n,r)).a9}),te=tn,ue=F2(function(n,r){return A2(te,24,A2(zu,A2(ne,n,r),60))}),ee=F2(function(n,r){return A2(te,1e3,r)}),ce=F2(function(n,r){return A2(te,60,A2(ne,n,r))}),ie=F2(function(n,r){switch(gr(A2(ne,n,r)).bu){case 1:return 0;case 2:return 1;case 3:return 2;case 4:return 3;case 5:return 4;case 6:return 5;case 7:return 6;case 8:return 7;case 9:return 8;case 10:return 9;case 11:return 10;default:return 11}}),oe=fn,fe=F3(function(n,r,t){return 0<n?A3(fe,n>>1,q(r,r),1&n?q(t,r):t):t}),ae=F2(function(n,r){return A3(fe,n,r,"")}),se=F3(function(n,r,t){return q(A2(ae,n-xr(t),A2(oe,r,"")),t)}),be=F2(function(n,r){return A3(se,n,"0",dt(r))}),de=F2(function(n,r){return A2(te,60,A2(zu,r,1e3))}),le=F2(function(n,r){return gr(A2(ne,n,r)).b2}),$e=A2(F2(function(n,r){return{$:0,a:n,b:r}}),0,d),ve=F2(function(n,r){return n<1?"":A3(Iu,0,n,r)}),ge=F2(function(n,r){return su(r-24*n*60*60*1e3)}),U=F2(function(n,r){return{b4:n,d8:r}}),Un=A8(En,F7(function(n,r,t,u,e,c,i){return{a3:r,cp:e,cF:i,a8:t,c0:u,di:n,dp:c}}),A2(w,"accountId",C),A2(w,"bankId",C),A2(w,"currency",C),A2(w,"iban",C),A2(w,"bic",C),A2(w,"openingBalance",M),A2(w,"closingBalance",M)),he=Tn,n=F2(function(n,r){return A3(he,F2(function(n,r){return n(r)}),r,n)}),Cn=A2(Vt,function(n){var r,n=A2($t," ",n);return n.b&&n.b.b&&!n.b.b.b?(r=n.b.a,(n=Hr(n.a)).$?Ir("Cannot decode original amount."):Yt({a2:n.a,a8:r})):Ir("Cannot decode original amount.")},C),pe=cn,me=A2(R,function(n){var r;return 9<xr(n)?Gr("Expected at most 9 digits, but got "+dt(xr(n))):(r=Hr("0."+n)).$?Gr('Invalid float: "'+n+'"'):a(pe(1e3*r.a))},Nr(Mr(qn))),Ae=F6(function(n,r,t,u,e,c){return su(n+60*r*60*1e3+60*(t-c)*1e3+1e3*u+e)}),ye=F3(function(c,n,r){var i=n,o=r;return function(n){var r,t,u,e,n=i(n);return 1===n.$?A2(gu,n.a,n.b):(r=n.a,t=n.b,1===(n=o(n.c)).$?(u=n.a,A2(gu,r||u,n.b)):(u=n.a,e=n.c,A3(hu,r||u,A2(c,t,n.b),e)))}}),we=F2(function(n,r){return A3(ye,ku,n,r)}),S=F2(function(n,r){return A3(ye,wt,n,r)}),Ce=an,Te={$:11},Ee=F2(function(t,u){return function(n){var r=A3(Ru,t,n.c,n.a);return B(r,-1)?A2(gu,!1,A2(yu,n,u)):B(r,-2)?A3(hu,!0,0,{cG:1,g:n.g,h:n.h,c:n.c+1,dy:n.dy+1,a:n.a}):A3(hu,!0,0,{cG:n.cG+1,g:n.g,h:n.h,c:r,dy:n.dy,a:n.a})}}),An=A2(R,function(n){var u=n.a,e=n.b,c=n.c;if(c<0)return o(c);function r(n){var r=31536e6*(u-1970),t=864e5*((e<3||!mr(u)?c-1:c)+(Ar(u)-Ar(1970)));return a(n+r+t)}switch(e){case 1:return 31<c?o(c):r(0);case 2:return 29<c||29===c&&!mr(u)?o(c):r(26784e5);case 3:return 31<c?o(c):r(50976e5);case 4:return 30<c?o(c):r(7776e6);case 5:return 31<c?o(c):r(10368e6);case 6:return 30<c?o(c):r(130464e5);case 7:return 31<c?o(c):r(156384e5);case 8:return 31<c?o(c):r(183168e5);case 9:return 30<c?o(c):r(209952e5);case 10:return 31<c?o(c):r(235872e5);case 11:return 30<c?o(c):r(262656e5);case 12:return 31<c?o(c):r(288576e5);default:return Gr('Invalid month: "'+dt(e)+'"')}},A2(S,A2(S,A2(S,a(F3(J)),i(4)),Ur(b([A2(S,A2(we,a(c),u("-")),i(2)),i(2)]))),Ur(b([A2(S,A2(we,a(c),u("-")),i(2)),i(2)])))),De=(gn=F3(function(n,r,t){return n*(60*r)+t}),A2(S,a(c),Ur(b([A2(D,function(n){return 0},u("Z")),A2(S,A2(S,A2(S,a(gn),Ur(b([A2(D,function(n){return 1},u("+")),A2(D,function(n){return-1},u("-"))]))),i(2)),Ur(b([A2(S,A2(we,a(c),u(":")),i(2)),i(2),a(0)]))),A2(we,a(0),or)])))),Re=A2(R,function(n){return Ur(b([A2(S,A2(S,A2(S,A2(S,A2(S,A2(we,a(Ae(n)),u("T")),i(2)),Ur(b([A2(S,A2(we,a(c),u(":")),i(2)),i(2)]))),Ur(b([A2(S,A2(we,a(c),u(":")),i(2)),i(2),a(0)]))),Ur(b([A2(S,A2(we,a(c),u(".")),me),a(0)]))),A2(we,De,or)),A2(we,a(A6(Ae,n,0,0,0,0,0)),or)]))},An),mn=A2(Vt,function(n){n=A2(qu,Re,A2(ve,10,n)+"T12:00:00.000Z");return n.$?Ir("Cannot decode date."):Yt(n.a)},C),pn=A2(n,A2(w,"column17",e(Bt)),A2(n,A2(w,"column9",e(C)),A2(n,A2(w,"column25",e(C)),A2(n,A2(w,"column16",e(C)),A2(n,A2(w,"column7",e(C)),A2(n,A2(w,"column27",e(C)),A2(n,A2(w,"column6",e(C)),A2(n,A2(w,"column5",e(C)),A2(n,A2(w,"column4",e(C)),A2(n,A2(w,"column26",e(C)),A2(n,A2(w,"column3",e(C)),A2(n,A2(w,"column12",e(C)),A2(n,A2(w,"column2",e(C)),A2(n,A2(w,"column10",e(C)),A2(n,A2(w,"column0",pr(mn)),A2(n,A2(w,"column18",e(Cn)),A2(n,A2(w,"column14",pr(C)),A2(n,A2(w,"column1",pr(M)),A2(n,A2(w,"column8",pr(C)),A2(n,A2(w,"column22",pr(Bt)),Yt(function(m){return function(p){return function(h){return function(g){return function(v){return function($){return function(l){return function(d){return function(b){return function(s){return function(a){return function(f){return function(o){return function(i){return function(c){return function(e){return function(u){return function(t){return function(r){return function(n){return{aC:l,a_:d,a2:h,ci:r,ck:a,cl:b,a3:s,cI:f,a8:g,cO:$,cQ:e,c1:m,df:u,bw:t,dq:n,bA:v,du:c,dK:i,ea:p,ee:o}}}}}}}}}}}}}}}}}}}}}))))))))))))))))))))),Se=A2(w,"accountStatement",A3(he,U,A2(w,"info",Un),A2(w,"transactionList",A2(w,"transaction",au(pn))))),ke=F2(function(n,r){n="https://www.fio.cz/ib_api/rest/periods/"+jr(r.b)+"/"+jr(A2(ve,10,hr(A2(ge,30,n))))+"/"+jr(A2(ve,10,hr(n)))+"/transactions.json";return A2(Gt,function(n){return A2(ct,function(n){return d},A2(Kt,"Update Transactions Failed","Cannot connect to Fio bank."))},A2(p,function(n){n=A2(Zu,Se,n);return n.$?_t(Rr(n.a)):m(A2(et,function(n){return A2(Pu,r.a,n)},n.a.d8))},A3(T,function(n,r){return UrlFetchApp.fetch(n).getContentText()},qt(n),C)))}),r=F3(function(r,t,n){var u=n;return{d:A3(he,F2(function(n,r){return n(r)}),u.d,A2(zt,u.b,t.d)),e:function(n){return A2(g,A2(zn,t,r(n)),u.e(n))},b:u.b+1}}),_=F2(function(n,r){return{d:r,e:n}}),yn=A2(_,lu,M),hn=A2(_,cu,Bt),Ie=F3(function(n,r,t){var u=t,t=A2(s,n,A2(zt,1,r.d));return{d:A3(eu,u.b,t,u.d),e:u.e(function(n){return A2(E,c,b([cu(u.b),A2(zn,r,n)]))}),b:u.b+1}}),en=A3(F3(function(r,n,t){return{d:A2(s,n,t.d),e:function(n){return A2(zn,t,r(n))}}}),Or,su,hn),t=A2(_,qt,C),Oe=A2(un,"FioCzTransaction1",yr(A3(r,function(n){return n.i},yr(A3(r,function(n){return n.dq},f(hn),A3(r,function(n){return n.ci},f(t),A3(r,function(n){return n.bw},f(t),A3(r,function(n){return n.df},f(t),A3(r,function(n){return n.cQ},f(t),A3(r,function(n){return n.du},f(t),A3(r,function(n){return n.dK},f(t),A3(r,function(n){return n.ee},f(t),A3(r,function(n){return n.cI},f(t),A3(r,function(n){return n.ck},f(t),A3(r,function(n){return n.a3},f(t),A3(r,function(n){return n.cl},f(t),A3(r,function(n){return n.a_},f(t),A3(r,function(n){return n.aC},f(t),A3(r,function(n){return n.cO},en,A3(r,function(n){return n.bA},f(yr(A3(r,function(n){return n.a8},t,A3(r,function(n){return n.a2},yn,wr(F2(function(n,r){return{a2:n,a8:r}})))))),A3(r,function(n){return n.a8},t,A3(r,function(n){return n.a2},yn,A3(r,function(n){return n.ea},t,A3(r,function(n){return n.c1},hn,wr(function(m){return function(p){return function(h){return function(g){return function(v){return function($){return function(l){return function(d){return function(b){return function(s){return function(a){return function(f){return function(o){return function(i){return function(c){return function(e){return function(u){return function(t){return function(r){return function(n){return{aC:l,a_:d,a2:h,ci:r,ck:a,cl:b,a3:s,cI:f,a8:g,cO:$,cQ:e,c1:m,df:u,bw:t,dq:n,bA:v,du:c,dK:i,ea:p,ee:o}}}}}}}}}}}}}}}}}}}}})))))))))))))))))))))),A3(r,function(n){return n.aC},t,wr(F2(function(n,r){return{aC:n,i:r}})))))),xe=F3(function(n,r,t){for(;;){if(-2===t.$)return r;var u=t.e,e=n,c=A3(n,t.b,t.c,A3(xe,n,r,t.d));n=e,r=c,t=u}}),Ue=F6(function(f,a,s,n,r,t){n=A3(xe,F3(function(n,r,t){for(;;){var u=t.a,e=t.b;if(!u.b)return $(u,A3(s,n,r,e));var c=u.a,i=c.a,c=c.b,o=u.b;if(0<=l(i,n))return 0<l(i,n)?$(u,A3(s,n,r,e)):$(o,A4(a,i,c,r,e));t=$(o,A3(f,i,c,e))}}),$(Zr(n),t),r),t=n.a,r=n.b;return A3(nt,F2(function(n,r){return A3(f,n.a,n.b,r)}),r,t)}),Me=F2(function(n,r){return A6(Ue,F3(function(n,r,t){return A2(g,r,t)}),F4(function(n,r,t,u){return u}),F3(function(n,r,t){return t}),Cr(A2(et,function(n){return $(n.i.c1,n)},n)),Cr(A2(et,function(n){return $(n.i.c1,n)},r)),d)}),Ne=F2(function(n,r){return A2(jt,r.e,bt(n))}),Ge=F3(function(n,r,t){return A3(T,function(n,r){return n[0].insertRowsAfter(n[1],n[2])},A2(E,c,b([n,cu(r),cu(t)])),Yt(0))}),Fe=F3(function(n,r,t){return 1===r.$?Xr(r.a):(r=r.a,1===t.$?Xr(t.a):h(A2(n,r,t.a)))}),je=F2(function(n,r){return A3(T,function(n,r){return n[0].setValues(n[1])},A2(E,c,b([n,A2(E,E(er),r)])),Yt(0))}),He=F2(function(u,e){function r(n){n=$r(n);return""===n?y:A(n)}return A2(p,function(n){var r,t;return n.$?A2(Kt,"Update Transactions Failed","Cannot decode transactions."):(n=r=A2(Me,e,n.a),(t=A3(nt,F2(function(n,r){return r+1}),0,n))?A2(p,function(n){return A2(je,n,A2(et,function(n){return b([v(A3(Ne,0,Oe,n))])},r))},A2(p,function(n){return A2(fu,u,"A2:A"+dt(t+1))},A3(Ge,u,1,t))):m(0))},A2(ct,function(n){return n=A2(et,Tr(Oe),A2(Ku,r,n)),A3(ut,Fe(g),h(d),n)},A2(p,tr,A2(fu,u,"A2:A"))))}),We=(qr=su,V(function(n){n(Y(qr(Date.now())))})),Be=F2(function(r,t){return A2(p,function(n){return A2(He,r,A3(ut,Vu,d,n))},A2(p,function(n){return Ln(A2(et,ke(n),t))},We))}),Qe=j,_e=F3(function(t,n,r){var u=r.c,r=r.d,e=F2(function(n,r){return A3(Qe,n.$?t:e,r,n.a)});return A3(Qe,t,A3(Qe,e,n,u),r)}),Je=F2(function(n,r){return A3(_e,Nn(n),[],r)}),Le=F2(function(n,r){return A3(T,function(n,r){return n[0].setValues(n[1])},A2(E,c,b([n,A2(Je,Je(er),r)])),Yt(0))}),qe=F4(function(n,r,t,u){return{cA:n,cW:t,bw:u,dQ:r}}),Ye=F2(function(n,r){return r.$?y:n(r.a)}),Ke=F2(function(n,r){for(;;){if(!r.b)return y;var t=r.a,u=r.b;if(n(t))return A(t);r=u}}),Ve=ln,Pe=F3(function(n,r,t){return 1===r.$||1===t.$?y:A(A2(n,r.a,t.a))}),k=F2(function(n,r){return r.$?n:r.a}),Ze=F3(function(n,r,t){switch(n){case 0:return v(t.aC);case 1:return rr(t.i.c1);case 2:return v(t.i.ea);case 3:return nr(t.i.a2);case 4:return v(t.i.a8);case 5:var u=t.i.bA;return u.$?v(""):nr(u.a.a2);case 6:u=t.i.bA;return v(u.$?"":u.a.a8);case 7:return Xn(t.i.cO);case 8:return v(A2(k,"",t.i.aC));case 9:return v(A2(k,"",t.i.a_));case 10:return v(A2(k,"",t.i.cl));case 11:return v(A2(k,"",t.i.a3));case 12:return v(A2(k,"",t.i.ck));case 13:return v(A2(k,"",t.i.cI));case 14:return v(A2(k,"",t.i.ee));case 15:return v(A2(k,"",t.i.dK));case 16:return v(A2(k,"",t.i.du));case 17:return v(A2(k,"",t.i.cQ));case 18:return v(A2(k,"",t.i.df));case 19:return v(A2(k,"",t.i.bw));case 20:return v(A2(k,"",t.i.ci));case 21:u=t.i.dq;return u.$?v(""):rr(u.a);case 22:return v(A2(lt," ",A2(Ku,c,b([t.i.aC,A3(Pe,F2(function(n,r){return n+"/"+r}),t.i.a_,t.i.a3)]))).trim());case 23:return v('=DATE(YEAR(INDIRECT(ADDRESS(ROW(); MATCH("Date"; $1:$1; 0)))); MONTH(INDIRECT(ADDRESS(ROW(); MATCH("Date"; $1:$1; 0)))); 1)');case 24:return v('=DATE(YEAR(INDIRECT(ADDRESS(ROW(); MATCH("Date"; $1:$1; 0)))); 1; 1)');case 25:return r.cA;case 26:return r.dQ;case 27:return r.cW;case 28:return v('=DATE(YEAR(INDIRECT(ADDRESS(ROW(); MATCH("Fulfillment Date"; $1:$1; 0)))); MONTH(INDIRECT(ADDRESS(ROW(); MATCH("Fulfillment Date"; $1:$1; 0)))); 1)');case 29:return v('=DATE(YEAR(INDIRECT(ADDRESS(ROW(); MATCH("Fulfillment Date"; $1:$1; 0)))); 1; 1)');default:return r.bw}}),ze=F3(function(n,r,t){return A2(Ve,Fr(t.cJ),Fr(Qu(A3(Ze,t.cH,r,n))))}),Xe=F3(function(n,r,t){r=A2(Ke,A2(ze,r,t),n);return r.$?t:L(t,{cA:v((n=r.a).cA),dQ:v(n.dQ)})}),nc=4294967295>>>32-mt,rc=G,tc=F3(function(n,r,t){for(;;){var u=A2(rc,nc&r>>>n,t);if(u.$)return A2(rc,nc&r,u.a);n-=mt,t=u.a}}),uc=F2(function(n,r){var t=r.a,u=r.b,e=r.c,r=r.d;return n<0||-1<l(n,t)?y:-1<l(n,Er(t))?A(A2(rc,nc&n,r)):A(A3(tc,u,n,e))}),ec=F2(function(n,r){return r.$?y:A(n(r.a))}),cc=F2(function(n,r){for(;;){if(!r.b)return y;var t=r.b,u=n(r.a);if(!u.$)return A(u.a);r=t}}),ic=H,oc=F2(function(u,n){var r=n.c,n={o:d,k:0,n:A3(ic,u,Er(n.a),n.d)},e=F2(function(n,r){var t;return n.$?(t=Yn(A3(ic,u,32*r.k,n.a)),{o:A2(g,t,r.o),k:r.k+1,n:r.n}):A3(Qe,e,r,n.a)});return A2(St,!0,A3(Qe,e,n,r))}),fc=F,ac=F4(function(n,r,t,u){var e=nc&r>>>n,c=A2(rc,e,u);return A3(fc,e,c.$?Yn(A3(fc,nc&r,t,c.a)):Kn(A4(ac,n-mt,r,t,c.a)),u)}),sc=F3(function(n,r,t){var u=t.a,e=t.b,c=t.c,i=t.d;return n<0||-1<l(n,u)?t:-1<l(n,Er(u))?A4(vt,u,e,c,A3(fc,nc&n,r,i)):A4(vt,u,e,A4(ac,e,n,r,c),i)}),bc=F2(function(i,n){function r(t){return A2(cc,function(n){var r=n.a;return B(n.b,t)?A(r):y},o)}var o=A2(k,d,A2(ec,function(n){return rt(A3(_e,F2(function(n,r){var t=r.a,r=r.b;return $((n=lr(Qu(n))).$?t:A2(g,$(r,n.a),t),r+1)}),$(d,0),n).a)},A2(uc,0,n))),f=r(27),a=r(26),s=r(30),b=r(25);return A2(oc,F2(function(n,r){return n?(n=A2(Ye,function(n){return(n=A2(Tr,Oe,Qu(n))).$?y:A(n.a)},A2(uc,0,t=r))).$?t:(u=n.a,n=(n=(c=(c=(n=A4(qe,A2(k,v(""),A2(Ye,function(n){return A2(uc,n,t)},b)),A2(k,v(""),A2(Ye,function(n){return A2(uc,n,t)},a)),A2(k,v(""),A2(Ye,function(n){return A2(uc,n,t)},f)),A2(k,v(""),A2(Ye,function(n){return A2(uc,n,t)},s)))).cA).$||""!==c.a?n:A3(Xe,i,u,n)).cW).$||""!==n.a?c:L(c,{cW:Xn(u.i.cO)}),e=(c=n.bw).$||""!==c.a?n:L(n,{bw:v(A2(k,"",u.i.bw))}),A3(nt,F2(function(n,r){return A3(sc,n.a,A3(Ze,n.b,e,u),r)}),t,o)):r;var t,u,e,c}),n)}),dc=F2(function(n,t){return A2(p,function(r){return A2(p,function(n){return A2(Le,r,A2(bc,t,n))},A3(T,function(n,r){return n.getValues()},r,Wr(Wr(bu))))},A3(T,function(n,r){return n.getRange(1,1,n.getMaxRows(),n.getMaxColumns())},n,A2(s,c,Jt)))}),lc=F2(function(n,r){return A2(ct,function(n){return 0},Ln(b([A2(Be,n,A2(Ku,function(n){return n.$?y:A(n.a)},r)),A2(dc,n,A2(Ku,function(n){return 1===n.$?A(n.a):y},r))])))}),$c=Br,vc=Hn(d),gc=Hn(d),dn={Main:{init:Gn({c5:function(n){return $(0,A2(Ft,function(n){return 0},(n=n,n=(n=A2(Wt,A2(w,"action",ou.d),n)).$?_t(Rr(t=n.a)):(t=n.a,A2(p,function(n){if(n.$)return m(0);var r=n.a;switch(t){case 0:return _r(r);case 1:return Br(r);case 2:return Qr();default:return $c(r)}},Lt)),A2(Gt,function(n){return A2(Gt,function(n){return m(0)},A2(Kt,"Application is Broken","Sorry for that."))},n))));var t},dR:function(n){return gc},ec:F2(function(n,r){return $(r,vc)})})(Jt)(0)}};I.Elm?function n(r,t){for(var u in t)u in r?"init"==u?W(6):n(r[u],t[u]):r[u]=t[u]}(I.Elm,dn):I.Elm=dn}(this);