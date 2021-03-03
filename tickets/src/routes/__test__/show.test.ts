import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/tickets';

it('returns 404 if ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).get(`/api/tickets/${id}`).send();
  expect(response.status).toEqual(404);
});

it('returns the ticket id thecket is found', async () => {
  const title = 'test';
  const price = 20;
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({})
    .expect(200);
  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
