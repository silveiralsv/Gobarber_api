import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakeuserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeuserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeuserRepository, fakeHashProvider);

    authenticateUser = new AuthenticateUserService(
      fakeuserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate an user', async () => {
    const user = await createUser.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@teste.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'jhondoe@teste.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate an user with wrong e-mail ', async () => {
    expect(
      authenticateUser.execute({
        email: 'jhondoe@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate an user with wrong password', async () => {
    await createUser.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@teste.com',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'jhondoe@teste.com',
        password: 'wrong password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
