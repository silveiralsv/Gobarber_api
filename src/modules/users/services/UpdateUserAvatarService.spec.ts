import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatar';

let fakeuserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let fakeStorageProvider: FakeStorageProvider;

let createuser: CreateUserService;

let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeuserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeStorageProvider = new FakeStorageProvider();

    createuser = new CreateUserService(fakeuserRepository, fakeHashProvider);

    updateUserAvatar = new UpdateUserAvatarService(
      fakeuserRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update a avatar', async () => {
    const user = await createuser.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@teste.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'teste.jpg',
    });

    expect(user.avatar).toBe('teste.jpg');
  });

  it('should not be able to update avatar from a non-existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing',
        avatarFileName: 'teste.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar when provides a new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await createuser.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@teste.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'teste.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'teste2.jpg',
    });

    expect(deleteFile).toBeCalledWith('teste.jpg');
    expect(user.avatar).toBe('teste2.jpg');
  });
});
