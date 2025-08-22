import http from "k6/http";
import { check } from "k6";

export let options = {
  scenarios: {
    nginx: {
      executor: "per-vu-iterations",
      vus: 200,
      iterations: 1000,
      exec: "testNginx",
      startTime: "0s",
    },
  },
};

export function testNginx() {
  let res = http.get("http://localhost:3001/hello");
  check(res, {
    "NGINX: status 200": (r) => r.status === 200,
  });
}
