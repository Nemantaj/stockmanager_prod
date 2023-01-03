import { useState } from "react";
import { Table, Card, Text, Button, Input, Badge } from "@nextui-org/react";
import { TbSearch, TbList, TbSortAscending } from "react-icons/tb";

const columns = [
    { key: "type", label: "Type" },
    { key: "name", label: "Product Name" },
    { key: "variant", label: "Variant" },
    { key: "totalOrders", label: "Total Orders" },
    { key: "totalQuantity", label: "Total Quantity" },
    { key: "totalValue", label: "Total Value" },
];

const ProductTable = (props) => {
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
                            let colors;
                            if (doc.type === "iPhone") {
                                colors =
                                    "$pink800"
                            } else if (doc.type === "Watch") {
                                colors =
                                    "$cyan800"

                            } else {
                                colors =
                                    "$yellow800"
                            }
                            return (
                                <Table.Row
                                    key={doc.id + doc.variant}
                                    css={{
                                        fontSize: "13px",
                                        bgColor: colors,
                                        color: "#fff",
                                        fontWeight: 600
                                    }}
                                >
                                    <Table.Cell>{doc.type}</Table.Cell>
                                    <Table.Cell>{doc.name}</Table.Cell>
                                    <Table.Cell>{doc.variant}</Table.Cell>
                                    <Table.Cell>{doc.totalOrders}</Table.Cell>
                                    <Table.Cell>{doc.totalQuantity}</Table.Cell>
                                    <Table.Cell>{doc.totalValue}</Table.Cell>
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
}

export default ProductTable;