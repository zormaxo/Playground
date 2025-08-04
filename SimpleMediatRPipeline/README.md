# Simple MediatR Pipeline Implementation

Bu proje, **MediatR kütüphanesinin pipeline yapısını** anlamamıza yardımcı olacak basit bir implementasyon içerir.

## 🎯 MediatR Pipeline Nedir?

MediatR Pipeline şu şekilde çalışır:

```
Request → [Behavior 1] → [Behavior 2] → [Behavior 3] → Handler → Response
```

Her behavior, request'i işlemeden önce ve sonra çalışabilir. Bu sayede **cross-cutting concerns** (logging, validation, caching, performance monitoring) merkezi bir şekilde yönetilir.

## 🏗️ Proje Yapısı

### 1. **Models.cs** - Temel Yapılar

- `IRequest<TResponse>`: Tüm request'lerin implement ettiği interface
- `IRequestHandler<TRequest, TResponse>`: Handler'ların implement ettiği interface
- `IPipelineBehavior`: Pipeline behavior'larının interface'i
- `User`, `GetUserQuery`, `CreateUserCommand`: Domain modelleri

### 2. **Handlers.cs** - İş Mantığı

- `GetUserHandler`: Kullanıcı bilgilerini getirir (Query)
- `CreateUserHandler`: Yeni kullanıcı oluşturur (Command)

### 3. **PipelineBehaviors.cs** - Cross-Cutting Concerns

- `LoggingBehavior`: Her request'i loglar
- `ValidationBehavior`: Request'leri doğrular
- `PerformanceBehavior`: Performans ölçümü yapar

### 4. **SimpleMediator.cs** - Pipeline Motoru

- Handler'ları kaydetme
- Behavior'ları kaydetme
- Pipeline'ı oluşturma ve çalıştırma

## 🔄 Pipeline Çalışma Mantığı

Bir request geldiğinde şu sıra izlenir:

1. **Logging Behavior** - Request'i logla
2. **Validation Behavior** - Request'i doğrula
3. **Performance Behavior** - Timing başlat
4. **Handler** - Asıl iş mantığını çalıştır
5. **Performance Behavior** - Timing bitir
6. **Validation Behavior** - (Geri dönüş)
7. **Logging Behavior** - Başarı/hata logla

## 🚀 Çalıştırma

```bash
cd SimpleMediatRPipeline
dotnet run
```

## 📊 Çıktı Örneği

```
=== MediatR Pipeline Demo ===

1. Query Execution:
🔍 [LOG] Starting GetUserQuery
🔒 [VALIDATION] Validating GetUserQuery
✅ [VALIDATION] GetUserQuery is valid
⏱️  [PERFORMANCE] Starting timing for GetUserQuery
   → GetUserHandler: Fetching user with ID 1
⚡ [PERFORMANCE] GetUserQuery completed in 113ms
✅ [LOG] Completed GetUserQuery successfully
Result: John Doe (john@example.com)
```

## 💡 Temel Kavramlar

### Command vs Query (CQRS)

- **Query**: Veri okuma (GetUserQuery)
- **Command**: Veri değiştirme (CreateUserCommand)

### Pipeline Behavior'ların Avantajları

- **Separation of Concerns**: İş mantığından ayrı
- **Reusability**: Tüm request'lerde kullanılabilir
- **Testability**: Ayrı ayrı test edilebilir
- **Maintainability**: Merkezi yönetim

### Decorator Pattern

Pipeline, **Decorator Pattern** kullanır. Her behavior, bir sonrakini "sararak" ek işlevsellik katar.

## 🔧 Gerçek MediatR'dan Farkları

Bu basit implementasyon:

- ❌ Dependency Injection entegrasyonu yok
- ❌ Generic constraints daha basit
- ❌ Async pipeline handling daha basit
- ✅ Temel pipeline mantığını gösteriyor
- ✅ Behavior sıralamasını gösteriyor
- ✅ Error handling'i gösteriyor

## 📚 Öğrenme Çıkarımları

1. **Pipeline Pattern** nasıl çalışır
2. **Decorator Pattern** nasıl uygulanır
3. **Cross-cutting concerns** nasıl yönetilir
4. **CQRS** pattern'ı nasıl uygulanır
5. **Separation of Concerns** prensipleri
