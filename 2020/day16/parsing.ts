import chain from "../../util/chain";
import { drop, map, split, toArray } from "../../util/iterables";
import { Field, TicketWithoutFieldNames } from "./day16";

export function parseFieldsAndTickets(
  lines: string[]
): {
  fields: Field[];
  myTicket: TicketWithoutFieldNames;
  nearbyTickets: TicketWithoutFieldNames[];
} {
  const [fieldsSection, myTicketSection, nearbyTicketsSection] = toArray(
    split("")(lines)
  );

  function parseField(fieldString: string): Field {
    const [name, validRangesString] = fieldString.split(": ");
    const validRangeStrings = validRangesString.split(" or ");
    const validRanges = chain(validRangeStrings)
      .then(map((validRangeString) => validRangeString.split("-")))
      .then(
        map(([minString, maxString]) => ({
          min: Number(minString),
          max: Number(maxString),
        }))
      )
      .then(toArray)
      .end();
    return { name, validRanges };
  }

  const fields = fieldsSection.map(parseField);

  function parseTicket(ticketString: string): TicketWithoutFieldNames {
    return chain(ticketString)
      .then((line) => line.split(","))
      .then(map((s) => Number(s)))
      .then(toArray)
      .end();
  }

  const myTicket = parseTicket(myTicketSection[1]);

  const nearbyTickets = chain(nearbyTicketsSection)
    .then(drop(1))
    .then(map(parseTicket))
    .then(toArray)
    .end();
  return { fields, myTicket, nearbyTickets };
}
