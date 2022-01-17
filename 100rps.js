import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const request = new Counter('http_reqs');

export const options = {
  vus: 100,
  duration: '60s',
}

const url = 'http://localhost:3333/qa/questions?product_id=40344';

export default function() {
  const res = http.get(url);
  sleep(1);
  check(res, {
    'is status 200': r => r.status === 200,
    'trans time < 200ms': r => r.timings.duration < 200,
    'trans time < 250ms': r => r.timings.duration < 250,
    'trans time < 275ms': r => r.timings.duration < 275,
    'trans time < 500ms': r => r.timings.duration < 500,
    'trans time < 1000ms': r => r.timings.duration < 1000,
    'trans time < 2000ms': r => r.timings.duration < 2000,
  });
}