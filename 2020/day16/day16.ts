import chain from "../../util/chain";
import { anyMatch, filter, map, sum, toArray } from "../../util/iterables";

export interface Range {
  min: number;
  max: number;
}

export interface Field {
  name: string;
  validRanges: Range[];
}

export type TicketWithoutFieldNames = number[];

export function getTicketScanningErrorRate(
  fields: Field[],
  tickets: TicketWithoutFieldNames[]
): number {
  return chain(tickets)
    .then(map((ticket) => invalidValuesOnTicket(ticket, fields)))
    .then(map(sum))
    .then(sum)
    .end();
}

function isNumberInRange(n: number, range: Range) {
  return range.min <= n && n <= range.max;
}

function isNumberValidForField(n: number, field: Field) {
  return chain(field.validRanges)
    .then(anyMatch((range) => isNumberInRange(n, range)))
    .end();
}

function invalidValuesOnTicket(
  ticket: TicketWithoutFieldNames,
  fields: Field[]
) {
  return chain(ticket)
    .then(
      filter(
        (value) =>
          !anyMatch<Field>((field) => isNumberValidForField(value, field))(
            fields
          )
      )
    )
    .then(toArray)
    .end();
}

function isTicketValid(ticket: TicketWithoutFieldNames, fields: Field[]) {
  return invalidValuesOnTicket(ticket, fields).length != 0;
}

export default function deduceFieldOrder(
  fields: Field[],
  tickets: TicketWithoutFieldNames[]
) {
  throw new Error("no impl");
}
