import { Loading, Table } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";
import { Text, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TbArrowBackUp, TbFileExport, TbTag } from "react-icons/tb";
import ReportTable from "../components/ReportTable";
import * as Xlsx from "xlsx";
import { useSelector } from "react-redux";

const TableReport = () => {
  const token = useSelector((state) => state.invtry.token);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(false);
  const dateGte = searchParams.get("gte");
  const dateLte = searchParams.get("lte");

  const [currentList, setCurrentList] = useState([]);
  const [currentListAdj, setCurrentListAdj] = useState([]);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentSort, setCurrentSort] = useState({
    field: "dateAdded",
    asc: false,
  });
  const changeCurrentSort = (field, asc) => {
    setCurrentSort({ field: field, asc: asc });
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/get-orders?gte=${dateGte}&lte=${dateLte}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          setError(true);
        }
        return res.json();
      })
      .then((data) => {
        const newData = data
          .map((doc) => {
            return doc.products1.map((docSub) => {
              return {
                ...docSub,
                billName: doc.billName,
                billno: doc.billno,
                customer: doc.customer,
                isPaid: doc.isPaid,
                order_date: doc.order_date,
                payment_type: doc.payment_type,
                advance: doc.advance,
                discount: doc.discount,
                total: doc.total,
                total_paid: doc.total_paid,
              };
            });
          })
          .flat();
        setCurrentList(newData);
        setCurrentListAdj(newData);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, []);

  //Sorting Logic
  useEffect(() => {
    if (currentList.length > 0) {
      const listCopy = [...currentList];
      let sortCurrent;

      if (
        currentSort.field === "name" ||
        currentSort.field === "desc" ||
        currentSort.field === "billName" ||
        currentSort.field === "payment_type"
      ) {
        sortCurrent = listCopy.sort((a, b) => {
          let fa = a[currentSort.field]
            ? a[currentSort.field].toLowerCase()
            : "";
          let fb = b[currentSort.field]
            ? b[currentSort.field].toLowerCase()
            : "";
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
      } else if (
        currentSort.field === "price" ||
        currentSort.field === "quantity" ||
        currentSort.field === "billno"
      ) {
        sortCurrent = listCopy.sort((a, b) => {
          return a[currentSort.field] - b[currentSort.field];
        });
      } else {
        sortCurrent = listCopy.sort((a, b) => {
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        });
      }

      setCurrentList(sortCurrent);
      setCurrentListAdj(currentSort.asc ? sortCurrent : sortCurrent.reverse());
    }
  }, [currentSort]);

  //   Search Logic
  useEffect(() => {
    if (currentSearch === "" && currentSearch.length > 0) {
      return currentListAdj(currentList);
    }

    if (currentList.length > 0) {
      const timeoutId = setTimeout(() => {
        const regex = new RegExp(currentSearch, "i");
        const allList = [...currentList];
        const filteredList = allList.filter((doc) => {
          return (
            regex.test(doc.order_date) ||
            regex.test(doc.name) ||
            regex.test(doc.desc) ||
            regex.test(doc.billName) ||
            regex.test(doc.billno) ||
            regex.test(doc.ctpin)
          );
        });
        setCurrentListAdj(filteredList);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [currentSearch]);

  const downloadExcel = () => {
    setExportLoading(true);
    const data = currentList.map((doc) => {
      return {
        Date: doc.order_date.slice(0, 10),
        Name: doc.name,
        Desc: doc.desc,
        Qty: doc.quantity,
        Ctpin: doc.ctpin,
        Amount: doc.price,
        Payment: doc.payment_type,
      };
    });
    const workSheet = Xlsx.utils.json_to_sheet(data);
    const workBook = Xlsx.utils.book_new();
    Xlsx.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    Xlsx.writeFile(workBook, `${dateGte}-${dateLte}-all-detailed.xlsx`);
    setExportLoading(false);
  };

  const downloadVouchers = () => {
    setVoucherLoading(true);
    fetch(`/get-vouchers-by-date?gte=${dateGte}&lte=${dateLte}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("An error occured while retrieving vouchers data!");
        }
        return res.json();
      })
      .then((data) => {
        const workSheet = Xlsx.utils.json_to_sheet(data);
        const workBook = Xlsx.utils.book_new();
        Xlsx.utils.book_append_sheet(workBook, workSheet, "Sheet1");
        Xlsx.writeFile(workBook, `${dateGte}-${dateLte}-all-vouchers.xlsx`);
        setVoucherLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setVoucherLoading(false);
      });
  };

  return (
    <motion.div>
      <motion.div className="header">
        <Link to={-1} className="headerLink">
          <TbArrowBackUp className="icoAdjust" />
        </Link>
        <Text b>Table Report</Text>
        <div className="headerLink headerLinkAddon">
          <Button
            auto
            size="sm"
            color="primary"
            icon={
              voucherLoading ? (
                <Loading type="spinner" color="white" />
              ) : (
                <TbTag />
              )
            }
            onClick={downloadVouchers}
          />
          <Button
            auto
            size="sm"
            color="error"
            icon={
              exportLoading ? (
                <Loading type="spinner" color="white" />
              ) : (
                <TbFileExport />
              )
            }
            onClick={downloadExcel}
          />
        </div>
      </motion.div>
      <motion.div className="tableDiv alignDivCenter">
        {loading ? (
          <Loading type="spinner" />
        ) : (
          <Fragment>
            {error && (
              <Text
                color="error"
                css={{
                  br: "12px",
                  bgColor: "$red50",
                  py: "5px",
                  px: "10px",
                  my: "10px",
                }}
              >
                An error occured while trying to retrieve data from the server!
              </Text>
            )}
            <ReportTable
              list={currentListAdj}
              sortFunction={changeCurrentSort}
              asc={currentSort.asc}
              setValue={setCurrentSearch}
              value={currentSearch}
            />
          </Fragment>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TableReport;
