// import AppError from '@shared/errors/AppError';
import AppError from '@shared/errors/AppError';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUserRepo: FakeUserRepository;
let fakeUserTokenRepo: FakeUserTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUserRepo = new FakeUserRepository();
    fakeUserTokenRepo = new FakeUserTokenRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepo,
      fakeUserTokenRepo,
      fakeHashProvider,
    );
  });
  it('should be able to reset the password using an token', async () => {
    const user = await fakeUserRepo.create({
      name: 'Lucas Silveira Vieira',
      email: 'testunitario@gmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepo.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      token,
      password: '123123',
    });

    const updatedUser = await fakeUserRepo.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: '1234',
        password: '321321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokenRepo.generate('non-existing user');

    await expect(
      resetPasswordService.execute({
        token,
        password: '321321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUserRepo.create({
      name: 'Lucas Silveira Vieira',
      email: 'testunitario@gmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokenRepo.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
