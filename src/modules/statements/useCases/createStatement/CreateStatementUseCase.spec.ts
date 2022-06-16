import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";



let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement Operation", () => {

  beforeEach(() =>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
  })

  it("Should be able to create statement of user", async () => {
    const user = await createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"});

    const statement = await createStatementUseCase.execute({amount: 100, description:"Test", type: OperationType.DEPOSIT, user_id: user.id});

    expect(statement).toHaveProperty("id")
  })

  it("Should not be able to create statement if non-existing-user", async () => {
    await expect(createStatementUseCase.execute({amount: 200, description: "not have founds", type: OperationType.WITHDRAW, user_id: "non-existing-user"})).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);

  })

  it("Should not be able to withdraw when not have balance", async() => {
    const user = await createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"});

    await createStatementUseCase.execute({amount: 100, description:"Test", type: OperationType.DEPOSIT, user_id: user.id});

    await expect(createStatementUseCase.execute({amount: 200, description: "not have founds", type: OperationType.WITHDRAW, user_id: user.id})).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
})
