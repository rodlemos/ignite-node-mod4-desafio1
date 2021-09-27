import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user Profile", () => {
  beforeEach(()=> {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it("should be able to show user profile", async ()=> {
    const user = await usersRepositoryInMemory.create({
      name: "Mytest",
      email: "my@test.com",
      password: "24685"
    });

    const result = await showUserProfileUseCase.execute(user.id as string);
    expect(result).toEqual(user);
  });

  it("should not be able to show user profile of a non existent user", async ()=> {
    expect(async ()=> {
      await usersRepositoryInMemory.create({
        name: "Mytest",
        email: "my@test.com",
        password: "24685"
      });

      await showUserProfileUseCase.execute("wrongId");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
