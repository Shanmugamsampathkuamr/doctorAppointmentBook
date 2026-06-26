# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY common/pom.xml common/pom.xml
COPY common/src common/src
RUN mvn install -pl common -DskipTests -q

COPY service-registry/pom.xml service-registry/pom.xml
COPY service-registry/src service-registry/src
RUN mvn install -pl service-registry -DskipTests -q

COPY api-gateway/pom.xml api-gateway/pom.xml
COPY api-gateway/src api-gateway/src
RUN mvn install -pl api-gateway -DskipTests -q

COPY auth-service/pom.xml auth-service/pom.xml
COPY auth-service/src auth-service/src
RUN mvn install -pl auth-service -DskipTests -q

COPY doctor-service/pom.xml doctor-service/pom.xml
COPY doctor-service/src doctor-service/src
RUN mvn install -pl doctor-service -DskipTests -q

COPY appointment-service/pom.xml appointment-service/pom.xml
COPY appointment-service/src appointment-service/src
RUN mvn install -pl appointment-service -DskipTests -q

COPY notification-service/pom.xml notification-service/pom.xml
COPY notification-service/src notification-service/src
RUN mvn install -pl notification-service -DskipTests -q
