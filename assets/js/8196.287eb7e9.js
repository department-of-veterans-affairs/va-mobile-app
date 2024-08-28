"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[8196],{8196:(e,t,s)=>{s.d(t,{diagram:()=>V});var o=s(3376),a=s(697),i=s(63240),r=s(96262),n=s(60748);s(74353),s(16750),s(42838),s(49552),s(83765);const d="rect",c="rectWithTitle",l="statediagram",p=`${l}-state`,b="transition",g=`${b} note-edge`,h=`${l}-note`,u=`${l}-cluster`,y=`${l}-cluster-alt`,f="parent",w="note",x="----",m=`${x}${w}`,$=`${x}${f}`,T="fill:none",S="fill: #333",k="text",v="normal";let D={},A=0;function B(e="",t=0,s="",o=x){return`state-${e}${null!==s&&s.length>0?`${o}${s}`:""}-${t}`}const E=(e,t,s,a,i,n)=>{const l=s.id,b=null==(x=a[l])?"":x.classes?x.classes.join(" "):"";var x;if("root"!==l){let t=d;!0===s.start&&(t="start"),!1===s.start&&(t="end"),s.type!==o.D&&(t=s.type),D[l]||(D[l]={id:l,shape:t,description:r.e.sanitizeText(l,(0,r.c)()),classes:`${b} ${p}`});const a=D[l];s.description&&(Array.isArray(a.description)?(a.shape=c,a.description.push(s.description)):a.description.length>0?(a.shape=c,a.description===l?a.description=[s.description]:a.description=[a.description,s.description]):(a.shape=d,a.description=s.description),a.description=r.e.sanitizeTextOrArray(a.description,(0,r.c)())),1===a.description.length&&a.shape===c&&(a.shape=d),!a.type&&s.doc&&(r.l.info("Setting cluster for ",l,C(s)),a.type="group",a.dir=C(s),a.shape=s.type===o.a?"divider":"roundedWithTitle",a.classes=a.classes+" "+u+" "+(n?y:""));const i={labelStyle:"",shape:a.shape,labelText:a.description,classes:a.classes,style:"",id:l,dir:a.dir,domId:B(l,A),type:a.type,padding:15,centerLabel:!0};if(s.note){const t={labelStyle:"",shape:"note",labelText:s.note.text,classes:h,style:"",id:l+m+"-"+A,domId:B(l,A,w),type:a.type,padding:15},o={labelStyle:"",shape:"noteGroup",labelText:s.note.text,classes:a.classes,style:"",id:l+$,domId:B(l,A,f),type:"group",padding:0};A++;const r=l+$;e.setNode(r,o),e.setNode(t.id,t),e.setNode(l,i),e.setParent(l,r),e.setParent(t.id,r);let n=l,d=t.id;"left of"===s.note.position&&(n=t.id,d=l),e.setEdge(n,d,{arrowhead:"none",arrowType:"",style:T,labelStyle:"",classes:g,arrowheadStyle:S,labelpos:"c",labelType:k,thickness:v})}else e.setNode(l,i)}t&&"root"!==t.id&&(r.l.trace("Setting node ",l," to be child of its parent ",t.id),e.setParent(l,t.id)),s.doc&&(r.l.trace("Adding nodes children "),L(e,s,s.doc,a,i,!n))},L=(e,t,s,a,i,n)=>{r.l.trace("items",s),s.forEach((s=>{switch(s.stmt){case o.b:case o.D:E(e,t,s,a,i,n);break;case o.S:{E(e,t,s.state1,a,i,n),E(e,t,s.state2,a,i,n);const o={id:"edge"+A,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:T,labelStyle:"",label:r.e.sanitizeText(s.description,(0,r.c)()),arrowheadStyle:S,labelpos:"c",labelType:k,thickness:v,classes:b};e.setEdge(s.state1.id,s.state2.id,o,A),A++}}}))},C=(e,t=o.c)=>{let s=t;if(e.doc)for(let o=0;o<e.doc.length;o++){const t=e.doc[o];"dir"===t.stmt&&(s=t.value)}return s},R={setConf:function(e){const t=Object.keys(e);for(const s of t)e[s]},getClasses:function(e,t){r.l.trace("Extracting classes"),t.db.clear();try{return t.parser.parse(e),t.db.extract(t.db.getRootDocV2()),t.db.getClasses()}catch(s){return s}},draw:async function(e,t,s,o){r.l.info("Drawing state diagram (v2)",t),D={},o.db.getDirection();const{securityLevel:c,state:p}=(0,r.c)(),b=p.nodeSpacing||50,g=p.rankSpacing||50;r.l.info(o.db.getRootDocV2()),o.db.extract(o.db.getRootDocV2()),r.l.info(o.db.getRootDocV2());const h=o.db.getStates(),u=new a.T({multigraph:!0,compound:!0}).setGraph({rankdir:C(o.db.getRootDocV2()),nodesep:b,ranksep:g,marginx:8,marginy:8}).setDefaultEdgeLabel((function(){return{}}));let y;E(u,void 0,o.db.getRootDocV2(),h,o.db,!0),"sandbox"===c&&(y=(0,i.Ltv)("#i"+t));const f="sandbox"===c?(0,i.Ltv)(y.nodes()[0].contentDocument.body):(0,i.Ltv)("body"),w=f.select(`[id="${t}"]`),x=f.select("#"+t+" g");await(0,n.r)(x,u,["barb"],l,t);r.u.insertTitle(w,"statediagramTitleText",p.titleTopMargin,o.db.getDiagramTitle());const m=w.node().getBBox(),$=m.width+16,T=m.height+16;w.attr("class",l);const S=w.node().getBBox();(0,r.i)(w,T,$,p.useMaxWidth);const k=`${S.x-8} ${S.y-8} ${$} ${T}`;r.l.debug(`viewBox ${k}`),w.attr("viewBox",k);const v=document.querySelectorAll('[id="'+t+'"] .edgeLabel .label');for(const a of v){const e=a.getBBox(),t=document.createElementNS("http://www.w3.org/2000/svg",d);t.setAttribute("rx",0),t.setAttribute("ry",0),t.setAttribute("width",e.width),t.setAttribute("height",e.height),a.insertBefore(t,a.firstChild)}}},V={parser:o.p,db:o.d,renderer:R,styles:o.s,init:e=>{e.state||(e.state={}),e.state.arrowMarkerAbsolute=e.arrowMarkerAbsolute,o.d.clear()}}}}]);