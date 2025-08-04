#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/Analision.Migrator/Analision.Migrator.csproj", "src/Analision.Migrator/"]
COPY ["src/Analision.EntityFrameworkCore/Analision.EntityFrameworkCore.csproj", "src/Analision.EntityFrameworkCore/"]
COPY ["src/Analision.Core/Analision.Core.csproj", "src/Analision.Core/"]
COPY ["src/Analision.Core.Shared/Analision.Core.Shared.csproj", "src/Analision.Core.Shared/"]
RUN dotnet restore "src/Analision.Migrator/Analision.Migrator.csproj"
COPY . .
WORKDIR "/src/src/Analision.Migrator"
RUN dotnet build "Analision.Migrator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Analision.Migrator.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Analision.Migrator.dll", "-s"]
