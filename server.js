const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const dbPath = './database.json';

// Initialize the database if it doesn't exist
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: {}, assignments: {} }));
}

// API Endpoints
app.get('/api/assignments', (req, res) => {
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      res.status(500).send('Error reading database');
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/assignments', (req, res) => {
  const newAssignments = req.body;
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      res.status(500).send('Error reading database');
      return;
    }
    let db = JSON.parse(data);
    // Merge new assignments with existing ones
    Object.assign(db.assignments, newAssignments);
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing to database');
        return;
      }
      res.status(200).send('Assignments updated');
    });
  });
});

app.delete('/api/assignments/:id', (req, res) => {
  const routeId = req.params.id;
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      res.status(500).send('Error reading database');
      return;
    }
    let db = JSON.parse(data);
    if (db.assignments[routeId]) {
      delete db.assignments[routeId];
      fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
        if (err) {
          res.status(500).send('Error writing to database');
          return;
        }
        res.status(200).send(`Assignment for route ${routeId} deleted`);
      });
    } else {
      res.status(404).send(`Assignment for route ${routeId} not found`);
    }
  });
});

app.post('/api/assignments/clear', (req, res) => {
  fs.readFile(dbPath, (err, data) => {
    if (err) {
      res.status(500).send('Error reading database');
      return;
    }
    let db = JSON.parse(data);
    db.assignments = {};
    fs.writeFile(dbPath, JSON.stringify(db, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing to database');
        return;
      }
      res.status(200).send('All assignments cleared');
    });
  });
});

app.get('/api/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
