const express = require('express');
const axios = require('axios');
const cors = require('cors');
const xml2js = require('xml2js');
const app = express();

app.use(cors());

// 국가법령정보 API
const OPENLAW_API_URL = 'http://www.law.go.kr/DRF/lawSearch.do';
const OPENLAW_SERVICE_KEY = 'paralix';

// app.get('/lawsearch', async (req, res) => {
//     let queryParams = '?' + encodeURIComponent('OC') + '=' + encodeURIComponent(OPENLAW_SERVICE_KEY);
//     Object.keys(req.query).forEach(key => {
//         queryParams += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(req.query[key]);
//     });

//     try {
//         const response = await axios.get(OPENLAW_API_URL + queryParams);
//         res.send(response.data);
//     } catch (error) {
//         res.status(500).send(error.toString());
//     }
// });

app.get('/lawsearch', async (req, res) => {
    let queryParams = '?' + encodeURIComponent('OC') + '=' + encodeURIComponent(OPENLAW_SERVICE_KEY);
    Object.keys(req.query).forEach(key => {
        queryParams += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(req.query[key]);
    });

    try {
        const response = await axios.get(OPENLAW_API_URL + queryParams);
        const parser = new xml2js.Parser();

        parser.parseString(response.data, (err, result) => {
            if (err) {
                res.status(500).send(err.toString());
                return;
            }

            if (result && result.PrecSearch && result.PrecSearch.prec) {
                result.PrecSearch.prec.forEach(prec => {
                    if (prec['판례상세링크']) {
                        prec['판례상세링크'][0] = 'https://www.law.go.kr' + prec['판례상세링크'][0];
                    }
                });
            }

            const builder = new xml2js.Builder();
            const xml = builder.buildObject(result);
            res.send(xml);
        });
    } catch (error) {
        res.status(500).send(error.toString());
    }
});


// 네이버 검색 API 예제 - 블로그 검색
var client_id = 'CMGj7Aq51QyiAa9l4EYE';
var client_secret = 'h9pdYgS2l7';
app.get('/search/doc', async function (req, res) { // async 키워드 추가
   var api_url = 'https://openapi.naver.com/v1/search/doc?query=' + encodeURI(req.query.query); // JSON 결과

   try {
       const response = await axios.get(api_url, {
           headers: {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
       });

       res.status(200).json(response.data); // JSON으로 응답
   } catch (error) {
       console.error('Error:', error);
       res.status(500).json({ message: 'Internal Server Error' });
   }
});

// 의약품 정보 API
const DRUG_API_URL = 'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';
const DRUG_SERVICE_KEY = 'klnPMx6BcJRvXEqdyooFTB4iLH1XwVLiIQPlcXxK2BGGGx7zR/R37T5SYr9a9GG3okt5Wpg63CnIJrsD6nG07g==';

app.get('/druginfo', async (req, res) => {
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(DRUG_SERVICE_KEY);
    Object.keys(req.query).forEach(key => {
        queryParams += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(req.query[key]);
    });

    try {
        const response = await axios.get(DRUG_API_URL + queryParams);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

// 부동산 실거래가 정보 API
const REAL_ESTATE_API_URL = 'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev';
const REAL_ESTATE_SERVICE_KEY = 'klnPMx6BcJRvXEqdyooFTB4iLH1XwVLiIQPlcXxK2BGGGx7zR/R37T5SYr9a9GG3okt5Wpg63CnIJrsD6nG07g=='; // 여기에 실제 서비스키를 입력하세요.

app.get('/realestate', async (req, res) => {
    let queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(REAL_ESTATE_SERVICE_KEY);
    Object.keys(req.query).forEach(key => {
        queryParams += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(req.query[key]);
    });

    try {
        const response = await axios.get(REAL_ESTATE_API_URL + queryParams);
        res.send(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});