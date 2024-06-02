import{G as b,a5 as A,C as $,F as k,E as S}from"./BcdyVEUj.js";let P=Symbol("headlessui.useid"),C=0;function F(){return b(P,()=>`${++C}`)()}function L(e){var t;if(e==null||e.value==null)return null;let o=(t=e.value.$el)!=null?t:e.value;return o instanceof Node?o:null}function w(e,t,...o){if(e in t){let n=t[e];return typeof n=="function"?n(...o):n}let r=new Error(`Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(t).map(n=>`"${n}"`).join(", ")}.`);throw Error.captureStackTrace&&Error.captureStackTrace(r,w),r}var T=(e=>(e[e.None=0]="None",e[e.RenderStrategy=1]="RenderStrategy",e[e.Static=2]="Static",e))(T||{}),D=(e=>(e[e.Unmount=0]="Unmount",e[e.Hidden=1]="Hidden",e))(D||{});function W({visible:e=!0,features:t=0,ourProps:o,theirProps:r,...n}){var s;let i=O(r,o),u=Object.assign(n,{props:i});if(e||t&2&&i.static)return y(u);if(t&1){let f=(s=i.unmount)==null||s?0:1;return w(f,{0(){return null},1(){return y({...n,props:{...i,hidden:!0,style:{display:"none"}}})}})}return y(u)}function y({props:e,attrs:t,slots:o,slot:r,name:n}){var s,i;let{as:u,...f}=U(e,["unmount","static"]),l=(s=o.default)==null?void 0:s.call(o,r),g={};if(r){let c=!1,h=[];for(let[d,p]of Object.entries(r))typeof p=="boolean"&&(c=!0),p===!0&&h.push(d);c&&(g["data-headlessui-state"]=h.join(" "))}if(u==="template"){if(l=j(l??[]),Object.keys(f).length>0||Object.keys(t).length>0){let[c,...h]=l??[];if(!H(c)||h.length>0)throw new Error(['Passing props on "template"!',"",`The current component <${n} /> is rendering a "template".`,"However we need to passthrough the following props:",Object.keys(f).concat(Object.keys(t)).map(a=>a.trim()).filter((a,m,E)=>E.indexOf(a)===m).sort((a,m)=>a.localeCompare(m)).map(a=>`  - ${a}`).join(`
`),"","You can apply a few solutions:",['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".',"Render a single element as the child so that we can forward the props onto that element."].map(a=>`  - ${a}`).join(`
`)].join(`
`));let d=O((i=c.props)!=null?i:{},f,g),p=A(c,d,!0);for(let a in d)a.startsWith("on")&&(p.props||(p.props={}),p.props[a]=d[a]);return p}return Array.isArray(l)&&l.length===1?l[0]:l}return $(u,Object.assign({},f,g),{default:()=>l})}function j(e){return e.flatMap(t=>t.type===k?j(t.children):[t])}function O(...e){if(e.length===0)return{};if(e.length===1)return e[0];let t={},o={};for(let r of e)for(let n in r)n.startsWith("on")&&typeof r[n]=="function"?(o[n]!=null||(o[n]=[]),o[n].push(r[n])):t[n]=r[n];if(t.disabled||t["aria-disabled"])return Object.assign(t,Object.fromEntries(Object.keys(o).map(r=>[r,void 0])));for(let r in o)Object.assign(t,{[r](n,...s){let i=o[r];for(let u of i){if(n instanceof Event&&n.defaultPrevented)return;u(n,...s)}}});return t}function U(e,t=[]){let o=Object.assign({},e);for(let r of t)r in o&&delete o[r];return o}function H(e){return e==null?!1:typeof e.type=="string"||typeof e.type=="object"||typeof e.type=="function"}let v=Symbol("Context");var N=(e=>(e[e.Open=1]="Open",e[e.Closed=2]="Closed",e[e.Closing=4]="Closing",e[e.Opening=8]="Opening",e))(N||{});function G(){return R()!==null}function R(){return b(v,null)}function I(e){S(v,e)}var x=(e=>(e.Space=" ",e.Enter="Enter",e.Escape="Escape",e.Backspace="Backspace",e.Delete="Delete",e.ArrowLeft="ArrowLeft",e.ArrowUp="ArrowUp",e.ArrowRight="ArrowRight",e.ArrowDown="ArrowDown",e.Home="Home",e.End="End",e.PageUp="PageUp",e.PageDown="PageDown",e.Tab="Tab",e))(x||{});export{W as A,F as I,T as N,D as S,U as T,x as a,N as i,R as l,L as o,G as s,I as t,w as u};