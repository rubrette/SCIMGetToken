var express = require('express');
var router = express.Router();
const https = require('https');

function getDataFromAPI(url, token, callback) {
  var options = {
    url: url,
    method: 'GET',
    headers: {
      Authorization: ' Bearer ' + token
    }
  };
  https.get(url, options, (resp) => {
    console.log('Get URL: ' + url)
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      callback(JSON.parse(data));
    });

  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
}

/* GET users listing. */
router.post('/', function (req, res, next) {
  var peopleMeURL = 'https://api.ciscospark.com/v1/people/me';
  var token = req.body.token;
  getDataFromAPI(peopleMeURL, token, (data) => {
    // console.log(data);
    var b64string = data.orgId;
    var orgId = Buffer.from(b64string, 'base64').toString('utf-8').split("ORGANIZATION/")[1];
    data.utf8OrgId = orgId;
    var SCIMGetGroupsURL = 'https://identity.webex.com/identity/scim/' + orgId + '/v1/Groups'
    getDataFromAPI(SCIMGetGroupsURL, token, (SCIMGroupsData) => {
      console.log(SCIMGroupsData);
      var SCIMGetUsersURL = 'https://identity.webex.com/identity/scim/' + orgId + '/v1/Users'
      getDataFromAPI(SCIMGetUsersURL, token, (SCIMUsersData) => {
        console.log(SCIMUsersData);
        res.render('scim', { token: token, me: data, SCIMUsersData: SCIMUsersData, SCIMGroupsData: SCIMGroupsData });
      })
    })

  });
});

module.exports = router;
