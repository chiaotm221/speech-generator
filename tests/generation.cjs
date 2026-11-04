const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('index.html','utf8'),code=html.match(/<script>([\s\S]*?)<\/script>/)[1];
function setup(chat=async()=> '各位同仁，學生有牛奶喝，重點在於照顧學生的飲食需求。'){
  const elements={};
  for(const [,id] of html.matchAll(/id="([^"]+)"/g))elements[id]={value:'',textContent:'',disabled:false,events:{},addEventListener(name,fn){this.events[name]=fn;},focus(){},classList:{toggle(){}}};
  for(const [id,value] of Object.entries({topic:'學生有牛奶喝',engine:'offline',style:'method',duration:'30',vague:'80',tone:'formal'}))elements[id].value=value;
  const ctx=vm.createContext({document:{getElementById:id=>elements[id]},window:{puter:{ai:{chat}}},navigator:{},console});
  vm.runInContext(code,ctx);return {elements,run:source=>vm.runInContext(source,ctx)};
}
(async()=>{
  const {elements,run}=setup();assert.equal(elements.output.textContent,'','Loading must not generate demo content');
  for(const [topic,expected] of [['學生有牛奶喝','營養'],['學生喝豆漿','營養'],['校園營養午餐','營養'],['學生遭遇校園暴力','安心'],['學生學習程式','支持'],['都市更新','安穩'],['月球上的咖啡','公平']]){
    const context=run(`context(${JSON.stringify(topic)})`);assert.equal(context.problem,topic);assert.ok(context.value.includes(expected),topic);
    for(const style of ['mixed','method','vision','debate','satire'])for(const seconds of [30,60,180]){
      const output=run(`offline(${JSON.stringify(topic)},${JSON.stringify(style)},${seconds},80,'formal')`);assert.ok(output.includes(topic));
      if(topic==='學生有牛奶喝')assert.doesNotMatch(output,/校園安全|暴力|通報|案件/);
    }
  }
  let prompt='';const llm=setup(async text=>{prompt=text;return '各位同仁，學生有牛奶喝，重點在於照顧學生的飲食需求。';});
  llm.elements.engine.value='online';await llm.run('generate()');assert.doesNotMatch(llm.elements.output.textContent,/各位同仁/);assert.match(prompt,/直接切入主題/);assert.match(prompt,/學生有牛奶喝/);assert.doesNotMatch(prompt,/通報後的即時保護/);
  llm.elements.engine.value='offline';llm.elements.engine.events.change({target:llm.elements.engine});assert.equal(llm.elements.topic.value,'學生有牛奶喝');assert.match(llm.elements.output.textContent,/學生有牛奶喝/);assert.doesNotMatch(llm.elements.output.textContent,/校園安全|通報/);
  for(const fail of [false,true]){
    let resolve,reject;const pending=new Promise((a,b)=>{resolve=a;reject=b;}),racing=setup(()=>pending);
    racing.elements.engine.value='online';const done=racing.run('generate()');await Promise.resolve();await Promise.resolve();
    racing.elements.topic.value='學生喝豆漿';racing.elements.topic.events.input();racing.elements.engine.value='offline';racing.elements.engine.events.change({target:racing.elements.engine});
    const output=racing.elements.output.textContent;if(fail)reject(new Error('late failure'));else resolve('過期的線上牛奶結果');await done;
    assert.equal(racing.elements.output.textContent,output,'Stale online completion must not overwrite offline output');assert.match(output,/學生喝豆漿/);
  }
  const failed=setup(async()=>{throw Error('network unavailable');});failed.elements.engine.value='online';await failed.run('generate()');assert.match(failed.elements.output.textContent,/學生有牛奶喝/);assert.match(failed.elements.status.textContent,/改用離線/);
  elements.topic.value='';await run('generate()');assert.match(elements.status.textContent,/請先輸入/);
  assert.equal(html,fs.readFileSync('Releases/V0.1.02/index.html','utf8'));
  console.log('PASS: topic matching, all styles/durations, salutation cleanup, engine switching, stale success/failure, fallback, empty input, release equality.');
})().catch(error=>{console.error(error);process.exitCode=1;});
