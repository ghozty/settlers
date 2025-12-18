# AG_ExplorerManager - Extra Feature List

Bu döküman, `AG_ExplorerManager.js` scripti için potansiyel geliştirmeleri ve ek özellikleri listelemektedir.

---

## 1. Ayarlar Penceresi (Settings UI)

### Açıklama
Script başlatıldığında veya menüden "Settings" seçildiğinde açılan bir modal pencere ile tüm ayarların görsel olarak yapılabilmesi.

### Alt Özellikler
- **Görev Seçimi**: Dropdown menü ile hangi görevin gönderileceğinin seçimi
  - Short Treasure / Medium Treasure / Long Treasure / Even Longer / Longest
  - Adventure Zone aramaları (Short/Medium/Long/Very Long)
- **Interval Ayarları**: Min/Max check interval slider'ları
- **Delay Ayarları**: Explorer arası bekleme süresi slider'ları
- **Kaydet/Yükle**: Ayarların LocalStorage veya settings dosyasına kaydedilmesi

### Teknik Notlar
- Mevcut `Modal` sınıfı kullanılabilir (`scripts/0-common.js`)
- `settings.store()` ve `settings.read()` ile kalıcı ayar depolama

---

## 2. Geologist Desteği

### Açıklama
Explorer'ların yanı sıra Geologist'lerin de otomatik olarak görevlendirilmesi.

### Alt Özellikler
- **Kaynak Seçimi**: Hangi kaynağın aranacağının belirlenmesi
  - Stone, Bronze Ore, Marble, Iron Ore, Gold Ore, Coal, Granite, Titanium Ore, Saltpeter
- **Öncelik Sırası**: Birden fazla kaynak seçildiğinde hangi sırayla aranacağı
- **Tükenmiş Maden Kontrolü**: Haritadaki tükenmiş madenleri tespit edip otomatik olarak ilgili kaynağı aratma

### Teknik Notlar
- `GetBaseType() === 2` ile Geologist'ler filtrelenir
- Task Type: 0, SubTask: kaynağa göre değişir (0-8 arası)

---

## 3. Specialist Tipi Bazlı Görev Atama

### Açıklama
Farklı Explorer/Geologist tiplerine farklı görevler atanabilmesi.

### Alt Özellikler
- **Explorer Tipleri**: Normal Explorer, Daring Explorer, Fearless Explorer vb.
- **Özel Yetenekler**: "Travelling Erudite" veya "Bean a Collada" skill'i olan explorer'lara özel görevler
- **Geologist Tipleri**: Normal, Merry, Jolly, Diligent vb.

### Teknik Notlar
- `item.GetType()` ile specialist tipi alınır
- `item.getSkillTree()` ile skill'ler kontrol edilir

---

## 4. Zamanlayıcı (Scheduler)

### Açıklama
Script'in belirli saatlerde otomatik başlayıp durması.

### Alt Özellikler
- **Başlangıç/Bitiş Saati**: Örn: 08:00 - 23:00 arası çalış
- **Günlük Çizelge**: Hafta içi/hafta sonu farklı programlar
- **Uyku Modu**: Belirlenen saatlerde sessiz mod (log yazmadan çalış)

---

## 5. İstatistikler ve Raporlama

### Açıklama
Script'in çalışması hakkında detaylı istatistikler.

### Alt Özellikler
- **Gönderilen Explorer Sayısı**: Toplam / bugün / son saat
- **Bulunan Hazine Sayısı**: (Server response takibi gerekebilir)
- **Ortalama Bekleme Süreleri**: İstatistiksel analiz
- **Çalışma Süresi**: Script ne kadar süredir aktif

### Teknik Notlar
- İstatistikler `window` objesinde veya `settings` ile saklanabilir

---

## 6. Bildirim Sistemi

### Açıklama
Önemli olaylar için görsel/sesli bildirimler.

### Alt Özellikler
- **Explorer Döndüğünde**: Bir explorer görevi tamamladığında bildirim
- **Hata Durumunda**: Script hatası olduğunda uyarı
- **Özet Bildirimi**: Her X dakikada bir durum özeti

### Teknik Notlar
- `game.showAlert()` kullanılabilir
- Ses bildirimi için `game.def("Sound::cSoundManager")` kullanılabilir

---

## 7. Sıra Yönetimi (Queue Management)

### Açıklama
Görevlerin ve explorer'ların daha akıllı yönetimi.

### Alt Özellikler
- **Öncelik Sistemi**: Bazı explorer'ları öncelikli gönderme
- **Denge**: Farklı görev türleri arasında denge kurma
- **Cooldown Takibi**: Yeni dönen explorer'lar için bekleme süresi

---

## 8. Blacklist / Whitelist

### Açıklama
Belirli explorer'ların dahil edilmesi veya hariç tutulması.

### Alt Özellikler
- **Blacklist**: Bu isimler asla gönderilmesin
- **Whitelist**: Sadece bu isimler gönderilsin
- **Grup Oluşturma**: "Treasure Hunters", "Adventure Seekers" gibi gruplar

### Teknik Notlar
- Explorer isimleri `item.getName(false)` ile alınabilir

---

## 9. Multi-Zone Desteği

### Açıklama
Ana ada dışındaki adalarda da (colony) çalışma.

### Alt Özellikler
- **Ada Seçimi**: Hangi adalarda çalışacağının belirlenmesi
- **Ada Bazlı Ayarlar**: Her ada için farklı görev tipleri

### Teknik Notlar
- `game.gi.mCurrentViewedZoneID` ile mevcut ada ID'si alınır
- Zone değişikliği gerekebilir

---

## 10. Template Sistemi

### Açıklama
Farklı konfigürasyonların kaydedilip yüklenmesi.

### Alt Özellikler
- **Preset Kaydetme**: "Treasure Focus", "Adventure Focus" gibi preset'ler
- **Hızlı Geçiş**: Tek tıkla farklı modlara geçiş
- **İçe/Dışa Aktarma**: JSON formatında template paylaşımı

### Teknik Notlar
- `SaveLoadTemplate` sınıfı kullanılabilir

---

## 11. Akıllı Görev Seçimi

### Açıklama
Mevcut duruma göre otomatik görev türü seçimi.

### Alt Özellikler
- **Zaman Bazlı**: Gece uzun görevler, gündüz kısa görevler
- **Kaynak Bazlı**: Eksik kaynağa göre Geologist yönlendirme
- **XP Odaklı**: Maksimum XP için optimal görev seçimi

---

## 12. Entegrasyon

### Açıklama
Diğer UserScript'lerle entegrasyon.

### Alt Özellikler
- **Auto Rebuild**: Farm/Well yenileme ile senkronizasyon
- **Military Recruiter**: Asker üretimi ile koordinasyon
- **Binder Collect**: Manuscript üretimi ile koordinasyon

---

## Öncelik Sıralaması (Önerilen)

| Öncelik | Özellik | Karmaşıklık | Değer |
|---------|---------|-------------|-------|
| 1 | Ayarlar Penceresi | Orta | Yüksek |
| 2 | Geologist Desteği | Düşük | Yüksek |
| 3 | Görev Tipi Seçimi | Düşük | Yüksek |
| 4 | İstatistikler | Düşük | Orta |
| 5 | Blacklist/Whitelist | Düşük | Orta |
| 6 | Template Sistemi | Orta | Orta |
| 7 | Zamanlayıcı | Orta | Düşük |
| 8 | Specialist Tipi Bazlı | Orta | Orta |
| 9 | Bildirim Sistemi | Düşük | Düşük |
| 10 | Multi-Zone | Yüksek | Düşük |
