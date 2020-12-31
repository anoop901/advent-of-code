import * as ReactDOM from "react-dom";
import * as React from "react";
import {
  Field,
  findPossibleFieldNamesForFieldIndex,
  simplifyPossibilities,
  simplifyPossibilitiesFull,
  TicketWithoutFieldNames,
} from "../day16";
import { useRef, useState } from "react";
import { parseFieldsAndTickets } from "../parsing";
import {
  tableSumCellStyle,
  tableStyle,
  tableCellStyle,
  tableHeaderCellStyle,
  tableImpossibleCellStyle,
  tablePossibleCellStyle,
  tableConfirmedCellStyle,
} from "./styles";

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);

function App() {
  const initialFields = [
    {
      name: "class",
      validRanges: [
        { min: 0, max: 1 },
        { min: 4, max: 19 },
      ],
    },
    {
      name: "row",
      validRanges: [
        { min: 0, max: 5 },
        { min: 8, max: 19 },
      ],
    },
    {
      name: "seat",
      validRanges: [
        { min: 0, max: 13 },
        { min: 16, max: 19 },
      ],
    },
  ];
  const initialTickets = [
    [3, 9, 18],
    [15, 1, 5],
    [5, 14, 9],
  ];

  function findPossibleFieldNamesForFieldIndexes(
    fields: Field[],
    tickets: TicketWithoutFieldNames[]
  ) {
    return fields.map((_, i) =>
      findPossibleFieldNamesForFieldIndex(i, fields, tickets)
    );
  }

  const [state, setState] = useState<{
    fields: Field[];
    possibleFieldNamesForFieldIndexes: Set<string>[];
    enableSimplifyButton: boolean;
  }>({
    fields: initialFields,
    possibleFieldNamesForFieldIndexes: findPossibleFieldNamesForFieldIndexes(
      initialFields,
      initialTickets
    ),
    enableSimplifyButton: true,
  });
  return (
    <>
      <h1>Choose input file</h1>
      <InputFileChooser
        setData={(fields, tickets) => {
          setState({
            fields,
            possibleFieldNamesForFieldIndexes: findPossibleFieldNamesForFieldIndexes(
              fields,
              tickets
            ),
            enableSimplifyButton: true,
          });
        }}
      />
      <h1>Possibilities table</h1>
      <Visualization
        possibleNamesForFieldIndexes={state.possibleFieldNamesForFieldIndexes}
        fields={state.fields}
      />
      <p>
        <button
          disabled={!state.enableSimplifyButton}
          onClick={() => {
            const { value, modified } = simplifyPossibilities(
              state.possibleFieldNamesForFieldIndexes
            );
            setState({
              ...state,
              possibleFieldNamesForFieldIndexes: value,
              enableSimplifyButton: modified,
            });
          }}
        >
          Simplify
        </button>
      </p>
      <p>
        <button
          disabled={!state.enableSimplifyButton}
          onClick={() => {
            const value = simplifyPossibilitiesFull(
              state.possibleFieldNamesForFieldIndexes
            );
            setState({
              ...state,
              possibleFieldNamesForFieldIndexes: value,
              enableSimplifyButton: false,
            });
          }}
        >
          Fully Simplify
        </button>
      </p>
    </>
  );
}

function InputFileChooser({
  setData,
}: {
  setData: (fields: Field[], tickets: TicketWithoutFieldNames[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <input
      ref={inputRef}
      type="file"
      onChange={async () => {
        const inputElem = inputRef.current;
        if (inputElem === null) {
          return;
        }
        if (!inputElem.files || inputElem.files.length < 1) {
          return;
        }
        const lines = (await inputElem.files[0].text()).trim().split("\n");
        const { fields, myTicket, nearbyTickets } = parseFieldsAndTickets(
          lines
        );
        setData(fields, nearbyTickets);
      }}
    />
  );
}

function Visualization({
  possibleNamesForFieldIndexes,
  fields,
}: {
  possibleNamesForFieldIndexes: Set<string>[];
  fields: Field[];
}) {
  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th></th>
          {fields.map((_, i) => (
            <th key={i} style={{ ...tableCellStyle, ...tableHeaderCellStyle }}>
              {i}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {fields.map((field, i) => (
          <tr key={i}>
            <th style={{ ...tableCellStyle, ...tableHeaderCellStyle }}>
              {field.name}
            </th>
            {fields.map((_, fieldIndex) => {
              const isConfirmed =
                possibleNamesForFieldIndexes[fieldIndex].size === 1;
              const isPossible = possibleNamesForFieldIndexes[fieldIndex].has(
                field.name
              );
              return (
                <td
                  key={fieldIndex}
                  style={{
                    ...tableCellStyle,
                    ...(isPossible
                      ? isConfirmed
                        ? tableConfirmedCellStyle
                        : tablePossibleCellStyle
                      : tableImpossibleCellStyle),
                  }}
                >
                  {isPossible ? (isConfirmed ? "✓" : "?") : "✗"}
                </td>
              );
            })}
          </tr>
        ))}
        <tr>
          <th></th>
          {fields.map((_, fieldIndex) => (
            <td
              key={fieldIndex}
              style={{ ...tableCellStyle, ...tableSumCellStyle }}
            >
              {possibleNamesForFieldIndexes[fieldIndex].size}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
