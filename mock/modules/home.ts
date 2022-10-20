import Mock from 'mockjs';
import { success } from '../status';

export default {
  'POST /test': (req, res) => {
    const data = Mock?.mock({
      content: {
        id: 1,
        name: 'test',
      },
      count: 100,
    });
    res?.send(success({ data }));
  },
};
