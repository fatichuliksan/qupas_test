<<<<<<< HEAD
simple project ini menggunakan express framework dan mySql

### install
install [NPM] (https://www.npmjs.com/get-npm)

```
import `qupas_test.sql` pada phpmyadmin, dengan nama database `qupas_test`

npm install

npm start
```

### route

akses url `http://localhost:8080`

| Route                         | HTTP    | Descriptions                    |
| :---------------------------- | :------ | :------------------------------ |
| `/auth/login`                 | POST    | url login                       |
| `/auth/logout`                | POST    | url logout                      |
| `/users`                      | POST    | get all user                    |
| `/users/profile`              | POST    | user yg sedang login            |
| `/transaction/balance`        | POST    | cek saldo                       |
| `/transaction/transfer`       | POST    | transfer                        |
| `/transaction/confirm`        | POST    | konfirmasi persetujuan transfer |
| `/transaction/history`        | POST    | mutasi                          |
| `/transaction/history-detail` | POST    | detail transaksi                |

### user list
| username  | email           | password | account_number |
| :---------| :-------------- | :------- | :------------- |
| user1     | user1@mail.com  | user1    | 080000001      |
| user2     | user2@mail.com  | user2    | 080000002      |

contoh akses terdapat pada postman collection `qupas.postman_collection.json`