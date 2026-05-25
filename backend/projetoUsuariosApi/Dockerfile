
FROM maven:3.9.6-eclipse-temurin-21 AS build


WORKDIR /app


COPY pom.xml .


RUN mvn dependency:go-offline


COPY src ./src


RUN mvn clean install -DskipTests



FROM eclipse-temurin:21-jre-alpine


WORKDIR /app


COPY --from=build /app/target/projetoUsuariosApi-0.0.1-SNAPSHOT.jar app.jar


EXPOSE 8080

# Comando para iniciar a aplicação quando o contêiner for executado.
ENTRYPOINT ["java", "-jar", "app.jar"]
