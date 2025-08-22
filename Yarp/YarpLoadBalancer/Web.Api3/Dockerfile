FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
# EXPOSE 443

# ENV ASPNETCORE_URLS=https://+:443

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["Web.Api3/Web.Api3.csproj", "Web.Api3/"]
RUN dotnet restore "Web.Api3/Web.Api3.csproj"
COPY . .
WORKDIR "/src/Web.Api3"
RUN dotnet build "Web.Api3.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "Web.Api3.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Web.Api3.dll"]
