import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotenPasswordEmailService from '@modules/users/services/SendForgotenPasswordEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordEmail = container.resolve(
      SendForgotenPasswordEmailService,
    );

    await sendForgotPasswordEmail.execute({
      email,
    });

    return response.status(204).json();
  }
}
