// tests/auth.test.js
import request from 'supertest';
import app from '../app.js';

describe('Autenticación - Login', () => {
  test('Login válido devuelve token y status 200', async () => {
    const response = await request(app)
      .post('/login')          // ruta login de authRoutes: POST /login
      .send({
        usuario: 'admin',
        contrasena: '1234'
      })
      .set('Accept', 'application/json'); // importante para que responda JSON

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(typeof response.body.token).toBe('string');
  });

  test('Login inválido devuelve 401 y mensaje error', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        usuario: 'admin',
        contrasena: 'wrongpass'
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'Usuario o contraseña incorrectos');
  });

  test('Usuario no existente devuelve 401 y mensaje error', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        usuario: 'noexiste',
        contrasena: 'cualquiera'
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('mensaje', 'Usuario o contraseña incorrectos');
  });
});
