(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3621ebdd"],{"047c":function(e,t,s){"use strict";var a=s("f577"),r=s.n(a);r.a},"07d5":function(e,t,s){"use strict";var a=s("ed8c"),r=s.n(a);r.a},3645:function(e,t,s){"use strict";var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"paper"},[s("div",[e._t("default")],2),s("div",{staticClass:"player-list"},e._l(e.players,(function(t,a){return s("div",[s("h3",{staticClass:"subtitle"},[s("span",{staticClass:"help"},[e._v(e._s(a+1)+". ")]),e._v(" "+e._s(t.name)+" ")])])})),0)])},r=[],i={name:"playerlist",props:{players:Array,fullHeight:{type:Boolean,default:!0}},data:function(){return{}}},n=i,l=(s("07d5"),s("2877")),c=Object(l["a"])(n,a,r,!1,null,"91b90886",null);t["a"]=c.exports},"417e":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"gameboard hero is-dark"},[s("div",{staticClass:"hero-body"},[s("div",[s("h3",{staticClass:"subtitle has-text-centered is-italic help fancy-subtitle drop-shadow has-text-weight-bold"},[e._v("game key")]),s("h3",{staticClass:"title is-1 has-text-centered fancy-title drop-shadow"},[e._v(e._s(e.gameKey))]),s("div",{staticClass:"is-centered has-text-centered fancy-subtitle drop-shadow"},[s("span",{staticClass:"subtitle has-text-weight-bold"},[e._v(e._s(e.players.length)+" / "+e._s(e.maxPlayers)+" players")])]),e.isHost?s("div",[s("br"),s("div",{staticClass:"buttons is-centered"},[s("button",{staticClass:"button is-success",attrs:{disabled:e.players.length<5},on:{click:e.startGame}},[e._v(" Begin Game ")])])]):e._e(),s("br"),s("player-list",{attrs:{players:e.players}}),s("br")],1)])])},r=[],i=(s("a4d3"),s("4de4"),s("4160"),s("e439"),s("dbb4"),s("b64b"),s("159b"),s("2fa7")),n=s("3645"),l=s("2f62");function c(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function o(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?c(s,!0).forEach((function(t){Object(i["a"])(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):c(s).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}var u={name:"Lobby",components:{PlayerList:n["a"]},created:function(){this.isHost||this.$socket.client.emit("request_game_state",{gameKey:this.gameKey})},data:function(){return{alignments:[[3,2],[4,2],[4,3],[5,3],[6,3],[6,4],[7,4],[7,5]],roles:[{name:"Knight",alignment:!0,required:!0,use:!0},{name:"Minion",alignment:!1,required:!0,use:!0}],specialRoles:[{name:"Merlin",alignment:!0,required:!0,use:!0}]}},watch:{inGame:function(e){e&&this.playGame()}},computed:o({},Object(l["d"])({minPlayers:function(e){var t=e.game;return t.minPlayers},maxPlayers:function(e){var t=e.game;return t.maxPlayers}}),{},Object(l["c"])(["gameKey","players","isHost","inGame"]),{assignments:function(){return this.alignments[6-this.minPlayers]}}),methods:{startGame:function(){var e=this;if(this.players.length>4){var t=JSON.parse(JSON.stringify(this.players)),s=JSON.parse(JSON.stringify(this.assignments));this.shuffle(t);var a=0;this.specialRoles.forEach((function(r,i){r.use&&(e.$set(t[i],"role",r),s[+!r.alignment]-=1,a++)}));for(var r=a;r<t.length;r++)this.$set(t[r],"role",r<=s[0]?this.roles[0]:this.roles[1]);this.shuffle(t),this.$socket.client.emit("begin_game",{gameKey:this.gameKey,players:t})}},playGame:function(){this.$router.push({name:"play",params:{gameKey:this.gameKey}})}}},p=u,h=(s("047c"),s("2877")),f=Object(h["a"])(p,a,r,!1,null,"79f38340",null);t["default"]=f.exports},ed8c:function(e,t,s){},f577:function(e,t,s){}}]);
//# sourceMappingURL=chunk-3621ebdd.984bcc57.js.map