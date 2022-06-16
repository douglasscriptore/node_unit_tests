import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User",() => {


  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to authenticate user", async () => {
    const user = await createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"})

    const authenticateUser = await authenticateUserUseCase.execute({email: user.email, password: "qwe123"})

    expect(authenticateUser).toHaveProperty("token")

  })

  it("Should not be able to authenticate with incorrect password", async () => {
    const user = await createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"})

    await expect(authenticateUserUseCase.execute({email: user.email, password: "incorrect-password"})).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate with incorrect email", async () => {
    await expect( authenticateUserUseCase.execute({email: "incorrect-email", password: "qwe123"})).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
