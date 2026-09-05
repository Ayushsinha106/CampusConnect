This is how .env should look like in /server

```
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=dbName

JWT_SECRET=somestring
```

go to ```cd client``` then ``` npm i ``` then ``` npm run start `` to run the frontend

go to ```cd server``` then ``` npm i ``` then then  ``` npm run create-admin ``` to create Admin with credential 
```
email = admin@gmail.com
Password = admin123
```
then ``` npm run dev ``` to run the backend