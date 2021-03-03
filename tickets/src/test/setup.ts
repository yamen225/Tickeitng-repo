import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;
beforeAll(async () => {
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  process.env.JWT_KEY = 'asdf';

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  // build a JWT payload {id, email}
  //create the JWT!
  // Build a sesion object {JWT: MY_JWT}
  // Turn that session into JSON
  // Take that JSON and encode it as base 64
  const id = new mongoose.Types.ObjectId().toHexString();
  const base64 = Buffer.from(
    JSON.stringify({
      jwt: jwt.sign(
        {
          id,
          email: 'test@test.com',
        },
        process.env.JWT_KEY!
      ),
    })
  ).toString('base64');
  // Return a string that's the coockie with the encoded data
  return [`express:sess=${base64}`];
};
