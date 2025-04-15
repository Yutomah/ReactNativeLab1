# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.



## От меня

Устанавливать как обычное приложение react native expo

Дополнительно реализовал вторую вкладку, в которой можно увидеть все маркеры, редактировать их а также добавлять новые.

Всё ещё можно кликать на главной карте на карту и на маркеры, чтобы добавить маркеры, или редактировать их

CSS я знаю плохо, поэтому я особо не настраивал стили.

Пытался сделать передачу маркеров, как нибудь через useState в корневом элементе, 
не получилось, пришлось делать через контекст и переменные в ссылке.


### Лаба 2

Структура базы данных
```
CREATE TABLE markers (
id INTEGER PRIMARY KEY AUTOINCREMENT,
latitude REAL NOT NULL,
longitude REAL NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE marker_images (
id INTEGER PRIMARY KEY AUTOINCREMENT,
marker_id INTEGER NOT NULL,
uri TEXT NOT NULL,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (marker_id) REFERENCES markers (id) ON DELETE CASCADE
);
```

Я создал структуру базу данных на компьютере и положил её в assets.
Когда приложение устанавливается на телефон оно использует эту базу данных.

Для работы с базой данных использую контекст SQLiteProvider, база данных из которого перехватывается в моём контексте GlobalContext
В GlobalContext я создаю объект DbProvider, внутри которого находятся все необходимые функции для работы с бд.
Я использую DbProvider каждый раз когда работаю с базой данных.


#### Обработка ошибок

При каждом запросе к бд проверяю запрос на то произошла ли ошибка.
Если происходит ошибка, то я перекидываю пользователя на отдельную страницу, где говориться что произошла ошибка.


