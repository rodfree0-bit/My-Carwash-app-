const Ip=()=>{};var Bu={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dh=function(r){const t=[];let e=0;for(let n=0;n<r.length;n++){let s=r.charCodeAt(n);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(s=65536+((s&1023)<<10)+(r.charCodeAt(++n)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},Tp=function(r){const t=[];let e=0,n=0;for(;e<r.length;){const s=r[e++];if(s<128)t[n++]=String.fromCharCode(s);else if(s>191&&s<224){const i=r[e++];t[n++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=r[e++],o=r[e++],c=r[e++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|c&63)-65536;t[n++]=String.fromCharCode(55296+(u>>10)),t[n++]=String.fromCharCode(56320+(u&1023))}else{const i=r[e++],o=r[e++];t[n++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return t.join("")},xh={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,t){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let s=0;s<r.length;s+=3){const i=r[s],o=s+1<r.length,c=o?r[s+1]:0,u=s+2<r.length,h=u?r[s+2]:0,f=i>>2,p=(i&3)<<4|c>>4;let g=(c&15)<<2|h>>6,R=h&63;u||(R=64,o||(g=64)),n.push(e[f],e[p],e[g],e[R])}return n.join("")},encodeString(r,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(r):this.encodeByteArray(Dh(r),t)},decodeString(r,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(r):Tp(this.decodeStringToByteArray(r,t))},decodeStringToByteArray(r,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let s=0;s<r.length;){const i=e[r.charAt(s++)],c=s<r.length?e[r.charAt(s)]:0;++s;const h=s<r.length?e[r.charAt(s)]:64;++s;const p=s<r.length?e[r.charAt(s)]:64;if(++s,i==null||c==null||h==null||p==null)throw new Ep;const g=i<<2|c>>4;if(n.push(g),h!==64){const R=c<<4&240|h>>2;if(n.push(R),p!==64){const D=h<<6&192|p;n.push(D)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class Ep extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const wp=function(r){const t=Dh(r);return xh.encodeByteArray(t,!0)},ni=function(r){return wp(r).replace(/\./g,"")},Ap=function(r){try{return xh.decodeString(r,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nh(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vp=()=>Nh().__FIREBASE_DEFAULTS__,bp=()=>{if(typeof process>"u"||typeof Bu>"u")return;const r=Bu.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},Rp=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=r&&Ap(r[1]);return t&&JSON.parse(t)},Si=()=>{try{return Ip()||vp()||bp()||Rp()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},Sp=r=>{var t,e;return(e=(t=Si())==null?void 0:t.emulatorHosts)==null?void 0:e[r]},Pp=r=>{const t=Sp(r);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const n=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),n]:[t.substring(0,e),n]},kh=()=>{var r;return(r=Si())==null?void 0:r.config},kw=r=>{var t;return(t=Si())==null?void 0:t[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vp{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,n)=>{e?this.reject(e):this.resolve(n),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,n))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ds(r){try{return(r.startsWith("http://")||r.startsWith("https://")?new URL(r).hostname:r).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Mh(r){return(await fetch(r,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mw(r,t){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},n=t||"demo-project",s=r.iat||0,i=r.sub||r.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${n}`,aud:n,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...r};return[ni(JSON.stringify(e)),ni(JSON.stringify(o)),""].join(".")}const Br={};function Cp(){const r={prod:[],emulator:[]};for(const t of Object.keys(Br))Br[t]?r.emulator.push(t):r.prod.push(t);return r}function Dp(r){let t=document.getElementById(r),e=!1;return t||(t=document.createElement("div"),t.setAttribute("id",r),e=!0),{created:e,element:t}}let Uu=!1;function xp(r,t){if(typeof window>"u"||typeof document>"u"||!ds(window.location.host)||Br[r]===t||Br[r]||Uu)return;Br[r]=t;function e(g){return`__firebase__banner__${g}`}const n="__firebase__banner",i=Cp().prod.length>0;function o(){const g=document.getElementById(n);g&&g.remove()}function c(g){g.style.display="flex",g.style.background="#7faaf0",g.style.position="fixed",g.style.bottom="5px",g.style.left="5px",g.style.padding=".5em",g.style.borderRadius="5px",g.style.alignItems="center"}function u(g,R){g.setAttribute("width","24"),g.setAttribute("id",R),g.setAttribute("height","24"),g.setAttribute("viewBox","0 0 24 24"),g.setAttribute("fill","none"),g.style.marginLeft="-6px"}function h(){const g=document.createElement("span");return g.style.cursor="pointer",g.style.marginLeft="16px",g.style.fontSize="24px",g.innerHTML=" &times;",g.onclick=()=>{Uu=!0,o()},g}function f(g,R){g.setAttribute("id",R),g.innerText="Learn more",g.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",g.setAttribute("target","__blank"),g.style.paddingLeft="5px",g.style.textDecoration="underline"}function p(){const g=Dp(n),R=e("text"),D=document.getElementById(R)||document.createElement("span"),N=e("learnmore"),x=document.getElementById(N)||document.createElement("a"),$=e("preprendIcon"),q=document.getElementById($)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(g.created){const U=g.element;c(U),f(x,N);const X=h();u(q,$),U.append(q,D,x,X),document.body.appendChild(U)}i?(D.innerText="Preview backend disconnected.",q.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(q.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,D.innerText="Preview backend running in this workspace."),D.setAttribute("id",R)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",p):p()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mn(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ow(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Mn())}function Oh(){var t;const r=(t=Si())==null?void 0:t.forceEnvironment;if(r==="node")return!0;if(r==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Fw(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Fh(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function Lw(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Bw(){const r=Mn();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function Lh(){return!Oh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Bh(){return!Oh()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function Pi(){try{return typeof indexedDB=="object"}catch{return!1}}function Va(){return new Promise((r,t)=>{try{let e=!0;const n="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(n);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(n),r(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var i;t(((i=s.error)==null?void 0:i.message)||"")}}catch(e){t(e)}})}function Uh(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Np="FirebaseError";class fe extends Error{constructor(t,e,n){super(e),this.code=t,this.customData=n,this.name=Np,Object.setPrototypeOf(this,fe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Vi.prototype.create)}}class Vi{constructor(t,e,n){this.service=t,this.serviceName=e,this.errors=n}create(t,...e){const n=e[0]||{},s=`${this.service}/${t}`,i=this.errors[t],o=i?kp(i,n):"Error",c=`${this.serviceName}: ${o} (${s}).`;return new fe(s,c,n)}}function kp(r,t){return r.replace(Mp,(e,n)=>{const s=t[n];return s!=null?String(s):`<${n}?>`})}const Mp=/\{\$([^}]+)}/g;function Uw(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}function On(r,t){if(r===t)return!0;const e=Object.keys(r),n=Object.keys(t);for(const s of e){if(!n.includes(s))return!1;const i=r[s],o=t[s];if(qu(i)&&qu(o)){if(!On(i,o))return!1}else if(i!==o)return!1}for(const s of n)if(!e.includes(s))return!1;return!0}function qu(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qw(r){const t=[];for(const[e,n]of Object.entries(r))Array.isArray(n)?n.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""}function jw(r){const t={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[s,i]=n.split("=");t[decodeURIComponent(s)]=decodeURIComponent(i)}}),t}function $w(r){const t=r.indexOf("?");if(!t)return"";const e=r.indexOf("#",t);return r.substring(t,e>0?e:void 0)}function zw(r,t){const e=new Op(r,t);return e.subscribe.bind(e)}class Op{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(n=>{this.error(n)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,n){let s;if(t===void 0&&e===void 0&&n===void 0)throw new Error("Missing Observer.");Fp(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:n},s.next===void 0&&(s.next=xo),s.error===void 0&&(s.error=xo),s.complete===void 0&&(s.complete=xo);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Fp(r,t){if(typeof r!="object"||r===null)return!1;for(const e of t)if(e in r&&typeof r[e]=="function")return!0;return!1}function xo(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lp=1e3,Bp=2,Up=14400*1e3,qp=.5;function ju(r,t=Lp,e=Bp){const n=t*Math.pow(e,r),s=Math.round(qp*n*(Math.random()-.5)*2);return Math.min(Up,n+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pt(r){return r&&r._delegate?r._delegate:r}class ee{constructor(t,e,n){this.name=t,this.instanceFactory=e,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qe="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jp{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const n=new Vp;if(this.instancesDeferred.set(e,n),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&n.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){const e=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),n=(t==null?void 0:t.optional)??!1;if(this.isInitialized(e)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:e})}catch(s){if(n)return null;throw s}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(zp(t))try{this.getOrInitializeService({instanceIdentifier:Qe})}catch{}for(const[e,n]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const i=this.getOrInitializeService({instanceIdentifier:s});n.resolve(i)}catch{}}}}clearInstance(t=Qe){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Qe){return this.instances.has(t)}getOptions(t=Qe){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,n=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:n,options:e});for(const[i,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);n===c&&o.resolve(s)}return s}onInit(t,e){const n=this.normalizeInstanceIdentifier(e),s=this.onInitCallbacks.get(n)??new Set;s.add(t),this.onInitCallbacks.set(n,s);const i=this.instances.get(n);return i&&t(i,n),()=>{s.delete(t)}}invokeOnInitCallbacks(t,e){const n=this.onInitCallbacks.get(e);if(n)for(const s of n)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let n=this.instances.get(t);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:$p(t),options:e}),this.instances.set(t,n),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(n,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,n)}catch{}return n||null}normalizeInstanceIdentifier(t=Qe){return this.component?this.component.multipleInstances?t:Qe:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function $p(r){return r===Qe?void 0:r}function zp(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gp{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new jp(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var W;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(W||(W={}));const Kp={debug:W.DEBUG,verbose:W.VERBOSE,info:W.INFO,warn:W.WARN,error:W.ERROR,silent:W.SILENT},Hp=W.INFO,Qp={[W.DEBUG]:"log",[W.VERBOSE]:"log",[W.INFO]:"info",[W.WARN]:"warn",[W.ERROR]:"error"},Wp=(r,t,...e)=>{if(t<r.logLevel)return;const n=new Date().toISOString(),s=Qp[t];if(s)console[s](`[${n}]  ${r.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Ca{constructor(t){this.name=t,this._logLevel=Hp,this._logHandler=Wp,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in W))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Kp[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,W.DEBUG,...t),this._logHandler(this,W.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,W.VERBOSE,...t),this._logHandler(this,W.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,W.INFO,...t),this._logHandler(this,W.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,W.WARN,...t),this._logHandler(this,W.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,W.ERROR,...t),this._logHandler(this,W.ERROR,...t)}}const Jp=(r,t)=>t.some(e=>r instanceof e);let $u,zu;function Xp(){return $u||($u=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Yp(){return zu||(zu=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const qh=new WeakMap,Wo=new WeakMap,jh=new WeakMap,No=new WeakMap,Da=new WeakMap;function Zp(r){const t=new Promise((e,n)=>{const s=()=>{r.removeEventListener("success",i),r.removeEventListener("error",o)},i=()=>{e(ie(r.result)),s()},o=()=>{n(r.error),s()};r.addEventListener("success",i),r.addEventListener("error",o)});return t.then(e=>{e instanceof IDBCursor&&qh.set(e,r)}).catch(()=>{}),Da.set(t,r),t}function tg(r){if(Wo.has(r))return;const t=new Promise((e,n)=>{const s=()=>{r.removeEventListener("complete",i),r.removeEventListener("error",o),r.removeEventListener("abort",o)},i=()=>{e(),s()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),s()};r.addEventListener("complete",i),r.addEventListener("error",o),r.addEventListener("abort",o)});Wo.set(r,t)}let Jo={get(r,t,e){if(r instanceof IDBTransaction){if(t==="done")return Wo.get(r);if(t==="objectStoreNames")return r.objectStoreNames||jh.get(r);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return ie(r[t])},set(r,t,e){return r[t]=e,!0},has(r,t){return r instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in r}};function eg(r){Jo=r(Jo)}function ng(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const n=r.call(ko(this),t,...e);return jh.set(n,t.sort?t.sort():[t]),ie(n)}:Yp().includes(r)?function(...t){return r.apply(ko(this),t),ie(qh.get(this))}:function(...t){return ie(r.apply(ko(this),t))}}function rg(r){return typeof r=="function"?ng(r):(r instanceof IDBTransaction&&tg(r),Jp(r,Xp())?new Proxy(r,Jo):r)}function ie(r){if(r instanceof IDBRequest)return Zp(r);if(No.has(r))return No.get(r);const t=rg(r);return t!==r&&(No.set(r,t),Da.set(t,r)),t}const ko=r=>Da.get(r);function $h(r,t,{blocked:e,upgrade:n,blocking:s,terminated:i}={}){const o=indexedDB.open(r,t),c=ie(o);return n&&o.addEventListener("upgradeneeded",u=>{n(ie(o.result),u.oldVersion,u.newVersion,ie(o.transaction),u)}),e&&o.addEventListener("blocked",u=>e(u.oldVersion,u.newVersion,u)),c.then(u=>{i&&u.addEventListener("close",()=>i()),s&&u.addEventListener("versionchange",h=>s(h.oldVersion,h.newVersion,h))}).catch(()=>{}),c}function Gw(r,{blocked:t}={}){const e=indexedDB.deleteDatabase(r);return t&&e.addEventListener("blocked",n=>t(n.oldVersion,n)),ie(e).then(()=>{})}const sg=["get","getKey","getAll","getAllKeys","count"],ig=["put","add","delete","clear"],Mo=new Map;function Gu(r,t){if(!(r instanceof IDBDatabase&&!(t in r)&&typeof t=="string"))return;if(Mo.get(t))return Mo.get(t);const e=t.replace(/FromIndex$/,""),n=t!==e,s=ig.includes(e);if(!(e in(n?IDBIndex:IDBObjectStore).prototype)||!(s||sg.includes(e)))return;const i=async function(o,...c){const u=this.transaction(o,s?"readwrite":"readonly");let h=u.store;return n&&(h=h.index(c.shift())),(await Promise.all([h[e](...c),s&&u.done]))[0]};return Mo.set(t,i),i}eg(r=>({...r,get:(t,e,n)=>Gu(t,e)||r.get(t,e,n),has:(t,e)=>!!Gu(t,e)||r.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class og{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(ag(e)){const n=e.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(e=>e).join(" ")}}function ag(r){const t=r.getComponent();return(t==null?void 0:t.type)==="VERSION"}const Xo="@firebase/app",Ku="0.14.6";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ue=new Ca("@firebase/app"),cg="@firebase/app-compat",ug="@firebase/analytics-compat",lg="@firebase/analytics",hg="@firebase/app-check-compat",dg="@firebase/app-check",fg="@firebase/auth",mg="@firebase/auth-compat",pg="@firebase/database",gg="@firebase/data-connect",_g="@firebase/database-compat",yg="@firebase/functions",Ig="@firebase/functions-compat",Tg="@firebase/installations",Eg="@firebase/installations-compat",wg="@firebase/messaging",Ag="@firebase/messaging-compat",vg="@firebase/performance",bg="@firebase/performance-compat",Rg="@firebase/remote-config",Sg="@firebase/remote-config-compat",Pg="@firebase/storage",Vg="@firebase/storage-compat",Cg="@firebase/firestore",Dg="@firebase/ai",xg="@firebase/firestore-compat",Ng="firebase",kg="12.6.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yo="[DEFAULT]",Mg={[Xo]:"fire-core",[cg]:"fire-core-compat",[lg]:"fire-analytics",[ug]:"fire-analytics-compat",[dg]:"fire-app-check",[hg]:"fire-app-check-compat",[fg]:"fire-auth",[mg]:"fire-auth-compat",[pg]:"fire-rtdb",[gg]:"fire-data-connect",[_g]:"fire-rtdb-compat",[yg]:"fire-fn",[Ig]:"fire-fn-compat",[Tg]:"fire-iid",[Eg]:"fire-iid-compat",[wg]:"fire-fcm",[Ag]:"fire-fcm-compat",[vg]:"fire-perf",[bg]:"fire-perf-compat",[Rg]:"fire-rc",[Sg]:"fire-rc-compat",[Pg]:"fire-gcs",[Vg]:"fire-gcs-compat",[Cg]:"fire-fst",[xg]:"fire-fst-compat",[Dg]:"fire-vertex","fire-js":"fire-js",[Ng]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ri=new Map,Og=new Map,Zo=new Map;function Hu(r,t){try{r.container.addComponent(t)}catch(e){ue.debug(`Component ${t.name} failed to register with FirebaseApp ${r.name}`,e)}}function le(r){const t=r.name;if(Zo.has(t))return ue.debug(`There were multiple attempts to register component ${t}.`),!1;Zo.set(t,r);for(const e of ri.values())Hu(e,r);for(const e of Og.values())Hu(e,r);return!0}function nr(r,t){const e=r.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),r.container.getProvider(t)}function zh(r){return r==null?!1:r.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fg={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Pe=new Vi("app","Firebase",Fg);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lg{constructor(t,e,n){this._isDeleted=!1,this._options={...t},this._config={...e},this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new ee("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw Pe.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bg=kg;function Ug(r,t={}){let e=r;typeof t!="object"&&(t={name:t});const n={name:Yo,automaticDataCollectionEnabled:!0,...t},s=n.name;if(typeof s!="string"||!s)throw Pe.create("bad-app-name",{appName:String(s)});if(e||(e=kh()),!e)throw Pe.create("no-options");const i=ri.get(s);if(i){if(On(e,i.options)&&On(n,i.config))return i;throw Pe.create("duplicate-app",{appName:s})}const o=new Gp(s);for(const u of Zo.values())o.addComponent(u);const c=new Lg(e,n,o);return ri.set(s,c),c}function Gh(r=Yo){const t=ri.get(r);if(!t&&r===Yo&&kh())return Ug();if(!t)throw Pe.create("no-app",{appName:r});return t}function $t(r,t,e){let n=Mg[r]??r;e&&(n+=`-${e}`);const s=n.match(/\s|\//),i=t.match(/\s|\//);if(s||i){const o=[`Unable to register library "${n}" with version "${t}":`];s&&o.push(`library name "${n}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${t}" contains illegal characters (whitespace or "/")`),ue.warn(o.join(" "));return}le(new ee(`${n}-version`,()=>({library:n,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qg="firebase-heartbeat-database",jg=1,Jr="firebase-heartbeat-store";let Oo=null;function Kh(){return Oo||(Oo=$h(qg,jg,{upgrade:(r,t)=>{switch(t){case 0:try{r.createObjectStore(Jr)}catch(e){console.warn(e)}}}}).catch(r=>{throw Pe.create("idb-open",{originalErrorMessage:r.message})})),Oo}async function $g(r){try{const e=(await Kh()).transaction(Jr),n=await e.objectStore(Jr).get(Hh(r));return await e.done,n}catch(t){if(t instanceof fe)ue.warn(t.message);else{const e=Pe.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});ue.warn(e.message)}}}async function Qu(r,t){try{const n=(await Kh()).transaction(Jr,"readwrite");await n.objectStore(Jr).put(t,Hh(r)),await n.done}catch(e){if(e instanceof fe)ue.warn(e.message);else{const n=Pe.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});ue.warn(n.message)}}}function Hh(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zg=1024,Gg=30;class Kg{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new Qg(e),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=Wu();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>Gg){const o=Wg(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){ue.warn(n)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=Wu(),{heartbeatsToSend:n,unsentEntries:s}=Hg(this._heartbeatsCache.heartbeats),i=ni(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return ue.warn(e),""}}}function Wu(){return new Date().toISOString().substring(0,10)}function Hg(r,t=zg){const e=[];let n=r.slice();for(const s of r){const i=e.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),Ju(e)>t){i.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),Ju(e)>t){e.pop();break}n=n.slice(1)}return{heartbeatsToSend:e,unsentEntries:n}}class Qg{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Pi()?Va().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await $g(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const n=await this.read();return Qu(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const n=await this.read();return Qu(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...t.heartbeats]})}else return}}function Ju(r){return ni(JSON.stringify({version:2,heartbeats:r})).length}function Wg(r){if(r.length===0)return-1;let t=0,e=r[0].date;for(let n=1;n<r.length;n++)r[n].date<e&&(e=r[n].date,t=n);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jg(r){le(new ee("platform-logger",t=>new og(t),"PRIVATE")),le(new ee("heartbeat",t=>new Kg(t),"PRIVATE")),$t(Xo,Ku,r),$t(Xo,Ku,"esm2020"),$t("fire-js","")}Jg("");var Xg="firebase",Yg="12.6.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */$t(Xg,Yg,"app");var Xu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ve,Qh;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(T,_){function I(){}I.prototype=_.prototype,T.F=_.prototype,T.prototype=new I,T.prototype.constructor=T,T.D=function(w,E,b){for(var y=Array(arguments.length-2),Nt=2;Nt<arguments.length;Nt++)y[Nt-2]=arguments[Nt];return _.prototype[E].apply(w,y)}}function e(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}t(n,e),n.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,_,I){I||(I=0);const w=Array(16);if(typeof _=="string")for(var E=0;E<16;++E)w[E]=_.charCodeAt(I++)|_.charCodeAt(I++)<<8|_.charCodeAt(I++)<<16|_.charCodeAt(I++)<<24;else for(E=0;E<16;++E)w[E]=_[I++]|_[I++]<<8|_[I++]<<16|_[I++]<<24;_=T.g[0],I=T.g[1],E=T.g[2];let b=T.g[3],y;y=_+(b^I&(E^b))+w[0]+3614090360&4294967295,_=I+(y<<7&4294967295|y>>>25),y=b+(E^_&(I^E))+w[1]+3905402710&4294967295,b=_+(y<<12&4294967295|y>>>20),y=E+(I^b&(_^I))+w[2]+606105819&4294967295,E=b+(y<<17&4294967295|y>>>15),y=I+(_^E&(b^_))+w[3]+3250441966&4294967295,I=E+(y<<22&4294967295|y>>>10),y=_+(b^I&(E^b))+w[4]+4118548399&4294967295,_=I+(y<<7&4294967295|y>>>25),y=b+(E^_&(I^E))+w[5]+1200080426&4294967295,b=_+(y<<12&4294967295|y>>>20),y=E+(I^b&(_^I))+w[6]+2821735955&4294967295,E=b+(y<<17&4294967295|y>>>15),y=I+(_^E&(b^_))+w[7]+4249261313&4294967295,I=E+(y<<22&4294967295|y>>>10),y=_+(b^I&(E^b))+w[8]+1770035416&4294967295,_=I+(y<<7&4294967295|y>>>25),y=b+(E^_&(I^E))+w[9]+2336552879&4294967295,b=_+(y<<12&4294967295|y>>>20),y=E+(I^b&(_^I))+w[10]+4294925233&4294967295,E=b+(y<<17&4294967295|y>>>15),y=I+(_^E&(b^_))+w[11]+2304563134&4294967295,I=E+(y<<22&4294967295|y>>>10),y=_+(b^I&(E^b))+w[12]+1804603682&4294967295,_=I+(y<<7&4294967295|y>>>25),y=b+(E^_&(I^E))+w[13]+4254626195&4294967295,b=_+(y<<12&4294967295|y>>>20),y=E+(I^b&(_^I))+w[14]+2792965006&4294967295,E=b+(y<<17&4294967295|y>>>15),y=I+(_^E&(b^_))+w[15]+1236535329&4294967295,I=E+(y<<22&4294967295|y>>>10),y=_+(E^b&(I^E))+w[1]+4129170786&4294967295,_=I+(y<<5&4294967295|y>>>27),y=b+(I^E&(_^I))+w[6]+3225465664&4294967295,b=_+(y<<9&4294967295|y>>>23),y=E+(_^I&(b^_))+w[11]+643717713&4294967295,E=b+(y<<14&4294967295|y>>>18),y=I+(b^_&(E^b))+w[0]+3921069994&4294967295,I=E+(y<<20&4294967295|y>>>12),y=_+(E^b&(I^E))+w[5]+3593408605&4294967295,_=I+(y<<5&4294967295|y>>>27),y=b+(I^E&(_^I))+w[10]+38016083&4294967295,b=_+(y<<9&4294967295|y>>>23),y=E+(_^I&(b^_))+w[15]+3634488961&4294967295,E=b+(y<<14&4294967295|y>>>18),y=I+(b^_&(E^b))+w[4]+3889429448&4294967295,I=E+(y<<20&4294967295|y>>>12),y=_+(E^b&(I^E))+w[9]+568446438&4294967295,_=I+(y<<5&4294967295|y>>>27),y=b+(I^E&(_^I))+w[14]+3275163606&4294967295,b=_+(y<<9&4294967295|y>>>23),y=E+(_^I&(b^_))+w[3]+4107603335&4294967295,E=b+(y<<14&4294967295|y>>>18),y=I+(b^_&(E^b))+w[8]+1163531501&4294967295,I=E+(y<<20&4294967295|y>>>12),y=_+(E^b&(I^E))+w[13]+2850285829&4294967295,_=I+(y<<5&4294967295|y>>>27),y=b+(I^E&(_^I))+w[2]+4243563512&4294967295,b=_+(y<<9&4294967295|y>>>23),y=E+(_^I&(b^_))+w[7]+1735328473&4294967295,E=b+(y<<14&4294967295|y>>>18),y=I+(b^_&(E^b))+w[12]+2368359562&4294967295,I=E+(y<<20&4294967295|y>>>12),y=_+(I^E^b)+w[5]+4294588738&4294967295,_=I+(y<<4&4294967295|y>>>28),y=b+(_^I^E)+w[8]+2272392833&4294967295,b=_+(y<<11&4294967295|y>>>21),y=E+(b^_^I)+w[11]+1839030562&4294967295,E=b+(y<<16&4294967295|y>>>16),y=I+(E^b^_)+w[14]+4259657740&4294967295,I=E+(y<<23&4294967295|y>>>9),y=_+(I^E^b)+w[1]+2763975236&4294967295,_=I+(y<<4&4294967295|y>>>28),y=b+(_^I^E)+w[4]+1272893353&4294967295,b=_+(y<<11&4294967295|y>>>21),y=E+(b^_^I)+w[7]+4139469664&4294967295,E=b+(y<<16&4294967295|y>>>16),y=I+(E^b^_)+w[10]+3200236656&4294967295,I=E+(y<<23&4294967295|y>>>9),y=_+(I^E^b)+w[13]+681279174&4294967295,_=I+(y<<4&4294967295|y>>>28),y=b+(_^I^E)+w[0]+3936430074&4294967295,b=_+(y<<11&4294967295|y>>>21),y=E+(b^_^I)+w[3]+3572445317&4294967295,E=b+(y<<16&4294967295|y>>>16),y=I+(E^b^_)+w[6]+76029189&4294967295,I=E+(y<<23&4294967295|y>>>9),y=_+(I^E^b)+w[9]+3654602809&4294967295,_=I+(y<<4&4294967295|y>>>28),y=b+(_^I^E)+w[12]+3873151461&4294967295,b=_+(y<<11&4294967295|y>>>21),y=E+(b^_^I)+w[15]+530742520&4294967295,E=b+(y<<16&4294967295|y>>>16),y=I+(E^b^_)+w[2]+3299628645&4294967295,I=E+(y<<23&4294967295|y>>>9),y=_+(E^(I|~b))+w[0]+4096336452&4294967295,_=I+(y<<6&4294967295|y>>>26),y=b+(I^(_|~E))+w[7]+1126891415&4294967295,b=_+(y<<10&4294967295|y>>>22),y=E+(_^(b|~I))+w[14]+2878612391&4294967295,E=b+(y<<15&4294967295|y>>>17),y=I+(b^(E|~_))+w[5]+4237533241&4294967295,I=E+(y<<21&4294967295|y>>>11),y=_+(E^(I|~b))+w[12]+1700485571&4294967295,_=I+(y<<6&4294967295|y>>>26),y=b+(I^(_|~E))+w[3]+2399980690&4294967295,b=_+(y<<10&4294967295|y>>>22),y=E+(_^(b|~I))+w[10]+4293915773&4294967295,E=b+(y<<15&4294967295|y>>>17),y=I+(b^(E|~_))+w[1]+2240044497&4294967295,I=E+(y<<21&4294967295|y>>>11),y=_+(E^(I|~b))+w[8]+1873313359&4294967295,_=I+(y<<6&4294967295|y>>>26),y=b+(I^(_|~E))+w[15]+4264355552&4294967295,b=_+(y<<10&4294967295|y>>>22),y=E+(_^(b|~I))+w[6]+2734768916&4294967295,E=b+(y<<15&4294967295|y>>>17),y=I+(b^(E|~_))+w[13]+1309151649&4294967295,I=E+(y<<21&4294967295|y>>>11),y=_+(E^(I|~b))+w[4]+4149444226&4294967295,_=I+(y<<6&4294967295|y>>>26),y=b+(I^(_|~E))+w[11]+3174756917&4294967295,b=_+(y<<10&4294967295|y>>>22),y=E+(_^(b|~I))+w[2]+718787259&4294967295,E=b+(y<<15&4294967295|y>>>17),y=I+(b^(E|~_))+w[9]+3951481745&4294967295,T.g[0]=T.g[0]+_&4294967295,T.g[1]=T.g[1]+(E+(y<<21&4294967295|y>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+b&4294967295}n.prototype.v=function(T,_){_===void 0&&(_=T.length);const I=_-this.blockSize,w=this.C;let E=this.h,b=0;for(;b<_;){if(E==0)for(;b<=I;)s(this,T,b),b+=this.blockSize;if(typeof T=="string"){for(;b<_;)if(w[E++]=T.charCodeAt(b++),E==this.blockSize){s(this,w),E=0;break}}else for(;b<_;)if(w[E++]=T[b++],E==this.blockSize){s(this,w),E=0;break}}this.h=E,this.o+=_},n.prototype.A=function(){var T=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);T[0]=128;for(var _=1;_<T.length-8;++_)T[_]=0;_=this.o*8;for(var I=T.length-8;I<T.length;++I)T[I]=_&255,_/=256;for(this.v(T),T=Array(16),_=0,I=0;I<4;++I)for(let w=0;w<32;w+=8)T[_++]=this.g[I]>>>w&255;return T};function i(T,_){var I=c;return Object.prototype.hasOwnProperty.call(I,T)?I[T]:I[T]=_(T)}function o(T,_){this.h=_;const I=[];let w=!0;for(let E=T.length-1;E>=0;E--){const b=T[E]|0;w&&b==_||(I[E]=b,w=!1)}this.g=I}var c={};function u(T){return-128<=T&&T<128?i(T,function(_){return new o([_|0],_<0?-1:0)}):new o([T|0],T<0?-1:0)}function h(T){if(isNaN(T)||!isFinite(T))return p;if(T<0)return x(h(-T));const _=[];let I=1;for(let w=0;T>=I;w++)_[w]=T/I|0,I*=4294967296;return new o(_,0)}function f(T,_){if(T.length==0)throw Error("number format error: empty string");if(_=_||10,_<2||36<_)throw Error("radix out of range: "+_);if(T.charAt(0)=="-")return x(f(T.substring(1),_));if(T.indexOf("-")>=0)throw Error('number format error: interior "-" character');const I=h(Math.pow(_,8));let w=p;for(let b=0;b<T.length;b+=8){var E=Math.min(8,T.length-b);const y=parseInt(T.substring(b,b+E),_);E<8?(E=h(Math.pow(_,E)),w=w.j(E).add(h(y))):(w=w.j(I),w=w.add(h(y)))}return w}var p=u(0),g=u(1),R=u(16777216);r=o.prototype,r.m=function(){if(N(this))return-x(this).m();let T=0,_=1;for(let I=0;I<this.g.length;I++){const w=this.i(I);T+=(w>=0?w:4294967296+w)*_,_*=4294967296}return T},r.toString=function(T){if(T=T||10,T<2||36<T)throw Error("radix out of range: "+T);if(D(this))return"0";if(N(this))return"-"+x(this).toString(T);const _=h(Math.pow(T,6));var I=this;let w="";for(;;){const E=X(I,_).g;I=$(I,E.j(_));let b=((I.g.length>0?I.g[0]:I.h)>>>0).toString(T);if(I=E,D(I))return b+w;for(;b.length<6;)b="0"+b;w=b+w}},r.i=function(T){return T<0?0:T<this.g.length?this.g[T]:this.h};function D(T){if(T.h!=0)return!1;for(let _=0;_<T.g.length;_++)if(T.g[_]!=0)return!1;return!0}function N(T){return T.h==-1}r.l=function(T){return T=$(this,T),N(T)?-1:D(T)?0:1};function x(T){const _=T.g.length,I=[];for(let w=0;w<_;w++)I[w]=~T.g[w];return new o(I,~T.h).add(g)}r.abs=function(){return N(this)?x(this):this},r.add=function(T){const _=Math.max(this.g.length,T.g.length),I=[];let w=0;for(let E=0;E<=_;E++){let b=w+(this.i(E)&65535)+(T.i(E)&65535),y=(b>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);w=y>>>16,b&=65535,y&=65535,I[E]=y<<16|b}return new o(I,I[I.length-1]&-2147483648?-1:0)};function $(T,_){return T.add(x(_))}r.j=function(T){if(D(this)||D(T))return p;if(N(this))return N(T)?x(this).j(x(T)):x(x(this).j(T));if(N(T))return x(this.j(x(T)));if(this.l(R)<0&&T.l(R)<0)return h(this.m()*T.m());const _=this.g.length+T.g.length,I=[];for(var w=0;w<2*_;w++)I[w]=0;for(w=0;w<this.g.length;w++)for(let E=0;E<T.g.length;E++){const b=this.i(w)>>>16,y=this.i(w)&65535,Nt=T.i(E)>>>16,qe=T.i(E)&65535;I[2*w+2*E]+=y*qe,q(I,2*w+2*E),I[2*w+2*E+1]+=b*qe,q(I,2*w+2*E+1),I[2*w+2*E+1]+=y*Nt,q(I,2*w+2*E+1),I[2*w+2*E+2]+=b*Nt,q(I,2*w+2*E+2)}for(T=0;T<_;T++)I[T]=I[2*T+1]<<16|I[2*T];for(T=_;T<2*_;T++)I[T]=0;return new o(I,0)};function q(T,_){for(;(T[_]&65535)!=T[_];)T[_+1]+=T[_]>>>16,T[_]&=65535,_++}function U(T,_){this.g=T,this.h=_}function X(T,_){if(D(_))throw Error("division by zero");if(D(T))return new U(p,p);if(N(T))return _=X(x(T),_),new U(x(_.g),x(_.h));if(N(_))return _=X(T,x(_)),new U(x(_.g),_.h);if(T.g.length>30){if(N(T)||N(_))throw Error("slowDivide_ only works with positive integers.");for(var I=g,w=_;w.l(T)<=0;)I=Y(I),w=Y(w);var E=H(I,1),b=H(w,1);for(w=H(w,2),I=H(I,2);!D(w);){var y=b.add(w);y.l(T)<=0&&(E=E.add(I),b=y),w=H(w,1),I=H(I,1)}return _=$(T,E.j(_)),new U(E,_)}for(E=p;T.l(_)>=0;){for(I=Math.max(1,Math.floor(T.m()/_.m())),w=Math.ceil(Math.log(I)/Math.LN2),w=w<=48?1:Math.pow(2,w-48),b=h(I),y=b.j(_);N(y)||y.l(T)>0;)I-=w,b=h(I),y=b.j(_);D(b)&&(b=g),E=E.add(b),T=$(T,y)}return new U(E,T)}r.B=function(T){return X(this,T).h},r.and=function(T){const _=Math.max(this.g.length,T.g.length),I=[];for(let w=0;w<_;w++)I[w]=this.i(w)&T.i(w);return new o(I,this.h&T.h)},r.or=function(T){const _=Math.max(this.g.length,T.g.length),I=[];for(let w=0;w<_;w++)I[w]=this.i(w)|T.i(w);return new o(I,this.h|T.h)},r.xor=function(T){const _=Math.max(this.g.length,T.g.length),I=[];for(let w=0;w<_;w++)I[w]=this.i(w)^T.i(w);return new o(I,this.h^T.h)};function Y(T){const _=T.g.length+1,I=[];for(let w=0;w<_;w++)I[w]=T.i(w)<<1|T.i(w-1)>>>31;return new o(I,T.h)}function H(T,_){const I=_>>5;_%=32;const w=T.g.length-I,E=[];for(let b=0;b<w;b++)E[b]=_>0?T.i(b+I)>>>_|T.i(b+I+1)<<32-_:T.i(b+I);return new o(E,T.h)}n.prototype.digest=n.prototype.A,n.prototype.reset=n.prototype.u,n.prototype.update=n.prototype.v,Qh=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,Ve=o}).apply(typeof Xu<"u"?Xu:typeof self<"u"?self:typeof window<"u"?window:{});var Ls=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Wh,Mr,Jh,Gs,ta,Xh,Yh,Zh;(function(){var r,t=Object.defineProperty;function e(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ls=="object"&&Ls];for(var l=0;l<a.length;++l){var d=a[l];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=e(this);function s(a,l){if(l)t:{var d=n;a=a.split(".");for(var m=0;m<a.length-1;m++){var v=a[m];if(!(v in d))break t;d=d[v]}a=a[a.length-1],m=d[a],l=l(m),l!=m&&l!=null&&t(d,a,{configurable:!0,writable:!0,value:l})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(l){var d=[],m;for(m in l)Object.prototype.hasOwnProperty.call(l,m)&&d.push([m,l[m]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function c(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function u(a,l,d){return a.call.apply(a.bind,arguments)}function h(a,l,d){return h=u,h.apply(null,arguments)}function f(a,l){var d=Array.prototype.slice.call(arguments,1);return function(){var m=d.slice();return m.push.apply(m,arguments),a.apply(this,m)}}function p(a,l){function d(){}d.prototype=l.prototype,a.Z=l.prototype,a.prototype=new d,a.prototype.constructor=a,a.Ob=function(m,v,S){for(var k=Array(arguments.length-2),z=2;z<arguments.length;z++)k[z-2]=arguments[z];return l.prototype[v].apply(m,k)}}var g=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function R(a){const l=a.length;if(l>0){const d=Array(l);for(let m=0;m<l;m++)d[m]=a[m];return d}return[]}function D(a,l){for(let m=1;m<arguments.length;m++){const v=arguments[m];var d=typeof v;if(d=d!="object"?d:v?Array.isArray(v)?"array":d:"null",d=="array"||d=="object"&&typeof v.length=="number"){d=a.length||0;const S=v.length||0;a.length=d+S;for(let k=0;k<S;k++)a[d+k]=v[k]}else a.push(v)}}class N{constructor(l,d){this.i=l,this.j=d,this.h=0,this.g=null}get(){let l;return this.h>0?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function x(a){o.setTimeout(()=>{throw a},0)}function $(){var a=T;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class q{constructor(){this.h=this.g=null}add(l,d){const m=U.get();m.set(l,d),this.h?this.h.next=m:this.g=m,this.h=m}}var U=new N(()=>new X,a=>a.reset());class X{constructor(){this.next=this.g=this.h=null}set(l,d){this.h=l,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Y,H=!1,T=new q,_=()=>{const a=Promise.resolve(void 0);Y=()=>{a.then(I)}};function I(){for(var a;a=$();){try{a.h.call(a.g)}catch(d){x(d)}var l=U;l.j(a),l.h<100&&(l.h++,a.next=l.g,l.g=a)}H=!1}function w(){this.u=this.u,this.C=this.C}w.prototype.u=!1,w.prototype.dispose=function(){this.u||(this.u=!0,this.N())},w.prototype[Symbol.dispose]=function(){this.dispose()},w.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function E(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}E.prototype.h=function(){this.defaultPrevented=!0};var b=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};o.addEventListener("test",d,l),o.removeEventListener("test",d,l)}catch{}return a})();function y(a){return/^[\s\xa0]*$/.test(a)}function Nt(a,l){E.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,l)}p(Nt,E),Nt.prototype.init=function(a,l){const d=this.type=a.type,m=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget,l||(d=="mouseover"?l=a.fromElement:d=="mouseout"&&(l=a.toElement)),this.relatedTarget=l,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Nt.Z.h.call(this)},Nt.prototype.h=function(){Nt.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var qe="closure_listenable_"+(Math.random()*1e6|0),qm=0;function jm(a,l,d,m,v){this.listener=a,this.proxy=null,this.src=l,this.type=d,this.capture=!!m,this.ha=v,this.key=++qm,this.da=this.fa=!1}function As(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function vs(a,l,d){for(const m in a)l.call(d,a[m],m,a)}function $m(a,l){for(const d in a)l.call(void 0,a[d],d,a)}function Lc(a){const l={};for(const d in a)l[d]=a[d];return l}const Bc="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Uc(a,l){let d,m;for(let v=1;v<arguments.length;v++){m=arguments[v];for(d in m)a[d]=m[d];for(let S=0;S<Bc.length;S++)d=Bc[S],Object.prototype.hasOwnProperty.call(m,d)&&(a[d]=m[d])}}function bs(a){this.src=a,this.g={},this.h=0}bs.prototype.add=function(a,l,d,m,v){const S=a.toString();a=this.g[S],a||(a=this.g[S]=[],this.h++);const k=co(a,l,m,v);return k>-1?(l=a[k],d||(l.fa=!1)):(l=new jm(l,this.src,S,!!m,v),l.fa=d,a.push(l)),l};function ao(a,l){const d=l.type;if(d in a.g){var m=a.g[d],v=Array.prototype.indexOf.call(m,l,void 0),S;(S=v>=0)&&Array.prototype.splice.call(m,v,1),S&&(As(l),a.g[d].length==0&&(delete a.g[d],a.h--))}}function co(a,l,d,m){for(let v=0;v<a.length;++v){const S=a[v];if(!S.da&&S.listener==l&&S.capture==!!d&&S.ha==m)return v}return-1}var uo="closure_lm_"+(Math.random()*1e6|0),lo={};function qc(a,l,d,m,v){if(Array.isArray(l)){for(let S=0;S<l.length;S++)qc(a,l[S],d,m,v);return null}return d=zc(d),a&&a[qe]?a.J(l,d,c(m)?!!m.capture:!1,v):zm(a,l,d,!1,m,v)}function zm(a,l,d,m,v,S){if(!l)throw Error("Invalid event type");const k=c(v)?!!v.capture:!!v;let z=fo(a);if(z||(a[uo]=z=new bs(a)),d=z.add(l,d,m,k,S),d.proxy)return d;if(m=Gm(),d.proxy=m,m.src=a,m.listener=d,a.addEventListener)b||(v=k),v===void 0&&(v=!1),a.addEventListener(l.toString(),m,v);else if(a.attachEvent)a.attachEvent($c(l.toString()),m);else if(a.addListener&&a.removeListener)a.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Gm(){function a(d){return l.call(a.src,a.listener,d)}const l=Km;return a}function jc(a,l,d,m,v){if(Array.isArray(l))for(var S=0;S<l.length;S++)jc(a,l[S],d,m,v);else m=c(m)?!!m.capture:!!m,d=zc(d),a&&a[qe]?(a=a.i,S=String(l).toString(),S in a.g&&(l=a.g[S],d=co(l,d,m,v),d>-1&&(As(l[d]),Array.prototype.splice.call(l,d,1),l.length==0&&(delete a.g[S],a.h--)))):a&&(a=fo(a))&&(l=a.g[l.toString()],a=-1,l&&(a=co(l,d,m,v)),(d=a>-1?l[a]:null)&&ho(d))}function ho(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[qe])ao(l.i,a);else{var d=a.type,m=a.proxy;l.removeEventListener?l.removeEventListener(d,m,a.capture):l.detachEvent?l.detachEvent($c(d),m):l.addListener&&l.removeListener&&l.removeListener(m),(d=fo(l))?(ao(d,a),d.h==0&&(d.src=null,l[uo]=null)):As(a)}}}function $c(a){return a in lo?lo[a]:lo[a]="on"+a}function Km(a,l){if(a.da)a=!0;else{l=new Nt(l,this);const d=a.listener,m=a.ha||a.src;a.fa&&ho(a),a=d.call(m,l)}return a}function fo(a){return a=a[uo],a instanceof bs?a:null}var mo="__closure_events_fn_"+(Math.random()*1e9>>>0);function zc(a){return typeof a=="function"?a:(a[mo]||(a[mo]=function(l){return a.handleEvent(l)}),a[mo])}function At(){w.call(this),this.i=new bs(this),this.M=this,this.G=null}p(At,w),At.prototype[qe]=!0,At.prototype.removeEventListener=function(a,l,d,m){jc(this,a,l,d,m)};function Ct(a,l){var d,m=a.G;if(m)for(d=[];m;m=m.G)d.push(m);if(a=a.M,m=l.type||l,typeof l=="string")l=new E(l,a);else if(l instanceof E)l.target=l.target||a;else{var v=l;l=new E(m,a),Uc(l,v)}v=!0;let S,k;if(d)for(k=d.length-1;k>=0;k--)S=l.g=d[k],v=Rs(S,m,!0,l)&&v;if(S=l.g=a,v=Rs(S,m,!0,l)&&v,v=Rs(S,m,!1,l)&&v,d)for(k=0;k<d.length;k++)S=l.g=d[k],v=Rs(S,m,!1,l)&&v}At.prototype.N=function(){if(At.Z.N.call(this),this.i){var a=this.i;for(const l in a.g){const d=a.g[l];for(let m=0;m<d.length;m++)As(d[m]);delete a.g[l],a.h--}}this.G=null},At.prototype.J=function(a,l,d,m){return this.i.add(String(a),l,!1,d,m)},At.prototype.K=function(a,l,d,m){return this.i.add(String(a),l,!0,d,m)};function Rs(a,l,d,m){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();let v=!0;for(let S=0;S<l.length;++S){const k=l[S];if(k&&!k.da&&k.capture==d){const z=k.listener,gt=k.ha||k.src;k.fa&&ao(a.i,k),v=z.call(gt,m)!==!1&&v}}return v&&!m.defaultPrevented}function Hm(a,l){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=h(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(l)>2147483647?-1:o.setTimeout(a,l||0)}function Gc(a){a.g=Hm(()=>{a.g=null,a.i&&(a.i=!1,Gc(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class Qm extends w{constructor(l,d){super(),this.m=l,this.l=d,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Gc(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function mr(a){w.call(this),this.h=a,this.g={}}p(mr,w);var Kc=[];function Hc(a){vs(a.g,function(l,d){this.g.hasOwnProperty(d)&&ho(l)},a),a.g={}}mr.prototype.N=function(){mr.Z.N.call(this),Hc(this)},mr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var po=o.JSON.stringify,Wm=o.JSON.parse,Jm=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function Qc(){}function Wc(){}var pr={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function go(){E.call(this,"d")}p(go,E);function _o(){E.call(this,"c")}p(_o,E);var je={},Jc=null;function Ss(){return Jc=Jc||new At}je.Ia="serverreachability";function Xc(a){E.call(this,je.Ia,a)}p(Xc,E);function gr(a){const l=Ss();Ct(l,new Xc(l))}je.STAT_EVENT="statevent";function Yc(a,l){E.call(this,je.STAT_EVENT,a),this.stat=l}p(Yc,E);function Dt(a){const l=Ss();Ct(l,new Yc(l,a))}je.Ja="timingevent";function Zc(a,l){E.call(this,je.Ja,a),this.size=l}p(Zc,E);function _r(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},l)}function yr(){this.g=!0}yr.prototype.ua=function(){this.g=!1};function Xm(a,l,d,m,v,S){a.info(function(){if(a.g)if(S){var k="",z=S.split("&");for(let nt=0;nt<z.length;nt++){var gt=z[nt].split("=");if(gt.length>1){const yt=gt[0];gt=gt[1];const Jt=yt.split("_");k=Jt.length>=2&&Jt[1]=="type"?k+(yt+"="+gt+"&"):k+(yt+"=redacted&")}}}else k=null;else k=S;return"XMLHTTP REQ ("+m+") [attempt "+v+"]: "+l+`
`+d+`
`+k})}function Ym(a,l,d,m,v,S,k){a.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+v+"]: "+l+`
`+d+`
`+S+" "+k})}function Tn(a,l,d,m){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+tp(a,d)+(m?" "+m:"")})}function Zm(a,l){a.info(function(){return"TIMEOUT: "+l})}yr.prototype.info=function(){};function tp(a,l){if(!a.g)return l;if(!l)return null;try{const S=JSON.parse(l);if(S){for(a=0;a<S.length;a++)if(Array.isArray(S[a])){var d=S[a];if(!(d.length<2)){var m=d[1];if(Array.isArray(m)&&!(m.length<1)){var v=m[0];if(v!="noop"&&v!="stop"&&v!="close")for(let k=1;k<m.length;k++)m[k]=""}}}}return po(S)}catch{return l}}var Ps={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},tu={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},eu;function yo(){}p(yo,Qc),yo.prototype.g=function(){return new XMLHttpRequest},eu=new yo;function Ir(a){return encodeURIComponent(String(a))}function ep(a){var l=1;a=a.split(":");const d=[];for(;l>0&&a.length;)d.push(a.shift()),l--;return a.length&&d.push(a.join(":")),d}function ge(a,l,d,m){this.j=a,this.i=l,this.l=d,this.S=m||1,this.V=new mr(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new nu}function nu(){this.i=null,this.g="",this.h=!1}var ru={},Io={};function To(a,l,d){a.M=1,a.A=Cs(Wt(l)),a.u=d,a.R=!0,su(a,null)}function su(a,l){a.F=Date.now(),Vs(a),a.B=Wt(a.A);var d=a.B,m=a.S;Array.isArray(m)||(m=[String(m)]),_u(d.i,"t",m),a.C=0,d=a.j.L,a.h=new nu,a.g=Mu(a.j,d?l:null,!a.u),a.P>0&&(a.O=new Qm(h(a.Y,a,a.g),a.P)),l=a.V,d=a.g,m=a.ba;var v="readystatechange";Array.isArray(v)||(v&&(Kc[0]=v.toString()),v=Kc);for(let S=0;S<v.length;S++){const k=qc(d,v[S],m||l.handleEvent,!1,l.h||l);if(!k)break;l.g[k.key]=k}l=a.J?Lc(a.J):{},a.u?(a.v||(a.v="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,l)):(a.v="GET",a.g.ea(a.B,a.v,null,l)),gr(),Xm(a.i,a.v,a.B,a.l,a.S,a.u)}ge.prototype.ba=function(a){a=a.target;const l=this.O;l&&Ie(a)==3?l.j():this.Y(a)},ge.prototype.Y=function(a){try{if(a==this.g)t:{const z=Ie(this.g),gt=this.g.ya(),nt=this.g.ca();if(!(z<3)&&(z!=3||this.g&&(this.h.h||this.g.la()||vu(this.g)))){this.K||z!=4||gt==7||(gt==8||nt<=0?gr(3):gr(2)),Eo(this);var l=this.g.ca();this.X=l;var d=np(this);if(this.o=l==200,Ym(this.i,this.v,this.B,this.l,this.S,z,l),this.o){if(this.U&&!this.L){e:{if(this.g){var m,v=this.g;if((m=v.g?v.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!y(m)){var S=m;break e}}S=null}if(a=S)Tn(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,wo(this,a);else{this.o=!1,this.m=3,Dt(12),$e(this),Tr(this);break t}}if(this.R){a=!0;let yt;for(;!this.K&&this.C<d.length;)if(yt=rp(this,d),yt==Io){z==4&&(this.m=4,Dt(14),a=!1),Tn(this.i,this.l,null,"[Incomplete Response]");break}else if(yt==ru){this.m=4,Dt(15),Tn(this.i,this.l,d,"[Invalid Chunk]"),a=!1;break}else Tn(this.i,this.l,yt,null),wo(this,yt);if(iu(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),z!=4||d.length!=0||this.h.h||(this.m=1,Dt(16),a=!1),this.o=this.o&&a,!a)Tn(this.i,this.l,d,"[Invalid Chunked Response]"),$e(this),Tr(this);else if(d.length>0&&!this.W){this.W=!0;var k=this.j;k.g==this&&k.aa&&!k.P&&(k.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Co(k),k.P=!0,Dt(11))}}else Tn(this.i,this.l,d,null),wo(this,d);z==4&&$e(this),this.o&&!this.K&&(z==4?Du(this.j,this):(this.o=!1,Vs(this)))}else _p(this.g),l==400&&d.indexOf("Unknown SID")>0?(this.m=3,Dt(12)):(this.m=0,Dt(13)),$e(this),Tr(this)}}}catch{}finally{}};function np(a){if(!iu(a))return a.g.la();const l=vu(a.g);if(l==="")return"";let d="";const m=l.length,v=Ie(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return $e(a),Tr(a),"";a.h.i=new o.TextDecoder}for(let S=0;S<m;S++)a.h.h=!0,d+=a.h.i.decode(l[S],{stream:!(v&&S==m-1)});return l.length=0,a.h.g+=d,a.C=0,a.h.g}function iu(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function rp(a,l){var d=a.C,m=l.indexOf(`
`,d);return m==-1?Io:(d=Number(l.substring(d,m)),isNaN(d)?ru:(m+=1,m+d>l.length?Io:(l=l.slice(m,m+d),a.C=m+d,l)))}ge.prototype.cancel=function(){this.K=!0,$e(this)};function Vs(a){a.T=Date.now()+a.H,ou(a,a.H)}function ou(a,l){if(a.D!=null)throw Error("WatchDog timer not null");a.D=_r(h(a.aa,a),l)}function Eo(a){a.D&&(o.clearTimeout(a.D),a.D=null)}ge.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(Zm(this.i,this.B),this.M!=2&&(gr(),Dt(17)),$e(this),this.m=2,Tr(this)):ou(this,this.T-a)};function Tr(a){a.j.I==0||a.K||Du(a.j,a)}function $e(a){Eo(a);var l=a.O;l&&typeof l.dispose=="function"&&l.dispose(),a.O=null,Hc(a.V),a.g&&(l=a.g,a.g=null,l.abort(),l.dispose())}function wo(a,l){try{var d=a.j;if(d.I!=0&&(d.g==a||Ao(d.h,a))){if(!a.L&&Ao(d.h,a)&&d.I==3){try{var m=d.Ba.g.parse(l)}catch{m=null}if(Array.isArray(m)&&m.length==3){var v=m;if(v[0]==0){t:if(!d.v){if(d.g)if(d.g.F+3e3<a.F)Ms(d),Ns(d);else break t;Vo(d),Dt(18)}}else d.xa=v[1],0<d.xa-d.K&&v[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=_r(h(d.Va,d),6e3));uu(d.h)<=1&&d.ta&&(d.ta=void 0)}else Ge(d,11)}else if((a.L||d.g==a)&&Ms(d),!y(l))for(v=d.Ba.g.parse(l),l=0;l<v.length;l++){let nt=v[l];const yt=nt[0];if(!(yt<=d.K))if(d.K=yt,nt=nt[1],d.I==2)if(nt[0]=="c"){d.M=nt[1],d.ba=nt[2];const Jt=nt[3];Jt!=null&&(d.ka=Jt,d.j.info("VER="+d.ka));const Ke=nt[4];Ke!=null&&(d.za=Ke,d.j.info("SVER="+d.za));const Te=nt[5];Te!=null&&typeof Te=="number"&&Te>0&&(m=1.5*Te,d.O=m,d.j.info("backChannelRequestTimeoutMs_="+m)),m=d;const Ee=a.g;if(Ee){const Fs=Ee.g?Ee.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Fs){var S=m.h;S.g||Fs.indexOf("spdy")==-1&&Fs.indexOf("quic")==-1&&Fs.indexOf("h2")==-1||(S.j=S.l,S.g=new Set,S.h&&(vo(S,S.h),S.h=null))}if(m.G){const Do=Ee.g?Ee.g.getResponseHeader("X-HTTP-Session-Id"):null;Do&&(m.wa=Do,st(m.J,m.G,Do))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-a.F,d.j.info("Handshake RTT: "+d.T+"ms")),m=d;var k=a;if(m.na=ku(m,m.L?m.ba:null,m.W),k.L){lu(m.h,k);var z=k,gt=m.O;gt&&(z.H=gt),z.D&&(Eo(z),Vs(z)),m.g=k}else Vu(m);d.i.length>0&&ks(d)}else nt[0]!="stop"&&nt[0]!="close"||Ge(d,7);else d.I==3&&(nt[0]=="stop"||nt[0]=="close"?nt[0]=="stop"?Ge(d,7):Po(d):nt[0]!="noop"&&d.l&&d.l.qa(nt),d.A=0)}}gr(4)}catch{}}var sp=class{constructor(a,l){this.g=a,this.map=l}};function au(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function cu(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function uu(a){return a.h?1:a.g?a.g.size:0}function Ao(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function vo(a,l){a.g?a.g.add(l):a.h=l}function lu(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}au.prototype.cancel=function(){if(this.i=hu(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function hu(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const d of a.g.values())l=l.concat(d.G);return l}return R(a.i)}var du=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function ip(a,l){if(a){a=a.split("&");for(let d=0;d<a.length;d++){const m=a[d].indexOf("=");let v,S=null;m>=0?(v=a[d].substring(0,m),S=a[d].substring(m+1)):v=a[d],l(v,S?decodeURIComponent(S.replace(/\+/g," ")):"")}}}function _e(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let l;a instanceof _e?(this.l=a.l,Er(this,a.j),this.o=a.o,this.g=a.g,wr(this,a.u),this.h=a.h,bo(this,yu(a.i)),this.m=a.m):a&&(l=String(a).match(du))?(this.l=!1,Er(this,l[1]||"",!0),this.o=Ar(l[2]||""),this.g=Ar(l[3]||"",!0),wr(this,l[4]),this.h=Ar(l[5]||"",!0),bo(this,l[6]||"",!0),this.m=Ar(l[7]||"")):(this.l=!1,this.i=new br(null,this.l))}_e.prototype.toString=function(){const a=[];var l=this.j;l&&a.push(vr(l,fu,!0),":");var d=this.g;return(d||l=="file")&&(a.push("//"),(l=this.o)&&a.push(vr(l,fu,!0),"@"),a.push(Ir(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&a.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(vr(d,d.charAt(0)=="/"?cp:ap,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",vr(d,lp)),a.join("")},_e.prototype.resolve=function(a){const l=Wt(this);let d=!!a.j;d?Er(l,a.j):d=!!a.o,d?l.o=a.o:d=!!a.g,d?l.g=a.g:d=a.u!=null;var m=a.h;if(d)wr(l,a.u);else if(d=!!a.h){if(m.charAt(0)!="/")if(this.g&&!this.h)m="/"+m;else{var v=l.h.lastIndexOf("/");v!=-1&&(m=l.h.slice(0,v+1)+m)}if(v=m,v==".."||v==".")m="";else if(v.indexOf("./")!=-1||v.indexOf("/.")!=-1){m=v.lastIndexOf("/",0)==0,v=v.split("/");const S=[];for(let k=0;k<v.length;){const z=v[k++];z=="."?m&&k==v.length&&S.push(""):z==".."?((S.length>1||S.length==1&&S[0]!="")&&S.pop(),m&&k==v.length&&S.push("")):(S.push(z),m=!0)}m=S.join("/")}else m=v}return d?l.h=m:d=a.i.toString()!=="",d?bo(l,yu(a.i)):d=!!a.m,d&&(l.m=a.m),l};function Wt(a){return new _e(a)}function Er(a,l,d){a.j=d?Ar(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function wr(a,l){if(l){if(l=Number(l),isNaN(l)||l<0)throw Error("Bad port number "+l);a.u=l}else a.u=null}function bo(a,l,d){l instanceof br?(a.i=l,hp(a.i,a.l)):(d||(l=vr(l,up)),a.i=new br(l,a.l))}function st(a,l,d){a.i.set(l,d)}function Cs(a){return st(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function Ar(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function vr(a,l,d){return typeof a=="string"?(a=encodeURI(a).replace(l,op),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function op(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var fu=/[#\/\?@]/g,ap=/[#\?:]/g,cp=/[#\?]/g,up=/[#\?@]/g,lp=/#/g;function br(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function ze(a){a.g||(a.g=new Map,a.h=0,a.i&&ip(a.i,function(l,d){a.add(decodeURIComponent(l.replace(/\+/g," ")),d)}))}r=br.prototype,r.add=function(a,l){ze(this),this.i=null,a=En(this,a);let d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(l),this.h+=1,this};function mu(a,l){ze(a),l=En(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function pu(a,l){return ze(a),l=En(a,l),a.g.has(l)}r.forEach=function(a,l){ze(this),this.g.forEach(function(d,m){d.forEach(function(v){a.call(l,v,m,this)},this)},this)};function gu(a,l){ze(a);let d=[];if(typeof l=="string")pu(a,l)&&(d=d.concat(a.g.get(En(a,l))));else for(a=Array.from(a.g.values()),l=0;l<a.length;l++)d=d.concat(a[l]);return d}r.set=function(a,l){return ze(this),this.i=null,a=En(this,a),pu(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=gu(this,a),a.length>0?String(a[0]):l):l};function _u(a,l,d){mu(a,l),d.length>0&&(a.i=null,a.g.set(En(a,l),R(d)),a.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(let m=0;m<l.length;m++){var d=l[m];const v=Ir(d);d=gu(this,d);for(let S=0;S<d.length;S++){let k=v;d[S]!==""&&(k+="="+Ir(d[S])),a.push(k)}}return this.i=a.join("&")};function yu(a){const l=new br;return l.i=a.i,a.g&&(l.g=new Map(a.g),l.h=a.h),l}function En(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function hp(a,l){l&&!a.j&&(ze(a),a.i=null,a.g.forEach(function(d,m){const v=m.toLowerCase();m!=v&&(mu(this,m),_u(this,v,d))},a)),a.j=l}function dp(a,l){const d=new yr;if(o.Image){const m=new Image;m.onload=f(ye,d,"TestLoadImage: loaded",!0,l,m),m.onerror=f(ye,d,"TestLoadImage: error",!1,l,m),m.onabort=f(ye,d,"TestLoadImage: abort",!1,l,m),m.ontimeout=f(ye,d,"TestLoadImage: timeout",!1,l,m),o.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=a}else l(!1)}function fp(a,l){const d=new yr,m=new AbortController,v=setTimeout(()=>{m.abort(),ye(d,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:m.signal}).then(S=>{clearTimeout(v),S.ok?ye(d,"TestPingServer: ok",!0,l):ye(d,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(v),ye(d,"TestPingServer: error",!1,l)})}function ye(a,l,d,m,v){try{v&&(v.onload=null,v.onerror=null,v.onabort=null,v.ontimeout=null),m(d)}catch{}}function mp(){this.g=new Jm}function Ro(a){this.i=a.Sb||null,this.h=a.ab||!1}p(Ro,Qc),Ro.prototype.g=function(){return new Ds(this.i,this.h)};function Ds(a,l){At.call(this),this.H=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}p(Ds,At),r=Ds.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=l,this.readyState=1,Sr(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const l={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(l.body=a),(this.H||o).fetch(new Request(this.D,l)).then(this.Pa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Rr(this)),this.readyState=0},r.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Sr(this)),this.g&&(this.readyState=3,Sr(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Iu(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function Iu(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}r.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.B.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?Rr(this):Sr(this),this.readyState==3&&Iu(this)}},r.Oa=function(a){this.g&&(this.response=this.responseText=a,Rr(this))},r.Na=function(a){this.g&&(this.response=a,Rr(this))},r.ga=function(){this.g&&Rr(this)};function Rr(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Sr(a)}r.setRequestHeader=function(a,l){this.A.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var d=l.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=l.next();return a.join(`\r
`)};function Sr(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Ds.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Tu(a){let l="";return vs(a,function(d,m){l+=m,l+=":",l+=d,l+=`\r
`}),l}function So(a,l,d){t:{for(m in d){var m=!1;break t}m=!0}m||(d=Tu(d),typeof a=="string"?d!=null&&Ir(d):st(a,l,d))}function lt(a){At.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}p(lt,At);var pp=/^https?$/i,gp=["POST","PUT"];r=lt.prototype,r.Fa=function(a){this.H=a},r.ea=function(a,l,d,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():eu.g(),this.g.onreadystatechange=g(h(this.Ca,this));try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(S){Eu(this,S);return}if(a=d||"",d=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var v in m)d.set(v,m[v]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const S of m.keys())d.set(S,m.get(S));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(d.keys()).find(S=>S.toLowerCase()=="content-type"),v=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(gp,l,void 0)>=0)||m||v||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[S,k]of d)this.g.setRequestHeader(S,k);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(S){Eu(this,S)}};function Eu(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.o=5,wu(a),xs(a)}function wu(a){a.A||(a.A=!0,Ct(a,"complete"),Ct(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,Ct(this,"complete"),Ct(this,"abort"),xs(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),xs(this,!0)),lt.Z.N.call(this)},r.Ca=function(){this.u||(this.B||this.v||this.j?Au(this):this.Xa())},r.Xa=function(){Au(this)};function Au(a){if(a.h&&typeof i<"u"){if(a.v&&Ie(a)==4)setTimeout(a.Ca.bind(a),0);else if(Ct(a,"readystatechange"),Ie(a)==4){a.h=!1;try{const S=a.ca();t:switch(S){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break t;default:l=!1}var d;if(!(d=l)){var m;if(m=S===0){let k=String(a.D).match(du)[1]||null;!k&&o.self&&o.self.location&&(k=o.self.location.protocol.slice(0,-1)),m=!pp.test(k?k.toLowerCase():"")}d=m}if(d)Ct(a,"complete"),Ct(a,"success");else{a.o=6;try{var v=Ie(a)>2?a.g.statusText:""}catch{v=""}a.l=v+" ["+a.ca()+"]",wu(a)}}finally{xs(a)}}}}function xs(a,l){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const d=a.g;a.g=null,l||Ct(a,"ready");try{d.onreadystatechange=null}catch{}}}r.isActive=function(){return!!this.g};function Ie(a){return a.g?a.g.readyState:0}r.ca=function(){try{return Ie(this)>2?this.g.status:-1}catch{return-1}},r.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.La=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),Wm(l)}};function vu(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function _p(a){const l={};a=(a.g&&Ie(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<a.length;m++){if(y(a[m]))continue;var d=ep(a[m]);const v=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const S=l[v]||[];l[v]=S,S.push(d)}$m(l,function(m){return m.join(", ")})}r.ya=function(){return this.o},r.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Pr(a,l,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||l}function bu(a){this.za=0,this.i=[],this.j=new yr,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Pr("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Pr("baseRetryDelayMs",5e3,a),this.Za=Pr("retryDelaySeedMs",1e4,a),this.Ta=Pr("forwardChannelMaxRetries",2,a),this.va=Pr("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new au(a&&a.concurrentRequestLimit),this.Ba=new mp,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}r=bu.prototype,r.ka=8,r.I=1,r.connect=function(a,l,d,m){Dt(0),this.W=a,this.H=l||{},d&&m!==void 0&&(this.H.OSID=d,this.H.OAID=m),this.F=this.X,this.J=ku(this,null,this.W),ks(this)};function Po(a){if(Ru(a),a.I==3){var l=a.V++,d=Wt(a.J);if(st(d,"SID",a.M),st(d,"RID",l),st(d,"TYPE","terminate"),Vr(a,d),l=new ge(a,a.j,l),l.M=2,l.A=Cs(Wt(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(l.A.toString(),"")}catch{}!d&&o.Image&&(new Image().src=l.A,d=!0),d||(l.g=Mu(l.j,null),l.g.ea(l.A)),l.F=Date.now(),Vs(l)}Nu(a)}function Ns(a){a.g&&(Co(a),a.g.cancel(),a.g=null)}function Ru(a){Ns(a),a.v&&(o.clearTimeout(a.v),a.v=null),Ms(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function ks(a){if(!cu(a.h)&&!a.m){a.m=!0;var l=a.Ea;Y||_(),H||(Y(),H=!0),T.add(l,a),a.D=0}}function yp(a,l){return uu(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=l.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=_r(h(a.Ea,a,l),xu(a,a.D)),a.D++,!0)}r.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const v=new ge(this,this.j,a);let S=this.o;if(this.U&&(S?(S=Lc(S),Uc(S,this.U)):S=this.U),this.u!==null||this.R||(v.J=S,S=null),this.S)t:{for(var l=0,d=0;d<this.i.length;d++){e:{var m=this.i[d];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break e}m=void 0}if(m===void 0)break;if(l+=m,l>4096){l=d;break t}if(l===4096||d===this.i.length-1){l=d+1;break t}}l=1e3}else l=1e3;l=Pu(this,v,l),d=Wt(this.J),st(d,"RID",a),st(d,"CVER",22),this.G&&st(d,"X-HTTP-Session-Id",this.G),Vr(this,d),S&&(this.R?l="headers="+Ir(Tu(S))+"&"+l:this.u&&So(d,this.u,S)),vo(this.h,v),this.Ra&&st(d,"TYPE","init"),this.S?(st(d,"$req",l),st(d,"SID","null"),v.U=!0,To(v,d,null)):To(v,d,l),this.I=2}}else this.I==3&&(a?Su(this,a):this.i.length==0||cu(this.h)||Su(this))};function Su(a,l){var d;l?d=l.l:d=a.V++;const m=Wt(a.J);st(m,"SID",a.M),st(m,"RID",d),st(m,"AID",a.K),Vr(a,m),a.u&&a.o&&So(m,a.u,a.o),d=new ge(a,a.j,d,a.D+1),a.u===null&&(d.J=a.o),l&&(a.i=l.G.concat(a.i)),l=Pu(a,d,1e3),d.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),vo(a.h,d),To(d,m,l)}function Vr(a,l){a.H&&vs(a.H,function(d,m){st(l,m,d)}),a.l&&vs({},function(d,m){st(l,m,d)})}function Pu(a,l,d){d=Math.min(a.i.length,d);const m=a.l?h(a.l.Ka,a.l,a):null;t:{var v=a.i;let z=-1;for(;;){const gt=["count="+d];z==-1?d>0?(z=v[0].g,gt.push("ofs="+z)):z=0:gt.push("ofs="+z);let nt=!0;for(let yt=0;yt<d;yt++){var S=v[yt].g;const Jt=v[yt].map;if(S-=z,S<0)z=Math.max(0,v[yt].g-100),nt=!1;else try{S="req"+S+"_"||"";try{var k=Jt instanceof Map?Jt:Object.entries(Jt);for(const[Ke,Te]of k){let Ee=Te;c(Te)&&(Ee=po(Te)),gt.push(S+Ke+"="+encodeURIComponent(Ee))}}catch(Ke){throw gt.push(S+"type="+encodeURIComponent("_badmap")),Ke}}catch{m&&m(Jt)}}if(nt){k=gt.join("&");break t}}k=void 0}return a=a.i.splice(0,d),l.G=a,k}function Vu(a){if(!a.g&&!a.v){a.Y=1;var l=a.Da;Y||_(),H||(Y(),H=!0),T.add(l,a),a.A=0}}function Vo(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=_r(h(a.Da,a),xu(a,a.A)),a.A++,!0)}r.Da=function(){if(this.v=null,Cu(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=_r(h(this.Wa,this),a)}},r.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Dt(10),Ns(this),Cu(this))};function Co(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Cu(a){a.g=new ge(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var l=Wt(a.na);st(l,"RID","rpc"),st(l,"SID",a.M),st(l,"AID",a.K),st(l,"CI",a.F?"0":"1"),!a.F&&a.ia&&st(l,"TO",a.ia),st(l,"TYPE","xmlhttp"),Vr(a,l),a.u&&a.o&&So(l,a.u,a.o),a.O&&(a.g.H=a.O);var d=a.g;a=a.ba,d.M=1,d.A=Cs(Wt(l)),d.u=null,d.R=!0,su(d,a)}r.Va=function(){this.C!=null&&(this.C=null,Ns(this),Vo(this),Dt(19))};function Ms(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Du(a,l){var d=null;if(a.g==l){Ms(a),Co(a),a.g=null;var m=2}else if(Ao(a.h,l))d=l.G,lu(a.h,l),m=1;else return;if(a.I!=0){if(l.o)if(m==1){d=l.u?l.u.length:0,l=Date.now()-l.F;var v=a.D;m=Ss(),Ct(m,new Zc(m,d)),ks(a)}else Vu(a);else if(v=l.m,v==3||v==0&&l.X>0||!(m==1&&yp(a,l)||m==2&&Vo(a)))switch(d&&d.length>0&&(l=a.h,l.i=l.i.concat(d)),v){case 1:Ge(a,5);break;case 4:Ge(a,10);break;case 3:Ge(a,6);break;default:Ge(a,2)}}}function xu(a,l){let d=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(d*=2),d*l}function Ge(a,l){if(a.j.info("Error code "+l),l==2){var d=h(a.bb,a),m=a.Ua;const v=!m;m=new _e(m||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||Er(m,"https"),Cs(m),v?dp(m.toString(),d):fp(m.toString(),d)}else Dt(2);a.I=0,a.l&&a.l.pa(l),Nu(a),Ru(a)}r.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Dt(2)):(this.j.info("Failed to ping google.com"),Dt(1))};function Nu(a){if(a.I=0,a.ja=[],a.l){const l=hu(a.h);(l.length!=0||a.i.length!=0)&&(D(a.ja,l),D(a.ja,a.i),a.h.i.length=0,R(a.i),a.i.length=0),a.l.oa()}}function ku(a,l,d){var m=d instanceof _e?Wt(d):new _e(d);if(m.g!="")l&&(m.g=l+"."+m.g),wr(m,m.u);else{var v=o.location;m=v.protocol,l=l?l+"."+v.hostname:v.hostname,v=+v.port;const S=new _e(null);m&&Er(S,m),l&&(S.g=l),v&&wr(S,v),d&&(S.h=d),m=S}return d=a.G,l=a.wa,d&&l&&st(m,d,l),st(m,"VER",a.ka),Vr(a,m),m}function Mu(a,l,d){if(l&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Aa&&!a.ma?new lt(new Ro({ab:d})):new lt(a.ma),l.Fa(a.L),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Ou(){}r=Ou.prototype,r.ra=function(){},r.qa=function(){},r.pa=function(){},r.oa=function(){},r.isActive=function(){return!0},r.Ka=function(){};function Os(){}Os.prototype.g=function(a,l){return new Ft(a,l)};function Ft(a,l){At.call(this),this.g=new bu(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.sa&&(a?a["X-WebChannel-Client-Profile"]=l.sa:a={"X-WebChannel-Client-Profile":l.sa}),this.g.U=a,(a=l&&l.Qb)&&!y(a)&&(this.g.u=a),this.A=l&&l.supportsCrossDomainXhr||!1,this.v=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!y(l)&&(this.g.G=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new wn(this)}p(Ft,At),Ft.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Ft.prototype.close=function(){Po(this.g)},Ft.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.v&&(d={},d.__data__=po(a),a=d);l.i.push(new sp(l.Ya++,a)),l.I==3&&ks(l)},Ft.prototype.N=function(){this.g.l=null,delete this.j,Po(this.g),delete this.g,Ft.Z.N.call(this)};function Fu(a){go.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){t:{for(const d in l){a=d;break t}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}p(Fu,go);function Lu(){_o.call(this),this.status=1}p(Lu,_o);function wn(a){this.g=a}p(wn,Ou),wn.prototype.ra=function(){Ct(this.g,"a")},wn.prototype.qa=function(a){Ct(this.g,new Fu(a))},wn.prototype.pa=function(a){Ct(this.g,new Lu)},wn.prototype.oa=function(){Ct(this.g,"b")},Os.prototype.createWebChannel=Os.prototype.g,Ft.prototype.send=Ft.prototype.o,Ft.prototype.open=Ft.prototype.m,Ft.prototype.close=Ft.prototype.close,Zh=function(){return new Os},Yh=function(){return Ss()},Xh=je,ta={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Ps.NO_ERROR=0,Ps.TIMEOUT=8,Ps.HTTP_ERROR=6,Gs=Ps,tu.COMPLETE="complete",Jh=tu,Wc.EventType=pr,pr.OPEN="a",pr.CLOSE="b",pr.ERROR="c",pr.MESSAGE="d",At.prototype.listen=At.prototype.J,Mr=Wc,lt.prototype.listenOnce=lt.prototype.K,lt.prototype.getLastError=lt.prototype.Ha,lt.prototype.getLastErrorCode=lt.prototype.ya,lt.prototype.getStatus=lt.prototype.ca,lt.prototype.getResponseJson=lt.prototype.La,lt.prototype.getResponseText=lt.prototype.la,lt.prototype.send=lt.prototype.ea,lt.prototype.setWithCredentials=lt.prototype.Fa,Wh=lt}).apply(typeof Ls<"u"?Ls:typeof self<"u"?self:typeof window<"u"?window:{});const Yu="@firebase/firestore",Zu="4.9.2";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}bt.UNAUTHENTICATED=new bt(null),bt.GOOGLE_CREDENTIALS=new bt("google-credentials-uid"),bt.FIRST_PARTY=new bt("first-party-uid"),bt.MOCK_USER=new bt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rr="12.3.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn=new Ca("@firebase/firestore");function Vn(){return cn.logLevel}function V(r,...t){if(cn.logLevel<=W.DEBUG){const e=t.map(xa);cn.debug(`Firestore (${rr}): ${r}`,...e)}}function dt(r,...t){if(cn.logLevel<=W.ERROR){const e=t.map(xa);cn.error(`Firestore (${rr}): ${r}`,...e)}}function Fn(r,...t){if(cn.logLevel<=W.WARN){const e=t.map(xa);cn.warn(`Firestore (${rr}): ${r}`,...e)}}function xa(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(e){return JSON.stringify(e)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function O(r,t,e){let n="Unexpected state";typeof t=="string"?n=t:e=t,td(r,n,e)}function td(r,t,e){let n=`FIRESTORE (${rr}) INTERNAL ASSERTION FAILED: ${t} (ID: ${r.toString(16)})`;if(e!==void 0)try{n+=" CONTEXT: "+JSON.stringify(e)}catch{n+=" CONTEXT: "+e}throw dt(n),new Error(n)}function L(r,t,e,n){let s="Unexpected state";typeof e=="string"?s=e:n=e,r||td(t,s,n)}function F(r,t){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class C extends fe{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zg{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class ed{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable((()=>e(bt.UNAUTHENTICATED)))}shutdown(){}}class t_{constructor(t){this.t=t,this.currentUser=bt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){L(this.o===void 0,42304);let n=this.i;const s=u=>this.i!==n?(n=this.i,e(u)):Promise.resolve();let i=new Kt;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Kt,t.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;t.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},c=u=>{V("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?c(u):(V("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Kt)}}),0),o()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then((n=>this.i!==t?(V("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(L(typeof n.accessToken=="string",31837,{l:n}),new Zg(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return L(t===null||typeof t=="string",2055,{h:t}),new bt(t)}}class e_{constructor(t,e,n){this.P=t,this.T=e,this.I=n,this.type="FirstParty",this.user=bt.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class n_{constructor(t,e,n){this.P=t,this.T=e,this.I=n}getToken(){return Promise.resolve(new e_(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable((()=>e(bt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class tl{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class r_{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,zh(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){L(this.o===void 0,3512);const n=i=>{i.error!=null&&V("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,V("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?e(i.token):Promise.resolve()};this.o=i=>{t.enqueueRetryable((()=>n(i)))};const s=i=>{V("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):V("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new tl(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then((e=>e?(L(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new tl(e.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function s_(r){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(r);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let n=0;n<r;n++)e[n]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ci{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=s_(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<e&&(n+=t.charAt(s[i]%62))}return n}}function j(r,t){return r<t?-1:r>t?1:0}function ea(r,t){const e=Math.min(r.length,t.length);for(let n=0;n<e;n++){const s=r.charAt(n),i=t.charAt(n);if(s!==i)return Fo(s)===Fo(i)?j(s,i):Fo(s)?1:-1}return j(r.length,t.length)}const i_=55296,o_=57343;function Fo(r){const t=r.charCodeAt(0);return t>=i_&&t<=o_}function Ln(r,t,e){return r.length===t.length&&r.every(((n,s)=>e(n,t[s])))}function nd(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const el="__name__";class Xt{constructor(t,e,n){e===void 0?e=0:e>t.length&&O(637,{offset:e,range:t.length}),n===void 0?n=t.length-e:n>t.length-e&&O(1746,{length:n,range:t.length-e}),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return Xt.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Xt?t.forEach((n=>{e.push(n)})):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let s=0;s<n;s++){const i=Xt.compareSegments(t.get(s),e.get(s));if(i!==0)return i}return j(t.length,e.length)}static compareSegments(t,e){const n=Xt.isNumericId(t),s=Xt.isNumericId(e);return n&&!s?-1:!n&&s?1:n&&s?Xt.extractNumericId(t).compare(Xt.extractNumericId(e)):ea(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return Ve.fromString(t.substring(4,t.length-2))}}class J extends Xt{construct(t,e,n){return new J(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new C(P.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter((s=>s.length>0)))}return new J(e)}static emptyPath(){return new J([])}}const a_=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class at extends Xt{construct(t,e,n){return new at(t,e,n)}static isValidIdentifier(t){return a_.test(t)}canonicalString(){return this.toArray().map((t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),at.isValidIdentifier(t)||(t="`"+t+"`"),t))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===el}static keyField(){return new at([el])}static fromServerFormat(t){const e=[];let n="",s=0;const i=()=>{if(n.length===0)throw new C(P.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let o=!1;for(;s<t.length;){const c=t[s];if(c==="\\"){if(s+1===t.length)throw new C(P.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const u=t[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new C(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=u,s+=2}else c==="`"?(o=!o,s++):c!=="."||o?(n+=c,s++):(i(),s++)}if(i(),o)throw new C(P.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new at(e)}static emptyPath(){return new at([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(t){this.path=t}static fromPath(t){return new M(J.fromString(t))}static fromName(t){return new M(J.fromString(t).popFirst(5))}static empty(){return new M(J.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&J.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return J.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new M(new J(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rd(r,t,e){if(!e)throw new C(P.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${t}.`)}function sd(r,t,e,n){if(t===!0&&n===!0)throw new C(P.INVALID_ARGUMENT,`${r} and ${e} cannot be used together.`)}function nl(r){if(!M.isDocumentKey(r))throw new C(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function rl(r){if(M.isDocumentKey(r))throw new C(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function id(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Di(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const t=(function(n){return n.constructor?n.constructor.name:null})(r);return t?`a custom ${t} object`:"an object"}}return typeof r=="function"?"a function":O(12329,{type:typeof r})}function St(r,t){if("_delegate"in r&&(r=r._delegate),!(r instanceof t)){if(t.name===r.constructor.name)throw new C(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=Di(r);throw new C(P.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return r}function c_(r,t){if(t<=0)throw new C(P.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${t}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mt(r,t){const e={typeString:r};return t&&(e.value=t),e}function fs(r,t){if(!id(r))throw new C(P.INVALID_ARGUMENT,"JSON must be an object");let e;for(const n in t)if(t[n]){const s=t[n].typeString,i="value"in t[n]?{value:t[n].value}:void 0;if(!(n in r)){e=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){e=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){e=`Expected '${n}' field to equal '${i.value}'`;break}}if(e)throw new C(P.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sl=-62135596800,il=1e6;class Z{static now(){return Z.fromMillis(Date.now())}static fromDate(t){return Z.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor((t-1e3*e)*il);return new Z(e,n)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new C(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new C(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<sl)throw new C(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new C(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/il}_compareTo(t){return this.seconds===t.seconds?j(this.nanoseconds,t.nanoseconds):j(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Z._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(fs(t,Z._jsonSchema))return new Z(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-sl;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Z._jsonSchemaVersion="firestore/timestamp/1.0",Z._jsonSchema={type:mt("string",Z._jsonSchemaVersion),seconds:mt("number"),nanoseconds:mt("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{static fromTimestamp(t){return new B(t)}static min(){return new B(new Z(0,0))}static max(){return new B(new Z(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn=-1;class si{constructor(t,e,n,s){this.indexId=t,this.collectionGroup=e,this.fields=n,this.indexState=s}}function na(r){return r.fields.find((t=>t.kind===2))}function We(r){return r.fields.filter((t=>t.kind!==2))}si.UNKNOWN_ID=-1;class Ks{constructor(t,e){this.fieldPath=t,this.kind=e}}class Xr{constructor(t,e){this.sequenceNumber=t,this.offset=e}static empty(){return new Xr(0,jt.min())}}function od(r,t){const e=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=B.fromTimestamp(n===1e9?new Z(e+1,0):new Z(e,n));return new jt(s,M.empty(),t)}function ad(r){return new jt(r.readTime,r.key,Bn)}class jt{constructor(t,e,n){this.readTime=t,this.documentKey=e,this.largestBatchId=n}static min(){return new jt(B.min(),M.empty(),Bn)}static max(){return new jt(B.max(),M.empty(),Bn)}}function Na(r,t){let e=r.readTime.compareTo(t.readTime);return e!==0?e:(e=M.comparator(r.documentKey,t.documentKey),e!==0?e:j(r.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cd="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class ud{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((t=>t()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fe(r){if(r.code!==P.FAILED_PRECONDITION||r.message!==cd)throw r;V("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t((e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)}),(e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)}))}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&O(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new A(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(t,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(e,i).next(n,s)}}))}toPromise(){return new Promise(((t,e)=>{this.next(t,e)}))}wrapUserFunction(t){try{const e=t();return e instanceof A?e:A.resolve(e)}catch(e){return A.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction((()=>t(e))):A.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction((()=>t(e))):A.reject(e)}static resolve(t){return new A(((e,n)=>{e(t)}))}static reject(t){return new A(((e,n)=>{n(t)}))}static waitFor(t){return new A(((e,n)=>{let s=0,i=0,o=!1;t.forEach((c=>{++s,c.next((()=>{++i,o&&i===s&&e()}),(u=>n(u)))})),o=!0,i===s&&e()}))}static or(t){let e=A.resolve(!1);for(const n of t)e=e.next((s=>s?A.resolve(s):n()));return e}static forEach(t,e){const n=[];return t.forEach(((s,i)=>{n.push(e.call(this,s,i))})),this.waitFor(n)}static mapArray(t,e){return new A(((n,s)=>{const i=t.length,o=new Array(i);let c=0;for(let u=0;u<i;u++){const h=u;e(t[h]).next((f=>{o[h]=f,++c,c===i&&n(o)}),(f=>s(f)))}}))}static doWhile(t,e){return new A(((n,s)=>{const i=()=>{t()===!0?e().next((()=>{i()}),s):n()};i()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lt="SimpleDb";class xi{static open(t,e,n,s){try{return new xi(e,t.transaction(s,n))}catch(i){throw new Ur(e,i)}}constructor(t,e){this.action=t,this.transaction=e,this.aborted=!1,this.S=new Kt,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{e.error?this.S.reject(new Ur(t,e.error)):this.S.resolve()},this.transaction.onerror=n=>{const s=ka(n.target.error);this.S.reject(new Ur(t,s))}}get D(){return this.S.promise}abort(t){t&&this.S.reject(t),this.aborted||(V(Lt,"Aborting transaction:",t?t.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const t=this.transaction;this.aborted||typeof t.commit!="function"||t.commit()}store(t){const e=this.transaction.objectStore(t);return new l_(e)}}class Ce{static delete(t){return V(Lt,"Removing database:",t),Xe(Nh().indexedDB.deleteDatabase(t)).toPromise()}static v(){if(!Pi())return!1;if(Ce.F())return!0;const t=Mn(),e=Ce.M(t),n=0<e&&e<10,s=ld(t),i=0<s&&s<4.5;return!(t.indexOf("MSIE ")>0||t.indexOf("Trident/")>0||t.indexOf("Edge/")>0||n||i)}static F(){var t;return typeof process<"u"&&((t=process.__PRIVATE_env)==null?void 0:t.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static O(t,e){return t.store(e)}static M(t){const e=t.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=e?e[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(t,e,n){this.name=t,this.version=e,this.N=n,this.B=null,Ce.M(Mn())===12.2&&dt("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(t){return this.db||(V(Lt,"Opening database:",this.name),this.db=await new Promise(((e,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;e(o)},s.onblocked=()=>{n(new Ur(t,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new C(P.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new C(P.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new Ur(t,o))},s.onupgradeneeded=i=>{V(Lt,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.N.k(o,s.transaction,i.oldVersion,this.version).next((()=>{V(Lt,"Database upgrade to version "+this.version+" complete")}))}}))),this.q&&(this.db.onversionchange=e=>this.q(e)),this.db}$(t){this.q=t,this.db&&(this.db.onversionchange=e=>t(e))}async runTransaction(t,e,n,s){const i=e==="readonly";let o=0;for(;;){++o;try{this.db=await this.L(t);const c=xi.open(this.db,t,i?"readonly":"readwrite",n),u=s(c).next((h=>(c.C(),h))).catch((h=>(c.abort(h),A.reject(h)))).toPromise();return u.catch((()=>{})),await c.D,u}catch(c){const u=c,h=u.name!=="FirebaseError"&&o<3;if(V(Lt,"Transaction failed with error:",u.message,"Retrying:",h),this.close(),!h)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function ld(r){const t=r.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}class u_{constructor(t){this.U=t,this.K=!1,this.W=null}get isDone(){return this.K}get G(){return this.W}set cursor(t){this.U=t}done(){this.K=!0}j(t){this.W=t}delete(){return Xe(this.U.delete())}}class Ur extends C{constructor(t,e){super(P.UNAVAILABLE,`IndexedDB transaction '${t}' failed: ${e}`),this.name="IndexedDbTransactionError"}}function Le(r){return r.name==="IndexedDbTransactionError"}class l_{constructor(t){this.store=t}put(t,e){let n;return e!==void 0?(V(Lt,"PUT",this.store.name,t,e),n=this.store.put(e,t)):(V(Lt,"PUT",this.store.name,"<auto-key>",t),n=this.store.put(t)),Xe(n)}add(t){return V(Lt,"ADD",this.store.name,t,t),Xe(this.store.add(t))}get(t){return Xe(this.store.get(t)).next((e=>(e===void 0&&(e=null),V(Lt,"GET",this.store.name,t,e),e)))}delete(t){return V(Lt,"DELETE",this.store.name,t),Xe(this.store.delete(t))}count(){return V(Lt,"COUNT",this.store.name),Xe(this.store.count())}J(t,e){const n=this.options(t,e),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new A(((o,c)=>{i.onerror=u=>{c(u.target.error)},i.onsuccess=u=>{o(u.target.result)}}))}{const i=this.cursor(n),o=[];return this.H(i,((c,u)=>{o.push(u)})).next((()=>o))}}Y(t,e){const n=this.store.getAll(t,e===null?void 0:e);return new A(((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}}))}Z(t,e){V(Lt,"DELETE ALL",this.store.name);const n=this.options(t,e);n.X=!1;const s=this.cursor(n);return this.H(s,((i,o,c)=>c.delete()))}ee(t,e){let n;e?n=t:(n={},e=t);const s=this.cursor(n);return this.H(s,e)}te(t){const e=this.cursor({});return new A(((n,s)=>{e.onerror=i=>{const o=ka(i.target.error);s(o)},e.onsuccess=i=>{const o=i.target.result;o?t(o.primaryKey,o.value).next((c=>{c?o.continue():n()})):n()}}))}H(t,e){const n=[];return new A(((s,i)=>{t.onerror=o=>{i(o.target.error)},t.onsuccess=o=>{const c=o.target.result;if(!c)return void s();const u=new u_(c),h=e(c.primaryKey,c.value,u);if(h instanceof A){const f=h.catch((p=>(u.done(),A.reject(p))));n.push(f)}u.isDone?s():u.G===null?c.continue():c.continue(u.G)}})).next((()=>A.waitFor(n)))}options(t,e){let n;return t!==void 0&&(typeof t=="string"?n=t:e=t),{index:n,range:e}}cursor(t){let e="next";if(t.reverse&&(e="prev"),t.index){const n=this.store.index(t.index);return t.X?n.openKeyCursor(t.range,e):n.openCursor(t.range,e)}return this.store.openCursor(t.range,e)}}function Xe(r){return new A(((t,e)=>{r.onsuccess=n=>{const s=n.target.result;t(s)},r.onerror=n=>{const s=ka(n.target.error);e(s)}}))}let ol=!1;function ka(r){const t=Ce.M(Mn());if(t>=12.2&&t<13){const e="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(e)>=0){const n=new C("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${e}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return ol||(ol=!0,setTimeout((()=>{throw n}),0)),n}}return r}const qr="IndexBackfiller";class h_{constructor(t,e){this.asyncQueue=t,this.ne=e,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}re(t){V(qr,`Scheduled in ${t}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",t,(async()=>{this.task=null;try{const e=await this.ne.ie();V(qr,`Documents written: ${e}`)}catch(e){Le(e)?V(qr,"Ignoring IndexedDB error during index backfill: ",e):await Fe(e)}await this.re(6e4)}))}}class d_{constructor(t,e){this.localStore=t,this.persistence=e}async ie(t=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(e=>this.se(e,t)))}se(t,e){const n=new Set;let s=e,i=!0;return A.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(t).next((o=>{if(o!==null&&!n.has(o))return V(qr,`Processing collection: ${o}`),this.oe(t,o,s).next((c=>{s-=c,n.add(o)}));i=!1})))).next((()=>e-s))}oe(t,e,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(t,e).next((s=>this.localStore.localDocuments.getNextDocuments(t,e,s,n).next((i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(t,o).next((()=>this._e(s,i))).next((c=>(V(qr,`Updating offset: ${c}`),this.localStore.indexManager.updateCollectionGroup(t,e,c)))).next((()=>o.size))}))))}_e(t,e){let n=t;return e.changes.forEach(((s,i)=>{const o=ad(i);Na(o,n)>0&&(n=o)})),new jt(n.readTime,n.documentKey,Math.max(e.batchId,t.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>e.writeSequenceNumber(n))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}Mt.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sn=-1;function ms(r){return r==null}function Yr(r){return r===0&&1/r==-1/0}function hd(r){return typeof r=="number"&&Number.isInteger(r)&&!Yr(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ii="";function Pt(r){let t="";for(let e=0;e<r.length;e++)t.length>0&&(t=al(t)),t=f_(r.get(e),t);return al(t)}function f_(r,t){let e=t;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":e+="";break;case ii:e+="";break;default:e+=i}}return e}function al(r){return r+ii+""}function Zt(r){const t=r.length;if(L(t>=2,64408,{path:r}),t===2)return L(r.charAt(0)===ii&&r.charAt(1)==="",56145,{path:r}),J.emptyPath();const e=t-2,n=[];let s="";for(let i=0;i<t;){const o=r.indexOf(ii,i);switch((o<0||o>e)&&O(50515,{path:r}),r.charAt(o+1)){case"":const c=r.substring(i,o);let u;s.length===0?u=c:(s+=c,u=s,s=""),n.push(u);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:O(61167,{path:r})}i=o+2}return new J(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je="remoteDocuments",ps="owner",An="owner",Zr="mutationQueues",m_="userId",Gt="mutations",cl="batchId",en="userMutationsIndex",ul=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hs(r,t){return[r,Pt(t)]}function dd(r,t,e){return[r,Pt(t),e]}const p_={},Un="documentMutations",oi="remoteDocumentsV14",g_=["prefixPath","collectionGroup","readTime","documentId"],Qs="documentKeyIndex",__=["prefixPath","collectionGroup","documentId"],fd="collectionGroupIndex",y_=["collectionGroup","readTime","prefixPath","documentId"],ts="remoteDocumentGlobal",ra="remoteDocumentGlobalKey",qn="targets",md="queryTargetsIndex",I_=["canonicalId","targetId"],jn="targetDocuments",T_=["targetId","path"],Ma="documentTargetsIndex",E_=["path","targetId"],ai="targetGlobalKey",on="targetGlobal",es="collectionParents",w_=["collectionId","parent"],$n="clientMetadata",A_="clientId",Ni="bundles",v_="bundleId",ki="namedQueries",b_="name",Oa="indexConfiguration",R_="indexId",sa="collectionGroupIndex",S_="collectionGroup",jr="indexState",P_=["indexId","uid"],pd="sequenceNumberIndex",V_=["uid","sequenceNumber"],$r="indexEntries",C_=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],gd="documentKeyIndex",D_=["indexId","uid","orderedDocumentKey"],Mi="documentOverlays",x_=["userId","collectionPath","documentId"],ia="collectionPathOverlayIndex",N_=["userId","collectionPath","largestBatchId"],_d="collectionGroupOverlayIndex",k_=["userId","collectionGroup","largestBatchId"],Fa="globals",M_="name",yd=[Zr,Gt,Un,Je,qn,ps,on,jn,$n,ts,es,Ni,ki],O_=[...yd,Mi],Id=[Zr,Gt,Un,oi,qn,ps,on,jn,$n,ts,es,Ni,ki,Mi],Td=Id,La=[...Td,Oa,jr,$r],F_=La,Ed=[...La,Fa],L_=Ed;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oa extends ud{constructor(t,e){super(),this.le=t,this.currentSequenceNumber=e}}function _t(r,t){const e=F(r);return Ce.O(e.le,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ll(r){let t=0;for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t++;return t}function Be(r,t){for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t(e,r[e])}function wd(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(t,e){this.comparator=t,this.root=e||Et.EMPTY}insert(t,e){return new rt(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,Et.BLACK,null,null))}remove(t){return new rt(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Et.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const n=this.comparator(t,e.key);if(n===0)return e.value;n<0?e=e.left:n>0&&(e=e.right)}return null}indexOf(t){let e=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(t,n.key);if(s===0)return e+n.left.size;s<0?n=n.left:(e+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal(((e,n)=>(t(e,n),!1)))}toString(){const t=[];return this.inorderTraversal(((e,n)=>(t.push(`${e}:${n}`),!1))),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Bs(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Bs(this.root,t,this.comparator,!1)}getReverseIterator(){return new Bs(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Bs(this.root,t,this.comparator,!0)}}class Bs{constructor(t,e,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!t.isEmpty();)if(i=e?n(t.key,e):1,e&&s&&(i*=-1),i<0)t=this.isReverse?t.left:t.right;else{if(i===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Et{constructor(t,e,n,s,i){this.key=t,this.value=e,this.color=n??Et.RED,this.left=s??Et.EMPTY,this.right=i??Et.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,n,s,i){return new Et(t??this.key,e??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,n){let s=this;const i=n(t,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(t,e,n),null):i===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Et.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let n,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return Et.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Et.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Et.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw O(43730,{key:this.key,value:this.value});if(this.right.isRed())throw O(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw O(27949);return t+(this.isRed()?0:1)}}Et.EMPTY=null,Et.RED=!0,Et.BLACK=!1;Et.EMPTY=new class{constructor(){this.size=0}get key(){throw O(57766)}get value(){throw O(16141)}get color(){throw O(16727)}get left(){throw O(29726)}get right(){throw O(36894)}copy(t,e,n,s,i){return this}insert(t,e,n){return new Et(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(t){this.comparator=t,this.data=new rt(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal(((e,n)=>(t(e),!1)))}forEachInRange(t,e){const n=this.data.getIteratorFrom(t[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let n;for(n=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();n.hasNext();)if(!t(n.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new hl(this.data.getIterator())}getIteratorFrom(t){return new hl(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach((n=>{e=e.add(n)})),e}isEqual(t){if(!(t instanceof et)||this.size!==t.size)return!1;const e=this.data.getIterator(),n=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const t=[];return this.forEach((e=>{t.push(e)})),t}toString(){const t=[];return this.forEach((e=>t.push(e))),"SortedSet("+t.toString()+")"}copy(t){const e=new et(this.comparator);return e.data=t,e}}class hl{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function vn(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(t){this.fields=t,t.sort(at.comparator)}static empty(){return new Ot([])}unionWith(t){let e=new et(at.comparator);for(const n of this.fields)e=e.add(n);for(const n of t)e=e.add(n);return new Ot(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return Ln(this.fields,t.fields,((e,n)=>e.isEqual(n)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ad extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(t){this.binaryString=t}static fromBase64String(t){const e=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Ad("Invalid base64 string: "+i):i}})(t);return new ht(e)}static fromUint8Array(t){const e=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(t);return new ht(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(e){return btoa(e)})(this.binaryString)}toUint8Array(){return(function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return j(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}ht.EMPTY_BYTE_STRING=new ht("");const B_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function he(r){if(L(!!r,39018),typeof r=="string"){let t=0;const e=B_.exec(r);if(L(!!e,46558,{timestamp:r}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:t}}return{seconds:it(r.seconds),nanos:it(r.nanos)}}function it(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function de(r){return typeof r=="string"?ht.fromBase64String(r):ht.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vd="server_timestamp",bd="__type__",Rd="__previous_value__",Sd="__local_write_time__";function Ba(r){var e,n;return((n=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[bd])==null?void 0:n.stringValue)===vd}function Oi(r){const t=r.mapValue.fields[Rd];return Ba(t)?Oi(t):t}function ns(r){const t=he(r.mapValue.fields[Sd].timestampValue);return new Z(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U_{constructor(t,e,n,s,i,o,c,u,h,f){this.databaseId=t,this.appId=e,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=h,this.isUsingEmulator=f}}const ci="(default)";class xe{constructor(t,e){this.projectId=t,this.database=e||ci}static empty(){return new xe("","")}get isDefaultDatabase(){return this.database===ci}isEqual(t){return t instanceof xe&&t.projectId===this.projectId&&t.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ua="__type__",Pd="__max__",Re={mapValue:{fields:{__type__:{stringValue:Pd}}}},qa="__vector__",zn="value",Ws={nullValue:"NULL_VALUE"};function Ne(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Ba(r)?4:Vd(r)?9007199254740991:Fi(r)?10:11:O(28295,{value:r})}function ne(r,t){if(r===t)return!0;const e=Ne(r);if(e!==Ne(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===t.booleanValue;case 4:return ns(r).isEqual(ns(t));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=he(s.timestampValue),c=he(i.timestampValue);return o.seconds===c.seconds&&o.nanos===c.nanos})(r,t);case 5:return r.stringValue===t.stringValue;case 6:return(function(s,i){return de(s.bytesValue).isEqual(de(i.bytesValue))})(r,t);case 7:return r.referenceValue===t.referenceValue;case 8:return(function(s,i){return it(s.geoPointValue.latitude)===it(i.geoPointValue.latitude)&&it(s.geoPointValue.longitude)===it(i.geoPointValue.longitude)})(r,t);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return it(s.integerValue)===it(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=it(s.doubleValue),c=it(i.doubleValue);return o===c?Yr(o)===Yr(c):isNaN(o)&&isNaN(c)}return!1})(r,t);case 9:return Ln(r.arrayValue.values||[],t.arrayValue.values||[],ne);case 10:case 11:return(function(s,i){const o=s.mapValue.fields||{},c=i.mapValue.fields||{};if(ll(o)!==ll(c))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(c[u]===void 0||!ne(o[u],c[u])))return!1;return!0})(r,t);default:return O(52216,{left:r})}}function rs(r,t){return(r.values||[]).find((e=>ne(e,t)))!==void 0}function ke(r,t){if(r===t)return 0;const e=Ne(r),n=Ne(t);if(e!==n)return j(e,n);switch(e){case 0:case 9007199254740991:return 0;case 1:return j(r.booleanValue,t.booleanValue);case 2:return(function(i,o){const c=it(i.integerValue||i.doubleValue),u=it(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(r,t);case 3:return dl(r.timestampValue,t.timestampValue);case 4:return dl(ns(r),ns(t));case 5:return ea(r.stringValue,t.stringValue);case 6:return(function(i,o){const c=de(i),u=de(o);return c.compareTo(u)})(r.bytesValue,t.bytesValue);case 7:return(function(i,o){const c=i.split("/"),u=o.split("/");for(let h=0;h<c.length&&h<u.length;h++){const f=j(c[h],u[h]);if(f!==0)return f}return j(c.length,u.length)})(r.referenceValue,t.referenceValue);case 8:return(function(i,o){const c=j(it(i.latitude),it(o.latitude));return c!==0?c:j(it(i.longitude),it(o.longitude))})(r.geoPointValue,t.geoPointValue);case 9:return fl(r.arrayValue,t.arrayValue);case 10:return(function(i,o){var g,R,D,N;const c=i.fields||{},u=o.fields||{},h=(g=c[zn])==null?void 0:g.arrayValue,f=(R=u[zn])==null?void 0:R.arrayValue,p=j(((D=h==null?void 0:h.values)==null?void 0:D.length)||0,((N=f==null?void 0:f.values)==null?void 0:N.length)||0);return p!==0?p:fl(h,f)})(r.mapValue,t.mapValue);case 11:return(function(i,o){if(i===Re.mapValue&&o===Re.mapValue)return 0;if(i===Re.mapValue)return 1;if(o===Re.mapValue)return-1;const c=i.fields||{},u=Object.keys(c),h=o.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let p=0;p<u.length&&p<f.length;++p){const g=ea(u[p],f[p]);if(g!==0)return g;const R=ke(c[u[p]],h[f[p]]);if(R!==0)return R}return j(u.length,f.length)})(r.mapValue,t.mapValue);default:throw O(23264,{he:e})}}function dl(r,t){if(typeof r=="string"&&typeof t=="string"&&r.length===t.length)return j(r,t);const e=he(r),n=he(t),s=j(e.seconds,n.seconds);return s!==0?s:j(e.nanos,n.nanos)}function fl(r,t){const e=r.values||[],n=t.values||[];for(let s=0;s<e.length&&s<n.length;++s){const i=ke(e[s],n[s]);if(i)return i}return j(e.length,n.length)}function Gn(r){return aa(r)}function aa(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(e){const n=he(e);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(e){return de(e).toBase64()})(r.bytesValue):"referenceValue"in r?(function(e){return M.fromName(e).toString()})(r.referenceValue):"geoPointValue"in r?(function(e){return`geo(${e.latitude},${e.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(e){let n="[",s=!0;for(const i of e.values||[])s?s=!1:n+=",",n+=aa(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(e){const n=Object.keys(e.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${aa(e.fields[o])}`;return s+"}"})(r.mapValue):O(61005,{value:r})}function Js(r){switch(Ne(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=Oi(r);return t?16+Js(t):16;case 5:return 2*r.stringValue.length;case 6:return de(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+Js(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return Be(n.fields,((i,o)=>{s+=i.length+Js(o)})),s})(r.mapValue);default:throw O(13486,{value:r})}}function ss(r,t){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${t.path.canonicalString()}`}}function ca(r){return!!r&&"integerValue"in r}function is(r){return!!r&&"arrayValue"in r}function ml(r){return!!r&&"nullValue"in r}function pl(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Xs(r){return!!r&&"mapValue"in r}function Fi(r){var e,n;return((n=(((e=r==null?void 0:r.mapValue)==null?void 0:e.fields)||{})[Ua])==null?void 0:n.stringValue)===qa}function zr(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const t={mapValue:{fields:{}}};return Be(r.mapValue.fields,((e,n)=>t.mapValue.fields[e]=zr(n))),t}if(r.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(r.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=zr(r.arrayValue.values[e]);return t}return{...r}}function Vd(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===Pd}const Cd={mapValue:{fields:{[Ua]:{stringValue:qa},[zn]:{arrayValue:{}}}}};function q_(r){return"nullValue"in r?Ws:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?ss(xe.empty(),M.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?Fi(r)?Cd:{mapValue:{}}:O(35942,{value:r})}function j_(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?ss(xe.empty(),M.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?Cd:"mapValue"in r?Fi(r)?{mapValue:{}}:Re:O(61959,{value:r})}function gl(r,t){const e=ke(r.value,t.value);return e!==0?e:r.inclusive&&!t.inclusive?-1:!r.inclusive&&t.inclusive?1:0}function _l(r,t){const e=ke(r.value,t.value);return e!==0?e:r.inclusive&&!t.inclusive?1:!r.inclusive&&t.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wt{constructor(t){this.value=t}static empty(){return new wt({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let n=0;n<t.length-1;++n)if(e=(e.mapValue.fields||{})[t.get(n)],!Xs(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=zr(e)}setAll(t){let e=at.emptyPath(),n={},s=[];t.forEach(((o,c)=>{if(!e.isImmediateParentOf(c)){const u=this.getFieldsMap(e);this.applyChanges(u,n,s),n={},s=[],e=c.popLast()}o?n[c.lastSegment()]=zr(o):s.push(c.lastSegment())}));const i=this.getFieldsMap(e);this.applyChanges(i,n,s)}delete(t){const e=this.field(t.popLast());Xs(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return ne(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let n=0;n<t.length;++n){let s=e.mapValue.fields[t.get(n)];Xs(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(n)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,n){Be(e,((s,i)=>t[s]=i));for(const s of n)delete t[s]}clone(){return new wt(zr(this.value))}}function Dd(r){const t=[];return Be(r.fields,((e,n)=>{const s=new at([e]);if(Xs(n)){const i=Dd(n.mapValue).fields;if(i.length===0)t.push(s);else for(const o of i)t.push(s.child(o))}else t.push(s)})),new Ot(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(t,e,n,s,i,o,c){this.key=t,this.documentType=e,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=c}static newInvalidDocument(t){return new ot(t,0,B.min(),B.min(),B.min(),wt.empty(),0)}static newFoundDocument(t,e,n,s){return new ot(t,1,e,B.min(),n,s,0)}static newNoDocument(t,e){return new ot(t,2,e,B.min(),B.min(),wt.empty(),0)}static newUnknownDocument(t,e){return new ot(t,3,e,B.min(),B.min(),wt.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(B.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=wt.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=wt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=B.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof ot&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new ot(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kn{constructor(t,e){this.position=t,this.inclusive=e}}function yl(r,t,e){let n=0;for(let s=0;s<r.position.length;s++){const i=t[s],o=r.position[s];if(i.field.isKeyField()?n=M.comparator(M.fromName(o.referenceValue),e.key):n=ke(o,e.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function Il(r,t){if(r===null)return t===null;if(t===null||r.inclusive!==t.inclusive||r.position.length!==t.position.length)return!1;for(let e=0;e<r.position.length;e++)if(!ne(r.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(t,e="asc"){this.field=t,this.dir=e}}function $_(r,t){return r.dir===t.dir&&r.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xd{}class K extends xd{constructor(t,e,n){super(),this.field=t,this.op=e,this.value=n}static create(t,e,n){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,n):new z_(t,e,n):e==="array-contains"?new H_(t,n):e==="in"?new Ld(t,n):e==="not-in"?new Q_(t,n):e==="array-contains-any"?new W_(t,n):new K(t,e,n)}static createKeyFieldInFilter(t,e,n){return e==="in"?new G_(t,n):new K_(t,n)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(ke(e,this.value)):e!==null&&Ne(this.value)===Ne(e)&&this.matchesComparison(ke(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return O(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class tt extends xd{constructor(t,e){super(),this.filters=t,this.op=e,this.Pe=null}static create(t,e){return new tt(t,e)}matches(t){return Hn(this)?this.filters.find((e=>!e.matches(t)))===void 0:this.filters.find((e=>e.matches(t)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((t,e)=>t.concat(e.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Hn(r){return r.op==="and"}function ua(r){return r.op==="or"}function ja(r){return Nd(r)&&Hn(r)}function Nd(r){for(const t of r.filters)if(t instanceof tt)return!1;return!0}function la(r){if(r instanceof K)return r.field.canonicalString()+r.op.toString()+Gn(r.value);if(ja(r))return r.filters.map((t=>la(t))).join(",");{const t=r.filters.map((e=>la(e))).join(",");return`${r.op}(${t})`}}function kd(r,t){return r instanceof K?(function(n,s){return s instanceof K&&n.op===s.op&&n.field.isEqual(s.field)&&ne(n.value,s.value)})(r,t):r instanceof tt?(function(n,s){return s instanceof tt&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,c)=>i&&kd(o,s.filters[c])),!0):!1})(r,t):void O(19439)}function Md(r,t){const e=r.filters.concat(t);return tt.create(e,r.op)}function Od(r){return r instanceof K?(function(e){return`${e.field.canonicalString()} ${e.op} ${Gn(e.value)}`})(r):r instanceof tt?(function(e){return e.op.toString()+" {"+e.getFilters().map(Od).join(" ,")+"}"})(r):"Filter"}class z_ extends K{constructor(t,e,n){super(t,e,n),this.key=M.fromName(n.referenceValue)}matches(t){const e=M.comparator(t.key,this.key);return this.matchesComparison(e)}}class G_ extends K{constructor(t,e){super(t,"in",e),this.keys=Fd("in",e)}matches(t){return this.keys.some((e=>e.isEqual(t.key)))}}class K_ extends K{constructor(t,e){super(t,"not-in",e),this.keys=Fd("not-in",e)}matches(t){return!this.keys.some((e=>e.isEqual(t.key)))}}function Fd(r,t){var e;return(((e=t.arrayValue)==null?void 0:e.values)||[]).map((n=>M.fromName(n.referenceValue)))}class H_ extends K{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return is(e)&&rs(e.arrayValue,this.value)}}class Ld extends K{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&rs(this.value.arrayValue,e)}}class Q_ extends K{constructor(t,e){super(t,"not-in",e)}matches(t){if(rs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!rs(this.value.arrayValue,e)}}class W_ extends K{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!is(e)||!e.arrayValue.values)&&e.arrayValue.values.some((n=>rs(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J_{constructor(t,e=null,n=[],s=[],i=null,o=null,c=null){this.path=t,this.collectionGroup=e,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=c,this.Te=null}}function ha(r,t=null,e=[],n=[],s=null,i=null,o=null){return new J_(r,t,e,n,s,i,o)}function un(r){const t=F(r);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map((n=>la(n))).join(","),e+="|ob:",e+=t.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),ms(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map((n=>Gn(n))).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map((n=>Gn(n))).join(",")),t.Te=e}return t.Te}function gs(r,t){if(r.limit!==t.limit||r.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<r.orderBy.length;e++)if(!$_(r.orderBy[e],t.orderBy[e]))return!1;if(r.filters.length!==t.filters.length)return!1;for(let e=0;e<r.filters.length;e++)if(!kd(r.filters[e],t.filters[e]))return!1;return r.collectionGroup===t.collectionGroup&&!!r.path.isEqual(t.path)&&!!Il(r.startAt,t.startAt)&&Il(r.endAt,t.endAt)}function ui(r){return M.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function li(r,t){return r.filters.filter((e=>e instanceof K&&e.field.isEqual(t)))}function Tl(r,t,e){let n=Ws,s=!0;for(const i of li(r,t)){let o=Ws,c=!0;switch(i.op){case"<":case"<=":o=q_(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,c=!1;break;case"!=":case"not-in":o=Ws}gl({value:n,inclusive:s},{value:o,inclusive:c})<0&&(n=o,s=c)}if(e!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(t)){const o=e.position[i];gl({value:n,inclusive:s},{value:o,inclusive:e.inclusive})<0&&(n=o,s=e.inclusive);break}}return{value:n,inclusive:s}}function El(r,t,e){let n=Re,s=!0;for(const i of li(r,t)){let o=Re,c=!0;switch(i.op){case">=":case">":o=j_(i.value),c=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,c=!1;break;case"!=":case"not-in":o=Re}_l({value:n,inclusive:s},{value:o,inclusive:c})>0&&(n=o,s=c)}if(e!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(t)){const o=e.position[i];_l({value:n,inclusive:s},{value:o,inclusive:e.inclusive})>0&&(n=o,s=e.inclusive);break}}return{value:n,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sr{constructor(t,e=null,n=[],s=[],i=null,o="F",c=null,u=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=c,this.endAt=u,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Bd(r,t,e,n,s,i,o,c){return new sr(r,t,e,n,s,i,o,c)}function _s(r){return new sr(r)}function wl(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Ud(r){return r.collectionGroup!==null}function Gr(r){const t=F(r);if(t.Ie===null){t.Ie=[];const e=new Set;for(const i of t.explicitOrderBy)t.Ie.push(i),e.add(i.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new et(at.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((h=>{h.isInequality()&&(c=c.add(h.field))}))})),c})(t).forEach((i=>{e.has(i.canonicalString())||i.isKeyField()||t.Ie.push(new os(i,n))})),e.has(at.keyField().canonicalString())||t.Ie.push(new os(at.keyField(),n))}return t.Ie}function Ut(r){const t=F(r);return t.Ee||(t.Ee=X_(t,Gr(r))),t.Ee}function X_(r,t){if(r.limitType==="F")return ha(r.path,r.collectionGroup,t,r.filters,r.limit,r.startAt,r.endAt);{t=t.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new os(s.field,i)}));const e=r.endAt?new Kn(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new Kn(r.startAt.position,r.startAt.inclusive):null;return ha(r.path,r.collectionGroup,t,r.filters,r.limit,e,n)}}function da(r,t){const e=r.filters.concat([t]);return new sr(r.path,r.collectionGroup,r.explicitOrderBy.slice(),e,r.limit,r.limitType,r.startAt,r.endAt)}function hi(r,t,e){return new sr(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),t,e,r.startAt,r.endAt)}function Li(r,t){return gs(Ut(r),Ut(t))&&r.limitType===t.limitType}function qd(r){return`${un(Ut(r))}|lt:${r.limitType}`}function Cn(r){return`Query(target=${(function(e){let n=e.path.canonicalString();return e.collectionGroup!==null&&(n+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(n+=`, filters: [${e.filters.map((s=>Od(s))).join(", ")}]`),ms(e.limit)||(n+=", limit: "+e.limit),e.orderBy.length>0&&(n+=`, orderBy: [${e.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),e.startAt&&(n+=", startAt: ",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map((s=>Gn(s))).join(",")),e.endAt&&(n+=", endAt: ",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map((s=>Gn(s))).join(",")),`Target(${n})`})(Ut(r))}; limitType=${r.limitType})`}function ys(r,t){return t.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):M.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,t)&&(function(n,s){for(const i of Gr(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,t)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,t)&&(function(n,s){return!(n.startAt&&!(function(o,c,u){const h=yl(o,c,u);return o.inclusive?h<=0:h<0})(n.startAt,Gr(n),s)||n.endAt&&!(function(o,c,u){const h=yl(o,c,u);return o.inclusive?h>=0:h>0})(n.endAt,Gr(n),s))})(r,t)}function jd(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function $d(r){return(t,e)=>{let n=!1;for(const s of Gr(r)){const i=Y_(s,t,e);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function Y_(r,t,e){const n=r.field.isKeyField()?M.comparator(t.key,e.key):(function(i,o,c){const u=o.data.field(i),h=c.data.field(i);return u!==null&&h!==null?ke(u,h):O(42886)})(r.field,t,e);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return O(19790,{direction:r.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,t))return i}}has(t){return this.get(t)!==void 0}set(t,e){const n=this.mapKeyFn(t),s=this.inner[n];if(s===void 0)return this.inner[n]=[[t,e]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],t))return void(s[i]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],t))return n.length===1?delete this.inner[e]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(t){Be(this.inner,((e,n)=>{for(const[s,i]of n)t(s,i)}))}isEmpty(){return wd(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z_=new rt(M.comparator);function Bt(){return Z_}const zd=new rt(M.comparator);function Or(...r){let t=zd;for(const e of r)t=t.insert(e.key,e);return t}function Gd(r){let t=zd;return r.forEach(((e,n)=>t=t.insert(e,n.overlayedDocument))),t}function te(){return Kr()}function Kd(){return Kr()}function Kr(){return new me((r=>r.toString()),((r,t)=>r.isEqual(t)))}const ty=new rt(M.comparator),ey=new et(M.comparator);function G(...r){let t=ey;for(const e of r)t=t.add(e);return t}const ny=new et(j);function $a(){return ny}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function za(r,t){if(r.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Yr(t)?"-0":t}}function Hd(r){return{integerValue:""+r}}function ry(r,t){return hd(t)?Hd(t):za(r,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi{constructor(){this._=void 0}}function sy(r,t,e){return r instanceof Qn?(function(s,i){const o={fields:{[bd]:{stringValue:vd},[Sd]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Ba(i)&&(i=Oi(i)),i&&(o.fields[Rd]=i),{mapValue:o}})(e,t):r instanceof ln?Wd(r,t):r instanceof Wn?Jd(r,t):(function(s,i){const o=Qd(s,i),c=Al(o)+Al(s.Ae);return ca(o)&&ca(s.Ae)?Hd(c):za(s.serializer,c)})(r,t)}function iy(r,t,e){return r instanceof ln?Wd(r,t):r instanceof Wn?Jd(r,t):e}function Qd(r,t){return r instanceof as?(function(n){return ca(n)||(function(i){return!!i&&"doubleValue"in i})(n)})(t)?t:{integerValue:0}:null}class Qn extends Bi{}class ln extends Bi{constructor(t){super(),this.elements=t}}function Wd(r,t){const e=Xd(t);for(const n of r.elements)e.some((s=>ne(s,n)))||e.push(n);return{arrayValue:{values:e}}}class Wn extends Bi{constructor(t){super(),this.elements=t}}function Jd(r,t){let e=Xd(t);for(const n of r.elements)e=e.filter((s=>!ne(s,n)));return{arrayValue:{values:e}}}class as extends Bi{constructor(t,e){super(),this.serializer=t,this.Ae=e}}function Al(r){return it(r.integerValue||r.doubleValue)}function Xd(r){return is(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(t,e){this.field=t,this.transform=e}}function oy(r,t){return r.field.isEqual(t.field)&&(function(n,s){return n instanceof ln&&s instanceof ln||n instanceof Wn&&s instanceof Wn?Ln(n.elements,s.elements,ne):n instanceof as&&s instanceof as?ne(n.Ae,s.Ae):n instanceof Qn&&s instanceof Qn})(r.transform,t.transform)}class ay{constructor(t,e){this.version=t,this.transformResults=e}}class ct{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new ct}static exists(t){return new ct(void 0,t)}static updateTime(t){return new ct(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function Ys(r,t){return r.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(r.updateTime):r.exists===void 0||r.exists===t.isFoundDocument()}class Ui{}function Yd(r,t){if(!r.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return r.isNoDocument()?new or(r.key,ct.none()):new ir(r.key,r.data,ct.none());{const e=r.data,n=wt.empty();let s=new et(at.comparator);for(let i of t.fields)if(!s.has(i)){let o=e.field(i);o===null&&i.length>1&&(i=i.popLast(),o=e.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new pe(r.key,n,new Ot(s.toArray()),ct.none())}}function cy(r,t,e){r instanceof ir?(function(s,i,o){const c=s.value.clone(),u=bl(s.fieldTransforms,i,o.transformResults);c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(r,t,e):r instanceof pe?(function(s,i,o){if(!Ys(s.precondition,i))return void i.convertToUnknownDocument(o.version);const c=bl(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(Zd(s)),u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,t,e):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,t,e)}function Hr(r,t,e,n){return r instanceof ir?(function(i,o,c,u){if(!Ys(i.precondition,o))return c;const h=i.value.clone(),f=Rl(i.fieldTransforms,u,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null})(r,t,e,n):r instanceof pe?(function(i,o,c,u){if(!Ys(i.precondition,o))return c;const h=Rl(i.fieldTransforms,u,o),f=o.data;return f.setAll(Zd(i)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((p=>p.field)))})(r,t,e,n):(function(i,o,c){return Ys(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c})(r,t,e)}function uy(r,t){let e=null;for(const n of r.fieldTransforms){const s=t.data.field(n.field),i=Qd(n.transform,s||null);i!=null&&(e===null&&(e=wt.empty()),e.set(n.field,i))}return e||null}function vl(r,t){return r.type===t.type&&!!r.key.isEqual(t.key)&&!!r.precondition.isEqual(t.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&Ln(n,s,((i,o)=>oy(i,o)))})(r.fieldTransforms,t.fieldTransforms)&&(r.type===0?r.value.isEqual(t.value):r.type!==1||r.data.isEqual(t.data)&&r.fieldMask.isEqual(t.fieldMask))}class ir extends Ui{constructor(t,e,n,s=[]){super(),this.key=t,this.value=e,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class pe extends Ui{constructor(t,e,n,s,i=[]){super(),this.key=t,this.data=e,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Zd(r){const t=new Map;return r.fieldMask.fields.forEach((e=>{if(!e.isEmpty()){const n=r.data.field(e);t.set(e,n)}})),t}function bl(r,t,e){const n=new Map;L(r.length===e.length,32656,{Re:e.length,Ve:r.length});for(let s=0;s<e.length;s++){const i=r[s],o=i.transform,c=t.data.field(i.field);n.set(i.field,iy(o,c,e[s]))}return n}function Rl(r,t,e){const n=new Map;for(const s of r){const i=s.transform,o=e.data.field(s.field);n.set(s.field,sy(i,o,t))}return n}class or extends Ui{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Ka extends Ui{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ha{constructor(t,e,n,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(t,e){const n=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(t.key)&&cy(i,t,n[s])}}applyToLocalView(t,e){for(const n of this.baseMutations)n.key.isEqual(t.key)&&(e=Hr(n,t,e,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(t.key)&&(e=Hr(n,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const n=Kd();return this.mutations.forEach((s=>{const i=t.get(s.key),o=i.overlayedDocument;let c=this.applyToLocalView(o,i.mutatedFields);c=e.has(s.key)?null:c;const u=Yd(o,c);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(B.min())})),n}keys(){return this.mutations.reduce(((t,e)=>t.add(e.key)),G())}isEqual(t){return this.batchId===t.batchId&&Ln(this.mutations,t.mutations,((e,n)=>vl(e,n)))&&Ln(this.baseMutations,t.baseMutations,((e,n)=>vl(e,n)))}}class Qa{constructor(t,e,n,s){this.batch=t,this.commitVersion=e,this.mutationResults=n,this.docVersions=s}static from(t,e,n){L(t.mutations.length===n.length,58842,{me:t.mutations.length,fe:n.length});let s=(function(){return ty})();const i=t.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new Qa(t,e,n,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wa{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ly{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ft,Q;function tf(r){switch(r){case P.OK:return O(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return O(15467,{code:r})}}function ef(r){if(r===void 0)return dt("GRPC error has no .code"),P.UNKNOWN;switch(r){case ft.OK:return P.OK;case ft.CANCELLED:return P.CANCELLED;case ft.UNKNOWN:return P.UNKNOWN;case ft.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case ft.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case ft.INTERNAL:return P.INTERNAL;case ft.UNAVAILABLE:return P.UNAVAILABLE;case ft.UNAUTHENTICATED:return P.UNAUTHENTICATED;case ft.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case ft.NOT_FOUND:return P.NOT_FOUND;case ft.ALREADY_EXISTS:return P.ALREADY_EXISTS;case ft.PERMISSION_DENIED:return P.PERMISSION_DENIED;case ft.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case ft.ABORTED:return P.ABORTED;case ft.OUT_OF_RANGE:return P.OUT_OF_RANGE;case ft.UNIMPLEMENTED:return P.UNIMPLEMENTED;case ft.DATA_LOSS:return P.DATA_LOSS;default:return O(39323,{code:r})}}(Q=ft||(ft={}))[Q.OK=0]="OK",Q[Q.CANCELLED=1]="CANCELLED",Q[Q.UNKNOWN=2]="UNKNOWN",Q[Q.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Q[Q.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Q[Q.NOT_FOUND=5]="NOT_FOUND",Q[Q.ALREADY_EXISTS=6]="ALREADY_EXISTS",Q[Q.PERMISSION_DENIED=7]="PERMISSION_DENIED",Q[Q.UNAUTHENTICATED=16]="UNAUTHENTICATED",Q[Q.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Q[Q.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Q[Q.ABORTED=10]="ABORTED",Q[Q.OUT_OF_RANGE=11]="OUT_OF_RANGE",Q[Q.UNIMPLEMENTED=12]="UNIMPLEMENTED",Q[Q.INTERNAL=13]="INTERNAL",Q[Q.UNAVAILABLE=14]="UNAVAILABLE",Q[Q.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hy(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dy=new Ve([4294967295,4294967295],0);function Sl(r){const t=hy().encode(r),e=new Qh;return e.update(t),new Uint8Array(e.digest())}function Pl(r){const t=new DataView(r.buffer),e=t.getUint32(0,!0),n=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new Ve([e,n],0),new Ve([s,i],0)]}class Ja{constructor(t,e,n){if(this.bitmap=t,this.padding=e,this.hashCount=n,e<0||e>=8)throw new Fr(`Invalid padding: ${e}`);if(n<0)throw new Fr(`Invalid hash count: ${n}`);if(t.length>0&&this.hashCount===0)throw new Fr(`Invalid hash count: ${n}`);if(t.length===0&&e!==0)throw new Fr(`Invalid padding when bitmap length is 0: ${e}`);this.ge=8*t.length-e,this.pe=Ve.fromNumber(this.ge)}ye(t,e,n){let s=t.add(e.multiply(Ve.fromNumber(n)));return s.compare(dy)===1&&(s=new Ve([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.ge===0)return!1;const e=Sl(t),[n,s]=Pl(e);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);if(!this.we(o))return!1}return!0}static create(t,e,n){const s=t%8==0?0:8-t%8,i=new Uint8Array(Math.ceil(t/8)),o=new Ja(i,s,e);return n.forEach((c=>o.insert(c))),o}insert(t){if(this.ge===0)return;const e=Sl(t),[n,s]=Pl(e);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);this.Se(o)}}Se(t){const e=Math.floor(t/8),n=t%8;this.bitmap[e]|=1<<n}}class Fr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Is{constructor(t,e,n,s,i){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(t,e,n){const s=new Map;return s.set(t,Ts.createSynthesizedTargetChangeForCurrentChange(t,e,n)),new Is(B.min(),s,new rt(j),Bt(),G())}}class Ts{constructor(t,e,n,s,i){this.resumeToken=t,this.current=e,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,e,n){return new Ts(n,e,G(),G(),G())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zs{constructor(t,e,n,s){this.be=t,this.removedTargetIds=e,this.key=n,this.De=s}}class nf{constructor(t,e){this.targetId=t,this.Ce=e}}class rf{constructor(t,e,n=ht.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=n,this.cause=s}}class Vl{constructor(){this.ve=0,this.Fe=Cl(),this.Me=ht.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(t){t.approximateByteSize()>0&&(this.Oe=!0,this.Me=t)}ke(){let t=G(),e=G(),n=G();return this.Fe.forEach(((s,i)=>{switch(i){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:n=n.add(s);break;default:O(38017,{changeType:i})}})),new Ts(this.Me,this.xe,t,e,n)}qe(){this.Oe=!1,this.Fe=Cl()}Qe(t,e){this.Oe=!0,this.Fe=this.Fe.insert(t,e)}$e(t){this.Oe=!0,this.Fe=this.Fe.remove(t)}Ue(){this.ve+=1}Ke(){this.ve-=1,L(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class fy{constructor(t){this.Ge=t,this.ze=new Map,this.je=Bt(),this.Je=Us(),this.He=Us(),this.Ye=new rt(j)}Ze(t){for(const e of t.be)t.De&&t.De.isFoundDocument()?this.Xe(e,t.De):this.et(e,t.key,t.De);for(const e of t.removedTargetIds)this.et(e,t.key,t.De)}tt(t){this.forEachTarget(t,(e=>{const n=this.nt(e);switch(t.state){case 0:this.rt(e)&&n.Le(t.resumeToken);break;case 1:n.Ke(),n.Ne||n.qe(),n.Le(t.resumeToken);break;case 2:n.Ke(),n.Ne||this.removeTarget(e);break;case 3:this.rt(e)&&(n.We(),n.Le(t.resumeToken));break;case 4:this.rt(e)&&(this.it(e),n.Le(t.resumeToken));break;default:O(56790,{state:t.state})}}))}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.ze.forEach(((n,s)=>{this.rt(s)&&e(s)}))}st(t){const e=t.targetId,n=t.Ce.count,s=this.ot(e);if(s){const i=s.target;if(ui(i))if(n===0){const o=new M(i.path);this.et(e,o,ot.newNoDocument(o,B.min()))}else L(n===1,20013,{expectedCount:n});else{const o=this._t(e);if(o!==n){const c=this.ut(t),u=c?this.ct(c,t,o):1;if(u!==0){this.it(e);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(e,h)}}}}}ut(t){const e=t.Ce.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=e;let o,c;try{o=de(n).toUint8Array()}catch(u){if(u instanceof Ad)return Fn("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new Ja(o,s,i)}catch(u){return Fn(u instanceof Fr?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.ge===0?null:c}ct(t,e,n){return e.Ce.count===n-this.Pt(t,e.targetId)?0:2}Pt(t,e){const n=this.Ge.getRemoteKeysForTarget(e);let s=0;return n.forEach((i=>{const o=this.Ge.ht(),c=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;t.mightContain(c)||(this.et(e,i,null),s++)})),s}Tt(t){const e=new Map;this.ze.forEach(((i,o)=>{const c=this.ot(o);if(c){if(i.current&&ui(c.target)){const u=new M(c.target.path);this.It(u).has(o)||this.Et(o,u)||this.et(o,u,ot.newNoDocument(u,t))}i.Be&&(e.set(o,i.ke()),i.qe())}}));let n=G();this.He.forEach(((i,o)=>{let c=!0;o.forEachWhile((u=>{const h=this.ot(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(n=n.add(i))})),this.je.forEach(((i,o)=>o.setReadTime(t)));const s=new Is(t,e,this.Ye,this.je,n);return this.je=Bt(),this.Je=Us(),this.He=Us(),this.Ye=new rt(j),s}Xe(t,e){if(!this.rt(t))return;const n=this.Et(t,e.key)?2:0;this.nt(t).Qe(e.key,n),this.je=this.je.insert(e.key,e),this.Je=this.Je.insert(e.key,this.It(e.key).add(t)),this.He=this.He.insert(e.key,this.dt(e.key).add(t))}et(t,e,n){if(!this.rt(t))return;const s=this.nt(t);this.Et(t,e)?s.Qe(e,1):s.$e(e),this.He=this.He.insert(e,this.dt(e).delete(t)),this.He=this.He.insert(e,this.dt(e).add(t)),n&&(this.je=this.je.insert(e,n))}removeTarget(t){this.ze.delete(t)}_t(t){const e=this.nt(t).ke();return this.Ge.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}Ue(t){this.nt(t).Ue()}nt(t){let e=this.ze.get(t);return e||(e=new Vl,this.ze.set(t,e)),e}dt(t){let e=this.He.get(t);return e||(e=new et(j),this.He=this.He.insert(t,e)),e}It(t){let e=this.Je.get(t);return e||(e=new et(j),this.Je=this.Je.insert(t,e)),e}rt(t){const e=this.ot(t)!==null;return e||V("WatchChangeAggregator","Detected inactive target",t),e}ot(t){const e=this.ze.get(t);return e&&e.Ne?null:this.Ge.At(t)}it(t){this.ze.set(t,new Vl),this.Ge.getRemoteKeysForTarget(t).forEach((e=>{this.et(t,e,null)}))}Et(t,e){return this.Ge.getRemoteKeysForTarget(t).has(e)}}function Us(){return new rt(M.comparator)}function Cl(){return new rt(M.comparator)}const my={asc:"ASCENDING",desc:"DESCENDING"},py={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},gy={and:"AND",or:"OR"};class _y{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function fa(r,t){return r.useProto3Json||ms(t)?t:{value:t}}function Jn(r,t){return r.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function sf(r,t){return r.useProto3Json?t.toBase64():t.toUint8Array()}function yy(r,t){return Jn(r,t.toTimestamp())}function Tt(r){return L(!!r,49232),B.fromTimestamp((function(e){const n=he(e);return new Z(n.seconds,n.nanos)})(r))}function Xa(r,t){return ma(r,t).canonicalString()}function ma(r,t){const e=(function(s){return new J(["projects",s.projectId,"databases",s.database])})(r).child("documents");return t===void 0?e:e.child(t)}function of(r){const t=J.fromString(r);return L(pf(t),10190,{key:t.toString()}),t}function cs(r,t){return Xa(r.databaseId,t.path)}function oe(r,t){const e=of(t);if(e.get(1)!==r.databaseId.projectId)throw new C(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+r.databaseId.projectId);if(e.get(3)!==r.databaseId.database)throw new C(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+r.databaseId.database);return new M(uf(e))}function af(r,t){return Xa(r.databaseId,t)}function cf(r){const t=of(r);return t.length===4?J.emptyPath():uf(t)}function pa(r){return new J(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function uf(r){return L(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Dl(r,t,e){return{name:cs(r,t),fields:e.value.mapValue.fields}}function Iy(r,t,e){const n=oe(r,t.name),s=Tt(t.updateTime),i=t.createTime?Tt(t.createTime):B.min(),o=new wt({mapValue:{fields:t.fields}}),c=ot.newFoundDocument(n,s,i,o);return e&&c.setHasCommittedMutations(),e?c.setHasCommittedMutations():c}function Ty(r,t){return"found"in t?(function(n,s){L(!!s.found,43571),s.found.name,s.found.updateTime;const i=oe(n,s.found.name),o=Tt(s.found.updateTime),c=s.found.createTime?Tt(s.found.createTime):B.min(),u=new wt({mapValue:{fields:s.found.fields}});return ot.newFoundDocument(i,o,c,u)})(r,t):"missing"in t?(function(n,s){L(!!s.missing,3894),L(!!s.readTime,22933);const i=oe(n,s.missing),o=Tt(s.readTime);return ot.newNoDocument(i,o)})(r,t):O(7234,{result:t})}function Ey(r,t){let e;if("targetChange"in t){t.targetChange;const n=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:O(39313,{state:h})})(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],i=(function(h,f){return h.useProto3Json?(L(f===void 0||typeof f=="string",58123),ht.fromBase64String(f||"")):(L(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),ht.fromUint8Array(f||new Uint8Array))})(r,t.targetChange.resumeToken),o=t.targetChange.cause,c=o&&(function(h){const f=h.code===void 0?P.UNKNOWN:ef(h.code);return new C(f,h.message||"")})(o);e=new rf(n,s,i,c||null)}else if("documentChange"in t){t.documentChange;const n=t.documentChange;n.document,n.document.name,n.document.updateTime;const s=oe(r,n.document.name),i=Tt(n.document.updateTime),o=n.document.createTime?Tt(n.document.createTime):B.min(),c=new wt({mapValue:{fields:n.document.fields}}),u=ot.newFoundDocument(s,i,o,c),h=n.targetIds||[],f=n.removedTargetIds||[];e=new Zs(h,f,u.key,u)}else if("documentDelete"in t){t.documentDelete;const n=t.documentDelete;n.document;const s=oe(r,n.document),i=n.readTime?Tt(n.readTime):B.min(),o=ot.newNoDocument(s,i),c=n.removedTargetIds||[];e=new Zs([],c,o.key,o)}else if("documentRemove"in t){t.documentRemove;const n=t.documentRemove;n.document;const s=oe(r,n.document),i=n.removedTargetIds||[];e=new Zs([],i,s,null)}else{if(!("filter"in t))return O(11601,{Rt:t});{t.filter;const n=t.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new ly(s,i),c=n.targetId;e=new nf(c,o)}}return e}function us(r,t){let e;if(t instanceof ir)e={update:Dl(r,t.key,t.value)};else if(t instanceof or)e={delete:cs(r,t.key)};else if(t instanceof pe)e={update:Dl(r,t.key,t.data),updateMask:Sy(t.fieldMask)};else{if(!(t instanceof Ka))return O(16599,{Vt:t.type});e={verify:cs(r,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map((n=>(function(i,o){const c=o.transform;if(c instanceof Qn)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof ln)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Wn)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof as)return{fieldPath:o.field.canonicalString(),increment:c.Ae};throw O(20930,{transform:o.transform})})(0,n)))),t.precondition.isNone||(e.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:yy(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:O(27497)})(r,t.precondition)),e}function ga(r,t){const e=t.currentDocument?(function(i){return i.updateTime!==void 0?ct.updateTime(Tt(i.updateTime)):i.exists!==void 0?ct.exists(i.exists):ct.none()})(t.currentDocument):ct.none(),n=t.updateTransforms?t.updateTransforms.map((s=>(function(o,c){let u=null;if("setToServerValue"in c)L(c.setToServerValue==="REQUEST_TIME",16630,{proto:c}),u=new Qn;else if("appendMissingElements"in c){const f=c.appendMissingElements.values||[];u=new ln(f)}else if("removeAllFromArray"in c){const f=c.removeAllFromArray.values||[];u=new Wn(f)}else"increment"in c?u=new as(o,c.increment):O(16584,{proto:c});const h=at.fromServerFormat(c.fieldPath);return new Ga(h,u)})(r,s))):[];if(t.update){t.update.name;const s=oe(r,t.update.name),i=new wt({mapValue:{fields:t.update.fields}});if(t.updateMask){const o=(function(u){const h=u.fieldPaths||[];return new Ot(h.map((f=>at.fromServerFormat(f))))})(t.updateMask);return new pe(s,i,o,e,n)}return new ir(s,i,e,n)}if(t.delete){const s=oe(r,t.delete);return new or(s,e)}if(t.verify){const s=oe(r,t.verify);return new Ka(s,e)}return O(1463,{proto:t})}function wy(r,t){return r&&r.length>0?(L(t!==void 0,14353),r.map((e=>(function(s,i){let o=s.updateTime?Tt(s.updateTime):Tt(i);return o.isEqual(B.min())&&(o=Tt(i)),new ay(o,s.transformResults||[])})(e,t)))):[]}function lf(r,t){return{documents:[af(r,t.path)]}}function hf(r,t){const e={structuredQuery:{}},n=t.path;let s;t.collectionGroup!==null?(s=n,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=n.popLast(),e.structuredQuery.from=[{collectionId:n.lastSegment()}]),e.parent=af(r,s);const i=(function(h){if(h.length!==0)return mf(tt.create(h,"and"))})(t.filters);i&&(e.structuredQuery.where=i);const o=(function(h){if(h.length!==0)return h.map((f=>(function(g){return{field:Dn(g.field),direction:vy(g.dir)}})(f)))})(t.orderBy);o&&(e.structuredQuery.orderBy=o);const c=fa(r,t.limit);return c!==null&&(e.structuredQuery.limit=c),t.startAt&&(e.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(t.startAt)),t.endAt&&(e.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(t.endAt)),{ft:e,parent:s}}function df(r){let t=cf(r.parent);const e=r.structuredQuery,n=e.from?e.from.length:0;let s=null;if(n>0){L(n===1,65062);const f=e.from[0];f.allDescendants?s=f.collectionId:t=t.child(f.collectionId)}let i=[];e.where&&(i=(function(p){const g=ff(p);return g instanceof tt&&ja(g)?g.getFilters():[g]})(e.where));let o=[];e.orderBy&&(o=(function(p){return p.map((g=>(function(D){return new os(xn(D.field),(function(x){switch(x){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(D.direction))})(g)))})(e.orderBy));let c=null;e.limit&&(c=(function(p){let g;return g=typeof p=="object"?p.value:p,ms(g)?null:g})(e.limit));let u=null;e.startAt&&(u=(function(p){const g=!!p.before,R=p.values||[];return new Kn(R,g)})(e.startAt));let h=null;return e.endAt&&(h=(function(p){const g=!p.before,R=p.values||[];return new Kn(R,g)})(e.endAt)),Bd(t,s,o,i,c,"F",u,h)}function Ay(r,t){const e=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return O(28987,{purpose:s})}})(t.purpose);return e==null?null:{"goog-listen-tags":e}}function ff(r){return r.unaryFilter!==void 0?(function(e){switch(e.unaryFilter.op){case"IS_NAN":const n=xn(e.unaryFilter.field);return K.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=xn(e.unaryFilter.field);return K.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=xn(e.unaryFilter.field);return K.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=xn(e.unaryFilter.field);return K.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return O(61313);default:return O(60726)}})(r):r.fieldFilter!==void 0?(function(e){return K.create(xn(e.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return O(58110);default:return O(50506)}})(e.fieldFilter.op),e.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(e){return tt.create(e.compositeFilter.filters.map((n=>ff(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return O(1026)}})(e.compositeFilter.op))})(r):O(30097,{filter:r})}function vy(r){return my[r]}function by(r){return py[r]}function Ry(r){return gy[r]}function Dn(r){return{fieldPath:r.canonicalString()}}function xn(r){return at.fromServerFormat(r.fieldPath)}function mf(r){return r instanceof K?(function(e){if(e.op==="=="){if(pl(e.value))return{unaryFilter:{field:Dn(e.field),op:"IS_NAN"}};if(ml(e.value))return{unaryFilter:{field:Dn(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(pl(e.value))return{unaryFilter:{field:Dn(e.field),op:"IS_NOT_NAN"}};if(ml(e.value))return{unaryFilter:{field:Dn(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Dn(e.field),op:by(e.op),value:e.value}}})(r):r instanceof tt?(function(e){const n=e.getFilters().map((s=>mf(s)));return n.length===1?n[0]:{compositeFilter:{op:Ry(e.op),filters:n}}})(r):O(54877,{filter:r})}function Sy(r){const t=[];return r.fields.forEach((e=>t.push(e.canonicalString()))),{fieldPaths:t}}function pf(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(t,e,n,s,i=B.min(),o=B.min(),c=ht.EMPTY_BYTE_STRING,u=null){this.target=t,this.targetId=e,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(t){return new se(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new se(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new se(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new se(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gf{constructor(t){this.yt=t}}function Py(r,t){let e;if(t.document)e=Iy(r.yt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const n=M.fromSegments(t.noDocument.path),s=dn(t.noDocument.readTime);e=ot.newNoDocument(n,s),t.hasCommittedMutations&&e.setHasCommittedMutations()}else{if(!t.unknownDocument)return O(56709);{const n=M.fromSegments(t.unknownDocument.path),s=dn(t.unknownDocument.version);e=ot.newUnknownDocument(n,s)}}return t.readTime&&e.setReadTime((function(s){const i=new Z(s[0],s[1]);return B.fromTimestamp(i)})(t.readTime)),e}function xl(r,t){const e=t.key,n={prefixPath:e.getCollectionPath().popLast().toArray(),collectionGroup:e.collectionGroup,documentId:e.path.lastSegment(),readTime:di(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())n.document=(function(i,o){return{name:cs(i,o.key),fields:o.data.value.mapValue.fields,updateTime:Jn(i,o.version.toTimestamp()),createTime:Jn(i,o.createTime.toTimestamp())}})(r.yt,t);else if(t.isNoDocument())n.noDocument={path:e.path.toArray(),readTime:hn(t.version)};else{if(!t.isUnknownDocument())return O(57904,{document:t});n.unknownDocument={path:e.path.toArray(),version:hn(t.version)}}return n}function di(r){const t=r.toTimestamp();return[t.seconds,t.nanoseconds]}function hn(r){const t=r.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function dn(r){const t=new Z(r.seconds,r.nanoseconds);return B.fromTimestamp(t)}function Ye(r,t){const e=(t.baseMutations||[]).map((i=>ga(r.yt,i)));for(let i=0;i<t.mutations.length-1;++i){const o=t.mutations[i];if(i+1<t.mutations.length&&t.mutations[i+1].transform!==void 0){const c=t.mutations[i+1];o.updateTransforms=c.transform.fieldTransforms,t.mutations.splice(i+1,1),++i}}const n=t.mutations.map((i=>ga(r.yt,i))),s=Z.fromMillis(t.localWriteTimeMs);return new Ha(t.batchId,s,e,n)}function Lr(r){const t=dn(r.readTime),e=r.lastLimboFreeSnapshotVersion!==void 0?dn(r.lastLimboFreeSnapshotVersion):B.min();let n;return n=(function(i){return i.documents!==void 0})(r.query)?(function(i){const o=i.documents.length;return L(o===1,1966,{count:o}),Ut(_s(cf(i.documents[0])))})(r.query):(function(i){return Ut(df(i))})(r.query),new se(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,t,e,ht.fromBase64String(r.resumeToken))}function _f(r,t){const e=hn(t.snapshotVersion),n=hn(t.lastLimboFreeSnapshotVersion);let s;s=ui(t.target)?lf(r.yt,t.target):hf(r.yt,t.target).ft;const i=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:un(t.target),readTime:e,resumeToken:i,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function yf(r){const t=df({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?hi(t,t.limit,"L"):t}function Lo(r,t){return new Wa(t.largestBatchId,ga(r.yt,t.overlayMutation))}function Nl(r,t){const e=t.path.lastSegment();return[r,Pt(t.path.popLast()),e]}function kl(r,t,e,n){return{indexId:r,uid:t,sequenceNumber:e,readTime:hn(n.readTime),documentKey:Pt(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{getBundleMetadata(t,e){return Ml(t).get(e).next((n=>{if(n)return(function(i){return{id:i.bundleId,createTime:dn(i.createTime),version:i.version}})(n)}))}saveBundleMetadata(t,e){return Ml(t).put((function(s){return{bundleId:s.id,createTime:hn(Tt(s.createTime)),version:s.version}})(e))}getNamedQuery(t,e){return Ol(t).get(e).next((n=>{if(n)return(function(i){return{name:i.name,query:yf(i.bundledQuery),readTime:dn(i.readTime)}})(n)}))}saveNamedQuery(t,e){return Ol(t).put((function(s){return{name:s.name,readTime:hn(Tt(s.readTime)),bundledQuery:s.bundledQuery}})(e))}}function Ml(r){return _t(r,Ni)}function Ol(r){return _t(r,ki)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(t,e){this.serializer=t,this.userId=e}static wt(t,e){const n=e.uid||"";return new qi(t,n)}getOverlay(t,e){return Cr(t).get(Nl(this.userId,e)).next((n=>n?Lo(this.serializer,n):null))}getOverlays(t,e){const n=te();return A.forEach(e,(s=>this.getOverlay(t,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(t,e,n){const s=[];return n.forEach(((i,o)=>{const c=new Wa(e,o);s.push(this.St(t,c))})),A.waitFor(s)}removeOverlaysForBatchId(t,e,n){const s=new Set;e.forEach((o=>s.add(Pt(o.getCollectionPath()))));const i=[];return s.forEach((o=>{const c=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(Cr(t).Z(ia,c))})),A.waitFor(i)}getOverlaysForCollection(t,e,n){const s=te(),i=Pt(e),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Cr(t).J(ia,o).next((c=>{for(const u of c){const h=Lo(this.serializer,u);s.set(h.getKey(),h)}return s}))}getOverlaysForCollectionGroup(t,e,n,s){const i=te();let o;const c=IDBKeyRange.bound([this.userId,e,n],[this.userId,e,Number.POSITIVE_INFINITY],!0);return Cr(t).ee({index:_d,range:c},((u,h,f)=>{const p=Lo(this.serializer,h);i.size()<s||p.largestBatchId===o?(i.set(p.getKey(),p),o=p.largestBatchId):f.done()})).next((()=>i))}St(t,e){return Cr(t).put((function(s,i,o){const[c,u,h]=Nl(i,o.mutation.key);return{userId:i,collectionPath:u,documentId:h,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:us(s.yt,o.mutation)}})(this.serializer,this.userId,e))}}function Cr(r){return _t(r,Mi)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cy{bt(t){return _t(t,Fa)}getSessionToken(t){return this.bt(t).get("sessionToken").next((e=>{const n=e==null?void 0:e.value;return n?ht.fromUint8Array(n):ht.EMPTY_BYTE_STRING}))}setSessionToken(t,e){return this.bt(t).put({name:"sessionToken",value:e.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(){}Dt(t,e){this.Ct(t,e),e.vt()}Ct(t,e){if("nullValue"in t)this.Ft(e,5);else if("booleanValue"in t)this.Ft(e,10),e.Mt(t.booleanValue?1:0);else if("integerValue"in t)this.Ft(e,15),e.Mt(it(t.integerValue));else if("doubleValue"in t){const n=it(t.doubleValue);isNaN(n)?this.Ft(e,13):(this.Ft(e,15),Yr(n)?e.Mt(0):e.Mt(n))}else if("timestampValue"in t){let n=t.timestampValue;this.Ft(e,20),typeof n=="string"&&(n=he(n)),e.xt(`${n.seconds||""}`),e.Mt(n.nanos||0)}else if("stringValue"in t)this.Ot(t.stringValue,e),this.Nt(e);else if("bytesValue"in t)this.Ft(e,30),e.Bt(de(t.bytesValue)),this.Nt(e);else if("referenceValue"in t)this.Lt(t.referenceValue,e);else if("geoPointValue"in t){const n=t.geoPointValue;this.Ft(e,45),e.Mt(n.latitude||0),e.Mt(n.longitude||0)}else"mapValue"in t?Vd(t)?this.Ft(e,Number.MAX_SAFE_INTEGER):Fi(t)?this.kt(t.mapValue,e):(this.qt(t.mapValue,e),this.Nt(e)):"arrayValue"in t?(this.Qt(t.arrayValue,e),this.Nt(e)):O(19022,{$t:t})}Ot(t,e){this.Ft(e,25),this.Ut(t,e)}Ut(t,e){e.xt(t)}qt(t,e){const n=t.fields||{};this.Ft(e,55);for(const s of Object.keys(n))this.Ot(s,e),this.Ct(n[s],e)}kt(t,e){var o,c;const n=t.fields||{};this.Ft(e,53);const s=zn,i=((c=(o=n[s].arrayValue)==null?void 0:o.values)==null?void 0:c.length)||0;this.Ft(e,15),e.Mt(it(i)),this.Ot(s,e),this.Ct(n[s],e)}Qt(t,e){const n=t.values||[];this.Ft(e,50);for(const s of n)this.Ct(s,e)}Lt(t,e){this.Ft(e,37),M.fromName(t).path.forEach((n=>{this.Ft(e,60),this.Ut(n,e)}))}Ft(t,e){t.Mt(e)}Nt(t){t.Mt(2)}}Ze.Kt=new Ze;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bn=255;function Dy(r){if(r===0)return 8;let t=0;return r>>4||(t+=4,r<<=4),r>>6||(t+=2,r<<=2),r>>7||(t+=1),t}function Fl(r){const t=64-(function(n){let s=0;for(let i=0;i<8;++i){const o=Dy(255&n[i]);if(s+=o,o!==8)break}return s})(r);return Math.ceil(t/8)}class xy{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Wt(t){const e=t[Symbol.iterator]();let n=e.next();for(;!n.done;)this.Gt(n.value),n=e.next();this.zt()}jt(t){const e=t[Symbol.iterator]();let n=e.next();for(;!n.done;)this.Jt(n.value),n=e.next();this.Ht()}Yt(t){for(const e of t){const n=e.charCodeAt(0);if(n<128)this.Gt(n);else if(n<2048)this.Gt(960|n>>>6),this.Gt(128|63&n);else if(e<"\uD800"||"\uDBFF"<e)this.Gt(480|n>>>12),this.Gt(128|63&n>>>6),this.Gt(128|63&n);else{const s=e.codePointAt(0);this.Gt(240|s>>>18),this.Gt(128|63&s>>>12),this.Gt(128|63&s>>>6),this.Gt(128|63&s)}}this.zt()}Zt(t){for(const e of t){const n=e.charCodeAt(0);if(n<128)this.Jt(n);else if(n<2048)this.Jt(960|n>>>6),this.Jt(128|63&n);else if(e<"\uD800"||"\uDBFF"<e)this.Jt(480|n>>>12),this.Jt(128|63&n>>>6),this.Jt(128|63&n);else{const s=e.codePointAt(0);this.Jt(240|s>>>18),this.Jt(128|63&s>>>12),this.Jt(128|63&s>>>6),this.Jt(128|63&s)}}this.Ht()}Xt(t){const e=this.en(t),n=Fl(e);this.tn(1+n),this.buffer[this.position++]=255&n;for(let s=e.length-n;s<e.length;++s)this.buffer[this.position++]=255&e[s]}nn(t){const e=this.en(t),n=Fl(e);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let s=e.length-n;s<e.length;++s)this.buffer[this.position++]=~(255&e[s])}rn(){this.sn(bn),this.sn(255)}_n(){this.an(bn),this.an(255)}reset(){this.position=0}seed(t){this.tn(t.length),this.buffer.set(t,this.position),this.position+=t.length}un(){return this.buffer.slice(0,this.position)}en(t){const e=(function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)})(t),n=!!(128&e[0]);e[0]^=n?255:128;for(let s=1;s<e.length;++s)e[s]^=n?255:0;return e}Gt(t){const e=255&t;e===0?(this.sn(0),this.sn(255)):e===bn?(this.sn(bn),this.sn(0)):this.sn(e)}Jt(t){const e=255&t;e===0?(this.an(0),this.an(255)):e===bn?(this.an(bn),this.an(0)):this.an(t)}zt(){this.sn(0),this.sn(1)}Ht(){this.an(0),this.an(1)}sn(t){this.tn(1),this.buffer[this.position++]=t}an(t){this.tn(1),this.buffer[this.position++]=~t}tn(t){const e=t+this.position;if(e<=this.buffer.length)return;let n=2*this.buffer.length;n<e&&(n=e);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class Ny{constructor(t){this.cn=t}Bt(t){this.cn.Wt(t)}xt(t){this.cn.Yt(t)}Mt(t){this.cn.Xt(t)}vt(){this.cn.rn()}}class ky{constructor(t){this.cn=t}Bt(t){this.cn.jt(t)}xt(t){this.cn.Zt(t)}Mt(t){this.cn.nn(t)}vt(){this.cn._n()}}class Dr{constructor(){this.cn=new xy,this.ln=new Ny(this.cn),this.hn=new ky(this.cn)}seed(t){this.cn.seed(t)}Pn(t){return t===0?this.ln:this.hn}un(){return this.cn.un()}reset(){this.cn.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tn{constructor(t,e,n,s){this.Tn=t,this.In=e,this.En=n,this.dn=s}An(){const t=this.dn.length,e=t===0||this.dn[t-1]===255?t+1:t,n=new Uint8Array(e);return n.set(this.dn,0),e!==t?n.set([0],this.dn.length):++n[n.length-1],new tn(this.Tn,this.In,this.En,n)}Rn(t,e,n){return{indexId:this.Tn,uid:t,arrayValue:ti(this.En),directionalValue:ti(this.dn),orderedDocumentKey:ti(e),documentKey:n.path.toArray()}}Vn(t,e,n){const s=this.Rn(t,e,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function we(r,t){let e=r.Tn-t.Tn;return e!==0?e:(e=Ll(r.En,t.En),e!==0?e:(e=Ll(r.dn,t.dn),e!==0?e:M.comparator(r.In,t.In)))}function Ll(r,t){for(let e=0;e<r.length&&e<t.length;++e){const n=r[e]-t[e];if(n!==0)return n}return r.length-t.length}function ti(r){return Bh()?(function(e){let n="";for(let s=0;s<e.length;s++)n+=String.fromCharCode(e[s]);return n})(r):r}function Bl(r){return typeof r!="string"?r:(function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n})(r)}class Ul{constructor(t){this.mn=new et(((e,n)=>at.comparator(e.field,n.field))),this.collectionId=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment(),this.fn=t.orderBy,this.gn=[];for(const e of t.filters){const n=e;n.isInequality()?this.mn=this.mn.add(n):this.gn.push(n)}}get pn(){return this.mn.size>1}yn(t){if(L(t.collectionGroup===this.collectionId,49279),this.pn)return!1;const e=na(t);if(e!==void 0&&!this.wn(e))return!1;const n=We(t);let s=new Set,i=0,o=0;for(;i<n.length&&this.wn(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.mn.size>0){const c=this.mn.getIterator().getNext();if(!s.has(c.field.canonicalString())){const u=n[i];if(!this.Sn(c,u)||!this.bn(this.fn[o++],u))return!1}++i}for(;i<n.length;++i){const c=n[i];if(o>=this.fn.length||!this.bn(this.fn[o++],c))return!1}return!0}Dn(){if(this.pn)return null;let t=new et(at.comparator);const e=[];for(const n of this.gn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")e.push(new Ks(n.field,2));else{if(t.has(n.field))continue;t=t.add(n.field),e.push(new Ks(n.field,0))}for(const n of this.fn)n.field.isKeyField()||t.has(n.field)||(t=t.add(n.field),e.push(new Ks(n.field,n.dir==="asc"?0:1)));return new si(si.UNKNOWN_ID,this.collectionId,e,Xr.empty())}wn(t){for(const e of this.gn)if(this.Sn(e,t))return!0;return!1}Sn(t,e){if(t===void 0||!t.field.isEqual(e.fieldPath))return!1;const n=t.op==="array-contains"||t.op==="array-contains-any";return e.kind===2===n}bn(t,e){return!!t.field.isEqual(e.fieldPath)&&(e.kind===0&&t.dir==="asc"||e.kind===1&&t.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function If(r){var e,n;if(L(r instanceof K||r instanceof tt,20012),r instanceof K){if(r instanceof Ld){const s=((n=(e=r.value.arrayValue)==null?void 0:e.values)==null?void 0:n.map((i=>K.create(r.field,"==",i))))||[];return tt.create(s,"or")}return r}const t=r.filters.map((s=>If(s)));return tt.create(t,r.op)}function My(r){if(r.getFilters().length===0)return[];const t=Ia(If(r));return L(Tf(t),7391),_a(t)||ya(t)?[t]:t.getFilters()}function _a(r){return r instanceof K}function ya(r){return r instanceof tt&&ja(r)}function Tf(r){return _a(r)||ya(r)||(function(e){if(e instanceof tt&&ua(e)){for(const n of e.getFilters())if(!_a(n)&&!ya(n))return!1;return!0}return!1})(r)}function Ia(r){if(L(r instanceof K||r instanceof tt,34018),r instanceof K)return r;if(r.filters.length===1)return Ia(r.filters[0]);const t=r.filters.map((n=>Ia(n)));let e=tt.create(t,r.op);return e=fi(e),Tf(e)?e:(L(e instanceof tt,64498),L(Hn(e),40251),L(e.filters.length>1,57927),e.filters.reduce(((n,s)=>Ya(n,s))))}function Ya(r,t){let e;return L(r instanceof K||r instanceof tt,38388),L(t instanceof K||t instanceof tt,25473),e=r instanceof K?t instanceof K?(function(s,i){return tt.create([s,i],"and")})(r,t):ql(r,t):t instanceof K?ql(t,r):(function(s,i){if(L(s.filters.length>0&&i.filters.length>0,48005),Hn(s)&&Hn(i))return Md(s,i.getFilters());const o=ua(s)?s:i,c=ua(s)?i:s,u=o.filters.map((h=>Ya(h,c)));return tt.create(u,"or")})(r,t),fi(e)}function ql(r,t){if(Hn(t))return Md(t,r.getFilters());{const e=t.filters.map((n=>Ya(r,n)));return tt.create(e,"or")}}function fi(r){if(L(r instanceof K||r instanceof tt,11850),r instanceof K)return r;const t=r.getFilters();if(t.length===1)return fi(t[0]);if(Nd(r))return r;const e=t.map((s=>fi(s))),n=[];return e.forEach((s=>{s instanceof K?n.push(s):s instanceof tt&&(s.op===r.op?n.push(...s.filters):n.push(s))})),n.length===1?n[0]:tt.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oy{constructor(){this.Cn=new Za}addToCollectionParentIndex(t,e){return this.Cn.add(e),A.resolve()}getCollectionParents(t,e){return A.resolve(this.Cn.getEntries(e))}addFieldIndex(t,e){return A.resolve()}deleteFieldIndex(t,e){return A.resolve()}deleteAllFieldIndexes(t){return A.resolve()}createTargetIndexes(t,e){return A.resolve()}getDocumentsMatchingTarget(t,e){return A.resolve(null)}getIndexType(t,e){return A.resolve(0)}getFieldIndexes(t,e){return A.resolve([])}getNextCollectionGroupToUpdate(t){return A.resolve(null)}getMinOffset(t,e){return A.resolve(jt.min())}getMinOffsetFromCollectionGroup(t,e){return A.resolve(jt.min())}updateCollectionGroup(t,e,n){return A.resolve()}updateIndexEntries(t,e){return A.resolve()}}class Za{constructor(){this.index={}}add(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e]||new et(J.comparator),i=!s.has(n);return this.index[e]=s.add(n),i}has(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e];return s&&s.has(n)}getEntries(t){return(this.index[t]||new et(J.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jl="IndexedDbIndexManager",qs=new Uint8Array(0);class Fy{constructor(t,e){this.databaseId=e,this.vn=new Za,this.Fn=new me((n=>un(n)),((n,s)=>gs(n,s))),this.uid=t.uid||""}addToCollectionParentIndex(t,e){if(!this.vn.has(e)){const n=e.lastSegment(),s=e.popLast();t.addOnCommittedListener((()=>{this.vn.add(e)}));const i={collectionId:n,parent:Pt(s)};return $l(t).put(i)}return A.resolve()}getCollectionParents(t,e){const n=[],s=IDBKeyRange.bound([e,""],[nd(e),""],!1,!0);return $l(t).J(s).next((i=>{for(const o of i){if(o.collectionId!==e)break;n.push(Zt(o.parent))}return n}))}addFieldIndex(t,e){const n=xr(t),s=(function(c){return{indexId:c.indexId,collectionGroup:c.collectionGroup,fields:c.fields.map((u=>[u.fieldPath.canonicalString(),u.kind]))}})(e);delete s.indexId;const i=n.add(s);if(e.indexState){const o=Sn(t);return i.next((c=>{o.put(kl(c,this.uid,e.indexState.sequenceNumber,e.indexState.offset))}))}return i.next()}deleteFieldIndex(t,e){const n=xr(t),s=Sn(t),i=Rn(t);return n.delete(e.indexId).next((()=>s.delete(IDBKeyRange.bound([e.indexId],[e.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([e.indexId],[e.indexId+1],!1,!0))))}deleteAllFieldIndexes(t){const e=xr(t),n=Rn(t),s=Sn(t);return e.Z().next((()=>n.Z())).next((()=>s.Z()))}createTargetIndexes(t,e){return A.forEach(this.Mn(e),(n=>this.getIndexType(t,n).next((s=>{if(s===0||s===1){const i=new Ul(n).Dn();if(i!=null)return this.addFieldIndex(t,i)}}))))}getDocumentsMatchingTarget(t,e){const n=Rn(t);let s=!0;const i=new Map;return A.forEach(this.Mn(e),(o=>this.xn(t,o).next((c=>{s&&(s=!!c),i.set(o,c)})))).next((()=>{if(s){let o=G();const c=[];return A.forEach(i,((u,h)=>{V(jl,`Using index ${(function(U){return`id=${U.indexId}|cg=${U.collectionGroup}|f=${U.fields.map((X=>`${X.fieldPath}:${X.kind}`)).join(",")}`})(u)} to execute ${un(e)}`);const f=(function(U,X){const Y=na(X);if(Y===void 0)return null;for(const H of li(U,Y.fieldPath))switch(H.op){case"array-contains-any":return H.value.arrayValue.values||[];case"array-contains":return[H.value]}return null})(h,u),p=(function(U,X){const Y=new Map;for(const H of We(X))for(const T of li(U,H.fieldPath))switch(T.op){case"==":case"in":Y.set(H.fieldPath.canonicalString(),T.value);break;case"not-in":case"!=":return Y.set(H.fieldPath.canonicalString(),T.value),Array.from(Y.values())}return null})(h,u),g=(function(U,X){const Y=[];let H=!0;for(const T of We(X)){const _=T.kind===0?Tl(U,T.fieldPath,U.startAt):El(U,T.fieldPath,U.startAt);Y.push(_.value),H&&(H=_.inclusive)}return new Kn(Y,H)})(h,u),R=(function(U,X){const Y=[];let H=!0;for(const T of We(X)){const _=T.kind===0?El(U,T.fieldPath,U.endAt):Tl(U,T.fieldPath,U.endAt);Y.push(_.value),H&&(H=_.inclusive)}return new Kn(Y,H)})(h,u),D=this.On(u,h,g),N=this.On(u,h,R),x=this.Nn(u,h,p),$=this.Bn(u.indexId,f,D,g.inclusive,N,R.inclusive,x);return A.forEach($,(q=>n.Y(q,e.limit).next((U=>{U.forEach((X=>{const Y=M.fromSegments(X.documentKey);o.has(Y)||(o=o.add(Y),c.push(Y))}))}))))})).next((()=>c))}return A.resolve(null)}))}Mn(t){let e=this.Fn.get(t);return e||(t.filters.length===0?e=[t]:e=My(tt.create(t.filters,"and")).map((n=>ha(t.path,t.collectionGroup,t.orderBy,n.getFilters(),t.limit,t.startAt,t.endAt))),this.Fn.set(t,e),e)}Bn(t,e,n,s,i,o,c){const u=(e!=null?e.length:1)*Math.max(n.length,i.length),h=u/(e!=null?e.length:1),f=[];for(let p=0;p<u;++p){const g=e?this.Ln(e[p/h]):qs,R=this.kn(t,g,n[p%h],s),D=this.qn(t,g,i[p%h],o),N=c.map((x=>this.kn(t,g,x,!0)));f.push(...this.createRange(R,D,N))}return f}kn(t,e,n,s){const i=new tn(t,M.empty(),e,n);return s?i:i.An()}qn(t,e,n,s){const i=new tn(t,M.empty(),e,n);return s?i.An():i}xn(t,e){const n=new Ul(e),s=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment();return this.getFieldIndexes(t,s).next((i=>{let o=null;for(const c of i)n.yn(c)&&(!o||c.fields.length>o.fields.length)&&(o=c);return o}))}getIndexType(t,e){let n=2;const s=this.Mn(e);return A.forEach(s,(i=>this.xn(t,i).next((o=>{o?n!==0&&o.fields.length<(function(u){let h=new et(at.comparator),f=!1;for(const p of u.filters)for(const g of p.getFlattenedFilters())g.field.isKeyField()||(g.op==="array-contains"||g.op==="array-contains-any"?f=!0:h=h.add(g.field));for(const p of u.orderBy)p.field.isKeyField()||(h=h.add(p.field));return h.size+(f?1:0)})(i)&&(n=1):n=0})))).next((()=>(function(o){return o.limit!==null})(e)&&s.length>1&&n===2?1:n))}Qn(t,e){const n=new Dr;for(const s of We(t)){const i=e.data.field(s.fieldPath);if(i==null)return null;const o=n.Pn(s.kind);Ze.Kt.Dt(i,o)}return n.un()}Ln(t){const e=new Dr;return Ze.Kt.Dt(t,e.Pn(0)),e.un()}$n(t,e){const n=new Dr;return Ze.Kt.Dt(ss(this.databaseId,e),n.Pn((function(i){const o=We(i);return o.length===0?0:o[o.length-1].kind})(t))),n.un()}Nn(t,e,n){if(n===null)return[];let s=[];s.push(new Dr);let i=0;for(const o of We(t)){const c=n[i++];for(const u of s)if(this.Un(e,o.fieldPath)&&is(c))s=this.Kn(s,o,c);else{const h=u.Pn(o.kind);Ze.Kt.Dt(c,h)}}return this.Wn(s)}On(t,e,n){return this.Nn(t,e,n.position)}Wn(t){const e=[];for(let n=0;n<t.length;++n)e[n]=t[n].un();return e}Kn(t,e,n){const s=[...t],i=[];for(const o of n.arrayValue.values||[])for(const c of s){const u=new Dr;u.seed(c.un()),Ze.Kt.Dt(o,u.Pn(e.kind)),i.push(u)}return i}Un(t,e){return!!t.filters.find((n=>n instanceof K&&n.field.isEqual(e)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(t,e){const n=xr(t),s=Sn(t);return(e?n.J(sa,IDBKeyRange.bound(e,e)):n.J()).next((i=>{const o=[];return A.forEach(i,(c=>s.get([c.indexId,this.uid]).next((u=>{o.push((function(f,p){const g=p?new Xr(p.sequenceNumber,new jt(dn(p.readTime),new M(Zt(p.documentKey)),p.largestBatchId)):Xr.empty(),R=f.fields.map((([D,N])=>new Ks(at.fromServerFormat(D),N)));return new si(f.indexId,f.collectionGroup,R,g)})(c,u))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(t){return this.getFieldIndexes(t).next((e=>e.length===0?null:(e.sort(((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:j(n.collectionGroup,s.collectionGroup)})),e[0].collectionGroup)))}updateCollectionGroup(t,e,n){const s=xr(t),i=Sn(t);return this.Gn(t).next((o=>s.J(sa,IDBKeyRange.bound(e,e)).next((c=>A.forEach(c,(u=>i.put(kl(u.indexId,this.uid,o,n))))))))}updateIndexEntries(t,e){const n=new Map;return A.forEach(e,((s,i)=>{const o=n.get(s.collectionGroup);return(o?A.resolve(o):this.getFieldIndexes(t,s.collectionGroup)).next((c=>(n.set(s.collectionGroup,c),A.forEach(c,(u=>this.zn(t,s,u).next((h=>{const f=this.jn(i,u);return h.isEqual(f)?A.resolve():this.Jn(t,i,u,h,f)})))))))}))}Hn(t,e,n,s){return Rn(t).put(s.Rn(this.uid,this.$n(n,e.key),e.key))}Yn(t,e,n,s){return Rn(t).delete(s.Vn(this.uid,this.$n(n,e.key),e.key))}zn(t,e,n){const s=Rn(t);let i=new et(we);return s.ee({index:gd,range:IDBKeyRange.only([n.indexId,this.uid,ti(this.$n(n,e))])},((o,c)=>{i=i.add(new tn(n.indexId,e,Bl(c.arrayValue),Bl(c.directionalValue)))})).next((()=>i))}jn(t,e){let n=new et(we);const s=this.Qn(e,t);if(s==null)return n;const i=na(e);if(i!=null){const o=t.data.field(i.fieldPath);if(is(o))for(const c of o.arrayValue.values||[])n=n.add(new tn(e.indexId,t.key,this.Ln(c),s))}else n=n.add(new tn(e.indexId,t.key,qs,s));return n}Jn(t,e,n,s,i){V(jl,"Updating index entries for document '%s'",e.key);const o=[];return(function(u,h,f,p,g){const R=u.getIterator(),D=h.getIterator();let N=vn(R),x=vn(D);for(;N||x;){let $=!1,q=!1;if(N&&x){const U=f(N,x);U<0?q=!0:U>0&&($=!0)}else N!=null?q=!0:$=!0;$?(p(x),x=vn(D)):q?(g(N),N=vn(R)):(N=vn(R),x=vn(D))}})(s,i,we,(c=>{o.push(this.Hn(t,e,n,c))}),(c=>{o.push(this.Yn(t,e,n,c))})),A.waitFor(o)}Gn(t){let e=1;return Sn(t).ee({index:pd,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,s,i)=>{i.done(),e=s.sequenceNumber+1})).next((()=>e))}createRange(t,e,n){n=n.sort(((o,c)=>we(o,c))).filter(((o,c,u)=>!c||we(o,u[c-1])!==0));const s=[];s.push(t);for(const o of n){const c=we(o,t),u=we(o,e);if(c===0)s[0]=t.An();else if(c>0&&u<0)s.push(o),s.push(o.An());else if(u>0)break}s.push(e);const i=[];for(let o=0;o<s.length;o+=2){if(this.Zn(s[o],s[o+1]))return[];const c=s[o].Vn(this.uid,qs,M.empty()),u=s[o+1].Vn(this.uid,qs,M.empty());i.push(IDBKeyRange.bound(c,u))}return i}Zn(t,e){return we(t,e)>0}getMinOffsetFromCollectionGroup(t,e){return this.getFieldIndexes(t,e).next(zl)}getMinOffset(t,e){return A.mapArray(this.Mn(e),(n=>this.xn(t,n).next((s=>s||O(44426))))).next(zl)}}function $l(r){return _t(r,es)}function Rn(r){return _t(r,$r)}function xr(r){return _t(r,Oa)}function Sn(r){return _t(r,jr)}function zl(r){L(r.length!==0,28825);let t=r[0].indexState.offset,e=t.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;Na(s,t)<0&&(t=s),e<s.largestBatchId&&(e=s.largestBatchId)}return new jt(t.readTime,t.documentKey,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gl={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Ef=41943040;class Rt{static withCacheSize(t){return new Rt(t,Rt.DEFAULT_COLLECTION_PERCENTILE,Rt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,n){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wf(r,t,e){const n=r.store(Gt),s=r.store(Un),i=[],o=IDBKeyRange.only(e.batchId);let c=0;const u=n.ee({range:o},((f,p,g)=>(c++,g.delete())));i.push(u.next((()=>{L(c===1,47070,{batchId:e.batchId})})));const h=[];for(const f of e.mutations){const p=dd(t,f.key.path,e.batchId);i.push(s.delete(p)),h.push(f.key)}return A.waitFor(i).next((()=>h))}function mi(r){if(!r)return 0;let t;if(r.document)t=r.document;else if(r.unknownDocument)t=r.unknownDocument;else{if(!r.noDocument)throw O(14731);t=r.noDocument}return JSON.stringify(t).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Rt.DEFAULT_COLLECTION_PERCENTILE=10,Rt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Rt.DEFAULT=new Rt(Ef,Rt.DEFAULT_COLLECTION_PERCENTILE,Rt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Rt.DISABLED=new Rt(-1,0,0);class ji{constructor(t,e,n,s){this.userId=t,this.serializer=e,this.indexManager=n,this.referenceDelegate=s,this.Xn={}}static wt(t,e,n,s){L(t.uid!=="",64387);const i=t.isAuthenticated()?t.uid:"";return new ji(i,e,n,s)}checkEmpty(t){let e=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Ae(t).ee({index:en,range:n},((s,i,o)=>{e=!1,o.done()})).next((()=>e))}addMutationBatch(t,e,n,s){const i=Nn(t),o=Ae(t);return o.add({}).next((c=>{L(typeof c=="number",49019);const u=new Ha(c,e,n,s),h=(function(R,D,N){const x=N.baseMutations.map((q=>us(R.yt,q))),$=N.mutations.map((q=>us(R.yt,q)));return{userId:D,batchId:N.batchId,localWriteTimeMs:N.localWriteTime.toMillis(),baseMutations:x,mutations:$}})(this.serializer,this.userId,u),f=[];let p=new et(((g,R)=>j(g.canonicalString(),R.canonicalString())));for(const g of s){const R=dd(this.userId,g.key.path,c);p=p.add(g.key.path.popLast()),f.push(o.put(h)),f.push(i.put(R,p_))}return p.forEach((g=>{f.push(this.indexManager.addToCollectionParentIndex(t,g))})),t.addOnCommittedListener((()=>{this.Xn[c]=u.keys()})),A.waitFor(f).next((()=>u))}))}lookupMutationBatch(t,e){return Ae(t).get(e).next((n=>n?(L(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:e}),Ye(this.serializer,n)):null))}er(t,e){return this.Xn[e]?A.resolve(this.Xn[e]):this.lookupMutationBatch(t,e).next((n=>{if(n){const s=n.keys();return this.Xn[e]=s,s}return null}))}getNextMutationBatchAfterBatchId(t,e){const n=e+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Ae(t).ee({index:en,range:s},((o,c,u)=>{c.userId===this.userId&&(L(c.batchId>=n,47524,{tr:n}),i=Ye(this.serializer,c)),u.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(t){const e=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=sn;return Ae(t).ee({index:en,range:e,reverse:!0},((s,i,o)=>{n=i.batchId,o.done()})).next((()=>n))}getAllMutationBatches(t){const e=IDBKeyRange.bound([this.userId,sn],[this.userId,Number.POSITIVE_INFINITY]);return Ae(t).J(en,e).next((n=>n.map((s=>Ye(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(t,e){const n=Hs(this.userId,e.path),s=IDBKeyRange.lowerBound(n),i=[];return Nn(t).ee({range:s},((o,c,u)=>{const[h,f,p]=o,g=Zt(f);if(h===this.userId&&e.path.isEqual(g))return Ae(t).get(p).next((R=>{if(!R)throw O(61480,{nr:o,batchId:p});L(R.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:R.userId,batchId:p}),i.push(Ye(this.serializer,R))}));u.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new et(j);const s=[];return e.forEach((i=>{const o=Hs(this.userId,i.path),c=IDBKeyRange.lowerBound(o),u=Nn(t).ee({range:c},((h,f,p)=>{const[g,R,D]=h,N=Zt(R);g===this.userId&&i.path.isEqual(N)?n=n.add(D):p.done()}));s.push(u)})),A.waitFor(s).next((()=>this.rr(t,n)))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,s=n.length+1,i=Hs(this.userId,n),o=IDBKeyRange.lowerBound(i);let c=new et(j);return Nn(t).ee({range:o},((u,h,f)=>{const[p,g,R]=u,D=Zt(g);p===this.userId&&n.isPrefixOf(D)?D.length===s&&(c=c.add(R)):f.done()})).next((()=>this.rr(t,c)))}rr(t,e){const n=[],s=[];return e.forEach((i=>{s.push(Ae(t).get(i).next((o=>{if(o===null)throw O(35274,{batchId:i});L(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(Ye(this.serializer,o))})))})),A.waitFor(s).next((()=>n))}removeMutationBatch(t,e){return wf(t.le,this.userId,e).next((n=>(t.addOnCommittedListener((()=>{this.ir(e.batchId)})),A.forEach(n,(s=>this.referenceDelegate.markPotentiallyOrphaned(t,s))))))}ir(t){delete this.Xn[t]}performConsistencyCheck(t){return this.checkEmpty(t).next((e=>{if(!e)return A.resolve();const n=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),s=[];return Nn(t).ee({range:n},((i,o,c)=>{if(i[0]===this.userId){const u=Zt(i[1]);s.push(u)}else c.done()})).next((()=>{L(s.length===0,56720,{sr:s.map((i=>i.canonicalString()))})}))}))}containsKey(t,e){return Af(t,this.userId,e)}_r(t){return vf(t).get(this.userId).next((e=>e||{userId:this.userId,lastAcknowledgedBatchId:sn,lastStreamToken:""}))}}function Af(r,t,e){const n=Hs(t,e.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return Nn(r).ee({range:i,X:!0},((c,u,h)=>{const[f,p,g]=c;f===t&&p===s&&(o=!0),h.done()})).next((()=>o))}function Ae(r){return _t(r,Gt)}function Nn(r){return _t(r,Un)}function vf(r){return _t(r,Zr)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(t){this.ar=t}next(){return this.ar+=2,this.ar}static ur(){return new fn(0)}static cr(){return new fn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ly{constructor(t,e){this.referenceDelegate=t,this.serializer=e}allocateTargetId(t){return this.lr(t).next((e=>{const n=new fn(e.highestTargetId);return e.highestTargetId=n.next(),this.hr(t,e).next((()=>e.highestTargetId))}))}getLastRemoteSnapshotVersion(t){return this.lr(t).next((e=>B.fromTimestamp(new Z(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(t){return this.lr(t).next((e=>e.highestListenSequenceNumber))}setTargetsMetadata(t,e,n){return this.lr(t).next((s=>(s.highestListenSequenceNumber=e,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),e>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=e),this.hr(t,s))))}addTargetData(t,e){return this.Pr(t,e).next((()=>this.lr(t).next((n=>(n.targetCount+=1,this.Tr(e,n),this.hr(t,n))))))}updateTargetData(t,e){return this.Pr(t,e)}removeTargetData(t,e){return this.removeMatchingKeysForTargetId(t,e.targetId).next((()=>Pn(t).delete(e.targetId))).next((()=>this.lr(t))).next((n=>(L(n.targetCount>0,8065),n.targetCount-=1,this.hr(t,n))))}removeTargets(t,e,n){let s=0;const i=[];return Pn(t).ee(((o,c)=>{const u=Lr(c);u.sequenceNumber<=e&&n.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(t,u)))})).next((()=>A.waitFor(i))).next((()=>s))}forEachTarget(t,e){return Pn(t).ee(((n,s)=>{const i=Lr(s);e(i)}))}lr(t){return Kl(t).get(ai).next((e=>(L(e!==null,2888),e)))}hr(t,e){return Kl(t).put(ai,e)}Pr(t,e){return Pn(t).put(_f(this.serializer,e))}Tr(t,e){let n=!1;return t.targetId>e.highestTargetId&&(e.highestTargetId=t.targetId,n=!0),t.sequenceNumber>e.highestListenSequenceNumber&&(e.highestListenSequenceNumber=t.sequenceNumber,n=!0),n}getTargetCount(t){return this.lr(t).next((e=>e.targetCount))}getTargetData(t,e){const n=un(e),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return Pn(t).ee({range:s,index:md},((o,c,u)=>{const h=Lr(c);gs(e,h.target)&&(i=h,u.done())})).next((()=>i))}addMatchingKeys(t,e,n){const s=[],i=be(t);return e.forEach((o=>{const c=Pt(o.path);s.push(i.put({targetId:n,path:c})),s.push(this.referenceDelegate.addReference(t,n,o))})),A.waitFor(s)}removeMatchingKeys(t,e,n){const s=be(t);return A.forEach(e,(i=>{const o=Pt(i.path);return A.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(t,n,i)])}))}removeMatchingKeysForTargetId(t,e){const n=be(t),s=IDBKeyRange.bound([e],[e+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(t,e){const n=IDBKeyRange.bound([e],[e+1],!1,!0),s=be(t);let i=G();return s.ee({range:n,X:!0},((o,c,u)=>{const h=Zt(o[1]),f=new M(h);i=i.add(f)})).next((()=>i))}containsKey(t,e){const n=Pt(e.path),s=IDBKeyRange.bound([n],[nd(n)],!1,!0);let i=0;return be(t).ee({index:Ma,X:!0,range:s},(([o,c],u,h)=>{o!==0&&(i++,h.done())})).next((()=>i>0))}At(t,e){return Pn(t).get(e).next((n=>n?Lr(n):null))}}function Pn(r){return _t(r,qn)}function Kl(r){return _t(r,on)}function be(r){return _t(r,jn)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hl="LruGarbageCollector",bf=1048576;function Ql([r,t],[e,n]){const s=j(r,e);return s===0?j(t,n):s}class By{constructor(t){this.Ir=t,this.buffer=new et(Ql),this.Er=0}dr(){return++this.Er}Ar(t){const e=[t,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(e);else{const n=this.buffer.last();Ql(e,n)<0&&(this.buffer=this.buffer.delete(n).add(e))}}get maxValue(){return this.buffer.last()[0]}}class Rf{constructor(t,e,n){this.garbageCollector=t,this.asyncQueue=e,this.localStore=n,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(t){V(Hl,`Garbage collection scheduled in ${t}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Le(e)?V(Hl,"Ignoring IndexedDB error during garbage collection: ",e):await Fe(e)}await this.Vr(3e5)}))}}class Uy{constructor(t,e){this.mr=t,this.params=e}calculateTargetCount(t,e){return this.mr.gr(t).next((n=>Math.floor(e/100*n)))}nthSequenceNumber(t,e){if(e===0)return A.resolve(Mt.ce);const n=new By(e);return this.mr.forEachTarget(t,(s=>n.Ar(s.sequenceNumber))).next((()=>this.mr.pr(t,(s=>n.Ar(s))))).next((()=>n.maxValue))}removeTargets(t,e,n){return this.mr.removeTargets(t,e,n)}removeOrphanedDocuments(t,e){return this.mr.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(V("LruGarbageCollector","Garbage collection skipped; disabled"),A.resolve(Gl)):this.getCacheSize(t).next((n=>n<this.params.cacheSizeCollectionThreshold?(V("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Gl):this.yr(t,e)))}getCacheSize(t){return this.mr.getCacheSize(t)}yr(t,e){let n,s,i,o,c,u,h;const f=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next((p=>(p>this.params.maximumSequenceNumbersToCollect?(V("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),s=this.params.maximumSequenceNumbersToCollect):s=p,o=Date.now(),this.nthSequenceNumber(t,s)))).next((p=>(n=p,c=Date.now(),this.removeTargets(t,n,e)))).next((p=>(i=p,u=Date.now(),this.removeOrphanedDocuments(t,n)))).next((p=>(h=Date.now(),Vn()<=W.DEBUG&&V("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${s} in `+(c-o)+`ms
	Removed ${i} targets in `+(u-c)+`ms
	Removed ${p} documents in `+(h-u)+`ms
Total Duration: ${h-f}ms`),A.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:p}))))}}function Sf(r,t){return new Uy(r,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qy{constructor(t,e){this.db=t,this.garbageCollector=Sf(this,e)}gr(t){const e=this.wr(t);return this.db.getTargetCache().getTargetCount(t).next((n=>e.next((s=>n+s))))}wr(t){let e=0;return this.pr(t,(n=>{e++})).next((()=>e))}forEachTarget(t,e){return this.db.getTargetCache().forEachTarget(t,e)}pr(t,e){return this.Sr(t,((n,s)=>e(s)))}addReference(t,e,n){return js(t,n)}removeReference(t,e,n){return js(t,n)}removeTargets(t,e,n){return this.db.getTargetCache().removeTargets(t,e,n)}markPotentiallyOrphaned(t,e){return js(t,e)}br(t,e){return(function(s,i){let o=!1;return vf(s).te((c=>Af(s,c,i).next((u=>(u&&(o=!0),A.resolve(!u)))))).next((()=>o))})(t,e)}removeOrphanedDocuments(t,e){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.Sr(t,((o,c)=>{if(c<=e){const u=this.br(t,o).next((h=>{if(!h)return i++,n.getEntry(t,o).next((()=>(n.removeEntry(o,B.min()),be(t).delete((function(p){return[0,Pt(p.path)]})(o)))))}));s.push(u)}})).next((()=>A.waitFor(s))).next((()=>n.apply(t))).next((()=>i))}removeTarget(t,e){const n=e.withSequenceNumber(t.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(t,n)}updateLimboDocument(t,e){return js(t,e)}Sr(t,e){const n=be(t);let s,i=Mt.ce;return n.ee({index:Ma},(([o,c],{path:u,sequenceNumber:h})=>{o===0?(i!==Mt.ce&&e(new M(Zt(s)),i),i=h,s=u):i=Mt.ce})).next((()=>{i!==Mt.ce&&e(new M(Zt(s)),i)}))}getCacheSize(t){return this.db.getRemoteDocumentCache().getSize(t)}}function js(r,t){return be(r).put((function(n,s){return{targetId:0,path:Pt(n.path),sequenceNumber:s}})(t,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pf{constructor(){this.changes=new me((t=>t.toString()),((t,e)=>t.isEqual(e))),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,ot.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const n=this.changes.get(e);return n!==void 0?A.resolve(n):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jy{constructor(t){this.serializer=t}setIndexManager(t){this.indexManager=t}addEntry(t,e,n){return He(t).put(n)}removeEntry(t,e,n){return He(t).delete((function(i,o){const c=i.path.toArray();return[c.slice(0,c.length-2),c[c.length-2],di(o),c[c.length-1]]})(e,n))}updateMetadata(t,e){return this.getMetadata(t).next((n=>(n.byteSize+=e,this.Dr(t,n))))}getEntry(t,e){let n=ot.newInvalidDocument(e);return He(t).ee({index:Qs,range:IDBKeyRange.only(Nr(e))},((s,i)=>{n=this.Cr(e,i)})).next((()=>n))}vr(t,e){let n={size:0,document:ot.newInvalidDocument(e)};return He(t).ee({index:Qs,range:IDBKeyRange.only(Nr(e))},((s,i)=>{n={document:this.Cr(e,i),size:mi(i)}})).next((()=>n))}getEntries(t,e){let n=Bt();return this.Fr(t,e,((s,i)=>{const o=this.Cr(s,i);n=n.insert(s,o)})).next((()=>n))}Mr(t,e){let n=Bt(),s=new rt(M.comparator);return this.Fr(t,e,((i,o)=>{const c=this.Cr(i,o);n=n.insert(i,c),s=s.insert(i,mi(o))})).next((()=>({documents:n,Or:s})))}Fr(t,e,n){if(e.isEmpty())return A.resolve();let s=new et(Xl);e.forEach((u=>s=s.add(u)));const i=IDBKeyRange.bound(Nr(s.first()),Nr(s.last())),o=s.getIterator();let c=o.getNext();return He(t).ee({index:Qs,range:i},((u,h,f)=>{const p=M.fromSegments([...h.prefixPath,h.collectionGroup,h.documentId]);for(;c&&Xl(c,p)<0;)n(c,null),c=o.getNext();c&&c.isEqual(p)&&(n(c,h),c=o.hasNext()?o.getNext():null),c?f.j(Nr(c)):f.done()})).next((()=>{for(;c;)n(c,null),c=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(t,e,n,s,i){const o=e.path,c=[o.popLast().toArray(),o.lastSegment(),di(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return He(t).J(IDBKeyRange.bound(c,u,!0)).next((h=>{i==null||i.incrementDocumentReadCount(h.length);let f=Bt();for(const p of h){const g=this.Cr(M.fromSegments(p.prefixPath.concat(p.collectionGroup,p.documentId)),p);g.isFoundDocument()&&(ys(e,g)||s.has(g.key))&&(f=f.insert(g.key,g))}return f}))}getAllFromCollectionGroup(t,e,n,s){let i=Bt();const o=Jl(e,n),c=Jl(e,jt.max());return He(t).ee({index:fd,range:IDBKeyRange.bound(o,c,!0)},((u,h,f)=>{const p=this.Cr(M.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);i=i.insert(p.key,p),i.size===s&&f.done()})).next((()=>i))}newChangeBuffer(t){return new $y(this,!!t&&t.trackRemovals)}getSize(t){return this.getMetadata(t).next((e=>e.byteSize))}getMetadata(t){return Wl(t).get(ra).next((e=>(L(!!e,20021),e)))}Dr(t,e){return Wl(t).put(ra,e)}Cr(t,e){if(e){const n=Py(this.serializer,e);if(!(n.isNoDocument()&&n.version.isEqual(B.min())))return n}return ot.newInvalidDocument(t)}}function Vf(r){return new jy(r)}class $y extends Pf{constructor(t,e){super(),this.Nr=t,this.trackRemovals=e,this.Br=new me((n=>n.toString()),((n,s)=>n.isEqual(s)))}applyChanges(t){const e=[];let n=0,s=new et(((i,o)=>j(i.canonicalString(),o.canonicalString())));return this.changes.forEach(((i,o)=>{const c=this.Br.get(i);if(e.push(this.Nr.removeEntry(t,i,c.readTime)),o.isValidDocument()){const u=xl(this.Nr.serializer,o);s=s.add(i.path.popLast());const h=mi(u);n+=h-c.size,e.push(this.Nr.addEntry(t,i,u))}else if(n-=c.size,this.trackRemovals){const u=xl(this.Nr.serializer,o.convertToNoDocument(B.min()));e.push(this.Nr.addEntry(t,i,u))}})),s.forEach((i=>{e.push(this.Nr.indexManager.addToCollectionParentIndex(t,i))})),e.push(this.Nr.updateMetadata(t,n)),A.waitFor(e)}getFromCache(t,e){return this.Nr.vr(t,e).next((n=>(this.Br.set(e,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(t,e){return this.Nr.Mr(t,e).next((({documents:n,Or:s})=>(s.forEach(((i,o)=>{this.Br.set(i,{size:o,readTime:n.get(i).readTime})})),n)))}}function Wl(r){return _t(r,ts)}function He(r){return _t(r,oi)}function Nr(r){const t=r.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function Jl(r,t){const e=t.documentKey.path.toArray();return[r,di(t.readTime),e.slice(0,e.length-2),e.length>0?e[e.length-1]:""]}function Xl(r,t){const e=r.path.toArray(),n=t.path.toArray();let s=0;for(let i=0;i<e.length-2&&i<n.length-2;++i)if(s=j(e[i],n[i]),s)return s;return s=j(e.length,n.length),s||(s=j(e[e.length-2],n[n.length-2]),s||j(e[e.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zy{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cf{constructor(t,e,n,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=n,this.indexManager=s}getDocument(t,e){let n=null;return this.documentOverlayCache.getOverlay(t,e).next((s=>(n=s,this.remoteDocumentCache.getEntry(t,e)))).next((s=>(n!==null&&Hr(n.mutation,s,Ot.empty(),Z.now()),s)))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next((n=>this.getLocalViewOfDocuments(t,n,G()).next((()=>n))))}getLocalViewOfDocuments(t,e,n=G()){const s=te();return this.populateOverlays(t,s,e).next((()=>this.computeViews(t,e,s,n).next((i=>{let o=Or();return i.forEach(((c,u)=>{o=o.insert(c,u.overlayedDocument)})),o}))))}getOverlayedDocuments(t,e){const n=te();return this.populateOverlays(t,n,e).next((()=>this.computeViews(t,e,n,G())))}populateOverlays(t,e,n){const s=[];return n.forEach((i=>{e.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(t,s).next((i=>{i.forEach(((o,c)=>{e.set(o,c)}))}))}computeViews(t,e,n,s){let i=Bt();const o=Kr(),c=(function(){return Kr()})();return e.forEach(((u,h)=>{const f=n.get(h.key);s.has(h.key)&&(f===void 0||f.mutation instanceof pe)?i=i.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),Hr(f.mutation,h,f.mutation.getFieldMask(),Z.now())):o.set(h.key,Ot.empty())})),this.recalculateAndSaveOverlays(t,i).next((u=>(u.forEach(((h,f)=>o.set(h,f))),e.forEach(((h,f)=>c.set(h,new zy(f,o.get(h)??null)))),c)))}recalculateAndSaveOverlays(t,e){const n=Kr();let s=new rt(((o,c)=>o-c)),i=G();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next((o=>{for(const c of o)c.keys().forEach((u=>{const h=e.get(u);if(h===null)return;let f=n.get(u)||Ot.empty();f=c.applyToLocalView(h,f),n.set(u,f);const p=(s.get(c.batchId)||G()).add(u);s=s.insert(c.batchId,p)}))})).next((()=>{const o=[],c=s.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),h=u.key,f=u.value,p=Kd();f.forEach((g=>{if(!i.has(g)){const R=Yd(e.get(g),n.get(g));R!==null&&p.set(g,R),i=i.add(g)}})),o.push(this.documentOverlayCache.saveOverlays(t,h,p))}return A.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next((n=>this.recalculateAndSaveOverlays(t,n)))}getDocumentsMatchingQuery(t,e,n,s){return(function(o){return M.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0})(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):Ud(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,n,s):this.getDocumentsMatchingCollectionQuery(t,e,n,s)}getNextDocuments(t,e,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,n.largestBatchId,s-i.size):A.resolve(te());let c=Bn,u=i;return o.next((h=>A.forEach(h,((f,p)=>(c<p.largestBatchId&&(c=p.largestBatchId),i.get(f)?A.resolve():this.remoteDocumentCache.getEntry(t,f).next((g=>{u=u.insert(f,g)}))))).next((()=>this.populateOverlays(t,h,i))).next((()=>this.computeViews(t,u,h,G()))).next((f=>({batchId:c,changes:Gd(f)})))))}))}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new M(e)).next((n=>{let s=Or();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(t,e,n,s){const i=e.collectionGroup;let o=Or();return this.indexManager.getCollectionParents(t,i).next((c=>A.forEach(c,(u=>{const h=(function(p,g){return new sr(g,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)})(e,u.child(i));return this.getDocumentsMatchingCollectionQuery(t,h,n,s).next((f=>{f.forEach(((p,g)=>{o=o.insert(p,g)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(t,e,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,n,i,s)))).next((o=>{i.forEach(((u,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,ot.newInvalidDocument(f)))}));let c=Or();return o.forEach(((u,h)=>{const f=i.get(u);f!==void 0&&Hr(f.mutation,h,Ot.empty(),Z.now()),ys(e,h)&&(c=c.insert(u,h))})),c}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gy{constructor(t){this.serializer=t,this.Lr=new Map,this.kr=new Map}getBundleMetadata(t,e){return A.resolve(this.Lr.get(e))}saveBundleMetadata(t,e){return this.Lr.set(e.id,(function(s){return{id:s.id,version:s.version,createTime:Tt(s.createTime)}})(e)),A.resolve()}getNamedQuery(t,e){return A.resolve(this.kr.get(e))}saveNamedQuery(t,e){return this.kr.set(e.name,(function(s){return{name:s.name,query:yf(s.bundledQuery),readTime:Tt(s.readTime)}})(e)),A.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{constructor(){this.overlays=new rt(M.comparator),this.qr=new Map}getOverlay(t,e){return A.resolve(this.overlays.get(e))}getOverlays(t,e){const n=te();return A.forEach(e,(s=>this.getOverlay(t,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(t,e,n){return n.forEach(((s,i)=>{this.St(t,e,i)})),A.resolve()}removeOverlaysForBatchId(t,e,n){const s=this.qr.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.qr.delete(n)),A.resolve()}getOverlaysForCollection(t,e,n){const s=te(),i=e.length+1,o=new M(e.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){const u=c.getNext().value,h=u.getKey();if(!e.isPrefixOf(h.path))break;h.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return A.resolve(s)}getOverlaysForCollectionGroup(t,e,n,s){let i=new rt(((h,f)=>h-f));const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===e&&h.largestBatchId>n){let f=i.get(h.largestBatchId);f===null&&(f=te(),i=i.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const c=te(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((h,f)=>c.set(h,f))),!(c.size()>=s)););return A.resolve(c)}St(t,e,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.qr.get(s.largestBatchId).delete(n.key);this.qr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new Wa(e,n));let i=this.qr.get(e);i===void 0&&(i=G(),this.qr.set(e,i)),this.qr.set(e,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hy{constructor(){this.sessionToken=ht.EMPTY_BYTE_STRING}getSessionToken(t){return A.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,A.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc{constructor(){this.Qr=new et(It.$r),this.Ur=new et(It.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(t,e){const n=new It(t,e);this.Qr=this.Qr.add(n),this.Ur=this.Ur.add(n)}Wr(t,e){t.forEach((n=>this.addReference(n,e)))}removeReference(t,e){this.Gr(new It(t,e))}zr(t,e){t.forEach((n=>this.removeReference(n,e)))}jr(t){const e=new M(new J([])),n=new It(e,t),s=new It(e,t+1),i=[];return this.Ur.forEachInRange([n,s],(o=>{this.Gr(o),i.push(o.key)})),i}Jr(){this.Qr.forEach((t=>this.Gr(t)))}Gr(t){this.Qr=this.Qr.delete(t),this.Ur=this.Ur.delete(t)}Hr(t){const e=new M(new J([])),n=new It(e,t),s=new It(e,t+1);let i=G();return this.Ur.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(t){const e=new It(t,0),n=this.Qr.firstAfterOrEqual(e);return n!==null&&t.isEqual(n.key)}}class It{constructor(t,e){this.key=t,this.Yr=e}static $r(t,e){return M.comparator(t.key,e.key)||j(t.Yr,e.Yr)}static Kr(t,e){return j(t.Yr,e.Yr)||M.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qy{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.tr=1,this.Zr=new et(It.$r)}checkEmpty(t){return A.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,n,s){const i=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Ha(i,e,n,s);this.mutationQueue.push(o);for(const c of s)this.Zr=this.Zr.add(new It(c.key,i)),this.indexManager.addToCollectionParentIndex(t,c.key.path.popLast());return A.resolve(o)}lookupMutationBatch(t,e){return A.resolve(this.Xr(e))}getNextMutationBatchAfterBatchId(t,e){const n=e+1,s=this.ei(n),i=s<0?0:s;return A.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return A.resolve(this.mutationQueue.length===0?sn:this.tr-1)}getAllMutationBatches(t){return A.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const n=new It(e,0),s=new It(e,Number.POSITIVE_INFINITY),i=[];return this.Zr.forEachInRange([n,s],(o=>{const c=this.Xr(o.Yr);i.push(c)})),A.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new et(j);return e.forEach((s=>{const i=new It(s,0),o=new It(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([i,o],(c=>{n=n.add(c.Yr)}))})),A.resolve(this.ti(n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,s=n.length+1;let i=n;M.isDocumentKey(i)||(i=i.child(""));const o=new It(new M(i),0);let c=new et(j);return this.Zr.forEachWhile((u=>{const h=u.key.path;return!!n.isPrefixOf(h)&&(h.length===s&&(c=c.add(u.Yr)),!0)}),o),A.resolve(this.ti(c))}ti(t){const e=[];return t.forEach((n=>{const s=this.Xr(n);s!==null&&e.push(s)})),e}removeMutationBatch(t,e){L(this.ni(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Zr;return A.forEach(e.mutations,(s=>{const i=new It(s.key,e.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)})).next((()=>{this.Zr=n}))}ir(t){}containsKey(t,e){const n=new It(e,0),s=this.Zr.firstAfterOrEqual(n);return A.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,A.resolve()}ni(t,e){return this.ei(t)}ei(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Xr(t){const e=this.ei(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{constructor(t){this.ri=t,this.docs=(function(){return new rt(M.comparator)})(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const n=e.key,s=this.docs.get(n),i=s?s.size:0,o=this.ri(e);return this.docs=this.docs.insert(n,{document:e.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(t,n.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const n=this.docs.get(e);return A.resolve(n?n.document.mutableCopy():ot.newInvalidDocument(e))}getEntries(t,e){let n=Bt();return e.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():ot.newInvalidDocument(s))})),A.resolve(n)}getDocumentsMatchingQuery(t,e,n,s){let i=Bt();const o=e.path,c=new M(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(c);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||Na(ad(f),n)<=0||(s.has(f.key)||ys(e,f))&&(i=i.insert(f.key,f.mutableCopy()))}return A.resolve(i)}getAllFromCollectionGroup(t,e,n,s){O(9500)}ii(t,e){return A.forEach(this.docs,(n=>e(n)))}newChangeBuffer(t){return new Jy(this)}getSize(t){return A.resolve(this.size)}}class Jy extends Pf{constructor(t){super(),this.Nr=t}applyChanges(t){const e=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?e.push(this.Nr.addEntry(t,s)):this.Nr.removeEntry(n)})),A.waitFor(e)}getFromCache(t,e){return this.Nr.getEntry(t,e)}getAllFromCache(t,e){return this.Nr.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xy{constructor(t){this.persistence=t,this.si=new me((e=>un(e)),gs),this.lastRemoteSnapshotVersion=B.min(),this.highestTargetId=0,this.oi=0,this._i=new tc,this.targetCount=0,this.ai=fn.ur()}forEachTarget(t,e){return this.si.forEach(((n,s)=>e(s))),A.resolve()}getLastRemoteSnapshotVersion(t){return A.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return A.resolve(this.oi)}allocateTargetId(t){return this.highestTargetId=this.ai.next(),A.resolve(this.highestTargetId)}setTargetsMetadata(t,e,n){return n&&(this.lastRemoteSnapshotVersion=n),e>this.oi&&(this.oi=e),A.resolve()}Pr(t){this.si.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.ai=new fn(e),this.highestTargetId=e),t.sequenceNumber>this.oi&&(this.oi=t.sequenceNumber)}addTargetData(t,e){return this.Pr(e),this.targetCount+=1,A.resolve()}updateTargetData(t,e){return this.Pr(e),A.resolve()}removeTargetData(t,e){return this.si.delete(e.target),this._i.jr(e.targetId),this.targetCount-=1,A.resolve()}removeTargets(t,e,n){let s=0;const i=[];return this.si.forEach(((o,c)=>{c.sequenceNumber<=e&&n.get(c.targetId)===null&&(this.si.delete(o),i.push(this.removeMatchingKeysForTargetId(t,c.targetId)),s++)})),A.waitFor(i).next((()=>s))}getTargetCount(t){return A.resolve(this.targetCount)}getTargetData(t,e){const n=this.si.get(e)||null;return A.resolve(n)}addMatchingKeys(t,e,n){return this._i.Wr(e,n),A.resolve()}removeMatchingKeys(t,e,n){this._i.zr(e,n);const s=this.persistence.referenceDelegate,i=[];return s&&e.forEach((o=>{i.push(s.markPotentiallyOrphaned(t,o))})),A.waitFor(i)}removeMatchingKeysForTargetId(t,e){return this._i.jr(e),A.resolve()}getMatchingKeysForTargetId(t,e){const n=this._i.Hr(e);return A.resolve(n)}containsKey(t,e){return A.resolve(this._i.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ec{constructor(t,e){this.ui={},this.overlays={},this.ci=new Mt(0),this.li=!1,this.li=!0,this.hi=new Hy,this.referenceDelegate=t(this),this.Pi=new Xy(this),this.indexManager=new Oy,this.remoteDocumentCache=(function(s){return new Wy(s)})((n=>this.referenceDelegate.Ti(n))),this.serializer=new gf(e),this.Ii=new Gy(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Ky,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let n=this.ui[t.toKey()];return n||(n=new Qy(e,this.referenceDelegate),this.ui[t.toKey()]=n),n}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(t,e,n){V("MemoryPersistence","Starting transaction:",t);const s=new Yy(this.ci.next());return this.referenceDelegate.Ei(),n(s).next((i=>this.referenceDelegate.di(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Ai(t,e){return A.or(Object.values(this.ui).map((n=>()=>n.containsKey(t,e))))}}class Yy extends ud{constructor(t){super(),this.currentSequenceNumber=t}}class $i{constructor(t){this.persistence=t,this.Ri=new tc,this.Vi=null}static mi(t){return new $i(t)}get fi(){if(this.Vi)return this.Vi;throw O(60996)}addReference(t,e,n){return this.Ri.addReference(n,e),this.fi.delete(n.toString()),A.resolve()}removeReference(t,e,n){return this.Ri.removeReference(n,e),this.fi.add(n.toString()),A.resolve()}markPotentiallyOrphaned(t,e){return this.fi.add(e.toString()),A.resolve()}removeTarget(t,e){this.Ri.jr(e.targetId).forEach((s=>this.fi.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(t,e.targetId).next((s=>{s.forEach((i=>this.fi.add(i.toString())))})).next((()=>n.removeTargetData(t,e)))}Ei(){this.Vi=new Set}di(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return A.forEach(this.fi,(n=>{const s=M.fromPath(n);return this.gi(t,s).next((i=>{i||e.removeEntry(s,B.min())}))})).next((()=>(this.Vi=null,e.apply(t))))}updateLimboDocument(t,e){return this.gi(t,e).next((n=>{n?this.fi.delete(e.toString()):this.fi.add(e.toString())}))}Ti(t){return 0}gi(t,e){return A.or([()=>A.resolve(this.Ri.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ai(t,e)])}}class pi{constructor(t,e){this.persistence=t,this.pi=new me((n=>Pt(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=Sf(this,e)}static mi(t,e){return new pi(t,e)}Ei(){}di(t){return A.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}gr(t){const e=this.wr(t);return this.persistence.getTargetCache().getTargetCount(t).next((n=>e.next((s=>n+s))))}wr(t){let e=0;return this.pr(t,(n=>{e++})).next((()=>e))}pr(t,e){return A.forEach(this.pi,((n,s)=>this.br(t,n,s).next((i=>i?A.resolve():e(s)))))}removeTargets(t,e,n){return this.persistence.getTargetCache().removeTargets(t,e,n)}removeOrphanedDocuments(t,e){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ii(t,(o=>this.br(t,o,e).next((c=>{c||(n++,i.removeEntry(o,B.min()))})))).next((()=>i.apply(t))).next((()=>n))}markPotentiallyOrphaned(t,e){return this.pi.set(e,t.currentSequenceNumber),A.resolve()}removeTarget(t,e){const n=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,n)}addReference(t,e,n){return this.pi.set(n,t.currentSequenceNumber),A.resolve()}removeReference(t,e,n){return this.pi.set(n,t.currentSequenceNumber),A.resolve()}updateLimboDocument(t,e){return this.pi.set(e,t.currentSequenceNumber),A.resolve()}Ti(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=Js(t.data.value)),e}br(t,e,n){return A.or([()=>this.persistence.Ai(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.pi.get(e);return A.resolve(s!==void 0&&s>n)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zy{constructor(t){this.serializer=t}k(t,e,n,s){const i=new xi("createOrUpgrade",e);n<1&&s>=1&&((function(u){u.createObjectStore(ps)})(t),(function(u){u.createObjectStore(Zr,{keyPath:m_}),u.createObjectStore(Gt,{keyPath:cl,autoIncrement:!0}).createIndex(en,ul,{unique:!0}),u.createObjectStore(Un)})(t),Yl(t),(function(u){u.createObjectStore(Je)})(t));let o=A.resolve();return n<3&&s>=3&&(n!==0&&((function(u){u.deleteObjectStore(jn),u.deleteObjectStore(qn),u.deleteObjectStore(on)})(t),Yl(t)),o=o.next((()=>(function(u){const h=u.store(on),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:B.min().toTimestamp(),targetCount:0};return h.put(ai,f)})(i)))),n<4&&s>=4&&(n!==0&&(o=o.next((()=>(function(u,h){return h.store(Gt).J().next((p=>{u.deleteObjectStore(Gt),u.createObjectStore(Gt,{keyPath:cl,autoIncrement:!0}).createIndex(en,ul,{unique:!0});const g=h.store(Gt),R=p.map((D=>g.put(D)));return A.waitFor(R)}))})(t,i)))),o=o.next((()=>{(function(u){u.createObjectStore($n,{keyPath:A_})})(t)}))),n<5&&s>=5&&(o=o.next((()=>this.yi(i)))),n<6&&s>=6&&(o=o.next((()=>((function(u){u.createObjectStore(ts)})(t),this.wi(i))))),n<7&&s>=7&&(o=o.next((()=>this.Si(i)))),n<8&&s>=8&&(o=o.next((()=>this.bi(t,i)))),n<9&&s>=9&&(o=o.next((()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(t)}))),n<10&&s>=10&&(o=o.next((()=>this.Di(i)))),n<11&&s>=11&&(o=o.next((()=>{(function(u){u.createObjectStore(Ni,{keyPath:v_})})(t),(function(u){u.createObjectStore(ki,{keyPath:b_})})(t)}))),n<12&&s>=12&&(o=o.next((()=>{(function(u){const h=u.createObjectStore(Mi,{keyPath:x_});h.createIndex(ia,N_,{unique:!1}),h.createIndex(_d,k_,{unique:!1})})(t)}))),n<13&&s>=13&&(o=o.next((()=>(function(u){const h=u.createObjectStore(oi,{keyPath:g_});h.createIndex(Qs,__),h.createIndex(fd,y_)})(t))).next((()=>this.Ci(t,i))).next((()=>t.deleteObjectStore(Je)))),n<14&&s>=14&&(o=o.next((()=>this.Fi(t,i)))),n<15&&s>=15&&(o=o.next((()=>(function(u){u.createObjectStore(Oa,{keyPath:R_,autoIncrement:!0}).createIndex(sa,S_,{unique:!1}),u.createObjectStore(jr,{keyPath:P_}).createIndex(pd,V_,{unique:!1}),u.createObjectStore($r,{keyPath:C_}).createIndex(gd,D_,{unique:!1})})(t)))),n<16&&s>=16&&(o=o.next((()=>{e.objectStore(jr).clear()})).next((()=>{e.objectStore($r).clear()}))),n<17&&s>=17&&(o=o.next((()=>{(function(u){u.createObjectStore(Fa,{keyPath:M_})})(t)}))),n<18&&s>=18&&Bh()&&(o=o.next((()=>{e.objectStore(jr).clear()})).next((()=>{e.objectStore($r).clear()}))),o}wi(t){let e=0;return t.store(Je).ee(((n,s)=>{e+=mi(s)})).next((()=>{const n={byteSize:e};return t.store(ts).put(ra,n)}))}yi(t){const e=t.store(Zr),n=t.store(Gt);return e.J().next((s=>A.forEach(s,(i=>{const o=IDBKeyRange.bound([i.userId,sn],[i.userId,i.lastAcknowledgedBatchId]);return n.J(en,o).next((c=>A.forEach(c,(u=>{L(u.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const h=Ye(this.serializer,u);return wf(t,i.userId,h).next((()=>{}))}))))}))))}Si(t){const e=t.store(jn),n=t.store(Je);return t.store(on).get(ai).next((s=>{const i=[];return n.ee(((o,c)=>{const u=new J(o),h=(function(p){return[0,Pt(p)]})(u);i.push(e.get(h).next((f=>f?A.resolve():(p=>e.put({targetId:0,path:Pt(p),sequenceNumber:s.highestListenSequenceNumber}))(u))))})).next((()=>A.waitFor(i)))}))}bi(t,e){t.createObjectStore(es,{keyPath:w_});const n=e.store(es),s=new Za,i=o=>{if(s.add(o)){const c=o.lastSegment(),u=o.popLast();return n.put({collectionId:c,parent:Pt(u)})}};return e.store(Je).ee({X:!0},((o,c)=>{const u=new J(o);return i(u.popLast())})).next((()=>e.store(Un).ee({X:!0},(([o,c,u],h)=>{const f=Zt(c);return i(f.popLast())}))))}Di(t){const e=t.store(qn);return e.ee(((n,s)=>{const i=Lr(s),o=_f(this.serializer,i);return e.put(o)}))}Ci(t,e){const n=e.store(Je),s=[];return n.ee(((i,o)=>{const c=e.store(oi),u=(function(p){return p.document?new M(J.fromString(p.document.name).popFirst(5)):p.noDocument?M.fromSegments(p.noDocument.path):p.unknownDocument?M.fromSegments(p.unknownDocument.path):O(36783)})(o).path.toArray(),h={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(c.put(h))})).next((()=>A.waitFor(s)))}Fi(t,e){const n=e.store(Gt),s=Vf(this.serializer),i=new ec($i.mi,this.serializer.yt);return n.J().next((o=>{const c=new Map;return o.forEach((u=>{let h=c.get(u.userId)??G();Ye(this.serializer,u).keys().forEach((f=>h=h.add(f))),c.set(u.userId,h)})),A.forEach(c,((u,h)=>{const f=new bt(h),p=qi.wt(this.serializer,f),g=i.getIndexManager(f),R=ji.wt(f,this.serializer,g,i.referenceDelegate);return new Cf(s,R,p,g).recalculateAndSaveOverlaysForDocumentKeys(new oa(e,Mt.ce),u).next()}))}))}}function Yl(r){r.createObjectStore(jn,{keyPath:T_}).createIndex(Ma,E_,{unique:!0}),r.createObjectStore(qn,{keyPath:"targetId"}).createIndex(md,I_,{unique:!0}),r.createObjectStore(on)}const ve="IndexedDbPersistence",Bo=18e5,Uo=5e3,qo="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",tI="main";class nc{constructor(t,e,n,s,i,o,c,u,h,f,p=18){if(this.allowTabSynchronization=t,this.persistenceKey=e,this.clientId=n,this.Mi=i,this.window=o,this.document=c,this.xi=h,this.Oi=f,this.Ni=p,this.ci=null,this.li=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Bi=null,this.inForeground=!1,this.Li=null,this.ki=null,this.qi=Number.NEGATIVE_INFINITY,this.Qi=g=>Promise.resolve(),!nc.v())throw new C(P.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new qy(this,s),this.$i=e+tI,this.serializer=new gf(u),this.Ui=new Ce(this.$i,this.Ni,new Zy(this.serializer)),this.hi=new Cy,this.Pi=new Ly(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Vf(this.serializer),this.Ii=new Vy,this.window&&this.window.localStorage?this.Ki=this.window.localStorage:(this.Ki=null,f===!1&&dt(ve,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Wi().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new C(P.FAILED_PRECONDITION,qo);return this.Gi(),this.zi(),this.ji(),this.runTransaction("getHighestListenSequenceNumber","readonly",(t=>this.Pi.getHighestSequenceNumber(t)))})).then((t=>{this.ci=new Mt(t,this.xi)})).then((()=>{this.li=!0})).catch((t=>(this.Ui&&this.Ui.close(),Promise.reject(t))))}Ji(t){return this.Qi=async e=>{if(this.started)return t(e)},t(this.isPrimary)}setDatabaseDeletedListener(t){this.Ui.$((async e=>{e.newVersion===null&&await t()}))}setNetworkEnabled(t){this.networkEnabled!==t&&(this.networkEnabled=t,this.Mi.enqueueAndForget((async()=>{this.started&&await this.Wi()})))}Wi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(t=>$s(t).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.Hi(t).next((e=>{e||(this.isPrimary=!1,this.Mi.enqueueRetryable((()=>this.Qi(!1))))}))})).next((()=>this.Yi(t))).next((e=>this.isPrimary&&!e?this.Zi(t).next((()=>!1)):!!e&&this.Xi(t).next((()=>!0)))))).catch((t=>{if(Le(t))return V(ve,"Failed to extend owner lease: ",t),this.isPrimary;if(!this.allowTabSynchronization)throw t;return V(ve,"Releasing owner lease after error during lease refresh",t),!1})).then((t=>{this.isPrimary!==t&&this.Mi.enqueueRetryable((()=>this.Qi(t))),this.isPrimary=t}))}Hi(t){return kr(t).get(An).next((e=>A.resolve(this.es(e))))}ts(t){return $s(t).delete(this.clientId)}async ns(){if(this.isPrimary&&!this.rs(this.qi,Bo)){this.qi=Date.now();const t=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(e=>{const n=_t(e,$n);return n.J().next((s=>{const i=this.ss(s,Bo),o=s.filter((c=>i.indexOf(c)===-1));return A.forEach(o,(c=>n.delete(c.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.Ki)for(const e of t)this.Ki.removeItem(this._s(e.clientId))}}ji(){this.ki=this.Mi.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.Wi().then((()=>this.ns())).then((()=>this.ji()))))}es(t){return!!t&&t.ownerId===this.clientId}Yi(t){return this.Oi?A.resolve(!0):kr(t).get(An).next((e=>{if(e!==null&&this.rs(e.leaseTimestampMs,Uo)&&!this.us(e.ownerId)){if(this.es(e)&&this.networkEnabled)return!0;if(!this.es(e)){if(!e.allowTabSynchronization)throw new C(P.FAILED_PRECONDITION,qo);return!1}}return!(!this.networkEnabled||!this.inForeground)||$s(t).J().next((n=>this.ss(n,Uo).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,c=this.networkEnabled===s.networkEnabled;if(i||o&&c)return!0}return!1}))===void 0))})).next((e=>(this.isPrimary!==e&&V(ve,`Client ${e?"is":"is not"} eligible for a primary lease.`),e)))}async shutdown(){this.li=!1,this.cs(),this.ki&&(this.ki.cancel(),this.ki=null),this.ls(),this.hs(),await this.Ui.runTransaction("shutdown","readwrite",[ps,$n],(t=>{const e=new oa(t,Mt.ce);return this.Zi(e).next((()=>this.ts(e)))})),this.Ui.close(),this.Ps()}ss(t,e){return t.filter((n=>this.rs(n.updateTimeMs,e)&&!this.us(n.clientId)))}Ts(){return this.runTransaction("getActiveClients","readonly",(t=>$s(t).J().next((e=>this.ss(e,Bo).map((n=>n.clientId))))))}get started(){return this.li}getGlobalsCache(){return this.hi}getMutationQueue(t,e){return ji.wt(t,this.serializer,e,this.referenceDelegate)}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(t){return new Fy(t,this.serializer.yt.databaseId)}getDocumentOverlayCache(t){return qi.wt(this.serializer,t)}getBundleCache(){return this.Ii}runTransaction(t,e,n){V(ve,"Starting transaction:",t);const s=e==="readonly"?"readonly":"readwrite",i=(function(u){return u===18?L_:u===17?Ed:u===16?F_:u===15?La:u===14?Td:u===13?Id:u===12?O_:u===11?yd:void O(60245)})(this.Ni);let o;return this.Ui.runTransaction(t,s,i,(c=>(o=new oa(c,this.ci?this.ci.next():Mt.ce),e==="readwrite-primary"?this.Hi(o).next((u=>!!u||this.Yi(o))).next((u=>{if(!u)throw dt(`Failed to obtain primary lease for action '${t}'.`),this.isPrimary=!1,this.Mi.enqueueRetryable((()=>this.Qi(!1))),new C(P.FAILED_PRECONDITION,cd);return n(o)})).next((u=>this.Xi(o).next((()=>u)))):this.Is(o).next((()=>n(o)))))).then((c=>(o.raiseOnCommittedEvent(),c)))}Is(t){return kr(t).get(An).next((e=>{if(e!==null&&this.rs(e.leaseTimestampMs,Uo)&&!this.us(e.ownerId)&&!this.es(e)&&!(this.Oi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new C(P.FAILED_PRECONDITION,qo)}))}Xi(t){const e={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return kr(t).put(An,e)}static v(){return Ce.v()}Zi(t){const e=kr(t);return e.get(An).next((n=>this.es(n)?(V(ve,"Releasing primary lease."),e.delete(An)):A.resolve()))}rs(t,e){const n=Date.now();return!(t<n-e)&&(!(t>n)||(dt(`Detected an update time that is in the future: ${t} > ${n}`),!1))}Gi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Li=()=>{this.Mi.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.Wi())))},this.document.addEventListener("visibilitychange",this.Li),this.inForeground=this.document.visibilityState==="visible")}ls(){this.Li&&(this.document.removeEventListener("visibilitychange",this.Li),this.Li=null)}zi(){var t;typeof((t=this.window)==null?void 0:t.addEventListener)=="function"&&(this.Bi=()=>{this.cs();const e=/(?:Version|Mobile)\/1[456]/;Lh()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Mi.enterRestrictedMode(!0),this.Mi.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.Bi))}hs(){this.Bi&&(this.window.removeEventListener("pagehide",this.Bi),this.Bi=null)}us(t){var e;try{const n=((e=this.Ki)==null?void 0:e.getItem(this._s(t)))!==null;return V(ve,`Client '${t}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return dt(ve,"Failed to get zombied client id.",n),!1}}cs(){if(this.Ki)try{this.Ki.setItem(this._s(this.clientId),String(Date.now()))}catch(t){dt("Failed to set zombie client id.",t)}}Ps(){if(this.Ki)try{this.Ki.removeItem(this._s(this.clientId))}catch{}}_s(t){return`firestore_zombie_${this.persistenceKey}_${t}`}}function kr(r){return _t(r,ps)}function $s(r){return _t(r,$n)}function Df(r,t){let e=r.projectId;return r.isDefaultDatabase||(e+="."+r.database),"firestore/"+t+"/"+e+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rc{constructor(t,e,n,s){this.targetId=t,this.fromCache=e,this.Es=n,this.ds=s}static As(t,e){let n=G(),s=G();for(const i of e.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new rc(t,e.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eI{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xf{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=(function(){return Lh()?8:ld(Mn())>0?6:4})()}initialize(t,e){this.ps=t,this.indexManager=e,this.Rs=!0}getDocumentsMatchingQuery(t,e,n,s){const i={result:null};return this.ys(t,e).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.ws(t,e,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new eI;return this.Ss(t,e,o).next((c=>{if(i.result=c,this.Vs)return this.bs(t,e,o,c.size)}))})).next((()=>i.result))}bs(t,e,n,s){return n.documentReadCount<this.fs?(Vn()<=W.DEBUG&&V("QueryEngine","SDK will not create cache indexes for query:",Cn(e),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),A.resolve()):(Vn()<=W.DEBUG&&V("QueryEngine","Query:",Cn(e),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.gs*s?(Vn()<=W.DEBUG&&V("QueryEngine","The SDK decides to create cache indexes for query:",Cn(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Ut(e))):A.resolve())}ys(t,e){if(wl(e))return A.resolve(null);let n=Ut(e);return this.indexManager.getIndexType(t,n).next((s=>s===0?null:(e.limit!==null&&s===1&&(e=hi(e,null,"F"),n=Ut(e)),this.indexManager.getDocumentsMatchingTarget(t,n).next((i=>{const o=G(...i);return this.ps.getDocuments(t,o).next((c=>this.indexManager.getMinOffset(t,n).next((u=>{const h=this.Ds(e,c);return this.Cs(e,h,o,u.readTime)?this.ys(t,hi(e,null,"F")):this.vs(t,h,e,u)}))))})))))}ws(t,e,n,s){return wl(e)||s.isEqual(B.min())?A.resolve(null):this.ps.getDocuments(t,n).next((i=>{const o=this.Ds(e,i);return this.Cs(e,o,n,s)?A.resolve(null):(Vn()<=W.DEBUG&&V("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Cn(e)),this.vs(t,o,e,od(s,Bn)).next((c=>c)))}))}Ds(t,e){let n=new et($d(t));return e.forEach(((s,i)=>{ys(t,i)&&(n=n.add(i))})),n}Cs(t,e,n,s){if(t.limit===null)return!1;if(n.size!==e.size)return!0;const i=t.limitType==="F"?e.last():e.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Ss(t,e,n){return Vn()<=W.DEBUG&&V("QueryEngine","Using full collection scan to execute query:",Cn(e)),this.ps.getDocumentsMatchingQuery(t,e,jt.min(),n)}vs(t,e,n,s){return this.ps.getDocumentsMatchingQuery(t,n,s).next((i=>(e.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sc="LocalStore",nI=3e8;class rI{constructor(t,e,n,s){this.persistence=t,this.Fs=e,this.serializer=s,this.Ms=new rt(j),this.xs=new me((i=>un(i)),gs),this.Os=new Map,this.Ns=t.getRemoteDocumentCache(),this.Pi=t.getTargetCache(),this.Ii=t.getBundleCache(),this.Bs(n)}Bs(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Cf(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(e=>t.collect(e,this.Ms)))}}function Nf(r,t,e,n){return new rI(r,t,e,n)}async function kf(r,t){const e=F(r);return await e.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return e.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,e.Bs(t),e.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],c=[];let u=G();for(const h of s){o.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of i){c.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return e.localDocuments.getDocuments(n,u).next((h=>({Ls:h,removedBatchIds:o,addedBatchIds:c})))}))}))}function sI(r,t){const e=F(r);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=t.batch.keys(),i=e.Ns.newChangeBuffer({trackRemovals:!0});return(function(c,u,h,f){const p=h.batch,g=p.keys();let R=A.resolve();return g.forEach((D=>{R=R.next((()=>f.getEntry(u,D))).next((N=>{const x=h.docVersions.get(D);L(x!==null,48541),N.version.compareTo(x)<0&&(p.applyToRemoteDocument(N,h),N.isValidDocument()&&(N.setReadTime(h.commitVersion),f.addEntry(N)))}))})),R.next((()=>c.mutationQueue.removeMutationBatch(u,p)))})(e,n,t,i).next((()=>i.apply(n))).next((()=>e.mutationQueue.performConsistencyCheck(n))).next((()=>e.documentOverlayCache.removeOverlaysForBatchId(n,s,t.batch.batchId))).next((()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(c){let u=G();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(u=u.add(c.batch.mutations[h].key));return u})(t)))).next((()=>e.localDocuments.getDocuments(n,s)))}))}function Mf(r){const t=F(r);return t.persistence.runTransaction("Get last remote snapshot version","readonly",(e=>t.Pi.getLastRemoteSnapshotVersion(e)))}function iI(r,t){const e=F(r),n=t.snapshotVersion;let s=e.Ms;return e.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=e.Ns.newChangeBuffer({trackRemovals:!0});s=e.Ms;const c=[];t.targetChanges.forEach(((f,p)=>{const g=s.get(p);if(!g)return;c.push(e.Pi.removeMatchingKeys(i,f.removedDocuments,p).next((()=>e.Pi.addMatchingKeys(i,f.addedDocuments,p))));let R=g.withSequenceNumber(i.currentSequenceNumber);t.targetMismatches.get(p)!==null?R=R.withResumeToken(ht.EMPTY_BYTE_STRING,B.min()).withLastLimboFreeSnapshotVersion(B.min()):f.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(f.resumeToken,n)),s=s.insert(p,R),(function(N,x,$){return N.resumeToken.approximateByteSize()===0||x.snapshotVersion.toMicroseconds()-N.snapshotVersion.toMicroseconds()>=nI?!0:$.addedDocuments.size+$.modifiedDocuments.size+$.removedDocuments.size>0})(g,R,f)&&c.push(e.Pi.updateTargetData(i,R))}));let u=Bt(),h=G();if(t.documentUpdates.forEach((f=>{t.resolvedLimboDocuments.has(f)&&c.push(e.persistence.referenceDelegate.updateLimboDocument(i,f))})),c.push(oI(i,o,t.documentUpdates).next((f=>{u=f.ks,h=f.qs}))),!n.isEqual(B.min())){const f=e.Pi.getLastRemoteSnapshotVersion(i).next((p=>e.Pi.setTargetsMetadata(i,i.currentSequenceNumber,n)));c.push(f)}return A.waitFor(c).next((()=>o.apply(i))).next((()=>e.localDocuments.getLocalViewOfDocuments(i,u,h))).next((()=>u))})).then((i=>(e.Ms=s,i)))}function oI(r,t,e){let n=G(),s=G();return e.forEach((i=>n=n.add(i))),t.getEntries(r,n).next((i=>{let o=Bt();return e.forEach(((c,u)=>{const h=i.get(c);u.isFoundDocument()!==h.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual(B.min())?(t.removeEntry(c,u.readTime),o=o.insert(c,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(t.addEntry(u),o=o.insert(c,u)):V(sc,"Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",u.version)})),{ks:o,qs:s}}))}function aI(r,t){const e=F(r);return e.persistence.runTransaction("Get next mutation batch","readonly",(n=>(t===void 0&&(t=sn),e.mutationQueue.getNextMutationBatchAfterBatchId(n,t))))}function gi(r,t){const e=F(r);return e.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return e.Pi.getTargetData(n,t).next((i=>i?(s=i,A.resolve(s)):e.Pi.allocateTargetId(n).next((o=>(s=new se(t,o,"TargetPurposeListen",n.currentSequenceNumber),e.Pi.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=e.Ms.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.Ms=e.Ms.insert(n.targetId,n),e.xs.set(t,n.targetId)),n}))}async function Xn(r,t,e){const n=F(r),s=n.Ms.get(t),i=e?"readwrite":"readwrite-primary";try{e||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!Le(o))throw o;V(sc,`Failed to update sequence numbers for target ${t}: ${o}`)}n.Ms=n.Ms.remove(t),n.xs.delete(s.target)}function Ta(r,t,e){const n=F(r);let s=B.min(),i=G();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,h,f){const p=F(u),g=p.xs.get(f);return g!==void 0?A.resolve(p.Ms.get(g)):p.Pi.getTargetData(h,f)})(n,o,Ut(t)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,n.Pi.getMatchingKeysForTargetId(o,c.targetId).next((u=>{i=u}))})).next((()=>n.Fs.getDocumentsMatchingQuery(o,t,e?s:B.min(),e?i:G()))).next((c=>(Lf(n,jd(t),c),{documents:c,Qs:i})))))}function Of(r,t){const e=F(r),n=F(e.Pi),s=e.Ms.get(t);return s?Promise.resolve(s.target):e.persistence.runTransaction("Get target data","readonly",(i=>n.At(i,t).next((o=>o?o.target:null))))}function Ff(r,t){const e=F(r),n=e.Os.get(t)||B.min();return e.persistence.runTransaction("Get new document changes","readonly",(s=>e.Ns.getAllFromCollectionGroup(s,t,od(n,Bn),Number.MAX_SAFE_INTEGER))).then((s=>(Lf(e,t,s),s)))}function Lf(r,t,e){let n=r.Os.get(t)||B.min();e.forEach(((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)})),r.Os.set(t,n)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bf="firestore_clients";function Zl(r,t){return`${Bf}_${r}_${t}`}const Uf="firestore_mutations";function th(r,t,e){let n=`${Uf}_${r}_${e}`;return t.isAuthenticated()&&(n+=`_${t.uid}`),n}const qf="firestore_targets";function jo(r,t){return`${qf}_${r}_${t}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yt="SharedClientState";class _i{constructor(t,e,n,s){this.user=t,this.batchId=e,this.state=n,this.error=s}static Ws(t,e,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new C(s.error.code,s.error.message))),o?new _i(t,e,s.state,i):(dt(Yt,`Failed to parse mutation state for ID '${e}': ${n}`),null)}Gs(){const t={state:this.state,updateTimeMs:Date.now()};return this.error&&(t.error={code:this.error.code,message:this.error.message}),JSON.stringify(t)}}class Qr{constructor(t,e,n){this.targetId=t,this.state=e,this.error=n}static Ws(t,e){const n=JSON.parse(e);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new C(n.error.code,n.error.message))),i?new Qr(t,n.state,s):(dt(Yt,`Failed to parse target state for ID '${t}': ${e}`),null)}Gs(){const t={state:this.state,updateTimeMs:Date.now()};return this.error&&(t.error={code:this.error.code,message:this.error.message}),JSON.stringify(t)}}class yi{constructor(t,e){this.clientId=t,this.activeTargetIds=e}static Ws(t,e){const n=JSON.parse(e);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=$a();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=hd(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new yi(t,i):(dt(Yt,`Failed to parse client data for instance '${t}': ${e}`),null)}}class ic{constructor(t,e){this.clientId=t,this.onlineState=e}static Ws(t){const e=JSON.parse(t);return typeof e=="object"&&["Unknown","Online","Offline"].indexOf(e.onlineState)!==-1&&typeof e.clientId=="string"?new ic(e.clientId,e.onlineState):(dt(Yt,`Failed to parse online state: ${t}`),null)}}class Ea{constructor(){this.activeTargetIds=$a()}zs(t){this.activeTargetIds=this.activeTargetIds.add(t)}js(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Gs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class $o{constructor(t,e,n,s,i){this.window=t,this.Mi=e,this.persistenceKey=n,this.Js=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Hs=this.Ys.bind(this),this.Zs=new rt(j),this.started=!1,this.Xs=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.eo=Zl(this.persistenceKey,this.Js),this.no=(function(u){return`firestore_sequence_number_${u}`})(this.persistenceKey),this.Zs=this.Zs.insert(this.Js,new Ea),this.ro=new RegExp(`^${Bf}_${o}_([^_]*)$`),this.io=new RegExp(`^${Uf}_${o}_(\\d+)(?:_(.*))?$`),this.so=new RegExp(`^${qf}_${o}_(\\d+)$`),this.oo=(function(u){return`firestore_online_state_${u}`})(this.persistenceKey),this._o=(function(u){return`firestore_bundle_loaded_v2_${u}`})(this.persistenceKey),this.window.addEventListener("storage",this.Hs)}static v(t){return!(!t||!t.localStorage)}async start(){const t=await this.syncEngine.Ts();for(const n of t){if(n===this.Js)continue;const s=this.getItem(Zl(this.persistenceKey,n));if(s){const i=yi.Ws(n,s);i&&(this.Zs=this.Zs.insert(i.clientId,i))}}this.ao();const e=this.storage.getItem(this.oo);if(e){const n=this.uo(e);n&&this.co(n)}for(const n of this.Xs)this.Ys(n);this.Xs=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(t){this.setItem(this.no,JSON.stringify(t))}getAllActiveQueryTargets(){return this.lo(this.Zs)}isActiveQueryTarget(t){let e=!1;return this.Zs.forEach(((n,s)=>{s.activeTargetIds.has(t)&&(e=!0)})),e}addPendingMutation(t){this.ho(t,"pending")}updateMutationState(t,e,n){this.ho(t,e,n),this.Po(t)}addLocalQueryTarget(t,e=!0){let n="not-current";if(this.isActiveQueryTarget(t)){const s=this.storage.getItem(jo(this.persistenceKey,t));if(s){const i=Qr.Ws(t,s);i&&(n=i.state)}}return e&&this.To.zs(t),this.ao(),n}removeLocalQueryTarget(t){this.To.js(t),this.ao()}isLocalQueryTarget(t){return this.To.activeTargetIds.has(t)}clearQueryState(t){this.removeItem(jo(this.persistenceKey,t))}updateQueryState(t,e,n){this.Io(t,e,n)}handleUserChange(t,e,n){e.forEach((s=>{this.Po(s)})),this.currentUser=t,n.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(t){this.Eo(t)}notifyBundleLoaded(t){this.Ao(t)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.Hs),this.removeItem(this.eo),this.started=!1)}getItem(t){const e=this.storage.getItem(t);return V(Yt,"READ",t,e),e}setItem(t,e){V(Yt,"SET",t,e),this.storage.setItem(t,e)}removeItem(t){V(Yt,"REMOVE",t),this.storage.removeItem(t)}Ys(t){const e=t;if(e.storageArea===this.storage){if(V(Yt,"EVENT",e.key,e.newValue),e.key===this.eo)return void dt("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Mi.enqueueRetryable((async()=>{if(this.started){if(e.key!==null){if(this.ro.test(e.key)){if(e.newValue==null){const n=this.Ro(e.key);return this.Vo(n,null)}{const n=this.mo(e.key,e.newValue);if(n)return this.Vo(n.clientId,n)}}else if(this.io.test(e.key)){if(e.newValue!==null){const n=this.fo(e.key,e.newValue);if(n)return this.po(n)}}else if(this.so.test(e.key)){if(e.newValue!==null){const n=this.yo(e.key,e.newValue);if(n)return this.wo(n)}}else if(e.key===this.oo){if(e.newValue!==null){const n=this.uo(e.newValue);if(n)return this.co(n)}}else if(e.key===this.no){const n=(function(i){let o=Mt.ce;if(i!=null)try{const c=JSON.parse(i);L(typeof c=="number",30636,{So:i}),o=c}catch(c){dt(Yt,"Failed to read sequence number from WebStorage",c)}return o})(e.newValue);n!==Mt.ce&&this.sequenceNumberHandler(n)}else if(e.key===this._o){const n=this.bo(e.newValue);await Promise.all(n.map((s=>this.syncEngine.Do(s))))}}}else this.Xs.push(e)}))}}get To(){return this.Zs.get(this.Js)}ao(){this.setItem(this.eo,this.To.Gs())}ho(t,e,n){const s=new _i(this.currentUser,t,e,n),i=th(this.persistenceKey,this.currentUser,t);this.setItem(i,s.Gs())}Po(t){const e=th(this.persistenceKey,this.currentUser,t);this.removeItem(e)}Eo(t){const e={clientId:this.Js,onlineState:t};this.storage.setItem(this.oo,JSON.stringify(e))}Io(t,e,n){const s=jo(this.persistenceKey,t),i=new Qr(t,e,n);this.setItem(s,i.Gs())}Ao(t){const e=JSON.stringify(Array.from(t));this.setItem(this._o,e)}Ro(t){const e=this.ro.exec(t);return e?e[1]:null}mo(t,e){const n=this.Ro(t);return yi.Ws(n,e)}fo(t,e){const n=this.io.exec(t),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return _i.Ws(new bt(i),s,e)}yo(t,e){const n=this.so.exec(t),s=Number(n[1]);return Qr.Ws(s,e)}uo(t){return ic.Ws(t)}bo(t){return JSON.parse(t)}async po(t){if(t.user.uid===this.currentUser.uid)return this.syncEngine.Co(t.batchId,t.state,t.error);V(Yt,`Ignoring mutation for non-active user ${t.user.uid}`)}wo(t){return this.syncEngine.vo(t.targetId,t.state,t.error)}Vo(t,e){const n=e?this.Zs.insert(t,e):this.Zs.remove(t),s=this.lo(this.Zs),i=this.lo(n),o=[],c=[];return i.forEach((u=>{s.has(u)||o.push(u)})),s.forEach((u=>{i.has(u)||c.push(u)})),this.syncEngine.Fo(o,c).then((()=>{this.Zs=n}))}co(t){this.Zs.get(t.clientId)&&this.onlineStateHandler(t.onlineState)}lo(t){let e=$a();return t.forEach(((n,s)=>{e=e.unionWith(s.activeTargetIds)})),e}}class jf{constructor(){this.Mo=new Ea,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,n){}addLocalQueryTarget(t,e=!0){return e&&this.Mo.zs(t),this.xo[t]||"not-current"}updateQueryState(t,e,n){this.xo[t]=e}removeLocalQueryTarget(t){this.Mo.js(t)}isLocalQueryTarget(t){return this.Mo.activeTargetIds.has(t)}clearQueryState(t){delete this.xo[t]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(t){return this.Mo.activeTargetIds.has(t)}start(){return this.Mo=new Ea,Promise.resolve()}handleUserChange(t,e,n){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cI{Oo(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eh="ConnectivityMonitor";class nh{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(t){this.qo.push(t)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){V(eh,"Network connectivity changed: AVAILABLE");for(const t of this.qo)t(0)}ko(){V(eh,"Network connectivity changed: UNAVAILABLE");for(const t of this.qo)t(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zs=null;function wa(){return zs===null?zs=(function(){return 268435456+Math.round(2147483648*Math.random())})():zs++,"0x"+zs.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zo="RestConnection",uI={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class lI{get $o(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=e+"://"+t.host,this.Ko=`projects/${n}/databases/${s}`,this.Wo=this.databaseId.database===ci?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Go(t,e,n,s,i){const o=wa(),c=this.zo(t,e.toUriEncodedString());V(zo,`Sending RPC '${t}' ${o}:`,c,n);const u={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(u,s,i);const{host:h}=new URL(c),f=ds(h);return this.Jo(t,c,u,n,f).then((p=>(V(zo,`Received RPC '${t}' ${o}: `,p),p)),(p=>{throw Fn(zo,`RPC '${t}' ${o} failed with error: `,p,"url: ",c,"request:",n),p}))}Ho(t,e,n,s,i,o){return this.Go(t,e,n,s,i)}jo(t,e,n){t["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+rr})(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach(((s,i)=>t[i]=s)),n&&n.headers.forEach(((s,i)=>t[i]=s))}zo(t,e){const n=uI[t];return`${this.Uo}/v1/${e}:${n}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hI{constructor(t){this.Yo=t.Yo,this.Zo=t.Zo}Xo(t){this.e_=t}t_(t){this.n_=t}r_(t){this.i_=t}onMessage(t){this.s_=t}close(){this.Zo()}send(t){this.Yo(t)}o_(){this.e_()}__(){this.n_()}a_(t){this.i_(t)}u_(t){this.s_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vt="WebChannelConnection";class dI extends lI{constructor(t){super(t),this.c_=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}Jo(t,e,n,s,i){const o=wa();return new Promise(((c,u)=>{const h=new Wh;h.setWithCredentials(!0),h.listenOnce(Jh.COMPLETE,(()=>{try{switch(h.getLastErrorCode()){case Gs.NO_ERROR:const p=h.getResponseJson();V(vt,`XHR for RPC '${t}' ${o} received:`,JSON.stringify(p)),c(p);break;case Gs.TIMEOUT:V(vt,`RPC '${t}' ${o} timed out`),u(new C(P.DEADLINE_EXCEEDED,"Request time out"));break;case Gs.HTTP_ERROR:const g=h.getStatus();if(V(vt,`RPC '${t}' ${o} failed with status:`,g,"response text:",h.getResponseText()),g>0){let R=h.getResponseJson();Array.isArray(R)&&(R=R[0]);const D=R==null?void 0:R.error;if(D&&D.status&&D.message){const N=(function($){const q=$.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(q)>=0?q:P.UNKNOWN})(D.status);u(new C(N,D.message))}else u(new C(P.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new C(P.UNAVAILABLE,"Connection failed."));break;default:O(9055,{l_:t,streamId:o,h_:h.getLastErrorCode(),P_:h.getLastError()})}}finally{V(vt,`RPC '${t}' ${o} completed.`)}}));const f=JSON.stringify(s);V(vt,`RPC '${t}' ${o} sending request:`,s),h.send(e,"POST",f,n,15)}))}T_(t,e,n){const s=wa(),i=[this.Uo,"/","google.firestore.v1.Firestore","/",t,"/channel"],o=Zh(),c=Yh(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.jo(u.initMessageHeaders,e,n),u.encodeInitMessageHeaders=!0;const f=i.join("");V(vt,`Creating RPC '${t}' stream ${s}: ${f}`,u);const p=o.createWebChannel(f,u);this.I_(p);let g=!1,R=!1;const D=new hI({Yo:x=>{R?V(vt,`Not sending because RPC '${t}' stream ${s} is closed:`,x):(g||(V(vt,`Opening RPC '${t}' stream ${s} transport.`),p.open(),g=!0),V(vt,`RPC '${t}' stream ${s} sending:`,x),p.send(x))},Zo:()=>p.close()}),N=(x,$,q)=>{x.listen($,(U=>{try{q(U)}catch(X){setTimeout((()=>{throw X}),0)}}))};return N(p,Mr.EventType.OPEN,(()=>{R||(V(vt,`RPC '${t}' stream ${s} transport opened.`),D.o_())})),N(p,Mr.EventType.CLOSE,(()=>{R||(R=!0,V(vt,`RPC '${t}' stream ${s} transport closed`),D.a_(),this.E_(p))})),N(p,Mr.EventType.ERROR,(x=>{R||(R=!0,Fn(vt,`RPC '${t}' stream ${s} transport errored. Name:`,x.name,"Message:",x.message),D.a_(new C(P.UNAVAILABLE,"The operation could not be completed")))})),N(p,Mr.EventType.MESSAGE,(x=>{var $;if(!R){const q=x.data[0];L(!!q,16349);const U=q,X=(U==null?void 0:U.error)||(($=U[0])==null?void 0:$.error);if(X){V(vt,`RPC '${t}' stream ${s} received error:`,X);const Y=X.status;let H=(function(I){const w=ft[I];if(w!==void 0)return ef(w)})(Y),T=X.message;H===void 0&&(H=P.INTERNAL,T="Unknown error status: "+Y+" with message "+X.message),R=!0,D.a_(new C(H,T)),p.close()}else V(vt,`RPC '${t}' stream ${s} received:`,q),D.u_(q)}})),N(c,Xh.STAT_EVENT,(x=>{x.stat===ta.PROXY?V(vt,`RPC '${t}' stream ${s} detected buffering proxy`):x.stat===ta.NOPROXY&&V(vt,`RPC '${t}' stream ${s} detected no buffering proxy`)})),setTimeout((()=>{D.__()}),0),D}terminate(){this.c_.forEach((t=>t.close())),this.c_=[]}I_(t){this.c_.push(t)}E_(t){this.c_=this.c_.filter((e=>e===t))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $f(){return typeof window<"u"?window:null}function ei(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zi(r){return new _y(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oc{constructor(t,e,n=1e3,s=1.5,i=6e4){this.Mi=t,this.timerId=e,this.d_=n,this.A_=s,this.R_=i,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(t){this.cancel();const e=Math.floor(this.V_+this.y_()),n=Math.max(0,Date.now()-this.f_),s=Math.max(0,e-n);s>0&&V("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),t()))),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rh="PersistentStream";class zf{constructor(t,e,n,s,i,o,c,u){this.Mi=t,this.S_=n,this.b_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new oc(t,e)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(t){this.Q_(),this.stream.send(t)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(t,e){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,t!==4?this.M_.reset():e&&e.code===P.RESOURCE_EXHAUSTED?(dt(e.toString()),dt("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):e&&e.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.r_(e)}K_(){}auth(){this.state=1;const t=this.W_(this.D_),e=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.D_===e&&this.G_(n,s)}),(n=>{t((()=>{const s=new C(P.UNKNOWN,"Fetching auth token failed: "+n.message);return this.z_(s)}))}))}G_(t,e){const n=this.W_(this.D_);this.stream=this.j_(t,e),this.stream.Xo((()=>{n((()=>this.listener.Xo()))})),this.stream.t_((()=>{n((()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.t_())))})),this.stream.r_((s=>{n((()=>this.z_(s)))})),this.stream.onMessage((s=>{n((()=>++this.F_==1?this.J_(s):this.onNext(s)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(t){return V(rh,`close with error: ${t}`),this.stream=null,this.close(4,t)}W_(t){return e=>{this.Mi.enqueueAndForget((()=>this.D_===t?e():(V(rh,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class fI extends zf{constructor(t,e,n,s,i,o){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,n,s,o),this.serializer=i}j_(t,e){return this.connection.T_("Listen",t,e)}J_(t){return this.onNext(t)}onNext(t){this.M_.reset();const e=Ey(this.serializer,t),n=(function(i){if(!("targetChange"in i))return B.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?B.min():o.readTime?Tt(o.readTime):B.min()})(t);return this.listener.H_(e,n)}Y_(t){const e={};e.database=pa(this.serializer),e.addTarget=(function(i,o){let c;const u=o.target;if(c=ui(u)?{documents:lf(i,u)}:{query:hf(i,u).ft},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=sf(i,o.resumeToken);const h=fa(i,o.expectedCount);h!==null&&(c.expectedCount=h)}else if(o.snapshotVersion.compareTo(B.min())>0){c.readTime=Jn(i,o.snapshotVersion.toTimestamp());const h=fa(i,o.expectedCount);h!==null&&(c.expectedCount=h)}return c})(this.serializer,t);const n=Ay(this.serializer,t);n&&(e.labels=n),this.q_(e)}Z_(t){const e={};e.database=pa(this.serializer),e.removeTarget=t,this.q_(e)}}class mI extends zf{constructor(t,e,n,s,i,o){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,n,s,o),this.serializer=i}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(t,e){return this.connection.T_("Write",t,e)}J_(t){return L(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,L(!t.writeResults||t.writeResults.length===0,55816),this.listener.ta()}onNext(t){L(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.M_.reset();const e=wy(t.writeResults,t.commitTime),n=Tt(t.commitTime);return this.listener.na(n,e)}ra(){const t={};t.database=pa(this.serializer),this.q_(t)}ea(t){const e={streamToken:this.lastStreamToken,writes:t.map((n=>us(this.serializer,n)))};this.q_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pI{}class gI extends pI{constructor(t,e,n,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=n,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new C(P.FAILED_PRECONDITION,"The client has already been terminated.")}Go(t,e,n,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Go(t,ma(e,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new C(P.UNKNOWN,i.toString())}))}Ho(t,e,n,s,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection.Ho(t,ma(e,n),s,o,c,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new C(P.UNKNOWN,o.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}class _I{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(t){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ca("Offline")))}set(t){this.Pa(),this.oa=0,t==="Online"&&(this.aa=!1),this.ca(t)}ca(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}la(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(dt(e),this.aa=!1):V("OnlineStateTracker",e)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mn="RemoteStore";class yI{constructor(t,e,n,s,i){this.localStore=t,this.datastore=e,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=i,this.Aa.Oo((o=>{n.enqueueAndForget((async()=>{_n(this)&&(V(mn,"Restarting streams for network reachability change."),await(async function(u){const h=F(u);h.Ea.add(4),await Es(h),h.Ra.set("Unknown"),h.Ea.delete(4),await Gi(h)})(this))}))})),this.Ra=new _I(n,s)}}async function Gi(r){if(_n(r))for(const t of r.da)await t(!0)}async function Es(r){for(const t of r.da)await t(!1)}function Ki(r,t){const e=F(r);e.Ia.has(t.targetId)||(e.Ia.set(t.targetId,t),uc(e)?cc(e):cr(e).O_()&&ac(e,t))}function Yn(r,t){const e=F(r),n=cr(e);e.Ia.delete(t),n.O_()&&Gf(e,t),e.Ia.size===0&&(n.O_()?n.L_():_n(e)&&e.Ra.set("Unknown"))}function ac(r,t){if(r.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(B.min())>0){const e=r.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}cr(r).Y_(t)}function Gf(r,t){r.Va.Ue(t),cr(r).Z_(t)}function cc(r){r.Va=new fy({getRemoteKeysForTarget:t=>r.remoteSyncer.getRemoteKeysForTarget(t),At:t=>r.Ia.get(t)||null,ht:()=>r.datastore.serializer.databaseId}),cr(r).start(),r.Ra.ua()}function uc(r){return _n(r)&&!cr(r).x_()&&r.Ia.size>0}function _n(r){return F(r).Ea.size===0}function Kf(r){r.Va=void 0}async function II(r){r.Ra.set("Online")}async function TI(r){r.Ia.forEach(((t,e)=>{ac(r,t)}))}async function EI(r,t){Kf(r),uc(r)?(r.Ra.ha(t),cc(r)):r.Ra.set("Unknown")}async function wI(r,t,e){if(r.Ra.set("Online"),t instanceof rf&&t.state===2&&t.cause)try{await(async function(s,i){const o=i.cause;for(const c of i.targetIds)s.Ia.has(c)&&(await s.remoteSyncer.rejectListen(c,o),s.Ia.delete(c),s.Va.removeTarget(c))})(r,t)}catch(n){V(mn,"Failed to remove targets %s: %s ",t.targetIds.join(","),n),await Ii(r,n)}else if(t instanceof Zs?r.Va.Ze(t):t instanceof nf?r.Va.st(t):r.Va.tt(t),!e.isEqual(B.min()))try{const n=await Mf(r.localStore);e.compareTo(n)>=0&&await(function(i,o){const c=i.Va.Tt(o);return c.targetChanges.forEach(((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const f=i.Ia.get(h);f&&i.Ia.set(h,f.withResumeToken(u.resumeToken,o))}})),c.targetMismatches.forEach(((u,h)=>{const f=i.Ia.get(u);if(!f)return;i.Ia.set(u,f.withResumeToken(ht.EMPTY_BYTE_STRING,f.snapshotVersion)),Gf(i,u);const p=new se(f.target,u,h,f.sequenceNumber);ac(i,p)})),i.remoteSyncer.applyRemoteEvent(c)})(r,e)}catch(n){V(mn,"Failed to raise snapshot:",n),await Ii(r,n)}}async function Ii(r,t,e){if(!Le(t))throw t;r.Ea.add(1),await Es(r),r.Ra.set("Offline"),e||(e=()=>Mf(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{V(mn,"Retrying IndexedDB access"),await e(),r.Ea.delete(1),await Gi(r)}))}function Hf(r,t){return t().catch((e=>Ii(r,e,t)))}async function ar(r){const t=F(r),e=Me(t);let n=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:sn;for(;AI(t);)try{const s=await aI(t.localStore,n);if(s===null){t.Ta.length===0&&e.L_();break}n=s.batchId,vI(t,s)}catch(s){await Ii(t,s)}Qf(t)&&Wf(t)}function AI(r){return _n(r)&&r.Ta.length<10}function vI(r,t){r.Ta.push(t);const e=Me(r);e.O_()&&e.X_&&e.ea(t.mutations)}function Qf(r){return _n(r)&&!Me(r).x_()&&r.Ta.length>0}function Wf(r){Me(r).start()}async function bI(r){Me(r).ra()}async function RI(r){const t=Me(r);for(const e of r.Ta)t.ea(e.mutations)}async function SI(r,t,e){const n=r.Ta.shift(),s=Qa.from(n,t,e);await Hf(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await ar(r)}async function PI(r,t){t&&Me(r).X_&&await(async function(n,s){if((function(o){return tf(o)&&o!==P.ABORTED})(s.code)){const i=n.Ta.shift();Me(n).B_(),await Hf(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await ar(n)}})(r,t),Qf(r)&&Wf(r)}async function sh(r,t){const e=F(r);e.asyncQueue.verifyOperationInProgress(),V(mn,"RemoteStore received new credentials");const n=_n(e);e.Ea.add(3),await Es(e),n&&e.Ra.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Ea.delete(3),await Gi(e)}async function Aa(r,t){const e=F(r);t?(e.Ea.delete(2),await Gi(e)):t||(e.Ea.add(2),await Es(e),e.Ra.set("Unknown"))}function cr(r){return r.ma||(r.ma=(function(e,n,s){const i=F(e);return i.sa(),new fI(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Xo:II.bind(null,r),t_:TI.bind(null,r),r_:EI.bind(null,r),H_:wI.bind(null,r)}),r.da.push((async t=>{t?(r.ma.B_(),uc(r)?cc(r):r.Ra.set("Unknown")):(await r.ma.stop(),Kf(r))}))),r.ma}function Me(r){return r.fa||(r.fa=(function(e,n,s){const i=F(e);return i.sa(),new mI(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Xo:()=>Promise.resolve(),t_:bI.bind(null,r),r_:PI.bind(null,r),ta:RI.bind(null,r),na:SI.bind(null,r)}),r.da.push((async t=>{t?(r.fa.B_(),await ar(r)):(await r.fa.stop(),r.Ta.length>0&&(V(mn,`Stopping write stream with ${r.Ta.length} pending writes`),r.Ta=[]))}))),r.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(t,e,n,s,i){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new Kt,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,s,i){const o=Date.now()+n,c=new lc(t,e,o,s,i);return c.start(n),c}start(t){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new C(P.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((t=>this.deferred.resolve(t)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function hc(r,t){if(dt("AsyncQueue",`${t}: ${r}`),Le(r))return new C(P.UNAVAILABLE,`${t}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{static emptySet(t){return new kn(t.comparator)}constructor(t){this.comparator=t?(e,n)=>t(e,n)||M.comparator(e.key,n.key):(e,n)=>M.comparator(e.key,n.key),this.keyedMap=Or(),this.sortedSet=new rt(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal(((e,n)=>(t(e),!1)))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof kn)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),n=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const t=[];return this.forEach((e=>{t.push(e.toString())})),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const n=new kn;return n.comparator=this.comparator,n.keyedMap=t,n.sortedSet=e,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ih{constructor(){this.ga=new rt(M.comparator)}track(t){const e=t.doc.key,n=this.ga.get(e);n?t.type!==0&&n.type===3?this.ga=this.ga.insert(e,t):t.type===3&&n.type!==1?this.ga=this.ga.insert(e,{type:n.type,doc:t.doc}):t.type===2&&n.type===2?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):t.type===2&&n.type===0?this.ga=this.ga.insert(e,{type:0,doc:t.doc}):t.type===1&&n.type===0?this.ga=this.ga.remove(e):t.type===1&&n.type===2?this.ga=this.ga.insert(e,{type:1,doc:n.doc}):t.type===0&&n.type===1?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):O(63341,{Rt:t,pa:n}):this.ga=this.ga.insert(e,t)}ya(){const t=[];return this.ga.inorderTraversal(((e,n)=>{t.push(n)})),t}}class Zn{constructor(t,e,n,s,i,o,c,u,h){this.query=t,this.docs=e,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(t,e,n,s,i){const o=[];return e.forEach((c=>{o.push({type:0,doc:c})})),new Zn(t,e,kn.emptySet(e),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&Li(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,n=t.docChanges;if(e.length!==n.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==n[s].type||!e[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VI{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((t=>t.Da()))}}class CI{constructor(){this.queries=oh(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(e,n){const s=F(e),i=s.queries;s.queries=oh(),i.forEach(((o,c)=>{for(const u of c.Sa)u.onError(n)}))})(this,new C(P.ABORTED,"Firestore shutting down"))}}function oh(){return new me((r=>qd(r)),Li)}async function dc(r,t){const e=F(r);let n=3;const s=t.query;let i=e.queries.get(s);i?!i.ba()&&t.Da()&&(n=2):(i=new VI,n=t.Da()?0:1);try{switch(n){case 0:i.wa=await e.onListen(s,!0);break;case 1:i.wa=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(o){const c=hc(o,`Initialization of query '${Cn(t.query)}' failed`);return void t.onError(c)}e.queries.set(s,i),i.Sa.push(t),t.va(e.onlineState),i.wa&&t.Fa(i.wa)&&mc(e)}async function fc(r,t){const e=F(r),n=t.query;let s=3;const i=e.queries.get(n);if(i){const o=i.Sa.indexOf(t);o>=0&&(i.Sa.splice(o,1),i.Sa.length===0?s=t.Da()?0:1:!i.ba()&&t.Da()&&(s=2))}switch(s){case 0:return e.queries.delete(n),e.onUnlisten(n,!0);case 1:return e.queries.delete(n),e.onUnlisten(n,!1);case 2:return e.onLastRemoteStoreUnlisten(n);default:return}}function DI(r,t){const e=F(r);let n=!1;for(const s of t){const i=s.query,o=e.queries.get(i);if(o){for(const c of o.Sa)c.Fa(s)&&(n=!0);o.wa=s}}n&&mc(e)}function xI(r,t,e){const n=F(r),s=n.queries.get(t);if(s)for(const i of s.Sa)i.onError(e);n.queries.delete(t)}function mc(r){r.Ca.forEach((t=>{t.next()}))}var va,ah;(ah=va||(va={})).Ma="default",ah.Cache="cache";class pc{constructor(t,e,n){this.query=t,this.xa=e,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(t){if(!this.options.includeMetadataChanges){const n=[];for(const s of t.docChanges)s.type!==3&&n.push(s);t=new Zn(t.query,t.docs,t.oldDocs,n,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.Oa?this.Ba(t)&&(this.xa.next(t),e=!0):this.La(t,this.onlineState)&&(this.ka(t),e=!0),this.Na=t,e}onError(t){this.xa.error(t)}va(t){this.onlineState=t;let e=!1;return this.Na&&!this.Oa&&this.La(this.Na,t)&&(this.ka(this.Na),e=!0),e}La(t,e){if(!t.fromCache||!this.Da())return!0;const n=e!=="Offline";return(!this.options.qa||!n)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}Ba(t){if(t.docChanges.length>0)return!0;const e=this.Na&&this.Na.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}ka(t){t=Zn.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.Oa=!0,this.xa.next(t)}Da(){return this.options.source!==va.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jf{constructor(t){this.key=t}}class Xf{constructor(t){this.key=t}}class NI{constructor(t,e){this.query=t,this.Ya=e,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=G(),this.mutatedKeys=G(),this.eu=$d(t),this.tu=new kn(this.eu)}get nu(){return this.Ya}ru(t,e){const n=e?e.iu:new ih,s=e?e.tu:this.tu;let i=e?e.mutatedKeys:this.mutatedKeys,o=s,c=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,h=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal(((f,p)=>{const g=s.get(f),R=ys(this.query,p)?p:null,D=!!g&&this.mutatedKeys.has(g.key),N=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let x=!1;g&&R?g.data.isEqual(R.data)?D!==N&&(n.track({type:3,doc:R}),x=!0):this.su(g,R)||(n.track({type:2,doc:R}),x=!0,(u&&this.eu(R,u)>0||h&&this.eu(R,h)<0)&&(c=!0)):!g&&R?(n.track({type:0,doc:R}),x=!0):g&&!R&&(n.track({type:1,doc:g}),x=!0,(u||h)&&(c=!0)),x&&(R?(o=o.add(R),i=N?i.add(f):i.delete(f)):(o=o.delete(f),i=i.delete(f)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),i=i.delete(f.key),n.track({type:1,doc:f})}return{tu:o,iu:n,Cs:c,mutatedKeys:i}}su(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,n,s){const i=this.tu;this.tu=t.tu,this.mutatedKeys=t.mutatedKeys;const o=t.iu.ya();o.sort(((f,p)=>(function(R,D){const N=x=>{switch(x){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return O(20277,{Rt:x})}};return N(R)-N(D)})(f.type,p.type)||this.eu(f.doc,p.doc))),this.ou(n),s=s??!1;const c=e&&!s?this._u():[],u=this.Xa.size===0&&this.current&&!s?1:0,h=u!==this.Za;return this.Za=u,o.length!==0||h?{snapshot:new Zn(this.query,t.tu,i,o,t.mutatedKeys,u===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:c}:{au:c}}va(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new ih,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(t){return!this.Ya.has(t)&&!!this.tu.has(t)&&!this.tu.get(t).hasLocalMutations}ou(t){t&&(t.addedDocuments.forEach((e=>this.Ya=this.Ya.add(e))),t.modifiedDocuments.forEach((e=>{})),t.removedDocuments.forEach((e=>this.Ya=this.Ya.delete(e))),this.current=t.current)}_u(){if(!this.current)return[];const t=this.Xa;this.Xa=G(),this.tu.forEach((n=>{this.uu(n.key)&&(this.Xa=this.Xa.add(n.key))}));const e=[];return t.forEach((n=>{this.Xa.has(n)||e.push(new Xf(n))})),this.Xa.forEach((n=>{t.has(n)||e.push(new Jf(n))})),e}cu(t){this.Ya=t.Qs,this.Xa=G();const e=this.ru(t.documents);return this.applyChanges(e,!0)}lu(){return Zn.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const ur="SyncEngine";class kI{constructor(t,e,n){this.query=t,this.targetId=e,this.view=n}}class MI{constructor(t){this.key=t,this.hu=!1}}class OI{constructor(t,e,n,s,i,o){this.localStore=t,this.remoteStore=e,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Pu={},this.Tu=new me((c=>qd(c)),Li),this.Iu=new Map,this.Eu=new Set,this.du=new rt(M.comparator),this.Au=new Map,this.Ru=new tc,this.Vu={},this.mu=new Map,this.fu=fn.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function FI(r,t,e=!0){const n=Hi(r);let s;const i=n.Tu.get(t);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lu()):s=await Yf(n,t,e,!0),s}async function LI(r,t){const e=Hi(r);await Yf(e,t,!0,!1)}async function Yf(r,t,e,n){const s=await gi(r.localStore,Ut(t)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,e);let c;return n&&(c=await gc(r,t,i,o==="current",s.resumeToken)),r.isPrimaryClient&&e&&Ki(r.remoteStore,s),c}async function gc(r,t,e,n,s){r.pu=(p,g,R)=>(async function(N,x,$,q){let U=x.view.ru($);U.Cs&&(U=await Ta(N.localStore,x.query,!1).then((({documents:T})=>x.view.ru(T,U))));const X=q&&q.targetChanges.get(x.targetId),Y=q&&q.targetMismatches.get(x.targetId)!=null,H=x.view.applyChanges(U,N.isPrimaryClient,X,Y);return ba(N,x.targetId,H.au),H.snapshot})(r,p,g,R);const i=await Ta(r.localStore,t,!0),o=new NI(t,i.Qs),c=o.ru(i.documents),u=Ts.createSynthesizedTargetChangeForCurrentChange(e,n&&r.onlineState!=="Offline",s),h=o.applyChanges(c,r.isPrimaryClient,u);ba(r,e,h.au);const f=new kI(t,e,o);return r.Tu.set(t,f),r.Iu.has(e)?r.Iu.get(e).push(t):r.Iu.set(e,[t]),h.snapshot}async function BI(r,t,e){const n=F(r),s=n.Tu.get(t),i=n.Iu.get(s.targetId);if(i.length>1)return n.Iu.set(s.targetId,i.filter((o=>!Li(o,t)))),void n.Tu.delete(t);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await Xn(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),e&&Yn(n.remoteStore,s.targetId),tr(n,s.targetId)})).catch(Fe)):(tr(n,s.targetId),await Xn(n.localStore,s.targetId,!0))}async function UI(r,t){const e=F(r),n=e.Tu.get(t),s=e.Iu.get(n.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(n.targetId),Yn(e.remoteStore,n.targetId))}async function qI(r,t,e){const n=Tc(r);try{const s=await(function(o,c){const u=F(o),h=Z.now(),f=c.reduce(((R,D)=>R.add(D.key)),G());let p,g;return u.persistence.runTransaction("Locally write mutations","readwrite",(R=>{let D=Bt(),N=G();return u.Ns.getEntries(R,f).next((x=>{D=x,D.forEach((($,q)=>{q.isValidDocument()||(N=N.add($))}))})).next((()=>u.localDocuments.getOverlayedDocuments(R,D))).next((x=>{p=x;const $=[];for(const q of c){const U=uy(q,p.get(q.key).overlayedDocument);U!=null&&$.push(new pe(q.key,U,Dd(U.value.mapValue),ct.exists(!0)))}return u.mutationQueue.addMutationBatch(R,h,$,c)})).next((x=>{g=x;const $=x.applyToLocalDocumentSet(p,N);return u.documentOverlayCache.saveOverlays(R,x.batchId,$)}))})).then((()=>({batchId:g.batchId,changes:Gd(p)})))})(n.localStore,t);n.sharedClientState.addPendingMutation(s.batchId),(function(o,c,u){let h=o.Vu[o.currentUser.toKey()];h||(h=new rt(j)),h=h.insert(c,u),o.Vu[o.currentUser.toKey()]=h})(n,s.batchId,e),await Ue(n,s.changes),await ar(n.remoteStore)}catch(s){const i=hc(s,"Failed to persist write");e.reject(i)}}async function Zf(r,t){const e=F(r);try{const n=await iI(e.localStore,t);t.targetChanges.forEach(((s,i)=>{const o=e.Au.get(i);o&&(L(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.hu=!0:s.modifiedDocuments.size>0?L(o.hu,14607):s.removedDocuments.size>0&&(L(o.hu,42227),o.hu=!1))})),await Ue(e,n,t)}catch(n){await Fe(n)}}function ch(r,t,e){const n=F(r);if(n.isPrimaryClient&&e===0||!n.isPrimaryClient&&e===1){const s=[];n.Tu.forEach(((i,o)=>{const c=o.view.va(t);c.snapshot&&s.push(c.snapshot)})),(function(o,c){const u=F(o);u.onlineState=c;let h=!1;u.queries.forEach(((f,p)=>{for(const g of p.Sa)g.va(c)&&(h=!0)})),h&&mc(u)})(n.eventManager,t),s.length&&n.Pu.H_(s),n.onlineState=t,n.isPrimaryClient&&n.sharedClientState.setOnlineState(t)}}async function jI(r,t,e){const n=F(r);n.sharedClientState.updateQueryState(t,"rejected",e);const s=n.Au.get(t),i=s&&s.key;if(i){let o=new rt(M.comparator);o=o.insert(i,ot.newNoDocument(i,B.min()));const c=G().add(i),u=new Is(B.min(),new Map,new rt(j),o,c);await Zf(n,u),n.du=n.du.remove(i),n.Au.delete(t),Ic(n)}else await Xn(n.localStore,t,!1).then((()=>tr(n,t,e))).catch(Fe)}async function $I(r,t){const e=F(r),n=t.batch.batchId;try{const s=await sI(e.localStore,t);yc(e,n,null),_c(e,n),e.sharedClientState.updateMutationState(n,"acknowledged"),await Ue(e,s)}catch(s){await Fe(s)}}async function zI(r,t,e){const n=F(r);try{const s=await(function(o,c){const u=F(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let f;return u.mutationQueue.lookupMutationBatch(h,c).next((p=>(L(p!==null,37113),f=p.keys(),u.mutationQueue.removeMutationBatch(h,p)))).next((()=>u.mutationQueue.performConsistencyCheck(h))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,c))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f))).next((()=>u.localDocuments.getDocuments(h,f)))}))})(n.localStore,t);yc(n,t,e),_c(n,t),n.sharedClientState.updateMutationState(t,"rejected",e),await Ue(n,s)}catch(s){await Fe(s)}}function _c(r,t){(r.mu.get(t)||[]).forEach((e=>{e.resolve()})),r.mu.delete(t)}function yc(r,t,e){const n=F(r);let s=n.Vu[n.currentUser.toKey()];if(s){const i=s.get(t);i&&(e?i.reject(e):i.resolve(),s=s.remove(t)),n.Vu[n.currentUser.toKey()]=s}}function tr(r,t,e=null){r.sharedClientState.removeLocalQueryTarget(t);for(const n of r.Iu.get(t))r.Tu.delete(n),e&&r.Pu.yu(n,e);r.Iu.delete(t),r.isPrimaryClient&&r.Ru.jr(t).forEach((n=>{r.Ru.containsKey(n)||tm(r,n)}))}function tm(r,t){r.Eu.delete(t.path.canonicalString());const e=r.du.get(t);e!==null&&(Yn(r.remoteStore,e),r.du=r.du.remove(t),r.Au.delete(e),Ic(r))}function ba(r,t,e){for(const n of e)n instanceof Jf?(r.Ru.addReference(n.key,t),GI(r,n)):n instanceof Xf?(V(ur,"Document no longer in limbo: "+n.key),r.Ru.removeReference(n.key,t),r.Ru.containsKey(n.key)||tm(r,n.key)):O(19791,{wu:n})}function GI(r,t){const e=t.key,n=e.path.canonicalString();r.du.get(e)||r.Eu.has(n)||(V(ur,"New document in limbo: "+e),r.Eu.add(n),Ic(r))}function Ic(r){for(;r.Eu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const t=r.Eu.values().next().value;r.Eu.delete(t);const e=new M(J.fromString(t)),n=r.fu.next();r.Au.set(n,new MI(e)),r.du=r.du.insert(e,n),Ki(r.remoteStore,new se(Ut(_s(e.path)),n,"TargetPurposeLimboResolution",Mt.ce))}}async function Ue(r,t,e){const n=F(r),s=[],i=[],o=[];n.Tu.isEmpty()||(n.Tu.forEach(((c,u)=>{o.push(n.pu(u,t,e).then((h=>{var f;if((h||e)&&n.isPrimaryClient){const p=h?!h.fromCache:(f=e==null?void 0:e.targetChanges.get(u.targetId))==null?void 0:f.current;n.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(h){s.push(h);const p=rc.As(u.targetId,h);i.push(p)}})))})),await Promise.all(o),n.Pu.H_(s),await(async function(u,h){const f=F(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(p=>A.forEach(h,(g=>A.forEach(g.Es,(R=>f.persistence.referenceDelegate.addReference(p,g.targetId,R))).next((()=>A.forEach(g.ds,(R=>f.persistence.referenceDelegate.removeReference(p,g.targetId,R)))))))))}catch(p){if(!Le(p))throw p;V(sc,"Failed to update sequence numbers: "+p)}for(const p of h){const g=p.targetId;if(!p.fromCache){const R=f.Ms.get(g),D=R.snapshotVersion,N=R.withLastLimboFreeSnapshotVersion(D);f.Ms=f.Ms.insert(g,N)}}})(n.localStore,i))}async function KI(r,t){const e=F(r);if(!e.currentUser.isEqual(t)){V(ur,"User change. New user:",t.toKey());const n=await kf(e.localStore,t);e.currentUser=t,(function(i,o){i.mu.forEach((c=>{c.forEach((u=>{u.reject(new C(P.CANCELLED,o))}))})),i.mu.clear()})(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,n.removedBatchIds,n.addedBatchIds),await Ue(e,n.Ls)}}function HI(r,t){const e=F(r),n=e.Au.get(t);if(n&&n.hu)return G().add(n.key);{let s=G();const i=e.Iu.get(t);if(!i)return s;for(const o of i){const c=e.Tu.get(o);s=s.unionWith(c.view.nu)}return s}}async function QI(r,t){const e=F(r),n=await Ta(e.localStore,t.query,!0),s=t.view.cu(n);return e.isPrimaryClient&&ba(e,t.targetId,s.au),s}async function WI(r,t){const e=F(r);return Ff(e.localStore,t).then((n=>Ue(e,n)))}async function JI(r,t,e,n){const s=F(r),i=await(function(c,u){const h=F(c),f=F(h.mutationQueue);return h.persistence.runTransaction("Lookup mutation documents","readonly",(p=>f.er(p,u).next((g=>g?h.localDocuments.getDocuments(p,g):A.resolve(null)))))})(s.localStore,t);i!==null?(e==="pending"?await ar(s.remoteStore):e==="acknowledged"||e==="rejected"?(yc(s,t,n||null),_c(s,t),(function(c,u){F(F(c).mutationQueue).ir(u)})(s.localStore,t)):O(6720,"Unknown batchState",{Su:e}),await Ue(s,i)):V(ur,"Cannot apply mutation batch with id: "+t)}async function XI(r,t){const e=F(r);if(Hi(e),Tc(e),t===!0&&e.gu!==!0){const n=e.sharedClientState.getAllActiveQueryTargets(),s=await uh(e,n.toArray());e.gu=!0,await Aa(e.remoteStore,!0);for(const i of s)Ki(e.remoteStore,i)}else if(t===!1&&e.gu!==!1){const n=[];let s=Promise.resolve();e.Iu.forEach(((i,o)=>{e.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then((()=>(tr(e,o),Xn(e.localStore,o,!0)))),Yn(e.remoteStore,o)})),await s,await uh(e,n),(function(o){const c=F(o);c.Au.forEach(((u,h)=>{Yn(c.remoteStore,h)})),c.Ru.Jr(),c.Au=new Map,c.du=new rt(M.comparator)})(e),e.gu=!1,await Aa(e.remoteStore,!1)}}async function uh(r,t,e){const n=F(r),s=[],i=[];for(const o of t){let c;const u=n.Iu.get(o);if(u&&u.length!==0){c=await gi(n.localStore,Ut(u[0]));for(const h of u){const f=n.Tu.get(h),p=await QI(n,f);p.snapshot&&i.push(p.snapshot)}}else{const h=await Of(n.localStore,o);c=await gi(n.localStore,h),await gc(n,em(h),o,!1,c.resumeToken)}s.push(c)}return n.Pu.H_(i),s}function em(r){return Bd(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function YI(r){return(function(e){return F(F(e).persistence).Ts()})(F(r).localStore)}async function ZI(r,t,e,n){const s=F(r);if(s.gu)return void V(ur,"Ignoring unexpected query state notification.");const i=s.Iu.get(t);if(i&&i.length>0)switch(e){case"current":case"not-current":{const o=await Ff(s.localStore,jd(i[0])),c=Is.createSynthesizedRemoteEventForCurrentChange(t,e==="current",ht.EMPTY_BYTE_STRING);await Ue(s,o,c);break}case"rejected":await Xn(s.localStore,t,!0),tr(s,t,n);break;default:O(64155,e)}}async function tT(r,t,e){const n=Hi(r);if(n.gu){for(const s of t){if(n.Iu.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){V(ur,"Adding an already active target "+s);continue}const i=await Of(n.localStore,s),o=await gi(n.localStore,i);await gc(n,em(i),o.targetId,!1,o.resumeToken),Ki(n.remoteStore,o)}for(const s of e)n.Iu.has(s)&&await Xn(n.localStore,s,!1).then((()=>{Yn(n.remoteStore,s),tr(n,s)})).catch(Fe)}}function Hi(r){const t=F(r);return t.remoteStore.remoteSyncer.applyRemoteEvent=Zf.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=HI.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=jI.bind(null,t),t.Pu.H_=DI.bind(null,t.eventManager),t.Pu.yu=xI.bind(null,t.eventManager),t}function Tc(r){const t=F(r);return t.remoteStore.remoteSyncer.applySuccessfulWrite=$I.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=zI.bind(null,t),t}class ls{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=zi(t.databaseInfo.databaseId),this.sharedClientState=this.Du(t),this.persistence=this.Cu(t),await this.persistence.start(),this.localStore=this.vu(t),this.gcScheduler=this.Fu(t,this.localStore),this.indexBackfillerScheduler=this.Mu(t,this.localStore)}Fu(t,e){return null}Mu(t,e){return null}vu(t){return Nf(this.persistence,new xf,t.initialUser,this.serializer)}Cu(t){return new ec($i.mi,this.serializer)}Du(t){return new jf}async terminate(){var t,e;(t=this.gcScheduler)==null||t.stop(),(e=this.indexBackfillerScheduler)==null||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ls.provider={build:()=>new ls};class eT extends ls{constructor(t){super(),this.cacheSizeBytes=t}Fu(t,e){L(this.persistence.referenceDelegate instanceof pi,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Rf(n,t.asyncQueue,e)}Cu(t){const e=this.cacheSizeBytes!==void 0?Rt.withCacheSize(this.cacheSizeBytes):Rt.DEFAULT;return new ec((n=>pi.mi(n,e)),this.serializer)}}class nm extends ls{constructor(t,e,n){super(),this.xu=t,this.cacheSizeBytes=e,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(t){await super.initialize(t),await this.xu.initialize(this,t),await Tc(this.xu.syncEngine),await ar(this.xu.remoteStore),await this.persistence.Ji((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}vu(t){return Nf(this.persistence,new xf,t.initialUser,this.serializer)}Fu(t,e){const n=this.persistence.referenceDelegate.garbageCollector;return new Rf(n,t.asyncQueue,e)}Mu(t,e){const n=new d_(e,this.persistence);return new h_(t.asyncQueue,n)}Cu(t){const e=Df(t.databaseInfo.databaseId,t.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Rt.withCacheSize(this.cacheSizeBytes):Rt.DEFAULT;return new nc(this.synchronizeTabs,e,t.clientId,n,t.asyncQueue,$f(),ei(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Du(t){return new jf}}class nT extends nm{constructor(t,e){super(t,e,!1),this.xu=t,this.cacheSizeBytes=e,this.synchronizeTabs=!0}async initialize(t){await super.initialize(t);const e=this.xu.syncEngine;this.sharedClientState instanceof $o&&(this.sharedClientState.syncEngine={Co:JI.bind(null,e),vo:ZI.bind(null,e),Fo:tT.bind(null,e),Ts:YI.bind(null,e),Do:WI.bind(null,e)},await this.sharedClientState.start()),await this.persistence.Ji((async n=>{await XI(this.xu.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}Du(t){const e=$f();if(!$o.v(e))throw new C(P.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=Df(t.databaseInfo.databaseId,t.databaseInfo.persistenceKey);return new $o(e,t.asyncQueue,n,t.clientId,t.initialUser)}}class hs{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>ch(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=KI.bind(null,this.syncEngine),await Aa(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return(function(){return new CI})()}createDatastore(t){const e=zi(t.databaseInfo.databaseId),n=(function(i){return new dI(i)})(t.databaseInfo);return(function(i,o,c,u){return new gI(i,o,c,u)})(t.authCredentials,t.appCheckCredentials,n,e)}createRemoteStore(t){return(function(n,s,i,o,c){return new yI(n,s,i,o,c)})(this.localStore,this.datastore,t.asyncQueue,(e=>ch(this.syncEngine,e,0)),(function(){return nh.v()?new nh:new cI})())}createSyncEngine(t,e){return(function(s,i,o,c,u,h,f){const p=new OI(s,i,o,c,u,h);return f&&(p.gu=!0),p})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await(async function(s){const i=F(s);V(mn,"RemoteStore shutting down."),i.Ea.add(5),await Es(i),i.Aa.shutdown(),i.Ra.set("Unknown")})(this.remoteStore),(t=this.datastore)==null||t.terminate(),(e=this.eventManager)==null||e.terminate()}}hs.provider={build:()=>new hs};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ec{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ou(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ou(this.observer.error,t):dt("Uncaught Error in snapshot listener:",t.toString()))}Nu(){this.muted=!0}Ou(t,e){setTimeout((()=>{this.muted||t(e)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rT{constructor(t){this.datastore=t,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(t){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new C(P.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const e=await(async function(s,i){const o=F(s),c={documents:i.map((p=>cs(o.serializer,p)))},u=await o.Ho("BatchGetDocuments",o.serializer.databaseId,J.emptyPath(),c,i.length),h=new Map;u.forEach((p=>{const g=Ty(o.serializer,p);h.set(g.key.toString(),g)}));const f=[];return i.forEach((p=>{const g=h.get(p.toString());L(!!g,55234,{key:p}),f.push(g)})),f})(this.datastore,t);return e.forEach((n=>this.recordVersion(n))),e}set(t,e){this.write(e.toMutation(t,this.precondition(t))),this.writtenDocs.add(t.toString())}update(t,e){try{this.write(e.toMutation(t,this.preconditionForUpdate(t)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(t.toString())}delete(t){this.write(new or(t,this.precondition(t))),this.writtenDocs.add(t.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const t=this.readVersions;this.mutations.forEach((e=>{t.delete(e.key.toString())})),t.forEach(((e,n)=>{const s=M.fromPath(n);this.mutations.push(new Ka(s,this.precondition(s)))})),await(async function(n,s){const i=F(n),o={writes:s.map((c=>us(i.serializer,c)))};await i.Go("Commit",i.serializer.databaseId,J.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(t){let e;if(t.isFoundDocument())e=t.version;else{if(!t.isNoDocument())throw O(50498,{Gu:t.constructor.name});e=B.min()}const n=this.readVersions.get(t.key.toString());if(n){if(!e.isEqual(n))throw new C(P.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(t.key.toString(),e)}precondition(t){const e=this.readVersions.get(t.toString());return!this.writtenDocs.has(t.toString())&&e?e.isEqual(B.min())?ct.exists(!1):ct.updateTime(e):ct.none()}preconditionForUpdate(t){const e=this.readVersions.get(t.toString());if(!this.writtenDocs.has(t.toString())&&e){if(e.isEqual(B.min()))throw new C(P.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return ct.updateTime(e)}return ct.exists(!0)}write(t){this.ensureCommitNotCalled(),this.mutations.push(t)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sT{constructor(t,e,n,s,i){this.asyncQueue=t,this.datastore=e,this.options=n,this.updateFunction=s,this.deferred=i,this.zu=n.maxAttempts,this.M_=new oc(this.asyncQueue,"transaction_retry")}ju(){this.zu-=1,this.Ju()}Ju(){this.M_.p_((async()=>{const t=new rT(this.datastore),e=this.Hu(t);e&&e.then((n=>{this.asyncQueue.enqueueAndForget((()=>t.commit().then((()=>{this.deferred.resolve(n)})).catch((s=>{this.Yu(s)}))))})).catch((n=>{this.Yu(n)}))}))}Hu(t){try{const e=this.updateFunction(t);return!ms(e)&&e.catch&&e.then?e:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(e){return this.deferred.reject(e),null}}Yu(t){this.zu>0&&this.Zu(t)?(this.zu-=1,this.asyncQueue.enqueueAndForget((()=>(this.Ju(),Promise.resolve())))):this.deferred.reject(t)}Zu(t){if((t==null?void 0:t.name)==="FirebaseError"){const e=t.code;return e==="aborted"||e==="failed-precondition"||e==="already-exists"||!tf(e)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oe="FirestoreClient";class iT{constructor(t,e,n,s,i){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=n,this.databaseInfo=s,this.user=bt.UNAUTHENTICATED,this.clientId=Ci.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{V(Oe,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(V(Oe,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new Kt;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const n=hc(e,"Failed to shutdown persistence");t.reject(n)}})),t.promise}}async function Go(r,t){r.asyncQueue.verifyOperationInProgress(),V(Oe,"Initializing OfflineComponentProvider");const e=r.configuration;await t.initialize(e);let n=e.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await kf(t.localStore,s),n=s)})),t.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=t}async function lh(r,t){r.asyncQueue.verifyOperationInProgress();const e=await oT(r);V(Oe,"Initializing OnlineComponentProvider"),await t.initialize(e,r.configuration),r.setCredentialChangeListener((n=>sh(t.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>sh(t.remoteStore,s))),r._onlineComponents=t}async function oT(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){V(Oe,"Using user provided OfflineComponentProvider");try{await Go(r,r._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!(function(s){return s.name==="FirebaseError"?s.code===P.FAILED_PRECONDITION||s.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(e))throw e;Fn("Error using user provided cache. Falling back to memory cache: "+e),await Go(r,new ls)}}else V(Oe,"Using default OfflineComponentProvider"),await Go(r,new eT(void 0));return r._offlineComponents}async function wc(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(V(Oe,"Using user provided OnlineComponentProvider"),await lh(r,r._uninitializedComponentsProvider._online)):(V(Oe,"Using default OnlineComponentProvider"),await lh(r,new hs))),r._onlineComponents}function aT(r){return wc(r).then((t=>t.syncEngine))}function cT(r){return wc(r).then((t=>t.datastore))}async function Ti(r){const t=await wc(r),e=t.eventManager;return e.onListen=FI.bind(null,t.syncEngine),e.onUnlisten=BI.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=LI.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=UI.bind(null,t.syncEngine),e}function uT(r,t,e={}){const n=new Kt;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,h){const f=new Ec({next:g=>{f.Nu(),o.enqueueAndForget((()=>fc(i,p)));const R=g.docs.has(c);!R&&g.fromCache?h.reject(new C(P.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&g.fromCache&&u&&u.source==="server"?h.reject(new C(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(g)},error:g=>h.reject(g)}),p=new pc(_s(c.path),f,{includeMetadataChanges:!0,qa:!0});return dc(i,p)})(await Ti(r),r.asyncQueue,t,e,n))),n.promise}function lT(r,t,e={}){const n=new Kt;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,h){const f=new Ec({next:g=>{f.Nu(),o.enqueueAndForget((()=>fc(i,p))),g.fromCache&&u.source==="server"?h.reject(new C(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(g)},error:g=>h.reject(g)}),p=new pc(c,f,{includeMetadataChanges:!0,qa:!0});return dc(i,p)})(await Ti(r),r.asyncQueue,t,e,n))),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rm(r){const t={};return r.timeoutSeconds!==void 0&&(t.timeoutSeconds=r.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hh=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hT="firestore.googleapis.com",dh=!0;class fh{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new C(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=hT,this.ssl=dh}else this.host=t.host,this.ssl=t.ssl??dh;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=Ef;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<bf)throw new C(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}sd("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=rm(t.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new C(P.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new C(P.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new C(P.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class Ac{constructor(t,e,n,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new fh({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new C(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new C(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new fh(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new ed;switch(n.type){case"firstParty":return new n_(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new C(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(e){const n=hh.get(e);n&&(V("ComponentProvider","Removing Datastore"),hh.delete(e),n.terminate())})(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new re(this.firestore,t,this._query)}}class ut{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ae(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new ut(this.firestore,t,this._key)}toJSON(){return{type:ut._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,n){if(fs(e,ut._jsonSchema))return new ut(t,n||null,new M(J.fromString(e.referencePath)))}}ut._jsonSchemaVersion="firestore/documentReference/1.0",ut._jsonSchema={type:mt("string",ut._jsonSchemaVersion),referencePath:mt("string")};class ae extends re{constructor(t,e,n){super(t,e,_s(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new ut(this.firestore,null,new M(t))}withConverter(t){return new ae(this.firestore,t,this._path)}}function dT(r,t,...e){if(r=pt(r),rd("collection","path",t),r instanceof Ac){const n=J.fromString(t,...e);return rl(n),new ae(r,null,n)}{if(!(r instanceof ut||r instanceof ae))throw new C(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(J.fromString(t,...e));return rl(n),new ae(r.firestore,null,n)}}function sm(r,t,...e){if(r=pt(r),arguments.length===1&&(t=Ci.newId()),rd("doc","path",t),r instanceof Ac){const n=J.fromString(t,...e);return nl(n),new ut(r,null,new M(n))}{if(!(r instanceof ut||r instanceof ae))throw new C(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(J.fromString(t,...e));return nl(n),new ut(r.firestore,r instanceof ae?r.converter:null,new M(n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mh="AsyncQueue";class ph{constructor(t=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new oc(this,"async_queue_retry"),this._c=()=>{const n=ei();n&&V(mh,"Visibility state changed to "+n.visibilityState),this.M_.w_()},this.ac=t;const e=ei();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.uc(),this.cc(t)}enterRestrictedMode(t){if(!this.ec){this.ec=!0,this.sc=t||!1;const e=ei();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this._c)}}enqueue(t){if(this.uc(),this.ec)return new Promise((()=>{}));const e=new Kt;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise))).then((()=>e.promise))}enqueueRetryable(t){this.enqueueAndForget((()=>(this.Xu.push(t),this.lc())))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(t){if(!Le(t))throw t;V(mh,"Operation failed with retryable error: "+t)}this.Xu.length>0&&this.M_.p_((()=>this.lc()))}}cc(t){const e=this.ac.then((()=>(this.rc=!0,t().catch((n=>{throw this.nc=n,this.rc=!1,dt("INTERNAL UNHANDLED ERROR: ",gh(n)),n})).then((n=>(this.rc=!1,n))))));return this.ac=e,e}enqueueAfterDelay(t,e,n){this.uc(),this.oc.indexOf(t)>-1&&(e=0);const s=lc.createAndSchedule(this,t,e,n,(i=>this.hc(i)));return this.tc.push(s),s}uc(){this.nc&&O(47125,{Pc:gh(this.nc)})}verifyOperationInProgress(){}async Tc(){let t;do t=this.ac,await t;while(t!==this.ac)}Ic(t){for(const e of this.tc)if(e.timerId===t)return!0;return!1}Ec(t){return this.Tc().then((()=>{this.tc.sort(((e,n)=>e.targetTimeMs-n.targetTimeMs));for(const e of this.tc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Tc()}))}dc(t){this.oc.push(t)}hc(t){const e=this.tc.indexOf(t);this.tc.splice(e,1)}}function gh(r){let t=r.message||"";return r.stack&&(t=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _h(r){return(function(e,n){if(typeof e!="object"||e===null)return!1;const s=e;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}class zt extends Ac{constructor(t,e,n,s){super(t,e,n,s),this.type="firestore",this._queue=new ph,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new ph(t),this._firestoreClient=void 0,await t}}}function fT(r,t,e){e||(e=ci);const n=nr(r,"firestore");if(n.isInitialized(e)){const s=n.getImmediate({identifier:e}),i=n.getOptions(e);if(On(i,t))return s;throw new C(P.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(t.cacheSizeBytes!==void 0&&t.localCache!==void 0)throw new C(P.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(t.cacheSizeBytes!==void 0&&t.cacheSizeBytes!==-1&&t.cacheSizeBytes<bf)throw new C(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&ds(t.host)&&Mh(t.host),n.initialize({options:t,instanceIdentifier:e})}function yn(r){if(r._terminated)throw new C(P.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||mT(r),r._firestoreClient}function mT(r){var n,s,i;const t=r._freezeSettings(),e=(function(c,u,h,f){return new U_(c,u,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,rm(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)})(r._databaseId,((n=r._app)==null?void 0:n.options.appId)||"",r._persistenceKey,t);r._componentsProvider||(s=t.localCache)!=null&&s._offlineComponentProvider&&((i=t.localCache)!=null&&i._onlineComponentProvider)&&(r._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),r._firestoreClient=new iT(r._authCredentials,r._appCheckCredentials,r._queue,e,r._componentsProvider&&(function(c){const u=c==null?void 0:c._online.build();return{_offline:c==null?void 0:c._offline.build(u),_online:u}})(r._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(t){this._byteString=t}static fromBase64String(t){try{return new kt(ht.fromBase64String(t))}catch(e){throw new C(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new kt(ht.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:kt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(fs(t,kt._jsonSchema))return kt.fromBase64String(t.bytes)}}kt._jsonSchemaVersion="firestore/bytes/1.0",kt._jsonSchema={type:mt("string",kt._jsonSchemaVersion),bytes:mt("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new C(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new at(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new C(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new C(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return j(this._lat,t._lat)||j(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ht._jsonSchemaVersion}}static fromJSON(t){if(fs(t,Ht._jsonSchema))return new Ht(t.latitude,t.longitude)}}Ht._jsonSchemaVersion="firestore/geoPoint/1.0",Ht._jsonSchema={type:mt("string",Ht._jsonSchemaVersion),latitude:mt("number"),longitude:mt("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qt{constructor(t){this._values=(t||[]).map((e=>e))}toArray(){return this._values.map((t=>t))}isEqual(t){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,t._values)}toJSON(){return{type:Qt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(fs(t,Qt._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every((e=>typeof e=="number")))return new Qt(t.vectorValues);throw new C(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Qt._jsonSchemaVersion="firestore/vectorValue/1.0",Qt._jsonSchema={type:mt("string",Qt._jsonSchemaVersion),vectorValues:mt("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pT=/^__.*__$/;class gT{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return this.fieldMask!==null?new pe(t,this.data,this.fieldMask,e,this.fieldTransforms):new ir(t,this.data,e,this.fieldTransforms)}}class im{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return new pe(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function om(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw O(40011,{Ac:r})}}class Qi{constructor(t,e,n,s,i,o){this.settings=t,this.databaseId=e,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.Rc(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(t){return new Qi({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),n=this.Vc({path:e,fc:!1});return n.gc(t),n}yc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),n=this.Vc({path:e,fc:!1});return n.Rc(),n}wc(t){return this.Vc({path:void 0,fc:!0})}Sc(t){return Ei(t,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(t){return this.fieldMask.find((e=>t.isPrefixOf(e)))!==void 0||this.fieldTransforms.find((e=>t.isPrefixOf(e.field)))!==void 0}Rc(){if(this.path)for(let t=0;t<this.path.length;t++)this.gc(this.path.get(t))}gc(t){if(t.length===0)throw this.Sc("Document fields must not be empty");if(om(this.Ac)&&pT.test(t))throw this.Sc('Document fields cannot begin and end with "__"')}}class _T{constructor(t,e,n){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=n||zi(t)}Cc(t,e,n,s=!1){return new Qi({Ac:t,methodName:e,Dc:n,path:at.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function hr(r){const t=r._freezeSettings(),e=zi(r._databaseId);return new _T(r._databaseId,!!t.ignoreUndefinedProperties,e)}function Wi(r,t,e,n,s,i={}){const o=r.Cc(i.merge||i.mergeFields?2:0,t,e,s);Pc("Data must be an object, but it was:",o,n);const c=am(n,o);let u,h;if(i.merge)u=new Ot(o.fieldMask),h=o.fieldTransforms;else if(i.mergeFields){const f=[];for(const p of i.mergeFields){const g=Ra(t,p,e);if(!o.contains(g))throw new C(P.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);um(f,g)||f.push(g)}u=new Ot(f),h=o.fieldTransforms.filter((p=>u.covers(p.field)))}else u=null,h=o.fieldTransforms;return new gT(new wt(c),u,h)}class Ji extends lr{_toFieldTransform(t){if(t.Ac!==2)throw t.Ac===1?t.Sc(`${this._methodName}() can only appear at the top level of your update data`):t.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Ji}}function yT(r,t,e){return new Qi({Ac:3,Dc:t.settings.Dc,methodName:r._methodName,fc:e},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class vc extends lr{_toFieldTransform(t){return new Ga(t.path,new Qn)}isEqual(t){return t instanceof vc}}class bc extends lr{constructor(t,e){super(t),this.vc=e}_toFieldTransform(t){const e=yT(this,t,!0),n=this.vc.map((i=>dr(i,e))),s=new ln(n);return new Ga(t.path,s)}isEqual(t){return t instanceof bc&&On(this.vc,t.vc)}}function Rc(r,t,e,n){const s=r.Cc(1,t,e);Pc("Data must be an object, but it was:",s,n);const i=[],o=wt.empty();Be(n,((u,h)=>{const f=Vc(t,u,e);h=pt(h);const p=s.yc(f);if(h instanceof Ji)i.push(f);else{const g=dr(h,p);g!=null&&(i.push(f),o.set(f,g))}}));const c=new Ot(i);return new im(o,c,s.fieldTransforms)}function Sc(r,t,e,n,s,i){const o=r.Cc(1,t,e),c=[Ra(t,n,e)],u=[s];if(i.length%2!=0)throw new C(P.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)c.push(Ra(t,i[g])),u.push(i[g+1]);const h=[],f=wt.empty();for(let g=c.length-1;g>=0;--g)if(!um(h,c[g])){const R=c[g];let D=u[g];D=pt(D);const N=o.yc(R);if(D instanceof Ji)h.push(R);else{const x=dr(D,N);x!=null&&(h.push(R),f.set(R,x))}}const p=new Ot(h);return new im(f,p,o.fieldTransforms)}function IT(r,t,e,n=!1){return dr(e,r.Cc(n?4:3,t))}function dr(r,t){if(cm(r=pt(r)))return Pc("Unsupported field value:",t,r),am(r,t);if(r instanceof lr)return(function(n,s){if(!om(s.Ac))throw s.Sc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(r,t),null;if(r===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),r instanceof Array){if(t.settings.fc&&t.Ac!==4)throw t.Sc("Nested arrays are not supported");return(function(n,s){const i=[];let o=0;for(const c of n){let u=dr(c,s.wc(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}})(r,t)}return(function(n,s){if((n=pt(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return ry(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=Z.fromDate(n);return{timestampValue:Jn(s.serializer,i)}}if(n instanceof Z){const i=new Z(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:Jn(s.serializer,i)}}if(n instanceof Ht)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof kt)return{bytesValue:sf(s.serializer,n._byteString)};if(n instanceof ut){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.Sc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Xa(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof Qt)return(function(o,c){return{mapValue:{fields:{[Ua]:{stringValue:qa},[zn]:{arrayValue:{values:o.toArray().map((h=>{if(typeof h!="number")throw c.Sc("VectorValues must only contain numeric values.");return za(c.serializer,h)}))}}}}}})(n,s);throw s.Sc(`Unsupported field value: ${Di(n)}`)})(r,t)}function am(r,t){const e={};return wd(r)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Be(r,((n,s)=>{const i=dr(s,t.mc(n));i!=null&&(e[n]=i)})),{mapValue:{fields:e}}}function cm(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof Z||r instanceof Ht||r instanceof kt||r instanceof ut||r instanceof lr||r instanceof Qt)}function Pc(r,t,e){if(!cm(e)||!id(e)){const n=Di(e);throw n==="an object"?t.Sc(r+" a custom object"):t.Sc(r+" "+n)}}function Ra(r,t,e){if((t=pt(t))instanceof In)return t._internalPath;if(typeof t=="string")return Vc(r,t);throw Ei("Field path arguments must be of type string or ",r,!1,void 0,e)}const TT=new RegExp("[~\\*/\\[\\]]");function Vc(r,t,e){if(t.search(TT)>=0)throw Ei(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,e);try{return new In(...t.split("."))._internalPath}catch{throw Ei(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,e)}}function Ei(r,t,e,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let c=`Function ${t}() called with invalid data`;e&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new C(P.INVALID_ARGUMENT,c+r+u)}function um(r,t){return r.some((e=>e.isEqual(t)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wi{constructor(t,e,n,s,i){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ut(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new ET(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(Xi("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class ET extends wi{data(){return super.data()}}function Xi(r,t){return typeof t=="string"?Vc(r,t):t instanceof In?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lm(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new C(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Cc{}class Yi extends Cc{}function wT(r,t,...e){let n=[];t instanceof Cc&&n.push(t),n=n.concat(e),(function(i){const o=i.filter((u=>u instanceof Zi)).length,c=i.filter((u=>u instanceof ws)).length;if(o>1||o>0&&c>0)throw new C(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class ws extends Yi{constructor(t,e,n){super(),this._field=t,this._op=e,this._value=n,this.type="where"}static _create(t,e,n){return new ws(t,e,n)}_apply(t){const e=this._parse(t);return hm(t._query,e),new re(t.firestore,t.converter,da(t._query,e))}_parse(t){const e=hr(t.firestore);return(function(i,o,c,u,h,f,p){let g;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new C(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Ih(p,f);const D=[];for(const N of p)D.push(yh(u,i,N));g={arrayValue:{values:D}}}else g=yh(u,i,p)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Ih(p,f),g=IT(c,o,p,f==="in"||f==="not-in");return K.create(h,f,g)})(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function AT(r,t,e){const n=t,s=Xi("where",r);return ws._create(s,n,e)}class Zi extends Cc{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new Zi(t,e)}_parse(t){const e=this._queryConstraints.map((n=>n._parse(t))).filter((n=>n.getFilters().length>0));return e.length===1?e[0]:tt.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:((function(s,i){let o=s;const c=i.getFlattenedFilters();for(const u of c)hm(o,u),o=da(o,u)})(t._query,e),new re(t.firestore,t.converter,da(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class to extends Yi{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new to(t,e)}_apply(t){const e=(function(s,i,o){if(s.startAt!==null)throw new C(P.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new C(P.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new os(i,o)})(t._query,this._field,this._direction);return new re(t.firestore,t.converter,(function(s,i){const o=s.explicitOrderBy.concat([i]);return new sr(s.path,s.collectionGroup,o,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)})(t._query,e))}}function vT(r,t="asc"){const e=t,n=Xi("orderBy",r);return to._create(n,e)}class eo extends Yi{constructor(t,e,n){super(),this.type=t,this._limit=e,this._limitType=n}static _create(t,e,n){return new eo(t,e,n)}_apply(t){return new re(t.firestore,t.converter,hi(t._query,this._limit,this._limitType))}}function bT(r){return c_("limit",r),eo._create("limit",r,"F")}function yh(r,t,e){if(typeof(e=pt(e))=="string"){if(e==="")throw new C(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ud(t)&&e.indexOf("/")!==-1)throw new C(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const n=t.path.child(J.fromString(e));if(!M.isDocumentKey(n))throw new C(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return ss(r,new M(n))}if(e instanceof ut)return ss(r,e._key);throw new C(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Di(e)}.`)}function Ih(r,t){if(!Array.isArray(r)||r.length===0)throw new C(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function hm(r,t){const e=(function(s,i){for(const o of s)for(const c of o.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(t.op));if(e!==null)throw e===t.op?new C(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new C(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class Dc{convertValue(t,e="none"){switch(Ne(t)){case 0:return null;case 1:return t.booleanValue;case 2:return it(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(de(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw O(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const n={};return Be(t,((s,i)=>{n[s]=this.convertValue(i,e)})),n}convertVectorValue(t){var n,s,i;const e=(i=(s=(n=t.fields)==null?void 0:n[zn].arrayValue)==null?void 0:s.values)==null?void 0:i.map((o=>it(o.doubleValue)));return new Qt(e)}convertGeoPoint(t){return new Ht(it(t.latitude),it(t.longitude))}convertArray(t,e){return(t.values||[]).map((n=>this.convertValue(n,e)))}convertServerTimestamp(t,e){switch(e){case"previous":const n=Oi(t);return n==null?null:this.convertValue(n,e);case"estimate":return this.convertTimestamp(ns(t));default:return null}}convertTimestamp(t){const e=he(t);return new Z(e.seconds,e.nanos)}convertDocumentKey(t,e){const n=J.fromString(t);L(pf(n),9688,{name:t});const s=new xe(n.get(1),n.get(3)),i=new M(n.popFirst(5));return s.isEqual(e)||dt(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function no(r,t,e){let n;return n=r?e&&(e.merge||e.mergeFields)?r.toFirestore(t,e):r.toFirestore(t):t,n}class RT extends Dc{constructor(t){super(),this.firestore=t}convertBytes(t){return new kt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new ut(this.firestore,null,e)}}class nn{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class ce extends wi{constructor(t,e,n,s,i,o){super(t,e,n,s,o),this._firestore=t,this._firestoreImpl=t,this.metadata=i}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Wr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const n=this._document.data.field(Xi("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new C(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=ce._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}ce._jsonSchemaVersion="firestore/documentSnapshot/1.0",ce._jsonSchema={type:mt("string",ce._jsonSchemaVersion),bundleSource:mt("string","DocumentSnapshot"),bundleName:mt("string"),bundle:mt("string")};class Wr extends ce{data(t={}){return super.data(t)}}class De{constructor(t,e,n,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new nn(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const t=[];return this.forEach((e=>t.push(e))),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach((n=>{t.call(e,new Wr(this._firestore,this._userDataWriter,n.key,n,new nn(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new C(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((c=>{const u=new Wr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new nn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{const u=new Wr(s._firestore,s._userDataWriter,c.doc.key,c.doc,new nn(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let h=-1,f=-1;return c.type!==0&&(h=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),f=o.indexOf(c.doc.key)),{type:ST(c.type),doc:u,oldIndex:h,newIndex:f}}))}})(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new C(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=De._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=Ci.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(e.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function ST(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return O(61501,{type:r})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function PT(r){r=St(r,ut);const t=St(r.firestore,zt);return uT(yn(t),r._key).then((e=>dm(t,r,e)))}De._jsonSchemaVersion="firestore/querySnapshot/1.0",De._jsonSchema={type:mt("string",De._jsonSchemaVersion),bundleSource:mt("string","QuerySnapshot"),bundleName:mt("string"),bundle:mt("string")};class ro extends Dc{constructor(t){super(),this.firestore=t}convertBytes(t){return new kt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new ut(this.firestore,null,e)}}function VT(r){r=St(r,re);const t=St(r.firestore,zt),e=yn(t),n=new ro(t);return lm(r._query),lT(e,r._query).then((s=>new De(t,n,r,s)))}function CT(r,t,e){r=St(r,ut);const n=St(r.firestore,zt),s=no(r.converter,t,e);return fr(n,[Wi(hr(n),"setDoc",r._key,s,r.converter!==null,e).toMutation(r._key,ct.none())])}function DT(r,t,e,...n){r=St(r,ut);const s=St(r.firestore,zt),i=hr(s);let o;return o=typeof(t=pt(t))=="string"||t instanceof In?Sc(i,"updateDoc",r._key,t,e,n):Rc(i,"updateDoc",r._key,t),fr(s,[o.toMutation(r._key,ct.exists(!0))])}function xT(r){return fr(St(r.firestore,zt),[new or(r._key,ct.none())])}function NT(r,t){const e=St(r.firestore,zt),n=sm(r),s=no(r.converter,t);return fr(e,[Wi(hr(r.firestore),"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,ct.exists(!1))]).then((()=>n))}function kT(r,...t){var u,h,f;r=pt(r);let e={includeMetadataChanges:!1,source:"default"},n=0;typeof t[n]!="object"||_h(t[n])||(e=t[n++]);const s={includeMetadataChanges:e.includeMetadataChanges,source:e.source};if(_h(t[n])){const p=t[n];t[n]=(u=p.next)==null?void 0:u.bind(p),t[n+1]=(h=p.error)==null?void 0:h.bind(p),t[n+2]=(f=p.complete)==null?void 0:f.bind(p)}let i,o,c;if(r instanceof ut)o=St(r.firestore,zt),c=_s(r._key.path),i={next:p=>{t[n]&&t[n](dm(o,r,p))},error:t[n+1],complete:t[n+2]};else{const p=St(r,re);o=St(p.firestore,zt),c=p._query;const g=new ro(o);i={next:R=>{t[n]&&t[n](new De(o,g,p,R))},error:t[n+1],complete:t[n+2]},lm(r._query)}return(function(g,R,D,N){const x=new Ec(N),$=new pc(R,x,D);return g.asyncQueue.enqueueAndForget((async()=>dc(await Ti(g),$))),()=>{x.Nu(),g.asyncQueue.enqueueAndForget((async()=>fc(await Ti(g),$)))}})(yn(o),c,s,i)}function fr(r,t){return(function(n,s){const i=new Kt;return n.asyncQueue.enqueueAndForget((async()=>qI(await aT(n),s,i))),i.promise})(yn(r),t)}function dm(r,t,e){const n=e.docs.get(t._key),s=new ro(r);return new ce(r,s,t._key,n,new nn(e.hasPendingWrites,e.fromCache),t.converter)}class MT{constructor(t){let e;this.kind="persistent",t!=null&&t.tabManager?(t.tabManager._initialize(t),e=t.tabManager):(e=fm(void 0),e._initialize(t)),this._onlineComponentProvider=e._onlineComponentProvider,this._offlineComponentProvider=e._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function OT(r){return new MT(r)}class FT{constructor(t){this.forceOwnership=t,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(t){this._onlineComponentProvider=hs.provider,this._offlineComponentProvider={build:e=>new nm(e,t==null?void 0:t.cacheSizeBytes,this.forceOwnership)}}}class LT{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(t){this._onlineComponentProvider=hs.provider,this._offlineComponentProvider={build:e=>new nT(e,t==null?void 0:t.cacheSizeBytes)}}}function fm(r){return new FT(r==null?void 0:r.forceOwnership)}function BT(){return new LT}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const UT={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mm{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=hr(t)}set(t,e,n){this._verifyNotCommitted();const s=Se(t,this._firestore),i=no(s.converter,e,n),o=Wi(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,ct.none())),this}update(t,e,n,...s){this._verifyNotCommitted();const i=Se(t,this._firestore);let o;return o=typeof(e=pt(e))=="string"||e instanceof In?Sc(this._dataReader,"WriteBatch.update",i._key,e,n,s):Rc(this._dataReader,"WriteBatch.update",i._key,e),this._mutations.push(o.toMutation(i._key,ct.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=Se(t,this._firestore);return this._mutations=this._mutations.concat(new or(e._key,ct.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new C(P.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Se(r,t){if((r=pt(r)).firestore!==t)throw new C(P.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qT{constructor(t,e){this._firestore=t,this._transaction=e,this._dataReader=hr(t)}get(t){const e=Se(t,this._firestore),n=new RT(this._firestore);return this._transaction.lookup([e._key]).then((s=>{if(!s||s.length!==1)return O(24041);const i=s[0];if(i.isFoundDocument())return new wi(this._firestore,n,i.key,i,e.converter);if(i.isNoDocument())return new wi(this._firestore,n,e._key,null,e.converter);throw O(18433,{doc:i})}))}set(t,e,n){const s=Se(t,this._firestore),i=no(s.converter,e,n),o=Wi(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,n);return this._transaction.set(s._key,o),this}update(t,e,n,...s){const i=Se(t,this._firestore);let o;return o=typeof(e=pt(e))=="string"||e instanceof In?Sc(this._dataReader,"Transaction.update",i._key,e,n,s):Rc(this._dataReader,"Transaction.update",i._key,e),this._transaction.update(i._key,o),this}delete(t){const e=Se(t,this._firestore);return this._transaction.delete(e._key),this}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pm extends qT{constructor(t,e){super(t,e),this._firestore=t}get(t){const e=Se(t,this._firestore),n=new ro(this._firestore);return super.get(t).then((s=>new ce(this._firestore,n,e._key,s._document,new nn(!1,!1),e.converter)))}}function jT(r,t,e){r=St(r,zt);const n={...UT,...e};return(function(i){if(i.maxAttempts<1)throw new C(P.INVALID_ARGUMENT,"Max attempts must be at least 1")})(n),(function(i,o,c){const u=new Kt;return i.asyncQueue.enqueueAndForget((async()=>{const h=await cT(i);new sT(i.asyncQueue,h,c,o,u).ju()})),u.promise})(yn(r),(s=>t(new pm(r,s))),n)}function $T(){return new vc("serverTimestamp")}function zT(...r){return new bc("arrayUnion",r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function GT(r){return yn(r=St(r,zt)),new mm(r,(t=>fr(r,t)))}(function(t,e=!0){(function(s){rr=s})(Bg),le(new ee("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),c=new zt(new t_(n.getProvider("auth-internal")),new r_(o,n.getProvider("app-check-internal")),(function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new C(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new xe(h.options.projectId,f)})(o,s),o);return i={useFetchStreams:e,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),$t(Yu,Zu,t),$t(Yu,Zu,"esm2020")})();const Hw=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Dc,Bytes:kt,CollectionReference:ae,DocumentReference:ut,DocumentSnapshot:ce,FieldPath:In,FieldValue:lr,Firestore:zt,FirestoreError:C,GeoPoint:Ht,Query:re,QueryCompositeFilterConstraint:Zi,QueryConstraint:Yi,QueryDocumentSnapshot:Wr,QueryFieldFilterConstraint:ws,QueryLimitConstraint:eo,QueryOrderByConstraint:to,QuerySnapshot:De,SnapshotMetadata:nn,Timestamp:Z,Transaction:pm,VectorValue:Qt,WriteBatch:mm,_AutoId:Ci,_ByteString:ht,_DatabaseId:xe,_DocumentKey:M,_EmptyAuthCredentialsProvider:ed,_FieldPath:at,_cast:St,_logWarn:Fn,_validateIsNotUsedTogether:sd,addDoc:NT,arrayUnion:zT,collection:dT,deleteDoc:xT,doc:sm,ensureFirestoreConfigured:yn,executeWrite:fr,getDoc:PT,getDocs:VT,initializeFirestore:fT,limit:bT,onSnapshot:kT,orderBy:vT,persistentLocalCache:OT,persistentMultipleTabManager:BT,persistentSingleTabManager:fm,query:wT,runTransaction:jT,serverTimestamp:$T,setDoc:CT,updateDoc:DT,where:AT,writeBatch:GT},Symbol.toStringTag,{value:"Module"})),gm="@firebase/installations",xc="0.6.19";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _m=1e4,ym=`w:${xc}`,Im="FIS_v2",KT="https://firebaseinstallations.googleapis.com/v1",HT=3600*1e3,QT="installations",WT="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JT={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},pn=new Vi(QT,WT,JT);function Tm(r){return r instanceof fe&&r.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Em({projectId:r}){return`${KT}/projects/${r}/installations`}function wm(r){return{token:r.token,requestStatus:2,expiresIn:YT(r.expiresIn),creationTime:Date.now()}}async function Am(r,t){const n=(await t.json()).error;return pn.create("request-failed",{requestName:r,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function vm({apiKey:r}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":r})}function XT(r,{refreshToken:t}){const e=vm(r);return e.append("Authorization",ZT(t)),e}async function bm(r){const t=await r();return t.status>=500&&t.status<600?r():t}function YT(r){return Number(r.replace("s","000"))}function ZT(r){return`${Im} ${r}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tE({appConfig:r,heartbeatServiceProvider:t},{fid:e}){const n=Em(r),s=vm(r),i=t.getImmediate({optional:!0});if(i){const h=await i.getHeartbeatsHeader();h&&s.append("x-firebase-client",h)}const o={fid:e,authVersion:Im,appId:r.appId,sdkVersion:ym},c={method:"POST",headers:s,body:JSON.stringify(o)},u=await bm(()=>fetch(n,c));if(u.ok){const h=await u.json();return{fid:h.fid||e,registrationStatus:2,refreshToken:h.refreshToken,authToken:wm(h.authToken)}}else throw await Am("Create Installation",u)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rm(r){return new Promise(t=>{setTimeout(t,r)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eE(r){return btoa(String.fromCharCode(...r)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nE=/^[cdef][\w-]{21}$/,Sa="";function rE(){try{const r=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(r),r[0]=112+r[0]%16;const e=sE(r);return nE.test(e)?e:Sa}catch{return Sa}}function sE(r){return eE(r).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function so(r){return`${r.appName}!${r.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sm=new Map;function Pm(r,t){const e=so(r);Vm(e,t),iE(e,t)}function Vm(r,t){const e=Sm.get(r);if(e)for(const n of e)n(t)}function iE(r,t){const e=oE();e&&e.postMessage({key:r,fid:t}),aE()}let rn=null;function oE(){return!rn&&"BroadcastChannel"in self&&(rn=new BroadcastChannel("[Firebase] FID Change"),rn.onmessage=r=>{Vm(r.data.key,r.data.fid)}),rn}function aE(){Sm.size===0&&rn&&(rn.close(),rn=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cE="firebase-installations-database",uE=1,gn="firebase-installations-store";let Ko=null;function Nc(){return Ko||(Ko=$h(cE,uE,{upgrade:(r,t)=>{switch(t){case 0:r.createObjectStore(gn)}}})),Ko}async function Ai(r,t){const e=so(r),s=(await Nc()).transaction(gn,"readwrite"),i=s.objectStore(gn),o=await i.get(e);return await i.put(t,e),await s.done,(!o||o.fid!==t.fid)&&Pm(r,t.fid),t}async function Cm(r){const t=so(r),n=(await Nc()).transaction(gn,"readwrite");await n.objectStore(gn).delete(t),await n.done}async function io(r,t){const e=so(r),s=(await Nc()).transaction(gn,"readwrite"),i=s.objectStore(gn),o=await i.get(e),c=t(o);return c===void 0?await i.delete(e):await i.put(c,e),await s.done,c&&(!o||o.fid!==c.fid)&&Pm(r,c.fid),c}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kc(r){let t;const e=await io(r.appConfig,n=>{const s=lE(n),i=hE(r,s);return t=i.registrationPromise,i.installationEntry});return e.fid===Sa?{installationEntry:await t}:{installationEntry:e,registrationPromise:t}}function lE(r){const t=r||{fid:rE(),registrationStatus:0};return Dm(t)}function hE(r,t){if(t.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(pn.create("app-offline"));return{installationEntry:t,registrationPromise:s}}const e={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},n=dE(r,e);return{installationEntry:e,registrationPromise:n}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:fE(r)}:{installationEntry:t}}async function dE(r,t){try{const e=await tE(r,t);return Ai(r.appConfig,e)}catch(e){throw Tm(e)&&e.customData.serverCode===409?await Cm(r.appConfig):await Ai(r.appConfig,{fid:t.fid,registrationStatus:0}),e}}async function fE(r){let t=await Th(r.appConfig);for(;t.registrationStatus===1;)await Rm(100),t=await Th(r.appConfig);if(t.registrationStatus===0){const{installationEntry:e,registrationPromise:n}=await kc(r);return n||e}return t}function Th(r){return io(r,t=>{if(!t)throw pn.create("installation-not-found");return Dm(t)})}function Dm(r){return mE(r)?{fid:r.fid,registrationStatus:0}:r}function mE(r){return r.registrationStatus===1&&r.registrationTime+_m<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pE({appConfig:r,heartbeatServiceProvider:t},e){const n=gE(r,e),s=XT(r,e),i=t.getImmediate({optional:!0});if(i){const h=await i.getHeartbeatsHeader();h&&s.append("x-firebase-client",h)}const o={installation:{sdkVersion:ym,appId:r.appId}},c={method:"POST",headers:s,body:JSON.stringify(o)},u=await bm(()=>fetch(n,c));if(u.ok){const h=await u.json();return wm(h)}else throw await Am("Generate Auth Token",u)}function gE(r,{fid:t}){return`${Em(r)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mc(r,t=!1){let e;const n=await io(r.appConfig,i=>{if(!xm(i))throw pn.create("not-registered");const o=i.authToken;if(!t&&IE(o))return i;if(o.requestStatus===1)return e=_E(r,t),i;{if(!navigator.onLine)throw pn.create("app-offline");const c=EE(i);return e=yE(r,c),c}});return e?await e:n.authToken}async function _E(r,t){let e=await Eh(r.appConfig);for(;e.authToken.requestStatus===1;)await Rm(100),e=await Eh(r.appConfig);const n=e.authToken;return n.requestStatus===0?Mc(r,t):n}function Eh(r){return io(r,t=>{if(!xm(t))throw pn.create("not-registered");const e=t.authToken;return wE(e)?{...t,authToken:{requestStatus:0}}:t})}async function yE(r,t){try{const e=await pE(r,t),n={...t,authToken:e};return await Ai(r.appConfig,n),e}catch(e){if(Tm(e)&&(e.customData.serverCode===401||e.customData.serverCode===404))await Cm(r.appConfig);else{const n={...t,authToken:{requestStatus:0}};await Ai(r.appConfig,n)}throw e}}function xm(r){return r!==void 0&&r.registrationStatus===2}function IE(r){return r.requestStatus===2&&!TE(r)}function TE(r){const t=Date.now();return t<r.creationTime||r.creationTime+r.expiresIn<t+HT}function EE(r){const t={requestStatus:1,requestTime:Date.now()};return{...r,authToken:t}}function wE(r){return r.requestStatus===1&&r.requestTime+_m<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function AE(r){const t=r,{installationEntry:e,registrationPromise:n}=await kc(t);return n?n.catch(console.error):Mc(t).catch(console.error),e.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vE(r,t=!1){const e=r;return await bE(e),(await Mc(e,t)).token}async function bE(r){const{registrationPromise:t}=await kc(r);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RE(r){if(!r||!r.options)throw Ho("App Configuration");if(!r.name)throw Ho("App Name");const t=["projectId","apiKey","appId"];for(const e of t)if(!r.options[e])throw Ho(e);return{appName:r.name,projectId:r.options.projectId,apiKey:r.options.apiKey,appId:r.options.appId}}function Ho(r){return pn.create("missing-app-config-values",{valueName:r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nm="installations",SE="installations-internal",PE=r=>{const t=r.getProvider("app").getImmediate(),e=RE(t),n=nr(t,"heartbeat");return{app:t,appConfig:e,heartbeatServiceProvider:n,_delete:()=>Promise.resolve()}},VE=r=>{const t=r.getProvider("app").getImmediate(),e=nr(t,Nm).getImmediate();return{getId:()=>AE(e),getToken:s=>vE(e,s)}};function CE(){le(new ee(Nm,PE,"PUBLIC")),le(new ee(SE,VE,"PRIVATE"))}CE();$t(gm,xc);$t(gm,xc,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vi="analytics",DE="firebase_id",xE="origin",NE=60*1e3,kE="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Oc="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vt=new Ca("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ME={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},qt=new Vi("analytics","Analytics",ME);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OE(r){if(!r.startsWith(Oc)){const t=qt.create("invalid-gtag-resource",{gtagURL:r});return Vt.warn(t.message),""}return r}function km(r){return Promise.all(r.map(t=>t.catch(e=>e)))}function FE(r,t){let e;return window.trustedTypes&&(e=window.trustedTypes.createPolicy(r,t)),e}function LE(r,t){const e=FE("firebase-js-sdk-policy",{createScriptURL:OE}),n=document.createElement("script"),s=`${Oc}?l=${r}&id=${t}`;n.src=e?e==null?void 0:e.createScriptURL(s):s,n.async=!0,document.head.appendChild(n)}function BE(r){let t=[];return Array.isArray(window[r])?t=window[r]:window[r]=t,t}async function UE(r,t,e,n,s,i){const o=n[s];try{if(o)await t[o];else{const u=(await km(e)).find(h=>h.measurementId===s);u&&await t[u.appId]}}catch(c){Vt.error(c)}r("config",s,i)}async function qE(r,t,e,n,s){try{let i=[];if(s&&s.send_to){let o=s.send_to;Array.isArray(o)||(o=[o]);const c=await km(e);for(const u of o){const h=c.find(p=>p.measurementId===u),f=h&&t[h.appId];if(f)i.push(f);else{i=[];break}}}i.length===0&&(i=Object.values(t)),await Promise.all(i),r("event",n,s||{})}catch(i){Vt.error(i)}}function jE(r,t,e,n){async function s(i,...o){try{if(i==="event"){const[c,u]=o;await qE(r,t,e,c,u)}else if(i==="config"){const[c,u]=o;await UE(r,t,e,n,c,u)}else if(i==="consent"){const[c,u]=o;r("consent",c,u)}else if(i==="get"){const[c,u,h]=o;r("get",c,u,h)}else if(i==="set"){const[c]=o;r("set",c)}else r(i,...o)}catch(c){Vt.error(c)}}return s}function $E(r,t,e,n,s){let i=function(...o){window[n].push(arguments)};return window[s]&&typeof window[s]=="function"&&(i=window[s]),window[s]=jE(i,r,t,e),{gtagCore:i,wrappedGtag:window[s]}}function zE(r){const t=window.document.getElementsByTagName("script");for(const e of Object.values(t))if(e.src&&e.src.includes(Oc)&&e.src.includes(r))return e;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const GE=30,KE=1e3;class HE{constructor(t={},e=KE){this.throttleMetadata=t,this.intervalMillis=e}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,e){this.throttleMetadata[t]=e}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const Mm=new HE;function QE(r){return new Headers({Accept:"application/json","x-goog-api-key":r})}async function WE(r){var o;const{appId:t,apiKey:e}=r,n={method:"GET",headers:QE(e)},s=kE.replace("{app-id}",t),i=await fetch(s,n);if(i.status!==200&&i.status!==304){let c="";try{const u=await i.json();(o=u.error)!=null&&o.message&&(c=u.error.message)}catch{}throw qt.create("config-fetch-failed",{httpStatus:i.status,responseMessage:c})}return i.json()}async function JE(r,t=Mm,e){const{appId:n,apiKey:s,measurementId:i}=r.options;if(!n)throw qt.create("no-app-id");if(!s){if(i)return{measurementId:i,appId:n};throw qt.create("no-api-key")}const o=t.getThrottleMetadata(n)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new ZE;return setTimeout(async()=>{c.abort()},NE),Om({appId:n,apiKey:s,measurementId:i},o,c,t)}async function Om(r,{throttleEndTimeMillis:t,backoffCount:e},n,s=Mm){var c;const{appId:i,measurementId:o}=r;try{await XE(n,t)}catch(u){if(o)return Vt.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:i,measurementId:o};throw u}try{const u=await WE(r);return s.deleteThrottleMetadata(i),u}catch(u){const h=u;if(!YE(h)){if(s.deleteThrottleMetadata(i),o)return Vt.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:i,measurementId:o};throw u}const f=Number((c=h==null?void 0:h.customData)==null?void 0:c.httpStatus)===503?ju(e,s.intervalMillis,GE):ju(e,s.intervalMillis),p={throttleEndTimeMillis:Date.now()+f,backoffCount:e+1};return s.setThrottleMetadata(i,p),Vt.debug(`Calling attemptFetch again in ${f} millis`),Om(r,p,n,s)}}function XE(r,t){return new Promise((e,n)=>{const s=Math.max(t-Date.now(),0),i=setTimeout(e,s);r.addEventListener(()=>{clearTimeout(i),n(qt.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function YE(r){if(!(r instanceof fe)||!r.customData)return!1;const t=Number(r.customData.httpStatus);return t===429||t===500||t===503||t===504}class ZE{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function tw(r,t,e,n,s){if(s&&s.global){r("event",e,n);return}else{const i=await t,o={...n,send_to:i};r("event",e,o)}}async function ew(r,t,e,n){{const s=await t;r("config",s,{update:!0,user_id:e})}}async function nw(r,t,e,n){if(n&&n.global){const s={};for(const i of Object.keys(e))s[`user_properties.${i}`]=e[i];return r("set",s),Promise.resolve()}else{const s=await t;r("config",s,{update:!0,user_properties:e})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rw(){if(Pi())try{await Va()}catch(r){return Vt.warn(qt.create("indexeddb-unavailable",{errorInfo:r==null?void 0:r.toString()}).message),!1}else return Vt.warn(qt.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function sw(r,t,e,n,s,i,o){const c=JE(r);c.then(g=>{e[g.measurementId]=g.appId,r.options.measurementId&&g.measurementId!==r.options.measurementId&&Vt.warn(`The measurement ID in the local Firebase config (${r.options.measurementId}) does not match the measurement ID fetched from the server (${g.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(g=>Vt.error(g)),t.push(c);const u=rw().then(g=>{if(g)return n.getId()}),[h,f]=await Promise.all([c,u]);zE(i)||LE(i,h.measurementId),s("js",new Date);const p=(o==null?void 0:o.config)??{};return p[xE]="firebase",p.update=!0,f!=null&&(p[DE]=f),s("config",h.measurementId,p),h.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iw{constructor(t){this.app=t}_delete(){return delete an[this.app.options.appId],Promise.resolve()}}let an={},wh=[];const Ah={};let Qo="dataLayer",ow="gtag",vh,oo,bh=!1;function aw(){const r=[];if(Fh()&&r.push("This is a browser extension environment."),Uh()||r.push("Cookies are not available."),r.length>0){const t=r.map((n,s)=>`(${s+1}) ${n}`).join(" "),e=qt.create("invalid-analytics-context",{errorInfo:t});Vt.warn(e.message)}}function cw(r,t,e){aw();const n=r.options.appId;if(!n)throw qt.create("no-app-id");if(!r.options.apiKey)if(r.options.measurementId)Vt.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${r.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw qt.create("no-api-key");if(an[n]!=null)throw qt.create("already-exists",{id:n});if(!bh){BE(Qo);const{wrappedGtag:i,gtagCore:o}=$E(an,wh,Ah,Qo,ow);oo=i,vh=o,bh=!0}return an[n]=sw(r,wh,Ah,t,vh,Qo,e),new iw(r)}function Qw(r=Gh()){r=pt(r);const t=nr(r,vi);return t.isInitialized()?t.getImmediate():uw(r)}function uw(r,t={}){const e=nr(r,vi);if(e.isInitialized()){const s=e.getImmediate();if(On(t,e.getOptions()))return s;throw qt.create("already-initialized")}return e.initialize({options:t})}async function Ww(){if(Fh()||!Uh()||!Pi())return!1;try{return await Va()}catch{return!1}}function Jw(r,t,e){r=pt(r),ew(oo,an[r.app.options.appId],t).catch(n=>Vt.error(n))}function lw(r,t,e){r=pt(r),nw(oo,an[r.app.options.appId],t,e).catch(n=>Vt.error(n))}function hw(r,t,e,n){r=pt(r),tw(oo,an[r.app.options.appId],t,e,n).catch(s=>Vt.error(s))}const Rh="@firebase/analytics",Sh="0.10.19";function dw(){le(new ee(vi,(t,{options:e})=>{const n=t.getProvider("app").getImmediate(),s=t.getProvider("installations-internal").getImmediate();return cw(n,s,e)},"PUBLIC")),le(new ee("analytics-internal",r,"PRIVATE")),$t(Rh,Sh),$t(Rh,Sh,"esm2020");function r(t){try{const e=t.getProvider(vi).getImmediate();return{logEvent:(n,s,i)=>hw(e,n,s,i),setUserProperties:(n,s)=>lw(e,n,s)}}catch(e){throw qt.create("interop-component-reg-failed",{reason:e})}}}dw();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fw="type.googleapis.com/google.protobuf.Int64Value",mw="type.googleapis.com/google.protobuf.UInt64Value";function Fm(r,t){const e={};for(const n in r)r.hasOwnProperty(n)&&(e[n]=t(r[n]));return e}function bi(r){if(r==null)return null;if(r instanceof Number&&(r=r.valueOf()),typeof r=="number"&&isFinite(r)||r===!0||r===!1||Object.prototype.toString.call(r)==="[object String]")return r;if(r instanceof Date)return r.toISOString();if(Array.isArray(r))return r.map(t=>bi(t));if(typeof r=="function"||typeof r=="object")return Fm(r,t=>bi(t));throw new Error("Data cannot be encoded in JSON: "+r)}function er(r){if(r==null)return r;if(r["@type"])switch(r["@type"]){case fw:case mw:{const t=Number(r.value);if(isNaN(t))throw new Error("Data cannot be decoded from JSON: "+r);return t}default:throw new Error("Data cannot be decoded from JSON: "+r)}return Array.isArray(r)?r.map(t=>er(t)):typeof r=="function"||typeof r=="object"?Fm(r,t=>er(t)):r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fc="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ph={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class xt extends fe{constructor(t,e,n){super(`${Fc}/${t}`,e||""),this.details=n,Object.setPrototypeOf(this,xt.prototype)}}function pw(r){if(r>=200&&r<300)return"ok";switch(r){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function Ri(r,t){let e=pw(r),n=e,s;try{const i=t&&t.error;if(i){const o=i.status;if(typeof o=="string"){if(!Ph[o])return new xt("internal","internal");e=Ph[o],n=o}const c=i.message;typeof c=="string"&&(n=c),s=i.details,s!==void 0&&(s=er(s))}}catch{}return e==="ok"?null:new xt(e,n,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gw{constructor(t,e,n,s){this.app=t,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,zh(t)&&t.settings.appCheckToken&&(this.serverAppAppCheckToken=t.settings.appCheckToken),this.auth=e.getImmediate({optional:!0}),this.messaging=n.getImmediate({optional:!0}),this.auth||e.get().then(i=>this.auth=i,()=>{}),this.messaging||n.get().then(i=>this.messaging=i,()=>{}),this.appCheck||s==null||s.get().then(i=>this.appCheck=i,()=>{})}async getAuthToken(){if(this.auth)try{const t=await this.auth.getToken();return t==null?void 0:t.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(t){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const e=t?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return e.error?null:e.token}return null}async getContext(t){const e=await this.getAuthToken(),n=await this.getMessagingToken(),s=await this.getAppCheckToken(t);return{authToken:e,messagingToken:n,appCheckToken:s}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pa="us-central1",_w=/^data: (.*?)(?:\n|$)/;function yw(r){let t=null;return{promise:new Promise((e,n)=>{t=setTimeout(()=>{n(new xt("deadline-exceeded","deadline-exceeded"))},r)}),cancel:()=>{t&&clearTimeout(t)}}}class Iw{constructor(t,e,n,s,i=Pa,o=(...c)=>fetch(...c)){this.app=t,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new gw(t,e,n,s),this.cancelAllRequests=new Promise(c=>{this.deleteService=()=>Promise.resolve(c())});try{const c=new URL(i);this.customDomain=c.origin+(c.pathname==="/"?"":c.pathname),this.region=Pa}catch{this.customDomain=null,this.region=i}}_delete(){return this.deleteService()}_url(t){const e=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${e}/${this.region}/${t}`:this.customDomain!==null?`${this.customDomain}/${t}`:`https://${this.region}-${e}.cloudfunctions.net/${t}`}}function Tw(r,t,e){const n=ds(t);r.emulatorOrigin=`http${n?"s":""}://${t}:${e}`,n&&(Mh(r.emulatorOrigin+"/backends"),xp("Functions",!0))}function Ew(r,t,e){const n=s=>Aw(r,t,s,e||{});return n.stream=(s,i)=>bw(r,t,s,i),n}function Lm(r){return r.emulatorOrigin&&ds(r.emulatorOrigin)?"include":void 0}async function ww(r,t,e,n,s){e["Content-Type"]="application/json";let i;try{i=await n(r,{method:"POST",body:JSON.stringify(t),headers:e,credentials:Lm(s)})}catch{return{status:0,json:null}}let o=null;try{o=await i.json()}catch{}return{status:i.status,json:o}}async function Bm(r,t){const e={},n=await r.contextProvider.getContext(t.limitedUseAppCheckTokens);return n.authToken&&(e.Authorization="Bearer "+n.authToken),n.messagingToken&&(e["Firebase-Instance-ID-Token"]=n.messagingToken),n.appCheckToken!==null&&(e["X-Firebase-AppCheck"]=n.appCheckToken),e}function Aw(r,t,e,n){const s=r._url(t);return vw(r,s,e,n)}async function vw(r,t,e,n){e=bi(e);const s={data:e},i=await Bm(r,n),o=n.timeout||7e4,c=yw(o),u=await Promise.race([ww(t,s,i,r.fetchImpl,r),c.promise,r.cancelAllRequests]);if(c.cancel(),!u)throw new xt("cancelled","Firebase Functions instance was deleted.");const h=Ri(u.status,u.json);if(h)throw h;if(!u.json)throw new xt("internal","Response is not valid JSON object.");let f=u.json.data;if(typeof f>"u"&&(f=u.json.result),typeof f>"u")throw new xt("internal","Response is missing data field.");return{data:er(f)}}function bw(r,t,e,n){const s=r._url(t);return Rw(r,s,e,n||{})}async function Rw(r,t,e,n){var g;e=bi(e);const s={data:e},i=await Bm(r,n);i["Content-Type"]="application/json",i.Accept="text/event-stream";let o;try{o=await r.fetchImpl(t,{method:"POST",body:JSON.stringify(s),headers:i,signal:n==null?void 0:n.signal,credentials:Lm(r)})}catch(R){if(R instanceof Error&&R.name==="AbortError"){const N=new xt("cancelled","Request was cancelled.");return{data:Promise.reject(N),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(N)}}}}}}const D=Ri(0,null);return{data:Promise.reject(D),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(D)}}}}}}let c,u;const h=new Promise((R,D)=>{c=R,u=D});(g=n==null?void 0:n.signal)==null||g.addEventListener("abort",()=>{const R=new xt("cancelled","Request was cancelled.");u(R)});const f=o.body.getReader(),p=Sw(f,c,u,n==null?void 0:n.signal);return{stream:{[Symbol.asyncIterator](){const R=p.getReader();return{async next(){const{value:D,done:N}=await R.read();return{value:D,done:N}},async return(){return await R.cancel(),{done:!0,value:void 0}}}}},data:h}}function Sw(r,t,e,n){const s=(o,c)=>{const u=o.match(_w);if(!u)return;const h=u[1];try{const f=JSON.parse(h);if("result"in f){t(er(f.result));return}if("message"in f){c.enqueue(er(f.message));return}if("error"in f){const p=Ri(0,f);c.error(p),e(p);return}}catch(f){if(f instanceof xt){c.error(f),e(f);return}}},i=new TextDecoder;return new ReadableStream({start(o){let c="";return u();async function u(){if(n!=null&&n.aborted){const h=new xt("cancelled","Request was cancelled");return o.error(h),e(h),Promise.resolve()}try{const{value:h,done:f}=await r.read();if(f){c.trim()&&s(c.trim(),o),o.close();return}if(n!=null&&n.aborted){const g=new xt("cancelled","Request was cancelled");o.error(g),e(g),await r.cancel();return}c+=i.decode(h,{stream:!0});const p=c.split(`
`);c=p.pop()||"";for(const g of p)g.trim()&&s(g.trim(),o);return u()}catch(h){const f=h instanceof xt?h:Ri(0,null);o.error(f),e(f)}}},cancel(){return r.cancel()}})}const Vh="@firebase/functions",Ch="0.13.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pw="auth-internal",Vw="app-check-internal",Cw="messaging-internal";function Dw(r){const t=(e,{instanceIdentifier:n})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider(Pw),o=e.getProvider(Cw),c=e.getProvider(Vw);return new Iw(s,i,o,c,n)};le(new ee(Fc,t,"PUBLIC").setMultipleInstances(!0)),$t(Vh,Ch,r),$t(Vh,Ch,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xw(r=Gh(),t=Pa){const n=nr(pt(r),Fc).getImmediate({identifier:t}),s=Pp("functions");return s&&Um(n,...s),n}function Um(r,t,e){Tw(pt(r),t,e)}function Nw(r,t,e){return Ew(pt(r),t,e)}Dw();const Xw=Object.freeze(Object.defineProperty({__proto__:null,FunctionsError:xt,connectFunctionsEmulator:Um,getFunctions:xw,httpsCallable:Nw},Symbol.toStringTag,{value:"Module"}));export{Mw as $,W as A,Ap as B,ee as C,qw as D,Vi as E,fe as F,ds as G,Gh as H,nr as I,Sp as J,On as K,Ca as L,Mh as M,xp as N,Bw as O,Uw as P,jw as Q,$w as R,Bg as S,Fw as T,$h as U,Gw as V,Va as W,Pi as X,Uh as Y,Pp as Z,le as _,NT as a,Ug as a0,fT as a1,OT as a2,Qw as a3,xw as a4,BT as a5,Z as a6,jT as a7,Ww as a8,Jw as a9,lw as aa,hw as ab,Hw as ac,Xw as ad,zT as b,dT as c,sm as d,VT as e,GT as f,PT as g,vT as h,xT as i,Nw as j,CT as k,bT as l,kw as m,Ow as n,kT as o,Lw as p,wT as q,$t as r,$T as s,Fh as t,DT as u,zh as v,AT as w,pt as x,Mn as y,zw as z};
