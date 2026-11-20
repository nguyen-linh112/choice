// Giải thích chi tiết Đề SP24 - ME (25 câu thu được từ video + bài đọc 3 câu). Thứ tự đáp án theo raw/sp24me.mjs.
export const CHOICE = {
  1: [
    'Sai. Mẫu ～に決まっている nối với thể thông thường: できそうもない + に決まっている không tự nhiên vì ～そうもない đã mang nghĩa "trông không có vẻ ~"; hơn nữa 決まっている là khẳng định chắc chắn.',
    'Sai. できる = làm được; trái nghĩa với ý "việc nhiều thế này một ngày không thể làm hết".',
    'Đúng. Mẫu: thể thông thường + に決(き)まっている = chắc chắn là ~. できない + に決まっている = chắc chắn không làm nổi. 仕事(しごと) = công việc; 一日(いちにち)では = trong một ngày. Cả câu: "Nhiều việc thế này thì chắc chắn một ngày không làm hết."',
    'Sai. できないかもしれない = có lẽ không làm được (không chắc chắn); không đi với に決まっている (chắc chắn).',
  ],
  2: [
    'Sai. どうぞ たくさん食べてください = xin mời ăn nhiều; câu mời ăn không phải kết quả của việc không ăn sáng.',
    'Đúng. Mẫu: ～ものだから = vì ~ nên (giải thích lý do cá nhân). 朝(あさ)ごはん = bữa sáng; おなかがすく = đói bụng. Cả câu: "Vì chưa ăn sáng nên (tôi) đói bụng."',
    'Sai. 早くご飯にしよう = mau ăn cơm thôi; là lời đề nghị, không phải kết quả tự nhiên.',
    'Sai. ここで食べてもいいですか = có thể ăn ở đây không; không phải kết quả của "không ăn sáng".',
  ],
  3: [
    'Sai. あまり勉強しません = không học nhiều; mâu thuẫn với "đỗ nên lẽ ra phải vui" ở mẫu ～にしては.',
    'Đúng. Mẫu: ～にしては = so với ~ thì (trái với kỳ vọng). 試験(しけん)に合格(ごうかく)したにしては = đỗ kỳ thi mà. うれしくなさそうだ = có vẻ không vui. Cả câu: "Anh John đỗ kỳ thi mà trông không vui nhỉ."',
    'Sai. 大喜(おおよろこ)びしている = đang vui mừng khôn xiết; đỗ thì vui là điều đương nhiên, không trái kỳ vọng nên không dùng ～にしては.',
    'Sai. 国(くに)へ帰ってしまった = đã về nước; không liên quan.',
  ],
  5: [
    'Đúng. 礼(れい) = chào, cúi chào. 礼をする = cúi chào. 立(た)つ = đứng; 座(すわ)ったまま = vẫn ngồi nguyên. Cả câu: "Vì không đứng dậy được nên tôi cúi chào trong tư thế ngồi."',
    'Sai. さつ không phải cách đọc của 礼 (札 = さつ: tiền giấy).',
    'Sai. さい không phải cách đọc của 礼.',
    'Sai. れつ (列 = hàng) là chữ khác.',
  ],
  7: [
    'Đúng. コンクリート (concrete) = bê tông. 鉄筋(てっきん)コンクリート = bê tông cốt thép. 伝統的(でんとうてき) = mang tính truyền thống. Cả câu: "Dạo này thay vì nhà truyền thống, đa số nhà được xây bằng bê tông cốt thép."',
    'Sai. セメント = xi măng (nguyên liệu); không nói "nhà làm bằng xi măng" cùng với 鉄筋.',
    'Sai. フローリング = sàn gỗ.',
    'Sai. インターネット = Internet.',
  ],
  8: [
    'Sai. のせいで = tại ~ (lý do xấu); không hợp với "đi đón con thay chị".',
    'Đúng. Mẫu: N のかわりに = thay cho N. いそがしい姉(あね)のかわりに = thay cho người chị bận rộn. 幼稚園(ようちえん) = trường mẫu giáo; 迎(むか)えに行(い)く = đi đón. Cả câu: "Tôi đi đón cháu ở trường mẫu giáo thay cho chị đang bận."',
    'Sai. の通(とお)りに = đúng như ~; không hợp.',
    'Sai. によって = tùy theo/bởi; không hợp.',
  ],
  9: [
    'Sai. うまい = ngon, giỏi; chữ 若 không đọc là うまい.',
    'Sai. こわい (怖い) = đáng sợ.',
    'Sai. かたい (硬い) = cứng.',
    'Đúng. 若(わか)い = trẻ. 祭(まつ)り = lễ hội; にぎやか = náo nhiệt. Cả câu: "Ở lễ hội có nhiều người trẻ đến nên rất náo nhiệt."',
  ],
  11: [
    'Sai. 広(ひろ)がる = lan rộng; không đi với "nhiều người ~ địa điểm".',
    'Đúng. 訪(おとず)れる = đến thăm. 多くの人が訪れる場所 = nơi có nhiều người đến thăm. 中華街(ちゅうかがい) = khu phố Tàu; 山下公園(やましたこうえん) = công viên Yamashita. Cả câu: "Ở Yokohama có những nơi nhiều người đến thăm như khu phố Tàu và công viên Yamashita."',
    'Sai. 連(つら)なる = nối tiếp thành chuỗi.',
    'Sai. 栄(さか)える = hưng thịnh.',
  ],
  17: [
    'Sai. 価直 không phải từ (chữ đúng là 値).',
    'Sai. 加値 không phải từ.',
    'Đúng. 価値(かち) = giá trị. 価(か) = giá; 値(ち) = trị giá. 図書館(としょかん) = thư viện. Cả câu: "Thư viện có nhiều sách cũ có giá trị."',
    'Sai. 加直 không phải từ.',
  ],
  19: [
    'Sai. 発展(はってん)する = phát triển; không hợp "nhiều người ở lại một năm".',
    'Sai. 開催(かいさい)する = tổ chức; không hợp.',
    'Đúng. にぎわう = đông đúc, nhộn nhịp. N で + にぎわう = nhộn nhịp bởi N. 通(とお)して = suốt (cả năm). 地域(ちいき) = khu vực. Cả câu: "Khu vực này quanh năm lúc nào cũng đông đúc người."',
    'Sai. 普及(ふきゅう)する = phổ biến.',
  ],
  20: [
    'Sai. ぐっと = (ý nghĩa) mạnh một cái, hẳn lên; không hợp với "không phải cố ý".',
    'Sai. ずっと = suốt; không hợp.',
    'Đúng. わざと = cố tình. わざとじゃない = không phải cố ý. 足(あし)を踏(ふ)む = giẫm lên chân. Cả câu: A: "Đau! Đừng giẫm vào chân tôi!" B: "Xin lỗi. Tớ không cố ý đâu."',
    'Sai. すると = sau đó, nếu vậy thì; không hợp.',
  ],
  21: [
    'Sai. 空侯 không phải từ.',
    'Sai. 空気(くうき) = không khí; từ khác.',
    'Đúng. 空港(くうこう) = sân bay. 国際(こくさい) = quốc tế; 働(はたら)く = làm việc. Cả câu: "Anh Tanaka làm việc ở sân bay quốc tế."',
    'Sai. 空船 không phải từ.',
  ],
  22: [
    'Sai. 若しい không phải từ (若い là わかい).',
    'Đúng. 苦(くる)しい = khó khăn, đau khổ. 協力(きょうりょく)し合(あ)う = hợp tác với nhau. Cả câu: "Những lúc khó khăn thì việc cùng nhau hợp tác là rất quan trọng."',
    'Sai. 著(いちじる)しい = rõ rệt.',
    'Sai. 芳(かんば)しい = thơm, đáng mừng; không đọc là くるしい.',
  ],
  23: [
    'Sai. くるしくて (苦しくて) = khổ sở; không hợp với "ngạc nhiên vì bà đi đứng".',
    'Sai. はずかしくて = xấu hổ; không hợp.',
    'Sai. すばらしくて = tuyệt vời; nghĩa hợp nhưng cách dùng 歩きからして + 若々しくて mới nói về tuổi tác.',
    'Đúng. 若々(わかわか)しい = trẻ trung. 歩(ある)きからして = chỉ nhìn cách đi đứng. 驚(おどろ)く = ngạc nhiên. Cả câu: "Bà của gia đình bản xứ đã 80 tuổi nhưng chỉ nhìn cách đi đứng thôi cũng thấy trẻ trung đến mức tôi ngạc nhiên."',
  ],
  24: [
    'Sai. でも = ngay cả; 時間でもない không đúng ngữ pháp.',
    'Sai. こそ = chính là; không hợp.',
    'Sai. なら = nếu là; không hợp.',
    'Đúng. Mẫu: N さえ ～ない = đến N cũng không có. 時間(じかん)さえない = đến thời gian cũng không có. 食事(しょくじ) = bữa ăn. Cả câu: "Bận quá, đến thời gian ăn cơm cũng không có."',
  ],
  30: [
    'Sai. 印冊 không phải từ.',
    'Sai. 印版 không phải từ.',
    'Sai. 印刊 không phải từ.',
    'Đúng. 印刷(いんさつ) = in ấn. プリンター = máy in. Cả câu: "Máy in này in cả ảnh cũng rất đẹp."',
  ],
  31: [
    'Sai. 電子(でんし)ブログ = blog điện tử (không phải thứ thay thế tiền mặt).',
    'Đúng. 電子(でんし)マネー = tiền điện tử. 現金(げんきん) = tiền mặt; 代(か)わり = thay cho. Cả câu: "Thay cho tiền mặt, người ta bắt đầu dùng tiền điện tử."',
    'Sai. 電子グッズ = hàng điện tử; không phải thứ thay tiền mặt.',
    'Sai. 電子リボン = ruy băng điện tử; không có nghĩa.',
  ],
  32: [
    'Sai. ところ = nơi/lúc; ～するところ (đang định làm) không hợp với "mỗi lần".',
    'Sai. わりに = so với ~ thì; không hợp.',
    'Đúng. Mẫu: Vる + たびに = mỗi lần ~ thì. 帰国(きこく)する = về nước; 景色(けしき) = cảnh sắc. Cả câu: "Mỗi lần về nước, cảnh vật quanh nhà lại thay đổi."',
    'Sai. につき = vì ~ (biển thông báo); không hợp.',
  ],
  33: [
    'Sai. 行かない + どころではない: どころではない nối với động từ dạng từ điển (行く), không dùng dạng phủ định.',
    'Sai. 行ける (có thể đi) + どころではない: dùng thể khả năng thì nghĩa thành "không thể có chuyện có thể đi", không đúng cách nói thông thường.',
    'Đúng. Mẫu: Vる + どころではない = không có chuyện/không còn tâm trí để ~. 趣味(しゅみ)はスキーだが = sở thích là trượt tuyết nhưng; 忙(いそが)しくて = bận. Cả câu: "Sở thích của tôi là trượt tuyết nhưng năm ngoái bận suốt nên chẳng có tâm trí đâu mà đi trượt tuyết."',
    'Sai. 行った + どころではない: dạng quá khứ không đi với どころではない.',
  ],
  34: [
    'Sai. 知るのに = dù biết thì (trái ngược) nhưng chia ở thì hiện tại 知る không hợp với "việc lớp đã đổi phòng".',
    'Sai. 知ったせいで = tại biết nên; ngược nghĩa (người bạn không nói cho mình biết).',
    'Đúng. Mẫu: Vながら = tuy ~ mà (trái ngược). 知りながら教えてくれませんでした = biết mà vẫn không nói cho tôi. 教室(きょうしつ)が変(か)わった = phòng học đã đổi. Cả câu: "Bạn tôi biết phòng học đã đổi mà không cho tôi biết."',
    'Sai. 知るなら = nếu biết thì; không hợp.',
  ],
  35: [
    'Sai. なつかしい = hoài niệm; không dùng cho "thành công của bạn".',
    'Đúng. うらやましい = ghen tị, thèm muốn. 成功(せいこう) = thành công. Cả câu: "Tôi ghen tị với thành công của bạn đấy."',
    'Sai. あたらしい = mới.',
    'Sai. うつくしい = đẹp.',
  ],
  36: [
    'Sai. について = về (chủ đề).',
    'Sai. にとって = đối với (quan điểm).',
    'Đúng. Mẫu: N に反(はん)して = trái với N. 予想(よそう)に反して = trái với dự đoán. 少(すく)なかった = ít. Cả câu: "Tôi tưởng bữa tiệc sẽ có nhiều người đến, nhưng trái với dự đoán lại có ít."',
    'Sai. として = với tư cách là.',
  ],
  37: [
    'Sai. 通(つう)じて = thông qua; không hợp với "gửi lời hỏi thăm bố mẹ và cả gia đình".',
    'Sai. かわり = thay cho; không hợp.',
    'Đúng. Mẫu: N をはじめ = đứng đầu là N (kể cả các N khác). ご両親(りょうしん)をはじめ家族の皆さん = từ bố mẹ đến cả gia đình. 伝(つた)える = chuyển lời. Cả câu: "Xin hãy gửi lời hỏi thăm của tôi đến cả gia đình, nhất là bố mẹ bạn."',
    'Sai. 中心(ちゅうしん)として = lấy làm trung tâm; không hợp với lời gửi hỏi thăm.',
  ],
  38: [
    'Sai. かわりに = thay vì; không hợp.',
    'Sai. わりに = so với ~ thì; không hợp.',
    'Sai. ために = để / vì; không hợp.',
    'Đúng. Mẫu: Vている + うちに = trong lúc đang ~ thì (đã xảy ra việc khác). ゲームをしているうちに = trong lúc chơi game. ひらがな = chữ Hiragana; 覚(おぼ)える = nhớ. Cả câu: "Con tôi trong lúc chơi game đã nhớ được chữ Hiragana."',
  ],
  39: [
    'Sai. さらす = phơi bày.',
    'Sai. しるす = ghi chép.',
    'Đúng. あらわす (表す) = thể hiện, biểu hiện. 包(つつ)む = gói. 気持(きも)ちを表す = thể hiện tấm lòng. 考(かんが)えられてきた = từ trước đến nay vẫn được cho rằng. Cả câu: "Ở Nhật từ xưa việc gói quà được cho là thể hiện tấm lòng muốn làm người nhận vui."',
    'Sai. ながす = làm chảy, xả.',
  ],
}

export const READING = {
  translation:
`Hôm trước, tôi được bạn rủ và lần đầu leo núi Phú Sĩ. Vì là ngọn núi cao nhất Nhật Bản nên tôi luôn mong một ngày nào đó sẽ leo, vì thế lời rủ của bạn khiến tôi rất vui. Với người chưa quen leo núi như tôi thì giữa đường thật vất vả đến mức muốn quay về. Nhưng càng lên cao càng thấy phong cảnh tuyệt đẹp mở ra.
Rồi khi lên đến đỉnh và ngắm bình minh, tôi xúc động đến rơi nước mắt. Ánh mặt trời buổi sáng le lói qua kẽ mây thật đẹp. Đẹp đến mức (1) tôi quên cả chụp ảnh.
Tuy nhiên cũng có điều đáng tiếc. Đó là trên đường leo núi tôi thấy rất nhiều rác: chai nhựa, lon nước, vỏ bánh kẹo... Mỗi lần nhìn thấy những thứ rác đó tôi lại thấy khó chịu. Nghĩ đến chuyện (2) núi Phú Sĩ nhìn từ dưới lên thì rất đẹp mà thực tế lại như thế này, tôi thấy buồn. Hơn nữa tôi cũng thấy vài người nước ngoài, và trước mặt họ tôi cũng (3) cảm thấy xấu hổ.
Nghe nói hiện nay đang có phong trào "Hãy làm sạch núi Phú Sĩ", nhưng không chỉ một bộ phận người mà tất cả những người leo núi đều phải nghĩ như vậy. Leo núi tốt cho sức khỏe, lại được ngắm cảnh đẹp. Cảm giác khi lên tới đỉnh thì không thể diễn tả bằng lời. Vì ai cũng muốn tận hưởng việc leo núi thoải mái nên tôi nghĩ mạnh mẽ rằng phải giữ phép lịch sự (không xả rác).`,
  1: [
    'Sai. Bài nói cảm động đến rơi nước mắt nhưng việc quên chụp ảnh là do cảnh bình minh quá đẹp, không phải vì "vui đến phát khóc".',
    'Đúng. Bài viết: 頂上(ちょうじょう)に着いて日の出(ひので)を見たときは、感動(かんどう)で涙が出た。雲の間からこぼれる朝日はとても美しかった。それは写真を撮るのも忘れてしまうほどだった = bình minh đẹp đến mức quên cả chụp ảnh. 日の出 = bình minh; 感動 = cảm động.',
    'Sai. Lúc lên đến đỉnh tác giả rất xúc động chứ không "mệt nên không chụp".',
    'Sai. Rác là điều đáng tiếc ở đoạn sau (登山の途中), không phải lúc ở đỉnh.',
  ],
  2: [
    'Sai. Câu 「下から見る富士山はとてもきれいなのに、実際はこんななんだ」 nói về rác chứ không phải việc leo núi vất vả.',
    'Sai. Câu không nói về bình minh khi leo xuống/lên; ý "bình minh đẹp" ở đoạn trước.',
    'Đúng. Đoạn trước nêu rác trên đường leo: ペットボトル (chai nhựa), 缶(かん) (lon), 袋(ふくろ) (túi) → thấy rác nên buồn: nhìn từ xa (từ dưới) núi Phú Sĩ rất đẹp nhưng thực tế (実際(じっさい)) có nhiều rác.',
    'Sai. Câu không nói leo lên sẽ phát hiện điều tuyệt hơn; ngược lại tác giả thấy buồn.',
  ],
  3: [
    'Đúng. Bài viết: 外国の人も何人か見かけたが、その人たちに対しても恥ずかしくなった = thấy người nước ngoài cũng cảm thấy xấu hổ, vì để họ nhìn thấy ngọn núi nhiều rác. 恥(は)ずかしい = xấu hổ.',
    'Sai. Bài không nói tác giả khóc rồi bị người nước ngoài thấy.',
    'Sai. Bài không nói tác giả không nói chuyện được với người nước ngoài.',
    'Sai. Bài không nói việc "muốn leo mà đã mệt"; ngược lại, lý do xấu hổ là vì rác trên núi.',
  ],
}
