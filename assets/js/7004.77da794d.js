"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[7004],{37004:(e,t,l)=>{l.d(t,{diagram:()=>u});var n=l(99679),a=l(63240),o=l(697),i=l(96262),s=l(60748);l(74353),l(16750),l(42838),l(49552),l(83765);const d=e=>i.e.sanitizeText(e,(0,i.c)());let r={dividerMargin:10,padding:5,textHeight:10,curve:void 0};const c=function(e,t,l,n,a){const o=Object.keys(e);i.l.info("keys:",o),i.l.info(e),o.filter((t=>e[t].parent==a)).forEach((function(l){var o,s;const r=e[l],c=r.cssClasses.join(" "),p="",b="",u=r.label??r.id,f={labelStyle:p,shape:"class_box",labelText:d(u),classData:r,rx:0,ry:0,class:c,style:b,id:r.id,domId:r.domId,tooltip:n.db.getTooltip(r.id,a)||"",haveCallback:r.haveCallback,link:r.link,width:"group"===r.type?500:void 0,type:r.type,padding:(null==(o=(0,i.c)().flowchart)?void 0:o.padding)??(null==(s=(0,i.c)().class)?void 0:s.padding)};t.setNode(r.id,f),a&&t.setParent(r.id,a),i.l.info("setNode",f)}))};function p(e){let t;switch(e){case 0:t="aggregation";break;case 1:t="extension";break;case 2:t="composition";break;case 3:t="dependency";break;case 4:t="lollipop";break;default:t="none"}return t}const b={setConf:function(e){r={...r,...e}},draw:async function(e,t,l,n){i.l.info("Drawing class - ",t);const b=(0,i.c)().flowchart??(0,i.c)().class,u=(0,i.c)().securityLevel;i.l.info("config:",b);const f=(null==b?void 0:b.nodeSpacing)??50,g=(null==b?void 0:b.rankSpacing)??50,y=new o.T({multigraph:!0,compound:!0}).setGraph({rankdir:n.db.getDirection(),nodesep:f,ranksep:g,marginx:8,marginy:8}).setDefaultEdgeLabel((function(){return{}})),h=n.db.getNamespaces(),v=n.db.getClasses(),w=n.db.getRelations(),k=n.db.getNotes();let m;i.l.info(w),function(e,t,l,n){const a=Object.keys(e);i.l.info("keys:",a),i.l.info(e),a.forEach((function(a){var o,s;const r=e[a],p={shape:"rect",id:r.id,domId:r.domId,labelText:d(r.id),labelStyle:"",style:"fill: none; stroke: black",padding:(null==(o=(0,i.c)().flowchart)?void 0:o.padding)??(null==(s=(0,i.c)().class)?void 0:s.padding)};t.setNode(r.id,p),c(r.classes,t,l,n,r.id),i.l.info("setNode",p)}))}(h,y,t,n),c(v,y,t,n),function(e,t){const l=(0,i.c)().flowchart;let n=0;e.forEach((function(e){var o;n++;const s={classes:"relation",pattern:1==e.relation.lineType?"dashed":"solid",id:"id"+n,arrowhead:"arrow_open"===e.type?"none":"normal",startLabelRight:"none"===e.relationTitle1?"":e.relationTitle1,endLabelLeft:"none"===e.relationTitle2?"":e.relationTitle2,arrowTypeStart:p(e.relation.type1),arrowTypeEnd:p(e.relation.type2),style:"fill:none",labelStyle:"",curve:(0,i.o)(null==l?void 0:l.curve,a.lUB)};if(i.l.info(s,e),void 0!==e.style){const t=(0,i.k)(e.style);s.style=t.style,s.labelStyle=t.labelStyle}e.text=e.title,void 0===e.text?void 0!==e.style&&(s.arrowheadStyle="fill: #333"):(s.arrowheadStyle="fill: #333",s.labelpos="c",(null==(o=(0,i.c)().flowchart)?void 0:o.htmlLabels)??(0,i.c)().htmlLabels?(s.labelType="html",s.label='<span class="edgeLabel">'+e.text+"</span>"):(s.labelType="text",s.label=e.text.replace(i.e.lineBreakRegex,"\n"),void 0===e.style&&(s.style=s.style||"stroke: #333; stroke-width: 1.5px;fill:none"),s.labelStyle=s.labelStyle.replace("color:","fill:"))),t.setEdge(e.id1,e.id2,s,n)}))}(w,y),function(e,t,l,n){i.l.info(e),e.forEach((function(e,o){var s,c;const p=e,b="",u="",f=p.text,g={labelStyle:b,shape:"note",labelText:d(f),noteData:p,rx:0,ry:0,class:"",style:u,id:p.id,domId:p.id,tooltip:"",type:"note",padding:(null==(s=(0,i.c)().flowchart)?void 0:s.padding)??(null==(c=(0,i.c)().class)?void 0:c.padding)};if(t.setNode(p.id,g),i.l.info("setNode",g),!p.class||!(p.class in n))return;const y=l+o,h={id:`edgeNote${y}`,classes:"relation",pattern:"dotted",arrowhead:"none",startLabelRight:"",endLabelLeft:"",arrowTypeStart:"none",arrowTypeEnd:"none",style:"fill:none",labelStyle:"",curve:(0,i.o)(r.curve,a.lUB)};t.setEdge(p.id,p.class,h,y)}))}(k,y,w.length+1,v),"sandbox"===u&&(m=(0,a.Ltv)("#i"+t));const x="sandbox"===u?(0,a.Ltv)(m.nodes()[0].contentDocument.body):(0,a.Ltv)("body"),T=x.select(`[id="${t}"]`),S=x.select("#"+t+" g");if(await(0,s.r)(S,y,["aggregation","extension","composition","dependency","lollipop"],"classDiagram",t),i.u.insertTitle(T,"classTitleText",(null==b?void 0:b.titleTopMargin)??5,n.db.getDiagramTitle()),(0,i.p)(y,T,null==b?void 0:b.diagramPadding,null==b?void 0:b.useMaxWidth),!(null==b?void 0:b.htmlLabels)){const e="sandbox"===u?m.nodes()[0].contentDocument:document,l=e.querySelectorAll('[id="'+t+'"] .edgeLabel .label');for(const t of l){const l=t.getBBox(),n=e.createElementNS("http://www.w3.org/2000/svg","rect");n.setAttribute("rx",0),n.setAttribute("ry",0),n.setAttribute("width",l.width),n.setAttribute("height",l.height),t.insertBefore(n,t.firstChild)}}}},u={parser:n.p,db:n.d,renderer:b,styles:n.s,init:e=>{e.class||(e.class={}),e.class.arrowMarkerAbsolute=e.arrowMarkerAbsolute,n.d.clear()}}}}]);