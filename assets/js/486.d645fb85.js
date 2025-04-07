"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[486],{50486:(t,e,n)=>{n.d(e,{diagram:()=>Y});var i=n(54595),s=n(80007),r=n(20007),a=function(){var t=(0,s.K2)((function(t,e,n,i){for(n=n||{},i=t.length;i--;n[t[i]]=e);return n}),"o"),e=[6,8,10,11,12,14,16,17,18],n=[1,9],i=[1,10],r=[1,11],a=[1,12],o=[1,13],c=[1,14],l={trace:(0,s.K2)((function(){}),"trace"),yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,line:7,SPACE:8,statement:9,NEWLINE:10,title:11,acc_title:12,acc_title_value:13,acc_descr:14,acc_descr_value:15,acc_descr_multiline_value:16,section:17,taskName:18,taskData:19,$accept:0,$end:1},terminals_:{2:"error",4:"journey",6:"EOF",8:"SPACE",10:"NEWLINE",11:"title",12:"acc_title",13:"acc_title_value",14:"acc_descr",15:"acc_descr_value",16:"acc_descr_multiline_value",17:"section",18:"taskName",19:"taskData"},productions_:[0,[3,3],[5,0],[5,2],[7,2],[7,1],[7,1],[7,1],[9,1],[9,2],[9,2],[9,1],[9,1],[9,2]],performAction:(0,s.K2)((function(t,e,n,i,s,r,a){var o=r.length-1;switch(s){case 1:return r[o-1];case 2:case 6:case 7:this.$=[];break;case 3:r[o-1].push(r[o]),this.$=r[o-1];break;case 4:case 5:this.$=r[o];break;case 8:i.setDiagramTitle(r[o].substr(6)),this.$=r[o].substr(6);break;case 9:this.$=r[o].trim(),i.setAccTitle(this.$);break;case 10:case 11:this.$=r[o].trim(),i.setAccDescription(this.$);break;case 12:i.addSection(r[o].substr(8)),this.$=r[o].substr(8);break;case 13:i.addTask(r[o-1],r[o]),this.$="task"}}),"anonymous"),table:[{3:1,4:[1,2]},{1:[3]},t(e,[2,2],{5:3}),{6:[1,4],7:5,8:[1,6],9:7,10:[1,8],11:n,12:i,14:r,16:a,17:o,18:c},t(e,[2,7],{1:[2,1]}),t(e,[2,3]),{9:15,11:n,12:i,14:r,16:a,17:o,18:c},t(e,[2,5]),t(e,[2,6]),t(e,[2,8]),{13:[1,16]},{15:[1,17]},t(e,[2,11]),t(e,[2,12]),{19:[1,18]},t(e,[2,4]),t(e,[2,9]),t(e,[2,10]),t(e,[2,13])],defaultActions:{},parseError:(0,s.K2)((function(t,e){if(!e.recoverable){var n=new Error(t);throw n.hash=e,n}this.trace(t)}),"parseError"),parse:(0,s.K2)((function(t){var e=this,n=[0],i=[],r=[null],a=[],o=this.table,c="",l=0,h=0,u=0,y=a.slice.call(arguments,1),p=Object.create(this.lexer),d={yy:{}};for(var f in this.yy)Object.prototype.hasOwnProperty.call(this.yy,f)&&(d.yy[f]=this.yy[f]);p.setInput(t,d.yy),d.yy.lexer=p,d.yy.parser=this,void 0===p.yylloc&&(p.yylloc={});var g=p.yylloc;a.push(g);var x=p.options&&p.options.ranges;function m(){var t;return"number"!=typeof(t=i.pop()||p.lex()||1)&&(t instanceof Array&&(t=(i=t).pop()),t=e.symbols_[t]||t),t}"function"==typeof d.yy.parseError?this.parseError=d.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError,(0,s.K2)((function(t){n.length=n.length-2*t,r.length=r.length-t,a.length=a.length-t}),"popStack"),(0,s.K2)(m,"lex");for(var k,_,b,w,v,K,$,T,M,S={};;){if(b=n[n.length-1],this.defaultActions[b]?w=this.defaultActions[b]:(null==k&&(k=m()),w=o[b]&&o[b][k]),void 0===w||!w.length||!w[0]){var E="";for(K in M=[],o[b])this.terminals_[K]&&K>2&&M.push("'"+this.terminals_[K]+"'");E=p.showPosition?"Parse error on line "+(l+1)+":\n"+p.showPosition()+"\nExpecting "+M.join(", ")+", got '"+(this.terminals_[k]||k)+"'":"Parse error on line "+(l+1)+": Unexpected "+(1==k?"end of input":"'"+(this.terminals_[k]||k)+"'"),this.parseError(E,{text:p.match,token:this.terminals_[k]||k,line:p.yylineno,loc:g,expected:M})}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+b+", token: "+k);switch(w[0]){case 1:n.push(k),r.push(p.yytext),a.push(p.yylloc),n.push(w[1]),k=null,_?(k=_,_=null):(h=p.yyleng,c=p.yytext,l=p.yylineno,g=p.yylloc,u>0&&u--);break;case 2:if($=this.productions_[w[1]][1],S.$=r[r.length-$],S._$={first_line:a[a.length-($||1)].first_line,last_line:a[a.length-1].last_line,first_column:a[a.length-($||1)].first_column,last_column:a[a.length-1].last_column},x&&(S._$.range=[a[a.length-($||1)].range[0],a[a.length-1].range[1]]),void 0!==(v=this.performAction.apply(S,[c,h,l,d.yy,w[1],r,a].concat(y))))return v;$&&(n=n.slice(0,-1*$*2),r=r.slice(0,-1*$),a=a.slice(0,-1*$)),n.push(this.productions_[w[1]][0]),r.push(S.$),a.push(S._$),T=o[n[n.length-2]][n[n.length-1]],n.push(T);break;case 3:return!0}}return!0}),"parse")},h=function(){return{EOF:1,parseError:(0,s.K2)((function(t,e){if(!this.yy.parser)throw new Error(t);this.yy.parser.parseError(t,e)}),"parseError"),setInput:(0,s.K2)((function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this}),"setInput"),input:(0,s.K2)((function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t}),"input"),unput:(0,s.K2)((function(t){var e=t.length,n=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var i=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var s=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===i.length?this.yylloc.first_column:0)+i[i.length-n.length].length-n[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[s[0],s[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this}),"unput"),more:(0,s.K2)((function(){return this._more=!0,this}),"more"),reject:(0,s.K2)((function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}),"reject"),less:(0,s.K2)((function(t){this.unput(this.match.slice(t))}),"less"),pastInput:(0,s.K2)((function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")}),"pastInput"),upcomingInput:(0,s.K2)((function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")}),"upcomingInput"),showPosition:(0,s.K2)((function(){var t=this.pastInput(),e=new Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"}),"showPosition"),test_match:(0,s.K2)((function(t,e){var n,i,s;if(this.options.backtrack_lexer&&(s={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(s.yylloc.range=this.yylloc.range.slice(0))),(i=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=i.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:i?i[i.length-1].length-i[i.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],n=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var r in s)this[r]=s[r];return!1}return!1}),"test_match"),next:(0,s.K2)((function(){if(this.done)return this.EOF;var t,e,n,i;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var s=this._currentRules(),r=0;r<s.length;r++)if((n=this._input.match(this.rules[s[r]]))&&(!e||n[0].length>e[0].length)){if(e=n,i=r,this.options.backtrack_lexer){if(!1!==(t=this.test_match(n,s[r])))return t;if(this._backtrack){e=!1;continue}return!1}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,s[i]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})}),"next"),lex:(0,s.K2)((function(){var t=this.next();return t||this.lex()}),"lex"),begin:(0,s.K2)((function(t){this.conditionStack.push(t)}),"begin"),popState:(0,s.K2)((function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]}),"popState"),_currentRules:(0,s.K2)((function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules}),"_currentRules"),topState:(0,s.K2)((function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"}),"topState"),pushState:(0,s.K2)((function(t){this.begin(t)}),"pushState"),stateStackSize:(0,s.K2)((function(){return this.conditionStack.length}),"stateStackSize"),options:{"case-insensitive":!0},performAction:(0,s.K2)((function(t,e,n,i){switch(n){case 0:case 1:case 3:case 4:break;case 2:return 10;case 5:return 4;case 6:return 11;case 7:return this.begin("acc_title"),12;case 8:return this.popState(),"acc_title_value";case 9:return this.begin("acc_descr"),14;case 10:return this.popState(),"acc_descr_value";case 11:this.begin("acc_descr_multiline");break;case 12:this.popState();break;case 13:return"acc_descr_multiline_value";case 14:return 17;case 15:return 18;case 16:return 19;case 17:return":";case 18:return 6;case 19:return"INVALID"}}),"anonymous"),rules:[/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{acc_descr_multiline:{rules:[12,13],inclusive:!1},acc_descr:{rules:[10],inclusive:!1},acc_title:{rules:[8],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,9,11,14,15,16,17,18,19],inclusive:!0}}}}();function u(){this.yy={}}return l.lexer=h,(0,s.K2)(u,"Parser"),u.prototype=l,l.Parser=u,new u}();a.parser=a;var o=a,c="",l=[],h=[],u=[],y=(0,s.K2)((function(){l.length=0,h.length=0,c="",u.length=0,(0,s.IU)()}),"clear"),p=(0,s.K2)((function(t){c=t,l.push(t)}),"addSection"),d=(0,s.K2)((function(){return l}),"getSections"),f=(0,s.K2)((function(){let t=k();let e=0;for(;!t&&e<100;)t=k(),e++;return h.push(...u),h}),"getTasks"),g=(0,s.K2)((function(){const t=[];h.forEach((e=>{e.people&&t.push(...e.people)}));return[...new Set(t)].sort()}),"updateActors"),x=(0,s.K2)((function(t,e){const n=e.substr(1).split(":");let i=0,s=[];1===n.length?(i=Number(n[0]),s=[]):(i=Number(n[0]),s=n[1].split(","));const r=s.map((t=>t.trim())),a={section:c,type:c,people:r,task:t,score:i};u.push(a)}),"addTask"),m=(0,s.K2)((function(t){const e={section:c,type:c,description:t,task:t,classes:[]};h.push(e)}),"addTaskOrg"),k=(0,s.K2)((function(){const t=(0,s.K2)((function(t){return u[t].processed}),"compileTask");let e=!0;for(const[n,i]of u.entries())t(n),e=e&&i.processed;return e}),"compileTasks"),_=(0,s.K2)((function(){return g()}),"getActors"),b={getConfig:(0,s.K2)((()=>(0,s.D7)().journey),"getConfig"),clear:y,setDiagramTitle:s.ke,getDiagramTitle:s.ab,setAccTitle:s.SV,getAccTitle:s.iN,setAccDescription:s.EI,getAccDescription:s.m7,addSection:p,getSections:d,getTasks:f,addTask:x,addTaskOrg:m,getActors:_},w=(0,s.K2)((t=>`.label {\n    font-family: ${t.fontFamily};\n    color: ${t.textColor};\n  }\n  .mouth {\n    stroke: #666;\n  }\n\n  line {\n    stroke: ${t.textColor}\n  }\n\n  .legend {\n    fill: ${t.textColor};\n    font-family: ${t.fontFamily};\n  }\n\n  .label text {\n    fill: #333;\n  }\n  .label {\n    color: ${t.textColor}\n  }\n\n  .face {\n    ${t.faceColor?`fill: ${t.faceColor}`:"fill: #FFF8DC"};\n    stroke: #999;\n  }\n\n  .node rect,\n  .node circle,\n  .node ellipse,\n  .node polygon,\n  .node path {\n    fill: ${t.mainBkg};\n    stroke: ${t.nodeBorder};\n    stroke-width: 1px;\n  }\n\n  .node .label {\n    text-align: center;\n  }\n  .node.clickable {\n    cursor: pointer;\n  }\n\n  .arrowheadPath {\n    fill: ${t.arrowheadColor};\n  }\n\n  .edgePath .path {\n    stroke: ${t.lineColor};\n    stroke-width: 1.5px;\n  }\n\n  .flowchart-link {\n    stroke: ${t.lineColor};\n    fill: none;\n  }\n\n  .edgeLabel {\n    background-color: ${t.edgeLabelBackground};\n    rect {\n      opacity: 0.5;\n    }\n    text-align: center;\n  }\n\n  .cluster rect {\n  }\n\n  .cluster text {\n    fill: ${t.titleColor};\n  }\n\n  div.mermaidTooltip {\n    position: absolute;\n    text-align: center;\n    max-width: 200px;\n    padding: 2px;\n    font-family: ${t.fontFamily};\n    font-size: 12px;\n    background: ${t.tertiaryColor};\n    border: 1px solid ${t.border2};\n    border-radius: 2px;\n    pointer-events: none;\n    z-index: 100;\n  }\n\n  .task-type-0, .section-type-0  {\n    ${t.fillType0?`fill: ${t.fillType0}`:""};\n  }\n  .task-type-1, .section-type-1  {\n    ${t.fillType0?`fill: ${t.fillType1}`:""};\n  }\n  .task-type-2, .section-type-2  {\n    ${t.fillType0?`fill: ${t.fillType2}`:""};\n  }\n  .task-type-3, .section-type-3  {\n    ${t.fillType0?`fill: ${t.fillType3}`:""};\n  }\n  .task-type-4, .section-type-4  {\n    ${t.fillType0?`fill: ${t.fillType4}`:""};\n  }\n  .task-type-5, .section-type-5  {\n    ${t.fillType0?`fill: ${t.fillType5}`:""};\n  }\n  .task-type-6, .section-type-6  {\n    ${t.fillType0?`fill: ${t.fillType6}`:""};\n  }\n  .task-type-7, .section-type-7  {\n    ${t.fillType0?`fill: ${t.fillType7}`:""};\n  }\n\n  .actor-0 {\n    ${t.actor0?`fill: ${t.actor0}`:""};\n  }\n  .actor-1 {\n    ${t.actor1?`fill: ${t.actor1}`:""};\n  }\n  .actor-2 {\n    ${t.actor2?`fill: ${t.actor2}`:""};\n  }\n  .actor-3 {\n    ${t.actor3?`fill: ${t.actor3}`:""};\n  }\n  .actor-4 {\n    ${t.actor4?`fill: ${t.actor4}`:""};\n  }\n  .actor-5 {\n    ${t.actor5?`fill: ${t.actor5}`:""};\n  }\n`),"getStyles"),v=(0,s.K2)((function(t,e){return(0,i.tk)(t,e)}),"drawRect"),K=(0,s.K2)((function(t,e){const n=15,i=t.append("circle").attr("cx",e.cx).attr("cy",e.cy).attr("class","face").attr("r",n).attr("stroke-width",2).attr("overflow","visible"),a=t.append("g");function o(t){const i=(0,r.JLW)().startAngle(Math.PI/2).endAngle(Math.PI/2*3).innerRadius(7.5).outerRadius(n/2.2);t.append("path").attr("class","mouth").attr("d",i).attr("transform","translate("+e.cx+","+(e.cy+2)+")")}function c(t){const i=(0,r.JLW)().startAngle(3*Math.PI/2).endAngle(Math.PI/2*5).innerRadius(7.5).outerRadius(n/2.2);t.append("path").attr("class","mouth").attr("d",i).attr("transform","translate("+e.cx+","+(e.cy+7)+")")}function l(t){t.append("line").attr("class","mouth").attr("stroke",2).attr("x1",e.cx-5).attr("y1",e.cy+7).attr("x2",e.cx+5).attr("y2",e.cy+7).attr("class","mouth").attr("stroke-width","1px").attr("stroke","#666")}return a.append("circle").attr("cx",e.cx-5).attr("cy",e.cy-5).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),a.append("circle").attr("cx",e.cx+5).attr("cy",e.cy-5).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),(0,s.K2)(o,"smile"),(0,s.K2)(c,"sad"),(0,s.K2)(l,"ambivalent"),e.score>3?o(a):e.score<3?c(a):l(a),i}),"drawFace"),$=(0,s.K2)((function(t,e){const n=t.append("circle");return n.attr("cx",e.cx),n.attr("cy",e.cy),n.attr("class","actor-"+e.pos),n.attr("fill",e.fill),n.attr("stroke",e.stroke),n.attr("r",e.r),void 0!==n.class&&n.attr("class",n.class),void 0!==e.title&&n.append("title").text(e.title),n}),"drawCircle"),T=(0,s.K2)((function(t,e){return(0,i.m)(t,e)}),"drawText"),M=(0,s.K2)((function(t,e){function n(t,e,n,i,s){return t+","+e+" "+(t+n)+","+e+" "+(t+n)+","+(e+i-s)+" "+(t+n-1.2*s)+","+(e+i)+" "+t+","+(e+i)}(0,s.K2)(n,"genPoints");const i=t.append("polygon");i.attr("points",n(e.x,e.y,50,20,7)),i.attr("class","labelBox"),e.y=e.y+e.labelMargin,e.x=e.x+.5*e.labelMargin,T(t,e)}),"drawLabel"),S=(0,s.K2)((function(t,e,n){const s=t.append("g"),r=(0,i.PB)();r.x=e.x,r.y=e.y,r.fill=e.fill,r.width=n.width*e.taskCount+n.diagramMarginX*(e.taskCount-1),r.height=n.height,r.class="journey-section section-type-"+e.num,r.rx=3,r.ry=3,v(s,r),C(n)(e.text,s,r.x,r.y,r.width,r.height,{class:"journey-section section-type-"+e.num},n,e.colour)}),"drawSection"),E=-1,I=(0,s.K2)((function(t,e,n){const s=e.x+n.width/2,r=t.append("g");E++;r.append("line").attr("id","task"+E).attr("x1",s).attr("y1",e.y).attr("x2",s).attr("y2",450).attr("class","task-line").attr("stroke-width","1px").attr("stroke-dasharray","4 2").attr("stroke","#666"),K(r,{cx:s,cy:300+30*(5-e.score),score:e.score});const a=(0,i.PB)();a.x=e.x,a.y=e.y,a.fill=e.fill,a.width=n.width,a.height=n.height,a.class="task task-type-"+e.num,a.rx=3,a.ry=3,v(r,a);let o=e.x+14;e.people.forEach((t=>{const n=e.actors[t].color,i={cx:o,cy:e.y,r:7,fill:n,stroke:"#000",title:t,pos:e.actors[t].position};$(r,i),o+=10})),C(n)(e.task,r,a.x,a.y,a.width,a.height,{class:"task"},n,e.colour)}),"drawTask"),P=(0,s.K2)((function(t,e){(0,i.lC)(t,e)}),"drawBackgroundRect"),C=function(){function t(t,e,n,s,r,a,o,c){i(e.append("text").attr("x",n+r/2).attr("y",s+a/2+5).style("font-color",c).style("text-anchor","middle").text(t),o)}function e(t,e,n,s,r,a,o,c,l){const{taskFontSize:h,taskFontFamily:u}=c,y=t.split(/<br\s*\/?>/gi);for(let p=0;p<y.length;p++){const t=p*h-h*(y.length-1)/2,c=e.append("text").attr("x",n+r/2).attr("y",s).attr("fill",l).style("text-anchor","middle").style("font-size",h).style("font-family",u);c.append("tspan").attr("x",n+r/2).attr("dy",t).text(y[p]),c.attr("y",s+a/2).attr("dominant-baseline","central").attr("alignment-baseline","central"),i(c,o)}}function n(t,n,s,r,a,o,c,l){const h=n.append("switch"),u=h.append("foreignObject").attr("x",s).attr("y",r).attr("width",a).attr("height",o).attr("position","fixed").append("xhtml:div").style("display","table").style("height","100%").style("width","100%");u.append("div").attr("class","label").style("display","table-cell").style("text-align","center").style("vertical-align","middle").text(t),e(t,h,s,r,a,o,c,l),i(u,c)}function i(t,e){for(const n in e)n in e&&t.attr(n,e[n])}return(0,s.K2)(t,"byText"),(0,s.K2)(e,"byTspan"),(0,s.K2)(n,"byFo"),(0,s.K2)(i,"_setTextAttrs"),function(i){return"fo"===i.textPlacement?n:"old"===i.textPlacement?t:e}}(),A={drawRect:v,drawCircle:$,drawSection:S,drawText:T,drawLabel:M,drawTask:I,drawBackgroundRect:P,initGraphics:(0,s.K2)((function(t){t.append("defs").append("marker").attr("id","arrowhead").attr("refX",5).attr("refY",2).attr("markerWidth",6).attr("markerHeight",4).attr("orient","auto").append("path").attr("d","M 0,0 V 4 L6,2 Z")}),"initGraphics")},j=(0,s.K2)((function(t){Object.keys(t).forEach((function(e){V[e]=t[e]}))}),"setConf"),D={};function L(t){const e=(0,s.D7)().journey;let n=60;Object.keys(D).forEach((i=>{const s=D[i].color,r={cx:20,cy:n,r:7,fill:s,stroke:"#000",pos:D[i].position};A.drawCircle(t,r);const a={x:40,y:n+7,fill:"#666",text:i,textMargin:5|e.boxTextMargin};A.drawText(t,a),n+=20}))}(0,s.K2)(L,"drawActorLegend");var V=(0,s.D7)().journey,F=V.leftMargin,B=(0,s.K2)((function(t,e,n,i){const a=(0,s.D7)().journey,o=(0,s.D7)().securityLevel;let c;"sandbox"===o&&(c=(0,r.Ltv)("#i"+e));const l="sandbox"===o?(0,r.Ltv)(c.nodes()[0].contentDocument.body):(0,r.Ltv)("body");O.init();const h=l.select("#"+e);A.initGraphics(h);const u=i.db.getTasks(),y=i.db.getDiagramTitle(),p=i.db.getActors();for(const s in D)delete D[s];let d=0;p.forEach((t=>{D[t]={color:a.actorColours[d%a.actorColours.length],position:d},d++})),L(h),O.insert(0,0,F,50*Object.keys(D).length),z(h,u,0);const f=O.getBounds();y&&h.append("text").text(y).attr("x",F).attr("font-size","4ex").attr("font-weight","bold").attr("y",25);const g=f.stopy-f.starty+2*a.diagramMarginY,x=F+f.stopx+2*a.diagramMarginX;(0,s.a$)(h,g,x,a.useMaxWidth),h.append("line").attr("x1",F).attr("y1",4*a.height).attr("x2",x-F-4).attr("y2",4*a.height).attr("stroke-width",4).attr("stroke","black").attr("marker-end","url(#arrowhead)");const m=y?70:0;h.attr("viewBox",`${f.startx} -25 ${x} ${g+m}`),h.attr("preserveAspectRatio","xMinYMin meet"),h.attr("height",g+m+25)}),"draw"),O={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:(0,s.K2)((function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0}),"init"),updateVal:(0,s.K2)((function(t,e,n,i){void 0===t[e]?t[e]=n:t[e]=i(n,t[e])}),"updateVal"),updateBounds:(0,s.K2)((function(t,e,n,i){const r=(0,s.D7)().journey,a=this;let o=0;function c(c){return(0,s.K2)((function(s){o++;const l=a.sequenceItems.length-o+1;a.updateVal(s,"starty",e-l*r.boxMargin,Math.min),a.updateVal(s,"stopy",i+l*r.boxMargin,Math.max),a.updateVal(O.data,"startx",t-l*r.boxMargin,Math.min),a.updateVal(O.data,"stopx",n+l*r.boxMargin,Math.max),"activation"!==c&&(a.updateVal(s,"startx",t-l*r.boxMargin,Math.min),a.updateVal(s,"stopx",n+l*r.boxMargin,Math.max),a.updateVal(O.data,"starty",e-l*r.boxMargin,Math.min),a.updateVal(O.data,"stopy",i+l*r.boxMargin,Math.max))}),"updateItemBounds")}(0,s.K2)(c,"updateFn"),this.sequenceItems.forEach(c())}),"updateBounds"),insert:(0,s.K2)((function(t,e,n,i){const s=Math.min(t,n),r=Math.max(t,n),a=Math.min(e,i),o=Math.max(e,i);this.updateVal(O.data,"startx",s,Math.min),this.updateVal(O.data,"starty",a,Math.min),this.updateVal(O.data,"stopx",r,Math.max),this.updateVal(O.data,"stopy",o,Math.max),this.updateBounds(s,a,r,o)}),"insert"),bumpVerticalPos:(0,s.K2)((function(t){this.verticalPos=this.verticalPos+t,this.data.stopy=this.verticalPos}),"bumpVerticalPos"),getVerticalPos:(0,s.K2)((function(){return this.verticalPos}),"getVerticalPos"),getBounds:(0,s.K2)((function(){return this.data}),"getBounds")},N=V.sectionFills,R=V.sectionColours,z=(0,s.K2)((function(t,e,n){const i=(0,s.D7)().journey;let r="";const a=n+(2*i.height+i.diagramMarginY);let o=0,c="#CCC",l="black",h=0;for(const[s,u]of e.entries()){if(r!==u.section){c=N[o%N.length],h=o%N.length,l=R[o%R.length];let n=0;const a=u.section;for(let t=s;t<e.length&&e[t].section==a;t++)n+=1;const y={x:s*i.taskMargin+s*i.width+F,y:50,text:u.section,fill:c,num:h,colour:l,taskCount:n};A.drawSection(t,y,i),r=u.section,o++}const n=u.people.reduce(((t,e)=>(D[e]&&(t[e]=D[e]),t)),{});u.x=s*i.taskMargin+s*i.width+F,u.y=a,u.width=i.diagramMarginX,u.height=i.diagramMarginY,u.colour=l,u.fill=c,u.num=h,u.actors=n,A.drawTask(t,u,i),O.insert(u.x,u.y,u.x+u.width+i.taskMargin,450)}}),"drawTasks"),W={setConf:j,draw:B},Y={parser:o,db:b,renderer:W,styles:w,init:(0,s.K2)((t=>{W.setConf(t.journey),b.clear()}),"init")}},54595:(t,e,n)=>{n.d(e,{CP:()=>l,HT:()=>u,PB:()=>h,aC:()=>c,lC:()=>a,m:()=>o,tk:()=>r});var i=n(80007),s=n(81162),r=(0,i.K2)(((t,e)=>{const n=t.append("rect");if(n.attr("x",e.x),n.attr("y",e.y),n.attr("fill",e.fill),n.attr("stroke",e.stroke),n.attr("width",e.width),n.attr("height",e.height),e.name&&n.attr("name",e.name),e.rx&&n.attr("rx",e.rx),e.ry&&n.attr("ry",e.ry),void 0!==e.attrs)for(const i in e.attrs)n.attr(i,e.attrs[i]);return e.class&&n.attr("class",e.class),n}),"drawRect"),a=(0,i.K2)(((t,e)=>{const n={x:e.startx,y:e.starty,width:e.stopx-e.startx,height:e.stopy-e.starty,fill:e.fill,stroke:e.stroke,class:"rect"};r(t,n).lower()}),"drawBackgroundRect"),o=(0,i.K2)(((t,e)=>{const n=e.text.replace(i.H1," "),s=t.append("text");s.attr("x",e.x),s.attr("y",e.y),s.attr("class","legend"),s.style("text-anchor",e.anchor),e.class&&s.attr("class",e.class);const r=s.append("tspan");return r.attr("x",e.x+2*e.textMargin),r.text(n),s}),"drawText"),c=(0,i.K2)(((t,e,n,i)=>{const r=t.append("image");r.attr("x",e),r.attr("y",n);const a=(0,s.J)(i);r.attr("xlink:href",a)}),"drawImage"),l=(0,i.K2)(((t,e,n,i)=>{const r=t.append("use");r.attr("x",e),r.attr("y",n);const a=(0,s.J)(i);r.attr("xlink:href",`#${a}`)}),"drawEmbeddedImage"),h=(0,i.K2)((()=>({x:0,y:0,width:100,height:100,fill:"#EDF2AE",stroke:"#666",anchor:"start",rx:0,ry:0})),"getNoteRect"),u=(0,i.K2)((()=>({x:0,y:0,width:100,height:100,"text-anchor":"start",style:"#666",textMargin:0,rx:0,ry:0,tspan:!0})),"getTextObj")}}]);