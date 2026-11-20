// Dữ liệu phần VIẾT của JPD326: 3 file đề Viết (paper (w).pdf, paper (w2).pdf, paper(w3).pdf).
// Đề Viết không có đáp án chính thức -> đáp án mẫu + giải thích do AI soạn dựa trên kiến thức ngữ pháp.
// Mỗi bài: { id, part, kind?, question, hint?, answer, explain, translation }

const P1 = 'Phần I - Chia dạng đúng của từ trong ngoặc'
const P2 = 'Phần II - Hoàn thành câu'
const P3 = 'Phần III - 作文 (viết đoạn văn)'

// ================= Đề Viết SU25 (paper (w2).pdf: "Đề thi cuối kỳ Summer 2025") =================
export const WRITING_SU25 = [
  {
    id: 'w-su25-1-1', part: P1,
    question: 'このような間違いは初心者に【ある→＿＿＿＿＿＿】がちなことだ。',
    answer: 'あり',
    explain:
`Cấu trúc dùng: Vます (bỏ ます) + がちだ / がちな + N = hay ~, thường hay ~ (xu hướng dễ xảy ra, thường là điều không tốt).
Cách chia: ある → あります → あり (bỏ ます) → ありがち.
Từ vựng: 間違い(まちがい) = lỗi sai; 初心者(しょしんしゃ) = người mới bắt đầu.
Vì sao không viết "ある": trước がち phải là thể ます bỏ ます (hoặc danh từ), không dùng thể từ điển.
Phân biệt: ～がち = hay xảy ra (thường xấu); ～やすい = dễ ~ (trung tính); ～っぽい = có vẻ/ hay ~ (tính cách).`,
    translation: 'Những lỗi sai như thế này là chuyện người mới bắt đầu hay mắc phải.',
  },
  {
    id: 'w-su25-1-2', part: P1,
    question: '全然【勉強する→＿＿＿＿＿＿】にしてはいい点が取れた。',
    answer: '勉強しなかった',
    explain:
`Cấu trúc dùng: thể thông thường (普通形) + にしては = so với ~ thì lại ~ (kết quả khác với điều thường nghĩ).
Chia: 勉強する → 勉強しなかった (thể thông thường, quá khứ phủ định) → 勉強しなかったにしては.
Vì sao phủ định: 全然(ぜんぜん) = hoàn toàn (không), luôn đi với vế phủ định. Cả câu: "mặc dù hoàn toàn không học mà điểm lại cao".
Từ vựng: 点(てん)を取(と)る = lấy điểm.
Vì sao không viết "勉強する/勉強して": 勉強する làm câu thành "học mà điểm vẫn cao" (mất ý ngạc nhiên vì không học), 勉強して không đi trực tiếp trước にしては.
Phân biệt: ～にしては = so với ~ thì (bất ngờ); ～ことから = từ việc ~ mà suy ra; ～だけあって = đúng là ~ nên.
(Đáp án 勉強していない cũng chấp nhận được.)`,
    translation: 'Dù hoàn toàn không học bài mà lại được điểm cao.',
  },
  {
    id: 'w-su25-1-3', part: P1,
    question: '彼は恋人を【喜ぶ→＿＿＿＿＿＿】ために、サプライズパーティーの準備をした。',
    answer: '喜ばせる',
    explain:
`Cấu trúc dùng: thể sai khiến 喜ばせる + ために (mục đích "để ~").
Chia sai khiến: 喜(よろこ)ぶ (vui mừng, động từ nhóm 1) → đổi う→あ + せる: 喜ばせる = làm cho (ai đó) vui.
Vì sao không viết 喜ぶ: chủ ngữ "anh ấy" muốn làm cho người yêu(恋人 こいびと)vui, tức tác động lên người khác nên phải dùng thể sai khiến; 喜ぶ chỉ là tự mình vui.
Từ vựng: 準備(じゅんび) = chuẩn bị; サプライズパーティー = tiệc bất ngờ.
Mẫu ～ために: Vる + ために = để ~ (mục đích, chủ ngữ hai vế giống nhau); N の + ために = vì ~.`,
    translation: 'Anh ấy đã chuẩn bị một bữa tiệc bất ngờ để làm người yêu vui.',
  },
  {
    id: 'w-su25-1-4', part: P1,
    question: 'A「先輩、『こころ』を書いた作家は【だれ→＿＿＿＿＿＿】っけ？」\nB「夏目漱石だよ。」',
    answer: 'だれだった',
    explain:
`Cấu trúc dùng: ～っけ (thể thông thường + っけ) = nhỉ?, là gì nhỉ? - dùng khi nhớ ra mình từng biết điều đó nhưng nhất thời quên, hỏi lại để xác nhận.
Chia: だれ (danh từ/ từ để hỏi) → だれだった (thể thông thường quá khứ của だ) → だれだったっけ。
Từ vựng: 先輩(せんぱい) = đàn anh/ tiền bối; 作家(さっか) = tác giả; 『こころ』 = tiểu thuyết "Kokoro"; 夏目漱石(なつめそうせき) = Natsume Soseki (đề in nhầm cách đọc là なつこうそうせき).
Vì sao không viết だれ/ だれです: ～っけ luôn đi với thể thông thường, và hay dùng thì quá khứ (だった) vì đó là chuyện đã từng biết.
Ví dụ: 今日、会議は何時からだったっけ？ = Hôm nay họp từ mấy giờ nhỉ?`,
    translation: 'A: Anh ơi, tác giả viết "Kokoro" là ai nhỉ? B: Là Natsume Soseki đấy.',
  },
  {
    id: 'w-su25-1-5', part: P1,
    question: '年末、旅行に行きたいと思っているが、どこへ行くか【決める→＿＿＿＿＿＿】かねている。',
    answer: '決め',
    explain:
`Cấu trúc dùng: Vます (bỏ ます) + かねる = khó mà ~, không thể ~ (vì lưỡng lự/ khó xử). Dạng phủ định hay gặp hơn: ～かねている = vẫn chưa thể ~ (đang phân vân).
Chia: 決める (きめる, quyết định) → 決めます → 決め → 決めかねている.
Từ vựng: 年末(ねんまつ) = cuối năm; 旅行(りょこう) = du lịch.
Vì sao không viết 決める/決めて: かねる phải nối với dạng bỏ ます.
Cẩn thận: ～かねる (khó ~, không thể ~) khác ～かねない (có khả năng ~, thường là điều xấu: 事故になりかねない = có thể dẫn đến tai nạn).`,
    translation: 'Cuối năm tôi muốn đi du lịch nhưng vẫn chưa quyết định được sẽ đi đâu.',
  },
  {
    id: 'w-su25-2-1', part: P2,
    question: 'ストレスがたまったときには、＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿に限ります。',
    answer: 'ゆっくりお風呂に入る\n（hoặc: 好きな音楽を聞く / 運動して汗を流す）',
    explain:
`Cấu trúc dùng: Vる / N + に限る = ~ là tốt nhất (ý kiến chủ quan, lời khuyên).
Câu mẫu: ゆっくりお風呂(ふろ)に入る (ngâm mình thong thả trong bồn tắm) + に限ります.
Từ vựng: ストレスがたまる = tích tụ căng thẳng; 汗(あせ)を流(なが)す = đổ mồ hôi; 音楽(おんがく)を聞(き)く = nghe nhạc.
Chú ý: trước に限る dùng thể từ điển (Vる) hoặc danh từ (ví dụ 夏はビールに限る), không dùng thể た/ない.
Phân biệt 3 mẫu hay nhầm: ～に限る (tốt nhất là ~) ≠ ～に限り (chỉ giới hạn trong ~: 本日に限り = riêng hôm nay) ≠ ～に限って (riêng lúc ~ lại ~: こんな日に限って雨だ).`,
    translation: 'Khi bị tích tụ căng thẳng thì tốt nhất là ngâm mình thong thả trong bồn tắm.',
  },
  {
    id: 'w-su25-2-2', part: P2,
    question: '両親の期待に反して、兄は＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿。',
    answer: '大学に行かずに、画家になった',
    explain:
`Cấu trúc dùng: N + に反して = trái với ~ (期待に反して = trái với kỳ vọng; 予想に反して = trái với dự đoán). Vế sau là kết quả/ hành động ngược lại kỳ vọng.
Từ vựng: 両親(りょうしん) = bố mẹ; 期待(きたい) = kỳ vọng; 兄(あに) = anh trai (của mình); 画家(がか) = họa sĩ; ～ずに = không ~ mà (= ～ないで).
Nên viết vế sau là điều bố mẹ không mong muốn (bỏ học, đổi nghề) để khớp ý "trái kỳ vọng".
Phân biệt: ～に反して (trái với) ≠ ～に対して (đối với/ trái lại so với) ≠ ～にしては (so với ~ thì).`,
    translation: 'Trái với kỳ vọng của bố mẹ, anh trai tôi đã không học đại học mà trở thành họa sĩ.',
  },
  {
    id: 'w-su25-2-3', part: P2,
    question: '山田さんが＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿おかげで、迷わず会場へ行けた。',
    answer: '地図を書いてくれた\n（hoặc: 道を教えてくれた）',
    explain:
`Cấu trúc dùng: Vた / Vている / N の + おかげで = nhờ ~ mà (kết quả tốt, biết ơn).
Câu mẫu: 山田さんが地図(ちず)を書いてくれたおかげで = nhờ anh Yamada vẽ giúp bản đồ.
Từ vựng: 迷(まよ)わず = không bị lạc/ không phân vân (Vず = Vないで); 会場(かいじょう) = hội trường, địa điểm tổ chức; 行(い)ける = đi được (thể khả năng).
Vì sao dùng ～てくれた: Yamada làm giúp mình, thể hiện lòng biết ơn nên ghép với おかげで rất hợp.
Phân biệt: ～おかげで (nhờ, kết quả tốt) ≠ ～せいで (tại, kết quả xấu: 雨のせいで遅れた).`,
    translation: 'Nhờ anh Yamada vẽ giúp bản đồ mà tôi đã đến được hội trường mà không bị lạc.',
  },
  {
    id: 'w-su25-2-4', part: P2,
    question: '日本人が＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿というわけではない。',
    answer: 'みんな納豆が好きだ\n（hoặc: 全員お寿司が好きだ）',
    explain:
`Cấu trúc dùng: thể thông thường + (という)わけではない = không có nghĩa là ~, không hẳn là ~ (phủ nhận một cách hiểu quá đà, thường hay đi cùng từ như みんな, 全員, いつも).
Câu mẫu: 日本人がみんな納豆(なっとう)が好きだというわけではない = Không phải người Nhật ai cũng thích natto.
Chú ý: trước というわけではない là mệnh đề thể thông thường (好きだ, 好きな人ばかり...).
Phân biệt: ～わけではない (không hẳn) ≠ ～わけがない (không thể nào) ≠ ～わけにはいかない (không thể ~ vì hoàn cảnh/ đạo lý).`,
    translation: 'Không phải người Nhật ai cũng thích natto.',
  },
  {
    id: 'w-su25-2-5', part: P2,
    question: '一度もこんなにたくさんの言葉はとても＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿。',
    answer: '覚えられません',
    explain:
`Cấu trúc dùng: とても + V thể khả năng phủ định (～られない/ ～ません) = hoàn toàn không thể ~ được.
Chia: 覚(おぼ)える (nhớ) → 覚えられる (thể khả năng) → 覚えられません.
Từ vựng: 言葉(ことば) = từ vựng, lời nói.
Lưu ý đề: bản đề in "一度も", nhiều khả năng đề gốc là "一度に" (một lúc): 一度にこんなにたくさんの言葉はとても覚えられません = Nhiều từ thế này mà nhớ một lúc thì không tài nào nhớ nổi. Dù là 一度に hay 一度も thì vế cuối vẫn là mẫu とても～ない.
Phân biệt: とても～ない (không thể nào) ≠ とても + tính từ (rất ~: とてもおいしい).`,
    translation: 'Nhiều từ như thế này thì tôi không tài nào nhớ nổi (một lúc).',
  },
  {
    id: 'w-su25-3-1', part: P3, kind: 'essay',
    question: '「私が印象に残っている旅行」のテーマについて、200文字以上（6～7行に相当）の作文を作ってください。',
    answer:
`私が一番印象に残っている旅行は、去年の夏に友達と行った京都旅行です。
京都では、有名なお寺をいくつも見学しました。特に清水寺からの景色は本当にすばらしくて、時間を忘れて見ていました。また、着物を着て町を歩いたのも楽しい思い出です。初めて着る着物は歩きにくかったものの、写真をたくさん撮ることができました。
この旅行で一番うれしかったのは、道に迷ったとき、親切な地元の人が地図を見ながら丁寧に教えてくれたことです。そのおかげで、予定どおりに目的地へ着くことができました。日本人の優しさに感動しました。
いつかまた京都を訪れて、今度は家族にも日本の文化を紹介したいと思っています。`,
    explain:
`Bố cục 4 phần: (1) nêu chuyến đi (khi nào, đi với ai, đi đâu) → (2) những việc đã làm → (3) điều ấn tượng nhất và lý do → (4) cảm nghĩ / dự định sau này. Đủ 200 chữ trở lên.
Cấu trúc ngữ pháp đã dùng:
- ～ことができる (có thể ~): 写真をたくさん撮ることができました = chụp được nhiều ảnh.
- ～たり / ～た + も (liệt kê): 着物を着て町を歩いたのも = việc mặc kimono đi dạo cũng...
- ～ものの (tuy ~ nhưng ~): 歩きにくかったものの = tuy khó đi nhưng...
- ～ながら (vừa ~ vừa ~): 地図を見ながら = vừa xem bản đồ vừa...
- ～おかげで (nhờ ~): そのおかげで = nhờ vậy mà.
- ～たいと思っている (muốn ~, dự định): 紹介したいと思っています.
Từ vựng: 印象(いんしょう)に残(のこ)る = để lại ấn tượng; 京都(きょうと); 見学(けんがく) = tham quan học hỏi; 景色(けしき) = phong cảnh; 着物(きもの) = kimono; 親切(しんせつ) = tử tế; 地元(じもと) = địa phương; 丁寧(ていねい) = cẩn thận, lịch sự; 目的地(もくてきち) = nơi đến; 感動(かんどう) = cảm động.
Có thể thay nội dung bằng chuyến đi của riêng bạn, giữ nguyên khung và các mẫu câu.`,
    translation:
`Chuyến du lịch để lại ấn tượng nhất với tôi là chuyến đi Kyoto cùng bạn vào mùa hè năm ngoái.
Ở Kyoto, chúng tôi tham quan rất nhiều ngôi chùa nổi tiếng. Đặc biệt phong cảnh nhìn từ chùa Kiyomizu thật tuyệt vời, tôi cứ ngắm mà quên cả thời gian. Việc mặc kimono đi dạo phố cũng là một kỷ niệm vui. Lần đầu mặc kimono tuy khó đi nhưng tôi đã chụp được rất nhiều ảnh.
Điều vui nhất trong chuyến đi là lúc tôi bị lạc đường, một người địa phương tốt bụng vừa xem bản đồ vừa chỉ đường tận tình cho tôi. Nhờ vậy tôi đến được nơi cần đến đúng như dự định. Tôi rất xúc động trước sự tử tế của người Nhật.
Tôi muốn một ngày nào đó sẽ đến Kyoto lần nữa và lần này giới thiệu văn hóa Nhật Bản cho cả gia đình.`,
  },
]

// ================= Đề Viết (paper (w).pdf) - chưa rõ thuộc đề nào =================
export const WRITING_W1 = [
  {
    id: 'w-a-1-1', part: P1,
    question: '雪が降ると、電車が【遅れます→＿＿＿＿＿＿＿＿＿＿】がちだ。',
    answer: '遅れ',
    explain:
`Cấu trúc dùng: Vます (bỏ ます) + がちだ = hay ~, dễ ~ (thường là điều không tốt).
Chia: 遅(おく)れる (bị trễ) → 遅れます → 遅れ → 遅れがちだ.
Từ vựng: 雪(ゆき)が降(ふ)る = tuyết rơi; 電車(でんしゃ) = tàu điện.
Vì sao không viết 遅れる/遅れて: がち chỉ nối với dạng bỏ ます của động từ (hoặc danh từ: 病気がち).
Phân biệt: ～がち (hay, xu hướng) ≠ ～ぎみ (hơi ~, có vẻ ~: 風邪ぎみ = hơi bị cảm).`,
    translation: 'Hễ tuyết rơi là tàu điện hay bị trễ.',
  },
  {
    id: 'w-a-1-2', part: P1,
    question: '子：今度の休み、どこか遊びに行こうよ。\n親：今は仕事が忙しくて、遊びに【行きます→＿＿＿＿＿＿＿＿＿＿】どころじゃないんだ。ごめんね。',
    answer: '行く',
    explain:
`Cấu trúc dùng: Vる / N + どころではない (どころじゃない) = làm gì có chuyện ~, không phải lúc để ~ (đang bận hoặc khó khăn hơn nhiều).
Chia: 行(い)きます → thể từ điển 行く → 行くどころじゃない.
Từ vựng: 今度(こんど) = lần tới; 休(やす)み = ngày nghỉ; 忙(いそが)しい = bận; 遊(あそ)びに行く = đi chơi.
Vì sao không viết 行き/ 行った: どころではない nối với thể từ điển (Vる), danh từ hoặc thể ている.
Phân biệt: ～どころではない (không phải lúc để) ≠ ～どころか (đâu chỉ... mà còn ngược lại: 休みどころか毎日残業だ = nghỉ đâu mà ngày nào cũng tăng ca).`,
    translation: 'Con: Kỳ nghỉ tới mình đi chơi đâu đó đi. Bố/mẹ: Bây giờ công việc bận quá, làm gì có chuyện đi chơi. Xin lỗi con nhé.',
  },
  {
    id: 'w-a-1-3', part: P1,
    question: '電話かメールでも大丈夫だから、せっかくここまで【来ます→＿＿＿＿＿＿＿＿＿＿】ことはない。',
    answer: '来る',
    explain:
`Cấu trúc dùng: Vる + ことはない = không cần phải ~, không việc gì phải ~.
Chia: 来(く)ます → 来る (đọc là くる) → 来ることはない.
Từ vựng: 電話(でんわ) = điện thoại; 大丈夫(だいじょうぶ) = ổn, được; せっかく = công sức/ mất công.
Ý cả câu: Gọi điện hay gửi mail cũng được nên không cần mất công đến tận đây.
Phân biệt: ～ことはない (không cần phải) ≠ ～ことがない (chưa từng: 行ったことがない) ≠ ～ことになる (được quyết định là).`,
    translation: 'Gọi điện hay gửi mail cũng được nên bạn không cần phải mất công đến tận đây đâu.',
  },
  {
    id: 'w-a-1-4', part: P1,
    question: 'ペットを捨てるなんて、【許します→＿＿＿＿＿＿＿＿＿＿】がたいことだ。',
    answer: '許し',
    explain:
`Cấu trúc dùng: Vます (bỏ ます) + がたい = khó mà ~, không thể ~ được (về mặt cảm xúc/ lý trí; thường là 信じがたい, 許しがたい, 忘れがたい, 受け入れがたい).
Chia: 許(ゆる)す (tha thứ) → 許します → 許し → 許しがたい.
Từ vựng: ペット = thú cưng; 捨(す)てる = vứt bỏ; ～なんて = những chuyện như là ~ (thể hiện không hài lòng).
Phân biệt: ～がたい (khó ~ do tình cảm/ lý trí, văn viết) ≠ ～にくい (khó ~ do tính chất sự vật: 食べにくい) ≠ ～づらい (khó ~ vì tâm lý/ thể trạng) ≠ ～かねる (khó mà ~, từ chối lịch sự).`,
    translation: 'Vứt bỏ thú cưng là chuyện không thể tha thứ được.',
  },
  {
    id: 'w-a-1-5', part: P1,
    question: 'あっ！宿題が入ってない。今朝かばんに【入れます→＿＿＿＿＿＿＿＿＿＿】つもりだったんだけど。',
    answer: '入れる',
    explain:
`Cấu trúc dùng: Vる + つもりだった = đã định ~ (nhưng thực tế không làm được/ không làm).
Chia: 入(い)れます → 入れる → 入れるつもりだった.
Từ vựng: 宿題(しゅくだい) = bài tập về nhà; 今朝(けさ) = sáng nay; かばん = cặp, túi.
Chú ý động từ: 入れる = bỏ (cái gì) vào (tha động từ); 入る = vào (tự động từ). Ở đây "bỏ bài tập vào cặp" nên dùng 入れる; đoạn "宿題が入ってない" dùng 入っている (nó chưa có trong cặp).
Phân biệt: Vる + つもりだ (định làm) ≠ Vた + つもりだ (tưởng là đã làm/ coi như đã làm) ≠ ～はずだ (chắc chắn là).`,
    translation: 'Ôi! Bài tập về nhà không có trong cặp. Sáng nay tôi đã định bỏ vào rồi mà.',
  },
  {
    id: 'w-a-2-1', part: P2,
    question: 'A：一緒にご飯を食べに行こうよ。鍋はどう？\nB：いいね。冬は＿＿＿＿＿＿＿＿＿＿。',
    answer: '鍋に限るよね',
    explain:
`Cấu trúc dùng: N + に限る = ~ là nhất, ~ là tốt nhất (ý kiến chủ quan). Ở đây vừa đồng ý với gợi ý của A vừa nêu quan điểm.
Từ vựng: 鍋(なべ) = lẩu/ nồi; 冬(ふゆ) = mùa đông; 食(た)べに行(い)く = đi ăn.
Câu mẫu: 冬は鍋に限るよね = Mùa đông thì lẩu là nhất nhỉ.
Chú ý: に限る dùng cho ý kiến của người nói (hiện tại), không dùng quá khứ. Ngoài danh từ còn có Vる + に限る (風邪のときは寝るに限る).
Phân biệt: ～に限る (nhất) ≠ ～に限って (riêng lúc đó lại ~) ≠ ～に限り (chỉ giới hạn ở ~).`,
    translation: 'A: Cùng đi ăn cơm đi. Ăn lẩu nhé? B: Được đấy. Mùa đông thì lẩu là nhất nhỉ.',
  },
  {
    id: 'w-a-2-2', part: P2,
    question: 'この料理は作り方が簡単です。子ども＿＿＿＿＿＿＿＿＿＿。',
    answer: 'でも作れます',
    explain:
`Cấu trúc dùng: N + でも = ngay cả N cũng ~ (lấy ví dụ cực đoan để nói "dễ"), vế sau là thể khả năng: 作(つく)れます.
Từ vựng: 料理(りょうり) = món ăn; 作(つく)り方(かた) = cách làm; 簡単(かんたん) = đơn giản; 子(こ)ども = trẻ con.
Câu mẫu: 子どもでも作れます = ngay cả trẻ con cũng làm được. (Cũng có thể viết: 子どもにも作れます)
Vì sao dùng でも: vì câu trước nói "cách làm đơn giản", nên ngay cả người ít kinh nghiệm nhất (trẻ con) cũng làm được.
Phân biệt: Nでも (ngay cả N) ≠ Nさえ/ Nまで (đến cả N, nhấn mạnh hơn).`,
    translation: 'Món này cách làm đơn giản. Ngay cả trẻ con cũng làm được.',
  },
  {
    id: 'w-a-2-3', part: P2,
    question: 'すぐタクシーで＿＿＿＿＿＿＿＿＿＿のに、バスに乗ったから遅れてしまった。',
    answer: '行けば間に合った',
    explain:
`Cấu trúc dùng: Vば + ～た + のに = nếu đã ~ thì đã ~ vậy mà (tiếc nuối, trách móc điều không xảy ra). Ở đây: 行けば間に合ったのに = giá mà đi thì đã kịp.
Từ vựng: タクシー = taxi; 間(ま)に合(あ)う = kịp; バスに乗(の)る = đi xe buýt; 遅(おく)れる = trễ.
Vì sao thế này: vế sau "đi xe buýt nên bị trễ" cho thấy vế chỗ trống phải là hành động đúng nhưng đã không làm (đi taxi thì kịp).
Cũng có thể viết: 行けばよかった (giá mà đi) + のに.
Phân biệt: ～のに (nhưng mà, vậy mà - bất mãn/ tiếc) ≠ ～ので (vì, lý do trung tính).`,
    translation: 'Giá mà đi taxi ngay thì đã kịp, vậy mà tôi lại đi xe buýt nên bị trễ mất.',
  },
  {
    id: 'w-a-2-4', part: P2,
    question: '子どもじゃないから、＿＿＿＿＿＿＿＿＿＿自分で決めなさい。',
    answer: 'そのくらいのことは\n（hoặc: 何でも / これからは）',
    explain:
`Cấu trúc dùng: Vます (bỏ ます) + なさい = hãy ~ (mệnh lệnh nhẹ, bố mẹ/ thầy cô nói với con/ học sinh): 決(き)めなさい = hãy tự quyết định đi.
Chỗ trống bổ sung phần "việc gì" mà người nghe phải tự quyết định: そのくらいのこと (chuyện cỡ đó) は + 自分で決めなさい.
Từ vựng: 子(こ)どもじゃない = không còn là trẻ con; 自分(じぶん)で = tự mình; 決(き)める = quyết định.
Ý cả câu: Con không còn là trẻ con nữa, chuyện cỡ đó thì tự mình quyết định đi.
Phân biệt: ～なさい (lệnh nhẹ, từ người trên) ≠ ～てください (nhờ lịch sự) ≠ ～ろ (lệnh mạnh).`,
    translation: 'Con đâu còn là trẻ con nữa, chuyện cỡ đó thì tự mình quyết định đi.',
  },
  {
    id: 'w-a-2-5', part: P2,
    question: '＿＿＿＿＿＿＿＿＿＿ついでに、本屋に寄りました。',
    answer: '銀行へ行く',
    explain:
`Cấu trúc dùng: Vる / Vた / N の + ついでに = nhân tiện ~ (làm việc phụ trong lúc làm việc chính).
Câu mẫu: 銀行(ぎんこう)へ行くついでに = nhân tiện đi ngân hàng.
Từ vựng: 本屋(ほんや) = hiệu sách; 寄(よ)る = ghé qua.
Có thể thay: 散歩(さんぽ)のついでに (nhân tiện đi dạo), 駅(えき)まで行くついでに (nhân tiện đi đến ga).
Chú ý: danh từ phải có の (N の ついでに); động từ dùng thể từ điển hoặc thể た.
Phân biệt: ～ついでに (nhân tiện, việc phụ) ≠ ～かたがた (văn viết, vừa ~ vừa ~) ≠ ～ながら (vừa ~ vừa ~ đồng thời).`,
    translation: 'Nhân tiện đi ngân hàng, tôi đã ghé qua hiệu sách.',
  },
  {
    id: 'w-a-3-1', part: P3, kind: 'essay',
    question: '「自分の考え（気持ちを伝える時など）」のテーマについて、200文字以上（6～7行に相当）の作文を作ってください。',
    answer:
`私は、気持ちはできるだけ言葉にして伝えたほうがいいと考えています。
日本には「言わなくてもわかる」という文化があると聞きましたが、言わなければ相手に伝わらないことも多いと思います。たとえば、友達に助けてもらったとき、心の中で感謝しているだけでは、友達は私の気持ちを知ることができません。「ありがとう」と一言言うだけで、相手もうれしくなるし、二人の関係もよくなります。
以前、私は恥ずかしくて、母に「ありがとう」と言えませんでした。しかし、手紙を書いて気持ちを伝えたところ、母はとても喜んでくれました。それ以来、感謝や謝罪はすぐに伝えるようにしています。
これからも、素直に気持ちを伝えることを大切にしていきたいです。`,
    explain:
`Bố cục: (1) nêu quan điểm → (2) lý do + ví dụ → (3) trải nghiệm bản thân → (4) kết luận, quyết tâm. Dài hơn 200 chữ.
Cấu trúc ngữ pháp đã dùng:
- ～たほうがいい (nên ~): 伝えたほうがいい.
- ～と考えています / ～と思います (tôi cho rằng ~): nêu ý kiến.
- ～と聞きました (nghe nói ~).
- ～だけでは～ない (chỉ ~ thì không ~): 感謝しているだけでは...知ることができません.
- ～たところ (sau khi làm ~ thì thấy/ kết quả là ~): 手紙を書いて伝えたところ、母は喜んでくれました.
- ～ようにしている (cố gắng giữ thói quen ~): すぐに伝えるようにしています.
- ～ことを大切にする (coi trọng việc ~).
Từ vựng: 気持(きも)ち = cảm xúc; 伝(つた)える = truyền đạt; 感謝(かんしゃ) = cảm ơn; 謝罪(しゃざい) = xin lỗi; 素直(すなお)に = thẳng thắn, chân thật; 関係(かんけい) = mối quan hệ; 恥(は)ずかしい = xấu hổ.`,
    translation:
`Tôi cho rằng nên nói bằng lời cảm xúc của mình càng nhiều càng tốt.
Nghe nói Nhật Bản có văn hóa "không cần nói cũng hiểu", nhưng tôi nghĩ có nhiều điều không nói thì đối phương không biết. Ví dụ khi được bạn giúp đỡ, chỉ biết ơn trong lòng thì bạn không thể biết cảm xúc của tôi. Chỉ cần nói một câu "cảm ơn" thì đối phương vui và mối quan hệ của hai người cũng tốt hơn.
Trước đây tôi ngại nên không nói được "cảm ơn" với mẹ. Nhưng khi tôi viết thư để bày tỏ cảm xúc thì mẹ rất vui. Từ đó tôi cố gắng bày tỏ lời cảm ơn và xin lỗi ngay lập tức.
Từ nay tôi cũng muốn tiếp tục coi trọng việc bày tỏ cảm xúc một cách chân thật.`,
  },
]

// ================= Đề Viết (paper(w3).pdf) - chưa rõ thuộc đề nào =================
export const WRITING_W3 = [
  {
    id: 'w-b-1-1', part: P1,
    question: '【出張です→＿＿＿＿＿＿】ついでに、高校のときの友達に会いに行った。',
    answer: '出張の',
    explain:
`Cấu trúc dùng: N の + ついでに = nhân tiện ~ (làm thêm việc phụ khi làm việc chính).
Chia: 出張です → bỏ です, thêm の → 出張のついでに.
Từ vựng: 出張(しゅっちょう) = đi công tác; 高校(こうこう) = cấp ba; 友達(ともだち) = bạn bè; 会(あ)いに行(い)く = đi gặp.
Vì sao không viết 出張だ/ 出張な: danh từ nối với ついでに bằng の; động từ thì dùng Vる/ Vた + ついでに.
Phân biệt: ～ついでに (nhân tiện) ≠ ～ながら (vừa ~ vừa ~) ≠ ～とともに (cùng với/ đồng thời).`,
    translation: 'Nhân tiện đi công tác, tôi đã đi gặp bạn hồi cấp ba.',
  },
  {
    id: 'w-b-1-2', part: P1,
    question: 'まじめな田中さんが万引きをするなんて【信じます→＿＿＿＿＿＿】がたい。本当だろうか。',
    answer: '信じ',
    explain:
`Cấu trúc dùng: Vます (bỏ ます) + がたい = khó mà ~, không thể ~ được (cảm xúc/ lý trí khó chấp nhận).
Chia: 信(しん)じる (tin) → 信じます → 信じ → 信じがたい = khó mà tin được.
Từ vựng: まじめ = nghiêm túc, đứng đắn; 万引(まんび)き = ăn cắp vặt (ở cửa hàng); ～なんて = cái chuyện như là ~ (ngạc nhiên, không tin).
Vì sao không viết 信じる/ 信じない: trước がたい phải là dạng bỏ ます.
Phân biệt: ～がたい ≠ ～にくい ≠ ～づらい ≠ ～かねる (xem các bài có mẫu này).`,
    translation: 'Anh Tanaka vốn nghiêm túc mà lại đi ăn cắp vặt, thật khó mà tin được. Có thật không nhỉ?',
  },
  {
    id: 'w-b-1-3', part: P1,
    question: '母が【教えてくれました→＿＿＿＿＿＿】ように作ったら、おいしくできた。',
    answer: '教えてくれた',
    explain:
`Cấu trúc dùng: Vた / Vる + ように = làm giống như ~, theo cách ~ (ようにする: làm theo mẫu). Ở đây dùng thể た vì chuyện mẹ đã dạy ở quá khứ.
Chia: 教(おし)えてくれました → thể thông thường 教えてくれた → 教えてくれたように.
Từ vựng: 母(はは) = mẹ (của mình); 作(つく)る = làm, nấu; おいしくできた = làm ra ngon.
Vì sao không viết 教えてくれました: trong câu ghép, mệnh đề phụ (trước ように) dùng thể thông thường, không dùng thể lịch sự ます.
Phân biệt: ～とおりに (đúng y như ~) ≠ ～ように (giống như ~, thoáng hơn) ≠ ～みたいに (thân mật, giống như).`,
    translation: 'Tôi làm theo cách mẹ đã chỉ thì món ăn ra rất ngon.',
  },
  {
    id: 'w-b-1-4', part: P1,
    question: '【両親です→＿＿＿＿＿＿】おかげで、日本に留学できたので、とても感謝しています。',
    answer: '両親の',
    explain:
`Cấu trúc dùng: N の + おかげで = nhờ ~ (kết quả tốt, biết ơn). Danh từ đứng trước おかげで cần có の.
Chia: 両親です → 両親の + おかげで.
Từ vựng: 両親(りょうしん) = bố mẹ; 留学(りゅうがく) = du học; 感謝(かんしゃ) = biết ơn.
Vì sao không viết 両親だ/ 両親な: danh từ + の + おかげで (còn động từ: Vた + おかげで; tính từ na: Aな + おかげで).
Phân biệt: ～おかげで (nhờ ~, tốt) ≠ ～せいで (tại ~, xấu) ≠ ～によって (do ~, trung tính).`,
    translation: 'Nhờ bố mẹ mà tôi đã đi du học Nhật được, tôi rất biết ơn.',
  },
  {
    id: 'w-b-1-5', part: P1,
    question: '今はインターネットを使って、世界のどこにいても顔を見て話ができる。昔に比べて、今は【便利です→＿＿＿＿＿＿】ものだなあ。',
    answer: '便利な',
    explain:
`Cấu trúc dùng: Naな-adj / A-adj / V + ものだなあ = (cảm thán) thật là ~ nhỉ (nhìn lại, cảm khái). Tính từ な phải thêm な trước もの.
Chia: 便利(べんり)です → 便利な + ものだなあ → 便利なものだなあ = thật là tiện lợi nhỉ.
Từ vựng: 世界(せかい) = thế giới; 顔(かお)を見(み)て = nhìn mặt (video call); 昔(むかし) = ngày xưa; ～に比(くら)べて = so với ~.
Vì sao không viết 便利だ/ 便利: ものだ (cảm thán) cần tính từ na ở dạng danh từ hóa 便利な.
Chú ý: ～ものだ còn có nghĩa "vốn dĩ là ~" (子どもは遊ぶものだ) và "hồi ức: ～たものだ".`,
    translation: 'Bây giờ dùng Internet thì ở bất cứ đâu trên thế giới cũng có thể vừa nhìn mặt vừa nói chuyện. So với ngày xưa thì giờ thật là tiện lợi nhỉ.',
  },
  {
    id: 'w-b-2-1', part: P2,
    question: '学生である限り、＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿なければならない。',
    answer: '毎日勉強し\n（hoặc: 校則を守ら）',
    explain:
`Cấu trúc dùng: ～限(かぎ)り = chừng nào còn ~, miễn là còn ~. Nối: Vる/ Vている/ N である + 限り.
Chỗ trống phải là động từ thể ない bỏ い (勉強し + なければならない = phải học): 毎日勉強しなければならない = chừng nào còn là sinh viên thì mỗi ngày đều phải học.
Mẫu khác: 校則(こうそく)を守(まも)ら + なければならない (phải tuân thủ nội quy trường). Chú ý chia: 守る → 守らなければならない.
Từ vựng: 学生(がくせい) = học sinh, sinh viên; 毎日(まいにち) = mỗi ngày.
Phân biệt: ～限り (chừng nào còn) ≠ ～に限り (chỉ giới hạn ở) ≠ ～ない限り (trừ khi ~ thì không: 努力しない限り、成功しない = nếu không nỗ lực thì không thành công).`,
    translation: 'Chừng nào còn là sinh viên thì phải học hằng ngày (hoặc phải tuân thủ nội quy).',
  },
  {
    id: 'w-b-2-2', part: P2,
    question: 'かぜをひいたときは＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿に限るね。',
    answer: 'ゆっくり休む\n（hoặc: 温かいものを飲んで寝る）',
    explain:
`Cấu trúc dùng: Vる + に限る = ~ là tốt nhất (khuyên, ý kiến chủ quan).
Chỗ trống: động từ thể từ điển: ゆっくり休(やす)む = nghỉ ngơi thong thả / 早く寝(ね)る = đi ngủ sớm.
Từ vựng: かぜをひく = bị cảm; 温(あたた)かい = ấm; 飲(の)む = uống.
Chú ý: ～に限る đi với thể từ điển, không dùng thể た, ない hay quá khứ.
Phân biệt: ～に限る (nhất là ~) ≠ ～に限って (riêng lúc ~ lại ~) ≠ ～に限り (chỉ ở ~).`,
    translation: 'Khi bị cảm thì tốt nhất là nghỉ ngơi thong thả nhỉ.',
  },
  {
    id: 'w-b-2-3', part: P2,
    question: 'この辺は＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿ことから、富士見町と呼ばれるようになった。',
    answer: '富士山がよく見える',
    explain:
`Cấu trúc dùng: thể thông thường + ことから = từ việc ~ mà (nguồn gốc của tên gọi, căn cứ để suy luận).
Câu mẫu: 富士山(ふじさん)がよく見える + ことから = vì có thể nhìn thấy núi Phú Sĩ rõ → được gọi là 富士見町(ふじみちょう) "phố Fujimi" (= "ngắm Phú Sĩ").
Từ vựng: この辺(へん) = vùng này; 呼(よ)ばれる = được gọi là (thể bị động của 呼ぶ); ～ようになる = trở nên (dần dần) ~.
Chú ý: ～ことから thường giải thích nguồn gốc tên gọi, tên địa danh (名前の由来). Tên 富士見 có 見 (nhìn) nên nội dung hợp lý là "nhìn thấy núi Phú Sĩ".
Phân biệt: ～ことから (từ việc ~ mà) ≠ ～ために (vì ~) ≠ ～ので (vì, lý do thông thường).`,
    translation: 'Vùng này vì có thể nhìn thấy rõ núi Phú Sĩ nên dần được gọi là phố Fujimi.',
  },
  {
    id: 'w-b-2-4', part: P2,
    question: '〔アルバイトを休みたいです。店長に話してください。〕\nBạn muốn được nghỉ làm. Hãy viết câu xin phép chủ cửa hàng.\n＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿',
    answer: '店長、来週の月曜日は家の用事があるので、アルバイトを休ませていただけませんか。',
    explain:
`Cấu trúc dùng: Vさせていただけませんか = xin phép (rất lịch sự) cho tôi được ~. Gồm thể sai khiến (休ませる) + いただく (nhận ơn) + thể khả năng phủ định để hỏi nhẹ nhàng.
Chia: 休(やす)む → 休ませる (sai khiến) → 休ませていただけませんか.
Cách xin phép chuẩn: (1) gọi người (店長 てんちょう = quản lý/ chủ quán) → (2) nêu lý do ngắn gọn (家(いえ)の用事(ようじ)があるので = vì có việc nhà) → (3) xin phép lịch sự.
Từ vựng: 来週(らいしゅう) = tuần sau; 月曜日(げつようび) = thứ Hai; アルバイト = việc làm thêm.
Mẫu thay thế: 休ませてください (thẳng hơn), 休ませていただきたいのですが (muốn xin phép nghỉ).
Với cấp trên, không dùng 休みたいです một mình hoặc 休んでもいいですか quá thân mật.`,
    translation: 'Quản lý ơi, thứ Hai tuần sau em có việc nhà nên cho em xin nghỉ làm thêm được không ạ?',
  },
  {
    id: 'w-b-2-5', part: P2,
    question: '友達のAさんが癖を言っています。「くせに」を使って文を作りなさい。(Bạn A đang phàn nàn. Hãy dùng mẫu くせに để hoàn thành câu nói của bạn A.)\n〈先輩は「この仕事、私が全部やる」と言いました。でも、何もしません〉\nA：＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿。\nB：へえ、そうなんだ。大変だね。',
    answer: '先輩は「この仕事、私が全部やる」と言ったくせに、何もしないんです。',
    explain:
`Cấu trúc dùng: thể thông thường + くせに = đã ~ vậy mà lại ~ (thái độ bất mãn, chê trách, dùng khi phàn nàn về người khác).
Chia: 言(い)いました → 言った + くせに.
Từ vựng: 先輩(せんぱい) = tiền bối, đàn anh; 仕事(しごと) = công việc; 全部(ぜんぶ) = toàn bộ; 何(なに)もしない = chẳng làm gì cả.
Nối: V/ Aい thể thông thường + くせに; N/ Naな + くせに (子どものくせに, 下手なくせに).
Chú ý: くせに hàm ý trách móc, không dùng để nói về bản thân hay người trên một cách lịch sự.
Phân biệt: ～くせに (đã ~ mà còn ~, chê trách) ≠ ～のに (trung tính hơn, tiếc nuối/ bất ngờ) ≠ ～にもかかわらず (văn viết, trang trọng).`,
    translation: 'A: Anh khóa trên đã nói "việc này em làm hết cho" vậy mà chẳng làm gì cả. B: Ồ, vậy à. Vất vả nhỉ.',
  },
  {
    id: 'w-b-3-1', part: P3, kind: 'essay',
    question: '「自分の考え（気持ちを伝える時など）」のテーマについて、200文字以上（6～7行に相当）の作文を作ってください。',
    answer:
`私は、自分の考えを伝えるときは、相手の話をよく聞いてから話すようにしています。
以前は、自分の意見を先に言ってしまうことが多く、友達とけんかになったこともありました。しかし、相手の気持ちを聞いてから話すようにしたところ、お互いの考えがよくわかるようになりました。
また、気持ちを伝えるときは、「私は～と思います」のように、自分の考えとして話すことも大切だと思います。そうすれば、相手を責めているように聞こえないからです。
考えが違っても、お互いを理解しようとする気持ちがあれば、いい関係をつくることができます。これからも、相手を大切にしながら、自分の考えを伝えていきたいです。`,
    explain:
`Bố cục: (1) cách mình truyền đạt ý kiến → (2) trải nghiệm trước đây và thay đổi → (3) mẹo khi nói → (4) kết luận. Hơn 200 chữ.
Cấu trúc ngữ pháp đã dùng:
- ～ようにしている (cố gắng giữ thói quen): 話すようにしています.
- ～てから (sau khi ~ rồi mới ~): よく聞いてから話す.
- ～ことがある (thỉnh thoảng có chuyện ~) / ～たこともある (đã có lần ~): けんかになったこともありました.
- ～たところ (sau khi thử ~ thì ~): 聞いてから話すようにしたところ、わかるようになりました.
- ～ようになる (trở nên có thể ~): わかるようになりました.
- ～そうすれば (nếu vậy thì): 責めているように聞こえない.
- ～ながら (vừa ~ vừa ~): 大切にしながら伝えていきたい.
Từ vựng: 意見(いけん) = ý kiến; けんか = cãi nhau; お互(たが)い = lẫn nhau; 責(せ)める = trách móc; 理解(りかい) = thấu hiểu.`,
    translation:
`Khi truyền đạt suy nghĩ của mình, tôi cố gắng lắng nghe kỹ đối phương trước rồi mới nói.
Trước đây tôi thường nói ý kiến của mình trước, có lúc còn cãi nhau với bạn. Nhưng từ khi tôi thử nghe cảm xúc của đối phương rồi mới nói, hai bên đã hiểu suy nghĩ của nhau rõ hơn.
Ngoài ra khi bày tỏ cảm xúc, tôi nghĩ nói theo kiểu "tôi nghĩ là ~", tức là nói như suy nghĩ của riêng mình, cũng rất quan trọng. Làm vậy sẽ không nghe như đang trách đối phương.
Dù suy nghĩ khác nhau, nếu có tấm lòng muốn hiểu nhau thì vẫn có thể xây dựng mối quan hệ tốt. Từ nay tôi cũng muốn vừa trân trọng đối phương vừa truyền đạt suy nghĩ của mình.`,
  },
]
