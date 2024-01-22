const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const API_URL = 'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';
const SERVICE_KEY = 'klnPMx6BcJRvXEqdyooFTB4iLH1XwVLiIQPlcXxK2BGGGx7zR/R37T5SYr9a9GG3okt5Wpg63CnIJrsD6nG07g=='; // 여기에 실제 서비스키를 입력하세요.

app.get('/druginfo', async (req, res) => {
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(SERVICE_KEY);
    Object.keys(req.query).forEach(key => {
        queryParams += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(req.query[key]);
    });

    try {
        const response = await axios.get(API_URL + queryParams);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
