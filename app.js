const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 3003;

// 3001 1번 컴퓨터에서 할것
// - Scene2 프로그램 실행, 종료, 상태 확인
// 3002 2번 컴퓨터에서 할것
// - Scene1 프로그램 실행, 종료, 상태 확인
// 3003 3번 컴퓨터에서 할것
// - AI, P3D, Webcam 2개
// 3000 4번 컴퓨터(메인)에서 할것
// - middle, merge, Webcam 2개

let processes = {};
let debugProgramPath = 'D:\\Projects\\Project_Sub_Servers\\hello.bat';

let p31_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub3\\Run_AI.bat';
let p32_path = '';

let p0_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub3\\RunCam0.bat';
let p1_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub3\\RunCam1.bat';
let p2_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub3\\RunCam2.bat';
let p3_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub3\\RunCam3.bat';

function get_path(id) {
    switch(id) {
        case '0':
            return p0_path;
        case '1':
            return p1_path;
        case '2':
            return p2_path;
        case '3':
            return p3_path;

        case '9':
            return debugProgramPath;
        
        case '31':
            return p31_path;
        case '32':
            return p32_path;


        default:
            return debugProgramPath;
    }
}

function start_process(filePath, id) {
    if (id in processes && processes[id]['isRunning']) {
        return false;
    } 

    let dict = {};
    process = exec(filePath, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        // console.log(`stdout: ${stdout}`);
        // console.error(`stderr: ${stderr}`);
    });

    dict['process'] = process;
    dict['isRunning'] = true;
    processes[id] = dict;

    process.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
        processes[id]['isRunning'] = false;
        processes[id]['process'] = null;
    });

    return true;
}

function stop_process(id) {
    if (id in processes && processes[id]['isRunning']) {
        processes[id]['process'].kill();
        processes[id]['process'] = null;
        processes[id]['isRunning'] = false;
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

    let path = get_path(id);

    if (start_process(path, id)) {
        res.send(`Process ${id} started`);
    }
    else {
        res.send(`Process ${id} already running`);
    }
});

app.get('/stop/:id', (req, res) => {
    const id = req.params.id;

    if (stop_process(id)) {
        res.send(`Process ${id} killed`);
    }
    else {
        res.send(`Process ${id} not found`);
    }
});

app.get('/status/:id', (req, res) => {
    const id = req.params.id;
    // console.log(`id : ${id}`);

    let isRunning = false;
    if (id in processes && processes[id]['isRunning']) {
        isRunning = true;
    }
    else {
        isRunning = false;
    }

    res.send(isRunning ? `Process ${id} is running` : `Process ${id} is not running`);
});

app.get('/h', (req, res) => {
    var document = `
    <h1>Help</h1>
    <p>31, 32: AI, P3D</p>
    <p>0, 1, 2, 3: Webcam 0, 1, 2, 3</p>`;
    res.send(document);
}); 

app.get('/init', (req, res) => {
    let path = get_path(31);
    start_process(path, 31);
    // path = get_path(32);
    // start_process(path, 32);
    path = get_path(2);
    start_process(path, 2);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
