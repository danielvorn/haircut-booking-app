import request from "supertest";
import { app } from "../src/index";

describe("Authentication and Authorization", () => {
  it("should redirect unauthenticated users to the login page", async () => {
    const res = await request(app).get("/protected");
  });
});
