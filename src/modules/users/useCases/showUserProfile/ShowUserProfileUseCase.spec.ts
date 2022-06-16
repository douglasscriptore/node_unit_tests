import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserService: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show Profile", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserService = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });
  it("Should be able to show a user profile",async () => {
    const user = await createUserService.execute({email: "test@email.com.br",name:"test user", password:"1234"})


      const userProfile = await showUserProfileUseCase.execute(user.id)
      expect(userProfile.id).toBe(user.id)

  })

  it("Should not be able to show a non-existing-user profile",async() =>{
    await expect(showUserProfileUseCase.execute("non-existing-user")).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
