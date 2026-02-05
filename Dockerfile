# Multi-stage Dockerfile for Spring Boot backend
# Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy only what is needed to leverage Docker cache
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src ./src

# Build the application (skip tests for speed)
RUN mvn -B -DskipTests package

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the fat jar produced by the build stage
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
