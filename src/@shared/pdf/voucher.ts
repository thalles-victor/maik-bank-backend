import { env } from '@utils';

export function getTransactionVoucherUrl(transactionId: string) {
  return `${env.BACKEND_BASE_URL}/${env.BACKEND_PORT}/transactions/voucher/${transactionId}`;
}
