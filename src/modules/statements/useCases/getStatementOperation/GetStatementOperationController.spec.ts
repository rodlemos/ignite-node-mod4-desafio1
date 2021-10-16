import request from "supertest";
import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app";

let connection: Connection;

describe("Get Statement", () => {
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

  it("should be able to get a statement", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "oktest@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const statement = await request(app).post("/api/v1/statements/deposit")
      .send({
        amount: 90,
	      description: "My deposit"
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const { id } = statement.body

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({
        Authorization: `Bearer ${token}`
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body.type).toEqual("deposit");
  })
})
