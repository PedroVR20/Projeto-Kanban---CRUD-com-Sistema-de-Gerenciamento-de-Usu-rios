# Estágio 1: Build da aplicação com Java 21
FROM maven:3-eclipse-temurin-21 AS builder

# Define o diretório de trabalho
WORKDIR /app

# 1. Copia apenas o pom.xml para aproveitar o cache do Docker
COPY pom.xml .

# 2. Baixa todas as dependências
RUN mvn dependency:go-offline

# 3. Copia o código-fonte da aplicação
COPY src ./src

# 4. Compila o projeto e cria o .jar
RUN mvn clean package -DskipTests

# Estágio 2: Imagem final de produção com Java 21
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia o .jar gerado no estágio de build
COPY --from=builder /app/target/*.jar app.jar

# Expõe a porta da aplicação
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
