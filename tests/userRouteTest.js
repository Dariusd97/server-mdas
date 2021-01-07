let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let server = require('/Users/dadobre/Desktop/server-mdas/server.js');
const database = require("/Users/dadobre/Desktop/server-mdas/database.js")
const tables = database.tables

let User = require('/Users/dadobre/Desktop/server-mdas/models/user');


chai.use(chaiHttp);

describe('Users', () => {
    after(() => { 
        tables.User.destroy({
            where: {
                username: 'x@gmail.com'
            }
        });
    });

describe('/POST user', () => {
    it('it should create a user', (done) => {
        let user = {
            username: 'x@gmail.com',
            password: 'test',
            firstName: 'Jon',
            lastName: 'Doe',
            address: 'Strada x'
        }
        chai.request(server)
            .post('/user/create')
            .send(user)
            .end((err, res) => {
                console.log(res.body)
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message').eql('Resource created');
                done();
            });
        });
    });
});

describe('Users', () => {
  describe('/GET user', () => {
      it('it should check that a user exist', (done) => {
        chai.request(server)
            .get("/user/login?username=d@gmai.com&password=1")
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
  });

});



