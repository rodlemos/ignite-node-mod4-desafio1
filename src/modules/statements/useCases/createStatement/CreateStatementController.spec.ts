import request from "supertest";
import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app).post("/api/v1/users").send({
      name: "test",
      email: "oktest@email.com",
      password: "1234"
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "oktest@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const responseDeposit = await request(app).post("/api/v1/statements/deposit")
      .send({
        amount: 90,
	      description: "My deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

     const responseWithdraw = await request(app).post("/api/v1/statements/withdraw")
      .send({
        amount: 90,
	      description: "My withdraw"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

      expect(responseDeposit.statusCode).toBe(201);
      expect(responseWithdraw.statusCode).toBe(201);
  })
})
