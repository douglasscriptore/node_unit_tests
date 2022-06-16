import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;


describe("Get Balance", () => {

  beforeEach(() =>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository)
  })

  it("Should be able to get balance of user",async () => {
    const { id: user_id } = await createUserUseCase.execute({email:"test@test.com", name: "Test User", password:"qwe123"});
    await createStatementUseCase.execute({amount: 100, description:"Test", type: OperationType.DEPOSIT, user_id});

    const balance = await getBalanceUseCase.execute({user_id })

    expect(balance.balance).toEqual(100)
  })

  it("Should not be able to get a balance of non-exiting-user", async() => {
    await expect(getBalanceUseCase.execute({user_id: "non-exiting-user"})).rejects.toBeInstanceOf(GetBalanceError)
  })

})
