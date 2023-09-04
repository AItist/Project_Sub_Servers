const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 3001;

// 3001 1번 컴퓨터에서 할것
// - Scene2 프로그램 실행, 종료, 상태 확인
// 3002 2번 컴퓨터에서 할것
// - Scene1 프로그램 실행, 종료, 상태 확인
// 3003 3번 컴퓨터에서 할것
// - AI, P3D, Webcam 2개
// 3000 4번 컴퓨터(메인)에서 할것
// - middle, merge, Webcam 2개

let process;
let isRunning = false;

let debugProgramPath = 'D:\\Projects\\Project_Sub_Servers\\hello.bat';

function start_process(filePath) {
    if (!isRunning) {
        process = exec(filePath, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            // console.log(`stdout: ${stdout}`);
            // console.error(`stderr: ${stderr}`);
        });

        process.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
            process = null;
            isRunning = false;
        });

        isRunning = true;
        return true;
    }
    else {
        return false;
    }
}

function stop_process(_process) {
    if (_process) {
        _process.kill();
        return true;
    }
    else {
        return false;
    }
}

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/start/:id', (req, res) => {
    const id = req.params.id;
    console.log(`id : ${id}`);

    if (start_process(debugProgramPath)) {
        res.send(`Process ${id} started`);
    }
    else {
        res.send(`Process ${id} already running`);
    }
});

app.get('/stop/:id', (req, res) => {
    const id = req.params.id;
    console.log(`id : ${id}`);

    if (stop_process(process)) {
        res.send(`Process ${id} killed`);
        process = null;
        isRunning = false;
    }
    else {
        res.send(`Process ${id} not found`);
    }
});

app.get('/status/:id', (req, res) => {
    const id = req.params.id;
    console.log(`id : ${id}`);

    res.send(isRunning ? `Process ${id} is running` : `Process ${id} is not running`);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
