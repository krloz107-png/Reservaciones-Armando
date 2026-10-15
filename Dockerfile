# 1. Usamos una imagen que ya trae Maven y Java instalados oficialmente
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiamos primero el pom.xml para descargar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el código fuente
COPY src src

# Compilamos el proyecto directamente con el Maven del sistema
RUN mvn package -DskipTests

# 2. Imagen final ligera para correr la aplicación
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiamos el jar compilado desde la etapa anterior
COPY --from=build /app/target/reservaciones-0.0.1-SNAPSHOT.jar app.jar

# Exponemos el puerto de la app
EXPOSE 8080

# Ejecutamos la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]