export type FieldType = 'text' | 'textarea' | 'select' | 'number'

export type Field = {
  id: string
  label: string
  hint: string
  type: FieldType
  options?: string[]
  placeholder?: string
}

export type Step = {
  id: string
  number: number
  title: string
  subtitle: string
  description: string
  icon: string
  fields: Field[]
}

export const steps: Step[] = [
  {
    id: 'step1',
    number: 1,
    title: '自院の棚卸し',
    subtitle: 'まず、あなた自身の武器を整理する',
    description: '商品を作る前に、自分が何を持っているかを把握することが最初の一歩です。資格、技術、経験、設備、すべてが商品の材料になります。',
    icon: '1',
    fields: [
      { id: 'qualifications', label: '保有資格', hint: '国家資格・民間資格すべて書き出してください', type: 'textarea', placeholder: '例: 柔道整復師、鍼灸師、あん摩マッサージ指圧師' },
      { id: 'techniques', label: '学んだ技術・受講したセミナー', hint: '今まで投資してきた技術を全部出しましょう', type: 'textarea', placeholder: '例: 神経整体、内臓調整、頭蓋仙骨療法、AKA' },
      { id: 'experience_years', label: '臨床年数', hint: '', type: 'number', placeholder: '例: 10' },
      { id: 'total_patients', label: '施術した延べ人数（だいたいでOK）', hint: '1日10人×250日×年数で概算できます', type: 'text', placeholder: '例: 約30,000人' },
      { id: 'top_symptoms', label: '得意な症状TOP5', hint: '「この症状なら任せて」と自信を持って言える症状', type: 'textarea', placeholder: '例: 1.自律神経失調症 2.慢性腰痛 3.頭痛 4.肩こり 5.不眠' },
      { id: 'equipment', label: '導入している機器・設備', hint: '他院にないものがあればそれだけで差別化になります', type: 'textarea', placeholder: '例: 姿勢分析AI、超音波エコー、酸素カプセル' },
      { id: 'clinic_features', label: '院の空間・立地の特徴', hint: '患者さんが「いいな」と感じるポイントは？', type: 'textarea', placeholder: '例: 完全個室、駅徒歩3分、カフェのような内装、キッズスペースあり' },
      { id: 'origin_story', label: '治療家になった原点（ストーリー）', hint: 'なぜこの仕事を選んだのか。これが最強のUSPになることも', type: 'textarea', placeholder: '例: 学生時代に腰の怪我で選手生命を絶たれ、整体で救われた経験から...' },
    ],
  },
  {
    id: 'step2',
    number: 2,
    title: '患者分析',
    subtitle: '今来ている患者さんの傾向を知る',
    description: '今の患者さんのデータが、次の商品設計のヒントになります。「もっとこういう人を集めたい」が見えてきます。',
    icon: '2',
    fields: [
      { id: 'patient_gender', label: '患者さんの男女比', hint: '', type: 'select', options: ['女性が多い（7:3以上）', 'やや女性が多い（6:4）', 'ほぼ半々', 'やや男性が多い（4:6）', '男性が多い（3:7以上）'] },
      { id: 'patient_age', label: '多い年齢層（複数OK）', hint: '', type: 'textarea', placeholder: '例: 40-50代女性が中心、次に30代' },
      { id: 'visit_reasons', label: '来院理由TOP5', hint: '一番多い主訴から順に', type: 'textarea', placeholder: '例: 1.腰痛 2.肩こり 3.頭痛 4.自律神経 5.産後の不調' },
      { id: 'repeat_rate', label: '2回目リピート率', hint: '把握していなければ「未計測」でOK。計測すること自体が大事', type: 'text', placeholder: '例: 約70%、または未計測' },
      { id: 'average_ltv', label: '1人あたりの平均LTV（生涯売上）', hint: '概算でOK。平均単価×平均通院回数', type: 'text', placeholder: '例: 約80,000円、またはわからない' },
      { id: 'review_praise', label: '口コミで多い褒め言葉TOP3', hint: 'Googleの口コミを見返してみてください', type: 'textarea', placeholder: '例: 1.説明が丁寧 2.原因がわかった 3.他と全然違う' },
      { id: 'ideal_patient', label: '「この人をもっと集めたい」と思う理想の患者像', hint: '実際の患者さんを1人思い浮かべてください', type: 'textarea', placeholder: '例: 40代女性、デスクワーク、慢性的な不調で本気で治したいと思っている人' },
    ],
  },
  {
    id: 'step3',
    number: 3,
    title: '競合分析',
    subtitle: '周りの院と何が違うかを明確にする',
    description: '患者さんはあなたの院だけを見ているわけではありません。比較されたときに「ここがいい」と選ばれる理由を作りましょう。',
    icon: '3',
    fields: [
      { id: 'competitors', label: '半径3km以内の同業院（3-5院）', hint: 'Googleマップで「整体」「整骨院」で検索してみてください', type: 'textarea', placeholder: '例: A整骨院（駅前、口コミ4.5）、B整体（骨盤矯正推し）、C鍼灸院（保険中心）' },
      { id: 'competitor_prices', label: '競合の価格帯', hint: 'HPを見て確認', type: 'textarea', placeholder: '例: A院 初回3,980円/通常5,500円、B院 初回2,980円/通常6,600円' },
      { id: 'competitor_strengths', label: '競合の強み（正直に）', hint: '敵を知ることが差別化の第一歩', type: 'textarea', placeholder: '例: A院はSNSが強い、B院は価格が安い、C院は医師と連携している' },
      { id: 'win_points', label: '自院が競合に勝てるポイント', hint: '技術・接客・空間・検査・フォロー、何でもOK', type: 'textarea', placeholder: '例: 検査が圧倒的に丁寧、完全個室で落ち着ける、施術後のLINEフォロー' },
      { id: 'lose_points', label: '正直、競合に負けているポイント', hint: 'ここを認識できると改善策が見えてきます', type: 'textarea', placeholder: '例: HP・SNSの発信量、口コミの数、立地のわかりやすさ' },
      { id: 'nobody_does', label: 'この地域で誰もやっていないこと', hint: 'これがあれば最強のポジションが取れます', type: 'textarea', placeholder: '例: 自律神経専門を掲げている院がない、AI姿勢分析をやっている院がない' },
    ],
  },
  {
    id: 'step4',
    number: 4,
    title: 'ターゲット設定',
    subtitle: 'たった1人の理想の患者像を決める',
    description: '「みんなに来てほしい」は誰にも届きません。たった1人を具体的にイメージすることで、刺さるメッセージが作れます。',
    icon: '4',
    fields: [
      { id: 'persona_name', label: 'ペルソナの名前（仮名でOK）', hint: '実在の患者さんをモデルにすると書きやすい', type: 'text', placeholder: '例: 田中美穂さん' },
      { id: 'persona_age_job', label: '年齢・性別・職業', hint: '', type: 'text', placeholder: '例: 42歳 女性 事務職（デスクワーク）' },
      { id: 'persona_family', label: '家族構成・住まいエリア', hint: '', type: 'text', placeholder: '例: 夫と小学生の子供2人、院から車で10分' },
      { id: 'persona_main_symptom', label: '一番つらい症状', hint: '', type: 'text', placeholder: '例: 慢性的な頭痛。週3回は頭痛薬を飲んでいる' },
      { id: 'persona_sub_symptoms', label: '他にも困っていること', hint: '主訴以外に抱えている不調', type: 'textarea', placeholder: '例: 肩こり、目の疲れ、睡眠の質が悪い、イライラしやすい' },
      { id: 'persona_tried', label: '今まで試した対処法', hint: 'なぜそれで解決しなかったかも考えてみてください', type: 'textarea', placeholder: '例: 整形外科→異常なし、マッサージ→一時的、市販の頭痛薬→依存が心配' },
      { id: 'persona_search', label: 'どうやって院を探すか', hint: '情報収集の行動パターン', type: 'select', options: ['Google検索', 'Googleマップ', 'Instagram', '友人の口コミ', 'チラシ・看板', '複数の方法を使う'] },
      { id: 'persona_worry', label: '来院前の不安・心配事', hint: '初めての院に行く時の心理的ハードル', type: 'textarea', placeholder: '例: 本当に治るの？高額な回数券を売りつけられないか？痛くないか？' },
      { id: 'persona_budget', label: '月にかけられる予算感', hint: '', type: 'select', options: ['月5,000円以下', '月5,000-10,000円', '月10,000-20,000円', '月20,000-30,000円', '月30,000円以上', '効果があれば金額は気にしない'] },
    ],
  },
  {
    id: 'step5',
    number: 5,
    title: 'Before/After設計',
    subtitle: '患者さんの「今の苦痛」と「理想の未来」を言語化する',
    description: '患者さんは「痛みを取ること」にお金を払うのではなく、「痛みが取れた先の生活」にお金を払います。3つのレベルで深掘りしましょう。',
    icon: '5',
    fields: [
      { id: 'before_body', label: 'Before：身体の苦痛', hint: '痛み・しびれ・だるさなどの身体症状', type: 'textarea', placeholder: '例: 毎朝起きた瞬間から頭が重い。デスクワーク2時間で首が限界になる' },
      { id: 'before_life', label: 'Before：生活への支障', hint: '仕事・家事・趣味など日常生活で困っていること', type: 'textarea', placeholder: '例: 子供の運動会で写真を撮るのもつらい。休日は寝て過ごすことが多い' },
      { id: 'before_emotion', label: 'Before：感情面の苦痛', hint: '不安・イライラ・諦めなどの気持ち', type: 'textarea', placeholder: '例: 「一生この体と付き合うのか」と将来が不安。家族にイライラしてしまう自己嫌悪' },
      { id: 'after_body', label: 'After：身体がどう変わるか', hint: '', type: 'textarea', placeholder: '例: 朝スッキリ起きられる。8時間デスクワークしても首肩が軽い' },
      { id: 'after_life', label: 'After：生活がどう変わるか', hint: '', type: 'textarea', placeholder: '例: 休日は家族と出かけられる。趣味のヨガを再開できた' },
      { id: 'after_emotion', label: 'After：気持ちがどう変わるか', hint: '', type: 'textarea', placeholder: '例: 将来の不安がなくなった。自分の体に自信が持てるようになった' },
      { id: 'if_ignore', label: 'このまま放置するとどうなるか', hint: '危機感ではなく、事実として伝えるべきリスク', type: 'textarea', placeholder: '例: 頭痛薬の量が増える、睡眠障害に発展する、仕事のパフォーマンスがさらに落ちる' },
      { id: 'word_of_mouth', label: '患者さんが友人に紹介する時、何と言いそう？', hint: 'これがそのまま口コミ・キャッチコピーになります', type: 'textarea', placeholder: '例: 「原因をちゃんと調べてくれる整体で、頭痛が嘘みたいに治った」' },
    ],
  },
  {
    id: 'step6',
    number: 6,
    title: 'USP・ポジショニング',
    subtitle: '「あなたの院が選ばれる理由」を言葉にする',
    description: 'USPは単体の要素ではなく「掛け算」で作ります。地域 × 症状 × 手法の組み合わせで、オンリーワンのポジションを取りましょう。',
    icon: '6',
    fields: [
      { id: 'usp_area', label: '地域名', hint: 'SEO・MEOでも使う地域ワード', type: 'text', placeholder: '例: 横浜市港北区' },
      { id: 'usp_symptom', label: '特化する症状', hint: '1つに絞るのが最強。多くても3つまで', type: 'text', placeholder: '例: 自律神経の不調（頭痛・めまい・不眠）' },
      { id: 'usp_method', label: '独自の手法・アプローチ', hint: '他院と違う切り口', type: 'text', placeholder: '例: 神経整体（脳と神経の調整）' },
      { id: 'usp_formula', label: '一言で表すと？（上の3つを組み合わせて）', hint: '「（地域）で唯一の（手法）で（症状）を改善する院」', type: 'textarea', placeholder: '例: 横浜市港北区で唯一の神経整体で、自律神経の不調を根本改善する院' },
      { id: 'why_choose_3', label: '患者さんがあなたの院を選ぶ理由3つ', hint: '技術・検査・接客・空間・フォロー、どの切り口でもOK', type: 'textarea', placeholder: '例:\n1. 30分かけた検査で原因を徹底的に調べる\n2. 神経レベルからアプローチするので戻りにくい\n3. LINEで24時間相談できる安心感' },
      { id: 'difference_3', label: '他院との違い3つ', hint: 'Step3の競合分析を踏まえて', type: 'textarea', placeholder: '例:\n1. 痛みの場所ではなく神経の原因から施術する\n2. 毎回の検査で改善を数値で見せる\n3. 施術計画書を作成して患者と共有する' },
      { id: 'elevator_pitch', label: '3行で院を紹介してください', hint: '30秒で伝わるエレベーターピッチ', type: 'textarea', placeholder: '例:\n当院は自律神経の不調に特化した神経整体院です。\n独自の検査法で痛みの「本当の原因」を特定し、脳と神経からアプローチします。\n薬に頼らず、自分の力で回復できる体を目指します。' },
    ],
  },
  {
    id: 'step7',
    number: 7,
    title: '商品設計',
    subtitle: 'いよいよメニューと価格を決める',
    description: 'ここまでの情報をもとに、具体的な商品を設計します。松竹梅の3段階で、患者さんが選びやすい構成にしましょう。',
    icon: '7',
    fields: [
      { id: 'product_name', label: '商品名（メニュー名）', hint: '症状名やベネフィットが入るとわかりやすい', type: 'text', placeholder: '例: 自律神経リセットプログラム' },
      { id: 'product_subtitle', label: 'サブタイトル', hint: '一言で価値を伝える', type: 'text', placeholder: '例: 薬に頼らない体を3ヶ月で取り戻す' },
      { id: 'product_ume', label: '梅プラン（ベーシック）の内容と価格', hint: '入口商品。比較基準になる', type: 'textarea', placeholder: '例: 施術のみ 1回6,600円 / 6回券 33,000円' },
      { id: 'product_take', label: '竹プラン（スタンダード）の内容と価格', hint: '本命商品。ここに誘導する', type: 'textarea', placeholder: '例: 検査＋施術＋セルフケア指導 1回8,800円 / 6回券 44,000円' },
      { id: 'product_matsu', label: '松プラン（プレミアム）の内容と価格', hint: '高単価。竹が安く見える効果も', type: 'textarea', placeholder: '例: 全12回プログラム（検査＋施術＋セルフケア＋食事指導＋LINE相談） 165,000円' },
      { id: 'added_value', label: '施術以外の付加価値', hint: 'これが価格の根拠になります', type: 'textarea', placeholder: '例: セルフケア動画、LINE相談、月次レポート、栄養指導、姿勢分析レポート' },
      { id: 'duration_visits', label: '通院期間と回数の目安', hint: '治療計画の根拠', type: 'textarea', placeholder: '例: 週1-2回×3ヶ月が基本。改善後は月1-2回のメンテナンス' },
      { id: 'guarantee', label: '保証やリスクリバーサル', hint: '患者さんの「買わない理由」を潰す', type: 'textarea', placeholder: '例: 3回受けて変化を感じなければ残り全額返金、初回は施術後に継続を判断でOK' },
    ],
  },
  {
    id: 'step8',
    number: 8,
    title: '販売導線',
    subtitle: '集客から提案、リピートまでの流れを設計する',
    description: 'いい商品を作っても、売れる「流れ」がなければ意味がありません。患者さんの行動に沿った導線を設計しましょう。',
    icon: '8',
    fields: [
      { id: 'channel_main', label: 'メインの集客チャネル', hint: 'まず1-2つに集中する', type: 'select', options: ['Google検索（SEO/PPC）', 'Googleマップ（MEO）', 'Instagram', 'YouTube', 'チラシ・ポスティング', 'Facebook広告', '口コミ・紹介', '複数を組み合わせ'] },
      { id: 'first_visit_flow', label: '初回来院の流れ', hint: 'カウンセリング→検査→施術→説明の順番', type: 'textarea', placeholder: '例:\n1. 問診票記入（5分）\n2. カウンセリング（10分）\n3. 検査（15分）\n4. 施術（30分）\n5. 検査の比較・説明（10分）\n6. 治療計画の提案（5分）' },
      { id: 'closing_talk', label: '治療計画の提案方法', hint: '口頭だけでなく書面があると成約率UP', type: 'textarea', placeholder: '例: 施術計画書を使って、検査結果→原因→改善の見通し→おすすめプランの順に説明' },
      { id: 'follow_up', label: 'リピートを促す仕組み', hint: '次回予約・LINEフォロー・リマインドなど', type: 'textarea', placeholder: '例: 施術後にLINEでお礼＋セルフケア動画送信、次回予約は当日にその場で' },
      { id: 'referral_system', label: '紹介を生む仕組み', hint: '紹介カード・口コミ依頼のタイミングなど', type: 'textarea', placeholder: '例: 3回目の施術後に口コミ依頼、紹介カードは常時渡す、紹介特典は双方に' },
      { id: 'upsell_plan', label: '回数券終了後の次の提案', hint: '卒業 or メンテナンスプラン or サブスク', type: 'textarea', placeholder: '例: 回数券卒業時に月1回のメンテナンスサブスク（月額8,800円）を提案' },
    ],
  },
  {
    id: 'step9',
    number: 9,
    title: '数値計画',
    subtitle: '目標の月商を達成するために必要な数字を知る',
    description: '最後に、この商品で目標を達成するために何人集める必要があるかを逆算します。数字で見ると「やるべきこと」が明確になります。',
    icon: '9',
    fields: [
      { id: 'revenue_target', label: '目標月商', hint: '', type: 'select', options: ['50万円', '80万円', '100万円', '120万円', '150万円', '200万円', '250万円', '300万円以上'] },
      { id: 'average_price', label: '1回あたりの平均単価（目標）', hint: '竹プランの単価が目安', type: 'text', placeholder: '例: 8,800円' },
      { id: 'visits_per_month', label: '1人あたりの月間来院回数（目標）', hint: '', type: 'select', options: ['月1回', '月2回', '月3回', '月4回（週1）', '月8回（週2）'] },
      { id: 'needed_patients', label: '目標達成に必要な稼働患者数（計算してみて）', hint: '月商 ÷ 単価 ÷ 月間来院回数 = 必要人数', type: 'text', placeholder: '例: 100万円 ÷ 8,800円 ÷ 4回 = 約29人' },
      { id: 'current_patients', label: '現在の稼働患者数', hint: '月に1回以上来院している人の数', type: 'text', placeholder: '例: 20人' },
      { id: 'new_patients_needed', label: '月に何人の新規が必要か', hint: '目標人数 - 現在の人数 + 離脱分', type: 'text', placeholder: '例: 月10人の新規が必要' },
      { id: 'ad_budget', label: '広告費の月間予算', hint: '新規1人の獲得コスト（CPA）×必要人数で計算', type: 'text', placeholder: '例: 月5万円（CPA 5,000円 × 10人）' },
      { id: 'action_plan', label: '明日からやる最初の一歩', hint: 'このワークシートを埋めた今、最初にやるべきことは？', type: 'textarea', placeholder: '例: Googleビジネスプロフィールの情報を更新する、LPを1つ作る、回数券の価格を決める' },
    ],
  },
]
