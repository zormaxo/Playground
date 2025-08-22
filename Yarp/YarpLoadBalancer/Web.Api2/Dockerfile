FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["Web.Api2/Web.Api2.csproj", "Web.Api2/"]
RUN dotnet restore "Web.Api2/Web.Api2.csproj"
COPY . .
WORKDIR "/src/Web.Api2"
RUN dotnet build "Web.Api2.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "Web.Api2.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Web.Api2.dll"]
