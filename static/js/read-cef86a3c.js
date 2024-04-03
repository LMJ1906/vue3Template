/* empty css                  */import{f as e,i as l,j as a,c as s,g as n,w as o,k as t,l as u,m as c,v as i,a as p,r as v,n as d,h,q as r,s as m,o as y,e as f,F as g,t as S,x as _,y as V,_ as w}from"./index-3858c4bb.js";const b={class:"speech-page"},k={class:"speech-page-action-wrap"},x=w(e({__name:"read",setup(e){const w=l(null),x=l("notStarted"),C=l(!0),U=l([]),j=l({}),I=l(50),q=l("当我走进那片茂密的森林，我仿佛进入了一个神秘的世界。阳光透过树叶的缝隙洒在地面上，形成斑驳的光影。微风吹过，树叶发出沙沙的声音，仿佛在为我的到来欢呼。我深吸一口清新的空气，感受着大自然的气息。在这片森林中，我看到了各种各样的生物。小鸟在树枝上欢快地歌唱，蝴蝶在花丛中翩翩起舞。我静静地坐在一块石头上，观察着它们的生活。它们似乎不受外界的干扰，自由自在地生活着。我继续向前走去，穿过一片开满鲜花的草地。花朵散发出浓郁的芬芳，吸引着蜜蜂和蝴蝶前来采蜜。我弯下腰，仔细观察着每一朵花的细节，它们的颜色和形状各不相同，但都美丽动人。走过一片湖泊，我看到了一只孤独的天鹅在水中自由自在地游弋。它的白色羽毛在阳光下闪烁着光芒，宛如一颗明亮的明星。我停下脚步，静静地欣赏着它的优雅和自由。在这片森林中，我感受到了大自然的力量和美丽。它让我忘记了城市的喧嚣和压力，让我重新与自然相连。我决定将这份美好带回家，让它成为我生活中的一部分。因为在大自然中，我找到了内心的宁静和平衡。");function z(e){w.value=new SpeechSynthesisUtterance,w.value.onend=function(){x.value="complete",console.log("朗读结束")},w.value.onpause=function(){x.value="stop",console.log("朗读暂停")},w.value.onresume=function(){x.value="reading",console.log("朗读恢复")},w.value.onstart=function(){x.value="reading",console.log("朗读开始")},w.value.rate=1,w.value.volume=I.value/100,w.value.voice=j.value?j.value:speechSynthesis.getVoices()[0],w.value.text=e,speechSynthesis&&speechSynthesis.speak(w.value)}function A(){console.log("开始"),z(q.value)}function F(){console.log("暂停"),speechSynthesis&&speechSynthesis.pause()}function N(){console.log("继续"),speechSynthesis&&speechSynthesis.resume()}function P(){console.log("重放"),speechSynthesis&&speechSynthesis.cancel(),z(q.value)}return a((()=>{"speechSynthesis"in window?(C.value=!0,console.log("结束"),speechSynthesis&&speechSynthesis.cancel(),setTimeout((()=>{speechSynthesis&&(U.value=speechSynthesis.getVoices().filter((e=>"zh-CN"==e.lang)),j.value=U.value[0])}),10),console.log("浏览器支持Web Speech API")):C.value=!1})),(e,l)=>{const a=v("van-swipe-item"),w=v("van-swipe"),z=v("van-notice-bar"),T=d,W=h,B=V,D=r,E=m;return y(),s("div",b,[n(z,{"left-icon":"volume-o",scrollable:!1},{default:o((()=>[n(w,{vertical:"",class:"notice-swipe",autoplay:3e3,touchable:!1,"show-indicators":!1},{default:o((()=>[n(a,null,{default:o((()=>[f("明月直入，无心可猜。")])),_:1}),n(a,null,{default:o((()=>[f("仙人抚我顶，结发受长生。")])),_:1}),n(a,null,{default:o((()=>[f("今人不见古时月，今月曾经照古人。")])),_:1})])),_:1})])),_:1}),n(T,{modelValue:t(q),"onUpdate:modelValue":l[0]||(l[0]=e=>u(q)?q.value=e:null),rows:20,type:"textarea"},null,8,["modelValue"]),c(p("div",k,[c(n(W,{type:"primary",onClick:A},{default:o((()=>[f("开始")])),_:1},512),[[i,"notStarted"==t(x)||"complete"==t(x)]]),c(n(W,{type:"primary",onClick:F},{default:o((()=>[f("暂停")])),_:1},512),[[i,"reading"==t(x)]]),c(n(W,{type:"primary",onClick:N},{default:o((()=>[f("继续")])),_:1},512),[[i,"stop"==t(x)]]),n(W,{type:"primary",onClick:P},{default:o((()=>[f("重放")])),_:1}),n(D,{style:{"margin-left":"12px"},modelValue:t(j),"onUpdate:modelValue":l[1]||(l[1]=e=>u(j)?j.value=e:null),placeholder:"Select"},{default:o((()=>[(y(!0),s(g,null,S(t(U),(e=>(y(),_(B,{key:e.value,label:e.name,value:e},null,8,["label","value"])))),128))])),_:1},8,["modelValue"]),n(E,{modelValue:t(I),"onUpdate:modelValue":l[2]||(l[2]=e=>u(I)?I.value=e:null)},null,8,["modelValue"])],512),[[i,t(C)]])])}}}),[["__scopeId","data-v-0144d909"]]);export{x as default};