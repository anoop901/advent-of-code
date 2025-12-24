import loadInputLines from "../../util/loadInputLines";
import {
  deduceFieldOrder,
  getTicketScanningErrorRate,
  productOfDepartureFields,
} from "./day16";
import { parseFieldsAndTickets } from "./parsing";

async function loadFieldsAndTickets() {
  const lines = await loadInputLines();
  return parseFieldsAndTickets(lines);
}

(async () => {
  const { fields, myTicket, nearbyTickets } = await loadFieldsAndTickets();
  const answer1 = getTicketScanningErrorRate(fields, nearbyTickets);
  const answer2 = productOfDepartureFields(
    myTicket,
    deduceFieldOrder(fields, nearbyTickets)
  );
  console.log(answer1, answer2);
})();
