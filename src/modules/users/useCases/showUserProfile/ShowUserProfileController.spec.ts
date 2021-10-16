import request from "supertest"
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Show User Profile", () => {
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


  it("should be able to show an user profile", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "oktest@email.com",
      password: "1234"
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/profile").set({Authorization: `Bearer ${token}`})

    expect(response.status).toBe(200);
  });
});
