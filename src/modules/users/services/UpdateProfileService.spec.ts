import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update a user profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Lucas Silveira',
      email: 'silveira.lsv@gmail.com',
      password: '1234',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Gabriela Aparecida',
      email: 'gabs.mqz@gmail.com',
    });

    expect(updatedUser.name).toBe('Gabriela Aparecida');
    expect(updatedUser.email).toBe('gabs.mqz@gmail.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'Lucas Silveira',
      email: 'silveira.lsv@gmail.com',
      password: '1234',
    });

    const user = await fakeUserRepository.create({
      name: 'Gabriela Malaquias',
      email: 'gabs.mqz@gmail.com',
      password: '1234',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Gabriela Aparecida',
        email: 'silveira.lsv@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Lucas Silveira',
      email: 'silveira.lsv@gmail.com',
      password: '1234',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Lucas Silveira',
      email: 'silveira.lsv@gmail.com',
      old_password: '1234',
      password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Lucas Silveira',
      email: 'silveira.lsv@gmail.com',
      password: '1234',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Lucas Silveira',
        email: 'silveira.lsv@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password giving a wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Lucas Silveira',
      email: 'silveira.lsv@gmail.com',
      password: '1234',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Lucas Silveira',
        email: 'silveira.lsv@gmail.com',
        old_password: 'wrong old password',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
