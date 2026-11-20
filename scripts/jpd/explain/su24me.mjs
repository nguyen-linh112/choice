// Giải thích chi tiết Đề SU24 - ME (37 câu + bài đọc). Thứ tự đáp án theo raw/su24me.mjs.
export const CHOICE = {
  1: [
    'Đúng. 周辺(しゅうへん) = vùng xung quanh, vùng lân cận. 周(しゅう) = vòng quanh; 辺(へん) = vùng, bên cạnh. 東京とその周辺 = Tokyo và vùng phụ cận. Cả câu: "Ở Tokyo và vùng phụ cận, các tòa nhà mới liên tục mọc lên."',
    'Sai. 周込 không có trong tiếng Nhật (込 đọc こむ là "đông, chen vào").',
    'Sai. 週込 không có; 週 (しゅう) = tuần, không liên quan.',
    'Sai. 週辺 không có; chữ đúng là 周 chứ không phải 週.',
  ],
  2: [
    'Sai ở vị trí này. 希望(きぼう)した = đã mong muốn; đứng đầu câu: 彼は希望した… (anh ấy đã mong muốn …). Đây là chỗ trống thứ nhất, không phải ★.',
    'Đúng. Trật tự: 希望した + とおりの + 会社に + 就職できて. とおりの = đúng như ~ (Vた + とおり(の) + N). Chỗ ★ ở vị trí thứ hai là とおりの. Cả câu: "Anh ấy vui vì đã xin được việc vào công ty đúng như mình mong muốn."',
    'Sai ở vị trí này. 就職(しゅうしょく)できて = vào làm được; đứng thứ tư, ngay trước 喜んでいる.',
    'Sai ở vị trí này. 会社(かいしゃ)に = vào công ty; đứng thứ ba, trước 就職できて.',
  ],
  3: [
    'Sai. わざわざ = mất công làm ~ (cố ý, tốn công); không hợp với "tâm lý con người thì đa dạng".',
    'Đúng. さまざま(様々) = đa dạng, muôn hình muôn vẻ. 人の心(こころ)はさまざま = lòng người mỗi người một khác. Cả câu: "Lòng người vốn đa dạng nên không cần bận tâm lắm đâu."',
    'Sai. たまたま = tình cờ; không hợp ngữ cảnh.',
    'Sai. まだまだ = còn lâu, vẫn còn nhiều; không dùng để mô tả "lòng người".',
  ],
  4: [
    'Sai ở vị trí này. マイクを = cái micro (tân ngữ); đứng thứ ba: 下手なくせに + マイクを + 持つと.',
    'Sai ở vị trí này. くせに = dù là ~ mà (trách móc); đứng thứ hai, sau 下手な.',
    'Đúng. 持(も)つと = hễ cầm vào thì. Trật tự: 下手な + くせに + マイクを + 持つと + 放さない. ★ ở vị trí thứ tư là 持つと. Cả câu: "Anh trai tôi hát dở mà hễ cầm micro là không chịu buông."',
    'Sai ở vị trí này. 下手(へた)な = dở, kém; đứng đầu chuỗi (bổ nghĩa cho くせに).',
  ],
  5: [
    'Sai ở vị trí này. ペットを = thú cưng (tân ngữ); đứng đầu: ペットを + 家族の + 一員 + とする.',
    'Sai ở vị trí này. 一員(いちいん) = một thành viên; đứng thứ ba, ngay sau 家族の.',
    'Sai ở vị trí này. とする = coi là, xem như; đứng cuối, trước 人.',
    'Đúng. 家族(かぞく)の = của gia đình; đứng thứ hai (★). Trật tự: ペットを + 家族の + 一員 + とする + 人が増えてきた. Mẫu: N を N の一員 とする = coi N như một thành viên của ~. Cả câu: "Dạo này có vẻ ngày càng nhiều người coi thú cưng là thành viên trong gia đình."',
  ],
  6: [
    'Sai. 行ってよかったのよ nghĩa là "đi thì tốt rồi đấy", là nhận xét khi đã đi; câu giả định cần ～たら/～ば + よかったのに.',
    'Sai. 行けばいいので (vì nếu đi thì được) không diễn đạt sự tiếc nuối.',
    'Đúng. Mẫu: Vたら + よかったのに = giá mà ~ thì tốt (tiếc nuối). そんな楽しいパーティーだったなら = nếu bữa tiệc vui như thế. Cả câu: "Nếu là bữa tiệc vui như vậy thì giá mà tôi cũng đi thì tốt."',
    'Sai. 行くといいのよ (đi thì tốt đấy) là lời khuyên cho tương lai, không phải câu giả định quá khứ.',
  ],
  7: [
    'Đúng. 栄転(えいてん) = được thăng chức và chuyển công tác. 栄(えい) = vinh; 転(てん) = chuyển. 部長(ぶちょう) = trưởng phòng. Cả câu: "Chúc mừng trưởng phòng Tanaka được thăng chức chuyển công tác."',
    'Sai. こうてん (好転 = chuyển biến tốt) là từ khác.',
    'Sai. えいうん không tồn tại.',
    'Sai. こううん (幸運 = may mắn) là từ khác.',
  ],
  8: [
    'Đúng. Mẫu: N を通(とお)して = thông qua N (làm trung gian). 学校を通して申し込む = đăng ký thông qua nhà trường. しょうがくきん = học bổng; 申(もう)し込(こ)む = đăng ký. Cả câu: "Học bổng của hiệp hội IT, nhất định hãy đăng ký thông qua nhà trường."',
    'Sai. を中心に(ちゅうしんに) = lấy ~ làm trung tâm; không hợp với "đăng ký".',
    'Sai. にかわって = thay cho ~; không phù hợp nghĩa.',
    'Sai. によって = tùy theo / do ~; không hợp nghĩa ở đây.',
  ],
  9: [
    'Đúng. 間違(まちが)う = sai, nhầm. 間違っている = đang bị sai. 内容(ないよう) = nội dung; 文法(ぶんぽう) = ngữ pháp; 漢字(かんじ) = chữ Hán. Cả câu: "Bài văn này nội dung tốt nhưng ngữ pháp và chữ Hán còn nhiều chỗ sai."',
    'Sai. 異(こと)なる = khác nhau; không hợp.',
    'Sai. にぎわう = nhộn nhịp, đông vui.',
    'Sai. 行(おこな)う = tiến hành, thực hiện.',
  ],
  10: [
    'Sai ở vị trí này. したい = muốn làm; đứng đầu: 子供が + したい + と思うことは.',
    'Sai ở vị trí này. やりたい = muốn làm (cho); đứng cuối: やらせて + やりたい.',
    'Sai ở vị trí này. と思うことは = điều mà (con) nghĩ là ~; đứng thứ hai sau したい.',
    'Đúng. やらせて = cho (con) làm; đứng thứ ba (★). Trật tự: 子供が + したい + と思うことは + やらせて + やりたい + と思っています. Mẫu: Vさせてやる = cho (ai) làm gì. Cả câu: "Tôi muốn cho con làm những điều mà con muốn làm."',
  ],
  11: [
    'Sai. すばらしければ = nếu tuyệt vời; không dùng để mời lịch sự.',
    'Sai. うらやましければ = nếu thấy ghen tị; không hợp.',
    'Đúng. よろしければ = nếu quý vị không phiền / nếu được ạ (cách nói lịch sự). Cả câu: "Thưa thầy, tối nay chúng em có tổ chức tiệc, nếu thầy không phiền thì xin mời thầy đến ạ."',
    'Sai. うつくしければ = nếu đẹp; không hợp ngữ cảnh mời.',
  ],
  12: [
    'Đúng. Mẫu: Vる + ことはない = không cần phải ~. 心配(しんぱい)する = lo lắng. 温泉(おんせん) = suối nước nóng; 地震(じしん) = động đất. Cả câu: "Không cần phải lo đến mức đó đâu."',
    'Sai. 心配するつもりではありません = không có ý định lo; không hợp.',
    'Sai. せいじゃありません = không phải do ~ (lỗi); không hợp.',
    'Sai. 心配するしかありません = chỉ còn cách lo; ngược ý khuyên "đừng lo".',
  ],
  13: [
    'Sai ở vị trí này. ばかり = chỉ toàn; đứng cuối: 遊んで + ばかり + いて.',
    'Đúng. 遊(あそ)んで = chơi; đứng thứ ba (★). Trật tự: 悪い + 友だちと + 遊んで + ばかり + いて. Mẫu: Vてばかりいる = suốt ngày chỉ ~. Cả câu: "Con trai tôi suốt ngày chỉ chơi với bạn xấu, hoàn toàn không chịu học."',
    'Sai ở vị trí này. 悪(わる)い = xấu; đứng đầu, bổ nghĩa cho 友だち.',
    'Sai ở vị trí này. 友(とも)だちと = với bạn; đứng thứ hai.',
  ],
  14: [
    'Sai. 埋(う)め立(た)てる = lấp đất; không hợp với "気持ちが".',
    'Sai. 名付(なづ)ける = đặt tên; không hợp.',
    'Sai. 持(も)ち上(あ)げる = nâng lên.',
    'Đúng. 落(お)ち込(こ)む = buồn bã, suy sụp. Cả câu: "Cô ấy không đỗ đại học mình mong muốn nên bây giờ có vẻ rất buồn bã."',
  ],
  15: [
    'Sai. たかせる không tồn tại; chữ 任 không đọc như vậy.',
    'Đúng. 任(まか)せる = giao phó. 任せる + から = vì giao hết cho em nên. プロジェクト = dự án. Cả câu: "Em Uo, toàn bộ dự án lần này anh giao cho em, cố lên nhé!"',
    'Sai. もかせる không tồn tại.',
    'Sai. つかせる không phải cách đọc của 任せる.',
  ],
  16: [
    'Sai. 芸い không có nghĩa; 芸(げい) = nghệ thuật.',
    'Đúng. 苦(にが)い = đắng. この薬(くすり)はちょっと苦いけど = thuốc này hơi đắng nhưng. 効果(こうか) = hiệu quả.',
    'Sai. 茗い không phải chữ đúng (茗 = trà).',
    'Sai. 若(わか)い = trẻ, là từ khác.',
  ],
  17: [
    'Sai. ひとみしり(人見知り) = nhút nhát với người lạ.',
    'Sai. いろちがい(色違い) = khác màu.',
    'Đúng. 言葉遣い(ことばづかい) = cách dùng từ ngữ, cách ăn nói. お年寄り(おとしより) = người cao tuổi; 目上(めうえ)の人 = người bề trên. Cả câu: "Khi nói chuyện với người lớn tuổi hay bề trên thì nên chú ý cách dùng từ."',
    'Sai. 出会い(であい) = cuộc gặp gỡ.',
  ],
  18: [
    'Sai. 材像 không phải từ.',
    'Sai. 材象 không phải từ.',
    'Sai. 対像 không phải từ (đúng là 対象).',
    'Đúng. 対象(たいしょう) = đối tượng. アンケート = bảng khảo sát. Cả câu: "Chúng tôi đang tìm đối tượng cho cuộc khảo sát lần này."',
  ],
  19: [
    'Đúng. Mẫu: Vた + くせに = dù đã ~ mà còn ~ (trách móc). 遅(おく)れてきた = đến muộn; 勝手(かって)な = tùy tiện, ích kỷ. Cả câu: "Đã đến muộn mà còn nói những điều tùy tiện à?"',
    'Sai. せいか = có lẽ do ~; không hợp với trách móc.',
    'Sai. とおりに = đúng như ~.',
    'Sai. うちに = trong lúc ~.',
  ],
  20: [
    'Sai. について = về (chủ đề), không chỉ tư cách.',
    'Sai. にとって = đối với (quan điểm).',
    'Đúng. Mẫu: N として = với tư cách là N. 彼女(かのじょ)は教師(きょうし)として学生の前に立っている = cô ấy đứng trước sinh viên với tư cách là giáo viên. 去年(きょねん)まで = đến năm ngoái. Cả câu: "Cô ấy đến năm ngoái còn là sinh viên, giờ đang đứng trước sinh viên với tư cách giáo viên."',
    'Sai. にしても = dù ~ cũng; không hợp.',
  ],
  21: [
    'Sai. とおりに = đúng như ~; không phù hợp vì "khám sức khỏe" không phải mệnh lệnh.',
    'Sai. ように = để / như ~; không hợp nghĩa nguyên nhân lặp lại.',
    'Sai. ことから = vì ~ (lý do rút ra); không tả việc lặp lại.',
    'Đúng. Mẫu: Vる + たびに = mỗi lần ~ thì. 健康診断(けんこうしんだん) = khám sức khỏe; 運動不足(うんどうぶそく) = thiếu vận động; 注意(ちゅうい) = nhắc nhở. Cả câu: "Mỗi lần đi khám sức khỏe, tôi đều bị bác sĩ nhắc là thiếu vận động."',
  ],
  22: [
    'Sai. マッサージ = massage.',
    'Sai. ホームページ = trang web.',
    'Sai. ソーセージ = xúc xích.',
    'Đúng. メッセージ(message) = thông điệp, lời nhắn. 作家(さっか) = tác giả; 伝(つた)える = truyền đạt. Cả câu: "Tôi đã đọc cuốn tiểu thuyết này nhiều lần nhưng vẫn chưa hiểu thông điệp mà tác giả muốn truyền tải."',
  ],
  23: [
    'Sai. 心配された = bị lo lắng (bị động); chủ ngữ là cô ấy nên không phải bị động của chính mình.',
    'Đúng. 心配させる = làm cho (ai) lo lắng (sai khiến). 彼女は日本に着いたが、すぐ電話しなかったので、両親を心配させた = vì không gọi ngay nên làm bố mẹ lo lắng. Cả câu: "Cô ấy đến Nhật nhưng không gọi điện ngay nên đã làm bố mẹ lo lắng."',
    'Sai. 心配させられた = bị bắt phải lo (bị động sai khiến); không hợp với chủ thể "cô ấy".',
    'Sai. 心配した = đã lo lắng; nhưng người lo là bố mẹ, không phải cô ấy.',
  ],
  24: [
    'Sai. ところに = đúng lúc đang ~ thì; không hợp với "nghe nói".',
    'Sai. ところで = nhân tiện / dù có ~ cũng; không hợp.',
    'Sai. ところを = đúng lúc ~ (thường đi với bị làm phiền); không hợp.',
    'Đúng. Mẫu: Vた + ところ = sau khi ~ thì (phát hiện ra). 先生(せんせい)に聞(き)いたところ = sau khi hỏi thầy thì. お休(やす)み = nghỉ. Cả câu: "Hỏi thầy thì được biết cô Hayashi nghỉ."',
  ],
  25: [
    'Sai. わりに = so với ~ thì lại ~; không hợp.',
    'Sai. うちに = trong lúc ~; không hợp vì "không có thời gian".',
    'Sai. くせに = dù là ~ mà; không hợp ngữ cảnh.',
    'Đúng. せいか = có lẽ vì ~ (lý do không chắc chắn). 時間がなかったせいか = có lẽ vì không có thời gian. あわてて = vội vàng. Cả câu: "Có lẽ vì không có thời gian nên anh ấy vội vàng ra khỏi phòng."',
  ],
  26: [
    'Đúng. 許可(きょか) = cho phép, giấy phép. 校長先生(こうちょうせんせい) = hiệu trưởng. Cả câu: "Em Hayashi, nếu không có sự cho phép của hiệu trưởng thì không được vào phòng đó."',
    'Sai. 変化(へんか) = thay đổi.',
    'Sai. 参加(さんか) = tham gia.',
    'Sai. 追加(ついか) = thêm vào.',
  ],
  27: [
    'Sai. 周りに海を囲まれている: に + を không đúng vai trò (を phải gắn với 周り, に gắn với 海).',
    'Đúng. Mẫu: N を N に囲(かこ)まれる = bị/được N bao quanh. 周(まわ)りを海に囲まれている = xung quanh được biển bao bọc. 南北(なんぼく) = Nam Bắc; 島(しま) = đảo. Cả câu: "Nhật Bản là một hòn đảo dài theo hướng Nam Bắc, xung quanh được biển bao bọc."',
    'Sai. を・が: が gắn với 海 sẽ làm biển thành chủ ngữ bao quanh, mâu thuẫn với bị động.',
    'Sai. に・が: 周りに海が囲まれている không thành câu (囲む cần tác nhân biển + đối tượng 日本).',
  ],
  28: [
    'Sai. 党原 không có nghĩa.',
    'Đúng. 光景(こうけい) = cảnh tượng. 交通事故(こうつうじこ) = tai nạn giao thông. Cả câu: "Tai nạn giao thông là cảnh tượng thường thấy ở vùng này."',
    'Sai. 光原 không có nghĩa.',
    'Sai. 党景 không có nghĩa.',
  ],
  29: [
    'Sai. しょうぎょう(商業) = thương nghiệp.',
    'Đúng. 残業(ざんぎょう) = làm thêm giờ. 仕事も簡単だし、残業も少ないし = công việc đơn giản, ít phải tăng ca. Cả câu: "Công ty này công việc đơn giản, ít tăng ca nữa nên tôi rất thích."',
    'Sai. きぎょう(企業) = doanh nghiệp.',
    'Sai. そつぎょう(卒業) = tốt nghiệp.',
  ],
  30: [
    'Sai. てっち không phải cách đọc của 設置.',
    'Sai. せったい(接待) = tiếp đãi, từ khác.',
    'Sai. けったい không phải cách đọc của 設置.',
    'Đúng. 設置(せっち) = lắp đặt. 非常(ひじょう)ベル = chuông báo động; 安全(あんぜん) = an toàn. Cả câu: "Để đảm bảo an toàn, chúng tôi quyết định lắp chuông báo động."',
  ],
  31: [
    'Đúng. 盛(さか)んに = sôi nổi, thịnh hành. 当時(とうじ) = thời đó. Cả câu: "Loại điện thoại này nghe nói thời đó được sử dụng rất rộng rãi."',
    'Sai. 夢中(むちゅう)に = say mê.',
    'Sai. 意外(いがい)に = bất ngờ.',
    'Sai. 本気(ほんき)に = nghiêm túc.',
  ],
  32: [
    'Sai. 表(あらわ)れて = hiện ra; không hợp với máy tính.',
    'Sai. 破(やぶ)れて = bị rách (giấy, vải).',
    'Đúng. 壊(こわ)れる = hỏng. 壊れている = đang hỏng. パソコン = máy tính. Cả câu: "Máy tính đang bị hỏng nên không dùng được đâu."',
    'Sai. 遅(おく)れて = chậm trễ.',
  ],
  33: [
    'Sai. にしてみれば = đứng ở lập trường ~ thì.',
    'Sai. にくらべて = so với ~.',
    'Sai. にそなえて = đề phòng ~.',
    'Đúng. Mẫu: ～にしては = so với ~ thì (trái với dự đoán). 5年も住んでいたにしては = dù đã sống 5 năm mà. Cả câu: "Cô ấy đã sống ở Nhật tận 5 năm mà tiếng Nhật không giỏi lắm."',
  ],
  34: [
    'Sai. たおす(倒す) = làm đổ.',
    'Sai. よごす(汚す) = làm bẩn.',
    'Sai. ながす(流す) = làm chảy, xả.',
    'Đúng. 許(ゆる)す = tha thứ, cho phép. 悪(わる)いこと = việc xấu. Cả câu: "Tôi không thể tha thứ cho việc xấu như vậy."',
  ],
  35: [
    'Đúng. Mẫu: N を楽(たの)しみにする = mong chờ N; 病気(びょうき)で = vì bị bệnh (で chỉ nguyên nhân). Trong đề: 楽しみにしていた旅行 = chuyến đi mà đã mong chờ; 病気で = vì bệnh. Cả câu: "Chuyến đi mong chờ từ lâu nhưng vì bị bệnh nên không đi được."',
    'Sai. 楽しみをしていた không tự nhiên; mẫu đúng là に.',
    'Sai. 病気に không dùng để chỉ nguyên nhân.',
    'Sai. 楽しみでしていた không phải cấu trúc đúng.',
  ],
  36: [
    'Đúng. 開催(かいさい) = tổ chức (sự kiện). 開催される = được tổ chức. オリンピック = Olympic. Cả câu: "Olympic 2020 sẽ được tổ chức ở Tokyo nhưng vì không có tiền nên tôi không đi xem được."',
    'Sai. 期待(きたい) = kỳ vọng.',
    'Sai. 公開(こうかい) = công khai / 後悔(こうかい) = hối hận; không hợp.',
    'Sai. 受胎(じゅたい) = thụ thai; không hợp.',
  ],
  37: [
    'Sai. さいじゅう không phải cách đọc của 在住.',
    'Sai. さいちゅう(最中) = đang giữa lúc ~; là từ khác.',
    'Đúng. 在住(ざいじゅう) = cư trú. 日本在住 = đang sống ở Nhật. 超(こ)える = vượt quá. Cả câu: "Số người Việt đang sống ở Nhật đã vượt 300.000 người."',
    'Sai. ざいちゅう không tồn tại.',
  ],
}

export const READING = {
  translation:
`Gần đây, loại ớt chuông (ピーマン) mới đã bắt đầu được bày bán trong các cửa hàng. Loại ớt chuông này khác với loại trước đây cả về hình dáng lẫn vị. Trước kia, vì vị đắng và mùi nồng nên ớt chuông là một trong những loại rau mà trẻ con ghét.
Tuy nhiên, loại ớt chuông mới này hầu như không đắng và cũng ít mùi. Khi cho học sinh tiểu học ăn thử thì khoảng 8 phần 10 trả lời rằng ăn sống cũng ngon. Đó là sự ra đời của loại ớt chuông mà trẻ em cũng có thể thích.
Thực ra việc nghiên cứu loại ớt chuông mới này đã mất tới 10 năm. Điểm xuất phát là một loại ớt cay của nước ngoài. Loại ớt này quá cay đối với người Nhật, nhưng tình cờ người ta tìm được giống không cay. Sau đó, tận dụng ưu điểm của loại ớt đó, người ta đã tạo ra loại ớt chuông kiểu mới.
Trước khi có loại ớt chuông mới này, việc bắt con ăn ớt chuông là rất vất vả đối với cha mẹ. Nghe nói các bậc cha mẹ ấy cũng vui mừng vì nhẹ nhõm hơn.
(Chú thích: 偶然 = ngẫu nhiên, tình cờ.)`,
  1: [
    'Đúng. Bài viết: ほとんど苦くなくて、においもあまりしません (hầu như không đắng và cũng ít mùi) → trẻ trả lời ăn sống cũng ngon. 苦(にが)さ = vị đắng; におい = mùi.',
    'Sai. Bài nói loại ớt mới "ほとんど苦くなくて", không phải "đắng nhưng ít mùi".',
    'Sai. Bài nói mùi ít (においもあまりしません), không phải "mùi mạnh".',
    'Sai. Bài nói "においもあまりしません" (cũng ít mùi) chứ không phải "hoàn toàn không có mùi".',
  ],
  2: [
    'Sai. Điểm xuất phát là とうがらし (ớt cay) của nước ngoài chứ không phải "ピーマン nước ngoài" tạo ra loại mới.',
    'Đúng. Bài: 外国産のとうがらしで、日本人には辛すぎるものでしたが、偶然辛くないものが見つかった = từ ớt cay nước ngoài, tình cờ tìm được giống không cay. 出発点(しゅっぱつてん) = điểm xuất phát; 辛(から)い = cay.',
    'Sai. Bài nói là とうがらし (ớt cay), không phải ピーマン cay của nước ngoài.',
    'Sai. Bài không nói tạo ra ớt cay mới; chỉ nói tìm ra giống không cay.',
  ],
  3: [
    'Sai. Bài không bàn về độ khó của việc nghiên cứu rau mới; chỉ nói mất 10 năm nghiên cứu.',
    'Sai. Bài không giới thiệu phương pháp cho trẻ ăn rau nói chung.',
    'Đúng. Cả bài nói về loại ớt chuông mới mà trẻ em cũng thích (子供も好きになれるピーマンの誕生). Đây là chủ đề chính. Lưu ý: bình luận trong video chọn D nhưng D nói về とうがらし (ớt cay), không phải ớt chuông nên mình chọn đáp án này.',
    'Sai. Bài nói về ピーマン (ớt chuông), không phải とうがらし (ớt cay); ớt cay chỉ là điểm xuất phát.',
  ],
}
