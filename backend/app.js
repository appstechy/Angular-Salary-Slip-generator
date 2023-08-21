const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');


const app = express();
app.use(cors());

app.use(bodyParser.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'salary_slip_generator'

});

db.connect((err) =>{
    if(err){
        console.log("Error coonecting to MySQL:", err);
    } else{
        console.log('Connected to MySQL successfully!!!');
    }
});

const saltRounds = 10;

app.post('/api/register', (req,res) => {
    const{ username, password, empId, fullName, gender, dateOfBirth, email, phoneNumber, salary, designation, department, bankAccountNumber, dateOfJoining, dateOfLeaving } = req.body;

    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error while hashing password:', err);
        } else {
          // Store the hashedPassword in the database or use it as needed
          console.log('Hashed Password:', hashedPassword);

          db.query('SELECT * FROM employees_info WHERE username = ?',[username], (error, results) => {
            if(error){
                console.error('Error while querying the database:', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });
    
            }
    
            if(results.length > 0){
                return res.status(409).json({ success:false, message: 'Username aleady exists' });
    
            }
    
            db.query('INSERT INTO employees_info (username, password, emp_id, full_name, gender, date_of_birth, email, phone_number, salary, designation, department, bank_account_number, date_of_joining, date_of_leaving) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [username, hashedPassword, empId, fullName, gender, dateOfBirth, email, phoneNumber, salary, designation, department, bankAccountNumber, dateOfJoining, dateOfLeaving], (error, results) => {
                if(error){
                    console.error('Error while inserting user into the database', error);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }
    
                console.log(results);
                // const token = jwt.sign({ userId: results.insertId }, 'xyz123', { expiresIn: '1h' });
                return res.json({ success:true});
            })
        })

        }
      });


    
})


app.post('/api/updateUser', (req,res) => {
    const{ username, password, empId, fullName, gender, dateOfBirth, email, phoneNumber, salary, designation, department, bankAccountNumber, dateOfJoining, dateOfLeaving, username2 } = req.body;

    db.query('UPDATE employees_info SET username=?, password=?, emp_id=?, full_name=?, gender=?, date_of_birth=?, email=?, phone_number=?, salary=?, designation=?, department=?, bank_account_number=?, date_of_joining=?, date_of_leaving=? WHERE username=?', [username, password, empId, fullName, gender, dateOfBirth, email, phoneNumber, salary, designation, department, bankAccountNumber, dateOfJoining, dateOfLeaving, username2], (error, results) => {
        if(error){
            console.error('Error while inserting user into the database', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        console.log(results);
        // const token = jwt.sign({ userId: results.insertId }, 'xyz123', { expiresIn: '1h' });
        return res.json({ success:true});
    })
})

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM employees_info WHERE username = ?', [username], (error, results) => {
        if(error){
            console.error("Error while querying the database:", error);
            return res.status(500).json({ success:false, message: 'Internal Sever Error' });

        }

        if(results.length === 0){
            return res.status(401).json({ success: false, message: 'Invalid username or password' });

        }


        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) {
              console.error('Error while comparing passwords:', err);
              return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
          
            if (!isMatch) {
              return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
          
            const { id, username, fullName } = results[0];
            const token = jwt.sign({ userId: results[0].id }, 'xyz123', { expiresIn: '1h' });
            return res.json({ success: true, token });
          });
        


    });
});

// Admin/HR login route
app.post('/api/admin_login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM admin_login WHERE username = ?', [username], (error, results) => {
        if(error){
            console.error("Error while querying the database:", error);
            return res.status(500).json({ success:false, message: 'Internal Sever Error' });

        }

        if(results.length === 0){
            return res.status(401).json({ success: false, message: 'Invalid username or password' });

        }


        bcrypt.compare(password, results[0].password, (err, isMatch) => {
            if (err) {
              console.error('Error while comparing passwords:', err);
              return res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
          
            if (!isMatch) {
              return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
          
            const { id, username, fullName } = results[0];
            const token = jwt.sign({ userId: results[0].id }, 'xyz123', { expiresIn: '1h' });
            return res.json({ success: true, token });
          });
        


    });
});


app.get('/api/getFullName', (req, res) => {

    const token = req.headers.authorization;
    
    if(!token){
        return res.status(401).json({ success:false, message: 'Unauthorized. Missing token.' });   
    }

    jwt.verify(token, 'xyz123', (err, decoded) => {
        if(err){
            console.error('Error while verifying the token:', err);
            return res.status(401).json({ success: false, message:'Unauthorized. Invalid token.' });

        }

        const userId = decoded.userId;
        console.log(userId);

        db.query('SELECT full_name,username FROM employees_info WHERE id = ?', [userId], (error, results) => {
            if(error){
                console.error('Error while querying the database:', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });

            }

            if(results.length === 0){
                return res.status(404).json({ success: false, message: 'User not found' });

            }

            const fullName = results[0].full_name;
            const username = results[0].username;
            return res.json({ success: true, fullName, username });
        })

    })
})


app.get('/api/getFullNameOfAdmin', (req, res) => {

    const token = req.headers.authorization;
    
    if(!token){
        return res.status(401).json({ success:false, message: 'Unauthorized. Missing token.' });   
    }

    jwt.verify(token, 'xyz123', (err, decoded) => {
        if(err){
            console.error('Error while verifying the token:', err);
            return res.status(401).json({ success: false, message:'Unauthorized. Invalid token.' });

        }

        const userId = decoded.userId;
        console.log(userId);

        db.query('SELECT full_name,username FROM admin_login WHERE id = ?', [userId], (error, results) => {
            if(error){
                console.error('Error while querying the database:', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });

            }

            if(results.length === 0){
                return res.status(404).json({ success: false, message: 'User not found' });

            }

            const full_name = results[0].full_name;
            const username = results[0].username;
            return res.json({ success: true, full_name, username });
        })

    })
})


app.get('/api/fetchAllDetails', (req, res) => {

    const token = req.headers.authorization;
    
    if(!token){
        return res.status(401).json({ success:false, message: 'Unauthorized. Missing token.' });   
    }

    jwt.verify(token, 'xyz123', (err, decoded) => {
        if(err){
            console.error('Error while verifying the token:', err);
            return res.status(401).json({ success: false, message:'Unauthorized. Invalid token.' });

        }

        const userId = decoded.userId;
        // console.log(userId);

        db.query('SELECT * FROM employees_info WHERE id = ?', [userId], (error, results) => {
            if(error){
                console.error('Error while querying the database:', error);
                return res.status(500).json({ success: false, message: 'Internal Server Error' });

            }

            if(results.length === 0){
                return res.status(404).json({ success: false, message: 'User not found' });

            }
            
            // console.log(results);
            // const fullName = results[0].fullName;
            return res.json({ success: true, data:results });
        })

    })
})


app.get('/api/fetchAllDetailsOfEmployee', (req, res) => {

    const username = req.headers.authorization;
    
    // if(!token){
    //     return res.status(401).json({ success:false, message: 'Unauthorized. Missing token.' });   
    // }

    db.query('SELECT * FROM employees_info WHERE username = ?', [username], (error, results) => {
        if(error){
            console.error('Error while querying the database:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });

        }

        if(results.length === 0){
            return res.status(404).json({ success: false, message: 'Employee not found' });

        }
        
        // console.log(results);
        // const fullName = results[0].fullName;
        return res.json({ success: true, data:results });
    })
})

// delete employee - 

app.post('/api/deleteEmployee', (req, res) => {

    const username = req.body.username;
    console.log(username);
    
    // if(!token){
    //     return res.status(401).json({ success:false, message: 'Unauthorized. Missing token.' });   
    // }

    db.query('DELETE FROM employees_info WHERE username = ?', [username], (error, results) => {
        if(error){
            console.error('Error while querying the database:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });

        }

        if(results.length === 0){
            return res.status(404).json({ success: false, message: 'Employee not found' });

        }
        
        // console.log(results);
        // const fullName = results[0].fullName;
        return res.json({ success: true});
    })
})



// fetch all exployees details - 
app.get('/api/fetchAllEmployeesDetails', (req, res) => {


    db.query('SELECT * FROM employees_info', (error, results) => {
        if(error){
            console.error('Error while querying the database:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });

        }

        if(results.length === 0){
            return res.status(404).json({ success: false, message: 'No Employee data found' });

        }
        
        // console.log(results);
        // const fullName = results[0].fullName;
        return res.json({ success: true, data:results });
    })
})


const port = 3000;
app.listen( port, () => console.log(`Server running on port ${port}`) );
