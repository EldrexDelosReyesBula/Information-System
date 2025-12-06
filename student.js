const fs = require('fs');
const readline = require('readline');
const path = require('path');

const FILE_NAME = 'students.txt';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let students = [];

function showMenu() {
    console.log('\n=== Student Information Manager ===');
    console.log('Please choose an option (1-5):');
    console.log('1. Add Student');
    console.log('2. Display All Students');
    console.log('3. Save Students to File');
    console.log('4. Load Students from File');
    console.log('5. Exit');
    
    rl.question('Enter your choice: ', Choice);
}

function Choice(choice) {
    if (choice === '1') {
        add();
    } else if (choice === '2') {
        display();
    } else if (choice === '3') {
        save();
    } else if (choice === '4') {
        load();
    } else if (choice === '5') {
        console.log('Okay!');
        rl.close();
    } else {
        console.log('Something went wrong. Please try again.');
        showMenu();
    }
}

function add() {
    rl.question('Enter student ID: ', function(id) {
        if (id.trim() === '') {
            console.log('ID cannot be empty.');
            showMenu();
            return;
        }
        
        rl.question('Enter student name: ', function(name) {
            if (name.trim() === '') {
                console.log('Name cannot be empty.');
                showMenu();
                return;
            }
            
            rl.question('Enter student age: ', function(age) {
                if (age.trim() === '' || isNaN(age)) {
                    console.log('Age must be a valid number.');
                    showMenu();
                    return;
                }
                
                rl.question('Enter student grade: ', function(grade) {
                    const student = {
                        id: id.trim(),
                        name: name.trim(),
                        age: parseInt(age.trim()),
                        grade: grade.trim()
                    };
                    
                    students.push(student);
                    console.log('Added successfully!');
                    showMenu();
                });
            });
        });
    });
}

function display() {
    if (students.length === 0) {
        console.log('No students to display.');
    } else {
        console.log('\n=== List of Students ===');
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            console.log('\nID: ' + student.id + 
                       ', \nName: ' + student.name + 
                       ', \nAge: ' + student.age + 
                       ', \nGrade: ' + student.grade);
        }
        console.log('Total students: ' + students.length);
    }
    showMenu();
}

function save() {
    if (students.length === 0) {
        console.log('No students to save.');
        showMenu();
        return;
    }
    
    let fileContent = '';
    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        fileContent += student.id + ',' + 
                      student.name + ',' + 
                      student.age + ',' + 
                      student.grade;
        if (i < students.length - 1) {
            fileContent += '\n';
        }
    }
    
    fs.writeFile(FILE_NAME, fileContent, 'utf8', function(err) {
        if (err) {
            console.log('Error saving file: ' + err.message);
        } else {
            console.log('Students saved to ' + FILE_NAME + ' successfully!');
            console.log('File path: ' + path.join(process.cwd(), FILE_NAME));
        }
        showMenu();
    });
}

function load() {
    fs.readFile(FILE_NAME, 'utf8', function(err, data) {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log('File not found. Please save students first.');
            } else {
                console.log('Error reading file: ' + err.message);
            }
            showMenu();
            return;
        }
        
        if (data.trim() === '') {
            console.log('File is empty.');
            showMenu();
            return;
        }
        
        students = [];
        const lines = data.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '') continue;
            
            const parts = line.split(',');
            if (parts.length >= 4) {
                const student = {
                    id: parts[0].trim(),
                    name: parts[1].trim(),
                    age: parseInt(parts[2].trim()),
                    grade: parts[3].trim()
                };
                
                if (!isNaN(student.age)) {
                    students.push(student);
                }
            }
        }
        
        console.log('Loaded ' + students.length + ' students from file.');
        showMenu();
    });
}

// Check if file exists and load it on startup
fs.access(FILE_NAME, fs.constants.F_OK, function(err) {
    if (!err) {
        rl.question('Found existing student file. Load it? (y/n): ', function(answer) {
            if (answer.toLowerCase() === 'y') {
                load();
            } else {
                console.log('Starting with empty student list.');
                showMenu();
            }
        });
    } else {
        console.log('No existing student file found. Starting fresh.');
        showMenu();
    }
});
