import { env } from '@utils';

export function getTransactionVoucherUrl(
  transactionId: string,
  version: string = 'v1',
) {
  return `${env.BACKEND_BASE_URL}:${env.BACKEND_PORT}/${version}/transaction/voucher/${transactionId}`
    .replace(/(:)(\/{2,})/g, '$1//')
    .replace(/:{2,}/g, ':')
    .replace(/\/{3,}/g, '//');
}
