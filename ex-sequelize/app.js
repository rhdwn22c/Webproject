const express = require('express');
const morgan = require('morgan');
const path = require('path');
const nunjucks = require('nunjucks');

const { sequelize } = require('./models');

const app = express();

// View template 설정
app.set('view engine', 'htm');
nunjucks('views', {
    express: app,
    watch: true,
});

sequelize.sync({force:false})
.then(() => {
    console.log('데이터베이스 연결 성공');
})
.catch(() => {
    console.log(err);
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

//

app.use((req, res, next) => {
    const err = new Error('라우터가 없습니다. ');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.status(err.status || 500);
    res.send(err);
});

app.listen(3000, () => {
    console.log('3000번 포트에서 대기 중');
});