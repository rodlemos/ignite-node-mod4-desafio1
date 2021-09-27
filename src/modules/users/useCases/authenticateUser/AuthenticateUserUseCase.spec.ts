import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", ()=> {
  beforeEach(()=> {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("should be able to authenticate an user", async ()=> {
    const user: ICreateUserDTO = {
      name: "Usertest",
      email: "email@test.com",
      password: "12345"
    }

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a non existent user", () => {
    expect(async ()=> {
      await authenticateUserUseCase.execute({
        email: "notavalid@email.com",
        password: "25252"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate a wrong password", ()=> {
    expect(async ()=> {
      const user: ICreateUserDTO = {
        name: "errortest",
        email: "invalid@test.com",
        password: "12364"
      }

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: "invalid@test.com",
        password: "111111"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })
})
