import { Loading, Table } from "@nextui-org/react";
import { Fragment, useEffect, useState } from "react";
import { Text, Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TbArrowBackUp, TbFileExport, TbTag } from "react-icons/tb";
import ProductTable from "../components/ProductTable";
import * as Xlsx from "xlsx";
import { useSelector } from "react-redux";

const ProductsReport = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.invtry.token);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(false);
  const dateGte = searchParams.get("gte");
  const dateLte = searchParams.get("lte");

  const [currentList, setCurrentList] = useState([]);
  const [currentListAdj, setCurrentListAdj] = useState([]);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentSort, setCurrentSort] = useState({
    field: "totalOrders",
    asc: false,
  });
  const changeCurrentSort = (field, asc) => {
    setCurrentSort({ field: field, asc: asc });
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/get-products-by-date?gte=${dateGte}&lte=${dateLte}`, {
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
        setCurrentList(data);
        setCurrentListAdj(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const downloadExcel = () => {
    setExportLoading(true);
    let data = currentList
      .map((doc) => {
        return {
          Type: doc.type,
          Product_Name: doc.name,
          Variant: doc.variant,
          Total_Orders: doc.totalOrders,
          Total_Quantity: doc.totalQuantity,
          Total_Value: doc.totalValue,
        };
      })
      .sort((a, b) => {
        let fa = a.Product_Name.toLowerCase();

        let fb = b.Product_Name.toLowerCase();

        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });

    const workSheet = Xlsx.utils.json_to_sheet(data);
    const workBook = Xlsx.utils.book_new();
    Xlsx.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    Xlsx.writeFile(workBook, `${dateGte}-${dateLte}-all-products.xlsx`);
    setExportLoading(false);
  };

  //Sorting Logic
  useEffect(() => {
    if (currentList.length > 0) {
      const listCopy = [...currentList];
      let sortCurrent;

      if (
        currentSort.field === "name" ||
        currentSort.field === "variant" ||
        currentSort.field === "type"
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
        currentSort.field === "totalOrders" ||
        currentSort.field === "totalQuantity" ||
        currentSort.field === "totalValue"
      ) {
        sortCurrent = listCopy.sort((a, b) => {
          return a[currentSort.field] - b[currentSort.field];
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
          return regex.test(doc.name) || regex.test(doc.variant);
        });
        setCurrentListAdj(filteredList);
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [currentSearch]);

  return (
    <motion.div>
      <motion.div className="header">
        <Link to={-1} className="headerLink">
          <TbArrowBackUp className="icoAdjust" />
        </Link>
        <Text b>Products Report</Text>
        <div className="headerLink headerLinkAddon">
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
            <ProductTable
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

export default ProductsReport;
