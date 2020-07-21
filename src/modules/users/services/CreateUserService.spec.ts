import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeuserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createuser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeuserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    createuser = new CreateUserService(fakeuserRepository, fakeHashProvider);
  });
  it('should be able to create a new user', async () => {
    const user = await createuser.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@teste.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same e-mail', async () => {
    await createuser.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@teste.com',
      password: '123456',
    });

    expect(
      createuser.execute({
        name: 'Jhon Doe',
        email: 'jhondoe@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
