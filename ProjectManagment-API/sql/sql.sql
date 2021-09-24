CREATE TABLE `projects_managment`.`projects` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `projectName` VARCHAR(250) NOT NULL,
  `clientFullName` VARCHAR(45) NOT NULL,
  `clientPhone` VARCHAR(45) NULL,
  `location` VARCHAR(45) NULL,
  `quotation` INT NULL DEFAULT 0,
  `paid` INT NULL DEFAULT 0,
  `unPaid` INT NULL DEFAULT 0,
  `haregem` INT NULL DEFAULT 0,
  `agreement` VARCHAR(45) NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));



CREATE TABLE `projects_managment`.`employee` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `wagePerDay` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` VARCHAR(45) NULL DEFAULT 'null',
  PRIMARY KEY (`id`));


INSERT INTO `projects_managment`.`employee` (`firstName`, `lastName`, `phone`) VALUES ('luay', 'abujanb', '034242422');


CREATE TABLE `projects_managment`.`employeesTimeSheet` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `startAt` DATETIME NULL,
  `endAt` DATETIME NULL,
  `projectId` INT NULL,
  PRIMARY KEY (`id`));


ALTER TABLE `projects_managment`.`employeesTimeSheet` 
ADD CONSTRAINT `employee_projects`
  FOREIGN KEY (`id`)
  REFERENCES `projects_managment`.`projects` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SELECT 
    projects_managment.employeesTimeSheet.date AS 'date',
    CONCAT(projects_managment.employee.firstName,
            ' ',
            projects_managment.employee.lastName) AS employeeName,
    projects_managment.employeesTimeSheet.startAt,
    projects_managment.employeesTimeSheet.endAt,
    projects_managment.projects.projectName,
    projects_managment.employeesTimeSheet.notes
FROM
    projects_managment.employeesTimeSheet
        JOIN
    projects_managment.employee ON projects_managment.employeesTimeSheet.employeeId = projects_managment.employee.id
        JOIN
    projects_managment.projects ON projects_managment.employeesTimeSheet.projectId = projects_managment.projects.id
ORDER BY date

SELECT 
    projects_managment.employeesTimeSheet.date AS 'date',
    CONCAT(projects_managment.employee.firstName,
            ' ',
            projects_managment.employee.lastName) AS employeeName,
    projects_managment.employeesTimeSheet.startAt,
    projects_managment.employeesTimeSheet.endAt,
    ROUND(TIMESTAMPDIFF(MINUTE, startAt, endAt) / 60,
            2) AS 'hours',
	projects_managment.employee.wagePerDay as wagePerDay,
    projects_managment.projects.projectName,
    projects_managment.employeesTimeSheet.notes
FROM
    projects_managment.employeesTimeSheet
        JOIN
    projects_managment.employee ON projects_managment.employeesTimeSheet.employeeId = projects_managment.employee.id
        JOIN
    projects_managment.projects ON projects_managment.employeesTimeSheet.projectId = projects_managment.projects.id
ORDER BY date



CREATE TABLE `projects_managment`.`employeeDailyWage` (
  `id` INT NOT NULL,
  `employeeId` INT NULL,
  `dailyWage` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `id_idx` (`employeeId` ASC),
  CONSTRAINT `id`
    FOREIGN KEY (`employeeId`)
    REFERENCES `projects_managment`.`employee` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
