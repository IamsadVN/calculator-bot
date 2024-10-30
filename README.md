# Calculator Discord Bot

Một dự án để thực hiện phép tính toán trên nền tảng Discord, được chạy trên NodeJS cùng với package [discord.js](https://github.com/discordjs/discord.js/)

Được phát triển bởi Iamsad_VN cho công việc học JavaScript

# Yêu cầu
- NodeJS > 20
- MongoDB
- Mắt, não, và tay để chạy

# Cài đặt
## Bước 1: Clone repository này ra:
```
git clone https://github.com/IamsadVN/calculator-bot
```
## Bước 2: Cài đặt các package
```
npm install 
```
## Bước 3: Chỉnh sửa file `.env`
```
cp .env.example .env
```
Thêm vào các giá trị dưới đây:
- `BOT_TOKEN` = Token của bot
- `PREFIX` = Prefix mà bạn dự định để bot trả lời bạn
- `MONGO_DB` = URI của MongoDB
- `WEBHOOK_ERROR` = Webhook gửi lỗi về 1 máy chủ nhất định
- `WEBHOOK_GUILDJOIN` = Webhook gửi embed về 1 guild mà bot tham gia
- `WEBHOOK_GUILDLEFT` = Webhook gửi embed về 1 guild mà bot đã rời
## Bước 4: Chạy bot
```
node .
```
# Contribution
Mọi sự đóng góp đều được chấp nhận (nếu đóng góp không gây hại cho Project).

Bạn có thể fork Project này, nhưng vui lòng hãy ghi tên tôi, chỉ vậy thôi.
