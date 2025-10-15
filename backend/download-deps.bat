@echo off
echo Downloading Spring Boot dependencies...
echo.

REM Create lib directory
if not exist "lib" mkdir lib

REM Download actual Spring Boot JARs (not just starter POMs)
echo Downloading Spring Boot Core...
curl -L -o "lib/spring-boot-3.2.0.jar" "https://repo1.maven.org/maven2/org/springframework/boot/spring-boot/3.2.0/spring-boot-3.2.0.jar"

echo Downloading Spring Boot Starter Web...
curl -L -o "lib/spring-boot-starter-web-3.2.0.jar" "https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-web/3.2.0/spring-boot-starter-web-3.2.0.jar"

echo Downloading Spring Boot Starter Security...
curl -L -o "lib/spring-boot-starter-security-3.2.0.jar" "https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-security/3.2.0/spring-boot-starter-security-3.2.0.jar"

echo Downloading Spring Boot Starter Data JPA...
curl -L -o "lib/spring-boot-starter-data-jpa-3.2.0.jar" "https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-data-jpa/3.2.0/spring-boot-starter-data-jpa-3.2.0.jar"

echo Downloading Spring Boot Starter Validation...
curl -L -o "lib/spring-boot-starter-validation-3.2.0.jar" "https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-validation/3.2.0/spring-boot-starter-validation-3.2.0.jar"

echo Downloading Spring Core...
curl -L -o "lib/spring-core-6.1.0.jar" "https://repo1.maven.org/maven2/org/springframework/spring-core/6.1.0/spring-core-6.1.0.jar"

echo Downloading Spring Web...
curl -L -o "lib/spring-web-6.1.0.jar" "https://repo1.maven.org/maven2/org/springframework/spring-web/6.1.0/spring-web-6.1.0.jar"

echo Downloading Spring Security...
curl -L -o "lib/spring-security-core-6.1.0.jar" "https://repo1.maven.org/maven2/org/springframework/security/spring-security-core/6.1.0/spring-security-core-6.1.0.jar"

echo Downloading Spring Security Web...
curl -L -o "lib/spring-security-web-6.1.0.jar" "https://repo1.maven.org/maven2/org/springframework/security/spring-security-web/6.1.0/spring-security-web-6.1.0.jar"

echo Downloading Spring Security Config...
curl -L -o "lib/spring-security-config-6.1.0.jar" "https://repo1.maven.org/maven2/org/springframework/security/spring-security-config/6.1.0/spring-security-config-6.1.0.jar"

echo Downloading Spring Data JPA...
curl -L -o "lib/spring-data-jpa-3.1.0.jar" "https://repo1.maven.org/maven2/org/springframework/data/spring-data-jpa/3.1.0/spring-data-jpa-3.1.0.jar"

echo Downloading Hibernate Core...
curl -L -o "lib/hibernate-core-6.2.0.jar" "https://repo1.maven.org/maven2/org/hibernate/orm/hibernate-core/6.2.0/hibernate-core-6.2.0.jar"

echo Downloading MySQL Connector...
curl -L -o "lib/mysql-connector-java-8.0.33.jar" "https://repo1.maven.org/maven2/mysql/mysql-connector-java/8.0.33/mysql-connector-java-8.0.33.jar"

echo Downloading JWT API...
curl -L -o "lib/jjwt-api-0.11.5.jar" "https://repo1.maven.org/maven2/io/jsonwebtoken/jjwt-api/0.11.5/jjwt-api-0.11.5.jar"

echo Downloading JWT Implementation...
curl -L -o "lib/jjwt-impl-0.11.5.jar" "https://repo1.maven.org/maven2/io/jsonwebtoken/jjwt-impl/0.11.5/jjwt-impl-0.11.5.jar"

echo Downloading JWT Jackson...
curl -L -o "lib/jjwt-jackson-0.11.5.jar" "https://repo1.maven.org/maven2/io/jsonwebtoken/jjwt-jackson/0.11.5/jjwt-jackson-0.11.5.jar"

echo Downloading Jackson Core...
curl -L -o "lib/jackson-core-2.15.0.jar" "https://repo1.maven.org/maven2/com/fasterxml/jackson/core/jackson-core/2.15.0/jackson-core-2.15.0.jar"

echo Downloading Jackson Databind...
curl -L -o "lib/jackson-databind-2.15.0.jar" "https://repo1.maven.org/maven2/com/fasterxml/jackson/core/jackson-databind/2.15.0/jackson-databind-2.15.0.jar"

echo Downloading Jackson Annotations...
curl -L -o "lib/jackson-annotations-2.15.0.jar" "https://repo1.maven.org/maven2/com/fasterxml/jackson/core/jackson-annotations/2.15.0/jackson-annotations-2.15.0.jar"

echo Downloading Jakarta Servlet API...
curl -L -o "lib/jakarta.servlet-api-6.0.0.jar" "https://repo1.maven.org/maven2/jakarta/servlet/jakarta.servlet-api/6.0.0/jakarta.servlet-api-6.0.0.jar"

echo Downloading Tomcat Embed Core...
curl -L -o "lib/tomcat-embed-core-10.1.0.jar" "https://repo1.maven.org/maven2/org/apache/tomcat/embed/tomcat-embed-core/10.1.0/tomcat-embed-core-10.1.0.jar"

echo.
echo Dependencies downloaded to lib/ directory
echo Now you can run the application using: java -cp "target/classes;lib/*" com.netbanking.NetBankingApplication
pause
