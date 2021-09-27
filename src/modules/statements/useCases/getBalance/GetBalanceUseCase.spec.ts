import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Balance", ()=> {
  beforeEach(()=> {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
  });

  it("should be able to get balance", async ()=> {
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

    const balance = await getBalanceUseCase.execute({
      user_id: user.id as string
    });

    expect(balance).toHaveProperty("balance");
  });

  it("should not be able to get balance of non existent user", async ()=> {
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

      const balance = await getBalanceUseCase.execute({
        user_id: "invalidId"
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
