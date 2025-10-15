@echo off
echo Downloading Complete Spring Boot JAR with dependencies...
echo.

REM Create lib directory
if not exist "lib" mkdir lib

REM Download the complete Spring Boot JAR that includes all dependencies
echo Downloading Spring Boot JAR with dependencies...
curl -L -o "lib/spring-boot-app.jar" "https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-web/3.2.0/spring-boot-starter-web-3.2.0.jar"

echo Downloading Spring Boot Loader...
curl -L -o "lib/spring-boot-loader.jar" "https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-loader/3.2.0/spring-boot-loader-3.2.0.jar"

echo Downloading Spring Boot Loader Tools...
curl -L -o "lib/spring-boot-loader-tools.jar" "https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-loader-tools/3.2.0/spring-boot-loader-tools-3.2.0.jar"

echo Downloading Spring Boot Maven Plugin...
curl -L -o "lib/spring-boot-maven-plugin.jar" "https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-maven-plugin/3.2.0/spring-boot-maven-plugin-3.2.0.jar"

echo.
echo Now let's try to create a fat JAR with all dependencies...
echo.

REM Create a simple script to run with the fat JAR approach
echo @echo off > run-fat-jar.bat
echo echo Running Spring Boot with fat JAR approach... >> run-fat-jar.bat
echo java -jar lib/spring-boot-app.jar --spring.profiles.active=dev >> run-fat-jar.bat
echo pause >> run-fat-jar.bat

echo Fat JAR runner created. Try running: run-fat-jar.bat
pause
