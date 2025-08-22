FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG configuration=Release
WORKDIR /src
COPY ["Yarp.LoadBalancer/Yarp.LoadBalancer.csproj", "Yarp.LoadBalancer/"]
RUN dotnet restore "Yarp.LoadBalancer/Yarp.LoadBalancer.csproj"
COPY . .
WORKDIR "/src/Yarp.LoadBalancer"
RUN dotnet build "Yarp.LoadBalancer.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "Yarp.LoadBalancer.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Yarp.LoadBalancer.dll"]
