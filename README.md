# Beauty studio, шаблон сайта

Next.js 16, TypeScript, CSS Modules, next-intl (de, uk, en), GSAP и Lenis для анимаций.

## Запуск

```bash
npm install
npm run dev      # разработка, http://localhost:3000
npm run build    # проверка сборки
npm run start    # боевой режим после build
```

Node 20 или новее.

## Что менять под клиента

| Что | Где |
|---|---|
| Название студии, номер WhatsApp, телефон, e-mail, Instagram, выходные дни, занятые даты | `src/config/site.ts` |
| Адрес сайта для SEO (sitemap, canonical) | переменная окружения `NEXT_PUBLIC_SITE_URL` на хостинге |
| Цвета, размеры шрифтов, отступы, тайминги | `src/styles/tokens.css` |
| Шрифты | `src/config/fonts.ts` |
| Фото | `src/config/images.ts` и `src/config/pool.ts`, файлы в `public/images` |
| Тексты на трёх языках | `messages/de.json`, `messages/uk.json`, `messages/en.json` |
| Якоря и меню разделов | `src/config/sections.ts` |
| Переход между страницами (моргание или шторка) | `siteConfig.transition` в `src/config/site.ts` |

Пока значения не заданы, на сайте стоят нейтральные заглушки: цены «по запросу», часы «по записи», регион Münsterland.

## Запись

Запись это заявка. Клиент выбирает услугу, основной и запасной день, время суток и имя, после чего открывается сообщение в WhatsApp. Сайт ничего не хранит и не отправляет на сервер. Подтверждает время мастер.

## Перед запуском

- Заполнить `src/config/site.ts` и заменить заглушки в `messages/*.json`: цены, часы, адрес, регион, способы оплаты, условия отмены.
- Заменить тексты Impressum и Datenschutz, их должен проверить юрист.
- Задать `NEXT_PUBLIC_SITE_URL`.
- Добавить картинку для превью в соцсетях (1200×630).
- Заменить сгенерированные фото на настоящие, фото «до и после» только реальные.
