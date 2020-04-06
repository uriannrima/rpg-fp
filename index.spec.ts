import { setAge, WithAge, halveNumber, getHalvedAge, halveAge } from "./index";
import { expect } from "chai";
import "mocha";

describe("Pure Functions Testing", () => {
  describe("setAge", () => {
    it("should set age of a object", () => {
      const p: WithAge = {
        age: 0,
      };

      const newAge = 18;

      const n = setAge(newAge)(p);

      expect(n.age).to.equal(newAge);
    });
  });

  describe("halveNumber", () => {
    it("should halve a number", () => {
      expect(halveNumber(10)).to.equal(5);
    });
  });

  describe("getHalvedAge", () => {
    it("should get the halved age of a object", () => {
      const p: WithAge = {
        age: 10,
      };

      expect(getHalvedAge(p)).to.equal(5);
    });
  });

  describe("halveAge", () => {
    it("should halve the age of a object", () => {
      const p: WithAge = {
        age: 10,
      };

      const n = halveAge(p);

      expect(n.age).to.equal(5);
    });
  });
});
