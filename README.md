
# Dokumentasi Aplikasi Shortlink

## Gambaran Umum
Dokumen ini memberikan gambaran umum tentang Aplikasi Shortlink, termasuk modifikasi terbaru untuk meningkatkan keamanan dan fungsionalitas.

## Struktur
- **node_modules**: Berisi semua dependensi Node.js.
- **package-lock.json**: Dihasilkan secara otomatis untuk operasi di mana npm memodifikasi tree node_modules atau package.json.
- **package.json**: Berisi metadata yang relevan dengan proyek dan daftar dependensi.
- **public**: Berisi file statis termasuk halaman HTML.
  - **login.html**: Halaman login untuk pengguna.
  - **register.html**: Halaman pendaftaran untuk pengguna baru.
- **server.js**: File server utama yang menangani rute dan konfigurasi server.

## Modifikasi

### 1. Halaman Login dan Pendaftaran
Dua halaman HTML baru telah ditambahkan ke direktori publik:
- **login.html**: Memungkinkan pengguna untuk masuk.
- **register.html**: Memungkinkan pengguna baru untuk mendaftar.

Kedua halaman ini menggunakan Bootstrap untuk tampilan yang responsif dan modern.

### 2. Peningkatan di Server.js
Beberapa peningkatan telah dilakukan pada file `server.js` untuk meningkatkan keamanan dan fungsionalitas:
- **bcrypt**: Ditambahkan untuk hashing kata sandi sebelum disimpan di database.
- **express-rate-limit**: Diimplementasikan untuk melindungi dari serangan brute force pada rute login.
- **Sessions**: Mengkonfigurasi manajemen sesi untuk melacak pengguna yang masuk.
- **Routes**:
  - `/register`: Menangani pendaftaran pengguna dan menyimpan kata sandi yang di-hash.
  - `/login`: Memvalidasi kredensial pengguna dan mengelola sesi.
  - `/dashboard`: Rute terlindungi yang hanya dapat diakses oleh pengguna yang sudah masuk.

### 3. Peningkatan Keamanan
- **Hashing Kata Sandi**: Kata sandi di-hash menggunakan bcrypt sebelum disimpan di database.
- **Pembatasan Tingkat**: Membatasi jumlah upaya login untuk mencegah serangan brute force.
- **Manajemen Sesi**: Menggunakan express-session untuk mengelola sesi pengguna dengan aman.

## Memulai

### Instalasi
1. **Clone repository**:
    ```
    git clone shortlink-app
    ```

2. **Masuk ke direktori proyek**:
    ```
    cd shortlink-app
    ```

3. **Instal dependensi**:
    ```
    npm install
    ```

### Menjalankan Aplikasi
1. **Mulai server**:
    ```
    node server.js
    ```

2. **Akses aplikasi**:
    Buka browser web Anda dan buka `http://localhost:3000`

### Penggunaan
- **Daftar**: Navigasi ke `/register` untuk membuat akun baru.
- **Login**: Navigasi ke `/login` untuk masuk dengan kredensial Anda.
- **Dashboard**: Setelah masuk, Anda akan diarahkan ke dashboard di `/dashboard`.

## Kesimpulan
Dokumen ini menguraikan struktur, modifikasi, dan penggunaan Aplikasi Shortlink. Peningkatan terbaru bertujuan untuk meningkatkan keamanan dan kegunaan, memberikan pengalaman yang lebih baik bagi pengguna.
