import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(()=> {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "Test",
      email: "test@email.com",
      password: "1234"
    });

    expect(user).toHaveProperty("id");
    expect(user.name).toBe("Test")
    expect
  });

  it("should not be able to create a new user with same email", async () => {
    expect(async ()=> {
      await createUserUseCase.execute({
        name: "Test",
        email: "test@email.com",
        password: "1234"
      });

      const user = await createUserUseCase.execute({
        name: "Test",
        email: "test@email.com",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });

});
