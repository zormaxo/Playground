# AI.Net - OpenAI Chat Console Application

.NET 9 best practices kullanılarak geliştirilmiş modern OpenAI chat konsol uygulaması.

## 🚀 Özellikler

- **.NET 9 Modern Host Builder Pattern** - `Host.CreateApplicationBuilder()`
- **Dependency Injection** - OpenAI Client ve Chat Service'ler
- **Configuration Management** - appsettings.json, User Secrets, Environment Variables
- **Structured Logging** - Console ve Debug providers
- **Hosted Services** - Background service ile chat yönetimi
- **Graceful Shutdown** - IHostApplicationLifetime ile düzgün kapatma
- **Error Handling** - Exception handling ve re-throwing

## 📋 Gereksinimler

- .NET 9.0 SDK
- OpenAI API Key

## ⚙️ Kurulum

1. **Projeyi klonlayın**

```bash
git clone <repository-url>
cd AI.Net
```

2. **OpenAI API Key'ini ayarlayın**

```bash
dotnet user-secrets set OpenAIKey <your-openai-api-key>
```

3. **Uygulamayı çalıştırın**

```bash
dotnet run
```

## 🔧 Konfigürasyon

### Environment Ayarları (Console Uygulamalarında)

Console uygulamalarında da Development/Production environment'ları vardır:

#### Environment Nasıl Belirlenir:

1. **DOTNET_ENVIRONMENT** environment variable (öncelik 1)
2. **ASPNETCORE_ENVIRONMENT** environment variable (öncelik 2)
3. Default: **Production**

#### Environment Ayarlama Yöntemleri:

**Windows (PowerShell):**

```powershell
# Development için
$env:DOTNET_ENVIRONMENT = "Development"
dotnet run

# Production için
$env:DOTNET_ENVIRONMENT = "Production"
dotnet run

# Ya da tek seferde
$env:DOTNET_ENVIRONMENT="Development"; dotnet run
```

**Windows (Command Prompt):**

```cmd
set DOTNET_ENVIRONMENT=Development
dotnet run
```

**Linux/Mac:**

```bash
export DOTNET_ENVIRONMENT=Development
dotnet run

# Ya da tek seferde
DOTNET_ENVIRONMENT=Development dotnet run
```

#### launchSettings.json ile (Önerilen):

Visual Studio/VS Code için `Properties/launchSettings.json` oluşturun:

```json
{
  "profiles": {
    "Development": {
      "commandName": "Project",
      "environmentVariables": {
        "DOTNET_ENVIRONMENT": "Development"
      }
    },
    "Production": {
      "commandName": "Project",
      "environmentVariables": {
        "DOTNET_ENVIRONMENT": "Production"
      }
    }
  }
}
```

### Configuration Dosyaları

Uygulama aşağıdaki sırayla configuration'ları yükler:

1. `appsettings.json` (temel ayarlar)
2. `appsettings.{Environment}.json` (environment-specific)
3. **User Secrets** (Development'da sensitive data için)
4. **Environment Variables** (deployment için)
5. **Command-line arguments** (runtime override için)

#### appsettings.json

```json
{
  "OpenAI": {
    "Model": "gpt-4o-mini"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  }
}
```

#### appsettings.Development.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "AI.Net": "Information"
    }
  }
}
```

#### appsettings.Production.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "AI.Net": "Information"
    }
  }
}
```

### User Secrets (Sadece Development)

Sensitive bilgiler için User Secrets kullanın:

```bash
# User secrets'ı başlat
dotnet user-secrets init

# OpenAI API key'i ekle
dotnet user-secrets set OpenAIKey "your-actual-api-key-here"

# Model değiştir (opsiyonel)
dotnet user-secrets set OpenAI:Model "gpt-4"

# Tüm secrets'ları listele
dotnet user-secrets list

# Belirli bir secret'ı sil
dotnet user-secrets remove OpenAIKey
```

### Production Deployment

Production'da environment variables kullanın:

```bash
# Docker ile
docker run -e DOTNET_ENVIRONMENT=Production -e OpenAIKey=your-key your-app

# Kubernetes ile
env:
- name: DOTNET_ENVIRONMENT
  value: "Production"
- name: OpenAIKey
  valueFrom:
    secretKeyRef:
      name: openai-secret
      key: api-key
```

## 🏗️ Mimari

```
Program.cs
├── Host.CreateApplicationBuilder() - Modern host pattern
├── Configuration - appsettings.json + User Secrets
├── Dependency Injection - OpenAI services
├── Hosted Service - ChatHostedService
└── Graceful Shutdown - IHostApplicationLifetime
```

### Servisler

- **IChatService/ChatService** - Chat logic'i
- **ChatHostedService** - Background service wrapper
- **OpenAIClient** - OpenAI API client (Singleton)
- **IChatClient** - Microsoft.Extensions.AI abstraction

## 📝 Kullanım

1. Uygulamayı başlatın: `dotnet run`
2. Chat mesajlarınızı yazın
3. Çıkmak için `exit` yazın
4. Ctrl+C ile graceful shutdown

## 🔍 Environment Debug

Hangi environment'da çalıştığını görmek için:

```csharp
// Program.cs içinde
var environment = builder.Environment.EnvironmentName;
Console.WriteLine($"Running in: {environment}");
```

### 🎯 Environment Değiştirme (Kolay Yöntemler)

#### 1. Visual Studio / VS Code ile (Önerilen)

`Properties/launchSettings.json` dosyası zaten hazır! VS Code'da:

- **Ctrl+F5** veya **F5** ile çalıştırırken profile seçin
- Default: Development profile

#### 2. PowerShell ile

```powershell
# Development (varsayılan)
dotnet run --launch-profile Development

# Production
dotnet run --launch-profile Production

# Manuel environment ayarı
$env:DOTNET_ENVIRONMENT="Production"; dotnet run
```

#### 3. Command Line Arguments ile

```bash
dotnet run --environment Production
```

### 📊 Environment Log Çıktıları

Uygulama başlarken şu bilgileri göreceksiniz:

**Development Mode:**

```
🚀 Application starting...
📍 Environment: Development
🔧 Is Development: True
🏭 Is Production: False
📂 Content Root: D:\Codes\Omer\Playground\AI.Net\AI.Net
🔓 Development mode: User Secrets enabled, Debug logging active
```

**Production Mode:**

```
🚀 Application starting...
📍 Environment: Production
🔧 Is Development: False
🏭 Is Production: True
📂 Content Root: D:\Codes\Omer\Playground\AI.Net\AI.Net
🔒 Production mode: Environment variables expected, Warning+ logging
```

## 📚 .NET 9 Best Practices

✅ **Modern Host Builder** - `Host.CreateApplicationBuilder()`  
✅ **Minimal Configuration** - Framework defaults kullanımı  
✅ **Primary Constructors** - C# 12 features  
✅ **File-scoped Namespaces** - Daha temiz kod  
✅ **Nullable Reference Types** - Type safety  
✅ **Dependency Injection** - Loosely coupled design  
✅ **Structured Logging** - ILogger kullanımı  
✅ **Background Services** - IHostedService pattern  
✅ **Graceful Shutdown** - IHostApplicationLifetime

## 🔧 Troubleshooting

### API Key Bulunamadı Hatası

```
OpenAI API key not found. Please set it using: dotnet user-secrets set OpenAIKey <your-key>
```

**Çözüm:** User secrets'ı doğru ayarlayın.

### Environment Ayarları

Current environment'ı kontrol edin:

```csharp
Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"Is Development: {builder.Environment.IsDevelopment()}");
```
