DROP DATABASE IF EXISTS devconnect;
CREATE DATABASE devconnect;
USE devconnect;

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100),
  company VARCHAR(100),
  location VARCHAR(100),
  skills TEXT,
  link VARCHAR(255)
);

INSERT INTO jobs (title, company, location, skills, link) VALUES
('Software Engineering Intern', 'Google', 'Bangalore, India', 'Python, Data Structures, System Design', '#'),
('Software Engineer Intern', 'Microsoft', 'Hyderabad, India', 'C++, Java, Problem Solving', '#'),
('Cloud Engineer Intern', 'Amazon Web Services (AWS)', 'Remote', 'AWS, Terraform, Python', '#'),
('Frontend Developer Intern', 'Meta', 'Gurugram, India', 'React, TypeScript, UI/UX', '#'),
('Data Analyst Intern', 'Netflix', 'Mumbai, India', 'SQL, Pandas, Data Visualization', '#');
