#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["src/Analision.Web.Host/Analision.Web.Host.csproj", "src/Analision.Web.Host/"]
COPY ["src/Analision.Web.Core/Analision.Web.Core.csproj", "src/Analision.Web.Core/"]
COPY ["src/Analision.Application/Analision.Application.csproj", "src/Analision.Application/"]
COPY ["src/Analision.Application.Shared/Analision.Application.Shared.csproj", "src/Analision.Application.Shared/"]
COPY ["src/Analision.Core.Shared/Analision.Core.Shared.csproj", "src/Analision.Core.Shared/"]
COPY ["src/Analision.Core/Analision.Core.csproj", "src/Analision.Core/"]
COPY ["src/Analision.EntityFrameworkCore/Analision.EntityFrameworkCore.csproj", "src/Analision.EntityFrameworkCore/"]
COPY ["src/Analision.GraphQL/Analision.GraphQL.csproj", "src/Analision.GraphQL/"]
RUN dotnet restore "src/Analision.Web.Host/Analision.Web.Host.csproj"
COPY . .
WORKDIR "/src/src/Analision.Web.Host"
RUN dotnet build "Analision.Web.Host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Analision.Web.Host.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Analision.Web.Host.dll"]
