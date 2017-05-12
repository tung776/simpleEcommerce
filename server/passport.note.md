#### giải thích về cơ chế của passport ####
***Các bước xác thực tài khoản qua request của người dùng.***

Ví dụ bạn đặt route xác thực tài khoản là /login. Khi người dùng đăng nhập vào vệ thống passport sẽ xử lý như sau:

Khi người dùng submit form đăng nhập, một request POST được tạo ra tới route /login , nó sẽ 
chạy cái middleware passport.authenticate cho bạn.Như trên ta thiết lập kịch bản "local.login" cho thằng 
passport.authenticate nên nó sẽ gọi đến cái kịch bản ta đã cài đặt.

Nó lấy dữ liệu req.body.username và req.body.password rồi gán cho hàm verify local.
Ở đây như cấu hình ở trên ta thấy chúng ta sẽ query database rồi kiểm tra xem passport của người dùng đưa lên 
có đúng không.Trong trường hợp Error từ db ta gọi đến callback là done với param là err( done(err)) Khi mà nó
không tìm thấy được người dùng hợp lý ta gọi đến thằng done(null,false). Còn nếu thông tin đăng nhập đúng ta
gọi done(null,user).Khi callback done được gọi, nó sẽ lấy dữ liệu err, user và dữ liệu bạn custom thêm nếu có
trả lại cho thằng passport.authenticate.

Nếu dữ liệu trả về của callback là null, true, xác thực thành công passport tiếp tục gọi hàm req.login( cái này
tự gắn vào từng request khi bạn cài đặt passport ở bước 1)

Hàm req.login gọi đến thằng passport.serializeUser mà ta đã định nghĩa trước đó. Hàm này truy cập vào đối tượng
user mà ta trả về cho middleware passport.authenticate và xác định xem thành phần nào của đối tượng sẽ lưu vào
trong session. Kết quả của hàm này là ta sẽ có đối tượng req.session.passport.user = các thông tin ta truyền vào
trong serializeUser.Trong ví dụ bên trên thì nó là user.id. Đồng thời với trên passport cũng có gắn thông tin user
vào req.user.

Việc xác thực kết thục, hàm requestHandler sẽ được gọi đưa chúng tra đến trang đã thiết lập
Xác thực các request sau khi đăng nhập.

Tất nhiên chúng ta chỉ đăng nhập 1 lần vào hệ thống, không phải cứ làm bất cữ việc gì ta cũng phải điền 
username - password. Trong các request tiếp theo đến hệ thống passport hoạt động như sau:

Với mỗi request , express sẽ load các sữ liệu trong session ra và gắn nó và đối tượng request (req.session).
Ở trên ta đã sử dụng hàm serializeUser để đưa dữ liệu vào session nên ta có thể tìm thấy dữ liệu đó tạo 
req.session.passport.user.
Middleware khởi động passport (passport.initialize) sẽ check xem trong request session có passport.user không.
Nếu chưa có là chưa xác thực thì thằng req.session.passport.user = {}
Tiếp đó passport.session được gọi. Nếu thấy passport.user trong sesion request đó được tính là đã xác thực.
Khi request được tính là đã xác thực nó sẽ gọi hàm passport.deserializeUser. Hàm này sử dụng thông tin trong
session để lấy dữ liệu đầy đủ về thằng user rồi gắn nó vào req.user.

###Tổng kết ###
Ở đây mình tóm tắt lại các hàm các middleware của passport :
```
passport.initialize : middleware được gọi ở từng request, kiểm tra session lấy ra passport.user nếu chưa có thì tạo rỗng.
passport.session: middleware sử dụng kịch bản Passport , sử dụng session lấy thông tin user rồi gắn vào req.user.
passport.deserializeUser : hàm được gọi bởi passport.session .Giúp ta lấy dữ liệu user dựa vào thông tin lưu trên session và gắn vào req.user
passport.authenticate: middleware giúp ta gắn kịch bản local vào route.
passport.serializeUser: hàm được gọi khi xác thực thành công để lưu thông tin user vào session
```
Các hàm hỗ trợ thêm cho từng request
Với từng request passport gắn thêm cho bạn 4 hàm :
```
req.login()
req.logout()
req.isAuthenticated()
req.isUnauthenticated()
```