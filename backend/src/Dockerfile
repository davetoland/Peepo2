# Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Debug -o /app
#RUN dotnet publish -c Release -o /app /p:ContinuousIntegrationBuild=true /p:PublishReadyToRun=true

# Runtime (official Azure Functions isolated worker base)
FROM mcr.microsoft.com/azure-functions/dotnet-isolated:4-dotnet-isolated9.0
WORKDIR /home/site/wwwroot
COPY --from=build /app ./
# Azure Functions runtime uses /azure-functions-host start entrypoint
# Exposes :80 and :8080 by default in this image; compose maps 7071:8080
