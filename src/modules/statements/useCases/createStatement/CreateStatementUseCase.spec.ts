import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", ()=> {
  beforeEach(()=> {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("should be able to create a statement", async ()=> {
    const user = await usersRepositoryInMemory.create({
      name: "SomeUser",
      email: "some@email.com",
      password: "123321"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 120,
      description: "description"
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be not able to create a statement of a non existent user", async ()=> {
    expect(async ()=> {
      await createStatementUseCase.execute({
        user_id: "invalidUser",
        type: "deposit" as OperationType,
        amount: 120,
        description: "description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to withdraw without balance", async ()=> {
    expect(async ()=> {
      const user = await usersRepositoryInMemory.create({
        name: "SomeUser",
        email: "some@email.com",
        password: "123321"
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: "deposit" as OperationType,
        amount: 120,
        description: "description"
      });

      await createStatementUseCase.execute({
        user_id: user.id as string,
        type: "withdraw" as OperationType,
        amount: 200,
        description: "description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
})
