import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.post('/webhook', (req, res) => {
    exec('sh deploy.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).send('Update failed');
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        res.status(200).send('Updated successfully');
    });
});

app.all('/webhook', (req, res) => {
    res.status(403).send('Forbidden');
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});