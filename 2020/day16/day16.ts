import chain from "@anoop901/js-util/chain";
import anyMatch from "@anoop901/js-util/iterables/anyMatch";
import enumerate from "@anoop901/js-util/iterables/enumerate";
import filter from "@anoop901/js-util/iterables/filter";
import fold from "@anoop901/js-util/iterables/fold";
import map from "@anoop901/js-util/iterables/map";
import sum from "@anoop901/js-util/iterables/sum";
import toArray from "@anoop901/js-util/iterables/toArray";

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
  return invalidValuesOnTicket(ticket, fields).length === 0;
}

export function simplifyPossibilities(
  possibleFieldNamesForFieldIndex: Set<string>[]
): { value: Set<string>[]; modified: boolean } {
  const result = possibleFieldNamesForFieldIndex.map(
    (possibilities) => new Set(possibilities)
  );
  const confirmedFieldIndexes = chain(result)
    .then(enumerate)
    .then(filter(({ value: possibilities }) => possibilities.size === 1))
    .then(map(({ index }) => index))
    .then(toArray)
    .end();

  let modified = false;
  for (const fieldIndex of confirmedFieldIndexes) {
    const possibilities = possibleFieldNamesForFieldIndex[fieldIndex];
    const fieldName = toArray(possibilities)[0];
    for (const {
      value: otherPossibilities,
      index: otherFieldIndex,
    } of enumerate(result)) {
      if (otherFieldIndex !== fieldIndex && otherPossibilities.has(fieldName)) {
        otherPossibilities.delete(fieldName);
        modified = true;
      }
    }
  }

  return { value: result, modified };
}

export function simplifyPossibilitiesFull(
  possibleFieldNamesForFieldIndex: Set<string>[]
): Set<string>[] {
  let current = possibleFieldNamesForFieldIndex;
  let modified = true;
  while (modified) {
    ({ modified, value: current } = simplifyPossibilities(current));
  }
  return current;
}

export function findPossibleFieldNamesForFieldIndex(
  fieldIndex: number,
  fields: Field[],
  tickets: TicketWithoutFieldNames[]
): Set<string> {
  const fieldsByName = new Map<string, Field>();
  for (const field of fields) {
    fieldsByName.set(field.name, field);
  }

  const possibleFieldNames = new Set(fieldsByName.keys());
  for (const value of chain(tickets)
    .then(filter((ticket) => isTicketValid(ticket, fields)))
    .then(map((ticket) => ticket[fieldIndex]))
    .end()) {
    for (const [fieldName, field] of fieldsByName.entries()) {
      if (
        possibleFieldNames.has(fieldName) &&
        !isNumberValidForField(value, field)
      ) {
        possibleFieldNames.delete(fieldName);
      }
    }
  }

  return possibleFieldNames;
}

function findPossibleFieldNamesForFieldIndexes(
  fields: Field[],
  tickets: TicketWithoutFieldNames[]
) {
  return fields.map((_, i) =>
    findPossibleFieldNamesForFieldIndex(i, fields, tickets)
  );
}

export function deduceFieldOrder(
  fields: Field[],
  tickets: TicketWithoutFieldNames[]
): string[] {
  const possibleFieldNamesForFieldIndexes = findPossibleFieldNamesForFieldIndexes(
    fields,
    tickets
  );

  return chain(possibleFieldNamesForFieldIndexes)
    .then(simplifyPossibilitiesFull)
    .then(
      map((possibleFieldNames) => {
        if (possibleFieldNames.size !== 1) {
          throw new Error("could not deduce field order");
        }
        return toArray(possibleFieldNames)[0];
      })
    )
    .then(toArray)
    .end();
}

export function productOfDepartureFields(
  ticket: TicketWithoutFieldNames,
  fieldOrder: string[]
): number {
  return chain(fieldOrder)
    .then(enumerate)
    .then(filter(({ value: fieldName }) => fieldName.startsWith("departure")))
    .then(map(({ index }) => ticket[index]))
    .then(fold(1, (a, b) => a * b))
    .end();
}
