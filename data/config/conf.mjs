import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
    throw result.error;
}
const envs = result.parsed;
export default envs;