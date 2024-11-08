const { schemas } = require('../utils/validation');
const createResourceRouter = require('../utils/createResourceRouter');

const router = createResourceRouter('agents', schemas.agent);

module.exports = router;
