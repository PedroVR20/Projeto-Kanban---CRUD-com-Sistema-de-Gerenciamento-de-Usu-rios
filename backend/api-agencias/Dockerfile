# Dockerfile de DIAGNÓSTICO para a api-agencias

FROM maven:3-eclipse-temurin-21 AS builder
WORKDIR /app

# --- COMANDOS DE DIAGNÓSTICO ---
# Lista os arquivos na raiz do WORKDIR para ver o que foi copiado.
RUN ls -la

# Copia o pom.xml
COPY pom.xml .

# Mostra o conteúdo do pom.xml que foi copiado.
# Se a dependência da api-usuarios aparecer aqui, encontramos o fantasma.
RUN echo "--- CONTEÚDO DO POM.XML ---" && cat pom.xml && echo "--- FIM DO POM.XML ---"
# ---------------------------------

# O build continua a partir daqui
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn package -DskipTests

# Estágio 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
