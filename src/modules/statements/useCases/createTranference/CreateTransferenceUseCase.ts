import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceError } from "../getBalance/GetBalanceError";
import { GetStatementOperationError } from "../getStatementOperation/GetStatementOperationError";



@injectable()
export class CreateTransferenceUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({ user_id, amount, description, sender_id, type }: ICreateStatementDTO): Promise<Statement> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new GetStatementOperationError.UserNotFound();
    }

    const sender = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
      with_statement: true
    });

    if (sender.balance < amount){
      throw new GetBalanceError();
    }
    console.log(sender);

    const statement = await this.statementsRepository.create({
      user_id,
      amount,
      description,
      sender_id,
      type
    })

    return statement;
  }
}
