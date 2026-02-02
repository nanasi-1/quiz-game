import { useEffect, useMemo, useState, type JSX } from "react";
import { CheckCircle, XCircle, RefreshCw, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
  category: string;
  question: string;
  choices: string[];
  answer: number; // index of correct choice
  explanation: string | JSX.Element;
  debug?: boolean // デバッグ用、trueが1つでもあるとそれだけを出題
}

export default function QuizGame() {
  // Sample questions (customize or load remotely)
  const SAMPLE_QUESTIONS: readonly Question[] = useMemo(() => [
    {
      category: "犬",
      question: "イヌの祖先として、遺伝的にも行動的にも最も近いとされる動物は次のうちどれか",
      choices: ["リカオン", "ジャッカル", "ハイイロオオカミ", "コヨーテ"],
      answer: 2,
      explanation: "イヌと最も遺伝的距離が近いのはハイイロオオカミとされるため。",
    },
    {
      category: "犬",
      question: "犬が興奮したり暑かったりするときに、舌を出して浅く速い呼吸をする行動を何と呼ぶでしょう？",
      choices: ["グルーミング", "エコーロケーション", "パンティング", "マーキング"],
      answer: 2,
      explanation: "パンティングは体温を下げるために行う典型的な行動。"
    },
    {
      category: "雑学",
      question: "イギリスの現在の通貨は？",
      choices: ["ユーロ", "ドル", "ポンド", "元"],
      answer: 2,
      explanation: "イギリスの通貨はポンド（GBP）。ユーロはEUの通貨だが、イギリスは導入していない。",
    },
    {
      category: "雑学",
      question: "1989年にアメリカとソ連の間で行われた会談をなんという？",
      choices: ["ポツダム会談", "ヤルタ会談", "ソルタ会談", "マルタ会談"],
      answer: 3,
      explanation: "冷戦終結を象徴する会談で、1989年にアメリカとソ連がマルタで行った。",
    },
    {
      category: "雑学",
      question: "パチンコにおいての1/319の台で319回回した時の当たる確率は約何%？",
      choices: ["25", "63", "319", "100"],
      answer: 1,
      explanation: "1/319を319回試行した際の当選確率は約63%。1 - (318/319)^319 の計算による。",
    },
    {
      category: "雑学",
      question: "イスラム教でタブーとされている色は？",
      choices: ["白", "黒", "金", "茶"],
      answer: 1,
      explanation: "黒は不吉とされる文化的背景があるため。ただし地域差も存在する。",
    },
    {
      category: "雑学",
      question: "世界で一番国名が長い国は？",
      choices: ["アラブ首長国連邦", "中国", "イギリス", "ロシア"],
      answer: 2,
      explanation: "正式名称『グレートブリテン及び北アイルランド連合王国』が非常に長い。",
    },
    {
      category: "雑学",
      question: "中国ではない国は？",
      choices: ["上海", "北京", "台湾", "天津"],
      answer: 2,
      explanation: "台湾は主権を持つ独立した政治主体（中華民国）。中国の都市ではない。",
    },
    {
      category: "雑学",
      question: "ポケモン全国図鑑333番は？",
      choices: ["チルット", "マリルリ", "ポリゴン", "アルセウス"],
      answer: 0,
      explanation: "全国図鑑No.333はチルット。",
    },
    {
      category: "競馬",
      question: "一着賞金が1000万米ドルで、世界一高いレースはどれでしょう？",
      choices: ["凱旋門賞", "ドバイワールドカップ", "ジャパンカップ", "サウジカップ"],
      answer: 3,
      explanation: "サウジカップは1着賞金が1000万ドルで、世界最高額のレースとして知られている。",
    },
    {
      category: "競馬",
      question: "ハーツクライ産駒ではないものはどれでしょう？",
      choices: ["ドウデュース", "ジャスタウェイ", "ダノンザキッド", "リスグラシュー"],
      answer: 2,
      explanation: "ダノンザキッドはジャスタウェイ産駒で、ハーツクライ産駒ではない。",
    },
    {
      category: "軍事",
      question: "この中で空母ではないものはどれでしょう？",
      choices: ["金剛", "赤城", "加賀", "瑞鶴"],
      answer: 0,
      explanation: "金剛は戦艦であり、空母ではない。",
    },
    {
      category: "アニメ",
      question: "キン肉マンの本名は何でしょう？",
      choices: ["キン肉イサオ", "キン肉スグル", "キン肉マスオ", "キン肉アキラ"],
      answer: 1,
      explanation: "キン肉マンの本名はキン肉スグル。",
    },
    {
      category: "宗教",
      question: "仏教用語である『ムラクシャ』の意味はどれでしょう？",
      choices: ["怠惰", "悟り", "怒り", "隠蔽"],
      answer: 2,
      explanation: "ムラクシャ（mūḍha-kleśa）は煩悩の一つで、怒りを指す。",
    },
    {
      category: "歴史",
      question: "妖怪・玉藻前が人間に化けた際の偽名は何でしょう？",
      choices: ["ワカモ", "イズナ", "ヨウキ", "ソダシ"],
      answer: 3,
      explanation: "玉藻前は『ソダシ』という名前で人間に化けていたとされる。",
    },
    {
      category: "競馬",
      question: "オグリキャップと同期ではない競走馬はどれでしょう？",
      choices: ["タマモクロス", "ヤエノムテキ", "サクラチヨノオー", "スーパークリーク"],
      answer: 0,
      explanation: "タマモクロスはオグリキャップより年上で、同期ではない。",
    },
    {
      category: "競馬",
      question: "JRA（日本中央競馬会）が設立された年はいつでしょう？",
      choices: ["1932年", "1945年", "1954年", "1984年"],
      answer: 2,
      explanation: <>JRAは1954年に設立された。<br />
        ・1932年は第一回日本ダービーが行われた年<br />
        ・1945年は日本ダービーが行われなかった年<br />
        ・1984年はグレード制ができた年</>
    },
    {
      category: "企業",
      question: "日本のマクドナルド1号店はどこにあったでしょう？",
      choices: ["渋谷", "新宿", "銀座", "浅草"],
      answer: 2,
      explanation: "1971年、東京・銀座三越に日本1号店が開店した。",
    },
    {
      category: "歴史",
      question: "四大文明の中で最も古いとされているのはどれでしょう？",
      choices: ["エジプト文明", "メソポタミア文明", "中国文明", "アンデス文明"],
      answer: 1,
      explanation: "メソポタミア文明は最古の文明とされている。",
    },
    {
      category: "数学",
      question: "円周率の25桁目はどれでしょう？",
      choices: ["1", "2", "3", "4"],
      answer: 2,
      explanation: "円周率πは 3.1415926535897932384626433… と続き、25桁目は「3」。",
    },
    {
      category: "生物",
      question: "地球上で最も嗅覚が優れている動物はどれでしょう？",
      choices: ["犬", "猫", "人", "ゾウ"],
      answer: 3,
      explanation: "ゾウは嗅覚受容体の数が非常に多く、地上の動物で最も嗅覚が優れているとされている。",
    },
    {
      category: "雑学",
      question: "体温計は最高何度まで計ることができるでしょうか？",
      choices: ["42", "39", "100", "55"],
      answer: 0,
      explanation: "一般的な体温計は最高42度まで測定できるように作られている。",
    },
    {
      category: "雑学",
      question: "運動場の地面を平らにするために使われる道具をなんと呼ぶでしょう？",
      choices: ["イルカ", "トンボ", "カブトムシ", "ムカデ"],
      answer: 1,
      explanation: "運動場整備に使われるT字型の道具は『トンボ』と呼ばれる。",
    },
    {
      category: "雑学",
      question: "正月の遊びに使われ、室町時代には胡鬼板と呼ばれていたおもちゃはなんと呼ぶでしょうか？",
      choices: ["手毬", "蹴鞠", "羽子板", "餅つき"],
      answer: 2,
      explanation: "羽子板は室町時代に『胡鬼板（こきいた）』と呼ばれていた。",
    },
    {
      category: "国語",
      question: "慣用句で、自分が犯した悪行のために自ら苦しむことを『身から出た何』と言うでしょう？",
      choices: ["油", "銹", "錆", "銅"],
      answer: 2,
      explanation: "正しい慣用句は『身から出た錆』。",
    },
    {
      category: "地理",
      question: "現在世界でいちばん高い山はエベレストですが、正式に測定される前に最も標高が高いと考えられていた山はどれでしょう？",
      choices: ["富士山", "K2", "エベレスト", "マカーレ"],
      answer: 1,
      explanation: "エベレストが正確に測定される以前は、K2が世界最高峰と考えられていた。",
    },
    {
      category: "アニメ",
      question: "ナルト疾風伝の主人公の名前の案であった名前はなんでしょう？",
      choices: ["ミナト", "サスケ", "オビト", "メンマ"],
      answer: 3,
      explanation: "主人公ナルトの名前案として『メンマ』が検討されていた。",
    },
    {
      category: "スポーツ",
      question: "日本代表の選手でW杯3大会連続ゴールを決めた選手は誰でしょう？",
      choices: ["香川真司", "本田圭佑", "中村俊輔", "清原和博"],
      answer: 1,
      explanation: "本田圭佑は2010・2014・2018年のW杯すべてでゴールを記録した。",
    },
    {
      category: "雑学",
      question: "アメリカ合衆国大統領が住んでいる官邸はどこでしょうか？",
      choices: ["ブラックハウス", "ホワイトハウス", "グリーンハウス", "スナップハウス"],
      answer: 1,
      explanation: "アメリカ大統領の官邸はホワイトハウス。",
    },
    {
      category: "雑学",
      question: "日本一利用者の多い駅はどこでしょう？",
      choices: ["東京駅", "小田原駅", "新宿駅", "横浜駅"],
      answer: 2,
      explanation: "新宿駅は世界でも最も利用者数が多い駅として知られている。",
    },
    {
      category: "スポーツ",
      question: "ウサイン・ボルトの100m走世界記録は何秒でしょうか？",
      choices: ["9.67", "9.25", "9.56", "9.58"],
      answer: 3,
      explanation: "2009年の世界陸上で9.58秒の世界記録を樹立した。",
    },
    {
      category: "雑学",
      question: "アメリカ合衆国の州の数はいくつでしょう？",
      choices: ["57", "49", "51", "50"],
      answer: 3,
      explanation: "アメリカ合衆国は50州で構成されている。",
    },
    {
      category: "スポーツ",
      question: "サッカーで使われる表現『無敵艦隊』はどこの国を指すでしょう？",
      choices: ["ドイツ", "韓国", "日本", "スペイン"],
      answer: 3,
      explanation: "黄金期のスペイン代表が『無敵艦隊』と呼ばれた。",
    },
    {
      category: "スポーツ",
      question: "F1で2021年から2024年まで連覇を成し遂げたF1レーサーは誰でしょうか？",
      choices: ["フェルスタッペン", "アイルトン・セナ", "ジョナサン・ジョースター", "マックス・フェルスタッペン"],
      answer: 3,
      explanation: "マックス・フェルスタッペンが4年連続でワールドチャンピオンとなった。",
    },
    {
      category: "犬",
      question: "犬の持つ感覚のうち、人間と比べて最も優れており、非常に発達しているのはどれでしょう？",
      choices: ["味覚（舌）", "聴覚（耳）", "視覚（目）", "嗅覚（鼻）"],
      answer: 3,
      explanation: "犬は嗅覚が非常に発達しており、人間の数万倍ともいわれる嗅覚能力を持っている。",
    },
    {
      category: "犬",
      question: "犬が食べてはいけないとされ、中毒を起こす原因となる成分テオブロミンを多く含む食品はどれでしょう？",
      choices: ["チョコレート", "牛乳", "ぶどう", "鶏の骨"],
      answer: 0,
      explanation: "チョコレートに含まれるテオブロミンは犬が分解できず、中毒を引き起こす。",
    },
    {
      category: "犬",
      question: "犬の成犬が持つ歯の合計本数として、最も一般的なのはどれでしょう？",
      choices: ["28本", "32本", "42本", "38本"],
      answer: 2,
      explanation: "成犬の永久歯は上下合わせて42本が一般的。",
    },
    {
      category: "犬",
      question: "犬が寝る前や座る前に、その場でくるくる回る行動をとる主な理由として、野生時代からの習性として考えられているものはどれでしょう？",
      choices: [
        "寝床を快適にし、安全を確認するため",
        "飼い主の注意を引くため",
        "体のノミやダニを振り払うため",
        "消化を助けるため"
      ],
      answer: 0,
      explanation: "野生時代の名残で、草を踏みならし安全を確認する行動とされている。",
    },
    {
      category: "犬",
      question: "犬の目の病気で、水晶体が白く濁り、進行すると視力が失われてしまう病気は何でしょう？",
      choices: ["緑内障", "白内障", "角膜炎", "結膜炎"],
      answer: 1,
      explanation: "白内障は水晶体が白く濁り、進行すると視力障害を引き起こす。",
    },
    {
      category: "犬",
      question: "愛犬が迷子になったときに、動物病院や保健所などで専用のリーダーを用いて個体識別を可能にするため、体内に埋め込む小さな装置は何でしょう？",
      choices: ["GPS発信機", "マイクロチップ", "ペースメーカー", "体温計"],
      answer: 1,
      explanation: "マイクロチップには識別番号が記録され、飼い主情報を照会できる。",
    },
    {
      category: "犬",
      question: "犬の足にある、他の指よりも高い位置にある小さな指（または爪）のことを何と呼ぶでしょう？",
      choices: ["狼爪", "肉球", "ひづめ", "指骨（しかく）"],
      answer: 0,
      explanation: "この指は『狼爪（ろうそう）』と呼ばれ、一部の犬に見られる。",
    },
    {
      category: "犬",
      question: "以下の犬種のうち、元々ネズミやアナグマなどの害獣を穴から追い出す目的で品種改良された犬種はどれでしょう？",
      choices: [
        "ダックスフンド",
        "ボーダー・コリー",
        "ラブラドール・レトリバー",
        "グレート・ピレニーズ"
      ],
      answer: 0,
      explanation: "ダックスフンドは胴が長く、巣穴に入る狩猟用に改良された犬種。",
    },
    {
      category: "犬",
      question: "犬が汗をかくのは体のどこでしょう？",
      choices: ["全身", "耳", "お腹", "肉球"],
      answer: 3,
      explanation: "犬は主に肉球から汗をかき、体温調節は舌を使ったパンティングで行う。",
    },
    {
      category: "犬",
      question: "次のうち正しくないものはどれでしょう？",
      choices: [
        "水かきのある足を持つ犬種がいる",
        "アメリカで最も人気なのはラブラドール・レトリバー",
        "吠えない犬種は存在しない",
        "最も長生きした犬は29歳"
      ],
      answer: 2,
      explanation: "バセンジーなど、ほとんど吠えない犬種は存在する。",
    }

  ], []);

  // Settings & state
  // const [questions, setQuestions] = useState<readonly Question[]>(SAMPLE_QUESTIONS);
  const [timeLimitSec, setTimeLimitSec] = useState(20);

  const [stage, setStage] = useState("start"); // start | quiz | result
  const [shuffled, setShuffled] = useState<readonly Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(timeLimitSec);
  const [remainingId, setRemainingId] = useState<number | null>(null);
  const [highscore, setHighscore] = useState(() => Number(localStorage.getItem("quiz_highscore") || 0));
  const [choices, setChoices] = useState<readonly string[]>([]);

  useEffect(() => {
    localStorage.setItem("quiz_highscore", String(highscore));
  }, [highscore]);

  useEffect(() => {
    // reset selection when question changes
    setSelected(null);
  }, [index, stage]);

  function shuffleArray<T>(array: readonly T[]) {
    let pool = array.slice();
    pool = pool.sort(() => Math.random() - 0.5);
    return pool.slice(0, pool.length);
  }

  function startQuiz() {
    const shuffled = shuffleArray(SAMPLE_QUESTIONS);
    const picked = shuffled.find(i => i.debug) ? shuffled.filter(i => i.debug) : shuffled;
    setShuffled(picked);
    setIndex(0);
    setScore(0);
    setStage("quiz");
    setChoices(shuffleArray(picked[0].choices));
    startTimer()
  }

  function handleSelect(i: number) {
    if (selected !== null) return;
    setSelected(i);
    clearInterval(remainingId!);
    // immediate feedback handled by UI and scoring on submit
  }

  function startTimer() {
    setRemaining(timeLimitSec);
    const tid = setInterval(() => {
      setRemaining(r => r - 1);
      setRemainingId(tid);
    }, 1000);
  }

  useEffect(() => {
    if (remaining <= 1) {
      handleSubmit(null, true, shuffled);
      clearInterval(remainingId!);
    }
  }, [remaining, remainingId]);

  function handleSubmit(choiceIndex: number | null, timedOut = false, questions: readonly Question[]) {
    const q = questions[index];
    const correct = q && q.answer === choiceIndex;
    if (!timedOut && typeof choiceIndex === "number" && correct) setScore((s) => s + 1);

    // small delay to show feedback
    setTimeout(() => {
      if (index + 1 < SAMPLE_QUESTIONS.length) {
        setIndex((i) => i + 1);
        setSelected(null);
        setChoices(shuffleArray(questions[index + 1].choices));
        startTimer();
      } else {
        finishQuiz();
      }
    }, 300);
  }

  function finishQuiz() {
    setStage("result");
    if (score > highscore) setHighscore(score);
  }

  function resetAll() {
    setStage("start");
    setTimeLimitSec(20);
    setIndex(0);
    setSelected(null);
    setScore(0);
  }

  function shareResult() {
    const text = `I scored ${score}/${shuffled.length} on QuizGame!`;
    if (navigator.share) {
      navigator.share({ title: "Quiz Result", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("結果をコピーしました: " + text);
    }
  }

  // UI components
  if (stage === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
          <header className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Quiz Game</h1>
            <div className="text-sm text-slate-500">Highscore: {highscore}</div>
          </header>

          <section className="text-slate-800 mb-4">
            ようこそ！このクイズゲームはあなたの知識を試すためのものです。<br />
            準備ができたら、下のスタートボタンから開始してください。<br />
          </section>

          <section className="grid gap-4">
            <div className="flex gap-3">
              <button className="flex-1 py-2 rounded-xl bg-sky-600 text-white font-medium cursor-pointer" onClick={startQuiz}>
                スタート
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (stage === "quiz") {
    const q = shuffled[index];
    const progress = Math.round(((index + 1) / shuffled.length) * 100);

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
          <header className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-slate-500">{q.category}</div>
              <div className="text-lg font-medium">{`Q${index + 1}. ${q.question}`}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Score</div>
              <div className="text-xl font-semibold">{score}</div>
            </div>
          </header>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-sky-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="mb-3 text-sm text-slate-600">残り: {remaining}s</div>

          <div className="grid gap-3">
            {choices.map((c, i) => {
              const index = q.choices.indexOf(c);
              const isSelected = selected === index;
              const isCorrect = q.answer === index;
              const showFeedback = selected !== null || remaining === 0;

              let ring = "";
              if (showFeedback) {
                if (isCorrect) ring = "ring-2 ring-emerald-300";
                else if (isSelected && !isCorrect) ring = "ring-2 ring-red-300";
              } else if (isSelected) {
                ring = "ring-2 ring-sky-200";
              }

              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(index)}
                  className={`p-3 text-left rounded-lg border flex items-center justify-between ${ring} bg-white`}
                >
                  <div>
                    <div className="font-medium">{c}</div>
                    <div className="text-xs text-slate-400">選択肢 {i + 1}</div>
                  </div>

                  <div className="w-10 h-10 flex items-center justify-center">
                    {showFeedback && isCorrect && <CheckCircle className="text-emerald-500" />}
                    {showFeedback && isSelected && !isCorrect && <XCircle className="text-red-500" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {(selected !== null || remaining === 0) && (
            <div className="mt-4 p-3 rounded-lg bg-slate-100 text-sm text-slate-700">
              <div className="font-medium mb-1">解説</div>
              <div>{q.explanation}</div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <button
              className="px-4 py-2 rounded-md border"
              onClick={() => handleSubmit(selected, false, shuffled)}
              disabled={selected === null}
            >
              next
            </button>

            <div className="text-sm text-slate-500">{index + 1}/{shuffled.length}</div>
          </div>
        </div>
      </div>
    );
  }

  // result
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 text-center">
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-xl font-semibold mb-2">結果</div>
          <div className="text-4xl font-bold mb-4">{score} / {shuffled.length}</div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white" onClick={shareResult}>
              <Share2 /> 共有
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border" onClick={() => { resetAll(); }}>
              <RefreshCw /> もう一回設定
            </button>
          </div>

          <div className="text-sm text-slate-500 mb-3">ハイスコア: {highscore}</div>

          <div className="mt-4 text-left">
            <h3 className="font-medium mb-2">問題一覧</h3>
            <ol className="list-decimal pl-5 space-y-2">
              {shuffled.map((q, idx) => (
                <li key={idx} className="text-sm">
                  <div className="font-medium">{q.question}</div>
                  <div className="text-xs text-slate-500">回答: {q.choices[q.answer]}
                    <div className="text-xs text-slate-400 mt-1">解説: {q.explanation}</div></div>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
