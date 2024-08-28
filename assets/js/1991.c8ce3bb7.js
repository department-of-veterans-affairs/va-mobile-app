"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[1991],{1991:(t,e,i)=>{i.d(e,{diagram:()=>d});var n=i(96262),s=i(63240),r=(i(74353),i(16750),i(42838),function(){var t=function(t,e,i,n){for(i=i||{},n=t.length;n--;i[t[n]]=e);return i},e=[1,4],i=[1,5],n=[1,6],s=[1,7],r=[1,9],c=[1,11,13,15,17,19,20,26,27,28,29],a=[2,5],l=[1,6,11,13,15,17,19,20,26,27,28,29],o=[26,27,28],h=[2,8],u=[1,18],y=[1,19],p=[1,20],d=[1,21],g=[1,22],_=[1,23],f=[1,28],m=[6,26,27,28,29],v={trace:function(){},yy:{},symbols_:{error:2,start:3,eol:4,directive:5,PIE:6,document:7,showData:8,line:9,statement:10,txt:11,value:12,title:13,title_value:14,acc_title:15,acc_title_value:16,acc_descr:17,acc_descr_value:18,acc_descr_multiline_value:19,section:20,openDirective:21,typeDirective:22,closeDirective:23,":":24,argDirective:25,NEWLINE:26,";":27,EOF:28,open_directive:29,type_directive:30,arg_directive:31,close_directive:32,$accept:0,$end:1},terminals_:{2:"error",6:"PIE",8:"showData",11:"txt",12:"value",13:"title",14:"title_value",15:"acc_title",16:"acc_title_value",17:"acc_descr",18:"acc_descr_value",19:"acc_descr_multiline_value",20:"section",24:":",26:"NEWLINE",27:";",28:"EOF",29:"open_directive",30:"type_directive",31:"arg_directive",32:"close_directive"},productions_:[0,[3,2],[3,2],[3,2],[3,3],[7,0],[7,2],[9,2],[10,0],[10,2],[10,2],[10,2],[10,2],[10,1],[10,1],[10,1],[5,3],[5,5],[4,1],[4,1],[4,1],[21,1],[22,1],[25,1],[23,1]],performAction:function(t,e,i,n,s,r,c){var a=r.length-1;switch(s){case 4:n.setShowData(!0);break;case 7:this.$=r[a-1];break;case 9:n.addSection(r[a-1],n.cleanupValue(r[a]));break;case 10:this.$=r[a].trim(),n.setDiagramTitle(this.$);break;case 11:this.$=r[a].trim(),n.setAccTitle(this.$);break;case 12:case 13:this.$=r[a].trim(),n.setAccDescription(this.$);break;case 14:n.addSection(r[a].substr(8)),this.$=r[a].substr(8);break;case 21:n.parseDirective("%%{","open_directive");break;case 22:n.parseDirective(r[a],"type_directive");break;case 23:r[a]=r[a].trim().replace(/'/g,'"'),n.parseDirective(r[a],"arg_directive");break;case 24:n.parseDirective("}%%","close_directive","pie")}},table:[{3:1,4:2,5:3,6:e,21:8,26:i,27:n,28:s,29:r},{1:[3]},{3:10,4:2,5:3,6:e,21:8,26:i,27:n,28:s,29:r},{3:11,4:2,5:3,6:e,21:8,26:i,27:n,28:s,29:r},t(c,a,{7:12,8:[1,13]}),t(l,[2,18]),t(l,[2,19]),t(l,[2,20]),{22:14,30:[1,15]},{30:[2,21]},{1:[2,1]},{1:[2,2]},t(o,h,{21:8,9:16,10:17,5:24,1:[2,3],11:u,13:y,15:p,17:d,19:g,20:_,29:r}),t(c,a,{7:25}),{23:26,24:[1,27],32:f},t([24,32],[2,22]),t(c,[2,6]),{4:29,26:i,27:n,28:s},{12:[1,30]},{14:[1,31]},{16:[1,32]},{18:[1,33]},t(o,[2,13]),t(o,[2,14]),t(o,[2,15]),t(o,h,{21:8,9:16,10:17,5:24,1:[2,4],11:u,13:y,15:p,17:d,19:g,20:_,29:r}),t(m,[2,16]),{25:34,31:[1,35]},t(m,[2,24]),t(c,[2,7]),t(o,[2,9]),t(o,[2,10]),t(o,[2,11]),t(o,[2,12]),{23:36,32:f},{32:[2,23]},t(m,[2,17])],defaultActions:{9:[2,21],10:[2,1],11:[2,2],35:[2,23]},parseError:function(t,e){if(!e.recoverable){var i=new Error(t);throw i.hash=e,i}this.trace(t)},parse:function(t){var e=this,i=[0],n=[],s=[null],r=[],c=this.table,a="",l=0,o=0,h=r.slice.call(arguments,1),u=Object.create(this.lexer),y={yy:{}};for(var p in this.yy)Object.prototype.hasOwnProperty.call(this.yy,p)&&(y.yy[p]=this.yy[p]);u.setInput(t,y.yy),y.yy.lexer=u,y.yy.parser=this,void 0===u.yylloc&&(u.yylloc={});var d=u.yylloc;r.push(d);var g=u.options&&u.options.ranges;"function"==typeof y.yy.parseError?this.parseError=y.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var _,f,m,v,b,k,x,S,w,E={};;){if(f=i[i.length-1],this.defaultActions[f]?m=this.defaultActions[f]:(null==_&&(w=void 0,"number"!=typeof(w=n.pop()||u.lex()||1)&&(w instanceof Array&&(w=(n=w).pop()),w=e.symbols_[w]||w),_=w),m=c[f]&&c[f][_]),void 0===m||!m.length||!m[0]){var D="";for(b in S=[],c[f])this.terminals_[b]&&b>2&&S.push("'"+this.terminals_[b]+"'");D=u.showPosition?"Parse error on line "+(l+1)+":\n"+u.showPosition()+"\nExpecting "+S.join(", ")+", got '"+(this.terminals_[_]||_)+"'":"Parse error on line "+(l+1)+": Unexpected "+(1==_?"end of input":"'"+(this.terminals_[_]||_)+"'"),this.parseError(D,{text:u.match,token:this.terminals_[_]||_,line:u.yylineno,loc:d,expected:S})}if(m[0]instanceof Array&&m.length>1)throw new Error("Parse Error: multiple actions possible at state: "+f+", token: "+_);switch(m[0]){case 1:i.push(_),s.push(u.yytext),r.push(u.yylloc),i.push(m[1]),_=null,o=u.yyleng,a=u.yytext,l=u.yylineno,d=u.yylloc;break;case 2:if(k=this.productions_[m[1]][1],E.$=s[s.length-k],E._$={first_line:r[r.length-(k||1)].first_line,last_line:r[r.length-1].last_line,first_column:r[r.length-(k||1)].first_column,last_column:r[r.length-1].last_column},g&&(E._$.range=[r[r.length-(k||1)].range[0],r[r.length-1].range[1]]),void 0!==(v=this.performAction.apply(E,[a,o,l,y.yy,m[1],s,r].concat(h))))return v;k&&(i=i.slice(0,-1*k*2),s=s.slice(0,-1*k),r=r.slice(0,-1*k)),i.push(this.productions_[m[1]][0]),s.push(E.$),r.push(E._$),x=c[i[i.length-2]][i[i.length-1]],i.push(x);break;case 3:return!0}}return!0}},b={EOF:1,parseError:function(t,e){if(!this.yy.parser)throw new Error(t);this.yy.parser.parseError(t,e)},setInput:function(t,e){return this.yy=e||this.yy||{},this._input=t,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var t=this._input[0];return this.yytext+=t,this.yyleng++,this.offset++,this.match+=t,this.matched+=t,t.match(/(?:\r\n?|\n).*/g)?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),t},unput:function(t){var e=t.length,i=t.split(/(?:\r\n?|\n)/g);this._input=t+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-e),this.offset-=e;var n=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),i.length-1&&(this.yylineno-=i.length-1);var s=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:i?(i.length===n.length?this.yylloc.first_column:0)+n[n.length-i.length].length-i[0].length:this.yylloc.first_column-e},this.options.ranges&&(this.yylloc.range=[s[0],s[0]+this.yyleng-e]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){return this.options.backtrack_lexer?(this._backtrack=!0,this):this.parseError("Lexical error on line "+(this.yylineno+1)+". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},less:function(t){this.unput(this.match.slice(t))},pastInput:function(){var t=this.matched.substr(0,this.matched.length-this.match.length);return(t.length>20?"...":"")+t.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var t=this.match;return t.length<20&&(t+=this._input.substr(0,20-t.length)),(t.substr(0,20)+(t.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var t=this.pastInput(),e=new Array(t.length+1).join("-");return t+this.upcomingInput()+"\n"+e+"^"},test_match:function(t,e){var i,n,s;if(this.options.backtrack_lexer&&(s={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(s.yylloc.range=this.yylloc.range.slice(0))),(n=t[0].match(/(?:\r\n?|\n).*/g))&&(this.yylineno+=n.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:n?n[n.length-1].length-n[n.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+t[0].length},this.yytext+=t[0],this.match+=t[0],this.matches=t,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(t[0].length),this.matched+=t[0],i=this.performAction.call(this,this.yy,this,e,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),i)return i;if(this._backtrack){for(var r in s)this[r]=s[r];return!1}return!1},next:function(){if(this.done)return this.EOF;var t,e,i,n;this._input||(this.done=!0),this._more||(this.yytext="",this.match="");for(var s=this._currentRules(),r=0;r<s.length;r++)if((i=this._input.match(this.rules[s[r]]))&&(!e||i[0].length>e[0].length)){if(e=i,n=r,this.options.backtrack_lexer){if(!1!==(t=this.test_match(i,s[r])))return t;if(this._backtrack){e=!1;continue}return!1}if(!this.options.flex)break}return e?!1!==(t=this.test_match(e,s[n]))&&t:""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var t=this.next();return t||this.lex()},begin:function(t){this.conditionStack.push(t)},popState:function(){return this.conditionStack.length-1>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(t){return(t=this.conditionStack.length-1-Math.abs(t||0))>=0?this.conditionStack[t]:"INITIAL"},pushState:function(t){this.begin(t)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(t,e,i,n){switch(i){case 0:return this.begin("open_directive"),29;case 1:return this.begin("type_directive"),30;case 2:return this.popState(),this.begin("arg_directive"),24;case 3:return this.popState(),this.popState(),32;case 4:return 31;case 5:case 6:case 8:case 9:break;case 7:return 26;case 10:return this.begin("title"),13;case 11:return this.popState(),"title_value";case 12:return this.begin("acc_title"),15;case 13:return this.popState(),"acc_title_value";case 14:return this.begin("acc_descr"),17;case 15:return this.popState(),"acc_descr_value";case 16:this.begin("acc_descr_multiline");break;case 17:case 20:this.popState();break;case 18:return"acc_descr_multiline_value";case 19:this.begin("string");break;case 21:return"txt";case 22:return 6;case 23:return 8;case 24:return"value";case 25:return 28}},rules:[/^(?:%%\{)/i,/^(?:((?:(?!\}%%)[^:.])*))/i,/^(?::)/i,/^(?:\}%%)/i,/^(?:((?:(?!\}%%).|\n)*))/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n\r]+)/i,/^(?:%%[^\n]*)/i,/^(?:[\s]+)/i,/^(?:title\b)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:["])/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:pie\b)/i,/^(?:showData\b)/i,/^(?::[\s]*[\d]+(?:\.[\d]+)?)/i,/^(?:$)/i],conditions:{acc_descr_multiline:{rules:[17,18],inclusive:!1},acc_descr:{rules:[15],inclusive:!1},acc_title:{rules:[13],inclusive:!1},close_directive:{rules:[],inclusive:!1},arg_directive:{rules:[3,4],inclusive:!1},type_directive:{rules:[2,3],inclusive:!1},open_directive:{rules:[1],inclusive:!1},title:{rules:[11],inclusive:!1},string:{rules:[20,21],inclusive:!1},INITIAL:{rules:[0,5,6,7,8,9,10,12,14,16,19,22,23,24,25],inclusive:!0}}};function k(){this.yy={}}return v.lexer=b,k.prototype=v,v.Parser=k,new k}());r.parser=r;const c=r;let a={},l=!1;const o={parseDirective:function(t,e,i){n.m.parseDirective(this,t,e,i)},getConfig:()=>(0,n.c)().pie,addSection:function(t,e){t=n.e.sanitizeText(t,(0,n.c)()),void 0===a[t]&&(a[t]=e,n.l.debug("Added new section :",t))},getSections:()=>a,cleanupValue:function(t){return":"===t.substring(0,1)?(t=t.substring(1).trim(),Number(t.trim())):Number(t.trim())},clear:function(){a={},l=!1,(0,n.v)()},setAccTitle:n.s,getAccTitle:n.g,setDiagramTitle:n.r,getDiagramTitle:n.t,setShowData:function(t){l=t},getShowData:function(){return l},getAccDescription:n.a,setAccDescription:n.b},h=t=>`\n  .pieCircle{\n    stroke: ${t.pieStrokeColor};\n    stroke-width : ${t.pieStrokeWidth};\n    opacity : ${t.pieOpacity};\n  }\n  .pieOuterCircle{\n    stroke: ${t.pieOuterStrokeColor};\n    stroke-width: ${t.pieOuterStrokeWidth};\n    fill: none;\n  }\n  .pieTitleText {\n    text-anchor: middle;\n    font-size: ${t.pieTitleTextSize};\n    fill: ${t.pieTitleTextColor};\n    font-family: ${t.fontFamily};\n  }\n  .slice {\n    font-family: ${t.fontFamily};\n    fill: ${t.pieSectionTextColor};\n    font-size:${t.pieSectionTextSize};\n    // fill: white;\n  }\n  .legend text {\n    fill: ${t.pieLegendTextColor};\n    font-family: ${t.fontFamily};\n    font-size: ${t.pieLegendTextSize};\n  }\n`;let u,y=(0,n.c)();const p=450,d={parser:c,db:o,renderer:{draw:(t,e,i,r)=>{var c;try{y=(0,n.c)(),n.l.debug("Rendering info diagram\n"+t);const i=(0,n.c)().securityLevel;let x;"sandbox"===i&&(x=(0,s.Ltv)("#i"+e));const S="sandbox"===i?(0,s.Ltv)(x.nodes()[0].contentDocument.body):(0,s.Ltv)("body"),w=("sandbox"===i?x.nodes()[0].contentDocument:document).getElementById(e);u=w.parentElement.offsetWidth,void 0===u&&(u=1200),void 0!==y.useWidth&&(u=y.useWidth),void 0!==y.pie.useWidth&&(u=y.pie.useWidth);const E=S.select("#"+e);(0,n.i)(E,p,u,y.pie.useMaxWidth),w.setAttribute("viewBox","0 0 "+u+" "+p);var a=18,l=Math.min(u,p)/2-40,o=E.append("g").attr("transform","translate("+u/2+",225)"),h=r.db.getSections(),d=0;Object.keys(h).forEach((function(t){d+=h[t]}));const D=y.themeVariables;var g=[D.pie1,D.pie2,D.pie3,D.pie4,D.pie5,D.pie6,D.pie7,D.pie8,D.pie9,D.pie10,D.pie11,D.pie12];const $=(null==(c=y.pie)?void 0:c.textPosition)??.75;let[A]=(0,n.B)(D.pieOuterStrokeWidth);A??(A=2);var _=(0,s.UMr)().range(g),f=Object.entries(h).map((function(t,e){return{order:e,name:t[0],value:t[1]}})),m=(0,s.rLf)().value((function(t){return t.value})).sort((function(t,e){return t.order-e.order}))(f),v=(0,s.JLW)().innerRadius(0).outerRadius(l),b=(0,s.JLW)().innerRadius(l*$).outerRadius(l*$);o.append("circle").attr("cx",0).attr("cy",0).attr("r",l+A/2).attr("class","pieOuterCircle"),o.selectAll("mySlices").data(m).enter().append("path").attr("d",v).attr("fill",(function(t){return _(t.data.name)})).attr("class","pieCircle"),o.selectAll("mySlices").data(m).enter().append("text").text((function(t){return(t.data.value/d*100).toFixed(0)+"%"})).attr("transform",(function(t){return"translate("+b.centroid(t)+")"})).style("text-anchor","middle").attr("class","slice"),o.append("text").text(r.db.getDiagramTitle()).attr("x",0).attr("y",-200).attr("class","pieTitleText");var k=o.selectAll(".legend").data(_.domain()).enter().append("g").attr("class","legend").attr("transform",(function(t,e){return"translate(216,"+(22*e-22*_.domain().length/2)+")"}));k.append("rect").attr("width",a).attr("height",a).style("fill",_).style("stroke",_),k.data(m).append("text").attr("x",22).attr("y",14).text((function(t){return r.db.getShowData()||y.showData||y.pie.showData?t.data.name+" ["+t.data.value+"]":t.data.name}))}catch(x){n.l.error("Error while rendering info diagram"),n.l.error(x)}}},styles:h}}}]);