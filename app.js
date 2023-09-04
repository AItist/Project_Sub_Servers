const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 3002;

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

let p21_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\Run_Scene1.bat';
let p22_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\Run_Scene2.bat';

function get_path(id) {
    switch(id) {
        case 1:
            return debugProgramPath;
        
        case '21':
            return p21_path;
        case '22':
            return p22_path;

        case 31:
            return '';
        case 32:
            return '';
        case 33:
            return '';
        case 34:
            return '';

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
        // process = null;
        // isRunning = false;
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
