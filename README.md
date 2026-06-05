# User-friendly web application

## Work Procedure

1. Creating folder for project and adding README.md file. Add git to the project to control it.
2. Add package.json by using nmp command - `npm init -y`. This is configuration file.
3. Install express by command in terminal - `npm install express`
4. Add test code to check whether the server is working or not.
5. Add sql library by using npm command - `npm install mysql2`
6. In SQL WorkBranch creating new DataBase:
   `CREATE DATABASE library_fs;
USE library_db;
CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL
);`
