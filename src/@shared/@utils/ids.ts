import { v4 } from 'uuid';
import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 10 });

export const idGenerator = {
  uuid_v4: v4(),
  shortOly: uid.rnd(),
  shortStamp: uid.stamp(32),
};
