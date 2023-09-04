const express = require('express');
const app = express();
const PORT = 3001;

// 1번 컴퓨터에서 할것
// - Scene2 프로그램 실행, 종료, 상태 확인
// 2번 컴퓨터에서 할것
// - Scene1 프로그램 실행, 종료, 상태 확인
// 3번 컴퓨터에서 할것
// - AI, P3D, Webcam 2개
// 4번 컴퓨터(메인)에서 할것
// - middle, merge, Webcam 2개

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
