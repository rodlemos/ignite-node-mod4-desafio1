import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement operation", () => {
  beforeEach(()=> {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("should be able to get statement operation", async ()=> {
    const user = await usersRepositoryInMemory.create({
      name: "SomeUser",
      email: "some@email.com",
      password: "123321"
    });

    const statement = await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 120,
      description: "description"
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(operation.type).toEqual("deposit");
  });

  it("should not be able to get statement operation of an invalid user", async ()=> {
    expect(async ()=> {
      const user = await usersRepositoryInMemory.create({
        name: "SomeUser",
        email: "some@email.com",
        password: "123321"
      });

      const statement = await statementsRepositoryInMemory.create({
        user_id: user.id as string,
        type: "deposit" as OperationType,
        amount: 120,
        description: "description"
      });

      await getStatementOperationUseCase.execute({
        user_id: "invalidId",
        statement_id: statement.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get statement operation of an invalid statement", async ()=> {
    expect(async ()=> {
      const user = await usersRepositoryInMemory.create({
        name: "SomeUser",
        email: "some@email.com",
        password: "123321"
      });

      await statementsRepositoryInMemory.create({
        user_id: user.id as string,
        type: "deposit" as OperationType,
        amount: 120,
        description: "description"
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "invalidId"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
