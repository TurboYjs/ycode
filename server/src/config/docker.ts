import { DockerOptions } from 'dockerode';

const config: DockerOptions = {
  // host: '127.0.0.1',
  // port: '2375',
  // protocol: 'http',
  socketPath: '/var/run/docker.sock'
};

export default config;
