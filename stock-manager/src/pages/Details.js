import { Card, Text, Input, Button, Divider, Badge } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { TbArrowBackUp, TbFileExport } from "react-icons/tb";
import * as Xlsx from "xlsx";

const MotionButton = motion(Button);

const Details = () => {
  const { state } = useLocation();
  const orderData = state?.doc || {};

  const downloadExcel = () => {
    const data = orderData.orders
      .map((doc) => {
        return doc.products1.map((subDoc) => {
          return {
            Date: doc.order_date.slice(0, 10),
            Product: subDoc.name,
            Details: subDoc.details,
            Desc: subDoc.desc,
            Ctpin: subDoc.ctpin,
            Price: subDoc.price,
            Qty: subDoc.quantity,
            PaymentType: doc.payment_type,
            Customer: doc.customer[0].name,
            Mobile: doc.customer[0].mobile,
            BillName: doc.billName,
            BillNo: doc.billno,
          };
        });
      })
      .flat();
    const data2 = [
      {
        Card: orderData.card,
        Cash: orderData.cash,
        Online: orderData.online,
        Cashfree: orderData.cashfree,
        Other: orderData.other,
        Products: orderData.products,
        Total: orderData.total,
      },
    ];
    const workSheet = Xlsx.utils.json_to_sheet(data);
    const workBook = Xlsx.utils.book_new();
    const ws2 = Xlsx.utils.json_to_sheet(data2);
    Xlsx.utils.book_append_sheet(workBook, workSheet, "Orders");
    Xlsx.utils.book_append_sheet(workBook, ws2, "Total");
    Xlsx.writeFile(workBook, `${orderData._id}-single-day.xlsx`);
  };

  return (
    <motion.div>
      <motion.div className="header">
        <Link to={-1} className="headerLink">
          <TbArrowBackUp className="icoAdjust" />
        </Link>
        <Text b>{orderData._id}</Text>
        <div className="headerLink headerLinkAddon">
          <Button
            size="sm"
            icon={<TbFileExport />}
            onClick={downloadExcel}
            auto
            color="error"
          />
        </div>
      </motion.div>
      <motion.div
        className="qtyContainer alignDivCenter"
        // initial={{ x: "100%" }}
        // animate={{ x: 0 }}
        // transition={{ type: "spring" }}
      >
        <Card variant="bordered" css={{ mw: "550px" }}>
          <Card.Header
            css={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            <div className="detailsText">
              <Text size="14px">Cash</Text>
              <Text size="14px">&#8377;&nbsp;{orderData.cash}</Text>
            </div>
            <Divider />
            <div className="detailsText">
              <Text size="14px">Online</Text>
              <Text size="14px">&#8377;&nbsp;{orderData.online}</Text>
            </div>
            <Divider />
            <div className="detailsText">
              <Text size="14px">Card</Text>
              <Text size="14px">&#8377;&nbsp;{orderData.card}</Text>
            </div>
            <Divider />
            <div className="detailsText">
              <Text size="14px">Cashfree</Text>
              <Text size="14px">&#8377;&nbsp;{orderData.cashfree}</Text>
            </div>
            <Divider />
            <div className="detailsText">
              <Text size="14px">Other</Text>
              <Text size="14px">&#8377;&nbsp;{orderData.other}</Text>
            </div>
            <Divider />
            <div className="detailsText">
              <Text b size="14px">
                Total
              </Text>
              <Text b size="14px">
                &#8377;&nbsp;{orderData.total}
              </Text>
            </div>
          </Card.Header>
          <Card.Divider />
          <Card.Body
            css={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Text
              css={{
                br: "12px",
                bgColor: "$pink50",
                px: "10px",
                w: "fit-content",
              }}
              color="$pink800"
              b
            >
              Products
            </Text>
            <motion.div className="productDiv">
              {orderData.orders.length > 0 &&
                orderData.orders.map((mainDoc) => {
                  return mainDoc.products1.map((doc) => {
                    return (
                      <Card
                        variant="bordered"
                        css={{
                          py: "5px",
                          px: "10px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          minHeight: "100px",
                        }}
                        key={doc._id}
                      >
                        <div>
                          <Text size="14px" b>
                            {doc.name}
                          </Text>
                          <Text size="12px">
                            Payment: {mainDoc.payment_type}
                          </Text>
                          <Text size="12px">Type: {doc.desc}</Text>
                          <Text size="12px">Ctpin: {doc.ctpin}</Text>
                        </div>
                        <div className="prodBadge">
                          <Badge>{doc.quantity}</Badge>
                          <Text b size="14px">
                            &#8377;{doc.price}
                          </Text>
                        </div>
                      </Card>
                    );
                  });
                })}
            </motion.div>
          </Card.Body>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Details;
