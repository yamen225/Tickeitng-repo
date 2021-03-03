import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('returns 404 if provided id does not exists', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'iopq',
      price: 20,
    })
    .expect(404);
});

it('returns 401 if user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'iopq',
      price: 20,
    })
    .expect(401);
});

it('returns 401 if user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asdf',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'klij',
      price: 1000,
    })
    .expect(401);
});

it('returns 400 if user provides an invalid title or price', async () => {
  const coockie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', coockie)
    .send({
      title: 'asdf',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', coockie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', coockie)
    .send({
      title: 'asdj',
      price: -20,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const coockie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', coockie)
    .send({
      title: 'alsdf',
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', coockie)
    .send({
      title: 'new title',
      price: 20,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({});

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(20);
});
