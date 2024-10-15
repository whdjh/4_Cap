const Bundler = require('parcel-bundler');
const express = require('express');
const http = require('http');
const open = require('open');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const bundlePath = process.argv[2];
const port = process.argv[3];

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next()
})

app.use('/models', express.static(path.join(__dirname, './models')));

// JSON 요청을 처리하기 위한 미들웨어
app.use(bodyParser.json());

// CORS 문제를 피하기 위해 간단한 CORS 허용 미들웨어 추가 (필요 시)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

let trackDataMemory = null;

// 트랙 데이터 저장을 위한 엔드포인트
app.post('/save-trackdata', (req, res) => {
    const newTrackData = req.body; // 클라이언트에서 전송된 데이터를 받음

    // 새로운 데이터로 덮어쓰고 기존 데이터는 지움
    trackDataMemory = newTrackData;

    console.log('Track data saved in memory:', trackDataMemory); // 새로운 데이터 출력
    res.sendStatus(200); // 성공적으로 저장된 경우 200 상태 코드 전송
});

// 메모리에서 트랙 데이터를 가져오는 엔드포인트
app.get('/get-trackdata', (req, res) => {
    if (trackDataMemory.length > 0) {
        res.json(trackDataMemory); // 메모리에 저장된 데이터를 전송
    } else {
        res.sendStatus(404); // 데이터가 없는 경우 404 상태 코드 전송
    }
});


const bundler = new Bundler(bundlePath);
app.use(bundler.middleware());

const server = http.createServer(app);
server.listen(port);

server.on('error', (err) => console.error(err));
server.on('listening', () => {
    console.info('Server is running');
    console.info(`  NODE_ENV=[${process.env.NODE_ENV}]`);
    console.info(`  Port=[${port}]`);
    open(`http://localhost:${port}`);
});
