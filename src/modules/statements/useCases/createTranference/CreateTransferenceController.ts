import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { CreateTransferenceUseCase } from './CreateTransferenceUseCase';


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

class CreateTransferenceController {
  async execute(request: Request, response: Response) {
    const { id: sender_id } = request.user;
    const { receiver_id } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTranferenceReceiver = container.resolve(CreateTransferenceUseCase);

    const transferReceiver = await createTranferenceReceiver.execute({
      user_id: receiver_id,
      amount,
      description,
      sender_id,
      type
    });

    const transferSender = container.resolve(CreateStatementUseCase).execute({
      user_id: sender_id,
      description,
      amount,
      type
    })

    return response.status(201).json(transferReceiver);
  }
}

export { CreateTransferenceController };

