# Guide Line Web Services Test :

### `FIRST 📥` :

Clone the project then Open it in your IDE

### `SECOND 🔗` :

open terminal and pass ' npm install '

### `THIRD🔗` :

pass command line ( node Server.js )

### `FOURTH🔗` :

open Postman then test your EndPoints for BLOGS and User

#Postman test Scripts and EndPoints :

### `USERS`

📍REGISTER :

POST :

```
http://localhost:9090/register
```

Body > row :

```
{
 "username": "",
 "email": "",
 "numTel": "",
 "password": ""
 }
```

📍LOGIN

POST :

```
http://localhost:9090/login
```

Body > row :

```
{

 "numTel": "",
 "password": ""
 }
```

📍FORGET PASSWORD

POST :

```
 http://localhost:9090/forgetPassword
```

Body>row :

```
{

 "numTel": ""

   }
```

📍VERIFY OTP :
POST :

```
http://localhost:9090/verifyOTP
```

Body > row :

```
{

 "numTel": "",
 "otp": ""
   }

```

📍RESET PASSWORD :

POST :

```
http://localhost:9090/resetPassword
```

Body > row :

```
{

 "numTel": "",
   "newPassword": ""

   }
```

📍BLOGS :

📍POST :

```
http://localhost:9090/blogs/
```

Body > row :

```
{
 "Title": "",
 "Description": "",
 "image": "",
 "Sujet": ""
 }
```

📍GET :

```
http://localhost:9090/blog/All
```

📍PATCH :

```
http://localhost:9090/blog/updateBlog/id
```

Body > row :

```
{
 "Title": "",
 "Description": "",
 "image": "",
 "Sujet": ""
 }
```

📍DELETE :

```
http://localhost:9090/blog/delete/id
```
