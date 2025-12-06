# RightMenu.js

RightMenu.js, tarayıcının varsayılan sağ tık menüsünü devre dışı bırakıp yerine
tamamen özelleştirilebilir bir context menu göstermenizi sağlayan hafif bir kütüphanedir.

- jQuery ile çalışır
- Light / Dark tema
- Sınırsız submenu
- Dinamik visible / disabled fonksiyonları
- Klavye navigasyonu (↑ ↓ → ← Enter Esc)

## Kurulum

```html
<link rel="stylesheet" href="dist/rightmenu.min.css">

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="dist/rightmenu.min.js"></script>


## 2. GitHub’a dosyaları at ve release/tag oluştur

Bunların hepsini **tarayıcıdan** yapacaksın.

### 2.1. Dosyaları upload et

1. GitHub’da `rightmenujs` repo sayfana gir.
2. “Add file” → `Upload files`.
3. Lokaldeki şu yapıyı komple sürükleyip bırak:

   - `demos/`
   - `dist/`
   - `LICENSE`
   - `package.json`
   - `README.md`

4. Aşağıya commit mesajı yaz:
   - `chore: add RightMenu.js initial files`
5. “Commit changes” de.

Artık GitHub’da da aynı klasör ağacını görmen lazım.

---

### 2.2. Web’den release + tag oluştur

1. Repo sayfasında sağ tarafta “Releases” linkine tıkla.
2. “Draft a new release” butonuna bas.
3. Tag alanına: `v2.1.0`
4. Release title: `RightMenu.js 2.1.0`
5. “Publish release” de.

Bu adımla GitHub tag’i de otomatik oluşturdu; cdnjs’in gördüğü kritik şey bu.

---

## 3. cdnjs/packages PR’ını açıyoruz

Tamamen web arayüzüyle:

### 3.1. cdnjs packages reposunu forkla

1. Tarayıcıda: https://github.com/cdnjs/packages
2. Sağ üstte “Fork” → kendi hesabını seç.

Fork oluştu: `github.com/ufukcanatan/packages`

---

### 3.2. `packages/rightmenujs.json` dosyasını ekle

1. Fork repo içinde `packages/` klasörüne gir.
2. “Add file” → “Create new file”.
3. Dosya adı: `rightmenujs.json`
4. İçerik:

```json
{
  "name": "rightmenujs",
  "description": "RightMenu.js – customizable right-click context menu library with themes, submenus, keyboard navigation and jQuery support.",
  "repository": {
    "type": "git",
    "url": "https://github.com/ufukcanatan/rightmenujs.git"
  },
  "author": "Ufuk Canatan",
  "license": "MIT",
  "keywords": [
    "context-menu",
    "right-click",
    "menu",
    "jquery",
    "ui",
    "javascript",
    "submenu",
    "dark-mode"
  ],
  "filename": "rightmenu.min.js",
  "npmName": null,
  "autoupdate": {
    "type": "git",
    "target": "https://github.com/ufukcanatan/rightmenujs.git",
    "source": "tag",
    "include": [
      "dist/*"
    ]
  }
}
