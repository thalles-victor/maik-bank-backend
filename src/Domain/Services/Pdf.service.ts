import { TransactionAggregate } from '../Aggregates/Transactions.aggregate';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { pdfFonts } from 'src/@shared/pdf/fonts';
import PdfPrinter from 'pdfmake';
import * as path from 'path';

@Injectable()
export class PdfService {
  generateTransactionPdf(transaction: TransactionAggregate) {
    const docDefinition = {
      content: [
        { text: 'Transaction Details', style: 'header' },
        { text: `ID: ${transaction.id}`, style: 'subheader' },
        { text: `Type: ${transaction.type}`, style: 'text' },
        { text: `Value: $${transaction.value.toFixed(2)}`, style: 'text' },
        {
          text: `Account Sender ID: ${transaction.accountSenderId}`,
          style: 'text',
        },
        {
          text: `Account Target ID: ${transaction.accountTargetId}`,
          style: 'text',
        },
        {
          text: `Description: ${transaction.description || 'N/A'}`,
          style: 'text',
        },
        {
          text: `Created At: ${new Date(transaction.createdAt).toLocaleString()}`,
          style: 'text',
        },
        {
          text: `Updated At: ${new Date(transaction.updatedAt).toLocaleString()}`,
          style: 'text',
        },
        { text: `Status: ${transaction.status}`, style: 'text' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 15,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        text: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
        },
      },
    };

    const printer = new PdfPrinter(pdfFonts);

    const pdfDoc = printer.createPdfKitDocument({
      content: docDefinition.content,
      defaultStyle: {
        font: 'Times',
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 15,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        text: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
        },
      },
    });

    pdfDoc.end();

    return pdfDoc;
  }
}
