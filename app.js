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

let p11_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\Run_Scene1.bat';
let p12_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\Run_Scene1_Vertical.bat';
let p13_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\Run_Scene1_YAAD.bat';
let p14_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\Run_Scene2.bat';
let p15_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\Run_Scene2_Vertical.bat';
let p16_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\Run_Scene2_YAAD.bat';

let p90_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\Kill_Scenes.bat';

let p0_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\RunCam0.bat';
let p1_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\RunCam1.bat';
let p2_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\RunCam2.bat';
let p3_path = 'D:\\Projects\\Project_Sub_Servers\\EXEs\\Sub2\\RunCam3.bat';

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
        
        case '11':
            return p11_path;
        case '12':
            return p12_path;
        case '13':
            return p13_path;
        case '14':
            return p14_path;
        case '15':
            return p15_path;
        case '16':
            return p16_path;

        case '90':
            return p90_path;

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

app.get('/h', (req, res) => {
    var document = `
    <h1>Help</h1>
    <p>11, 12, 13: Scene 1, 1 Vertical, 1 YAAD</p>
    <p>14, 15, 16: Scene 2, 2 Vertical, 2 YAAD</p>
    <p>0, 1, 2, 3: Webcam 0, 1, 2, 3</p>`;
    res.send(document);
}); 

app.get('/init', (req, res) => {
    let path = get_path('12');
    start_process(path, '12');
    path = get_path('3');
    start_process(path, '3');
    res.send('init');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
