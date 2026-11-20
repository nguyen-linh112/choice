// Giải thích chi tiết Đề SU23 - 2ndFE - R (44 câu + bài đọc 3 câu). Thứ tự đáp án theo raw/su23fe2r.mjs.
export const CHOICE = {
  1: [
    'Sai. なんで = tại sao; dùng để hỏi, không đứng trước 分かりませんでした để chỉ mức độ.',
    'Đúng. まったく + phủ định = hoàn toàn không. 日本に来たばかり = vừa mới đến Nhật; ころ = lúc. Cả câu: "Lúc mới đến Nhật, tôi hoàn toàn không hiểu tiếng Nhật."',
    'Sai. わざと = cố ý; không hợp với "không hiểu".',
    'Sai. わざわざ = mất công làm; không hợp.',
  ],
  2: [
    'Đúng. Mẫu: Vる + に限(かぎ)る = ~ là tốt nhất. 聞く = hỏi. 旅行先(りょこうさき) = nơi đi du lịch; 土地(とち)の人 = người địa phương. Cả câu: "Muốn biết quán ngon ở nơi du lịch thì hỏi người địa phương là tốt nhất."',
    'Sai. 聞いた (dạng quá khứ) không đi với に限る.',
    'Sai. 聞いている (đang hỏi) không đi với に限る.',
    'Sai. 聞かない (không hỏi) ngược nghĩa lời khuyên.',
  ],
  3: [
    'Sai. 気にきいた không phải cách nói đúng.',
    'Sai. "X" = không điền gì; 気きいた thiếu trợ từ.',
    'Đúng. 気(き)が利(き)く = tinh tế, khéo léo; 気がきいたデザイン = thiết kế tinh tế (khéo). 服(ふく) = quần áo. Cả câu: "Có nhiều quần áo thiết kế tinh tế."',
    'Sai. を không đi với 気が利く.',
  ],
  4: [
    'Đúng. Mẫu: N のため(に) = vì ~ (lý do, văn trang trọng). 悪天候(あくてんこう) = thời tiết xấu; キャンセル = hủy. Cả câu: "Do thời tiết xấu, chúng tôi xin phép hủy trận đấu hôm nay." (Đề không có bình luận nên đáp án do mình tự phân tích.)',
    'Sai. なもので = vì ~ (giải thích cá nhân, văn nói); không hợp thông báo trang trọng và 悪天候 là danh từ nên phải dùng の.',
    'Sai. のせいで = tại ~ (lỗi), dùng cho kết quả xấu và trách móc; thông báo của ban tổ chức không dùng.',
    'Sai. にしては = so với ~ thì; không hợp.',
  ],
  5: [
    'Sai. おやこうこう (親孝行 = hiếu thảo) là từ khác; câu cần tính từ な.',
    'Đúng. りっぱ(立派)な = đáng nể, tuyệt vời. 学費(がくひ) = học phí; 若いのに = còn trẻ mà. Cả câu: "Còn trẻ mà tự đi làm trả học phí, thật đáng nể nhỉ."',
    'Sai. うらやましい = ghen tị; không hợp ngữ cảnh khen.',
    'Sai. 意外(いがい) = bất ngờ; không phải lời khen đúng nghĩa.',
  ],
  6: [
    'Sai. に dùng chỉ địa điểm tồn tại; 暮らす đi với で để chỉ nơi sinh sống.',
    'Đúng. Mẫu: (nơi) で + 暮らす = sống ở ~. 生(う)まれた時(とき)からずっと = từ khi sinh ra. Cả câu: "Tôi sống ở đây từ lúc sinh ra." (Đề không có bình luận nên đáp án do mình tự phân tích.)',
    'Sai. と = với; không hợp.',
    'Sai. を không đi với 暮らす.',
  ],
  7: [
    'Đúng. Mẫu: ～と言うのに = vậy mà (trái ngược). 出発(しゅっぱつ) = xuất phát; 準備(じゅんび) = chuẩn bị. Cả câu: "Nghe nói 1 tiếng nữa khởi hành đi du lịch vậy mà vẫn chưa chuẩn bị gì."',
    'Sai. 言えば = nếu nói; không tạo sự trái ngược.',
    'Sai. 言うので = vì nói; không tạo sự trái ngược.',
    'Sai. 言う = nói; không nối được vế sau.',
  ],
  8: [
    'Sai. 落(お)ち込(こ)む = buồn bã (tự động từ); không đi với を.',
    'Đúng. ショックを受(う)ける = bị sốc. 急(きゅう)に = đột ngột; 帰国(きこく)する = về nước. Cả câu: "Nghe bạn A đột ngột về nước, tôi bị sốc."',
    'Sai. かける (掛ける) không đi với ショック.',
    'Sai. 倒(たお)す = làm đổ.',
  ],
  9: [
    'Sai. 地形(ちけい) = địa hình.',
    'Sai. 気象(きしょう) = khí tượng.',
    'Sai. 例年(れいねん) = mọi năm.',
    'Đúng. 音声(おんせい) = âm thanh, tiếng. 映像(えいぞう) = hình ảnh. Cả câu: "Khi định xem phim trên máy tính thì chỉ có hình, không nghe thấy tiếng."',
  ],
  10: [
    'Sai. 同僚(どうりょう) = đồng nghiệp.',
    'Đúng. 許可(きょか) = cho phép. 許可してもらえなかった = đã không được cho phép. 店長(てんちょう) = cửa hàng trưởng; 休(やす)ませてもらう = xin nghỉ. Cả câu: "Tôi nhờ cửa hàng trưởng cho nghỉ tuần sau nhưng không được cho phép."',
    'Sai. 印刷(いんさつ) = in ấn.',
    'Sai. 後悔(こうかい) = hối hận.',
  ],
  11: [
    'Đúng. Mẫu: ～ことから = vì việc ~ nên (kết quả). 自転車(じてんしゃ)の事故(じこ)が増(ふ)えたことから = vì tai nạn xe đạp tăng nên. 警察(けいさつ)の注意(ちゅうい)が厳(きび)しくなった = cảnh sát nhắc nhở nghiêm hơn. Cả câu: "Vì tai nạn xe đạp tăng nên cảnh sát siết chặt nhắc nhở."',
    'Sai. 気をつけよう = hãy cẩn thận; là ý chí của người nói, không hợp với ～ことから (nêu hệ quả khách quan).',
    'Sai. 自転車に乗りたくない = không muốn đi xe đạp; là ý muốn cá nhân, không phải hệ quả của ～ことから.',
    'Sai. バスに乗りました = đã đi xe buýt; không liên quan.',
  ],
  12: [
    'Sai. はいり là dạng bỏ ます, không đứng trước に限る.',
    'Đúng. Mẫu: Vる + に限(かぎ)る = ~ là tốt nhất. 温泉(おんせん)に入(はい)る = ngâm suối nước nóng. 体の調子(ちょうし)が悪い = cơ thể không khỏe. Cả câu: "Khi cơ thể không khỏe thì ngâm suối nước nóng là tốt nhất."',
    'Sai. はいった (quá khứ) không đi với に限る.',
    'Sai. はいらなく là dạng phủ định chưa hoàn chỉnh; ý nghĩa ngược lời khuyên.',
  ],
  13: [
    'Đúng. 賛成(さんせい) = tán thành. 賛(さん) = tán; 成(せい) = thành. 計画(けいかく) = kế hoạch. Cả câu: "Tôi tán thành kế hoạch đó."',
    'Sai. 讃政 không phải từ.',
    'Sai. 賛政 không phải từ (政 = chính).',
    'Sai. 讃成 không phải từ (chữ 讃 khác 賛).',
  ],
  14: [
    'Đúng. Mẫu: N に感動(かんどう)する = cảm động trước N. 映画(えいが) = phim. Cả câu: "Tôi cảm động trước bộ phim này."',
    'Sai. で chỉ phương tiện/nơi chốn; 感動する đi với に.',
    'Sai. が chỉ chủ ngữ; không dùng cho đối tượng gây cảm động.',
    'Sai. を đi với tha động từ trực tiếp; 感動する đi với に.',
  ],
  15: [
    'Đúng. Mẫu: N を通(つう)じて = thông qua N (làm trung gian). 高校時代(こうこうじだい)の友達を通じて = thông qua bạn thời cấp ba. 知(し)り合(あ)う = quen biết. Cả câu: "Tôi quen cô ấy thông qua bạn thời cấp ba."',
    'Sai. において = tại, ở (nơi chốn/thời điểm); không hợp "thông qua bạn".',
    'Sai. に対(たい)して = đối với ~; không hợp.',
    'Sai. にとって = đối với (quan điểm); không hợp.',
  ],
  16: [
    'Sai. アルバム = album.',
    'Sai. アドレス = địa chỉ (email).',
    'Đúng. アドバイス(advice) = lời khuyên. せんぱいにアドバイスしてもらう = nhờ đàn anh cho lời khuyên. 気(き)をつける = chú ý. Cả câu: "Tôi được đàn anh khuyên về những điều nên chú ý khi sống ở Nhật."',
    'Sai. アルバイト = làm thêm.',
  ],
  17: [
    'Đúng. 直訳(ちょくやく) = dịch sát nghĩa. 直(ちょく) = trực tiếp; 訳(やく) = dịch. 文章(ぶんしょう) = văn bản. Cả câu: "Dịch sát nghĩa văn bản."',
    'Sai. 直駅 không phải từ.',
    'Sai. 直設 không phải từ.',
    'Sai. 直尺 không phải từ.',
  ],
  18: [
    'Sai. 喜ぶ(よろこぶ) = vui mừng (chính mình vui); không dùng để diễn đạt "làm người khác vui".',
    'Đúng. 喜(よろこ)ばせる = làm cho vui (thể sai khiến). Vる + ために = để ~. 恋人(こいびと) = người yêu; サプライズ = bất ngờ. Cả câu: "Anh ấy chuẩn bị tiệc bất ngờ để làm người yêu vui."',
    'Sai. 喜ばれる = được/bị vui (bị động); không hợp chủ thể "anh ấy".',
    'Sai. 喜ばせられる = bị bắt phải vui; không hợp.',
  ],
  19: [
    'Đúng. Mẫu: Vる + つもりだった = đã định làm ~ (nhưng không làm được). 買(か)い物(もの) = mua sắm; 頭(あたま)が痛(いた)い = đau đầu. Cả câu: "Hôm qua tôi đã định đi mua sắm nhưng vì đau đầu nên ở nhà suốt."',
    'Sai. 行ったつもりだった = tưởng là đã đi (nhưng chưa); nghĩa khác.',
    'Sai. 行くつもりだ = định đi (hiện tại); không hợp thì quá khứ của câu.',
    'Sai. 行ったつもりだ = coi như đã đi; không hợp.',
  ],
  20: [
    'Sai. 一緒に = cùng nhau; không hợp với "のメールアドレス".',
    'Đúng. お互(たが)い = lẫn nhau. お互いのメールアドレス = địa chỉ email của nhau. 交流会(こうりゅうかい) = buổi giao lưu; 交換(こうかん) = trao đổi. Cả câu: "Tôi trao đổi email của nhau với người quen ở buổi giao lưu."',
    'Sai. 以外(いがい) = ngoài ra.',
    'Sai. 出会(であ)い = cuộc gặp gỡ.',
  ],
  21: [
    'Đúng. Mẫu: Vる + ことにしよう = quyết định (cùng) làm ~. 今夜(こんや) = tối nay; 早(はや)く寝(ね)る = ngủ sớm. Cả câu: "Tối nay ngủ sớm, mai dậy sớm rồi quyết định học thôi."',
    'Sai. 勉強するところだった = đã suýt học / đang định học.',
    'Sai. 勉強するわけだ = thì ra là học (giải thích, kết luận).',
    'Sai. 勉強すればよかった = giá mà đã học; là tiếc nuối quá khứ, không hợp "mai dậy sớm".',
  ],
  22: [
    'Sai. 立てた = đã lập; không nhấn việc chuẩn bị trước.',
    'Sai. 立てる必要がある = cần lập; chỉ nói sự cần thiết.',
    'Sai. 立てたい = muốn lập; chỉ là ý muốn.',
    'Đúng. Mẫu: Vて + おく = làm sẵn. ～場合(ばあい)に備(そな)えて = phòng khi ~. 予想外(よそうがい) = ngoài dự đoán. Cả câu: "Phòng khi có rắc rối ngoài dự đoán, chúng tôi đã lập sẵn kế hoạch khác."',
  ],
  23: [
    'Sai. よかったこと không phải cách nói tự nhiên sau ば.',
    'Sai. いいかも = có lẽ tốt; không diễn đạt sự tiếc nuối.',
    'Sai. よかったもの không phải cách nói tự nhiên sau ば.',
    'Đúng. Mẫu: Vば + いいのに = giá mà ~ thì tốt. ゆっくりしていく = ở lại thong thả. Cả câu: "Về rồi sao? Giá mà ở lại thêm chút nữa thì hay."',
  ],
  24: [
    'Sai. さかんで (盛んで) = thịnh vượng; phải dùng 栄えて cho "港町として栄える".',
    'Đúng. 栄(さか)える = thịnh vượng, phát triển. 港町(みなとまち) = thị trấn cảng; 明治時代(めいじじだい) = thời Minh Trị. Cả câu: "Thành phố Otaru ở Hokkaido thời Minh Trị đã thịnh vượng như một thị trấn cảng."',
    'Sai. 延(の)びる = kéo dài.',
    'Sai. 開催(かいさい)する = tổ chức.',
  ],
  25: [
    'Đúng. Mẫu: ～おかげで + kết quả hiện tại. 体力(たいりょく)がついてきた = thể lực đã khá hơn. 頑張(がんば)れる = có thể cố gắng (thể khả năng). Cả câu: "Nhờ thể lực tăng lên, từ nay tôi có thể cố gắng được."',
    'Sai. がんばろう = hãy cố gắng; là ý chí, không phải kết quả nhờ thể lực.',
    'Sai. がんばることにした = đã quyết định cố gắng; không phải kết quả "có thể".',
    'Sai. がんばれた = đã có thể cố gắng (quá khứ); câu có これからは (từ nay) nên cần hiện tại/tương lai.',
  ],
  26: [
    'Sai. ねすかた không đúng cách đọc (từ ghép chuyển thành ねすがた).',
    'Đúng. 寝姿(ねすがた) = dáng vẻ khi ngủ. 寝(ね) = ngủ; 姿(すがた) = dáng vẻ. Cả câu: "Tôi không muốn bị nhìn thấy dáng vẻ khi ngủ."',
    'Sai. ねがた không đúng.',
    'Sai. ねすた không đúng.',
  ],
  27: [
    'Sai. いつか = một lúc nào đó; không hợp với "chỉ khóc".',
    'Đúng. ただ + ～だけ = chỉ ~ mà thôi. ただ泣いているだけ = chỉ khóc mà thôi. Cả câu: "Hỏi gì đứa bé cũng chỉ khóc, không trả lời gì."',
    'Sai. ただし = tuy nhiên (thêm điều kiện).',
    'Sai. いつ = khi nào; từ để hỏi.',
  ],
  28: [
    'Sai. 課長になった = trở thành trưởng nhóm; là sự kiện đơn lẻ, không phải "kéo theo cùng lúc" (とともに).',
    'Sai. 給料が3万円増えた = lương tăng 3 vạn yên; là sự việc cụ thể, không diễn tả sự thay đổi dần cùng nhịp.',
    'Đúng. Mẫu: ～とともに = cùng với việc ~ thì cũng (thay đổi song song). 経験(けいけん)が増(ふ)える = kinh nghiệm tăng; 地位(ちい)が上(あ)がる = địa vị nâng lên. Cả câu: "Cùng với việc kinh nghiệm làm việc tăng, địa vị trong công ty cũng dần được nâng lên."',
    'Sai. 高い車が買えた = mua được xe đắt; không có quan hệ song song với kinh nghiệm.',
  ],
  29: [
    'Sai. 知っているにかかわらず nối sai (正しくは 知っているにもかかわらず).',
    'Đúng. Mẫu: Vながら = tuy ~ mà (trái ngược). 知っていながら、何も言わなかった = biết mà không nói. 事実(じじつ) = sự thật. Cả câu: "Người đó biết sự thật mà không nói gì với tôi."',
    'Sai. 知っていることから = vì biết nên; không tạo sự trái ngược.',
    'Sai. 知っていたまま = cứ giữ nguyên trạng thái đã biết; không tự nhiên.',
  ],
  30: [
    'Sai. に cũng có thể đi với 発展 nhưng nhấn điểm đến tĩnh, ít tự nhiên hơn へ.',
    'Sai. で = bằng/ở; không chỉ hướng.',
    'Đúng. へ chỉ hướng mở rộng. 海外(かいがい)へ発展(はってん)していった = đã mở rộng ra nước ngoài. 商社(しょうしゃ) = công ty thương mại. Cả câu: "Công ty thương mại đó đã phát triển ra nước ngoài." (Đề không có bình luận nên đáp án do mình tự phân tích.)',
    'Sai. まで = đến tận (giới hạn); không hợp.',
  ],
  31: [
    'Sai. 聞く (dạng từ điển) không dùng với ところ ở nghĩa "sau khi hỏi thì (phát hiện)".',
    'Đúng. Mẫu: Vた + ところ = sau khi ~ thì (phát hiện ra). 駅員(えきいん) = nhân viên nhà ga; 忘(わす)れ物(もの) = đồ để quên; 届(とど)く = được gửi tới. Cả câu: "Hỏi nhân viên nhà ga thì đồ để quên đã được gửi đến."',
    'Sai. 聞いている = đang hỏi; không hợp.',
    'Sai. 聞いていた = đã đang hỏi; không hợp.',
  ],
  32: [
    'Sai. 最親 không phải từ.',
    'Sai. 匙新 không phải từ.',
    'Đúng. 最新(さいしん) = mới nhất. 事件(じけん) = vụ việc; ニュース = tin tức. Cả câu: "Bạn đã nghe tin mới nhất về vụ việc này chưa?"',
    'Sai. 匙親 không phải từ.',
  ],
  33: [
    'Sai. とともに = cùng với; không hợp "thay thế".',
    'Sai. に対(たい)して = đối với ~; không hợp.',
    'Đúng. Mẫu: N にかわり = thay cho N (văn lịch sự). 私にかわり山田という者がまいります = thay cho tôi, một người tên Yamada sẽ đến. 会議(かいぎ) = cuộc họp; よろしくお願いします = xin nhờ. Cả câu: "Xin lỗi, ngày mai tôi không thể đến họp được nên sẽ có người tên Yamada đến thay tôi, mong anh/chị giúp đỡ."',
    'Sai. のわりに = so với ~ thì; không hợp.',
  ],
  34: [
    'Sai. はんせい (反省 = tự kiểm điểm) là từ khác.',
    'Đúng. 反証(はんしょう) = bằng chứng phản bác. 証言(しょうげん) = lời chứng. Cả câu: "Tôi muốn bạn đưa ra bằng chứng phản bác lời khai này."',
    'Sai. はんそう (搬送 = vận chuyển) là từ khác.',
    'Sai. ばんしょう không phải cách đọc.',
  ],
  35: [
    'Sai. に không hợp: 彼に訪れる thành "đến thăm anh ấy" ở dạng bị động chưa đúng.',
    'Sai. で = bằng/ở; không hợp.',
    'Sai. が cũng có thể nối nhưng không phải đáp án mà 3 bình luận chọn.',
    'Đúng. を đi với 訪(おとず)れる (đến thăm): 会社を訪れる. Đề trong video có thể bị cắt chữ nên 3 bình luận cùng chọn đáp án này; xem như đáp án tham khảo.',
  ],
  36: [
    'Sai. 面(めん)して = hướng ra; "気候に面して" không có nghĩa.',
    'Sai. 流(なが)れて = chảy.',
    'Đúng. N に恵(めぐ)まれる = được ưu đãi bởi N. 気候(きこう) = khí hậu; 住(す)みやすい = dễ sống. Cả câu: "Vùng này được thiên nhiên ban cho khí hậu tốt nên rất dễ sống."',
    'Sai. 連(つら)なって = nối tiếp thành chuỗi.',
  ],
  37: [
    'Đúng. 疑問(ぎもん) = nghi vấn, thắc mắc. 疑(ぎ) = nghi; 問(もん) = hỏi. 数字(すうじ) = con số. Cả câu: "Tôi còn thắc mắc về con số đó."',
    'Sai. 嶷問 không phải từ.',
    'Sai. 疑門 không phải từ (門 ≠ 問).',
    'Sai. 嶷門 không phải từ.',
  ],
  38: [
    'Sai. 守れがたい không đúng; ～がたい chỉ đi với dạng bỏ ます.',
    'Đúng. Mẫu: Vる(thể khả năng) + っこない = chắc chắn không thể ~. 守(まも)れっこない = chắc chắn không giữ được. 約束(やくそく) = lời hứa. Cả câu: "Dù có hứa những điều không thể thì cũng chắc chắn không giữ được."',
    'Sai. 守るわけだ = vì thế nên giữ; không hợp.',
    'Sai. 守れる = có thể giữ; mâu thuẫn với "không thể thực hiện".',
  ],
  39: [
    'Sai. はずだ = chắc chắn là ~ (suy đoán); không phải cách kết luận.',
    'Sai. はずはない = không thể nào; không hợp.',
    'Đúng. Mẫu: ～わけだ = nghĩa là, thì ra (giải thích, kết luận). 毎日8時間寝ている。つまり、人生の3分の1をベッドで過ごすわけだ = ngủ 8 tiếng mỗi ngày, tức là một phần ba cuộc đời ở trên giường. Cả câu: "Tôi ngủ 8 tiếng mỗi ngày, tức là dành một phần ba cuộc đời trên giường."',
    'Sai. わけではない = không có nghĩa là; phủ định ngược với つまり (tức là).',
  ],
  40: [
    'Sai. おうがん không phải cách đọc của 横顔.',
    'Sai. おがん không phải cách đọc.',
    'Đúng. 横顔(よこがお) = gương mặt nhìn nghiêng. 横(よこ) = ngang, bên; 顔(かお) = mặt. Cả câu: "Cô ấy nhìn nghiêng đẹp hơn."',
    'Sai. よこかお sai: 顔 sau 横 đọc là がお (biến âm).',
  ],
  41: [
    'Đúng. 誤解(ごかい) = hiểu lầm. 本意(ほんい) = ý định thật. 全(まった)く = hoàn toàn. Cả câu: "Bạn hoàn toàn hiểu lầm ý định thật của tôi."',
    'Sai. 呉解 không phải từ.',
    'Sai. 説解 không phải từ.',
    'Sai. 提解 không phải từ.',
  ],
  42: [
    'Sai. てんかい (展開 = triển khai) là từ khác.',
    'Sai. かいてん (回転 = quay) là từ khác.',
    'Đúng. 発展(はってん) = phát triển, tiến triển. 話(はなし)が思(おも)いがけない方法(ほうほう)へ発展した = câu chuyện tiến triển theo hướng bất ngờ. Cả câu: "Câu chuyện đã phát triển theo hướng không ngờ tới."',
    'Sai. はつてん không phải cách đọc (phải là はってん, có âm ngắt っ).',
  ],
  43: [
    'Sai. ときに = vào lúc; không diễn tả sự lặp lại nhiều lần.',
    'Sai. とおりに = đúng như ~.',
    'Sai. ほかに = ngoài ra.',
    'Đúng. Mẫu: Vる + たびに = mỗi lần ~ thì. 発見(はっけん) = phát hiện. Cả câu: "Mỗi lần đọc cuốn sách này tôi lại có phát hiện mới."',
  ],
  44: [
    'Đúng. 論破(ろんぱ) = bác bỏ lý luận. 論(ろん) = luận; 破(は → ぱ) = phá. 理論(りろん) = lý thuyết. Cả câu: "Anh ấy đã bác bỏ lý thuyết của cô ta."',
    'Sai. ろんは không đúng (biến âm thành ぱ).',
    'Sai. ろんかい không phải cách đọc.',
    'Sai. ろんがい không phải cách đọc.',
  ],
}

export const READING = {
  translation:
`Gửi Sayuri,
Hôm qua cậu đã nhiệt tình mời mình đến bữa tiệc chúc mừng nhưng mình không thể tham dự được, thật xin lỗi cậu. Mình đã gọi điện báo vắng mặt nhưng vì không có thời gian nên không giải thích được rõ lý do.
Thật ra bố mẹ của một người bạn mình sắp đến Nhật, hôm qua bạn ấy lẽ ra phải ra sân bay đón nhưng đột nhiên bị sốt nên không đi được. Vì vậy mình đã đi thay. Mình thành thật xin lỗi vì vắng mặt đột xuất. Lần sau nếu có dịp như vậy, nhất định hãy gọi mình nhé.
Hôm qua mình được bố mẹ của người bạn đó tặng rất nhiều quà. Vì là những món lạ không mua được ở Nhật nên mình muốn chia cho cậu một ít. Mình vừa gửi riêng cho cậu rồi, mời cậu thưởng thức nhé.
Hẹn gặp cậu sớm.
Maki
(Từ mới: おすそわけ = chia phần; 別便 = gửi riêng; 賞味 = thưởng thức.)`,
  1: [
    'Ý này đúng với bài nên không chọn. Bài viết: 出席できなくて、申し訳ありませんでした = xin lỗi vì không thể tham dự.',
    'Đây là ý sai cần chọn. Bài không hề nói "lần sau chắc chắn sẽ tham dự" (必ず出席する). Bài chỉ nói またこのような機会があれば、ぜひお声をかけてください = nếu có dịp thì hãy gọi mình. Lưu ý: bình luận trong video chọn ý "có gọi điện báo vắng nhưng không nói rõ lý do", trong khi ý đó lại khớp với bài, nên mình chọn ý trái với bài này.',
    'Ý này đúng với bài nên không chọn. Bài viết: お電話で欠席のご連絡をしましたが、時間がなかったため、詳しく事情をお伝えできませんでした = đã gọi báo vắng mặt nhưng không giải thích rõ lý do.',
    'Ý này đúng với bài nên không chọn. Bài viết: またこのような機会があれば、ぜひお声をかけてください = nếu có dịp như vậy hãy gọi tôi.',
  ],
  2: [
    'Sai. Bài không nhắc đến quà sinh nhật (たんじょうび = sinh nhật).',
    'Đúng. Bài viết: たくさんお土産をいただきました…さゆりさんにもおすそわけしたい…別便でお送りしました = chia phần quà mình nhận được (もらい物) gửi cho Sayuri. おすそわけ = chia phần.',
    'Sai. Quà không phải do Maki mua ở sân bay mà là do bố mẹ người bạn tặng.',
    'Sai. Quà do bố mẹ người bạn tặng (không phải Maki gửi quà bố mẹ bạn mua cho mình); thứ gửi đi là phần quà đã nhận được.',
  ],
  3: [
    'Sai. Bài không nói do bận (いそがしくて) mà là vì phải đi đón.',
    'Đúng. Bài viết: 友人が空港に迎えに行くはずだったが、急に熱があって…私が代わりに行くことになった = bạn bị sốt, Maki đi đón thay bố mẹ bạn ở sân bay (空港(くうこう)). 迎(むか)える = đón.',
    'Sai. Không phải Maki chăm sóc (看病(かんびょう)) bạn bị bệnh; Maki đi đón thay.',
    'Sai. Không phải Maki giúp bố mẹ bạn mua quà (お土産); quà là do họ mang đến tặng.',
  ],
}
