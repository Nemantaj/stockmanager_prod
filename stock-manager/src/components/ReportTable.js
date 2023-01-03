import { useState } from "react";
import { Table, Card, Text, Button, Input, Badge } from "@nextui-org/react";
import { TbSearch, TbList, TbSortAscending } from "react-icons/tb";

const columns = [
  { key: "order_date", label: "Date" },
  { key: "name", label: "Name" },
  { key: "desc", label: "Desc" },
  { key: "quantity", label: "Quantity" },
  { key: "billName", label: "BillName" },
  { key: "billno", label: "BillNo." },
  { key: "price", label: "Price" },
  { key: "ctpin", label: "Ctpin" },
  { key: "payment_type", label: "Payment" },
];

const ReportTable = (props) => {
  const [row, setRow] = useState(20);

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
                    {column.key !== "ctpin" && (
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
          <Table.Body css={{ textAlign: "start" }}>
            {props.list.map((doc) => {
              return (
                <Table.Row
                  key={doc._id}
                  css={{
                    fontSize: "13px",
                  }}
                >
                  <Table.Cell>{doc.order_date.slice(0, 10)}</Table.Cell>
                  <Table.Cell>{doc.name}</Table.Cell>
                  <Table.Cell>{doc.desc}</Table.Cell>
                  <Table.Cell>{doc.quantity}</Table.Cell>
                  <Table.Cell>{doc.billName}</Table.Cell>
                  <Table.Cell>{doc.billno}</Table.Cell>
                  <Table.Cell>{doc.price}</Table.Cell>
                  <Table.Cell>{doc.ctpin}</Table.Cell>
                  <Table.Cell>{doc.payment_type}</Table.Cell>
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

export default ReportTable;
