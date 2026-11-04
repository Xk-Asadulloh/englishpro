# EnglishPro — Next.js

Zamonaviy, responsive ingliz tili video-dars platformasi.

## Ishga tushirish

1. Kompyuteringizga Node.js 20.9 yoki undan yangi versiyasini o'rnating.
2. ZIP faylni oching va loyiha papkasida terminalni ishga tushiring.
3. Kutubxonalarni o'rnating:

   ```bash
   npm install
   ```

4. Lokal serverni ishga tushiring:

   ```bash
   npm run dev
   ```

5. Brauzerda `http://localhost:3000` manzilini oching.

## Demo admin

- Admin panel: yuqoridagi **Admin** tugmasi
- Demo parol: `englishpro-demo-2026`

Parolni `components/english-pro.tsx` faylidagi `ADMIN_PASSWORD` qiymatidan o'zgartirishingiz mumkin.

## Hozirgi funksiyalar

- Responsive bosh sahifa va kurs darajalari
- Video darslar pleyeri (YouTube / Vimeo embed)
- Darslarni qidirish va daraja bo'yicha filtrlash
- Demo admin kirish oynasi
- Dars qo'shish, tahrirlash va o'chirish
- Darslar brauzerning `localStorage` xotirasida saqlanadi

## Muhim: real loyiha uchun

Bu — frontend prototip. Admin paroli brauzerda tekshiriladi va darslar faqat shu qurilma/brauzerda saqlanadi. Shu sababli uni ommaviy internetga haqiqiy admin himoyasi sifatida joylamang.

Haqiqiy platformaga o'tkazishda:
- Supabase yoki boshqa server bazasi;
- server tomonda autentifikatsiya va rollar;
- admin API / Server Actions orqali dars CRUD;
- foydalanuvchi akkauntlari, progress va test natijalari;
- video kontent uchun ruxsatlar va xavfsiz hosting

qo'shilishi kerak. `localStorage` dagi ma'lumotlar boshqa qurilmaga avtomatik sinxronlanmaydi.
