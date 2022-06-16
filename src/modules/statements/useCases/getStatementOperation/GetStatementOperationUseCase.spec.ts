import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase
let getStatementOperation: GetStatementOperationUseCase

describe("Get Statement Operation", () => {

  beforeEach(() =>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
    getStatementOperation = new GetStatementOperationUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
  })

  it("Should be able to get statement operation of user",async () => {
    const user = await createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"});

    const statement = await createStatementUseCase.execute({amount: 100, description:"Test", type: OperationType.DEPOSIT, user_id: user.id});

    const operation = await getStatementOperation.execute({user_id: user.id, statement_id: statement.id});

    expect(statement).toBe(operation)
  })

  it("Should not be able to get statement if non-existing-user", async () => {

    await expect(getStatementOperation.execute({user_id: "non-existing-user", statement_id:"non-existing-operation"})).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it("Should not be able to get statement if non-existing-operation", async () => {
    const user = await createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"});

    await expect(getStatementOperation.execute({user_id: user.id, statement_id:"non-existing-operation"})).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

  })
})
