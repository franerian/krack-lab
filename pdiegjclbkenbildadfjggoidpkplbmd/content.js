const Hi={en:["Reading the image","Extracting visual style","Building your prompt"],zh:["正在读取图片","正在提取视觉风格","正在生成提示词"],ja:["画像を読み込み中","ビジュアルスタイルを抽出中","プロンプトを生成中"]},zi={en:{analysisImage:"Analyze image",analysisResult:"Prompt",apiSetupTitle:"Analysis setup",apiSetupDescription:"Fill in Base URL, API key, and model once. After saving, analysis will continue for the current image.",apiSetupBaseUrl:"Base URL",apiSetupApiKey:"API key",apiSetupModel:"Model",apiSetupSave:"Save and start analysis",apiSetupSaving:"Saving...",apiSetupBaseUrlPlaceholder:"https://api.openai.com/v1",apiSetupApiKeyPlaceholder:"sk-...",apiSetupModelPlaceholder:"gpt-4.1-mini / gemini-2.5-flash / qwen-vl-max",retry:"Regenerate",openSettings:"Open settings",copy:"Copy",copied:"Copied",copyAndOpenPrefix:"Copy and open",openingGenerator:"Opening...",chooseGeneratorSite:"Choose generator",generatorCopiedToastPrefix:"Prompt copied and opened in ",generatorFallbackToastSuffix:", if the page does not autofill, just paste it manually.",generatorReadyToastSuffix:" prompt inserted. You can send it now.",generatorOpenError:"Could not open the generator site. Please try again.",openAction:"Open",promptAction:"Prompt",promptLoading:"Analyzing",saveAction:"Save",saveLoading:"Saving",saveDone:"Saved",saveRetry:"Retry save",saveSuccessToast:"Added to history",minimizePanel:"Collapse",expandPanel:"Expand",inlineActionsTitle:"Overlay and analysis",inlineActionsOn:"Hide floating menu",inlineActionsOff:"Show floating menu",closeSharedPanel:"Close panel",actionMenuLabel:"Image quick actions",history:"History",historyLabel:"History",deleteHistory:"Delete this history item",clearAllHistory:"Clear",resetCurrentPrompt:"Reset prompt",loadLocalImage:"Load local image",localImageUnsupported:"Only JPG, PNG, WebP, and GIF images are supported.",localImageTooLarge:"Images must be 10MB or smaller.",localImageSkipped:"Some files were skipped.",localImageLimitReached:"Only the first 10 images will be analyzed.",closeHistory:"Close history",emptyHistory:"No history yet",savingHistory:"Analyzing",failedHistory:"Failed",missingLatestAnalysis:"There is no latest analysis to open yet. Run one analysis first.",missingImage:"No usable image URL was found. Right-click a normal webpage image and try again."},zh:{analysisImage:"分析图片",analysisResult:"分析结果",apiSetupTitle:"分析设置",apiSetupDescription:"在卡片里填写 Base URL、API Key 和 Model。保存后会继续分析当前图片。",apiSetupBaseUrl:"Base URL",apiSetupApiKey:"API Key",apiSetupModel:"Model",apiSetupSave:"保存并开始分析",apiSetupSaving:"保存中...",apiSetupBaseUrlPlaceholder:"https://api.openai.com/v1",apiSetupApiKeyPlaceholder:"sk-...",apiSetupModelPlaceholder:"gpt-4.1-mini / gemini-2.5-flash / qwen-vl-max",retry:"重新生成",openSettings:"打开设置",copy:"复制",copied:"已复制",copyAndOpenPrefix:"复制并打开",openingGenerator:"打开中...",chooseGeneratorSite:"选择生成站点",generatorCopiedToastPrefix:"提示词已复制并在 ",generatorFallbackToastSuffix:" 打开，如未自动填入，请手动粘贴。",generatorReadyToastSuffix:" 的提示词已填入，你现在可以直接发送。",generatorOpenError:"无法打开生成站点，请稍后重试。",openAction:"打开",promptAction:"提示词",promptLoading:"分析中",saveAction:"保存",saveLoading:"保存中",saveDone:"已保存",saveRetry:"重试保存",saveSuccessToast:"已加入历史记录",minimizePanel:"收起",expandPanel:"展开",inlineActionsTitle:"悬浮与分析",inlineActionsOn:"隐藏悬浮菜单",inlineActionsOff:"显示悬浮菜单",closeSharedPanel:"关闭面板",actionMenuLabel:"图片快捷操作",history:"历史",historyLabel:"历史",deleteHistory:"删除这条历史记录",clearAllHistory:"清空",resetCurrentPrompt:"重置提示词",loadLocalImage:"加载本地图片",localImageUnsupported:"仅支持 JPG、PNG、WebP 和 GIF 图片。",localImageTooLarge:"图片大小不能超过 10MB。",localImageSkipped:"已跳过部分文件。",localImageLimitReached:"一次最多分析前 10 张图片。",closeHistory:"关闭历史",emptyHistory:"暂无历史记录",savingHistory:"分析中",failedHistory:"失败",missingLatestAnalysis:"还没有可打开的最近分析，请先运行一次分析。",missingImage:"没有拿到可用图片地址，请右键普通网页图片后再试一次。"},ja:{analysisImage:"画像を分析",analysisResult:"分析結果",apiSetupTitle:"分析設定",apiSetupDescription:"カード内に Base URL、API Key、Model を入力してください。保存後、この画像の分析を続けます。",apiSetupBaseUrl:"Base URL",apiSetupApiKey:"API Key",apiSetupModel:"Model",apiSetupSave:"保存して分析を開始",apiSetupSaving:"保存中...",apiSetupBaseUrlPlaceholder:"https://api.openai.com/v1",apiSetupApiKeyPlaceholder:"sk-...",apiSetupModelPlaceholder:"gpt-4.1-mini / gemini-2.5-flash / qwen-vl-max",retry:"再生成",openSettings:"設定を開く",copy:"コピー",copied:"コピー済み",copyAndOpenPrefix:"コピーして開く",openingGenerator:"開いています...",chooseGeneratorSite:"生成サイトを選択",generatorCopiedToastPrefix:"プロンプトをコピーして ",generatorFallbackToastSuffix:" を開きました。自動入力されない場合は手動で貼り付けてください。",generatorReadyToastSuffix:" のプロンプト入力が完了しました。送信できます。",generatorOpenError:"生成サイトを開けませんでした。後でもう一度お試しください。",openAction:"開く",promptAction:"プロンプト",promptLoading:"分析中",saveAction:"保存",saveLoading:"保存中",saveDone:"保存済み",saveRetry:"保存を再試行",saveSuccessToast:"履歴に追加しました",minimizePanel:"折りたたむ",expandPanel:"展開",inlineActionsTitle:"オーバーレイと分析",inlineActionsOn:"フローティングメニューを隠す",inlineActionsOff:"フローティングメニューを表示",closeSharedPanel:"パネルを閉じる",actionMenuLabel:"画像クイックアクション",history:"履歴",historyLabel:"履歴",deleteHistory:"この履歴を削除",clearAllHistory:"すべて削除",resetCurrentPrompt:"リセット",loadLocalImage:"ローカル画像を読み込む",localImageUnsupported:"JPG、PNG、WebP、GIF 画像のみ対応しています。",localImageTooLarge:"画像は 10MB 以下にしてください。",localImageSkipped:"一部のファイルをスキップしました。",localImageLimitReached:"一度に分析できるのは最初の 10 枚までです。",closeHistory:"履歴を閉じる",emptyHistory:"履歴はまだありません",savingHistory:"分析中",failedHistory:"失敗",missingLatestAnalysis:"まだ開ける最新分析がありません。先に 1 回分析してください。",missingImage:"使える画像 URL が見つかりませんでした。通常の画像を右クリックしてもう一度お試しください。"}},Ul="PromptCard - v1.3.2",$r=!!"https://swlpidccgyzvkuvghlac.supabase.co/functions/v1".trim(),Bl=900,Wl=920,Nl=520;function $i(Se){return Se==="en"?["en","zh","json"]:[Se,"en","json"]}function ql(Se){switch(Se){case"zh":return"中";case"ja":return"JP";case"json":return"J";case"en":default:return"EN"}}(()=>{const Se=globalThis;if(Se.__imagetopromptV2Loaded__)return;Se.__imagetopromptV2Loaded__=!0;const ft=window.top===window.self;class Bt extends Error{code;action;constructor(t,a={}){super(t),this.name="ContentRuntimeError",this.code=a.code??null,this.action=a.action??null}}let A="en",Wt=Hi[A],u=zi[A],$a=null;const Ra=350,ja=520,Da=296,Pe=20,Rr=198,Ri=12,ji=10,jr=180,Oa=Rr-32,Dr=78,Di=292,mt="defaultGeneratorSite",Ne="sharedPanelSession",ht="inlinePromptOnboardingComplete",Oi=["baseUrl","apiKey","model"],Fi=10,_i=10*1024*1024,Yi=960,Ui=.82,Bi=new Set(["image/jpeg","image/png","image/webp","image/gif"]),Or=["jimeng","gemini","midjourney","lovart"],Fr=[220,700,1500,2600,4200,6200,8600],qe={jimeng:{id:"jimeng",label:"Jimeng",shortLabel:"Jimeng",url:"https://jimeng.jianying.com/",logoUrl:"",badgeText:"JM",accentClass:"is-jimeng",matchHost:e=>/jimeng.jianying.com$/i.test(e),promptSelectors:["textarea","div[contenteditable='true']","input[type='text']"],sendSelectors:["button[type='submit']",".semi-button-primary",".byted-btn-primary","button[data-testid*='send']"]},gemini:{id:"gemini",label:"Gemini",shortLabel:"Gemini",url:"https://gemini.google.com/app",logoUrl:"",badgeText:"G",accentClass:"is-gemini",matchHost:e=>/gemini.google.com$/i.test(e),promptSelectors:["rich-textarea .ql-editor","div[contenteditable='true'][role='textbox']","textarea"],sendSelectors:["button[aria-label*='Send' i]","button[type='submit']","button[data-testid*='send']"]},midjourney:{id:"midjourney",label:"Midjourney",shortLabel:"Midjourney",url:"https://www.midjourney.com/imagine",logoUrl:"",badgeText:"MJ",accentClass:"is-midjourney",matchHost:e=>/midjourney.com$/i.test(e),promptSelectors:["textarea","div[contenteditable='true']","input[type='text']"],sendSelectors:["button[type='submit']","button[aria-label*='Send' i]","button[data-testid*='send']"]},lovart:{id:"lovart",label:"Lovart",shortLabel:"Lovart",url:"https://www.lovart.ai/",logoUrl:"",badgeText:"L",accentClass:"is-lovart",matchHost:e=>/(^|.)lovart.ai$/i.test(e),promptSelectors:["textarea","div[contenteditable='true']","input[type='text']"],sendSelectors:["button[type='submit']","button[aria-label*='Send' i]","button[data-testid*='send']"],uploadSelectors:["input[type='file'][accept*='image' i]","input[type='file']","button[aria-label*='upload' i]","button[aria-label*='image' i]","button[aria-label*='attach' i]","button[title*='upload' i]","button[title*='image' i]","button[title*='attach' i]"]}};function Wi(e){return e==="zh"||e==="ja"||e==="en"?e:"en"}function _r(){const e=[],t=typeof chrome<"u"&&chrome.i18n?.getUILanguage?chrome.i18n.getUILanguage():"";t&&e.push(t),Array.isArray(navigator.languages)&&e.push(...navigator.languages),navigator.language&&e.push(navigator.language);for(const a of e){const r=a.toLowerCase();if(r.startsWith("zh"))return"zh";if(r.startsWith("ja")||r.startsWith("jp"))return"ja"}return"en"}function Fa(e){if(A=e,Wt=Hi[e],u=zi[e],l.language=e,l.analysis&&!Ln()){const t=dt(l.analysis,l.language);ae=t,le=t,Z=!1}l.errorCode==="AUTH_REQUIRED"&&(l.error=Fn(),l.errorAction?.type==="open-account"&&(l.errorAction={...l.errorAction,label:br()})),l.status!=="hidden"&&f&&b()}async function Ni(){try{const e=await chrome.storage.sync.get(["systemLanguage","defaultLanguage"]),t=e.systemLanguage??e.defaultLanguage;Fa(t==="zh"||t==="ja"||t==="en"?t:_r())}catch{Fa(_r())}}function Yr(){return $a||($a=Ni()),$a}let J=document.getElementById("imagetoprompt-root"),Ge=null,f=null,Q=null,se=null,Ae=null,_=null,Nt=!1,l={status:"hidden",language:A,analysis:null,error:"",errorCode:null,errorAction:null,copied:!1},fe=null,N=0,_a=!1,Xe=null,Y={element:null,target:null,point:null},q=null,T=null,R=null,Te=0,H=null,qt=null,Ya={x:0,y:0},bt=null,Ua=!1,Ur=0,D=12,G=null,ke=null,Ba=null,yt=null,Ee=null,le="",ae="",Ie={},Z=!1,Gt=!1,xt=null,wt=null,Xt=!1,C=[],Ve=null,Vt=!1,E=!1,Ke=!1,vt=null,Je=!1,Qe=null,P=[],O=null,Kt=new Set,Wa=null,w=null,Ze=0,Le=null,St=null,et=null,Br=null,Na=!1;const Pt=new Map,tt=new Map;let at=0,Jt=0,Ce=null,At=null,ce=null,re=null,me=null,de=!1,Qt=null,Me=null,He=null,Zt="",Wr=0,ne=!0,X=!0,v="hidden",rt=null,nt=!1,ze="jimeng",ea=!1,Tt=!1,he=!1,$e="idle",Nr=0,it=null,ta=null,kt=[],Et=null,B=null,qa=!1,It=0;const qi=[/(^|\.)checkout\.link\.com$/i,/(^|\.)checkout\.stripe\.com$/i,/(^|\.)buy\.stripe\.com$/i,/(^|\.)billing\.stripe\.com$/i,/(^|\.)pay\.stripe\.com$/i,/(^|\.)link\.com$/i],Gi=[/(^|\.)accounts\.google\.com$/i,/(^|\.)oauth\.googleusercontent\.com$/i];let z={baseUrl:"",apiKey:"",model:"",error:"",isSaving:!1},aa=null;const qr=new Map,Xi=`
  :host {
    all: initial;
    position: fixed !important;
    inset: 0 !important;
    width: var(--imagetoprompt-vw, 100vw) !important;
    height: var(--imagetoprompt-vh, 100vh) !important;
    display: block !important;
    overflow: visible !important;
    z-index: 2147483646 !important;
    pointer-events: none !important;
    font-size: 16px !important;
    line-height: normal !important;
    direction: ltr !important;
    unicode-bidi: isolate !important;
    transform: none !important;
    zoom: 1 !important;
    contain: layout style size !important;
  }

  .overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2147483646;
    font-family: "SF Pro Display", "SF Pro Text", "Segoe UI Variable", sans-serif;
  }

  .image-action-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .image-action-toast-layer {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    font-family: "SF Pro Display", "SF Pro Text", "Segoe UI Variable", sans-serif;
  }

  .screenshot-selection-layer {
    position: fixed;
    inset: 0;
    display: none;
    pointer-events: none;
    z-index: 2147483647;
    font-family: "SF Pro Display", "SF Pro Text", "Segoe UI Variable", sans-serif;
  }

  .screenshot-selection-layer.is-active {
    display: block;
    pointer-events: auto;
  }

  .screenshot-selection-layer.is-capture-shield {
    display: block;
    opacity: 0;
    pointer-events: auto;
  }

  .screenshot-capture-hover-shield {
    position: absolute;
    inset: 0;
    pointer-events: auto;
    background: transparent;
    cursor: default;
  }

  .screenshot-selection-backdrop {
    position: absolute;
    inset: 0;
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: crosshair;
    user-select: none;
    -webkit-user-select: none;
    isolation: isolate;
  }

  .screenshot-selection-backdrop::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(6, 8, 12, 0.28);
    pointer-events: none;
    z-index: 0;
  }

  .screenshot-selection-box {
    position: absolute;
    z-index: 1;
    box-sizing: border-box;
    display: none;
    border: 1.5px solid rgba(255, 111, 18, 0.96);
    border-radius: 8px;
    background: rgba(255, 111, 18, 0.08);
    box-shadow:
      0 0 0 9999px rgba(6, 8, 12, 0.46),
      0 0 0 1px rgba(255, 255, 255, 0.44),
      0 16px 36px rgba(0, 0, 0, 0.24),
      0 0 28px rgba(255, 111, 18, 0.28);
    pointer-events: none;
  }

  .screenshot-selection-box.is-visible {
    display: block;
  }

  .screenshot-selection-actions {
    position: absolute;
    z-index: 3;
    display: none;
    align-items: center;
    gap: 8px;
    transform: translateX(-50%);
    padding: 0;
    border-radius: 999px;
    border: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    pointer-events: auto;
  }

  .screenshot-selection-actions.is-visible {
    display: inline-flex;
  }

  .screenshot-selection-action {
    all: unset;
    min-width: 58px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    border: 1px solid rgba(248, 252, 255, 0.38);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.36), rgba(255, 255, 255, 0.16)),
      rgba(238, 244, 252, 0.18);
    color: rgba(255, 255, 255, 0.98);
    font-size: 12px;
    font-weight: 720;
    letter-spacing: 0.01em;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    box-shadow:
      0 10px 26px rgba(0, 0, 0, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.42),
      inset 0 -1px 0 rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(18px) saturate(1.08);
    -webkit-backdrop-filter: blur(18px) saturate(1.08);
  }

  .screenshot-selection-action.is-primary {
    border-color: rgba(255, 128, 34, 0.58);
    background:
      linear-gradient(180deg, rgba(255, 141, 48, 1), rgba(255, 102, 8, 0.98)),
      rgba(255, 111, 18, 0.98);
    color: rgba(255, 255, 255, 0.98);
    box-shadow:
      0 12px 28px rgba(255, 111, 18, 0.26),
      inset 0 1px 0 rgba(255, 220, 190, 0.36),
      inset 0 -1px 0 rgba(130, 45, 0, 0.14);
  }

  .screenshot-selection-action:hover {
    transform: translateY(-1px);
    border-color: rgba(238, 244, 255, 0.28);
  }

  .screenshot-selection-hint {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 18px;
    transform: translateX(-50%);
    padding: 9px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background:
      linear-gradient(180deg, rgba(26, 29, 36, 0.84), rgba(10, 12, 18, 0.72)),
      rgba(0, 0, 0, 0.18);
    box-shadow:
      0 14px 30px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
    color: rgba(248, 251, 255, 0.96);
    font-size: 12px;
    font-weight: 650;
    letter-spacing: 0.02em;
    pointer-events: none;
    white-space: nowrap;
  }

  .screenshot-selection-cancel {
    all: unset;
    position: absolute;
    z-index: 3;
    right: 18px;
    top: 18px;
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: rgba(20, 24, 32, 0.74);
    color: rgba(248, 251, 255, 0.94);
    cursor: pointer;
    box-shadow:
      0 12px 28px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(18px) saturate(1.06);
    -webkit-backdrop-filter: blur(18px) saturate(1.06);
  }

  .screenshot-selection-cancel:hover {
    border-color: rgba(255, 111, 18, 0.5);
    color: rgba(255, 126, 34, 0.98);
  }

  .image-action-menu {
    --image-action-scale: 1;
    position: fixed;
    min-width: calc(74px * var(--image-action-scale));
    display: inline-flex;
    flex-direction: column;
    gap: calc(5px * var(--image-action-scale));
    padding: 0;
    border-radius: calc(16px * var(--image-action-scale));
    border: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    pointer-events: auto;
    transform-origin: top right;
    animation: imageActionMenuIn 0.18s cubic-bezier(0.22, 0.82, 0.2, 1) both;
  }

  .image-action-button {
    all: unset;
    position: relative;
    min-width: calc(64px * var(--image-action-scale));
    height: calc(28px * var(--image-action-scale));
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 calc(10px * var(--image-action-scale));
    border-radius: 999px;
    border: 1px solid rgba(239, 246, 255, 0.36);
    background:
      linear-gradient(180deg, rgba(18, 22, 30, 0.36), rgba(4, 7, 12, 0.45)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.124), rgba(255, 255, 255, 0.034));
    box-shadow:
      0 10px 22px rgba(0, 0, 0, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.34),
      inset 0 -1px 0 rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(22px) saturate(1.18) contrast(1.04);
    -webkit-backdrop-filter: blur(22px) saturate(1.18) contrast(1.04);
    color: rgba(247, 250, 255, 0.96);
    font-size: calc(11px * var(--image-action-scale));
    font-weight: 580;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease,
    color 0.18s ease,
      opacity 0.18s ease;
    overflow: hidden;
  }

  .image-action-button:hover {
    transform: translateY(-1px) scale(1.01);
    border-color: rgba(248, 251, 255, 0.46);
    background:
      linear-gradient(180deg, rgba(22, 26, 34, 0.38), rgba(5, 8, 14, 0.47)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.045));
  }

  .image-action-button[data-inline-action="prompt"]:hover {
    border-color: rgba(255, 111, 18, 0.42);
    color: rgba(255, 126, 34, 0.98);
  }

  .image-action-button:focus,
  .image-action-button:focus-visible,
  .image-action-button:active {
    outline: none;
  }

  .image-action-button.is-disabled {
    opacity: 0.68;
    cursor: progress;
    transform: none;
  }

  .image-action-button.is-success {
    border-color: rgba(214, 255, 230, 0.24);
    background:
      linear-gradient(180deg, rgba(169, 255, 205, 0.14), rgba(105, 220, 155, 0.06)),
      rgba(114, 235, 168, 0.08);
    color: rgba(235, 255, 242, 0.98);
  }

  .image-action-button.is-error {
    border-color: rgba(255, 217, 217, 0.24);
    background:
      linear-gradient(180deg, rgba(255, 177, 177, 0.14), rgba(255, 127, 127, 0.06)),
      rgba(255, 133, 133, 0.08);
  }

  .image-action-toast {
    position: fixed;
    right: 18px;
    bottom: 18px;
    max-width: min(320px, calc(var(--imagetoprompt-vw, 100vw) - 28px));
    padding: 12px 14px;
    border-radius: 18px;
    border: 1px solid rgba(239, 246, 255, 0.18);
    background:
      linear-gradient(180deg, rgba(28, 31, 39, 0.84), rgba(10, 13, 20, 0.72)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04));
    box-shadow:
      0 18px 34px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
    color: rgba(247, 250, 255, 0.96);
    font-size: 12px;
    line-height: 1.5;
    pointer-events: none;
    animation: imageActionToastIn 0.22s cubic-bezier(0.22, 0.82, 0.2, 1) both;
  }

  .image-action-toast.is-error {
    border-color: rgba(255, 205, 205, 0.22);
    color: rgba(255, 240, 240, 0.96);
  }

  .panel-shell {
    position: fixed;
    display: inline-flex;
    width: max-content;
    max-width: calc(var(--imagetoprompt-vw, 100vw) - 24px);
    align-items: flex-start;
    gap: ${Ri}px;
    pointer-events: none;
  }

  .panel {
    position: relative;
    --panel-ui-scale: 1;
    width: min(${Ra}px, calc(var(--imagetoprompt-vw, 100vw) - 24px));
    min-width: min(${Ra}px, calc(var(--imagetoprompt-vw, 100vw) - 24px));
    flex: 0 0 auto;
    max-height: min(82vh, 680px);
    display: flex;
    overflow: visible;
    isolation: isolate;
    pointer-events: auto;
    color: rgba(247, 250, 255, 0.96);
    border-radius: calc(30px * var(--panel-ui-scale));
    border: 1px solid rgba(239, 246, 255, 0.38);
    background:
      linear-gradient(180deg, rgba(18, 22, 30, 0.38), rgba(4, 7, 12, 0.47)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.136), rgba(255, 255, 255, 0.036));
    box-shadow:
      0 26px 62px rgba(0, 0, 0, 0.21),
      0 11px 26px rgba(0, 0, 0, 0.13),
      inset 0 1px 0 rgba(255, 255, 255, 0.43),
      inset 0 -1px 0 rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(22px) saturate(1.2) contrast(1.04);
    -webkit-backdrop-filter: blur(22px) saturate(1.2) contrast(1.04);
  }

  .panel.dragging {
    transition: none !important;
    user-select: none;
    -webkit-user-select: none;
  }

  .panel.is-minimized {
    width: auto;
    min-width: 0;
    max-width: calc(var(--imagetoprompt-vw, 100vw) - 24px);
  }

  .panel.mode-expand {
    animation: panelModeExpand 0.28s cubic-bezier(0.17, 0.84, 0.22, 1) both;
    transform-origin: center top;
    will-change: transform, clip-path, opacity, border-radius, filter;
  }

  .panel.mode-expand .panel-inner {
    animation: panelModeContentReveal 0.18s cubic-bezier(0.2, 0.82, 0.22, 1) both;
    transform-origin: top center;
    will-change: transform, opacity, filter;
  }

  .panel.is-minimized.mode-collapse {
    animation: panelModeCollapse 0.16s cubic-bezier(0.2, 0.86, 0.22, 1) both;
    transform-origin: center center;
    will-change: transform, clip-path, opacity;
  }

  .panel.mode-exit-collapse {
    animation: panelModeExit 0.1s cubic-bezier(0.4, 0, 0.2, 1) both;
    transform-origin: center top;
    pointer-events: none;
    will-change: transform, clip-path, opacity;
  }

  .panel.mode-exit-expand {
    animation: none;
    transform-origin: center center;
    pointer-events: none;
    will-change: transform, opacity, filter, border-radius;
  }

  .panel::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: calc(29px * var(--panel-ui-scale));
    background: transparent;
    pointer-events: none;
  }

  .panel::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      repeating-linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.018) 0,
        rgba(255, 255, 255, 0.018) 1px,
        transparent 1px,
        transparent 3px
      ),
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.012) 0,
        rgba(255, 255, 255, 0.012) 1px,
        transparent 1px,
        transparent 4px
      );
    opacity: 0.16;
    pointer-events: none;
  }

  .panel.dragging .header {
    cursor: grabbing;
  }

  .ring-glow {
    position: absolute;
    inset: -10px;
    padding: 2px;
    border-radius: 38px;
    pointer-events: none;
    opacity: 0;
    z-index: 0;
    background:
      conic-gradient(
        from 180deg,
        transparent 0deg,
        transparent 52deg,
        rgba(255, 255, 255, 0.05) 74deg,
        rgba(255, 255, 255, 0.78) 92deg,
        rgba(255, 255, 255, 0.22) 108deg,
        transparent 138deg,
        transparent 360deg
      );
    filter: blur(9px);
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask-composite: exclude;
  }

  .ring-glow::before {
    content: "";
    position: absolute;
    inset: 9px;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    opacity: 0.65;
  }

  .panel.loading-glow .ring-glow {
    opacity: 0;
    animation: none;
  }

  .panel.copy-glow .ring-glow {
    opacity: 1;
    animation: borderOrbitBurst 1.05s cubic-bezier(0.2, 0.78, 0.18, 1) both;
  }

  .panel.is-local-image-dragover {
    border-color: rgba(255, 128, 34, 0.72);
    box-shadow:
      0 28px 68px rgba(0, 0, 0, 0.24),
      0 0 42px rgba(255, 111, 18, 0.16),
      0 0 0 1px rgba(255, 170, 104, 0.18),
      inset 0 1px 0 rgba(255, 235, 214, 0.5),
      inset 0 -1px 0 rgba(255, 111, 18, 0.12);
    animation: localImageDragNudge 1.35s cubic-bezier(0.18, 0.86, 0.24, 1) infinite;
    transform-origin: center center;
    will-change: transform;
  }

  .panel.is-local-image-dragover::before {
    background:
      radial-gradient(circle at 50% 0%, rgba(255, 142, 52, 0.12), transparent 58%),
      rgba(255, 111, 18, 0.035);
  }

  .panel.is-local-image-dragover .ring-glow {
    opacity: 0;
    animation: none;
  }

  .glass-pill {
    display: none;
  }

  .panel-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 0;
    max-height: min(82vh, 680px);
    padding: 22px;
    text-shadow: 0 1px 10px rgba(0, 0, 0, 0.1);
  }

  .header {
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: calc(12px * var(--panel-ui-scale));
    margin-bottom: calc(8px * var(--panel-ui-scale));
    min-height: calc(96px * var(--panel-ui-scale));
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
  }

  .panel.is-auth-required .header {
    min-height: calc(74px * var(--panel-ui-scale));
    margin-bottom: calc(6px * var(--panel-ui-scale));
  }

  .header.is-loading {
    min-height: calc(82px * var(--panel-ui-scale));
    margin-bottom: calc(6px * var(--panel-ui-scale));
  }

  .header.is-loading .header-copy {
    padding-right: calc(44px * var(--panel-ui-scale));
  }

  .header-copy {
    flex: 1 1 auto;
    min-width: 0;
    padding-top: 0;
    padding-right: calc(88px * var(--panel-ui-scale));
  }

  .title-row {
    display: flex;
    align-items: flex-start;
    position: relative;
    justify-content: flex-start;
    min-height: calc(28px * var(--panel-ui-scale));
    padding-right: calc(92px * var(--panel-ui-scale));
    margin-top: calc(17px * var(--panel-ui-scale));
  }

  .title-stack {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: calc(3px * var(--panel-ui-scale));
    min-width: 0;
  }

  .title-shot-button {
    appearance: none;
    -webkit-appearance: none;
    border: 0;
    padding: 0;
    margin: 0;
    background: transparent;
    color: inherit;
    font-family: inherit;
    text-align: left;
    cursor: pointer;
    pointer-events: auto;
  }

  .title-screenshot-notice {
    box-sizing: border-box;
    position: relative;
    top: calc(-1px * var(--panel-ui-scale));
    min-width: calc(52px * var(--panel-ui-scale));
    height: calc(15px * var(--panel-ui-scale));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 calc(6px * var(--panel-ui-scale));
    border-radius: 999px;
    border: 1px solid rgba(255, 139, 45, 0.64);
    background:
      linear-gradient(180deg, rgba(255, 134, 45, 0.34), rgba(255, 95, 12, 0.22)),
      rgba(255, 111, 18, 0.12);
    color: rgba(255, 244, 236, 0.92);
    font-size: calc(8px * var(--panel-ui-scale));
    font-weight: 780;
    line-height: 1;
    letter-spacing: 0;
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
    transition:
      border-color 0.18s ease,
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.18s ease;
  }

  .title-shot-button:hover .title-screenshot-notice {
    border-color: rgba(255, 111, 18, 0.96);
    background:
      linear-gradient(180deg, rgba(255, 134, 45, 0.72), rgba(255, 95, 12, 0.44)),
      rgba(255, 111, 18, 0.2);
    color: #fff7ef;
    box-shadow:
      0 0 0 1px rgba(255, 111, 18, 0.12),
      0 calc(4px * var(--panel-ui-scale)) calc(14px * var(--panel-ui-scale)) rgba(255, 111, 18, 0.24);
    transform: translateY(calc(-1px * var(--panel-ui-scale)));
  }

  .title-controls {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    margin-top: calc(8px * var(--panel-ui-scale));
    margin-left: calc(-4px * var(--panel-ui-scale));
  }

  .usage-pill {
    position: absolute;
    top: 50%;
    right: calc(-13px * var(--panel-ui-scale));
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: calc(28px * var(--panel-ui-scale));
    min-width: calc(68px * var(--panel-ui-scale));
    max-width: calc(84px * var(--panel-ui-scale));
    padding: calc(5px * var(--panel-ui-scale)) calc(10px * var(--panel-ui-scale));
    border: 1px solid rgba(238, 244, 255, 0.12);
    border-radius: calc(12px * var(--panel-ui-scale));
    background: rgba(255, 255, 255, 0.012);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .title-row.has-screenshot-notice .usage-pill {
    top: calc(31px * var(--panel-ui-scale));
  }

  .usage-pill.is-guest,
  .usage-pill.is-free,
  .usage-pill.is-pro {
    border-color: rgba(238, 244, 255, 0.12);
    background: rgba(255, 255, 255, 0.012);
  }

  .usage-pill-text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: calc(14px * var(--panel-ui-scale));
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.01em;
    color: rgba(248, 251, 255, 0.94);
    text-shadow: none;
    font-variant-numeric: tabular-nums;
    transition: color 0.18s ease, text-shadow 0.18s ease, transform 0.18s ease;
  }

  .usage-pill.is-rolling .usage-pill-text {
    color: #ff7a1a;
    text-shadow: 0 0 calc(16px * var(--panel-ui-scale)) rgba(255, 111, 18, 0.35);
    transform: translateY(calc(-1px * var(--panel-ui-scale)));
  }

  .header-actions {
    position: absolute;
    top: calc(-4px * var(--panel-ui-scale));
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: calc(10px * var(--panel-ui-scale));
    flex-shrink: 0;
  }

  .header-top-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: calc(8px * var(--panel-ui-scale));
  }

  .header-secondary-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: calc(8px * var(--panel-ui-scale));
  }

  .header.is-loading .header-actions {
    top: calc(-8px * var(--panel-ui-scale));
    right: calc(7px * var(--panel-ui-scale));
  }

  .panel.is-system-zh .header.is-loading .header-actions,
  .panel.is-system-ja .header.is-loading .header-actions {
    right: calc(-4px * var(--panel-ui-scale));
  }

  .header.is-loading .title {
    transform: translateY(calc(1px * var(--panel-ui-scale)));
  }

  .header.is-loading .close-button {
    width: calc(42px * var(--panel-ui-scale));
    min-width: calc(42px * var(--panel-ui-scale));
    height: calc(42px * var(--panel-ui-scale));
  }

  .eyebrow {
    font-size: calc(14px * var(--panel-ui-scale));
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(240, 247, 255, 0.74);
  }

  .title {
    position: relative;
    min-width: 0;
    white-space: nowrap;
    font-size: calc(28px * var(--panel-ui-scale));
    font-weight: 680;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  .title.title-button {
    font-size: calc(31px * var(--panel-ui-scale));
    font-weight: 740;
    letter-spacing: -0.02em;
    line-height: 1;
    transform: translateY(calc(20px * var(--panel-ui-scale)));
  }

  .title-shot-button:focus,
  .title-shot-button:focus-visible,
  .title-shot-button:active,
  .title-button:focus,
  .title-button:focus-visible,
  .title-button:active {
    outline: none;
    box-shadow: none;
  }

  .close-button {
    width: calc(40px * var(--panel-ui-scale));
    min-width: calc(40px * var(--panel-ui-scale));
    height: calc(40px * var(--panel-ui-scale));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 1px solid rgba(238, 244, 255, 0.12);
    border-radius: calc(12px * var(--panel-ui-scale));
    color: rgba(248, 251, 255, 0.92);
    background: rgba(255, 255, 255, 0.012);
    box-shadow: none;
    cursor: pointer;
    flex-shrink: 0;
    font-size: calc(16px * var(--panel-ui-scale));
    line-height: 1;
    text-shadow: none;
  }

  .close-button svg,
  .share-button svg,
  .screenshot-button svg,
  .minimized-icon-button svg {
    width: 15px;
    height: 15px;
    display: block;
    flex-shrink: 0;
    pointer-events: none;
  }

  .share-button svg {
    width: 18px;
    height: 18px;
  }

  .close-button[data-action="minimize-panel"] svg,
  .screenshot-button svg {
    width: calc(16px * var(--panel-ui-scale));
    height: calc(16px * var(--panel-ui-scale));
  }

  .close-button:hover,
  .share-button:hover,
  .screenshot-button:hover {
    color: rgba(255, 255, 255, 0.98);
    border-color: rgba(238, 244, 255, 0.22);
    background: rgba(255, 255, 255, 0.1);
  }

  .close-button[data-action="minimize-panel"] svg {
    transform-origin: 50% 50%;
  }

  .close-button[data-action="minimize-panel"]:hover svg {
    animation: minimizeButtonIconHop 0.42s cubic-bezier(0.2, 0.82, 0.2, 1) both;
  }

  .share-button,
  .screenshot-button {
    width: calc(40px * var(--panel-ui-scale));
    min-width: calc(40px * var(--panel-ui-scale));
    height: calc(40px * var(--panel-ui-scale));
  }

  .local-upload-button svg {
    transform-origin: 50% 50%;
    transition: transform 0.28s cubic-bezier(0.22, 0.8, 0.2, 1);
  }

  .local-upload-button:hover svg {
    transform: rotate(90deg);
  }

  .screenshot-button {
    color: #fff7ef;
    border-color: rgba(255, 111, 18, 0.56);
    background:
      linear-gradient(180deg, rgba(255, 126, 32, 0.34), rgba(255, 95, 12, 0.18)),
      rgba(255, 111, 18, 0.1);
    box-shadow:
      0 0 0 1px rgba(255, 111, 18, 0.12),
      0 calc(8px * var(--panel-ui-scale)) calc(18px * var(--panel-ui-scale)) rgba(255, 111, 18, 0.18);
  }

  .screenshot-button:hover {
    border-color: rgba(255, 111, 18, 0.8);
    background:
      linear-gradient(180deg, rgba(255, 126, 32, 0.46), rgba(255, 95, 12, 0.26)),
      rgba(255, 111, 18, 0.14);
  }

  .screenshot-button svg {
    transform-origin: 50% 50%;
  }

  .screenshot-button:hover svg {
    animation: screenshotIconBloom 0.46s cubic-bezier(0.2, 0.82, 0.2, 1) both;
  }

  .minimized-panel {
    box-sizing: border-box;
    width: ${Da}px;
    min-width: ${Da}px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    cursor: grab;
  }

  .minimized-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .minimized-icon-button {
    all: unset;
    box-sizing: border-box;
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 12px;
    border: 1px solid rgba(238, 244, 255, 0.12);
    background: rgba(255, 255, 255, 0.012);
    color: rgba(248, 251, 255, 0.92);
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
    text-align: center;
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }

  .minimized-icon-button:hover {
    transform: translateY(-1px);
    border-color: rgba(238, 244, 255, 0.22);
    background: rgba(255, 255, 255, 0.1);
  }

  .minimized-icon-button.is-danger {
    color: rgba(255, 132, 132, 0.98);
    border-color: rgba(255, 110, 110, 0.24);
    background:
      linear-gradient(180deg, rgba(255, 83, 83, 0.16), rgba(255, 83, 83, 0.08)),
      rgba(255, 255, 255, 0.05);
  }

  .minimized-icon-button.is-danger:hover {
    border-color: rgba(255, 120, 120, 0.34);
    background:
      linear-gradient(180deg, rgba(255, 83, 83, 0.22), rgba(255, 83, 83, 0.12)),
      rgba(255, 255, 255, 0.06);
  }

  .minimized-icon-button.is-expand {
    border-color: rgba(238, 244, 255, 0.12);
    background: rgba(255, 255, 255, 0.012);
    box-shadow: none;
  }

  .minimized-icon-button.is-expand:hover {
    transform: none;
    border-color: rgba(238, 244, 255, 0.22);
    background: rgba(255, 255, 255, 0.1);
  }

  .minimized-icon-button.is-expand svg {
    transform-origin: 50% 50%;
  }

  .minimized-icon-button.is-expand:hover svg {
    animation: expandButtonIconDrop 0.42s cubic-bezier(0.2, 0.82, 0.2, 1) both;
  }

  .minimized-toggle-card {
    all: unset;
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 10px 8px 12px;
    border-radius: 16px;
    border: 1px solid rgba(238, 244, 255, 0.12);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04)),
      rgba(255, 255, 255, 0.04);
    color: rgba(247, 250, 255, 0.94);
    cursor: pointer;
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }

  .minimized-toggle-card:hover {
    transform: translateY(-1px);
    border-color: rgba(238, 244, 255, 0.2);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.11), rgba(255, 255, 255, 0.05)),
      rgba(255, 255, 255, 0.05);
  }

  .minimized-toggle-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .minimized-toggle-title {
    font-size: 11px;
    font-weight: 650;
    line-height: 1.25;
    color: rgba(249, 251, 255, 0.96);
  }

  .minimized-toggle-switch {
    position: relative;
    width: 42px;
    min-width: 42px;
    height: 24px;
    border-radius: 999px;
    border: 1px solid rgba(236, 244, 255, 0.12);
    background: rgba(255, 255, 255, 0.12);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      inset 0 0 0 1px rgba(255, 255, 255, 0.015);
    overflow: hidden;
    transition:
      background 0.42s cubic-bezier(0.2, 0.78, 0.18, 1),
      border-color 0.42s cubic-bezier(0.2, 0.78, 0.18, 1),
      box-shadow 0.42s cubic-bezier(0.2, 0.78, 0.18, 1);
  }

  .minimized-toggle-switch::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.96);
    box-shadow:
      0 2px 8px rgba(0, 0, 0, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    transition:
      transform 0.42s cubic-bezier(0.2, 0.86, 0.18, 1),
      width 0.42s cubic-bezier(0.2, 0.86, 0.18, 1),
      box-shadow 0.42s cubic-bezier(0.2, 0.86, 0.18, 1);
    transform: translateY(-50%);
  }

  .minimized-toggle-card.is-animating .minimized-toggle-switch::before {
    animation: toggleThumbMorph 0.42s cubic-bezier(0.2, 0.86, 0.18, 1) both;
  }

  .minimized-toggle-card.is-active .minimized-toggle-switch {
    border-color: rgba(255, 111, 18, 0.48);
    background: linear-gradient(180deg, rgba(255, 122, 31, 0.98), rgba(255, 98, 9, 0.92));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      0 0 0 1px rgba(255, 111, 18, 0.1),
      0 10px 18px rgba(255, 111, 18, 0.18);
  }

  .minimized-toggle-card.is-active .minimized-toggle-switch::before {
    transform: translate(18px, -50%);
    box-shadow:
      0 3px 10px rgba(90, 31, 0, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.92);
  }

  .body {
    position: relative;
    display: grid;
    gap: calc(12px * var(--panel-ui-scale));
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow: auto;
    padding-right: 0;
    overscroll-behavior: contain;
  }

  .body-success {
    grid-template-rows: minmax(0, 1fr) auto;
    overflow: hidden;
  }

  .body-loading {
    overflow: hidden;
  }

  .panel.result-enter {
    animation: panelWindowExpand 0.78s cubic-bezier(0.22, 0.82, 0.2, 1) both;
    transform-origin: center top;
    will-change: transform, clip-path, opacity;
  }

  .body.result-enter {
    animation: resultReveal 0.62s cubic-bezier(0.22, 0.82, 0.2, 1) both;
    animation-delay: 0.12s;
    transform-origin: top center;
  }

  .body::-webkit-scrollbar {
    width: 6px;
  }

  .body::-webkit-scrollbar-thumb {
    background: rgba(231, 241, 255, 0.24);
    border-radius: 999px;
  }

  .scroll-area {
    min-width: 0;
    min-height: 0;
    overflow: auto;
    margin-right: 0;
    padding-right: calc(4px * var(--panel-ui-scale));
    overscroll-behavior: contain;
  }

  .scroll-area.json-scroll {
    overflow: auto;
    max-height: min(38vh, 300px);
    margin-right: 0;
    padding-right: calc(4px * var(--panel-ui-scale));
  }

  .scroll-area::-webkit-scrollbar {
    width: 6px;
  }

  .scroll-area::-webkit-scrollbar-thumb {
    background: rgba(231, 241, 255, 0.24);
    border-radius: 999px;
  }

  .scroll-area.json-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .scroll-area.json-scroll::-webkit-scrollbar-thumb {
    background: rgba(231, 241, 255, 0.24);
    border-radius: 999px;
  }

  .prompt-scroll-area {
    cursor: text;
  }

  .analysis {
    margin: 0 0 calc(10px * var(--panel-ui-scale));
    font-size: calc(13px * var(--panel-ui-scale));
    line-height: 1.7;
    color: rgba(246, 250, 255, 0.92);
  }

  .prompt {
    margin: 0;
    padding: 0;
    font-size: calc(13px * var(--panel-ui-scale));
    line-height: 1.78;
    white-space: pre-wrap;
    border-radius: 0;
    background: transparent;
    border: 0;
    box-shadow: none;
    color: rgba(248, 251, 255, 0.97);
  }

  .prompt-editor {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 0;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    resize: none;
    overflow: hidden;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    background: transparent;
    border: 0;
    box-shadow: none;
    color: rgba(248, 251, 255, 0.97);
    font: inherit;
    letter-spacing: inherit;
    text-align: left;
    caret-color: rgba(255, 255, 255, 0.95);
  }

  .prompt-editor:not(.json-view) {
    pointer-events: auto;
    cursor: text;
    user-select: text;
  }

  .prompt-editor::selection {
    background: rgba(255, 126, 42, 0.58);
    color: rgba(255, 255, 255, 0.98);
  }

  .prompt-editor.json-view {
    overflow: auto;
    padding-right: calc(4px * var(--panel-ui-scale));
    line-height: 1.62;
  }

  .prompt-editor.json-view::-webkit-scrollbar {
    display: block;
    width: 6px;
  }

  .prompt-editor.json-view::-webkit-scrollbar-thumb {
    background: rgba(231, 241, 255, 0.24);
    border-radius: 999px;
  }

  .prompt-editor::-webkit-resizer {
    display: none;
  }

  .prompt-editor::-webkit-scrollbar {
    display: none;
  }

  .prompt.typing {
    animation: promptReveal 0.42s cubic-bezier(0.22, 0.78, 0.2, 1) both;
    transform-origin: left center;
    will-change: opacity, filter, clip-path, transform;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: calc(6px * var(--panel-ui-scale));
    padding-right: calc(4px * var(--panel-ui-scale));
    max-height: calc(68px * var(--panel-ui-scale));
    overflow: hidden;
  }

  .success-meta {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: calc(12px * var(--panel-ui-scale));
  }

  .history-button {
    all: unset;
    box-sizing: border-box;
    width: calc(40px * var(--panel-ui-scale));
    min-width: calc(40px * var(--panel-ui-scale));
    height: calc(40px * var(--panel-ui-scale));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: calc(12px * var(--panel-ui-scale));
    border: 1px solid transparent;
    background: transparent;
    box-shadow: none;
    color: rgba(246, 250, 255, 0.94);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    transition: transform 0.2s ease, opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  }

  .history-button:hover {
    transform: translateY(-1px);
    border-color: rgba(236, 244, 255, 0.12);
    background: rgba(255, 255, 255, 0.012);
  }

  .history-button:focus,
  .history-button:focus-visible,
  .history-button:active {
    transform: none;
    outline: none;
  }

  .history-button.is-disabled {
    opacity: 0.62;
    cursor: progress;
    transform: none;
  }

  .history-button.is-active {
    border-color: rgba(236, 244, 255, 0.16);
    background: rgba(255, 255, 255, 0.08);
  }

  .history-button.is-opening {
    animation: historyButtonSpring 0.46s cubic-bezier(0.2, 0.86, 0.22, 1) both;
  }

  .history-button-icon {
    width: calc(27px * var(--panel-ui-scale));
    height: calc(27px * var(--panel-ui-scale));
    color: rgba(244, 249, 255, 0.94);
    opacity: 0.94;
  }

  .history-button-icon svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  .history-button-icon img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    transform: translateX(calc(-2px * var(--panel-ui-scale)));
  }

  .tag {
    padding: calc(5px * var(--panel-ui-scale)) calc(9px * var(--panel-ui-scale));
    border-radius: 999px;
    font-size: calc(14px * var(--panel-ui-scale));
    line-height: calc(18px * var(--panel-ui-scale));
    max-width: calc(205px * var(--panel-ui-scale));
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(255, 255, 255, 0.07);
    color: rgba(245, 249, 255, 0.86);
    border: 1px solid rgba(226, 238, 255, 0.12);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .footer {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
    gap: calc(10px * var(--panel-ui-scale));
    margin-top: calc(14px * var(--panel-ui-scale));
    padding-top: calc(14px * var(--panel-ui-scale));
    padding-right: 0;
    border-top: 0;
    flex-shrink: 0;
  }

  .footer::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: rgba(226, 238, 255, 0.14);
    pointer-events: none;
  }

  .footer .toggle-group {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: calc(48px * var(--panel-ui-scale));
    min-height: calc(48px * var(--panel-ui-scale));
    gap: calc(2px * var(--panel-ui-scale));
    padding: calc(3px * var(--panel-ui-scale));
  }

  .footer .primary-button {
    width: 100%;
    min-width: 0;
    height: calc(48px * var(--panel-ui-scale));
    min-height: calc(48px * var(--panel-ui-scale));
    white-space: nowrap;
  }

  .footer .toggle-option {
    flex: 1 1 0;
    min-width: 0;
    height: calc(42px * var(--panel-ui-scale));
    padding: 0 calc(8px * var(--panel-ui-scale));
    font-size: calc(14px * var(--panel-ui-scale));
  }

  .history-rail {
    position: relative;
    width: ${Rr}px;
    flex: 0 0 auto;
    min-height: ${jr}px;
    max-height: min(82vh, 680px);
    display: flex;
    overflow: hidden;
    pointer-events: auto;
    color: rgba(247, 250, 255, 0.96);
    user-select: none;
    border-radius: 28px;
    border: 1px solid rgba(239, 246, 255, 0.36);
    background:
      linear-gradient(180deg, rgba(18, 22, 30, 0.36), rgba(4, 7, 12, 0.45)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.124), rgba(255, 255, 255, 0.034));
    box-shadow:
      0 24px 56px rgba(0, 0, 0, 0.19),
      0 11px 22px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.39),
      inset 0 -1px 0 rgba(255, 255, 255, 0.065);
    backdrop-filter: blur(22px) saturate(1.18) contrast(1.04);
    -webkit-backdrop-filter: blur(22px) saturate(1.18) contrast(1.04);
    opacity: 1;
    transform: none;
    transform-origin: left center;
  }

  .history-rail.is-entering {
    opacity: 0.74;
    transform: scaleX(0.7);
    animation: historyRailIn 0.62s cubic-bezier(0.22, 0.82, 0.2, 1) forwards;
    transform-origin: left center;
    will-change: transform, clip-path, opacity;
  }

  .history-rail.is-exiting {
    animation: historyRailOut 0.32s cubic-bezier(0.4, 0, 0.18, 1) both;
    pointer-events: none;
  }

  .history-rail::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: 27px;
    background: transparent;
    pointer-events: none;
  }

  .history-rail-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    width: 100%;
    height: 100%;
    min-height: 0;
    padding: 16px 14px 14px;
    text-shadow: 0 1px 9px rgba(0, 0, 0, 0.09);
  }

  .history-rail-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    flex: 0 0 40px;
    min-height: 40px;
    margin-bottom: 12px;
    color: rgba(244, 248, 255, 0.88);
    position: relative;
    z-index: 2;
  }

  .history-rail-heading {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1 1 auto;
    min-width: 0;
    max-width: calc(100% - 32px);
  }

  .history-title-row {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 7px;
    min-width: 0;
    white-space: nowrap;
  }

  .history-rail-title {
    flex: 0 0 auto;
    font-size: 12px;
    letter-spacing: 0.14em;
    line-height: 18px;
    text-transform: uppercase;
    white-space: nowrap;
    word-break: keep-all;
  }

  .history-rail-count {
    font-size: 11px;
    color: rgba(233, 241, 255, 0.64);
  }

  .history-header-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 0 0 22px;
    width: 22px;
    align-self: flex-start;
  }

  .history-clear-button {
    all: unset;
    box-sizing: border-box;
    min-width: 40px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    border-radius: 999px;
    border: 1px solid rgba(255, 111, 18, 0.54);
    background:
      linear-gradient(180deg, rgba(255, 126, 32, 0.28), rgba(255, 92, 10, 0.2)),
      rgba(255, 111, 18, 0.1);
    color: rgba(255, 235, 222, 0.96);
    font-size: 8px;
    font-weight: 750;
    line-height: 1;
    flex: 0 0 auto;
    white-space: nowrap;
    cursor: pointer;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      0 8px 18px rgba(255, 111, 18, 0.16);
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background 0.18s ease;
  }

  .history-clear-button:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 139, 45, 0.78);
    background:
      linear-gradient(180deg, rgba(255, 134, 45, 0.38), rgba(255, 95, 12, 0.28)),
      rgba(255, 111, 18, 0.14);
  }

  .history-reset-prompt-button {
    min-width: 58px;
    border-color: rgba(168, 24, 33, 0.58);
    background:
      linear-gradient(180deg, rgba(178, 28, 38, 0.3), rgba(132, 9, 18, 0.22)),
      rgba(154, 12, 23, 0.18);
    color: rgba(255, 235, 222, 0.96);
    white-space: nowrap;
  }

  .history-reset-prompt-button:hover {
    border-color: rgba(198, 42, 52, 0.78);
    background:
      linear-gradient(180deg, rgba(204, 48, 58, 0.4), rgba(154, 18, 28, 0.3)),
      rgba(172, 20, 32, 0.24);
  }

  .panel.is-system-en + .history-rail .history-rail-header,
  .panel.is-system-ja + .history-rail .history-rail-header {
    gap: 6px;
  }

  .panel.is-system-en + .history-rail .history-rail-heading,
  .panel.is-system-ja + .history-rail .history-rail-heading {
    flex: 1 1 auto;
    max-width: calc(100% - 28px);
  }

  .panel.is-system-en + .history-rail .history-title-row,
  .panel.is-system-ja + .history-rail .history-title-row {
    gap: 5px;
  }

  .panel.is-system-en + .history-rail .history-rail-title {
    flex: 0 0 42px;
    max-width: 42px;
    overflow: hidden;
    font-size: 9.2px;
    letter-spacing: 0;
    white-space: nowrap;
  }

  .panel.is-system-ja + .history-rail .history-rail-title {
    flex: 0 0 25px;
    max-width: 25px;
    overflow: hidden;
    font-size: 11px;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .panel.is-system-en + .history-rail .history-clear-button,
  .panel.is-system-ja + .history-rail .history-clear-button {
    min-width: 0;
    padding: 0 5px;
    font-size: 7px;
  }

  .panel.is-system-en + .history-rail .history-reset-prompt-button,
  .panel.is-system-ja + .history-rail .history-reset-prompt-button {
    width: 50px;
    padding: 0 5px;
  }

  .panel.is-system-en + .history-rail .history-rail-header {
    gap: 5px;
  }

  .panel.is-system-en + .history-rail .history-title-row {
    gap: 3px;
  }

  .panel.is-system-en + .history-rail .history-clear-button {
    width: 58px;
    height: 17px;
    padding: 0 3px;
    font-size: 6.5px;
  }

  .panel.is-system-en + .history-rail .history-reset-prompt-button {
    width: 36px;
    height: 17px;
    padding: 0 3px;
    font-size: 7.3px;
  }

  .panel.is-system-zh + .history-rail .history-clear-button[data-action="clear-history"],
  .panel.is-system-ja + .history-rail .history-clear-button[data-action="clear-history"] {
    border-color: rgba(168, 24, 33, 0.58);
    background:
      linear-gradient(180deg, rgba(178, 28, 38, 0.3), rgba(132, 9, 18, 0.22)),
      rgba(154, 12, 23, 0.18);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      0 8px 18px rgba(154, 12, 23, 0.14);
  }

  .panel.is-system-zh + .history-rail .history-clear-button[data-action="clear-history"]:hover,
  .panel.is-system-ja + .history-rail .history-clear-button[data-action="clear-history"]:hover {
    border-color: rgba(198, 42, 52, 0.78);
    background:
      linear-gradient(180deg, rgba(204, 48, 58, 0.4), rgba(154, 18, 28, 0.3)),
      rgba(172, 20, 32, 0.24);
  }

  .panel.is-system-zh + .history-rail .history-reset-prompt-button[data-action="reset-current-prompt"],
  .panel.is-system-ja + .history-rail .history-reset-prompt-button[data-action="reset-current-prompt"] {
    border-color: rgba(255, 111, 18, 0.54);
    background:
      linear-gradient(180deg, rgba(255, 126, 32, 0.28), rgba(255, 92, 10, 0.2)),
      rgba(255, 111, 18, 0.1);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      0 8px 18px rgba(255, 111, 18, 0.16);
  }

  .panel.is-system-zh + .history-rail .history-reset-prompt-button[data-action="reset-current-prompt"]:hover,
  .panel.is-system-ja + .history-rail .history-reset-prompt-button[data-action="reset-current-prompt"]:hover {
    border-color: rgba(255, 139, 45, 0.78);
    background:
      linear-gradient(180deg, rgba(255, 134, 45, 0.38), rgba(255, 95, 12, 0.28)),
      rgba(255, 111, 18, 0.14);
  }

  .history-list {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    gap: ${ji}px;
    min-height: 0;
    overflow: auto;
    padding-right: 4px;
  }

  .history-list.has-selection .history-item:not(.is-selected) {
    opacity: 0.56;
    filter: saturate(0.84);
  }

  .history-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
    min-height: 0;
    padding: 18px 10px;
    text-align: center;
    font-size: 12px;
    line-height: 1.5;
    color: rgba(233, 241, 255, 0.66);
  }

  .history-list::-webkit-scrollbar {
    width: 6px;
  }

  .history-list::-webkit-scrollbar-thumb {
    background: rgba(231, 241, 255, 0.24);
    border-radius: 999px;
  }

  .history-item {
    position: relative;
    align-self: center;
    width: min(100%, ${Oa}px);
    opacity: 0.88;
    transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
  }

  .history-item.is-pending {
    opacity: 0.78;
  }

  .history-item.is-failed {
    opacity: 0.92;
  }

  .history-item.is-selected {
    opacity: 1;
  }

  .history-card-shell {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 22px;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.18s ease;
  }

  .history-card-shell:hover {
    transform: translateY(-1px);
  }

  .history-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .history-card-face {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: inherit;
    border: 1px solid rgba(229, 239, 255, 0.12);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
      rgba(255, 255, 255, 0.018);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    overflow: hidden;
  }

  .history-item.is-selected .history-card-face {
    border-color: rgba(243, 248, 255, 0.24);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  .history-card-face.image-face {
    padding: 0;
    align-items: center;
    justify-content: center;
  }

  .history-card-face.image-face.is-placeholder::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.16) 32%, transparent 62%);
    transform: translateX(-120%);
    animation: historyPlaceholderSweep 1.5s ease-in-out infinite;
    pointer-events: none;
  }

  .history-card-face.image-face.is-placeholder.is-failed::after {
    animation: none;
    transform: none;
    background:
      linear-gradient(180deg, rgba(9, 10, 14, 0.08), rgba(9, 10, 14, 0.42)),
      rgba(255, 111, 18, 0.08);
  }

  .history-image-thumb {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
    border-radius: inherit;
    background:
      radial-gradient(circle at 50% 18%, rgba(255, 255, 255, 0.12), transparent 42%),
      rgba(8, 12, 18, 0.22);
  }

  .history-placeholder-badge {
    position: absolute;
    left: 10px;
    bottom: 10px;
    z-index: 2;
    padding: 4px 8px;
    border-radius: 999px;
    border: 1px solid rgba(237, 244, 255, 0.16);
    background:
      linear-gradient(180deg, rgba(20, 23, 30, 0.72), rgba(3, 5, 10, 0.62)),
      rgba(255, 255, 255, 0.04);
    color: rgba(248, 251, 255, 0.92);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.04em;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    pointer-events: none;
  }

  .history-placeholder-badge.is-failed {
    border-color: rgba(255, 111, 18, 0.42);
    background:
      linear-gradient(180deg, rgba(255, 111, 18, 0.28), rgba(120, 45, 12, 0.32)),
      rgba(8, 10, 16, 0.72);
    color: rgba(255, 246, 240, 0.98);
  }

  .history-delete-button {
    all: unset;
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border-radius: 0;
    background: transparent;
    border: 0;
    color: rgba(247, 250, 255, 0.88);
    cursor: pointer;
    transition: transform 0.18s ease, color 0.18s ease;
  }

  .history-delete-button:hover {
    transform: scale(1.04);
    color: rgba(255, 255, 255, 0.98);
  }

  .history-delete-button:focus,
  .history-delete-button:focus-visible,
  .history-delete-button:active {
    outline: none;
  }

  .history-close-button {
    all: unset;
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border-radius: 0;
    border: 0;
    background: transparent;
    color: rgba(247, 250, 255, 0.84);
    cursor: pointer;
    transition: transform 0.18s ease, color 0.18s ease;
  }

  .history-close-button:hover {
    transform: scale(1.04);
    color: rgba(255, 255, 255, 0.98);
  }

  .history-flyover {
    position: fixed;
    left: 0;
    top: 0;
    pointer-events: none;
    perspective: 1600px;
    z-index: 2147483647;
  }

  .history-flyover-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }

  .history-flyover-face {
    position: absolute;
    inset: 0;
    display: flex;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid rgba(241, 247, 255, 0.18);
    background:
      linear-gradient(180deg, rgba(20, 23, 30, 0.54), rgba(3, 5, 10, 0.46)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
    box-shadow:
      0 24px 60px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }

  .history-flyover-face.image-face {
    transform: rotateY(180deg);
  }

  .history-flyover-front-copy {
    margin: 0;
    padding: 18px 18px 20px;
    color: rgba(248, 251, 255, 0.96);
    font-size: 12px;
    line-height: 1.72;
    white-space: pre-wrap;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
  }

  .history-flyover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .footer.result-enter {
    animation: resultReveal 0.6s cubic-bezier(0.22, 0.82, 0.2, 1) both;
    animation-delay: 0.22s;
    transform-origin: top center;
  }

  .toggle-group {
    --toggle-pad: calc(3px * var(--panel-ui-scale));
    --toggle-gap: calc(3px * var(--panel-ui-scale));
    --toggle-indicator-width: calc((100% - calc(6px * var(--panel-ui-scale)) - calc(6px * var(--panel-ui-scale))) / 3);
    display: inline-flex;
    position: relative;
    align-items: center;
    gap: calc(3px * var(--panel-ui-scale));
    border: 1px solid rgba(226, 238, 255, 0.14);
    padding: calc(3px * var(--panel-ui-scale));
    min-height: calc(28px * var(--panel-ui-scale));
    background: rgba(255, 255, 255, 0.07);
    color: rgba(241, 247, 255, 0.86);
    font-size: calc(14px * var(--panel-ui-scale));
    border-radius: 999px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .toggle-group::before {
    content: "";
    position: absolute;
    top: var(--toggle-pad);
    bottom: var(--toggle-pad);
    left: var(--toggle-pad);
    width: var(--toggle-indicator-width);
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(231, 241, 255, 0.25), rgba(195, 216, 242, 0.14));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 4px 12px rgba(57, 92, 136, 0.12);
    transform: translateX(0);
    transition:
      transform 0.44s cubic-bezier(0.2, 0.86, 0.18, 1),
      background 0.24s ease,
      box-shadow 0.24s ease;
    pointer-events: none;
  }

  .toggle-group[data-active-index="1"]::before {
    transform: translateX(calc(100% + var(--toggle-gap)));
  }

  .toggle-group[data-active-index="2"]::before {
    transform: translateX(calc((100% + var(--toggle-gap)) * 2));
  }

  .toggle-option {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: calc(30px * var(--panel-ui-scale));
    height: calc(24px * var(--panel-ui-scale));
    padding: 0 calc(10px * var(--panel-ui-scale));
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(241, 247, 255, 0.86);
    font-size: calc(14px * var(--panel-ui-scale));
    cursor: pointer;
    box-sizing: border-box;
    transition:
      color 0.24s ease,
      font-weight 0.24s ease,
      transform 0.24s cubic-bezier(0.2, 0.86, 0.18, 1);
  }

  .toggle-option.is-active {
    color: rgba(255, 255, 255, 0.98);
    font-weight: 600;
    background: transparent;
    box-shadow: none;
    transform: translateY(-0.5px);
  }

  .primary-button,
  .secondary-button {
    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 999px;
    font-size: calc(13px * var(--panel-ui-scale));
    padding: calc(12px * var(--panel-ui-scale)) calc(18px * var(--panel-ui-scale));
    transition: transform 0.18s ease, opacity 0.18s ease;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .primary-button {
    width: 100%;
    min-width: 0;
    min-height: calc(48px * var(--panel-ui-scale));
    padding-inline: calc(28px * var(--panel-ui-scale));
    color: rgba(14, 18, 24, 0.94);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(241, 244, 248, 0.92));
    border: 1px solid rgba(255, 255, 255, 0.68);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.78),
      inset 0 -1px 0 rgba(198, 206, 216, 0.42),
      0 8px 18px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(18px) saturate(1.02);
    -webkit-backdrop-filter: blur(18px) saturate(1.02);
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    font-weight: 600;
  }

  .generator-action-group {
    position: relative;
    width: 100%;
    min-width: 0;
    overflow: visible;
  }

  .generator-action-row {
    display: flex;
    width: 100%;
    min-width: 0;
    min-height: calc(48px * var(--panel-ui-scale));
    border-radius: 999px;
    overflow: hidden;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      0 12px 20px rgba(0, 0, 0, 0.18);
  }

  .generator-primary-button,
  .generator-site-trigger,
  .generator-site-option {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .generator-primary-button,
  .generator-site-trigger {
    height: calc(48px * var(--panel-ui-scale));
    min-height: calc(48px * var(--panel-ui-scale));
    border: 1px solid rgba(255, 255, 255, 0.1);
    background:
      linear-gradient(180deg, rgba(16, 18, 24, 0.96), rgba(7, 9, 14, 0.94)),
      rgba(7, 9, 14, 0.96);
    color: rgba(251, 252, 255, 0.96);
    box-shadow: none;
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }

  .generator-primary-button:hover,
  .generator-site-trigger:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.16);
  }

  .generator-primary-button:focus,
  .generator-primary-button:focus-visible,
  .generator-primary-button:active,
  .generator-site-trigger:focus,
  .generator-site-trigger:focus-visible,
  .generator-site-trigger:active {
    outline: none;
    transform: none;
  }

  .generator-primary-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: calc(10px * var(--panel-ui-scale));
    flex: 1 1 auto;
    min-width: 0;
    padding: 0 calc(16px * var(--panel-ui-scale));
    border-right: 0;
    border-radius: 999px 0 0 999px;
  }

  .generator-primary-button.is-disabled,
  .generator-site-trigger.is-disabled {
    opacity: 0.74;
    cursor: progress;
    transform: none;
  }

  .generator-button-copy {
    display: inline-flex;
    align-items: center;
    gap: calc(12px * var(--panel-ui-scale));
    min-width: 0;
    width: 100%;
  }

  .generator-button-text {
    min-width: 0;
    font-size: calc(13px * var(--panel-ui-scale));
    font-weight: 600;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .generator-site-trigger {
    width: calc(48px * var(--panel-ui-scale));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 999px 999px 0;
  }

  .generator-site-trigger-icon {
    font-size: calc(14px * var(--panel-ui-scale));
    line-height: 1;
    color: rgba(251, 252, 255, 0.9);
  }

  .generator-site-logo {
    position: relative;
    width: calc(20px * var(--panel-ui-scale));
    height: calc(20px * var(--panel-ui-scale));
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: calc(7px * var(--panel-ui-scale));
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.96);
    font-size: calc(9px * var(--panel-ui-scale));
    font-weight: 700;
    letter-spacing: 0.03em;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
    overflow: hidden;
  }

  .generator-site-logo-image {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: rgba(255, 255, 255, 0.06);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .generator-site-logo-fallback {
    position: relative;
    z-index: 1;
  }

  .generator-logo-stream {
    position: relative;
    width: calc(96px * var(--panel-ui-scale));
    height: calc(28px * var(--panel-ui-scale));
    display: inline-flex;
    align-items: center;
    overflow: hidden;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
      rgba(255, 255, 255, 0.025);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
  }

  .generator-logo-stream::before,
  .generator-logo-stream::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: calc(16px * var(--panel-ui-scale));
    z-index: 2;
    pointer-events: none;
  }

  .generator-logo-stream::before {
    left: 0;
    background: linear-gradient(90deg, rgba(7, 9, 14, 0.96), rgba(7, 9, 14, 0));
  }

  .generator-logo-stream::after {
    right: calc(-13px * var(--panel-ui-scale));
    background: linear-gradient(270deg, rgba(7, 9, 14, 0.96), rgba(7, 9, 14, 0));
  }

  .generator-logo-track {
    display: inline-flex;
    align-items: center;
    gap: calc(8px * var(--panel-ui-scale));
    width: max-content;
    padding-inline: calc(10px * var(--panel-ui-scale));
    animation: generatorLogoFlow 13s linear infinite;
    will-change: transform;
  }

  .generator-logo-flow-item {
    width: calc(18px * var(--panel-ui-scale));
    height: calc(18px * var(--panel-ui-scale));
    border-radius: calc(6px * var(--panel-ui-scale));
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.18);
  }

  .generator-logo-flow-item img {
    display: none;
  }

  .generator-logo-flow-image {
    width: 100%;
    height: 100%;
    display: block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .generator-site-logo.is-jimeng {
    background: linear-gradient(135deg, rgba(250, 109, 38, 0.96), rgba(255, 149, 82, 0.92));
  }

  .generator-site-logo.is-gemini {
    background: linear-gradient(135deg, rgba(82, 124, 255, 0.96), rgba(126, 92, 255, 0.92));
  }

  .generator-site-logo.is-midjourney {
    background: linear-gradient(135deg, rgba(96, 114, 255, 0.96), rgba(70, 80, 126, 0.92));
  }

  .generator-site-logo.is-lovart {
    background: linear-gradient(135deg, rgba(255, 95, 131, 0.96), rgba(255, 154, 83, 0.92));
  }

  .generator-site-menu {
    position: absolute;
    left: 0;
    right: calc(-13px * var(--panel-ui-scale));
    top: calc(100% + calc(10px * var(--panel-ui-scale)));
    padding: calc(8px * var(--panel-ui-scale));
    display: grid;
    gap: calc(6px * var(--panel-ui-scale));
    border-radius: calc(18px * var(--panel-ui-scale));
    border: 1px solid rgba(234, 242, 255, 0.18);
    background:
      linear-gradient(180deg, rgba(22, 25, 33, 0.92), rgba(7, 10, 16, 0.9)),
      rgba(8, 10, 16, 0.92);
    box-shadow:
      0 18px 34px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(22px) saturate(1.04);
    -webkit-backdrop-filter: blur(22px) saturate(1.04);
  }

  .generator-site-option {
    display: flex;
    align-items: center;
    gap: calc(10px * var(--panel-ui-scale));
    min-width: 0;
    padding: calc(10px * var(--panel-ui-scale)) calc(12px * var(--panel-ui-scale));
    border-radius: calc(13px * var(--panel-ui-scale));
    color: rgba(248, 251, 255, 0.94);
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid transparent;
    transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
  }

  .generator-site-option:hover {
    transform: translateY(-1px);
    border-color: rgba(238, 244, 255, 0.14);
    background: rgba(255, 255, 255, 0.012);
  }

  .generator-site-option.is-active {
    border-color: rgba(238, 244, 255, 0.16);
    background: rgba(255, 255, 255, 0.08);
  }

  .generator-site-option-copy {
    display: grid;
    gap: calc(2px * var(--panel-ui-scale));
    min-width: 0;
  }

  .generator-site-option-label {
    font-size: calc(14px * var(--panel-ui-scale));
    font-weight: 600;
  }

  .generator-site-option-url {
    font-size: calc(10px * var(--panel-ui-scale));
    color: rgba(228, 237, 252, 0.58);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .button-check {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: calc(8px * var(--panel-ui-scale));
    font-size: calc(13px * var(--panel-ui-scale));
    line-height: 1;
    color: rgba(20, 26, 34, 0.88);
    animation: checkPop 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .secondary-button {
    color: rgba(245, 249, 255, 0.86);
    background: rgba(255, 255, 255, 0.07);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .secondary-button:hover {
    transform: translateY(-1px);
  }

  .primary-button:hover {
    transform: translateY(-1px);
    outline: none;
    color: rgba(12, 16, 22, 0.96);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(244, 247, 250, 0.94));
    border: 1px solid rgba(255, 255, 255, 0.76);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.84),
      inset 0 -1px 0 rgba(198, 206, 216, 0.46),
      0 12px 24px rgba(0, 0, 0, 0.12);
  }

  .primary-button:active,
  .primary-button:focus,
  .primary-button:focus-visible {
    transform: none;
    outline: none;
    filter: none;
    opacity: 1;
    color: rgba(14, 18, 24, 0.94);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(241, 244, 248, 0.92));
    border: 1px solid rgba(255, 255, 255, 0.68);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.78),
      inset 0 -1px 0 rgba(198, 206, 216, 0.42),
      0 8px 18px rgba(0, 0, 0, 0.1);
  }

  .auth-primary-button,
  .auth-primary-button:hover,
  .auth-primary-button:active,
  .auth-primary-button:focus,
  .auth-primary-button:focus-visible {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.82),
      inset 0 -1px 0 rgba(198, 206, 216, 0.32);
  }

  .share-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .share-modal {
    width: min(520px, calc(100vw - 32px));
    max-height: min(92vh, 780px);
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    border-radius: 26px;
    border: 1px solid rgba(238, 244, 255, 0.2);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.07)),
      rgba(18, 20, 24, 0.42);
    box-shadow:
      0 26px 80px rgba(0, 0, 0, 0.36),
      inset 0 1px 0 rgba(255, 255, 255, 0.26);
    color: rgba(248, 251, 255, 0.96);
    backdrop-filter: blur(26px) saturate(1.18);
    -webkit-backdrop-filter: blur(26px) saturate(1.18);
  }

  .share-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 2px 2px 0;
  }

  .share-modal-title {
    font-size: 15px;
    font-weight: 760;
    letter-spacing: 0.02em;
  }

  .share-modal-preview {
    width: 100%;
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid rgba(238, 244, 255, 0.16);
    background: rgba(255, 255, 255, 0.06);
  }

  .share-modal-preview img {
    display: block;
    width: 100%;
    max-height: min(62vh, 620px);
    object-fit: contain;
    background: rgba(255, 255, 255, 0.03);
  }

  .share-modal-loading,
  .share-modal-error {
    padding: 36px 22px;
    font-size: 14px;
    line-height: 1.45;
    color: rgba(248, 251, 255, 0.76);
    text-align: center;
  }

  .share-modal-error {
    color: rgba(255, 214, 214, 0.94);
  }

  .share-modal-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .share-modal-action {
    appearance: none;
    -webkit-appearance: none;
    min-height: 44px;
    border-radius: 999px;
    border: 1px solid rgba(238, 244, 255, 0.18);
    background: rgba(255, 255, 255, 0.1);
    color: rgba(248, 251, 255, 0.94);
    font-size: 14px;
    font-weight: 760;
    cursor: pointer;
  }

  .share-modal-action.is-primary {
    border-color: rgba(255, 111, 18, 0.32);
    background: linear-gradient(180deg, rgba(255, 122, 31, 0.98), rgba(255, 98, 9, 0.92));
    color: rgba(20, 18, 16, 0.96);
  }

  .share-modal-action:hover {
    transform: translateY(-1px);
    border-color: rgba(238, 244, 255, 0.28);
  }

  .loading {
    display: grid;
    gap: calc(10px * var(--panel-ui-scale));
    align-items: center;
  }

  .progress-row {
    display: flex;
    align-items: center;
    gap: calc(12px * var(--panel-ui-scale));
    box-sizing: border-box;
    padding-right: calc(10px * var(--panel-ui-scale));
  }

  .panel.is-system-zh .progress-row,
  .panel.is-system-ja .progress-row {
    padding-right: calc(4px * var(--panel-ui-scale));
  }

  .progress-track {
    position: relative;
    flex: 1;
    height: calc(12px * var(--panel-ui-scale));
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.012);
    border: 1px solid rgba(225, 238, 255, 0.14);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      inset 0 -1px 0 rgba(78, 112, 152, 0.12);
  }

  .progress-bar {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, rgba(240, 247, 255, 0.82), rgba(255, 255, 255, 0.98));
    box-shadow:
      0 0 18px rgba(255, 255, 255, 0.22),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    transition: width 0.35s ease;
  }

  .progress-value {
    min-width: calc(40px * var(--panel-ui-scale));
    margin-right: calc(5px * var(--panel-ui-scale));
    text-align: right;
    font-size: calc(14px * var(--panel-ui-scale));
    font-variant-numeric: tabular-nums;
    color: rgba(246, 250, 255, 0.94);
  }

  .panel.is-system-zh .progress-value,
  .panel.is-system-ja .progress-value {
    margin-right: calc(-1px * var(--panel-ui-scale));
  }

  .loading-status {
    margin: 0;
    font-size: calc(13px * var(--panel-ui-scale));
    line-height: 1.6;
    color: rgba(244, 248, 255, 0.94);
    animation: loadingPulse 0.9s ease-in-out infinite;
  }

  .error-text {
    margin: 0;
    font-size: calc(13px * var(--panel-ui-scale));
    line-height: 1.6;
    color: rgba(241, 246, 253, 0.92);
    max-height: min(28vh, calc(180px * var(--panel-ui-scale)));
    overflow: auto;
    overflow-wrap: anywhere;
    word-break: break-word;
    padding-right: calc(4px * var(--panel-ui-scale));
    overscroll-behavior: contain;
  }

  .error-text::-webkit-scrollbar {
    width: 6px;
  }

  .error-text::-webkit-scrollbar-thumb {
    background: rgba(231, 241, 255, 0.24);
    border-radius: 999px;
  }

  .helper {
    display: flex;
    gap: calc(8px * var(--panel-ui-scale));
    margin-top: calc(10px * var(--panel-ui-scale));
  }

  .setup-shell {
    display: grid;
    gap: calc(12px * var(--panel-ui-scale));
  }

  .setup-copy {
    margin: 0;
    font-size: calc(13px * var(--panel-ui-scale));
    line-height: 1.65;
    color: rgba(243, 248, 255, 0.9);
  }

  .setup-form {
    display: grid;
    gap: calc(10px * var(--panel-ui-scale));
  }

  .setup-field {
    display: grid;
    gap: calc(5px * var(--panel-ui-scale));
  }

  .setup-label {
    display: block;
    padding: calc(2px * var(--panel-ui-scale)) 0 0 calc(4px * var(--panel-ui-scale));
    font-size: calc(14px * var(--panel-ui-scale));
    line-height: 1.45;
    letter-spacing: 0.03em;
    color: rgba(241, 247, 255, 0.76);
    overflow: visible;
  }

  .setup-input {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    height: calc(42px * var(--panel-ui-scale));
    padding: 0 calc(13px * var(--panel-ui-scale));
    border-radius: calc(12px * var(--panel-ui-scale));
    border: 1px solid rgba(226, 238, 255, 0.14);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.03)),
      rgba(255, 255, 255, 0.03);
    color: rgba(248, 251, 255, 0.96);
    font-size: calc(14px * var(--panel-ui-scale));
    outline: none;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .setup-input::placeholder {
    color: rgba(228, 238, 252, 0.42);
  }

  .setup-input:focus,
  .setup-input:focus-visible {
    border-color: rgba(240, 246, 255, 0.28);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.04)),
      rgba(255, 255, 255, 0.04);
  }

  .setup-error {
    margin: 0;
    font-size: calc(14px * var(--panel-ui-scale));
    line-height: 1.55;
    color: rgba(255, 215, 215, 0.94);
  }

  .setup-actions {
    display: flex;
    gap: calc(8px * var(--panel-ui-scale));
    margin-top: calc(2px * var(--panel-ui-scale));
  }

  .setup-actions .primary-button {
    width: 100%;
  }

  .hidden {
    display: none;
  }

  @keyframes generatorLogoFlow {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-50%);
    }
  }

  @keyframes borderOrbit {
    0% {
      transform: rotate(0deg) scale(0.998);
      opacity: 0.56;
    }

    50% {
      opacity: 0.98;
    }

    100% {
      transform: rotate(360deg) scale(1.002);
      opacity: 0.56;
    }
  }

  @keyframes borderOrbitBurst {
    0% {
      transform: rotate(-8deg) scale(0.992);
      opacity: 0;
    }

    18% {
      opacity: 1;
    }

    72% {
      opacity: 0.92;
    }

    100% {
      transform: rotate(154deg) scale(1.006);
      opacity: 0;
    }
  }

  @keyframes localImageDragNudge {
    0%,
    35%,
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }

    42% {
      transform: translate3d(0, -1.45px, 0) scale(1.005) rotate(-0.22deg);
    }

    50% {
      transform: translate3d(1.1px, 0.8px, 0) scale(0.998) rotate(0.18deg);
    }

    60% {
      transform: translate3d(-0.65px, -0.45px, 0) scale(1.002) rotate(-0.1deg);
    }

    70% {
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes minimizeButtonIconHop {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }

    42% {
      transform: translate3d(0, -3px, 0);
    }

    68% {
      transform: translate3d(0, 0.8px, 0);
    }
  }

  @keyframes expandButtonIconDrop {
    0%,
    100% {
      transform: translate3d(0, 0, 0);
    }

    42% {
      transform: translate3d(0, 3px, 0);
    }

    68% {
      transform: translate3d(0, -0.8px, 0);
    }
  }

  @keyframes screenshotIconBloom {
    0%,
    100% {
      transform: scale(1);
    }

    58% {
      transform: scale(1.14);
    }

    82% {
      transform: scale(0.97);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel.is-local-image-dragover,
    .close-button[data-action="minimize-panel"]:hover svg,
    .minimized-icon-button.is-expand:hover svg,
    .screenshot-button:hover svg {
      animation: none;
    }
  }

  @keyframes panelWindowExpand {
    0% {
      opacity: 0.78;
      transform: translateY(-22px) scaleY(0.86) scaleX(0.992);
      clip-path: inset(0 0 32% 0 round 30px);
    }

    72% {
      opacity: 1;
      transform: translateY(4px) scaleY(1.022) scaleX(1);
      clip-path: inset(0 0 1% 0 round 30px);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scaleY(1) scaleX(1);
      clip-path: inset(0 0 0 0 round 30px);
    }
  }

  @keyframes panelModeExpand {
    0% {
      opacity: 1;
      filter: blur(0.16px) saturate(1.05);
      border-radius: calc(999px * var(--panel-ui-scale));
      transform: translateY(-2px) scaleX(0.88) scaleY(0.18);
      clip-path: inset(0 0 76% 0 round 999px);
    }

    34% {
      opacity: 1;
      filter: blur(0.08px) saturate(1.04);
      border-radius: calc(68px * var(--panel-ui-scale));
      transform: translateY(0) scaleX(0.96) scaleY(0.58);
      clip-path: inset(0 0 37% 0 round 68px);
    }

    72% {
      opacity: 1;
      filter: blur(0) saturate(1.02);
      border-radius: calc(32px * var(--panel-ui-scale));
      transform: translateY(2px) scaleX(1.002) scaleY(1.018);
      clip-path: inset(0 0 0 0 round 32px);
    }

    88% {
      opacity: 1;
      filter: blur(0) saturate(1.01);
      border-radius: calc(30px * var(--panel-ui-scale));
      transform: translateY(-1px) scaleX(1) scaleY(0.996);
      clip-path: inset(0 0 0 0 round 30px);
    }

    100% {
      opacity: 1;
      filter: blur(0) saturate(1);
      border-radius: calc(30px * var(--panel-ui-scale));
      transform: translateY(0) scaleY(1) scaleX(1);
      clip-path: inset(0 0 0 0 round 30px);
    }
  }

  @keyframes panelModeContentReveal {
    0% {
      opacity: 0;
      filter: blur(2px);
      transform: translateY(-2px) scaleY(0.996);
    }

    38% {
      opacity: 0.42;
      filter: blur(1px);
      transform: translateY(-1px) scaleY(0.998);
    }

    100% {
      opacity: 1;
      filter: blur(0);
      transform: translateY(0) scaleY(1);
    }
  }

  @keyframes panelModeIslandCollapse {
    0% {
      opacity: 1;
      filter: blur(0) saturate(1);
      border-radius: calc(30px * var(--panel-ui-scale));
      transform: scaleX(1) scaleY(1);
      clip-path: inset(0 0 0 0 round 30px);
    }

    28% {
      opacity: 1;
      filter: blur(0.12px) saturate(1.02);
      border-radius: calc(42px * var(--panel-ui-scale));
      transform: scaleX(0.995) scaleY(0.76);
      clip-path: inset(0 0 24% 0 round 42px);
    }

    64% {
      opacity: 0.98;
      filter: blur(0.22px) saturate(1.05);
      border-radius: calc(100px * var(--panel-ui-scale));
      transform: scaleX(0.92) scaleY(0.28);
      clip-path: inset(0 0 68% 0 round 100px);
    }

    100% {
      opacity: 0.95;
      filter: blur(0.28px) saturate(1.06);
      border-radius: calc(999px * var(--panel-ui-scale));
      transform: scaleX(0.84) scaleY(0.13);
      clip-path: inset(0 0 83% 0 round 999px);
    }
  }

  @keyframes panelModeLiquidHandoff {
    0% {
      opacity: 1;
      filter: blur(0) saturate(1);
      border-radius: calc(999px * var(--panel-ui-scale));
      transform: scaleX(1) scaleY(1);
    }

    100% {
      opacity: 0.82;
      filter: blur(0.35px) saturate(1.08);
      border-radius: calc(999px * var(--panel-ui-scale));
      transform: scaleX(0.97) scaleY(0.96);
    }
  }

  @keyframes toggleThumbMorph {
    0% {
      width: 18px;
    }

    45% {
      width: 24px;
    }

    100% {
      width: 18px;
    }
  }

  @keyframes panelModeCollapse {
    0% {
      opacity: 0;
      transform: translateY(-10px) scaleY(0.955);
      clip-path: inset(0 0 14% 0 round 24px);
    }

    70% {
      opacity: 1;
      transform: translateY(2px) scaleY(1.012);
      clip-path: inset(0 0 1% 0 round 24px);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scaleY(1);
      clip-path: inset(0 0 0 0 round 24px);
    }
  }

  @keyframes panelModeExit {
    0% {
      opacity: 1;
      transform: translateY(0) scaleY(1);
      clip-path: inset(0 0 0 0 round 30px);
    }

    100% {
      opacity: 0;
      transform: translateY(-8px) scaleY(0.965);
      clip-path: inset(0 0 12% 0 round 30px);
    }
  }

  @keyframes resultReveal {
    0% {
      opacity: 0;
      transform: translateY(-12px) scaleY(0.965);
    }

    72% {
      opacity: 1;
      transform: translateY(2px) scaleY(1.008);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scaleY(1);
    }
  }

  @keyframes promptReveal {
    0% {
      opacity: 0;
      filter: blur(7px);
      transform: translateY(6px);
      clip-path: inset(0 100% 0 0 round 0);
    }

    45% {
      opacity: 0.72;
      filter: blur(3px);
    }

    100% {
      opacity: 1;
      filter: blur(0);
      transform: translateY(0);
      clip-path: inset(0 0 0 0 round 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel.mode-expand,
    .panel.mode-expand .panel-inner,
    .panel.is-minimized.mode-collapse,
    .panel.mode-exit-collapse,
    .panel.mode-exit-expand,
    .panel.result-enter,
    .body.result-enter,
    .footer.result-enter,
    .history-rail.is-entering,
    .history-rail.is-exiting {
      animation: none;
    }
  }

  @keyframes checkPop {
    0% {
      opacity: 0;
      transform: scale(0.7);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes historyButtonSpring {
    0% {
      transform: translateX(0) scaleX(1);
    }

    45% {
      transform: translateX(3px) scaleX(1.08);
    }

    72% {
      transform: translateX(-1px) scaleX(0.985);
    }

    100% {
      transform: translateX(0) scaleX(1);
    }
  }

  @keyframes historyRailIn {
    0% {
      opacity: 0.74;
      transform: scaleX(0.7);
      clip-path: inset(0 48% 0 0 round 28px);
    }

    68% {
      opacity: 1;
      transform: scaleX(1.045);
      clip-path: inset(0 0 0 0 round 28px);
    }

    100% {
      opacity: 1;
      transform: scaleX(1);
      clip-path: inset(0 0 0 0 round 28px);
    }
  }

  @keyframes historyRailOut {
    0% {
      opacity: 1;
      transform: scaleX(1);
      clip-path: inset(0 0 0 0 round 28px);
    }

    36% {
      opacity: 1;
      transform: scaleX(1.025);
      clip-path: inset(0 0 0 0 round 28px);
    }

    100% {
      opacity: 0;
      transform: scaleX(0.68);
      clip-path: inset(0 52% 0 0 round 28px);
    }
  }

  @keyframes promptParticleDrift {
    0% {
      transform: translateY(6px) translateX(-2px) scale(0.96);
    }

    100% {
      transform: translateY(-4px) translateX(2px) scale(1.03);
    }
  }

  @keyframes promptGlowPulse {
    0% {
      transform: scale(0.82);
    }

    100% {
      transform: scale(1.08);
    }
  }

  @keyframes titleBrushReveal {
    0% {
      width: 0;
    }

    100% {
      width: 100%;
    }
  }

  @keyframes titleBrushStroke {
    0% {
      opacity: 0;
      width: 0;
    }

    12% {
      opacity: 0.78;
    }

    88% {
      opacity: 0.48;
      width: 96%;
    }

    100% {
      opacity: 0.26;
      width: 100%;
    }
  }

  @keyframes historyPlaceholderSweep {
    0% {
      transform: translateX(-120%);
    }

    100% {
      transform: translateX(120%);
    }
  }

  @keyframes imageActionMenuIn {
    0% {
      opacity: 0;
      transform: translateY(-4px) scale(0.94);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes imageActionToastIn {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.96);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;function y(e,t,a){return a<t?t:Math.min(Math.max(e,t),a)}function Gr(){const e=window.location.hostname.toLowerCase();return e==="pin.it"||/(^|\.)pinterest\./i.test(e)}function Vi(e){if(!Gr()||!/\/pin\//i.test(window.location.pathname))return!1;const t=window.innerWidth||document.documentElement.clientWidth||1,a=window.innerHeight||document.documentElement.clientHeight||1,r=Math.min(420,t*.32),i=Math.min(520,a*.45);return e.width>=r&&e.height>=i}function Xr(){return D<36?Wt[0]:D<71?Wt[1]:Wt[2]}function Ki(e){return e<36?20:e<71?12:e<88?4.5:1.8}function Ga(){if(l.status!=="loading"||!f)return;const e=f.querySelector(".progress-bar");e&&(e.style.width=`${D.toFixed(1)}%`);const t=f.querySelector(".progress-value");t&&(t.textContent=`${Math.round(D)}%`);const a=f.querySelector(".loading-status");a&&(a.textContent=`${Xr()}...`)}function Vr(e){if(l.status!=="loading"){U();return}ke===null&&(ke=e);const t=Math.min((e-ke)/1e3,.05);ke=e,D=Math.min(92,D+Ki(D)*t),Ga(),G=window.requestAnimationFrame(Vr)}function Kr(){U(),D=12,Ba=performance.now(),ke=null,G=window.requestAnimationFrame(Vr)}function U(e){typeof e=="number"&&(D=e),G!==null&&(window.cancelAnimationFrame(G),G=null),ke=null,Ba=null}async function Xa(e,t){const a=D,r=Math.max(a,e);await new Promise(i=>{const n=performance.now(),o=s=>{if(l.status!=="loading"){G=null,i();return}const c=Math.min(1,(s-n)/t);if(D=a+(r-a)*c,Ga(),c>=1){G=null,i();return}G=window.requestAnimationFrame(o)};G=window.requestAnimationFrame(o)})}async function Ji(){if(l.status!=="loading"){U(100);return}const e=1200,t=170,a=260,r=120,i=Ba??performance.now(),n=performance.now()-i;if(n<e&&await new Promise(o=>{window.setTimeout(()=>o(),e-n)}),l.status!=="loading"){U(100);return}G!==null&&(window.cancelAnimationFrame(G),G=null),ke=null,D<36&&(await Xa(38,180),l.status==="loading"&&await new Promise(o=>{window.setTimeout(()=>o(),t)})),l.status==="loading"&&D<71&&(await Xa(73,210),l.status==="loading"&&await new Promise(o=>{window.setTimeout(()=>o(),t)})),l.status==="loading"&&await Xa(100,a),l.status==="loading"&&(D=100,Ga(),await new Promise(o=>{window.setTimeout(()=>o(),r)})),U(100)}function Va(e){return e instanceof HTMLImageElement}function Qi(e){const t=e.trim();if(!t)return null;try{return new URL(t,window.location.href).href}catch{return t}}function Zi(e){const t=e.match(/url\((['"]?)(.*?)\1\)/i);return t?.[2]?Qi(t[2]):null}function eo(e,t){if(!e||!(e instanceof Element))return null;if(Va(e))return e;const a=e.closest("img");return Va(a)?a:t?null:Va(a)?a:null}function to(e){return e instanceof HTMLImageElement?[e.alt,e.currentSrc,e.src,e.id,typeof e.className=="string"?e.className:"",e.getAttribute("aria-label")??"",e.getAttribute("data-testid")??""].join(" ").toLowerCase():[e.id,typeof e.className=="string"?e.className:"",e.getAttribute("aria-label")??"",e.getAttribute("title")??"",e.getAttribute("data-title")??"",e.getAttribute("data-testid")??"",e.getAttribute("role")??""].join(" ").toLowerCase()}function ao(e,t=4){const a=[];let r=e,i=0;for(;r&&i<=t;){const n=[r.getAttribute("aria-label")??"",r.getAttribute("title")??"",r.getAttribute("data-title")??"",r.getAttribute("data-testid")??""].join(" "),o=r.textContent??"",s=`${n} ${o}`.replace(/\s+/g," ").trim();s&&a.push(s.slice(0,500)),r=r.parentElement,i+=1}return a.join(" ").toLowerCase()}function ro(e,t,a){const r=Math.max(a.width,a.height),i=Math.min(a.width,a.height),n=r/Math.max(1,i);if(i<120||n>1.18)return!1;const o=ao(e),s=/(^|[\s/_:.-])(qr|qrcode|qr-code|barcode|scan-code|login-code)([\s/_:.-]|$)/i,c=/二维码|扫码|扫一扫|扫描登录|手机扫码|qr\s*code|qrcode|scan\s+(with|to|code)|scan.*login|mobile.*scan|wechat.*scan|weixin.*scan/i;return s.test(t)||c.test(o)}function ra(e){const t=e.currentSrc||e.src;return t?{src:t,alt:e.alt||void 0,pageUrl:window.location.href,naturalWidth:e.naturalWidth||void 0,naturalHeight:e.naturalHeight||void 0}:null}function no(e){const t=window.getComputedStyle(e).backgroundImage;if(!t||t==="none")return null;const a=Zi(t);if(!a)return null;const r=e.getBoundingClientRect(),i=e.getAttribute("aria-label")||e.getAttribute("title")||e.getAttribute("data-title")||void 0;return{src:a,alt:i||void 0,pageUrl:window.location.href,naturalWidth:r.width>0?Math.round(r.width):void 0,naturalHeight:r.height>0?Math.round(r.height):void 0}}function Ka(e){return e.displaySrc||e.src}function io(e){return{src:Ka(e),sourceType:e.sourceType,fileName:e.fileName,alt:e.alt,pageUrl:e.pageUrl,naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight}}function Jr(e){return!!e.closest(["[role='menu']","[role='menubar']","[role='menuitem']","[role='listbox']","[role='option']","[role='combobox']","[role='tooltip']","[popover]","[data-radix-popper-content-wrapper]","[data-popper-placement]","[data-floating-ui-portal]","[data-headlessui-portal]",".ant-select-dropdown",".MuiPopover-root",".MuiMenu-root"].join(","))}function Qr(e,t){const a=t&&typeof document.elementsFromPoint=="function"?document.elementsFromPoint(t.x,t.y):[],r=[],i=new Set,n=o=>!!o.closest("#imagetoprompt-root");if(a.some(o=>!n(o)&&Jr(o)))return{element:null,target:null,point:t};e instanceof Element&&!n(e)&&(r.push(e),i.add(e)),a.forEach(o=>{n(o)||i.has(o)||(r.push(o),i.add(o))});for(const o of r){const s=eo(o,t);if(s)return{element:s,target:ra(s),point:t};const c=no(o);if(c)return{element:o,target:c,point:t}}return{element:null,target:null,point:t}}function na(e){if(Jr(e))return!1;const t=e.getBoundingClientRect();if(t.width<=0||t.height<=0)return!1;const a=window.innerWidth||document.documentElement.clientWidth||1,r=window.innerHeight||document.documentElement.clientHeight||1,i=a*r;if(t.width>=a*.72&&t.height>=r*.72||t.width*t.height>=i*.68)return!1;const o=to(e),s=Math.max(t.width,t.height),c=Math.min(t.width,t.height),d=t.width*t.height,h=s/Math.max(1,c),g=/(^|[\s/_-])(icon|logo|avatar|emoji|favicon|badge|sprite|sticker)([\s/_-]|$)/.test(o)||s<=42||s<=64&&h<=1.45||s<=84&&c<=64&&h<=1.35,L=c<104||d<14e3;return g||L||ro(e,o,t)?!1:t.width>=112&&t.height>=112}function oo(e){const t=e.getBoundingClientRect(),a=Math.min(t.width,t.height);return a<=96?.76:a<=128?.84:a<=168?.92:1}function Lt(){Qt!==null&&(window.clearTimeout(Qt),Qt=null)}function so(){He!==null&&(window.clearTimeout(He),He=null)}function Zr(){kt.forEach(e=>{window.clearTimeout(e)}),kt=[]}function lo(e,t){Zr(),[90,220].forEach(a=>{const r=window.setTimeout(()=>{kt=kt.filter(i=>i!==r),ne&&(ce!==e||re?.src!==t||ba())},a);kt.push(r)})}function en(e){return qr.get(e)??{promptStatus:"idle",saveStatus:"idle"}}async function tn(){try{Tt=(await chrome.storage.local.get(ht))[ht]===!0}catch{Tt=!1}finally{ea=!0}}async function co(){return ea||await tn(),Tt}async function po(){Tt=!0,ea=!0,await chrome.storage.local.set({[ht]:!0})}function be(){if(!Q)return;if(!ne||!X||pa()){Q.innerHTML="";return}const e=re,t=ce,a=!!(e&&t&&na(t)),r=e?en(e.src):null,i=t?oo(t):1,n=r?.promptStatus==="loading"?u.promptLoading:u.promptAction;Q.innerHTML=a?`
      <div class="image-action-menu" aria-label="${u.actionMenuLabel}" style="--image-action-scale:${i.toFixed(3)};">
        <button
          type="button"
          class="image-action-button${r?.promptStatus==="loading"?" is-disabled":""}"
          data-inline-action="prompt"
          ${r?.promptStatus==="loading"?"disabled":""}
        >${n}</button>
        <button
          type="button"
          class="image-action-button"
          data-inline-action="open"
        >${u.openAction}</button>
      </div>
    `:"";const o=Q.querySelector(".image-action-menu");o&&(o.onpointerenter=()=>{de=!0,Lt()},o.onpointerleave=()=>{de=!1,Ct()},o.querySelectorAll("[data-inline-action]").forEach(c=>{c.onclick=async d=>{if(d.preventDefault(),d.stopPropagation(),!d.isTrusted||!re||!ce)return;const h=c.dataset.inlineAction;if(h==="prompt"){await Tl();return}h==="open"&&await kl()}})),ba()}function ot(){if(se){if(!ne||!Me||pa()){se.innerHTML="";return}se.innerHTML=`
    <div class="image-action-toast${Me.tone==="error"?" is-error":""}">
      ${k(Me.message)}
    </div>
  `}}function an(e,t){const a=en(e);qr.set(e,{...a,...t}),re?.src===e&&be()}function I(e,t){if(pa())return;const a=`${t}:${e}`,r=Date.now();if(so(),Me&&Zt===a&&r-Wr<900){He=window.setTimeout(()=>{Me=null,Zt="",He=null,ot()},2200);return}Zt=a,Wr=r,Me={message:e,tone:t},ot(),He=window.setTimeout(()=>{Me=null,Zt="",He=null,ot()},2200)}function W(){Lt(),Zr(),ce=null,re=null,me=null,de=!1,be()}function Ja(e=900){Nr=Date.now()+e}function rn(){return Date.now()<Nr}function Ct(){Lt(),Qt=window.setTimeout(()=>{de||W()},120)}function uo(e,t,a){Lt();const r=ce!==e||re?.src!==t.src;if(ce=e,re=t,me=a,r){be(),lo(e,t.src);return}ba()}const st="historyEntries",Qa="failedHistoryPlaceholders",ia="latestAnalysisSnapshot",Re="enabled",go=280;let nn=window.location.href,oa=null;function ye(e){return Array.isArray(e)?e.filter(t=>typeof t=="string").map(t=>t.trim()).filter(Boolean):[]}function Za(e){if(e===null)return null;if(typeof e=="string")return e.trim();if(typeof e=="number")return Number.isFinite(e)?e:null;if(typeof e=="boolean")return e;if(Array.isArray(e))return e.map(t=>Za(t)).filter(t=>t!==void 0);if(typeof e=="object"){const t={};return Object.entries(e).forEach(([a,r])=>{const i=Za(r);i!==void 0&&(t[a]=i)}),t}}function er(e){const t=Za(e);return typeof t=="object"&&t!==null&&!Array.isArray(t)?t:{}}function pe(e,t,a,r){const i=e[a];if(typeof i=="string")return i.trim();const n=t[r];if(typeof n=="string")return n.trim();const o=t[a];return typeof o=="string"?o.trim():""}function tr(e,t,a,r){return e[a]!==void 0?ye(e[a]):t[r]!==void 0?ye(t[r]):ye(t[a])}function on(e){if(typeof e!="object"||e===null)return{};const t=e,a={};return["zh","en","ja","json"].forEach(r=>{typeof t[r]=="string"&&(a[r]=t[r].trim())}),a}function sn(e){if(typeof e!="object"||e===null)return null;const t=e,a=t.zh,r=t.en,i=t.jsonPrompt,n=t.styleTags;if(typeof a!="object"||a===null||typeof r!="object"||r===null||typeof i!="object"||i===null||typeof n!="object"||n===null)return null;const o=a,s=r,c=typeof t.ja=="object"&&t.ja!==null?t.ja:s,d=i,h=n,g=Object.keys(er(d.raw)).length>0?er(d.raw):er({subject:d.subject,action_pose:d.actionPose,details_appearance:d.detailsAppearance,environment_background:d.environmentBackground,lighting_atmosphere:d.lightingAtmosphere,style_camera:d.styleCamera,colors:d.colors,materials:d.materials,aspect_ratio:d.aspectRatio});return typeof o.prompt!="string"||typeof o.analysis!="string"||typeof s.prompt!="string"||typeof s.analysis!="string"?null:{zh:{prompt:o.prompt.trim(),analysis:o.analysis.trim()},en:{prompt:s.prompt.trim(),analysis:s.analysis.trim()},ja:{prompt:typeof c.prompt=="string"?c.prompt.trim():s.prompt.trim(),analysis:typeof c.analysis=="string"?c.analysis.trim():s.analysis.trim()},jsonPrompt:{subject:pe(d,g,"subject","subject"),actionPose:pe(d,g,"actionPose","action_pose"),detailsAppearance:pe(d,g,"detailsAppearance","details_appearance"),environmentBackground:pe(d,g,"environmentBackground","environment_background"),lightingAtmosphere:pe(d,g,"lightingAtmosphere","lighting_atmosphere"),compositionFraming:pe(d,g,"compositionFraming","composition_framing"),styleCamera:pe(d,g,"styleCamera","style_camera"),colors:tr(d,g,"colors","colors"),materials:tr(d,g,"materials","materials"),aspectRatio:pe(d,g,"aspectRatio","aspect_ratio"),qualityModifiers:tr(d,g,"qualityModifiers","quality_modifiers"),likelyGenerationIntent:pe(d,g,"likelyGenerationIntent","likely_generation_intent"),raw:g},styleTags:{zh:ye(h.zh),en:ye(h.en),ja:ye(h.ja).length?ye(h.ja):ye(h.en)}}}function fo(e){if(typeof e!="object"||e===null)return null;const t=e;return typeof t.src!="string"||typeof t.pageUrl!="string"?null:{src:t.src,sourceType:t.sourceType==="local"?"local":t.sourceType==="web"?"web":void 0,analysisSrc:typeof t.analysisSrc=="string"&&t.analysisSrc.trim()?t.analysisSrc:void 0,displaySrc:typeof t.displaySrc=="string"&&t.displaySrc.trim()?t.displaySrc:void 0,fileName:typeof t.fileName=="string"&&t.fileName.trim()?t.fileName.trim():void 0,alt:typeof t.alt=="string"&&t.alt.trim()?t.alt.trim():void 0,pageUrl:t.pageUrl,naturalWidth:typeof t.naturalWidth=="number"&&Number.isFinite(t.naturalWidth)?t.naturalWidth:void 0,naturalHeight:typeof t.naturalHeight=="number"&&Number.isFinite(t.naturalHeight)?t.naturalHeight:void 0}}function ar(e){return Array.isArray(e)?e.map(a=>{if(typeof a!="object"||a===null)return null;const r=a,i=sn(r.analysis);return!i||typeof r.id!="string"||typeof r.createdAt!="number"||!Number.isFinite(r.createdAt)||typeof r.imageSrc!="string"||typeof r.pageUrl!="string"?null:{id:r.id,createdAt:r.createdAt,imageSrc:r.imageSrc,pageUrl:r.pageUrl,imageWidth:typeof r.imageWidth=="number"&&Number.isFinite(r.imageWidth)?r.imageWidth:void 0,imageHeight:typeof r.imageHeight=="number"&&Number.isFinite(r.imageHeight)?r.imageHeight:void 0,analysis:i,promptDrafts:on(r.promptDrafts)}}).filter(a=>a!==null).sort((a,r)=>r.createdAt-a.createdAt).slice(0,Pe):[]}function ln(e){return Array.isArray(e)?e.map(a=>{if(typeof a!="object"||a===null)return null;const r=a;return typeof r.id!="string"||typeof r.createdAt!="number"||!Number.isFinite(r.createdAt)||typeof r.imageSrc!="string"||typeof r.pageUrl!="string"||typeof r.error!="string"?null:{id:r.id,createdAt:r.createdAt,imageSrc:r.imageSrc,pageUrl:r.pageUrl,alt:typeof r.alt=="string"&&r.alt.trim()?r.alt.trim():void 0,imageWidth:typeof r.imageWidth=="number"&&Number.isFinite(r.imageWidth)?r.imageWidth:void 0,imageHeight:typeof r.imageHeight=="number"&&Number.isFinite(r.imageHeight)?r.imageHeight:void 0,status:"failed",error:r.error.trim()||"Analysis failed. Please try again."}}).filter(a=>a!==null).sort((a,r)=>r.createdAt-a.createdAt).slice(0,Pe):[]}function mo(e){if(typeof e!="object"||e===null)return null;const t=e,a=fo(t.target),r=sn(t.analysis);return!a||!r||typeof t.createdAt!="number"||!Number.isFinite(t.createdAt)?null:{createdAt:t.createdAt,target:a,analysis:r,promptDrafts:on(t.promptDrafts)}}async function sa(){const e=await chrome.storage.local.get(st);return ar(e[st])}async function cn(){const e=await chrome.storage.local.get(Qa);return ln(e[Qa])}function dn(e,t){const a=new Map;return t.forEach(r=>a.set(r.id,r)),e.forEach(r=>a.set(r.id,r)),Array.from(a.values()).sort((r,i)=>i.createdAt-r.createdAt).slice(0,Pe)}async function la(e=P){const t=ln(e.filter(a=>a.status==="failed"));await chrome.storage.local.set({[Qa]:t})}async function ho(e){const t=await sa(),a=ar([e,...t]);return await chrome.storage.local.set({[st]:a}),a}async function bo(e){const t=ar(e);return await chrome.storage.local.set({[st]:t}),t}async function yo(e){const a=(await sa()).filter(r=>r.id!==e);return await chrome.storage.local.set({[st]:a}),a}async function xo(){await chrome.storage.local.set({[st]:[]})}async function Mt(){const e=await chrome.storage.local.get(ia);return mo(e[ia])}async function pn(e){await chrome.storage.local.set({[ia]:{createdAt:e.createdAt,target:e.target,analysis:e.analysis,promptDrafts:e.promptDrafts}})}function wo(e){return e==="expanded"||e==="minimized"?e:"hidden"}function un(e){return e==="zh"||e==="en"||e==="ja"||e==="json"?e:A}function rr(e){if(typeof e!="object"||e===null)return{mode:"hidden",language:A,inlineActionsEnabled:!0,updatedAt:0};const t=e,a=typeof t.position=="object"&&t.position!==null?t.position:null,r=a&&typeof a.left=="number"&&Number.isFinite(a.left)&&typeof a.top=="number"&&Number.isFinite(a.top)?{left:a.left,top:a.top}:void 0;return{mode:wo(t.mode),language:un(t.language),inlineActionsEnabled:typeof t.inlineActionsEnabled=="boolean"?t.inlineActionsEnabled:!0,position:r,updatedAt:typeof t.updatedAt=="number"&&Number.isFinite(t.updatedAt)?t.updatedAt:0}}async function vo(){const e=await chrome.storage.local.get(Ne);return rr(e[Ne])}function So(){const e=ue();if(e){const t=e.getBoundingClientRect();return{left:t.left,top:t.top}}if(H)return{left:H.left,top:H.top}}function Po(e=v){return{mode:e,language:l.language,inlineActionsEnabled:X,position:So(),updatedAt:Date.now()}}async function j(e=v){await chrome.storage.local.set({[Ne]:Po(e)})}function gn(e){v=e.mode,X=e.inlineActionsEnabled,l.language=un(e.language),e.mode!=="expanded"&&(B=null),H=e.position?{left:e.position.left,top:e.position.top}:null}function Ao(e,t){return e.mode===t.mode&&e.inlineActionsEnabled===t.inlineActionsEnabled}function To(){l.status==="hidden"&&mr()}function ca(e){if(ne=e,je()){Ht();return}if(!e){W(),ot(),l.status!=="hidden"&&we({preserveSessionMode:!0});return}if(!ft){W(),l.status!=="hidden"&&we({preserveSessionMode:!1});return}be(),ot(),To()}async function ko(){try{const e=await chrome.storage.sync.get(Re);ca(typeof e[Re]=="boolean"?e[Re]:!0)}catch{ca(!0)}}function da(e){return typeof e=="string"&&Or.includes(e)?e:"jimeng"}async function Eo(){try{const e=await chrome.storage.local.get(mt);ze=da(e[mt])}catch{ze="jimeng"}finally{l.status==="success"&&b()}}function fn(e=ze){return qe[e]??qe.jimeng}function mn(e=window.location.hostname){return Or.some(t=>qe[t].matchHost(e))}function Io(e=window.location.hostname){return qi.some(t=>t.test(e))}function Lo(e=window.location.hostname){return Gi.some(t=>t.test(e))}function je(e=window.location.hostname){return Io(e)||Lo(e)}function Ht(){W(),U(),ve(),l={status:"hidden",language:l.language,analysis:null,error:"",errorCode:null,errorAction:null,copied:!1},v="hidden",J?.remove(),J=null,Ge=null,f=null,Q=null,se=null,Ae=null,_=null}function pa(){return mn()||je()}async function hn(e){ze=e;try{await chrome.storage.local.set({[mt]:e})}catch{return}}async function bn(e){try{await navigator.clipboard.writeText(e)}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select(),document.execCommand("copy"),t.remove()}}function ua(e){if(!(e instanceof HTMLElement))return!1;const t=window.getComputedStyle(e),a=e.getBoundingClientRect();return t.display!=="none"&&t.visibility!=="hidden"&&t.opacity!=="0"&&a.width>=12&&a.height>=12}function yn(e){const t=e.getBoundingClientRect(),a=e.tagName.toLowerCase(),r=(e.getAttribute("role")??"").toLowerCase(),i=[e.getAttribute("placeholder")??"",e.getAttribute("aria-label")??"",e.getAttribute("data-placeholder")??"",e.getAttribute("title")??""].join(" ").toLowerCase(),n=/(prompt|message|describe|imagine|create|generate|ask|send)/.test(i),o=a==="textarea",s=a==="input"&&e.type==="text",c=e.isContentEditable||r==="textbox";return Math.min(t.width*t.height/2200,90)+(o?80:0)+(c?72:0)+(s?36:0)+(n?60:0)}function Co(e){const t=new Set;return e.flatMap(r=>Array.from(document.querySelectorAll(r))).filter(r=>ua(r)).filter(r=>!(t.has(r)||(t.add(r),r.closest("#imagetoprompt-root"))||r instanceof HTMLInputElement&&r.type&&r.type!=="text")).sort((r,i)=>yn(i)-yn(r))[0]??null}function Mo(e,t){const a=e instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,r=Object.getOwnPropertyDescriptor(a,"value");r?.set?.call(e,t),r?.set||(e.value=t),e.dispatchEvent(new InputEvent("input",{bubbles:!0,data:t,inputType:"insertText"})),e.dispatchEvent(new Event("change",{bubbles:!0}))}function Ho(e,t){e.focus();try{const a=window.getSelection();if(a){const i=document.createRange();i.selectNodeContents(e),a.removeAllRanges(),a.addRange(i)}if(document.execCommand("insertText",!1,t)){e.dispatchEvent(new InputEvent("input",{bubbles:!0,data:t,inputType:"insertText"}));return}}catch{}e.textContent=t,e.dispatchEvent(new InputEvent("input",{bubbles:!0,data:t,inputType:"insertText"})),e.dispatchEvent(new Event("change",{bubbles:!0}))}function zo(e,t){const a=e.sendSelectors.flatMap(r=>Array.from(document.querySelectorAll(r))).find(r=>ua(r));a instanceof HTMLElement&&a.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"}),t.focus()}function $o(e){const t=e.accept.trim().toLowerCase();return!t||t.includes("image")||t.includes(".png")||t.includes(".jpg")||t.includes(".jpeg")||t.includes(".webp")}function Ro(e,t){const a=new DataTransfer;a.items.add(t),e.files=a.files,e.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),e.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}function xn(){const t=(qe.lovart.uploadSelectors??[]).flatMap(i=>Array.from(document.querySelectorAll(i))).filter(i=>i instanceof HTMLInputElement&&i.type==="file"),a=Array.from(document.querySelectorAll("input[type='file']")),r=new Set;return[...t,...a].find(i=>r.has(i)||i.disabled||i.closest("#imagetoprompt-root")?!1:(r.add(i),$o(i)))??null}function nr(e){const t=[e.getAttribute("aria-label")??"",e.getAttribute("title")??"",e.getAttribute("data-testid")??"",e.textContent??"",e.className].join(" ").toLowerCase();return(/upload|attach|image|photo|picture|media|file/.test(t)?90:0)+(/^\s*\+\s*$/.test(e.textContent??"")?38:0)+(ua(e)?30:0)}function jo(){const t=(qe.lovart.uploadSelectors??[]).flatMap(i=>Array.from(document.querySelectorAll(i))).filter(i=>i instanceof HTMLElement&&!(i instanceof HTMLInputElement)),a=Array.from(document.querySelectorAll("button,[role='button'],label")),r=new Set;return[...t,...a].filter(i=>r.has(i)||i.closest("#imagetoprompt-root")||!ua(i)?!1:(r.add(i),nr(i)>0)).sort((i,n)=>nr(n)-nr(i))[0]??null}function Do(e=1200){const t=Date.now();return new Promise(a=>{const r=()=>{const i=xn();if(i||Date.now()-t>=e){a(i);return}window.setTimeout(r,80)};r()})}function Oo(e){const a=Array.from(e.clipboardData?.files??[]).find(n=>n.type.startsWith("image/"));return a||(Array.from(e.clipboardData?.items??[]).find(n=>n.kind==="file"&&n.type.startsWith("image/"))?.getAsFile()??null)}async function Fo(e){let t=xn();return t||(jo()?.click(),t=await Do()),t?(Ro(t,e),!0):!1}function _o(e){if(!qe.lovart.matchHost(window.location.hostname))return;const t=e.target;if(t instanceof Element&&t.closest("#imagetoprompt-root"))return;const a=Oo(e);a&&(e.preventDefault(),e.stopPropagation(),Fo(a).then(r=>{if(r){I("Image added to Lovart","success");return}I("Lovart did not expose an image upload field.","error")}).catch(r=>{I(r instanceof Error?r.message:"Lovart image paste failed.","error")}))}function Yo(e){const t=fn(e.siteId);if(!t.matchHost(window.location.hostname))return!1;const a=Co(t.promptSelectors);return a?(a instanceof HTMLInputElement||a instanceof HTMLTextAreaElement?Mo(a,e.prompt):Ho(a,e.prompt),zo(t,a),!0):!1}function ga(){ta!==null&&(window.clearTimeout(ta),ta=null)}function wn(e,t=0){if(it=e,Yo(e)){ga(),it=null;return}if(t>=Fr.length-1){ga(),it=null;return}ga(),ta=window.setTimeout(()=>{!it||it.requestId!==e.requestId||wn(e,t+1)},Fr[t+1])}function ue(){return f?.querySelector(".panel-shell")??null}function De(){return f?.querySelector(".panel")??null}function xe(){const e=window.visualViewport;return{width:Math.round(e?.width??window.innerWidth),height:Math.round(e?.height??window.innerHeight)}}function ir(){if(!J)return;const e=xe();J.style.setProperty("--imagetoprompt-vw",`${e.width}px`),J.style.setProperty("--imagetoprompt-vh",`${e.height}px`)}function Uo(){return Q?.querySelector(".image-action-menu")??null}function or(){return f?.querySelector(".history-list")??null}function sr(){return f?.querySelector(".history-rail")??null}function Bo(){const e=or();if(e){if(Le!==null){Ze=Le;return}Ze=e.scrollTop}}function zt(){const e=or();e&&(e.scrollTop=Le??Ze)}function vn(e=Ze){Le=e,Ze=e,St!==null&&(window.clearTimeout(St),St=null),zt(),window.requestAnimationFrame(()=>{zt(),window.requestAnimationFrame(()=>{zt()})}),St=window.setTimeout(()=>{zt(),Le=null,St=null},180)}function Oe(){const t=or()?.scrollTop??Ze;vn(t)}function Sn(){return f?.querySelector(".prompt-editor")??null}function fa(){const e=Sn(),t=e?.closest(".scroll-area")??null,a=Ce?.containerTop??at,r=Ce?.editorTop??Jt;t&&(t.scrollTop=a),e&&(e.scrollTop=r)}function ma(e=Ce??{containerTop:at,editorTop:Jt}){Ce=e,at=e.containerTop,Jt=e.editorTop,At!==null&&(window.clearTimeout(At),At=null),fa(),window.requestAnimationFrame(()=>{fa(),window.requestAnimationFrame(()=>{fa()})}),At=window.setTimeout(()=>{fa(),Ce=null,At=null},180)}function lt(){const e=Sn(),t=e?.closest(".scroll-area")??null;ma({containerTop:t?.scrollTop??at,editorTop:e?.scrollTop??Jt})}function lr(){Wa?.remove(),Wa=null}function Fe(){const e=De(),t=sr();if(!e||!t)return;const a=Math.max(Math.round(e.offsetHeight),jr);t.style.height=`${a}px`}function ha(){et!==null&&(window.cancelAnimationFrame(et),et=null),Fe();let e=3;const t=()=>{if(Fe(),e-=1,e<=0){et=null;return}et=window.requestAnimationFrame(t)};et=window.requestAnimationFrame(t)}function Wo(){const e=De(),t=f?.querySelector(".body-success"),a=f?.querySelector(".footer");if(!e||Ta())return;e.animate([{opacity:.74,transform:"translateY(-28px) scaleY(0.78) scaleX(0.99)",clipPath:"inset(0 0 42% 0 round 30px)",offset:0},{opacity:1,transform:"translateY(5px) scaleY(1.035) scaleX(1)",clipPath:"inset(0 0 0 0 round 30px)",offset:.72},{opacity:1,transform:"translateY(0) scaleY(1) scaleX(1)",clipPath:"inset(0 0 0 0 round 30px)",offset:1}],{duration:620,easing:"cubic-bezier(0.22, 0.82, 0.2, 1)",fill:"both"}).finished.then(()=>Fe()).catch(()=>{}),[t,a].forEach((i,n)=>{i&&i.animate([{opacity:0,transform:"translateY(-14px) scaleY(0.96)",offset:0},{opacity:1,transform:"translateY(2px) scaleY(1.008)",offset:.72},{opacity:1,transform:"translateY(0) scaleY(1)",offset:1}],{duration:620,delay:n===0?110:180,easing:"cubic-bezier(0.22, 0.82, 0.2, 1)",fill:"both"})})}function No(){const e=sr();if(!e||Ta())return;e.animate([{opacity:.74,transform:"scaleX(0.7)",clipPath:"inset(0 48% 0 0 round 28px)",offset:0},{opacity:1,transform:"scaleX(1.045)",clipPath:"inset(0 0 0 0 round 28px)",offset:.68},{opacity:1,transform:"scaleX(1)",clipPath:"inset(0 0 0 0 round 28px)",offset:1}],{duration:780,easing:"cubic-bezier(0.22, 0.82, 0.2, 1)",fill:"both"}).finished.then(()=>Fe()).catch(()=>{})}function ba(){const e=Uo(),t=ce;if(!e||!t)return;if(!t.isConnected||!na(t)){W();return}const a=t.getBoundingClientRect();if(a.width<=0||a.height<=0||a.bottom<0||a.top>window.innerHeight){W();return}const r=e.offsetWidth||94,i=e.offsetHeight||84,n=10,o=y(Math.round(Math.min(a.width,a.height)*.06),6,10),s=window.innerWidth-r-n,c=window.innerHeight-i-n;if(Gr()){const x=Vi(a),S={left:y(x?a.right-r-o:a.left+o,n,s),top:y(a.top+o,n,c)};e.style.transformOrigin=x?"top right":"top left",e.style.left=`${S.left}px`,e.style.top=`${S.top}px`;return}e.style.transformOrigin="top right";const d=(x,S)=>{if(typeof document.elementsFromPoint!="function")return!1;const $=document.elementsFromPoint(x,S);for(const M of $)if(M instanceof Element&&!M.closest("#imagetoprompt-root")){if(M===t)return!1;if(!M.contains(t))return!0}return!1},h=(x,S)=>{const $=Math.min(16,Math.max(6,r*.1)),M=Math.min(16,Math.max(6,i*.1));return[{x:y(x+$,n,window.innerWidth-n),y:y(S+M,n,window.innerHeight-n)},{x:y(x+r-$,n,window.innerWidth-n),y:y(S+M,n,window.innerHeight-n)},{x:y(x+$,n,window.innerWidth-n),y:y(S+i-M,n,window.innerHeight-n)},{x:y(x+r/2,n,window.innerWidth-n),y:y(S+i/2,n,window.innerHeight-n)},{x:y(x+r-$,n,window.innerWidth-n),y:y(S+i/2,n,window.innerHeight-n)},{x:y(x+r/2,n,window.innerWidth-n),y:y(S+M,n,window.innerHeight-n)}].some(F=>d(F.x,F.y))},g=[{left:y(a.right-r-o,n,s),top:y(a.top+o,n,c)},{left:y(a.left+o,n,s),top:y(a.top+o,n,c)},{left:y(a.left+o,n,s),top:y(a.bottom-i-o,n,c)}],L=g.find(x=>!h(x.left,x.top))??g[0];e.style.left=`${L.left}px`,e.style.top=`${L.top}px`}async function ee(){return Vt?C:(Ve||(Ve=Promise.all([sa(),cn()]).then(([e,t])=>(C=e,P=dn(P,t),Vt=!0,Ve=null,l.status!=="hidden"&&b(),e)).catch(()=>(C=[],Vt=!0,Ve=null,C))),Ve)}async function qo(){Ve=null;const[e,t]=await Promise.all([sa(),cn()]);return C=e,P=dn(P,t),Vt=!0,C}async function cr(e){const t=await qo(),a=window.location.href,r=w?t.find(n=>n.id===w):null,i=w?P.find(n=>n.id===w):null;w&&!r&&!i&&(w=null),!w&&e?.resetSelection&&(w=t.find(o=>o.pageUrl===a)?.id??null),l.status==="success"&&T?.pageUrl&&T.pageUrl!==a&&(q=null,T=null),e?.render!==!1&&l.status!=="hidden"&&b()}function dr(){const e={};return["zh","en","ja","json"].forEach(t=>{zn(t)&&(e[t]=Ie[t]??"")}),e}function pr(e){Ie={...e}}function Go(e,t,a=dr()){return{id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,createdAt:Date.now(),imageSrc:Ka(e),pageUrl:e.pageUrl,imageWidth:typeof e.naturalWidth=="number"&&Number.isFinite(e.naturalWidth)&&e.naturalWidth>0?e.naturalWidth:void 0,imageHeight:typeof e.naturalHeight=="number"&&Number.isFinite(e.naturalHeight)&&e.naturalHeight>0?e.naturalHeight:void 0,analysis:t,promptDrafts:a}}function Xo(e){return{id:`pending-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,createdAt:Date.now(),imageSrc:Ka(e),pageUrl:e.pageUrl,alt:e.alt,imageWidth:e.naturalWidth,imageHeight:e.naturalHeight,status:"pending"}}function $t(e){const t=Xo(e);return P=[t,...P].slice(0,Pe),E||Dt(),E=!0,b(),t}function ct(e){const t=P.filter(a=>a.id!==e);t.length!==P.length&&(P=t,la(),b())}function Pn(e,t){let a=!1;P=P.map(r=>r.id!==e?r:(a=!0,{...r,status:"failed",error:t})),a&&(la(),Ue(e),b())}function ur(e,t=!1,a){if(!O||O.requestId!==e)return null;const r=O;if(O=null,a?.keepPlaceholder)return t&&b(),r;const i=P.filter(n=>n.id!==r.placeholderId);return i.length!==P.length&&(P=i,t&&b()),r}function An(e){return e.replace(/\s+/g," ").trim()}function Vo(e,t){return e.length<=t?e:`${e.slice(0,Math.max(0,t-1)).trimEnd()}…`}function _e(){const e=ue();if(!e)return;const t=e.getBoundingClientRect();H={left:t.left,top:t.top},Mn()}function Tn(){const e=De()??ue();if(!e)return null;const t=e.getBoundingClientRect();return{centerX:t.left+t.width/2,top:t.top}}function kn(e,t){if(!e)return;const a=12,r=xe(),i=wa(t),n=t==="minimized"?62:ja,o=Math.max(a,r.width-i-a),s=Math.max(a,r.height-n-a);H={left:y(Math.round(e.centerX-i/2),a,o),top:y(Math.round(e.top),a,s)}}function En(e,t){return{createdAt:Date.now(),target:io(e),analysis:t,promptDrafts:dr()}}function gr(){!l.analysis||!T||pn(En(T,l.analysis))}function Ko(){if(l.status!=="success"||!l.analysis||!w)return null;const e=C.find(t=>t.id===w);return!e||T&&(e.imageSrc!==T.src||e.pageUrl!==T.pageUrl)?null:e.id}async function Jo(){const e=Ko();if(!e)return;const t=dr(),a=C.map(r=>r.id===e?{...r,promptDrafts:t}:r);C=a,await bo(a)}function fr(){gr(),Jo()}function In(){const e=Ge?.activeElement??document.activeElement;return e instanceof HTMLTextAreaElement&&e.classList.contains("prompt-editor")&&f?.contains(e)?e:null}function Ln(){return In()!==null}async function mr(){if(!ft||je()){je()&&Ht();return}await cr({render:!1});const[e,t]=await Promise.all([vo(),Mt()]);if(gn(e),!ne||e.mode==="hidden"){we({preserveSessionMode:!0}),be();return}if(!t){if(l.status==="setup"){ie(),b();return}we({preserveSessionMode:!0});return}ie(),pr(t.promptDrafts),q=null,T=t.target,R=null,B=null,ve(),U(),oe(""),ge();const a=dt(t.analysis,l.language);ae=a,le=a,Z=!1,l={status:"success",language:l.language,analysis:t.analysis,error:"",errorCode:null,errorAction:null,copied:!1},b()}function Qo(e,t){const a=Oa,r=Di,i=Dr,n=typeof e=="number"&&Number.isFinite(e)&&e>0?e:a,o=typeof t=="number"&&Number.isFinite(t)&&t>0?t:Math.round(a*1.28),s=n/o;let c=a,d=Math.round(c/Math.max(s,.08));return d>r&&(d=r,c=Math.round(d*s)),d<i&&(d=i,c=Math.round(d*s),c>a&&(c=a,d=Math.round(c/Math.max(s,.08)))),c=Math.max(112,Math.min(c,a)),d=Math.max(i,Math.min(d,r)),{width:c,height:d}}function Cn(e,t,a=!1){if(a)return`width:${Oa}px; min-height:${Dr}px;`;const{width:r,height:i}=Qo(e,t);return`width:${r}px; height:${i}px;`}function Zo(){if(!E)return"";const e=`history-rail${Ke?" is-entering":""}`,t=[...P.map(n=>({id:n.id,imageSrc:n.imageSrc,imageWidth:n.imageWidth,imageHeight:n.imageHeight,isPlaceholder:!0,isSelected:w===n.id,isPending:n.status==="pending",isFailed:n.status==="failed",error:n.error})),...C.map(n=>({id:n.id,imageSrc:n.imageSrc,imageWidth:n.imageWidth,imageHeight:n.imageHeight,isPlaceholder:!1,isSelected:w===n.id,isPending:Qe===n.id,isFailed:!1,error:void 0}))].slice(0,Pe);if(t.length===0)return`
      <aside class="${e}">
        <div class="history-rail-inner">
          <div class="history-rail-header">
            <div class="history-rail-heading">
              <div class="history-rail-title">${u.history}</div>
              <div class="history-rail-count">0/${Pe}</div>
            </div>
            <div class="history-header-actions">
              <button
                type="button"
                class="history-close-button"
                data-action="close-history"
                aria-label="${u.closeHistory}"
              >${Ye()}</button>
            </div>
          </div>
          <div class="history-list">
            <div class="history-item" style="${Cn(void 0,void 0,!0)} opacity:0.72;">
              <div class="history-card-shell">
                <div class="history-card-inner">
                  <div class="history-card-face image-face is-placeholder">
                    <span class="history-placeholder-badge">${u.emptyHistory}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    `;const a=t.some(n=>n.isSelected),r=t.map(n=>{const o=`history-item${n.isSelected?" is-selected":""}${n.isPending?" is-pending":""}${n.isFailed?" is-failed":""}`,s=`history-card-face image-face${n.isPlaceholder?" is-placeholder":""}${n.isFailed?" is-failed":""}`,c=Cn(n.imageWidth,n.imageHeight),d=n.isFailed?u.failedHistory:u.savingHistory,h=`history-placeholder-badge${n.isFailed?" is-failed":""}`,g=`
        <div class="history-card-inner">
          <div class="${s}">
            <img class="history-image-thumb" src="${k(n.imageSrc)}" alt="" />
            ${n.isPlaceholder?`<span class="${h}" title="${k(n.error??"")}">${d}</span>`:""}
          </div>
        </div>
      `;if(n.isPlaceholder){const L=n.isFailed?`<button
            type="button"
            class="history-delete-button"
            data-action="delete-history"
            data-history-id="${n.id}"
            aria-label="${u.deleteHistory}"
          >${Ye()}</button>`:"",x=n.isFailed?`data-action="toggle-history" data-history-id="${n.id}" role="button" tabindex="0" aria-label="${u.historyLabel}"`:"";return`
          <div
            class="${o}"
            data-history-id="${n.id}"
            style="${c}"
          >
            ${L}
            <div class="history-card-shell" ${x}>
              ${g}
            </div>
          </div>
        `}return`
        <div
          class="${o}"
          data-history-id="${n.id}"
          style="${c}"
        >
          <button
            type="button"
            class="history-delete-button"
            data-action="delete-history"
            data-history-id="${n.id}"
            aria-label="${u.deleteHistory}"
          >${Ye()}</button>
          <div
            class="history-card-shell"
            data-action="toggle-history"
            data-history-id="${n.id}"
            role="button"
            tabindex="0"
            aria-label="${u.historyLabel}"
          >
            ${g}
          </div>
        </div>
      `}).join(""),i=A==="en"?`<button
                type="button"
                class="history-clear-button history-reset-prompt-button"
                data-action="clear-history"
                aria-label="${u.clearAllHistory}"
              >${u.clearAllHistory}</button>
              <button
                type="button"
                class="history-clear-button"
                data-action="reset-current-prompt"
                aria-label="${u.resetCurrentPrompt}"
              >${u.resetCurrentPrompt}</button>`:`<button
                type="button"
                class="history-clear-button"
                data-action="clear-history"
                aria-label="${u.clearAllHistory}"
              >${u.clearAllHistory}</button>
              <button
                type="button"
                class="history-clear-button history-reset-prompt-button"
                data-action="reset-current-prompt"
                aria-label="${u.resetCurrentPrompt}"
              >${u.resetCurrentPrompt}</button>`;return`
    <aside class="${e}">
      <div class="history-rail-inner">
        <div class="history-rail-header">
          <div class="history-rail-heading">
            <div class="history-title-row">
              <div class="history-rail-title">${u.history}</div>
              ${i}
            </div>
            <div class="history-rail-count">${t.length}/${Pe}</div>
          </div>
          <div class="history-header-actions">
            <button
              type="button"
              class="history-close-button"
              data-action="close-history"
              aria-label="${u.closeHistory}"
            >${Ye()}</button>
          </div>
        </div>
        <div class="history-list${a?" has-selection":""}">${r}</div>
      </div>
    </aside>
  `}async function es(e){const t=f?.querySelector(".body-success"),a=f?.querySelector(`[data-history-id="${e.id}"] .history-card-shell`);if(!t||!a||!Ge)return;lr();const r=t.getBoundingClientRect(),i=a.getBoundingClientRect(),n=document.createElement("div"),o=Vo(An(Rt()??""),320);n.className="history-flyover",n.style.width=`${r.width}px`,n.style.height=`${r.height}px`,n.style.left=`${r.left}px`,n.style.top=`${r.top}px`,n.innerHTML=`
      <div class="history-flyover-inner">
        <div class="history-flyover-face prompt-face">
          <p class="history-flyover-front-copy">${k(o)}</p>
        </div>
        <div class="history-flyover-face image-face">
          <img class="history-flyover-image" src="${k(e.imageSrc)}" alt="" />
        </div>
      </div>
    `,Ge.append(n),Wa=n;const s=i.left-r.left,c=i.top-r.top,d=i.width/Math.max(r.width,1),h=i.height/Math.max(r.height,1);await n.animate([{transform:"translate3d(0px, 0px, 0px) scale(1)",opacity:.98,offset:0},{transform:`translate3d(${s}px, ${c}px, 0px) scale(${d}, ${h})`,opacity:.82,offset:1}],{duration:520,easing:"cubic-bezier(0.22, 0.82, 0.2, 1)",fill:"forwards"}).finished.catch(()=>{}),lr()}function ya(e,t){ie(),pr(e.promptDrafts),t?.preservePosition?_e():(q=t?.anchorPoint?null:Ir(e.target.src),R=t?.anchorPoint??null,B=null),T=e.target,t?.preservePosition||(H=null),v="expanded",ve(),U(),ge();const a=dt(e.analysis,l.language);ae=a,le=a,Z=!1,V({status:"success",analysis:e.analysis,error:"",errorCode:null,errorAction:null,copied:!1}),oe(a),t?.centerPanel&&jt(!0)}function ts(e){return{createdAt:e.createdAt,target:{src:e.imageSrc,pageUrl:e.pageUrl,naturalWidth:e.imageWidth,naturalHeight:e.imageHeight},analysis:e.analysis,promptDrafts:e.promptDrafts}}function as(e){const t=C.find(a=>a.id===e);t&&(Oe(),w=e,Ue(e),v="expanded",ya(ts(t),{preservePosition:!0}),gr(),j("expanded"))}function rs(e){const t=P.find(a=>a.id===e&&a.status==="failed");t&&(Oe(),w=e,Ue(e),T={src:t.imageSrc,alt:t.alt,pageUrl:t.pageUrl,naturalWidth:t.imageWidth,naturalHeight:t.imageHeight},v="expanded",U(),oe(""),ge(),V({status:"error",language:A,analysis:null,error:t.error||"Analysis failed. Please try again.",errorCode:"ANALYSIS_FAILED",errorAction:null,copied:!1}),j("expanded"))}function hr(){const e=De(),t=yr();if(!e||t===null||e.classList.contains("is-minimized"))return;const a=xe().width,r=`${Math.round(Math.min(t,Math.max(220,a-24)))}px`;e.style.width=r,e.style.minWidth=r,e.style.maxWidth=r}function Mn(){const e=De();if(!e||v!=="expanded"||e.classList.contains("is-minimized"))return;const t=Math.round(e.getBoundingClientRect().width);if(t<=0)return;const a=xe().width;B=Math.min(t,Math.max(220,a-24)),hr()}function ie(){if(je()){Ht();return}if(J)return;J=document.createElement("div"),J.id="imagetoprompt-root",J.style.cssText=["all: initial","position: fixed","inset: 0","width: var(--imagetoprompt-vw, 100vw)","height: var(--imagetoprompt-vh, 100vh)","display: block","overflow: visible","pointer-events: none","z-index: 2147483646","font-size: 16px","line-height: normal","direction: ltr","unicode-bidi: isolate","transform: none","zoom: 1"].join("; "),ir(),document.documentElement.appendChild(J),Ge=J.attachShadow({mode:"closed"});const e=document.createElement("style");e.textContent=Xi,Q=document.createElement("div"),Q.className="image-action-overlay",se=document.createElement("div"),se.className="image-action-toast-layer",Ae=document.createElement("div"),Ae.className="screenshot-selection-layer",_=document.createElement("input"),_.type="file",_.accept="image/jpeg,image/png,image/webp,image/gif",_.multiple=!0,_.tabIndex=-1,_.setAttribute("aria-hidden","true"),_.style.cssText="position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;",_.onchange=t=>{if(!t.isTrusted)return;const a=Array.from(_?.files??[]);_&&(_.value=""),fi(a)},f=document.createElement("div"),f.className="overlay",Ge.append(e,Q,se,Ae,_,f),ee(),be(),ot(),b()}function ns(e){const t=e.jsonPrompt.raw&&Object.keys(e.jsonPrompt.raw).length>0?e.jsonPrompt.raw:{subject:e.jsonPrompt.subject,action_pose:e.jsonPrompt.actionPose,details_appearance:e.jsonPrompt.detailsAppearance,environment_background:e.jsonPrompt.environmentBackground,lighting_atmosphere:e.jsonPrompt.lightingAtmosphere,style_camera:e.jsonPrompt.styleCamera,colors:e.jsonPrompt.colors,materials:e.jsonPrompt.materials,aspect_ratio:e.jsonPrompt.aspectRatio};return JSON.stringify(t,null,2)}function Hn(){Ie={}}function zn(e){return Object.prototype.hasOwnProperty.call(Ie,e)}function $n(e,t){return t==="json"?ns(e):e[t].prompt}function is(e,t){Ie[e]=t}function os(e){delete Ie[e]}function dt(e,t){if(zn(t)){const a=Ie[t]??"";if(a.trim())return a}return $n(e,t)}function Rt(){return l.analysis?dt(l.analysis,l.language):null}function Rn(e={}){if(!l.analysis)return;const t=l.language,a=$n(l.analysis,t),r=f?.querySelector(".prompt-editor")??null,i=r?.closest(".scroll-area")??null;os(t),Z=!1,ae=a,le=a,l={...l,copied:!1},r?(r.value=a,r.classList.remove("typing"),va(),i&&(i.scrollTop=0,at=0),e.keepFocus&&!r.classList.contains("json-view")&&(r.focus({preventScroll:!0}),r.setSelectionRange(a.length,a.length))):Sa(a);const n=f?.querySelector('[data-action="copy"]');n&&(n.textContent=u.copy),fr()}function ss(){return!l.analysis||l.language==="json"?[]:l.analysis.styleTags[l.language]??[]}function ls(e){const t=e.replace(/\s+/g," ").trim(),a=t.toLowerCase(),r={"high-end fashion photography":"high-end fashion","fashion editorial photography":"fashion editorial","retro-modern aesthetic":"retro-modern","vibrant color saturation":"vibrant color","natural skin texture":"skin texture","cinematic lighting":"cinematic light","high-contrast lighting":"high contrast","minimalist aesthetic":"minimalist","photorealistic portrait":"photo portrait","commercial fashion portrait":"fashion portrait","modern commercial photography":"commercial photo","high detail":"high-detail"};if(r[a])return r[a];const i=t.replace(/\bphotography\b/gi,"photo").replace(/\baesthetic\b/gi,"").replace(/\bsaturation\b/gi,"").replace(/\s+/g," ").trim(),n=i.split(/\s+/).filter(Boolean),o=n.length>3?n.slice(0,3).join(" "):i;if(o.length<=24)return o;const s=o.slice(0,24),c=s.lastIndexOf(" ");return(c>=12?s.slice(0,c):s).trim()}function cs(){const e=new Set,t=l.language;return ss().map(a=>t==="en"?ls(a):a.replace(/\s+/g," ").trim()).filter(a=>!a||e.has(a.toLowerCase())?!1:(e.add(a.toLowerCase()),!0)).slice(0,4)}function ds(){const e=$i(A).map(a=>({key:a,label:ql(a)}));return`<div class="toggle-group" data-active-index="${Math.max(0,e.findIndex(({key:a})=>a===l.language))}">${e.map(({key:a,label:r})=>`<button class="toggle-option${l.language===a?" is-active":""}" data-action="switch-language" data-language="${a}">${r}</button>`).join("")}</div>`}function ps(e){return 1-Math.pow(1-e,3)}function xa(){Xe!==null&&(window.cancelAnimationFrame(Xe),Xe=null)}function us(e){const t=Math.max(0,Math.floor(e));if(!_a){_a=!0,N=t;return}if(t<=N){xa(),N=t;return}xa();const a=N,r=t,i=performance.now(),n=o=>{const s=Math.min(1,(o-i)/Bl);if(N=Math.round(a+(r-a)*ps(s)),fe?.numericValue!==void 0&&(fe={...fe,text:String(N),numericValue:N}),l.status!=="hidden"&&b(),s<1){Xe=window.requestAnimationFrame(n);return}Xe=null,N=r,fe?.numericValue!==void 0&&(fe={...fe,text:String(N),numericValue:N}),l.status!=="hidden"&&b()};Xe=window.requestAnimationFrame(n)}function gs(e){return e.sessionExists?e.serviceMode==="custom_api"?(xa(),{text:"API",tone:"pro"}):(us(e.availableCredits),{text:String(N),tone:"pro",numericValue:N}):(xa(),_a=!1,null)}async function jn(){try{const e=await chrome.storage.local.get(["session","balance","serviceMode"]),t=e.session,a=e.balance,r=e.serviceMode==="custom_api"?"custom_api":"builtin";fe=gs({availableCredits:typeof a?.availableCredits=="number"?a.availableCredits:0,serviceMode:r,sessionExists:Dn(t)})}catch{fe=null}}function Dn(e){if(typeof e!="object"||e===null)return!1;const t=e.accessToken;return typeof t=="string"&&t.trim().length>0}async function On(){const e=await chrome.storage.local.get(["session"]);return!Dn(e.session)}function Fn(){if(A==="zh")return"登录后开始使用 PromptCard。你可以使用内置服务，也可以使用自己的 API。初次登录会获得 5 次免费内置服务额度。";if(A==="ja")return"PromptCardを使い始めるにはサインインしてください。内蔵サービス、または自分のAPIを使用できます。初回サインインで内蔵サービスを5回無料で利用できます。";switch(A){case"zh":return"登录后开始使用 PromptCard。你可以使用内置服务，也可以使用自己的 API。初次登录会获得 5 次免费内置服务额度。";case"ja":return"PromptCardを使い始めるにはサインインしてください。内蔵サービス、または自分のAPIを使用できます。初回サインインで内蔵サービスを5回無料で利用できます。";case"en":default:return"Sign in to start using PromptCard. You can use the built-in service or your own API. First-time sign-in includes 5 free built-in service credits."}}function br(){if(A==="zh")return"登录";if(A==="ja")return"サインイン";switch(A){case"zh":return"登录";case"ja":return"サインイン";case"en":default:return"Sign in"}}function fs(){switch(A){case"zh":case"ja":return"截图";case"en":default:return"Screen shot"}}function _n(e,t,a){ie(),q=t,T=e,R=a,H=null,B=null,v="expanded",ve(),U(),oe(""),ge(),V({status:"error",language:A,analysis:null,error:Fn(),errorCode:"AUTH_REQUIRED",errorAction:{type:"open-account",label:br()},copied:!1}),j("expanded")}function ms(){return`
    <button
      type="button"
      class="history-button${E?" is-active":""}${Ke?" is-opening":""}"
      data-action="toggle-history-rail"
      aria-label="${u.history}"
      aria-pressed="${E?"true":"false"}"
    >
      <span class="history-button-icon" aria-hidden="true">
        <img src="${chrome.runtime.getURL("icons/history-icon.png")}" alt="" />
      </span>
    </button>
  `}function hs(){return`
    <button
      type="button"
      class="close-button share-button local-upload-button"
      data-action="load-local-image"
      aria-label="${k(u.loadLocalImage)}"
      title="${k(u.loadLocalImage)}"
    >${Cs()}</button>
  `}function bs(){return`
    <button
      type="button"
      class="close-button screenshot-button"
      data-action="manual-screenshot"
      aria-label="${k(fs())}"
    >${Ms()}</button>
  `}function wa(e){const t=xe(),a=Math.max(220,t.width-24);return Math.min(e==="minimized"?Da:Ra,a)}function yr(){if(v!=="expanded"||B===null)return null;const e=xe(),t=Math.max(220,e.width-24),a=wa("expanded"),r=Math.min(B,t);return r>=a-8?r:null}function ys(e){const t=De();if(!t)return!1;const a=t.classList.contains("is-minimized");return e==="minimized"?a:!a}function Yn(e=v){const t=ue();return t&&ys(e)?{width:t.offsetWidth||wa(e),height:t.offsetHeight||(e==="minimized"?62:ja)}:{width:yr()??wa(e),height:e==="minimized"?62:ja}}function Un(){const t=xe(),{width:a,height:r}=Yn(),i=Math.max(12,t.width-a-12),n=Math.max(12,t.height-r-12),o=t.width-a-20,s=80,c=$=>({left:y($.left,12,i),top:y($.top,12,n)});if(H)return c(H);if(R)return c({left:R.x+8,top:R.y+8});if(!q)return mn()?c({left:20,top:s}):c({left:o,top:s});const d=q.getBoundingClientRect(),h=d.right+16,g=d.left-a-16,L=d.left+d.width/2-a/2,x=h+a+12<=t.width?h:g>=12?g:y(L,12,i),S=y(d.top+Math.min(d.height*.12,24),12,n);return{left:x,top:S}}function xs(){const t=xe(),{width:a,height:r}=Yn("expanded"),i=Math.max(12,t.width-a-12),n=Math.max(12,t.height-r-12);return{left:y(Math.round((t.width-a)/2),12,i),top:y(Math.round((t.height-r)/2),12,n)}}function jt(e=!1){window.requestAnimationFrame(()=>{H=xs(),pt(),Fe(),e&&j(v)})}function pt(){const e=ue();if(!e)return;const t=Un();e.style.left=`${t.left}px`,e.style.top=`${t.top}px`}function k(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function Bn(){switch(A){case"zh":return"请点击浏览器右上角的 PromptCard 图标继续。";case"ja":return"ブラウザ右上の PromptCard アイコンをクリックして続けてください。";case"en":default:return"Click the PromptCard extension icon in the browser toolbar to continue."}}function va(){const e=f?.querySelector(".prompt-editor");if(!e)return;const t=e.closest(".scroll-area"),a=t?.scrollTop??0,r=In()===e,i=e.selectionStart,n=e.selectionEnd;if(e.classList.contains("json-view")){e.style.height="min(38vh, 300px)",t&&(t.scrollTop=a);return}e.style.height="auto",e.style.height=`${Math.max(e.scrollHeight,24)}px`,t&&(t.scrollTop=a),r&&e.setSelectionRange(i,n)}function Wn(){Ee!==null&&(window.clearTimeout(Ee),Ee=null),fr()}function ws(){Ee!==null&&window.clearTimeout(Ee),Ee=window.setTimeout(()=>{Ee=null,fr()},280)}function Sa(e){ae=e;const t=f?.querySelector(".prompt-editor");t&&(t.value=e,t.classList.toggle("typing",Z),va(),ha())}function oe(e){yt!==null&&(window.clearTimeout(yt),yt=null),Z=!1,typeof e=="string"&&(le=e,Sa(e))}function vs(e){oe(),le=e,ae=e,Z=!0,Sa(e),yt=window.setTimeout(()=>{Z=!1,Sa(e),yt=null},560)}function Ss(){const e=Rt();e&&window.requestAnimationFrame(()=>{vs(e)})}function Nn(){return cs().map(e=>`<span class="tag">${k(e)}</span>`).join("")}function Ps(e){if(!l.analysis)return;const t=$i(A),a=Math.max(0,t.indexOf(e));l={...l,language:e,copied:!1};const r=f?.querySelector(".toggle-group");r?.setAttribute("data-active-index",String(a)),r?.querySelectorAll(".toggle-option").forEach(c=>{c.classList.toggle("is-active",c.dataset.language===e)});const i=e==="json";f?.querySelector(".scroll-area")?.classList.toggle("json-scroll",i),f?.querySelector(".prompt-editor")?.classList.toggle("json-view",i),ha();const n=Nn(),o=f?.querySelector(".tags");o&&(o.innerHTML=n,o.classList.toggle("hidden",!n));const s=f?.querySelector('[data-action="copy"]');s&&(s.textContent=u.copy),le="",ae="",Ss(),ha()}function qn(){xt!==null&&(window.clearTimeout(xt),xt=null)}function As(){qn(),Gt=!0,xt=window.setTimeout(()=>{Gt=!1,xt=null},Wl)}function ge(){qn(),Gt=!1}function Gn(){vt!==null&&(window.clearTimeout(vt),vt=null)}function Dt(){Gn(),Ke=!0,vt=window.setTimeout(()=>{Ke=!1,vt=null},Nl)}function Xn(){Gn(),Ke=!1}function Ts(){return`
    <div class="body body-loading">
      <div class="loading">
        <div class="progress-row">
          <div class="progress-track" aria-hidden="true">
            <div class="progress-bar" style="width:${D.toFixed(1)}%"></div>
          </div>
          <div class="progress-value">${Math.round(D)}%</div>
        </div>
        <p class="loading-status">${Xr()}...</p>
      </div>
    </div>
  `}function ks(){return l.errorCode==="INSUFFICIENT_CREDITS"||/used up your credits|not enough credits/i.test(l.error)}function Es(){return/built-in service is no longer available|refund|payment dispute|custom api/i.test(l.error)}function Vn(){return l.errorCode==="AUTH_REQUIRED"||/sign in|session is no longer valid|请先登录|ログイン/i.test(l.error)}function Kn(){return l.errorAction&&l.errorAction.type!=="open-support"?l.errorAction:Vn()?{type:"open-account",label:br()}:Es()?{type:"open-account",label:"Go set up"}:ks()?{type:"open-billing",label:"Buy credit Or API"}:null}function Jn(){const e=Kn(),t=e?`<button class="primary-button${e.type==="open-account"?" auth-primary-button":""}" data-action="primary-action">${k(e.label)}</button>`:`<button class="primary-button" data-action="retry">${u.retry}</button>`;return`
    <div class="body">
      <p class="error-text">${k(l.error)}</p>
      <div class="helper">
        ${t}
      </div>
    </div>
  `}function Is(){return`
    <div class="body">
      <div class="setup-shell">
        <p class="setup-copy">${u.apiSetupDescription}</p>
        <div class="setup-form">
          <label class="setup-field">
            <span class="setup-label">${u.apiSetupBaseUrl}</span>
            <input
              class="setup-input"
              data-api-field="base-url"
              type="url"
              spellcheck="false"
              value="${k(z.baseUrl)}"
              placeholder="${k(u.apiSetupBaseUrlPlaceholder)}"
            />
          </label>
          <label class="setup-field">
            <span class="setup-label">${u.apiSetupApiKey}</span>
            <input
              class="setup-input"
              data-api-field="api-key"
              type="password"
              spellcheck="false"
              value="${k(z.apiKey)}"
              placeholder="${k(u.apiSetupApiKeyPlaceholder)}"
            />
          </label>
          <label class="setup-field">
            <span class="setup-label">${u.apiSetupModel}</span>
            <input
              class="setup-input"
              data-api-field="model"
              type="text"
              spellcheck="false"
              value="${k(z.model)}"
              placeholder="${k(u.apiSetupModelPlaceholder)}"
            />
          </label>
        </div>
        ${z.error?`<p class="setup-error">${k(z.error)}</p>`:""}
        <div class="setup-actions">
          <button type="button" class="primary-button" data-action="save-api-setup" ${z.isSaving?"disabled":""}>
            ${z.isSaving?u.apiSetupSaving:u.apiSetupSave}
          </button>
        </div>
      </div>
    </div>
  `}function Ls(e){if(!l.analysis)return Jn();const t=Rt()??"",a=Nn(),r=l.language==="json";return`
    <div class="body body-success${e}">
      <div class="scroll-area${r?" json-scroll":" prompt-scroll-area"}">
        <textarea class="prompt prompt-editor${`${Z?" typing":""}${r?" json-view":""}`}" spellcheck="false">${k(ae||t)}</textarea>
      </div>
      <div class="success-meta">
        <div class="tags ${a?"":"hidden"}">${a}</div>
      </div>
    </div>
  `}function Qn(e){return`
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="${e==="up"?"M4 10L8 6L12 10":"M4 6L8 10L12 6"}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  `}function Ye(){return`
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M4.5 4.5L11.5 11.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      <path d="M11.5 4.5L4.5 11.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
    </svg>
  `}function Cs(){return`
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M8 3.85V12.15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
      <path d="M3.85 8H12.15" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"></path>
    </svg>
  `}function Ms(){return`
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3.2 5.2V3.8C3.2 3.36 3.56 3 4 3H5.4" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M10.6 3H12C12.44 3 12.8 3.36 12.8 3.8V5.2" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M12.8 10.8V12.2C12.8 12.64 12.44 13 12 13H10.6" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M5.4 13H4C3.56 13 3.2 12.64 3.2 12.2V10.8" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"></path>
      <circle cx="8" cy="8" r="2.15" fill="none" stroke="currentColor" stroke-width="1.55"></circle>
    </svg>
  `}function Hs(){return`
    <div class="minimized-panel" data-drag-handle="true">
      <button
        type="button"
        class="minimized-toggle-card${X?" is-active":""}"
        data-action="toggle-inline-actions"
        aria-pressed="${X?"true":"false"}"
      >
        <span class="minimized-toggle-copy">
          <span class="minimized-toggle-title">${u.inlineActionsTitle}</span>
        </span>
        <span class="minimized-toggle-switch" aria-hidden="true"></span>
      </button>
      <div class="minimized-actions">
        <button
          type="button"
          class="minimized-icon-button is-danger"
          data-action="close-shared-panel"
          aria-label="${u.closeSharedPanel}"
        >${Ye()}</button>
        <button
          type="button"
          class="minimized-icon-button is-expand"
          data-action="expand-panel"
          aria-label="${u.expandPanel}"
        >${Qn("down")}</button>
      </div>
    </div>
  `}function b(){if(!f)return;if(ir(),Bo(),l.status==="hidden"){yi(),f.innerHTML="";return}const e=Un();if(v==="minimized"){const Lr=rt==="collapse"?" mode-collapse":"";f.innerHTML=`
      <div
        class="panel-shell"
        style="left:${e.left}px; top:${e.top}px;"
      >
        <div
          class="panel is-minimized${Lr}"
          role="dialog"
          aria-modal="false"
          aria-label="Image prompt minimized menu"
        >
          <div class="ring-glow" aria-hidden="true"></div>
          <div class="glass-pill"></div>
          ${Hs()}
        </div>
      </div>
    `,xi(),window.requestAnimationFrame(()=>{pt(),H||(H={...e})}),rt=null;return}const t=l.copied?`${u.copied}<span class="button-check" aria-hidden="true">&#10003;</span>`:u.copy,a=l.status==="success"&&Gt?" result-enter":"",r=!!a,i=rt==="expand"&&!a?" mode-expand":"",n=l.status==="loading"?" loading-glow":Xt?" copy-glow":"",o=qa?" is-local-image-dragover":"",s=` is-system-${A}`,c=l.status==="error"&&Vn()?" is-auth-required":"",d=l.status!=="setup"&&E,h=d&&(Ke||r),g=l.status==="success"?ds():"",L=l.status==="success"?ms():"",x=l.status==="success"?hs():"",S=l.status==="success"?bs():"",$=l.status==="loading"?Ts():l.status==="setup"?Is():l.status==="error"?Jn():Ls(a),M=d?Zo():"",K=l.status==="loading"?" is-loading":"",F=l.status==="loading"?`<button class="close-button" data-action="close-shared-panel" aria-label="${u.closeSharedPanel}">${Ye()}</button>`:`<button class="close-button" data-action="minimize-panel" aria-label="${u.minimizePanel}">${Qn("up")}</button>`,m=x?`<div class="header-top-actions">${x}${F}</div>`:F,p=S?`<div class="header-secondary-actions">${S}${L}</div>`:L,Be=l.status==="loading"?u.analysisImage:l.status==="setup"?u.apiSetupTitle:u.analysisResult,We=l.status==="success"?`<div class="title-stack">
        <span class="title title-button" data-title="${k(Be)}">${k(Be)}</span>
      </div>`:`<div class="title">${k(Be)}</div>`,te=yr(),Yt=te!==null?` style="width:${Math.round(te)}px; min-width:${Math.round(te)}px; max-width:${Math.round(te)}px;"`:"";f.innerHTML=`
    <div
      class="panel-shell"
      style="left:${e.left}px; top:${e.top}px;"
    >
      <div
        class="panel${s}${c}${a}${i}${n}${o}"${Yt}
        role="dialog"
        aria-modal="false"
        aria-label="Image prompt analysis"
      >
        <div class="ring-glow" aria-hidden="true"></div>
        <div class="glass-pill"></div>
        <div class="panel-inner">
          <div class="header${K}" data-drag-handle="true">
            <div class="header-copy">
              <div class="eyebrow">${k(Ul)}</div>
              <div class="title-row${l.status==="success"?" has-screenshot-notice":""}">
                ${We}
              </div>
            </div>
            <div class="header-actions">
              ${m}
              ${p}
            </div>
          </div>
          ${$}
          ${l.status==="success"?`<div class="footer${a}">
            ${g}
            <button type="button" class="primary-button" data-action="copy">${t}</button>
          </div>`:""}
        </div>
      </div>
      ${M}
    </div>
  `,xi(),window.requestAnimationFrame(()=>{B===null?Mn():hr(),pt(),H||(H={...e}),Fe(),r&&Wo(),h&&No(),Le!==null?vn(Le):zt(),Ce!==null&&ma(Ce),l.status==="setup"&&Ds()}),rt=null}function xr(e){return typeof e=="string"?e.trim():""}async function Pa(){const e=await chrome.storage.local.get(Oi);return{baseUrl:xr(e.baseUrl),apiKey:xr(e.apiKey),model:xr(e.model)}}function wr(e){return $r?!0:!!(e.baseUrl&&e.apiKey&&e.model)}function Aa(e){return e.baseUrl?e.apiKey?e.model?"":"Please fill in the image analysis model name.":"Please fill in API Key.":"Please fill in Base URL."}function zs(e){return $r||!(e instanceof Error)?!1:/Base URL|API Key|model/i.test(e.message)}async function $s(e){await chrome.storage.local.set({baseUrl:e.baseUrl.trim(),apiKey:e.apiKey.trim(),model:e.model.trim()})}function Rs(){const e=f?.querySelector(".setup-error");e&&(e.textContent="")}function js(e,t){z[e]=t,z.error&&(z.error="",Rs())}function Ds(){const e=f?.querySelector('[data-api-field="base-url"]'),t=f?.querySelector('[data-api-field="api-key"]'),a=f?.querySelector('[data-api-field="model"]');((e&&!e.value.trim()?e:null)??(t&&!t.value.trim()?t:null)??(a&&!a.value.trim()?a:null)??e)?.focus()}async function vr(e,t){const a=await Pa();aa=e,e.options?.historyPlaceholderId&&ct(e.options.historyPlaceholderId),O=null,ie(),q=t?.anchor??q,T=t?.target??T,R=t?.point??R,H=null,B=null,v="expanded",ve(),U(),oe(""),ge(),z={baseUrl:a.baseUrl,apiKey:a.apiKey,model:a.model,error:t?.message??Aa(a),isSaving:!1},V({status:"setup",analysis:null,error:"",copied:!1}),e.options?.centerPanel&&jt(!0)}async function Os(){const e=aa;if(aa=null,!e)return;let t=e.options;if(e.options?.autoSaveToHistory){let a=T;if((!a||e.srcUrl&&a.src!==e.srcUrl)&&e.srcUrl){const r=Ir(e.srcUrl);a=r instanceof HTMLImageElement?ra(r):null}if(a){await ee();const r=$t(a);t={...e.options,historyPlaceholderId:r.id}}}await ut(e.srcUrl,e.preferLatest,t)}async function Zn(){const e={baseUrl:z.baseUrl.trim(),apiKey:z.apiKey.trim(),model:z.model.trim()},t=Aa(e);if(t){z={...z,...e,error:t,isSaving:!1},b();return}z={...z,...e,error:"",isSaving:!0},b();try{await $s(e),await Os()}catch(a){z={...z,isSaving:!1,error:a instanceof Error?a.message:"Save failed. Please try again."},V({status:"setup",analysis:null,error:"",copied:!1})}}function ei(){wt!==null&&(window.clearTimeout(wt),wt=null)}function ti(e){ei(),Xt=!0,e?.renderImmediately!==!1&&(Oe(),lt(),b()),wt=window.setTimeout(()=>{wt=null,Xt=!1,Oe(),lt(),b()},1100)}function we(e){Gs(),l={status:"hidden",language:A,analysis:null,error:"",errorCode:null,errorAction:null,copied:!1},ei(),ga(),lr(),Xt=!1,Xn(),E=!1,he=!1,$e="idle",it=null,aa=null,z={baseUrl:"",apiKey:"",model:"",error:"",isSaving:!1},Qe=null,Kt=new Set,w=null,Hn(),q=null,T=null,R=null,H=null,B=null,e?.preserveSessionMode||(v="hidden"),ve(),U(),oe(""),ge(),b()}function V(e){l={...l,...e},b()}function Ta(){return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??!1}function ai(e){const t=f?.querySelector(".panel");return!t||Ta()||e==="expand"?Promise.resolve():(t.classList.remove("mode-expand","mode-collapse"),t.classList.add(e==="collapse"?"mode-exit-collapse":"mode-exit-expand"),new Promise(a=>{let r=!1;const i=()=>{r||(r=!0,t.removeEventListener("animationend",i),window.clearTimeout(n),a())},n=window.setTimeout(i,130);t.addEventListener("animationend",i)}))}function Sr(){const e=sr();if(!e||Ta())return Promise.resolve();e.classList.remove("is-entering","is-exiting"),e.getAnimations().forEach(a=>{a.cancel()}),e.style.transformOrigin="left center",e.style.willChange="transform, clip-path, opacity";const t=e.animate([{opacity:1,transform:"scaleX(1)",clipPath:"inset(0 0 0 0 round 28px)",offset:0},{opacity:1,transform:"scaleX(1.025)",clipPath:"inset(0 0 0 0 round 28px)",offset:.34},{opacity:0,transform:"scaleX(0.68)",clipPath:"inset(0 52% 0 0 round 28px)",offset:1}],{duration:320,easing:"cubic-bezier(0.4, 0, 0.18, 1)",fill:"both"});return new Promise(a=>{let r=!1;const i=()=>{r||(r=!0,e.style.willChange="",window.clearTimeout(n),a())},n=window.setTimeout(i,380);t.finished.then(i).catch(i)})}async function Fs(){const e=Rt();e&&(Oe(),lt(),await bn(e),Oe(),lt(),ti({renderImmediately:!1}),V({copied:!0}))}function ri(){return l.language==="zh"||l.language==="ja"?l.language:"en"}function _s(){return l.analysis?dt(l.analysis,ri()).trim():""}function ni(){return l.analysis?(l.analysis.styleTags[ri()]??[]).filter(Boolean).slice(0,4):[]}function Ot(e,t,a,r,i,n){const o=Math.min(n,r/2,i/2);e.beginPath(),e.moveTo(t+o,a),e.lineTo(t+r-o,a),e.quadraticCurveTo(t+r,a,t+r,a+o),e.lineTo(t+r,a+i-o),e.quadraticCurveTo(t+r,a+i,t+r-o,a+i),e.lineTo(t+o,a+i),e.quadraticCurveTo(t,a+i,t,a+i-o),e.lineTo(t,a+o),e.quadraticCurveTo(t,a,t+o,a),e.closePath()}function ii(e,t,a,r,i,n){const o=t.naturalWidth/t.naturalHeight,s=i/n;let c=0,d=0,h=t.naturalWidth,g=t.naturalHeight;o>s?(h=t.naturalHeight*s,c=(t.naturalWidth-h)/2):(g=t.naturalWidth/s,d=(t.naturalHeight-g)/2),e.drawImage(t,c,d,h,g,a,r,i,n)}function oi(e){return An(e).slice(0,1800).match(/[\u3040-\u30ff\u3400-\u9fff]|[^\s\u3040-\u30ff\u3400-\u9fff]+/g)??[]}function Ys(e,t){return e?/^[\u3040-\u30ff\u3400-\u9fff]$/.test(t)||/[\u3040-\u30ff\u3400-\u9fff]$/.test(e)?`${e}${t}`:`${e} ${t}`:t}function Us(e,t,a,r){const i=oi(t),n=[];let o="";for(const s of i){const c=Ys(o,s);if(e.measureText(c).width<=a){o=c;continue}if(o?(n.push(o),o=s):(n.push(s),o=""),n.length>=r)break}if(o&&n.length<r&&n.push(o),n.length===r&&i.length>oi(n.join("")).length){let s=n[r-1]??"";for(;s.length>0&&e.measureText(`${s}...`).width>a;)s=s.slice(0,-1).trim();n[r-1]=`${s}...`}for(let s=1;s<n.length;s+=1)/^[。！？.!?,，、；;：:]$/.test(n[s]??"")&&(n[s-1]=`${n[s-1]}${n[s]}`,n.splice(s,1),s-=1);return n}function Bs(e){return new Promise((t,a)=>{const r=new Image;r.onload=()=>t(r),r.onerror=()=>a(new Error("Could not load image for share card.")),r.src=e})}async function Ws(e){const t=await chrome.runtime.sendMessage({type:"FETCH_CLIPBOARD_IMAGE",payload:{target:e}});if(!t?.ok||!t.data)throw new Error(t&&!t.ok?t.error:"Could not prepare image for share card.");return t.data}function Ns(e,t,a,r,i){for(let n=r;n>=16;n-=1){e.font=`400 ${n}px Inter, Arial, sans-serif`;const o=[],s=[];let c=0;for(const d of t){const h=Math.ceil(e.measureText(d).width+34),g=c+(o.length>0?i:0)+h;if(!(g>a)&&(o.push(d),s.push(h),c=g,o.length>=4))break}if(o.length>0)return{tags:o,widths:s,fontSize:n}}return{tags:[],widths:[],fontSize:16}}async function qs(e){const t=await Ws(e),a=await Bs(`data:${t.mimeType};base64,${t.data}`),r=document.createElement("canvas"),i=1080,n=86,o=58,s=908,c=146,d=788,h=146,g=136,L=788,x=818,S=650,$=22,M=54,K=27,F=14,m=ni().length>0?ni():["cinematic lighting","fashion editorial","low-angle perspective","high detail"];r.width=i;const p=r.getContext("2d");if(!p)throw new Error("Could not create share card.");p.font="400 21px Inter, Arial, sans-serif";const Be=(gt,zr)=>{const Ut=Us(p,_s(),d,zr),Ti=g+gt+34,ki=Ti+$,Ei=ki+M,Ii=Ei+Ut.length*K+30,Li=Ii+66,Ci=Li+22,Mi=Ci-o+52,Yl=Math.max(1440,o+Mi+64);return{lines:Ut,imageH:gt,dividerY:Ti,promptTitleY:ki,promptTextY:Ei,tagY:Ii,bottomLineY:Li,footerY:Ci,cardH:Mi,height:Yl}};let We=15,te=Be(x,We);for(te.height>1620&&(te=Be(Math.max(S,x-(te.height-1620)),We));te.height>1680&&We>9;)We-=1,te=Be(S,We);const Yt=Ns(p,m,d,21,F),{lines:Lr,imageH:Cr,dividerY:wi,promptTitleY:Ol,promptTextY:Fl,tagY:vi,bottomLineY:Si,footerY:_l,cardH:Ca,height:Ma}=te;r.height=Ma,p.save(),p.filter="blur(22px) saturate(1.16)",ii(p,a,-42,-42,i+84,Ma+84),p.restore();const Ha=p.createLinearGradient(0,0,0,Ma);Ha.addColorStop(0,"rgba(0, 0, 0, 0.16)"),Ha.addColorStop(.58,"rgba(0, 0, 0, 0.08)"),Ha.addColorStop(1,"rgba(0, 0, 0, 0.24)"),p.fillStyle=Ha,p.fillRect(0,0,i,Ma),Ot(p,n,o,s,Ca,72);const za=p.createLinearGradient(n,o,n+s,o+Ca);za.addColorStop(0,"rgba(255, 255, 255, 0.28)"),za.addColorStop(.4,"rgba(255, 255, 255, 0.1)"),za.addColorStop(1,"rgba(255, 255, 255, 0.18)"),p.fillStyle=za,p.fill(),p.strokeStyle="rgba(255, 255, 255, 0.72)",p.lineWidth=2,p.stroke(),p.save(),Ot(p,n+1,o+1,s-2,Ca-2,72),p.clip();const Mr=p.createRadialGradient(n+130,o+60,10,n+130,o+60,520);Mr.addColorStop(0,"rgba(255, 255, 255, 0.2)"),Mr.addColorStop(1,"rgba(255, 255, 255, 0)"),p.fillStyle=Mr,p.fillRect(n,o,s,Ca),p.restore(),p.fillStyle="rgba(248, 251, 255, 0.94)",p.textBaseline="top",p.font="500 26px Inter, Arial, sans-serif",p.fillText("PROMPTCARD",c+14,90),p.save(),Ot(p,h,g,L,Cr,34),p.clip(),ii(p,a,h,g,L,Cr),p.restore(),Ot(p,h,g,L,Cr,34),p.strokeStyle="rgba(255, 255, 255, 0.78)",p.lineWidth=2,p.stroke(),p.beginPath(),p.moveTo(c,wi),p.lineTo(c+d,wi),p.strokeStyle="rgba(255, 255, 255, 0.78)",p.lineWidth=2,p.stroke(),p.shadowColor="rgba(0, 0, 0, 0.18)",p.shadowBlur=12,p.fillStyle="#ff6a00",p.font="500 40px Inter, Arial, sans-serif",p.fillText("Prompt",c,Ol),p.shadowBlur=0,p.fillStyle="rgba(255, 255, 255, 0.94)",p.font="400 21px Inter, Arial, sans-serif";let Pi=Fl;for(const gt of Lr)p.fillText(gt,c,Pi),Pi+=K;p.font=`400 ${Yt.fontSize}px Inter, Arial, sans-serif`,p.textBaseline="middle";let Hr=c;Yt.tags.forEach((gt,zr)=>{const Ut=Yt.widths[zr]??160;Ot(p,Hr,vi,Ut,43,22),p.fillStyle="rgba(255, 255, 255, 0.08)",p.fill(),p.strokeStyle="rgba(255, 255, 255, 0.62)",p.lineWidth=1.3,p.stroke(),p.fillStyle="rgba(255, 255, 255, 0.92)",p.fillText(gt,Hr+17,vi+21.5),Hr+=Ut+F}),p.textBaseline="top",p.beginPath(),p.moveTo(c,Si),p.lineTo(c+d,Si),p.strokeStyle="rgba(255, 255, 255, 0.48)",p.lineWidth=1.4,p.stroke(),p.fillStyle="rgba(255, 255, 255, 0.86)",p.font="400 22px Inter, Arial, sans-serif";const Ai="promptcard.net";return p.fillText(Ai,(i-p.measureText(Ai).width)/2,_l),r.toDataURL("image/png")}function Gs(){Br?.remove(),Br=null}async function Xs(){if(!(!l.analysis||!T||Na)){Na=!0;try{const e=await qs(T),t=document.createElement("a");t.href=e,t.download=`promptcard-${Date.now()}.png`,document.body.appendChild(t),t.click(),t.remove(),I("Share card downloaded.","success")}catch(e){I(e instanceof Error?e.message:"Could not create share card.","error")}finally{Na=!1}}}async function si(){if(l.status!=="success"||!T)return;const e=T,t=await mi([f,Q,se],()=>ul());t&&await Vs(t,e)}async function Vs(e,t){try{const a=await ml(e,t);await kr(a),I(u.saveSuccessToast,"success")}catch(a){I(a instanceof Error?a.message:"Screenshot capture failed.","error")}}async function Ks(){if(!(l.status==="hidden"||nt)){nt=!0;try{const e=Tn();_e(),await Promise.all([ai("collapse"),Sr()]),kn(e,"minimized"),rt="collapse",v="minimized",b(),await j("minimized")}finally{nt=!1}}}async function Js(){if(!nt){nt=!0;try{const e=Tn();await ai("expand"),B=null,kn(e,"expanded"),rt="expand",v="expanded",E=!1,Xn(),b(),await j("expanded")}finally{nt=!1}}}async function Qs(){X=!X;const e=f?.querySelector(".minimized-toggle-card");e&&(e.classList.add("is-animating"),e.classList.toggle("is-active",X),e.setAttribute("aria-pressed",X?"true":"false"),window.setTimeout(()=>{e.classList.remove("is-animating")},460)),X?be():W(),window.setTimeout(()=>{j(v)},360)}async function Zs(){l.status==="loading"&&(Te=Math.max(Te+1,Date.now()),O&&(ct(O.placeholderId),O=null)),_e(),X=!1,Et=re?.src??Et,W(),await j("hidden"),we()}async function Pr(e){const t=Rt();if(!t||$e==="opening")return;const a=e??ze;ze=a,_e(),lt(),R=null,j(v),Ja(),$e="opening",he=!1,b();try{await bn(t);const r=await chrome.runtime.sendMessage({type:"OPEN_GENERATOR_SITE",payload:{siteId:a,prompt:t}});if(!r.ok)throw new Error(r.error);Oe(),ti({renderImmediately:!1}),V({copied:!0});const i=fn(a).label;I(`${u.generatorCopiedToastPrefix}${i}${u.generatorFallbackToastSuffix}`,"success")}catch(r){I(r instanceof Error?r.message:u.generatorOpenError,"error")}finally{$e="idle",lt(),b()}}async function li(e,t){const a=await chrome.runtime.sendMessage({type:"REQUEST_ACTION_CAPABILITY",payload:{action:e,target:t}});if(!a.ok||!a.data.token)throw new Error(a.ok?"This action could not be authorized.":a.error);return a.data.token}async function ci(e){const t=await li("analysis",e),a=await chrome.runtime.sendMessage({type:"RUN_ANALYSIS",payload:{target:e,capabilityToken:t}});if(!a.ok)throw new Bt(a.error,{code:a.code??null,action:a.action??null});return a.data}function di(e=2){return new Promise(t=>{const a=r=>{if(r<=0){t();return}window.requestAnimationFrame(()=>a(r-1))};a(e)})}function pi(e){return new Promise((t,a)=>{const r=new Image;r.onload=()=>t(r),r.onerror=()=>a(new Error("Could not read the page screenshot.")),r.src=e})}function ui(e,t="image/jpeg",a=.84){return new Promise((r,i)=>{try{r(e.toDataURL(t,a))}catch{i(new Error("Could not prepare the screenshot crop."))}})}function el(e){const t=e.type.trim().toLowerCase();if(t==="image/jpg")return"image/jpeg";if(t)return t;const a=e.name.toLowerCase();return/\.(jpe?g)$/.test(a)?"image/jpeg":/\.png$/.test(a)?"image/png":/\.webp$/.test(a)?"image/webp":/\.gif$/.test(a)?"image/gif":""}function gi(e){return Bi.has(el(e))}function tl(e){return new Promise((t,a)=>{const r=new FileReader;r.onload=()=>{if(typeof r.result=="string"){t(r.result);return}a(new Error("Could not read this image."))},r.onerror=()=>a(new Error("Could not read this image.")),r.readAsDataURL(e)})}async function al(e,t){const a=Math.max(t.naturalWidth||t.width,t.naturalHeight||t.height),r=Math.min(1,Yi/Math.max(1,a)),i=Math.max(1,Math.round((t.naturalWidth||t.width||1)*r)),n=Math.max(1,Math.round((t.naturalHeight||t.height||1)*r));if(r>=1&&e.length<=48e4)return e;const o=document.createElement("canvas");o.width=i,o.height=n;const s=o.getContext("2d");if(!s)throw new Error("Could not prepare this image preview.");return s.fillStyle="#ffffff",s.fillRect(0,0,i,n),s.drawImage(t,0,0,i,n),ui(o,"image/jpeg",Ui)}async function rl(e){const t=await tl(e),a=await pi(t),r=await al(t,a),i=typeof crypto.randomUUID=="function"?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,10)}`,n=e.name.trim()||"local-image";return{src:`promptcard-local://${i}/${encodeURIComponent(n)}`,sourceType:"local",analysisSrc:t,displaySrc:r,fileName:n,alt:n,pageUrl:window.location.href,naturalWidth:a.naturalWidth||void 0,naturalHeight:a.naturalHeight||void 0}}async function nl(e){const t=[];let a=0,r=0;e.forEach(s=>{if(!gi(s)){a+=1;return}if(s.size>_i){r+=1;return}t.push(s)});const i=t.slice(0,Fi),n=Math.max(0,t.length-i.length),o=await Promise.all(i.map(s=>rl(s)));return a>0?I(u.localImageUnsupported,"error"):r>0?I(u.localImageTooLarge,"error"):n>0?I(u.localImageLimitReached,"error"):e.length!==o.length&&I(u.localImageSkipped,"error"),o}function Ft(){return ne&&l.status!=="hidden"&&l.status!=="loading"&&l.status!=="setup"}function il(){Ft()&&_?.click()}async function ol(e){if(e.length===0){I(u.localImageSkipped,"error");return}if(e.length===1){const r=e[0];_e(),Y={element:null,target:r,point:null},await ut(void 0,!1,{autoSaveToHistory:!0,targetOverride:r,anchorOverride:null,pointOverride:null,preservePosition:!0});return}ie(),await ee(),E||Dt(),E=!0,b();const a=(await Promise.allSettled(e.map(r=>kr(r)))).filter(r=>r.status==="rejected").length;a===0?I(u.saveSuccessToast,"success"):I(`${a}/${e.length} failed`,"error")}async function fi(e){if(Ft()&&e.length!==0)try{const t=await nl(e);await ol(t)}catch(t){I(t instanceof Error?t.message:u.localImageSkipped,"error")}}async function sl(){const e=await li("capture-visible-tab"),t=chrome.runtime.sendMessage({type:"CAPTURE_VISIBLE_TAB",payload:{capabilityToken:e}}),a=new Promise((i,n)=>{window.setTimeout(()=>n(new Error("Screenshot capture timed out. Please try again.")),8e3)}),r=await Promise.race([t,a]);if(!r.ok)throw new Error(r.error);return r.data.dataUrl}function Ar(e,t){const a=window.innerWidth||document.documentElement.clientWidth||1,r=window.innerHeight||document.documentElement.clientHeight||1,i=y(Math.min(e.x,t.x),0,a),n=y(Math.min(e.y,t.y),0,r),o=y(Math.max(e.x,t.x),0,a),s=y(Math.max(e.y,t.y),0,r);return{left:i,top:n,width:Math.max(0,o-i),height:Math.max(0,s-n)}}function Tr(e,t){e.classList.toggle("is-visible",t.width>0&&t.height>0),e.style.left=`${Math.round(t.left)}px`,e.style.top=`${Math.round(t.top)}px`,e.style.width=`${Math.round(t.width)}px`,e.style.height=`${Math.round(t.height)}px`}function ll(e,t){const a=window.innerWidth||document.documentElement.clientWidth||1,r=window.innerHeight||document.documentElement.clientHeight||1,i=e.offsetWidth||142,n=e.offsetHeight||42,o=y(t.left+t.width/2,i/2+12,a-i/2-12),s=t.top+t.height+12,c=t.top-n-12,d=s+n<=r-12?s:y(c,12,r-n-12);e.style.left=`${Math.round(o)}px`,e.style.top=`${Math.round(d)}px`}function cl(){switch(A){case"zh":return"重试";case"ja":return"やり直す";case"en":default:return"Retry"}}function dl(){switch(A){case"zh":return"确认";case"ja":return"確認";case"en":default:return"Confirm"}}function pl(e){const t=window.getComputedStyle(e);return t.display!=="none"&&t.visibility!=="hidden"&&t.opacity!=="0"}async function mi(e,t){const a=e.filter(i=>i instanceof HTMLElement&&pl(i)),r=a.map(i=>i.style.visibility);a.forEach(i=>{i.style.visibility="hidden"});try{return await di(2),await t()}finally{a.forEach((i,n)=>{i.style.visibility=r[n]??""})}}function ul(){if(ie(),!Ae||Nt)return Promise.resolve(null);const e=Ae;return new Promise(t=>{Nt=!0;let a=null,r=null,i=!1;e.innerHTML=`
      <div class="screenshot-selection-backdrop">
        <div class="screenshot-selection-hint">Drag to capture the area to analyze</div>
        <div class="screenshot-selection-box" aria-hidden="true"></div>
        <div class="screenshot-selection-actions" aria-label="Confirm screenshot area">
          <button type="button" class="screenshot-selection-action" data-screenshot-action="retry">${k(cl())}</button>
          <button type="button" class="screenshot-selection-action is-primary" data-screenshot-action="confirm">${k(dl())}</button>
        </div>
        <button type="button" class="screenshot-selection-cancel" aria-label="Cancel screenshot">${Ye()}</button>
      </div>
    `,e.classList.add("is-active");const n=e.querySelector(".screenshot-selection-backdrop"),o=e.querySelector(".screenshot-selection-box"),s=e.querySelector(".screenshot-selection-actions"),c=e.querySelector('[data-screenshot-action="retry"]'),d=e.querySelector('[data-screenshot-action="confirm"]'),h=e.querySelector(".screenshot-selection-cancel");if(!n||!o||!s||!c||!d||!h){Nt=!1,e.classList.remove("is-active"),e.innerHTML="",t(null);return}const g=m=>{i||(i=!0,window.removeEventListener("pointermove",$,!0),window.removeEventListener("pointerup",M,!0),window.removeEventListener("pointercancel",K,!0),window.removeEventListener("keydown",F,!0),Nt=!1,e.classList.remove("is-active"),e.innerHTML="",t(m))},L=()=>{window.removeEventListener("pointermove",$,!0),window.removeEventListener("pointerup",M,!0),window.removeEventListener("pointercancel",K,!0)},x=()=>{s.classList.remove("is-visible")},S=m=>{s.classList.add("is-visible"),window.requestAnimationFrame(()=>ll(s,m))},$=m=>{!m.isTrusted||!a||(m.preventDefault(),m.stopPropagation(),r=Ar(a,{x:m.clientX,y:m.clientY}),Tr(o,r))},M=m=>{if(!m.isTrusted||!a)return;m.preventDefault(),m.stopPropagation(),L();const p=Ar(a,{x:m.clientX,y:m.clientY});if(a=null,p.width<18||p.height<18){r=null,o.classList.remove("is-visible"),x();return}r=p,Tr(o,r),S(r)},K=m=>{m.isTrusted&&(m.preventDefault(),m.stopPropagation(),L(),a=null,r=null,o.classList.remove("is-visible"),x())},F=m=>{!m.isTrusted||m.key!=="Escape"||(m.preventDefault(),m.stopPropagation(),g(null))};n.onpointerdown=m=>{const p=m.target;!m.isTrusted||m.button!==0||p instanceof Element&&p.closest(".screenshot-selection-cancel, .screenshot-selection-actions")||(m.preventDefault(),m.stopPropagation(),x(),a={x:m.clientX,y:m.clientY},r=Ar(a,a),Tr(o,r),window.addEventListener("pointermove",$,!0),window.addEventListener("pointerup",M,!0),window.addEventListener("pointercancel",K,!0))},c.onclick=m=>{m.isTrusted&&(m.preventDefault(),m.stopPropagation(),L(),a=null,r=null,o.classList.remove("is-visible"),x())},d.onclick=m=>{m.isTrusted&&(m.preventDefault(),m.stopPropagation(),!(!r||r.width<18||r.height<18)&&g(r))},h.onclick=m=>{m.isTrusted&&(m.preventDefault(),m.stopPropagation(),g(null))},window.addEventListener("keydown",F,!0)})}async function gl(e){return mi([f,Q,se],async()=>{const t=Ae;if(!t)return e();const a=t.className,r=t.innerHTML,i=t.style.opacity,n=t.style.pointerEvents;t.className=`${a} is-active is-capture-shield`,t.style.opacity="0",t.style.pointerEvents="auto",t.innerHTML='<div class="screenshot-capture-hover-shield" aria-hidden="true"></div>';try{return await di(2),await e()}finally{t.className=a,t.innerHTML=r,t.style.opacity=i,t.style.pointerEvents=n}})}async function fl(e,t,a){const r=window.innerWidth||document.documentElement.clientWidth||1,i=window.innerHeight||document.documentElement.clientHeight||1,n=await pi(e),o=n.naturalWidth/r,s=n.naturalHeight/i,c=Math.round(t.left*o),d=Math.round(t.top*s),h=Math.max(1,Math.round(t.width*o)),g=Math.max(1,Math.round(t.height*s)),x=Math.min(1,1280/Math.max(h,g)),S=Math.max(1,Math.round(h*x)),$=Math.max(1,Math.round(g*x)),M=document.createElement("canvas");M.width=S,M.height=$;const K=M.getContext("2d");if(!K)throw new Error("Could not prepare the screenshot crop.");K.drawImage(n,c,d,h,g,0,0,S,$);const F=await ui(M);return{...a,src:F,sourceType:"local",analysisSrc:F,displaySrc:F,fileName:"screenshot.png",naturalWidth:S,naturalHeight:$}}async function ml(e,t){const a=await gl(()=>sl());return fl(a,e,t)}function hl(e){const t=atob(e),a=new ArrayBuffer(t.length),r=new Uint8Array(a);for(let i=0;i<t.length;i+=1)r[i]=t.charCodeAt(i);return a}function bl(e){return new Blob([hl(e.data)],{type:e.mimeType})}function yl(e){const t=C.find(r=>r.id===e);if(t)return{src:t.imageSrc,pageUrl:t.pageUrl,naturalWidth:t.imageWidth,naturalHeight:t.imageHeight};const a=P.find(r=>r.id===e&&r.status==="failed");return a?{src:a.imageSrc,alt:a.alt,pageUrl:a.pageUrl,naturalWidth:a.imageWidth,naturalHeight:a.imageHeight}:null}function xl(e=8){const t=P.filter(r=>r.status==="failed").map(r=>r.id),a=C.map(r=>r.id);[...t,...a].slice(0,e).forEach(r=>{Ue(r)})}function Ue(e){const t=Pt.get(e);if(t)return Promise.resolve(t);const a=tt.get(e);if(a)return a;const r=yl(e);if(!r)return Promise.resolve(null);const i=chrome.runtime.sendMessage({type:"FETCH_CLIPBOARD_IMAGE",payload:{target:r}}).then(n=>n.ok?(Pt.set(e,n.data),n.data):null).catch(()=>null).finally(()=>{tt.delete(e)});return tt.set(e,i),i}async function wl(e){const t=await createImageBitmap(e),a=document.createElement("canvas");a.width=t.width,a.height=t.height;const r=a.getContext("2d");if(!r)throw t.close(),new Error("Could not prepare image for clipboard.");return r.drawImage(t,0,0),t.close(),new Promise((i,n)=>{a.toBlob(o=>{if(!o){n(new Error("Could not prepare image for clipboard."));return}i(o)},"image/png")})}async function vl(e){if(!navigator.clipboard?.write||typeof ClipboardItem>"u")throw new Error("Image clipboard is not available in this browser.");const t=bl(e),a=t.type==="image/png"?t:await wl(t);await navigator.clipboard.write([new ClipboardItem({"image/png":a})])}async function Sl(e){const t=await Ue(e);if(!t)throw new Error("Could not prepare this history image.");await vl(t)}function Pl(e){if(e.defaultPrevented||!E||l.status==="hidden"||!w||!(e.ctrlKey||e.metaKey)||e.shiftKey||e.altKey||e.key.toLowerCase()!=="c")return!0;const t=e.target;if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement)return typeof t.selectionStart=="number"&&typeof t.selectionEnd=="number"&&t.selectionStart!==t.selectionEnd;if(t instanceof HTMLSelectElement)return!0;const a=window.getSelection(),r=!!(a&&!a.isCollapsed&&a.toString().trim()),i=!!(a?.anchorNode instanceof Node&&f?.contains(a.anchorNode));return r&&!i}function Al(e){if(Pl(e)||!w)return;e.preventDefault(),e.stopPropagation();const t=w;Sl(t).then(()=>{I("History image copied","success")}).catch(a=>{Ue(t),I(a instanceof Error?a.message:"Preparing image. Press Ctrl+C again.","error")})}async function hi(e,t,a){await ee();const r=Go(e,t,a?.promptDrafts);if(Kt.delete(r.id),a?.selectEntry&&(w=r.id),C=await ho(r),Ue(r.id),a?.revealHistory&&(E||Dt(),E=!0),a?.animate){Qe=r.id;try{b(),await new Promise(i=>{window.requestAnimationFrame(()=>{window.requestAnimationFrame(()=>i())})}),await es(r)}finally{Qe=null,b()}return r}return l.status!=="hidden"&&E&&b(),r}async function kr(e){await ee();const t=$t(e),a=l.status!=="hidden";a&&(E||Dt(),E=!0,b());try{const r=await ci(e);await pn({...En(e,r),promptDrafts:{}}),ct(t.id),await hi(e,r,{revealHistory:a,animate:!1,selectEntry:!1,promptDrafts:{}})}catch(r){throw Pn(t.id,r instanceof Error?r.message:"Analysis failed. Please try again."),r}}async function Tl(){if(!ne)return;const e=ce,t=re;if(!(!e||!t)){an(t.src,{promptStatus:"loading"});try{const a=await Pa(),r=await co(),i=await Mt(),n=!r||!i;if(Y={element:e,target:t,point:me},de=!1,W(),await On()){_n(t,e,me);return}const s=t;if(Y={element:e,target:s,point:me},!wr(a)){await ut(s.src,!1,{autoSaveToHistory:!0,markInlinePromptOnboardingComplete:!r});return}if(n){await ee();const c=$t(s);await ut(s.src,!1,{autoSaveToHistory:!0,historyPlaceholderId:c.id,markInlinePromptOnboardingComplete:!r});return}await kr(s),I(u.saveSuccessToast,"success")}finally{an(t.src,{promptStatus:"idle"})}}}async function kl(){if(!ne)return;const e=ce,t=re,a=me??null;de=!1,W();try{const r=await Mt();if(r){v="expanded",ya(r,{preservePosition:!1,anchorPoint:a}),j("expanded");return}if(!e||!t){I(u.missingLatestAnalysis,"error");return}Y={element:e,target:t,point:me},await ut(t.src)}catch(r){I(r instanceof Error?r.message:"打开提示词卡片失败，请稍后重试。","error")}}async function El(){if(Je)return;await ee();const e=!E;if(!e){Je=!0;try{await Sr()}finally{Je=!1}}E=e,E&&!w&&C.length>0&&(w=C[0].id),E&&(xl(),Dt()),b()}function Il(e){if(Qe!==e){if(Wn(),P.some(t=>t.id===e&&t.status==="failed")){rs(e);return}as(e)}}async function Ll(e){if(P.find(a=>a.id===e)){P=P.filter(a=>a.id!==e),Pt.delete(e),tt.delete(e),la(),w===e&&(w=C[0]?.id??null),P.length===0&&C.length===0&&(E=!1,w=null),b();return}await ee(),C=await yo(e),Pt.delete(e),tt.delete(e),Kt.delete(e),w===e&&(w=C[0]?.id??null),C.length===0&&(E=!1,w=null),b()}async function Cl(){await ee(),P=[],C=[],w=null,Kt.clear(),Qe=null,Pt.clear(),tt.clear(),await Promise.all([xo(),la([])]),b()}function ve(){qt=null,bt=null,ue()?.classList.remove("dragging"),window.removeEventListener("pointermove",bi),window.removeEventListener("pointerup",ka),window.removeEventListener("pointercancel",ka)}function bi(e){qt===e.pointerId&&(bt&&Math.hypot(e.clientX-bt.x,e.clientY-bt.y)>4&&(Ua=!0),H={left:e.clientX-Ya.x,top:e.clientY-Ya.y},pt())}function ka(e){qt===e.pointerId&&(Ua&&(Ur=Date.now()+220),ve(),v!=="hidden"&&l.status!=="loading"&&l.status!=="setup"&&j(v))}function Ml(){const e=ue(),t=f?.querySelector("[data-drag-handle='true']");!e||!t||(t.onpointerdown=a=>{const r=a.target;if(!(r instanceof Element)||r.closest("[data-action]")||a.button!==0)return;const i=e.getBoundingClientRect();qt=a.pointerId,bt={x:a.clientX,y:a.clientY},Ua=!1,Ya={x:a.clientX-i.left,y:a.clientY-i.top},H={left:i.left,top:i.top},e.classList.add("dragging"),window.addEventListener("pointermove",bi),window.addEventListener("pointerup",ka),window.addEventListener("pointercancel",ka),a.preventDefault()})}function Ea(e){if(!e)return!1;if(Array.from(e.types??[]).includes("Files"))return!0;const t=Array.from(e.items??[]);return t.length>0?t.some(a=>a.kind==="file"&&(!a.type||a.type.startsWith("image/"))):Array.from(e.files??[]).some(a=>gi(a))}function Ia(e){if(qa===e)return;qa=e;const t=ue(),a=De();t?.classList.toggle("is-local-image-dragover",e),a?.classList.toggle("is-local-image-dragover",e)}function yi(){It=0,Ia(!1)}function Hl(){const e=ue();e&&(e.ondragenter=t=>{!t.isTrusted||!Ft()||!Ea(t.dataTransfer)||(t.preventDefault(),It+=1,Ia(!0))},e.ondragover=t=>{!t.isTrusted||!Ft()||!Ea(t.dataTransfer)||(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="copy"),Ia(!0))},e.ondragleave=t=>{!t.isTrusted||!Ea(t.dataTransfer)||(It=Math.max(0,It-1),It===0&&Ia(!1))},e.ondrop=t=>{if(!t.isTrusted||!Ft()||!Ea(t.dataTransfer))return;t.preventDefault(),t.stopPropagation();const a=Array.from(t.dataTransfer?.files??[]);yi(),fi(a)})}async function zl(e,t){if(Date.now()<Ur){t.preventDefault(),t.stopPropagation();return}const a=e.dataset.action;if(a&&["load-local-image","manual-screenshot","prompt-title","retry","primary-action"].includes(a)&&!t.isTrusted){t.preventDefault(),t.stopPropagation();return}if(a==="minimize-panel"){await Ks();return}if(a==="expand-panel"){await Js();return}if(a==="toggle-inline-actions"){await Qs();return}if(a==="close-shared-panel"){await Zs();return}if(a==="save-api-setup"&&l.status==="setup"){await Zn();return}if(a==="switch-language"&&l.status==="success"){const r=e.dataset.language;if(!r||r===l.language)return;Ps(r),window.setTimeout(()=>{j(v)},320);return}if(a==="toggle-history-rail"&&l.status==="success"){await El();return}if(a==="close-history"){if(Je)return;Je=!0;try{await Sr()}finally{Je=!1}E=!1,b();return}if(a==="clear-history"){t.stopPropagation(),await Cl();return}if(a==="reset-current-prompt"&&l.status==="success"){t.stopPropagation(),Rn();return}if(a==="copy"&&l.status==="success"){await Fs();return}if(a==="load-local-image"&&l.status==="success"){t.preventDefault(),t.stopPropagation(),il();return}if(a==="open-share-card"&&l.status==="success"){await Xs();return}if(a==="manual-screenshot"&&l.status==="success"){t.preventDefault(),t.stopPropagation(),await si();return}if(a==="prompt-title"&&l.status==="success"){t.preventDefault(),t.stopPropagation(),await si();return}if(a==="open-generator-site"&&l.status==="success"){if(rn()){t.preventDefault(),t.stopPropagation();return}await Pr();return}if(a==="toggle-generator-menu"&&l.status==="success"){if(rn()){t.preventDefault(),t.stopPropagation();return}he=!he,b();return}if(a==="open-generator-site-direct"&&l.status==="success"){t.preventDefault(),t.stopPropagation();return}if(a==="toggle-history"){const r=e.dataset.historyId;r&&Il(r);return}if(a==="delete-history"){t.stopPropagation();const r=e.dataset.historyId;r&&await Ll(r);return}if(a==="retry"&&T){const r=Date.now();Te=r;const i=T;await ee();const n=w&&P.some(s=>s.id===w&&s.status==="failed")?w:null;n&&ct(n);const o=$t(i);O={requestId:r,target:i,placeholderId:o.id,markInlinePromptOnboardingComplete:!1},w=o.id,v="expanded",Kr(),V({status:"loading",language:A,analysis:null,error:"",errorCode:null,errorAction:null,copied:!1}),await Er(i,r);return}if(a==="primary-action"&&l.errorAction?.type==="open-support"&&T){await Er(T,Te);return}if(a==="primary-action"||a==="options"){const i=Kn()?.type==="open-billing"?"billing":"account";try{const n=await chrome.runtime.sendMessage({type:"OPEN_POPUP",payload:{focus:i}});if(!n?.ok)throw new Error(n?.error||Bn())}catch{I(Bn(),"error")}}}function xi(){if(!f)return;Ml(),Hl();const e=f.querySelector('[data-api-field="base-url"]'),t=f.querySelector('[data-api-field="api-key"]'),a=f.querySelector('[data-api-field="model"]'),r=(o,s)=>{o&&(o.oninput=()=>{js(s,o.value)},o.onkeydown=c=>{c.key==="Enter"&&(c.preventDefault(),Zn())})};r(e,"baseUrl"),r(t,"apiKey"),r(a,"model");const i=f.querySelector(".prompt-editor");if(i){va();const o=i.closest(".scroll-area"),s=()=>{i.classList.contains("json-view")||(i.classList.add("is-editing"),i.focus({preventScroll:!0}))};i.onfocus=()=>{s()},i.oninput=()=>{if(!i.value.trim()){Rn({keepFocus:!0});return}Z=!1,ae=i.value,le=i.value,is(l.language,i.value),ws(),va()},i.onblur=()=>{const c={containerTop:o?.scrollTop??at,editorTop:i.scrollTop};ma(c),i.classList.remove("is-editing"),Wn(),ma(c)}}f.querySelectorAll("[data-action]").forEach(o=>{o.dataset.action==="open-generator-site-direct"&&(o.onpointerdown=async s=>{if(l.status!=="success"||$e==="opening")return;s.preventDefault(),s.stopPropagation(),Ja();const c=da(o.dataset.siteId);hn(c),await Pr(c)},o.onkeydown=async s=>{if(s.key!=="Enter"&&s.key!==" "||l.status!=="success"||$e==="opening")return;s.preventDefault(),s.stopPropagation(),Ja();const c=da(o.dataset.siteId);hn(c),await Pr(c)}),o.onclick=async s=>{await zl(o,s)},o.dataset.action==="toggle-history"&&(o.onkeydown=s=>{(s.key==="Enter"||s.key===" ")&&(s.preventDefault(),o.click())})})}async function Er(e,t,a=!1){try{const r=await ci(e),i=O?.requestId===t?O:null;if(t!==Te){i&&ur(t,!0);return}await Ji(),l.status==="loading"?As():ge(),pr({});const n=dt(r,l.language);ae=n,le=n,Z=!1,v="expanded",_e(),R=null,V({status:"success",analysis:r,error:"",errorCode:null,errorAction:null,copied:!1}),gr(),j("expanded"),i&&(i.markInlinePromptOnboardingComplete&&po(),ur(t,!1),await hi(i.target,r,{revealHistory:!0,animate:!1,selectEntry:!0})),oe(n);return}catch(r){const i=O?.requestId===t?O:null,n=ur(t,!1,{keepPlaceholder:!0});if(t!==Te){n&&ct(n.placeholderId);return}if(!$r&&zs(r)){await vr({srcUrl:e.src,preferLatest:!1,options:i?{autoSaveToHistory:!0,historyPlaceholderId:i.placeholderId,markInlinePromptOnboardingComplete:i.markInlinePromptOnboardingComplete}:void 0},{target:e,anchor:q,point:R,message:r instanceof Error?r.message:"Please finish API setup first."});return}U(),oe("");const o=r instanceof Bt||r instanceof Error?r.message:"Analysis failed. Please try again.";n&&Pn(n.placeholderId,o),ge(),v="expanded",_e(),R=null,V({status:"error",error:o,errorCode:r instanceof Bt?r.code:null,errorAction:r instanceof Bt?r.action:null,analysis:null,copied:!1}),j("expanded")}}function Ir(e){return e?Array.from(document.images).find(a=>a.currentSrc===e||a.src===e)??null:null}function $l(){const e=window.innerWidth||document.documentElement.clientWidth||0,t=window.innerHeight||document.documentElement.clientHeight||0;let a=null,r=0;for(const i of Array.from(document.images)){if(!i.isConnected||!na(i))continue;const n=ra(i);if(!n)continue;const o=i.getBoundingClientRect(),s=Math.max(o.left,0),c=Math.max(o.top,0),d=Math.min(o.right,e),h=Math.min(o.bottom,t),g=Math.max(0,d-s),L=Math.max(0,h-c),x=g*L;if(x<14e3)continue;const S=x+o.width*o.height*.12;S<=r||(r=S,a={element:i,target:n,point:{x:Math.round(s+g/2),y:Math.round(c+L/2)}})}return a??{element:null,target:null,point:null}}async function ut(e,t=!1,a){if(await Yr(),je()){Ht();return}if(!ne){we({preserveSessionMode:!0});return}await cr({render:!1}),he=!1,$e="idle";const r=Date.now();if(Te=r,O=null,t){const d=await Mt();if(d){R=null,ya(d,{centerPanel:a?.centerPanel===!0}),a?.centerPanel||j("expanded");return}}let i=a?.targetOverride?a.anchorOverride??null:Y.element,n=a?.targetOverride??Y.target;if(a?.targetOverride&&(Y={element:i,target:n,point:a.pointOverride??null},R=a.pointOverride??null),!a?.targetOverride&&(!n||e&&n.src!==e)&&(i=Ir(e),n=i instanceof HTMLImageElement?ra(i):null),!n&&a?.analyzeCurrentPage){const d=$l();i=d.element,n=d.target,Y=d,R=d.point}if(!n){a?.historyPlaceholderId&&ct(a.historyPlaceholderId);const d=await Mt();if(d){R=null,ya(d,{centerPanel:a?.centerPanel===!0}),a?.centerPanel||j("expanded");return}const h=await Pa();if(!wr(h)){await vr({srcUrl:e,preferLatest:t,options:a},{target:null,anchor:null,point:Y.point,message:Aa(h)});return}ie(),q=null,T=null,R=Y.point,a?.preservePosition||(H=null),B=null,v="expanded",U(),V({status:"error",language:A,analysis:null,error:e?u.missingImage:u.missingLatestAnalysis,errorCode:null,errorAction:null,copied:!1}),a?.centerPanel?jt(!0):j("expanded");return}if(await On()){_n(n,i,Y.point),a?.centerPanel&&jt(!0);return}const s=await Pa();if(!wr(s)){await vr({srcUrl:e,preferLatest:t,options:a},{target:n,anchor:i,point:Y.point,message:Aa(s)});return}ie(),Hn(),q=i,T=n,R=Y.point,a?.preservePosition||(H=null),B=null,v="expanded",ve(),oe(""),ge();let c=a?.historyPlaceholderId;a?.autoSaveToHistory&&!c&&(await ee(),c=$t(n).id),a?.autoSaveToHistory&&c&&(O={requestId:r,target:n,placeholderId:c,markInlinePromptOnboardingComplete:a.markInlinePromptOnboardingComplete===!0}),Kr(),V({status:"loading",language:A,analysis:null,error:"",copied:!1}),a?.centerPanel&&jt(!0),await Er(n,r)}function Rl(e){if(!e.isTrusted)return;if(pa()){W();return}if(!ne||!X){W();return}if(e.pointerType==="touch"){W();return}const t=e.target;if(t instanceof Element&&t.closest("#imagetoprompt-root")){Lt();return}const a={x:e.clientX,y:e.clientY};if(me=a,de)return;const r=Qr(e.target,a);if(Et)if(!r.target||r.target.src!==Et)Et=null;else{Ct();return}if(!r.element||!r.target||!na(r.element)){Ct();return}ie(),uo(r.element,r.target,a)}function jl(){de||Ct()}function La(){ir(),l.status!=="hidden"&&(hr(),pt(),Fe()),ba()}function _t(){if(!ft)return;const e=window.location.href;e!==nn&&(nn=e,oa!==null&&window.clearTimeout(oa),oa=window.setTimeout(()=>{oa=null,cr({resetSelection:!0})},go))}function Dl(){const e=t=>{const a=window.history[t];window.history[t]=function(...i){const n=a.apply(this,i);return _t(),n}};e("pushState"),e("replaceState"),window.addEventListener("popstate",_t),window.addEventListener("hashchange",_t),window.addEventListener("focus",_t),document.addEventListener("visibilitychange",()=>{document.visibilityState==="visible"&&_t()})}if(je()){Ht();return}document.addEventListener("contextmenu",e=>{e.isTrusted&&(Y=Qr(e.target,{x:e.clientX,y:e.clientY}))},!0),document.addEventListener("pointermove",Rl,!0),document.addEventListener("pointerleave",jl,!0),document.addEventListener("keydown",Al,!0),document.addEventListener("paste",_o,!0),document.addEventListener("pointerdown",e=>{const t=e.target;he&&(!(t instanceof Element)||!t.closest(".generator-action-group"))&&window.setTimeout(()=>{he&&(he=!1,b())},0),!(t instanceof Element&&(t.closest("#imagetoprompt-root")||t.closest("[data-inline-action]")))&&(de||Ct())},!0),window.addEventListener("scroll",La,!0),window.addEventListener("resize",La),window.visualViewport?.addEventListener("resize",La),window.visualViewport?.addEventListener("scroll",La),chrome.runtime.onMessage.addListener((e,t,a)=>e.type==="OPEN_PANEL"?((async()=>{try{await ut(e.payload?.srcUrl,e.payload?.preferLatest===!0,e.payload?.autoSaveToHistory||e.payload?.analyzeCurrentPage||e.payload?.centerPanel?{autoSaveToHistory:e.payload?.autoSaveToHistory===!0,analyzeCurrentPage:e.payload?.analyzeCurrentPage===!0,centerPanel:e.payload?.centerPanel===!0}:void 0),a({ok:!0,data:{opened:!0}})}catch(r){a({ok:!1,error:r instanceof Error?r.message:"Save failed. Please try again."})}})(),!0):(e.type==="AUTOFILL_GENERATOR_PROMPT"&&e.payload?.siteId&&typeof e.payload.prompt=="string"&&typeof e.payload.requestId=="string"&&(wn({siteId:e.payload.siteId,prompt:e.payload.prompt,requestId:e.payload.requestId}),a({ok:!0,data:{accepted:!0}})),!1)),chrome.storage.onChanged.addListener((e,t)=>{if(t==="sync"){if(Object.prototype.hasOwnProperty.call(e,"systemLanguage")||Object.prototype.hasOwnProperty.call(e,"defaultLanguage")){const a=Wi(e.systemLanguage?.newValue??e.defaultLanguage?.newValue);Fa(a)}if(Object.prototype.hasOwnProperty.call(e,Re)){const a=e[Re]?.newValue;ca(typeof a=="boolean"?a:!0)}return}if(t==="local"){if(Object.prototype.hasOwnProperty.call(e,Re)){const a=e[Re]?.newValue;ca(typeof a=="boolean"?a:!0)}if(Object.prototype.hasOwnProperty.call(e,mt)){const a=e[mt]?.newValue;ze=da(a),l.status==="success"&&b()}if(Object.prototype.hasOwnProperty.call(e,ht)&&(Tt=e[ht]?.newValue===!0,ea=!0),(Object.prototype.hasOwnProperty.call(e,"session")||Object.prototype.hasOwnProperty.call(e,"balance")||Object.prototype.hasOwnProperty.call(e,"serviceMode"))&&jn().then(()=>{l.status!=="hidden"&&b()}),Object.prototype.hasOwnProperty.call(e,Ne)){const a=rr(e[Ne]?.oldValue),r=rr(e[Ne]?.newValue);if(gn(r),ft){if(be(),l.status!=="hidden"){if(r.mode==="hidden"){we({preserveSessionMode:!0});return}pt(),ha();return}if(Ao(a,r))return;mr()}else l.status!=="hidden"&&we({preserveSessionMode:!1})}if(ft&&Object.prototype.hasOwnProperty.call(e,ia)&&v!=="hidden"){if(Ln())return;mr()}}}),(async()=>(Dl(),await Yr(),await Promise.all([ko(),Eo(),tn(),jn()])))()})();
