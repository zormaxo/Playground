import http from "k6/http";
import { check } from "k6";

export let options = {
  scenarios: {
    yarp: {
      executor: "per-vu-iterations",
      vus: 200,
      iterations: 1000,
      exec: "testYarp",
      startTime: "0s",
    },
  },
};

export function testYarp() {
  let res = http.get("http://localhost:3000/hello");
  check(res, {
    "YARP: status 200": (r) => r.status === 200,
  });
}
