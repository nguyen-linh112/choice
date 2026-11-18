// Dựng đề Nghe SU24 cho môn nhóm JPD326: ghi public/data/jpd326.json (giữ các đề/mục khác nếu đã có)
// và (tùy chọn) mã hoá lại audio vào public/data/audio/jpd326/su24/.
//   node scripts/jpd/build-su24-listening.mjs
// Câu hỏi lấy từ PDF "paper.pdf" (đề Nghe SU24). Đáp án suy ra từ lời thoại audio (Whisper nhận dạng, đã chỉnh tay).
import fs from 'node:fs'
import path from 'node:path'
import { validateGroup } from '../../src/utils/validateSubject.js'

const dir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
const target = path.join(dir, '../../public/data/jpd326.json')

const AUDIO = (name) => `data/audio/jpd326/su24/${name}`

// ---- lời thoại tham khảo (phiên âm tự động bằng Whisper, đã chỉnh tay) ----
const SCRIPT_M1 = `皆さん、こんにちは。フレペの滝散策コースにご参加いただき、ありがとうございます。私、知床自然ガイドの山川と申します。これからコースのご説明をさせていただきます。このコースでは約2時間の散策をお楽しみいただけます。見どころは、なんといっても、川がないのに滝が流れるフレペの滝です。崖を流れる水は、まるで涙のように見えます。そして、動物との出会いもあるかもしれません。いくつかのご注意を申し上げます。このあたりは急に天気が変わる場合があります。皆さん、レインコートなどはお持ちでしょうか。歩道は滑りやすいので、足元にお気をつけください。また、熊が出ることがありますので、お一人にならないようにお気をつけください。途中にトイレはございませんので、こちらでお済ませください。では、10分後にお集まりください。`
const SCRIPT_5 = `学校で先生が話しています。女の学生はまず何をしなければなりませんか。\n先生：先週は自分の性格について説明する作文を書きましたね。今日はまずそれを直しましょう。その後、みんなの前で一人ずつ発表してもらいます。発表を聞く人は、今から配るこの紙に感想を書いてください。\n学生：先生、私、先週休んでしまったんですが。\n先生：じゃあ、今から発表のメモを作ってください。自分の性格で紹介したいところ一つと、それがよく分かる例を書きましょう。アイディアだけでいいです。それを見ながら発表してください。\n学生：わかりました。`
const SCRIPT_6 = `女の人と男の人が話しています。男の人は、出張で最も困ったことは何だと言っていますか。\n女：出張、お疲れ様でした。いかがでしたか。\n男：うん。仕事は心配してたような問題が起きなかったから良かったんだけど、まあ、外国だといろいろ大変なこともあるね。\n女：言葉も通じないから大変ですよね。\n男：そうだね。料理を注文するのにも時間がかかるからね。でも、それより僕は食事が合わなくてね。毎日あの辛い料理を食べなくちゃいけないのが一番困ったな。\n女：そうですか。\n男：そうそう。ホテルで一度シャワーのお湯が出なくて困ったんだけど、そしたらとてもいい部屋に替えてくれてね。まあ、いい経験になったよ。`
const SCRIPT_7 = `女の人と男の人がお父さんへのプレゼントについて話しています。女の人は何をあげることにしましたか。\n女：来週うちの父の誕生日なんだけど、プレゼント何がいいかな。\n男：お父さんか。僕ならネクタイかな。\n女：ああ、うちの父、仕事に行くときもほとんどしなくて。\n男：そうか。じゃあ、お酒とか。\n女：お酒は喜んでくれると思うんだけど、でも去年もそうだったしね。\n男：そうなんだ。お父さん、何か趣味ないの？\n女：あ、最近ジョギングを始めたみたい。\n男：じゃあ、走るときに履く靴とか着るものなんていいんじゃない？\n女：いいね。\n男：靴はサイズが難しいから…\n女：うん、決めた。ありがとう。`
const SCRIPT_8 = `女の人と男の人がインターネットで新幹線の予約ページを見ながら話しています。女の人は何時何分発の新幹線を予約しますか。\n女：社長、今度の出張の新幹線の予約をしようと思うのですが、新大阪には何時までに着けばよろしいですか。\n男：お客さんのところには3時半に伺う約束だから、少し早めだけど、30分前までに着けばいいだろう。\n女：そうすると、これかこれですね。禁煙席がよろしいんですよね。\n男：そうだね。そうしてくれる？\n女：あ、でもそうすると、ひかりしかないですね。\n男：うーん、ひかりは時間がかかるからな。新大阪からお客さんのところは、急げば20分で行けるから、その後のでいいや。\n女：かしこまりました。では、これを予約いたしますね。`
const SCRIPT_9 = `男の人と女の人が電話で話しています。女の人がこれから男の人の家に行くのは、どうしてですか。\n女：あ、中村君？ これからちょっとそっちに行っていいかな。\n男：うん、いいけど、どうしたの？ なんか相談ごと？\n女：うーん、実は母がみかんを送ってくれたんだけど、いらない？\n男：え、せっかくなのに、悪くない？\n（それに寒いし。／寒いのは大丈夫。）\n女：一人じゃ全部食べきれなくて。ちょうど犬の散歩に出るから、そのついでにと思って。\n男：じゃあ、ありがたくいただくよ。あったかいお茶、用意しておくね。\n女：ありがとう。じゃ、すぐ行くね。`
const SCRIPT_10 = `あ、楽しみにしてた旅行なのに、雨だよ。\n1　ほんと、残念だね。\n2　これは素晴らしいね。\n3　うん、すごく楽しみだね。`
const SCRIPT_11 = `うわあ、きれい。佐藤さんは絵が上手ですね。\n1　いえいえ、そんなことないですよ。\n2　いえ、そうはいかないですよ。\n3　へえ、そうだったんですか。`
const SCRIPT_12 = `鈴木さんという人をご存知ですか。\n1　はい、鈴木さんならいらっしゃいます。\n2　はい、鈴木さんならよく存じております。\n3　いえ、鈴木さんはよく知らないと言っています。`
const SCRIPT_13 = `アルバイトの面接に遅刻しました。何と言いますか。\n1　遅れちゃってごめんなさい。\n2　遅れてしまって申し訳ありません。\n3　すみません。今何時ですか。`
const SCRIPT_14 = `仲の良い友達の家に、前から読みたかった本がありました。借りたいです。何と言いますか。\n1　この本、貸してもらえない？\n2　この本、借りようか。\n3　この本、借りてもいいんじゃない？`

const SCRIPT_NOTE = 'Phiên âm tự động bằng Whisper (đối chiếu 2 model) rồi chỉnh tay, chỉ để tham khảo, có thể còn sai sót.'
const REF_NOTE = 'Đáp án tham khảo: suy ra từ lời thoại audio (chép bằng Whisper, 2 model cho kết quả khớp), chưa phải đáp án chính thức. Nếu thấy lệch thì tự kiểm tra lại.'

const M1 = 'Mondai 1 · Nghe và chọn phương án đúng để điền vào chỗ trống:'
const M2 = 'Mondai 2 · まず質問を聞いて、それから話を聞いて、AからDの中から最もよいものを一つ選んでください。'
const M3 = 'Mondai 3 · まず文(ぶん)を聞いて、返事(へんじ)の1から3の中から、最もよいものを一つ選(えら)んでください。'
const M3P = 'Mondai 3 · 絵(え)を見ながら質問(しつもん)を聞いてください。やじるし(→)の人は何と言いますか。1から3の中から、最もよいものを一つ選(えら)んでください。'

const L1 = 'Bài nghe Mondai 1 (dùng chung cho câu 1–4). Khoảng 50 giây đầu là thời gian đọc câu hỏi nên im lặng.'
const PIC_NOTE = 'Câu này có tranh minh hoạ (絵) chưa có trong file PDF; bài nghe tự nói rõ tình huống nên vẫn trả lời được. Khi có tranh sẽ bổ sung.'

const opts = (list, correctIdx) => list.map((text, i) => ({ text, correct: correctIdx.includes(i), explain: '' }))
const q = (n, o) => ({ id: `jpd326-su24-l-${String(n).padStart(2, '0')}`, ...o })

const questions = [
  q(1, { question: `${M1}\nフレペの＿＿＿＿＿＿コースにご参加いただきありがとうございます。`, audio: AUDIO('q01-04.mp3'), audioLabel: L1, script: SCRIPT_M1, scriptNote: SCRIPT_NOTE,
    options: opts(['森トレッキング', '森散策(さんさく)', '滝(たき)トレッキング', '滝(たき)散策(さんさく)'], [3]) }),
  q(2, { question: '内容(ないよう)に合(あ)っていないものを選(えら)んでください。', audio: AUDIO('q01-04.mp3'), audioLabel: L1, script: SCRIPT_M1, scriptNote: SCRIPT_NOTE,
    options: opts(['動物と出会えるかもしれません。', 'がけを流れる水はまるで涙のように見えます。', 'このコースは約1時間で行われます。', 'このコースの見どころは川がないのに滝(たき)が流(なが)れるところです。'], [2]) }),
  q(3, { question: `${M1}\nこのあたりは急(きゅう)に＿＿①＿＿場合があるので、＿＿②＿＿を持った ほうがいいです。`, audio: AUDIO('q01-04.mp3'), audioLabel: L1, script: SCRIPT_M1, scriptNote: SCRIPT_NOTE,
    options: opts(['①雨が降る / ②かさ', '①天気が変わる / ②かさ', '①雪が降る / ②レインコート', '①天気が変わる / ②レインコート'], [3]) }),
  q(4, { question: `${M1}\n「＿①＿が出ることがありますので、＿＿②＿＿にならないようにお気をつけください。」`, audio: AUDIO('q01-04.mp3'), audioLabel: L1, script: SCRIPT_M1, scriptNote: SCRIPT_NOTE,
    options: opts(['①サル / ②おきゃくさん', '①クマ / ②お二人', '①サル / ②お子さん', '①クマ / ②お一人'], [3]) }),
  q(5, { question: M2, audio: AUDIO('q05.mp3'), audioLabel: 'Bài nghe câu 5', script: SCRIPT_5, scriptNote: SCRIPT_NOTE,
    options: opts(['紙(かみ)に感想(かんそう)を書く', '自己紹介(じこしょうかい)をする', '作文を直(なお)す', 'メモを作る'], [3]) }),
  q(6, { question: M2, audio: AUDIO('q06.mp3'), audioLabel: 'Bài nghe câu 6', script: SCRIPT_6, scriptNote: SCRIPT_NOTE,
    options: opts(['シャワーのお湯(ゆ)が出なかったこと', '料理が口に合(あ)わなかったこと', '言葉(ことば)がわからなかったこと', '仕事で問題が あったこと'], [1]) }),
  q(7, { question: M2, audio: AUDIO('q07.mp3'), audioLabel: 'Bài nghe câu 7', script: SCRIPT_7, scriptNote: SCRIPT_NOTE,
    options: opts(['お酒', 'ジョギング用(よう)の靴(くつ)', 'ネクタイ', 'ジョギング用(よう)の服(ふく)'], [3]) }),
  q(8, { question: `${M2}\nしんおおさか: tên địa danh (新大阪)`, audio: AUDIO('q08.mp3'), audioLabel: 'Bài nghe câu 8', script: SCRIPT_8, scriptNote: SCRIPT_NOTE,
    note: 'Câu này nhìn bảng giờ tàu trên màn hình đặt vé (không có trong file PDF). Đáp án 12時33分 chỉ là SUY ĐOÁN, chưa xác nhận được; cần bảng giờ tàu hoặc đáp án chính thức.',
    options: opts(['12時33分 発(はつ)', '12時10分 発(はつ)', '12時30分 発(はつ)', '12時00分 発(はつ)'], [0]) }),
  q(9, { question: `${M2}\n女の 人が、これから 男の 人の 家に行くのは、どうしてですか。\n相談事(そうだんごと): chuyện cần trao đổi`, audio: AUDIO('q09.mp3'), audioLabel: 'Bài nghe câu 9', script: SCRIPT_9, scriptNote: SCRIPT_NOTE,
    options: opts(['一緒(いっしょ)に食事(しょくじ)したいから', '相談(そうだん)したいことがあるから', '飼(か)っている犬を見せたいから', 'みかんをあげたいから'], [3]) }),
  q(10, { question: M3, audio: AUDIO('q10.mp3'), audioLabel: 'Bài nghe câu 10', script: SCRIPT_10, scriptNote: SCRIPT_NOTE, fixedOrder: true, options: opts(['1', '2', '3'], [0]) }),
  q(11, { question: M3, audio: AUDIO('q11.mp3'), audioLabel: 'Bài nghe câu 11', script: SCRIPT_11, scriptNote: SCRIPT_NOTE, fixedOrder: true, options: opts(['1', '2', '3'], [0]) }),
  q(12, { question: M3, audio: AUDIO('q12.mp3'), audioLabel: 'Bài nghe câu 12', script: SCRIPT_12, scriptNote: SCRIPT_NOTE, fixedOrder: true, options: opts(['1', '2', '3'], [1]) }),
  q(13, { question: M3P, audio: AUDIO('q13.mp3'), audioLabel: 'Bài nghe câu 13', script: SCRIPT_13, scriptNote: SCRIPT_NOTE, fixedOrder: true, note: PIC_NOTE, options: opts(['1', '2', '3'], [1]) }),
  q(14, { question: M3P, audio: AUDIO('q14.mp3'), audioLabel: 'Bài nghe câu 14', script: SCRIPT_14, scriptNote: SCRIPT_NOTE, fixedOrder: true, note: PIC_NOTE, options: opts(['1', '2', '3'], [0]) }),
]

// Mọi đáp án của mục Nghe đều chỉ là tham khảo
for (const item of questions) item.note = item.note ? `${item.note} ${REF_NOTE}` : REF_NOTE

// ---- giải thích (đọc từ file batch riêng để dễ chỉnh) ----
const explainFile = path.join(dir, 'explain-su24-listening.json')
if (fs.existsSync(explainFile)) {
  const ex = JSON.parse(fs.readFileSync(explainFile, 'utf8'))
  for (const [n, list] of Object.entries(ex)) {
    const item = questions[Number(n) - 1]
    if (!item || list.length !== item.options.length) { console.error('Sai số giải thích ở câu', n); process.exit(1) }
    item.options.forEach((o, i) => { o.explain = list[i] })
  }
}

// ---- gộp vào môn nhóm (giữ nguyên các đề / mục khác nếu đã có) ----
let group = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target, 'utf8')) : null
if (!group) {
  group = {
    id: 'jpd326',
    name: 'JPD326 - Tiếng Nhật trung cấp',
    sections: [{ key: 'listening', label: 'Nghe' }, { key: 'choice', label: 'Trắc nghiệm' }, { key: 'reading', label: 'Đọc' }],
    sets: [],
  }
}
let set = group.sets.find((s) => s.id === 'su24')
if (!set) { set = { id: 'su24', name: 'Đề SU24 (FE)', sections: {} }; group.sets.push(set) }
set.sections.listening = { exam: { questionCount: questions.length, durationMinutes: 30 }, questions }
set.sections.choice = set.sections.choice || { questions: [] }
set.sections.reading = set.sections.reading || { questions: [] }

const problems = validateGroup(group)
if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
fs.writeFileSync(target, JSON.stringify(group, null, 2) + '\n')
console.log(`Đã ghi jpd326.json: ${questions.length} câu Nghe, ${questions.filter((x) => x.options.every((o) => o.explain)).length} câu đã có giải thích`)
