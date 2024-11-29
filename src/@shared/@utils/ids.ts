import { v4 } from 'uuid';
import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 10 });

export function uuid(version: 'v1' | 'v2' | 'v3' | 'v4') {
  switch (version) {
    case 'v1':
      throw new Error('method not implemented');
    case 'v2':
      throw new Error('method not implemented');
    case 'v3':
      throw new Error('method not implemented');
    case 'v4':
      return v4();
  }
}

export function shortId(type: 'shortOnly' | 'timestamp', size: number = 15) {
  switch (type) {
    case 'shortOnly':
      return uid.rnd(size);
    case 'timestamp':
      return uid.stamp(size);
  }
}
