import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

import { CreateUserUseCase } from "./CreateUserUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"})

    expect(user).toHaveProperty("id")
  })

  it("Should not be able to create user use a same email", async () => {
    const user1 = await createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"})


    await expect(createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"})).rejects.toBeInstanceOf(CreateUserError)

  })
})
