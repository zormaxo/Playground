# Contract Website - Tailwind CSS Setup

Bu proje, özel CSS stilleri ile Tailwind CSS utility class'larını birleştiren bir kontrat/sözleşme sayfasıdır.

## 📁 Proje Yapısı

```
Contract/
├── index.html          # Ana HTML dosyası
├── styles.css          # Kaynak CSS dosyası (özel stiller + Tailwind import)
├── output.css          # Üretilen optimized CSS dosyası
├── package.json        # Node.js bağımlılıkları
└── README.md          # Bu dosya
```

## 🚀 Kurulum ve Çalıştırma

### 1. Gerekli Paketleri Yükleyin

```bash
npm install tailwindcss @tailwindcss/cli
```

### 2. Tailwind CSS Build Süreci

Aşağıdaki komut ile Tailwind CSS build sürecini başlatın:

```bash
npx @tailwindcss/cli -i ./styles.css -o ./output.css --watch
```

#### Bu Komutun Açıklaması:

- **`-i ./styles.css`**: Input dosyası (kaynak CSS)
- **`-o ./output.css`**: Output dosyası (üretilen CSS)
- **`--watch`**: Dosya değişikliklerini izler ve otomatik build yapar

### 3. Build Süreci Ne Yapar?

1. **Tarama**: HTML dosyalarınızı tarayarak kullanılan Tailwind class'larını tespit eder
2. **Optimizasyon**: Sadece kullanılan CSS class'larını output dosyasına dahil eder
3. **Birleştirme**: Özel CSS stillerinizi Tailwind utility class'larıyla birleştirir
4. **Üretim**: Optimize edilmiş `output.css` dosyasını oluşturur

## 📝 Dosya İçerikleri

### styles.css (Input)

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
@import "tailwindcss";

/* Özel CSS stilleri buraya */
.gradient-border::before {
  content: "";
  position: absolute;
  /* ... diğer stiller */
}
```

### output.css (Generated)

Build süreci sonucunda oluşan optimized CSS dosyası. Bu dosya:

- Sadece kullanılan Tailwind class'larını içerir
- Özel CSS stillerinizi korur
- Production-ready optimizasyonlu kodlar üretir

## 🌐 Yayınlama

Siteyi yayınlamak için gerekli dosyalar:

- `index.html`
- `output.css` (build edilen dosya)

### Yayınlama Platformları:

- **GitHub Pages**: Ücretsiz static hosting
- **Netlify**: Drag & drop deployment
- **Vercel**: Otomatik deployment

## ⚡ Geliştirme Workflow'u

1. **Geliştirme sırasında**:

   ```bash
   npx @tailwindcss/cli -i ./styles.css -o ./output.css --watch
   ```

2. **Production build için**:
   ```bash
   npx @tailwindcss/cli -i ./styles.css -o ./output.css --minify
   ```

## 🔧 HTML'de CSS Kullanımı

```html
<head>
  <!-- Build edilen CSS dosyasını kullanın -->
  <link href="./output.css" rel="stylesheet" />
</head>
```

## 📖 Tailwind CSS CLI Referansı

Detaylı bilgi için: [Tailwind CSS CLI Documentation](https://tailwindcss.com/docs/installation/tailwind-cli)

### Temel Komutlar:

```bash
# Watch mode (geliştirme)
npx @tailwindcss/cli -i ./styles.css -o ./output.css --watch

# Production build (minified)
npx @tailwindcss/cli -i ./styles.css -o ./output.css --minify

# Tek seferlik build
npx @tailwindcss/cli -i ./styles.css -o ./output.css
```

## 🎯 Neden Bu Yaklaşım?

- **Performans**: Sadece kullanılan CSS class'ları dahil edilir
- **Esneklik**: Özel CSS stilleri ile Tailwind'i birleştirebilirsiniz
- **Optimizasyon**: Production-ready, minified CSS çıktısı
- **Geliştirici Deneyimi**: IntelliSense desteği + otomatik build

## 🚨 Önemli Notlar

- `styles.css` dosyasını düzenleyin, `output.css` dosyasını **doğrudan değiştirmeyin**
- Build süreci olmadan sadece IntelliSense çalışır, CSS dosyası oluşmaz
- Watch mode açıkken dosya değişiklikleriniz otomatik build edilir
