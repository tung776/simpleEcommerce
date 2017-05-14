### Chú ý: ###
Dự án này xây dựng dựa trên nodejs 7.6.0 nên cần cài đặt nvm.
Sau khi cài đặt nvm cần nâng cấp nodejs lên phiên bản 7.6.0 trở lên:
1. Cài đặt iisnode
2. Cài đặt url rewrite
```
nvm install 7.6.0
nvm use 7.6.0
nvm alias default v7.6.0
```
### Triển khai ứng dụng trên server 2012 ###

2. Cài đặt nvm và Cài đặt nodejs mới nhất:
```
nvm install 7.6.0
nvm use 7.6.0
nvm alias default v7.6.0
```
3. Sau khi cài đặt nodjs qua nvm cần vào thư mục C:\Users\Administrator\AppData\Roaming\nvm để cấp quyền Users 
cho phép truy xuất thư mục này. Nếu không ứng dụng sẽ báo lỗi 500.100
4. Tạo web.config với nội dung sau:
```
 <configuration>
 <appSettings>
    <add key="BABEL_CACHE_PATH" value="C:\Babel\cache.json" /><!-- bắt buộc phải có nếu muốn sử dụng babel -->
  </appSettings>
   <system.webServer>
     <handlers>
       <add name="iisnode" path="index.js" verb="*" modules="iisnode" />
     </handlers>
     <rewrite>
       <rules>
         <rule name="/">
           <match url="/*" />
           <action type="Rewrite" url="index.js" />
         </rule>
		 <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
			<match url="^index.js\/debug[\/]?" />
		 </rule>
		<rule name="DynamicContent">
		  <conditions>
			<add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
		  </conditions>
		  <action type="Rewrite" url="index.js"/>
		</rule>
       </rules>
     </rewrite>
     <!-- exclude node_modules directory and subdirectories from serving
     by IIS since these are implementation details of node.js applications -->
     <security>
       <requestFiltering>
         <hiddenSegments>
           <add segment="node_modules" />
         </hiddenSegments>
       </requestFiltering>
     </security>    
     <!-- trỏ tới thư mục chứa node.exe mới nhất. Trong trường hợp này là phiên bản 7.6.0 -->
     <iisnode nodeProcessCommandLine="&quot;C:\Users\Administrator\AppData\Roaming\nvm\v7.6.0\node.exe&quot;" />
   </system.webServer>
 </configuration>
 ```
5. Cài đặt mongodb
6. tạo thư mục mongoData trong ổ C:\
7. tạo thư mục con db trong C:\data
8. tạo thư mục con log trong thư mục C:\data
9. tạo file config.txt trong thư mục C:\data với nội dung sau:
```
##store data
dbpath=C:\data\db
 
##all output go here
logpath=C:\data\log\mongo.log
```
10. Mở cmd gõ lệnh sau:
```
cd c:\
cd C:\Program Files\MongoDB\Server\3.4\bin>
mongod --dbpath=C:\data\db --logpath=C:\data\log\log.txt --install
mongo
```
11. Download mã nguồn từ github
12. mở IIS manager và trỏ tới thư mục chứa mã nguồn
13. cấp quyền truy cập cho users
14. Cài elasticsearch:
- Download và cài đặt jdk tại: http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-windows-x64.exe
- download elasticsearch tại: https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.4.0.zip
- Giải nén và chạy elasticsearch trong thư mục bin
### Hoàn tất cài đặt ###