export enum KEY_OF_INJECTION {
  USER_REPOSITORY = 'USER_REPOSITORY',
  ACCOUNT_REPOSITORY = 'ACCOUNT_REPOSITORY',
  TRANSACTION_REPOSITORY = 'TRANSACTION_REPOSITORY',

  EMAIL_QUEUE = 'EMAIL_QUEUE',
}
export enum JOB {
  SIGNUP_EMAIL_JOB = 'SIGNUP_EMAIL_JOB',
  TRANSACTION_EMAIL_JOB = 'TRANSACTION_EMAIL_JOB',
}

export enum ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum ACCOUNT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum TypeOfTransaction {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
