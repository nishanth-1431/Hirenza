git init
git config user.name "Nishanth"
git config user.email "nishanth-1431@github.com"

git add pom.xml hirenza-project-plan.md .gitignore src/main/resources/application.properties src/main/java/com/hirenza/HirenzaApplication.java 
git commit -m "Phase 1: Project initialization and configuration"

git add src/main/resources/db/migration
git commit -m "Phase 2: Database schema migrations with Flyway"

git add src/main/java/com/hirenza/domain src/main/java/com/hirenza/repository src/main/java/com/hirenza/dto src/main/java/com/hirenza/controller/ApplicationController.java src/main/java/com/hirenza/controller/DriveController.java src/main/java/com/hirenza/controller/StudentController.java src/main/java/com/hirenza/controller/GlobalExceptionHandler.java src/main/java/com/hirenza/service/StudentService.java src/main/java/com/hirenza/service/DriveService.java src/main/java/com/hirenza/service/ApplicationService.java src/main/java/com/hirenza/mapper src/main/java/com/hirenza/engine
git commit -m "Phase 3: Domain models, core services and API controllers"

git add src/main/java/com/hirenza/security src/main/java/com/hirenza/service/AuthService.java src/main/java/com/hirenza/controller/AuthController.java src/main/java/com/hirenza/job
git commit -m "Phase 4: Authentication, Security and OTP flow"

git add src/main/java/com/hirenza/notification src/main/java/com/hirenza/event src/main/resources/templates
git commit -m "Phase 5: Event-Driven Notifications (Email & WhatsApp)"

git add src/main/java/com/hirenza/service/MatchService.java src/main/java/com/hirenza/service/ResumeService.java
git commit -m "Phase 6: AI Semantic Matching and Skills Extraction"

git add .
git commit -m "Phase 7: React Vite Frontend Scaffolding"

git remote add origin https://github.com/nishanth-1431/Hirenza.git
git branch -M main
git push -u -f origin main
