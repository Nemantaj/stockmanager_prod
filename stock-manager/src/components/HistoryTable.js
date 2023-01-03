import { useState } from "react";
import { Table, Card, Text, Button, Input, Badge } from "@nextui-org/react";
import { TbSearch, TbList, TbSortAscending } from "react-icons/tb";

const columns = [
  { key: "date", label: "Date" },
  { key: "name", label: "Name" },
  { key: "desc", label: "Desc" },
  { key: "qty", label: "Quantity" },
];

const HistoryTable = (props) => {
  const [row, setRow] = useState(10);

  return (
    <Card variant="bordered" className="cardShadow">
      <Card.Header
        css={{
          display: "inline-flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <Input
          aria-label="Set Row"
          contentLeft={<TbList />}
          type="number"
          bordered
          css={{ w: "100px" }}
          size="sm"
          value={row}
          onChange={(event) => setRow(event.target.value)}
        />
        <Input
          aria-label="Search"
          contentLeft={<TbSearch />}
          type="text"
          placeholder="Search..."
          bordered
          size="sm"
          value={props.value}
          onChange={(event) => props.setValue(event.target.value)}
          clearable
        />
      </Card.Header>
      <Card.Divider />
      <Card.Body css={{ p: 0 }}>
        <Table aria-label="Customers List" compact sticked shadow={false}>
          <Table.Header>
            {columns.map((column) => {
              return (
                <Table.Column key={column.key} css={{ color: "black" }}>
                  <div className="tableColumn">
                    {column.label}&nbsp;&nbsp;&nbsp;
                    {column.key !== "qty" && (
                      <Button
                        auto
                        light
                        size="xs"
                        onClick={() =>
                          props.sortFunction(column.key, !props.asc)
                        }
                      >
                        <TbSortAscending />
                      </Button>
                    )}
                  </div>
                </Table.Column>
              );
            })}
          </Table.Header>
          <Table.Body css={{ textAlign: "start", fontWeight: 500 }}>
            {props.list.map((doc) => {
              const color = doc.add ? "$green50" : "$red50";
              const fontColor = doc.add ? "$green900" : "$red900";
              return (
                <Table.Row
                  key={doc._id}
                  css={{
                    fontSize: "14px",
                    bgColor: color,
                    color: fontColor,
                    borderRadius: "12px",
                  }}
                >
                  <Table.Cell>{doc.dateAdded.slice(0, 10)}</Table.Cell>
                  <Table.Cell>{doc.name}</Table.Cell>
                  <Table.Cell>{doc.desc}</Table.Cell>
                  {doc.add ? (
                    <Table.Cell>
                      <Badge color="success" css={{ w: "50px" }} size="sm">
                        +{doc.add}
                      </Badge>
                    </Table.Cell>
                  ) : (
                    <Table.Cell>
                      <Badge color="error" css={{ w: "50px" }} size="sm">
                        {doc.sub}
                      </Badge>
                    </Table.Cell>
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
          <Table.Pagination
            size="sm"
            color="error"
            shadow
            align="center"
            rowsPerPage={row}
          />
        </Table>
      </Card.Body>
    </Card>
  );
};

export default HistoryTable;
