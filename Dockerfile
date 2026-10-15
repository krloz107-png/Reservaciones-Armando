# Usamos una imagen oficial de Java 17 (o la versión que uses)
FROM eclipse-temurin:17-jdk-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el archivo pom.xml y el wrapper de Maven
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Descargamos las dependencias
RUN ./mvnw dependency:go-offline -B

# Copiamos el código fuente
COPY src src

# Compilamos el proyecto en la nube de Render
RUN ./mvnw package -DskipTests

# Ejecutamos la aplicación
CMD ["java", "-jar", "target/reservaciones-0.0.1-SNAPSHOT.jar"]