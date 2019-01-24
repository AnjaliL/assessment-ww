const chai = require('chai');
const expect = require('chai').expect;
// const app = require('../app');
chai.use(require('chai-http'));

const request = require('request');

const appUrl = process.env.URL || 'http://localhost:3000'

it('Exercise 1: returns status 200 for', function(done) {
   request(appUrl + '/user' , function(error, response, body) {
       expect(response.statusCode).to.equal(200);
       done();
   });
});

it('Exercise 1: Check Exercise1 content', function(done) {
   request(appUrl + '/user' , function(error, response, body) {
       if(body && typeof body === 'string')
           body = JSON.parse(body);
       expect(body.name).to.equal('Anjali Loganathan');
       done();
   });
});

    // describe('/GET User Name',() => {
    //     it('return the user name', (done) => {
    //         chai.request(app)
    //             .post('http://localhost:3000/user')
    //             .type('application/json')
    //             .then((res)=>{
    //                 //console.log(res);
    //                 expect(res).to.have.status((200));
    //                 expect(res).to.be.json;
    //                 expect(res.body).to.hasOwnProperty('name');
    //                 done();
    //             });
    //     });

    // });

    // describe('/Sort by sortOption',() => {
    //     it('it should sort by sortOption', (done) => {
    //          chai.request(app)
    //             .get('/sort?sortOption=low')
    //             .type('application/json')
    //             .send({})
    //             .then((res)=>{
    //                 //console.log(res);
    //                 expect(res).to.have.status((200));
    //                 expect(res).to.be.json;
    //                 done();
    //             });
    //     });

    // });

   

